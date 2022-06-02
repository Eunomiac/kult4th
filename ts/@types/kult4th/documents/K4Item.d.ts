import {ItemDataSchema} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import {ItemData} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import { ConfiguredDocumentClass } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import K4Item from '../../../../declarations/scripts/documents/K4Item';
import {K4ItemType} from "../../../documents/K4Item";
import K4ItemSheet from '../../../documents/K4ItemSheet';

declare global {

	// namespace K4ItemClass {
	// 	export type Any = ConfiguredDocumentClass<K4Item<ItemType>>;
	// 	export type Move = ConfiguredDocumentClass<K4Item<ItemType.move>>;
	// 	export type Attack = ConfiguredDocumentClass<K4Item<ItemType.attack>>;
	// 	export type Advantage = ConfiguredDocumentClass<K4Item<ItemType.advantage>>;
	// 	export type Disadvantage = ConfiguredDocumentClass<K4Item<ItemType.disadvantage>>;
	// 	export type DarkSecret = ConfiguredDocumentClass<K4Item<ItemType.darksecret>>;
	// 	export type Weapon = ConfiguredDocumentClass<K4Item<ItemType.weapon>>;
	// 	export type Relation = ConfiguredDocumentClass<K4Item<ItemType.relation>>;
	// 	export type Gear = ConfiguredDocumentClass<K4Item<ItemType.gear>>;
	// }

	namespace K4ItemDataDataSchema {
		export interface Move {
			description: string,
			intro: string,
			trigger: string,
			outro: string,
			attribute: Attribute.Any,
			notes: string,
			completeSuccess: {
				result: string,
				optionsLists: string[],
				edges: posInt,
				hold: posInt
			},
			partialSuccess: {
				result: string,
				optionsLists: string[],
				edges: posInt,
				hold: posInt
			},
			failure: {
				result: string,
				optionsLists: string[],
				edges: posInt,
				hold: posInt
			},
			lists: {
				questions: string[],
				options: string[],
				edges: string[],
				attacks: string[],
				complications: string[],
				gmoptions: string[],
				other: Record<string, string[]>
			},
			sourceItem: {
				name: string,
				id: string,
				type: K4ItemType
			},
			canGrantHold: boolean,
			holdText: string
		}
		export interface Advantage {

		}
	}

	type K4ItemOptions = ItemSheet.Options;

	type K4ItemData<Type extends K4ItemType> = ItemData["data"]
		& (Type extends K4ItemType.move ? K4ItemDataSchema.Move
		: Type extends K4ItemType.attack ? K4ItemDataSchema.Attack
		: Type extends K4ItemType.advantage ? K4ItemDataSchema.Advantage
		: Type extends K4ItemType.disadvantage ? K4ItemDataSchema.Disadvantage
		: Type extends K4ItemType.darksecret ? K4ItemDataSchema.DarkSecret
		: Type extends K4ItemType.weapon ? K4ItemDataSchema.Weapon
		: Type extends K4ItemType.relation ? K4ItemDataSchema.Relation
		: Type extends K4ItemType.gear ? K4ItemDataSchema.Gear
		: never);

	// interface K4ItemData<Type extends ItemType> extends ItemData {
	// 	intro: any;
	// 	data: Type extends ItemType.move ? ItemData["data"] & K4ItemSchema.Move
	// 		: Type extends ItemType.attack ? ItemData["data"] & K4ItemSchema.Attack
	// 		: Type extends ItemType.advantage ? ItemData["data"] & K4ItemSchema.Advantage
	// 		: Type extends ItemType.disadvantage ? ItemData["data"] & K4ItemSchema.Disadvantage
	// 		: Type extends ItemType.darksecret ? ItemData["data"] & K4ItemSchema.DarkSecret
	// 		: Type extends ItemType.weapon ? ItemData["data"] & K4ItemSchema.Weapon
	// 		: Type extends ItemType.relation ? ItemData["data"] & K4ItemSchema.Relation
	// 		: Type extends ItemType.gear ? ItemData["data"] & K4ItemSchema.Gear
	// 		: never;
	// }

	namespace K4ItemSheet {
		export interface Options extends ItemSheet.Options { }
		export interface Data<Options extends K4ItemSheet.Options> extends K4ItemData<K4ItemType> { }
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