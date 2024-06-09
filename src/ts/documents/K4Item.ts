// #region IMPORTS ~
import U from "../scripts/utilities.js";
import K4ItemSheet from "./K4ItemSheet.js";
import K4ChatMessage from "./K4ChatMessage.js";
import C, {K4Attribute} from "../scripts/constants.js";
import K4Actor from "./K4Actor.js";
import {K4RollResult} from "./K4Roll.js";
import K4ActiveEffect from "./K4ActiveEffect.js";
// #endregion

// #REGION === TYPES, ENUMS, INTERFACE AUGMENTATION === ~
// #region -- ENUMS ~
enum K4ItemType {
  advantage = "advantage",
  disadvantage = "disadvantage",
  move = "move",
  darksecret = "darksecret",
  relation = "relation",
  gear = "gear",
  attack = "attack",
  weapon = "weapon"
}

enum K4ItemSubType {
  activeRolled = "active-rolled",
  activeStatic = "active-static",
  passive = "passive"
}
enum K4ItemRange {
  arm = "arm",
  room = "room",
  field = "field",
  horizon = "horizon"
}
enum K4WeaponType {
  unarmed = "unarmed",
  edged = "edged",
  crushing = "crushing",
  chopping = "chopping",
  handgun = "handgun",
  magnum = "magnum",

}
enum K4WeaponClass {
  meleeUnarmed = "melee-unarmed",
  meleeCrush = "melee-crush",
  meleeSlash = "melee-slash",
  meleeStab = "melee-stab",
  firearm = "firearm",
  bomb = "bomb"
}

// #endregion
// #region -- TYPES ~
declare global {
  namespace K4SubItem {
    export type Types = K4ItemType.move | K4ItemType.attack;
    export type SubTypes = K4ItemSubType.activeRolled | K4ItemSubType.activeStatic | K4ItemSubType.passive;

    export namespace Components {
      export interface Base {
        key: string,
        description?: string,
        lists?: Record<string, {
          name: string,
          items: string[],
          intro?: string,
          requiresEdit?: boolean;
        }>,
        isCustom: boolean,
        isEdge?: boolean,
        subType: K4ItemSubType;
      }
      export interface ParentItemReference {
        name: string,
        id?: IDString | null,
        type: K4ItemType;
      }
      export interface CanSubItem {
        parentItem?: ParentItemReference;
        parentType?: K4ItemType;
      }
      export interface IsSubItem {
        chatName?: string;
        parentItem: ParentItemReference;
        parentType: K4ItemType;
      }
    }

    export namespace SystemSchema {
      export interface Passive extends Components.Base,
        Components.IsSubItem,
        K4Item.Components.RulesData {
        subType: K4ItemSubType.passive;
      }

      export interface Static extends Components.Base,
        Components.IsSubItem,
        K4Item.Components.RulesData {
        subType: K4ItemSubType.activeStatic;
      }

      export interface Active extends Components.Base,
        Components.IsSubItem,
        K4Item.Components.RulesData,
        K4Item.Components.ResultsData {
        subType: K4ItemSubType.activeRolled;
        attribute: K4Attribute;
      }

      export type Any = Passive | Static | Active;
      export type SubMove = Static | Active;
      export type SubAttack = Active & {
        range: K4ItemRange[],
        harm: number,
        ammo: number;
      };
    }

    export type System<T extends Types = Types> =
      T extends K4ItemType.move ? SystemSchema.SubMove :
      T extends K4ItemType.attack ? SystemSchema.SubAttack :
      SystemSchema.Any;

    export interface Schema<T extends K4SubItem.Types = K4SubItem.Types> {
      id?: IDString,
      name?: string,
      type: T,
      img: string,
      system: K4SubItem.System<T>;
    }
  }
  interface K4SubItem<T extends K4SubItem.Types = K4SubItem.Types> {
    type: T,
    system: K4SubItem.System<T> & K4SubItem.Components.IsSubItem;
  }

  namespace K4Item {
    export namespace Types {
      export type Parent = K4ItemType.advantage | K4ItemType.disadvantage | K4ItemType.weapon | K4ItemType.gear;
      export type Rollable = K4ItemType.move | K4ItemType.attack | K4ItemType.advantage | K4ItemType.disadvantage | K4ItemType.gear;
      export type Static = K4ItemType.move | K4ItemType.advantage | K4ItemType.disadvantage | K4ItemType.gear;
      export type Passive = K4ItemType.move | K4ItemType.advantage | K4ItemType.disadvantage | K4ItemType.darksecret | K4ItemType.relation | K4ItemType.weapon | K4ItemType.gear;
      export type Active = K4ItemType.move | K4ItemType.attack | K4ItemType.advantage | K4ItemType.disadvantage | K4ItemType.gear;
      export type HaveRules = K4ItemType.move | K4ItemType.attack | K4ItemType.advantage | K4ItemType.disadvantage | K4ItemType.darksecret | K4ItemType.weapon | K4ItemType.gear;
      export type HaveModifiers = K4ItemType.move | K4ItemType.advantage | K4ItemType.disadvantage | K4ItemType.weapon | K4ItemType.gear;
    }
    export namespace Components {
      export interface Base {
        key: string,
        description: string,
        lists: Record<string, {
          name: string,
          items: string[],
          intro?: string,
          requiresEdit?: boolean;
        }>,
        isCustom: boolean,
        pdfLink: string,
        subType: K4ItemSubType;
      }

      export interface HasSubItems {
        subItems: K4SubItem.Schema[],
        subMoves?: K4SubItem.Schema<K4ItemType.move>[],
        subAttacks?: K4SubItem.Schema<K4ItemType.attack>[];
      }

      export interface RulesData {
        rules: {
          intro?: string,
          trigger?: string,
          outro?: string,
          listRefs?: string[],
          effects?: string[],
          holdText?: string;
        };
      }

      export interface ResultsData {
        results: Record<
          K4RollResult,
          {
            result: string,
            listRefs?: string[],
            effects?: string[],
            edges?: PosInteger,
            hold?: PosInteger;
          }
        >;
      }
    }
    type WeaponSubClass<T extends K4WeaponClass> =
      T extends K4WeaponClass.meleeUnarmed ? ("")
      : T extends K4WeaponClass.meleeCrush ? ("")
      : T extends K4WeaponClass.meleeSlash ? ("sword" | "")
      : T extends K4WeaponClass.meleeStab ? ("")
      : T extends K4WeaponClass.firearm ? ("rifle" | "pistol" | "sniper-rifle" | "")
      : T extends K4WeaponClass.bomb ? ("")
      : "";

    /**
     * Describes the data structure as defined in template.json for each item type
     */
    export namespace SourceSchema {
      export interface Move extends K4Item.Components.Base,
        K4SubItem.Components.CanSubItem,
        K4Item.Components.RulesData,
        K4Item.Components.ResultsData {
        attribute: K4Attribute;
      }

      export interface Attack extends K4Item.Components.Base,
        K4SubItem.Components.CanSubItem,
        K4Item.Components.RulesData,
        K4Item.Components.ResultsData {
        range: K4ItemRange[],
        harm: PosInteger,
        ammoCost?: PosInteger;
      }

      export interface Advantage extends K4Item.Components.Base,
        K4Item.Components.HasSubItems,
        K4Item.Components.RulesData,
        Partial<K4Item.Components.ResultsData> {
        attribute: K4Attribute,
        currentHold: PosInteger,
        currentEdges: PosInteger;
      }

      export interface Disadvantage extends K4Item.Components.Base,
        K4Item.Components.HasSubItems,
        K4Item.Components.RulesData,
        Partial<K4Item.Components.ResultsData> {
        attribute: K4Attribute,
        currentHold: PosInteger;
      }

      export interface DarkSecret extends K4Item.Components.Base,
        K4Item.Components.RulesData {
        drive: string,
        currentHold: PosInteger,
        playerNotes: string,
        gmNotes: string;
      }

      export interface Relation extends K4Item.Components.Base {
        target: string,
        strength: {
          min: number,
          max: number,
          value: number;
        };
      }
      export interface Weapon<C extends K4WeaponClass = K4WeaponClass> extends K4Item.Components.Base,
        K4Item.Components.HasSubItems,
        K4Item.Components.RulesData,
        Partial<K4Item.Components.ResultsData> {
        class: C,
        subClass: WeaponSubClass<C>,
        ammo: C extends K4WeaponClass.firearm ? {
          min: number,
          max: number,
          value: number;
        } : undefined;
      }
      export interface Gear extends K4Item.Components.Base,
        K4Item.Components.HasSubItems,
        K4Item.Components.RulesData,
        Partial<K4Item.Components.ResultsData> {
        armor: Integer;
      }
    }

    /**
     * Describes the functional .system property after derivation methods in K4Item.
     */
    export namespace SystemSchema {
      export interface Move extends K4Item.SourceSchema.Move { }
      export interface Attack extends K4Item.SourceSchema.Attack { }
      export interface Advantage extends K4Item.SourceSchema.Advantage { }
      export interface Disadvantage extends K4Item.SourceSchema.Disadvantage { }
      export interface DarkSecret extends K4Item.SourceSchema.DarkSecret { }
      export interface Relation extends K4Item.SourceSchema.Relation { }
      export interface Weapon extends K4Item.SourceSchema.Weapon { }
      export interface Gear extends K4Item.SourceSchema.Gear { }
      export type Any = Move | Attack | Advantage | Disadvantage | DarkSecret | Relation | Weapon | Gear;
    }

    /**
     * Discriminated union of all item system schemas
     *  */
    export type System<T extends K4ItemType = K4ItemType> =
      T extends K4ItemType.move ? SystemSchema.Move
      : T extends K4ItemType.attack ? SystemSchema.Attack
      : T extends K4ItemType.advantage ? SystemSchema.Advantage
      : T extends K4ItemType.disadvantage ? SystemSchema.Disadvantage
      : T extends K4ItemType.darksecret ? SystemSchema.DarkSecret
      : T extends K4ItemType.relation ? SystemSchema.Relation
      : T extends K4ItemType.weapon ? SystemSchema.Weapon
      : T extends K4ItemType.gear ? SystemSchema.Gear
      : SystemSchema.Any;
    /**
     * The top-level schema for an Item
     */
    export interface Schema<T extends K4ItemType = K4ItemType> {
      name: string,
      type: T,
      img: string,
      system: K4Item.System<T>;
    }

    /**
     * Discriminated unions of item types by subType or other criteria
     */
    export type Parent<T extends Types.Parent = Types.Parent> = K4Item<T> & {
      system: K4Item.System<T> & {
        subItems: K4SubItem.Schema[];
      };
    };
    export type Static<T extends Types.Static = Types.Static> = K4Item<T> & {
      system: System<T> & {
        subType: K4ItemSubType.activeStatic;
      };
    };
    export type Passive<T extends Types.Passive = Types.Passive> = K4Item<T> & {
      system: System<T> & {
        subType: K4ItemSubType.passive;
      };
    };
    export type Active<T extends Types.Active = Types.Active> = K4Item<T> & {
      system: System<T> & {
        attribute: K4Attribute,
        subType: K4ItemSubType.activeRolled;
      };
    };
    export type HaveRules<T extends Types.HaveRules = Types.HaveRules> = K4Item<T>;
    export type HaveModifiers<T extends Types.HaveModifiers = Types.HaveModifiers> = K4Item<T>;
  }
}
// #endregion
// #region -- AUGMENTED INTERFACE ~
interface K4Item<T extends K4ItemType = K4ItemType> {
  get id(): IDString;
  get name(): string;
  get type(): T;
  get sheet(): K4Item["_sheet"] & K4ItemSheet;
  system: K4Item.System<T>;
  parent: Maybe<K4Item | K4Actor>;
}
// #endregion
// #ENDREGION

// #REGION === K4ITEM CLASS ===
class K4Item extends Item {
  // #region INITIALIZATION ~
  /**
   * Pre-Initialization of the K4Item class. This method should be run during the "init" hook.
   *
   * - Registers the K4Item class as the system's Item document class.
   * - Customizes the sidebar icon for the Item directory.
   * - Registers a "preCreateItem" hook to prevent the creation of an item with the same name as an existing item on the same actor.
   * - Registers a "renderChatMessage" hook to add the appropriate theme class to the chat message.
   *
   * @returns {Promise<void>} A promise that resolves when the hook is registered.
   */
  static async PreInitialize(): Promise<void> {

    // Register K4Item as the system's Item document class
    CONFIG.Item.documentClass = K4Item;

    // Customize the sidebar icon for the Item directory
    CONFIG.Item.sidebarIcon = "fa-regular fa-box-open";

    // Register creation hook
    Hooks.on("preCreateItem", async (itemData: K4Item): Promise<boolean> => {
      // Ensure the item is being created for an actor
      if (!itemData.parent || itemData.parent.documentName !== "Actor") {
        return true;
      }

      const actor: K4Actor = itemData.parent;
      const existingItem: Maybe<K4Item> = actor.items
        .find((i: K4Item): boolean => i.name === itemData.name && i.type === itemData.type && i.id !== itemData.id);

      // If an item with the same name and type already exists, other than the one being created, prevent the creation
      if (existingItem) {
        ui.notifications.warn(`The item "${itemData.name}" already exists on this actor.`);
        return false; // Returning false prevents the item from being created
      }

      return true;
    });
  }
  // #endregion
  // #region Type Guards ~
  is<T extends K4ItemType = K4ItemType>(...types: T[]): this is K4Item<T> {
    const isType = (type: K4ItemType): type is T => types.includes(type as T);
    return isType(this.type);
  } isParentItem(): this is K4Item.Parent {return Boolean("subItems" in this.system && Array.isArray(this.system.subItems) && this.system.subItems.length > 0);}
  hasSubMoves(): this is K4Item.Parent {return "subMoves" in this.system && Array.isArray(this.system.subMoves) && this.system.subMoves.length > 0;}
  hasSubAttacks(): this is K4Item.Parent {return "subAttacks" in this.system && Array.isArray(this.system.subAttacks) && this.system.subAttacks.length > 0;}
  isSubItem(): this is K4Item & K4SubItem {return Boolean("parentItem" in this.system && this.system.parentItem?.name);}
  isEdge(): this is K4SubItem<K4ItemType.move> {return this.isSubItem() && Boolean(this.system.isEdge);}
  isOwnedItem(): this is K4Item & {parent: K4Actor;} {return this.isEmbedded && this.parent instanceof Actor;}
  isOwnedSubItem(): this is K4Item & K4SubItem & {parent: K4Actor;} {return this.isSubItem() && this.isOwnedItem();}
  isActiveItem(): this is K4Item.Active {return this.system.subType === K4ItemSubType.activeRolled;}
  isStaticItem(): this is K4Item.Static {return this.system.subType === K4ItemSubType.activeStatic;}
  isPassiveItem(): this is K4Item.Passive {return this.system.subType === K4ItemSubType.passive;}
  hasRules(): this is K4Item.HaveRules {return "rules" in this.system;}
  // #endregion

  // #region GETTERS & SETTERS ~
  get key() {return this.system.key;}
  get itemSheet(): typeof this._sheet & K4ItemSheet | null {return this._sheet as typeof this._sheet & K4ItemSheet ?? null;}
  // get masterKey(): string {
  //   if (!this.isSubItem()) {return this.key;}
  //   if (!this.isOwnedSubItem()) {return this.key;}
  //   const keyItem = game.items?.getName(this.system.parentItem.name) as Maybe<K4Item>;
  //   if (keyItem?.key) {return keyItem.key;}
  //   return this.key;
  // }
  get parentID(): IDString | undefined {return this.isSubItem() ? this.parentItem?.id : undefined;}
  get parentType(): K4ItemType {return this.isSubItem() ? this.system.parentItem?.type : this.type;}
  get parentName(): string {return this.isSubItem() ? this.system.parentItem?.name : this.name;}
  get parentItem(): K4Item.Parent | null {
    if (!this.isOwnedSubItem()) {return null;}
    const {id} = this.system.parentItem;
    if (!id) {
      throw new Error(`SubItem ${this.name} is missing a parentItem ID.`);
    }
    const parentItem = this.parent.getEmbeddedDocument("Item", id) as Maybe<K4Item.Parent>;

    // Extracting results from parentItem's system if available, otherwise defaulting to empty objects
    const {
      completeSuccess: { result: resComplete } = { result: undefined },
      partialSuccess: { result: resPartial } = { result: undefined },
      failure: { result: resFail } = { result: undefined }
    } = parentItem?.system.results ?? {};
    if (!parentItem) {return null;}
    return parentItem;
  }

  get subItems(): Array<K4Item & K4SubItem> {
    return (this.isOwnedItem() && this.isParentItem()) ? this.parent.getItemsBySource(this.id) : [];
  }

  get subMoves(): Array<K4SubItem<K4ItemType.move>> {
    return this.subItems.filter((subItem): subItem is K4Item<K4ItemType.move> & K4SubItem<K4ItemType.move> => subItem.type === K4ItemType.move && !subItem.isEdge());
  }
  get edges(): Array<K4Item<K4ItemType.move> & K4SubItem<K4ItemType.move>> {
    return this.subItems.filter((subItem): subItem is K4Item<K4ItemType.move> & K4SubItem<K4ItemType.move> => subItem.type === K4ItemType.move && subItem.isEdge());
  }
  get subAttacks(): Array<K4SubItem<K4ItemType.attack>> {
    return this.subItems.filter((subItem): subItem is K4Item<K4ItemType.attack> & K4SubItem<K4ItemType.attack> => subItem.type === K4ItemType.attack);
  }
  // #endregion

  // #region EFFECT FUNCTIONS ~
  async applyEffectFunction(functionStr: string) {
    if (!this.isOwnedItem()) {return;}
    const [funcName, ...params] = functionStr.split(/,/);

    /* Run 'getUniqueValuesForKey(PACKS.all, "rules.effects")' in the console to get a list of all effect functions,
       as they are defined in the .db JSON data manually copied into data.ts.

       Currently:

       [
        "[>CreateTracker:Time,10]",
        "[>ModValue:weapon/firearm,harm,1]",
        "[Add Armor, subtract Harm from roll]"

        "[AddNote:#>item-button text-movename:data-item-name='Keep It Together':data-action='open'>Keep It Together<#:partialSuccess='You may suppress your emotions, postponing their effects until the next scene.']",
        "[
          AddNote:#>item-button text-movename:data-item-name='Observe a Situation':data-action='open'>Observe a Situation<#/completeSuccess,Take #>text-posmod>+2<# instead of #>text-posmod>+1<# for acting on the GM's answers.,
          AddNote:#>item-button text-movename:data-item-name='Observe a Situation':data-action='open'>Observe a Situation<#/partialSuccess,Take #>text-posmod>+2<# instead of #>text-posmod>+1<# for acting on the GM's answers.
        ]",
        "[AddNote:completeSuccess,effect|AddNote:partialSuccess,effect|AddNote:failure,effect]",

        "[AppendList,Investigate,questions,questions]",
        "[AppendList,Observe a Situation,questions,questions]",
        "[AppendList,Read a Person,questions,questions]",
        "[AppendList,weapon/sword,attacks,attacks]",

        "[BuffRoll:#>item-button text-movename:data-item-name='Endure Injury':data-action='open'>Endure Injury<#,1]",
        "[GET: ReplaceList (#>item-button text-movename:data-item-name='Investigate':data-action='open'>Investigate<#, Questions), StoreInput: text=Field of Expertise #1>flags.field_1, StoreInput: text=Field of Expertise #2>flags.field_2]",
        "[Requires the Disadvantage Condemned]",
        "[
          SetTrait:actor/data.stability.max,6,

          // NEED TO HANDLE ARRAY VALUES LIKE: //
          SetTrait:actor/system.modifiers.wounds_critical.1.all,0,
          SetTrait:actor/system.modifiers.wounds_serious.1.all,0,
          SetTrait:actor/system.modifiers.wounds_serious.2.all,0,
          SetTrait:actor/system.modifiers.wounds_serious.3.all,0,
          SetTrait:actor/system.modifiers.wounds_serious.4.all,0,
          SetTrait:actor/system.modifiers.wounds_seriouscritical.1.all,0
        ]",
      ]
*/
    switch (funcName) {
      case "AppendList": {
        const [targetItemName, targetList, sourceList] = params;
        const targetItem: Maybe<K4Item> = this.parent.getItemByName(targetItemName);
        kLog.log("Found Target Item", targetItem);
        if (targetItem?.system.lists[targetList]) {
          const sourceListItems = this.system.lists[sourceList].items
            .map((listItem: string) => `${listItem} #>text-list-note:data-item-name='${this.parentName}':data-action='open'>(from ${this.parentName})<#`);
          const updateData = [
            {
              _id: targetItem.id,
              [`system.lists.${targetList}.items`]: [
                ...targetItem.system.lists[targetList].items,
                ...sourceListItems
              ]
            }
          ];
          await this.parent.updateEmbeddedDocuments("Item", updateData);
        }
        break;
      }
      case "SetTrait": {
        console.error("'SetTrait' is unimplemented.");
        break;
      }
      case "AddNote": {
        console.error("'AddNote' is unimplemented.");
        break;
      }
      case "_Unimplemented_1": {
        throw new Error(`Unimplemented Effect Function: ${funcName}`);
      }
      case "_Unimplemented_2": {
        throw new Error(`Unimplemented Effect Function: ${funcName}`);
      }
      default: {
        kLog.error(`Unknown Effect Function: ${funcName}`);
      }
    }
  }
  async unapplyEffectFunction(functionStr: string) {
    if (!this.isOwnedItem()) {return;}
    const [funcName, ...params] = functionStr.split(/,/);
    switch (funcName) {
      case "AppendList": {
        const [targetItemName, targetList, sourceList] = params;
        const targetItem: K4Item | undefined = this.parent.getItemByName(targetItemName);
        kLog.log("Found Target Move", targetItem);
        if (targetItem?.system.lists[targetList]) {
          const prunedListItems = this.system.lists[sourceList].items
            .filter((listItem) => !(new RegExp(`data-item-name=.?${this.parentName}.?`)).test(listItem));
          const updateData = [
            {
              _id: targetItem.id,
              [`system.lists.${targetList}.items`]: prunedListItems
            }
          ];
          await this.parent.updateEmbeddedDocuments("Item", updateData);
        }
        break;
      }
      case "_Unimplemented_1": {
        throw new Error(`Unimplemented Effect Function: ${funcName}`);
      }
      case "_Unimplemented_2": {
        throw new Error(`Unimplemented Effect Function: ${funcName}`);
      }
      default: {
        kLog.error(`Unknown Effect Function: ${funcName}`);
      }
    }
  }
  applyOnCreateeffects() {
    if ("rules" in this.system && this.system.rules.effects) {
      this.system.rules.effects.forEach((funcString) => this.applyEffectFunction(funcString));
    }
  }
  unapplyOnCreateeffects() {
    if ("rules" in this.system && this.system.rules.effects) {
      this.system.rules.effects.forEach((funcString) => this.unapplyEffectFunction(funcString));
    }
  }
  // #endregion

  // #region OVERRIDES: _onCreate, prepareData, _onDelete
  prepareSubItemData() {
    if (!this.isParentItem()) {return [];}
    return this.system.subItems
      .map((subData) => {
        subData.name ??= this.name;
        subData.system.parentItem.id = this.id;
        subData.system.parentType = this.type;
        if ("lists" in this.system) {
          subData.system.lists = {
            ...this.system.lists,
            ...subData.system.lists ?? {}
          };
        }
        return subData;
      }) as Array<K4SubItem.Schema & Record<string, unknown>>;
  }
  override async _onCreate(...args: Parameters<Item["_onCreate"]>) {
    await super._onCreate(...args);
    if (!this.isOwnedItem()) {return;}
    this.applyOnCreateeffects();
    if (this.isParentItem()) {
      // Item has subItem schemas, create them now as independent K4Items.
      const subItemData = this.prepareSubItemData();
      kLog.display(`#${this.id} [K4Item._onCreate] [[${C.Abbreviations.ItemType[this.type]}.${U.uCase(this.name)}]] Creating ${subItemData.length} SubItems`, {
        ITEM: this,
        subItemData: foundry.utils.deepClone(subItemData)
      });
      await this.parent.createEmbeddedDocuments("Item", subItemData);
    } else if (this.isSubItem()) {
      const [parentName, parentType] = [this.parentName, this.parentType];
      const parentDisplay = `${C.Abbreviations.ItemType[parentType]}.${U.uCase(parentName)}`;
      kLog.display(`... #${this.id} [K4Item._onCreate] [[${C.Abbreviations.ItemType[this.type]}.${U.uCase(this.name)}]] Created by #${this.parentID ?? ""}[[${parentDisplay}]]`, {
        ITEM: this,
        parent: this.parentItem
      });
    } else {
      kLog.display(`#${this.id} [K4Item._onCreate] [[${C.Abbreviations.ItemType[this.type]}.${U.uCase(this.name)}]] Created`, {
        ITEM: this
      });
    }
  }
  override prepareData() {
    super.prepareData();
    if (this.isOwnedItem() && this.isParentItem()) {
      this.system.subMoves = this.system.subItems
        .filter((subData): subData is K4SubItem.Schema<K4ItemType.move> => subData.type === K4ItemType.move);
      this.system.subAttacks = this.system.subItems
        .filter((subData): subData is K4SubItem.Schema<K4ItemType.attack> => subData.type === K4ItemType.attack);

      // Set the default roll for this item to the results of the first activeRolled subItem.
      const firstSubItem = this.system.subItems
        .find((subItem) => subItem.system.subType === K4ItemSubType.activeRolled);
      if (firstSubItem && this.isActiveItem() && "results" in firstSubItem.system) {
        this.system.results = firstSubItem.system.results;
      }
    }

    // if (this.isOwnedItem() && this.isSubI)
  }
  override _onDelete(...args: Parameters<Item["_onDelete"]>) {
    super._onDelete(...args);
    if (!this.isOwnedItem()) {return;}
    if (this.isParentItem()) {
      this.subItems.forEach((item) => item.delete());
    }
    this.unapplyOnCreateeffects();
  }
  // #endregion

  // #region CONTEXTUAL HTML CONSTRUCTION ~
  get hoverStrip(): HoverStripData {
    const stripType: K4ItemType | "edge" = this.isEdge() ? "edge" : (this.isSubItem() ? this.system.parentItem.type : this.type);
    const theme = C.Themes[stripType];
    const stripData: HoverStripData = {
      id: this.id ?? `${this.type}-${U.randString(5)}`,
      type: stripType,
      icon: this.img ?? "",
      display: this.name ?? "(enter name)",
      ...this.isSubItem()
        ? {
          stripClasses: [
            U.toKey(`${stripType}-strip`),
            `derived-${this.type}`,
            theme
          ]
        }
        : {
          stripClasses: [
            U.toKey(`${stripType}-strip`),
            theme
          ]
        },
      dataset: "attribute" in this.system
        ? {
          "hover-target": `.attribute-box[data-attribute='${this.system.attribute}'] img`
        }
        : {},
      buttons: []
    };
    if (this.hasRules()) {
      stripData.tooltip = this.system.rules.trigger;
    }

    // Roll Button or Trigger Button?
    if (this.isOwnedItem() && this.isActiveItem()) {
      stripData.buttons.push({
        icon: "hover-strip-button-roll",
        dataset: {
          "item-name": this.name ?? "",
          "action": "roll"
        },
        tooltip: "ROLL"
      });
    } else if (this.isStaticItem()) {
      stripData.buttons.push({
        icon: "hover-strip-button-trigger",
        dataset: {
          "item-name": this.name ?? "",
          "action": "trigger"
        },
        tooltip: "TRIGGER"
      });
    }

    // Chat & View Buttons
    stripData.buttons.push(
      {
        icon: "hover-strip-button-chat",
        dataset: {
          "item-name": this.name ?? "",
          "action": "chat"
        },
        tooltip: "CHAT"
      },
      {
        icon: "hover-strip-button-open",
        dataset: {
          "item-name": this.name ?? "",
          "action": "open"
        },
        tooltip: "VIEW"
      }
    );

    // Drop Button IF Sheet Unlocked AND Owner AND NOT SubItem
    if (this.isOwnedItem() && !this.isSubItem() && this.itemSheet?.isUnlocked /* && check for user permissions */) {
      stripData.buttons.push({
        icon: "hover-strip-button-drop",
        dataset: {
          "item-name": this.name ?? "",
          "action": "drop"
        },
        tooltip: "DROP"
      });
    }

    // kLog.log("Hover Strip Data", stripData);
    return stripData;
  }

  get chatTheme(): string {
    switch (this.parentType) {
      case K4ItemType.advantage:
        return "k4-theme-gold";
      case K4ItemType.disadvantage:
        return "k4-theme-red";
      case K4ItemType.move:
        return "k4-theme-white";
      case K4ItemType.darksecret:
        return "k4-theme-dark";
      case K4ItemType.relation:
        return "k4-theme-gold";
      case K4ItemType.gear:
        return "k4-theme-white";
      case K4ItemType.attack:
        return "k4-theme-red";
      case K4ItemType.weapon:
        return "k4-theme-white";
    }
    throw new Error(`Unknown Item Type: ${this.type}`);
  }

  get chatCssClasses(): string[] {
    const cssClasses: string[] = ["kult4th-chat"];
    if (this.name.length > 22) {
      cssClasses.push("ultra-condensed");
    } else if (this.name.length > 18) {
      cssClasses.push("condensed");
    }
    return cssClasses;
  }

  get itemSummaryContext() {
    return {
      name: this.name,
      img: this.img,
      system: this.system,
      item: this,
      parentItem: this.parentItem,
      parentName: this.parentName,
      parentType: this.parentType,
      cssClass: [
        ...this.chatCssClasses
      ].join(" ")
    };
  }

  get triggerSummaryContext() {
    if ("chatName" in this.system) {
      return {
        ...this.itemSummaryContext,
        name: this.system.chatName ?? this.name,
        cssClass: [
          ...this.chatCssClasses,
          "chat-move-result kult4th-result-static"
        ].join(" ")
      };
    }
    return this.itemSummaryContext;
  }

  chatTemplate = "systems/kult4th/templates/partials/item-block.hbs";
  triggerTemplate = "systems/kult4th/templates/sidebar/result-static.hbs";
  async displayItemSummary(speaker?: string) {
    const template = await getTemplate(this.chatTemplate);

    const content = template(this.itemSummaryContext);
    await K4ChatMessage.create({
      content,
      speaker: K4ChatMessage.getSpeaker({alias: speaker ?? ""}),
      flags: {
        kult4th: {
          cssClasses: [this.chatTheme]
        }
      }
    });
  }

  async triggerItem(speaker?: string) {
    const template = await getTemplate(this.triggerTemplate);
    const content = K4ChatMessage.CapitalizeFirstLetter(
      template(this.triggerSummaryContext)
    ).replace(/This Move threatens Hold/g, "This Move Generates Hold");
    await K4ChatMessage.create({
      content,
      speaker: K4ChatMessage.getSpeaker({alias: speaker ?? ""}),
      flags: {
        kult4th: {
          cssClasses: [this.parentItem?.chatTheme ?? this.chatTheme]
        }
      }
    });
  }
}
// #ENDREGION

// #region EXPORTS ~
export default K4Item;

export {
  K4ItemType,
  K4ItemSubType,
  K4ItemRange,
  K4WeaponClass,
  K4RollResult
};
// #endregion