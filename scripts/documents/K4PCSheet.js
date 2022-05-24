import { K4ItemType } from "./K4Item.js";
function isBaseMove(item) { return item.type === K4ItemType.move && !item.data.sourceItem; }
function isDerivedMove(item) { return item.type === K4ItemType.move && !isBaseMove(item); }
function isAdvantage(item) { return item.type === K4ItemType.advantage; }
function isDisadvantage(item) { return item.type === K4ItemType.disadvantage; }
function isDarkSecret(item) { return item.type === K4ItemType.darksecret; }
function isRelation(item) { return item.type === K4ItemType.relation; }
function isWeapon(item) { return item.type === K4ItemType.weapon; }
function isGear(item) { return item.type === K4ItemType.gear; }
function isAttack(item) { return item.type === K4ItemType.attack; }
export default class K4PCSheet extends ActorSheet {
    async getData() {
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
// namespace K4PCSheet {
// 	export interface Options extends ActorSheet.Options { }
// 	export interface Data extends ActorSheet.Data<K4PCSheet.Options> {
// 		data: ConstructorParameters<typeof K4Actor>[0]
// 		item: any
// 		moves: K4Item<K4ItemType.move>[]
// 	}
// }