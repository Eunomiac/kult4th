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
export default class K4Item extends Item {
    get type() { return super.type; }
    get subItems() {
        return this.data.data.subItems ?? [];
    }
    get moves() {
        return this.subItems.filter((iData) => iData.type === "move");
    }
    get attacks() {
        return this.subItems.filter((iData) => iData.type === "attack");
    }
}
