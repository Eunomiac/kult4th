import {ItemData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";

export enum K4ItemType {
	advantage = "advantage",
	disadvantage = "disadvantage",
	move = "move",
	darksecret = "darksecret",
	relation = "relation",
	gear = "gear",
	attack = "attack",
	weapon = "weapon"
}

class K4Item<Type extends K4ItemType> extends Item {
	declare data: K4ItemSchema<Type>;
	override get type(): Type { return super.type as Type }
}

interface K4ItemSchema<Type extends K4ItemType> extends ItemData {
	sourceItem: K4Item<K4ItemType> | ""
}

export default K4Item;