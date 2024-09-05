// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import C, {K4Attribute} from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import K4Actor, {K4ActorType} from "./K4Actor.js";
import K4Item, {K4ItemType} from "./K4Item.js";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion


class K4GMTracker {

  /**
   * Pre-Initialization of the K4GMTracker class. This method should be run during the "init" hook.
   *
   * @returns {Promise<void>} A promise that resolves when the hook is registered.
   */
    static PreInitialize(): void {
      /* Insert PreInitiailize Steps Here */
    }
    // #endregion

  private static instance: K4GMTracker | null = null;

  /**
   * Initializes the K4GMTracker, ensuring a single instance of the GMTracker item exists.
   * @returns {Promise<void>}.
   */
  public static async Initialize(): Promise<void> {

    if (!game.user?.isGM) {
      return;
    }

    // Check if a GMTracker item already exists
    let trackerItem: Maybe<K4Item<K4ItemType.gmtracker>> = game.items.find((item: K4Item): item is K4Item<K4ItemType.gmtracker> => item.type === K4ItemType.gmtracker);

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
      throw new Error("GM Tracker not initialized");
    }
    return K4GMTracker.instance;
  }

  private constructor(private trackerItem: K4Item<K4ItemType.gmtracker>) {
    // Private constructor to prevent direct instantiation
  }

  // Add other methods and properties as needed for the K4GMTracker class

}

export default K4GMTracker;