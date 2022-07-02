import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import {ItemDataBaseProperties, ItemDataConstructorData, ItemDataSchema} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import {ItemData} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import {ConfiguredDocumentClass} from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import K4Item, {K4ItemType, K4ItemSubType, K4ItemRange, K4WeaponClass, K4ItemResultType} from "../../../documents/K4Item.js";
import K4ItemSheet from '../../../documents/K4ItemSheet';
import { K4Attribute } from '../../../scripts/constants';

declare global {

	// type K4Item<T extends K4ItemType = K4ItemType> = InstanceType<typeof K4Item<T>> & {data: K4ItemData<K4ItemType>, type: K4ItemType}

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
	namespace K4ItemSourceSchema {

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

		interface RulesData {
			rules: {
					intro?: string,
					trigger?: string,
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

		export interface move extends Base, CanSubItem, RulesData, ResultsData {
			attribute: K4Attribute
		}
		export interface attack extends move {
			range: RangeType[],
			harm: posInt,
			ammo: posInt
		}
		export interface advantage extends Base, HasSubItems, RulesData {
			attribute: K4Attribute,
			currentHold: posInt,
			currentEdges: posInt
		}
		export interface disadvantage extends Base, HasSubItems, RulesData {
			attribute: K4Attribute,
			currentHold: posInt
		}

		export interface darksecret extends Base, RulesData {
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

		export interface weapon extends Base, HasSubItems, RulesData {
			class: C,
			subClass: SC,
			ammo: {
				min: number,
				max: number,
				value: number
			}
		}

		export interface gear extends Base, RulesData {
			armor: number
		}
	}

	namespace K4ItemSourceData {
		export interface move {
			type: K4ItemType.move,
			data: K4ItemSourceSchema.move
		}
		export interface attack {
			type: K4ItemType.attack,
			data: K4ItemSourceSchema.attack
		}
		export interface advantage {
			type: K4ItemType.advantage,
			data: K4ItemSourceSchema.advantage
		}
		export interface disadvantage {
			type: K4ItemType.disadvantage,
			data: K4ItemSourceSchema.disadvantage
		}
		export interface darksecret {
			type: K4ItemType.darksecret,
			data: K4ItemSourceSchema.darksecret
		}
		export interface relation {
			type: K4ItemType.relation,
			data: K4ItemSourceSchema.relation
		}
		export interface weapon {
			type: K4ItemType.weapon,
			data: K4ItemSourceSchema.weapon
		}
		export interface gear {
			type: K4ItemType.gear,
			data: K4ItemSourceSchema.gear
		}

		export type any = move|attack|advantage|disadvantage|darksecret|relation|weapon|gear
	}
	namespace K4ItemPropertiesSchema {

		interface Base {
			subItemData?: Array<K4ItemPropertiesData.move|K4ItemPropertiesData.attack>
			subMoveData?: Array<K4ItemPropertiesData.move>
			subAttackData?: Array<K4ItemPropertiesData.attack>
		}
		interface HasSubItems {


		}
		export interface move extends K4ItemSourceSchema.move, Base {
		}
		export interface attack extends K4ItemSourceSchema.attack, Base {
		}
		export interface advantage extends K4ItemSourceSchema.advantage, Base, HasSubItems {
		}
		export interface disadvantage extends K4ItemSourceSchema.disadvantage, Base, HasSubItems {
		}
		export interface darksecret extends K4ItemSourceSchema.darksecret, Base {
		}
		export interface relation extends K4ItemSourceSchema.relation, Base {
		}
		export interface weapon extends K4ItemSourceSchema.weapon, Base, HasSubItems {
		}
		export interface gear extends K4ItemSourceSchema.gear, Base, HasSubItems {
		}

	}
	namespace K4ItemPropertiesData {
		export interface move {
			type: K4ItemType.move,
			data: K4ItemPropertiesSchema.move
		}
		export interface attack {
			type: K4ItemType.attack,
			data: K4ItemPropertiesSchema.attack
		}
		export interface advantage {
			type: K4ItemType.advantage,
			data: K4ItemPropertiesSchema.advantage
		}
		export interface disadvantage {
			type: K4ItemType.disadvantage,
			data: K4ItemPropertiesSchema.disadvantage
		}
		export interface darksecret {
			type: K4ItemType.darksecret,
			data: K4ItemPropertiesSchema.darksecret
		}
		export interface relation {
			type: K4ItemType.relation,
			data: K4ItemPropertiesSchema.relation
		}
		export interface weapon {
			type: K4ItemType.weapon,
			data: K4ItemPropertiesSchema.weapon
		}
		export interface gear {
			type: K4ItemType.gear,
			data: K4ItemPropertiesSchema.gear
		}

		export type any = move|attack|advantage|disadvantage|darksecret|relation|weapon|gear
	}

	type K4ItemSpec<Type extends K4ItemType> = K4Item & {data: {type: Type, _source: {type: Type}}}
}