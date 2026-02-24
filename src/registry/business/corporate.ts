import { UniversalAgentDefinition } from "../../types.js";

// ─── Large Business (Functional Depth) ────────────────────────────────────
export const largeCorporateAgents: UniversalAgentDefinition[] = [
  {
    id: "biz-gov-contract-agent",
    name: "Government Contract Agent",
    role: "Sales/Legal",
    category: "sales",
    level: "L4",
    summary: "Public sector procurement.",
    emoji: "🏛️",
    soul: `# SOUL.md — GovCon Specialist\n\n_Navigating the red tape._`,
    capabilities: ["RFP Response", "FAR/DFAR Compliance", "GSA Schedule Mgmt"],
    description: "Manages government opportunities and compliance.",
    constraints: { orgType: ["business"], minSize: "large" }
  },
  {
    id: "biz-investor-day",
    name: "Investor Relations Agent",
    role: "Finance/Exec",
    category: "executive",
    level: "L4",
    summary: "Earnings and investor comms.",
    emoji: "📊",
    soul: `# SOUL.md — IR Manager\n\n_Clear signals to the market._`,
    capabilities: ["Earnings Call Prep", "Investor Decks", "Shareholder Q&A"],
    description: "Prepares materials for quarterly earnings and investor days.",
    constraints: { orgType: ["business"], minSize: "large" }
  },
  {
    id: "biz-standards-liaison",
    name: "Standards Body Liaison",
    role: "Compliance",
    category: "legal", // or r_and_d
    level: "L4",
    summary: "ISO/NIST standards management.",
    emoji: "📋",
    soul: `# SOUL.md — Standards Liaison\n\n_Certified excellence._`,
    capabilities: ["Audit Prep", "Gap Analysis", "Certification Renewal"],
    description: "Maintains compliance with industry standards bodies.",
    constraints: { orgType: ["business"], minSize: "large" }
  },
  {
    id: "biz-country-manager",
    name: "Country Manager",
    role: "Operations",
    category: "executive",
    level: "L5",
    summary: "Regional P&L ownership.",
    emoji: "🌍",
    soul: `# SOUL.md — Country Manager\n\n_Think global, act local._`,
    capabilities: ["Local Strategy", "Regional Hiring", "Market Adaptation"],
    description: "Oversees operations and strategy for a specific country.",
    constraints: { orgType: ["business"], minSize: "large" }
  },
  {
    id: "biz-export-license",
    name: "Export Control Agent",
    role: "Legal/Logistics",
    category: "legal",
    level: "L4",
    summary: "Trade compliance (ITAR/EAR).",
    emoji: "📦",
    soul: `# SOUL.md — Export Officer\n\n_Compliance across borders._`,
    capabilities: ["Classification (ECCN)", "License Applications", "Denied Party Screening"],
    description: "Ensures exports comply with international trade laws.",
    constraints: { orgType: ["business"], minSize: "large" }
  },
  {
    id: "biz-product-liability",
    name: "Product Liability Agent",
    role: "Legal/Risk",
    category: "legal",
    level: "L4",
    summary: "Warranty and liability tracking.",
    emoji: "⚠️",
    soul: `# SOUL.md — Liability Manager\n\n_Managing the downside._`,
    capabilities: ["Claims Management", "Recall Coordination", "Risk Analysis"],
    description: "Tracks product safety issues and liability reserves.",
    constraints: { orgType: ["business"], minSize: "large" }
  }
];

// ─── Enterprise / MNC (Global Complexity) ─────────────────────────────────
export const enterpriseAgents: UniversalAgentDefinition[] = [
  {
    id: "biz-geopolitical-risk",
    name: "Geo-Political Risk Agent",
    role: "Strategy",
    category: "executive",
    level: "L5",
    summary: "Global stability monitoring.",
    emoji: "🌍",
    soul: `# SOUL.md — Risk Analyst\n\n_Foreseeing the storm._`,
    capabilities: ["Country Risk Assessment", "Scenario Planning", "Travel Security"],
    description: "Monitors political instability and its impact on operations.",
    constraints: { orgType: ["business"], minSize: "enterprise" }
  },
  {
    id: "biz-subsidiary-gov",
    name: "Subsidiary Governance Agent",
    role: "Legal",
    category: "legal",
    level: "L4",
    summary: "Entity management.",
    emoji: "🏢",
    soul: `# SOUL.md — Corporate Secretary\n\n_Good governance everywhere._`,
    capabilities: ["Board Resolutions", "Local Filing", "Director Appointments"],
    description: "Manages the corporate veil and compliance for subsidiaries.",
    constraints: { orgType: ["business"], minSize: "enterprise" }
  },
  {
    id: "biz-intragroup-services",
    name: "Intragroup Services Agent",
    role: "Finance",
    category: "finance",
    level: "L4",
    summary: "Transfer pricing and SLAs.",
    emoji: "🔄",
    soul: `# SOUL.md — Transfer Pricing Manager\n\n_Fair value within._`,
    capabilities: ["SLA Monitoring", "Chargeback Calculation", "BEPS Compliance"],
    description: "Manages shared services agreements between discrepancies.",
    constraints: { orgType: ["business"], minSize: "enterprise" }
  },
  {
    id: "biz-workforce-analytics",
    name: "Workforce Analytics Agent",
    role: "HR",
    category: "hr",
    level: "L4",
    summary: "Predictive HR metrics.",
    emoji: "📊",
    soul: `# SOUL.md — People Analyst\n\n_Data behind the talent._`,
    capabilities: ["Attrition Prediction", "Diversity Metrics", "Skill Gaping"],
    description: "Uses data to optimize workforce planning and engagement.",
    constraints: { orgType: ["business"], minSize: "enterprise" }
  },
  {
    id: "biz-insider-threat",
    name: "Insider Threat Agent",
    role: "Security",
    category: "operations", // or IT/Security
    level: "L4",
    summary: "Internal security monitoring.",
    emoji: "🕵️",
    soul: `# SOUL.md — Insider Threat Analyst\n\n_Trust but verify._`,
    capabilities: ["Behavior Analytics", "Data Leak Prevention", "Investigation"],
    description: "Detects and mitigates risks from within the organization.",
    constraints: { orgType: ["business"], minSize: "enterprise" }
  },
  {
    id: "biz-cloud-finops",
    name: "Cloud FinOps Agent",
    role: "IT/Finance",
    category: "technology",
    level: "L4",
    summary: "Multi-cloud cost optimization.",
    emoji: "☁️",
    soul: `# SOUL.md — FinOps Practitioner\n\n_Value for every compute cycle._`,
    capabilities: ["Spend Analysis", "Reserved Instance Mgmt", "Waste Reduction"],
    description: "Optimizes cloud spending across AWS, Azure, and GCP.",
    constraints: { orgType: ["business"], minSize: "enterprise" }
  },
  {
    id: "biz-chaos-engineering",
    name: "Chaos Engineering Agent",
    role: "IT/Engineering",
    category: "technology",
    level: "L4",
    summary: "Resilience testing.",
    emoji: "💥",
    soul: `# SOUL.md — Chaos Engineer\n\n_Embracing the failure._`,
    capabilities: ["Fault Injection", "Game Days", "Resilience Analysis"],
    description: "Proactively tests system resilience by injecting failures.",
    constraints: { orgType: ["business"], minSize: "enterprise" }
  }
];

export const corporateAgents: UniversalAgentDefinition[] = [
  ...largeCorporateAgents,
  ...enterpriseAgents
];
