// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "../scripts/utilities.js";
import K4ItemSheet from "./K4ItemSheet.js";
import K4ChatMessage from "./K4ChatMessage.js";
import C from "../scripts/constants.js";
import K4Actor from "./K4Actor.js";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion




export enum K4ItemType {
  advantage = "advantage",
  disadvantage = "disadvantage",
  move = "move",
  darksecret = "darksecret",
  relation = "relation",
  gear = "gear",
  attack = "attack",
  weapon = "weapon"
}

export enum K4ItemSubType {
  activeRolled = "active-rolled",
  activeStatic = "active-static",
  passive = "passive"
}
export enum K4ItemRange {
  arm = "arm",
  room = "room",
  field = "field",
  horizon = "horizon"
}
export enum K4WeaponClass {
  meleeUnarmed = "melee-unarmed",
  meleeCrush = "melee-crush",
  meleeSlash = "melee-slash",
  meleeStab = "melee-stab",
  firearm = "firearm",
  bomb = "bomb"
}
export enum K4ItemResultType {
  completeSuccess = "completeSuccess",
  partialSuccess = "partialSuccess",
  failure = "failure"
}


class K4Item extends Item {

  is<T extends K4ItemType>(...types: T[]): this is K4Item<T> {
    // @ts-expect-error -- Unable to resolve 'this.type' and 'type' to the same type.
    return types.some((type) => this.type === type);
  }

  isParentItem(): this is K4ParentItem { return Boolean("subItems" in this.system && this.system.subItems.length); }
  isSubItem(): this is K4SubItem { return Boolean("sourceItem" in this.system && this.system.sourceItem?.name); }
  isOwnedItem(): this is {parent: K4Actor, itemSheet: K4ItemSheet} { return this.isEmbedded && this.parent instanceof Actor; }
  isOwnedSubItem(): this is K4SubItem & {parent: K4Actor, itemSheet: K4ItemSheet, system: {sourceItem: K4SourceItemData & {id: string}}} { return this.isSubItem() && this.isOwnedItem(); }
  isRollableItem(): this is K4RollableItem { return this.system.subType === K4ItemSubType.activeRolled; }
  isStaticItem(): this is K4StaticItem { return this.system.subType === K4ItemSubType.activeStatic; }
  isActiveItem(): this is K4ActiveItem { return this.isRollableItem() || this.isStaticItem(); }
  isPassiveItem(): this is K4PassiveItem { return this.system.subType === K4ItemSubType.passive; }
  hasRules(): this is K4RulesItem { return "rules" in this.system;}


  doParentStuff(item: K4Item) {
    if (item.isParentItem()) {
      // Do stuff with system.subItems, without knowing exactly the type of item.
    }
  }

  hasSubMoves(): this is K4ParentItem { return "subMoves" in this.system; }

  override prepareData() {
    super.prepareData();
    if (this.isOwnedItem() && this.isParentItem() && "subMoves" in this.system) {
      this.system.subMoves = this.system.subItems.filter((subData): subData is K4SubItemSchema.subMove => subData.type === K4ItemType.move);
      this.system.subAttacks = this.system.subItems.filter((subData): subData is K4SubItemSchema.subAttack => subData.type === K4ItemType.attack);
      if (this.isRollableItem() && "results" in this.system) {
        this.system.results = this.system.subItems[0].system.results;
      }
    }
  }

  get key() { return this.system.key; }
  _img?: string;
  // override get img(): string {
  //   this._img ??= `systems/kult4th/assets/icons/${this.masterType}/${this.key}.svg`;
  //   return this._img;
  // }
  get itemSheet(): typeof this._sheet & K4ItemSheet | null { return this._sheet as typeof this._sheet & K4ItemSheet ?? null; }

  get masterKey(): string {
    if (!this.isSubItem()) { return this.key; }
    if (!this.isOwnedSubItem()) { return this.key; }
    const keyItem = game.items?.getName(this.system.sourceItem.name) as Maybe<K4Item>;
    if (keyItem?.key) { return keyItem.key; }
    return this.key;
  }
  get masterType(): K4ItemType { return this.isSubItem() ? this.system.sourceItem?.type : this.type; }
  get masterName(): string { return this.isSubItem() ? this.system.sourceItem?.name : this.name; }



  get sourceItemData(): K4SourceItemData | null {
    if (!this.isSubItem()) { return null; }
    return this.system.sourceItem;
  }

  get sourceItem(): K4ParentItem | null {
    if (!this.isOwnedSubItem()) { return null; }
    const sourceItem = this.parent.getEmbeddedDocument("Item", this.system.sourceItem.id) as Maybe<K4ParentItem>;
    if (!sourceItem) { return null; }
    return sourceItem;
  }

  get subItems(): K4SubItem[] {
    return (this.isOwnedItem() && this.isParentItem()) ? this.parent.getItemsBySource(this.id) : [];
  }

  get subMoves(): Array<K4SubItem<K4ItemType.move>> {
    return this.subItems.filter((subItem): subItem is K4SubItem<K4ItemType.move> => subItem.type === K4ItemType.move);
  }

  get subAttacks(): Array<K4SubItem<K4ItemType.attack>> {
    return this.subItems.filter((subItem): subItem is K4SubItem<K4ItemType.attack> => subItem.type === K4ItemType.attack);
  }

  async applyEffectFunction(functionStr: string) {
    if (!this.isOwnedItem()) { return; }
    const [funcName, ...params] = functionStr.split(/,/);
    switch (funcName) {
      case "AppendList": {
        const [targetItemName, targetList, sourceList] = params;
        const targetItem: Maybe<K4Item> = this.parent.getItemByName(targetItemName);
        kLog.log("Found Target Item", targetItem);
        if (targetItem?.system.lists[targetList]) {
          const sourceListItems = this.system.lists[sourceList].items
            .map((listItem: string) => `${listItem} #>text-list-note:data-item-name='${this.masterName}':data-action='open'>(from ${this.masterName})<#`);
          const updateData = [
            {
              _id:                                  targetItem.id,
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
      case "_Unimplemented_1": {
        throw new Error(`Unimplemented Effect Function: ${funcName}`);
      }
      case "_Unimplemented_2": {
        throw new Error(`Unimplemented Effect Function: ${funcName}`);
      }
      default: {
        throw new Error(`Unknown Effect Function: ${funcName}`);
      }
    }
  }

  async unapplyEffectFunction(functionStr: string) {
    if (!this.isOwnedItem()) { return; }
    const [funcName, ...params] = functionStr.split(/,/);
    switch (funcName) {
      case "AppendList": {
        const [targetItemName, targetList, sourceList] = params;
        const targetItem: K4Item | undefined = this.parent.getItemByName(targetItemName);
        kLog.log("Found Target Move", targetItem);
        if (targetItem?.system.lists[targetList]) {
          const prunedListItems = this.system.lists[sourceList].items
            .filter((listItem) => !(new RegExp(`data-item-name=.?${this.masterName}.?`)).test(listItem));
          const updateData = [
            {
              _id:                                  targetItem.id,
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
        throw new Error(`Unknown Effect Function: ${funcName}`);
      }
    }
  }

  prepareSubItemData() {
    if (!this.isParentItem()) { return []; }
    return this.system.subItems
      .map((subData) => {
        subData.name ??= this.name;
        subData.system.sourceItem.id = this.id;
        if ("lists" in this.system) {
          subData.system.lists = {
            ...this.system.lists,
            ...subData.system.lists ?? {}
          };
        }
        return subData;
      }) as Array<K4SubItemSchema.subItem & Record<string, unknown>>;
  }

  applyOnCreateEffectFunctions() {
    if ("rules" in this.system && this.system.rules.effectFunctions) {
      this.system.rules.effectFunctions.forEach((funcString) => this.applyEffectFunction(funcString));
    }
  }
  unapplyOnCreateEffectFunctions() {
    if ("rules" in this.system && this.system.rules.effectFunctions) {
      this.system.rules.effectFunctions.forEach((funcString) => this.unapplyEffectFunction(funcString));
    }
  }

  override async _onCreate(...args: Parameters<Item["_onCreate"]>) {
    super._onCreate(...args);
    if (!this.isOwnedItem()) { return; }
    if (this.isParentItem()) {
      await this.parent.createEmbeddedDocuments("Item", this.prepareSubItemData());
    }
    this.applyOnCreateEffectFunctions();
  }

  override _onDelete(...args: Parameters<Item["_onDelete"]>) {
    super._onDelete(...args);
    if (!this.isOwnedItem()) { return; }
    if (this.isParentItem()) {
      this.subItems.forEach((item) => item.delete());
    }
    this.unapplyOnCreateEffectFunctions();
  }

  // get isRollable(): boolean { return }

  get hoverStrip(): HoverStripData {
    const stripType: K4ItemType = this.isSubItem() ? this.system.sourceItem.type : this.type;
    const theme = C.Themes[stripType];
    const stripData: HoverStripData = {
      id:      this.id ?? `${this.type}-${U.randString(5)}`,
      type:    this.type,
      icon:    this.img ?? "",
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
    if (this.isOwnedItem() && this.isRollableItem()) {
      stripData.buttons.push({
        icon:    "hover-strip-button-roll",
        dataset: {
          "item-name": this.name ?? "",
          "action":    "roll"
        },
        tooltip: "ROLL"
      });
    } else if (this.isStaticItem()) {
      stripData.buttons.push({
        icon:    "hover-strip-button-trigger",
        dataset: {
          "item-name": this.name ?? "",
          "action":    "trigger"
        },
        tooltip: "TRIGGER"
      });
    }

    // Chat & View Buttons
    stripData.buttons.push(
      {
        icon:    "hover-strip-button-chat",
        dataset: {
          "item-name": this.name ?? "",
          "action":    "chat"
        },
        tooltip: "CHAT"
      },
      {
        icon:    "hover-strip-button-open",
        dataset: {
          "item-name": this.name ?? "",
          "action":    "open"
        },
        tooltip: "VIEW"
      }
    );

    // Drop Button IF Sheet Unlocked AND Owner AND NOT SubItem
    if (this.isOwnedItem() && !this.isSubItem() && this.itemSheet?.isUnlocked /* && check for user permissions */) {
      stripData.buttons.push({
        icon:    "hover-strip-button-drop",
        dataset: {
          "item-name": this.name ?? "",
          "action":    "drop"
        },
        tooltip: "DROP"
      });
    }

    // kLog.log("Hover Strip Data", stripData);
    return stripData;
  }

  get itemSummaryContext() {
    return {
      name:     this.name,
      img:      this.img,
      system:   this.system,
      item:     this,
      cssClass: "kult4th-chat kult4th-item-display"
    };
  }

  chatTemplate = "systems/kult4th/templates/sidebar/item-display.hbs";
  async displayItemSummary(speaker?: string) {
    const template = await getTemplate(this.chatTemplate);

    const content = template(this.itemSummaryContext);
    await K4ChatMessage.create({
      content,
      speaker: K4ChatMessage.getSpeaker({alias: speaker ?? ""})
    });
  }
}

declare interface K4Item<Type extends K4ItemType = K4ItemType> {
  get id(): IDString;
  get name(): string;
  get type(): Type;
  get sheet(): K4Item["_sheet"] & K4ItemSheet;
  system: K4ItemSystem<Type>;
  parent: Maybe<K4Item|K4Actor>;
}

export default K4Item;