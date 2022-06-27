import {ItemData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";

export default class K4Item<Type extends K4ItemType> extends Item {
	declare data: ItemData & K4ItemData<Type>;
	get tData() { return this.data.data }
	// override get type(): Type { return super.type as Type }

	subItems?: Array<K4Item<K4ItemType.move|K4ItemType.attack>>;
	get hasSubItems() { return Boolean(this.data.data.subItems?.length) }
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
	get subMoveData() {
		return this.subItemData.filter((iData): iData is K4ItemData<K4ItemType.move> => iData.type === K4ItemType.move);
	}
	get subAttackData() {
		return this.subItemData.filter((iData): iData is K4ItemData<K4ItemType.attack> => iData.type === K4ItemType.attack);
	}

	override async _onCreate(...args: Parameters<Item["_onCreate"]>) {
		await super._onCreate(...args);
		if (this.hasSubItems && this.isEmbedded && this.parent instanceof Actor) {
			this.subItems = await this.parent.createEmbeddedDocuments("Item", this.subItemData) as Array<K4Item<K4ItemType.move|K4ItemType.attack>>;
		}
	}
}