// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import C, {K4Attribute, K4GamePhase} from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import K4Actor, {K4ActorType} from "./K4Actor.js";
import K4Item, {K4ItemType} from "./K4Item.js";
import K4ItemSheet from "./K4ItemSheet.js";
import K4Socket, {UserTargetRef} from "./K4Socket.js";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion
// #region -- TYPES ~

declare global {
  namespace K4GMTracker {
    export interface System {
      gamePhase: K4GamePhase;
    }
  }
}
// #ENDREGION

class K4GMTracker {

  public static readonly SocketFunctions: Record<string, SocketFunction> = {
    "ChangePhase": async (phase: K4GamePhase) => {
      /**
       * @todo Implement phase-changing logic.
       * 	- Switch statement in response function calls two functions:
       *    - await "end<Phase>" - handles logic to end current phase
       *    - "init<Phase>" - handles logic to start new phase
       */
      kLog.log(`Received Socket Call to Change Phase to ${phase} for User ${getUser().name}`);
      await this.INIT_PHASE_FUNCS[phase]();
    }
  };

  private static get INIT_PHASE_FUNCS() {

    async function hideElement(element$: JQuery, duration = 2) {
      return U.gsap.to(element$, {autoAlpha: 0, duration, ease: "power1.in"});
    }

    return {
      [K4GamePhase.uninitialized]: async () => {
        console.log("Initializing 'uninitialized' Game Phase.");
        const tracker = await K4GMTracker.Get();
        if (getUser().isGM) {
          tracker.render(true);
          $("body").addClass("interface-visible");
          return;
        }

        // Render the overlay (initially hidden)
        await tracker.renderOverlay(K4GamePhase.uninitialized);

        // Preload assets
        kLog.log("Preloading Assets");
        await tracker.preloadOverlayAssets(K4GamePhase.uninitialized);
        kLog.log("Assets loaded!");

        // Reveal the overlay by hiding the loading screen
        $("body").addClass("interface-visible");

        // Make the overlay visible
        tracker.overlays[K4GamePhase.uninitialized]?.css('visibility', 'visible');
      },
      [K4GamePhase.initialized]: async () => {
        console.log("Initializing 'initialized' Game Phase.");
        const tracker = await K4GMTracker.Get();
        if (getUser().isGM) {return;}

        // Render the overlay beneath the previous overlay or loading screen
        await tracker.renderOverlay(K4GamePhase.initialized);

        // Preload assets
        await tracker.preloadOverlayAssets(K4GamePhase.initialized);

        // Reveal the overlay by hiding the previous overlay and/or loading screen.
        const elemsToHide$ = [
          "#gamephase-overlay.uninitialized"
        ];
        await Promise.all(elemsToHide$.map((elem) => hideElement($(elem))));

        // Make the overlay visible
        tracker.overlays[K4GamePhase.initialized]?.css('visibility', 'visible');
      },
      [K4GamePhase.chargen]: async () => {
        console.log("Initializing 'chargen' Game Phase.");
        const tracker = await K4GMTracker.Get();
        if (getUser().isGM) {return;}

        // Render the overlay beneath the previous overlay or loading screen
        await tracker.renderOverlay(K4GamePhase.chargen);

        // Preload assets
        await tracker.preloadOverlayAssets(K4GamePhase.chargen);

        // Reveal the overlay by hiding the previous overlay and/or loading screen.
        const elemsToHide$ = [
          $("body::after")[0],
          ...(Object.keys(tracker.overlays) as K4GamePhase[])
            .filter((key) => key !== K4GamePhase.chargen)
            .map((key) => tracker.overlays[key]![0])
        ];
        await Promise.all(elemsToHide$.map((elem) => hideElement($(elem))));
      },
      [K4GamePhase.preSession]: () => {
        console.log("Initializing 'preSession' Game Phase.");
      },
      [K4GamePhase.session]: () => {
        console.log("Initializing 'session' Game Phase.");
      },
      [K4GamePhase.postSession]: () => {
        console.log("Initializing 'postSession' Game Phase.");
      }
    };
  };

  overlays: Partial<Record<K4GamePhase, JQuery>> = {};

  async renderOverlay(gamePhase: K4GamePhase) {
    this.overlays[gamePhase] = $("body").prepend(await renderTemplate(
      U.getTemplatePath("gamephase", `overlay-${gamePhase}`),
      (getUser().character?.sheet as Maybe<FormApplication>)?.getData() ?? {}
    ));
  }

  async preloadOverlayAssets(gamePhase: K4GamePhase): Promise<void> {
    const overlay$ = this.overlays[gamePhase];
    if (!overlay$?.length) {
      throw new Error(`Cannot preload assets on an unrendered overlay for gamePhase ${gamePhase}`);
    }

    const videos$ = overlay$.find("video.rolling-fog");
    kLog.log("Videos: ", videos$.toArray());
    const audios$ = overlay$.find("audio");

    const videoPromises = (videos$.toArray() as HTMLVideoElement[]).map((video: HTMLVideoElement) => {
      return new Promise<void>((resolve) => {
        const checkVideoStatus = () => {
          if (video.readyState >= 4 && !video.paused && video.currentTime > 0) {
            console.log(`Video playing successfully: ${video.src}`);
            resolve();
          } else {
            setTimeout(checkVideoStatus, 100);
          }
        };
        checkVideoStatus();
      });
    });

    const audioPromises = audios$.toArray().map((audio: HTMLAudioElement) => {
      return new Promise<void>((resolve, reject) => {
        if (audio.readyState >= 4) {
          resolve();
        } else {
          audio.addEventListener('canplaythrough', () => {resolve()}, {once: true});
          audio.addEventListener('error', () => {reject(new Error(`Failed to load audio: ${audio.src}`));}, {once: true});
        }
      });
    });

    try {
      kLog.log("Video Promises", videoPromises);
      await Promise.all([...videoPromises]);
      console.log(`All assets for ${gamePhase} overlay loaded successfully`);
    } catch (error) {
      console.error(`Error loading assets for ${gamePhase} overlay:`, error);
      throw error;
    }
  }

  private static get END_PHASE_FUNCS() {
    return {
      [K4GamePhase.uninitialized]: () => {
        console.log("Ending 'uninitialized' Game Phase.");
      },
      [K4GamePhase.initialized]: () => {
        console.log("Ending 'initialized' Game Phase.");
      },
      [K4GamePhase.chargen]: () => {
        console.log("Ending 'chargen' Game Phase.");
      },
      [K4GamePhase.preSession]: () => {
        console.log("Ending 'preSession' Game Phase.");
      },
      [K4GamePhase.session]: () => {
        console.log("Ending 'session' Game Phase.");
      },
      [K4GamePhase.postSession]: () => {
        console.log("Ending 'postSession' Game Phase.");
      }
    };
  };


  static instance: K4GMTracker | null = null;
  static instancePromise: Promise<K4GMTracker> | null = null;

  /**
   * Asynchronously gets the K4GMTracker instance, waiting for its creation if necessary.
   * @returns {Promise<K4GMTracker>} A promise that resolves to the K4GMTracker instance.
   */
  public static async Get(): Promise<K4GMTracker> {
    if (this.instance) {
      return this.instance;
    }

    if (!this.instancePromise) {
      this.instancePromise = new Promise((resolve) => {
        const checkTrackerItem = () => {
          const trackerItem: Maybe<K4Item<K4ItemType.gmtracker>> = getGame().items.find((item: K4Item): item is K4Item<K4ItemType.gmtracker> => item.type === K4ItemType.gmtracker);
          if (trackerItem) {
            this.instance = new K4GMTracker(trackerItem);
            resolve(this.instance);
          } else {
            setTimeout(checkTrackerItem, 100); // Check again after 100ms
          }
        };
        checkTrackerItem();
      });
    }

    return this.instancePromise;
  }

  /**
   * Initializes the K4GMTracker, ensuring a single instance of the GMTracker item exists.
   * @returns {Promise<void>}.
   */
  public static async Initialize(): Promise<void> {
    if (!getUser().isGM) {
      // Non-GM users should wait for the GM to create the tracker
      await this.Get();
      return;
    }


    // For GM users, check if the tracker already exists
    let trackerItem: Maybe<K4Item<K4ItemType.gmtracker>> = getGame().items.find((item: K4Item): item is K4Item<K4ItemType.gmtracker> => item.type === K4ItemType.gmtracker);

    if (!trackerItem) {
      // GM creates a new GMTracker item if it doesn't exist
      trackerItem = await K4Item.create({
        name: "GM Tracker",
        img: "systems/kult4th/assets/icons/gm-tracker.webp",
        type: K4ItemType.gmtracker
      }, { renderSheet: false }) as Maybe<K4Item<K4ItemType.gmtracker>>;
    }

    // Create the instance
    K4GMTracker.instance = new K4GMTracker(trackerItem!);

    // Use AsyncGet to ensure the instance is fully initialized
    (await this.Get()).render(true);

    $("body").addClass("interface-visible");
  }

  private _trackerItem: K4Item<K4ItemType.gmtracker> & {system: K4GMTracker.System;};
  private constructor(private trackerItem: K4Item<K4ItemType.gmtracker>) {
    // Private constructor to prevent direct instantiation
    this._trackerItem = trackerItem as K4Item<K4ItemType.gmtracker> & {system: K4GMTracker.System;};
  }

  get item(): K4Item<K4ItemType.gmtracker> & {system: K4GMTracker.System;} {
    return this._trackerItem;
  }

  get sheet(): K4ItemSheet {
    return this.item.sheet;
  }

  get elem$(): Maybe<JQuery> {
    if (this.sheet.rendered) {
      return $(this.sheet.element);
    }
    return undefined;
  }

  get system(): K4GMTracker.System {
    return this.item.system;
  }

  get phase(): K4GamePhase {
    return this.system.gamePhase;
  }
  set phase(phase: K4GamePhase) {
    const curPhase = this.phase;
    this.item.update({system: {gamePhase: phase}}, {render: true})
      .then(() => {
        void K4Socket.Call("ChangePhase", UserTargetRef.all, phase);
      })
      .catch((error: unknown) => {
        console.error("Failed to change game phase:", error);
      });
  }

  render(force = false) {
    this.sheet.render(force);
  }

  getData() {
    const playerCharacters = Object.fromEntries(
      Array.from(getGame().actors as Collection<K4Actor>)
        .filter((actor) => actor.type === K4ActorType.pc)
        .map((actor) => [actor.id, {
          actor,
          owner: actor.user
        }])
    );
    return {
      playerCharacters,
      playerUsers: getGame().users
        .filter((user: User) => [CONST.USER_ROLES.PLAYER, CONST.USER_ROLES.TRUSTED].includes(user.role)),
      allActorsAssigned: new Set(Object.values(playerCharacters)
        .map(pc => pc.owner?.id)
        .filter(Boolean)).size === Object.keys(playerCharacters).length
    };
  }


  activateListeners(html: JQuery): void {

    html.find(".phase-select-button")
      .on({
        click: (evemt: ClickEvent): void => {
          const button$ = $(evemt.currentTarget as HTMLButtonElement);
          const curPhase = this.phase;
          const clickedPhase = button$.data("phase") as K4GamePhase;
          const curPhaseIndex = Object.values(K4GamePhase).indexOf(curPhase);
          const clickedPhaseIndex = Object.values(K4GamePhase).indexOf(clickedPhase);

          // Do nothing if clickedPhase is more than one step away from curPhase
          if (Math.abs(clickedPhaseIndex - curPhaseIndex) > 1) {
            return;
          }

          // If the clicked phase equals the current phase, move one phase left
          if (clickedPhase === curPhase) {
            const newPhase = Object.values(K4GamePhase)[curPhaseIndex - 1];
            this.phase = newPhase;
            return;
          }

          // Otherwise, set the phase to the clicked phase
          this.phase = clickedPhase;
        }
      });

    html.find("select.user-selection")
      .on({
        change: async (event: JQuery.ChangeEvent): Promise<void> => {
          const select$ = $(event.currentTarget as HTMLSelectElement);
          const val = select$.val() as string;

          // Get the actor ID from the data attribute
          const actorId = select$.data("actor-id") as string;

          // Find the actor in the game
          const actor: Maybe<K4Actor> = getGame().actors?.get(actorId);

          if (!actor) {
            console.error(`Actor with ID ${actorId} not found.`);
            return;
          }

          // Create a new ownership object
          const newOwnership: Record<string, number> = {};

          // Set ownership to 3 for the selected user, if a user was selected
          if (val) {
            newOwnership[val] = CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;
            // Iterate through all options and set ownership to INHERIT for other users
            select$.find("option").each((_, option) => {
              const userId = $(option).val();
              if (userId && userId !== val) {
                newOwnership[userId] = CONST.DOCUMENT_OWNERSHIP_LEVELS.INHERIT;
              }
            });

            // Set default ownership to INHERIT for all other users not in the select
            newOwnership.default = CONST.DOCUMENT_OWNERSHIP_LEVELS.INHERIT;
          }

          // Update the actor's ownership
          await actor.update({
            "ownership": newOwnership
          });

          // Rerender the GM Tracker sheet
          this.trackerItem.sheet.render();
        }
      });
  }

}

export default K4GMTracker;