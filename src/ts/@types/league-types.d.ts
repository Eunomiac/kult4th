// import _EmbeddedCollection from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs";
import {
  ItemDataBaseProperties as _ItemDataBaseProperties,
  ItemDataConstructorData as _ItemDataConstructorData,
  ItemDataSchema as _ItemDataSchema,
  ItemDataSource as _ItemDataSource
} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import _Document from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs";
import {ItemData as _ItemData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import {ConfiguredDocumentClass as _ConfiguredDocumentClass} from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import {ChatMessageDataConstructorData as _ChatMessageConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData";
import {Context as _Context} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs";
import {
  ActiveEffectDataConstructorData as _ActiveEffectDataConstructorData,
  ActiveEffectData as _ActiveEffectData
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData';


declare module "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData" {
  // Extract the unexported interface for ActiveEffect changes data
  export interface EffectChangeDataProperties {
    key: string;
    value: string;
    mode: number;
    priority: number | null | undefined;
  }
}

declare global {

  /**
   * Retrieves the current Game instance.
   * @returns The current Game instance.
   * @throws Error if the Game is not ready.
 */
  function getGame(): ReadyGame;

  /**
   * Retrieves the current User instance.
   * @returns The current User instance.
   * @throws Error if the User is not ready.
   */
  function getUser(): User;

  /**
   * Retrieves the PC actor owned by the current user.
   * @returns The current Actor instance.
   * @throws Error if the Actor is not ready.
   */
  function getActor(): K4Actor<K4ActorType.pc>;
  /**
   * Retrieves the current I18n instance.
   * @returns The current I18n instance.
   * @throws Error if the I18n is not ready.
   */
  function getLocalizer(): I18n;
  /**
   * Retrieves the current Notifications instance.
   * @returns The current Notifications instance.
   * @throws Error if the Notifications are not ready.
   */
  function getNotifier(): Notifications;



  // export type EmbeddedCollection<T, U> = foundry.abstract.EmbeddedCollection<T, U>;

  // export class EmbeddedCollection<
  //   ContainedDocumentConstructor extends foundry.abstract.DocumentConstructor,
  //   ParentDocumentData extends foundry.abstract.AnyDocumentData
  // > extends _EmbeddedCollection<ContainedDocumentConstructor, ParentDocumentData> { }

  // export type FoundryDoc<
  //   ConcreteDocumentData extends foundry.abstract.AnyDocumentData = foundry.abstract.AnyDocumentData,
  //   Parent extends foundry.abstract.Document<unknown, unknown> | null = null,
  //   ConcreteMetadata extends foundry.abstract.Metadata<unknown> = foundry.abstract.Metadata<unknown>
  // > = _Document<ConcreteDocumentData, Parent, ConcreteMetadata>;
  // export class FoundryDoc<
  //   ConcreteDocumentData extends foundry.abstract.AnyDocumentData = foundry.abstract.AnyDocumentData,
  //   Parent extends foundry.abstract.Document<unknown, unknown> | null = null,
  //   ConcreteMetadata extends foundry.abstract.Metadata<unknown> = foundry.abstract.Metadata<unknown>
  // > extends _Document<ConcreteDocumentData, Parent, ConcreteMetadata> { }

  // export type ItemDataBaseProperties = _ItemDataBaseProperties;
  export type ItemDataConstructorData = _ItemDataConstructorData;
  // export type ItemDataSchema = _ItemDataSchema;
  // export type ItemDataSource = _ItemDataSource;
  // export type ItemData = _ItemData;
  // export type ConfiguredDocumentClass = _ConfiguredDocumentClass;
  // export type ChatMessageDataConstructorData = _ChatMessageConstructorData;
  // export type Context = _Context;
  // export type ActiveEffectDataConstructorData = _ActiveEffectDataConstructorData;
  // export type ActiveEffectData = _ActiveEffectData;
  // export type EffectChangeData = import("@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData").EffectChangeDataProperties;

  // export type Evaluated<T extends Roll> = T & { _evaluated: true; _total: number; get total(): number };
}