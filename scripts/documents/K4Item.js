export var K4ItemType;
(function (K4ItemType) {
    K4ItemType["advantage"] = "advantage";
    K4ItemType["disadvantage"] = "disadvantage";
    K4ItemType["move"] = "move";
    K4ItemType["darksecret"] = "darksecret";
    K4ItemType["relation"] = "relation";
    K4ItemType["gear"] = "gear";
    K4ItemType["attack"] = "attack";
    K4ItemType["weapon"] = "weapon";
})(K4ItemType || (K4ItemType = {}));
export var K4ItemSubType;
(function (K4ItemSubType) {
    K4ItemSubType["activeRolled"] = "active-rolled";
    K4ItemSubType["activeStatic"] = "active-static";
    K4ItemSubType["passive"] = "passive";
})(K4ItemSubType || (K4ItemSubType = {}));
export var K4ItemRange;
(function (K4ItemRange) {
    K4ItemRange["arm"] = "arm";
    K4ItemRange["room"] = "room";
    K4ItemRange["field"] = "field";
    K4ItemRange["horizon"] = "horizon";
})(K4ItemRange || (K4ItemRange = {}));
export var K4WeaponClass;
(function (K4WeaponClass) {
    K4WeaponClass["meleeUnarmed"] = "melee-unarmed";
    K4WeaponClass["meleeCrush"] = "melee-crush";
    K4WeaponClass["meleeSlash"] = "melee-slash";
    K4WeaponClass["meleeStab"] = "melee-stab";
    K4WeaponClass["firearm"] = "firearm";
    K4WeaponClass["bomb"] = "bomb";
})(K4WeaponClass || (K4WeaponClass = {}));
export var K4ItemResultType;
(function (K4ItemResultType) {
    K4ItemResultType["completeSuccess"] = "completeSuccess";
    K4ItemResultType["partialSuccess"] = "partialSuccess";
    K4ItemResultType["failure"] = "failure";
})(K4ItemResultType || (K4ItemResultType = {}));
export default class K4Item extends Item {
    get type() { return super.type; }
    subItems;
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
    get hasSubItems() { return Boolean(this.data.data.subItems?.length); }
    get subMoves() {
        return this.subItemData.filter((iData) => iData.type === "move");
    }
    get subAttacks() {
        return this.subItemData.filter((iData) => iData.type === "attack");
    }
    async _onCreate(...args) {
        await super._onCreate(...args);
        if (this.hasSubItems && this.isEmbedded && this.parent instanceof Actor) {
            this.subItems = await this.parent.createEmbeddedDocuments("Item", this.subItemData);
        }
    }
}
