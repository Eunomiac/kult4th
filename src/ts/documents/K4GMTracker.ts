// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import C, {K4Attribute, K4GamePhase} from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import K4Actor, {K4ActorType} from "./K4Actor.js";
import K4Item, {K4ItemType} from "./K4Item.js";
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

  /**
   * Pre-Initialization of the K4GMTracker class. This method should be run during the "init" hook.
   *
   * @returns {Promise<void>} A promise that resolves when the hook is registered.
   */
    static PreInitialize(): void {
      /* Insert PreInitiailize Steps Here */
    }

  static instance: K4GMTracker | null = null;

  /**
   * Initializes the K4GMTracker, ensuring a single instance of the GMTracker item exists.
   * @returns {Promise<void>}.
   */
  public static async Initialize(): Promise<void> {

    if (!getUser().isGM) {
      return;
    }

    // Check if a GMTracker item already exists
    let trackerItem: Maybe<K4Item<K4ItemType.gmtracker>> = getGame().items.find((item: K4Item): item is K4Item<K4ItemType.gmtracker> => item.type === K4ItemType.gmtracker);

    if (!trackerItem) {
      // Create a new GMTracker item if it doesn't exist
      trackerItem = await K4Item.create({
        name: "GM Tracker",
        img: "systems/kult4th/assets/icons/gm-tracker.webp",
        type: K4ItemType.gmtracker
      }, { renderSheet: false }) as Maybe<K4Item<K4ItemType.gmtracker>>;
    }

    if (!trackerItem) {
      throw new Error("Failed to create GM Tracker item");
    }

    K4GMTracker.instance = new K4GMTracker(trackerItem);
    return;
  }

  public static Get(): K4GMTracker {
    if (!K4GMTracker.instance) {
      const instance = getGame().items.find((item: K4Item): item is K4Item<K4ItemType.gmtracker> => item.type === K4ItemType.gmtracker);
      if (!instance) {
        throw new Error("GM Tracker not initialized");
      }
      K4GMTracker.instance = new K4GMTracker(instance);
    }
    return K4GMTracker.instance;
  }

  private _trackerItem: K4Item<K4ItemType.gmtracker> & {system: K4GMTracker.System};
  private constructor(private trackerItem: K4Item<K4ItemType.gmtracker>) {
    // Private constructor to prevent direct instantiation
    this._trackerItem = trackerItem as K4Item<K4ItemType.gmtracker> & {system: K4GMTracker.System};
  }

  get tracker(): K4Item<K4ItemType.gmtracker> & {system: K4GMTracker.System} {
    return this._trackerItem;
  }

  get elem$(): Maybe<JQuery> {
    if (this.tracker.sheet.rendered) {
      return $(this.tracker.sheet.element);
    }
    return undefined;
  }

  get system(): K4GMTracker.System {
    return this.tracker.system;
  }

  get phase(): K4GamePhase {
    return this.system.gamePhase;
  }
  set phase(phase: K4GamePhase) {
    void this.tracker.update({system: {gamePhase: phase}}, {render: true});
  }


  activateSheetListeners(html: JQuery): void {

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
  }

}

export default K4GMTracker;