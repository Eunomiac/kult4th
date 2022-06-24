import K4Item from '../../../documents/K4Item.js';
import {ItemData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";

namespace K4ItemDataComponents {
	export interface Base {
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

	export interface HasSubItems<T = K4ItemType.move | K4ItemType.attack> {
		subItems: Array<>
	}

	export interface CanSubItem {
		sourceItem?: {
			name: string,
			id?: string | null,
			type: K4ItemType
		}
	}

	export interface RulesData<T extends K4ItemType> {
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

	export interface ResultsData {
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
}

declare global {

	namespace K4ItemDataSourceData {
		export interface Move extends
			K4ItemDataComponents.Base,
			K4ItemDataComponents.CanSubItem,
			K4ItemDataComponents.RulesData<K4ItemType.move>,
			K4ItemDataComponents.ResultsData {
				attribute: K4AttributeValue
		}

		export interface Attack extends
			K4ItemDataComponents.Base,
			K4ItemDataComponents.CanSubItem,
			K4ItemDataComponents.RulesData<K4ItemType.attack>,
			K4ItemDataComponents.ResultsData {
				attribute: K4AttributeValue,
				range: K4Range[],
				harm: posInt,
				ammo: posInt
		}

		export interface Advantage extends
			K4ItemDataComponents.Base,
			K4ItemDataComponents.HasSubItems,
			K4ItemDataComponents.RulesData<K4ItemType.advantage> {
				attribute: K4AttributeValue,
				currentHold: posInt,
				currentEdges: posInt
		}

		export interface Disadvantage extends
			K4ItemDataComponents.Base,
			K4ItemDataComponents.HasSubItems,
			K4ItemDataComponents.RulesData<K4ItemType.disadvantage> {
				attribute: K4AttributeValue,
				currentHold: posInt
		}

		export interface DarkSecret extends
			K4ItemDataComponents.Base,
			K4ItemDataComponents.RulesData<K4ItemType.darksecret> {
				drive: string,
				currentHold: posInt,
				playerNotes: string,
				gmNotes: string
		}

		export interface Relation extends
			K4ItemDataComponents.Base {
				target: {
					name: string,
					id?: string,
					isPlayer: boolean
				},
				strength: 0 | 1 | 2
		}

		export interface Weapon<C extends K4WeaponClass|"" = "", SC extends K4WeaponSubClass = K4WeaponSubClass.default> extends
			K4ItemDataComponents.Base,
			K4ItemDataComponents.HasSubItems<K4ItemType.attack>,
			K4ItemDataComponents.RulesData<K4ItemType.weapon> {
				class: C,
				subClass: SC,
				ammo: {
					min: posInt,
					max: posInt,
					value: posInt
				}
		}

		export interface Gear extends
			K4ItemDataComponents.Base,
			K4ItemDataComponents.RulesData<K4ItemType.gear> {
				armor: posInt
		}
	}

	namespace K4ItemDataSource {
		export interface Move extends ItemData { type: K4ItemType.move; data: K4ItemDataSourceData.Move }
		export interface Attack extends ItemData { type: K4ItemType.attack; data: K4ItemDataSourceData.Attack }
		export interface Advantage extends ItemData { type: K4ItemType.advantage; data: K4ItemDataSourceData.Advantage }
		export interface Disadvantage extends ItemData { type: K4ItemType.disadvantage; data: K4ItemDataSourceData.Disadvantage }
		export interface DarkSecret extends ItemData { type: K4ItemType.darksecret; data: K4ItemDataSourceData.DarkSecret }
		export interface Relation extends ItemData { type: K4ItemType.relation; data: K4ItemDataSourceData.Relation }
		export interface Weapon<C extends K4WeaponClass = K4WeaponClass, SC extends K4WeaponSubClass = K4WeaponSubClass.default> extends ItemData { type: K4ItemType.weapon; data: K4ItemDataSourceData.Weapon<C, SC> }
		export interface Gear extends ItemData { type: K4ItemType.gear; data: K4ItemDataSourceData.Gear }

		export type Any = Move|Attack|Advantage|Disadvantage|DarkSecret|Relation|Weapon|Gear;
	}

	interface SourceConfig {
		Item: K4ItemDataSource.Any
	}
}