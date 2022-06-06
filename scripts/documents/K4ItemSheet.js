// class ItemSheet<
// 	Options extends ItemSheet.Options = ItemSheet.Options,
// 	Data extends object = ItemSheet.Data<Options>
// 	> extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClass<typeof Item>>> {
import { K4ItemSubType, K4ItemType } from "./K4Item.js";
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
    get type() { return this.item.type; }
    get data() { return this.item.data.data; }
    get subType() { return this.data.subType; }
    get subItems() { return this.item.subItems; }
    get moves() { return this.item.moves; }
    get attacks() { return this.item.attacks; }
    isMove() { return this.type === "move"; }
    isAttack() { return this.type === "attack"; }
    isAdvantage() { return this.type === "advantage"; }
    isDisadvantage() { return this.type === "disadvantage"; }
    isDarkSecret() { return this.type === "darksecret"; }
    isRelation() { return this.type === "relation"; }
    isWeapon() { return this.type === "weapon"; }
    isGear() { return this.type === "gear"; }
    parseHTMLString(str, containerClass = "rules-text") {
        [
            ...Object.values(C.RegExpPatterns.Attributes),
            ...Object.values(C.RegExpPatterns.Keywords)
        ].forEach((pat) => {
            str = str.replace(pat, "<strong class='text-keyword'>$1</strong>");
        });
        Object.values(C.RegExpPatterns.BasicPlayerMoves).forEach((pat) => {
            str = str.replace(pat, "<em class='text-movename'>$1</em>");
        });
        return str
            .replace(/\+\$ATTRIBUTE\$/g, `<strong class='text-keyword'>+${U.tCase(this.data.attribute)}</strong>`)
            .replace(/\$MOVENAME\$/g, `<em class='text-movename'>${U.tCase(this.item.moves?.[0]?.name)}</em>`)
            .replace(/\$n\$/g, "<br><br>")
            .replace(/\$ATTACKS\$/g, this.getListHTML("inlineAttacks"))
            .replace(/\$OPTIONS\$[\.,\s]*$/, [
            "</p>",
            this.getListHTML("options")
            // `<p class='${containerClass}'>`
        ].join(""))
            .replace(/\$OPTIONS\$/g, [
            "</p>",
            this.getListHTML("options"),
            `<p class='${containerClass}'>`
        ].join(""))
            .replace(/\$QUESTIONS\$[\.,\s]*$/, [
            "</p>",
            this.getListHTML("questions")
            // `<p class='${containerClass}'>`
        ].join(""))
            .replace(/\$QUESTIONS\$/g, [
            "</p>",
            this.getListHTML("questions"),
            `<p class='${containerClass}'>`
        ].join(""));
    }
    get outroHTML() {
        if (!this.data.rules.outro) {
            return "";
        }
        const { data } = this;
        switch (this.type) {
            case K4ItemType.attack:
            case K4ItemType.move: {
                return this.parseHTMLString(this.data.rules.outro, "rules-text");
            }
            case K4ItemType.advantage:
            case K4ItemType.disadvantage: {
                switch (this.subType) {
                    case K4ItemSubType.passive: {
                        return this.parseHTMLString(this.data.rules.outro, "rules-text");
                    }
                    case K4ItemSubType.activeStatic:
                    case K4ItemSubType.activeRolled: {
                        return this.moves.map((move) => this.parseHTMLString((move.data.rules.outro ?? "")
                            .replace(/roll \+\$ATTRIBUTE\$/g, "roll to \$MOVENAME\$ (+\$ATTRIBUTE\$)")), "rules-text");
                    }
                    default: {
                        return "";
                    }
                }
            }
            case K4ItemType.darksecret:
            case K4ItemType.relation:
            case K4ItemType.gear:
            case K4ItemType.weapon:
            default:
                return "";
        }
    }
    getListHTML(listKey) {
        const listHTML = [];
        if (this.data.lists[listKey]) {
            const { name, items, intro } = this.data.lists[listKey];
            listHTML.push(`<h2 class='list-name'>${name}</h2>`);
            if (intro) {
                listHTML.push(`<p>${intro}</p>`);
            }
            listHTML.push(`<ul class='list-${String(listKey)}'>`);
            items.forEach((item) => {
                listHTML.push(`<li>${item}</li>`);
            });
            listHTML.push("</ul>");
            return listHTML.join("");
        }
        else if (listKey === "inlineAttacks" && this.attacks.length) {
            const isShowingRange = this.attacks.some((attack) => attack.data.range.join("") !== this.attacks[0].data.range.join(""));
            return this.attacks.map((attack) => [
                "<span class='inline-attack'>",
                `<span class='attack-name'>${attack.name}</span>`,
                `<span class='attack-harm'>${attack.data.harm}</span>`,
                attack.data.ammo ? `<span class='attack-ammo'>${attack.data.ammo}</span>` : "",
                isShowingRange
                    ? `<span class='attack-range'>[${attack.data.range.length === 1
                        ? attack.data.range[0]
                        : `${attack.data.range[0]}—${U.getLast(attack.data.range)}`}]</span>`
                    : "",
                attack.data.notes ? `<span class='attack-effect'>${attack.data.notes}</span>` : "",
                "</span>"
            ].join("")).join("");
        }
        return "";
    }
    get rulesListHTML() {
        if (!this.data.rules.optionsLists?.length) {
            return "";
        }
        const lists = [];
        this.data.rules.optionsLists.forEach((listKey) => {
            lists.push(this.getListHTML(listKey));
        });
        return lists.join("");
    }
    /* private get resultsSummary(): string {
        const parseResultHTML = (resultsData, resultType) => {
            const listHTML: string[] = [];
            switch (resultType) {
                case "staticSuccess": {
                    resultsData.staticSuccess.optionsLists.forEach((listKey: string) => {
                        listHTML.push(this.getListHTML(listKey))
                    })


                }
            }
        }
        const resultEntries: string[] = [];
        if (this.subType === K4ItemSubType.passive) {
            return "";
        }
        if (this.subType === K4ItemSubType.activeStatic) {
            resultEntries.push("staticSuccess");
        } else if (this.subType === K4ItemSubType.activeRolled) {
            resultEntries.push("completeSuccess", "partialSuccess", "failure");
        }
        switch (this.type) {
            case K4ItemType.move:
            case K4ItemType.attack: {


                return "";
            }
            case K4ItemType.advantage:
            case K4ItemType.disadvantage: {

                return "";
            }
            default: return "";
        }
    } */
    async getData() {
        // if (this.type === "move") {
        const data = await super.getData();
        const handlebarsData = {
            rulesHTML: [
                "<div class='editor-content'>",
                "<p class='rules-text'>",
                ...[
                    this.parseHTMLString(data.data.data.rules.intro),
                    data.data.data.rules.trigger ? `<em class='text-trigger'>${this.parseHTMLString(data.data.data.rules.trigger)}</em>` : "",
                    [this.outroHTML].flat().join("<br><br><br>")
                ].map((str) => str.trim()).join(" "),
                "</p>",
                this.rulesListHTML,
                "</div>"
            ].filter(Boolean).join("")
        };
        return Object.assign(data, handlebarsData);
    }
    activateListeners(html) {
        // Apply custom styles to TinyMCE editors
        // const editors = Object.values(this.editors);
        // <div>{{editor content=data.trigger target="data.trigger" button=true owner=owner editable=editable}}</div>
    }
}
