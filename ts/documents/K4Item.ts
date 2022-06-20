import {ItemData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import {ItemDataSchema} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
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
	completeSuccess = "completeSuccess",
	partialSuccess = "partialSuccess",
	failure = "failure"
}

export default class K4Item<Type extends K4ItemType> extends Item {
	declare data: ItemData & K4ItemData<Type>;
	override get type(): Type { return super.type as Type }

	subItems?: Array<K4Item<K4ItemType.move|K4ItemType.attack>>;
	get subItemData(): Array<K4ItemConstructorData<K4ItemType.move|K4ItemType.attack>> {
		if (this.hasSubItems) {
			return this.data.data.subItems.map((subIData: K4ItemData<K4ItemType.move|K4ItemType.attack>) => {
				subIData.data.sourceItem = {
					...subIData.data.sourceItem!,
					id: this.id
				};
				return subIData;
			});
		}
		return [];
	}
	get hasSubItems() { return Boolean(this.data.data.subItems?.length) }
	get moves(): Array<K4ItemData<K4ItemType.move>> {
		return this.subItemData.filter((iData) => iData.type === "move") as Array<K4ItemData<K4ItemType.move>>;
	}
	get attacks(): Array<K4ItemData<K4ItemType.attack>> {
		return this.subItemData.filter((iData) => iData.type === "attack") as Array<K4ItemData<K4ItemType.attack>>;
	}

	override async _onCreate(...args: Parameters<Item["_onCreate"]>) {
		await super._onCreate(...args);
		if (this.hasSubItems && this.isEmbedded && this.parent instanceof Actor) {
			this.subItems = await this.parent.createEmbeddedDocuments("Item", this.subItemData) as Array<K4Item<K4ItemType.move|K4ItemType.attack>>;
		}
	}
}