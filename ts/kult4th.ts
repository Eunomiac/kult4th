import K4Actor from "./documents/K4Actor.js";
import K4Item from "./documents/K4Item.js";
import K4ItemSheet from "./documents/K4ItemSheet.js";
import K4PCSheet from "./documents/K4PCSheet.js";
import K4NPCSheet from "./documents/K4NPCSheet.js";

// Oh shit go to https://kult.tools/npcGen/ and copy their cool blur effect from the Bookmark button (top left) for the character sheet!

Hooks.once("init", () => {
	console.log("Initializing Kult 4E");

	CONFIG.Actor.documentClass = K4Actor;
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("kult4th", K4PCSheet, {makeDefault: true});
	Actors.registerSheet("kult4th", K4NPCSheet, {makeDefault: false});

	CONFIG.Item.documentClass = K4Item;
	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("kult4th", K4ItemSheet, {makeDefault: true});

	loadTemplates([
		"systems/kult4th/templates/partials/move-card.hbs",
		"systems/kult4th/templates/partials/darksecret-card.hbs",
		"systems/kult4th/templates/partials/relationship-card.hbs",
		"systems/kult4th/templates/partials/weapon-card.hbs",
		"systems/kult4th/templates/partials/gear-card.hbs",
		"systems/kult4th/templates/partials/advantage-card.hbs",
		"systems/kult4th/templates/partials/disadvantage-card.hbs"
	]);
});
