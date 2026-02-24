import { UniversalAgentDefinition, RegistryFilter } from "./types.js";
import { DEPARTMENT_REGISTRY } from "../corporate/agent-templates.js";
import { businessAgents } from "./business/index.js";
import { governmentAgents } from "./government/index.js";
import { ngoAgents } from "./ngo/index.js";
import { industryAgents } from "./industries/index.js";
import { universalAgents } from "./universal/index.js";

export class AgentRegistry {
  private static instance: AgentRegistry;
  
  // In-memory cache of all loaded definitions
  private agents: UniversalAgentDefinition[] = [];

  private constructor() {
    this.initializeRegistry();
  }

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  private initializeRegistry() {
    // Adapter: Load legacy departments into Universal Registry for backward compatibility/testing
    const legacyAgents = Object.values(DEPARTMENT_REGISTRY).map(dept => ({
      id: dept.id,
      name: dept.name,
      role: dept.name,
      description: dept.summary,
      emoji: dept.emoji,
      summary: dept.summary,
      category: this.mapLegacyCategory(dept.id), 
      level: "L3",
      soul: dept.soul,
      mission: dept.mission,
      capabilities: [],
      files: dept.roleFiles,
      roleFiles: dept.roleFiles,
      routesTo: dept.routesTo,
      constraints: {
         minSize: dept.availableFrom,
         orgType: dept.orgTypes
      }
    } as UniversalAgentDefinition));
    
    // Combine new modular agents with legacy adapter
    // Priority: New agents first, then legacy fallback
    const allAgents = [
      ...businessAgents,
      ...governmentAgents,
      ...ngoAgents,
      ...industryAgents,
      ...universalAgents,
      ...legacyAgents
    ];
    const uniqueAgents = new Map<string, UniversalAgentDefinition>();
    
    for (const agent of allAgents) {
        if (!uniqueAgents.has(agent.id)) {
            uniqueAgents.set(agent.id, agent);
        }
    }
    
    this.agents = Array.from(uniqueAgents.values());
  }

  private mapLegacyCategory(id: string): any {
    const map: Record<string, string> = {
      "sales": "sales",
      "marketing": "marketing",
      "legal": "legal",
      "hr": "hr",
      "finance": "finance",
      "operations": "operations",
      "it": "technology",
      "engineering": "technology",
      "product": "technology",
      "support": "customer",
      "customer-success": "customer",
      "executive": "executive",
      "facilities": "operations",
      "security": "operations",
      "communications": "marketing",
      "pr": "marketing",
      "strategy": "executive",
      "pmo": "operations",
      "procurement": "finance",
      "compliance": "legal",
      "rnd": "r_and_d",
    };
    return map[id] || "operations";
  }

  /**
   * Main query function for the Wizard.
   * Returns a filtered list of agents matching the user's context.
   */
  public getAgents(filter: RegistryFilter): UniversalAgentDefinition[] {
    return this.agents.filter(agent => {
      // 1. Check constraints if defined
      if (agent.constraints) {
        // Org Type Check
        if (
          agent.constraints.orgType && 
          !agent.constraints.orgType.includes(filter.orgType)
        ) {
          return false;
        }

        // Region Check
        if (
          agent.constraints.region &&
          !agent.constraints.region.includes(filter.region)
        ) {
          return false;
        }
        
        if (agent.constraints.minSize) {
          if (!this.isSizeCompatible(filter.size, agent.constraints.minSize)) {
            return false;
          }
        }
        
        // Industry Check
        if (
          agent.constraints.industry && 
          filter.industry &&
          !agent.constraints.industry.includes(filter.industry)
        ) {
          return false;
        }
      }

      // 3. Category/Role matching
      if (filter.department && agent.category !== filter.department) {
          // If a specific department is requested, filter out non-matches 
          return false;
      }
      
      return true;
    });
  }

  /**
   * Helper to check if current org size meets min requirement
   */
  private isSizeCompatible(current: string, min: string): boolean {
    const sizes = ["micro", "small", "medium", "large", "enterprise", "multinational"];
    const currentIdx = sizes.indexOf(current);
    const minIdx = sizes.indexOf(min);
    return currentIdx >= minIdx;
  }

  
  /**
   * Get a specific agent by ID
   */
  public getAgentById(id: string): UniversalAgentDefinition | undefined {
    return this.agents.find(a => a.id === id);
  }
}
