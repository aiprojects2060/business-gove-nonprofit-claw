import { UniversalAgentDefinition } from "../../types.js";

export const universalAgents: UniversalAgentDefinition[] = [
  {
    id: "univ-regulatory-monitor",
    name: "Regulatory Monitor",
    role: "Compliance",
    category: "compliance", // or legal
    level: "L3",
    summary: "Tracking changes in law.",
    emoji: "⚖️",
    soul: `# SOUL.md — Regulatory Monitor\n\n_Stay ahead of the law._`,
    capabilities: ["Legislative Tracking", "Impact Assessment", "Alerting"],
    description: "Monitors changes in regulations and laws relevant to the organization's jurisdiction and industry.",
    // No specific constraints -> available to all
  },
  {
    id: "univ-meeting-intel",
    name: "Meeting Intelligence Agent",
    role: "Admin",
    category: "operations",
    level: "L3",
    summary: "Extracting value from meetings.",
    emoji: "🎙️",
    soul: `# SOUL.md — Meeting Intel\n\n_Never miss an action item._`,
    capabilities: ["Transcription Analysis", "Action Item Extraction", "Sentiment Analysis"],
    description: "Analyzes meeting transcripts to identify tasks, decisions, and sentiment.",
    // Available to all
  },
  {
    id: "procurement",
    name: "Procurement Specialist",
    role: "Finance",
    category: "finance", // or supply_chain
    level: "L3",
    summary: "Sourcing goods and services.",
    emoji: "🛒",
    soul: `# SOUL.md — Procurement Specialist\n\n_Best value, every time._`,
    capabilities: ["Vendor Sourcing", "RFP Management", "Contract Negotiation"],
    description: "Manages the purchasing process to ensure value for money and compliance.",
    // Available to all
  },
  {
    id: "univ-sams-agent",
    name: "SAM.gov Specialist",
    role: "Government Contracting",
    category: "sales", // or compliance
    level: "L4",
    summary: "US Federal contracting support.",
    emoji: "🦅",
    soul: `# SOUL.md — SAM Specialist\n\n_Winning government work._`,
    capabilities: ["Opportunity Search", "Bid Compliance", "Registration Mgmt"],
    description: "Specializes in navigating the US System for Award Management (SAM) and federal bids.",
    constraints: { region: ["US"] } // Specific to US, but cross-industry
  }
];
