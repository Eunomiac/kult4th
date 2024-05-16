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
import {formatStringForKult, registerHandlebarHelpers, registerHooks} from "./scripts/helpers.js";
import registerSettings, {initTinyMCEStyles, initCanvasStyles} from "./scripts/settings.js";
import registerDebugger from "./scripts/logger.js";

import {gsap} from "./libraries.js";
import K4ChatMessage from "./documents/K4ChatMessage.js";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

registerDebugger();
// gsap.registerPlugin(MorphSVGPlugin);

Hooks.once("init", async () => {

  // Disable Compatibility Warnings
  CONFIG.compatibility.mode = 0;

  registerSettings();
  kLog.display("Initializing 'Kult: Divinity Lost 4th Edition' for Foundry VTT", 0);

  CONFIG.K4 = K4Config;
  registerHandlebarHelpers();

  CONFIG.Actor.documentClass = K4Actor;
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("kult4th", K4PCSheet, {makeDefault: true});
  // Actors.registerSheet("kult4th", K4PCSheet, {makeDefault: true});
  Actors.registerSheet("kult4th", K4NPCSheet, {makeDefault: true, types: [K4ActorType.npc] });

  CONFIG.Item.documentClass = K4Item;
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("kult4th", K4ItemSheet, {makeDefault: true});

  // CONFIG.ActiveEffect.documentClass = K4ActiveEffect;

  CONFIG.ChatMessage.documentClass = K4ChatMessage;
  CONFIG.ChatMessage.template = U.getTemplatePath("sidebar", "chat-message");

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
  /*
<defs>
    <linearGradient id="fill-advantage" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="rgb(235, 219, 166)" stop-opacity="1"></stop>
      <stop offset="100%" stop-color="rgb(65, 61, 46)" stop-opacity="1"></stop>
    </linearGradient>
    <linearGradient id="stroke-advantage" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="rgb(150, 140, 106)" stop-opacity="1"></stop>
      <stop offset="100%" stop-color="rgb(65, 61, 46)" stop-opacity="1"></stop>
    </linearGradient>
    <linearGradient id="fill-attack" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="rgb(240, 50, 50)" stop-opacity="1"></stop>
      <stop offset="100%" stop-color="rgb(70, 14, 14)" stop-opacity="1"></stop>
    </linearGradient>
    <linearGradient id="stroke-attack" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="rgb(155, 32, 32)" stop-opacity="1"></stop>
      <stop offset="100%" stop-color="rgb(70, 14, 14)" stop-opacity="1"></stop>
    </linearGradient>
    <linearGradient id="fill-darksecret" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="rgb(70, 14, 14)" stop-opacity="1"></stop>
      <stop offset="100%" stop-color="rgb(70, 14, 14)" stop-opacity="1"></stop>
    </linearGradient>
    <linearGradient id="stroke-darksecret" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="rgb(240, 50, 50)" stop-opacity="1"></stop>
      <stop offset="100%" stop-color="rgb(155, 32, 32)" stop-opacity="1"></stop>
    </linearGradient>
    <linearGradient id="fill-disadvantage" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="rgb(128, 128, 128)" stop-opacity="1"></stop>
      <stop offset="100%" stop-color="rgb(29, 29, 29)" stop-opacity="1"></stop>
    </linearGradient>
    <linearGradient id="stroke-disadvantage" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="rgb(226, 226, 226)" stop-opacity="1"></stop>
      <stop offset="100%" stop-color="rgb(177, 177, 177)" stop-opacity="1"></stop>
    </linearGradient>
    <linearGradient id="fill-move" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="rgb(150, 140, 106)" stop-opacity="1"></stop>
      <stop offset="100%" stop-color="rgb(65, 61, 46)" stop-opacity="1"></stop>
    </linearGradient>
    <linearGradient id="stroke-move" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="rgb(235, 219, 166)" stop-opacity="1"></stop>
      <stop offset="100%" stop-color="rgb(235, 219, 166)" stop-opacity="1"></stop>
    </linearGradient>
    <linearGradient id="fill-weapon" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="rgb(240, 50, 50)" stop-opacity="1"></stop>
      <stop offset="100%" stop-color="rgb(70, 14, 14)" stop-opacity="1"></stop>
    </linearGradient>
    <linearGradient id="stroke-weapon" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="rgb(155, 32, 32)" stop-opacity="1"></stop>
      <stop offset="100%" stop-color="rgb(70, 14, 14)" stop-opacity="1"></stop>
    </linearGradient>
  </defs>
  */
  interface GradientDef { fill: Partial<SVGGradientDef>; stroke: Partial<SVGGradientDef>; }

  // // Use mapFunc and valFunc with GradientDef as the argument type
  // let myFunc: mapFunc<GradientDef, unknown, valFunc<GradientDef>>;

  // myFunc = ({fill, stroke}: GradientDef, iType?: Key) => {
  //   // ...
  // };

  const svgDefs: Record<string, Array<Partial<SVGGradientDef>>> = {
    linearGradients: Object.values(U.objMap(
      {
        [K4ItemType.advantage]: {
          fill: {
            stops: [C.Colors.bGOLD, C.Colors.dGOLD]
          },
          stroke: {
            stops: [C.Colors.GOLD, C.Colors.dGOLD]
          }
        },
        [K4ItemType.attack]: {
          fill: {
            stops: [C.Colors.bRED, C.Colors.dRED]
          },
          stroke: {
            stops: [C.Colors.RED, C.Colors.dRED]
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
  // kLog.log("SVG DEFS", svgDefs);
  $(".vtt.game.system-kult4th").prepend(svgDefTemplate(svgDefs));

  const colorDefTemplate = await getTemplate(U.getTemplatePath("globals", "color-defs"));
  $(".vtt.game.system-kult4th").prepend(colorDefTemplate({colors: C.Colors}));
  // #endregion ▄▄▄▄▄ STYLING ▄▄▄▄▄
});


Hooks.once("ready", () => {

  initCanvasStyles();
  initTinyMCEStyles();
  registerHooks();

  /*DEVCODE*/
  const ACTOR = game.actors?.values().next().value as K4Actor;
  const ITEM = game.items?.values().next().value as K4Item;
  const EMBED = ACTOR.items?.values().next().value as K4Item;
  const ACTORSHEET = ACTOR?.sheet;
  const ITEMSHEET = ITEM?.itemSheet;
  const EMBEDSHEET = EMBED?.itemSheet;

  Object.assign(globalThis, {
    gsap,
    // MorphSVGPlugin,
    U,
    C,
    ActorSheet,
    K4PCSheet,
    getContrastingColor,
    formatStringForKult,
    ACTOR, ITEM, EMBED, ACTORSHEET, ITEMSHEET, EMBEDSHEET,
    ENTITIES:   [ACTOR, ITEM, EMBED],
    SHEETS:     [ACTORSHEET, ITEMSHEET, EMBEDSHEET],
    DOCS:       [ACTOR, ITEM, EMBED, ACTORSHEET, ITEMSHEET, EMBEDSHEET]
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
      "pc-sheet", "pc-sheet-temp",
      "npc-sheet",
      "item-sheet",
      "attack-sheet"
    ]),
    ...U.getTemplatePath("components", [
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
      "item-block",
      "subitem-block"
    ]),
    ...U.getTemplatePath("sidebar", [
      "chat-message",
      "item-display",
      "result-attribute",
      "result-rolled",
      "result-static"
    ]),
    ...U.getTemplatePath("dialog", [
      "ask-for-attribute"
    ])
  ];

  return loadTemplates(templatePaths);
}