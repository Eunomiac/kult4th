import "./documents";
import "./scripts";
import "./general-types";
import "./system-types";

import * as gsap from "gsap/all";
declare module "gsap/all";

// Declaration for the virtual module "virtual:colors"
declare module "virtual:colors" {
  export const Colors: Record<string, string>;
}
declare module "@league-of-foundry-developers/foundry-vtt-types" {
  export interface Scenes {
    get current(): SceneDoc;
  }
}
declare global {
  function fromUuidSync(uuid: string, options?: {
    relative?: Document,
    invalid?: boolean,
    strict?: boolean
  }): EntityDoc | null;

  namespace foundry {
    namespace data {
      namespace fields {
        class ObjectField extends foundry.data.fields.OBJECT_FIELD { }
      }
    }
  }
  interface LenientGlobalVariableTypes {
    game: never,
    ui: never,
    canvas: never,
    socket: never
  }
  interface Game {
    dice3d: {
      showForRoll: (r: Roll) => Promise<void>
    },
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

  interface CONFIG {
    debug: {
      logging: boolean,
      hooks: boolean
    },
    TinyMCE: TinyMCEConfig,
    K4: typeof K4Config
  }

  const cqApi: {
    reprocess: () => void,
    reparse: () => void,
    reevaluate: () => void,
    config: Record<string, unknown>
  };

  const kLog: {
    display: (...content: [string, ...unknown[]]) => void,
    log: (...content: [string, ...unknown[]]) => void,
    error: (...content: [string, ...unknown[]]) => void,
    hbsLog: (...content: [string, ...unknown[]]) => void
  };

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