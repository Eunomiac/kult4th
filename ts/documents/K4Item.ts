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

export default class K4Item<Type extends K4ItemType> extends Item {
	declare data: Item["data"] & {data: K4ItemData<Type>};
	override get type(): Type { return super.type as Type }
}