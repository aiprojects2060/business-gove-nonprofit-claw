import { businessAgents as coreBusinessAgents } from "./departments.js";
import { growthAgents } from "./growth.js";
import { corporateAgents } from "./corporate.js";

export const businessAgents = [
    ...coreBusinessAgents,
    ...growthAgents,
    ...corporateAgents
];
