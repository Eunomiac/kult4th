import K4Actor from "./documents/K4Actor.js";
import K4Item from "./documents/K4Item.js";
import K4ItemSheet from "./documents/K4ItemSheet.js";
import K4PCSheet from "./documents/K4PCSheet.js";
import K4NPCSheet from "./documents/K4NPCSheet.js";
import C from "./scripts/constants.js";
import U from "./scripts/utilities.js";
import {HandlebarHelpers} from "./scripts/helpers.js";

// ts-expect-error Just until I get the compendium data migrated
import BUILD_ITEM_DATA, {EXTRACT_ALL_ITEMS, INTERMEDIATE_MIGRATE_DATA, CHECK_DATA_JSON} from "../scripts/jsonImport.mjs";
import MIGRATE_ITEM_DATA, {ItemMigrationData} from "./scripts/migration/migrator.js";
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

		"systems/kult4th/templates/sheets/move-sheet.hbs",
		"systems/kult4th/templates/sheets/advantage-sheet.hbs",
		"systems/kult4th/templates/sheets/disadvantage-sheet.hbs",
		"systems/kult4th/templates/sheets/darksecret-sheet.hbs",
		"systems/kult4th/templates/sheets/weapon-sheet.hbs",
		"systems/kult4th/templates/sheets/relation-sheet.hbs",
		"systems/kult4th/templates/sheets/gear-sheet.hbs",
		/*DEVCODE*/"systems/kult4th/templates/debug/template-entry.hbs",/*!DEVCODE*/

		"systems/kult4th/templates/partials/basic-move-card.hbs",
		"systems/kult4th/templates/partials/attribute-box.hbs"
	]);

	Object.entries(HandlebarHelpers).forEach(([name, func]) => Handlebars.registerHelper(String(name), func));

	console.log("HANDLEBARS", Handlebars);

	Object.assign(globalThis, {
		gsap,
		getAllData: EXTRACT_ALL_ITEMS,
		refreshJson: INTERMEDIATE_MIGRATE_DATA,
		checkData: CHECK_DATA_JSON,
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
				weapon: "Weapons"/*DEVCODE*/,
				derived_move: "Derived Moves",
				derived_attack: "Derived Attacks"/*!DEVCODE*/
			};
			const itemFolders = {
				"Advantages": C.Colors["GOLD -1"],
				"Disadvantages": C.Colors["GOLD -2"],
				"Basic Player Moves": C.Colors["GOLD -1"],
				"Dark Secrets": C.Colors["GOLD -2"],
				"Weapons": C.Colors["GOLD -1"]/*DEVCODE*/,
				"Derived Moves": C.Colors["GOLD -2"],
				"Derived Attacks": C.Colors["GOLD -1"]/*!DEVCODE*/
			};
			const FOLDERDATA = Object.entries(itemFolders).map(([folderName, folderColor]) => ({
				name: folderName,
				type: "Item" as const,
				sorting: "a" as const,
				color: folderColor
			}));
			await Folder.createDocuments(FOLDERDATA);

			// const ITEMDATA = await BUILD_ITEM_DATA();
			// ITEMDATA = ITEMDATA.filter((item: Record<string,unknown>) => item.type === "move");

			const MIGRATEDITEMDATA = MIGRATE_ITEM_DATA() // @ts-expect-error They fucked up
				.map((iData: ItemMigrationData) => Object.assign(iData, {folder: game.folders.getName(folderMap[iData.type as KeyOf<typeof folderMap>]).id}));

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

			// const items = await Item.createDocuments(MIGRATEDITEMDATA);
			// items.forEach((item) => {
			// 	// @ts-expect-error They fucked up
			// 	item.update({folder: game.folders.getName(folderMap[item.type]).id});
			// });
			/*DEVCODE*/
			const derivedMoveData = MIGRATEDITEMDATA.map((iData) => (iData.data.moves ?? [])
			// @ts-expect-error They fucked up
				.map((mData: ItemMigrationData) => Object.assign(mData, {folder: game.folders.getName(folderMap.derived_move).id}))).flat();
			const derivedAttackData = MIGRATEDITEMDATA.map((iData) => (iData.data.attacks ?? [])
			// @ts-expect-error They fucked up
				.map((aData: ItemMigrationData) => Object.assign(aData, {folder: game.folders.getName(folderMap.derived_attack).id}))).flat();

			await Item.createDocuments([
				...MIGRATEDITEMDATA,
				...derivedMoveData,
				...derivedAttackData
			]);
			/*!DEVCODE*/
		}
	});
});

Hooks.once("ready", async () => {
	const isResetting = false;
	if (isResetting) {
	// @ts-expect-error They fucked up
		resetItems();
	}
});