export type OrganizationType = 
  | "business" 
  | "government" 
  | "ngo" 
  | "healthcare" 
  | "education" 
  | "legal" 
  | "finance" 
  | "custom";

export type Region = "US" | "UK" | "International" | "EU" | "Canada" | "Australia";

export type OrganizationSize = 
  | "micro"      // 1-9
  | "small"      // 10-49
  | "medium"     // 50-249
  | "large"      // 250-999
  | "enterprise" // 1000+
  | "multinational";

export type AgentCategory = 
  | "executive" 
  | "finance" 
  | "hr" 
  | "sales" 
  | "marketing" 
  | "operations" 
  | "legal" 
  | "technology" 
  | "customer" 
  | "r_and_d" 
  | "supply_chain" 
  | "compliance"
  | "program"       // NGO specific
  | "fundraising"   // NGO specific
  | "policy"        // Gov/NGO
  | "mission";      // Gov/NGO

export interface UniversalAgentDefinition {
  /** Unique identifier for the agent (e.g., "BIZ-FIN-AP-AUTO-L3") */
  id: string;
  /** Human-readable name (e.g., "Accounts Payable Agent") */
  name: string;
  
  /** Emoji for UI/Logs assignment */
  emoji?: string;
  
  /** Short summary of capabilities */
  summary?: string; 
  
  /** Functional role description */
  role: string;
  /** Detailed description of the agent's purpose */
  description: string;
  
  /** Primary category for grouping in the wizard */
  category: AgentCategory;
  
  /**
   * The "Soul" - System Prompt.
   * This defines the agent's personality, constraints, and core mission.
   */
  soul: string;

  /**
   * Specific capabilities/skills this agent processes.
   * Used for matching user requests to the correct agent.
   */
  capabilities: string[];
  
  /**
   * The agent's specific mission/objectives.
   * populates MISSION.md
   */
  mission: string;

  /**
   * Complexity/Autonomy Level
   * L1: Task Runner (Functions only)
   * L2: Semi-Autonomous (Human check required)
   * L3: Autonomous (Standard operations)
   * L4: Proactive (Self-initiating)
   * L5: Strategic (Orchestrates others)
   */
  level: "L1" | "L2" | "L3" | "L4" | "L5";

  /**
   * Availability criteria.
   * If strictly for a specific org type or region.
   * If omitted, assumed available to all valid contexts if explicitly requested.
   */
  constraints?: {
    orgType?: OrganizationType[];
    region?: Region[];
    minSize?: OrganizationSize;
    industry?: string[];
  };

  /**
   * Dynamic file generation.
   * Key: Relative path in agent workspace (e.g., "config/tax_rules.json")
   * Value: Content or template string
   */
  files?: Record<string, string>;
  
  /**
   * Alias for files, for compatibility with DepartmentDefinition
   */
  roleFiles?: Record<string, string>;
  
  /**
   * Triggers that activate this agent
   */
  triggers?: string[];
  
  /**
   * Artifacts produced by this agent
   */
  outputs?: string[];
  
  /**
   * Agents this agent routes tasks to (dependencies)
   */
  routesTo?: string[];
}

export interface RegistryFilter {
  orgType: OrganizationType;
  region: Region;
  size: OrganizationSize;
  industry?: string;
  department?: string; // For generating department-specific lists
}
