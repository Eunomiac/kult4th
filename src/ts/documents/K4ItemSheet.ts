// #region IMPORTS ~
import K4Item from "./K4Item.js";
import C from "../scripts/constants.js";
import K4Actor from "./K4Actor.js";
import {K4ItemType} from "./K4Item";
import K4ActiveEffect from "./K4ActiveEffect.js";
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

  constructor(item: K4Item, options: Partial<ItemSheet.Options> = {}) {
    super(item, options);

    switch (item.type) {
      case K4ItemType.advantage: {
        this.options.classes.push("k4-theme-gold");
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

      // Function to get the text alignment of an element
      function getTextAlignment(element: JQuery): "left"|"center"|"right" {
        if (element.css("text-align") === "justify") {
          return "left";
        }
        if (["left", "center", "right"].includes(element.css("text-align"))) {
          return element.css("text-align") as "left"|"center"|"right";
        }
        throw new Error(`Invalid text alignment: ${element.css("text-align")}`);
      }

      // Function to set the transform origin based on text alignment
      function getTransformOrigin(element: JQuery): string {
        switch (getTextAlignment(element)) {
          case "left": return "0% 50%";
          case "right": return "100% 50%";
          case "center": return "50% 50%";
        }
      }

      // Function to squeeze text to fit within its container
      function squeezeText(element: JQuery): void {
        // Temporarily set width to auto and white-space to nowrap to measure natural width
        element.css({
          "width": "max-content",
          "white-space": "nowrap"
        });

        const naturalWidth = element.width() ?? 0;
        const containerWidth = element.parent().width() ?? 0;
        const padding = 5; // Allow for 5px padding

        // Calculate the scaleX factor
        const scaleX = Math.min(1, (containerWidth) / (naturalWidth + 5));

        // Reset the width and white-space properties
        element.css({
          "width": "",
          "white-space": ""
        });

        // Apply the scaleX transformation
        element.css({
          "transform": `scaleX(${scaleX})`,
          "transform-origin": "0% 50%"
        });
      }

      // Search for title element, edge notices, hold notices
      html.find(".k4-title.item-title, .k4-header.hold-header, .k4-header.edges-header").each(function() {
        const element = $(this);
        getTransformOrigin(element);
        squeezeText(element);
      });

      // Function to check if the text in the element wraps
      function doesTextWrap(element: JQuery): boolean {
        const lineHeight = parseInt(element.css("line-height"), 10);
        const elementHeight = element.height() ?? 0;
        return elementHeight > lineHeight;
      }

      // Search for any elements with "conditional-center" class. Check if the text contents wrap to another line.
      html.find(".conditional-center").each(function() {
        const element = $(this);
        if (!doesTextWrap(element)) {
          element.addClass("center");
        }
      });

      // Search for any elements with "conditional-center" class. Check if the text contents wrap to another line.
      html.find(".conditional-center").each(function() {
        const element = $(this);
        // Check if the scroll height is greater than the client height, indicating text wrapping.
        if (element.prop("scrollHeight") > element.prop("clientHeight")) {
          element.addClass("center");
        }
      });

      // Quick active effects control for dev purposes
      html.find(".effect-control").on("click", (ev) => {
        if ( self.item.isOwned ) {
          ui.notifications.warn(game.i18n.localize("BITD.EffectWarning"));
          return undefined;
        }
        void K4ActiveEffect.onManageActiveEffect(ev, self.item);
      });



      function createOpenLinkFromName(elem: JQuery|HTMLElement, iName?: string): void {
        if (iName) {
          if (itemDoc.isOwnedItem()) {
            $(elem).on("click", () => parentActor?.getItemByName(iName)?.sheet.render(true));
          } else {
            $(elem).on("click", () => (Array.from(game.items ?? []) as K4Item[])
              .find((item) => item.type === K4ItemType.move && item.name === iName)
              ?.sheet.render(true));
          }
        }
      }

      function createTriggerLinkFromName(elem: JQuery|HTMLElement, iName?: string): void {
        if (iName) {
          if (itemDoc.isOwnedItem()) {
            $(elem).on("click", () => parentActor?.getItemByName(iName)?.sheet.render(true));
          } else {
            $(elem).on("click", () => (Array.from(game.items ?? []) as K4Item[])
              .find((item) => item.type === K4ItemType.move && item.name === iName)
              ?.sheet.render(true));
          }
        }
      }

      function createRollLinkFromName(elem: JQuery|HTMLElement, iName?: string): void {
        if (iName) {
          if (itemDoc.isOwnedItem()) {
            $(elem).on("click", () => { kLog.log(`${self.actor?.name} Rolling (Embedded) ${iName}`); });
          } else {
            $(elem).on("click", () => { kLog.log(`${self.actor?.name} Rolling ${iName}`); });
          }
        }
      }

      function createChatLinkFromName(elem: JQuery|HTMLElement, iName?: string): void {
        if (iName) {
          if (itemDoc.isOwnedItem()) {
            $(elem).on("click", () => { kLog.log(`${self.actor?.name} Chatting (Embedded) ${iName}`); });
          } else {
            $(elem).on("click", () => { kLog.log(`${self.actor?.name} Chatting ${iName}`); });
          }
        }
      }

      function createDeleteLinkFromName(elem: JQuery|HTMLElement, iName?: string): void {
        if (iName) {
          if (itemDoc.isOwnedItem()) {
            $(elem).on("click", () => { kLog.log(`${self.actor?.name} Deleting (Embedded) ${iName}`); });
          } else {
            $(elem).on("click", () => { kLog.log(`${self.actor?.name} Deleting ${iName}`); });
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