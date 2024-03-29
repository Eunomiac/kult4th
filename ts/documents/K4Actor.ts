import K4Item from "./K4Item.js";
import K4PCSheet from "./K4PCSheet.js";
import K4NPCSheet from "./K4NPCSheet.js";
import K4ChatMessage from "./K4ChatMessage.js";
import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";

class K4Actor extends Actor {

	get actorSheet() {
		return this._sheet as typeof this._sheet & (
			typeof this.data.type extends K4ActorType.pc ? K4PCSheet : K4NPCSheet
		 );
	}
	get system() { return this.data.data as typeof this["data"]["data"] }

	override prepareData() {
		super.prepareData();
		if (this.data.type === K4ActorType.pc) {
			this.preparePCData();
		}
	}

	preparePCData() {
		if (this.data.type === K4ActorType.pc) {
			this.system.moves = this.moves;
			this.system.basicMoves = this.basicMoves;
			this.system.derivedMoves = this.derivedMoves;
			this.system.attacks = this.attacks;
			this.system.advantages = this.advantages;
			this.system.disadvantages = this.disadvantages;
			this.system.darkSecrets = this.darkSecrets;
			this.system.weapons = this.weapons;
			this.system.gear = this.gear;
			this.system.relations = this.relations;

			this.system.maxWounds = {
				serious: this.system.modifiers.wounds_serious.length,
				critical: this.system.modifiers.wounds_critical.length,
				total: this.system.modifiers.wounds_serious.length + this.system.modifiers.wounds_critical.length
			};
			this.system.modifiersReport = this.parseModsToStrings(this.flatModTargets).join("; ");

			// this.validateStability();
		}
	}

	getItemsOfType<Type extends K4ItemType>(type: Type): Array<K4ItemSpec<Type>> {
		return [...this.items].filter((item: K4Item): item is K4ItemSpec<Type> => { return item.data.type === type });
	}

	getItemByName(iName: string): K4Item | undefined {
		return [...this.items].find((item: K4Item) => item.name === iName);
	}

	getItemsBySource(sourceID: string): K4SubItem[] {
		return [...this.items].filter((item: K4Item): item is K4SubItem => item.isSubItem() && item.system.sourceItem.id === sourceID);
	}

	async dropItemByName(iName: string) {
		return [...this.items].find((item: K4Item) => item.name === iName)?.delete();
	}

	get moves() { return this.getItemsOfType(K4ItemType.move) }
	get basicMoves() { return this.moves.filter((move) => !move.isSubItem()) }
	get derivedMoves() { return this.moves.filter((move): move is K4SubItem<K4ItemType.move> => move.isSubItem()) }

	get attacks() { return this.getItemsOfType(K4ItemType.attack) }
	get basicAttacks() { return this.attacks.filter((attack) => !attack.isSubItem()) }
	get derivedAttacks() { return this.attacks.filter((attack): attack is K4SubItem<K4ItemType.attack> => attack.isSubItem()) }

	get advantages() { return this.getItemsOfType(K4ItemType.advantage) }
	get disadvantages() { return this.getItemsOfType(K4ItemType.disadvantage) }
	get darkSecrets() { return this.getItemsOfType(K4ItemType.darksecret) }
	get weapons() { return this.getItemsOfType(K4ItemType.weapon) }
	get gear() { return this.getItemsOfType(K4ItemType.gear) }
	get relations() { return this.getItemsOfType(K4ItemType.relation) }

	get derivedItems() { return [...this.items].filter((item): item is K4SubItem => item.isSubItem()) }

	get wounds(): Record<KeyOf<typeof this["data"]["data"]["wounds"]>,K4Wound> {
		// if (this.type === K4ActorType.pc) {
		return this.system.wounds;
		// } else {
		// return ;
		// }
	}

	get woundStrips(): HoverStripData[] {
		return Object.values(this.wounds).map((wound) => {
			const stripData: Partial<HoverStripData> = {
				id: wound.id,
				icon: "systems/kult4th/assets/icons/wounds/",
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
				stripData.icon += `wound-critical${wound.isStabilized ? "-stabilized" : ""}.svg`;
				stripData.stripClasses?.push("wound-critical");
			} else {
				stripData.icon += `wound-serious${wound.isStabilized ? "-stabilized" : ""}.svg`;
			}
			if (wound.isStabilized) {
				stripData.stripClasses?.push("k4-theme-dgold", "wound-stabilized");
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
				min: this.system.attributes[attrName].min as int,
				max: this.system.attributes[attrName].max as int,
				value: this.system.attributes[attrName].value as int
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
		const {value, min, max} = this.system.stability;
		if (U.clampNum(value, [min, max]) !== value) {
			this.update({["data.stability.value"]: U.clampNum(value, [min, max])});
		}
	}

	changeStability(delta: int) {
		if (delta) {
			const {value, min, max} = this.system.stability;
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
			kLog.log("Starting Wounds", U.objClone(this.system.wounds));
			await this.update({[`data.wounds.${woundData.id}`]: woundData});
			kLog.log("Updated Wounds", U.objClone(this.system.wounds));
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
			kLog.log("Starting Wounds", U.objClone(this.system.wounds));
			await this.update({[`data.wounds.-=${id}`]: null});
			kLog.log("Updated Wounds", this.system.wounds);
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
				modData.targets = this.system.modifiers.wounds_seriouscritical[Math.min(
					unstabSerious,
					unstabCritical
				)];
			} else if (unstabCritical) {
				modData.targets = this.system.modifiers.wounds_critical[unstabCritical];
			} else if (unstabSerious) {
				modData.targets = this.system.modifiers.wounds_serious[unstabSerious];
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
			modData.targets = this.system.modifiers.stability[this.system.stability.value];
		}
		return modData;
	}
	get conditionModData(): K4RollModData[] {
		const modData: K4RollModData[] = [];

		return modData;
	}
	get effectModData(): K4RollModData[] {
		const modData: K4RollModData[] = [];

		return [
			{
				category: "effect",
				display: "Effect One",
				targets: {"Keep It Together": 2}
			},
			{
				category: "effect",
				display: "Effect Two",
				targets: {move: 4}
			},
			{
				category: "effect",
				display: "Effect Three",
				targets: {[K4Attribute.willpower]: -1}
			}
		];

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

	public async roll(rollSource: string, options: Partial<K4RollOptions> = {}) {
		const rollResults = await this.#getRoll(rollSource, options);
		if (rollResults) {
			await rollResults.roll.evaluate({async: true});
			if (game.dice3d) {
				await game.dice3d.showForRoll(rollResults.roll);
			}
			if (rollResults.roll.total) {
				kLog.log("Roll Successful", {roll: rollResults.roll, rollData: rollResults.rollData, options});
				this.#displayRollResult(rollResults.roll, rollResults.rollData, options as K4RollOptions);
			}
		}
	}

	public async trigger(rollSource: string) { this.getItemByName(rollSource)?.displayItemSummary() }

	async #getRoll(rollSourceRef: string|K4RollSource|K4Attribute.ask, options: Partial<K4RollOptions>): Promise<{roll: Roll, rollData: K4RollData}|false> {

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
				if (rollSource.system.attribute === K4Attribute.ask) {
					const attrResponse = await this.askForAttribute();
					if (attrResponse) {
						rollData.attribute = attrResponse;
					} else {
						return false;
					}
				} else {
					rollData.attribute = rollSource.system.attribute;
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

			const finalData: K4RollData = this.#applyRollModifiers(rollData as Omit<K4RollData,"modifiers">);

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

	#applyRollModifiers(rollData: Omit<K4RollData,"modifiers">): K4RollData {
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

	async #displayRollResult(roll: Roll, rollData: K4RollData, options: K4RollOptions) {
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
		const cssClasses = ["chat-roll-result", `${rollData.sourceType}-roll`];
		if (roll.total >= 15) {
			templateData.result = isItem(rollData.source) ? rollData.source.system.results.completeSuccess : {result: ""};
			cssClasses.push("roll-success");
		} else if (roll.total >= 9) {
			templateData.result = isItem(rollData.source) ? rollData.source.system.results.partialSuccess : {result: ""};
			cssClasses.push("roll-partial");
		} else {
			templateData.result = isItem(rollData.source) ? rollData.source.system.results.failure : {result: ""};
			cssClasses.push("roll-failure");
		}
		cssClasses.push(`mod-rows-${Math.ceil(rollData.modifiers.length / 2)}`);
		if (rollData.sourceName.length > 22) {
			cssClasses.push("ultra-condensed");
		} else if (rollData.sourceName.length > 18) {
			cssClasses.push("condensed");
		}
		templateData.cssClass = cssClasses.join(" ");
		kLog.log("DISPLAYING ROLL RESULT", {roll, templateData, rollData, options});
		const content = template(templateData);
		K4ChatMessage.create({
			content,
			speaker: K4ChatMessage.getSpeaker()
		});
	}

	override async _onCreate(...params: Parameters<Actor["_onCreate"]>) {
		await super._onCreate(...params);
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
					await this.createEmbeddedDocuments("Item", newItems);
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