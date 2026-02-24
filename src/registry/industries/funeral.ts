import { UniversalAgentDefinition } from "../../types.js";

export const funeralAgents: UniversalAgentDefinition[] = [
  {
    id: "ind-funeral-director",
    name: "Funeral Director",
    role: "Operations",
    category: "operations", // or service
    level: "L3",
    summary: "Arranging funerals.",
    emoji: "⚱️",
    soul: `# SOUL.md — Funeral Director\n\n_Dignity in death._`,
    capabilities: ["Arrangements", "Logistics (Hearse/Limo)", "Compliance"],
    description: "Arranges and conducts funeral services with dignity and respect.",
    constraints: { industry: ["funeral"] }
  },
  {
    id: "ind-funeral-arranger",
    name: "Family Liaison / Arranger",
    role: "Client Service",
    category: "customer",
    level: "L3",
    summary: "Supporting bereaved families.",
    emoji: "🕯️",
    soul: `# SOUL.md — Arranger\n\n_Compassionate listening._`,
    capabilities: ["Consultation", "Order of Service", "Bereavement Support"],
    description: "Guides families through the funeral arrangement process.",
    constraints: { industry: ["funeral"] }
  },
  {
    id: "ind-funeral-embalmer",
    name: "Embalmer Agent",
    role: "Technical",
    category: "medical", // or technical
    level: "L3",
    summary: "Preservation and presentation.",
    emoji: "🔬",
    soul: `# SOUL.md — Embalmer\n\n_Care for the deceased._`,
    capabilities: ["Embalming", "Restoration", "Hygiene"],
    description: "Prepares the deceased for viewing and burial.",
    constraints: { industry: ["funeral"] }
  }
];
