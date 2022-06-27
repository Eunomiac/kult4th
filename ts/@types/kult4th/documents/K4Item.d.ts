import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import {ItemDataBaseProperties, ItemDataSchema} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import {ItemData} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import {ConfiguredDocumentClass} from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import K4Item, {K4ItemType, K4ItemSubType, K4ItemRange, K4WeaponClass, K4ItemResultType} from "../../../documents/K4Item.js";
import K4ItemSheet from '../../../documents/K4ItemSheet';
import { K4Attribute } from '../../../scripts/constants';

declare global {

	// interface K4ItemDataBaseProperties<Type extends K4ItemType> extends ItemDataBaseProperties {
	// 	data:
	// }

	declare const enum K4ItemType {
		advantage = "advantage",
		disadvantage = "disadvantage",
		move = "move",
		darksecret = "darksecret",
		relation = "relation",
		gear = "gear",
		attack = "attack",
		weapon = "weapon"
	}

	declare const enum K4ItemSubType {
		activeRolled = "active-rolled",
		activeStatic = "active-static",
		passive = "passive"
	}
	declare const enum K4ItemRange {
		arm = "arm",
		room = "room",
		field = "field",
		horizon = "horizon"
	}
	declare const enum K4WeaponClass {
		meleeUnarmed = "melee-unarmed",
		meleeCrush = "melee-crush",
		meleeSlash = "melee-slash",
		meleeStab = "melee-stab",
		firearm = "firearm",
		bomb = "bomb"
	}
	declare const enum K4ItemResultType {
		completeSuccess = "completeSuccess",
		partialSuccess = "partialSuccess",
		failure = "failure"
	}

	type WeaponSubClass<T extends K4WeaponClass> =
		T extends K4WeaponClass.meleeUnarmed ? ("")
	: T extends K4WeaponClass.meleeCrush ? ("")
	: T extends K4WeaponClass.meleeSlash ? ("sword" | "")
	: T extends K4WeaponClass.meleeStab ? ("")
	: T extends K4WeaponClass.firearm ? ("rifle" | "pistol" | "sniper-rifle" | "")
	: T extends K4WeaponClass.bomb ? ("")
	: "";



	namespace K4ItemClass {
		export type Move = K4Item<K4ItemType.move>;
		export type Attack = K4Item<K4ItemType.attack>;
		export type Advantage = K4Item<K4ItemType.advantage>;
		export type Disadvantage = K4Item<K4ItemType.disadvantage>;
		export type DarkSecret = K4Item<K4ItemType.darksecret>;
		export type Weapon = K4Item<K4ItemType.weapon>;
		export type Relation = K4Item<K4ItemType.relation>;
		export type Gear = K4Item<K4ItemType.gear>
	}
	namespace K4ItemDataSchema {

		interface Base {
			description: string,
			lists: Record<string, {
				name: string,
				items: string[],
				intro?: string
			}>,
			isCustom: boolean,
			pdfLink: string,
			subType: K4ItemSubType
		}

		interface HasSubItems<T = K4ItemType.move | K4ItemType.attack> {
			subItems: Array<K4ItemData<T>>
		}

		interface CanSubItem {
			sourceItem?: {
				name: string,
				id?: string | null,
				type: K4ItemType
			}
		}

		interface RulesData<T extends K4ItemType> {
			rules: T extends K4ItemType.move | K4ItemType.attack
				? {
					intro?: string,
					trigger: string,
					outro: string,
					listRefs?: string[],
					effectFunctions?: string[],
					holdText?: string
				}
				: {
					intro?: string,
					outro?: string,
					listRefs?: string[],
					effectFunctions?: string[],
					holdText?: string
				}
		}

		interface ResultsData<ST extends K4ItemSubType = K4ItemSubType.activeRolled> {
			results: ST extends K4ItemSubType.activeRolled
			? Record<
					K4ItemResultType,
					{
						result: string,
						listRefs?: string[],
						effectFunctions?: string[],
						edges: posInt,
						hold: posInt
					}
				> & {
					listRefs?: string[]
				}
			: undefined
		}

		export interface Move<ST extends K4ItemSubType = K4ItemSubType> extends Base, CanSubItem, RulesData<K4ItemType.move>, ResultsData<ST> {
			attribute: K4Attribute
		}
		export interface Attack extends Move<K4ItemSubType.activeRolled> {
			range: RangeType[],
			harm: posInt,
			ammo: posInt
		}
		export interface Advantage extends Base, HasSubItems, RulesData<K4ItemType.advantage> {
			attribute: K4Attribute,
			currentHold: posInt,
			currentEdges: posInt
		}
		export interface Disadvantage extends Base, HasSubItems, RulesData<K4ItemType.disadvantage> {
			attribute: K4Attribute,
			currentHold: posInt
		}

		export interface DarkSecret extends Base, RulesData<K4ItemType.darksecret> {
			drive: string,
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

		export interface Weapon<C extends WeaponClass, SC extends WeaponSubClass<C>> extends Base, HasSubItems<K4ItemSubType>, RulesData<K4ItemType.weapon> {
			class: C,
			subClass: SC,
			ammo: {
				min: number,
				max: number,
				value: number
			}
		}

		export interface Gear extends Base, RulesData {
			armor: number
		}
	}

	type K4ItemConstructorData<Type extends K4ItemType = K4ItemType> = {
		name: string,
		img: string,
		type: K4ItemType,
		data: (Type extends K4ItemType.move ? K4ItemDataSchema.Move
			: Type extends K4ItemType.attack ? K4ItemDataSchema.Attack
			: Type extends K4ItemType.advantage ? K4ItemDataSchema.Advantage
			: Type extends K4ItemType.disadvantage ? K4ItemDataSchema.Disadvantage
			: Type extends K4ItemType.darksecret ? K4ItemDataSchema.DarkSecret
			: Type extends K4ItemType.weapon ? K4ItemDataSchema.Weapon
			: Type extends K4ItemType.relation ? K4ItemDataSchema.Relation
			: Type extends K4ItemType.gear ? K4ItemDataSchema.Gear
			: never),

	}

	type K4ItemData<Type extends K4ItemType = K4ItemType> = {
		name: string,
		img: string,
		type: K4ItemType,
		data: (Type extends K4ItemType.move ? K4ItemDataSchema.Move
		: Type extends K4ItemType.attack ? K4ItemDataSchema.Attack
		: Type extends K4ItemType.advantage ? K4ItemDataSchema.Advantage
		: Type extends K4ItemType.disadvantage ? K4ItemDataSchema.Disadvantage
		: Type extends K4ItemType.darksecret ? K4ItemDataSchema.DarkSecret
		: Type extends K4ItemType.weapon ? K4ItemDataSchema.Weapon
		: Type extends K4ItemType.relation ? K4ItemDataSchema.Relation
		: Type extends K4ItemType.gear ? K4ItemDataSchema.Gear
		: never),
		folder: string,
		_id: string | null,
		effects: any[],
		sort: number,
		permission: Record<string,0|1|2|3|undefined>,
		flags: Record<string,any>
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