import K4Actor, {K4ActorType} from "../documents/K4Actor";
import K4ChatMessage from "../documents/K4ChatMessage";
import K4Item from "../documents/K4Item";

import "./general-types";
import "./system-types";
import "./fvtt-types-config";
import "./weird-hacks";

declare module "virtual:colors" {
  export const Colors: Record<string, string>;
}