import {ConfiguredDocumentClass, ToObjectFalseType} from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import K4Actor from "./K4Actor.js";

export default class K4PCSheet extends ActorSheet<K4PCSheet.Options, K4PCSheet.Data> {
	override get template() { return "systems/kult4th/templates/sheets/pc-sheet.hbs" }

	override get actor() { return super.actor as K4Actor }

	override async getData() {
		const data = await super.getData();
		data.actorData = data.data;
		data.baseMoves = this.actor.basicMoves;
		data.derivedMoves = this.actor.derivedMoves;
		data.advantages = this.actor.advantages;
		data.disadvantages = this.actor.disadvantages;
		data.darksecrets = this.actor.darkSecrets;
		data.relations = this.actor.relations;
		data.weapons = this.actor.weapons;
		data.gear = this.actor.gear;
		data.attacks = this.actor.attacks;
		/*DEVCODE*/console.log(data);/*!DEVCODE*/
		return data;
	}

}

namespace K4PCSheet {
	export interface Options extends ActorSheet.Options { }

	export interface Data extends ActorSheet.Data<K4PCSheet.Options> {
		// Embedded Item Categories
		baseMoves: K4Item.Move[],
		derivedMoves: K4Item.Move[];
		advantages: K4Item.Advantage[];
		disadvantages: K4Item.Disadvantage[];
		darksecrets: K4Item.DarkSecret[];
		relations: K4Item.Relation[];
		weapons: K4Item.Weapon[];
		gear: K4Item.Gear[];
		attacks: K4Item.Attack[];

		actorData: ToObjectFalseType<K4Actor>
	}
}