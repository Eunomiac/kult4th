// #region IMPORTS ~
import "../scss/style.scss";

import K4Config from "./scripts/config.js";
import K4Actor from "./documents/K4Actor.js";
import K4Item, {K4ItemType} from "./documents/K4Item.js";
import K4ItemSheet from "./documents/K4ItemSheet.js";
import K4PCSheet from "./documents/K4PCSheet.js";
import K4NPCSheet from "./documents/K4NPCSheet.js";
import K4ActiveEffect from "./documents/K4ActiveEffect.js";
import C, {getContrastingColor} from "./scripts/constants.js";
import InitializeTooltips from "./scripts/tooltips.js";
import U from "./scripts/utilities.js";
import {formatStringForKult, registerHandlebarHelpers as RegisterHandlebarHelpers} from "./scripts/helpers.js";
import registerSettings from "./scripts/settings.js";
import registerConsoleLogger from "./scripts/logger.js";
import K4Alert from "./documents/K4Alert.js";
import K4Sound from "./documents/K4Sound.js";
import K4Roll from "./documents/K4Roll.js";
import K4Dialog from "./documents/K4Dialog.js";
import K4Socket from "./documents/K4Socket.js";
import K4DebugDisplay from "./documents/K4DebugDisplay.js";

import InitializeLibraries, {gsap} from "./libraries.js";
import K4ChatMessage from "./documents/K4ChatMessage.js";
// #endregion

// #region === TYPES === ~
interface SVGGradientStopParams {
  offset: number,
  color: string,
  opacity: number;
}
type SVGGradientStop = SVGGradientStopParams & Record<string, number | string>;
interface SVGGradientDef {
  id: string,
  x: [number, number],
  y: [number, number],
  stops: Array<SVGGradientStop | string>;
}
interface GradientDef {fill: Partial<SVGGradientDef>; stroke: Partial<SVGGradientDef>;}
// #endregion

/** === DYNAMIC GAME DEFINITIONS ===
 * Generate a series of references to the 'game' object, reflecting its state at different phases of initialization.
 */
// * The currently supported hooks are:
// * - init
// * - i18nReady
// * - setup
// * - ready
// *
// * You can also set the special key "none" to make the default behavior set the variable to `undefined` instead of a union.
// *
// * @example
// * ```typescript
// * declare global {
// *   interface AssumeHookRan {
// *     setup: never; // the type doesn't matter
// *   }
// * }
const gameRefInit: Game = game;
declare global {
  interface AssumeHookRan {
    init: never;
  }
}
const gameRefI18nReady: Game = game;
declare global {
  interface AssumeHookRan {
    i18nReady: never;
    setup: never;
  }
}
const gameRefReady: Game = game;
declare global {
  interface AssumeHookRan {
    ready: never;
  }
}
const gameRef: Game = game;
Object.assign(globalThis, {gameRef});

/* #DEVCODE */
async function GlobalAssignment() {

  // Register a ready hook for assignments that can't occur during "init" hook.
  Hooks.on("ready", () => {

    const ACTOR = gameRefReady.actors.values().next().value as Maybe<K4Actor>;
    const ITEM = gameRefReady.items.values().next().value as Maybe<K4Item>;
    const EMBED = ACTOR?.items.values().next().value as Maybe<K4Item>;
    const ACTORSHEET = ACTOR?.sheet;

    Object.assign(globalThis, {
      gsap,
      U,
      C,
      K4Actor,
      K4Item,
      ActorSheet,
      K4PCSheet,
      K4Socket,
      getContrastingColor,
      formatStringForKult,
      gameRef,
      ACTOR, ITEM, EMBED, ACTORSHEET,
      ENTITIES: [ACTOR, ITEM, EMBED]
    });
  });

  // Dynamically import data.js for initializing and building Item documents during development (will become packs for production)
  const {BUILD_ITEMS_FROM_DATA, PACKS, getUniqueValuesForSystemKey, getItemSystemReport, getSubItemSystemReport, findRepresentativeSubset, checkSubsetCoverage, findUniqueKeys} = await import("./scripts/data.js");

  // Assign objects to global namespace, for console access during development
  Object.assign(globalThis, {
    PACKS,
    getItemSystemReport,
    getSubItemSystemReport,
    getUniqueValuesForSystemKey,
    getUniqueEffects: () => getUniqueValuesForSystemKey(PACKS.all, "rules.effects"),
    findRepresentativeSubset,
    checkSubsetCoverage,
    findUniqueKeys,
    BUILD_ITEMS_FROM_DATA
  });
}
/* #endDEVCODE */

async function PreInitializeClasses() {
  return Promise.all([
      K4Actor,
      K4PCSheet,
      K4NPCSheet,

      K4Item,
      K4ItemSheet,

      K4ChatMessage,
      K4ActiveEffect,
      K4Roll,
      K4Dialog,
      K4Sound,
      K4Alert,
      K4DebugDisplay
    ].filter(
      (doc): doc is typeof doc & {PreInitialize: () => Promise<void>;} =>
        "PreInitialize" in doc
    ).map((doc) => doc.PreInitialize())
  );
}
async function InitializeClasses() {
  return Promise.all([
      K4Actor,
      K4PCSheet,
      K4NPCSheet,

      K4Item,
      K4ItemSheet,

      K4ChatMessage,
      K4ActiveEffect,
      K4Roll,
      K4Dialog,
      K4Sound,
      K4Alert,
      K4DebugDisplay
    ].filter(
      (doc): doc is typeof doc & {Initialize: () => Promise<void>;} =>
        "Initialize" in doc
    ).map((doc) => doc.Initialize())
  );
}
async function PreloadHBSTemplates() {
  const templatePaths = [
    ...U.getTemplatePath("globals", [
      "svg-defs",
      "color-defs"
    ]),
    ...U.getTemplatePath("sheets", [
      "pc-sheet",
      "npc-sheet",
      "item-sheet",
      "item-sheet-locked",
      "gmtracker-sheet",
      "pc-initialization",
      "pc-initialization-archetype",
      "pc-initialization-attributes-and-traits",
      "pc-initialization-details",
      "pc-initialization-relations"
    ]),
    ...U.getTemplatePath("components", [
      "hover-strip",
      "item-list",
      "rules-block",
      "roll-result",
      "attribute-box",
      "pc-actor-name",
      "pc-nav-menu",
      "svg",
      "icon",
      "toggle-box",
      "edges-blade-container",
      "stability-shards-overlay",
      "collapsed-modifiers-strip",
      "modifier-toggleable",
      "modifier-untoggleable"
    ]),
    ...U.getTemplatePath("partials", [
      "item-block",
      "subitem-block",
      "player-block"
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
      "ask-for-confirm",
      "ask-for-item"
    ]),
    ...U.getTemplatePath("alerts", [
      "alert-simple",
      "alert-card"
    ])
  ];

  return loadTemplates(templatePaths);
}
async function GenerateColorDefs() {
  $(".vtt.game.system-kult4th").prepend(await renderTemplate(
    U.getTemplatePath("globals", "color-defs"),
    {
      colors: C.Colors,
      colorFilters: C.ColorFilters
    }
  ));
}
async function GenerateSVGDefs() {
  $(".vtt.game.system-kult4th").prepend(await renderTemplate(
    U.getTemplatePath("globals", "svg-defs"),
    {
      linearGradients: Object.values(U.objMap(
        {
          bgold: {
            fill: {
              stops: [C.Colors.gGOLD, C.Colors.bGOLD]
            },
            stroke: {
              stops: [C.Colors.dGREY, C.Colors.dBLACK]
            }
          },
          gold: {
            fill: {
              stops: [C.Colors.bGOLD, C.Colors.GOLD]
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
              id: `fill-${iType}`,
              x: [0, 1],
              y: [0, 1],
              ...fill,
              stops: (fill.stops ?? []).map((stop, i, stops) => {
                return ({
                  offset: U.pInt(100 * (i / (Math.max(stops.length - 1, 0)))),
                  color: typeof stop === "string" ? stop : stop.color,
                  opacity: 1,
                  ...(typeof stop === "string" ? {} : stop)
                });
              }),
              ...(typeof fill.stops === "string"
                ? {}
                : fill.stops)
            },
            stroke: {
              id: `stroke-${iType}`,
              x: [0, 1],
              y: [0, 1],
              ...stroke,
              stops: (stroke.stops ?? []).map((stop, i, stops) => {
                return {
                  offset: U.pInt(100 * (i / (Math.max(stops.length - 1, 0)))),
                  color: typeof stop === "string" ? stop : stop.color,
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
          stroke: Partial<SVGGradientDef>;
        }
      >).map((defs) => Object.values(defs)).flat()
    }
  ));
}

/**
 * Sets up a MutationObserver to watch for canvas disabled notifications in the given container.
 *
 * @param {HTMLElement} notificationsContainer - The container to observe for notifications
 * @returns {void}
 */
function generateObserver_CanvasDisabled(notificationsContainer: HTMLElement): MutationObserver {
  /**
 * Checks if a node is a canvas disabled notification.
 *
 * @param {Node} node - The node to check
 * @returns {boolean} True if the node is a canvas disabled notification, false otherwise
 */
  function isCanvasDisabledNotification(node: Node): boolean {
    // Check if the node is an element node
    if (node.nodeType !== Node.ELEMENT_NODE || !(node instanceof HTMLElement)) {
      return false; // Not an HTMLElement, return false
    }

    // Check if the node has the 'notification' class
    if (!node.classList.contains('notification')) {
      return false; // Not a notification, return false
    }

    // Check if the notification contains specific text
    return Boolean(node.textContent?.includes("because the game Canvas is disabled."));
  }
  // Create a new MutationObserver instance
  const canvasDisabledObserver = new MutationObserver((mutations) => {
    // For each mutation (change) in the observed element
    mutations.forEach((mutation) => {
      // Check each node that was added
      mutation.addedNodes.forEach((node) => {
        // Check if the added node is a canvas disabled notification
        if (isCanvasDisabledNotification(node)) {
          // If it's the canvas disabled notification, remove it from the DOM
          (node as HTMLElement).remove(); // Type assertion to HTMLElement

          // Disconnect the observer since we no longer need to watch for notifications
          canvasDisabledObserver.disconnect();
        }
      });
    });
  });

  // Start observing the notifications container for changes to its direct children
  canvasDisabledObserver.observe(notificationsContainer, { childList: true });

  // Return the observer so it can be disconnected later
  return canvasDisabledObserver;
}
/**
 * Sets up a MutationObserver to watch for canvas disabled notifications in the given container.
 *
 * @param {HTMLElement} notificationsContainer - The container to observe for notifications
 * @returns {void}
 */
function generateObserver_MinimumScreenSize(notificationsContainer: HTMLElement): MutationObserver {
  /**
 * Checks if a node is a minimum screen size notification.
 *
 * @param {Node} node - The node to check
 * @returns {boolean} True if the node is a minimum screen size notification, false otherwise
 */
  function isMinimumScreenSizeNotification(node: Node): boolean {
    // Check if the node is an element node
    if (node.nodeType !== Node.ELEMENT_NODE || !(node instanceof HTMLElement)) {
      return false; // Not an HTMLElement, return false
    }

    // Check if the node has the 'notification' class
    if (!node.classList.contains('notification')) {
      return false; // Not a notification, return false
    }

    // Check if the notification contains specific text
    return Boolean(node.textContent?.includes("requires a minimum screen resolution"));
  }
  // Create a new MutationObserver instance
  const minimumScreenSizeObserver = new MutationObserver((mutations) => {
    // For each mutation (change) in the observed element
    mutations.forEach((mutation) => {
      // Check each node that was added
      mutation.addedNodes.forEach((node) => {
        // Check if the added node is a minimum screen size notification
        if (isMinimumScreenSizeNotification(node)) {
          // If it's the minimum screen size notification, remove it from the DOM
          (node as HTMLElement).remove(); // Type assertion to HTMLElement
        }
      });
    });
  });

  // Start observing the notifications container for changes to its direct children
  minimumScreenSizeObserver.observe(notificationsContainer, { childList: true });

  // Return the observer so it can be disconnected later
  return minimumScreenSizeObserver;
}
/**
 * Sets up a MutationObserver to monitor the DOM for the appearance of the notifications container.
 * Once the container is found, it sets up mutation observers for each generator supplied.
 *
 * @returns {void}
 */
function MonitorNotifications(...observerGenerators: Array<(notificationsContainer: HTMLElement) => MutationObserver>) {
  // Create a MutationObserver to watch for the notifications container
  const notificationsObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        // Check if the added node is the notifications container
        if (node.nodeType === Node.ELEMENT_NODE &&
            node instanceof HTMLElement &&
            node.id === 'notifications') {

          // Set up the observer for each generator
          observerGenerators.forEach((generator) => {
            generator(node);
          });

          // Disconnect this observer since we no longer need to watch for the notifications container
          notificationsObserver.disconnect();
        }
      });
    });
  });

  // Start observing the document body for added nodes
  notificationsObserver.observe(document.body, { childList: true, subtree: true });
}

/**
 * Automatically disables the canvas for all connected clients during the "init" hook.
 *
 * (Kult4th for Foundry does not use the Canvas, replacing it with the Stage.)
 *
 * @returns {Promise<void>}
 */
async function DisableClientCanvas() {
  // Wait until the "noCanvas" setting exists
  while (!gameRefI18nReady.settings.settings.has("core.noCanvas")) {
    await U.sleep(100); // Wait for 100ms before checking again
  }

  if (!gameRefI18nReady.settings.get("core", "noCanvas")) {
    // Set the canvas-disabled setting to true for all connected clients
    await gameRefI18nReady.settings.set("core", "noCanvas", true);
  }
  console.log("Canvas has been disabled for all clients.");
}


Hooks.on("init", async () => {

  // Register logging function and announce initialization to console.
  registerConsoleLogger();
  kLog.display("Initializing 'Kult: Divinity Lost 4th Edition' for Foundry VTT", 0);

  // Register settings (including debug settings necessary for kLog)
  registerSettings();

  // Define the "K4" namespace within the CONFIG object, and assign basic system configuration package.
  CONFIG.K4 = K4Config;
  // Disable Compatibility Warnings
  // CONFIG.compatibility.mode = 0;
  // Toggle Character Creation Features for Debugging
  CONFIG.K4.debug.isDisablingCharGen = false; // Default to false

  // Create toggle button
  const toggleButton = document.createElement("button");
  toggleButton.textContent = "";
  toggleButton.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 19999;
    opacity: 0.3;
    transition: opacity 0.3s;
    width: 30px;
    height: 30px;
    font-size: 10px;
    background-color: var(--toggle-color, #333);
    color: white;
    border: none;
    border-radius: 50%;
    outline: 2px solid var(--toggle-color, #000);
    cursor: pointer;
  `;

  // Add hover effect
  toggleButton.addEventListener("mouseenter", () => toggleButton.style.opacity = "1");
  toggleButton.addEventListener("mouseleave", () => toggleButton.style.opacity = "0.3");

  // Add click listener to toggle config value
  toggleButton.addEventListener("click", () => {
    CONFIG.K4.debug.isDisablingCharGen = !CONFIG.K4.debug.isDisablingCharGen;
    toggleButton.style.setProperty("--toggle-color", CONFIG.K4.debug.isDisablingCharGen ? "red" : "#333");
  });

  // Append button to body
  document.body.appendChild(toggleButton);


  // Initialize Libraries
  InitializeLibraries();

  // Initialize Tooltips Overlay
  InitializeTooltips($("body"));

  // Register Handlebar Helpers
  RegisterHandlebarHelpers();

  // Monitor notifications for canvas disabled and minimum screen size warnings
  MonitorNotifications(
    generateObserver_CanvasDisabled,
    generateObserver_MinimumScreenSize
  );

  // Unregister default sheets
  Actors.unregisterSheet("core", ActorSheet);
  Items.unregisterSheet("core", ItemSheet);

  // Asynchronous operations, run in parallel
  const parallelAsyncFunctions = [
    /* #DEVCODE */
    // Assignment of select variables to global namespace for access in development console
    // GlobalAssignment(),
    /* #endDEVCODE */
    // Call 'PreInitialize' on all relevant classes
    PreInitializeClasses(),
    // Preload Handlebars Templates
    PreloadHBSTemplates(),
    // Generate CSS Color Definitions
    GenerateColorDefs(),
    // Generate CSS SVG Definitions
    GenerateSVGDefs()
  ];

  await Promise.all(parallelAsyncFunctions);
});

Hooks.on("i18nReady", () => {
  void DisableClientCanvas()
});

Hooks.on("ready", async () => {
  await InitializeClasses();
  // Initialize collection objects
  gameRefReady.rolls = new Collection<K4Roll>();
  // If user is GM, add "gm-user" class to #interface
  if (gameRefReady.user?.isGM) {
    $("#interface").addClass("gm-user");
  }
});


// #region ░░░░░░░[SocketLib]░░░░ SocketLib Initialization ░░░░░░░ ~
Hooks.once("socketlib.ready", () => {
  socketlib.registerSystem("kult4th");
  [
    K4Alert,
    K4Dialog
  ].filter(
    (doc): doc is typeof doc & {SocketFunctions: Record<string, SocketFunction>} =>
      "SocketFunctions" in doc
  ).forEach((doc) => {
    K4Socket.RegisterSocketFunctions(doc.SocketFunctions);
  });
  /* DEVCODE*/Object.assign(
    globalThis,
    {socketlib}
  );/* !DEVCODE*/
});
// #endregion ░░░░[SocketLib]░░░░