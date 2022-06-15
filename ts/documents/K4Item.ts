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
export enum K4ItemSubType {
	activeRolled = "active-rolled",
	activeStatic = "active-static",
	passive = "passive"
}
export enum K4ItemRange {
	arm = "arm",
	room = "room",
	field = "field",
	horizon = "horizon"
}
export enum K4WeaponClass {
	meleeUnarmed = "melee-unarmed",
	meleeCrush = "melee-crush",
	meleeSlash = "melee-slash",
	meleeStab = "melee-stab",
	firearm = "firearm",
	bomb = "bomb"
}
export enum K4ItemResultType {
	staticSuccess = "staticSuccess",
	completeSuccess = "completeSuccess",
	partialSuccess = "partialSuccess",
	failure = "failure"
}

export default class K4Item<Type extends K4ItemType> extends Item {
	declare data: ItemData & K4ItemData<Type>;
	override get type(): Type { return super.type as Type }

	get subItems(): Array<K4ConstructorData<K4ItemType.move|K4ItemType.attack>> {
		return this.data.data.subItems ?? [];
	}
	get moves(): Array<K4ConstructorData<K4ItemType.move>> {
		return this.subItems.filter((iData) => iData.type === "move") as Array<K4ConstructorData<K4ItemType.move>>;
	}
	get attacks(): Array<K4ConstructorData<K4ItemType.attack>> {
		return this.subItems.filter((iData) => iData.type === "attack") as Array<K4ConstructorData<K4ItemType.attack>>;
	}
}