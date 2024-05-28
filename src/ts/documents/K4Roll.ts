// #region IMPORTS ~
import {K4Attribute} from "../scripts/constants.js";
import {K4ItemType} from "./K4Item.js";

// #endregion

// #REGION === TYPES, ENUMS, INTERFACE AUGMENTATION === ~
// #region -- ENUMS ~
enum K4RollType {
  zero = "zero",
  attribute = "attribute",
  move = "move"
}
// #endregion
// #region -- TYPES ~

declare global {

  interface K4RollModData {
    category: string,
    display: string,
    targets: K4ModTargets
  }
  type K4RollableAttribute = K4CharAttribute|K4Attribute.zero;
  type K4RollSource = K4Item.Active|K4RollableAttribute;
  type K4ModTargets = Record<string, number>;

  interface K4RollMod {
    category: string,
    display: string,
    value: number
  }
  interface K4RollOptions {
    type: K4RollType|K4ItemType.move|K4ItemType.attack,
    isAssisting?: boolean,
    modifiers?: K4RollMod[]
  }
  interface K4RollData {
    type: K4RollType,
    source: K4RollSource,
    sourceType: K4ItemType|K4RollType.attribute,
    sourceName: string,
    sourceImg: string,
    attribute: Exclude<K4Attribute, K4Attribute.ask>,
    attrName: string,
    attrVal: number,
    modifiers: K4RollMod[]
  }

}
// #endregion
// #region -- INTERFACE AUGMENTATION ~

// #endregion
// #ENDREGION

class K4Roll extends Roll { }

// #region EXPORTS ~
export default K4Roll;

export {K4RollType}
// #endregion