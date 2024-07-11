import _EmbeddedCollection from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs";
import {
  ItemDataBaseProperties as _ItemDataBaseProperties,
  ItemDataConstructorData as _ItemDataConstructorData,
  ItemDataSchema as _ItemDataSchema,
  ItemDataSource as _ItemDataSource
} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
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
  export type EmbeddedCollection<
    ContainedDocumentConstructor extends foundry.abstract.DocumentConstructor,
    ParentDocumentData extends foundry.abstract.AnyDocumentData
  > = _EmbeddedCollection<ContainedDocumentConstructor, ParentDocumentData>;

  export class EmbeddedCollection<
    ContainedDocumentConstructor extends foundry.abstract.DocumentConstructor,
    ParentDocumentData extends foundry.abstract.AnyDocumentData
  > extends _EmbeddedCollection<ContainedDocumentConstructor, ParentDocumentData> { }
  export type ItemDataBaseProperties = _ItemDataBaseProperties;
  export type ItemDataConstructorData = _ItemDataConstructorData;
  export type ItemDataSchema = _ItemDataSchema;
  export type ItemDataSource = _ItemDataSource;
  export type ItemData = _ItemData;
  export type ConfiguredDocumentClass = _ConfiguredDocumentClass;
  export type ChatMessageDataConstructorData = _ChatMessageConstructorData;
  export interface Context extends _Context {};
  export type ActiveEffectDataConstructorData = _ActiveEffectDataConstructorData;
  export type ActiveEffectData = _ActiveEffectData;
  export type EffectChangeData = import("@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData").EffectChangeDataProperties;

  export type Evaluated<T extends Roll> = T & { _evaluated: true; _total: number; get total(): number };
}