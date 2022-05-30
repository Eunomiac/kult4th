export var ItemType;
(function (ItemType) {
    ItemType["advantage"] = "advantage";
    ItemType["disadvantage"] = "disadvantage";
    ItemType["move"] = "move";
    ItemType["darksecret"] = "darksecret";
    ItemType["relation"] = "relation";
    ItemType["gear"] = "gear";
    ItemType["attack"] = "attack";
    ItemType["weapon"] = "weapon";
})(ItemType || (ItemType = {}));
export default class K4Item extends Item {
    get type() { return super.type; }
}
