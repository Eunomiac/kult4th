// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import type EmbeddedCollection from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs.js";
import type {ConfiguredDocumentClass} from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js";
import C from "../../../scripts/constants";

import * as ACTORDATA from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";
import K4ActiveEffect from "../../../documents/K4ActiveEffect";

import K4PCSheet from "../../../documents/K4PCSheet";
import K4NPCSheet from "../../../documents/K4NPCSheet";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

declare global {


  // namespace K4ActiveEffectTemplateData {
  //   export interface nextRollMod {
  //   }
  // }

  // namespace K4ActiveEffectSourceData {
  //   export interface pc {
  //     type: K4ActiveEffectType.pc,
  //     data: K4ActiveEffectTemplateData.pc
  //   }
  //   export interface npc {
  //     type: K4ActiveEffectType.npc,
  //     data: K4ActiveEffectTemplateData.npc
  //   }

  //   export type any = pc|npc
  // }

  // namespace K4ActiveEffectPropertiesData {
  //   export interface pc extends K4ActiveEffectTemplateData.pc {
  //     moves: Array<K4Item<K4ItemType.move>>;
  //     basicMoves: Array<K4Item<K4ItemType.move>>;
  //     derivedMoves: Array<K4Item<K4ItemType.move>>;

  //     attacks: Array<K4Item<K4ItemType.attack>>;
  //     advantages: Array<K4Item<K4ItemType.advantage>>;
  //     disadvantages: Array<K4Item<K4ItemType.disadvantage>>;
  //     darkSecrets: Array<K4Item<K4ItemType.darksecret>>;
  //     weapons: Array<K4Item<K4ItemType.weapon>>;
  //     gear: Array<K4Item<K4ItemType.gear>>;
  //     relations: Array<K4Item<K4ItemType.relation>>;
  //   }
  //   export interface npc extends K4ActiveEffectTemplateData.npc {
  //     moves: Array<K4Item<K4ItemType.move>>;
  //   }

  // }

  // namespace K4ActiveEffectData {
  //   export interface pc {
  //     type: K4ActiveEffectType.pc,
  //     data: K4ActiveEffectPropertiesData.pc
  //   }
  //   export interface npc {
  //     type: K4ActiveEffectType.npc,
  //     data: K4ActiveEffectPropertiesData.npc
  //   }

  //   export type any = pc|npc
  // }
}