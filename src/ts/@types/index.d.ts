// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import C from "../../scripts/constants";
import K4Config from "../../scripts/config";
import K4Actor, {K4ActorType} from "../../documents/K4Actor.js";
import K4Item, {K4ItemType} from "../../documents/K4Item.js";
import K4PCSheet from "../../documents/K4PCSheet.js";
import K4NPCSheet from "../../documents/K4NPCSheet.js";
import K4ItemSheet from "../../documents/K4ItemSheet.js";
import K4ActiveEffect from "../../documents/K4ActiveEffect.js";
import "./documents";
import "./scripts";
import "./general-types";
import "./system-types";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion
declare module "gsap/all" {
  export * from "gsap";
}
// Declaration for the virtual module "virtual:colors"
declare module "virtual:colors" {
  export const Colors: Record<string, string>;
}

declare global {

  namespace foundry {
    namespace data {
      namespace fields {
        class ObjectField extends foundry.data.fields.OBJECT_FIELD {
        }
      }
    }
  }

  declare class ObjectField extends foundry.data.fields.OBJECT_FIELD { }

  declare interface Game {
    dice3d: {
      showForRoll: (r: Roll) => Promise<void>
    }
  }

  declare interface Game extends {
    scenes: Scenes
  } {
    items: Collection<ActorDoc>,
    actors: Collection<ItemDoc>,
    user: UserDoc,
    users: Collection<UserDoc>,
    messages: Collection<ChatMessageDoc>,
    scenes: Scenes,
    model: {
      Actor: Record<K4ActorType, Actor["data"]["_source"]>,
      Item: Record<K4ItemType, Item["data"]["_source"]>
    }
  }
  interface LenientGlobalVariableTypes { game: never }

  declare interface CONFIG {
    debug: {
      logging: boolean,
      hooks: boolean
    },
    TinyMCE: TinyMCEConfig,
    K4: typeof K4Config
  }

  declare const cqApi: {
    reprocess: () => void,
    reparse: () => void,
    reevaluate: () => void,
    config: Record<string, unknown>
  };

  declare const kLog: {
    display: (...content: [string, ...unknown[]]) => void,
    log: (...content: [string, ...unknown[]]) => void,
    error: (...content: [string, ...unknown[]]) => void,
    hbsLog: (...content: [string, ...unknown[]]) => void
  };

  interface LenientGlobalVariableTypes {
    game: never;
  }
  interface SourceConfig {
    Actor: K4ActorSourceData.any,
    Item: K4ItemSourceData.any
  }

  interface DataConfig {
    Actor: K4ActorPropertiesData.any,
    Item: K4ItemPropertiesData.any
  }
  interface DocumentClassConfig {
    Actor: ConstructorOf<ActorDoc>;
    Item: ConstructorOf<ItemDoc>;
    ActiveEffect: ConstructorOf<ActiveEffectDoc>;
    ChatMessage: ConstructorOf<ChatMessageDoc>;
    Dialog: ConstructorOf<DialogDoc>;
    Roll: ConstructorOf<RollDoc>;
    Scene: ConstructorOf<SceneDoc>;
    User: ConstructorOf<UserDoc>;
  }
}
