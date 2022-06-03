import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import {ItemDataSchema} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import {ItemData} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import { ConfiguredDocumentClass } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import K4Item, {K4ItemType} from "../../../documents/K4Item";
import K4ItemSheet from '../../../documents/K4ItemSheet';

declare global {

	type TraitType = "active-rolled" | "active-static" | "passive";
	type RangeType = "arm" | "room" | "field" | "horizon";

	type K4ConstructorData<Type extends K4ItemType> = Pick<K4ItemData<Type>,"name"|"type"|"img"|"data">;

	namespace K4ItemClass {
		// @ts-expect-error Why won't it let me use a generic here?
		export type Move = K4Item<K4ItemType.move>;
		// @ts-expect-error Why won't it let me use a generic here?
		export type Attack = K4Item<K4ItemType.attack>;
		// @ts-expect-error Why won't it let me use a generic here?
		export type Advantage = K4Item<K4ItemType.advantage>;
		// @ts-expect-error Why won't it let me use a generic here?
		export type Disadvantage = K4Item<K4ItemType.disadvantage>;
		// @ts-expect-error Why won't it let me use a generic here?
		export type DarkSecret = K4Item<K4ItemType.darksecret>;
		// @ts-expect-error Why won't it let me use a generic here?
		export type Weapon = K4Item<K4ItemType.weapon>;
		// @ts-expect-error Why won't it let me use a generic here?
		export type Relation = K4Item<K4ItemType.relation>;
		// @ts-expect-error Why won't it let me use a generic here?
		export type Gear = K4Item<K4ItemType.gear>
	}
	namespace K4ItemDataDataSchema {
		export interface Move {
			notes: string,
			intro: string,
			trigger: string,
			outro: string,
			attribute: Attribute.Any | "ask" | "",
			subType: TraitType,
			effectFunctions: string[],
			attacks: Array<K4ConstructorData<K4ItemType.attack>>,
			moves: Array<K4ConstructorData<K4ItemType.move>>,
			completeSuccess: {
				result: string,
				optionsLists: string[],
				effectFunctions: string[],
				edges: posInt,
				hold: posInt
			},
			partialSuccess: {
				result: string,
				optionsLists: string[],
				effectFunctions: string[],
				edges: posInt,
				hold: posInt
			},
			failure: {
				result: string,
				optionsLists: string[],
				effectFunctions: string[],
				edges: posInt,
				hold: posInt
			},
			lists: Record<string,{
				name: string,
				items: string[],
				intro?: string
			}>,
			sourceItem: {
				name: string,
				id: string,
				type: K4ItemType
			},
			holdText: string,
			description: string,
			isCustom: boolean,
			pdfLink: string
		}
		export interface Attack {
			intro: string,
			trigger: string,
			outro: string,
			attribute: Attribute.Any | "ask" | "",
			subType: "active-rolled",
			effectFunctions: string[],
			completeSuccess: {
				result: string,
				optionsLists: string[],
				effectFunctions: string[],
				edges: posInt,
				hold: posInt
			},
			partialSuccess: {
				result: string,
				optionsLists: string[],
				effectFunctions: string[],
				edges: posInt,
				hold: posInt
			},
			failure: {
				result: string,
				optionsLists: string[],
				effectFunctions: string[],
				edges: posInt,
				hold: posInt
			},
			lists: Record<string,{
				name: string,
				items: string[],
				intro?: string
			}>,
			range: string[],
			harm: posInt,
			effect: string,
			ammo: posInt,
			sourceItem: {
				name: string,
				id: string,
				type: K4ItemType
			},
			isCustom: boolean,
			pdfLink: string
		}
		export interface Advantage {
			description: string,
			intro: string,
			trigger: string,
			outro: string,
			attribute: Attribute.Any | "ask" | "",
			subType: TraitType,
			optionsLists: string[],
			lists: Record<string,{
				name: string,
				items: string[],
				intro?: string
			}>,
			effectFunctions: string[],
			attacks: Array<K4ItemDataDataSchema.Attack>,
			moves: Array<K4ItemDataDataSchema.Move>,
			details: string,
			isCustom: boolean,
			currentHold: posInt,
			holdText: string,
			pdfLink: string
		}
		export interface Disadvantage {
			description: string,
			intro: string,
			trigger: string,
			outro: string,
			attribute: Attribute.Any | "ask" | "",
			subType: TraitType,
			optionsLists: string[],
			lists: Record<string,{
				name: string,
				items: string[],
				intro?: string
			}>,
			effectFunctions: string[],
			attacks: Array<K4ItemDataDataSchema.Attack>,
			moves: Array<K4ItemDataDataSchema.Move>,
			details: string,
			isCustom: boolean,
			currentHold: posInt,
			holdText: string,
			pdfLink: string
		}

		export interface DarkSecret {
			description: string,
			suggestedDrives: string[],
			drive: "",
			optionsLists: string[],
			lists: Record<string,{
				name: string,
				items: string[],
				intro?: string
			}>,
			details: string,
			isCustom: boolean,
			currentHold: posInt,
			holdText: string,
			pdfLink: string
		}

		export interface Relation {
			target: string,
			description: string,
			details: string,
			strength: {
				min: number,
				max: number,
				value: number
			},
			isCustom: boolean,
			pdfLink: string
		}

		export interface Weapon {
			weaponClass: string,
			weaponName: string,
			exampleWeapons: string,
			description: string,
			attacks: Array<K4ItemDataDataSchema.Attack>,
			effectFunctions: string[],
			ammo: {
				min: number,
				max: number,
				value: number
			},
			details: string,
			isCustom: boolean,
			pdfLink: string
		}

		export interface Gear {
			description: string,
			armor: number,
			effectFunctions: string[],
			moves: Array<K4ItemDataDataSchema.Move>,
			attacks: Array<K4ItemDataDataSchema.Attack>,
			isCustom: boolean,
			holdText: string,
			pdfLink: string
		}
	}

	type K4ItemData<Type extends K4ItemType> = ItemData & {
		data: (Type extends K4ItemType.move ? K4ItemDataDataSchema.Move
		: Type extends K4ItemType.attack ? K4ItemDataDataSchema.Attack
		: Type extends K4ItemType.advantage ? K4ItemDataDataSchema.Advantage
		: Type extends K4ItemType.disadvantage ? K4ItemDataDataSchema.Disadvantage
		: Type extends K4ItemType.darksecret ? K4ItemDataDataSchema.DarkSecret
		: Type extends K4ItemType.weapon ? K4ItemDataDataSchema.Weapon
		: Type extends K4ItemType.relation ? K4ItemDataDataSchema.Relation
		: Type extends K4ItemType.gear ? K4ItemDataDataSchema.Gear
		: never)
	};

	namespace K4Collection {
		export type Item = EmbeddedCollection<ConstructorOf<K4Item>, ActorData>;
		export type Move = EmbeddedCollection<ConstructorOf<K4ItemClass.Move>, ActorData>;
		export type Attack = EmbeddedCollection<ConstructorOf<K4ItemClass.Attack>, ActorData>;
		export type Advantage = EmbeddedCollection<ConstructorOf<K4ItemClass.Advantage>, ActorData>;
		export type Disadvantage = EmbeddedCollection<ConstructorOf<K4ItemClass.Disadvantage>, ActorData>;
		export type DarkSecret = EmbeddedCollection<ConstructorOf<K4ItemClass.DarkSecret>, ActorData>;
		export type Weapon = EmbeddedCollection<ConstructorOf<K4ItemClass.Weapon>, ActorData>;
		export type Relation = EmbeddedCollection<ConstructorOf<K4ItemClass.Relation>, ActorData>;
		export type Gear = EmbeddedCollection<ConstructorOf<K4ItemClass.Gear>, ActorData>;
	}
}