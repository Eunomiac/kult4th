import K4Actor from "./documents/K4Actor.js";
import K4Item from "./documents/K4Item.js";
import K4ItemSheet from "./documents/K4ItemSheet.js";
import K4PCSheet from "./documents/K4PCSheet.js";
import K4NPCSheet from "./documents/K4NPCSheet.js";
// ts-expect-error Just until I get the compendium data migrated
import BUILD_ITEM_DATA from "../scripts/jsonImport.mjs";
import gsap from "/scripts/greensock/esm/all.js";
// Oh shit go to https://kult.tools/npcGen/ and copy their cool blur effect from the Bookmark button (top left) for the character sheet!
Hooks.once("init", () => {
    console.log("Initializing Kult 4E");
    CONFIG.Actor.documentClass = K4Actor;
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("kult4th", K4PCSheet, { makeDefault: true });
    Actors.registerSheet("kult4th", K4NPCSheet, { makeDefault: false });
    CONFIG.Item.documentClass = K4Item;
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("kult4th", K4ItemSheet, { makeDefault: true });
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
                disadvantage: "Disadvantages",
                move: "Moves",
                weapon: "Weapons",
                darksecret: "Dark Secrets"
            };
            const itemFolders = {
                "Advantages": "#4d4023",
                "Disadvantages": "#520000",
                "Moves": "#000000",
                "Weapons": "#FF0000",
                "Dark Secrets": "#6d00a8"
            };
            const FOLDERDATA = Object.entries(itemFolders).map(([folderName, folderColor]) => ({
                name: folderName,
                type: "Item",
                sorting: "a",
                color: folderColor
            }));
            const folders = await Folder.createDocuments(FOLDERDATA);
            let ITEMDATA = await BUILD_ITEM_DATA();
            ITEMDATA = ITEMDATA.filter((item) => item.type === "move");
            const items = await Item.createDocuments(ITEMDATA);
            items.forEach((item) => {
                // @ts-expect-error They fucked up
                item.update({ folder: game.folders.getName(folderMap[item.type]).id });
            });
        }
    });
});
Hooks.once("ready", async () => {
    // @ts-expect-error They fucked up
    resetItems();
});
