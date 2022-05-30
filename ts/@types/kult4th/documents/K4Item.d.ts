import * as ITEMDATA from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import K4Item from '../../../../declarations/scripts/documents/K4Item';
import {ItemType} from "../../../documents/K4Item";

import K4ItemSheet from '../../../documents/K4ItemSheet';

declare global {
	type ItemData = ITEMDATA.ItemData;

	namespace K4Item {
		export type Any = ConfiguredDocumentClass<K4Item<ItemType>>;
		export type Move = ConfiguredDocumentClass<K4Item<ItemType.move>>;
		export type Attack = ConfiguredDocumentClass<K4Item<ItemType.attack>>;
		export type Advantage = ConfiguredDocumentClass<K4Item<ItemType.advantage>>;
		export type Disadvantage = ConfiguredDocumentClass<K4Item<ItemType.disadvantage>>;
		export type DarkSecret = ConfiguredDocumentClass<K4Item<ItemType.darksecret>>;
		export type Weapon = ConfiguredDocumentClass<K4Item<ItemType.weapon>>;
		export type Relation = ConfiguredDocumentClass<K4Item<ItemType.relation>>;
		export type Gear = ConfiguredDocumentClass<K4Item<ItemType.gear>>;
	}

	interface K4ItemData<Type extends ItemType> extends ItemData {
		data: ItemData["data"] & {
			sourceItem: K4Item<ItemType> | ""
		}
	}

	namespace K4ItemSheet {
		export interface Options extends ItemSheet.Options { }
		export interface Data<Options extends K4ItemSheet.Options = K4ItemSheet.Options> extends ItemSheet.Data<Options> { }
	}

	namespace K4Collection {
		export type Item = EmbeddedCollection<K4Item.Any, ActorData>;
		export type Move = EmbeddedCollection<K4Item.Move, ActorData>;
		export type Attack = EmbeddedCollection<K4Item.Attack, ActorData>;
		export type Advantage = EmbeddedCollection<K4Item.Advantage, ActorData>;
		export type Disadvantage = EmbeddedCollection<K4Item.Disadvantage, ActorData>;
		export type DarkSecret = EmbeddedCollection<K4Item.DarkSecret, ActorData>;
		export type Weapon = EmbeddedCollection<K4Item.Weapon, ActorData>;
		export type Relation = EmbeddedCollection<K4Item.Relation, ActorData>;
		export type Gear = EmbeddedCollection<K4Item.Gear, ActorData>;
	}
}