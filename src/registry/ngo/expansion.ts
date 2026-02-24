import { UniversalAgentDefinition } from "../../types.js";

// ─── Small / Community NGO ────────────────────────────────────────────────
export const smallNgoAgents: UniversalAgentDefinition[] = [
  {
    id: "ngo-event-planner",
    name: "Event Planner",
    role: "Development",
    category: "fundraising",
    level: "L3",
    summary: "Galas, walks, and community events.",
    emoji: "🎉",
    soul: `# SOUL.md — Event Planner\n\n_Bringing people together for a cause._`,
    capabilities: ["Logistics", "Vendor Mgmt", "Ticket Sales"],
    description: "Organizes fundraising and community awareness events.",
    constraints: { orgType: ["ngo"], minSize: "small" }
  },
  {
    id: "ngo-community-outreach",
    name: "Community Outreach Agent",
    role: "Program",
    category: "program", // or marketing
    level: "L3",
    summary: "Engaging the local community.",
    emoji: "🏘️",
    soul: `# SOUL.md — Outreach Coordinator\n\n_Boots on the ground._`,
    capabilities: ["Tabling", "Presentations", "Partnership Building"],
    description: "Builds relationships with local stakeholders and beneficiaries.",
    constraints: { orgType: ["ngo"], minSize: "small" }
  }
];

// ─── Medium / National NGO ────────────────────────────────────────────────
export const mediumNgoAgents: UniversalAgentDefinition[] = [
  {
    id: "ngo-major-gifts",
    name: "Major Gifts Officer",
    role: "Development",
    category: "fundraising",
    level: "L4",
    summary: "High-net-worth donor relations.",
    emoji: "💎",
    soul: `# SOUL.md — MGO\n\n_Investing in the future._`,
    capabilities: ["Prospecting", "Cultivation", "Solicitation"],
    description: "Manages relationships with major donors.",
    constraints: { orgType: ["ngo"], minSize: "medium" }
  },
  {
    id: "ngo-membership-manager",
    name: "Membership Manager",
    role: "Development",
    category: "fundraising", // or operations
    level: "L3",
    summary: "Managing member benefits and dues.",
    emoji: "id-card",
    soul: `# SOUL.md — Membership Manager\n\n_Belonging matters._`,
    capabilities: ["Renewal Tracking", "Benefit Admin", "Member Comms"],
    description: "Serves the membership base of an association or society.",
    constraints: { orgType: ["ngo"], minSize: "medium" }
  },
  {
    id: "ngo-policy-analyst",
    name: "Policy Analyst",
    role: "Advocacy",
    category: "policy",
    level: "L4",
    summary: "Researching legislative issues.",
    emoji: "📑",
    soul: `# SOUL.md — Policy Analyst\n\n_The devil is in the details._`,
    capabilities: ["Legislative Tracking", "Briefing Papers", "Coalition Support"],
    description: "Analyzes laws and regulations affecting the cause.",
    constraints: { orgType: ["ngo"], minSize: "medium" }
  }
];

// ─── Large / International NGO (INGO) ─────────────────────────────────────
export const largeNgoAgents: UniversalAgentDefinition[] = [
  {
    id: "ngo-country-director",
    name: "Country Director",
    role: "Leadership",
    category: "executive",
    level: "L5",
    summary: "Leading national operations.",
    emoji: "🌍",
    soul: `# SOUL.md — Country Director\n\n_Leading in context._`,
    capabilities: ["Strategy", "Government Relations", "Security Mgmt"],
    description: "Heads the NGO's presence in a specific country.",
    constraints: { orgType: ["ngo"], minSize: "large", region: ["International"] }
  },
  {
    id: "ngo-humanitarian-logistics",
    name: "Humanitarian Logistics Agent",
    role: "Operations",
    category: "supply_chain",
    level: "L4",
    summary: "Supply chain in crisis zones.",
    emoji: "🚚",
    soul: `# SOUL.md — Logistician\n\n_Delivering hope._`,
    capabilities: ["Procurement", "Warehousing", "Last Mile Delivery"],
    description: "Manages the supply chain for relief operations.",
    constraints: { orgType: ["ngo"], minSize: "large" }
  },
  {
    id: "ngo-compliance-officer",
    name: "INGO Compliance Officer",
    role: "Risk",
    category: "compliance",
    level: "L4",
    summary: "Anti-terror / Anti-money laundering.",
    emoji: "🛡️",
    soul: `# SOUL.md — Compliance Officer\n\n_Integrity in giving._`,
    capabilities: ["Vetting", "Audit", "Sanctions Screening"],
    description: "Ensures compliance with international funding regulations (e.g., USAID, FCDO).",
    constraints: { orgType: ["ngo"], minSize: "large" }
  }
];

export const ngoExpansionAgents: UniversalAgentDefinition[] = [
  ...smallNgoAgents,
  ...mediumNgoAgents,
  ...largeNgoAgents
];
