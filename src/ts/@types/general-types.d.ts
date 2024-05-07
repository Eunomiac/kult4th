// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import C from "../scripts/constants";
import K4Config from "../scripts/config";
import K4Actor from "../documents/K4Actor.js";
import K4Item from "../documents/K4Item.js";
import K4PCSheet from "../documents/K4PCSheet.js";
import K4NPCSheet from "../documents/K4NPCSheet.js";
import K4ItemSheet from "../documents/K4ItemSheet.js";
import K4ActiveEffect from "../documents/K4ActiveEffect.js";

import {gsap} from "gsap/all";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

type GsapTester = typeof gsap;

// #region CONFIGURATION OF SYSTEM CLASSES
type ActorDoc = K4Actor; // Actor;
type ItemDoc = K4Item; // Item;
type ActorSheetDoc = K4PCSheet | K4NPCSheet; // ActorSheet;
type ItemSheetDoc = K4ItemSheet; // ItemSheet;

type ActiveEffectDoc = K4ActiveEffect; // ActiveEffect;
type ChatMessageDoc = ChatMessage; // ChatMessage;
type DialogDoc = Dialog; // Dialog;
type RollDoc = Roll; // Roll;
type SceneDoc = Scene; // Scene;
type UserDoc = User; // User;
// #endregion

// #region UTILITY TYPES
type HexDigit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "A" | "B" | "C" | "D" | "E" | "F";
type MaybeSpace = " " | "";
type FlexComma = `${MaybeSpace},${MaybeSpace}`;
// #endregion

declare global {
  // #region MISCELLANEOUS TYPE ALIASES (nonfunctional; for clarity) ~

  // Represents a list of a certain type
  type List<Type = unknown> = Record<key, Type>

  // Represents an index of a certain type
  type Index<Type = unknown> = List<Type> | Type[];

  // Represents a string, false, or undefined
  type MaybeStringOrFalse = string | false | undefined;

  // Represents a function with an unknown number of parameters, returning a value of type R
  type func<R = unknown> = (...args: unknown[]) => R;

  // Represents an async function with an unknown number of parameters, returning a Promise resolving to a value of type R
  type asyncFunc<R = unknown> = (...args: unknown[]) => Promise<R>;

  // Represents any class constructor with an unknown number of parameters
  type AnyClass<T = unknown> = new (...args: unknown[]) => T;

  // Represents a key which can be a string, number, or symbol
  type key = string | number | symbol;

  // Represents a small integer from -10 to 10
  type SmallInt = -10 | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  // Represents a string-like value
  type StringLike = string | number | boolean | null | undefined;

  // Represents a number represented as a string
  type NumString = `${number}`;

  // Represents an object with number-strings as keys
  type StringArray<T> = Record<NumString, T>;

  // Represents "true" or "false" as a string
  type BoolString = `${boolean}`;

  // Represents falsy values and empty objects to be pruned when cleaning list of values
  type UncleanValues = false | null | undefined | "" | 0 | Record<string, never> | never[];

  // Represents a string conversion to title case
  type tCase<S extends string> = S extends `${infer A} ${infer B}`
    ? `${tCase<A>} ${tCase<B>}`
    : Capitalize<Lowercase<S>>;

  // Represents an allowed gender key
  type Gender = "M" | "F" | "U" | "X";

  // Represents an allowed direction
  type Direction = "top" | "bottom" | "left" | "right";

  // Represents an allowed string case
  type StringCase = "upper" | "lower" | "sentence" | "title";

  // Represents HTML code as a string
  type HTMLCode = string & {__htmlStringBrand: never};

  // Represents a HEX color as a string, allowing for six (RGB) or eight (RGBA) uppercase hexadecimal digits
  type HexColor = `#${HexDigit}${HexDigit}${HexDigit}` | `#${HexDigit}${HexDigit}${HexDigit}${HexDigit}`;

  // Represents an RGB color as a string
  type RGBColor = `rgb(${number}${FlexComma}${number}${FlexComma}${number})` |
    `rgba(${number}${FlexComma}${number}${FlexComma}${number}${FlexComma}${number})`;

  // Represents a key of a certain type
  type KeyOf<T> = keyof T;

  // Represents a value of a certain type
  type ValOf<T> = T extends unknown[] | readonly unknown[] ? T[number] : T[keyof T];

  // Represents a function that takes a key and an optional value and returns unknown
  type keyFunc = (key: key, val?: unknown) => unknown;

  // Represents a function that takes a value and an optional key and returns any
  type valFunc = (val: unknown, key?: key) => unknown;

  // Represents a test function
  type testFunc<Type extends keyFunc | valFunc> = (...args: Parameters<Type>) => boolean;

  // Represents a map function
  type mapFunc<Type extends keyFunc | valFunc> = (...args: Parameters<Type>) => ReturnType<Type>;

  // Represents a check test
  type checkTest = ((...args: unknown[]) => unknown) | testFunc<keyFunc> | testFunc<valFunc> | RegExp | number | string;
  // #endregion

  // Represents a document id as a string
  type IDString = string & {__idStringBrand: never};

  // Represents a UUID string, of the form /^[A-Za-z]+\.[A-Za-z0-9]{16}$/
  type UUIDString = string & {__uuidStringBrand: never}; // This type is compatible with string, but requires explicit casting, enforcing the UUID pattern.

  // Represents a dotkey
  type DotKey = string & {__dotKeyBrand: never};

  // Represents a dotkey appropriate for an update() data object
  type TargetKey = string & DotKey & {__targetKeyBrand: never};

  // Represents a dotkey point to a a flag instead of the document schema
  type TargetFlagKey = string & DotKey & {__targetFlagKeyBrand: never};

  // Represents a jQuery text term
  type jQueryTextTerm = string | number | boolean | (
    (this: Element, index: number, text: string) => string | number | boolean
  );

  // Represents an object describing dimensions of an HTML element, of form {x: number, y: number, width: number, height: number}
  interface ElemPosData {x: number, y: number, width: number, height: number}

  // Represents an object describing dimensions of an HTML element, in the form of a DOMRect object with mutable properties.
  type MutableRect = Omit<Mutable<DOMRect>, "toJSON">;

  /**
   * Represents a type that may be either of type T or undefined.
   * @template T - The type that may be present or may be undefined.
   */
  type Maybe<T> = T | undefined;

  // Represents a tuple of two elements
  type Tuple<T1, T2 = T1> = [T1, T2];

  // Represents a tuple of three elements
  type Threeple<T1, T2 = T1, T3 = T2> = [T1, T2, T3];

  // Represents an object with frozen properties
  type FreezeProps<T> = {
    [Prop in keyof T as string extends Prop ? never : number extends Prop ? never : Prop]: T[Prop]
  };

  // Represents a deep-partial of an object
  type FullPartial<T> = {
    [P in keyof T]?: T[P] extends object ? FullPartial<T[P]> : T[P];
  };

  // Represents a mutable version of a readonly type
  type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
  };

  // Represents a gsap animation
  type gsapAnim = gsap.core.Tween | gsap.core.Timeline;

  // Represents an Actor or Item document
  type EntityDoc = ActorDoc | ItemDoc;

  // Represents any entity document sheet
  type EntitySheet = ActorSheetDoc | ItemSheetDoc;

  // Represents any entity document or entity document sheet
  type AnyEntity = EntityDoc | EntitySheet;

  // Represents a constructor for an entity document
  type EntityConstructor = ConstructorOf<EntityDoc>;

  // Represents a constructor for any entity
  type AnyEntityConstructor = ConstructorOf<AnyEntity>;

  // Represents any document that can be the target of a BladesTargetLink subclass.
  type TargetLinkDoc = EntityDoc | ChatMessageDoc | UserDoc;

  // Represents a reference to a Blades document
  type DocRef = string | EntityDoc;

  // Represents a reference to a Blades actor
  type ActorRef = string | ActorDoc;

  // Represents a reference to a Blades item
  type ItemRef = string | ItemDoc;

  // Utility Types for Variable Template Values
  interface ValueMax {max: number, value: number}
  type NamedValueMax = ValueMax & {name: string};

  interface Scenes {
    current: SceneDoc;
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

  // GreenSock Accessor Object
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
  type TweenTarget = JQuery | gsap.TweenTarget;

  // JQuery Simplified Events
  type ClickEvent = JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
  type ContextMenuEvent = JQuery.ContextMenuEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
  type TriggerEvent = JQuery.TriggeredEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
  type InputChangeEvent = JQuery.ChangeEvent<HTMLInputElement, undefined, HTMLInputElement, HTMLInputElement>;
  type BlurEvent = JQuery.BlurEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
  type DropEvent = JQuery.DropEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
  type OnSubmitEvent = Event & ClickEvent & {
    result: Promise<Record<string, string|number|boolean>>
  }
  type ChangeEvent = JQuery.ChangeEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
  type SelectChangeEvent = JQuery.ChangeEvent<HTMLSelectElement, undefined, HTMLSelectElement, HTMLSelectElement>;

  declare function fromUuidSync(uuid: string, options?: {
    relative?: Document,
    invalid?: boolean,
    strict?: boolean
  }): EntityDoc | null;

}
