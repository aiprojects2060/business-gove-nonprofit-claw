import { UniversalAgentDefinition } from "../../types.js";

// ─── Micro Business (Foundational) ─────────────────────────────────────────
export const microGrowthAgents: UniversalAgentDefinition[] = [
  {
    id: "biz-contract-drafter",
    name: "Contract & Proposal Agent",
    role: "Legal/Sales",
    category: "legal", // or sales
    level: "L3",
    summary: "Drafts simple contracts and proposals.",
    emoji: "📝",
    soul: `# SOUL.md — Contract Drafter\n\n_Protecting the business, closing the deal._`,
    capabilities: ["Contract Drafting", "Proposal Inquiry", "SOW Generation"],
    description: "Generates agreements and statements of work from templates.",
    constraints: { orgType: ["business"], minSize: "micro" },
    routesTo: []
  },
  {
    id: "biz-appointment-agent",
    name: "Appointment Scheduler",
    role: "Admin",
    category: "operations",
    level: "L2",
    summary: "Booking and calendar management.",
    emoji: "🗓️",
    soul: `# SOUL.md — Scheduler\n\n_Your time is money._`,
    capabilities: ["Calendar Management", "Booking Confirmation", "Reminders"],
    description: "Manages appointments and optimizes the calendar.",
    constraints: { orgType: ["business"], minSize: "micro" }
  },
  {
    id: "biz-phone-agent",
    name: "Phone / Call Handler",
    role: "Support",
    category: "customer",
    level: "L2",
    summary: "Screening and voicemail transcription.",
    emoji: "📞",
    soul: `# SOUL.md — Call Handler\n\n_First impressions matter._`,
    capabilities: ["Call Screening", "Voicemail Transcription", "Callback Scheduling"],
    description: "Handles incoming calls and prioritizes communications.",
    constraints: { orgType: ["business"], minSize: "micro" }
  },
  {
    id: "biz-live-chat",
    name: "Live Chat Agent",
    role: "Support",
    category: "customer",
    level: "L2",
    summary: "Website visitor engagement.",
    emoji: "💬",
    soul: `# SOUL.md — Chat Agent\n\n_Always online, always helpful._`,
    capabilities: ["Customer Q&A", "Lead Qualification", "Support Triage"],
    description: "Engages visitors on the website in real-time.",
    constraints: { orgType: ["business"], minSize: "micro" }
  },
  {
    id: "biz-reputation-agent",
    name: "Reputation Manager",
    role: "Marketing",
    category: "marketing",
    level: "L3",
    summary: "Review monitoring and response.",
    emoji: "⭐",
    soul: `# SOUL.md — Reputation Manager\n\n_Trust is earned._`,
    capabilities: ["Review Monitoring", "Response Drafting", "Testimonial Collection"],
    description: "Monitors platforms like Google/Yelp and manages online reputation.",
    constraints: { orgType: ["business"], minSize: "micro" }
  },
  {
    id: "biz-funding-agent",
    name: "Loan & Funding Agent",
    role: "Finance",
    category: "finance",
    level: "L3",
    summary: "Identifies capital opportunities.",
    emoji: "🏦",
    soul: `# SOUL.md — Funding Agent\n\n_Fueling growth._`,
    capabilities: ["Grant Scoping", "Loan Application Prep", "SBA/Bank Research"],
    description: "Helps secure necessary capital for business operations.",
    constraints: { orgType: ["business"], minSize: "micro" }
  }
];

// ─── Small Business (Scaling) ──────────────────────────────────────────────
export const smallGrowthAgents: UniversalAgentDefinition[] = [
  {
    id: "biz-subscription-agent",
    name: "Subscription Manager",
    role: "Finance",
    category: "finance",
    level: "L3",
    summary: "Recurring billing and dunning.",
    emoji: "🔄",
    soul: `# SOUL.md — Subscription Manager\n\n_Revenue retention specialist._`,
    capabilities: ["Billing Automation", "Churn Prevention", "Dunning Management"],
    description: "Manages recurring revenue streams and payment failures.",
    constraints: { orgType: ["business"], minSize: "small" }
  },
  {
    id: "biz-onboarding-agent",
    name: "Client Onboarding Agent",
    role: "Operations",
    category: "operations", // or customer-success
    level: "L3",
    summary: "New client workflows.",
    emoji: "🏗️",
    soul: `# SOUL.md — Onboarding Specialist\n\n_Setting the stage for success._`,
    capabilities: ["Workflow Automation", "Document Collection", "Welcome Cadence"],
    description: "Ensures new clients have a smooth start.",
    constraints: { orgType: ["business"], minSize: "small" }
  },
  {
    id: "biz-competitor-agent",
    name: "Competitor Monitor",
    role: "Marketing",
    category: "marketing",
    level: "L3",
    summary: "Tracks market rivals.",
    emoji: "📊",
    soul: `# SOUL.md — Competitor Monitor\n\n_Keep your friends close._`,
    capabilities: ["Pricing Tracking", "Feature Analysis", "News Monitoring"],
    description: "Analyzes competitor moves and market positioning.",
    constraints: { orgType: ["business"], minSize: "small" }
  },
  {
    id: "biz-location-agent",
    name: "Territory / Location Manager",
    role: "Operations",
    category: "operations",
    level: "L3",
    summary: "Multi-location coordination.",
    emoji: "📍",
    soul: `# SOUL.md — Territory Manager\n\n_Standards across the map._`,
    capabilities: ["Site Compliance", "Territory Assignment", "Localization"],
    description: "Manages specific geographic territories or branch locations.",
    constraints: { orgType: ["business"], minSize: "small" }
  },
  {
    id: "biz-referral-agent",
    name: "Referral Program Manager",
    role: "Sales",
    category: "sales",
    level: "L3",
    summary: "Customer referral tracking.",
    emoji: "🔗",
    soul: `# SOUL.md — Referral Manager\n\n_Word of mouth, amplified._`,
    capabilities: ["Referral Tracking", "Reward Distribution", "Partner Management"],
    description: "Operates the partner and customer referral engine.",
    constraints: { orgType: ["business"], minSize: "small" }
  },
  {
    id: "biz-insurance-agent",
    name: "Business Insurance Agent",
    role: "Risk",
    category: "legal", // or finance
    level: "L3",
    summary: "Insurance policy tracking.",
    emoji: "🛡️",
    soul: `# SOUL.md — Insurance Manager\n\n_Peace of mind._`,
    capabilities: ["Policy Renewal", "Claims Assistance", "Coverage Analysis"],
    description: "Tracks liability, workers comp, and other insurance needs.",
    constraints: { orgType: ["business"], minSize: "small" }
  }
];

// ─── Medium Business (process & Optimization) ──────────────────────────────
export const mediumGrowthAgents: UniversalAgentDefinition[] = [
  {
    id: "biz-asset-agent",
    name: "Asset Tracking Agent",
    role: "IT/Ops",
    category: "operations",
    level: "L3",
    summary: "Physical asset inventory.",
    emoji: "🏷️",
    soul: `# SOUL.md — Asset Manager\n\n_Accountability for every item._`,
    capabilities: ["Barcode/RFID Tracking", "Inventory Audit", "Depreciation Logging"],
    description: "Tracks physical assets like laptops, vehicles, and equipment.",
    constraints: { orgType: ["business"], minSize: "medium" }
  },
  {
    id: "biz-sla-agent",
    name: "SLA Manager",
    role: "Support",
    category: "customer",
    level: "L4",
    summary: "Service Level Agreement tracking.",
    emoji: "📋",
    soul: `# SOUL.md — SLA Manager\n\n_Promises kept._`,
    capabilities: ["SLA Monitoring", "Breach Alerts", "Performance Reporting"],
    description: "Ensures support and service teams meet agreed standards.",
    constraints: { orgType: ["business"], minSize: "medium" }
  },
  {
    id: "biz-okr-agent",
    name: "OKR Tracker",
    role: "HR/Strategy",
    category: "hr",
    level: "L4",
    summary: "Objectives and Key Results.",
    emoji: "🎯",
    soul: `# SOUL.md — OKR Tracker\n\n_Alignment and focus._`,
    capabilities: ["Goal Cascading", "Progress Check-ins", "Scorecarding"],
    description: "Tracks organizational and departmental goals.",
    constraints: { orgType: ["business"], minSize: "medium" }
  },
  {
    id: "biz-capacity-agent",
    name: "Capacity Planner",
    role: "Operations",
    category: "operations",
    level: "L4",
    summary: "Resource utilization analysis.",
    emoji: "🏗️",
    soul: `# SOUL.md — Capacity Planner\n\n_Optimizing the flow._`,
    capabilities: ["Workload Analysis", "Bottleneck Detection", "Hiring Triggers"],
    description: "Analyzes team bandwidth and resource needs.",
    constraints: { orgType: ["business"], minSize: "medium" }
  },
  {
    id: "biz-vendor-compliance",
    name: "Vendor Compliance Agent",
    role: "Procurement",
    category: "finance", // or legal
    level: "L3",
    summary: "Supplier due diligence.",
    emoji: "📋",
    soul: `# SOUL.md — Vendor Compliance\n\n_Safe supply chains._`,
    capabilities: ["Document Collection", "Risk Assessment", "Insurance Verification"],
    description: "Ensures vendors meet legal and safety standards.",
    constraints: { orgType: ["business"], minSize: "medium" }
  },
  {
    id: "biz-ab-testing",
    name: "A/B Testing Agent",
    role: "Product/Marketing",
    category: "marketing",
    level: "L3",
    summary: "Experimentation management.",
    emoji: "🧪",
    soul: `# SOUL.md — Experimenter\n\n_Data-driven decisions._`,
    capabilities: ["Experiment Design", "Significance Testing", "Result Analysis"],
    description: "Manages split tests across product and marketing channels.",
    constraints: { orgType: ["business"], minSize: "medium" }
  }
];

export const growthAgents: UniversalAgentDefinition[] = [
  ...microGrowthAgents,
  ...smallGrowthAgents,
  ...mediumGrowthAgents
];
