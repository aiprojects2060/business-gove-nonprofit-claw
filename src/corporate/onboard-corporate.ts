/**
 * Corporate Onboarding Wizard Step
 *
 * Standalone module called during the onboarding wizard to set up
 * multi-agent corporate workspaces. This module:
 *
 * 1. Asks if the user wants corporate mode
 * 2. Asks for Organization Type (Business, Gov, NGO)
 * 3. Asks for Organization Size
 * 4. Selects Departments (filtered by type/size)
 * 5. Offers Advanced Configuration (Hierarchy, Counts, LLM Config)
 * 6. Scaffolds the agent workspaces dynamically
 *
 * Non-destructive: if the user declines corporate mode, nothing changes.
 */

import path from "node:path";
import type { OpenClawConfig } from "../config/config.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import type { RuntimeEnv } from "../runtime.js";
import { AgentRegistry } from "../registry/index.js";
import { UniversalAgentDefinition, RegistryFilter, OrganizationSize as UniversalSize } from "../registry/types.js";
import {
  type OrganizationSize as LegacySize,
  type OrganizationType,
  type DepartmentId,
  type OrgStructure,
  type LlmAssignmentMode,
  type CorporateLlmConfig,
  DEPARTMENT_REGISTRY,
  getDepartmentsForTier,
  scaffoldCorporateWorkspace,
} from "./agent-templates.js";

export async function runCorporateOnboarding(params: {
  config: OpenClawConfig;
  workspaceDir: string;
  prompter: WizardPrompter;
  runtime: RuntimeEnv;
}): Promise<CorporateOnboardingResult> {
  const { config, workspaceDir, prompter, runtime } = params;

  // ─── Step 1: Corporate Mode Confirmation ─────────────────────────────
  const wantsCorporate = await prompter.confirm({
    message: "Enable Multi AI Agent Setup? (Corporate/Gov/NGO Modes)",
    initialValue: false,
  });

  if (!wantsCorporate) {
    return { enabled: false, config };
  }

  // ─── Step 2: Organization Profile & Context ──────────────────────────
  const orgType = (await prompter.select({
    message: "Organization Type:",
    options: [
      { value: "business", label: "Commercial Business", hint: "Standard corporate departments" },
      { value: "government", label: "Government / Public Sector", hint: "Federal, State, Local" },
      { value: "ngo", label: "Non-Profit / NGO", hint: "Charities, Foundations" },
    ],
    initialValue: "business",
  })) as OrganizationType;

  let region = "US";
  let universalSize: UniversalSize = "small";
  let industry = "general";
  let level = ""; // government level or NGO type
  let filters: RegistryFilter = { orgType, region: "US", size: "small" };

  // Dispatch to sub-flows
  if (orgType === "business") {
    const res = await runBusinessFlow(prompter);
    region = res.region;
    universalSize = res.size;
    industry = res.industry;
    filters = { orgType, region: res.region as any, size: res.size, industry: res.industry };
  } else if (orgType === "government") {
    const res = await runGovernmentFlow(prompter);
    region = res.region;
    universalSize = res.size;
    level = res.level;
    industry = "government";
    filters = { orgType, region: res.region as any, size: res.size, industry: "government" };
  } else if (orgType === "ngo") {
    const res = await runNGOFlow(prompter);
    region = res.region;
    universalSize = res.size;
    level = res.type;
    industry = res.type;
    filters = { orgType, region: res.region as any, size: res.size, industry: res.type };
  }

  // Map to Legacy Size for Scaffolding Compatibility
  let legacySize: LegacySize = "small";
  if (universalSize === "micro") legacySize = "startup";
  else if (universalSize === "small") legacySize = "small";
  else if (universalSize === "medium") legacySize = "medium";
  else if (universalSize === "large" || universalSize === "enterprise" || universalSize === "multinational") legacySize = "enterprise";

  // ─── Step 3: Agent Selection ─────────────────────────────────────────
  const selectedAgents = await selectAgentsFromRegistry(prompter, filters);

  if (selectedAgents.length === 0) {
    return { enabled: false, config };
  }

  // ─── Step 4: Advanced Configuration ──────────────────────────────────
  const configureAdvanced = await prompter.confirm({
    message: "Configure advanced settings? (Hierarchy, Agent Counts, LLM Assignment)",
    initialValue: false,
  });

  let hierarchy: OrgStructure = "standard";
  let llmConfig: CorporateLlmConfig = { mode: "recommended" };
  const agentCounts: Partial<Record<string, number>> = {};

  if (configureAdvanced) {
    // Hierarchy
    hierarchy = (await prompter.select({
      message: "Management Hierarchy:",
      options: [
        { value: "flat", label: "Flat", hint: "Agents execute tasks directly" },
        { value: "standard", label: "Standard", hint: "Department heads + Team" },
        { value: "enterprise", label: "Enterprise", hint: "CxO > Director > Manager" },
      ],
      initialValue: "standard",
    })) as OrgStructure;

    // Agent Counts
    const customizeCounts = await prompter.confirm({
      message: "Customize agent counts per role?",
      initialValue: false,
    });

    if (customizeCounts) {
      for (const agent of selectedAgents) {
        const count = await prompter.text({
          message: `How many ${agent.name}s?`,
          initialValue: "1",
          placeholder: "1",
        });
        agentCounts[agent.id] = parseInt(count, 10) || 1;
      }
    }

    // LLM Assignment
    const llmSelection = await prompter.select({
      message: "LLM Model Assignment Strategy:",
      options: [
        { value: "recommended", label: "Recommended (Auto-tiering)" },
        { value: "uniform", label: "Uniform (Same for all)" },
        { value: "agent", label: "Per Agent", hint: "Granular control" },
      ],
      initialValue: "recommended",
    });

    const mode = llmSelection === "agent" ? "custom" : (llmSelection as any);
    llmConfig = { mode };

    if (llmSelection === "uniform") {
      llmConfig.defaultModel = await prompter.text({
        message: "Enter default model (e.g., anthropic/claude-3-5-sonnet):",
        initialValue: "anthropic/claude-3-5-sonnet",
      });
    }

    if (llmSelection === "agent") {
      llmConfig.agentModels = {};
      for (const agent of selectedAgents) {
        const choice = await prompter.select({
            message: `Model for ${agent.name}:`,
            options: [
              { value: "default", label: "Use Default" },
              { value: "custom", label: "Custom..." },
            ],
            initialValue: "default",
          });

          if (choice === "custom") {
            const model = await prompter.text({
              message: `Enter model for ${agent.name}:`,
              initialValue: "anthropic/claude-3-5-sonnet",
            });
            llmConfig.agentModels[agent.id] = model;
          }
      }
    }
  }

  // ─── Step 5: Compliance Directives ──────────────────────────────────
  const enableCompliance = await prompter.confirm({
    message: "Enforce specific compliance or regulatory standards? (GDPR, HIPAA, etc.)",
    initialValue: false,
  });

  let compliance: string[] = [];
  if (enableCompliance) {
    await prompter.note(
      [
        "When selected, the scaffolding engine generates a COMPLIANCE_GUIDELINES.md file in the shared /agents/shared directory.",
        "Because OpenClaw agents are built to read AND adhere to their workspace markdown files (SOUL.md, MISSION.md, etc.),",
        "adding this file directly injects these compliance constraints right into the LLM's system prompt.",
        "The agents will actively check their actions against these rules when executing tasks.",
      ].join("\n"),
      "Compliance Enforcement Mode"
    );

    compliance = (await prompter.multiselect({
      message: "Select compliance standards to enforce:",
      options: [
        { value: "GDPR", label: "GDPR (UK / EU Data Protection)" },
        { value: "HIPAA", label: "HIPAA (USA Healthcare Data)" },
        { value: "PCI-DSS", label: "PCI-DSS (Global / UK & USA Payment Card Industry)" },
        { value: "SOX", label: "SOX (USA Sarbanes-Oxley)" },
        { value: "ISO-27001", label: "ISO 27001 (Global / UK & USA Information Security)" },
        { value: "SOC2", label: "SOC 2 (USA Primarily Service Organization Control)" },
      ],
      initialValues: ["GDPR"]
    })) as string[];
  }

  // ─── Step 6: Self-Improving Skill ────────────────────────────────────
  const enableSelfImproving = await prompter.confirm({
    message: "Enable self-improving skill? (Agents learn from mistakes)",
    initialValue: true,
  });

  // ─── Step 6: Scaffold ────────────────────────────────────────────────
  const agentsBaseDir = path.join(workspaceDir, "..", "agents");

  await prompter.note(
    [
      `Creating Universal Workspace:`,
      `• Type: ${orgType.toUpperCase()}`,
      `• Region: ${region}`,
      `• Size: ${universalSize.toUpperCase()}`,
      `• Agents: ${selectedAgents.length}`,
      "",
      "Scaffolding agents...",
    ].join("\n"),
    "Setup",
  );

  const result = await scaffoldCorporateWorkspace({
    baseDir: agentsBaseDir,
    size: legacySize,
    orgType,
    agents: selectedAgents, // Pass the selected Universal Agents
    hierarchy,
    llmConfig,
    agentCounts,
    compliance,
  });

  // ─── Step 7: Config Update ───────────────────────────────────────────
  const skillsList = enableSelfImproving ? ["self-improving-agent"] : undefined;

  const agentConfigs: any[] = [
    {
      id: "main",
      name: "Main Orchestrator",
      default: true,
      department: "executive",
      workspace: result.mainAgentDir,
      ...(skillsList ? { skills: skillsList } : {}),
    },
    ...result.createdAgents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      department: agent.deptId || "operations",
      workspace: agent.workspace,
      ...(agent.model ? { model: agent.model } : {}),
      ...(skillsList ? { skills: skillsList } : {}),
    })),
  ];

  // Merge new agents into the existing list, replacing any with the same ID
  const existingList = config.agents?.list ?? [];
  const newById = new Map(agentConfigs.map((a: any) => [a.id, a]));
  // Keep existing entries whose ID is NOT being replaced by onboarding
  const merged = existingList.filter((a: any) => !newById.has(a?.id));
  // Append all new agents
  merged.push(...agentConfigs);

  const nextConfig: OpenClawConfig = {
    ...config,
    agents: {
      ...config.agents,
      list: merged,
      corporate: {
        orgType,
        size: universalSize,
        region,
        industry,
        level: level || undefined,
        hierarchy,
        onboardedAt: new Date().toISOString(),
      },
    },
  };

  await prompter.note(
    [
      `✅ Universal Workspace Initialized`,
      `• Agents Created: ${agentConfigs.length}`,
      enableSelfImproving ? "• Self-Improving: ENABLED" : "• Self-Improving: DISABLED",
      "",
      "Review generated agents in /agents directory.",
    ].join("\n"),
    "Done",
  );

  return { enabled: true, config: nextConfig };
}

// Helper: Run Flow 1 (Business)
async function runBusinessFlow(prompter: WizardPrompter): Promise<{ region: string; size: UniversalSize; industry: string }> {
  const region = (await prompter.select({
    message: "Region / Jurisdiction:",
    options: [
      { value: "US", label: "United States" },
      { value: "UK", label: "United Kingdom" },
      { value: "International", label: "International / Generic" },
    ],
    initialValue: "US",
  })) as string;

  const size = (await prompter.select({
    message: "Organization Size:",
    options: [
      { value: "micro", label: "Micro", hint: "Solo / Small Team" },
      { value: "small", label: "Small", hint: "Growing" },
      { value: "medium", label: "Medium", hint: "Established" },
      { value: "large", label: "Large", hint: "Corporate" },
      { value: "enterprise", label: "Enterprise", hint: "Complex" },
    ],
    initialValue: "small",
  })) as UniversalSize;

  const industry = (await prompter.select({
    message: "Primary Industry:",
    options: [
      // ── General ──────────────────────────────────────────────
      { value: "general", label: "General Business" },
      // ── Professional Services ────────────────────────────────
      { value: "technology", label: "Technology / SaaS" },
      { value: "consulting", label: "Consulting" },
      { value: "legal", label: "Legal Services" },
      { value: "accounting", label: "Accounting / CPA" },
      { value: "architecture", label: "Architecture / Engineering" },
      { value: "cybersecurity", label: "Cybersecurity" },
      { value: "advertising", label: "Advertising / Marketing Agency" },
      { value: "staffing", label: "Staffing / Recruitment" },
      // ── Finance & Insurance ──────────────────────────────────
      { value: "finance", label: "Finance / Fintech" },
      { value: "banking", label: "Banking" },
      { value: "insurance", label: "Insurance" },
      { value: "crypto", label: "Crypto / Blockchain" },
      // ── Healthcare & Life Sciences ───────────────────────────
      { value: "healthcare", label: "Healthcare / MedTech" },
      { value: "pharma", label: "Pharmaceutical" },
      { value: "biotech", label: "Biotechnology" },
      // ── Retail & Consumer ────────────────────────────────────
      { value: "retail", label: "Retail / E-commerce" },
      { value: "restaurant", label: "Restaurant / Food Service" },
      { value: "hospitality", label: "Hospitality / Hotels" },
      { value: "fashion", label: "Fashion / Apparel" },
      { value: "beauty", label: "Beauty / Salon / Spa" },
      { value: "fitness", label: "Fitness / Gym" },
      { value: "pet_care", label: "Pet Care" },
      { value: "gambling", label: "Gambling / Casino" },
      // ── Industrial & Manufacturing ───────────────────────────
      { value: "manufacturing", label: "Manufacturing" },
      { value: "construction", label: "Construction" },
      { value: "automotive", label: "Automotive" },
      { value: "aerospace", label: "Aerospace / Defense" },
      { value: "energy", label: "Energy / Utilities" },
      { value: "mining", label: "Mining / Resources" },
      { value: "environmental", label: "Environmental Services" },
      { value: "waste_management", label: "Waste Management / Recycling" },
      // ── Transport & Logistics ────────────────────────────────
      { value: "logistics", label: "Logistics / Supply Chain" },
      { value: "aviation", label: "Aviation / Airlines" },
      { value: "maritime", label: "Maritime / Shipping" },
      // ── Media & Entertainment ────────────────────────────────
      { value: "media", label: "Media / Publishing" },
      { value: "film_tv", label: "Film / TV Production" },
      { value: "music", label: "Music Industry" },
      { value: "gaming", label: "Gaming / Game Studio" },
      { value: "publishing", label: "Book Publishing" },
      // ── Other ────────────────────────────────────────────────
      { value: "real_estate", label: "Real Estate" },
      { value: "education", label: "Education" },
      { value: "agriculture", label: "Agriculture" },
      { value: "telecom", label: "Telecommunications" },
      { value: "events", label: "Events / Conferences" },
      { value: "cleaning", label: "Commercial Cleaning" },
      { value: "security_services", label: "Security Services" },
      { value: "social_enterprise", label: "Social Enterprise / B-Corp" },
      { value: "veterinary", label: "Veterinary" },
      { value: "funeral", label: "Funeral Services" },
      { value: "sports", label: "Sports / Athletics" },
    ],
    initialValue: "general",
  })) as string;

  return { region, size, industry };
}

// Helper: Run Flow 2 & 3 (Government)
async function runGovernmentFlow(prompter: WizardPrompter): Promise<{ region: string; size: UniversalSize; level: string }> {
  const region = (await prompter.select({
    message: "Jurisdiction:",
    options: [
      { value: "US", label: "United States Government" },
      { value: "UK", label: "UK Government" },
    ],
    initialValue: "US",
  })) as string;

  let levelOptions = [];
  if (region === "US") {
    levelOptions = [
      { value: "federal", label: "Federal Agency" },
      { value: "state", label: "State Government" },
      { value: "local", label: "Local / Municipal" },
    ];
  } else {
    levelOptions = [
      { value: "national", label: "National / Central" },
      { value: "devolved", label: "Devolved Administration" },
      { value: "local", label: "Local Council" },
    ];
  }

  const level = (await prompter.select({
    message: "Government Level:",
    options: levelOptions,
    initialValue: levelOptions[0].value,
  })) as string;

  // Map gov level to size roughly for scaffolding logic
  const size: UniversalSize = level === "local" ? "medium" : "enterprise";

  return { region, size, level };
}

// Helper: Run Flow 4 (NGO)
async function runNGOFlow(prompter: WizardPrompter): Promise<{ region: string; size: UniversalSize; type: string }> {
  const region = "International"; // Default for NGO usually, or ask

  const type = (await prompter.select({
    message: "NGO Type:",
    options: [
      { value: "charity", label: "Charitable Trust" },
      { value: "foundation", label: "Foundation" },
      { value: "advocacy", label: "Advocacy Group" },
      { value: "association", label: "Professional Association" },
      { value: "healthcare", label: "Health / Medical NGO" },
      { value: "education", label: "Education / Youth" },
      { value: "environment", label: "Environment / Conservation" },
      { value: "humanitarian", label: "Humanitarian / Emergency Relief" },
      { value: "rights", label: "Human Rights / Legal Aid" },
      { value: "faith", label: "Faith-Based / Community" },
      { value: "think_tank", label: "Think Tank / Research" },
    ],
    initialValue: "charity",
  })) as string;

  const size = (await prompter.select({
    message: "Organization Size:",
    options: [
      { value: "small", label: "Small / Grassroots" },
      { value: "medium", label: "Medium / National" },
      { value: "large", label: "Large / International" },
    ],
    initialValue: "small",
  })) as UniversalSize;

  return { region, size, type };
}

// Helper: Select Agents
async function selectAgentsFromRegistry(prompter: WizardPrompter, filter: RegistryFilter): Promise<UniversalAgentDefinition[]> {
  const registry = AgentRegistry.getInstance();
  const availableAgents = registry.getAgents(filter);

  if (availableAgents.length === 0) {
    await prompter.note("No specific agents found for this configuration. Using generic agents.", "Registry");
    return [];
  }

  // Group by category
  const groups: Record<string, UniversalAgentDefinition[]> = {};
  for (const agent of availableAgents) {
    const cat = agent.category || "General";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(agent);
  }

  // Create selection options partitioned by category
  const options = [];
  
  // Add "Select All" logic? 
  // For now, list them with headers? multiselect doesn't support headers natively usually
  // We'll flatten the list: "[Finance] Accounts Payable", "[Finance] CFO", etc.

  for (const [cat, agents] of Object.entries(groups)) {
    for (const agent of agents) {
      options.push({
        value: agent.id,
        label: `${agent.emoji || "🤖"} [${cat.toUpperCase()}] ${agent.name}`,
        hint: agent.summary || agent.description.substring(0, 50) + "..."
      });
    }
  }

  const selectedIds = (await prompter.multiselect({
    message: `Select Agents (${availableAgents.length} available):`,
    options: options,
    // Default to all recommended? or none?
    // Let's default to all for now as user likely wants the "package"
    initialValues: availableAgents.map(a => a.id)
  })) as string[];

  return availableAgents.filter(a => selectedIds.includes(a.id));
}

export interface CorporateOnboardingResult {
  /** Whether the user chose corporate mode */
  enabled: boolean;
  /** Updated config with corporate agent definitions */
  config: OpenClawConfig;
}
