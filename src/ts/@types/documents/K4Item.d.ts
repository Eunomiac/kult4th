// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import K4Item, {K4ItemType, K4ItemSubType, K4ItemRange, K4WeaponClass, K4ItemResultType} from "../../documents/K4Item.js";
import K4ItemSheet from "../../documents/K4ItemSheet";
import {K4Attribute} from "../../scripts/constants";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

declare global {

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
    id?: IDString | null,
    type: K4ItemType
  }


  namespace K4SubItemComps {
    export interface Base {
      key: string,
      description?: string,
      lists?: Record<string, {
        name: string,
        items: string[],
        intro?: string,
        requiresEdit?: boolean
      }>,
      isCustom: boolean,
      isEdge?: boolean,
      subType: K4ItemSubType
    }
    export interface CanSubItem {
      sourceItem?: K4SourceItemData
    }
    export interface IsSubItem {
      sourceItem: K4SourceItemData
    }
  }

  namespace K4SubItemSystem {

    export interface subItemPassive extends K4SubItemComps.Base, K4SubItemComps.IsSubItem, K4ItemComps.RulesData {
      subType: K4ItemSubType.passive;
    }

    export interface subItemStatic extends subItemPassive {
      subType: K4ItemSubType.activeStatic;
    }

    export interface subItemActive extends subItemStatic, K4ItemComps.ResultsData {
      subType: K4ItemSubType.activeRolled;
      attribute: K4Attribute;
    }

    export type subItem = subItemPassive | subItemStatic | subItemActive;

    export type subMove = subItem;

    export type subAttack = subMove & {
      range: K4ItemRange[],
      harm: number,
      ammo: number
    }

    // type SubItemSystemSchema<T extends K4ItemSubType> =
    //   T extends K4ItemSubType.passive ? subItemPassive :
    //   T extends K4ItemSubType.activeStatic ? subItemStatic :
    //   T extends K4ItemSubType.activeRolled ? subItemActive :
    //   never;

    // export interface subItem<S extends K4ItemSubType> extends K4SubItemComps.Base, K4SubItemComps.IsSubItem, K4ItemComps.RulesData {
    //   subType: S;
    //   attribute: S extends K4ItemSubType.activeRolled ? K4Attribute : never;
    //   results: S extends K4ItemSubType.activeStatic ? never : K4ItemComps.ResultsData;
    // }

    // export interface subMove<S extends K4ItemSubType = K4ItemSubType> extends subItem<S> { }

    // export interface subAttack<S extends K4ItemSubType = K4ItemSubType> extends subMove<S> {
    //   range: RangeType[],
    //   harm: PosInteger,
    //   ammo: PosInteger
    // }

  }

  interface K4SubItemData<T extends SubItemTypes = SubItemTypes, S extends K4ItemSubType = K4ItemSubType> {
    name?: string,
    type: T,
    img: string,
    system: T extends K4ItemType.move ? K4SubItemSystem.subMove :
      T extends K4ItemType.attack ? K4SubItemSystem.subAttack :
        K4SubItemSystem.move|K4SubItemSystem.attack
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
      subItems: K4SubItemData[],
      subMoves?: K4SubItemData<K4ItemType.move>[],
      subAttacks?: K4SubItemData<K4ItemType.attack>[]
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

    export interface ResultsData {
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
  }

  namespace K4ItemSystemComps {

    export interface move extends K4ItemComps.Base, K4SubItemComps.CanSubItem, K4ItemComps.RulesData, K4ItemComps.ResultsData {
      attribute: K4Attribute
    }

    export interface attack extends move {
      range: RangeType[],
      harm: PosInteger,
      ammoCost?: PosInteger
    }

    export interface advantage extends K4ItemComps.Base, K4ItemComps.HasSubItems, K4ItemComps.RulesData, K4ItemComps.HasSubItems, Partial<K4ItemComps.ResultsData> {
      attribute: K4Attribute,
      currentHold: PosInteger,
      currentEdges: PosInteger
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

    export interface weapon extends K4ItemComps.Base, K4ItemComps.HasSubItems, K4ItemComps.RulesData {
      class: C,
      subClass: SC,
      ammo?: {
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

  type K4ItemSystem<T extends K4ItemType = K4ItemType> = (T extends K4ItemType.move ? K4ItemSystemComps.move
    : T extends K4ItemType.attack ? K4ItemSystemComps.attack
    : T extends K4ItemType.advantage ? K4ItemSystemComps.advantage
    : T extends K4ItemType.disadvantage ? K4ItemSystemComps.disadvantage
    : T extends K4ItemType.darksecret ? K4ItemSystemComps.darksecret
    : T extends K4ItemType.relation ? K4ItemSystemComps.relation
    : T extends K4ItemType.weapon ? K4ItemSystemComps.weapon
    : T extends K4ItemType.gear ? K4ItemSystemComps.gear
    : K4ItemSystemComps.any)

  type K4ItemData<T extends K4ItemType = K4ItemType> = {
    name: string,
    type: T,
    img: string,
    system: K4ItemSystem<T>
  }

  type ParentItemTypes = K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.weapon|K4ItemType.gear;
  type SubItemTypes = K4ItemType.move|K4ItemType.attack;
  type RollableItemTypes = K4ItemType.move|K4ItemType.attack|K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.gear;
  type StaticItemTypes = K4ItemType.move|K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.gear;
  type PassiveItemTypes = K4ItemType.move|K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.darksecret|K4ItemType.relation|K4ItemType.weapon|K4ItemType.gear;
  type ActiveItemTypes = K4ItemType.move|K4ItemType.attack|K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.gear;
  type RulesTypes = K4ItemType.move|K4ItemType.attack|K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.darksecret|K4ItemType.weapon|K4ItemType.gear;

  type K4ParentItem<T extends ParentItemTypes = ParentItemTypes> = K4Item<T> & {type: ParentItemTypes}
  type K4SubItem<T extends K4ItemType.move|K4ItemType.attack = K4ItemType.move|K4ItemType.attack> = K4Item<T> & {type: K4ItemType.move|K4ItemType.attack, system: K4ItemComps.K4SubItemComps.IsSubItem}
  type K4RollableItem<T extends RollableItemTypes = RollableItemTypes> = K4Item<T> & {type: RollableItemTypes,
                                                                                      system: K4ItemComps.ResultsData & {
                                                                                                              attribute: K4Attribute
                                                                                                              subType: K4ItemSubType.activeRolled
                                                                                                            }}
  type K4StaticItem<T extends StaticItemTypes = StaticItemTypes> = K4Item<T> & {type: StaticItemTypes, system: { subType: K4ItemSubType.activeStatic }}
  type K4PassiveItem<T extends PassiveItemTypes = PassiveItemTypes> = K4Item<T> & {type: PassiveItemTypes, system: {subType: K4ItemSubType.passive}}
  type K4ActiveItem<T extends ActiveItemTypes = ActiveItemTypes> = (K4RollableItem<T> | K4StaticItem<T>) & {type: ActiveItemTypes}
  type K4RulesItem<T extends RulesTypes = RulesTypes> = K4Item<T> & {type: RulesTypes}
}
