import K4Item, {K4ItemType} from "./K4Item.js";

export default class K4Actor extends Actor {
	override get items() { return super.items as K4Collection.Item }

	getItemsOfType<T extends K4ItemType>(type: T): Array<K4Item<T>> {
		return this.items.filter((item): item is K4Item<T> => item.type === type);
	}

	get moves() { return this.getItemsOfType(K4ItemType.move) }
	get attacks() { return this.getItemsOfType(K4ItemType.attack) }
	get advantages() { return this.getItemsOfType(K4ItemType.advantage) }
	get disadvantages() { return this.getItemsOfType(K4ItemType.disadvantage) }
	get darkSecrets() { return this.getItemsOfType(K4ItemType.darksecret) }
	get weapons() { return this.getItemsOfType(K4ItemType.weapon) }
	get gear() { return this.getItemsOfType(K4ItemType.gear) }
	get relations() { return this.getItemsOfType(K4ItemType.relation) }

	get basicMoves() { return this.moves.filter((move) => !move.data.sourceItem) }
	get derivedMoves() { return this.moves.filter((move) => Boolean(move.data.sourceItem)) }
}