import K4Actor from "./documents/K4Actor.js";
import K4Item from "./documents/K4Item.js";
import K4ItemSheet from "./documents/K4ItemSheet.js";
import K4PCSheet from "./documents/K4PCSheet.js";
import K4NPCSheet from "./documents/K4NPCSheet.js";
import C from "./scripts/constants.js";
import { HandlebarHelpers } from "./scripts/helpers.js";
// ts-expect-error Just until I get the compendium data migrated
// import BUILD_ITEM_DATA, {EXTRACT_ALL_ITEMS, INTERMEDIATE_MIGRATE_DATA, CHECK_DATA_JSON} from "../scripts/jsonImport.mjs";
import MIGRATE_ITEM_DATA from "./scripts/migration/migrator.js";
import ITEM_DATA from "./scripts/migration/migratedData.js";
import gsap from "/scripts/greensock/esm/all.js";
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
        "systems/kult4th/templates/sheets/move-sheet.hbs",
        "systems/kult4th/templates/sheets/advantage-sheet.hbs",
        "systems/kult4th/templates/sheets/disadvantage-sheet.hbs",
        "systems/kult4th/templates/sheets/darksecret-sheet.hbs",
        "systems/kult4th/templates/sheets/weapon-sheet.hbs",
        "systems/kult4th/templates/sheets/relation-sheet.hbs",
        "systems/kult4th/templates/sheets/gear-sheet.hbs",
        /*DEVCODE*/ "systems/kult4th/templates/debug/template-entry.hbs",
        "systems/kult4th/templates/partials/basic-move-card.hbs",
        "systems/kult4th/templates/partials/attribute-box.hbs"
    ]);
    Object.entries(HandlebarHelpers).forEach(([name, func]) => Handlebars.registerHelper(String(name), func));
    console.log("HANDLEBARS", Handlebars);
    Object.assign(globalThis, {
        gsap,
        resetItems: async () => {
            // @ts-expect-error They fucked up
            await Item.deleteDocuments(Array.from(game.items.values()).map((item) => item.id));
            // @ts-expect-error They fucked up
            await Folder.deleteDocuments(Array.from(game.folders.values()).map((folder) => folder.id));
            const folderNames = {
                "advantage": "Advantages",
                "move": "Basic Player Moves",
                "disadvantage": "Disadvantages",
                "darksecret": "Dark Secrets",
                "weapon": "Weapons",
                "active-rolled": "Active Rolled",
                "active-static": "Active Static",
                "passive": "Passive" /*DEVCODE*/,
                "derived_move": "Derived Moves",
                "derived_attack": "Derived Attacks" /*!DEVCODE*/
            };
            const folderMap = {
                advantage: {
                    "active-rolled": "",
                    "active-static": "",
                    "passive": ""
                },
                move: {
                    "active-rolled": "",
                    "active-static": "",
                    "passive": ""
                },
                disadvantage: {
                    "active-rolled": "",
                    "active-static": "",
                    "passive": ""
                },
                darksecret: {
                    "active-rolled": "",
                    "active-static": "",
                    "passive": ""
                },
                weapon: {
                    "active-rolled": "",
                    "active-static": "",
                    "passive": ""
                } /*DEVCODE*/,
                derived_move: {
                    "active-rolled": "",
                    "active-static": "",
                    "passive": ""
                },
                derived_attack: {
                    "active-rolled": "",
                    "active-static": "",
                    "passive": ""
                } /*!DEVCODE*/
            };
            const itemFolders = {
                "Advantages": C.Colors["GOLD -1"],
                "Disadvantages": C.Colors["GOLD -2"],
                "Basic Player Moves": C.Colors["GOLD -1"],
                "Dark Secrets": C.Colors["GOLD -2"],
                "Weapons": C.Colors["GOLD -1"] /*DEVCODE*/,
                "Derived Moves": C.Colors["GOLD -2"],
                "Derived Attacks": C.Colors["GOLD -1"] /*!DEVCODE*/
            };
            const subItemFolders = {
                "Active Rolled": C.Colors["RED -1"],
                "Active Static": C.Colors["RED -2"],
                "Passive": C.Colors["RED -1"]
            };
            const FOLDERDATA = Object.entries(itemFolders).map(([folderName, folderColor]) => ({
                name: folderName,
                type: "Item",
                sorting: "a",
                color: folderColor
            }));
            const folders = await Folder.createDocuments(FOLDERDATA);
            const SUBFOLDERDATA = [];
            folders.forEach((fData) => {
                const folderId = fData.id;
                const folderType = Object.keys(folderNames)[Object.values(folderNames).findIndex((fName) => fName === fData.name)];
                SUBFOLDERDATA.push(...Object.entries(subItemFolders).map(([subFolderName, subFolderColor]) => ({
                    name: subFolderName,
                    type: "Item",
                    sorting: "a",
                    color: subFolderColor,
                    parent: folderId
                })));
            });
            const subFolders = await Folder.createDocuments(SUBFOLDERDATA);
            subFolders.forEach((subFolder) => {
                const parentFolder = game.folders.get(subFolder.data.parent);
                const folderType = Object.keys(folderNames)[Object.values(folderNames).findIndex((fName) => fName === parentFolder.data.name)];
                const subFolderType = Object.keys(folderNames)[Object.values(folderNames).findIndex((fName) => fName === subFolder.data.name)];
                folderMap[folderType][subFolderType] = subFolder.id;
            });
            console.log("FOLDER MAP", folderMap);
            MIGRATE_ITEM_DATA();
            const MIGRATEDITEMDATA = Object.values(ITEM_DATA)
                .map((subTypeDict) => Object.values(subTypeDict))
                .flat()
                .map((v) => Object.values(v))
                .flat() // @ts-expect-error They fucked up
                .map((iData) => Object.assign(iData, { folder: game.folders.get(folderMap[iData.type][iData.data.subType]) }));
            console.log("MIGRATED DATA", MIGRATEDITEMDATA);
            const derivedItemData = MIGRATEDITEMDATA.map((iData) => iData.data.subItems ?? [])
                .flat() // @ts-expect-error They fucked up
                .map((iData) => Object.assign(iData, { folder: game.folders.get(folderMap[`derived_${iData.type}`][iData.data.subType]) }));
            console.log("DERIVED ITEMS", derivedItemData);
            // const MIGRATEDITEMDATA = MIGRATE_ITEM_DATA() // @ts-expect-error They fucked up
            // );
            /*DEVCODE*/
            // const derivedItemData = MIGRATEDITEMDATA.map((iData) => (iData.data.subItems ?? [])
            // // @ts-expect-error They fucked up
            // 	.map((mData: ItemMigrationData) => Object.assign(mData, {folder: game.folders.getName(folderMap.derived_move).id}))).flat();
            // const derivedAttackData = MIGRATEDITEMDATA.map((iData) => (iData.data.attacks ?? [])
            // // @ts-expect-error They fucked up
            // 	.map((aData: ItemMigrationData) => Object.assign(aData, {folder: game.folders.getName(folderMap.derived_attack).id}))).flat();
            await Item.createDocuments([
                ...MIGRATEDITEMDATA,
                ...derivedItemData
            ]);
            /*!DEVCODE*/
        }
    });
});
Hooks.once("ready", async () => {
    const isResetting = true;
    if (isResetting) {
        console.clear();
        // @ts-expect-error They fucked up
        resetItems();
    }
    // #region ████████ TinyMCE Config: Configuring TinyMCE Instances with Custom Styles ████████ ~
    // CONFIG.TinyMCE.plugins += " searchreplace preview template";
    // CONFIG.TinyMCE.toolbar += " | searchreplace template";
    CONFIG.TinyMCE.style_formats = [
        {
            title: "Headings",
            items: [
                { title: "Heading 1", block: "h1", wrapper: false },
                { title: "Heading 2", block: "h2", wrapper: false },
                { title: "Heading 3", block: "h3", wrapper: false },
                { title: "Heading 4", block: "h4", wrapper: false }
            ]
        },
        {
            title: "Block",
            items: [
                { title: "Paragraph", block: "p", wrapper: true }
            ]
        },
        {
            title: "Inline",
            items: [
                { title: "Bold", inline: "strong", wrapper: false },
                { title: "Extra Bold", inline: "strong", classes: "text-extra-bold", wrapper: false },
                { title: "Italics", inline: "em", wrapper: false }
            ]
        },
        {
            title: "Rules",
            items: [
                { title: "Trigger", inline: "em", classes: "text-trigger", wrapper: false },
                { title: "Keyword", inline: "strong", classes: "text-keyword", wrapper: false },
                { title: "Move Name", inline: "em", classes: "text-keyword text-movename", wrapper: false }
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
    }
    else if (!Array.isArray(CONFIG.TinyMCE.content_css)) {
        CONFIG.TinyMCE.content_css = [];
    }
    // CONFIG.TinyMCE.content_css.unshift("dark");
    CONFIG.TinyMCE.content_css.push("systems/kult4th/css/tmce-editor.css");
    // #endregion ▄▄▄▄▄ TinyMCE Config ▄▄▄▄▄
});
