import U from "../scripts/utilities.js";
export default class K4Item extends Item {
    // override get data() { return this.data as K4ItemData<T> }
    // declare override data: K4ItemData<T> & {
    // 	data: K4ItemSchema<T>,
    // 	type: T
    // }}
    prepareData() {
        super.prepareData();
        if (this.data.type === "advantage" /* K4ItemType.advantage */ || this.data.type === "disadvantage" /* K4ItemType.disadvantage */ || this.data.type === "weapon" /* K4ItemType.weapon */) {
            this.data.data.subMoveData = this.subItemData.filter((iData) => iData.type === "move" /* K4ItemType.move */);
            this.data.data.subAttackData = this.subItemData.filter((iData) => iData.type === "attack" /* K4ItemType.attack */);
        }
    }
    subItems;
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
    applyEffectFunction(functionStr) {
        const [funcName, ...params] = functionStr.split(/,/);
        switch (funcName) {
            case "AppendList": {
                const [targetItemName, targetList, sourceList] = params;
                const targetMove = this.parent?.items.find((item) => item.name === targetItemName);
                console.log("Found Target Move", targetMove);
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
    get isDerived() { return "sourceItem" in this.data.data && Boolean(this.data.data.sourceItem?.name); }
    async _onCreate(...args) {
        await super._onCreate(...args);
        if (this.isEmbedded && this.parent instanceof Actor) {
            if (this.hasSubItems()) {
                this.subItems = await this.parent.createEmbeddedDocuments("Item", this.subItemData);
            }
            if ("rules" in this.data.data && this.data.data.rules.effectFunctions) {
                this.data.data.rules.effectFunctions.forEach((funcString) => this.applyEffectFunction(funcString));
            }
        }
    }
    toHoverStrip() {
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
            display: this.name ?? "(unknown)",
            ...this.isDerived
                ? {
                    icon: U.toKey(this.data.data.sourceItem.name),
                    stripClasses: [
                        U.toKey(`${this.data.data.sourceItem.type}-strip`),
                        `derived-${this.data.type}`
                    ]
                }
                : {
                    icon: U.toKey(this.name ?? `DEFAULT-${this.data.type}`),
                    stripClasses: [`${this.data.type}-strip`]
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
        console.log("Hover Strip Data", stripData);
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
