import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import {ItemDataSchema} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import {ItemData} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import { ConfiguredDocumentClass } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import K4Item, {K4ItemType} from "../../../documents/K4Item";
import K4ItemSheet from '../../../documents/K4ItemSheet';

declare global {

	type TraitType = "active-rolled" | "active-static" | "passive";
	type RangeType = "arm" | "room" | "field" | "horizon";
	type AttributeEntry = Attribute.Any | "ask" | "0";
	type WeaponClass = "melee-unarmed" | "melee-crush" | "melee-slash" | "melee-stab" | "firearm" | "bomb";
	type WeaponSubClass<T extends WeaponClass> =
		T extends "melee-unarmed" ? ("")
	: T extends "melee-crush" ? ("")
	: T extends "melee-slash" ? ("sword" | "")
	: T extends "melee-stab" ? ("")
	: T extends "firearm" ? ("rifle" | "pistol" | "sniper-rifle" | "")
	: T extends "bomb" ? ("")
	: "";

	type RulesDef = {
		intro: string,
		trigger: string,
		outro: string,
		holdText: string,
		optionsLists: string[],
		effectFunctions: string[]
	}
	type ResultSchema = {
		result: string,
		optionsLists: string[],
		effectFunctions: string[],
		edges: posInt,
		hold: posInt
	};
	type ResultDef<T extends K4ItemType | undefined = undefined> = T extends K4ItemType.move ? {
		staticSuccess: ResultSchema,
		completeSuccess: ResultSchema,
		partialSuccess: ResultSchema,
		failure: ResultSchema
	} : T extends K4ItemType.attack ? {
		completeSuccess: ResultSchema,
		partialSuccess: ResultSchema,
		failure: ResultSchema
	} : {
		staticSuccess: ResultSchema
	}

	type ListDef = {
		name: string,
		items: string[],
		intro?: string
	}

	type SourceDef = {
		name: string,
		id: string,
		type: K4ItemType
	}

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

		interface Base {
			description: string,
			notes: string,
			lists: Record<string, ListDef>,
			subItems: Array<K4ConstructorData<K4ItemType>>,
			isCustom: boolean,
			pdfLink: string
		}

		interface Rules { rules: RulesDef }

		interface Results<T extends K4ItemType | undefined = undefined> { results: ResultDef<T> }

		export interface Move extends Base, Rules, Results<K4ItemType.move> {
			subType: TraitType,
			attribute: AttributeEntry,
			sourceItem?: SourceDef
		}
		export interface Attack extends Base, Rules, Results<K4ItemType.attack> {
			subType: TraitType,
			attribute: AttributeEntry,
			sourceItem: SourceDef,
			range: RangeType[],
			harm: posInt,
			ammo: posInt,
		}
		export interface Advantage extends Base, Rules, Results {
			subType: TraitType,
			attribute: AttributeEntry,
			currentHold: posInt,
			currentEdges: posInt
		}
		export interface Disadvantage extends Base, Rules, Results {
			subType: TraitType,
			attribute: AttributeEntry,
			currentHold: posInt
		}

		export interface DarkSecret extends Base, Rules {
			drive: "",
			currentHold: posInt,
			playerNotes: string,
			gmNotes: string
		}

		export interface Relation extends Base {
			target: string,
			strength: {
				min: number,
				max: number,
				value: number
			}
		}

		export interface Weapon<C extends WeaponClass, SC extends WeaponSubClass<C>> extends Base, Rules {
			class: C,
			subClass: SC,
			ammo: {
				min: number,
				max: number,
				value: number
			}
		}

		export interface Gear extends Base, Rules {
			armor: number
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

	declare interface K4ItemSheet<Type extends K4ItemType> {

	}

	declare class K4Item<Type extends K4ItemType> {
		data: K4ItemData<Type>
	}

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