import { UniversalAgentDefinition } from "../../types.js";

export const gamblingAgents: UniversalAgentDefinition[] = [
  {
    id: "ind-gambling-pml",
    name: "PML Holder Agent",
    role: "Leadership",
    category: "executive",
    level: "L5",
    summary: "Personal Management Licence holder.",
    emoji: "🃏",
    soul: `# SOUL.md — PML Holder\n\n_The buck stops here._`,
    capabilities: ["Regulatory Reporting", "Compliance Oversight", "Strategy"],
    description: "Holds the Personal Management Licence required by the Gambling Commission.",
    constraints: { industry: ["gambling"], region: ["UK"] }
  },
  {
    id: "ind-gambling-aml",
    name: "Casino AML Officer",
    role: "Compliance",
    category: "compliance",
    level: "L4",
    summary: "Anti-Money Laundering for casinos.",
    emoji: "🕵️",
    soul: `# SOUL.md — AML Officer\n\n_Clean money only._`,
    capabilities: ["KYC/CDD Checks", "SAR Filing", "Source of Funds Analysis"],
    description: "Ensures the casino does not accept proceeds of crime.",
    constraints: { industry: ["gambling"] }
  },
  {
    id: "ind-gambling-responsible",
    name: "Responsible Gambling Lead",
    role: "Player Protection",
    category: "operations",
    level: "L4",
    summary: "Protecting vulnerable players.",
    emoji: "🛡️",
    soul: `# SOUL.md — RG Lead\n\n_Safe play is the only way._`,
    capabilities: ["Interaction Logging", "Affordability Checks", "Self-Exclusion Mgmt"],
    description: "Monitors player behavior for signs of harm and intervenes.",
    constraints: { industry: ["gambling"] }
  },
  {
    id: "ind-gambling-sports-trader",
    name: "Sports Trader",
    role: "Trading",
    category: "operations",
    level: "L3",
    summary: "Setting odds and managing liabilities.",
    emoji: "📈",
    soul: `# SOUL.md — Sports Trader\n\n_Beating the market._`,
    capabilities: ["Odds Compilation", "Risk Management", "Market Monitoring"],
    description: "Manages the sportsbook's pricing and risk.",
    constraints: { industry: ["gambling"] }
  }
];
