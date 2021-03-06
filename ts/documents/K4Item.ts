import U from "../scripts/utilities.js";
import {ItemDataConstructorData, ItemDataSource} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import {ItemData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import K4Actor from "./K4Actor.js";

export default class K4Item extends Item {

	// override get data() { return this.data as K4ItemData<T> }

	// declare override data: K4ItemData<T> & {
	// 	data: K4ItemSchema<T>,
	// 	type: T
	// }}

	override prepareData() {
		super.prepareData();
		if (this.data.type === K4ItemType.advantage || this.data.type === K4ItemType.disadvantage || this.data.type === K4ItemType.weapon ) {
			this.data.data.subMoveData = this.subItemData.filter((iData) => iData.type === K4ItemType.move) as K4ItemPropertiesData.move[];
			this.data.data.subAttackData = this.subItemData.filter((iData) => iData.type === K4ItemType.attack) as K4ItemPropertiesData.attack[];
		}
	}

	subItems?: K4Item[];
	hasSubItems(): this is K4HasSubItems<typeof this.data.type> { return Boolean("subItems" in this.data.data && this.data.data.subItems.length) }
	get subItemData(): ItemDataSource[] {
		if (this.hasSubItems()) {
			return this.data.data.subItems.map((subIData) => {
				if (subIData.data && ("sourceItem" in subIData.data)) {
					subIData.data.sourceItem = {
						...subIData.data.sourceItem!,
						id: this.id
					};
				}
				return subIData;
			});
		}
		return [];
	}

	applyEffectFunction(functionStr: string) {
		const [funcName, ...params] = functionStr.split(/,/);
		switch (funcName) {
			case "AppendList": {
				const [targetItemName, targetList, sourceList] = params;
				const targetMove = this.parent?.items.find((item) => item.name === targetItemName);
				console.log("Found Target Move", targetMove);
				if (targetMove && targetMove.data.data.lists[targetList]) {
					const sourceListItems = this.data.data.lists[sourceList].items
						.map((listItem) => `${listItem} #>text-list-note:data-item-name='${this.name}':data-action='open'>(from ${this.name})<#`);
					const updateData = [
						{_id: targetMove.id, [`data.lists.${targetList}.items`]: [
							...targetMove.data.data.lists[targetList].items,
							...sourceListItems
						]}
					];
					this.parent?.updateEmbeddedDocuments("Item", updateData);
				}
			}
			// no default
		}
	}

	override async _onCreate(...args: Parameters<Item["_onCreate"]>) {
		await super._onCreate(...args);
		if (this.isEmbedded && this.parent instanceof Actor) {
			if (this.hasSubItems()) {
				this.subItems = await this.parent.createEmbeddedDocuments("Item", this.subItemData as Array<Record<string,any>>) as K4Item[];
			}
			if ("rules" in this.data.data && this.data.data.rules.effectFunctions) {
				this.data.data.rules.effectFunctions.forEach((funcString) => this.applyEffectFunction(funcString));
			}
		}
	}

	async displayItemSummary(speaker?: string) {
		const template = await getTemplate(this.sheet?.template ?? "");

		const content = template(Object.assign(
			this,
			{cssClass: "kult4th-chat"}
		));
		ChatMessage.create({
			content,
			speaker: ChatMessage.getSpeaker({alias: speaker ?? ""}),
			options: {
				cssClass: "kult4th-chat"
			}
		});
	}
}
