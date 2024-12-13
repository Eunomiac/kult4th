import K4Actor, {K4ActorType} from "../documents/K4Actor.js";
import K4ChatMessage from "../documents/K4ChatMessage.js";
import K4Item from "../documents/K4Item.js";

import "./general-types.js";
import "./system-types.js";
import "./fvtt-types-config.js";
import "./weird-hacks.js";

declare module "virtual:colors" {
  export const Colors: Record<string, string>;
}