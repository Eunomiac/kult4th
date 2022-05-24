import {ToObjectFalseType} from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js";
import K4Actor from "./K4Actor.js";
import K4Item, {K4ItemType} from "./K4Item.js";
import type K4ItemSchema from "./K4Item.js";

// namespace K4PCSheet {
// 	export interface Data<Options> extends ActorSheet.Data<ActorSheet.Options> {
// 		items: Partial<Item>[]
// 		moves?: Array<K4Item<K4ItemType.move>>


// 	}
// }

export interface K4PCSheetOptions extends ActorSheet.Options {
	item: any
}

export interface K4PCSheetData extends ActorSheet.Data<K4PCSheetOptions> {
	item: any
}

function isBaseMove(item: any): item is K4Item<K4ItemType.move> { return item.type === K4ItemType.move && !item.data.sourceItem }
function isDerivedMove(item: any): item is K4Item<K4ItemType.move> { return item.type === K4ItemType.move && !isBaseMove(item) }
function isAdvantage(item: any): item is K4Item<K4ItemType.advantage> { return item.type === K4ItemType.advantage }
function isDisadvantage(item: any): item is K4Item<K4ItemType.disadvantage> { return item.type === K4ItemType.disadvantage }
function isDarkSecret(item: any): item is K4Item<K4ItemType.darksecret> { return item.type === K4ItemType.darksecret }
function isRelation(item: any): item is K4Item<K4ItemType.relation> { return item.type === K4ItemType.relation }
function isWeapon(item: any): item is K4Item<K4ItemType.weapon> { return item.type === K4ItemType.weapon }
function isGear(item: any): item is K4Item<K4ItemType.gear> { return item.type === K4ItemType.gear }
function isAttack(item: any): item is K4Item<K4ItemType.attack> { return item.type === K4ItemType.attack }

export default class K4PCSheet extends ActorSheet<K4PCSheet.Options, K4PCSheet.Data> {

	override async getData() {
		const data = await super.getData();
		data.actorData = data.data;
		data.baseMoves = this.actor.items.filter(isBaseMove).sort((a, b) => (((a.name ?? "") > (b.name ?? "")) ? 1 : -1));
		data.derivedMoves = this.actor.items.filter(isDerivedMove);
		data.advantages = this.actor.items.filter(isAdvantage);
		data.disadvantages = this.actor.items.filter(isDisadvantage);
		data.darksecrets = this.actor.items.filter(isDarkSecret);
		data.relations = this.actor.items.filter(isRelation);
		data.weapons = this.actor.items.filter(isWeapon);
		data.gear = this.actor.items.filter(isGear);
		data.attacks = this.actor.items.filter(isAttack);
		console.log(data);
		return data;
	}

}

namespace K4PCSheet {
	export interface Options extends ActorSheet.Options { }

	export interface Data extends ActorSheet.Data<K4PCSheet.Options> {
		baseMoves: Array<K4Item<K4ItemType.move>>;
		derivedMoves: Array<K4Item<K4ItemType.move>>;
		advantages: Array<K4Item<K4ItemType.advantage>>;
		disadvantages: Array<K4Item<K4ItemType.disadvantage>>;
		darksecrets: Array<K4Item<K4ItemType.darksecret>>;
		relations: Array<K4Item<K4ItemType.relation>>;
		weapons: Array<K4Item<K4ItemType.weapon>>;
		gear: Array<K4Item<K4ItemType.gear>>;
		attacks: Array<K4Item<K4ItemType.attack>>;

		actorData: ToObjectFalseType<K4Actor>
	}
}

// namespace K4PCSheet {

// 	export interface Options extends ActorSheet.Options { }

// 	export interface Data extends ActorSheet.Data<K4PCSheet.Options> {
// 		data: ConstructorParameters<typeof K4Actor>[0]
// 		item: any
// 		moves: K4Item<K4ItemType.move>[]

// 	}

// }