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


export const enum K4ItemType {
  advantage = "advantage",
  disadvantage = "disadvantage",
  move = "move",
  darksecret = "darksecret",
  relation = "relation",
  gear = "gear",
  attack = "attack",
  weapon = "weapon"
}

export const enum K4ItemSubType {
  activeRolled = "active-rolled",
  activeStatic = "active-static",
  passive = "passive"
}
export const enum K4ItemRange {
  arm = "arm",
  room = "room",
  field = "field",
  horizon = "horizon"
}
export const enum K4WeaponClass {
  meleeUnarmed = "melee-unarmed",
  meleeCrush = "melee-crush",
  meleeSlash = "melee-slash",
  meleeStab = "melee-stab",
  firearm = "firearm",
  bomb = "bomb"
}
export const enum K4ItemResultType {
  completeSuccess = "completeSuccess",
  partialSuccess = "partialSuccess",
  failure = "failure"
}

class K4Item extends Item {

  override prepareData() {
    super.prepareData();
    if (this.isOwnedItem() && this.isParentItem()) {
      this.system.subMoves = this.system.subItems.filter((subData) => subData.type === K4ItemType.move) as K4ItemSourceData.subMove[];
      this.system.subAttacks = this.system.subItems.filter((subData) => subData.type === K4ItemType.attack) as K4ItemSourceData.subAttack[];
      if (this.isRollableItem()) {
        this.system.results = this.system.subItems[0].data.results;
      }
    }
  }

  get key() { return this.system.key }
  _img?: string;
  override get img(): string { return (this._img ??= `systems/kult4th/assets/icons/${this.masterType}/${this.key}.svg`) }
  get itemSheet(): typeof this._sheet & K4ItemSheet | null { return this._sheet as typeof this._sheet & K4ItemSheet ?? null }
  get system() { return this.data.data as typeof this["data"]["data"] }

  get masterKey(): string {
    if (!this.isSubItem()) { return this.key }
    if (!this.isOwnedSubItem()) { return this.key }
    return game.items?.getName(this.system.sourceItem.name)?.key ?? this.key;
  }
  get masterType(): K4ItemType { return this.isSubItem() ? this.system.sourceItem.type : this.data.type }
  get masterName(): string { return this.isSubItem() ? this.system.sourceItem.name : this.name }

  isParentItem(): this is K4ParentItem { return Boolean("subItems" in this.system && this.system.subItems.length) }
  isSubItem(): this is K4SubItem { return Boolean("sourceItem" in this.system && this.system.sourceItem && this.system.sourceItem.name) }
  isOwnedItem(): this is {parent: K4Actor, itemSheet: K4ItemSheet} { return this.isEmbedded && this.parent instanceof Actor }
  isOwnedSubItem(): this is K4SubItem & {parent: K4Actor, itemSheet: K4ItemSheet, data: {data: {sourceItem: K4SourceItemData & {id: string}}}} { return this.isSubItem() && this.isOwnedItem() }
  isRollableItem(): this is K4RollableItem { return this.system.subType === K4ItemSubType.activeRolled }
  isStaticItem(): this is K4StaticItem { return this.system.subType === K4ItemSubType.activeStatic }
  isActiveItem(): this is K4ActiveItem { return this.isRollableItem() || this.isStaticItem() }
  isPassiveItem(): this is K4PassiveItem { return this.system.subType === K4ItemSubType.passive }

  get subItems(): K4SubItem[] { return (this.isOwnedItem() && this.isParentItem()) ? this.parent.getItemsBySource(this.id) : [] }
  get subMoves(): Array<K4SubItem<K4ItemType.move>> { return this.subItems.filter((subItem): subItem is K4SubItem<K4ItemType.move> => subItem.data.type === K4ItemType.move) }
  get subAttacks(): Array<K4SubItem<K4ItemType.attack>> { return this.subItems.filter((subItem): subItem is K4SubItem<K4ItemType.attack> => subItem.data.type === K4ItemType.attack) }
  get sourceItemData(): K4SourceItemData | null { return this.isSubItem() ? this.system.sourceItem : null }
  get sourceItem(): K4ParentItem | null { return this.isOwnedSubItem() ? this.parent.getEmbeddedDocument("Item", this.data.data.sourceItem.id) as K4ParentItem : null }

  applyEffectFunction(functionStr: string) {
    if (!this.isOwnedItem()) { return }
    const [funcName, ...params] = functionStr.split(/,/);
    switch (funcName) {
      case "AppendList": {
        const [targetItemName, targetList, sourceList] = params;
        const targetItem = this.parent.getItemByName(targetItemName); // items.find((item) => item.name === targetItemName && !item.isSubItem());
        kLog.log("Found Target Item", targetItem);
        if (targetItem && targetItem.system.lists[targetList]) {
          const sourceListItems = this.system.lists[sourceList].items
            .map((listItem) => `${listItem} #>text-list-note:data-item-name='${this.masterName}':data-action='open'>(from ${this.masterName})<#`);
          const updateData = [
            {_id: targetItem.id, [`data.lists.${targetList}.items`]: [
              ...targetItem.system.lists[targetList].items,
              ...sourceListItems
            ]}
          ];
          this.parent.updateEmbeddedDocuments("Item", updateData);
        }
      }
      // no default
    }
  }

  unapplyEffectFunction(functionStr: string) {
    if (!this.isOwnedItem()) { return }
    const [funcName, ...params] = functionStr.split(/,/);
    switch (funcName) {
      case "AppendList": {
        const [targetItemName, targetList, sourceList] = params;
        const targetItem = this.parent.getItemByName(targetItemName); // items.find((item) => item.name === targetItemName && !item.isSubItem());
        kLog.log("Found Target Move", targetItem);
        if (targetItem && targetItem.system.lists[targetList]) {
          const prunedListItems = this.system.lists[sourceList].items
            .filter((listItem) => !(new RegExp(`data-item-name=.?${this.masterName}.?`)).test(listItem));
          const updateData = [
            {_id: targetItem.id, [`data.lists.${targetList}.items`]: [
              ...prunedListItems
            ]}
          ];
          this.parent.updateEmbeddedDocuments("Item", updateData);
        }
      }
      // no default
    }
  }

  prepareSubItemData() {
    if (!this.isParentItem()) { return [] }
    return this.system.subItems
      .map((subData) => {
        subData.name ??= this.name;
        subData.data.sourceItem.id = this.id;
        if ("lists" in this.system) {
          subData.data.lists = {
            ...this.system.lists,
            ...subData.data.lists ?? {}
          };
        }
        return subData;
      }) as ItemDataConstructorData[] & Array<Record<string,unknown>>;
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
    await super._onCreate(...args);
    if (!this.isOwnedItem()) { return }
    if (this.isParentItem()) {
      await this.parent.createEmbeddedDocuments("Item", this.prepareSubItemData());
    }
    this.applyOnCreateEffectFunctions();
  }

  override async _onDelete(...args: Parameters<Item["_onDelete"]>) {
    await super._onDelete(...args);
    if (!this.isOwnedItem()) { return }
    if (this.isParentItem()) {
      this.subItems.forEach((item) => item.delete());
    }
    this.unapplyOnCreateEffectFunctions();
  }

  // get isRollable(): boolean { return }

  get hoverStrip(): HoverStripData {
    const stripType: K4ItemType = this.isSubItem() ? this.system.sourceItem.type : this.data.type;
    const theme = C.Themes[stripType];
    const stripData: HoverStripData = {
      id: this.id ?? `${this.data.type}-${U.randString(5)}`,
      type: this.data.type,
      icon: this.img,
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
      dataset: "attribute" in this.system
        ? {
            "hover-target": `.attribute-box[data-attribute='${this.system.attribute}'] img`
          }
        : {},
      buttons: []
    };
    if (this.data.type !== K4ItemType.relation) {
      stripData.tooltip = this.data.data.rules.trigger;
    }

    // Roll Button or Trigger Button?
    if (this.isOwnedItem() && this.isRollableItem()) {
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

  async displayItemSummary(speaker?: string) {
    const template = await getTemplate(this.sheetO?.template ?? "");

    const content = template(Object.assign(
      this.toObject(),
      {key: this.key}
    ));
    K4ChatMessage.create({
      content,
      speaker: K4ChatMessage.getSpeaker({alias: speaker ?? ""})/* ,
      options: {
        cssClass: "kult4th-chat"
      } */
    });
  }
}

declare interface K4Item {
  get id(): string;
  get name(): string;
}

export default K4Item;