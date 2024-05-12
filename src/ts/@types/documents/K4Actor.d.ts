// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import type EmbeddedCollection from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs.js";
import type {ConfiguredDocumentClass} from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js";
import C, {K4Attribute} from "../../scripts/constants";

import * as ACTORDATA from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";
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
      attributes: Record<K4CharAttribute, ValueMax>,
      wounds: Record<keyof typeof this["data"]["data"]["wounds"], K4Wound>,
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
        sourceName: string,
        value: PosInteger
      }
    }
    export interface npc extends Pick<pc, "description"|"wounds"|"penalties"> { }
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
        serious: Integer,
        critical: Integer,
        total: Integer
      }

      modifiersReport: string,

      edges: {
        sourceName: string,
        value: PosInteger,
        items: string[]
      }

      stability: {
        min: Integer,
        max: Integer,
        value: Integer,
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

  type K4ActorSpec<Type extends K4ActorType> = K4Actor
  & {
    type: Type,
    system: K4ActorSchema<Type>,
    data: {
      type: Type,
      _source: {
        type: Type
      }
    }
  }
}