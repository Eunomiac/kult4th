import C from "../scripts/constants.js";
export default class K4ItemSheet extends ItemSheet {
    _actor;
    get $entity() { return this.object ?? this; }
    get $sheet() { return (this.$entity.sheet ?? false); }
    get $actor() {
        return (this._actor = this._actor
            ?? this.actor
            ?? (this.$entity.documentName === "Actor" ? this.$entity : false));
    }
    get $id() { return this.$entity.id; }
    get $type() { return this.$entity.type; }
    get $root() { return this.$entity.data; }
    get $data() { return this.$root.data; }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [C.SYSTEM_ID, "item", "sheet"]
        });
    }
    get template() { return `systems/kult4th/templates/sheets/${this.type}-sheet.hbs`; }
    get item() { return super.item; }
    get type() { return this.item.type; }
    get tData() { return this.item.tData; }
    get subType() { return this.tData.subType; }
    get subItems() { return this.item.subItemData; }
    // @ts-expect-error Types aren't discriminating the .data.data union type
    get subMoves() { return this.item.subMoveData; }
    // @ts-expect-error Types aren't discriminating the .data.data union type
    get attacks() { return this.item.subAttackData; }
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
