import K4Item from "./K4Item.js";
import K4ChatMessage from "./K4ChatMessage.js";
import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
class K4Actor extends Actor {
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
            this.data.data.modifiersReport = this.parseModsToStrings(this.flatModTargets).join("; ");
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
        return [...this.items].filter((item) => item.isSubItem() && item.data.data.sourceItem.id === sourceID);
    }
    async dropItemByName(iName) {
        return [...this.items].find((item) => item.name === iName)?.delete();
    }
    get moves() { return this.getItemsOfType("move" /* K4ItemType.move */); }
    get basicMoves() { return this.moves.filter((move) => !move.isSubItem()); }
    get derivedMoves() { return this.moves.filter((move) => move.isSubItem()); }
    get attacks() { return this.getItemsOfType("attack" /* K4ItemType.attack */); }
    get basicAttacks() { return this.attacks.filter((attack) => !attack.isSubItem()); }
    get derivedAttacks() { return this.attacks.filter((attack) => attack.isSubItem()); }
    get advantages() { return this.getItemsOfType("advantage" /* K4ItemType.advantage */); }
    get disadvantages() { return this.getItemsOfType("disadvantage" /* K4ItemType.disadvantage */); }
    get darkSecrets() { return this.getItemsOfType("darksecret" /* K4ItemType.darksecret */); }
    get weapons() { return this.getItemsOfType("weapon" /* K4ItemType.weapon */); }
    get gear() { return this.getItemsOfType("gear" /* K4ItemType.gear */); }
    get relations() { return this.getItemsOfType("relation" /* K4ItemType.relation */); }
    get derivedItems() { return [...this.items].filter((item) => item.isSubItem()); }
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
                icon: "systems/kult4th/assets/icons/wounds/",
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
                stripData.icon += `wound-critical${wound.isStabilized ? "-stabilized" : ""}.svg`;
                stripData.stripClasses?.push("wound-critical");
            }
            else {
                stripData.icon += `wound-serious${wound.isStabilized ? "-stabilized" : ""}.svg`;
            }
            if (wound.isStabilized) {
                stripData.stripClasses?.push("k4-theme-dgold", "wound-stabilized");
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
        return userOutput.attribute || null;
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
    parseModsToStrings(modData = this.flatModTargets) {
        const returnStrings = [];
        for (const [modKey, modVal] of Object.entries(modData)) {
            returnStrings.push(`${U.signNum(modVal)} to ${modKey === "all" ? "all" : U.tCase(modKey)} rolls`);
        }
        return returnStrings;
    }
    get woundModData() {
        const modData = {
            category: "wound",
            display: U.loc("trait.wounds"),
            targets: {}
        };
        if (this.data.type === "pc" /* K4ActorType.pc */) {
            const [unstabSerious, unstabCritical] = [
                Object.values(this.wounds).filter((wound) => !wound.isCritical && !wound.isStabilized).length,
                Object.values(this.wounds).filter((wound) => wound.isCritical && !wound.isStabilized).length
            ];
            if (unstabSerious && unstabCritical) {
                modData.targets = this.data.data.modifiers.wounds_seriouscritical[Math.min(unstabSerious, unstabCritical)];
            }
            else if (unstabCritical) {
                modData.targets = this.data.data.modifiers.wounds_critical[unstabCritical];
            }
            else if (unstabSerious) {
                modData.targets = this.data.data.modifiers.wounds_serious[unstabSerious];
            }
        }
        return modData;
    }
    get stabilityModData() {
        const modData = {
            category: "stability",
            display: U.loc("trait.stability"),
            targets: {}
        };
        if (this.data.type === "pc" /* K4ActorType.pc */) {
            modData.targets = this.data.data.modifiers.stability[this.data.data.stability.value];
        }
        return modData;
    }
    get conditionModData() {
        const modData = [];
        return modData;
    }
    get effectModData() {
        const modData = [];
        return [
            {
                category: "effect",
                display: "Effect One",
                targets: { "Keep It Together": 2 }
            },
            {
                category: "effect",
                display: "Effect Two",
                targets: { move: 4 }
            },
            {
                category: "effect",
                display: "Effect Three",
                targets: { ["willpower" /* K4Attribute.willpower */]: -1 }
            }
        ];
        return modData;
    }
    get modTargets() {
        return [
            this.woundModData,
            this.stabilityModData,
            ...this.conditionModData,
            ...this.effectModData
        ];
    }
    get flatModTargets() {
        const flatTargets = {};
        this.modTargets.forEach(({ targets }) => {
            for (const [modSource, modNum] of Object.entries(targets)) {
                flatTargets[modSource] ??= 0;
                flatTargets[modSource] += modNum;
            }
        });
        return flatTargets;
    }
    applyRollModifiers(rollData) {
        function checkModTarget(target) {
            return ["all", rollData.sourceType, rollData.sourceName, rollData.attribute].includes(target);
        }
        function checkMod(modData) {
            const mod = { category: modData.category, display: modData.display, value: 0 };
            for (const [target, value] of Object.entries(modData.targets)) {
                if (checkModTarget(target)) {
                    mod.value += value;
                }
            }
            if (mod.value === 0) {
                return null;
            }
            return mod;
        }
        return {
            ...rollData,
            modifiers: [
                this.woundModData,
                this.stabilityModData,
                ...this.conditionModData,
                ...this.effectModData
            ]
                .map(checkMod)
                .filter((mod) => mod !== null)
        };
    }
    async getRoll(rollSourceRef, options) {
        let rollSource;
        const rollData = {};
        if (rollSourceRef === "ask" /* K4Attribute.ask */) {
            const attrResponse = await this.askForAttribute();
            if (attrResponse) {
                rollSource = attrResponse;
            }
        }
        else if (rollSourceRef instanceof K4Item) {
            if (rollSourceRef instanceof K4Item && rollSourceRef.isRollableItem()) {
                rollSource = rollSourceRef;
            }
        }
        else if (rollSourceRef in CONFIG.K4.attributes || rollSourceRef === "zero" /* K4Attribute.zero */) {
            rollSource = rollSourceRef;
        }
        else if (typeof rollSourceRef === "string") {
            const item = this.getItemByName(rollSourceRef);
            if (item instanceof K4Item && item.isRollableItem()) {
                rollSource = item;
            }
        }
        if (rollSource) {
            if (rollSource instanceof K4Item) {
                rollData.type = "move" /* K4RollType.move */;
                rollData.source = rollSource;
                rollData.sourceType = rollSource.masterType;
                rollData.sourceName = rollSource.name;
                rollData.sourceImg = rollSource.img;
                if (rollSource.data.data.attribute === "ask" /* K4Attribute.ask */) {
                    const attrResponse = await this.askForAttribute();
                    if (attrResponse) {
                        rollData.attribute = attrResponse;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    rollData.attribute = rollSource.data.data.attribute;
                }
                rollData.attrName = U.loc(`trait.${rollData.attribute}`);
                rollData.attrVal = rollData.attribute === "zero" /* K4Attribute.zero */ ? 0 : this.attributes[rollData.attribute];
            }
            else if (rollSource in CONFIG.K4.attributes || rollSource === "zero" /* K4Attribute.zero */) {
                rollData.type = rollSource === "zero" /* K4Attribute.zero */ ? "zero" /* K4RollType.zero */ : "attribute" /* K4RollType.attribute */;
                rollData.source = rollSource;
                rollData.sourceType = "attribute" /* K4RollType.attribute */;
                rollData.sourceName = "";
                rollData.sourceImg = "";
                rollData.attribute = rollSource;
                rollData.attrName = U.loc(`trait.${rollSource}`);
                rollData.attrVal = rollSource === "zero" /* K4Attribute.zero */ ? 0 : this.attributes[rollSource];
            }
            else {
                throw new Error(`Unable to compile roll data for rollRef '${String(rollSourceRef)}'`);
            }
            const finalData = this.applyRollModifiers(rollData);
            kLog.log("RETRIEVED ROLL DATA", finalData);
            return {
                roll: new Roll([
                    "2d10",
                    U.signNum(finalData.attrVal ?? 0, " "),
                    ...Object.values(finalData.modifiers)
                        .map(({ value }) => U.signNum(value, " "))
                        .filter((elem) => elem !== "")
                ].join(" ")),
                rollData: finalData
            };
        }
        return false;
    }
    async displayRollResult(roll, rollData, options) {
        if (U.isUndefined(roll.total)) {
            return;
        }
        function isItem(ref) { return ref instanceof K4Item; }
        const template = await getTemplate(U.getTemplatePath("sidebar", "result-rolled"));
        const templateData = {
            cssClass: "",
            dice: roll.dice[0].results.map((dResult) => dResult.result),
            total: roll.total,
            rollData,
            rollerName: this.name ?? U.loc("roll.someone")
        };
        const cssClasses = ["chat-roll-result", `${rollData.sourceType}-roll`];
        if (roll.total >= 15) {
            templateData.result = isItem(rollData.source) ? rollData.source.data.data.results.completeSuccess : { result: "" };
            cssClasses.push("roll-success");
        }
        else if (roll.total >= 9) {
            templateData.result = isItem(rollData.source) ? rollData.source.data.data.results.partialSuccess : { result: "" };
            cssClasses.push("roll-partial");
        }
        else {
            templateData.result = isItem(rollData.source) ? rollData.source.data.data.results.failure : { result: "" };
            cssClasses.push("roll-failure");
        }
        cssClasses.push(`mod-rows-${Math.ceil(rollData.modifiers.length / 2)}`);
        if (rollData.sourceName.length > 22) {
            cssClasses.push("ultra-condensed");
        }
        else if (rollData.sourceName.length > 18) {
            cssClasses.push("condensed");
        }
        templateData.cssClass = cssClasses.join(" ");
        kLog.log("DISPLAYING ROLL RESULT", { roll, templateData, rollData, options });
        const content = template(templateData);
        K4ChatMessage.create({
            content,
            speaker: K4ChatMessage.getSpeaker()
        });
    }
    async roll(rollSource, options = {}) {
        const rollResults = await this.getRoll(rollSource, options);
        if (rollResults) {
            // const {roll, rollData} = await this.getRoll(rollSource, options);
            await rollResults.roll.evaluate({ async: true });
            if (game.dice3d) {
                await game.dice3d.showForRoll(rollResults.roll);
            }
            if (rollResults.roll.total) {
                kLog.log("Roll Successful", { roll: rollResults.roll, rollData: rollResults.rollData, options });
                // this.update({"data.sitmod": 0});
                // kLog.log(`Sitmod is ` + this.data.data.sitmod);
                this.displayRollResult(rollResults.roll, rollResults.rollData, options);
            }
        }
    }
    trigger(rollSource) {
        const triggeredItem = this.getItemByName(rollSource);
        if (triggeredItem instanceof K4Item) {
            triggeredItem.displayItemSummary();
        }
    }
    async _onCreate(...[actorData, ...args]) {
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
                }
            }
            this.setFlag("kult4th", "sheetTab", "front");
        }
    }
}
export default K4Actor;
