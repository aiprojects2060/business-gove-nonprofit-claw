import { listAgentIds } from "../../agents/agent-scope.js";
import { logVerbose } from "../../globals.js";
import type { CommandHandler, CommandHandlerResult } from "./commands-types.js";

// ── Department normalisation ────────────────────────────────────────────────
// The `department` field from openclaw.json is sometimes the agent ID itself
// (scaffolding default). We derive a human-readable category from the ID
// prefix when the value is not one of the well-known department names.

const WELL_KNOWN_DEPARTMENTS = new Set([
  "executive",
  "operations",
  "hr",
  "legal",
  "sales",
  "marketing",
  "customer-success",
  "support",
  "finance",
  "procurement",
  "receptionist",
  "product",
  "it",
]);

const PREFIX_TO_CATEGORY: Record<string, string> = {
  "biz-": "Business Services",
  "cons-": "Consulting",
  "gov-us-": "Government — US",
  "gov-uk-": "Government — UK",
  "gov-": "Government",
  "ngo-": "NGO / Non-Profit",
  "univ-": "Universal / Utilities",
};

/** Map a department or agent ID to a display-friendly category label. */
function resolveCategory(department: string | undefined, agentId: string): string {
  // 1. If the department is a well-known name, title-case it
  if (department && WELL_KNOWN_DEPARTMENTS.has(department)) {
    return department
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  // 2. Derive from agent ID prefix
  for (const [prefix, label] of Object.entries(PREFIX_TO_CATEGORY)) {
    if (agentId.startsWith(prefix)) {
      return label;
    }
  }
  // 3. Fallback
  return "Other";
}

// ── Category ordering ───────────────────────────────────────────────────────
const CATEGORY_ORDER = [
  "Executive",
  "Operations",
  "Finance",
  "Sales",
  "Marketing",
  "Hr",
  "Legal",
  "Product",
  "It",
  "Support",
  "Customer Success",
  "Receptionist",
  "Procurement",
  "Business Services",
  "Consulting",
  "Government — US",
  "Government — UK",
  "Government",
  "NGO / Non-Profit",
  "Universal / Utilities",
  "Other",
];

function categorySort(a: string, b: string): number {
  const ia = CATEGORY_ORDER.indexOf(a);
  const ib = CATEGORY_ORDER.indexOf(b);
  const oa = ia < 0 ? 999 : ia;
  const ob = ib < 0 ? 999 : ib;
  return oa - ob || a.localeCompare(b);
}

// ── Command handler ─────────────────────────────────────────────────────────

export const handleAgentCommand: CommandHandler = async (
  params,
  allowTextCommands,
): Promise<CommandHandlerResult | null> => {
  if (!allowTextCommands) {
    return null;
  }

  const body = params.command.commandBodyNormalized.trim();
  if (!body.startsWith("/agent")) {
    return null;
  }
  if (!params.command.isAuthorizedSender) {
    logVerbose(
      `Ignoring /agent from unauthorized sender: ${params.command.senderId || "<unknown>"}`,
    );
    return { shouldContinue: false };
  }

  const args = body.slice("/agent".length).trim();
  const cfg = params.cfg;
  const currentAgentId = params.agentId ?? "main";
  const agentIds = listAgentIds(cfg);
  const agentList = (cfg.agents?.list ?? []).filter(
    (e): e is NonNullable<typeof e> => Boolean(e && typeof e === "object"),
  );

  // ── /agent <search> — fuzzy search ──────────────────────────────────────
  if (args) {
    const query = args.toLowerCase();
    const matches = agentList.filter((a) => {
      const id = (a.id ?? "").toLowerCase();
      const name = (a.name ?? a.identity?.name ?? "").toLowerCase();
      const dept = (a.department ?? "").toLowerCase();
      return id.includes(query) || name.includes(query) || dept.includes(query);
    });
    if (matches.length === 0) {
      return {
        shouldContinue: false,
        reply: { text: `❌ No agent found matching "${args}". Type /agent to see all agents.` },
      };
    }
    if (matches.length === 1) {
      const match = matches[0]!;
      const emoji = match.identity?.emoji ?? "🤖";
      const name = match.name ?? match.identity?.name ?? match.id;
      const isCurrent = match.id === currentAgentId;
      const lines = [
        `${emoji} **${name}** (\`${match.id}\`)`,
        isCurrent ? "↳ _This is your current agent._" : "",
        "",
        isCurrent
          ? ""
          : `To chat with this agent, start a new session:\n\`/new\` then send your message in the \`${match.id}\` session.`,
      ].filter(Boolean);
      return { shouldContinue: false, reply: { text: lines.join("\n") } };
    }

    // Multiple matches
    const lines = [`🔎 Found ${matches.length} agents matching "${args}":\n`];
    for (const a of matches) {
      const emoji = a.identity?.emoji ?? "🤖";
      const name = a.name ?? a.identity?.name ?? a.id;
      const marker = a.id === currentAgentId ? " ← current" : "";
      lines.push(`  ${emoji} ${name} — \`${a.id}\`${marker}`);
    }
    return { shouldContinue: false, reply: { text: lines.join("\n") } };
  }

  // ── /agent (no args) — list all, grouped by category ────────────────────
  const grouped = new Map<string, Array<{ id: string; name: string; emoji: string }>>();
  for (const a of agentList) {
    const id = a.id ?? "main";
    const category = resolveCategory(a.department, id);
    const name = a.name ?? a.identity?.name ?? id;
    const emoji = a.identity?.emoji ?? "🤖";
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push({ id, name, emoji });
  }

  const sortedCategories = [...grouped.keys()].sort(categorySort);

  const lines: string[] = [
    `🏢 **Configured Agents** (${agentIds.length})`,
    `Current: \`${currentAgentId}\`\n`,
  ];

  for (const cat of sortedCategories) {
    const agents = grouped.get(cat)!;
    lines.push(`── ${cat} ──`);
    for (const a of agents) {
      const marker = a.id === currentAgentId ? " ← current" : "";
      lines.push(`  ${a.emoji} ${a.name} — \`${a.id}\`${marker}`);
    }
    lines.push("");
  }
  lines.push("💡 Tip: `/agent <name>` to search, e.g. `/agent phone`");

  return { shouldContinue: false, reply: { text: lines.join("\n") } };
};
