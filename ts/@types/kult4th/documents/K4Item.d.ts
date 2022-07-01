import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import {ItemDataBaseProperties, ItemDataConstructorData, ItemDataSchema} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import {ItemData} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import {ConfiguredDocumentClass} from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import K4Item, {K4ItemType, K4ItemSubType, K4ItemRange, K4WeaponClass, K4ItemResultType} from "../../../documents/K4Item.js";
import K4ItemSheet from '../../../documents/K4ItemSheet';
import { K4Attribute } from '../../../scripts/constants';

declare global {

	type K4Item<T extends K4ItemType = K4ItemType> = InstanceType<typeof K4Item<T>>

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

	interface K4Wound { }
	namespace K4ItemTemplateData {

		interface Base {
			description: string,
			lists: Record<string, {
				name: string,
				items: string[],
				intro?: string,
				isEditable?: boolean
			}>,
			isCustom: boolean,
			pdfLink: string,
			subType: K4ItemSubType
		}

		interface HasSubItems {
			subItems: ItemDataSource[]
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

		interface ResultsData {
			results: Record<
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
		}

		export interface move extends Base, CanSubItem, RulesData<K4ItemType.move>, ResultsData {
			attribute: K4Attribute
		}
		export interface attack extends move {
			range: RangeType[],
			harm: posInt,
			ammo: posInt
		}
		export interface advantage extends Base, HasSubItems, RulesData<K4ItemType.advantage> {
			attribute: K4Attribute,
			currentHold: posInt,
			currentEdges: posInt
		}
		export interface disadvantage extends Base, HasSubItems, RulesData<K4ItemType.disadvantage> {
			attribute: K4Attribute,
			currentHold: posInt
		}

		export interface darksecret extends Base, RulesData<K4ItemType.darksecret> {
			drive: string,
			currentHold: posInt,
			playerNotes: string,
			gmNotes: string
		}

		export interface relation extends Base {
			target: string,
			strength: {
				min: number,
				max: number,
				value: number
			}
		}

		export interface weapon extends Base, HasSubItems, RulesData<K4ItemType.weapon> {
			class: C,
			subClass: SC,
			ammo: {
				min: number,
				max: number,
				value: number
			}
		}

		export interface gear extends Base, RulesData<K4ItemType.gear> {
			armor: number
		}
	}

	namespace K4ItemSourceData {
		export interface move {
			type: K4ItemType.move,
			data: K4ItemTemplateData.move
		}
		export interface attack {
			type: K4ItemType.attack,
			data: K4ItemTemplateData.attack
		}
		export interface advantage {
			type: K4ItemType.advantage,
			data: K4ItemTemplateData.advantage
		}
		export interface disadvantage {
			type: K4ItemType.disadvantage,
			data: K4ItemTemplateData.disadvantage
		}
		export interface darksecret {
			type: K4ItemType.darksecret,
			data: K4ItemTemplateData.darksecret
		}
		export interface relation {
			type: K4ItemType.relation,
			data: K4ItemTemplateData.relation
		}
		export interface weapon {
			type: K4ItemType.weapon,
			data: K4ItemTemplateData.weapon
		}
		export interface gear {
			type: K4ItemType.gear,
			data: K4ItemTemplateData.gear
		}

		export type any = move|attack|advantage|disadvantage|darksecret|relation|weapon|gear
	}

	type K4ItemTemplate<T extends K4ItemType = K4ItemType> = (T extends K4ItemType.move ? K4ItemTemplateData.move
		: T extends K4ItemType.attack ? K4ItemTemplateData.attack
		: T extends K4ItemType.advantage ? K4ItemTemplateData.advantage
		: T extends K4ItemType.disadvantage ? K4ItemTemplateData.disadvantage
		: T extends K4ItemType.darksecret ? K4ItemTemplateData.darksecret
		: T extends K4ItemType.weapon ? K4ItemTemplateData.weapon
		: T extends K4ItemType.relation ? K4ItemTemplateData.relation
		: T extends K4ItemType.gear ? K4ItemTemplateData.gear
		: never)

	namespace K4ItemPropertiesData {

		interface Base {
			subMoveData?: Array<K4ItemData<K4ItemType.move>>
		}
		interface HasSubItems {

		}
		export interface move extends K4ItemTemplateData.move, Base {
		}
		export interface attack extends K4ItemTemplateData.attack, Base {
		}
		export interface advantage extends K4ItemTemplateData.advantage, Base, HasSubItems {
		}
		export interface disadvantage extends K4ItemTemplateData.disadvantage, Base, HasSubItems {
		}
		export interface darksecret extends K4ItemTemplateData.darksecret, Base {
		}
		export interface relation extends K4ItemTemplateData.relation, Base {
		}
		export interface weapon extends K4ItemTemplateData.weapon, Base, HasSubItems {
		}
		export interface gear extends K4ItemTemplateData.gear, Base, HasSubItems {
		}

	}

	namespace K4ItemDataSchema {
		export interface move {
			type: K4ItemType.move,
			data: K4ItemPropertiesData.move
		}
		export interface attack {
			type: K4ItemType.attack,
			data: K4ItemPropertiesData.attack
		}
		export interface advantage {
			type: K4ItemType.advantage,
			data: K4ItemPropertiesData.advantage
		}
		export interface disadvantage {
			type: K4ItemType.disadvantage,
			data: K4ItemPropertiesData.disadvantage
		}
		export interface darksecret {
			type: K4ItemType.darksecret,
			data: K4ItemPropertiesData.darksecret
		}
		export interface relation {
			type: K4ItemType.relation,
			data: K4ItemPropertiesData.relation
		}
		export interface weapon {
			type: K4ItemType.weapon,
			data: K4ItemPropertiesData.weapon
		}
		export interface gear {
			type: K4ItemType.gear,
			data: K4ItemPropertiesData.gear
		}

		export type any = move|attack|advantage|disadvantage|darksecret|relation|weapon|gear
	}

	type K4ItemData<T extends K4ItemType = K4ItemType> = (T extends K4ItemType.move ? K4ItemDataSchema.move
		: T extends K4ItemType.attack ? K4ItemDataSchema.attack
		: T extends K4ItemType.advantage ? K4ItemDataSchema.advantage
		: T extends K4ItemType.disadvantage ? K4ItemDataSchema.disadvantage
		: T extends K4ItemType.darksecret ? K4ItemDataSchema.darksecret
		: T extends K4ItemType.weapon ? K4ItemDataSchema.weapon
		: T extends K4ItemType.relation ? K4ItemDataSchema.relation
		: T extends K4ItemType.gear ? K4ItemDataSchema.gear
		: never)

	// type K4ItemConstructorData<Type extends K4ItemType = K4ItemType> = {
	// 	name: string,
	// 	img: string,
	// 	type: Type,
	// 	data: (Type extends K4ItemType.move ? K4ItemDataSchema.Move
	// 		: Type extends K4ItemType.attack ? K4ItemDataSchema.Attack
	// 		: Type extends K4ItemType.advantage ? K4ItemDataSchema.Advantage
	// 		: Type extends K4ItemType.disadvantage ? K4ItemDataSchema.Disadvantage
	// 		: Type extends K4ItemType.darksecret ? K4ItemDataSchema.DarkSecret
	// 		: Type extends K4ItemType.weapon ? K4ItemDataSchema.Weapon
	// 		: Type extends K4ItemType.relation ? K4ItemDataSchema.Relation
	// 		: Type extends K4ItemType.gear ? K4ItemDataSchema.Gear
	// 		: never),

	// }
}