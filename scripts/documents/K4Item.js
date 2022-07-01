export default class K4Item extends Item {
    // declare data: typeof super.data & {
    // 	data: K4ItemData<T>
    // }
    get tData() { return this.data.data; }
    // override get type() { return super.type as T}
    prepareData() {
        super.prepareData();
        if (this.type === "advantage" /* K4ItemType.advantage */) {
            this.data.data.subMoveData = this.subItemData.filter((iData) => iData.type === "move" /* K4ItemType.move */);
            // @ts-expect-error Types aren't discriminating the .data.data union type
            this.tData.subAttackData = this.subItemData.filter((iData) => iData.type === "attack" /* K4ItemType.attack */);
        }
    }
    subItems;
    hasSubItems() { return Boolean("subItems" in this.tData && this.tData.subItems.length); }
    get subItemData() {
        if (this.hasSubItems()) {
            // @ts-expect-error Types aren't discriminating the .data.data union type
            return this.tData.subItems.map((subIData) => {
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
                if (targetMove && targetMove.tData.lists[targetList]) {
                    const sourceListItems = this.tData.lists[sourceList].items
                        .map((listItem) => `${listItem} #>text-list-note:data-item-name='${this.name}':data-action='open'>(from ${this.name})<#`);
                    const updateData = [
                        { _id: targetMove.id, [`data.lists.${targetList}.items`]: [
                                ...targetMove.tData.lists[targetList].items,
                                ...sourceListItems
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
                this.subItems = await this.parent.createEmbeddedDocuments("Item", this.subItemData);
            }
            if ("rules" in this.tData && this.tData.rules.effectFunctions) {
                this.tData.rules.effectFunctions.forEach((funcString) => this.applyEffectFunction(funcString));
            }
        }
    }
    async displayItemSummary(speaker) {
        const template = await getTemplate(this.sheet?.template ?? "");
        const content = template(Object.assign(this, { cssClass: "kult4th-chat editable" }));
        ChatMessage.create({
            content,
            speaker: ChatMessage.getSpeaker({ alias: speaker ?? "" })
        });
    }
}
