export default class K4NPCSheet extends ActorSheet {
	override get template() { return "systems/kult4th/templates/sheets/npc-sheet.hbs" }

	override getData(){
		const data = super.getData();
		// data.moves = data.items.filter((item) => ["move", "advantage", "disadvantage", "darksecret", "relation"].includes(item.type) );
		return data;
	}
}

