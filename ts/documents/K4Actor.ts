import K4Item, {K4ItemType} from "./K4Item.js";
import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import EmbeddedCollection from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs";

export enum ActorType {
	pc = "pc",
	npc = "npc"
}
console.log("test");
// EmbeddedCollection<K4Item<K4ItemType>, ActorData>
export default class K4Actor<Type extends ActorType> extends Actor {
	declare data: K4ActorData<Type>;
	override get items() { return super.items as EmbeddedCollection<typeof K4Item, ActorData> }

	// override prepareData() {
	// 	super.prepareData();
	// 	this.data.data.moves = {};
	// 	this.items.filter((item) => item.type === "move")
	// 		.forEach((move) => {
	// 			this.data.data.moves[move.koFlags.linkType ?? "basic"] = this.data.data.moves[move.koFlags.linkType ?? "basic"] ?? [];
	// 			this.data.data.moves[move.koFlags.linkType ?? "basic"].push(move);
	// 		});
	// 	const data = this.data as ActorData;
	// 	const actorData = data.data;
	// 	if (this.koFlags.archetype) {
	// 		this.data.data.archetypeAdvantages = this.getAvailableAdvantages();
	// 	}
	// }

	getItemsOfType<T extends K4ItemType>(type: T): Array<K4Item<T>> {
		return this.items.filter((item: K4Item<K4ItemType>): item is K4Item<T> => item.type === type);
	}

	get moves() { return this.getItemsOfType(K4ItemType.move) }
	get attacks() { return this.getItemsOfType(K4ItemType.attack) }
	get advantages() { return this.getItemsOfType(K4ItemType.advantage) }
	get disadvantages() { return this.getItemsOfType(K4ItemType.disadvantage) }
	get darkSecrets() { return this.getItemsOfType(K4ItemType.darksecret) }
	get weapons() { return this.getItemsOfType(K4ItemType.weapon) }
	get gear() { return this.getItemsOfType(K4ItemType.gear) }
	get relations() { return this.getItemsOfType(K4ItemType.relation) }

	get basicMoves() { return this.moves.filter((move) => !move.data.data.sourceItem?.name) }
	get derivedMoves() { return this.moves.filter((move) => Boolean(move.data.data.sourceItem?.name)) }

	get attributeData() {
		const attrList = [...Object.keys(C.Attributes.Passive), ...Object.keys(C.Attributes.Active)] as Attribute.Any[];
		return attrList.map((attrName) => ({
			name: U.tCase(attrName),
			key: attrName,
			min: this.data.data.attributes[attrName as keyof K4ActorData<ActorType>["data"]["attributes"]].min,
			max: this.data.data.attributes[attrName as keyof K4ActorData<ActorType>["data"]["attributes"]].max,
			value: this.data.data.attributes[attrName as keyof K4ActorData<ActorType>["data"]["attributes"]].value
		})) as Array<{name: Capitalize<Attribute.Any>, key: Attribute.Any, min: number, max: number, value: number}>;
	}
	get attributes() {
		return Object.fromEntries(Object.entries(this.attributeData)
			.map(([attrName, {value}]) => [attrName, value])) as Record<Attribute.Any, number>;
	}

	override async _onCreate(...[actorData, ...args]: Parameters<Actor["_onCreate"]>) {
		console.log("ACTOR ON CREATE", actorData, args);
		await super._onCreate(actorData, ...args);
		if (actorData.type === "PC") {
			console.log("ACTOR TYPE OK", this);
			// @ts-expect-error Fucking useless...
			const itemData = Array.from(game.items as Array<K4Item<K4ItemType>>).filter((item: K4Item<K4ItemType>) => item.type === "move" && !item.data.data.sourceItem.name).map((item) => item.data);
			// @ts-expect-error Fucking useless...
			this.createEmbeddedDocuments("Item", itemData);
		}
	}
}

// class K4Item<Type extends K4ItemType> extends Item {
// 	declare data: K4ItemData<Type>;
// 	override get type(): Type { return super.type as Type }
// }

// interface K4PCData extends ActorData {
// 	data: ToObjectFalseType<K4Actor["data"]>
// 	sourceItem: K4Item<K4ItemType> | ""
// }


// export class kult4eOverridesActor extends kult4eActor {


// 	_preparePCData(actorData) {
// 		super._preparePCData(actorData);
// 		this.data.data.moves = {};
// 		this.items.filter((item) => item.type === "move")
// 			.forEach((move) => {
// 				this.data.data.moves[move.koFlags.linkType ?? "basic"] = this.data.data.moves[move.koFlags.linkType ?? "basic"] ?? [];
// 				this.data.data.moves[move.koFlags.linkType ?? "basic"].push(move);
// 			});
// 		if (this.koFlags.archetype) {
// 			this.data.data.archetypeAdvantages = this.getAvailableAdvantages();
// 		}
// 	}

// 	get numPurchasedAdvantages() { return Object.values(this.koFlags?.purchases ?? {}).length }

// 	getAvailableAdvantages({isGettingAll = false} = {}) {
// 		if (!this.koFlags?.archetype) { return [] }
// 		const curAdvantages = this.items.filter((item) => item.type === "advantage").map((item) => item.name);
// 		const advPool = isGettingAll
// 			? U.unique(Object.values(C.archetypeAdvantages).flat()).sort()
// 			: C.archetypeAdvantages[this.koFlags.archetype];
// 		return advPool; // .filter((adv) => !curAdvantages.includes(adv));
// 	}

// 	getAdvancementLines() {
// 		if (!this.koFlags?.archetype) { return [] }
// 		const availableAdvantages = this.getAvailableAdvantages();
// 		const allAvailableAdvantages = this.getAvailableAdvantages({isGettingAll: true});
// 		const advancementLines = [
// 			{
// 				template: "boxline",
// 				type: "aware",
// 				index: 0,
// 				isActive: true,
// 				boxes: [false, false, false, false, false, false],
// 				label: "+1 <u>active</u> Attribute (+3 max)",
// 				options: C.attributes.active.filter((attribute) => U.pInt(this.data.data.attributes[U.lCase(attribute)]) <= 3)
// 			},
// 			{
// 				template: "boxline",
// 				type: "aware",
// 				index: 1,
// 				isActive: true,
// 				boxes: [false, false],
// 				label: "+1 <u>passive</u> Attribute (+3 max)",
// 				options: C.attributes.passive.filter((attribute) => U.pInt(this.data.data.attributes[U.lCase(attribute)]) <= 3)
// 			},
// 			{
// 				template: "boxline",
// 				type: "aware",
// 				index: 2,
// 				isActive: true,
// 				boxes: [false],
// 				label: "+1 <u>active</u> Attribute (+4 max)",
// 				options: C.attributes.active.filter((attribute) => U.pInt(this.data.data.attributes[U.lCase(attribute)]) <= 4)
// 			},
// 			{
// 				template: "boxline",
// 				type: "aware",
// 				index: 3,
// 				isActive: true,
// 				boxes: [false, false, false],
// 				label: "Gain an Archetype Advantage",
// 				options: this.getAvailableAdvantages()
// 			},
// 			this.numPurchasedAdvantages < 5 ? {template: "header", type: "invalid", isActive: true, label: `After <u>${U.uCase(U.verbalizeNum(5 - this.numPurchasedAdvantages))}</u> more Advancement${5 - this.numPurchasedAdvantages !== 1 ? "s" : ""} ...`} : null,
// 			{
// 				template: "boxline",
// 				type: this.numPurchasedAdvantages >= 5 ? "aware" : "invalid",
// 				isActive: this.numPurchasedAdvantages >= 5,
// 				index: 4,
// 				boxes: [false, false],
// 				label: "+1 <u>any</u> Attribute (+4 max)",
// 				options: [...C.attributes.active, ...C.attributes.passive].filter((attribute) => U.pInt(this.data.data.attributes[U.lCase(attribute)]) <= 4)
// 			},
// 			{
// 				template: "boxline",
// 				type: this.numPurchasedAdvantages >= 5 ? "aware" : "invalid",
// 				isActive: this.numPurchasedAdvantages >= 5,
// 				index: 5,
// 				boxes: [false, false],
// 				label: "Gain <u>any</u> Aware Advantage",
// 				options: this.getAvailableAdvantages({isGettingAll: true})
// 			},
// 			{
// 				template: "boxline",
// 				type: this.numPurchasedAdvantages >= 5 ? "aware" : "invalid",
// 				isActive: this.numPurchasedAdvantages >= 5,
// 				index: 6,
// 				boxes: [false],
// 				label: "End your Arc"
// 			},
// 			{
// 				template: "boxline",
// 				type: this.numPurchasedAdvantages >= 5 ? "aware" : "invalid",
// 				isActive: this.numPurchasedAdvantages >= 5,
// 				index: 7,
// 				boxes: [false],
// 				label: "Change your Archetype",
// 				options: C.awareArchetypes
// 			},
// 			this.numPurchasedAdvantages < 10 ? {template: "header", type: "invalid", isActive: true, label: `After <u>${U.uCase(U.verbalizeNum(10 - this.numPurchasedAdvantages))}</u> more Advancement${10 - this.numPurchasedAdvantages !== 1 ? "s" : ""} ...`} : null,
// 			{
// 				template: "boxline",
// 				type: this.numPurchasedAdvantages >= 10 ? "aware" : "invalid",
// 				isActive: this.numPurchasedAdvantages >= 10,
// 				index: 8,
// 				boxes: [false],
// 				label: "Advance to an Enlightened Archetype",
// 				options: C.enlightenedArchetypes
// 			}
// 		].filter(Boolean);
// 		const purchaseLines = [];
// 		const advantages = advancementLines.filter((line) => line.template === "boxline");
// 		Object.entries(this.koFlags?.purchases ?? {}).forEach(([i, purchase]) => {
// 			const {index, box, selection, postscript} = purchase;
// 			if (advantages[index]) {
// 				advantages[index].boxes[box] = true;
// 				purchaseLines.push({
// 					num: U.pInt(i) + 1,
// 					label: advantages[index].label,
// 					options: advantages[index].options,
// 					selection,
// 					postscript
// 				});
// 		 	}
// 		});
// 		return [advancementLines.filter(Boolean), purchaseLines];
// 	}

// 	async _onCreate(data, options, user) {
// 		await super._preCreate(data, options, user);
// 		if (this.type === "pc") {
// 			const itemData = Array.from(game.items).filter((item) => item.type === "move").map((item) => item.data);
// 			this.createEmbeddedDocuments("Item", itemData);
// 		}
// 	}

// 	get moves() { return this.data.data.moves }

// 	async makeroll(moveName, mods, {success, partial, failure}) {
// 		moveName = U.tCase(moveName);
// 		const rollString = [
// 			"2d10",
// 			...mods.map((mod) => parseInt(mod))
// 		].join(" + ");
// 		// KO.log("Roll String => ", rollString);
// 		const r = new Roll(rollString);
// 		await r.roll({async: true});
// 		// KO.log("Roll => ", r);

// 		if (game.dice3d) {
// 			await game.dice3d.showForRoll(r);
// 		}

// 		if (r.total) {
// 			// KO.log("Roll Successful");
// 			this.update({"data.sitmod": 0});
// 			// KO.log(`Sitmod is ${this.data.data.sitmod}`);
// 		}

// 		if (r.total >= 15) {
// 			this.displayRollResult({roll: r, moveName, resultText: game.i18n.localize("kult4e.Success"), moveResultText: success});
// 		} else if (r.total < 10) {
// 			this.displayRollResult({roll: r, moveName, resultText: game.i18n.localize("kult4e.Failure"), moveResultText: failure});
// 		} else {
// 			this.displayRollResult({roll: r, moveName, resultText: game.i18n.localize("kult4e.PartialSuccess"), moveResultText: partial});
// 		}
// 	}

// 	async attrroll(attrName) {
// 		const actorData = this.data;
// 		const attrMod = actorData.data.attributes[attrName];
// 		// KO.log("Attribute Mod => ", attrMod);
// 		let sitMod = parseInt(actorData.data.sitmod) + parseInt(actorData.data.forward);
// 		// KO.log("Situation Mod => ", sitMod);
// 		const woundMod = await this.woundEffect();
// 		sitMod -= woundMod;
// 		// KO.log("Situation Mod (After Wound) => ", sitMod);
// 		if (actorData.data.attributes.criticalwound && actorData.data.attributes.criticalwoundstabilized !== "true") {
// 			sitMod--;
// 			// KO.log("Situation Mod (After Crit) => ", sitMod);
// 		}
// 		this.makeroll(attrName, [attrMod, sitMod], {
// 			success: "",
// 			partial: "",
// 			failure: ""
// 		});
// 	}

// 	async moveroll(moveID) {
// 		const actordata = this.data;
// 		KO.log("Actor Data => ", actordata);

// 		if (["fortitude", "willpower", "reflexes", "reason", "intuition", "perception", "coolness", "violence", "charisma", "soul"].includes((moveID ?? "").toLowerCase())) {
// 			return this.attrroll(moveID);
// 		} else {
// 			const move = actordata.items.get(moveID);
// 			// KO.log("Move => ", move);

// 			const moveData = move.data.data;
// 			// KO.log("Move Data => ", moveData);
// 			const moveType = moveData.type;
// 			const moveName = move.name;
// 			// KO.log("Move Type => ", moveType);

// 			if (moveType === "passive") {
// 				ui.notifications.warn(game.i18n.localize("kult4e.PassiveAbility"));
// 				return false;
// 			} else {
// 				const attr = moveData.attributemod === "ask" ? await attributeAsk() : moveData.attributemod;
// 				const resultText = {
// 					success: moveData.completesuccess,
// 					failure: moveData.failure,
// 					partial: moveData.partialsuccess
// 				};
// 				const {specialflag} = moveData;
// 				let mod = 0,
// 								harm = 0;
// 				if (specialflag === 3) { // Endure Injury
// 					const boxoutput = await new Promise((resolve) => {
// 						new Dialog({
// 							"title": game.i18n.localize("kult4e.EndureInjury"),
// 							"content": `<div class="endure-harm-dialog"><label>${game.i18n.localize("kult4e.EndureInjuryDialog")}</label><input id="harm_value" data-type="number" type="number"></div>`,
// 							"default": "one",
// 							"buttons": {
// 								one: {
// 									label: "Ok",
// 									callback: () => {
// 										resolve({harm_value: document.getElementById("harm_value").value});
// 									}
// 								}
// 							}
// 						}).render(true);
// 					});
// 					harm = -1 * parseInt(boxoutput.harm_value);
// 				}

// 				if (attr !== "" && attr !== "none") {
// 					mod = actordata.data.attributes[attr];
// 				}

// 				const stab = actordata.data.stability.value;
// 				let situation = parseInt(actordata.data.sitmod) + parseInt(actordata.data.forward);
// 				// KO.log("Sitmod => ", actordata.data.sitmod);

// 				const woundmod = await this.woundEffect();
// 				situation -= woundmod;

// 				if (actordata.data.attributes.criticalwound && actordata.data.attributes.criticalwoundstabilized !== "true") {
// 					situation -= 1;
// 				}
// 				if (specialflag === 1 && stab > 2) {
// 					situation -= 1;
// 				}
// 				if (moveType === "disadvantage" && stab > 0) {
// 					situation -= 1;
// 				}
// 				if (moveType === "disadvantage" && stab > 2) {
// 					situation -= 1;
// 				}
// 				if (specialflag === 1 && stab > 5) {
// 					situation -= 1;
// 				}
// 				if (moveType === "disadvantage" && stab > 5) {
// 					situation -= 1;
// 				}
// 				if (specialflag === 2 && stab > 5) {
// 					situation += 1;
// 				}

// 				// KO.log("Attribute Mod => ", mod);
// 				// KO.log("Situation Mod => ", situation);
// 				// KO.log("Harm => ", harm);

// 				return this.makeroll(moveName, [mod, situation, harm], resultText);
// 			}
// 		}
// 	}
// }