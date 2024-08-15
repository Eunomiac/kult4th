import K4Config from "../scripts/config";
import K4Roll from "../documents/K4Roll.js";
import {DebugReport} from "../scripts/logger.js";

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