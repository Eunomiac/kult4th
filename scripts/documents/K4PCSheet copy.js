// namespace K4PCSheet {
// 	export interface Data<Options> extends ActorSheet.Data<ActorSheet.Options> {
// 		items: Partial<Item>[]
// 		moves?: Array<K4Item<K4ItemType.move>>
// 	}
// }
export default class K4PCSheet extends ActorSheet {
    async getData() {
        const data = await super.getData();
        const actorData = data.data;
        data.item = actorData;
        data.moves = data.items.filter((item) => item.type === "move");
        data.moves = data.moves.sort((a, b) => ((a.name > b.name) ? 1 : -1));
        data.advantages = data.items.filter((item) => { return item.type == "advantage"; });
        data.disadvantages = data.items.filter((item) => { return item.type == "disadvantage"; });
        data.darksecrets = data.items.filter((item) => { return item.type == "darksecret"; });
        data.relationships = data.items.filter((item) => { return item.type == "relationship"; });
        data.weapons = data.items.filter((item) => { return item.type == "weapon"; });
        data.gear = data.items.filter((item) => { return item.type == "gear"; });
        data.wounds = getWounds(data.actor);
        console.log(data);
        return data;
    }
}