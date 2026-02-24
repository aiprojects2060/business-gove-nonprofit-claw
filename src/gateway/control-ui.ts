import crypto from "node:crypto";
import fs from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import type { OpenClawConfig } from "../config/config.js";
import { resolveControlUiRootSync } from "../infra/control-ui-assets.js";
import { DEFAULT_ASSISTANT_IDENTITY, resolveAssistantIdentity } from "./assistant-identity.js";
import {
  CONTROL_UI_BOOTSTRAP_CONFIG_PATH,
  type ControlUiBootstrapConfig,
} from "./control-ui-contract.js";
import { buildControlUiCspHeader } from "./control-ui-csp.js";
import {
  buildControlUiAvatarUrl,
  CONTROL_UI_AVATAR_PREFIX,
  normalizeControlUiBasePath,
  resolveAssistantAvatarUrl,
} from "./control-ui-shared.js";

const ROOT_PREFIX = "/";

export type ControlUiRequestOptions = {
  basePath?: string;
  config?: OpenClawConfig;
  agentId?: string;
  root?: ControlUiRootState;
};

export type ControlUiRootState =
  | { kind: "resolved"; path: string }
  | { kind: "invalid"; path: string }
  | { kind: "missing" };

function contentTypeForExt(ext: string): string {
  switch (ext) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".json":
    case ".map":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".ico":
      return "image/x-icon";
    case ".txt":
      return "text/plain; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

export type ControlUiAvatarResolution =
  | { kind: "none"; reason: string }
  | { kind: "local"; filePath: string }
  | { kind: "remote"; url: string }
  | { kind: "data"; url: string };

type ControlUiAvatarMeta = {
  avatarUrl: string | null;
};

function applyControlUiSecurityHeaders(res: ServerResponse) {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Content-Security-Policy", buildControlUiCspHeader());
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.end(JSON.stringify(body));
}

function isValidAgentId(agentId: string): boolean {
  return /^[a-z0-9][a-z0-9_-]{0,63}$/i.test(agentId);
}

export function handleControlUiAvatarRequest(
  req: IncomingMessage,
  res: ServerResponse,
  opts: { basePath?: string; resolveAvatar: (agentId: string) => ControlUiAvatarResolution },
): boolean {
  const urlRaw = req.url;
  if (!urlRaw) {
    return false;
  }
  if (req.method !== "GET" && req.method !== "HEAD") {
    return false;
  }

  const url = new URL(urlRaw, "http://localhost");
  const basePath = normalizeControlUiBasePath(opts.basePath);
  const pathname = url.pathname;
  const pathWithBase = basePath
    ? `${basePath}${CONTROL_UI_AVATAR_PREFIX}/`
    : `${CONTROL_UI_AVATAR_PREFIX}/`;
  if (!pathname.startsWith(pathWithBase)) {
    return false;
  }

  applyControlUiSecurityHeaders(res);

  const agentIdParts = pathname.slice(pathWithBase.length).split("/").filter(Boolean);
  const agentId = agentIdParts[0] ?? "";
  if (agentIdParts.length !== 1 || !agentId || !isValidAgentId(agentId)) {
    respondNotFound(res);
    return true;
  }

  if (url.searchParams.get("meta") === "1") {
    const resolved = opts.resolveAvatar(agentId);
    const avatarUrl =
      resolved.kind === "local"
        ? buildControlUiAvatarUrl(basePath, agentId)
        : resolved.kind === "remote" || resolved.kind === "data"
          ? resolved.url
          : null;
    sendJson(res, 200, { avatarUrl } satisfies ControlUiAvatarMeta);
    return true;
  }

  const resolved = opts.resolveAvatar(agentId);
  if (resolved.kind !== "local") {
    respondNotFound(res);
    return true;
  }

  if (req.method === "HEAD") {
    res.statusCode = 200;
    res.setHeader("Content-Type", contentTypeForExt(path.extname(resolved.filePath).toLowerCase()));
    res.setHeader("Cache-Control", "no-cache");
    res.end();
    return true;
  }

  serveFile(res, resolved.filePath);
  return true;
}

function respondNotFound(res: ServerResponse) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("Not Found");
}

function serveFile(res: ServerResponse, filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  res.setHeader("Content-Type", contentTypeForExt(ext));
  // Static UI should never be cached aggressively while iterating; allow the
  // browser to revalidate.
  res.setHeader("Cache-Control", "no-cache");
  res.end(fs.readFileSync(filePath));
}

function serveIndexHtml(res: ServerResponse, indexPath: string, config?: OpenClawConfig) {
  let html = fs.readFileSync(indexPath, "utf8");
  const nonce = crypto.randomBytes(16).toString("base64");

  // Override CSP to allow our nonced inline script
  const baseCsp = buildControlUiCspHeader();
  const cspWithNonce = baseCsp.replace(
    "script-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
  );
  res.setHeader("Content-Security-Policy", cspWithNonce);

  // ── Inject CSS for top-bar setup pill + agent detail panel layout fixes ──
  const cssInjection = `
<style>
/* Top-bar setup pill */
#oc-setup-pill{display:flex;align-items:center;gap:8px;padding:4px 14px;border-radius:20px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);font-size:12px;color:#4f46e5;white-space:nowrap;margin:0 auto}
#oc-setup-pill .oc-sep{color:rgba(99,102,241,0.3)}
header.topbar{display:flex!important;align-items:center!important;justify-content:space-between!important}
/* Agent detail panel layout fixes */
.agent-header,.agent-tabs,.agents-main{height:auto!important;max-height:none!important;grid-template-rows:auto!important}
.agents-layout{height:calc(100vh - 180px)!important;display:grid!important;grid-template-columns:320px 1fr!important;overflow:hidden!important}
.agents-sidebar,.agents-main{height:100%!important;overflow-y:auto!important}
.agent-tabs{display:flex!important;flex-wrap:wrap!important;gap:6px!important;padding:8px 0!important;align-items:center!important}
.agent-tab{height:auto!important;min-height:0!important;max-height:36px!important;border-radius:6px!important;padding:6px 14px!important;font-size:13px!important;line-height:1.4!important;display:inline-flex!important;align-items:center!important}
</style>`;

  // ── Inject corporate metadata + top-bar pill as nonced inline script ──
  const corporate = config?.agents?.corporate;
  // Count unique agent IDs
  const uniqueIds = new Set((config?.agents?.list ?? []).map((a: { id?: string }) => a?.id).filter(Boolean));
  const agentCount = uniqueIds.size;
  const corpJson = corporate ? JSON.stringify(corporate) : "null";
  const scriptInjection = `
<script nonce="${nonce}">
(function(){
  var c=${corpJson},n=${agentCount};
  if(!c)return;
  var L={business:'\u{1F3E2} Business',government:'\u{1F3DB}\uFE0F Gov',ngo:'\u{1F30D} NGO'};
  var S={micro:'Micro',small:'Small',medium:'Medium',large:'Large',enterprise:'Enterprise',multinational:'Multinational'};
  var LV={federal:'Federal',state:'State',local:'Local',national:'National',devolved:'Devolved'};
  var orgPart=L[c.orgType]||c.orgType||'';
  if(c.region)orgPart+=' '+c.region;
  if(c.level)orgPart+=' '+(LV[c.level]||c.level);
  var sizeLabel=S[c.size]||c.size||'';
  var indLabel=(c.industry&&c.industry!=='government'&&c.industry!=='general')?c.industry:'';
  function go(){
    if(document.getElementById('oc-setup-pill'))return;
    var topbar=document.querySelector('header.topbar');
    if(!topbar)return;
    var statusEl=topbar.querySelector('.topbar-status');
    if(!statusEl)return;
    var pill=document.createElement('div');
    pill.id='oc-setup-pill';
    var parts=[];
    if(orgPart)parts.push(orgPart);
    if(sizeLabel)parts.push(sizeLabel);
    if(indLabel)parts.push(indLabel);
    if(n)parts.push(n+' agents');
    pill.innerHTML=parts.join(' <span class="oc-sep">·</span> ');
    topbar.insertBefore(pill,statusEl);
    return;
  }
  var ob=new MutationObserver(function(){go();});
  if(document.body)ob.observe(document.body,{childList:true,subtree:true});
  else document.addEventListener('DOMContentLoaded',function(){ob.observe(document.body,{childList:true,subtree:true});});
})();
</script>`;

  html = html.replace("</head>", `${cssInjection}${scriptInjection}\n</head>`);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.end(html);
}

function isSafeRelativePath(relPath: string) {
  if (!relPath) {
    return false;
  }
  const normalized = path.posix.normalize(relPath);
  if (normalized.startsWith("../") || normalized === "..") {
    return false;
  }
  if (normalized.includes("\0")) {
    return false;
  }
  return true;
}

export function handleControlUiHttpRequest(
  req: IncomingMessage,
  res: ServerResponse,
  opts?: ControlUiRequestOptions,
): boolean {
  const urlRaw = req.url;
  if (!urlRaw) {
    return false;
  }
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Method Not Allowed");
    return true;
  }

  const url = new URL(urlRaw, "http://localhost");
  const basePath = normalizeControlUiBasePath(opts?.basePath);
  const pathname = url.pathname;

  if (!basePath) {
    if (pathname === "/ui" || pathname.startsWith("/ui/")) {
      applyControlUiSecurityHeaders(res);
      respondNotFound(res);
      return true;
    }
  }

  if (basePath) {
    if (pathname === basePath) {
      applyControlUiSecurityHeaders(res);
      res.statusCode = 302;
      res.setHeader("Location", `${basePath}/${url.search}`);
      res.end();
      return true;
    }
    if (!pathname.startsWith(`${basePath}/`)) {
      return false;
    }
  }

  applyControlUiSecurityHeaders(res);

  const bootstrapConfigPath = basePath
    ? `${basePath}${CONTROL_UI_BOOTSTRAP_CONFIG_PATH}`
    : CONTROL_UI_BOOTSTRAP_CONFIG_PATH;
  if (pathname === bootstrapConfigPath) {
    const config = opts?.config;
    const identity = config
      ? resolveAssistantIdentity({ cfg: config, agentId: opts?.agentId })
      : DEFAULT_ASSISTANT_IDENTITY;
    const avatarValue = resolveAssistantAvatarUrl({
      avatar: identity.avatar,
      agentId: identity.agentId,
      basePath,
    });
    if (req.method === "HEAD") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache");
      res.end();
      return true;
    }
    sendJson(res, 200, {
      basePath,
      assistantName: identity.name,
      assistantAvatar: avatarValue ?? identity.avatar,
      assistantAgentId: identity.agentId,
    } satisfies ControlUiBootstrapConfig);
    return true;
  }

  const rootState = opts?.root;
  if (rootState?.kind === "invalid") {
    res.statusCode = 503;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(
      `Control UI assets not found at ${rootState.path}. Build them with \`pnpm ui:build\` (auto-installs UI deps), or update gateway.controlUi.root.`,
    );
    return true;
  }
  if (rootState?.kind === "missing") {
    res.statusCode = 503;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(
      "Control UI assets not found. Build them with `pnpm ui:build` (auto-installs UI deps), or run `pnpm ui:dev` during development.",
    );
    return true;
  }

  const root =
    rootState?.kind === "resolved"
      ? rootState.path
      : resolveControlUiRootSync({
          moduleUrl: import.meta.url,
          argv1: process.argv[1],
          cwd: process.cwd(),
        });
  if (!root) {
    res.statusCode = 503;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(
      "Control UI assets not found. Build them with `pnpm ui:build` (auto-installs UI deps), or run `pnpm ui:dev` during development.",
    );
    return true;
  }

  const uiPath =
    basePath && pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname;
  const rel = (() => {
    if (uiPath === ROOT_PREFIX) {
      return "";
    }
    const assetsIndex = uiPath.indexOf("/assets/");
    if (assetsIndex >= 0) {
      return uiPath.slice(assetsIndex + 1);
    }
    return uiPath.slice(1);
  })();
  const requested = rel && !rel.endsWith("/") ? rel : `${rel}index.html`;
  const fileRel = requested || "index.html";
  if (!isSafeRelativePath(fileRel)) {
    respondNotFound(res);
    return true;
  }

  const filePath = path.join(root, fileRel);
  if (!filePath.startsWith(root)) {
    respondNotFound(res);
    return true;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    if (path.basename(filePath) === "index.html") {
      serveIndexHtml(res, filePath, opts?.config);
      return true;
    }
    serveFile(res, filePath);
    return true;
  }

  // SPA fallback (client-side router): serve index.html for unknown paths.
  const indexPath = path.join(root, "index.html");
  if (fs.existsSync(indexPath)) {
    serveIndexHtml(res, indexPath, opts?.config);
    return true;
  }

  respondNotFound(res);
  return true;
}
