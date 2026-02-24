import { ngoAgents as coreNgoAgents } from "./agents.js";
import { ngoExpansionAgents } from "./expansion.js";
import { ngoSectorAgents } from "./sectors.js";

export const ngoAgents = [
    ...coreNgoAgents,
    ...ngoExpansionAgents,
    ...ngoSectorAgents
];
