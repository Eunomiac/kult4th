import K4Item from "./K4Item.js";
import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";

export default class K4Actor extends Actor {

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
				serious: this.data.data.modifiers.seriousWounds.length,
				critical: this.data.data.modifiers.criticalWounds.length
			};
		}
	}

	getItemsOfType<Type extends K4ItemType>(type: Type) {
		return [...this.items].filter((item: K4Item): item is K4ItemSpec<Type> => { return item.data.type === type });
	}

	getItemByName(iName: string): K4Item | undefined {
		return [...this.items].find((item: K4Item) => item.name === iName);
	}

	get attacks() { return this.getItemsOfType(K4ItemType.attack) }
	get advantages() { return this.getItemsOfType(K4ItemType.advantage) }
	get disadvantages() { return this.getItemsOfType(K4ItemType.disadvantage) }
	get darkSecrets() { return this.getItemsOfType(K4ItemType.darksecret) }
	get weapons() { return this.getItemsOfType(K4ItemType.weapon) }
	get gear() { return this.getItemsOfType(K4ItemType.gear) }
	get relations() { return this.getItemsOfType(K4ItemType.relation) }

	get moves() { return this.getItemsOfType(K4ItemType.move) }
	get basicMoves() {
		return this.moves.filter((move) => !move.data.data.sourceItem?.name);
	}
	get derivedMoves() {
		return this.moves.filter((move) => move.data.data.sourceItem?.name);
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
		const template = await getTemplate(C.getTemplatePath("dialog", "ask-for-attribute"));
		const content = template({
			id: this.id,
			message
		});
		const userOutput = await new Promise((resolve) => {
			new Dialog({
				"title": "Attribute Selection",
				content,
				"default": K4Attribute.zero,
				"buttons": C.AttributeButtons(resolve)
			}).render(true);
		}) as {attribute: K4Attribute};
		return userOutput.attribute;
	}

	get woundPenaltyData(): K4RollModData {
		if (this.data.type === K4ActorType.pc) {
			const [unstabSerious, unstabCritical] = [
				this.data.data.wounds.filter((wound) => wound.type === K4WoundType.serious && !wound.isStabilized).length,
				this.data.data.wounds.filter((wound) => wound.type === K4WoundType.critical && !wound.isStabilized).length
			];
			if (unstabSerious && unstabCritical) {
				return this.data.data.modifiers.seriousAndCriticalWounds[Math.min(
					this.data.data.maxWounds.serious,
					this.data.data.maxWounds.critical,
					unstabSerious,
					unstabCritical
				)];
			}
			if (unstabCritical) {
				return this.data.data.modifiers.criticalWounds[Math.min(
					this.data.data.maxWounds.critical,
					unstabCritical
				)];
			}
			if (unstabSerious) {
				return this.data.data.modifiers.seriousWounds[Math.min(
					this.data.data.maxWounds.serious,
					unstabSerious
				)];
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

	async getRoll(rollSource: string|K4Item, options: Partial<K4RollOptions>) {
		const rollData: Partial<K4RollData> = {};

		if (typeof rollSource === "string" && ![...C.AttrList, K4Attribute.zero, K4Attribute.ask].includes(rollSource)) {
			rollSource = this.getItemByName(rollSource) ?? rollSource;
		}

		if (rollSource instanceof K4Item && (rollSource.data.type === K4ItemType.move || rollSource.data.type === K4ItemType.attack)) {
			rollData.type = rollSource.data.type === K4ItemType.move ? K4RollType.move : K4RollType.attack;
			rollData.source = rollSource as K4ItemSpec<K4ItemType.move|K4ItemType.attack>;
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
		console.log("RETRIEVED ROLL DATA", rollData);
		return {
			roll: new Roll(`2d10 + ${rollData.attrVal ?? 0}`),
			rollData
		};
	}

	displayRollResult(roll: Roll, rollSource: K4RollSource, options: K4RollOptions) {
		console.log("DISPLAYING ROLL RESULT", {roll, rollSource, options});

		// ChatMessage.create({
		// 	content: `
		//     <div class='move-name'>${moveName}</div>
		//     <div class='move-name'>${resultText}!</div>
		//     <div class='move-result'>${moveResultText}</div>
		//     <div class='result-roll'>
		//       <div class='tooltip'>
		//         ${roll.total}
		//         <span class='tooltiptext'>${roll.result}</span>
		//       </div>
		//     </div>`,
		// 	speaker: ChatMessage.getSpeaker({alias: this.name})
		// });
	}

	async roll(rollSource: string, options: Partial<K4RollOptions> = {}) {
		const {roll, rollData} = await this.getRoll(rollSource, options);
		await roll.evaluate({async: true});
		if (game.dice3d) {
			await game.dice3d.showForRoll(roll);
		}

		if (roll.total) {
			console.log("Roll Successful");
			// this.update({"data.sitmod": 0});
			// console.log(`Sitmod is ` + this.data.data.sitmod);
			this.displayRollResult(roll, rollData.source!, options as K4RollOptions);
		}
	}

	override async _onCreate(...[actorData, ...args]: Parameters<Actor["_onCreate"]>) {
		console.log("ACTOR ON CREATE", actorData, args);

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
					this.createEmbeddedDocuments("Item", newItems);
				}
			}
		}
	}
}