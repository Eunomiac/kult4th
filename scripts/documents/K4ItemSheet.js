import C from "../scripts/constants.js";
export default class K4ItemSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [C.SYSTEM_ID, "item", "sheet", "dark-on-light"]
        });
    }
    get template() { return `systems/kult4th/templates/sheets/${this.type}-sheet.hbs`; }
    get item() { return super.item; }
    get type() { return this.item.data.type; }
    get subType() { return this.item.data.data.subType; }
    get subItems() { return this.item.data.data.subItemData; }
    get subMoves() { return this.item.data.data.subMoveData; }
    get attacks() { return this.item.data.data.subAttackData; }
    activateListeners(html) {
        super.activateListeners(html);
        const self = this;
        $(() => {
            console.log("ITEM SHEET CONTEXT", { "this": this, self, html });
            function createOpenLinkFromName(elem, iName) {
                if (iName) {
                    if (self.document.isEmbedded) {
                        $(elem).on("click", () => self.actor?.getItemByName(iName)?.sheet?.render(true));
                    }
                    else {
                        $(elem).on("click", () => Array.from(game.items ?? [])
                            .find((item) => ["move" /* K4ItemType.move */, "attack" /* K4ItemType.attack */].includes(item.type) && item.name === iName)
                            ?.sheet?.render(true));
                    }
                }
            }
            function createRollLinkFromName(elem, iName) {
                if (iName) {
                    if (self.document.isEmbedded) {
                        $(elem).on("click", () => console.log(`${self.actor?.name} Rolling (Embedded) ${iName}`));
                    }
                    else {
                        $(elem).on("click", () => console.log(`${self.actor?.name} Rolling ${iName}`));
                    }
                }
            }
            function createChatLinkFromName(elem, iName) {
                if (iName) {
                    if (self.document.isEmbedded) {
                        $(elem).on("click", () => console.log(`${self.actor?.name} Chatting (Embedded) ${iName}`));
                    }
                    else {
                        $(elem).on("click", () => console.log(`${self.actor?.name} Chatting ${iName}`));
                    }
                }
            }
            function createDeleteLinkFromName(elem, iName) {
                if (iName) {
                    if (self.document.isEmbedded) {
                        $(elem).on("click", () => console.log(`${self.actor?.name} Deleting (Embedded) ${iName}`));
                    }
                    else {
                        $(elem).on("click", () => console.log(`${self.actor?.name} Deleting ${iName}`));
                    }
                }
            }
            html.find("*[data-action=\"open\"]")
                .each(function addItemOpenEvents() {
                createOpenLinkFromName(this, $(this).attr("data-item-name"));
            });
            html.find("*[data-action=\"roll\"]")
                .each(function addItemOpenEvents() {
                createRollLinkFromName(this, $(this).attr("data-item-name"));
            });
            html.find("*[data-action=\"chat\"]")
                .each(function addItemOpenEvents() {
                createChatLinkFromName(this, $(this).attr("data-item-name"));
            });
            html.find("*[data-action=\"drop\"]")
                .each(function addItemOpenEvents() {
                createDeleteLinkFromName(this, $(this).attr("data-item-name"));
            });
        });
        // Apply custom styles to TinyMCE editors
        // const editors = Object.values(this.editors);
        // <div>{{editor content=data.trigger target="data.trigger" button=true owner=owner editable=editable}}</div>
    }
}
