import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { resolveRequiredHomeDir } from "../../infra/home-dir.js";
import { ErrorCodes, errorShape } from "../protocol/index.js";
import type { GatewayRequestHandlers, RespondFn } from "./types.js";

// Ensure tasks are securely stored in the openclaw home directory
const getTasksFilePath = (env: NodeJS.ProcessEnv = process.env) => {
  const home = resolveRequiredHomeDir(env, os.homedir);
  return path.join(home, ".openclaw", "tasks.json");
};

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: "Backlog" | "To Do" | "In Progress" | "Done";
  assignee?: string;
  createdAt: number;
  updatedAt: number;
}

type TasksStore = Record<string, KanbanTask>;


// ============================================================================
// Lock Queue - Prevents concurrent file writes during high UI activity
// ============================================================================

type TaskStoreLockTask = {
  fn: () => Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
};

const LOCK_QUEUE: TaskStoreLockTask[] = [];
let queueRunning = false;

async function drainLockQueue() {
  if (queueRunning) return;
  queueRunning = true;
  try {
    while (LOCK_QUEUE.length > 0) {
      const task = LOCK_QUEUE.shift();
      if (!task) continue;
      try {
        const result = await task.fn();
        task.resolve(result);
      } catch (err) {
        task.reject(err);
      }
    }
  } finally {
    queueRunning = false;
    if (LOCK_QUEUE.length > 0) {
      queueMicrotask(drainLockQueue);
    }
  }
}

async function withTasksLock<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    LOCK_QUEUE.push({
      fn: async () => await fn(),
      resolve: (value) => resolve(value as T),
      reject,
    });
    void drainLockQueue();
  });
}


// ============================================================================
// Robust File I/O (Atomic Renames & Windows Retries)
// ============================================================================

async function readTasksUnlocked(): Promise<TasksStore> {
  const filePath = getTasksFilePath();
  // Retry logic inspired by src/config/sessions/store.ts for Windows races
  let store: TasksStore = {};
  const maxReadAttempts = process.platform === "win32" ? 3 : 1;
  for (let attempt = 0; attempt < maxReadAttempts; attempt++) {
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      if (raw.length === 0 && attempt < maxReadAttempts - 1) {
        await new Promise((r) => setTimeout(r, 50));
        continue;
      }
      store = JSON.parse(raw);
      break;
    } catch (err: any) {
      if (err.code === "ENOENT") break;
      if (attempt < maxReadAttempts - 1) {
        await new Promise((r) => setTimeout(r, 50));
        continue;
      }
      // Fail explicitly if we can't parse existing data
      throw new Error(`Failed to read tasks store: ${err.message}`);
    }
  }
  return store;
}

async function saveTasksUnlocked(store: TasksStore): Promise<void> {
  const filePath = getTasksFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const raw = JSON.stringify(store, null, 2);
  const tmpPath = `${filePath}.${process.pid}.${crypto.randomUUID()}.tmp`;

  try {
    // 1. Write to temp file safely
    await fs.writeFile(tmpPath, raw, { mode: 0o600, encoding: "utf-8" });

    // 2. Atomic rename, with retries for Windows file locking
    if (process.platform === "win32") {
      for (let i = 0; i < 5; i++) {
        try {
          await fs.rename(tmpPath, filePath);
          break;
        } catch {
          if (i < 4) {
            await new Promise((r) => setTimeout(r, 50 * (i + 1)));
          } else {
            console.warn(`[tasks-store] rename failed after 5 attempts: ${filePath}`);
            throw new Error("Failed to secure file lock for save operation.");
          }
        }
      }
    } else {
      await fs.rename(tmpPath, filePath);
      await fs.chmod(filePath, 0o600).catch(() => undefined);
    }
  } finally {
    // 3. Always cleanup the temp file if it somehow leaked
    await fs.rm(tmpPath, { force: true }).catch(() => undefined);
  }
}


// ============================================================================
// Gateway Handlers
// ============================================================================

export const tasksHandlers: GatewayRequestHandlers = {
  "tasks.list": async ({ respond }) => {
    try {
      const store = await withTasksLock(readTasksUnlocked);
      const tasksArray = Object.values(store).sort((a, b) => b.createdAt - a.createdAt);
      respond(true, { ok: true, tasks: tasksArray }, undefined);
    } catch (err: any) {
      respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, err.message));
    }
  },

  "tasks.create": async ({ params, respond }) => {
    try {
      const p = params as any;
      if (!p.title || typeof p.title !== "string") {
        return respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "title required"));
      }

      const newTask: KanbanTask = {
        id: "task_" + crypto.randomBytes(4).toString("hex") + Date.now().toString(36),
        title: p.title,
        description: p.description || "",
        status: p.status || "To Do",
        assignee: p.assignee,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await withTasksLock(async () => {
        const store = await readTasksUnlocked();
        store[newTask.id] = newTask;
        await saveTasksUnlocked(store);
      });
      
      respond(true, { ok: true, task: newTask }, undefined);
    } catch (err: any) {
      respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, err.message));
    }
  },

  "tasks.update": async ({ params, respond }) => {
    try {
      const p = params as any;
      if (!p.id || typeof p.id !== "string") {
        return respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "id required"));
      }

      let updatedTask: KanbanTask | null = null;
      await withTasksLock(async () => {
        const store = await readTasksUnlocked();
        const task = store[p.id];
        if (!task) {
          throw new Error("NOT_FOUND");
        }
        updatedTask = {
          ...task,
          title: p.title !== undefined ? p.title : task.title,
          description: p.description !== undefined ? p.description : task.description,
          status: p.status !== undefined ? p.status : task.status,
          assignee: p.assignee !== undefined ? p.assignee : task.assignee,
          updatedAt: Date.now()
        };
        store[p.id] = updatedTask;
        await saveTasksUnlocked(store);
      });

      respond(true, { ok: true, task: updatedTask }, undefined);
    } catch (err: any) {
      if (err.message === "NOT_FOUND") {
        respond(false, undefined, errorShape(ErrorCodes.NOT_FOUND, "Task not found"));
      } else {
        respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, err.message));
      }
    }
  },

  "tasks.delete": async ({ params, respond }) => {
    try {
      const p = params as any;
      if (!p.id || typeof p.id !== "string") {
        return respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "id required"));
      }

      await withTasksLock(async () => {
        const store = await readTasksUnlocked();
        if (!store[p.id]) {
            throw new Error("NOT_FOUND");
        }
        delete store[p.id];
        await saveTasksUnlocked(store);
      });
      
      respond(true, { ok: true, deletedId: p.id }, undefined);
    } catch (err: any) {
      if (err.message === "NOT_FOUND") {
         respond(false, undefined, errorShape(ErrorCodes.NOT_FOUND, "Task not found"));
      } else {
         respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, err.message));
      }
    }
  }
};
