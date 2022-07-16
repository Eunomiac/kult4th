import K4Actor from "./documents/K4Actor.js";
import K4Item from "./documents/K4Item.js";
import K4ItemSheet from "./documents/K4ItemSheet.js";
import K4PCSheet from "./documents/K4PCSheet.js";
import K4NPCSheet from "./documents/K4NPCSheet.js";
import K4ActiveEffect from "./documents/K4ActiveEffect.js";
import C from "./scripts/constants.js";
import U from "./scripts/utilities.js";
import { formatStringForKult, HandlebarHelpers } from "./scripts/helpers.js";
import registerSettings from "./scripts/settings.js";
// ts-expect-error Just until I get the compendium data migrated
// import BUILD_ITEM_DATA, {EXTRACT_ALL_ITEMS, INTERMEDIATE_MIGRATE_DATA, CHECK_DATA_JSON} from "../scripts/jsonImport.mjs";
// import MIGRATE_ITEM_DATA, {ItemMigrationData, cleanData, toDict, GROUPED_DATA} from "../kult4eoverrides/migratorts";
import { resetItems } from "./scripts/migratedData.js";
import gsap, { MorphSVGPlugin } from "/scripts/greensock/esm/all.js";
import K4ChatMessage from "./documents/K4ChatMessage.js";
gsap.registerPlugin(MorphSVGPlugin);
Hooks.once("init", () => {
    console.log("Initializing Kult 4E");
    registerSettings();
    CONFIG.Actor.documentClass = K4Actor;
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("kult4th", K4PCSheet, { makeDefault: true });
    Actors.registerSheet("kult4th", K4NPCSheet, { makeDefault: false });
    CONFIG.Item.documentClass = K4Item;
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("kult4th", K4ItemSheet, { makeDefault: true });
    CONFIG.ActiveEffect.documentClass = K4ActiveEffect;
    CONFIG.ChatMessage.documentClass = K4ChatMessage;
    CONFIG.ChatMessage.template = U.getTemplatePath("sidebar", "chat-message");
    // CONFIG.Dialog.documentClass = K4Dialog;
    // CONFIG.canvasTextStyle = new PIXI.TextStyle({
    // 	fontFamily: "AlverataSemiBold",
    // 	fontSize: 32,
    // 	fill: C.Colors["GOLD +1"],
    // 	stroke: C.Colors["GOLD -3"],
    // 	strokeThickness: 1,
    // 	dropShadow: true,
    // 	dropShadowColor: C.Colors.BLACK,
    // 	dropShadowBlur: 4,
    // 	dropShadowAngle: 0,
    // 	dropShadowDistance: 0,
    // 	align: "center",
    // 	wordWrap: false,
    // 	padding: 1
    // });
    CONFIG.canvasTextStyle = new PIXI.TextStyle({
        align: "center",
        dropShadow: true,
        dropShadowAngle: U.degToRad(45),
        dropShadowBlur: 8,
        dropShadowColor: C.Colors.BLACK,
        dropShadowDistance: 4,
        fill: [
            C.Colors["GOLD +2"],
            C.Colors.GOLD
        ],
        fillGradientType: 1,
        fillGradientStops: [
            0,
            0.3
        ],
        fontFamily: "AlverataSemiBold",
        fontSize: 32,
        letterSpacing: 2,
        lineHeight: 32,
        lineJoin: "round",
        padding: 4,
        stroke: C.Colors["GOLD -2"],
        strokeThickness: 3,
        trim: true,
        whiteSpace: "normal",
        wordWrap: true,
        wordWrapWidth: 0.1
    });
    CONFIG.fontFamilies = ["Alverata", "AlverataCaps", "Infidel", "Sokol"];
    CONFIG.defaultFontFamily = "Alverata";
    loadTemplates([
        ...U.getTemplatePath("sheets", [
            "pc-sheet",
            "npc-sheet",
            "move-sheet",
            "advantage-sheet",
            "disadvantage-sheet",
            "darksecret-sheet",
            "weapon-sheet",
            "relation-sheet",
            "gear-sheet"
        ]),
        ...U.getTemplatePath("components", [
            "svg-defs",
            "border-grid",
            "bg-grid",
            "form-header",
            "item-list",
            "rules-block",
            "roll-result",
            "attribute-box",
            "svg-flat",
            "svg-header-icon"
        ]),
        ...U.getTemplatePath("partials", [
            "basic-move-card",
            "derived-move-card",
            "attack-card",
            "advantage-card",
            "disadvantage-card",
            "dark-secret-card",
            "relation-card",
            "derived-item-summary"
        ]),
        ...U.getTemplatePath("sidebar", [
            "chat-message",
            "roll-result"
        ]),
        ...U.getTemplatePath("dialog", [
            "ask-for-attribute"
        ])
    ]);
    Object.entries(HandlebarHelpers).forEach(([name, func]) => Handlebars.registerHelper(String(name), func));
    console.log("HANDLEBARS", Handlebars);
    Object.assign(globalThis, {
        gsap,
        MorphSVGPlugin,
        U,
        C,
        resetItems,
        formatStringForKult,
        formatForKult: HandlebarHelpers.formatForKult
    });
});
Hooks.once("ready", async () => {
    const ACTOR = game.actors?.values().next().value;
    const ITEM = game.items?.values().next().value;
    const EMBED = ACTOR.items?.values().next().value;
    const ACTORSHEET = ACTOR.sheet;
    const ITEMSHEET = ITEM.sheet;
    const EMBEDSHEET = EMBED.sheet;
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
