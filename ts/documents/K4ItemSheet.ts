// class ItemSheet<
// 	Options extends ItemSheet.Options = ItemSheet.Options,
// 	Data extends object = ItemSheet.Data<Options>
// 	> extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClass<typeof Item>>> {
import K4Item, {K4ItemType} from "./K4Item.js";
import U from "../scripts/utilities.js";
import C from "../scripts/constants.js";
import {ToObjectFalseType} from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js";
import {stringify} from "querystring";

type itemTest = ToObjectFalseType<Item["data"]["_id"]>;

export default class K4ItemSheet<Type extends K4ItemType> extends ItemSheet<K4ItemOptions, K4ItemData<Type>> {
	static override get defaultOptions(): K4ItemSheet.Options {
		return mergeObject(super.defaultOptions, {
			classes: [C.SYSTEM_ID, "item", "sheet"]
		});
	}
	override get template() { return `systems/kult4th/templates/sheets/${this.item.data.type}-sheet.hbs` }

	override get item() { return super.item as K4Item<Type> }

	get type() { return this.item.data.type }

	override getData() {
		const data = super.getData();
		const templateEntries = [];
		switch (this.type) {
			case "move": {
				const {data} = this.item.data as K4ItemData<K4ItemType.move>;
				console.log("this.item.data", data);
				templateEntries.push(...[
					{
						isPhrase: true,
						type: "phrase",
						label: "Intro",
						value: data.intro,
						target: "data.intro"
					},
					{
						isPhrase: true,
						type: "phrase",
						label: "Trigger",
						value: data.trigger,
						target: "data.trigger"
					},
					{
						isPhrase: true,
						type: "phrase",
						label: "Outro",
						value: data.outro,
						target: "data.outro"
					},
					{
						isLabel: true,
						type: "label",
						label: "Attribute",
						value: data.attribute,
						target: "data.attribute"
					},
					{
						isPhrase: true,
						type: "phrase",
						label: "Notes",
						value: data.notes,
						target: "data.notes"
					},
					{
						isText: true,
						type: "text",
						label: "Complete Success",
						value: data.completeSuccess.result,
						target: "data.completeSuccess.result"
					},
					{
						isNumber: true,
						type: "number",
						label: "Edges",
						value: data.completeSuccess.edges,
						target: "data.completeSuccess.edges"
					},
					{
						isNumber: true,
						type: "number",
						label: "Hold",
						value: data.completeSuccess.hold,
						target: "data.completeSuccess.hold"
					},
					{
						isPhrase: true,
						type: "phrase",
						label: "Lists:",
						value: data.completeSuccess.optionsLists,
						target: "data.completeSuccess.optionsLists"
					},
					{
						isText: true,
						type: "text",
						label: "Partial Success",
						value: data.partialSuccess.result,
						target: "data.partialSuccess.result"
					},
					{
						isNumber: true,
						type: "number",
						label: "Edges",
						value: data.partialSuccess.edges,
						target: "data.partialSuccess.edges"
					},
					{
						isNumber: true,
						type: "number",
						label: "Hold",
						value: data.partialSuccess.hold,
						target: "data.partialSuccess.hold"
					},
					{
						isPhrase: true,
						type: "label",
						label: "Lists:",
						value: data.partialSuccess.optionsLists,
						target: "data.partialSuccess.optionsLists"
					},
					{
						isText: true,
						type: "text",
						label: "Failure",
						value: data.failure.result,
						target: "data.failure.result"
					},
					{
						isNumber: true,
						type: "number",
						label: "Edges",
						value: data.failure.edges,
						target: "data.failure.edges"
					},
					{
						isNumber: true,
						type: "number",
						label: "Hold",
						value: data.failure.hold,
						target: "data.failure.hold"
					},
					{
						isPhrase: true,
						type: "phrase",
						label: "Lists:",
						value: data.failure.optionsLists,
						target: "data.failure.optionsLists"
					}
				]);

				(Object.entries(data.lists) as Array<[key, {name: string, items: string[], intro?: string}]>).forEach(([key, {name, items, intro}]) => {
					if (typeof key === "string" && typeof items === "object") {
						if (Object.values(items || []).length > 0) {
							const listEntry: Record<string,any> = {
								isList: true,
								type: "list",
								label: name,
								value: items,
								target: `data.lists.${key}`
							};
							if (intro && typeof intro === "string") {
								listEntry.intro = intro;
							}
							templateEntries.push(listEntry);
						}
					}
				});

				templateEntries.push(...[
					{
						isLabel: true,
						type: "label",
						label: "Source Item",
						value: data.sourceItem.name,
						target: "data.sourceItem.name"
					},
					{
						isLabel: true,
						type: "label",
						label: "Source Type",
						value: data.sourceItem.type,
						target: "data.sourceItem.type"
					},
					{
						isBoolean: true,
						type: "boolean",
						label: "Grants Hold",
						value: data.canGrantHold,
						target: "data.canGrantHold"
					},
					{
						isPhrase: true,
						type: "phrase",
						label: "Hold Text",
						value: data.holdText,
						target: "data.holdText"
					},
					{
						isPre: true,
						type: "pre",
						label: "Full Schema",
						value: JSON.stringify(data, null, 2)
					}
				]);
				break;
			}

			// no default

		}
		// @ts-expect-error Just temporary
		data.templateEntries = templateEntries;
		return data;
	}
}

const test = `
{
	"description": "",
	"intro": "",
	"trigger": "When you investigate something",
	"outro": "roll +Reason",
	"attribute": "Reason",
	"notes": "",
	"passiveEffect": {
		"effect": "",
		"optionsLists": [],
		  "hold": 0,
		"effectFunctions": []
	},
`.replace(/\t/g, "");
console.log(test);