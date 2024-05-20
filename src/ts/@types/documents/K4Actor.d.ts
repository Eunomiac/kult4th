// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import C, {K4Attribute, Archetype} from "../../scripts/constants";
import K4Actor, {K4ActorType, K4RollType, K4WoundType} from "../../documents/K4Actor";
import K4Item, {K4ItemType} from "../../documents/K4Item.js";
import {K4RollType} from "../../documents/K4Roll.js";

import K4PCSheet from "../../documents/K4PCSheet";
import K4NPCSheet from "../../documents/K4NPCSheet";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

declare global {


  type K4CharAttribute = Exclude<K4Attribute, K4Attribute.ask|K4Attribute.zero>;
  type K4RollableAttribute = Exclude<K4Attribute, K4Attribute.ask>

  type K4RollSource = K4RollableItem|K4RollableAttribute;

  type K4ModTargets = Record<string, number>;
  interface K4RollModData {
    category: string,
    display: string,
    targets: K4ModTargets
  }
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
  interface K4Wound {
    id: IDString,
    description: string,
    isCritical: boolean,
    isStabilized: boolean
  }
  // namespace Archetype {
  //   export type Any = Sleeper | Custom | Aware | Awakened;
  //   export type Sleeper = "sleeper";
  //   export type Custom = "custom";
  //   export type Aware = typeof C.awareArchetypes[number];
  //   export type Awakened = typeof C.enlightenedArchetypes[number];
  // }
  namespace Attribute {
    export type Any = Active | Passive;
    export type Active = keyof typeof C.Attributes.Active;
    export type Passive = keyof typeof C.Attributes.Passive;
  }



  namespace PromptInput {
    export type Type = "text"|"number"|"checkbox"|"select"|"button";

    interface Base {
      label: string,
      key: string
    }

    interface InputText extends Base {
      type: "text",
      placeholder: string
    }

    interface InputNumber extends Base {
      type: "number",
      default: number,
      min: number,
      max: number
    }

    interface InputCheckbox extends Base {
      type: "checkbox",
      default: boolean
    }

    interface InputSelect extends Base {
      type: "select",
      choices: Record<string, string>,
      default: keyof InputSelect["choices"]
    }

    interface InputButton extends Base {
      type: "button"
    }

    export type Data = InputText|InputNumber|InputCheckbox|InputSelect|InputButton;
  }



  namespace K4ActorSourceSchema {

    interface Base {
      description: string,
      wounds: Record<IDString, K4Wound>,
      penalties: Record<IDString, number>
    }
    export interface pc extends Base {
      archetype: Archetype,
      history: string,
      dramaticHooks: [
        {
          value: string,
          isChecked: boolean
        },
        {
          value: string,
          isChecked: boolean
        }
      ],
      attributes: Record<K4CharAttribute, ValueMax>,
      modifiers: {
        wounds_serious: K4ModTargets[],
        wounds_critical: K4ModTargets[],
        wounds_seriouscritical: K4ModTargets[],
        stability: K4ModTargets[]
      },
      stability: {
        min: Integer,
        max: Integer,
        value: Integer
      },
      edges: {
        source: string, // Actual edges are subMoves of this item
        value: PosInteger,
        max: PosInteger,
        min: 0
      }
    }

    export interface npc extends Base { }
  }

  namespace K4ActorSystemSchema {
    export interface pc extends K4ActorSourceSchema.pc {
      moves: Array<K4Item<K4ItemType.move>>;
      basicMoves: Array<K4Item<K4ItemType.move>>;
      derivedMoves: Array<K4Item<K4ItemType.move>>;
      attacks: Array<K4Item<K4ItemType.attack>>;
      advantages: Array<K4Item<K4ItemType.advantage>>;
      disadvantages: Array<K4Item<K4ItemType.disadvantage>>;
      darkSecrets: Array<K4Item<K4ItemType.darksecret>>;
      weapons: Array<K4Item<K4ItemType.weapon>>;
      gear: Array<K4Item<K4ItemType.gear>>;
      relations: Array<K4Item<K4ItemType.relation>>;

      maxWounds: {
        serious: Integer,
        critical: Integer,
        total: Integer
      }

      modifiersReport: string;

      stability: {
        min: Integer,
        max: Integer,
        value: Integer,
        statusOptions: string[]
      }
    }
    export interface npc extends K4ActorSourceSchema.npc {
      moves: Array<K4Item<K4ItemType.move>>;
    }
    export type any = pc|npc

  }

  type K4ActorSystem<T extends K4ActorType = K4ActorType> = (T extends K4ActorType.pc ? K4ActorSystemSchema.pc
    : T extends K4ActorType.npc ? K4ActorSystemSchema.npc
    : K4ActorSystemSchema.pc | K4ActorSystemSchema.npc)

}