// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import K4Item from "./K4Item.js";
import C from "../scripts/constants.js";
import K4Actor from "./K4Actor.js";
import {K4ItemType} from "./K4Item";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

type K4ItemSheetOptions = DocumentSheetOptions & {
  testing: true
};
export default class K4ItemSheet extends ItemSheet {

  static override get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes:   [C.SYSTEM_ID, "sheet", "k4-sheet", "k4-item-sheet"],
      template:  "systems/kult4th/templates/sheets/item-sheet.hbs",
      height:    590 * 0.75,
      width:     384 * 0.75,
      resizable: false
    });
  }

  public isUnlocked = false;
  override get item(): K4Item { return super.item; }
  get type() { return this.item.type; }
  get subType() { return this.item.system.subType; }
  get subItems() { return this.item.subItems; }
  get subMoves() { return this.item.subMoves; }
  get attacks() { return this.item.subAttacks; }

  constructor(item: K4Item, options: Partial<ItemSheet.Options> = {}) {
    super(item, options);

    switch (item.type) {
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

  override activateListeners(html: JQuery): void {

    super.activateListeners(html);
    const self = this;
    const itemDoc = this.document as K4Item;
    const parentActor: Maybe<K4Actor> = this.actor instanceof K4Actor ? this.actor : undefined;

    $(() => {
      kLog.log("ITEM SHEET CONTEXT", {this: this, self, html});

      const height = html.height() ?? 0;

      if (height > 450 || html.find(".k4-header").length > 0) {
        html.parent().addClass("wide-content");
      }

      function createOpenLinkFromName(elem: JQuery|HTMLElement, iName?: string): void {
        if (iName) {
          if (itemDoc.isOwnedItem()) {
            $(elem).on("click", () => parentActor?.getItemByName(iName)?.sheet?.render(true));
          } else {
            $(elem).on("click", () => (Array.from(game.items ?? []) as K4Item[])
              .find((item) => [K4ItemType.move, K4ItemType.attack].includes(item.type) && item.name === iName)
              ?.sheet?.render(true));
          }
        }
      }

      function createTriggerLinkFromName(elem: JQuery|HTMLElement, iName?: string): void {
        if (iName) {
          if (itemDoc.isOwnedItem()) {
            $(elem).on("click", () => parentActor?.getItemByName(iName)?.sheet?.render(true));
          } else {
            $(elem).on("click", () => (Array.from(game.items ?? []) as K4Item[])
              .find((item) => [K4ItemType.move, K4ItemType.attack].includes(item.type) && item.name === iName)
              ?.sheet?.render(true));
          }
        }
      }

      function createRollLinkFromName(elem: JQuery|HTMLElement, iName?: string): void {
        if (iName) {
          if (itemDoc.isOwnedItem()) {
            $(elem).on("click", () => kLog.log(`${self.actor?.name} Rolling (Embedded) ${iName}`));
          } else {
            $(elem).on("click", () => kLog.log(`${self.actor?.name} Rolling ${iName}`));
          }
        }
      }

      function createChatLinkFromName(elem: JQuery|HTMLElement, iName?: string): void {
        if (iName) {
          if (itemDoc.isOwnedItem()) {
            $(elem).on("click", () => kLog.log(`${self.actor?.name} Chatting (Embedded) ${iName}`));
          } else {
            $(elem).on("click", () => kLog.log(`${self.actor?.name} Chatting ${iName}`));
          }
        }
      }

      function createDeleteLinkFromName(elem: JQuery|HTMLElement, iName?: string): void {
        if (iName) {
          if (itemDoc.isOwnedItem()) {
            $(elem).on("click", () => kLog.log(`${self.actor?.name} Deleting (Embedded) ${iName}`));
          } else {
            $(elem).on("click", () => kLog.log(`${self.actor?.name} Deleting ${iName}`));
          }
        }
      }
      // getTriggerAnim(html.find(".text-trigger")[0]);

      html.find("*[data-action=\"open\"]")
        .each(function() {
          createOpenLinkFromName(this, $(this).attr("data-item-name"));
        });
      html.find("*[data-action=\"trigger\"]")
        .each(function() {
          createTriggerLinkFromName(this, $(this).attr("data-item-name"));
        });
      html.find("*[data-action=\"roll\"]")
        .each(function() {
          createRollLinkFromName(this, $(this).attr("data-item-name"));
        });
      html.find("*[data-action=\"chat\"]")
        .each(function() {
          createChatLinkFromName(this, $(this).attr("data-item-name"));
        });
      html.find("*[data-action=\"drop\"]")
        .each(function() {
          createDeleteLinkFromName(this, $(this).attr("data-item-name"));
        });
    });
  }
  override _canDragStart(_dragSelector: string) {
    kLog.log("K4ItemSheet._canDragStart", `Not Implemented. _dragSelector: ${_dragSelector}`);
    return false;
  }

  override _canDragDrop(_dropSelector: string) {
    kLog.log("K4ItemSheet._canDragDrop", `Not Implemented. _dropSelector: ${_dropSelector}`);
    return false;
  }

  override _onDragOver(_event: DragEvent) {
    kLog.log("K4ItemSheet._onDragOver", "Not Implemented", {dragEvent: _event});
  }

  override _onDrop(_event: DragEvent) {
    kLog.log("K4ItemSheet._onDrop", "Not Implemented", {dragEvent: _event});
  }

  override _onDragStart(_event: DragEvent) {
    kLog.log("K4ItemSheet._onDragStart", "Not Implemented", {dragEvent: _event});
  }
}