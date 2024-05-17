import K4Config from "../scripts/config";

import "./documents";
import "./scripts";
import "./general-types";
import "./system-types";
import "./league-types";

// import * as gsap from "gsap/all";
// declare module "gsap/all";
// Declare the GSAP module
// declare module "gsap/all" {
//   export * from "gsap";
//   export * from "gsap/CustomEase";
//   export * from "gsap/EasePack";
//   export * from "gsap/Flip";
//   export * from "gsap/Observer";
//   export * from "gsap/Draggable";
//   export * from "gsap/MotionPathPlugin";
//   export * from "gsap/PixiPlugin";
//   export * from "gsap/TextPlugin";
//   export * from "gsap/MorphSVGPlugin";
//   export * from "gsap/GSDevTools";
// }
// declare module "gsap/MorphSVGPlugin";
// declare module "gsap/GSDevTools";
// export {MorphSVGPlugin} from "gsap/MorphSVGPlugin";
// export {PixiPlugin} from "gsap/PixiPlugin";
// export {TextPlugin} from "gsap/TextPlugin";
// export {GSDevTools} from "gsap/GSDevTools";
// Declaration for the virtual module "virtual:colors"

type SceneDoc = Scene;
type ActorDoc = K4Actor;
type ItemDoc = K4Item;
type ActiveEffectDoc = ActiveEffect;
type ChatMessageDoc = ChatMessage;
type DialogDoc = Dialog;
type RollDoc = Roll;
type UserDoc = User;



declare module "virtual:colors" {
  export const Colors: Record<string, string>;
}
declare module "@league-of-foundry-developers/foundry-vtt-types" {
  export interface Scenes {
    get current(): SceneDoc;
  }
}

interface ClampOptions {
  clamp?: number | string;
  useNativeClamp?: boolean;
  splitOnChars?: string[];
  animate?: boolean | number;
  truncationChar?: string;
  truncationHTML?: string;
}

interface ClampResponse {
  original: string;
  clamped: string | undefined;
}

declare global {
  function fromUuidSync(uuid: string, options?: {
    relative?: Document,
    invalid?: boolean,
    strict?: boolean
  }): EntityDoc | null;

  function $clamp(element: HTMLElement, options?: ClampOptions): ClampResponse;

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
    K4: typeof K4Config,
    compatibility: {
      mode: number
    }
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

  // interface DataConfig {
  //   Actor: K4ActorPropertiesData.any,
  //   Item: K4ItemPropertiesData.any
  // }

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