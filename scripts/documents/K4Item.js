import U from "../scripts/utilities.js";
import SVGDATA, { SVGKEYMAP } from "../scripts/svgdata.js";
export default class K4Item extends Item {
    prepareData() {
        super.prepareData();
        if (this.hasSubItems() && (this.data.type === "advantage" /* K4ItemType.advantage */ || this.data.type === "disadvantage" /* K4ItemType.disadvantage */)) {
            this.data.data.subMoveData = this.subItemData.filter((iData) => iData.type === "move" /* K4ItemType.move */);
            this.data.data.subAttackData = this.subItemData.filter((iData) => iData.type === "attack" /* K4ItemType.attack */);
            const defaultMove = this.subItemData[0];
            this.data.data.results = defaultMove.data.results;
        }
    }
    get svgKey() {
        const stripType = this.isDerived() ? this.data.data.sourceItem.type : this.data.type;
        const nameRef = this.isDerived() ? this.data.data.sourceItem.name : this.name;
        let svgKey = U.toKey(nameRef ?? "");
        if (svgKey in SVGKEYMAP) {
            svgKey = SVGKEYMAP[svgKey];
        }
        if (svgKey in SVGDATA) {
            return svgKey;
        }
        return `DEFAULT-${U.toKey(stripType)}`;
    }
    hasSubItems() { return Boolean("subItems" in this.data.data && this.data.data.subItems.length); }
    get subItemData() {
        if (this.hasSubItems()) {
            return this.data.data.subItems.map((subIData) => {
                if (subIData.data && ("sourceItem" in subIData.data)) {
                    subIData.data.sourceItem = {
                        ...subIData.data.sourceItem,
                        id: this.id
                    };
                }
                return subIData;
            });
        }
        return [];
    }
    get subItems() {
        return (this.isEmbedded && this.parent instanceof Actor && this.hasSubItems()) ? this.parent?.getItemsBySource(this.id) : [];
    }
    isDerived() { return "sourceItem" in this.data.data && Boolean(this.data.data.sourceItem?.name); }
    get sourceID() { return this.isDerived() ? this.data.data.sourceItem.id ?? false : false; }
    get sourceName() { return this.isDerived() ? this.data.data.sourceItem.name : false; }
    get sourceType() { return this.isDerived() ? this.data.data.sourceItem.type : false; }
    applyEffectFunction(functionStr) {
        const [funcName, ...params] = functionStr.split(/,/);
        switch (funcName) {
            case "AppendList": {
                const [targetItemName, targetList, sourceList] = params;
                const targetMove = this.parent?.items.find((item) => item.name === targetItemName);
                kLog.log("Found Target Move", targetMove);
                if (targetMove && targetMove.data.data.lists[targetList]) {
                    const sourceListItems = this.data.data.lists[sourceList].items
                        .map((listItem) => `${listItem} #>text-list-note:data-item-name='${this.name}':data-action='open'>(from ${this.name})<#`);
                    const updateData = [
                        { _id: targetMove.id, [`data.lists.${targetList}.items`]: [
                                ...targetMove.data.data.lists[targetList].items,
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
    get rolledName() { return this.sourceName || this.name; }
    get rolledType() { return this.sourceType || this.data.type; }
    async _onCreate(...args) {
        await super._onCreate(...args);
        if (this.isEmbedded && this.parent instanceof Actor) {
            if (this.hasSubItems()) {
                const subItems = await this.parent.createEmbeddedDocuments("Item", this.subItemData);
                this.update({ "data.embeddedSubItems": subItems });
            }
            if ("rules" in this.data.data && this.data.data.rules.effectFunctions) {
                this.data.data.rules.effectFunctions.forEach((funcString) => this.applyEffectFunction(funcString));
            }
        }
    }
    async _onDelete(...args) {
        await super._onDelete(...args);
        if (this.isEmbedded && this.parent instanceof Actor) {
            if (this.hasSubItems()) {
                this.parent.getItemsBySource(this.id).forEach((item) => item.delete());
            }
            if ("rules" in this.data.data && this.data.data.rules.effectFunctions) {
                this.data.data.rules.effectFunctions.forEach((funcString) => this.unapplyEffectFunction(funcString));
            }
        }
    }
    // get isRollable(): boolean { return }
    toHoverStrip() {
        const themeMap = {
            "advantage": "k4-theme-dgold",
            "default": "k4-theme-dgold",
            "disadvantage": "k4-theme-dark",
            "darksecret": "k4-theme-red"
        };
        const stripType = this.isDerived() ? this.data.data.sourceItem.type : this.data.type;
        const theme = themeMap[stripType] ?? themeMap.default;
        /* interface StripButtonData {
        icon: KeyOf<typeof SVGDATA>,
        dataset: Record<string, string>,
        classes?: string[],
        tooltip?: string
    }
    interface HoverStripData {
        icon: KeyOf<typeof SVGDATA>,
        classes: string[],
        buttons: StripButtonData[],
        dataset?: Record<string,string>,
        tooltip?: string
    }	*/
        const stripData = {
            id: this.id ?? `${this.data.type}-${U.randString(10)}`,
            type: this.data.type,
            icon: this.svgKey,
            ...this.isDerived()
                ? {
                    display: this.data.data.sourceItem.name ?? "(enter name)",
                    stripClasses: [
                        U.toKey(`${stripType}-strip`),
                        `derived-${this.data.type}`,
                        theme
                    ]
                }
                : {
                    display: this.name ?? "(enter name)",
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
            buttons: [
                {
                    icon: "hover-strip-button-roll",
                    dataset: {
                        "item-name": this.name ?? "",
                        "action": "roll"
                    },
                    tooltip: "ROLL"
                },
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
                    tooltip: "OPEN"
                },
                {
                    icon: "hover-strip-button-drop",
                    dataset: {
                        "item-name": this.name ?? "",
                        "action": "drop"
                    },
                    tooltip: "DROP"
                }
            ]
        };
        if (this.data.type !== "relation" /* K4ItemType.relation */) {
            stripData.tooltip = this.data.data.rules.trigger;
        }
        // kLog.log("Hover Strip Data", stripData);
        return stripData;
    }
    async displayItemSummary(speaker) {
        const template = await getTemplate(this.sheet?.template ?? "");
        const content = template(Object.assign(this, { cssClass: "kult4th-chat" }));
        ChatMessage.create({
            content,
            speaker: ChatMessage.getSpeaker({ alias: speaker ?? "" }),
            options: {
                cssClass: "kult4th-chat"
            }
        });
    }
}
