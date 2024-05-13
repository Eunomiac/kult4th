import EmbeddedCollection from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs";
import {
  ItemDataBaseProperties as _ItemDataBaseProperties,
  ItemDataConstructorData as _ItemDataConstructorData,
  ItemDataSchema as _ItemDataSchema,
  ItemDataSource as _ItemDataSource
} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import {ItemData as _ItemData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import {ConfiguredDocumentClass as _ConfiguredDocumentClass} from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";


declare global {
  export type EmbeddedCollection = EmbeddedCollection;
  export type ItemDataBaseProperties = _ItemDataBaseProperties;
  export type ItemDataConstructorData = _ItemDataConstructorData;
  export type ItemDataSchema = _ItemDataSchema;
  export type ItemDataSource = _ItemDataSource;
  export type ItemData = _ItemData;
  export type ConfiguredDocumentClass = _ConfiguredDocumentClass;
}