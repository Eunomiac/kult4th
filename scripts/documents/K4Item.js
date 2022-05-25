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
class K4Item extends Item {
    get type() { return super.type; }
}
export default K4Item;
