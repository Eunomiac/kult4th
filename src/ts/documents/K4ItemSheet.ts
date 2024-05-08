// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import K4Item from "./K4Item.js";
import U from "../scripts/utilities.js";
import C from "../scripts/constants.js";
import K4Actor from "./K4Actor.js";
import {K4ItemType} from "./K4Item";
import {ItemDataSource} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

type K4ItemSheetOptions = DocumentSheetOptions & {
  testing: true
};
export default class K4ItemSheet extends ItemSheet {

  static override get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes:   [C.SYSTEM_ID, "item", "sheet", "kult4th-sheet"],
      template:  "systems/kult4th/templates/sheets/item-sheet.hbs",
      height:    590 * 0.75,
      width:     384 * 0.75,
      resizable: false
    });
  }

  public isUnlocked = false;
  override get item(): K4Item { return super.item; }
  get type() { return this.item.data.type; }
  get subType() { return this.item.data.data.subType; }
  get subItems() { return this.item.subItems; }
  get subMoves() { return this.item.subMoves; }
  get attacks() { return this.item.subAttacks; }

  constructor(item: K4Item, options: Partial<ItemSheet.Options> = {}) {
    super(item, options);

    switch (item.data.type) {
      case K4ItemType.advantage: {
        this.options.classes.push("k4-theme-dgold");
        break;
      }
      case K4ItemType.darksecret: {
        this.options.classes.push("k4-theme-dark");
        break;
      }
      case K4ItemType.disadvantage: {
        this.options.classes.push("k4-theme-red");
        break;
      }
      default: {
        this.options.classes.push("k4-theme-white");
        break;
      }
    }
  }

  override activateListeners(html: JQuery<HTMLElement>): void {

    const opts = this.options;
    super.activateListeners(html);
    const self = this;

    $(() => {
      kLog.log("ITEM SHEET CONTEXT", {this: this, self, html});

      function createOpenLinkFromName(elem: JQuery<HTMLElement>|HTMLElement, iName?: string): void {
        if (iName) {
          if (self.document.isOwnedItem()) {
            $(elem).on("click", () => self.actor?.getItemByName(iName)?.sheetO?.render(true));
          } else {
            $(elem).on("click", () => Array.from(game.items ?? [])
              .find((item) => [K4ItemType.move, K4ItemType.attack].includes(item.type as K4ItemType) && item.name === iName)
              ?.sheetO?.render(true));
          }
        }
      }

      function createTriggerLinkFromName(elem: JQuery<HTMLElement>|HTMLElement, iName?: string): void {
        if (iName) {
          if (self.document.isOwnedItem()) {
            $(elem).on("click", () => self.actor?.getItemByName(iName)?.sheetO?.render(true));
          } else {
            $(elem).on("click", () => Array.from(game.items ?? [])
              .find((item) => [K4ItemType.move, K4ItemType.attack].includes(item.type as K4ItemType) && item.name === iName)
              ?.sheetO?.render(true));
          }
        }
      }

      function createRollLinkFromName(elem: JQuery<HTMLElement>|HTMLElement, iName?: string): void {
        if (iName) {
          if (self.document.isOwnedItem()) {
            $(elem).on("click", () => kLog.log(`${self.actor?.name} Rolling (Embedded) ${iName}`));
          } else {
            $(elem).on("click", () => kLog.log(`${self.actor?.name} Rolling ${iName}`));
          }
        }
      }

      function createChatLinkFromName(elem: JQuery<HTMLElement>|HTMLElement, iName?: string): void {
        if (iName) {
          if (self.document.isOwnedItem()) {
            $(elem).on("click", () => kLog.log(`${self.actor?.name} Chatting (Embedded) ${iName}`));
          } else {
            $(elem).on("click", () => kLog.log(`${self.actor?.name} Chatting ${iName}`));
          }
        }
      }

      function createDeleteLinkFromName(elem: JQuery<HTMLElement>|HTMLElement, iName?: string): void {
        if (iName) {
          if (self.document.isOwnedItem()) {
            $(elem).on("click", () => kLog.log(`${self.actor?.name} Deleting (Embedded) ${iName}`));
          } else {
            $(elem).on("click", () => kLog.log(`${self.actor?.name} Deleting ${iName}`));
          }
        }
      }
      // getTriggerAnim(html.find(".text-trigger")[0]);

      html.find("*[data-action=\"open\"]")
        .each(function addItemOpenEvents() {
          createOpenLinkFromName(this, $(this).attr("data-item-name"));
        });
      html.find("*[data-action=\"trigger\"]")
        .each(function addItemTriggerEvents() {
          createTriggerLinkFromName(this, $(this).attr("data-item-name"));
        });
      html.find("*[data-action=\"roll\"]")
        .each(function addItemRollEvents() {
          createRollLinkFromName(this, $(this).attr("data-item-name"));
        });
      html.find("*[data-action=\"chat\"]")
        .each(function addItemChatEvents() {
          createChatLinkFromName(this, $(this).attr("data-item-name"));
        });
      html.find("*[data-action=\"drop\"]")
        .each(function addItemDropEvents() {
          createDeleteLinkFromName(this, $(this).attr("data-item-name"));
        });
    });

    // Apply custom styles to TinyMCE editors
    // const editors = Object.values(this.editors);

    // <div>{{editor content=data.trigger target="data.trigger" button=true owner=owner editable=editable}}</div>
  }
}