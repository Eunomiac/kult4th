import {ItemDataConstructorData, ItemDataSource} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import {ItemData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import K4Actor from "./K4Actor.js";

export default class K4Item<T extends K4ItemType = K4ItemType> extends Item {

	get tData() { return this.data._source.data as K4ItemTemplate<T> }
	override get type() { return super.type as T}

	subItems?: K4Item[];
	hasSubItems(): this is K4Item<K4ItemType.advantage|K4ItemType.disadvantage|K4ItemType.weapon> { return Boolean("subItems" in this.tData && this.tData.subItems.length) }
	get subItemData(): Array<Record<string,unknown> & ItemDataConstructorData> {
		if (this.hasSubItems()) {
			return this.tData.subItems.map((subIData) => {
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
	get subMoveData() {
		return this.subItemData.filter((iData) => iData.type === K4ItemType.move);
	}
	get subAttackData() {
		return this.subItemData.filter((iData) => iData.type === K4ItemType.attack);
	}

	applyEffectFunction(functionStr: string) {
		const [funcName, ...params] = functionStr.split(/,/);
		switch (funcName) {
			case "AppendList": {
				const [targetItemName, targetList, sourceList] = params;
				const targetMove = this.parent?.items.find((item) => item.name === targetItemName);
				console.log("Found Target Move", targetMove);
				if (targetMove && targetMove.tData.lists[targetList]) {
					const sourceListItems = this.tData.lists[sourceList].items
						.map((listItem) => `${listItem} #>text-list-note:data-item-name='${this.name}':data-action='open'>(from ${this.name})<#`);
					const updateData = [
						{_id: targetMove.id, [`data.lists.${targetList}.items`]: [
							...targetMove.tData.lists[targetList].items,
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
				this.subItems = await this.parent.createEmbeddedDocuments("Item", this.subItemData) as Array<K4Item<K4ItemType.move|K4ItemType.attack>>;
			}
			if ("rules" in this.tData && this.tData.rules.effectFunctions) {
				this.tData.rules.effectFunctions.forEach((funcString) => this.applyEffectFunction(funcString));
			}
		}
	}
}


declare global {
	interface DocumentClassConfig {
		Item: typeof K4Item
	}
}