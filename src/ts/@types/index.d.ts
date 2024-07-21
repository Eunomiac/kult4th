import K4Config from "../scripts/config";
import K4Roll from "../documents/K4Roll.js";

import "./general-types";
import "./system-types";
import "./league-types";

declare module "virtual:colors" {
  export const Colors: Record<string, string>;
}
declare module "@league-of-foundry-developers/foundry-vtt-types" {
  export interface Scenes {
    get current(): SceneDoc;
  }

  export function randomID(length?: number): IDString;
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
    items: Collection<ItemDoc>,
    actors: Collection<ActorDoc>,
    user: UserDoc,
    users: Collection<UserDoc>,
    rolls: Collection<K4Roll>,
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
      hooks: boolean,
      customFunctionParams: Record<string, SystemScalar[]>
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

  interface ActiveEffect {
    get data(): ActiveEffectData;
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