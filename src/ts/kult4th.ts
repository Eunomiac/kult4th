// #region IMPORTS ~
import "../scss/style.scss";

import LogRocket from 'logrocket';
import K4Config from "./scripts/config.js";
import K4Actor from "./documents/K4Actor.js";
import K4Item, {K4ItemType} from "./documents/K4Item.js";
import K4ItemSheet from "./documents/K4ItemSheet.js";
import K4PCSheet from "./documents/K4PCSheet.js";
import K4NPCSheet from "./documents/K4NPCSheet.js";
import K4ActiveEffect from "./documents/K4ActiveEffect.js";
import C from "./scripts/constants.js";
import InitializePopovers from "./scripts/popovers.js";
import U from "./scripts/utilities.js";
import {formatForKult, registerHandlebarHelpers as RegisterHandlebarHelpers} from "./scripts/helpers.js";
import registerSettings from "./scripts/settings.js";
import registerConsoleLogger from "./scripts/logger.js";
import K4Alert from "./documents/K4Alert.js";
import K4Sound from "./documents/K4Sound.js";
import K4Roll from "./documents/K4Roll.js";
import K4Dialog from "./documents/K4Dialog.js";
import K4Socket from "./documents/K4Socket.js";
import K4DebugDisplay from "./documents/K4DebugDisplay.js";
import K4CharGen from "./documents/K4CharGen.js";
import K4GMTracker from "./documents/K4GMTracker.js";

import InitializeLibraries, {gsap} from "./libraries.js";
import K4ChatMessage from "./documents/K4ChatMessage.js";
// #endregion

// #region === CONSTANTS === ~
const InitializableClasses = {
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
  K4DebugDisplay,
  K4GMTracker,
  K4CharGen,
  K4Socket
 } as const;
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

Object.assign(globalThis, {
  getGame: function getGame(): Game {
    if (!(game instanceof Game)) {
      throw new Error("Game is not ready");
  }
    return game;
  },
  getUser: function getUser(): User {
    const user = getGame().user;
    if (!user) {
      throw new Error("User is not ready");
    }
    return user;
  },
  getI18n: function getI18n(): Localization {
    const i18n = getGame().i18n;
    if (!i18n) {
      throw new Error("I18n is not ready");
    }
    return i18n;
  }
});

/* #DEVCODE */
async function GlobalAssignment() {

  const ACTOR = getGame().actors.values().next().value as Maybe<K4Actor>;
  const ITEM = getGame().items.values().next().value as Maybe<K4Item>;
  const EMBED = ACTOR?.items.values().next().value as Maybe<K4Item>;
  const ACTORSHEET = ACTOR?.sheet;

  Object.assign(globalThis, {
    gsap,
    U,
    C,
    ActorSheet,
    formatForKult,
    ACTOR, ITEM, EMBED, ACTORSHEET,
    ENTITIES: [ACTOR, ITEM, EMBED],
    ...InitializableClasses
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
function InitLogRocketCSSPerformanceMonitor() {
  LogRocket.init('vodsl0/kult4th-for-foundry-vtt');
  kLog.display("Initialized LogRocket CSS performance monitor", 0);
}
/* #endDEVCODE */

enum InitializerMethod {
  PreInitialize = "PreInitialize",
  Initialize = "Initialize",
  PostInitialize = "PostInitialize"
}

async function RunInitializer<T extends InitializerMethod>(methodName: T) {
  return Promise.all(
    Object.values(InitializableClasses).filter(
      (doc): doc is typeof doc & Record<T, () => Promise<void>> =>
        methodName in doc
    ).map((doc) => doc[methodName]())
  );
}

async function PreloadHBSTemplates() {
  const templatePaths = [
    ...U.getTemplatePath("chargen", [
      "chargen-intro-overlay",
      "chargen-main"
    ]),
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
      "pc-initialization-archetype-trait-panels",
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
              stops: [C.Colors.GOLD9, C.Colors.GOLD8]
            },
            stroke: {
              stops: [C.Colors.GREY3, C.Colors.GREY0]
            }
          },
          gold: {
            fill: {
              stops: [C.Colors.GOLD8, C.Colors.GOLD5]
            },
            stroke: {
              stops: [C.Colors.GREY3, C.Colors.GREY0]
            }
          },
          red: {
            fill: {
              stops: [C.Colors.RED8, C.Colors.RED1]
            },
            stroke: {
              stops: [C.Colors.GOLD8, C.Colors.GOLD1]
            }
          },
          grey: {
            fill: {
              stops: [C.Colors.GREY7, C.Colors.GREY3]
            },
            stroke: {
              stops: [C.Colors.GREY0, C.Colors.GREY0]
            }
          },
          blue: {
            fill: {
              stops: [C.Colors.BLUE8, C.Colors.BLUE1]
            },
            stroke: {
              stops: [C.Colors.GOLD8, C.Colors.GOLD1]
            }
          },
          black: {
            fill: {
              stops: [C.Colors.GREY0, C.Colors.GREY0],
            },
            stroke: {
              stops: [C.Colors.GREY1, C.Colors.GREY1]
            }
          },
          white: {
            fill: {
              stops: [C.Colors.GREY10, C.Colors.GREY9],
            },
            stroke: {
              stops: [C.Colors.GREY1, C.Colors.GREY0]
            }
          },
          [K4ItemType.advantage]: {
            fill: {
              stops: [C.Colors.GOLD8, C.Colors.GOLD1]
            },
            stroke: {
              stops: [C.Colors.GOLD5, C.Colors.GOLD1]
            }
          },
          [K4ItemType.darksecret]: {
            fill: {
              stops: [C.Colors.RED1, C.Colors.RED1]
            },
            stroke: {
              stops: [C.Colors.RED8, C.Colors.RED5]
            }
          },
          [K4ItemType.disadvantage]: {
            fill: {
              stops: [C.Colors.GREY5, C.Colors.GREY1]
            },
            stroke: {
              stops: [C.Colors.GREY9, C.Colors.GREY7]
            }
          },
          // [K4ItemType.gear]: {
          //   fill: {
          //     stops: [C.Colors["GOLD8"], C.Colors["GOLD1"]]
          //   },
          //   stroke: {
          //     stops: [C.Colors.GOLD5, C.Colors["GOLD1"]]
          //   }
          // },
          [K4ItemType.move]: {
            fill: {
              stops: [C.Colors.GOLD5, C.Colors.GOLD1]
            },
            stroke: {
              stops: [C.Colors.GOLD8, C.Colors.GOLD8]
            }
          },
          // [K4ItemType.relation]: {
          //   fill: {
          //     stops: [C.Colors["GOLD8"], C.Colors["GOLD1"]]
          //   },
          //   stroke: {
          //     stops: [C.Colors.GOLD5, C.Colors["GOLD1"]]
          //   }
          // },
          [K4ItemType.weapon]: {
            fill: {
              stops: [C.Colors.RED8, C.Colors.RED1]
            },
            stroke: {
              stops: [C.Colors.RED5, C.Colors.RED1]
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
  while (!getGame().settings.settings.has("core.noCanvas")) {
    await U.sleep(100); // Wait for 100ms before checking again
  }

  if (!getGame().settings.get("core", "noCanvas")) {
    // Set the canvas-disabled setting to true for all connected clients
    await getGame().settings.set("core", "noCanvas", true);
  }
  console.log("Canvas has been disabled for all clients.");
}

Hooks.on("renderUserConfig", (config: UserConfig, html: HTMLFormElement) => {

  const body$ = $(html).closest("body");
  const interface$ = body$.find("#interface");
  const pauseIcon$ = body$.find("#pause");
  const notifications$ = body$.find("#notifications");

  $(html).remove();

  interface$.children().css("display", "none");
  pauseIcon$.css("display", "none");
  notifications$.css("display", "none");

  U.gsap.to(interface$, {
    backgroundColor: C.Colors.GREY0.css,
    duration: 1,
    ease: "power2.out"
  });

  return false;
});

Hooks.on("init", async () => {



  // Register logging function and announce initialization to console.
  registerConsoleLogger();
  kLog.display("Initializing 'Kult: Divinity Lost 4th Edition' for Foundry VTT", 0);

  // Register settings (including debug settings necessary for kLog)
  registerSettings();

  // Define the "K4" namespace within the CONFIG object, and assign basic system configuration package.
  CONFIG.K4 = K4Config;

  /* #DEVCODE */
  // Disable Compatibility Warnings
  // CONFIG.compatibility.mode = 0;
  // Toggle Character Creation Features for Debugging
  CONFIG.K4.debug.isDisablingCharGen = false; // Default to false
  CONFIG.debug.hooks = true;
  // InitLogRocketCSSPerformanceMonitor();
  /* #endDEVCODE */

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
  // InitializeTooltips($("body"));
  InitializePopovers($("body"));

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
    RunInitializer(InitializerMethod.PreInitialize),
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
  // Call Initialize on all relevant classes
  await RunInitializer(InitializerMethod.Initialize);
  // Initialize collection objects
  getGame().rolls = new Collection<K4Roll>();
  // If user is GM, add "gm-user" class to #interface
  if (getUser().isGM) {
    $("#interface").addClass("gm-user");
  }
  // Assign global variables to globalThis
  await GlobalAssignment();

  // Call PostInitialize on all relevant classes
  await RunInitializer(InitializerMethod.PostInitialize);
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