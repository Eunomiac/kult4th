// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import K4Item, {K4ItemType, K4ItemSubType, K4ItemRange, K4WeaponClass, K4ItemResultType} from "../../documents/K4Item.js";
import K4ItemSheet from "../../documents/K4ItemSheet";
import {K4Attribute} from "../../scripts/constants";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

declare global {

  interface ResultsData {
    results: Record<
        K4ItemResultType,
        {
          result: string,
          listRefs?: string[],
          effectFunctions?: string[],
          edges?: PosInteger,
          hold?: PosInteger
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

  interface K4SourceItemData {
    name: string,
    id?: string | null,
    type: K4ItemType
  }
  interface K4Attack {
    name: string,
    range: RangeType[],
    harm: PosInteger,
    ammoCost?: PosInteger,
    sourceItem?: K4SourceItemData,
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
      subItems: Array<K4SubItemSchema.subAttack|K4SubItemSchema.subMove>
    }

    export interface CanSubItem {
      sourceItem?: K4SourceItemData
    }

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
  }
  namespace K4ItemSystemSchema {
    interface HasSubItems {
      subItems: K4ItemSystemSchema.subItem[]
      subMoves: K4ItemSystemSchema.subMove[]
      subAttacks: K4ItemSystemSchema.subAttack[]
    }
    export interface move extends K4ItemComps.Base, K4ItemComps.CanSubItem, K4ItemComps.RulesData, ResultsData {
      attribute: K4Attribute
    }

    export interface disadvantage extends K4ItemComps.Base, K4ItemComps.HasSubItems, K4ItemComps.RulesData {
      attribute: K4Attribute,
      currentHold: PosInteger
    }

    export interface darksecret extends K4ItemComps.Base, K4ItemComps.RulesData {
      drive: string,
      currentHold: PosInteger,
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
    }
    export interface attack extends K4ItemComps.Base, K4ItemComps.CanSubItem, K4ItemComps.RulesData, ResultsData {
      attribute: K4Attribute
      range: RangeType[],
      harm: PosInteger,
      ammo: PosInteger
    }
    export interface advantage extends K4ItemComps.Base, K4ItemComps.HasSubItems, K4ItemComps.RulesData, HasSubItems, ResultsData {
      attribute: K4Attribute,
      currentHold: PosInteger,
      currentEdges: PosInteger
    }
    export interface disadvantage extends K4ItemComps.Base, K4ItemComps.HasSubItems, K4ItemComps.RulesData, HasSubItems, ResultsData {
      attribute: K4Attribute,
      currentHold: PosInteger
    }
    export interface darksecret extends K4ItemComps.Base, K4ItemComps.RulesData {
      drive: string,
      currentHold: PosInteger,
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

    export type any = move|attack|advantage|disadvantage|darksecret|relation|weapon|gear
  }

  type SubItemTypes = K4ItemType.move|K4ItemType.attack;
  namespace K4SubItemSchema {
    export interface subItem<T extends SubItemTypes = SubItemTypes> {
      name?: string,
      img?: string,
      type: T,
      system: K4ItemSystem<T> & K4ItemComps.IsSubItem
    }

    export type subMove = subItem<K4ItemType.move>;
    export type subAttack = subItem<K4ItemType.attack>;
  }

  type K4ItemSystem<T extends K4ItemType = K4ItemType> = (T extends K4ItemType.move ? K4ItemSystemSchema.move
    : T extends K4ItemType.attack ? K4ItemSystemSchema.attack
    : T extends K4ItemType.advantage ? K4ItemSystemSchema.advantage
    : T extends K4ItemType.disadvantage ? K4ItemSystemSchema.disadvantage
    : T extends K4ItemType.darksecret ? K4ItemSystemSchema.darksecret
    : T extends K4ItemType.relation ? K4ItemSystemSchema.relation
    : T extends K4ItemType.weapon ? K4ItemSystemSchema.weapon
    : T extends K4ItemType.gear ? K4ItemSystemSchema.gear
    : K4ItemSystem.any)

  type ParentItemTypes = K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.weapon|K4ItemType.gear;
  type SubItemTypes = K4ItemType.move|K4ItemType.attack;
  type RollableItemTypes = K4ItemType.move|K4ItemType.attack|K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.gear;
  type StaticItemTypes = K4ItemType.move|K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.gear;
  type PassiveItemTypes = K4ItemType.move|K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.darksecret|K4ItemType.relation|K4ItemType.weapon|K4ItemType.gear;
  type ActiveItemTypes = K4ItemType.move|K4ItemType.attack|K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.gear;
  type RulesTypes = K4ItemType.move|K4ItemType.attack|K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.darksecret|K4ItemType.weapon|K4ItemType.gear;

  type K4ParentItem<T extends ParentItemTypes = ParentItemTypes> = K4Item<T> & {type: ParentItemTypes}
  type K4SubItem<T extends SubItemTypes = SubItemTypes> = K4Item<T> & {type: SubItemTypes, system: K4ItemComps.IsSubItem}
  type K4RollableItem<T extends RollableItemTypes = RollableItemTypes> = K4Item<T> & {type: RollableItemTypes,
                                                                                      system: ResultsData & {
                                                                                                              attribute: K4Attribute
                                                                                                              subType: K4ItemSubType.activeRolled
                                                                                                            }}
  type K4StaticItem<T extends StaticItemTypes = StaticItemTypes> = K4Item<T> & {type: StaticItemTypes, system: { subType: K4ItemSubType.activeStatic }}
  type K4PassiveItem<T extends PassiveItemTypes = PassiveItemTypes> = K4Item<T> & {type: PassiveItemTypes, system: {subType: K4ItemSubType.passive}}
  type K4ActiveItem<T extends ActiveItemTypes = ActiveItemTypes> = (K4RollableItem<T> | K4StaticItem<T>) & {type: ActiveItemTypes}
  type K4RulesItem<T extends RulesTypes = RulesTypes> = K4Item<T> & {type: RulesTypes}
}
