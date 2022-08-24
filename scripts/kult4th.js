import K4Actor from "./documents/K4Actor.js";
import K4Item from "./documents/K4Item.js";
import K4ItemSheet from "./documents/K4ItemSheet.js";
import K4PCSheet from "./documents/K4PCSheet.js";
import K4NPCSheet from "./documents/K4NPCSheet.js";
import K4ActiveEffect from "./documents/K4ActiveEffect.js";
import C, { getContrastingColor } from "./scripts/constants.js";
import U from "./scripts/utilities.js";
import { formatStringForKult, HandlebarHelpers } from "./scripts/helpers.js";
import registerSettings, { initTinyMCEStyles, initCanvasStyles } from "./scripts/settings.js";
// ts-expect-error Just until I get the compendium data migrated
// import BUILD_ITEM_DATA, {EXTRACT_ALL_ITEMS, INTERMEDIATE_MIGRATE_DATA, CHECK_DATA_JSON} from "../scripts/jsonImport.mjs";
// import MIGRATE_ITEM_DATA, {ItemMigrationData, cleanData, toDict, GROUPED_DATA} from "../kult4eoverrides/migratorts";
import { resetItems, extractPackData, analyzePackData } from "./scripts/migratedData.js";
import gsap, { MorphSVGPlugin } from "/scripts/greensock/esm/all.js";
import K4ChatMessage from "./documents/K4ChatMessage.js";
gsap.registerPlugin(MorphSVGPlugin);
CONFIG.debug.hooks = true;
Hooks.once("init", async () => {
    registerSettings();
    console.log(U.loc("kult4th.system.prompts.systemInit"));
    Object.entries(HandlebarHelpers).forEach(([name, func]) => Handlebars.registerHelper(String(name), func));
    // console.log(game.i18n.format("kult4th.system.prompts.systemInit"));
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
            "svg-defs",
            "color-defs"
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
            "pc-header",
            "pc-nav-menu",
            "svg",
            "toggle-box"
        ]),
        ...U.getTemplatePath("partials", [
            "derived-item-summary",
            "derived-move",
            "pc-nav-menu-frame"
        ]),
        ...U.getTemplatePath("sidebar", [
            "chat-message",
            "roll-result"
        ]),
        ...U.getTemplatePath("dialog", [
            "ask-for-attribute"
        ])
    ]);
    // #region ████████ STYLING: Create Style Definitions for SVG Files & Color Palette ████████ ~
    const svgDefTemplate = await getTemplate(U.getTemplatePath("globals", "svg-defs"));
    const svgDefs = {
        linearGradients: Object.values(U.objMap({
            ["advantage" /* K4ItemType.advantage */]: {
                fill: {
                    stops: [C.Colors.bGOLD, C.Colors.dGOLD]
                },
                stroke: {
                    stops: [C.Colors.GOLD, C.Colors.dGOLD]
                }
            },
            ["attack" /* K4ItemType.attack */]: {
                fill: {
                    stops: [C.Colors.bRED, C.Colors.dRED]
                },
                stroke: {
                    stops: [C.Colors.RED, C.Colors.dRED]
                }
            },
            ["darksecret" /* K4ItemType.darksecret */]: {
                fill: {
                    stops: [C.Colors.dRED, C.Colors.dRED]
                },
                stroke: {
                    stops: [C.Colors.bRED, C.Colors.RED]
                }
            },
            ["disadvantage" /* K4ItemType.disadvantage */]: {
                fill: {
                    stops: [C.Colors.GREY, C.Colors.BLACK]
                },
                stroke: {
                    stops: [C.Colors.WHITE, C.Colors.bGREY]
                }
            },
            // [K4ItemType.gear]: {
            // 	fill: {
            // 		stops: [C.Colors["bGOLD"], C.Colors["dGOLD"]]
            // 	},
            // 	stroke: {
            // 		stops: [C.Colors.GOLD, C.Colors["dGOLD"]]
            // 	}
            // },
            ["move" /* K4ItemType.move */]: {
                fill: {
                    stops: [C.Colors.GOLD, C.Colors.dGOLD]
                },
                stroke: {
                    stops: [C.Colors.bGOLD, C.Colors.bGOLD]
                }
            },
            // [K4ItemType.relation]: {
            // 	fill: {
            // 		stops: [C.Colors["bGOLD"], C.Colors["dGOLD"]]
            // 	},
            // 	stroke: {
            // 		stops: [C.Colors.GOLD, C.Colors["dGOLD"]]
            // 	}
            // },
            ["weapon" /* K4ItemType.weapon */]: {
                fill: {
                    stops: [C.Colors.bRED, C.Colors.dRED]
                },
                stroke: {
                    stops: [C.Colors.RED, C.Colors.dRED]
                }
            }
        }, 
        // @ts-expect-error Damn map function needs to be resolved!
        ({ fill, stroke }, iType) => {
            const data = {
                fill: {
                    id: `fill-${iType}`,
                    x: [0, 1],
                    y: [0, 1],
                    ...fill ?? {},
                    stops: (fill.stops ?? []).map((stop, i, stops) => ({
                        offset: U.pInt(100 * (i / (Math.max(stops.length - 1, 0)))),
                        color: typeof stop === "string" ? stop : stop.color,
                        opacity: 1,
                        ...(U.isList(stop) ? stop : {})
                    })),
                    ...(typeof fill.stops === "string"
                        ? {}
                        : fill.stops)
                },
                stroke: {
                    id: `stroke-${iType}`,
                    x: [0, 1],
                    y: [0, 1],
                    ...stroke ?? {},
                    stops: (stroke.stops ?? []).map((stop, i, stops) => {
                        // U.dbLog(`Stroke-${iType}`, {stop, i, stops});
                        return {
                            offset: U.pInt(100 * (i / (Math.max(stops.length - 1, 0)))),
                            color: typeof stop === "string" ? stop : stop.color,
                            opacity: 1,
                            ...(U.isList(stop) ? stop : {})
                        };
                    }),
                    ...(typeof stroke.stops === "string"
                        ? {}
                        : stroke.stops)
                }
            };
            // U.dbLog(`fill-${iType} DATA`, data);
            return data;
        })).map((defs) => Object.values(defs)).flat()
    };
    // U.dbLog("SVG DEFS", svgDefs);
    $(".vtt.game.system-kult4th").prepend(svgDefTemplate(svgDefs));
    const colorDefTemplate = await getTemplate(U.getTemplatePath("globals", "color-defs"));
    $(".vtt.game.system-kult4th").prepend(colorDefTemplate({ colors: C.Colors }));
    // #endregion ▄▄▄▄▄ STYLING ▄▄▄▄▄
});
Hooks.once("ready", async () => {
    initCanvasStyles();
    initTinyMCEStyles();
    /*DEVCODE*/
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
        extractPackData,
        analyzePackData,
        getContrastingColor,
        formatStringForKult,
        formatForKult: HandlebarHelpers.formatForKult,
        ACTOR, ITEM, EMBED, ACTORSHEET, ITEMSHEET, EMBEDSHEET,
        ENTITIES: [ACTOR, ITEM, EMBED],
        SHEETS: [ACTORSHEET, ITEMSHEET, EMBEDSHEET],
        DOCS: [ACTOR, ITEM, EMBED, ACTORSHEET, ITEMSHEET, EMBEDSHEET]
    });
    /*!DEVCODE*/
});
