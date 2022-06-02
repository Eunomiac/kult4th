import K4Actor from "./documents/K4Actor.js";
import K4Item from "./documents/K4Item.js";
import K4ItemSheet from "./documents/K4ItemSheet.js";
import K4PCSheet from "./documents/K4PCSheet.js";
import K4NPCSheet from "./documents/K4NPCSheet.js";
import C from "./scripts/constants.js";
// ts-expect-error Just until I get the compendium data migrated
import BUILD_ITEM_DATA from "../scripts/jsonImport.mjs";
import MIGRATE_ITEM_DATA from "./scripts/migrator.js";
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
		"systems/kult4th/templates/sheets/npc-sheet.hbs",
		"systems/kult4th/templates/partials/basic-move-card.hbs",
		"systems/kult4th/templates/partials/attribute-box.hbs"
	]);

	Object.assign(globalThis, {
		gsap,
		resetItems: async () => {
			// @ts-expect-error They fucked up
			await Item.deleteDocuments(Array.from(game.items.values()).map((item) => item.id));
			// @ts-expect-error They fucked up
			await Folder.deleteDocuments(Array.from(game.folders.values()).map((folder) => folder.id));
			const folderMap = {
				advantage: "Advantages",
				move: "Basic Player Moves",
				disadvantage: "Disadvantages",
				darksecret: "Dark Secrets",
				weapon: "Weapons"
			};
			const itemFolders = {
				"Advantages": C.Colors["GOLD -1"],
				"Disadvantages": C.Colors["GOLD -2"],
				"Basic Player Moves": C.Colors["GOLD -1"],
				"Dark Secrets": C.Colors["GOLD -2"],
				"Weapons": C.Colors["GOLD -1"],
				"Attacks": C.Colors["GOLD -2"]
			};
			const FOLDERDATA = Object.entries(itemFolders).map(([folderName, folderColor]) => ({
				name: folderName,
				type: "Item" as const,
				sorting: "a" as const,
				color: folderColor
			}));
			const folders = await Folder.createDocuments(FOLDERDATA);

			const ITEMDATA = await BUILD_ITEM_DATA();
			// ITEMDATA = ITEMDATA.filter((item: Record<string,unknown>) => item.type === "move");

			const MIGRATEDITEMDATA = MIGRATE_ITEM_DATA(ITEMDATA);

			// const items: Array<K4Item<ItemType>> = [];
			// MIGRATEDITEMDATA.forEach(async (itemData) => {
			// 	console.log(`[${itemData.name}] Creating ...`, itemData);
			// 	// delete itemData._original;
			// 	// if (itemData.moves?.length) {
			// 	// itemData.moves = itemData.moves.map((move) => delete move._original);
			// 	// }
			// 	const [item] = await Item.createDocuments([itemData]);
			// 	items.push(item as K4Item<ItemType>);
			// });

			const items = await Item.createDocuments(MIGRATEDITEMDATA);
			items.forEach((item) => {
				// @ts-expect-error They fucked up
				item.update({folder: game.folders.getName(folderMap[item.type]).id});
			});
		}
	});
});

Hooks.once("ready", async () => {
	// @ts-expect-error They fucked up
	resetItems();
});