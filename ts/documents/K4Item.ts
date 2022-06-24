import K4Actor from "./K4Actor.js";

export default class K4Item<Type extends K4ItemType = K4ItemType> extends Item {
	override get type(): Type { return super.type as Type }

	subItems?: Array<K4Item<K4ItemType.move|K4ItemType.attack>>;
	get subItemData(): Array<Partial<K4ItemDataSource.Move|K4ItemDataSource.Attack>> {
		if (this.hasSubItems) {
			return this.data.data.subItems.map((subIData) => {
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
	get moves(): Array<K4ItemDataSource.Move> {
		return this.subItemData.filter((iData) => iData.type === "move") as Array<K4ItemDataSource.Move>;
	}
	get attacks(): Array<K4ItemDataSource.Attack> {
		return this.subItemData.filter((iData) => iData.type === "attack") as Array<K4ItemDataSource.Attack>;
	}

	override async _onCreate(...args: Parameters<Item["_onCreate"]>) {
		await super._onCreate(...args);
		if (this.hasSubItems && this.isEmbedded && this.parent instanceof Actor) {
			this.subItems = await this.parent.createEmbeddedDocuments("Item", this.subItemData) as Array<K4Item<K4ItemType.move|K4ItemType.attack>>;
		}
	}

	async handleRoll() {
		if (this.actor instanceof K4Actor)
		console.log(`Rolling ${this.name} for ${this.actor?.name ?? "UNKNOWN"} - ${U.tCase(this.data.data.attribute)} = ${U.signNum(this.actor?.)}`)
	}
}

declare global {
  interface DocumentClassConfig {
    Item: typeof K4Item;
  }
}