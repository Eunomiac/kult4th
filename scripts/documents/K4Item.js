import U from "../scripts/utilities.js";
import SVGDATA, { SVGKEYMAP } from "../scripts/svgdata.js";
export default class K4Item extends Item {
    prepareData() {
        super.prepareData();
        if (this.hasSubItems()) {
            this.data.data.subMoves = this.data.data.subItems.filter((subData) => subData.type === "move" /* K4ItemType.move */);
            this.data.data.subAttacks = this.data.data.subItems.filter((subData) => subData.type === "attack" /* K4ItemType.attack */);
            if (this.isRollable()) {
                this.data.data.results = this.data.data.subItems[0].data.results;
            }
        }
    }
    // constructor(...args: ConstructorParameters<typeof Item>) {
    // 	const data: ItemDataConstructorData = args[0]!;
    // 	super(...args);
    // }
    get masterType() { return this.isDerived() ? this.data.data.sourceItem.type : this.data.type; }
    get masterName() { return (this.isDerived() ? this.data.data.sourceItem.name ?? this.name : this.name) ?? ""; }
    get svgKey() {
        let svgKey = this.data.data.key; // U.toKey(nameRef ?? "");
        if (svgKey in SVGKEYMAP) {
            svgKey = SVGKEYMAP[svgKey];
        }
        if (svgKey in SVGDATA) {
            return svgKey;
        }
        return `DEFAULT-${U.toKey(this.masterType)}`;
    }
    hasSubItems() { return Boolean("subItems" in this.data.data && this.data.data.subItems.length); }
    // get subItemData(): K4ItemSourceData.subItem[] {
    // 	if (this.hasSubItems()) {
    // 		return this.data.data.subItems.map((subIData) => {
    // 			if (subIData.data && ("sourceItem" in subIData.data)) {
    // 				subIData.data.sourceItem = {
    // 					...subIData.data.sourceItem!,
    // 					id: this.id
    // 				};
    // 			}
    // 			return subIData;
    // 		});
    // 	}
    // 	return [];
    // }
    isRollable() { return ["move" /* K4ItemType.move */, "attack" /* K4ItemType.attack */, "advantage" /* K4ItemType.advantage */, "disadvantage" /* K4ItemType.disadvantage */].includes(this.data.type); }
    get subItems() {
        return (this.isEmbedded && this.parent instanceof Actor && this.hasSubItems()) ? this.parent?.getItemsBySource(this.id) : [];
    }
    get subMoves() {
        return this.subItems.filter((subItem) => subItem.data.type === "move" /* K4ItemType.move */);
    }
    get subAttacks() {
        return this.subItems.filter((subItem) => subItem.data.type === "attack" /* K4ItemType.attack */);
    }
    isDerived() { return "sourceItem" in this.data.data && Boolean(this.data.data.sourceItem?.name); }
    get source() { return this.isDerived() ? this.data.data.sourceItem : false; }
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
    async _onCreate(...args) {
        await super._onCreate(...args);
        if (this.isEmbedded && this.parent instanceof Actor) {
            if (this.hasSubItems()) {
                const subItemData = this.data.data.subItems
                    .map((subData) => {
                    subData.data.sourceItem.id = this.id;
                    return subData;
                });
                await this.parent.createEmbeddedDocuments("Item", subItemData);
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
                this.subItems.forEach((item) => item.delete());
            }
            if ("rules" in this.data.data && this.data.data.rules.effectFunctions) {
                this.data.data.rules.effectFunctions.forEach((funcString) => this.unapplyEffectFunction(funcString));
            }
        }
    }
    // get isRollable(): boolean { return }
    get hoverStrip() {
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
