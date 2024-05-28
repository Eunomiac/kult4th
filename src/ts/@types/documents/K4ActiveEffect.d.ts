// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import C from "../../../scripts/constants";

import K4ActiveEffect from "../../../documents/K4ActiveEffect";

import K4PCSheet from "../../../documents/K4PCSheet";
import K4NPCSheet from "../../../documents/K4NPCSheet";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

enum K4ActiveEffectSourceType {
  actor = "actor", // For effects originating from other actors (e.g. NPC powers, Influence Other PC, Help/Hinder, etc.)
  item = "item", // For effects originating from an item owned by the actor
  stability = "stability", // For penalties derived from low stability
  wound = "wound", // For penalties derived from wounds
  edge = "edge", // For beneficial effects originating from the use of an edge
  none = "none" // For 'floating' effects without a defined source; logic should exist to handle removal/expiration
}




declare global {

  namespace K4ActiveEffect {

    namespace Schema {
      interface Base {
        id: IDString,
        sourceType: K4ActiveEffectSourceType
      }
    }
  }

}