import { K4ItemType } from "./K4Item.js";
export default class K4Actor extends Actor {
    get items() { return super.items; }
    getItemsOfType(type) {
        return this.items.filter((item) => item.type === type);
    }
    get moves() { return this.getItemsOfType(K4ItemType.move); }
    get attacks() { return this.getItemsOfType(K4ItemType.attack); }
    get advantages() { return this.getItemsOfType(K4ItemType.advantage); }
    get disadvantages() { return this.getItemsOfType(K4ItemType.disadvantage); }
    get darkSecrets() { return this.getItemsOfType(K4ItemType.darksecret); }
    get weapons() { return this.getItemsOfType(K4ItemType.weapon); }
    get gear() { return this.getItemsOfType(K4ItemType.gear); }
    get relations() { return this.getItemsOfType(K4ItemType.relation); }
    get basicMoves() { return this.moves.filter((move) => !move.data.sourceItem); }
    get derivedMoves() { return this.moves.filter((move) => Boolean(move.data.sourceItem)); }
}
