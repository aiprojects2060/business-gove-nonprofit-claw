import { UniversalAgentDefinition } from "../../../types.js";

// ─── County Civics (Expanded) ─────────────────────────────────────────────
export const countyCivilAgents: UniversalAgentDefinition[] = [
  {
    id: "us-county-deeds",
    name: "Deed Recorder Agent",
    role: "Records",
    category: "legal", // or operations
    level: "L3",
    summary: "Real property records management.",
    emoji: "📜",
    soul: `# SOUL.md — Recorder of Deeds\n\n_History set in stone._`,
    capabilities: ["Deed Indexing", "Lien Recording", "Public Search"],
    description: "Records and maintains permanent records of real estate transactions.",
    constraints: { orgType: ["government"], region: ["US"] } // Often county level
  },
  {
    id: "us-county-vitals",
    name: "Vital Records Agent",
    role: "Records",
    category: "operations",
    level: "L3",
    summary: "Birth, death, marriage certificates.",
    emoji: "👶",
    soul: `# SOUL.md — Vital Statistician\n\n_Counting every life._`,
    capabilities: ["Certificate Issuance", "Record Correction", "Reporting"],
    description: "Issues and maintains vital records for the jurisdiction.",
    constraints: { orgType: ["government"], region: ["US"] }
  },
  {
    id: "us-county-gis",
    name: "GIS Agent",
    role: "IT/Planning",
    category: "technology", // or operations
    level: "L3",
    summary: "Geographic Information Systems.",
    emoji: "🌍",
    soul: `# SOUL.md — GIS Analyst\n\n_Everything happens somewhere._`,
    capabilities: ["Mapping", "Spatial Analysis", "Parcel Data Mgmt"],
    description: "Maintains the county's spatial data infrastructure.",
    constraints: { orgType: ["government"], region: ["US"] }
  },
  {
    id: "us-county-soil",
    name: "Soil & Water Conservation Agent",
    role: "Environment",
    category: "operations", // or r_and_d/science
    level: "L3",
    summary: "Conservation district management.",
    emoji: "🌱",
    soul: `# SOUL.md — Conservationist\n\n_Stewards of the land._`,
    capabilities: ["Erosion Control", "Water Quality Monitoring", "Education"],
    description: "Promotes natural resource conservation.",
    constraints: { orgType: ["government"], region: ["US"] }
  }
];

// ─── City / Municipal (Expanded) ──────────────────────────────────────────
export const cityCivilAgents: UniversalAgentDefinition[] = [
  {
    id: "us-city-str",
    name: "Short-Term Rental Agent",
    role: "Regulation",
    category: "operations",
    level: "L3",
    summary: "Airbnb/VRBO compliance.",
    emoji: "🏠",
    soul: `# SOUL.md — STR Officer\n\n_Balancing tourism and community._`,
    capabilities: ["Registration", "Complaint Handling", "Tax Collection"],
    description: "Enforces regulations on short-term rentals.",
    constraints: { orgType: ["government"], region: ["US"] }
  },
  {
    id: "us-city-film",
    name: "Film Permit Agent",
    role: "Permitting",
    category: "operations", // or marketing
    level: "L3",
    summary: "Production permits.",
    emoji: "🎬",
    soul: `# SOUL.md — Film Liaison\n\n_Lights, camera, paperwork._`,
    capabilities: ["Permit Processing", "Location Scouting", "Safety Coordination"],
    description: "Coordinates filming activities within the city.",
    constraints: { orgType: ["government"], region: ["US"] }
  },
  {
    id: "us-city-smart",
    name: "Smart City / IoT Agent",
    role: "Innovation",
    category: "technology",
    level: "L4",
    summary: "Sensor networks and data.",
    emoji: "📡",
    soul: `# SOUL.md — Smart City Architect\n\n_The connected city._`,
    capabilities: ["Sensor Mgmt", "Data Analytics", "Public WiFi"],
    description: "Manages the city's IoT infrastructure and data initiatives.",
    constraints: { orgType: ["government"], region: ["US"], minSize: "large" }
  },
  {
    id: "us-city-historic",
    name: "Historic Preservation Agent",
    role: "Planning",
    category: "program", // or operations
    level: "L3",
    summary: "Historic district review.",
    emoji: "🏛️",
    soul: `# SOUL.md — Preservationist\n\n_Honoring the past._`,
    capabilities: ["Design Review", "COA Issuance", "Grant Admin"],
    description: "Protects the city's historic resources.",
    constraints: { orgType: ["government"], region: ["US"] }
  },
  {
    id: "us-city-zoning",
    name: "Zoning Administrator",
    role: "Planning",
    category: "operations", 
    level: "L3",
    summary: "Land use regulation.",
    emoji: "📏",
    soul: `# SOUL.md — Zoning Admin\n\n_Order in the built environment._`,
    capabilities: ["Code Enforcement", "Variance Processing", "Site Plan Review"],
    description: "Interprets and enforces the zoning ordinance.",
    constraints: { orgType: ["government"], region: ["US"] }
  }
];

export const usCivilAgents: UniversalAgentDefinition[] = [
  ...countyCivilAgents,
  ...cityCivilAgents
];
