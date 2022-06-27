export default class K4Item extends Item {
    get tData() { return this.data.data; }
    // override get type(): Type { return super.type as Type }
    subItems;
    get hasSubItems() { return Boolean(this.data.data.subItems?.length); }
    get subItemData() {
        if (this.hasSubItems) {
            return this.data.data.subItems.map((subIData) => {
                subIData.data.sourceItem = {
                    ...subIData.data.sourceItem,
                    id: this.id
                };
                return subIData;
            });
        }
        return [];
    }
    get subMoveData() {
        return this.subItemData.filter((iData) => iData.type === "move" /* K4ItemType.move */);
    }
    get subAttackData() {
        return this.subItemData.filter((iData) => iData.type === "attack" /* K4ItemType.attack */);
    }
    async _onCreate(...args) {
        await super._onCreate(...args);
        if (this.hasSubItems && this.isEmbedded && this.parent instanceof Actor) {
            this.subItems = await this.parent.createEmbeddedDocuments("Item", this.subItemData);
        }
    }
}
