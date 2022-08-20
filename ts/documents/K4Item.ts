import U from "../scripts/utilities.js";
import C from "../scripts/constants.js";
import type {ItemDataSource} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";

export default class K4Item extends Item {

	override prepareData() {
		super.prepareData();
		if (this.hasSubItems() && (this.data.type === K4ItemType.advantage || this.data.type === K4ItemType.disadvantage )) {
			this.data.data.subMoveData = this.subItemData.filter((iData) => iData.type === K4ItemType.move) as K4ItemPropertiesData.move[];
			this.data.data.subAttackData = this.subItemData.filter((iData) => iData.type === K4ItemType.attack) as K4ItemPropertiesData.attack[];
			const defaultMove = this.subItemData[0] as K4ItemPropertiesData.move;
			this.data.data.results = defaultMove.data.results;
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

	get isDerived() { return "sourceItem" in this.data.data && Boolean(this.data.data.sourceItem?.name) }

	override async _onCreate(...args: Parameters<Item["_onCreate"]>) {
		await super._onCreate(...args);
		if (this.isEmbedded && this.parent instanceof Actor) {
			if (this.hasSubItems()) {
				this.subItems = await this.parent.createEmbeddedDocuments("Item", this.subItemData as Array<Record<string, any>>) as K4Item[];
			}
			if ("rules" in this.data.data && this.data.data.rules.effectFunctions) {
				this.data.data.rules.effectFunctions.forEach((funcString) => this.applyEffectFunction(funcString));
			}
		}
	}

	toHoverStrip(): HoverStripData {

		const themeMap: Record<string, string> = {
			"advantage": "k4-theme-dgold",
			"default": "k4-theme-dgold",
			"disadvantage": "k4-theme-dark",
			"darksecret": "k4-theme-red"
		};
		const theme = themeMap[this.data.type] ?? themeMap.default;
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
			display: this.name ?? "(unknown)",
			...this.isDerived
				? {
						icon: U.toKey((this as K4ItemSpec<K4ItemType.attack | K4ItemType.move>).data.data.sourceItem!.name),
						stripClasses: [
							U.toKey(`${(this as K4ItemSpec<K4ItemType.attack | K4ItemType.move>).data.data.sourceItem!.type}-strip`),
							`derived-${this.data.type}`,
							"k4-theme-bright"
						]
					}
				: {
						icon: U.toKey(this.name ?? `DEFAULT-${this.data.type}`),
						stripClasses: [`${this.data.type}-strip`, theme]
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
		// console.log("Hover Strip Data", stripData);
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
