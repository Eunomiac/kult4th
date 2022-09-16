import U from "../scripts/utilities.js";
import K4ChatMessage from "./K4ChatMessage.js";
import C from "../scripts/constants.js";
class K4Item extends Item {
    prepareData() {
        super.prepareData();
        if (this.isOwnedItem() && this.isParentItem()) {
            this.data.data.subMoves = this.data.data.subItems.filter((subData) => subData.type === "move" /* K4ItemType.move */);
            this.data.data.subAttacks = this.data.data.subItems.filter((subData) => subData.type === "attack" /* K4ItemType.attack */);
            if (this.isRollableItem()) {
                this.data.data.results = this.data.data.subItems[0].data.results;
            }
        }
    }
    get itemSheet() {
        if (this.isOwnedItem()) {
            return this._sheet;
        }
        return null;
    }
    get key() { return this.data.data.key; }
    // constructor(...args: ConstructorParameters<typeof Item>) {
    // 	const data: ItemDataConstructorData = args[0]!;
    // 	super(...args);
    // }
    get masterType() { return this.sourceItemData?.type ?? this.data.type; }
    get masterName() { return this.isSubItem() ? this.data.data.sourceItem.name : this.name; }
    isParentItem() { return Boolean("subItems" in this.data.data && this.data.data.subItems.length); }
    isSubItem() { return Boolean("sourceItem" in this.data.data && this.data.data.sourceItem && this.data.data.sourceItem.name); }
    isOwnedItem() { return this.isEmbedded && this.parent instanceof Actor; }
    isOwnedSubItem() { return this.isSubItem() && this.isOwnedItem(); }
    isRollableItem() { return this.data.data.subType === "active-rolled" /* K4ItemSubType.activeRolled */; }
    isStaticItem() { return this.data.data.subType === "active-static" /* K4ItemSubType.activeStatic */; }
    isActiveItem() { return this.isRollableItem() || this.isStaticItem(); }
    isPassiveItem() { return this.data.data.subType === "passive" /* K4ItemSubType.passive */; }
    get subItems() {
        return (this.isEmbedded && this.parent instanceof Actor && this.isParentItem()) ? this.parent.getItemsBySource(this.id) : [];
    }
    get subMoves() {
        return this.subItems.filter((subItem) => subItem.data.type === "move" /* K4ItemType.move */);
    }
    get subAttacks() {
        return this.subItems.filter((subItem) => subItem.data.type === "attack" /* K4ItemType.attack */);
    }
    get sourceItemData() { return this.isSubItem() ? this.data.data.sourceItem : null; }
    get sourceItem() { return this.isOwnedSubItem() ? this.parent.getEmbeddedDocument("Item", this.data.data.sourceItem.id) : null; }
    applyEffectFunction(functionStr) {
        const [funcName, ...params] = functionStr.split(/,/);
        switch (funcName) {
            case "AppendList": {
                const [targetItemName, targetList, sourceList] = params;
                const targetItem = this.parent?.items.find((item) => item.name === targetItemName && !item.isSubItem());
                kLog.log("Found Target Item", targetItem);
                if (targetItem && targetItem.data.data.lists[targetList]) {
                    const sourceListItems = this.data.data.lists[sourceList].items
                        .map((listItem) => `${listItem} #>text-list-note:data-item-name='${this.name}':data-action='open'>(from ${this.name})<#`);
                    const updateData = [
                        { _id: targetItem.id, [`data.lists.${targetList}.items`]: [
                                ...targetItem.data.data.lists[targetList].items,
                                ...sourceListItems
                            ] }
                    ];
                    this.parent?.updateEmbeddedDocuments("Item", updateData);
                }
            }
            // no default
        }
    }
    unapplyEffectFunction(functionStr) {
        const [funcName, ...params] = functionStr.split(/,/);
        switch (funcName) {
            case "AppendList": {
                const [targetItemName, targetList, sourceList] = params;
                const targetMove = this.parent?.items.find((item) => item.name === targetItemName);
                kLog.log("Found Target Move", targetMove);
                if (targetMove && targetMove.data.data.lists[targetList]) {
                    const prunedListItems = this.data.data.lists[sourceList].items
                        .filter((listItem) => !(new RegExp(`data-item-name=.?${this.name}.?`)).test(listItem));
                    const updateData = [
                        { _id: targetMove.id, [`data.lists.${targetList}.items`]: [
                                ...prunedListItems
                            ] }
                    ];
                    this.parent?.updateEmbeddedDocuments("Item", updateData);
                }
            }
            // no default
        }
    }
    prepareSubItemData() {
        if (this.isParentItem()) {
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
            });
        }
        return [];
    }
    async _onCreate(...args) {
        await super._onCreate(...args);
        if (this.isEmbedded && this.parent instanceof Actor) {
            if (this.isParentItem()) {
                await this.parent.createEmbeddedDocuments("Item", this.prepareSubItemData());
            }
            if ("rules" in this.data.data && this.data.data.rules.effectFunctions) {
                this.data.data.rules.effectFunctions.forEach((funcString) => this.applyEffectFunction(funcString));
            }
        }
    }
    async _onDelete(...args) {
        await super._onDelete(...args);
        if (this.isEmbedded && this.parent instanceof Actor) {
            if (this.isParentItem()) {
                this.subItems.forEach((item) => item.delete());
            }
            if ("rules" in this.data.data && this.data.data.rules.effectFunctions) {
                this.data.data.rules.effectFunctions.forEach((funcString) => this.unapplyEffectFunction(funcString));
            }
        }
    }
    // get isRollable(): boolean { return }
    get hoverStrip() {
        const stripType = this.isSubItem() ? this.data.data.sourceItem.type : this.data.type;
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
            dataset: "attribute" in this.data.data
                ? {
                    "hover-target": `.attribute-box[data-attribute='${this.data.data.attribute}'] img`
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
        const template = await getTemplate(this.sheet?.template ?? "");
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
