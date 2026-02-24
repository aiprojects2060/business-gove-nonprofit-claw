import { usFederalAgents } from "./us/federal.js";
import { usStateAgents } from "./us/state.js";
import { usLocalAgents } from "./us/local.js";
import { usAgencyAgents } from "./us/agencies.js";
import { usCivilAgents } from "./us/civil.js";
import { usSpecialAgents } from "./us/special.js";
import { ukAgents } from "./uk/index.js";

// Combine all government agents
export const governmentAgents = [
  ...usFederalAgents,
  ...usStateAgents,
  ...usLocalAgents,
  ...usAgencyAgents,
  ...usCivilAgents,
  ...usSpecialAgents,
  ...ukAgents
];
