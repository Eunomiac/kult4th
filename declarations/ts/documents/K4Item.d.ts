export declare enum K4ItemType {
    "advantage" = 0,
    "disadvantage" = 1,
    "move" = 2
}
export default class K4Item<Type extends K4ItemType> extends Item {
}
