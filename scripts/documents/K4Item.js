export default class K4Item extends Item {
    // override get data() { return this.data as K4ItemData<T> }
    // declare override data: K4ItemData<T> & {
    // 	data: K4ItemSchema<T>,
    // 	type: T
    // }}
    prepareData() {
        super.prepareData();
        // if (this.data.type === K4ItemType.advantage) {
        // 	this.data.data.subMoveData = this.subItemData.filter((iData) => iData.type === K4ItemType.move) as K4ItemPropertiesData.move[];
        // 	this.data.data.subAttackData = this.subItemData.filter((iData) => iData.type === K4ItemType.attack) as K4ItemPropertiesData.attack[];
        // }
    }
    subItems;
    hasSubItems() { return Boolean("subItems" in this.data.data && this.data.data.subItems.length); }
    get subItemData() {
        if (this.hasSubItems()) {
            // @ts-expect-error Types aren't discriminating the .data.data union type
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
