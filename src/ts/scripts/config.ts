import {Colors, K4Attribute} from "./constants.js";

const K4Config = {
  colors: Colors,
  attributes: {
    [K4Attribute.reason]: "kult4th.trait.reason",
    [K4Attribute.intuition]: "kult4th.trait.intuition",
    [K4Attribute.perception]: "kult4th.trait.perception",
    [K4Attribute.coolness]: "kult4th.trait.coolness",
    [K4Attribute.violence]: "kult4th.trait.violence",
    [K4Attribute.charisma]: "kult4th.trait.charisma",
    [K4Attribute.soul]: "kult4th.trait.soul",
    [K4Attribute.fortitude]: "kult4th.trait.fortitude",
    [K4Attribute.willpower]: "kult4th.trait.willpower",
    [K4Attribute.reflexes]: "kult4th.trait.reflexes"
  }
} as const;

export default K4Config;