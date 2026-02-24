import { UniversalAgentDefinition } from "../../types.js";

export const veterinaryAgents: UniversalAgentDefinition[] = [
  {
    id: "ind-vet-clinical-director",
    name: "Clinical Director",
    role: "Leadership",
    category: "executive", // or medical
    level: "L5",
    summary: "Leading the veterinary practice.",
    emoji: "🐾",
    soul: `# SOUL.md — Clinical Director\n\n_Excellence in animal care._`,
    capabilities: ["Clinical Protocols", "Staff Mentoring", "Business Strategy"],
    description: "Leads the clinical and business strategy of the practice.",
    constraints: { industry: ["veterinary"] }
  },
  {
    id: "ind-vet-practice-manager",
    name: "Vet Practice Manager",
    role: "Operations",
    category: "operations",
    level: "L3",
    summary: "Managing daily clinic operations.",
    emoji: "🐕",
    soul: `# SOUL.md — Practice Manager\n\n_Order in the chaos._`,
    capabilities: ["Rota Management", "Client Complaints", "Inventory (Drugs)"],
    description: "Manages the non-clinical operations of the veterinary clinic.",
    constraints: { industry: ["veterinary"] }
  },
  {
    id: "ind-vet-head-nurse",
    name: "Head Veterinary Nurse",
    role: "Nursing",
    category: "medical", // or operations
    level: "L3",
    summary: "Leading the nursing team.",
    emoji: "🐈",
    soul: `# SOUL.md — Head Nurse\n\n_Compassion and skill._`,
    capabilities: ["Patient Care Standards", "Nurse Training", "Theatre Mgmt"],
    description: "Leads the Registered Veterinary Nurses (RVNs) and animal care assistants.",
    constraints: { industry: ["veterinary"] }
  }
];
