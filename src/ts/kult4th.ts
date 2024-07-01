// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import "../scss/style.scss";

import K4Config from "./scripts/config.js";
import K4Actor, {K4ActorType} from "./documents/K4Actor.js";
import K4Item, {K4ItemType} from "./documents/K4Item.js";
import K4ItemSheet from "./documents/K4ItemSheet.js";
import K4PCSheet from "./documents/K4PCSheet.js";
import K4NPCSheet from "./documents/K4NPCSheet.js";
import K4ActiveEffect from "./documents/K4ActiveEffect.js";
import C, {getContrastingColor} from "./scripts/constants.js";
import U from "./scripts/utilities.js";
import {formatStringForKult, registerHandlebarHelpers} from "./scripts/helpers.js";
import registerSettings, {initTinyMCEStyles, initCanvasStyles} from "./scripts/settings.js";
import registerDebugger from "./scripts/logger.js";

import InitializeLibraries, {gsap} from "./libraries.js";
import K4ChatMessage from "./documents/K4ChatMessage.js";
import BUILD_ITEMS_FROM_DATA, {PACKS, getUniqueValuesForSystemKey, getItemSystemReport, getSubItemSystemReport, getMutationDiffReport, findRepresentativeSubset, checkSubsetCoverage, findUniqueKeys} from "./scripts/data.js";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

registerDebugger();

Hooks.once("init", async () => {
  // Register settings (including debug settings necessary for kLog)
  registerSettings();
  // Announce initialization process in console
  kLog.display("Initializing 'Kult: Divinity Lost 4th Edition' for Foundry VTT", 0);
  // Disable Compatibility Warnings
  CONFIG.compatibility.mode = 0;
  // Initialize Libraries
  InitializeLibraries();

  // PreInitialize all classes that have a PreInitialize method
  [K4Actor, K4PCSheet, K4NPCSheet, K4Item, K4ItemSheet, K4ChatMessage, K4ActiveEffect]
    .filter((doc): doc is typeof doc & { PreInitialize: () => Promise<void> } => "PreInitialize" in doc)
    .forEach((doc) => {
      kLog.display(`PreInitializing ${doc.name}...`, 0);
      doc.PreInitialize().then(() => kLog.display(`PreInitialized ${doc.name}.`)).catch(kLog.error);
    });

  // Define the "K4" namespace within the CONFIG object, and assign basic system configuration package.
  CONFIG.K4 = K4Config;

  // Register Handlebar Helpers
  registerHandlebarHelpers();

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("kult4th", K4PCSheet, {makeDefault: true});
  Actors.registerSheet("kult4th", K4NPCSheet, {makeDefault: true, types: [K4ActorType.npc] });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("kult4th", K4ItemSheet, {makeDefault: true});

  await preloadTemplates().catch(kLog.error);

  // #region ████████ STYLING: Create Style Definitions for SVG Files & Color Palette ████████ ~
  const svgDefTemplate = await getTemplate(U.getTemplatePath("globals", "svg-defs"));
  interface SVGGradientStopParams {
    offset: number,
    color: string,
    opacity: number
  }
  type SVGGradientStop = SVGGradientStopParams & Record<string, number|string>;
  interface SVGGradientDef {
    id: string,
    x: [number, number],
    y: [number, number],
    stops: Array<SVGGradientStop | string>
  }
  interface GradientDef { fill: Partial<SVGGradientDef>; stroke: Partial<SVGGradientDef>; }

  const svgDefs: Record<string, Array<Partial<SVGGradientDef>>> = {
    linearGradients: Object.values(U.objMap(
      {
        gold: {
          fill: {
            stops: [C.Colors.gGOLD, C.Colors.GOLD]
          },
          stroke: {
            stops: [C.Colors.dGREY, C.Colors.dBLACK]
          }
        },
        red: {
          fill: {
            stops: [C.Colors.bRED, C.Colors.dRED]
          },
          stroke: {
            stops: [C.Colors.bGOLD, C.Colors.dGOLD]
          }
        },
        grey: {
          fill: {
            stops: [C.Colors.bGREY, C.Colors.dGREY]
          },
          stroke: {
            stops: [C.Colors.dBLACK, C.Colors.dBLACK]
          }
        },
        blue: {
          fill: {
            stops: [C.Colors.bBLUE, C.Colors.dBLUE]
          },
          stroke: {
            stops: [C.Colors.bGOLD, C.Colors.dGOLD]
          }
        },
        black: {
          fill: {
            stops: [C.Colors.dBLACK, C.Colors.dBLACK],
          },
          stroke: {
            stops: [C.Colors.BLACK, C.Colors.BLACK]
          }
        },
        white: {
          fill: {
            stops: [C.Colors.bWHITE, C.Colors.WHITE],
          },
          stroke: {
            stops: [C.Colors.BLACK, C.Colors.dBLACK]
          }
        },
        [K4ItemType.advantage]: {
          fill: {
            stops: [C.Colors.bGOLD, C.Colors.dGOLD]
          },
          stroke: {
            stops: [C.Colors.GOLD, C.Colors.dGOLD]
          }
        },
        [K4ItemType.darksecret]: {
          fill: {
            stops: [C.Colors.dRED, C.Colors.dRED]
          },
          stroke: {
            stops: [C.Colors.bRED, C.Colors.RED]
          }
        },
        [K4ItemType.disadvantage]: {
          fill: {
            stops: [C.Colors.GREY, C.Colors.BLACK]
          },
          stroke: {
            stops: [C.Colors.WHITE, C.Colors.bGREY]
          }
        },
        // [K4ItemType.gear]: {
        //   fill: {
        //     stops: [C.Colors["bGOLD"], C.Colors["dGOLD"]]
        //   },
        //   stroke: {
        //     stops: [C.Colors.GOLD, C.Colors["dGOLD"]]
        //   }
        // },
        [K4ItemType.move]: {
          fill: {
            stops: [C.Colors.GOLD, C.Colors.dGOLD]
          },
          stroke: {
            stops: [C.Colors.bGOLD, C.Colors.bGOLD]
          }
        },
        // [K4ItemType.relation]: {
        //   fill: {
        //     stops: [C.Colors["bGOLD"], C.Colors["dGOLD"]]
        //   },
        //   stroke: {
        //     stops: [C.Colors.GOLD, C.Colors["dGOLD"]]
        //   }
        // },
        [K4ItemType.weapon]: {
          fill: {
            stops: [C.Colors.bRED, C.Colors.dRED]
          },
          stroke: {
            stops: [C.Colors.RED, C.Colors.dRED]
          }
        }
      },
      (({fill, stroke}: GradientDef, iType: K4ItemType) => {
        return {
          fill: {
            id:    `fill-${iType}`,
            x:     [0, 1],
            y:     [0, 1],
            ...fill ?? {},
            stops: (fill.stops ?? []).map((stop, i, stops) => {
              return ({
                offset:  U.pInt(100 * (i / (Math.max(stops.length - 1, 0)))),
                color:   typeof stop === "string" ? stop : stop.color,
                opacity: 1,
                ...(typeof stop === "string" ? {} : stop)
              });
            }),
            ...(typeof fill.stops === "string"
              ? {}
              : fill.stops)
          },
          stroke: {
            id:    `stroke-${iType}`,
            x:     [0, 1],
            y:     [0, 1],
            ...stroke ?? {},
            stops: (stroke.stops ?? []).map((stop, i, stops) => {
              return {
                offset:  U.pInt(100 * (i / (Math.max(stops.length - 1, 0)))),
                color:   typeof stop === "string" ? stop : stop.color,
                opacity: 1,
                ...(typeof stop === "string" ? {} : stop)
              };
            }),
            ...(typeof stroke.stops === "string"
              ? {}
              : stroke.stops)
          }
        };
      }) as mapFunc<valFunc<unknown, GradientDef>, unknown, GradientDef>
    ) as Record<
      K4ItemType,
      {
        fill: Partial<SVGGradientDef>,
        stroke: Partial<SVGGradientDef>
      }
    >).map((defs) => Object.values(defs)).flat()
  };
  kLog.log("SVG DEFS", svgDefs);
  $(".vtt.game.system-kult4th").prepend(svgDefTemplate(svgDefs));

  const colorDefTemplate = await getTemplate(U.getTemplatePath("globals", "color-defs"));
  $(".vtt.game.system-kult4th").prepend(colorDefTemplate({colors: C.Colors, colorFilters: C.ColorFilters}));
  // #endregion ▄▄▄▄▄ STYLING ▄▄▄▄▄
});


Hooks.once("ready", () => {
  // $("body").removeClass("system-kult4th");

  // If user is GM, add "gm-user" class to #interface
  if (game.user?.isGM) {
    $("#interface").addClass("gm-user");
  }

  initCanvasStyles();
  initTinyMCEStyles();

  /*DEVCODE*/
  const ACTOR = game.actors?.values().next().value as Maybe<K4Actor>;
  const ITEM = game.items?.values().next().value as Maybe<K4Item>;
  const EMBED = ACTOR?.items?.values().next().value as Maybe<K4Item>;
  const ACTORSHEET = ACTOR?.sheet;

  Object.assign(globalThis, {
    gsap,
    // MorphSVGPlugin,
    U,
    C,
    K4Actor,
    K4Item,
    ActorSheet,
    K4PCSheet,
    getContrastingColor,
    formatStringForKult,
    ACTOR, ITEM, EMBED, ACTORSHEET,
    ENTITIES:   [ACTOR, ITEM, EMBED],
    PACKS,
    getItemSystemReport,
    getSubItemSystemReport,
    getUniqueValuesForSystemKey,
    getUniqueEffects: () => {
      return getUniqueValuesForSystemKey(PACKS.all, "rules.effects")
    },
    getMutationDiffReport,
    findRepresentativeSubset,
    checkSubsetCoverage,
    findUniqueKeys,
    BUILD_ITEMS_FROM_DATA
  });
  /*!DEVCODE*/
});

async function preloadTemplates() {
  const templatePaths = [
    ...U.getTemplatePath("globals", [
      "svg-defs",
      "color-defs"
    ]),
    ...U.getTemplatePath("sheets", [
      "pc-sheet",
      "npc-sheet",
      "item-sheet",
      "active-effect-sheet"
    ]),
    ...U.getTemplatePath("components", [
      "hover-strip",
      "item-list",
      "rules-block",
      "roll-result",
      "attribute-box",
      "pc-header",
      "pc-nav-menu",
      "svg",
      "icon",
      "toggle-box",
      "edges-blade-container",
      "stability-shards-overlay",
      "modifier-toggle"
    ]),
    ...U.getTemplatePath("partials", [
      "item-block",
      "subitem-block"
    ]),
    ...U.getTemplatePath("sidebar", [
      "chat-message",
      "result-attribute",
      "result-rolled",
      "result-static",
      "chat-input-control-panel"
    ]),
    ...U.getTemplatePath("dialog", [
      "ask-for-attribute",
      "ask-for-harm",
      "ask-for-text",
      "ask-for-buttons",
      "ask-for-confirm"
    ])
  ];

  return loadTemplates(templatePaths);
}