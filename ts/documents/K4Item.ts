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
	declare data: K4ItemData<Type>;
	override get type(): Type { return super.type as Type }

	get subItems(): Array<K4ConstructorData<K4ItemType.move|K4ItemType.attack>> {
		return this.data.data.subItems ?? [];
	}
	get moves(): Array<K4ConstructorData<K4ItemType.move>> {
		return this.subItems.filter((iData) => iData.type === "move");
	}
	get attacks(): Array<K4ConstructorData<K4ItemType.attack>> {
		return this.subItems.filter((iData) => iData.type === "attack");
	}
}