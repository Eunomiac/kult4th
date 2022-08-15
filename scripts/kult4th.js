import K4Actor from "./documents/K4Actor.js";
import K4Item from "./documents/K4Item.js";
import K4ItemSheet from "./documents/K4ItemSheet.js";
import K4PCSheet from "./documents/K4PCSheet.js";
import K4NPCSheet from "./documents/K4NPCSheet.js";
import K4ActiveEffect from "./documents/K4ActiveEffect.js";
import C from "./scripts/constants.js";
import U from "./scripts/utilities.js";
import { formatStringForKult, HandlebarHelpers } from "./scripts/helpers.js";
import registerSettings, { initTinyMCEStyles, initCanvasStyles } from "./scripts/settings.js";
// ts-expect-error Just until I get the compendium data migrated
// import BUILD_ITEM_DATA, {EXTRACT_ALL_ITEMS, INTERMEDIATE_MIGRATE_DATA, CHECK_DATA_JSON} from "../scripts/jsonImport.mjs";
// import MIGRATE_ITEM_DATA, {ItemMigrationData, cleanData, toDict, GROUPED_DATA} from "../kult4eoverrides/migratorts";
import { resetItems } from "./scripts/migratedData.js";
import gsap, { MorphSVGPlugin } from "/scripts/greensock/esm/all.js";
import K4ChatMessage from "./documents/K4ChatMessage.js";
gsap.registerPlugin(MorphSVGPlugin);
Hooks.once("init", async () => {
    console.log(U.loc("kult4th.system.prompts.systemInit"));
    registerSettings();
    initCanvasStyles();
    initTinyMCEStyles();
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
    loadTemplates([
        ...U.getTemplatePath("globals", [
            "svg-defs"
        ]),
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
            "form-header",
            "hover-strip",
            "hover-strip-editable",
            "item-list",
            "rules-block",
            "roll-result",
            "attribute-box",
            "svg",
            "nav-frame",
            "toggle-box"
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
    // #region ████████ SVG DEFS: Create Style Definitions for SVG Files ████████ ~
    const svgDefTemplate = await getTemplate(U.getTemplatePath("globals", "svg-defs"));
    const svgDefs = {};
    $(".vtt.game.system-kult4th").append(svgDefTemplate(svgDefs));
    // #endregion ▄▄▄▄▄ SVG DEFS ▄▄▄▄▄
    Object.entries(HandlebarHelpers).forEach(([name, func]) => Handlebars.registerHelper(String(name), func));
});
/*DEVCODE*/
Hooks.once("ready", async () => {
    const ACTOR = game.actors?.values().next().value;
    const ITEM = game.items?.values().next().value;
    const EMBED = ACTOR.items?.values().next().value;
    const ACTORSHEET = ACTOR.sheet;
    const ITEMSHEET = ITEM.sheet;
    const EMBEDSHEET = EMBED.sheet;
    Object.assign(globalThis, {
        gsap,
        MorphSVGPlugin,
        U,
        C,
        resetItems,
        formatStringForKult,
        formatForKult: HandlebarHelpers.formatForKult,
        ACTOR, ITEM, EMBED, ACTORSHEET, ITEMSHEET, EMBEDSHEET,
        ENTITIES: [ACTOR, ITEM, EMBED],
        SHEETS: [ACTORSHEET, ITEMSHEET, EMBEDSHEET],
        DOCS: [ACTOR, ITEM, EMBED, ACTORSHEET, ITEMSHEET, EMBEDSHEET]
    });
});
/*!DEVCODE*/ 
