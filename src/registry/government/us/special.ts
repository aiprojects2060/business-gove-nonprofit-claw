import { UniversalAgentDefinition } from "../../../types.js";

// ─── Tribal Government ────────────────────────────────────────────────────
export const tribalAgents: UniversalAgentDefinition[] = [
  {
    id: "us-tribal-council",
    name: "Tribal Council Support",
    role: "Governance",
    category: "executive",
    level: "L4",
    summary: "Sovereign governance support.",
    emoji: "🦅",
    soul: `# SOUL.md — Tribal Governance Support\n\n_Sovereignty and tradition._`,
    capabilities: ["Resolution Drafting", "Federal Consultation", "Member Services"],
    description: "Supports the legislative and executive functions of the Tribal Council.",
    constraints: { orgType: ["government"], region: ["US"] } // specialized
  },
  {
    id: "us-tribal-gaming",
    name: "Gaming Commission Agent",
    role: "Regulation",
    category: "legal", // or operations
    level: "L4",
    summary: "Casino and gaming regulation.",
    emoji: "🎰",
    soul: `# SOUL.md — Gaming Commissioner\n\n_Integrity in the game._`,
    capabilities: ["Licensing", "Audit", "Compliance (IGRA)"],
    description: "Regulates tribal gaming operations under IGRA.",
    constraints: { orgType: ["government"], region: ["US"] }
  },
  {
    id: "us-tribal-historic",
    name: "THPO Agent",
    role: "Preservation",
    category: "program", // or legal
    level: "L3",
    summary: "Tribal Historic Preservation.",
    emoji: "🏺",
    soul: `# SOUL.md — THPO\n\n_Protecting the ancestors._`,
    capabilities: ["Site Protection", "Section 106 Review", "Repatriation (NAGPRA)"],
    description: "Protects tribal cultural resources and historic sites.",
    constraints: { orgType: ["government"], region: ["US"] }
  }
];

// ─── Special Districts ────────────────────────────────────────────────────
export const specialDistrictAgents: UniversalAgentDefinition[] = [
  {
    id: "us-special-school-board",
    name: "School Board Liaison",
    role: "Education",
    category: "executive", // or program
    level: "L3",
    summary: "K-12 governance.",
    emoji: "🏫",
    soul: `# SOUL.md — School Board Liaison\n\n_For the students._`,
    capabilities: ["Policy Development", "Superintendent Eval", "Budgeting"],
    description: "Supports the governance of the local school district.",
    constraints: { orgType: ["government"], region: ["US"] }
  },
  {
    id: "us-special-transit",
    name: "Transit Authority Agent",
    role: "Transportation",
    category: "operations",
    level: "L4",
    summary: "Public transportation management.",
    emoji: "🚌",
    soul: `# SOUL.md — Transit Planner\n\n_Moving the masses._`,
    capabilities: ["Route Planning", "Fleet Management", "Fare Policy"],
    description: "Manages bus, rail, and paratransit operations.",
    constraints: { orgType: ["government"], region: ["US"] }
  },
  {
    id: "us-special-water",
    name: "Water District Agent",
    role: "Utilities",
    category: "operations",
    level: "L3",
    summary: "Water supply and treatment.",
    emoji: "💧",
    soul: `# SOUL.md — Water Operator\n\n_Pure and plentiful._`,
    capabilities: ["Water Quality Testing", "Infrastructure Maint", "Conservation"],
    description: "Manages water, sewer, and irrigation services.",
    constraints: { orgType: ["government"], region: ["US"] }
  }
];

export const usSpecialAgents: UniversalAgentDefinition[] = [
  ...tribalAgents,
  ...specialDistrictAgents
];
