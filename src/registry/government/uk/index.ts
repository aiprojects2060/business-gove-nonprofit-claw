import { ukNationalAgents } from "./national.js";
import { ukDevolvedAgents } from "./devolved.js";
import { ukLocalAgents } from "./local.js";

import { ukPublicServiceAgents } from "./public_services.js";
import { ukCivilAgents } from "./civil.js";

export const ukAgents = [
  ...ukNationalAgents,
  ...ukDevolvedAgents,
  ...ukLocalAgents,
  ...ukPublicServiceAgents,
  ...ukCivilAgents
];
