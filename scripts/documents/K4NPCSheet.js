export default class K4NPCSheet extends ActorSheet {
    get template() { return "systems/kult4th/templates/sheets/npc-sheet.hbs"; }
    getData() {
        const data = super.getData();
        // data.moves = data.items.filter((item) => ["move", "advantage", "disadvantage", "darksecret", "relation"].includes(item.type) );
        return data;
    }
}