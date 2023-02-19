import C from "../scripts/constants.js";
export default class K4ItemSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [C.SYSTEM_ID, "item", "sheet", "kult4th-sheet"],
            template: "systems/kult4th/templates/sheets/item-sheet.hbs",
            height: 590 * 0.75,
            width: 384 * 0.75,
            resizable: false
        });
    }
    isUnlocked = false;
    get item() { return super.item; }
    get type() { return this.item.data.type; }
    get subType() { return this.item.data.data.subType; }
    get subItems() { return this.item.subItems; }
    get subMoves() { return this.item.subMoves; }
    get attacks() { return this.item.subAttacks; }
    constructor(item, options = {}) {
        super(item, options);
        switch (item.data.type) {
            case "advantage" /* K4ItemType.advantage */: {
                this.options.classes.push("k4-theme-dgold");
                break;
            }
            case "darksecret" /* K4ItemType.darksecret */: {
                this.options.classes.push("k4-theme-dark");
                break;
            }
            case "disadvantage" /* K4ItemType.disadvantage */: {
                this.options.classes.push("k4-theme-red");
                break;
            }
            default: {
                this.options.classes.push("k4-theme-white");
                break;
            }
        }
    }
    activateListeners(html) {
        const opts = this.options;
        super.activateListeners(html);
        const self = this;
        $(() => {
            kLog.log("ITEM SHEET CONTEXT", { "this": this, self, html });
            function createOpenLinkFromName(elem, iName) {
                if (iName) {
                    if (self.document.isOwnedItem()) {
                        $(elem).on("click", () => self.actor?.getItemByName(iName)?.sheetO?.render(true));
                    }
                    else {
                        $(elem).on("click", () => Array.from(game.items ?? [])
                            .find((item) => ["move" /* K4ItemType.move */, "attack" /* K4ItemType.attack */].includes(item.type) && item.name === iName)
                            ?.sheetO?.render(true));
                    }
                }
            }
            function createTriggerLinkFromName(elem, iName) {
                if (iName) {
                    if (self.document.isOwnedItem()) {
                        $(elem).on("click", () => self.actor?.getItemByName(iName)?.sheetO?.render(true));
                    }
                    else {
                        $(elem).on("click", () => Array.from(game.items ?? [])
                            .find((item) => ["move" /* K4ItemType.move */, "attack" /* K4ItemType.attack */].includes(item.type) && item.name === iName)
                            ?.sheetO?.render(true));
                    }
                }
            }
            function createRollLinkFromName(elem, iName) {
                if (iName) {
                    if (self.document.isOwnedItem()) {
                        $(elem).on("click", () => kLog.log(`${self.actor?.name} Rolling (Embedded) ${iName}`));
                    }
                    else {
                        $(elem).on("click", () => kLog.log(`${self.actor?.name} Rolling ${iName}`));
                    }
                }
            }
            function createChatLinkFromName(elem, iName) {
                if (iName) {
                    if (self.document.isOwnedItem()) {
                        $(elem).on("click", () => kLog.log(`${self.actor?.name} Chatting (Embedded) ${iName}`));
                    }
                    else {
                        $(elem).on("click", () => kLog.log(`${self.actor?.name} Chatting ${iName}`));
                    }
                }
            }
            function createDeleteLinkFromName(elem, iName) {
                if (iName) {
                    if (self.document.isOwnedItem()) {
                        $(elem).on("click", () => kLog.log(`${self.actor?.name} Deleting (Embedded) ${iName}`));
                    }
                    else {
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
