
import {K4Attribute} from "../../scripts/constants.js";

declare global {

  type K4RollModData = Record<string, number>;

  type K4RollSource = K4RollableItem|K4CharAttribute|K4Attribute.zero;

  type K4RollAttribute = Exclude<K4Attribute, K4Attribute.ask>;
  interface K4RollOptions {
    type: K4RollType|K4ItemType.move|K4ItemType.attack,
    isAssisting?: boolean,
    modifiers?: K4RollMod[]
  }
  interface K4RollData {
    type: K4RollType,
    source: K4RollSource,
    attrVal: number,
    modifiers: Record<string, number>
  }
}