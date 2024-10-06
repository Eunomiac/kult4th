import K4Config from "../scripts/config";
// import K4Roll from "../documents/K4Roll.js";
import {DebugReport} from "../scripts/logger.js";

import K4ActiveEffect from "../documents/K4ActiveEffect.js";
import type K4Actor from "../documents/K4Actor.js";
// import K4Alert from "../documents/K4Alert.js";
// import K4CharGen from "../documents/K4CharGen.js";
import type K4ChatMessage from "../documents/K4ChatMessage.js";
// import K4Dialog from "../documents/K4Dialog.js";
// import K4GMTracker from "../documents/K4GMTracker.js";
import type K4Item from "../documents/K4Item.js";
// import K4ItemSheet from "../documents/K4ItemSheet.js";
// import K4NPCSheet from "../documents/K4NPCSheet.js";
// import K4PCSheet from "../documents/K4PCSheet.js";
import type K4Roll from "../documents/K4Roll.js";
// import K4Scene from "../documents/K4Scene.js";
// import K4Socket from "../documents/K4Socket.js";
// import K4Sound from "../documents/K4Sound.js";
// import K4TextEnricher from "../documents/K4TextEnricher.js";

import "./general-types";
import "./system-types";
import "./league-types";
import {
  Socket,
  SocketLib
} from "./socketlib";

// type STest = typeof socketlib;

declare module "virtual:colors" {
  export const Colors: Record<string, string>;
}
// declare module "@league-of-foundry-developers/foundry-vtt-types" {
//   export interface Scenes {
//     get current(): SceneDoc;
//   }

//   export function randomID(length?: number): IDString;
// }

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
  interface DocumentClassConfig {
      Actor: K4Actor;
      Item: K4Item;
      // ActiveEffect: typeof K4ActiveEffect;
      ChatMessage: K4ChatMessage;
  }
}

declare global {
  const socketlib: SocketLib;
  const socket: Socket;

  function fromUuidSync(uuid: string, options?: {
    relative?: Document,
    invalid?: boolean,
    strict?: boolean
  }): EntityDoc | null;

  function $clamp(element: HTMLElement, options?: ClampOptions): ClampResponse;

  interface Game {
    rolls: Collection<K4Roll>,
  }

  interface CONFIG {
    debug: {
      logging: boolean,
      hooks: boolean,
      customFunctionParams: Record<string, SystemScalar[]>,
      openReport: Maybe<string>,
      openReports: Maybe<Record<string, DebugReport>>,
      isDisablingCharGen: boolean
    },
    K4: typeof K4Config,
    compatibility: {
      mode: number
    }
  }

  const ACTOR: K4Actor;

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
    hbsLog: (...content: [string, ...unknown[]]) => void,
    openReport: (name: string, title?: string, dbLevel?: number) => void,
    report: (name: string, ...content: [string, ...unknown[]]) => void,
    closeReport: (name: string) => void,
  };

  interface SourceConfig {
    Actor: K4ActorSourceData.any,
    Item: K4ItemSourceData.any
  }

  // interface ActiveEffect {
  //   get data(): ActiveEffectData;
  // }

  // interface DataConfig {
  //   Actor: K4ActorPropertiesData.any,
  //   Item: K4ItemPropertiesData.any
  // }


}