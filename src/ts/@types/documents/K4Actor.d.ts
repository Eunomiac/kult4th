// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import type EmbeddedCollection from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs.js";
import type {ConfiguredDocumentClass} from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js";
import C from "../../../scripts/constants";

import * as ACTORDATA from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";
import K4Actor, {K4ActorType, K4Attribute, K4RollType, K4WoundType} from "../../../documents/K4Actor";

import K4PCSheet from "../../../documents/K4PCSheet";
import K4NPCSheet from "../../../documents/K4NPCSheet";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

declare global {


  type K4CharAttribute = Exclude<K4Attribute, K4Attribute.ask|K4Attribute.zero>;
  type K4RollableAttribute = Exclude<K4Attribute, K4Attribute.ask>

  type K4RollSource = K4RollableItem|K4RollableAttribute;

  type K4ModTargets = Record<string, number>;
  type K4RollModData = {
    category: string,
    display: string,
    targets: K4ModTargets
  }
  type K4RollMod = {
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
    id: string,
    description: string,
    isCritical: boolean,
    isStabilized: boolean
  }
  namespace Archetype {
    export type Any = Sleeper | Custom | Aware | Awakened;
    export type Sleeper = "sleeper";
    export type Custom = "custom";
    export type Aware = typeof C.awareArchetypes[number];
    export type Awakened = typeof C.enlightenedArchetypes[number];
  }
  namespace Attribute {
    export type Any = Active | Passive;
    export type Active = keyof typeof C.Attributes.Active;
    export type Passive = keyof typeof C.Attributes.Passive;
  }
  namespace K4ActorSourceSchema {
    export interface pc {
      archetype: Archetype.Any,
      description: string,
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
      attributes: {
        [K4Attribute.willpower]: {
          min: int,
          max: int,
          value: int
        },
        [K4Attribute.fortitude]: {
          min: int,
          max: int,
          value: int
        },
        [K4Attribute.reflexes]: {
          min: int,
          max: int,
          value: int
        },
        [K4Attribute.reason]: {
          min: int,
          max: int,
          value: int
        },
        [K4Attribute.perception]: {
          min: int,
          max: int,
          value: int
        },
        [K4Attribute.coolness]: {
          min: int,
          max: int,
          value: int
        },
        [K4Attribute.violence]: {
          min: int,
          max: int,
          value: int
        },
        [K4Attribute.charisma]: {
          min: int,
          max: int,
          value: int
        },
        [K4Attribute.soul]: {
          min: int,
          max: int,
          value: int
        }
      },
      wounds: Record<string, K4Wound>,
      modifiers: {
        wounds_serious: K4ModTargets[],
        wounds_critical: K4ModTargets[],
        wounds_seriouscritical: K4ModTargets[],
        stability: K4ModTargets[]
      },
      stability: {
        min: int,
        max: int,
        value: int
      },
      edges: {
        sourceName: string,
        value: posInt
      }
    }
    export interface npc extends Pick<pc, description|wounds|penalties> { }
  }

  namespace K4ActorSourceData {
    export interface pc {
      type: K4ActorType.pc,
      data: K4ActorSourceSchema.pc
    }
    export interface npc {
      type: K4ActorType.npc,
      data: K4ActorSourceSchema.npc
    }

    export type any = pc|npc
  }

  namespace K4ActorPropertiesSchema {
    export interface pc extends K4ActorSourceSchema.pc {
      moves: Array<K4ItemSpec<K4ItemType.move>>;
      basicMoves: Array<K4ItemSpec<K4ItemType.move>>;
      derivedMoves: Array<K4ItemSpec<K4ItemType.move>>;
      attacks: Array<K4ItemSpec<K4ItemType.attack>>;
      advantages: Array<K4ItemSpec<K4ItemType.advantage>>;
      disadvantages: Array<K4ItemSpec<K4ItemType.disadvantage>>;
      darkSecrets: Array<K4ItemSpec<K4ItemType.darksecret>>;
      weapons: Array<K4ItemSpec<K4ItemType.weapon>>;
      gear: Array<K4ItemSpec<K4ItemType.gear>>;
      relations: Array<K4ItemSpec<K4ItemType.relation>>;

      maxWounds: {
        serious: int,
        critical: int,
        total: int
      }

      modifiersReport: string,

      edges: {
        sourceName: string,
        value: posInt,
        items: string[]
      }

      stability: {
        min: int,
        max: int,
        value: int,
        statusOptions: string[]
      }
    }
    export interface npc extends K4ActorSourceSchema.npc {
      moves: Array<K4ItemSpec<K4ItemType.move>>;
    }

  }

  namespace K4ActorPropertiesData {
    export interface pc {
      type: K4ActorType.pc,
      data: K4ActorPropertiesSchema.pc
    }
    export interface npc {
      type: K4ActorType.npc,
      data: K4ActorPropertiesSchema.npc
    }

    export type any = pc|npc
  }

  type K4ActorSchema<T extends K4ActorType = K4ActorType> = (T extends K4ActorType.pc ? K4ActorPropertiesSchema.pc
    : T extends K4ActorType.npc ? K4ActorPropertiesSchema.npc
    : K4ActorPropertiesSchema.pc & K4ActorPropertiesSchema.npc)

  type K4ActorData<T extends K4ActorType = K4ActorType> = (T extends K4ActorType.pc ? K4ActorPropertiesData.pc
    : T extends K4ActorType.npc ? K4ActorPropertiesData.npc
    : K4ActorPropertiesData.pc & K4ActorPropertiesData.npc)
}