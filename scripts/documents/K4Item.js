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
    K4ItemResultType["staticSuccess"] = "staticSuccess";
    K4ItemResultType["completeSuccess"] = "completeSuccess";
    K4ItemResultType["partialSuccess"] = "partialSuccess";
    K4ItemResultType["failure"] = "failure";
})(K4ItemResultType || (K4ItemResultType = {}));
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
