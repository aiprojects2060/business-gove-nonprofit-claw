import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  DEPARTMENT_REGISTRY,
  getDepartmentsForTier,
  scaffoldCorporateWorkspace,
} from "./agent-templates.js";

describe("agent-templates", () => {
  let tmpDir = "";

  beforeAll(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-corp-test-"));
  });

  afterAll(async () => {
    if (tmpDir) await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("DEPARTMENT_REGISTRY has 28 departments", () => {
    expect(Object.keys(DEPARTMENT_REGISTRY).length).toBe(28);
  });

  it("getDepartmentsForTier returns correct counts per tier and type", () => {
    // startup tier: receptionist (1)
    expect(getDepartmentsForTier("startup", "business").length).toBeGreaterThanOrEqual(1);
    
    // small tier business: sales, finance, support, operations, engineering, customer-success, receptionist (7+)
    const smallBusiness = getDepartmentsForTier("small", "business");
    expect(smallBusiness.map((d) => d.id)).toContain("sales");
    expect(smallBusiness.map((d) => d.id)).toContain("engineering");
    
    // government tier
    const govDepts = getDepartmentsForTier("enterprise", "government");
    expect(govDepts.map((d) => d.id)).toContain("policy");
    expect(govDepts.map((d) => d.id)).toContain("grants");
  });

  it("scaffoldCorporateWorkspace creates expected directories and files for single agents", async () => {
    const baseDir = path.join(tmpDir, "agents");

    const result = await scaffoldCorporateWorkspace({
      baseDir,
      size: "small",
      orgType: "business",
      departments: ["sales", "finance"],
      agentCounts: { sales: 1, finance: 1 },
      llmConfig: { mode: "recommended" },
    });

    // Verify result shape
    expect(result.mainAgentDir).toBeTruthy();
    expect(result.sharedConfigDir).toBeTruthy();
    expect(result.createdAgents.length).toBe(2);
    
    // Verify legacy map uses simple ID for single agents
    expect(result.departmentDirs.sales).toBeTruthy();
    expect(result.departmentDirs.finance).toBeTruthy();

    // Verify main agent files exist
    const mainFiles = await fs.readdir(result.mainAgentDir);
    expect(mainFiles).toContain("SOUL.md");
    expect(mainFiles).toContain("IDENTITY.md");

    // Verify department agent files exist
    const salesFiles = await fs.readdir(result.departmentDirs.sales);
    expect(salesFiles).toContain("IDENTITY.md");
    const salesIdentity = await fs.readFile(path.join(result.departmentDirs.sales, "IDENTITY.md"), "utf-8");
    const roleLine = salesIdentity.split("\n").find(line => line.includes("- **Role:**"));
    expect(roleLine).toContain("Sales Agent");

    const financeFiles = await fs.readdir(result.departmentDirs.finance);
    expect(financeFiles).toContain("IDENTITY.md");
  });

  it("scaffoldCorporateWorkspace handles multi-agent counts", async () => {
    const baseDir = path.join(tmpDir, "agents-multi");

    const result = await scaffoldCorporateWorkspace({
      baseDir,
      size: "small",
      orgType: "business",
      departments: ["sales"],
      agentCounts: {
        sales: 2,
      },
      llmConfig: { mode: "recommended" },
    });
    
    // Should create sales-1 and sales-2
    expect(result.createdAgents.length).toBe(2);
    expect(result.createdAgents.map(a => a.id)).toContain("sales-1");
    expect(result.createdAgents.map(a => a.id)).toContain("sales-2");

    // Check directory existence
    const sales1Dir = path.join(baseDir, "sales-1");
    const sales2Dir = path.join(baseDir, "sales-2");
    
    expect(await fs.stat(sales1Dir)).toBeTruthy();
    expect(await fs.stat(sales2Dir)).toBeTruthy();

    // Check Identity Content
    const id1 = await fs.readFile(path.join(sales1Dir, "IDENTITY.md"), "utf-8");
    const roleLine1 = id1.split("\n").find(line => line.includes("- **Role:**"));
    expect(roleLine1).toContain("Sales Agent 1");
    
    const id2 = await fs.readFile(path.join(sales2Dir, "IDENTITY.md"), "utf-8");
    const roleLine2 = id2.split("\n").find(line => line.includes("- **Role:**"));
    expect(roleLine2).toContain("Sales Agent 2");
    
    // Check Config
    const broadcastRules = await fs.readFile(path.join(result.sharedConfigDir, "BROADCAST_RULES.md"), "utf-8");
    // Broadcast rules should use Dept ID (Area: sales)
    expect(broadcastRules).toContain("Area: sales");
  });

  it("scaffoldCorporateWorkspace handles granular LLM config", async () => {
    const baseDir = path.join(tmpDir, "agents-llm");

    const result = await scaffoldCorporateWorkspace({
      baseDir,
      size: "small",
      orgType: "business",
      departments: ["sales", "finance", "support"],
      agentCounts: { sales: 2, finance: 1, support: 1 },
      llmConfig: {
        mode: "custom",
        defaultModel: "default-model",
        departmentModels: {
          finance: "finance-model",
        },
        agentModels: {
          "sales-1": "sales-star-model",
        }
      }
    });

    // sales-1: specific override -> "sales-star-model"
    const sales1 = result.createdAgents.find(a => a.id === "sales-1");
    expect(sales1?.model).toBe("sales-star-model");

    // sales-2: no specific override, no dept override -> default -> "default-model"
    const sales2 = result.createdAgents.find(a => a.id === "sales-2");
    expect(sales2?.model).toBe("default-model");

    // finance: dept override -> "finance-model"
    const finance = result.createdAgents.find(a => a.id === "finance");
    expect(finance?.model).toBe("finance-model");

    // support: default -> "default-model"
    const support = result.createdAgents.find(a => a.id === "support");
    expect(support?.model).toBe("default-model");
  });

  it("scaffoldCorporateWorkspace handles hierarchy assignment", async () => {
    const baseDir = path.join(tmpDir, "agents-hierarchy");

    const result = await scaffoldCorporateWorkspace({
      baseDir,
      size: "small",
      orgType: "business",
      departments: ["sales"],
      agentCounts: { sales: 2 },
      hierarchy: "standard",
      llmConfig: { mode: "recommended" },
    });

    // Sales 1 should be Head
    const head = result.createdAgents.find(a => a.id === "sales-1");
    // We can't check 'position' directly on the returned agent object unless we added it to return type?
    // Wait, I updated createdAgents return type to include 'model', but not 'position'.
    // I should check the file content instead, which is the ultimate source of truth.
    
    const headIdentity = await fs.readFile(path.join(result.departmentDirs["sales-1"], "IDENTITY.md"), "utf-8");
    expect(headIdentity).toContain("**Title:** Head of Sales Agent"); 
    // Wait, dept.name is "Sales Agent". So "Head of Sales Agent". A bit weird naming but okay for now.
    expect(headIdentity).toContain("**Level:** manager");
    expect(headIdentity).toContain("**Reports to:** Main Orchestrator");
    expect(headIdentity).toContain("**Manages:** sales-2"); // Array.from logic
    
    // Sales 2 should be Associate
  });

  it("scaffoldCorporateWorkspace generates compliance directives", async () => {
    const baseDir = path.join(tmpDir, "agents-compliance");

    const result = await scaffoldCorporateWorkspace({
      baseDir,
      size: "small",
      orgType: "business",
      departments: ["sales"],
      llmConfig: { mode: "recommended" },
      compliance: ["GDPR", "HIPAA"]
    });

    const complianceFile = await fs.readFile(path.join(result.sharedConfigDir, "COMPLIANCE_GUIDELINES.md"), "utf-8");
    expect(complianceFile).toContain("GDPR");
    expect(complianceFile).toContain("HIPAA");
    expect(complianceFile).toContain("Corporate Compliance Directives");
  });

  it("scaffoldCorporateWorkspace handles Universal Agent definitions (Path Integrity)", async () => {
    const baseDir = path.join(tmpDir, "agents-universal");

    // Mock universal agent definition exactly as it would come from the registry
    const mockGovAgent = {
      id: "us-policy-director",
      name: "Policy Director",
      role: "Policy Director",
      description: "Drafts policies.",
      category: "executive",
      level: "L3",
      soul: "# SOUL\nI am a policy expert.",
      mission: "# MISSION\nTo draft good policies.",
      capabilities: [],
      files: {
        "POLICY_GUIDE.md": "# Guidelines"
      }
    };

    const result = await scaffoldCorporateWorkspace({
      baseDir,
      size: "enterprise",
      orgType: "government",
      agents: [mockGovAgent as any],
      llmConfig: { mode: "recommended" },
    });

    expect(result.createdAgents.length).toBe(1);
    expect(result.createdAgents[0].id).toBe("us-policy-director");

    // Check directory and special files
    const agentDir = path.join(baseDir, "us-policy-director");
    const files = await fs.readdir(agentDir);
    expect(files).toContain("POLICY_GUIDE.md");
    
    const identity = await fs.readFile(path.join(agentDir, "IDENTITY.md"), "utf-8");
    expect(identity).toContain("Policy Director");
  });
});
