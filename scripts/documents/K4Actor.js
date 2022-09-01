import K4Item from "./K4Item.js";
import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
export default class K4Actor extends Actor {
    // get kData() { return this.data.data }
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
                serious: this.data.data.modifiers.wounds_serious.length,
                critical: this.data.data.modifiers.wounds_critical.length,
                total: this.data.data.modifiers.wounds_serious.length + this.data.data.modifiers.wounds_critical.length
            };
            this.data.data.modifiersReport = this.parseModsToStrings(this.flatModifiersData).join("; ");
            // this.validateStability();
        }
    }
    getItemsOfType(type) {
        return [...this.items].filter((item) => { return item.data.type === type; });
    }
    getItemByName(iName) {
        return [...this.items].find((item) => item.name === iName);
    }
    getItemsBySource(sourceID) {
        return [...this.items].filter((item) => item.isDerived() && item.data.data.sourceItem.id === sourceID);
    }
    async dropItemByName(iName) {
        return [...this.items].find((item) => item.name === iName)?.delete();
    }
    get moves() { return this.getItemsOfType("move" /* K4ItemType.move */); }
    get basicMoves() { return this.moves.filter((move) => !move.isDerived()); }
    get derivedMoves() { return this.moves.filter((move) => move.isDerived()); }
    get attacks() { return this.getItemsOfType("attack" /* K4ItemType.attack */); }
    get basicAttacks() { return this.attacks.filter((attack) => !attack.isDerived()); }
    get derivedAttacks() { return this.attacks.filter((attack) => attack.isDerived()); }
    get advantages() { return this.getItemsOfType("advantage" /* K4ItemType.advantage */); }
    get disadvantages() { return this.getItemsOfType("disadvantage" /* K4ItemType.disadvantage */); }
    get darkSecrets() { return this.getItemsOfType("darksecret" /* K4ItemType.darksecret */); }
    get weapons() { return this.getItemsOfType("weapon" /* K4ItemType.weapon */); }
    get gear() { return this.getItemsOfType("gear" /* K4ItemType.gear */); }
    get relations() { return this.getItemsOfType("relation" /* K4ItemType.relation */); }
    get derivedItems() { return [...this.items].filter((item) => item.isDerived()); }
    get wounds() {
        // if (this.type === K4ActorType.pc) {
        return this.data.data.wounds;
        // } else {
        // return ;
        // }
    }
    get woundStrips() {
        return Object.values(this.wounds).map((wound) => {
            const stripData = {
                id: wound.id,
                type: [
                    wound.isStabilized ? "stable" : "",
                    wound.isCritical ? "critical" : "serious"
                ].join(""),
                display: wound.description ?? "",
                stripClasses: ["wound-strip"],
                dataTarget: `data.wounds.${wound.id}.description`,
                placeholder: "(description)  ",
                buttons: [
                    {
                        icon: wound.isCritical ? "wound-critical" : "wound-serious",
                        dataset: {
                            target: wound.id,
                            action: "toggle-wound-type"
                        },
                        tooltip: wound.isCritical ? "CRITICAL" : "SERIOUS"
                    },
                    {
                        icon: "data-retrieval",
                        dataset: {
                            target: wound.id,
                            action: "reset-wound-name"
                        },
                        tooltip: "EDIT"
                    },
                    {
                        icon: "wound-serious-stabilized",
                        dataset: {
                            target: wound.id,
                            action: "toggle-wound-stabilize"
                        },
                        tooltip: wound.isStabilized ? "STABLE" : "STABILIZE"
                    },
                    {
                        icon: "hinder-other",
                        dataset: {
                            target: wound.id,
                            action: "drop-wound"
                        },
                        tooltip: "DROP"
                    }
                ]
            };
            if (wound.isCritical) {
                stripData.icon = "wound-critical";
                stripData.stripClasses?.push("wound-critical");
                // stripData.dataset!["color-fg"] = C.Colors.WHITE;
                // stripData.dataset!["color-bg"] = C.Colors["gRED"];
            }
            else {
                stripData.icon = "wound-serious";
            }
            if (wound.isStabilized) {
                stripData.icon = `${stripData.icon}-stabilized`;
                stripData.stripClasses?.push("k4-theme-dgold", "wound-stabilized");
                // stripData.dataset!["color-fg"] = C.Colors.GOLD;
                // stripData.dataset!["color-bg"] = C.Colors.BLACK;
            }
            else {
                stripData.stripClasses?.push("k4-theme-red");
            }
            return stripData;
        });
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
    validateStability() {
        const { value, min, max } = this.data.data.stability;
        if (U.clampNum(value, [min, max]) !== value) {
            this.update({ ["data.stability.value"]: U.clampNum(value, [min, max]) });
        }
    }
    changeStability(delta) {
        if (delta) {
            const { value, min, max } = this.data.data.stability;
            if (U.clampNum(value + delta, [min, max]) !== value) {
                this.update({ ["data.stability.value"]: U.clampNum(value + delta, [min, max]) });
            }
        }
    }
    async addWound(type, description) {
        if (this.data.type === "pc" /* K4ActorType.pc */) {
            const woundData = {
                id: `wound_${U.randString(10)}`,
                description: description ?? "",
                isCritical: type === "critical" /* K4WoundType.critical */,
                isStabilized: false
            };
            kLog.log("Starting Wounds", U.objClone(this.data.data.wounds));
            await this.update({ [`data.wounds.${woundData.id}`]: woundData });
            kLog.log("Updated Wounds", U.objClone(this.data.data.wounds));
        }
    }
    async toggleWound(id, toggleSwitch) {
        const woundData = this.wounds[id];
        if (woundData) {
            switch (toggleSwitch) {
                case "type": {
                    await this.update({ [`data.wounds.${id}.isCritical`]: !this.wounds[id].isCritical });
                    return;
                }
                case "stabilized": {
                    await this.update({ [`data.wounds.${id}.isStabilized`]: !this.wounds[id].isStabilized });
                    return;
                }
                // no default
            }
        }
    }
    async resetWoundName(id) {
        const woundData = this.wounds[id];
        if (woundData) {
            await this.update({ [`data.wounds.${id}.description`]: "" });
            return;
        }
    }
    async removeWound(id) {
        if (this.data.type === "pc" /* K4ActorType.pc */) {
            kLog.log("Starting Wounds", U.objClone(this.data.data.wounds));
            await this.update({ [`data.wounds.-=${id}`]: null });
            kLog.log("Updated Wounds", this.data.data.wounds);
        }
    }
    parseModsToStrings(modData = this.flatModifiersData) {
        const returnStrings = [];
        for (const [modKey, modVal] of Object.entries(modData)) {
            returnStrings.push(`${U.signNum(modVal)} to ${modKey === "all" ? "all" : U.tCase(modKey)} rolls`);
        }
        return returnStrings;
    }
    get woundPenaltyData() {
        if (this.data.type === "pc" /* K4ActorType.pc */) {
            const [unstabSerious, unstabCritical] = [
                Object.values(this.wounds).filter((wound) => !wound.isCritical && !wound.isStabilized).length,
                Object.values(this.wounds).filter((wound) => wound.isCritical && !wound.isStabilized).length
            ];
            if (unstabSerious && unstabCritical) {
                return this.data.data.modifiers.wounds_seriouscritical[Math.min(unstabSerious, unstabCritical)];
            }
            if (unstabCritical) {
                return this.data.data.modifiers.wounds_critical[unstabCritical];
            }
            if (unstabSerious) {
                return this.data.data.modifiers.wounds_serious[unstabSerious];
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
    get conditionPenaltyData() {
        return {};
    }
    get effectPenaltyData() {
        return {};
    }
    get modifierData() {
        return {
            wounds: this.woundPenaltyData,
            stability: this.stabilityPenaltyData
            /* Add other categories here for _specific_ conditions and effects _by name_ (as key


                */
        };
    }
    get flatModifiersData() {
        const returnData = {};
        Object.values(this.modifierData).forEach((modData) => {
            for (const [modSource, modNum] of Object.entries(modData)) {
                returnData[modSource] ??= 0;
                returnData[modSource] += modNum;
            }
        });
        return returnData;
    }
    /*

INCOMINGDATA = {
  wounds:
}

for each possible source of modifier:
  find the values matching actor's current status
    (via the 'getWoundPenalties' stuff).
 THEN,
    for each possible modifier
      (= {"if key matches": apply this mod})
      check if the key matches the roll.
    IF IT DOES,
      assign to the object of modifers you'll be returning
      {"source of modifier": modifier number}

*/
    getRollModifiers(rollData) {
        function checkModTarget(target) {
            return ["all", rollData.type, rollData.source].includes(target);
        }
        const modifiers = {};
        Object.entries(this.modifierData).forEach(([modSource, modData]) => {
            let modFromSource = 0;
            Object.entries(modData).forEach(([modTarget, modNum]) => {
                if (checkModTarget(modTarget)) {
                    modFromSource += modNum;
                }
            });
            if (modFromSource !== 0) {
                modifiers[modSource] = modFromSource;
            }
        });
        return modifiers;
    }
    async getRoll(rollSource, options) {
        const rollData = {
            type: "move" /* K4RollType.move */,
            source: rollSource,
            attrVal: 0,
            modifiers: {}
        };
        if (typeof rollSource === "string" && ![...C.AttrList, "zero" /* K4Attribute.zero */, "ask" /* K4Attribute.ask */].includes(rollSource)) {
            rollSource = this.getItemByName(rollSource) ?? rollSource;
        }
        if (rollSource instanceof K4Item /*  && (rollSource.data.type === K4ItemType.move || rollSource.data.type === K4ItemType.attack) */) {
            const rollSourceType = rollSource.isDerived()
                ? rollSource.sourceType
                : rollSource.data.type;
            switch (rollSourceType) {
                case "move" /* K4ItemType.move */: {
                    rollData.type = "move" /* K4RollType.move */;
                    break;
                }
                case "attack" /* K4ItemType.attack */: {
                    rollData.type = "attack" /* K4RollType.attack */;
                    break;
                }
                case "advantage" /* K4ItemType.advantage */: {
                    rollData.type = "advantage" /* K4RollType.advantage */;
                    break;
                }
                case "disadvantage" /* K4ItemType.disadvantage */: {
                    rollData.type = "disadvantage" /* K4RollType.disadvantage */;
                    break;
                }
                default: {
                    throw new Error(`Can't roll items of type '${rollSource.data.type}'`);
                }
            }
            rollData.source = rollSource; // as K4ItemSpec<K4ItemType.move|K4ItemType.attack>;
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
        rollData.modifiers = this.getRollModifiers(rollData);
        kLog.log("RETRIEVED ROLL DATA", rollData);
        return {
            roll: new Roll([
                "2d10",
                U.signNum(rollData.attrVal ?? 0, " "),
                ...Object.values(rollData.modifiers)
                    .map((modifier) => U.signNum(modifier, " "))
                    .filter((elem) => elem !== "")
            ].join(" ")),
            rollData
        };
    }
    async displayRollResult(roll, rollData, options) {
        if (U.isUndefined(roll.total)) {
            return;
        }
        const rollSource = rollData.source;
        if (!(rollSource instanceof K4Item && (rollSource.data.type === "move" /* K4ItemType.move */ || rollSource.data.type === "attack" /* K4ItemType.attack */ || rollSource.data.type === "advantage" /* K4ItemType.advantage */ || rollSource.data.type === "disadvantage" /* K4ItemType.disadvantage */))) {
            return;
        }
        let results;
        const template = await getTemplate(U.getTemplatePath("sidebar", "roll-result"));
        const templateData = {
            cssClass: ["kult4th-chat", "chat-roll-result", `${rollSource.masterType ?? ""}-roll`].join(" "),
            context: rollSource,
            dice: roll.dice[0].results.map((dResult) => dResult.result),
            total: roll.total,
            resultDisplay: "",
            rolledName: rollSource.masterName ?? U.tCase(U.loc(`trait.${rollSource.data.data.attribute}`)),
            rolledAttribute: U.tCase(U.loc(`trait.${rollSource.data.data.attribute}`)),
            rollerName: this.name ?? U.loc("roll.someone"),
            rollerImg: this.img ?? "systems/kult4th/assets/characters/generic.jpg",
            modifiers: rollData.modifiers
        };
        // templateData.dice =
        if (roll.total >= 15) {
            templateData.result = rollSource.data.data.results.completeSuccess;
            templateData.resultDisplay = U.loc("roll.success");
            templateData.cssClass = `${templateData.cssClass} roll-success`;
        }
        else if (roll.total >= 9) {
            templateData.result = rollSource.data.data.results.partialSuccess;
            templateData.resultDisplay = U.loc("roll.partialSuccess");
            templateData.cssClass = `${templateData.cssClass} roll-partial`;
        }
        else {
            templateData.result = rollSource.data.data.results.failure;
            templateData.resultDisplay = U.loc("roll.failure");
            templateData.cssClass = `${templateData.cssClass} roll-failure`;
        }
        kLog.log("DISPLAYING ROLL RESULT", { roll, templateData, rollSource, options });
        const content = template(templateData);
        ChatMessage.create({
            content,
            speaker: ChatMessage.getSpeaker()
        });
        // const sourceItem: {name?: string, type?: K4ItemType} = {};
        // // Is source of roll an item?
        // if (rollSource instanceof K4Item && [K4ItemType.move, K4ItemType.attack].includes(rollSource.data.type)) {
        // 	if (rollSource.data.data.sourceItem?.name) {
        // 		sourceItem.name = rollSource.data.data.sourceItem.name;
        // 		sourceItem.type = rollSource.data.data.sourceItem?.type;
        // 	}
        // }
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
            kLog.log("Roll Successful", { roll, rollData, options });
            // this.update({"data.sitmod": 0});
            // kLog.log(`Sitmod is ` + this.data.data.sitmod);
            this.displayRollResult(roll, rollData, options);
        }
    }
    async _onCreate(...[actorData, ...args]) {
        // kLog.log("ACTOR ON CREATE", actorData, args);
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
                    await this.createEmbeddedDocuments("Item", newItems);
                    // brandNewItems[0].sheet?.render(true );
                }
            }
            this.setFlag("kult4th", "sheetTab", "front");
        }
    }
}
