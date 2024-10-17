import K4Config from "../scripts/config";
import {DebugReport} from "../scripts/logger";

import K4ActiveEffect from "../documents/K4ActiveEffect";
import K4Actor from "../documents/K4Actor";
import K4ChatMessage from "../documents/K4ChatMessage";
import K4Dialog from "../documents/K4Dialog";
import K4Item from "../documents/K4Item";
import K4Roll, {K4RollResult} from "../documents/K4Roll";
import K4Scene from "../documents/K4Scene";


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
      Actor: typeof K4Actor;
      Item: typeof K4Item;
      ActiveEffect: typeof K4ActiveEffect;
      ChatMessage: typeof K4ChatMessage;
      Dialog: typeof K4Dialog;
      Roll: typeof K4Roll;
      Scene: typeof K4Scene;
  }

  // namespace Document {
  //   export type Any = foundry.abstract.Document.Any;
  // }

  // export import EmbeddedCollection = foundry.abstract.EmbeddedCollection;
}

declare global {
  const socketlib: SocketLib;
  const socket: Socket;

  // function fromUuidSync(uuid: string, options?: {
  //   relative?: foundry.abstract.Document.Any,
  //   invalid?: boolean,
  //   strict?: boolean
  // }): EntityDoc | null;

  function $clamp(element: HTMLElement, options?: ClampOptions): ClampResponse;

  interface Game {
    rolls: Collection<K4Roll>,
  }

  interface CONFIG {
    K4: typeof K4Config
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
    Actor: K4Actor.Source,
    Item: K4Item.Source
  }

  interface FlagConfig {
    Actor: {
      kult4th: {
        sheetTab: string,
        collapsedColumns: Record<string, boolean>
      }
    };
    ActiveEffect: {
      kult4th: {
        data: K4ActiveEffect.ExtendedData
      };
    };
    ChatMessage: {
      kult4th: {
        cssClasses: string[];
        isSummary: boolean;
        isAnimated: boolean;
        isRoll: boolean;
        isTrigger: boolean;
        isEdge: boolean;
        rollOutcome?: K4RollResult;
        rollData?: K4Roll.Serialized.Base;
        chatSelectListeners?: Record<
          string, // the listRef
          {
            // The necessary parameters to run the listener and construct the onSelect() callback
          }
        >,
        chatSelectValue?: number // The index of the selected value
      }
    }
  }

  // interface ActiveEffect {
  //   get data(): ActiveEffectData;
  // }

  // interface DataConfig {
  //   Actor: K4ActorPropertiesData.any,
  //   Item: K4ItemPropertiesData.any
  // }


}