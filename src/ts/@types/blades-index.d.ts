// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import BladesActor from "../BladesActor";
// import BladesClockKeeper from "../documents/items/BladesClockKeeper";
import {BladesItem, BladesClockKeeper, BladesGMTracker} from "../documents/BladesItemProxy";
import BladesConsequence from "../classes/BladesConsequence";
import BladesScene from "../classes/BladesScene";
// import BladesGMTracker from "../documents/items/BladesGMTracker";
import BladesClockKey from "../classes/BladesClockKey";
// import BladesPushAlert from "../classes/BladesPushAlert";
import BladesChat from "../classes/BladesChat";
import BladesDirector from "../classes/BladesDirector";
import type {gsapEffects, GSAPEffect} from "../core/gsap";
import {gsap} from "gsap";
// import C from "../core/constants";


import "./blades-ai";
import "./blades-general-types";

import "./blades-document";

import "./blades-actor";
import "./blades-actor-sheet";

import "./blades-item";
import "./blades-item-sheet";

import "./blades-roll";
import "./blades-dialog";
import "./blades-clock";
import "./blades-tags";
import "./blades-chat";
import "./blades-consequence";

import "./blades-target-link";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

declare module "gsap/all" {
  export * from "gsap";
}

// Declaration for the virtual module "virtual:colors"
declare module "virtual:colors" {
  export const Colors: Record<string, string>;
}

// Extend the gsap module to include new method signatures for Timeline
type gsapEffectKey = keyof typeof gsapEffects;
// declare module "gsap" {
//   interface Timeline {
//     [K in gsapEffectKey]?: (config: Parameters<typeof gsapEffects[K]["effect"]>[1]) => gsap.core.Timeline;
//   }
// }
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


  type GsapConfig = typeof gsapEffects[keyof typeof gsapEffects]["defaults"];
  declare namespace gsap.core {
    class Timeline extends Animation {
      // Use a mapped type to dynamically add methods based on gsapEffects keys
      [K in gsapEffectKey]?: (
        targets: gsap.TweenTarget,
        config: {duration?: number} & GsapConfig
      ) => gsap.core.Timeline;
    }
  }

  declare function fromUuidSync(uuid: string, options?: {
    relative?: Document,
    invalid?: boolean,
    strict?: boolean
  }): BladesDoc | null;

  declare namespace EunoBlades {


    export namespace Settings {
      export interface Debug {
        debugLevel: number,
        debugHooks: boolean,
        whitelist: string,
        blacklist: string
      }
      export interface OpenAI {
        apiKey: string,
        models: Partial<Record<BladesAI.Usage, string>>,
        fileID: string
      }
    }

    export interface Game {
      ClockKeeper: BladesClockKeeper,
      Director: BladesDirector,
      Tracker: BladesGMTracker,
      Rolls: Collection<BladesRoll>,
      RollMods: Collection<BladesRollMod>,
      ClockKeys: Collection<BladesClockKey>,
      Consequences: Collection<BladesConsequence>,
      Tooltips: WeakMap<HTMLElement, gsap.core.Timeline>,

      settings: {
        debug: Settings.Debug,
        openai: Settings.OpenAI
      }
    }
  }

  // Foundry Game Document & Lenient Config for 'game' object
  type BladesScenes = Scenes & { current: BladesScene }

  declare interface Game extends {
    scenes: {current: BladesScene}
  } {
    items: Collection<BladesItem>,
    actors: Collection<BladesActor>,
    user: User,
    users: Collection<User>,
    messages: Collection<BladesChat>,
    scenes: BladesScenes,
    model: {
      Actor: Record<BladesActorType, BladesActorSystem>,
      Item: Record<BladesItemType, BladesItemSystem>
    },
    eunoblades: EunoBlades.Game
  }
  declare interface User {
    id: IDString,
    flags: {
      ["eunos-blades"]?: Record<string, unknown>
    }
  }

  interface TinyMCEConfig {
    skin: boolean;
    skin_url?: string;
    content_css: string;
    font_css: string;
    max_height: number;
    min_height: number;
    autoresize_overflow_padding: number;
    autoresize_bottom_margin: number;
    menubar: boolean;
    statusbar: boolean;
    elementPath: boolean;
    branding: boolean;
    resize: boolean;
    plugins: string;
    save_enablewhendirty: boolean;
    table_default_styles?: Record<string, unknown>;
    style_formats: StyleFormat[];
    style_formats_merge: boolean;
    toolbar: string;
    toolbar_groups: ToolbarGroups;
    toolbar_mode: string;
    quickbars_link_toolbar: boolean;
    quickbars_selection_toolbar: string;
    quickbars_insert_toolbar: string;
    quickbars_table_toolbar: string;
  }

  interface StyleFormat {
    title: string;
    items: StyleItem[];
  }

  interface StyleItem {
    title: string;
    block?: string;
    inline?: string;
    wrapper: boolean;
    classes?: string;
    attributes?: Record<string, string>;
  }

  interface ToolbarGroups {
    formatting: ToolbarGroup;
    alignment: ToolbarGroup;
    lists: ToolbarGroup;
    elements: ToolbarGroup;
  }

  interface ToolbarGroup {
    icon: string;
    tooltip: string;
    items: string;
  }
  declare interface CONFIG {
    debug: {
      logging: boolean,
      hooks: boolean
    },
    TinyMCE: TinyMCEConfig
  }
  interface LenientGlobalVariableTypes { game: never }

  // GreenSock Accessor Object
  // declare const gsap: gsap;
  type BladesTweenTarget = JQuery | gsap.TweenTarget;

  // Global Debugger/Logger
  type eLogParams = [string, ...unknown[]];
  declare const eLog: Record<string, (...content: eLogParams) => void>;

  // JQuery Simplified Events
  type ClickEvent = JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
  type ContextMenuEvent = JQuery.ContextMenuEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
  type TriggerEvent = JQuery.TriggeredEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
  type InputChangeEvent = JQuery.ChangeEvent<HTMLInputElement, undefined, HTMLInputElement, HTMLInputElement>;
  type BlurEvent = JQuery.TypeEventHandler<HTMLElement, undefined, HTMLElement, HTMLElement, "blur">;
  // type DropEvent = JQuery.TypeEventHandler<HTMLElement, undefined, HTMLElement, HTMLElement, "drop">;
  type DropEvent = JQuery.DropEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
  type OnSubmitEvent = Event & ClickEvent & {
    result: Promise<Record<string, string|number|boolean>>
  }
  type ChangeEvent = JQuery.ChangeEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
  type SelectChangeEvent = JQuery.ChangeEvent<HTMLSelectElement, undefined, HTMLSelectElement, HTMLSelectElement>;


}
