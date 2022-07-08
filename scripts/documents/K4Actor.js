import K4Item from "./K4Item.js";
import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
export default class K4Actor extends Actor {
    prepareData() {
        super.prepareData();
        if (this.data.type === "pc" /* K4ActorType.pc */) {
            this.preparePCData();
        }
    }
    preparePCData() {
        if (this.data.type === "pc" /* K4ActorType.pc */) {
            this.data.data.moves = this.moves;
            this.data.data.basicMoves = this.basicMoves;
            this.data.data.derivedMoves = this.derivedMoves;
            this.data.data.attacks = this.attacks;
            this.data.data.advantages = this.advantages;
            this.data.data.disadvantages = this.disadvantages;
            this.data.data.darkSecrets = this.darkSecrets;
            this.data.data.weapons = this.weapons;
            this.data.data.gear = this.gear;
            this.data.data.relations = this.relations;
            this.data.data.maxWounds = {
                serious: this.data.data.modifiers.seriousWounds.length,
                critical: this.data.data.modifiers.criticalWounds.length
            };
        }
    }
    getItemsOfType(type) {
        return [...this.items].filter((item) => { return item.data.type === type; });
    }
    getItemByName(iName) {
        return [...this.items].find((item) => item.name === iName);
    }
    get attacks() { return this.getItemsOfType("attack" /* K4ItemType.attack */); }
    get advantages() { return this.getItemsOfType("advantage" /* K4ItemType.advantage */); }
    get disadvantages() { return this.getItemsOfType("disadvantage" /* K4ItemType.disadvantage */); }
    get darkSecrets() { return this.getItemsOfType("darksecret" /* K4ItemType.darksecret */); }
    get weapons() { return this.getItemsOfType("weapon" /* K4ItemType.weapon */); }
    get gear() { return this.getItemsOfType("gear" /* K4ItemType.gear */); }
    get relations() { return this.getItemsOfType("relation" /* K4ItemType.relation */); }
    get moves() { return this.getItemsOfType("move" /* K4ItemType.move */); }
    get basicMoves() {
        return this.moves.filter((move) => !move.data.data.sourceItem?.name);
    }
    get derivedMoves() {
        return this.moves.filter((move) => move.data.data.sourceItem?.name);
    }
    get attributeData() {
        if (this.type === "pc" /* K4ActorType.pc */) {
            const attrList = [...Object.keys(C.Attributes.Passive), ...Object.keys(C.Attributes.Active)];
            return attrList.map((attrName) => ({
                name: U.tCase(attrName),
                key: attrName,
                min: this.data.data.attributes[attrName].min,
                max: this.data.data.attributes[attrName].max,
                value: this.data.data.attributes[attrName].value
            }));
        }
        return [];
    }
    get attributes() {
        return Object.fromEntries(this.attributeData.map((aData) => [aData.key, aData.value]));
    }
    async askForAttribute(message) {
        const template = await getTemplate(U.getTemplatePath("dialog", "ask-for-attribute"));
        const content = template({
            id: this.id,
            message
        });
        const userOutput = await new Promise((resolve) => {
            new Dialog({
                "title": "Attribute Selection",
                content,
                "default": "zero" /* K4Attribute.zero */,
                "buttons": C.AttributeButtons(resolve)
            }, {
                classes: [C.SYSTEM_ID, "dialog", "attribute-selection"]
            }).render(true);
        });
        return userOutput.attribute;
    }
    get woundPenaltyData() {
        if (this.data.type === "pc" /* K4ActorType.pc */) {
            const [unstabSerious, unstabCritical] = [
                this.data.data.wounds.filter((wound) => wound.type === "serious" /* K4WoundType.serious */ && !wound.isStabilized).length,
                this.data.data.wounds.filter((wound) => wound.type === "critical" /* K4WoundType.critical */ && !wound.isStabilized).length
            ];
            if (unstabSerious && unstabCritical) {
                return this.data.data.modifiers.seriousAndCriticalWounds[Math.min(this.data.data.maxWounds.serious, this.data.data.maxWounds.critical, unstabSerious, unstabCritical)];
            }
            if (unstabCritical) {
                return this.data.data.modifiers.criticalWounds[Math.min(this.data.data.maxWounds.critical, unstabCritical)];
            }
            if (unstabSerious) {
                return this.data.data.modifiers.seriousWounds[Math.min(this.data.data.maxWounds.serious, unstabSerious)];
            }
            return {};
        }
        return {};
    }
    get stabilityPenaltyData() {
        if (this.data.type === "pc" /* K4ActorType.pc */) {
            return this.data.data.modifiers.stability[this.data.data.stability.value];
        }
        return {};
    }
    async getRoll(rollSource, options) {
        const rollData = {};
        if (typeof rollSource === "string" && ![...C.AttrList, "zero" /* K4Attribute.zero */, "ask" /* K4Attribute.ask */].includes(rollSource)) {
            rollSource = this.getItemByName(rollSource) ?? rollSource;
        }
        if (rollSource instanceof K4Item && (rollSource.data.type === "move" /* K4ItemType.move */ || rollSource.data.type === "attack" /* K4ItemType.attack */)) {
            rollData.type = rollSource.data.type === "move" /* K4ItemType.move */ ? "move" /* K4RollType.move */ : "attack" /* K4RollType.attack */;
            rollData.source = rollSource;
            rollSource = rollSource.data.data.attribute;
        }
        if (rollSource === "ask" /* K4Attribute.ask */) {
            rollSource = await this.askForAttribute();
        }
        if (rollSource === "zero" /* K4Attribute.zero */) {
            rollData.type ??= "zero" /* K4RollType.zero */;
            rollData.source ??= "zero" /* K4Attribute.zero */;
            rollData.attrVal = 0;
        }
        else if (typeof rollSource === "string" && C.AttrList.includes(rollSource)) {
            rollData.type ??= "attribute" /* K4RollType.attribute */;
            rollData.source ??= rollSource;
            rollData.attrVal = this.attributes[rollSource];
        }
        console.log("RETRIEVED ROLL DATA", rollData);
        return {
            roll: new Roll(`2d10 + ${rollData.attrVal ?? 0}`),
            rollData
        };
    }
    async displayRollResult(roll, rollSource, options) {
        console.log("DISPLAYING ROLL RESULT", { roll, rollSource, options });
        if (U.isUndefined(roll.total)) {
            return;
        }
        if (!(rollSource instanceof K4Item && (rollSource.data.type === "move" /* K4ItemType.move */ || rollSource.data.type === "attack" /* K4ItemType.attack */))) {
            return;
        }
        const template = await getTemplate(U.getTemplatePath("sidebar", "roll-result"));
        const templateData = {
            cssClass: "kult4th-chat chat-roll-result",
            context: rollSource
        };
        if (roll.total >= 15) {
            templateData.result = rollSource.data.data.results.completeSuccess;
        }
        else if (roll.total >= 9) {
            templateData.result = rollSource.data.data.results.partialSuccess;
        }
        else {
            templateData.result = rollSource.data.data.results.failure;
        }
        const content = template(templateData);
        ChatMessage.create({
            content,
            speaker: ChatMessage.getSpeaker()
        });
        const sourceItem = {};
        // Is source of roll an item?
        if (rollSource instanceof K4Item && ["move" /* K4ItemType.move */, "attack" /* K4ItemType.attack */].includes(rollSource.data.type)) {
            if (rollSource.data.data.sourceItem?.name) {
                sourceItem.name = rollSource.data.data.sourceItem.name;
                sourceItem.type = rollSource.data.data.sourceItem?.type;
            }
        }
        // const template = await getTemplate(C.getTemplatePath("dialog", "ask-for-attribute"));
        // const content = template({
        // 	id: this.id,
        // 	message
        // });
        // const userOutput = await new Promise((resolve) => {
        // 	new Dialog(
        // 		{
        // 			"title": "Attribute Selection",
        // 			content,
        // 			"default": K4Attribute.zero,
        // 			"buttons": C.AttributeButtons(resolve)
        // 		},
        // 		{
        // 			classes: [C.SYSTEM_ID, "dialog", "attribute-selection"]
        // 		}
        // 	).render(true);
        // }) as {attribute: K4Attribute};
    }
    async roll(rollSource, options = {}) {
        const { roll, rollData } = await this.getRoll(rollSource, options);
        await roll.evaluate({ async: true });
        if (game.dice3d) {
            await game.dice3d.showForRoll(roll);
        }
        if (roll.total) {
            console.log("Roll Successful");
            // this.update({"data.sitmod": 0});
            // console.log(`Sitmod is ` + this.data.data.sitmod);
            this.displayRollResult(roll, rollData.source, options);
        }
    }
    async _onCreate(...[actorData, ...args]) {
        console.log("ACTOR ON CREATE", actorData, args);
        if (this.type === "pc" /* K4ActorType.pc */) {
            const pack = await game.packs.get("kult4th.k4-basic-player-moves");
            if (pack) {
                const index = await pack.getIndex();
                const moveArray = await Array.from(index);
                const newItems = await Promise.all(moveArray.map(async (move) => {
                    const moveData = await pack.getDocument(move._id);
                    return moveData?.data ?? {};
                }));
                if (newItems) {
                    this.createEmbeddedDocuments("Item", newItems);
                }
            }
        }
    }
}
