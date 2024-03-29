import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import {ItemDataBaseProperties, ItemDataConstructorData, ItemDataSchema, ItemDataSource} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import {ItemData} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import {ConfiguredDocumentClass} from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import K4Item, {K4ItemType, K4ItemSubType, K4ItemRange, K4WeaponClass, K4ItemResultType} from "../../../documents/K4Item.js";
import K4ItemSheet from '../../../documents/K4ItemSheet';

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

	interface ResultsData {
		results: Record<
				K4ItemResultType,
				{
					result: string,
					listRefs?: string[],
					effectFunctions?: string[],
					edges?: posInt,
					hold?: posInt
				}
			>
	}

	type WeaponSubClass<T extends K4WeaponClass> =
		T extends K4WeaponClass.meleeUnarmed ? ("")
	: T extends K4WeaponClass.meleeCrush ? ("")
	: T extends K4WeaponClass.meleeSlash ? ("sword" | "")
	: T extends K4WeaponClass.meleeStab ? ("")
	: T extends K4WeaponClass.firearm ? ("rifle" | "pistol" | "sniper-rifle" | "")
	: T extends K4WeaponClass.bomb ? ("")
	: "";

	type K4SourceItemData = {
		name: string,
		id?: string | null,
		type: K4ItemType
	};
	interface K4Attack {
		name: string,
		range: RangeType[],
		harm: posInt,
		ammoCost?: posInt,
		sourceItem?: {
			name: string,
			id?: string,
			type: K4ItemType
		},
		costsEdge?: boolean,
		effectDesc?: string,
		effectFunc?: () => void
	}
	namespace K4ItemComps {
		export interface Base {
			key: string,
			description: string,
			lists: Record<string, {
				name: string,
				items: string[],
				intro?: string,
				requiresEdit?: boolean
			}>,
			isCustom: boolean,
			pdfLink: string,
			subType: K4ItemSubType
		}

		export interface HasSubItems {
			subItems: Array<K4ItemSourceData.subAttack> | Array<K4ItemSourceData.subMove> | Array<K4ItemSourceData.subAttack|K4ItemSourceData.subMove>
		}

		// export type CanMaster = K4ItemSpec<K4ItemType.advantage | K4ItemType.disadvantage | K4ItemType.weapon | K4ItemType.gear>;

		export interface CanSubItem {
			sourceItem?: K4SourceItemData
		}
		// export type CanSlave = K4ItemSpec<K4ItemType.attack | K4ItemType.move>;

		export interface IsSubItem extends CanSubItem {
			sourceItem: K4SourceItemData
		}

		export interface RulesData {
			rules: {
				intro?: string,
				trigger?: string,
				outro?: string,
				listRefs?: string[],
				effectFunctions?: string[],
				holdText?: string
			}
		}
		// export type HasRules = K4ItemSpec<Exclude<K4ItemType, K4ItemType.relation>>;
	}
	namespace K4ItemSourceSchema {
		export interface move extends K4ItemComps.Base, K4ItemComps.CanSubItem, K4ItemComps.RulesData, ResultsData {
			attribute: K4Attribute
		}
		export interface attack extends K4ItemComps.Base, K4ItemComps.CanSubItem, K4ItemComps.RulesData, ResultsData {
			attribute: K4Attribute
			range: RangeType[],
			harm: posInt,
			ammo: posInt
		}
		export interface advantage extends K4ItemComps.Base, K4ItemComps.HasSubItems, K4ItemComps.RulesData {
			attribute: K4Attribute,
			currentHold: posInt,
			currentEdges: posInt
		}
		export interface disadvantage extends K4ItemComps.Base, K4ItemComps.HasSubItems, K4ItemComps.RulesData {
			attribute: K4Attribute,
			currentHold: posInt
		}

		export interface darksecret extends K4ItemComps.Base, K4ItemComps.RulesData {
			drive: string,
			currentHold: posInt,
			playerNotes: string,
			gmNotes: string
		}

		export interface relation extends K4ItemComps.Base {
			target: string,
			strength: {
				min: number,
				max: number,
				value: number
			}
		}

		export interface weapon extends K4ItemComps.Base, K4ItemComps.HasSubItems, K4ItemComps.RulesData {
			class: C,
			subClass: SC,
			ammo: {
				min: number,
				max: number,
				value: number
			}
		}

		export interface gear extends K4ItemComps.Base, K4ItemComps.HasSubItems, K4ItemComps.RulesData {
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

		export type subMove = move & {name?: string, data: K4ItemComps.IsSubItem}
		export type subAttack = attack & {name: string, data: K4ItemComps.IsSubItem}

		export type subItem = subMove|subAttack
	}
	namespace K4ItemPropertiesSchema {
		interface HasSubItems {
			subMoves: Array<K4ItemSourceData.move>
			subAttacks: Array<K4ItemSourceData.attack>
		}
		export interface move extends K4ItemSourceSchema.move {
		}
		export interface attack extends K4ItemSourceSchema.attack {
		}
		export interface advantage extends K4ItemSourceSchema.advantage, HasSubItems, ResultsData {
		}
		export interface disadvantage extends K4ItemSourceSchema.disadvantage, HasSubItems, ResultsData {
		}
		export interface darksecret extends K4ItemSourceSchema.darksecret {
		}
		export interface relation extends K4ItemSourceSchema.relation {
		}
		export interface weapon extends K4ItemSourceSchema.weapon, HasSubItems {
		}
		export interface gear extends K4ItemSourceSchema.gear, HasSubItems {
		}

	}
	namespace K4ItemPropertiesData {
		export interface move extends K4ItemSourceData.move {
			type: K4ItemType.move,
			data: K4ItemPropertiesSchema.move
		}
		export interface attack extends K4ItemSourceData.attack {
			type: K4ItemType.attack,
			data: K4ItemPropertiesSchema.attack
		}
		export interface advantage extends K4ItemSourceData.advantage {
			type: K4ItemType.advantage,
			data: K4ItemPropertiesSchema.advantage
		}
		export interface disadvantage extends K4ItemSourceData.disadvantage {
			type: K4ItemType.disadvantage,
			data: K4ItemPropertiesSchema.disadvantage
		}
		export interface darksecret extends K4ItemSourceData.darksecret {
			type: K4ItemType.darksecret,
			data: K4ItemPropertiesSchema.darksecret
		}
		export interface relation extends K4ItemSourceData.relation {
			type: K4ItemType.relation,
			data: K4ItemPropertiesSchema.relation
		}
		export interface weapon extends K4ItemSourceData.weapon {
			type: K4ItemType.weapon,
			data: K4ItemPropertiesSchema.weapon
		}
		export interface gear extends K4ItemSourceData.gear {
			type: K4ItemType.gear,
			data: K4ItemPropertiesSchema.gear
		}

		export type any = move|attack|advantage|disadvantage|darksecret|relation|weapon|gear
	}

	type K4ItemSpec<Type extends K4ItemType> = K4Item
		& {data: {
				type: Type,
				_source: {
					type: Type
				}
			}}
	type K4ParentItem<Type extends K4ItemType = K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.weapon|K4ItemType.gear> = K4ItemSpec<Type>
		& {data: {
				data: {
					subItems: K4ItemSourceData.subItem[],
					subMoves: K4ItemSourceData.subMove[],
					subAttacks: K4ItemSourceData.subAttack[]
				}
			}}
	type K4SubItem<Type extends K4ItemType = K4ItemType.move|K4ItemType.attack> = K4ItemSpec<Type>
		& {data: {
				data: {
					sourceItem: K4SourceItemData
				}
			}}
	type K4RollableItem<Type extends K4ItemType = K4ItemType.move|K4ItemType.attack|K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.gear> = K4ItemSpec<Type>
		& {data: {
			data: ResultsData
		}}
		& {data: {
				data: {
					attribute: K4Attribute
					subType: K4ItemSubType.activeRolled
				}
			}}
	type K4StaticItem<Type extends K4ItemType = K4ItemType.move|K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.gear> = K4ItemSpec<Type>
		& {data: {
				data: {
					subType: K4ItemSubType.activeStatic
				}
			}}
	type K4PassiveItem<Type extends K4ItemType = K4ItemType.move|K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.darksecret|K4ItemType.relation|K4ItemType.weapon|K4ItemType.gear> = K4ItemSpec<Type>
		& {data: {
				data: {
					subType: K4ItemSubType.passive
				}
			}}
	type K4ActiveItem<Type extends K4ItemType = K4ItemType.move|K4ItemType.attack|K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.gear> = K4RollableItem<Type> | K4StaticItem<Type>
}
