// class ItemSheet<
// 	Options extends ItemSheet.Options = ItemSheet.Options,
// 	Data extends object = ItemSheet.Data<Options>
// 	> extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClass<typeof Item>>> {
import K4Item, {K4ItemType} from "./K4Item.js";
import U from "../scripts/utilities.js";
import C from "../scripts/constants.js";
import {ToObjectFalseType} from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js";
import {stringify} from "querystring";

type K4ItemSheetOptions = DocumentSheetOptions & {
	testing: true
};

export default class K4ItemSheet<Type extends K4ItemType> extends ItemSheet<K4ItemSheetOptions, K4ItemData<Type>> {
	static override get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: [C.SYSTEM_ID, "item", "sheet"]
		});
	}
	override get template() { return `systems/kult4th/templates/sheets/${this.type}-sheet.hbs` }

	override get item() { return super.item as K4Item<Type> }

	get type() { return this.item.data.type }
	get data() { return this.item.data.data }

	private get outroHTML(): string {
		if (!this.data.rules.outro) { return "" }
		return this.data.rules.outro
			.replace(/\+\$ATTRIBUTE\$/g, `<span class='text-keyword'>+${U.tCase(this.data.attribute)}</span>`)
			.replace(/\$MOVENAME\$/g, `<span class='text-movename'>+${U.tCase(this.item.moves?.[0]?.name)}</span>`);
	}
	private get rulesListHTML(): string {
		if (!this.data.rules.optionsLists?.length) { return "" }
		const lists: string[] = [];
		this.data.rules.optionsLists.forEach((listKey: string) => {
			const thisList: string[] = [];
			const {name, items, intro} = this.data.lists[listKey] as ListDef;
			thisList.push(`<h2 class='list-name'>${name}</h2>`);
			if (intro) {
				thisList.push(`<p>${intro}</p>`);
			}
			thisList.push(`<ul class='list-${listKey}'>`);
			items.forEach((item) => {
				thisList.push(`<li>${item}</li>`);
			});
			thisList.push("</ul>");
			lists.push(thisList.join(""));
		});
		return lists.join("");
	}


	override async getData() {

		// if (this.type === "move") {
		const data = await super.getData();
		const handlebarsData: {
				rulesHTML: string
			} = {
				rulesHTML: [
					"<p class='rules-text'>",
					...[
						data.data.data.rules.intro,
						data.data.data.rules.trigger ? `<em>${data.data.data.rules.trigger}</em>` : "",
						this.outroHTML
					].map((str) => str.trim()).join(" "),
					this.rulesListHTML,
					"</p>"
				].filter(Boolean).join("")
			};

		return Object.assign(data, handlebarsData);
	}
}