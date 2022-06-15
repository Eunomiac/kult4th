import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import {ItemDataSchema} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import {ItemData} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import { ConfiguredDocumentClass } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import K4Item, {K4ItemType, K4ItemSubType, K4ItemRange, K4WeaponClass, K4ItemResultType} from "../../../documents/K4Item";
import K4ItemSheet from '../../../documents/K4ItemSheet';

declare global {

	type AttributeEntry = Attribute.Any | "ask" | "0";
	type WeaponSubClass<T extends K4WeaponClass> =
		T extends K4WeaponClass.meleeUnarmed ? ("")
	: T extends K4WeaponClass.meleeCrush ? ("")
	: T extends K4WeaponClass.meleeSlash ? ("sword" | "")
	: T extends K4WeaponClass.meleeStab ? ("")
	: T extends K4WeaponClass.firearm ? ("rifle" | "pistol" | "sniper-rifle" | "")
	: T extends K4WeaponClass.bomb ? ("")
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
	type ResultDef<ST extends K4ItemSubType> = ST extends K4ItemSubType.activeRolled
			? {
					[K4ItemResultType.completeSuccess]: ResultSchema,
					[K4ItemResultType.partialSuccess]: ResultSchema,
					[K4ItemResultType.failure]: ResultSchema
			}
			: ST extends K4ItemSubType.activeStatic
			? {
				[K4ItemResultType.staticSuccess]: ResultSchema
			}
			: undefined;

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

	type K4ConstructorData<Type extends K4ItemType = K4ItemType> =  K4ItemData<Type>;

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
			subType: TraitType,
			description: string,
			notes: string,
			lists: Record<string, ListDef>,
			subItems: Array<K4ConstructorData<K4ItemType.move|K4ItemType.attack>>,
			isCustom: boolean,
			pdfLink: string
		}

		interface Rules { rules: RulesDef }

		interface Results<T extends K4ItemSubType = K4ItemSubType> { results: ResultDef<T> }

		export interface Move extends Base, Rules, Results {
			attribute: AttributeEntry,
			sourceItem?: SourceDef
		}
		export interface Attack extends Base, Results {
			attribute: AttributeEntry,
			sourceItem: SourceDef,
			range: RangeType[],
			harm: posInt,
			ammo: posInt,
		}
		export interface Advantage extends Base, Rules {
			attribute: AttributeEntry,
			currentHold: posInt,
			currentEdges: posInt
		}
		export interface Disadvantage extends Base, Rules {
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

	type K4ItemData<Type extends K4ItemType> = {
		name: string,
		img: string,
		type: K4ItemType,
		data: (Type extends K4ItemType.move ? K4ItemDataDataSchema.Move
		: Type extends K4ItemType.attack ? K4ItemDataDataSchema.Attack
		: Type extends K4ItemType.advantage ? K4ItemDataDataSchema.Advantage
		: Type extends K4ItemType.disadvantage ? K4ItemDataDataSchema.Disadvantage
		: Type extends K4ItemType.darksecret ? K4ItemDataDataSchema.DarkSecret
		: Type extends K4ItemType.weapon ? K4ItemDataDataSchema.Weapon
		: Type extends K4ItemType.relation ? K4ItemDataDataSchema.Relation
		: Type extends K4ItemType.gear ? K4ItemDataDataSchema.Gear
		: never),
		folder: string,
		_id: string | null,
		effects: any[],
		sort: number,
		permission: Record<string,0|1|2|3|undefined>,
		flags: Record<string,any>
	};

	declare interface K4ItemSheet<Type extends K4ItemType> {

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