import { UniversalAgentDefinition } from "../../types.js";

export const staffingAgents: UniversalAgentDefinition[] = [
  {
    id: "ind-staffing-recruiter",
    name: "Recruitment Consultant",
    role: "Sales/Recruitment",
    category: "sales", // or hr
    level: "L3",
    summary: "360-degree recruitment.",
    emoji: "🤝",
    soul: `# SOUL.md — Recruiter\n\n_Finding the perfect match._`,
    capabilities: ["Candidate Sourcing", "Client Sales", "Interview Prep"],
    description: "Manages the full recruitment cycle for clients and candidates.",
    constraints: { industry: ["staffing"] }
  },
  {
    id: "ind-staffing-compliance",
    name: "Agency Compliance Officer",
    role: "Compliance",
    category: "compliance",
    level: "L3",
    summary: "Vetting and right-to-work.",
    emoji: "✅",
    soul: `# SOUL.md — Compliance Officer\n\n_Safe and legal hiring._`,
    capabilities: ["Right to Work Checks", "DBS Checks", "Contract Generation"],
    description: "Ensures all candidates are compliant before placement.",
    constraints: { industry: ["staffing"] }
  },
  {
    id: "ind-staffing-account-mgr",
    name: "Key Account Manager",
    role: "Sales",
    category: "sales",
    level: "L4",
    summary: "Managing large client accounts.",
    emoji: "💼",
    soul: `# SOUL.md — Account Manager\n\n_Trusted partner._`,
    capabilities: ["Stakeholder Mgmt", "Service Level Agreements", "Forecasting"],
    description: "Manages relationships with major staffing clients (MSPs/RPOs).",
    constraints: { industry: ["staffing"], minSize: "medium" }
  }
];
