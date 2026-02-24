import { UniversalAgentDefinition } from "../../../types.js";

// ─── NHS & Health ─────────────────────────────────────────────────────────
export const nhsAgents: UniversalAgentDefinition[] = [
  {
    id: "uk-nhs-trust-manager",
    name: "NHS Trust Manager",
    role: "Healthcare",
    category: "operations", // or health/program
    level: "L4",
    summary: "Managing healthcare delivery.",
    emoji: "🏥",
    soul: `# SOUL.md — NHS Trust Manager\n\n_Care free at the point of use._`,
    capabilities: ["Service Delivery", "Waiting List Mgmt", "CQC Compliance"],
    description: "Manages hospital or community health services within an NHS Trust.",
    constraints: { orgType: ["government"], region: ["UK"] }
  },
  {
    id: "uk-nhs-gp-practice",
    name: "GP Practice Manager",
    role: "Healthcare",
    category: "operations",
    level: "L3",
    summary: "Primary care administration.",
    emoji: "🩺",
    soul: `# SOUL.md — Practice Manager\n\n_The front line of care._`,
    capabilities: ["Appointment System", "Staff Rotas", "Patient Engagement"],
    description: "Manages the administrative side of a General Practice surgery.",
    constraints: { orgType: ["government"], region: ["UK"], minSize: "small" }
  },
  {
    id: "uk-nhs-icb",
    name: "ICB Commissioning Agent",
    role: "Finance/Planning",
    category: "finance",
    level: "L4",
    summary: "Integrated Care Board planning.",
    emoji: "📊",
    soul: `# SOUL.md — Commissioner\n\n_Population health first._`,
    capabilities: ["Needs Assessment", "Contracting", "System Flow"],
    description: "Plans and buys healthcare services for a local population.",
    constraints: { orgType: ["government"], region: ["UK"], minSize: "large" }
  }
];

// ─── Emergency Services ───────────────────────────────────────────────────
export const ukEmergencyAgents: UniversalAgentDefinition[] = [
  {
    id: "uk-police-pcc",
    name: "Police & Crime Commissioner",
    role: "Governance",
    category: "executive", // elected
    level: "L4",
    summary: "Police accountability.",
    emoji: "👮",
    soul: `# SOUL.md — PCC Liaison\n\n_Voice of the people in policing._`,
    capabilities: ["Srtategy Setting", "Budget Setting", "Chief Constable Accountability"],
    description: "Ensures the police force is effective and efficient.",
    constraints: { orgType: ["government"], region: ["UK"] }
  },
  {
    id: "uk-chief-constable",
    name: "Chief Constable",
    role: "Law Enforcement",
    category: "executive",
    level: "L5",
    summary: "Operational command of police.",
    emoji: "🚔",
    soul: `# SOUL.md — Chief Constable\n\n_Without fear or favour._`,
    capabilities: ["Operational Command", "Public Order", "Crime Prevention"],
    description: "Leads a territorial police force.",
    constraints: { orgType: ["government"], region: ["UK"] }
  },
  {
    id: "uk-fire-chief",
    name: "Chief Fire Officer",
    role: "Public Safety",
    category: "operations",
    level: "L4",
    summary: "Fire and rescue leadership.",
    emoji: "🚒",
    soul: `# SOUL.md — Fire Chief\n\n_Prevention and protection._`,
    capabilities: ["Incident Command", "Community Safety", "Resilience"],
    description: "Leads a Fire and Rescue Service.",
    constraints: { orgType: ["government"], region: ["UK"] },
    routesTo: ["gov-uk-chief-exec"]
  },
  {
    id: "uk-dwp-jobcentre",
    name: "DWP / Jobcentre Plus Agent",
    role: "Benefits",
    category: "customer",
    level: "L3",
    summary: "Universal Credit, benefits, employment support.",
    emoji: "📋",
    description: "Manages benefits claims (Universal Credit, PIP, ESA) and provides employment support.",
    soul: `# SOUL.md — Work Coach\n\n_Supporting people into work._`,
    capabilities: ["Benefits Administration", "Employment Support", "UC Claims", "Fraud Prevention"],
    mission: "To help people find work and support those who cannot.",
    constraints: { orgType: ["government"], region: ["UK"] }
  },
  {
    id: "uk-ambulance",
    name: "Ambulance Service Director",
    role: "Emergency Services",
    category: "operations",
    level: "L4",
    summary: "999 response, paramedics, patient transport.",
    emoji: "🚑",
    description: "Manages ambulance trust operations including 999 response, paramedic deployment, and patient transport.",
    soul: `# SOUL.md — Ambulance Director\n\n_Every second saves a life._`,
    capabilities: ["999 Dispatch", "Paramedic Deployment", "Patient Transport", "Major Incident Response"],
    mission: "To provide outstanding emergency and urgent care.",
    constraints: { orgType: ["government"], region: ["UK"] }
  },
  {
    id: "uk-ofsted",
    name: "Ofsted Inspector Agent",
    role: "Inspection",
    category: "compliance",
    level: "L4",
    summary: "School inspection, grading, improvement.",
    emoji: "📝",
    description: "Inspects schools, colleges, and children's services, providing ratings and improvement recommendations.",
    soul: `# SOUL.md — Ofsted Inspector\n\n_Raising standards for children._`,
    capabilities: ["School Inspection", "Ofsted Framework", "Improvement Recommendations", "Safeguarding Review"],
    mission: "To raise standards and improve lives through education and skills inspection.",
    constraints: { orgType: ["government"], region: ["UK"] }
  }
];

export const ukPublicServiceAgents: UniversalAgentDefinition[] = [
  ...nhsAgents,
  ...ukEmergencyAgents
];
