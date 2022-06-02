import C from "../scripts/constants.js";
export default class K4ItemSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [C.SYSTEM_ID, "item", "sheet"]
        });
    }
    get template() { return `systems/kult4th/templates/sheets/${this.item.data.type}-sheet.hbs`; }
    get item() { return super.item; }
    get type() { return this.item.data.type; }
    getData() {
        const data = super.getData();
        const templateEntries = [];
        switch (this.type) {
            case "move": {
                const { data } = this.item.data;
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
                Object.entries(data.lists).forEach(([key, { name, items, intro }]) => {
                    if (typeof key === "string" && typeof items === "object") {
                        if (Object.values(items || []).length > 0) {
                            const listEntry = {
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
