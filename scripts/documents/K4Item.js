import U from "../scripts/utilities.js";
import K4ChatMessage from "./K4ChatMessage.js";
import C from "../scripts/constants.js";
class K4Item extends Item {
    prepareData() {
        super.prepareData();
        if (this.isOwnedItem() && this.isParentItem()) {
            this.system.subMoves = this.system.subItems.filter((subData) => subData.type === "move" /* K4ItemType.move */);
            this.system.subAttacks = this.system.subItems.filter((subData) => subData.type === "attack" /* K4ItemType.attack */);
            if (this.isRollableItem()) {
                this.system.results = this.system.subItems[0].data.results;
            }
        }
    }
    get key() { return this.system.key; }
    _img;
    get img() { return (this._img ??= `systems/kult4th/assets/icons/${this.masterType}/${this.key}.svg`); }
    get itemSheet() { return this._sheet ?? null; }
    get system() { return this.data.data; }
    get masterKey() {
        if (!this.isSubItem()) {
            return this.key;
        }
        if (!this.isOwnedSubItem()) {
            return this.key;
        }
        return game.items?.getName(this.system.sourceItem.name)?.key ?? this.key;
    }
    get masterType() { return this.isSubItem() ? this.system.sourceItem.type : this.data.type; }
    get masterName() { return this.isSubItem() ? this.system.sourceItem.name : this.name; }
    isParentItem() { return Boolean("subItems" in this.system && this.system.subItems.length); }
    isSubItem() { return Boolean("sourceItem" in this.system && this.system.sourceItem && this.system.sourceItem.name); }
    isOwnedItem() { return this.isEmbedded && this.parent instanceof Actor; }
    isOwnedSubItem() { return this.isSubItem() && this.isOwnedItem(); }
    isRollableItem() { return this.system.subType === "active-rolled" /* K4ItemSubType.activeRolled */; }
    isStaticItem() { return this.system.subType === "active-static" /* K4ItemSubType.activeStatic */; }
    isActiveItem() { return this.isRollableItem() || this.isStaticItem(); }
    isPassiveItem() { return this.system.subType === "passive" /* K4ItemSubType.passive */; }
    get subItems() { return (this.isOwnedItem() && this.isParentItem()) ? this.parent.getItemsBySource(this.id) : []; }
    get subMoves() { return this.subItems.filter((subItem) => subItem.data.type === "move" /* K4ItemType.move */); }
    get subAttacks() { return this.subItems.filter((subItem) => subItem.data.type === "attack" /* K4ItemType.attack */); }
    get sourceItemData() { return this.isSubItem() ? this.system.sourceItem : null; }
    get sourceItem() { return this.isOwnedSubItem() ? this.parent.getEmbeddedDocument("Item", this.data.data.sourceItem.id) : null; }
    applyEffectFunction(functionStr) {
        if (!this.isOwnedItem()) {
            return;
        }
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
                        { _id: targetItem.id, [`data.lists.${targetList}.items`]: [
                                ...targetItem.system.lists[targetList].items,
                                ...sourceListItems
                            ] }
                    ];
                    this.parent.updateEmbeddedDocuments("Item", updateData);
                }
            }
            // no default
        }
    }
    unapplyEffectFunction(functionStr) {
        if (!this.isOwnedItem()) {
            return;
        }
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
                        { _id: targetItem.id, [`data.lists.${targetList}.items`]: [
                                ...prunedListItems
                            ] }
                    ];
                    this.parent.updateEmbeddedDocuments("Item", updateData);
                }
            }
            // no default
        }
    }
    prepareSubItemData() {
        if (!this.isParentItem()) {
            return [];
        }
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
        });
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
    async _onCreate(...args) {
        await super._onCreate(...args);
        if (!this.isOwnedItem()) {
            return;
        }
        if (this.isParentItem()) {
            await this.parent.createEmbeddedDocuments("Item", this.prepareSubItemData());
        }
        this.applyOnCreateEffectFunctions();
    }
    async _onDelete(...args) {
        await super._onDelete(...args);
        if (!this.isOwnedItem()) {
            return;
        }
        if (this.isParentItem()) {
            this.subItems.forEach((item) => item.delete());
        }
        this.unapplyOnCreateEffectFunctions();
    }
    // get isRollable(): boolean { return }
    get hoverStrip() {
        const stripType = this.isSubItem() ? this.system.sourceItem.type : this.data.type;
        const theme = C.Themes[stripType];
        const stripData = {
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
        if (this.data.type !== "relation" /* K4ItemType.relation */) {
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
        }
        else if (this.isStaticItem()) {
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
        stripData.buttons.push({
            icon: "hover-strip-button-chat",
            dataset: {
                "item-name": this.name ?? "",
                "action": "chat"
            },
            tooltip: "CHAT"
        }, {
            icon: "hover-strip-button-open",
            dataset: {
                "item-name": this.name ?? "",
                "action": "open"
            },
            tooltip: "VIEW"
        });
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
    async displayItemSummary(speaker) {
        const template = await getTemplate(this.sheetO?.template ?? "");
        const content = template(Object.assign(this.toObject(), { key: this.key }));
        K4ChatMessage.create({
            content,
            speaker: K4ChatMessage.getSpeaker({ alias: speaker ?? "" }) /* ,
            options: {
                cssClass: "kult4th-chat"
            } */
        });
    }
}
export default K4Item;
