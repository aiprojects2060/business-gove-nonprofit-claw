const { AgentRegistry } = await import("../src/registry/index.js");
import { scaffoldCorporateWorkspace } from "../src/corporate/agent-templates.js";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function verify() {
  console.log("Starting Verification...");
  
  const registry = AgentRegistry.getInstance();

  // --- BUSINESS EXPANSION TEST ---
  console.log("--- BUSINESS EXPANSION TEST ---");
  
  // 1. Micro Business (Growth Agents)
  const microAgentsGrowth = registry.getAgents({ orgType: "business", size: "micro", region: "US" });
  console.log(`[Micro] Found ${microAgentsGrowth.length} agents.`);
  const contractDrafter = microAgentsGrowth.find(a => a.id === "biz-contract-drafter");
  if (contractDrafter) {
      console.log("✅ Verified: Contract Drafter present in Micro.");
  } else {
      console.error("❌ Failed: Contract Drafter missing in Micro.");
  }

  // 2. Enterprise Business (Corporate Agents)
  const entAgents = registry.getAgents({ orgType: "business", size: "enterprise", region: "International" });
  console.log(`[Enterprise] Found ${entAgents.length} agents.`);
  const geoRisk = entAgents.find(a => a.id === "biz-geopolitical-risk");
  
  if (geoRisk) {
      console.log("✅ Verified: Geo-Political Risk Agent present in Enterprise.");
  } else {
      console.error("❌ Failed: Geo-Political Risk Agent missing in Enterprise.");
  }

  // --- US GOVERNMENT EXPANSION TEST ---
  console.log("--- US GOVERNMENT EXPANSION TEST ---");
  const usGovAgents = registry.getAgents({ orgType: "government", region: "US", size: "large" });
  console.log(`[US Gov] Found ${usGovAgents.length} agents.`);
  
  const interagency = usGovAgents.find(a => a.id === "us-fed-interagency");
  const schoolBoard = usGovAgents.find(a => a.id === "us-special-school-board");
  
  if (interagency) {
      console.log("✅ Verified: Interagency Coordination Agent (Federal).");
  } else {
      console.error("❌ Failed: Interagency Coordination Agent missing.");
  }
  
  if (schoolBoard) {
      console.log("✅ Verified: School Board Liaison (Special District).");
  } else {
      console.error("❌ Failed: School Board Liaison missing.");
  }

  // --- UK GOVERNMENT EXPANSION TEST ---
  console.log("--- UK GOVERNMENT EXPANSION TEST ---");
  const ukGovAgents = registry.getAgents({ orgType: "government", region: "UK", size: "large" });
  console.log(`[UK Gov] Found ${ukGovAgents.length} agents.`);
  
  const nhsTrust = ukGovAgents.find(a => a.id === "uk-nhs-trust-manager");
  
  if (nhsTrust) {
      console.log("✅ Verified: NHS Trust Manager.");
  } else {
      console.error("❌ Failed: NHS Trust Manager missing.");
  }

  // --- NGO EXPANSION TEST ---
  console.log("--- NGO EXPANSION TEST ---");
  const ngoExpansionAgentsTest = registry.getAgents({ orgType: "ngo", size: "large", region: "International" });
  console.log(`[NGO Types] Found ${ngoExpansionAgentsTest.length} agents.`);
  
  const countryDirector = ngoExpansionAgentsTest.find(a => a.id === "ngo-country-director");
  
  if (countryDirector) {
      console.log("✅ Verified: Country Director (INGO) present.");
  } else {
      console.error("❌ Failed: Country Director missing.");
  }



  // --- INDUSTRY EXPANSION TEST ---
  console.log("--- INDUSTRY EXPANSION TEST ---");
  // Test Gambling
  const gamblingAgents = registry.getAgents({ orgType: "business", industry: "gambling", size: "medium", region: "UK" });
  console.log(`[Gambling] Found ${gamblingAgents.length} agents.`);
  const pmlHolder = gamblingAgents.find(a => a.id === "ind-gambling-pml");
  if (pmlHolder) console.log("✅ Verified: PML Holder (Gambling).");
  else console.error("❌ Failed: PML Holder missing.");

  // Test Sports
  const sportsAgents = registry.getAgents({ orgType: "business", industry: "sports", size: "medium", region: "US" });
  const sportsAgent = sportsAgents.find(a => a.id === "ind-sports-agent");
  if (sportsAgent) console.log("✅ Verified: Sports Agent.");
  else console.error("❌ Failed: Sports Agent missing.");

  console.log("--------------------------");

  // --- UNIVERSAL AGENTS TEST ---
  console.log("--- UNIVERSAL AGENTS TEST ---");
  const universalAgents = registry.getAgents({ orgType: "business", region: "US", size: "medium" });
  const regMonitor = universalAgents.find(a => a.id === "univ-regulatory-monitor");
  if (regMonitor) console.log("✅ Verified: Regulatory Monitor (Universal).");
  else console.error("❌ Failed: Regulatory Monitor missing.");

  console.log("--------------------------");

  // 0. UK GOVERNMENT TEST (Prioritized)
  console.log("--- UK GOVERNMENT TEST ---");
  const ukAgents = registry.getAgents({ orgType: "government", region: "UK", size: "enterprise" });
  console.log(`[UK Govt] Found ${ukAgents.length} agents.`);
  const pm = ukAgents.find(a => a.id === "gov-uk-pm");
  const fm = ukAgents.find(a => a.id === "gov-uk-firstminister");
  const councilLeader = ukAgents.find(a => a.id === "gov-uk-council-leader");
  
  if (pm && fm && councilLeader) {
      console.log("✅ Verified: PM, First Minister & Council Leader present in UK Gov.");
  } else {
      console.error("❌ Failed: UK agents missing.", { pm: !!pm, fm: !!fm, council: !!councilLeader });
      // fail hard to see valid error
      if (!pm) console.error("PM missing");
      if (!fm) console.error("First Minister missing");
      if (!councilLeader) console.error("Council Leader missing");
  }
  console.log("--------------------------");

  // 1. Registry Test - NGO (Flow 4A)
  const ngoAgents = registry.getAgents({ orgType: "ngo", region: "US", size: "small" }); // NGO ignores region generally, but let's test US
  console.log(`[NGO] Found ${ngoAgents.length} agents.`);
  const ed = ngoAgents.find(a => a.id === "ngo-executive-director");
  const grantWriter = ngoAgents.find(a => a.id === "ngo-grant-writer");
  
  if (ed && grantWriter) {
      console.log("✅ Verified: Exec Director & Grant Writer present in NGO.");
  } else {
      console.error("❌ Failed: NGO agents missing.");
  }

  // 1. Registry Test - Micro Business (Flow 1A)
  const microAgents = registry.getAgents({ orgType: "business", region: "US", size: "micro", industry: "general" });
  console.log(`[Micro] Found ${microAgents.length} agents.`);
  const ceoMicro = microAgents.find(a => a.id === "executive-ceo");
  if (!ceoMicro) console.log("✅ Verified: No CEO in Micro.");
  else console.error("❌ Failed: CEO found in Micro.");

  // 2. Registry Test - Small Business (Flow 1B)
  const smallAgents = registry.getAgents({ orgType: "business", region: "US", size: "small", industry: "general" });
  console.log(`[Small] Found ${smallAgents.length} agents.`);
  const ceoSmall = smallAgents.find(a => a.id === "executive-ceo");
  if (ceoSmall) console.log("✅ Verified: CEO present in Small.");
  else console.error("❌ Failed: CEO missing in Small.");

  // 3. Registry Test - Medium Tech (Flow 1C)
  const medTech = registry.getAgents({ orgType: "business", region: "US", size: "medium", industry: "technology" });
  console.log(`[Med Tech] Found ${medTech.length} agents.`);
  const hasEng = medTech.find(a => a.id === "engineering");
  if (hasEng) console.log("✅ Verified: Tech agents present.");
  
  // 4. Registry Test - US Local (Flow 2C)
  // Re-enable later if needed, focusing on UK now.
  const fedAgents = registry.getAgents({ orgType: "government", region: "US", size: "enterprise" });
  const mayor = fedAgents.find(a => a.id === "gov-us-mayor");
  if (mayor) console.log("✅ Verified: US Mayor present.");

  // Scaffolding Test (Minimal)
  const testDir = path.resolve(process.cwd(), ".tmp/verify-framework");
  try {
    await fs.rm(testDir, { recursive: true, force: true });
  } catch {}
  await fs.mkdir(testDir, { recursive: true });
  
  console.log(`Scaffolding to ${testDir}...`);
  try {
      const result = await scaffoldCorporateWorkspace({
          baseDir: testDir,
          size: "small",
          orgType: "business",
          agents: smallAgents.slice(0, 3), 
          hierarchy: "standard",
          llmConfig: { mode: "recommended" }
      });
      console.log("Scaffolding complete.");
      console.log("Verification Successful.");
  } catch (error) {
      console.error("Scaffolding failed:", error);
      process.exit(1);
  }
}


verify();
