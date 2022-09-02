import K4Item from "./K4Item.js";
import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";

class K4Actor extends Actor {

	// get kData() { return this.data.data }

	override prepareData() {
		super.prepareData();
		if (this.data.type === K4ActorType.pc) {
			this.preparePCData();
		}
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
			this.data.data.modifiersReport = this.parseModsToStrings(this.flatModTargets).join("; ");

			// this.validateStability();
		}
	}

	getItemsOfType<Type extends K4ItemType>(type: Type) {
		return [...this.items].filter((item: K4Item): item is K4ItemSpec<Type> => { return item.data.type === type });
	}

	getItemByName(iName: string): K4Item | undefined {
		return [...this.items].find((item: K4Item) => item.name === iName);
	}

	getItemsBySource(sourceID: string): K4SubItem[] {
		return [...this.items].filter((item: K4Item) => item.isSubItem() && item.data.data.sourceItem.id === sourceID) as K4SubItem[];
	}

	async dropItemByName(iName: string) {
		return [...this.items].find((item: K4Item) => item.name === iName)?.delete();
	}

	get moves() { return this.getItemsOfType(K4ItemType.move) }
	get basicMoves() { return this.moves.filter((move) => !move.isSubItem()) }
	get derivedMoves() { return this.moves.filter((move) => move.isSubItem()) }

	get attacks() { return this.getItemsOfType(K4ItemType.attack) }
	get basicAttacks() { return this.attacks.filter((attack) => !attack.isSubItem()) }
	get derivedAttacks() { return this.attacks.filter((attack) => attack.isSubItem()) }


	get advantages() { return this.getItemsOfType(K4ItemType.advantage) }
	get disadvantages() { return this.getItemsOfType(K4ItemType.disadvantage) }
	get darkSecrets() { return this.getItemsOfType(K4ItemType.darksecret) }
	get weapons() { return this.getItemsOfType(K4ItemType.weapon) }
	get gear() { return this.getItemsOfType(K4ItemType.gear) }
	get relations() { return this.getItemsOfType(K4ItemType.relation) }

	get derivedItems() { return [...this.items].filter((item) => item.isSubItem()) }

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

	async askForAttribute(message?: string): Promise<K4RollableAttribute | null> {
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
		}) as {attribute: K4RollableAttribute};
		return userOutput.attribute || null;
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
			kLog.log("Starting Wounds", U.objClone(this.data.data.wounds));
			await this.update({[`data.wounds.${woundData.id}`]: woundData});
			kLog.log("Updated Wounds", U.objClone(this.data.data.wounds));
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
			kLog.log("Starting Wounds", U.objClone(this.data.data.wounds));
			await this.update({[`data.wounds.-=${id}`]: null});
			kLog.log("Updated Wounds", this.data.data.wounds);
		}
	}

	parseModsToStrings(modData: K4ModTargets = this.flatModTargets): string[] {
		const returnStrings = [];
		for (const [modKey, modVal] of Object.entries(modData)) {
			returnStrings.push(`${U.signNum(modVal)} to ${modKey === "all" ? "all" : U.tCase(modKey)} rolls`);
		}
		return returnStrings;
	}

	get woundModData(): K4RollModData {
		const modData: K4RollModData = {
			category: "wound",
			display: U.loc("trait.wounds"),
			targets: {}
		};
		if (this.data.type === K4ActorType.pc) {
			const [unstabSerious, unstabCritical] = [
				Object.values(this.wounds).filter((wound) => !wound.isCritical && !wound.isStabilized).length,
				Object.values(this.wounds).filter((wound) => wound.isCritical && !wound.isStabilized).length
			];
			if (unstabSerious && unstabCritical) {
				modData.targets = this.data.data.modifiers.wounds_seriouscritical[Math.min(
					unstabSerious,
					unstabCritical
				)];
			} else if (unstabCritical) {
				modData.targets = this.data.data.modifiers.wounds_critical[unstabCritical];
			} else if (unstabSerious) {
				modData.targets = this.data.data.modifiers.wounds_serious[unstabSerious];
			}
		}
		return modData;
	}
	get stabilityModData(): K4RollModData {
		const modData: K4RollModData = {
			category: "stability",
			display: U.loc("trait.stability"),
			targets: {}
		};
		if (this.data.type === K4ActorType.pc) {
			modData.targets = this.data.data.modifiers.stability[this.data.data.stability.value];
		}
		return modData;
	}
	get conditionModData(): K4RollModData[] {
		const modData: K4RollModData[] = [];

		return modData;
	}
	get effectModData(): K4RollModData[] {
		const modData: K4RollModData[] = [];

		return modData;
	}

	get modTargets(): K4RollModData[] {
		return [
			this.woundModData,
			this.stabilityModData,
			...this.conditionModData,
			...this.effectModData
		];
	}
	get flatModTargets(): K4ModTargets {
		const flatTargets: K4ModTargets = {};
		this.modTargets.forEach(({targets}) => {
			for (const [modSource, modNum] of Object.entries(targets)) {
				flatTargets[modSource] ??= 0;
				flatTargets[modSource] += modNum;
			}
		});
		return flatTargets;
	}

	applyRollModifiers(rollData: Omit<K4RollData,"modifiers">): K4RollData {
		function checkModTarget(target: string) {
			return ["all", rollData.sourceType, rollData.sourceName, rollData.attribute].includes(target);
		}
		function checkMod(modData: K4RollModData): K4RollMod | null {
			const mod: K4RollMod = {category: modData.category, display: modData.display, value: 0};
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
				.filter((mod): mod is K4RollMod => mod !== null)
		};
	}

	async getRoll(rollSourceRef: string|K4RollSource|K4Attribute.ask, options: Partial<K4RollOptions>): Promise<{roll: Roll, rollData: K4RollData}|false> {

		let rollSource: K4RollSource|undefined;
		const rollData: Partial<K4RollData> = {};

		if (rollSourceRef === K4Attribute.ask) {
			const attrResponse = await this.askForAttribute();
			if (attrResponse) {
				rollSource = attrResponse;
			}
		} else if (rollSourceRef instanceof K4Item) {
			if (rollSourceRef instanceof K4Item && rollSourceRef.isRollableItem()) {
				rollSource = rollSourceRef;
			}
		} else if (rollSourceRef in CONFIG.K4.attributes || rollSourceRef === K4Attribute.zero) {
			rollSource = rollSourceRef as K4RollableAttribute;
		} else if (typeof rollSourceRef === "string") {
			const item = this.getItemByName(rollSourceRef);
			if (item instanceof K4Item && item.isRollableItem()) {
				rollSource = item;
			}
		}

		if (rollSource) {
			if (rollSource instanceof K4Item) {
				rollData.type = K4RollType.move;
				rollData.source = rollSource;
				rollData.sourceType = rollSource.masterType;
				rollData.sourceName = rollSource.name;
				rollData.sourceImg = rollSource.img;
				if (rollSource.data.data.attribute === K4Attribute.ask) {
					const attrResponse = await this.askForAttribute();
					if (attrResponse) {
						rollData.attribute = attrResponse;
					} else {
						return false;
					}
				} else {
					rollData.attribute = rollSource.data.data.attribute;
				}
				rollData.attrName = U.loc(`trait.${rollData.attribute}`);
				rollData.attrVal = rollData.attribute === K4Attribute.zero ? 0 : this.attributes[rollData.attribute];
			} else if (rollSource in CONFIG.K4.attributes || rollSource === K4Attribute.zero) {
				rollData.type = rollSource === K4Attribute.zero ? K4RollType.zero : K4RollType.attribute;
				rollData.source = rollSource;
				rollData.sourceType = K4RollType.attribute;
				rollData.sourceName = "";
				rollData.sourceImg = "";
				rollData.attribute = rollSource;
				rollData.attrName = U.loc(`trait.${rollSource}`);
				rollData.attrVal = rollSource === K4Attribute.zero ? 0 : this.attributes[rollSource];
			} else {
				throw new Error(`Unable to compile roll data for rollRef '${String(rollSourceRef)}'`);
			}

			const finalData: K4RollData = this.applyRollModifiers(rollData as Omit<K4RollData,"modifiers">);

			kLog.log("RETRIEVED ROLL DATA", finalData);
			return {
				roll: new Roll([
					"2d10",
					U.signNum(finalData.attrVal ?? 0, " "),
					...Object.values(finalData.modifiers)
						.map(({value}) => U.signNum(value, " "))
						.filter((elem) => elem !== "")
				].join(" ")),
				rollData: finalData
			};
		}
		return false;
	}

	async displayRollResult(roll: Roll, rollData: K4RollData, options: K4RollOptions) {
		if (U.isUndefined(roll.total)) { return }
		function isItem(ref: unknown): ref is K4RollableItem { return ref instanceof K4Item }

		const template = await getTemplate(U.getTemplatePath("sidebar", "result-rolled"));
		const templateData: {
			cssClass: string,
			result?: ValueOf<ResultsData["results"]>,
			dice: [number, number],
			total: number,
			rollData: K4RollData,
			rollerName: string
		} = {
			cssClass: "",
			dice: roll.dice[0].results.map((dResult) => dResult.result) as [number, number],
			total: roll.total,
			rollData,
			rollerName: this.name ?? U.loc("roll.someone")
		};
		// templateData.dice =
		if (roll.total >= 15) {
			templateData.result = isItem(rollData.source) ? rollData.source.data.data.results.completeSuccess : {result: ""};
			templateData.cssClass = "roll-success";
		} else if (roll.total >= 9) {
			templateData.result = isItem(rollData.source) ? rollData.source.data.data.results.partialSuccess : {result: ""};
			templateData.cssClass = "roll-partial";
		} else {
			templateData.result = isItem(rollData.source) ? rollData.source.data.data.results.failure : {result: ""};
			templateData.cssClass = "roll-failure";
		}
		kLog.log("DISPLAYING ROLL RESULT", {roll, templateData, rollData, options});
		const content = template(templateData);
		ChatMessage.create({
			content,
			speaker: ChatMessage.getSpeaker()
		});
	}

	async roll(rollSource: string, options: Partial<K4RollOptions> = {}) {
		const rollResults = await this.getRoll(rollSource, options);
		if (rollResults) {
			// const {roll, rollData} = await this.getRoll(rollSource, options);
			await rollResults.roll.evaluate({async: true});
			if (game.dice3d) {
				await game.dice3d.showForRoll(rollResults.roll);
			}
			if (rollResults.roll.total) {
				kLog.log("Roll Successful", {roll: rollResults.roll, rollData: rollResults.rollData, options});
				// this.update({"data.sitmod": 0});
				// kLog.log(`Sitmod is ` + this.data.data.sitmod);
				this.displayRollResult(rollResults.roll, rollResults.rollData, options as K4RollOptions);
			}
		}
	}

	trigger(rollSource: string) {
		const triggeredItem = this.getItemByName(rollSource);
		if (triggeredItem instanceof K4Item) {
			triggeredItem.displayItemSummary();
		}
	}

	override async _onCreate(...[actorData, ...args]: Parameters<Actor["_onCreate"]>) {
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
				}
			}
			this.setFlag("kult4th", "sheetTab", "front");
		}
	}
}
declare interface K4Actor {
	get id(): string;
	get name(): string;
}

export default K4Actor;