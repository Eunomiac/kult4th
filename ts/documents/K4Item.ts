import U from "../scripts/utilities.js";
import C from "../scripts/constants.js";
import SVGDATA, {SVGKEYMAP} from "../scripts/svgdata.js";
import type {ItemDataSource} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";

export default class K4Item extends Item {

	override prepareData() {
		super.prepareData();
		if (this.hasSubItems()) {
			this.data.data.subMoves = this.data.data.subItems.filter((subData) => subData.type === K4ItemType.move) as K4ItemSourceData.subMove[];
			this.data.data.subAttacks = this.data.data.subItems.filter((subData) => subData.type === K4ItemType.attack) as K4ItemSourceData.subAttack[];
			if (this.isRollable()) {
				this.data.data.results = this.data.data.subItems[0].data.results;
			}
		}
	}

	// constructor(...args: ConstructorParameters<typeof Item>) {
	// 	const data: ItemDataConstructorData = args[0]!;

	// 	super(...args);
	// }

	get masterType(): K4ItemType { return this.isDerived() ? this.data.data.sourceItem.type : this.data.type }
	get masterName(): string { return (this.isDerived() ? this.data.data.sourceItem.name ?? this.name : this.name) ?? "" }

	hasSubItems(): this is K4HasSubItems { return Boolean("subItems" in this.data.data && this.data.data.subItems.length) }
	isRollable(): this is K4RollableItem { return [K4ItemType.move, K4ItemType.attack, K4ItemType.advantage, K4ItemType.disadvantage].includes(this.data.type) }
	get subItems(): K4DerivedItem[] {
		return (this.isEmbedded && this.parent instanceof Actor && this.hasSubItems()) ? this.parent?.getItemsBySource(this.id!) : [];
	}
	get subMoves(): Array<K4DerivedItem<K4ItemType.move>> {
		return this.subItems.filter((subItem) => subItem.data.type === K4ItemType.move) as Array<K4DerivedItem<K4ItemType.move>>;
	}
	get subAttacks(): Array<K4DerivedItem<K4ItemType.attack>> {
		return this.subItems.filter((subItem) => subItem.data.type === K4ItemType.attack) as Array<K4DerivedItem<K4ItemType.attack>>;
	}
	isDerived(): this is K4DerivedItem<typeof this.data.type> { return "sourceItem" in this.data.data && Boolean(this.data.data.sourceItem?.name) }
	get source(): K4SourceItem | false { return this.isDerived() ? this.data.data.sourceItem : false }

	applyEffectFunction(functionStr: string) {
		const [funcName, ...params] = functionStr.split(/,/);
		switch (funcName) {
			case "AppendList": {
				const [targetItemName, targetList, sourceList] = params;
				const targetMove = this.parent?.items.find((item) => item.name === targetItemName);
				kLog.log("Found Target Move", targetMove);
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

	unapplyEffectFunction(functionStr: string) {
		const [funcName, ...params] = functionStr.split(/,/);
		switch (funcName) {
			case "AppendList": {
				const [targetItemName, targetList, sourceList] = params;
				const targetMove = this.parent?.items.find((item) => item.name === targetItemName);
				kLog.log("Found Target Move", targetMove);
				if (targetMove && targetMove.data.data.lists[targetList]) {
					const prunedListItems = this.data.data.lists[sourceList].items
						.filter((listItem) => !(new RegExp(`data-item-name=.?${this.name}.?`)).test(listItem));
					const updateData = [
						{_id: targetMove.id, [`data.lists.${targetList}.items`]: [
							...prunedListItems
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
				const subItemData: Array<Record<string, any>> = this.data.data.subItems
					.map((subData) => {
						subData.name ??= this.name!;
						subData.data.sourceItem.id = this.id;
						return subData;
					});
				await this.parent.createEmbeddedDocuments("Item", subItemData);
			}
			if ("rules" in this.data.data && this.data.data.rules.effectFunctions) {
				this.data.data.rules.effectFunctions.forEach((funcString) => this.applyEffectFunction(funcString));
			}
		}
	}

	override async _onDelete(...args: Parameters<Item["_onDelete"]>) {
		await super._onDelete(...args);
		if (this.isEmbedded && this.parent instanceof Actor) {
			if (this.hasSubItems()) {
				this.subItems.forEach((item) => item.delete());
			}
			if ("rules" in this.data.data && this.data.data.rules.effectFunctions) {
				this.data.data.rules.effectFunctions.forEach((funcString) => this.unapplyEffectFunction(funcString));
			}
		}
	}

	// get isRollable(): boolean { return }

	get hoverStrip(): HoverStripData {

		const themeMap: Record<string, string> = {
			"advantage": "k4-theme-dgold",
			"default": "k4-theme-dgold",
			"disadvantage": "k4-theme-dark",
			"darksecret": "k4-theme-red"
		};
		const stripType: K4ItemType = this.isDerived() ? this.data.data.sourceItem.type : this.data.type;
		const theme = themeMap[stripType] ?? themeMap.default;
		/* interface StripButtonData {
		icon: KeyOf<typeof SVGDATA>,
		dataset: Record<string, string>,
		classes?: string[],
		tooltip?: string
	}
	interface HoverStripData {
		icon: KeyOf<typeof SVGDATA>,
		classes: string[],
		buttons: StripButtonData[],
		dataset?: Record<string,string>,
		tooltip?: string
	}	*/
		const stripData: HoverStripData = {
			id: this.id ?? `${this.data.type}-${U.randString(10)}`,
			type: this.data.type,
			icon: this.data.data.key,
			display: this.name ?? "(enter name)",
			...this.isDerived()
				? {
						stripClasses: [
							U.toKey(`${stripType}-strip`),
							`derived-${this.data.type}`,
							theme
						]
					}
				: {
						stripClasses: [
							U.toKey(`${stripType}-strip`),
							theme
						]
					},
			dataset: "attribute" in this.data.data
				? {
						"hover-target": `.attribute-box[data-attribute='${this.data.data.attribute}'] img`
					}
				: {},
			buttons: [
				{
					icon: "hover-strip-button-roll",
					dataset: {
						"item-name": this.name ?? "",
						"action": "roll"
					},
					tooltip: "ROLL"
				},
				{
					icon: "hover-strip-button-chat",
					dataset: {
						"item-name": this.name ?? "",
						"action": "chat"
					},
					tooltip: "CHAT"
				},
				{
					icon: "hover-strip-button-open",
					dataset: {
						"item-name": this.name ?? "",
						"action": "open"
					},
					tooltip: "OPEN"
				},
				{
					icon: "hover-strip-button-drop",
					dataset: {
						"item-name": this.name ?? "",
						"action": "drop"
					},
					tooltip: "DROP"
				}
			]
		};
		if (this.data.type !== K4ItemType.relation) {
			stripData.tooltip = this.data.data.rules.trigger;
		}
		// kLog.log("Hover Strip Data", stripData);
		return stripData;
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
