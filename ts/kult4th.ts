import K4Actor from "./documents/K4Actor.js";
import K4Item from "./documents/K4Item.js";
import K4ItemSheet from "./documents/K4ItemSheet.js";
import K4PCSheet from "./documents/K4PCSheet.js";
import K4NPCSheet from "./documents/K4NPCSheet.js";
import C from "./scripts/constants.js";
import U from "./scripts/utilities.js";
import {formatStringForKult, HandlebarHelpers} from "./scripts/helpers.js";

// ts-expect-error Just until I get the compendium data migrated
// import BUILD_ITEM_DATA, {EXTRACT_ALL_ITEMS, INTERMEDIATE_MIGRATE_DATA, CHECK_DATA_JSON} from "../scripts/jsonImport.mjs";
// import MIGRATE_ITEM_DATA, {ItemMigrationData, cleanData, toDict, GROUPED_DATA} from "../kult4eoverrides/migratorts";
import ITEM_DATA, {resetItems} from "./scripts/migratedData.js";
import gsap from "gsap/all";

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
		"systems/kult4th/templates/sheets/pc-sheet.hbs",
		"systems/kult4th/templates/sheets/pc-sheet-copy.hbs",
		"systems/kult4th/templates/sheets/npc-sheet.hbs",

		"systems/kult4th/templates/sheets/move-sheet.hbs",
		"systems/kult4th/templates/sheets/advantage-sheet.hbs",
		"systems/kult4th/templates/sheets/disadvantage-sheet.hbs",
		"systems/kult4th/templates/sheets/darksecret-sheet.hbs",
		"systems/kult4th/templates/sheets/weapon-sheet.hbs",
		"systems/kult4th/templates/sheets/relation-sheet.hbs",
		"systems/kult4th/templates/sheets/gear-sheet.hbs",
		/*DEVCODE*/"systems/kult4th/templates/debug/template-entry.hbs",/*!DEVCODE*/

		"systems/kult4th/templates/partials/basic-move-card.hbs",
		"systems/kult4th/templates/partials/derived-move-card.hbs",
		"systems/kult4th/templates/partials/attack-card.hbs",
		"systems/kult4th/templates/partials/advantage-card.hbs",
		"systems/kult4th/templates/partials/disadvantage-card.hbs",
		"systems/kult4th/templates/partials/dark-secret-card.hbs",
		"systems/kult4th/templates/partials/relation-card.hbs",
		"systems/kult4th/templates/partials/attribute-box.hbs",
		"systems/kult4th/templates/partials/roll-result-entry.hbs",
		"systems/kult4th/templates/partials/derived-item-summary.hbs"
	]);

	Object.entries(HandlebarHelpers).forEach(([name, func]) => Handlebars.registerHelper(String(name), func as Handlebars.HelperDelegate));

	console.log("HANDLEBARS", Handlebars);

	Object.assign(globalThis, {
		gsap,
		U,
		C,
		resetItems,
		formatStringForKult,
		formatForKult: HandlebarHelpers.formatForKult
	});
});

Hooks.once("ready", async () => {
	const ACTOR = game.actors?.values().next().value as K4Actor;
	const ITEM = game.items?.values().next().value as K4Item<K4ItemType>;
	const EMBED = ACTOR.items?.values().next().value as K4Item<K4ItemType>;
	const ACTORSHEET = ACTOR.sheet as unknown as K4PCSheet;
	const ITEMSHEET = ITEM.sheet as unknown as K4ItemSheet<K4ItemType>;
	const EMBEDSHEET = EMBED.sheet as unknown as K4ItemSheet<K4ItemType>;

	Object.assign(globalThis, {
		ACTOR, ITEM, EMBED, ACTORSHEET, ITEMSHEET, EMBEDSHEET,
		ENTITIES: [ACTOR, ITEM, EMBED],
		SHEETS: [ACTORSHEET, ITEMSHEET, EMBEDSHEET],
		DOCS: [ACTOR, ITEM, EMBED, ACTORSHEET, ITEMSHEET, EMBEDSHEET]
	});

	// #region ████████ TinyMCE Config: Configuring TinyMCE Instances with Custom Styles ████████ ~
	// CONFIG.TinyMCE.plugins += " searchreplace preview template";
	// CONFIG.TinyMCE.toolbar += " | searchreplace template";
	CONFIG.TinyMCE.style_formats = [
		{
			title: "Headings",
			items: [
				{title: "Heading 1", block: "h1", wrapper: false},
				{title: "Heading 2", block: "h2", wrapper: false},
				{title: "Heading 3", block: "h3", wrapper: false},
				{title: "Heading 4", block: "h4", wrapper: false}
			]
		},
		{
			title: "Block",
			items: [
				{title: "Paragraph", block: "p", wrapper: true}
			]
		},
		{
			title: "Inline",
			items: [
				{title: "Bold", inline: "strong", wrapper: false},
				{title: "Extra Bold", inline: "strong", classes: "text-extra-bold", wrapper: false},
				{title: "Italics", inline: "em", wrapper: false}
			]
		},
		{
			title: "Rules",
			items: [
				{title: "Trigger", inline: "em", classes: "text-trigger", wrapper: false},
				{title: "Keyword", inline: "strong", classes: "text-keyword", wrapper: false},
				{title: "Move Name", inline: "em", classes: "text-keyword text-movename", wrapper: false}
			]
		}
	];
	CONFIG.TinyMCE.skin = "Kult4th";
	CONFIG.TinyMCE.skin_url = "systems/kult4th/css/tinymce/ui/Kult4th";
	CONFIG.TinyMCE.style_formats_merge = false;
	// CONFIG.TinyMCE.template_selected_content_classes += " ws-contents";
	// CONFIG.TinyMCE.templates = CONFIG.TinyMCE.templates ?? [];
	// CONFIG.TinyMCE.templates.push(
	// 		{
	// 				title: 'Sidebar',
	// 				description: 'A World Smiths sidebar',
	// 				content: '<section class="ws-sidebar-group"><main><p></p></main><aside class="ws-block sidebar"><h3></h3><p class="ws-contents">{$contents}</p></aside></section>'
	// 		},
	// 		{
	// 				title: 'Note',
	// 				description: 'A World Smiths note',
	// 				content: `<section class="ws-block note"><img src="worlds/${game.world.data.name}/styles/ws.svg" width="48" /> <div class="contents"><h3></h3><p class="ws-contents">{$contents}</p></div></section>`
	// 		});
	if (typeof CONFIG.TinyMCE.content_css === "string") {
		CONFIG.TinyMCE.content_css = [CONFIG.TinyMCE.content_css];
	} else if (!Array.isArray(CONFIG.TinyMCE.content_css)) {
		CONFIG.TinyMCE.content_css = [];
	}
	// CONFIG.TinyMCE.content_css.unshift("dark");
	CONFIG.TinyMCE.content_css.push("systems/kult4th/css/tmce-editor.css");
	// #endregion ▄▄▄▄▄ TinyMCE Config ▄▄▄▄▄

});