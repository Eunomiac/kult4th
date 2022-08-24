import K4Item from "./K4Item.js";
import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import {ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData.js";

export default class K4Actor extends Actor {

	get kData() { return this.data.data }

	override prepareData() {
		super.prepareData();
		if (this.data.type === K4ActorType.pc) {
			this.preparePCData();
		}
	}

	async populateDebugPC() {

		// Add wounds
		this.update({
			"data.wounds": [
				{
					description: "Scraped Knee",
					isCritical: false,
					isStabilized: true
				},
				{
					description: "Broken Arm",
					isCritical: false,
					isStabilized: false
				},
				{
					description: "Gunshot Wound",
					isCritical: true,
					isStabilized: true
				}
			]
		});
	}

	preparePCData() {
		if (this.data.type === K4ActorType.pc) {
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

	getItemsOfType<Type extends K4ItemType>(type: Type) {
		return [...this.items].filter((item: K4Item): item is K4ItemSpec<Type> => { return item.data.type === type });
	}

	getItemByName(iName: string): K4Item | undefined {
		return [...this.items].find((item: K4Item) => item.name === iName);
	}

	async dropItemByName(iName: string) {
		return [...this.items].find((item: K4Item) => item.name === iName)?.delete();
	}

	get moves() { return this.getItemsOfType(K4ItemType.move) }
	get basicMoves() { return this.moves.filter((move) => !move.isDerived()) }
	get derivedMoves() { return this.moves.filter((move) => move.isDerived()) }

	get attacks() { return this.getItemsOfType(K4ItemType.attack) }
	get basicAttacks() { return this.attacks.filter((attack) => !attack.isDerived()) }
	get derivedAttacks() { return this.attacks.filter((attack) => attack.isDerived()) }


	get advantages() { return this.getItemsOfType(K4ItemType.advantage) }
	get disadvantages() { return this.getItemsOfType(K4ItemType.disadvantage) }
	get darkSecrets() { return this.getItemsOfType(K4ItemType.darksecret) }
	get weapons() { return this.getItemsOfType(K4ItemType.weapon) }
	get gear() { return this.getItemsOfType(K4ItemType.gear) }
	get relations() { return this.getItemsOfType(K4ItemType.relation) }

	get derivedItems() { return [...this.items].filter((item) => item.isDerived()) }

	get wounds(): Record<KeyOf<typeof this["data"]["data"]["wounds"]>,K4Wound> {
		// if (this.type === K4ActorType.pc) {
		return this.data.data.wounds;
		// } else {
		// return ;
		// }
	}

	get woundStrips(): HoverStripData[] {
		return Object.values(this.wounds).map((wound) => {
			const stripData: Partial<HoverStripData> = {
				id: wound.id,
				type: [
					wound.isStabilized ? "stable" : "",
					wound.isCritical ? "critical" : "serious"
				].join("") as K4WoundType,
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
			} else {
				stripData.icon = "wound-serious";
			}
			if (wound.isStabilized) {
				stripData.icon = `${stripData.icon}-stabilized`;
				stripData.stripClasses?.push("k4-theme-dgold", "wound-stabilized");
				// stripData.dataset!["color-fg"] = C.Colors.GOLD;
				// stripData.dataset!["color-bg"] = C.Colors.BLACK;
			} else {
				stripData.stripClasses?.push("k4-theme-red");
			}
			return stripData as HoverStripData;
		});
	}

	get attributeData() {
		if (this.type === K4ActorType.pc) {
			const attrList = [...Object.keys(C.Attributes.Passive), ...Object.keys(C.Attributes.Active)] as K4CharAttribute[];
			return attrList.map((attrName) => ({
				name: U.tCase(attrName) as Capitalize<K4CharAttribute>,
				key: attrName,
				min: this.data.data.attributes[attrName].min as int,
				max: this.data.data.attributes[attrName].max as int,
				value: this.data.data.attributes[attrName].value as int
			}));
		}
		return [];
	}
	get attributes() {
		return Object.fromEntries(this.attributeData.map((aData) => [aData.key, aData.value])) as Record<K4CharAttribute,number>;
	}

	async askForAttribute(message?: string) {
		const template = await getTemplate(U.getTemplatePath("dialog", "ask-for-attribute"));
		const content = template({
			id: this.id,
			message
		});
		const userOutput = await new Promise((resolve) => {
			new Dialog(
				{
					"title": "Attribute Selection",
					content,
					"default": K4Attribute.zero,
					"buttons": C.AttributeButtons(resolve)
				},
				{
					classes: [C.SYSTEM_ID, "dialog", "attribute-selection"]
				}
			).render(true);
		}) as {attribute: K4Attribute};
		return userOutput.attribute;
	}

	validateStability() {
		const {value, min, max} = this.data.data.stability;
		if (U.clampNum(value, [min, max]) !== value) {
			this.update({["data.stability.value"]: U.clampNum(value, [min, max])});
		}
	}

	changeStability(delta: int) {
		if (delta) {
			const {value, min, max} = this.data.data.stability;
			if (U.clampNum(value + delta, [min, max]) !== value) {
				this.update({["data.stability.value"]: U.clampNum(value + delta, [min, max])});
			}
		}
	}

	async addWound(type?: K4WoundType, description?: string) {
		if (this.data.type === K4ActorType.pc) {
			const woundData: K4Wound = {
				id: `wound_${U.randString(10)}`,
				description: description ?? "",
				isCritical: type === K4WoundType.critical,
				isStabilized: false
			};
			U.dbLog("Starting Wounds", U.objClone(this.data.data.wounds));
			await this.update({[`data.wounds.${woundData.id}`]: woundData});
			U.dbLog("Updated Wounds", U.objClone(this.data.data.wounds));
		}
	}

	async toggleWound(id: string, toggleSwitch: "type"|"stabilized") {
		const woundData = this.wounds[id];
		if (woundData) {
			switch (toggleSwitch) {
				case "type": {
					await this.update({[`data.wounds.${id}.isCritical`]: !this.wounds[id].isCritical});
					return;
				}
				case "stabilized": {
					await this.update({[`data.wounds.${id}.isStabilized`]: !this.wounds[id].isStabilized});
					return;
				}
				// no default
			}
		}
	}

	async resetWoundName(id: string) {
		const woundData = this.wounds[id];
		if (woundData) {
			await this.update({[`data.wounds.${id}.description`]: ""});
			return;
		}
	}

	async removeWound(id: string) {
		if (this.data.type === K4ActorType.pc) {
			U.dbLog("Starting Wounds", U.objClone(this.data.data.wounds));
			await this.update({[`data.wounds.-=${id}`]: null});
			U.dbLog("Updated Wounds", this.data.data.wounds);
		}
	}

	parseModsToStrings(modData: K4RollModData = this.flatModifiersData): string[] {
		const returnStrings = [];
		for (const [modKey, modVal] of Object.entries(modData)) {
			returnStrings.push(`${U.signNum(modVal)} to ${modKey === "all" ? "all" : U.tCase(modKey)} rolls`);
		}
		return returnStrings;
	}

	get woundPenaltyData(): K4RollModData {
		if (this.data.type === K4ActorType.pc) {
			const [unstabSerious, unstabCritical] = [
				Object.values(this.wounds).filter((wound) => !wound.isCritical && !wound.isStabilized).length,
				Object.values(this.wounds).filter((wound) => wound.isCritical && !wound.isStabilized).length
			];
			if (unstabSerious && unstabCritical) {
				return this.data.data.modifiers.wounds_seriouscritical[Math.min(
					unstabSerious,
					unstabCritical
				)];
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
	get stabilityPenaltyData(): K4RollModData {
		if (this.data.type === K4ActorType.pc) {
			return this.data.data.modifiers.stability[this.data.data.stability.value];
		}
		return {};
	}
	get conditionPenaltyData(): K4RollModData {

		return {};
	}
	get effectPenaltyData(): K4RollModData {

		return {};
	}

	get modifierData(): Record<string,K4RollModData> {
		return {
			wounds: this.woundPenaltyData,
			stability: this.stabilityPenaltyData
			/* Add other categories here for _specific_ conditions and effects _by name_ (as key


				*/
		};
	}
	get flatModifiersData(): K4RollModData {
		const returnData: K4RollModData = {};
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
	getRollModifiers(rollData: Partial<K4RollData>): Record<string,number> {
		function checkModTarget(target: string) {
			return ["all", rollData.type, rollData.source].includes(target);
		}
		const modifiers: Record<string, number> = {};
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

	async getRoll(rollSource: string|K4RollableItem, options: Partial<K4RollOptions>) {
		const rollData: Partial<K4RollData> = {};

		if (typeof rollSource === "string" && ![...C.AttrList, K4Attribute.zero, K4Attribute.ask].includes(rollSource)) {
			rollSource = this.getItemByName(rollSource) as K4RollableItem ?? rollSource;
		}

		if (rollSource instanceof K4Item/*  && (rollSource.data.type === K4ItemType.move || rollSource.data.type === K4ItemType.attack) */) {
			const rollSourceType: K4ItemType = rollSource.isDerived()
				? rollSource.sourceType
				: rollSource.data.type;
			switch (rollSourceType) {
				case K4ItemType.move: {
					rollData.type = K4RollType.move;
					break;
				}
				case K4ItemType.attack: {
					rollData.type = K4RollType.attack;
					break;
				}
				case K4ItemType.advantage: {
					rollData.type = K4RollType.advantage;
					break;
				}
				case K4ItemType.disadvantage: {
					rollData.type = K4RollType.disadvantage;
					break;
				}
				default: {
					throw new Error(`Can't roll items of type '${rollSource.data.type}'`);
				}
			}
			rollData.source = rollSource as K4RollableItem; // as K4ItemSpec<K4ItemType.move|K4ItemType.attack>;
			rollSource = rollSource.data.data.attribute;
		}
		if (rollSource === K4Attribute.ask) {
			rollSource = await this.askForAttribute();
		}
		if (rollSource === K4Attribute.zero) {
			rollData.type ??= K4RollType.zero;
			rollData.source ??= K4Attribute.zero;
			rollData.attrVal = 0;
		} else if (typeof rollSource === "string" && C.AttrList.includes(rollSource)) {
			rollData.type ??= K4RollType.attribute;
			rollData.source ??= rollSource as K4CharAttribute;
			rollData.attrVal = this.attributes[rollSource as Exclude<K4RollAttribute,K4Attribute.zero>];
		}
		rollData.modifiers = this.getRollModifiers(rollData);
		U.dbLog("RETRIEVED ROLL DATA", rollData);
		return {
			roll: new Roll([
				"2d10",
				U.signNum(rollData.attrVal ?? 0, " "),
				...Object.values(rollData.modifiers)
					.map((modifier) => (modifier > 0 ? U.signNum(modifier, " ") : ""))
					.filter((elem) => elem !== "")
			].join(" ")),
			rollData
		};
	}

	async displayRollResult(roll: Roll, rollSource: K4RollSource, options: K4RollOptions) {
		U.dbLog("DISPLAYING ROLL RESULT", {roll, rollSource, options});
		if (U.isUndefined(roll.total)) { return }
		if (!(rollSource instanceof K4Item && (rollSource.data.type === K4ItemType.move || rollSource.data.type === K4ItemType.attack || rollSource.data.type === K4ItemType.advantage || rollSource.data.type === K4ItemType.disadvantage))) { return }
		let results;

		const template = await getTemplate(U.getTemplatePath("sidebar", "roll-result"));
		const templateData: {result?: ValueOf<ResultsData["results"]>, cssClass: string, context: K4Item} = {
			cssClass: "kult4th-chat chat-roll-result",
			context: rollSource
		};
		// templateData.dice =
		if (roll.total >= 15) {
			templateData.result = rollSource.data.data.results.completeSuccess;
		} else if (roll.total >= 9) {
			templateData.result = rollSource.data.data.results.partialSuccess;
		} else {
			templateData.result = rollSource.data.data.results.failure;
		}

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

	async roll(rollSource: string, options: Partial<K4RollOptions> = {}) {
		const {roll, rollData} = await this.getRoll(rollSource, options);
		await roll.evaluate({async: true});
		if (game.dice3d) {
			await game.dice3d.showForRoll(roll);
		}

		if (roll.total) {
			U.dbLog("Roll Successful");
			// this.update({"data.sitmod": 0});
			// U.dbLog(`Sitmod is ` + this.data.data.sitmod);
			this.displayRollResult(roll, rollData.source!, options as K4RollOptions);
		}
	}

	override async _onCreate(...[actorData, ...args]: Parameters<Actor["_onCreate"]>) {
		// U.dbLog("ACTOR ON CREATE", actorData, args);

		if (this.type === K4ActorType.pc){
			const pack = await game.packs.get("kult4th.k4-basic-player-moves");
			if (pack) {
				const index = await pack.getIndex();
				const moveArray = await Array.from(index);
				const newItems = await Promise.all(moveArray.map(async (move) => {
					const moveData = await pack.getDocument(move._id);
					return moveData?.data ?? {};
				}));
				if (newItems) {
					await this.createEmbeddedDocuments("Item", newItems) as K4Item[];
					// brandNewItems[0].sheet?.render(true );
				}
			}
			this.setFlag("kult4th", "sheetTab", "front");
		}
	}
}