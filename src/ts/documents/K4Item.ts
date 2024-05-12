// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "../scripts/utilities.js";
import K4ItemSheet from "./K4ItemSheet.js";
import K4ChatMessage from "./K4ChatMessage.js";
import C from "../scripts/constants.js";
import K4Actor from "./K4Actor.js";
import {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
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

  hasSubMoves(): this is K4ParentItem { return "subMoves" in this.data.data; }

  override prepareData() {
    super.prepareData();
    if (this.isOwnedItem() && this.isParentItem() && "subMoves" in this.data.data) {
      this.data.data.subMoves = this.data.data.subItems.filter((subData): subData is K4ItemSourceData.subMove => subData.type === K4ItemType.move);
      this.data.data.subAttacks = this.data.data.subItems.filter((subData): subData is K4ItemSourceData.subAttack => subData.type === K4ItemType.attack);
      if (this.isRollableItem() && "results" in this.data.data) {
        this.data.data.results = this.data.data.subItems[0].data.results;
      }
    }
  }

  get key() { return this.data.data.key; }
  _img?: string;
  // override get img(): string {
  //   this._img ??= `systems/kult4th/assets/icons/${this.masterType}/${this.key}.svg`;
  //   return this._img;
  // }
  get itemSheet(): typeof this._sheet & K4ItemSheet | null { return this._sheet as typeof this._sheet & K4ItemSheet ?? null; }

  get masterKey(): string {
    if (!this.isSubItem()) { return this.key; }
    if (!this.isOwnedSubItem()) { return this.key; }
    const keyItem = game.items?.getName(this.data.data.sourceItem.name) as Maybe<K4Item>;
    if (keyItem?.key) { return keyItem.key; }
    return this.key;
  }
  get masterType(): K4ItemType { return this.isSubItem() ? this.data.data.sourceItem.type : this.data.type; }
  get masterName(): string { return this.isSubItem() ? this.data.data.sourceItem.name : this.name; }

  isParentItem(): this is K4ParentItem { return Boolean("subItems" in this.data.data && this.data.data.subItems.length); }
  isSubItem(): this is K4SubItem { return Boolean("sourceItem" in this.data.data && this.data.data.sourceItem?.name); }
  isOwnedItem(): this is {parent: K4Actor, itemSheet: K4ItemSheet} { return this.isEmbedded && this.parent instanceof Actor; }
  isOwnedSubItem(): this is K4SubItem & {parent: K4Actor, itemSheet: K4ItemSheet, data: {data: {sourceItem: K4SourceItemData & {id: string}}}} { return this.isSubItem() && this.isOwnedItem(); }
  isRollableItem(): this is K4RollableItem { return this.data.data.subType === K4ItemSubType.activeRolled; }
  isStaticItem(): this is K4StaticItem { return this.data.data.subType === K4ItemSubType.activeStatic; }
  isActiveItem(): this is K4ActiveItem { return this.isRollableItem() || this.isStaticItem(); }
  isPassiveItem(): this is K4PassiveItem { return this.data.data.subType === K4ItemSubType.passive; }

  get sourceItemData(): K4SourceItemData | null {
    if (!this.isSubItem()) { return null; }
    return this.data.data.sourceItem;
  }

  get sourceItem(): K4ParentItem | null {
    if (!this.isOwnedSubItem()) { return null; }
    const sourceItem = this.parent.getEmbeddedDocument("Item", this.data.data.sourceItem.id) as Maybe<K4ParentItem>;
    if (!sourceItem) { return null; }
    return sourceItem;
  }

  get subItems(): K4SubItem[] {
    return (this.isOwnedItem() && this.isParentItem()) ? this.parent.getItemsBySource(this.id) : [];
  }

  get subMoves(): Array<K4SubItem<K4ItemType.move>> {
    return this.subItems.filter((subItem): subItem is K4SubItem<K4ItemType.move> => subItem.data.type === K4ItemType.move);
  }

  get subAttacks(): Array<K4SubItem<K4ItemType.attack>> {
    return this.subItems.filter((subItem): subItem is K4SubItem<K4ItemType.attack> => subItem.data.type === K4ItemType.attack);
  }

  async applyEffectFunction(functionStr: string) {
    if (!this.isOwnedItem()) { return; }
    const [funcName, ...params] = functionStr.split(/,/);
    switch (funcName) {
      case "AppendList": {
        const [targetItemName, targetList, sourceList] = params;
        const targetItem: Maybe<K4Item> = this.parent.getItemByName(targetItemName);
        kLog.log("Found Target Item", targetItem);
        if (targetItem?.data.data.lists[targetList]) {
          const sourceListItems = this.data.data.lists[sourceList].items
            .map((listItem: string) => `${listItem} #>text-list-note:data-item-name='${this.masterName}':data-action='open'>(from ${this.masterName})<#`);
          const updateData = [
            {
              _id:                                targetItem.id,
              [`data.lists.${targetList}.items`]: [
                ...targetItem.data.data.lists[targetList].items,
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
        if (targetItem?.data.data.lists[targetList]) {
          const prunedListItems = this.data.data.lists[sourceList].items
            .filter((listItem) => !(new RegExp(`data-item-name=.?${this.masterName}.?`)).test(listItem));
          const updateData = [
            {_id:                                targetItem.id, [`data.lists.${targetList}.items`]: [
              ...prunedListItems
            ] }
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
    return this.data.data.subItems
      .map((subData) => {
        subData.name ??= this.name;
        subData.data.sourceItem.id = this.id;
        if ("lists" in this.data.data) {
          subData.data.lists = {
            ...this.data.data.lists,
            ...subData.data.lists ?? {}
          };
        }
        return subData;
      }) as ItemDataConstructorData[] & Array<Record<string, unknown>>;
  }

  applyOnCreateEffectFunctions() {
    if ("rules" in this.data.data && this.data.data.rules.effectFunctions) {
      this.data.data.rules.effectFunctions.forEach((funcString) => this.applyEffectFunction(funcString));
    }
  }
  unapplyOnCreateEffectFunctions() {
    if ("rules" in this.data.data && this.data.data.rules.effectFunctions) {
      this.data.data.rules.effectFunctions.forEach((funcString) => this.unapplyEffectFunction(funcString));
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
    const stripType: K4ItemType = this.isSubItem() ? this.data.data.sourceItem.type : this.data.type;
    const theme = C.Themes[stripType];
    const stripData: HoverStripData = {
      id:      this.id ?? `${this.data.type}-${U.randString(5)}`,
      type:    this.data.type,
      icon:    this.img ?? "",
      display: this.name ?? "(enter name)",
      ...this.isSubItem()
        ? {
            stripClasses: [
              U.toKey(`${stripType}-strip`),
              `derived-${this.data.type}`,
              theme
            ]
          }
        : {
            stripClasses: [
              U.toKey(`${stripType}-strip`),
              theme
            ]
          },
      dataset: "attribute" in this.data.data
        ? {
            "hover-target": `.attribute-box[data-attribute='${this.data.data.attribute}'] img`
          }
        : {},
      buttons: []
    };
    if (this.data.type !== K4ItemType.relation) {
      stripData.tooltip = this.data.data.rules?.trigger;
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
      data:     this.data,
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

declare interface K4Item {
  get id(): string;
  get name(): string;
  parent: Maybe<K4Item|K4Actor>;
}

export default K4Item;