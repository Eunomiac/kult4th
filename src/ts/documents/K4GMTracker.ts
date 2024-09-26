// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import C, {K4Attribute, K4GamePhase, K4Archetype} from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import K4Actor, {K4ActorType} from "./K4Actor.js";
import K4Item, {K4ItemType} from "./K4Item.js";
import K4ItemSheet from "./K4ItemSheet.js";
import K4Socket, {UserTargetRef} from "./K4Socket.js";
import {ExpoScaleEase} from "../libraries.js";
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
    "EndPhase": async (phase: K4GamePhase) => {
      kLog.log(`{{EndPhase}} User ${getUser().name} received Socket Call to End '${phase}' Phase`);
      await this.END_PHASE_FUNCS[phase]();
      return true;
    },
    "PreloadPhase": async (phase: K4GamePhase) => {
      kLog.log(`{{PreloadPhase}} User ${getUser().name} received Socket Call to Preload '${phase}' Phase`);
      const tracker = await K4GMTracker.Get();
      kLog.log("... tracker received, preloading assets...");
      await tracker.preloadOverlay(phase);
      kLog.log("... assets preloaded, returning true");
      return true;
    },
    "StartPhase": async (phase: K4GamePhase) => {
      kLog.log(`{{StartPhase}} User ${getUser().name} received Socket Call to Start ${phase} Phase`);
      const tracker = await K4GMTracker.Get();

      void tracker.displayOverlay(phase);

      await this.START_PHASE_FUNCS[phase]();
    },
    "CharChange_Name": async (
      userID: IDString,
      actorID: IDString,
      value: string
    ) => {
      const user = getGame().users.get(userID);
      const actor = getGame().actors.get(actorID);
      kLog.log(`{{CharChange_Name}} User ${user.name} changed the name of actor ${actor.name} to ${value}`);
      const tracker = await K4GMTracker.Get();
      // tracker.updateCharPanel_Name(user, value);
    },
    "CharChange_Archetype": async (
      userID: IDString,
      actorID: IDString,
      value: K4Archetype
    ) => {
      const user = getGame().users.get(userID);
      const actor = getGame().actors.get(actorID);
      kLog.log(`{{CharChange_Archetype}} User ${user.name} changed the archetype of actor ${actor.name} to ${value}`);
      const tracker = await K4GMTracker.Get();
      // tracker.updateCharPanel_Archetype(user, value);
    },
    "CharChange_Attribute": async (
      userID: IDString,
      actorID: IDString,
      attribute: K4CharAttribute,
      value: string
    ) => {
      const user = getGame().users.get(userID);
      const actor = getGame().actors.get(actorID);
      kLog.log(`{{CharChange_Attributes}} User ${user.name} changed the value of attribute '${attribute}' of actor ${actor.name} to ${value}`);
      const tracker = await K4GMTracker.Get();
      // tracker.updateCharPanel_Attribute(user, attribute, value);
    },
    "CharChange_Trait": async (
      userID: IDString,
      actorID: IDString,
      traitType: K4TraitType,
      value: string,
      isAdding: boolean,
      isArchetype?: boolean
    ) => {
      const user = getGame().users.get(userID);
      const actor = getGame().actors.get(actorID);
      if (isAdding) {
        kLog.log(`{{CharChange_Advantage}} User ${user.name} added the ${traitType} '${value}' ${
          isArchetype ? `to archetype ${actor.archetype}` : "to extra traits"
        } of actor ${actor.name}`);
      } else {
        kLog.log(`{{CharChange_Advantage}} User ${user.name} removed the ${traitType} '${value}' from actor ${actor.name}`);
      }
      const tracker = await K4GMTracker.Get();
      // tracker.updateCharPanel_Trait(user, traitType, value, isAdding, isArchetype);
    },
    "CharChange_Text": async (
      userID: IDString,
      actorID: IDString,
      textBlock: string,
      value: string
    ) => {
      const user = getGame().users.get(userID);
      const actor = getGame().actors.get(actorID);
      kLog.log(`{{CharChange_Text}} User ${user.name} changed '${textBlock}' of actor ${actor.name} to ${value}`);
      const tracker = await K4GMTracker.Get();
      // tracker.updateCharPanel_Text(user, textBlock, value);
    }

  };
  // changeType: "name" | "archetype" | "attributes" | K4ItemType.advantage | K4ItemType.disadvantage | K4ItemType.darksecret | "text",

  private static get OVERLAY_ANIMATIONS() {

    return {
      [K4GamePhase.uninitialized]: () => {

        const overlay$ = $("#gamephase-overlay.uninitialized");
        const topFog$ = overlay$.find(".rolling-fog-container.inverted");
        const bottomFog$ = overlay$.find(".rolling-fog-container:not(.inverted)");
        const title$ = overlay$.find(".overlay-title");
        const ambientAudio$ = overlay$.find(".ambient-audio") as JQuery<HTMLAudioElement>;
        const titleBang$ = overlay$.find(".title-bang") as JQuery<HTMLAudioElement>;
        const gearContainers$ = overlay$.find(".gear-container");
        const hugeGear$ = overlay$.find(".gear-huge");
        const binahGear$ = overlay$.find(".gear-binah");
        const geburahGear$ = overlay$.find(".gear-geburah");

        // Lower ambient volume
        ambientAudio$[0].volume = 1;

        // Set initial styles for animated elements
        U.gsap.set(gearContainers$, {
          xPercent: -50,
          yPercent: -50
        });
        U.gsap.set(title$, {
          xPercent: -50,
          yPercent: -50,
          autoAlpha: 0
        });

        // Rotate gears
        U.gsap.effects.gearGeburahRotate(geburahGear$);
        U.gsap.effects.gearBinahRotate(binahGear$);
        U.gsap.effects.gearHugeRotate(hugeGear$);

        const OVERLAY_FADE_IN_AT = 2;
        const TITLE_BANG_AT = 6;

        const timeTillTitleBang = TITLE_BANG_AT + OVERLAY_FADE_IN_AT; // Total time from ambient music start to title bang.
        const fogDuration = TITLE_BANG_AT * 2; // Ensures title bang happens in the middle of the fog rotation, when it's roughly horizontal.

        const tl = U.gsap.timeline()
          .call(() => { void ambientAudio$[0].play(); })
          .to(overlay$, {autoAlpha: 1, duration: 0.5}, OVERLAY_FADE_IN_AT)
          .fromTo(topFog$, {
            yPercent: -175,
            rotate: -10,
            scale: -4
          }, {yPercent: -50, rotate: 10, scale: -1.25, duration: fogDuration, ease: "power2.inOut"}, "<")
          .fromTo(bottomFog$, {
            yPercent: 175,
            rotate: -10,
            scale: 4
          }, {yPercent: 50, rotate: 10, scale: 1.25, duration: fogDuration, ease: "power2.inOut"}, "<")
          .call(() => { void titleBang$[0].play(); }, [], timeTillTitleBang)
          .set([title$, geburahGear$, binahGear$, hugeGear$], {autoAlpha: 1}, timeTillTitleBang);

        return tl;
      },
      [K4GamePhase.initialized]: () => {
        const overlay$ = $("#gamephase-overlay.initialized");

        const DISPLAY_DURATION = 5;

        const tl = U.gsap.timeline()
          .to(overlay$, {autoAlpha: 1, duration: DISPLAY_DURATION});

        return tl;
      },
      [K4GamePhase.chargen]: async () => {
        const overlay$ = $("#gamephase-overlay.chargen");

        const tl = U.gsap.timeline()
          .to(overlay$, {autoAlpha: 1, duration: 1});

        await getActor().chargenSheet.revealCarouselScene();

        return tl;
      },
      [K4GamePhase.preSession]: () => {

        const tl = U.gsap.timeline();


        return tl;
      },
      [K4GamePhase.session]: () => {

        const tl = U.gsap.timeline();


        return tl;
      },
      [K4GamePhase.postSession]: () => {

        const tl = U.gsap.timeline();


        return tl;
      }
    }
  }

  private static get START_PHASE_FUNCS() {

    return {
      [K4GamePhase.uninitialized]: async () => {
        console.log("Initializing 'uninitialized' Game Phase.");
        const tracker = await K4GMTracker.Get();
        void tracker.preloadOverlay(K4GamePhase.initialized);
      },
      [K4GamePhase.initialized]: async () => {
        console.log("Initializing 'initialized' Game Phase.");
        const tracker = await K4GMTracker.Get();
        if (getUser().isGM) {return;}
        // void tracker.preloadOverlay(K4GamePhase.chargen);
      },
      [K4GamePhase.chargen]: async () => {
        console.log("Initializing 'chargen' Game Phase.");
        const tracker = await K4GMTracker.Get();
        if (getUser().isGM) {return;}


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
    } as Record<K4GamePhase, AsyncFunc>;
  };

  private static get END_PHASE_FUNCS() {
    return {
      [K4GamePhase.uninitialized]: async () => {
        console.log("Ending 'uninitialized' Game Phase.");
        const overlay$ = $("#gamephase-overlay.uninitialized");
        await gsap.to(overlay$, {autoAlpha: 0, duration: 1, ease: "power2.inOut"});
        const tracker = await K4GMTracker.Get();
        tracker._overlayPreloadStatus[K4GamePhase.uninitialized] = false;
        overlay$.remove();
      },
      [K4GamePhase.initialized]: async () => {
        console.log("Ending 'initialized' Game Phase.");
        const overlay$ = $("#gamephase-overlay.initialized");
        await gsap.to(overlay$, {autoAlpha: 0, duration: 1, ease: "power2.inOut"});
        const tracker = await K4GMTracker.Get();
        tracker._overlayPreloadStatus[K4GamePhase.initialized] = false;
        overlay$.remove();
      },
      [K4GamePhase.chargen]: async () => {
        console.log("Ending 'chargen' Game Phase.");
        const overlay$ = $("#gamephase-overlay.chargen");
        await gsap.to(overlay$, {autoAlpha: 0, duration: 1, ease: "power2.inOut"});
        const tracker = await K4GMTracker.Get();
        tracker._overlayPreloadStatus[K4GamePhase.chargen] = false;
        overlay$.remove();
      },
      [K4GamePhase.preSession]: async () => {
        console.log("Ending 'preSession' Game Phase.");
        const overlay$ = $("#gamephase-overlay.preSession");
        await gsap.to(overlay$, {autoAlpha: 0, duration: 1, ease: "power2.inOut"});
        const tracker = await K4GMTracker.Get();
        tracker._overlayPreloadStatus[K4GamePhase.preSession] = false;
        overlay$.remove();
      },
      [K4GamePhase.session]: async () => {
        console.log("Ending 'session' Game Phase.");
        const overlay$ = $("#gamephase-overlay.session");
        await gsap.to(overlay$, {autoAlpha: 0, duration: 1, ease: "power2.inOut"});
        const tracker = await K4GMTracker.Get();
        tracker._overlayPreloadStatus[K4GamePhase.session] = false;
        overlay$.remove();
      },
      [K4GamePhase.postSession]: async () => {
        console.log("Ending 'postSession' Game Phase.");
        const overlay$ = $("#gamephase-overlay.postSession");
        await gsap.to(overlay$, {autoAlpha: 0, duration: 1, ease: "power2.inOut"});
        const tracker = await K4GMTracker.Get();
        tracker._overlayPreloadStatus[K4GamePhase.postSession] = false;
        overlay$.remove();
      }
    } as Record<K4GamePhase, AsyncFunc>;
  }

  private overlays: Partial<Record<K4GamePhase, JQuery>> = {};

  async displayOverlay(gamePhase = this.phase) {
    kLog.log(`Displaying overlay for gamePhase ${gamePhase}`);
    const overlay$ = $(`#gamephase-overlay.${gamePhase}`);
    if (!overlay$.length) {
      throw new Error(`Must preload overlay for gamePhase ${gamePhase} before displaying it.`);
    }
    if (!overlay$.hasClass("is-loaded")) {
      throw new Error(`Overlay for gamePhase ${gamePhase} is not loaded.`);
    }

    // Add class to set visibility to hidden and bring to front.
    overlay$.addClass("is-displaying");

    // Run animation
    const animation = (await K4GMTracker.OVERLAY_ANIMATIONS[gamePhase]()).play()
      .then(() => {
        if (gamePhase === K4GamePhase.initialized) {
          void this.preloadOverlay(K4GamePhase.chargen);
        }
      });

    return animation;
  }


  _overlayPreloadStatus: Partial<Record<K4GamePhase, boolean>> = {};
  async preloadOverlay(gamePhase = this.phase): Promise<JQuery> {
    // If already loaded, do nothing
    if (this._overlayPreloadStatus[gamePhase]) {return $(`#gamephase-overlay.${gamePhase}`);}
    // If already exists, remove it
    $(`#gamephase-overlay.${gamePhase}`).remove();

    // Render the overlay to the DOM
    const overlayHtml = await renderTemplate(
      U.getTemplatePath("gamephase", `overlay-${gamePhase}`),
      {
        ...(await (getActor().sheet as Maybe<FormApplication>)?.getData()) ?? {},
        ...(gamePhase === K4GamePhase.chargen ? (getActor() as K4Actor).chargenSheet.chargenContext() : {})
      }
    );
    const overlay$ = $(overlayHtml).prependTo("body");

    // Get all video and audio elements in the overlay
    const videos$ = overlay$.find("video");
    kLog.log("Videos: ", videos$.toArray());
    const audios$ = overlay$.find("audio");
    kLog.log("Audios: ", audios$.toArray());

    // Create array of promises to check if videos and audios are ready
    const videoPromises = videos$.toArray().map((video: HTMLVideoElement) => {
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
        const checkAudioStatus = () => {
          if (audio.readyState >= 4) {
            console.log(`Audio playing successfully: ${audio.src}`);
            resolve();
          } else {
            setTimeout(checkAudioStatus, 100);
          }
        };
        checkAudioStatus();
      });
    });

    // Wait for all videos and audios to load
    try {
      await Promise.all([...videoPromises, ...audioPromises]);
      console.log(`All assets for ${gamePhase} overlay loaded successfully`);
      overlay$.addClass("is-loaded");
    } catch (error) {
      console.error(`Error loading assets for ${gamePhase} overlay:`, error);
      throw error;
    }

    // If this is the chargen phase, preload the carousel
    if (gamePhase === K4GamePhase.chargen) {
      await getActor().chargenSheet.preloadCarouselScene();
    }

    this._overlayPreloadStatus[gamePhase] = true;

    return overlay$;
  }


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

    void (async () => {
      void this.item.update({system: {gamePhase: phase}}, {render: true});
      kLog.log(`Sending End Phase SocketCall AND Preload Socket Call for Phase ${curPhase}`);
      await Promise.all([
        K4Socket.Call("EndPhase", UserTargetRef.players, curPhase),
        K4Socket.Call("PreloadPhase", UserTargetRef.players, phase)
      ]);
      kLog.log(`Preloading Complete! Sending Start Socket Call for Phase ${phase}`);
      await K4Socket.Call("StartPhase", UserTargetRef.players, phase);
    })();
  }

  isCharGenFinishedFor(actor: K4Actor<K4ActorType.pc>) {
    return actor.system.charGen.isFinished ?? false;
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