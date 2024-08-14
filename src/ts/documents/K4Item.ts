// #region IMPORTS ~
import U from "../scripts/utilities.js";
import K4ItemSheet from "./K4ItemSheet.js";
import K4ChatMessage from "./K4ChatMessage.js";
import C, {K4Attribute} from "../scripts/constants.js";
import K4Actor, {K4ActorType} from "./K4Actor.js";
import K4Roll, {K4RollResult} from "./K4Roll.js";
import K4ActiveEffect from "./K4ActiveEffect.js";
// #endregion

// #REGION === TYPES, ENUMS, INTERFACE AUGMENTATION === ~
// #region -- ENUMS ~
console.log("Loading K4Item.ts");

enum K4ItemType {
  advantage = "advantage",
  disadvantage = "disadvantage",
  move = "move",
  darksecret = "darksecret",
  relation = "relation",
  gear = "gear",
  weapon = "weapon",
  gmtracker = "gmtracker"
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

// #endregion
// #region -- TYPES ~

declare global {
  namespace K4SubItem {
    export type Types = K4ItemType.move;
    export type SubTypes = K4ItemSubType.activeRolled | K4ItemSubType.activeStatic;

    export namespace Components {
      export interface Base {
        lists?: Record<string, {
          name: string,
          items: string[],
          intro?: string
        }>,
        isEdge?: boolean,
        subType: K4ItemSubType;
        shortDesc: string;
      }
      export interface ParentItemReference {
        name: string,
        id?: IDString | null,
        type: K4ItemType;
      }
      export interface CanSubItem {
        parentItem?: ParentItemReference;
      }
      export interface IsSubItem {
        chatName?: string;
        parentItem: ParentItemReference;
      }
    }

    export namespace SystemSchema {
      export interface Static extends Components.Base,
        Components.IsSubItem,
        K4Item.Components.RulesData,
        Partial<K4Item.Components.ResultsData> {
        subType: K4ItemSubType.activeStatic;
      }

      export interface Active extends Components.Base,
        Components.IsSubItem,
        K4Item.Components.RulesData,
        K4Item.Components.ResultsData {
        subType: K4ItemSubType.activeRolled;
        attribute: K4Attribute;
      }
      export type SubMove = Static | Active;
    }

    export type System<T extends Types = Types> =
      T extends K4ItemType.move ? SystemSchema.SubMove
      : never;

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
      export type Rollable = K4ItemType.move | K4ItemType.advantage | K4ItemType.disadvantage;
      export type Static = K4ItemType.move | K4ItemType.advantage | K4ItemType.disadvantage | K4ItemType.gear;
      export type Passive = K4ItemType.move | K4ItemType.advantage | K4ItemType.disadvantage | K4ItemType.darksecret | K4ItemType.relation | K4ItemType.weapon | K4ItemType.gear;
      export type Active = K4ItemType.move | K4ItemType.advantage | K4ItemType.disadvantage | K4ItemType.gear;
      export type HaveRules = K4ItemType.move | K4ItemType.advantage | K4ItemType.disadvantage | K4ItemType.darksecret | K4ItemType.weapon | K4ItemType.gear;
      export type HaveResults = K4ItemType.move;
      export type HaveMainEffects = K4ItemType.move | K4ItemType.advantage | K4ItemType.disadvantage | K4ItemType.weapon | K4ItemType.gear;
    }
    export namespace Components {
      export interface Base {
        lists: Record<string, {
          name: string,
          items: string[],
          intro?: string
        }>,
        subType: K4ItemSubType;
        gmNotes?: string;
        shortDesc?: string;
      }

      export interface HasSubItems {
        subItems: K4SubItem.Schema[],
        subMoves?: K4SubItem.Schema[]
      }

      export interface RulesData {
        rules: {
          intro?: string,
          trigger?: string,
          outro?: string,
          listRefs?: string[],
          effects?: K4ActiveEffect.BuildData[],
          holdText?: string;
        };
      }

      export interface ResultData {
        result: string,
        listRefs?: string[],
        effects?: K4ActiveEffect.BuildData[],
        edges?: number,
        hold?: number;
      }

      export interface ResultsData {
        results: Partial<Record<
          K4RollResult|"triggered",
          ResultData
        >>;
      }
    }

    /**
     * Describes the data structure as defined in template.json for each item type
     */
    export namespace SourceSchema {
      export interface Move extends K4Item.Components.Base,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        K4SubItem.Components.CanSubItem,
        K4Item.Components.RulesData,
        K4Item.Components.ResultsData {
        attribute: K4Attribute;
      }

      export interface Advantage extends K4Item.Components.Base,
        K4Item.Components.HasSubItems,
        K4Item.Components.RulesData {
        currentHold: number;
      }

      export interface Disadvantage extends K4Item.Components.Base,
        K4Item.Components.HasSubItems,
        K4Item.Components.RulesData {
        currentHold: number;
      }

      export interface DarkSecret extends K4Item.Components.Base,
        K4Item.Components.RulesData {
        drive: string,
        currentHold: number,
        playerNotes: string
      }

      export interface Relation extends K4Item.Components.Base {
        target?: IDString, // Link to npc actor, if one has been created
        concept?: string, // Brief subtitle description of character
        strength: ValueMax;
      }
      export interface Weapon extends K4Item.Components.Base,
        K4Item.Components.HasSubItems,
        K4Item.Components.RulesData {
        ammo?: ValueMax;
      }
      export interface Gear extends K4Item.Components.Base,
        K4Item.Components.HasSubItems,
        K4Item.Components.RulesData {
        armor?: number;
      }
      export type Any = Move | Advantage | Disadvantage | DarkSecret | Relation | Weapon | Gear;
    }
    /**
     * Discriminated union of all item source schemas
     *  */
    export type Source<T extends K4ItemType = K4ItemType> =
      T extends K4ItemType.move ? SourceSchema.Move
      : T extends K4ItemType.advantage ? SourceSchema.Advantage
      : T extends K4ItemType.disadvantage ? SourceSchema.Disadvantage
      : T extends K4ItemType.darksecret ? SourceSchema.DarkSecret
      : T extends K4ItemType.relation ? SourceSchema.Relation
      : T extends K4ItemType.weapon ? SourceSchema.Weapon
      : T extends K4ItemType.gear ? SourceSchema.Gear
      : SourceSchema.Any;

    /**
     * Describes the functional .system property after derivation methods in K4Item.
     */
    export namespace SystemSchema {
      export type Move = K4Item.SourceSchema.Move
      export interface Advantage extends K4Item.SourceSchema.Advantage, K4Item.Components.ResultsData { }
      export interface Disadvantage extends K4Item.SourceSchema.Disadvantage, K4Item.Components.ResultsData { }
      export type DarkSecret = K4Item.SourceSchema.DarkSecret
      export type Relation = K4Item.SourceSchema.Relation
      export interface Weapon extends K4Item.SourceSchema.Weapon, K4Item.Components.ResultsData { }
      export interface Gear extends K4Item.SourceSchema.Gear, K4Item.Components.ResultsData { }
      export type Any = Move | Advantage | Disadvantage | DarkSecret | Relation | Weapon | Gear;
    }

    /**
     * Discriminated union of all item system schemas
     *  */
    export type System<T extends K4ItemType = K4ItemType> =
      T extends K4ItemType.move ? SystemSchema.Move
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
        results: Record<K4RollResult, K4Item.Components.ResultData>;
      };
    };
    export type HaveRules<T extends Types.HaveRules = Types.HaveRules> = K4Item<T> & {
      system: System<T> & {
        rules: K4Item<T>["system"]["rules"]
      }
    };
    export type HaveResults<T extends Types.HaveResults = Types.HaveResults> = K4Item<T>;
    export type HaveMainEffects<T extends Types.HaveMainEffects = Types.HaveMainEffects> = K4Item<T> & {
      system: System<T> & {
        rules: K4Item<T>["system"]["rules"] & {effects: K4ActiveEffect.BuildData[]};
      };
    };
  }
}
// #ENDREGION
// #region -- AUGMENTED INTERFACE ~
interface K4Item<T extends K4ItemType = K4ItemType> {
  get id(): IDString;
  get uuid(): UUIDString;
  get name(): string;
  get type(): T;
  get sheet(): K4Item["_sheet"] & K4ItemSheet;
  get effects(): this["data"]["effects"] & Collection<K4ActiveEffect>;
  system: K4Item.System<T>;
  parent: ActorDoc | null;
}
// #endregion
// #endregion
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
   */
  static PreInitialize() {

    // Register K4Item as the system's Item document class
    CONFIG.Item.documentClass = K4Item;

    // Customize the sidebar icon for the Item directory
    CONFIG.Item.sidebarIcon = "fa-regular fa-box-open";

    // Register creation hook
    Hooks.on("createItem", async (item: K4Item): Promise<boolean> => {
      // Ensure the item is being created for an actor
      if (!item.parent) { return true; }
      const actor: K4Actor = item.parent;

      // If an item with the same name and type already exists, other than the one being created, prevent the creation
      const existingItem: Maybe<K4Item> = actor.items
        .find((i: K4Item): boolean => i.name === item.name && i.type === item.type && i.id !== item.id);
      if (existingItem) {
        ui.notifications.warn(`The item "${item.name}" already exists on this actor.`);
        await item.delete();
        return false; // Returning false prevents the item from being created
      }

      // Return true by default.
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
  isSubItem(): this is K4Item<K4ItemType.move> & K4SubItem {return Boolean("parentItem" in this.system && this.system.parentItem?.name);}
  isBasicMove(): this is K4Item<K4ItemType.move> {return C.BasicMoves.includes(this.name);}
  isEdge(): this is K4Item<K4ItemType.move> {return this.isSubItem() && Boolean(this.system.isEdge);}
  isOwnedItem(): this is K4Item & {parent: K4Actor;} {return Boolean(this.isEmbedded && this.parent instanceof Actor);}
  isOwnedSubItem(): this is K4Item & K4SubItem & {parent: K4Actor;} {return this.isSubItem() && this.isOwnedItem();}
  isOwnedByUser(): this is K4Item & {parent: K4Actor;} {return this.isOwnedItem() && this.parent.isOwner;}
  isActiveItem(): this is K4Item.Active {return this.system.subType === K4ItemSubType.activeRolled;}
  isStaticItem(): this is K4Item.Static {return this.system.subType === K4ItemSubType.activeStatic;}
  isPassiveItem(): this is K4Item.Passive {return this.system.subType === K4ItemSubType.passive;}
  hasRules(): this is K4Item.HaveRules {return "rules" in this.system;}
  hasOwnRules(): this is K4Item.HaveRules {return this.hasRules() && Object.values(this.system.rules)
    .some((rule: ValueOrArray<string>|K4ActiveEffect.BuildData[]) => rule.length > 0);}
  hasResults(): this is K4Item.HaveResults { return "results" in this.system;}
  hasCreateEffects(): this is K4Item.HaveMainEffects {
    return Boolean(this.hasRules()
      && this.system.rules.effects
        ?.some((effectDataSet) => effectDataSet.changeData
          .some((changeData) => changeData.key === "PromptForData")
        )
    );
  }
  hasMainEffects(): this is K4Item.HaveMainEffects { return Boolean(this.hasRules() && this.system.rules.effects?.length); }
  hasRollEffects(): this is K4Item.HaveResults {return this.hasResults() && Object.values(this.system.results).some((result) => result.effects?.length);}
  // #endregion

  // #region GETTERS & SETTERS ~  get itemSheet(): typeof this._sheet & K4ItemSheet | null {return this._sheet as typeof this._sheet & K4ItemSheet ?? null;}

  get parentID(): IDString | undefined {return this.isSubItem() ? this.parentItem?.id : undefined;}
  get parentType(): K4ItemType {return this.isSubItem() ? this.system.parentItem.type : this.type;}
  get parentName(): string {return this.isSubItem() ? this.system.parentItem.name : this.name;}
  get parentItem(): K4Item.Parent | null {
    if (!this.isOwnedSubItem()) {return null;}
    const {id} = this.system.parentItem;
    if (!id) {
      throw new Error(`SubItem ${this.name} is missing a parentItem ID.`);
    }
    const parentItem = this.parent.getEmbeddedDocument("Item", id) as Maybe<K4Item.Parent>;

    return parentItem ?? null;
  }
  get rulesSummary(): K4Item.Components.RulesData["rules"] | undefined {
    if (this.isParentItem()) {
      const subItemData = this.system.subItems.find((subItem) => "rules" in subItem.system);
      if (subItemData?.system.rules) {
        return subItemData.system.rules;
      }
    }
    if (this.hasOwnRules()) { return this.system.rules; }
    return undefined;
  }

  get subItems(): Array<K4Item & K4SubItem> {
    return (this.isOwnedItem() && this.isParentItem()) ? this.parent.getItemsBySource(this.id) : [];
  }

  get subMoves(): K4SubItem[] {
    return this.subItems.filter((subItem): subItem is K4Item<K4ItemType.move> & K4SubItem => !subItem.isEdge());
  }
  get edges(): Array<K4Item<K4ItemType.move> & K4SubItem> {
    return this.subItems.filter((subItem): subItem is K4Item<K4ItemType.move> & K4SubItem => subItem.isEdge());
  }
  get shortDesc(): string {
    return this.system.shortDesc ?? "";
  }
  // get customChangeData(): K4Change.Source[] {
  //   if (!this.hasMainEffects()) { return []; }
  //   return (this.system.rules.effects ?? [])
  //     .filter((cData: K4Change.Source) => cData.mode === CONST.ACTIVE_EFFECT_MODES.CUSTOM);
  // }
  _systemCustomActiveEffect?: K4ActiveEffect;
  _rollCustomActiveEffects?: Record<K4RollResult, K4ActiveEffect>|{triggered: K4ActiveEffect};
  // get customChanges(): K4Change[] {
  //   return this.customChangeData
  //     .map((cData: EffectChangeData) => new K4Change(cData));
  // }
  // get requireItemChangesData() {
  //   return this.customChangeData.filter((change) => change.key === "RequireItem");
  // }
  // get permanentChangesData() {
  //   return this.customChangeData.filter((change) => String(change.value).includes('permanent:true'));
  // }
  // get promptForDataChangesData() {
  //   return this.customChangeData.filter((change) => change.key === "PromptForData");
  // }
  // get modifyRollChangesData() {
  //   return this.customChangeData.filter((change) => change.key === "ModifyRoll");
  // }
  // get systemChangesData() {
  //   return this.customChangeData
  //     .filter((change) => !["RequireItem", "PromptForData", "ModifyRoll"].includes(change.key)
  //       && !String(change.value).includes('permanent:true'));
  // }

  // #endregion

  // #region OVERRIDES: _onCreate, prepareData, _onDelete
  prepareSubItemData() {
    if (!this.isParentItem()) {return [];}
    return this.system.subItems
      .map((subData) => {
        subData.name ??= this.name;
        subData.system.parentItem.id = this.id;
        subData.system.parentItem.type = this.type;
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
    super._onCreate(...args);
    if (!game.user.isGM) { return; }

    // If this has Change data in its system.rules schema, prepare a K4ActiveEffect to carry those Changes
    if (this.hasMainEffects()) {
      if (!this.parent) {
        // If this is a Primary document (i.e. not owned), simply create a K4ActiveEffect for the change data that will transfer to any future actor owner, containing change data for all changes. We don't have to worry about whether an item has been created pre-embedded in an Actor (see below).
        kLog.display(`[Primary K4Item._onCreate] "${C.Abbreviations.ItemType[this.type]}.${U.uCase(this.name)}" PRIMARY: Embedding ActiveEffect on ITEM`, this);
        await Promise.all(this.system.rules.effects
          .map((effectDataSet) => K4ActiveEffect.CreateFromBuildData(effectDataSet, this as K4ActiveEffect.Origin))
        );
      } else if (this.effects.size === 0) {
        const {parent} = this;
        // If this is an owned item, there are two possible cases:
        // - (1) this item is being created by embedding an existing Primary item onto an actor, which will have transferred all of the K4ActiveEffects it created during its own _onCreate step. In this case, we don't need to do anything, as the effects will have already transferred to the Actor.
        // - (2) this item is being created directly as an embedded item on an actor, and will not have previously-created K4ActiveEffects to transfer. Because of Foundry limitations on creating ActiveEffects on already-embedded items, we must manually transfer the effects to the Actor by creating them on the Actor directly.
        // We know we are in case (2) if this item has no K4ActiveEffects (despite having effects defined in its system.rules.effects array).
        kLog.display(`[Owned K4Item._onCreate] "${C.Abbreviations.ItemType[this.type]}.${U.uCase(this.name)}" CREATED-AS-EMBEDDED: Embedding ActiveEffect on ACTOR DIRECTLY`, {
          ITEM: this,
          actor: this.parent
        });
        await Promise.all(this.system.rules.effects
          .map((effectDataSet) => K4ActiveEffect.CreateFromBuildData(
            effectDataSet,
            this as K4ActiveEffect.Origin,
            parent as K4Item<K4ItemType.gmtracker> | K4Actor<K4ActorType.pc>
          ))
        );
      }
    }

    // If this isn't an item embedded on an actor, no additional functionality is necessary
    if (!this.isOwnedItem()) {return undefined;}

    // If item has subItem schemas, create them now as independent K4Items.
    if (this.isParentItem()) {
      const subItemData = this.prepareSubItemData();
      kLog.display(`[Owned K4ParentItem._onCreate] "${C.Abbreviations.ItemType[this.type]}.${this.name}" is Creating ${subItemData.length} SubItems`, {
        ITEM: this,
        subItemData: foundry.utils.deepClone(subItemData)
      });
      await this.parent.createEmbeddedDocuments("Item", subItemData);
    } else if (this.isSubItem()) {
      const [parentName, parentType] = [this.parentName, this.parentType];
      const parentDisplay = `${C.Abbreviations.ItemType[parentType]}.${U.uCase(parentName)}`;
      kLog.log(`... [Owned K4SubItem._onCreate] "${C.Abbreviations.ItemType[this.type]}.${this.name}" Created by "${parentDisplay}"`, {
        ITEM: this,
        parent: this.parentItem
      });
    } else {
      kLog.display(`[Owned K4SoloItem._onCreate] "${C.Abbreviations.ItemType[this.type]}.${U.uCase(this.name)}" is neither a Parent nor a SubItem: Embedded Into Actor`, {
        ITEM: this
      });
    }
  }
  override prepareData() {
    super.prepareData();

    // If this is a parent item, extract attribute and results data for display on item sheet from the first rollable subItem
    if (this.isParentItem() && this.isActiveItem()) {
      const firstSubItem = this.system.subItems
        .find((subItem): subItem is K4SubItem.Schema => subItem.system.subType === K4ItemSubType.activeRolled);
      if (firstSubItem && firstSubItem.system.subType === K4ItemSubType.activeRolled) {
        this.system.attribute = firstSubItem.system.attribute;
        this.system.results = (firstSubItem as K4Item.Active).system.results;
      }
    }

    /** CAN REMOVE THIS SECTION SINCE WE WON'T BE CREATING ITEMS FOR ATTACKS */
    if (this.isOwnedItem() && this.isParentItem()) {
      this.system.subMoves = this.system.subItems
    }
  }
  override _onDelete(...args: Parameters<Item["_onDelete"]>) {
    super._onDelete(...args);
    if (!this.isOwnedItem()) {return undefined;}
    if (this.isParentItem()) {
      this.subItems.forEach((item) => void item.delete());
      const {parent} = this;
      if (parent.is(K4ActorType.pc) && parent.system.edges.sourceName === this.name) {
        void this.parent.clearEdges();
      }
    }
    if (this.hasMainEffects()) {
      /**
       * If this item has effect change data, usually can rely on transfers logic to remove the effect.
       * However, removing the effect manually is necessary if the effect had to be created directly on the actor (because, e.g., the item source was itself created directly as an embedded entity)
       * @todo Implement manual removal of effects
       */
    }
  }
  // #endregion

  // #region PUBLIC METHODS
  async updateHold(delta: number): Promise<void> {
    if (!this.isOwnedItem()) { return; }
    if (this.isOwnedSubItem()) {
      await this.parentItem?.updateHold(delta);
      return;
    }
    if (this.is(K4ItemType.advantage, K4ItemType.disadvantage)) {
      const newHold = Math.max(this.system.currentHold + delta, 0);
      if (newHold !== this.system.currentHold) {
        await this.update({"system.currentHold": newHold});
      }
    }
  }

  // #endregion

  // #region CONTEXTUAL HTML CONSTRUCTION ~
  get hoverStrip(): HoverStripData {
    const stripType: K4ItemType | "edge" = this.isEdge() ? "edge" : (this.isSubItem() ? this.system.parentItem.type : this.type);
    const theme = C.Themes[stripType];
    const stripData: HoverStripData = {
      id: this.id,
      type: stripType,
      icon: this.img ?? "",
      display: this.name,
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
    if (this.isEdge()) {
      stripData.tooltip = this.system.rules.outro;
    }

    // Roll Button or Trigger Button?
    if (this.isOwnedItem() && this.type === K4ItemType.move) {
      if (this.isActiveItem()) {
        stripData.buttons.push({
          icon: "hover-strip-button-roll",
          dataset: {
            "item-name": this.name,
            "action": "roll"
          },
          tooltip: "ROLL"
        });
      } else if (this.isEdge()) {
        stripData.buttons.push({
          icon: "hover-strip-button-trigger",
          dataset: {
            "item-name": this.name,
            "action": "trigger"
          },
          tooltip: "USE"
        });
      } else if (this.isStaticItem()) {
        stripData.buttons.push({
          icon: "hover-strip-button-trigger",
          dataset: {
            "item-name": this.name,
            "action": "trigger"
          },
          tooltip: "TRIGGER"
        });
      }
    }

    // Chat & View Buttons
    stripData.buttons.push(
      {
        icon: "hover-strip-button-chat",
        dataset: {
          "item-name": this.name,
          "action": "chat"
        },
        tooltip: "CHAT"
      },
      {
        icon: "hover-strip-button-open",
        dataset: {
          "item-name": this.name,
          "action": "open"
        },
        tooltip: "VIEW"
      }
    );

    // Drop Button IF User has write permissions AND item isn't a SubItem AND item isn't a Basic Move AND sheet is unlocked
    if (this.isOwnedByUser() && !this.isSubItem() && !this.isBasicMove() && this.actor.is(K4ActorType.pc) && !this.actor.system.isSheetLocked) {
      stripData.buttons.push({
        icon: "hover-strip-button-drop",
        dataset: {
          "item-name": this.name,
          "action": "drop"
        },
        tooltip: "DROP"
      });
    }

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
          "chat-roll-result kult4th-result-static"
        ].join(" ")
      };
    }
    return this.itemSummaryContext;
  }

  chatTemplate = "systems/kult4th/templates/partials/item-block.hbs";
  triggerTemplate = "systems/kult4th/templates/sidebar/result-static.hbs";
  async displayItemSummary(speaker?: string) {
    const content = await renderTemplate(
      this.chatTemplate,
      this.itemSummaryContext
    );
    await K4ChatMessage.create({
      content,
      speaker: K4ChatMessage.getSpeaker({alias: speaker ?? ""}),
      flags: {
        kult4th: {
          cssClasses: [this.chatTheme, "item-summary"],
          isSummary: true,
          isAnimated: false,
          isRoll: false,
          isTrigger: false,
          isEdge: false
        }
      }
    });
  }

  async applyResult(result: Maybe<K4Item.Components.ResultData>, message: K4ChatMessage) {
    if (!result) { return Promise.all([]); }
    if (!this.isOwnedItem()) { return Promise.all([]); }
    const {edges, hold, effects} = result;
    /* Apply Hold, add Edges, build result-applied effects */
    const resultPromises: Array<Promise<unknown>> = []
    if (edges) {
      resultPromises.push(this.actor.updateEdges(edges, this));
    }
    if (hold) {
      resultPromises.push(this.updateHold(hold));
    }
    if (effects?.length) {
      const immediateEffects = effects.filter((buildData) => {
        if ("onChatSelection" in buildData.parentData) { return false; }
        return true;
      })
      resultPromises.push(K4ActiveEffect.CreateFromBuildData(
        immediateEffects,
        message,
        this.parent as K4Item<K4ItemType.gmtracker> | K4Actor<K4ActorType.pc>
      ));
    }
    return Promise.all(resultPromises);
  }

  async rollItem() {
    if (!this.hasResults()) {return;}
    if (!this.isOwnedItem()) {return;}
    if (!this.parent.is(K4ActorType.pc)) { return; }
    if (this.isEdge()) {
      void this.parent.spendEdge();
    }
    if (this.is(K4ItemType.move)) {
      const roll = new K4Roll({source: this as K4Item.Active}, this.parent);
      await roll._attribute;
      kLog.display("Evaluating Roll to Chat.");
      const message = await roll.evaluateToChat();
      if (message === false) { return; }
      kLog.display("Awaiting Animations Promise...");
      await message.animationsPromise;
      kLog.display("Animation Complete!");
      await this.applyResult(roll.getOutcomeData(), message);
    }
  }

  async triggerItem(speaker?: string) {
    if (!this.hasResults()) {return;}
    if (!this.isOwnedItem()) {return;}
    if (this.isEdge()) {
      void this.parent.spendEdge();
    }
    const content = K4ChatMessage.CapitalizeFirstLetter(
      await renderTemplate(
        this.triggerTemplate,
        this.triggerSummaryContext
      )
    ).replace(/This Move threatens Hold/g, "This Move Generates Hold");
    const message = (await K4ChatMessage.create({
      content,
      speaker: K4ChatMessage.getSpeaker({alias: speaker ?? ""}),
      flags: {
        kult4th: {
          cssClasses: [this.parentItem?.chatTheme ?? this.chatTheme],
          isSummary: false,
          isAnimated: true,
          isRoll: false,
          isTrigger: true,
          isEdge: this.isEdge()
        }
      }
    }));
    if (!message) {
      throw new Error("No message found for triggered Item result");
    }
    await message.animationsPromise;
    void this.applyResult(this.system.results.triggered, message);
  }
}
// #ENDREGION

// #endregion


// #region EXPORTS ~
export default K4Item;

console.log("K4ItemType:", K4ItemType);

export {
  K4ItemType,
  K4ItemSubType,
  K4ItemRange,
  K4RollResult
};
// #endregion