import U from "../scripts/utilities.js";
import C from "../scripts/constants.js";
export default class K4ItemSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [C.SYSTEM_ID, "item", "sheet"]
        });
    }
    get template() { return `systems/kult4th/templates/sheets/${this.type}-sheet.hbs`; }
    get item() { return super.item; }
    get type() { return this.item.data.type; }
    get data() { return this.item.data.data; }
    get outroHTML() {
        if (!this.data.rules.outro) {
            return "";
        }
        return this.data.rules.outro
            .replace(/\+\$ATTRIBUTE\$/g, `<span class='text-keyword'>+${U.tCase(this.data.attribute)}</span>`)
            .replace(/\$MOVENAME\$/g, `<span class='text-movename'>+${U.tCase(this.item.moves?.[0]?.name)}</span>`);
    }
    get rulesListHTML() {
        if (!this.data.rules.optionsLists?.length) {
            return "";
        }
        const lists = [];
        this.data.rules.optionsLists.forEach((listKey) => {
            const thisList = [];
            const { name, items, intro } = this.data.lists[listKey];
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
    async getData() {
        // if (this.type === "move") {
        const data = await super.getData();
        const handlebarsData = {
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
