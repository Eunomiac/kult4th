// #region IMPORTS ~
import C, {K4Attribute} from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import K4Actor, {K4ActorType} from "./K4Actor.js";
import K4Item, {K4ItemType, K4ItemSubType, K4ItemRange, K4WeaponClass} from "./K4Item.js";
import K4Roll from "./K4Roll.js";
import K4Scene from "./K4Scene.js";
import K4ActiveEffectSheet from "./K4ActiveEffectSheet.js";
import K4ChatMessage from "./K4ChatMessage.js";
import K4Dialog from "./K4Dialog.js";
// #endregion

/** #region == K4 Active Effects == ~
  Active Effects are a powerful and flexible system for applying various modifications to actors, rolls, and other game elements. Here are some key concepts and design considerations:

  CLARIFICATION OF TERMILOGY
  ==========================

  "EFFECT"
    The K4ActiveEffect instance.

  "CHANGE"
    A single discrete modification applied by the Effect. Changes are stored in Effect.changes as
    an array of {key, mode, value} objects. For custom effects:
      - key: the name of a custom function
      - mode: 0
      - value: a string definition of a simple key:value data object to guide that function's behavior

  "PARENT"
    The K4Actor instance to which the Effect's Changes are applied. Effects owned by other entities (e.g., items)
    do not apply their Changes until they are transferred to an Actor owner.

  "SOURCE"
    The entity, event or circumstance that empowers the Effect, that is ultimately responsible for removing it when it no longer applies.
    An Effect's Source is usually, but not always, the entity that created the Effect. Valid Sources are:
      "item": The effect is applied by an item owned by the actor.
        - REMOVAL: the item is removed from the actor
      "roll": The effect was applied by a roll result.
        - REMOVAL: Must be specified, defaults to a single-use, toggleable effect that is initially disabled
      "wound": The effect is applied by the actor's wound state.
        - every actor will have a singleton instance of this ActiveEffect, which is refreshed whenever the actor's wounds change
        - REMOVAL: never (will apply zero effects at no wounds)
      "stability": The effect is applied by the actor's stability state.
        - every actor will have a singleton instance of this ActiveEffect, which is refreshed whenever the actor's stability changes
        - REMOVAL: never (will apply zero modifiers at full Stability)
      "scene": The effect is applied by the active scene to all Actors present
        - REMOVAL: when the scene ends
      "session": The effect is applied by the active session to all Actors present
        - REMOVAL: when the session ends
      "gm": The effect is applied by the GM manually to selected actors via the GM Screen
        - REMOVAL: no automatic removal; manually controlled by the GM

  "TARGET"
    The actual Document entity the Changes affect. Valid Targets are:
      "actor": The actor's base data
      "item": An item owned by the actor
      "roll": A roll made by the actor
      "gm": Information displayed on the GM Screen

  SCHEMA
  ======
  Foundry does not support defining a custom schema for an ActiveEffect subclass. Instead, schema data is stored serverside
  in the "kult4th" namespace of the K4ActiveEffect's flags, and merged with the ActiveEffect's native data schema during the
  prepareData() method.
*/

// #region -- TYPES & ENUMS --
// #region ENUMS ~

/** == EFFECT SOURCE ==
 * The category of entity, event or circumstance that empowers the Effect, that is ultimately responsible for removing it when it no longer applies.
 * An Effect's Source is usually, but not always, the entity that created the Effect.
 */
enum EffectSourceType {
  ownedItem = "ownedItem", // The Effect is applied by an item owned by the Actor. REMOVAL: the item is removed from the Actor.
  moveResult = "moveResult", // The Effect was applied by a move result, either triggered or rolled. REMOVAL: Must be specified (default = single-use, toggleable effect)
  claimedResult = "claimedResult", // The Effect was applied by clicking on an effect link in a move result chat card. REMOVAL: Must be specified (default = single-use, toggleable effect)
  scene = "scene", // The Effect was applied by a K4Scene document to all actors present. REMOVAL: when the Scene ends.
  actor = "actor", // The Effect is created by the Actor and applied directly when the Actor is created. REMOVAL: Never.
  gm = "gm" // The Effect is applied by the GM manually to selected actors via the GM Screen. REMOVAL: no automatic removal; manually controlled by the GM
}

/** == EFFECT DURATION ==
 * The duration of the Effect, which determines when it is automatically removed.
 */
enum EffectDuration {
  instant = "instant", // The Effect is instant, and is never actually created: instead of being created, its changes are permanently applied
  ongoing = "ongoing", // The Effect is ongoing and is not automatically removed by duration checks (its removal, if not permanent, must be handled elsewhere).
  limited = "limited", // The Effect has a limited number of uses (defined in the uses property) and is then removed.
                          // - "ongoing" effects can also have a uses property, but they are not removed when uses.value === uses.max (i.e. they can be "refilled")
  scene = "scene", // The Effect is applied for the duration of the active Scene and is removed when the Scene ends.
  session = "session", // The Effect is applied for the duration of the active Session and is removed when the Session ends.
}

/** == EFFECT RESET ON ==
 * For 'canToggle' effects, the conditions under which the effect is reset to its default state. *
 */
enum EffectResetOn {
  never = "never", // The effect is never reset to its default state, and will retain its toggle state indefinitely.
  onUse = "onUse", // The effect is reset to its default state whenever it is used (i.e. when it is applied to a roll or triggered result)
  onScene = "onScene", // The effect is reset to its default state whenever the active Scene changes
  onSession = "onSession", // The effect is reset to its default state whenever the active Session changes
  onSheetOpen = "onSheetOpen" // The effect is reset to its default state whenever the Actor's character sheet is opened
}

enum PromptInputType {
  buttons = "buttons",
  text = "text",
  confirm = "confirm"
}
// #endregion
// #region TYPES ~
namespace K4Change {
  export type Data = EffectChangeData;

   namespace Modes {
    export type ModifyMove =
      "PushElement"|
      "AppendText";
    export type ModifyTracker =
      "Add"|
      "Subtract";
    export type ModifyAttack =
      "Add"|
      "Subtract"|
      "Set"
    export type ModifyProperty =
      "Add"|
      "Subtract"|
      "Set"|
      "Downgrade";
    export type ModifyRoll =
      "Add"|
      "Subtract";
    export type ModifyChange =
      "Add"|
      "Subtract"|
      "Set";
  }

  namespace Comps {
    export interface CreateAttack {
      filter: ValueOrArray<string>, // Filter to determine the type(s) of weapons to add this attack to. Refer to TAGS on the weapon (e.g. "sword"), or use a hyphen to check a property (e.g. "range-arm"). Precede with an '!' to negate the filter. ALL filters must apply (create a new change for "or" filters)
      name: string, // Name of the attack
      tags: ValueOrArray<string> // Tags to apply to the attack
      range: ValueOrArray<K4ItemRange> // Range(s) of the attack.
      harm: number, // The harm value of the attack
      special?: string, // Any special rules associated with the attack
      ammo?: number, // Ammo usage of the attack
    }
    export interface CreateItem<T extends K4ItemType> extends Omit<K4Item.Schema<T>, "type"> {
      type: T, // Type of item being created
      name: string, // Name of item being created
    }
    export interface CreateTracker {
      name: string, // Name of the tracker being created
      target: `FLAGS.${string}` // Where to store the tracker data on the active effect
      imgFolder: string, // Folder path to the images for the tracker. Must include one .webp folder for each possible value (including min and max), named "0.webp", "1.webp", etc.
      min: number, // Minimum value of the tracker
      max: number, // Maximum value of the tracker
      startValue: number, // Initial value of the tracker
    }
    export interface ModifyTracker {
      filter: ValueOrArray<string>, // Filter to determine the tracker(s) to modify. Precede with an '!' to negate the filter. ALL filters must apply (create a new change for "or" filters)
      target: string, // The property of the tracker data to modify (e.g. "value")
      mode: Modes.ModifyTracker, // The mode of modification to use
      value: SystemScalar, // The value to apply to the modification
    }
    export interface ModifyAttack {
      filter: ValueOrArray<string>, // Filter to determine the type(s) of attacks to modify. Refer to TAGS on the ATTACK (e.g. "sword"), or use a hyphen to check a property (e.g. "range-arm"). Precede with an '!' to negate the filter. ALL filters must apply (create a new change for "or" filters)
      target: string, // Dotkey target of property to modify (e.g. "harm")
      mode: Modes.ModifyAttack, // Mode of the custom function to use
      value: SystemScalar, // Value to apply to the modification
    }
    export interface ModifyMove {
      filter: ValueOrArray<string>, // Filter to determine the type(s) of attacks to modify. Precede with an '!' to negate the filter. ALL filters must apply (create a new change for "or" filters)
      target: string, // Dotkey target of property to modify (e.g. "system.lists.questions.items")
      mode: Modes.ModifyMove, // Mode of the custom function to use
      value: SystemScalar, // Value to apply to the modification
    }
    export interface ModifyRoll extends Partial<Omit<PromptForData, "target">> {
      filter: ValueOrArray<string>, // Filter to determine the type(s) of rolls this change applies to. Can be "all", an item type, a specific item name, or the attribute rolled. Precede with an '!' to negate the filter. ALL filters must apply (create a new change for "or" filters).
      mode: Modes.ModifyRoll, // Mode of the custom function to use
      value: SystemScalar // Value to apply to the modification
    }
    export interface ModifyProperty {
      filter: ValueOrArray<string>, // Filter to determine the type(s) of attacks to modify. Almost always "actor". Precede with an '!' to negate the filter. ALL filters must apply (create a new change for "or" filters)
      target: string, // Dotkey target of property to modify (e.g. "system.modifiers.wounds_critical.1.all")
      mode: Modes.ModifyProperty, // Mode of the custom function to use
      value: SystemScalar, // Value to apply to the modification
    }
    export interface ModifyChange {
      filter: ValueOrArray<string>, // Filter identifying the ORIGIN ITEM bearing the ActiveEffect that contains the Change to be modified
      target: string, // Dotkey path ending with "effects", to the array containing the Change to be modified
      changeFilter: ValueOrArray<string>, // Filter identifying the Change to be modified within the targeted changeData array
      mode: Modes.ModifyChange, // Mode of the custom function to use on the Change
      changeTarget: string, // Dotkey path within the Change to the property to modify
      value: SystemScalar, // Value to apply to the modification
    }
    export interface PromptForData {
      title: string,
      bodyText: string,
      subText?: string,
      target: `FLAGS.${string}`, // where to store data on active effect
      input: PromptInputType, // Type of input requested
      inputVals?: SystemScalar[], // Values for buttons or other input types
      default?: string, // Default value if prompt window closed; if undefined, item creation is cancelled
    }
    export interface RequireItem {
      filter: ValueOrArray<string>, // Name of required item(s)
    }
  }

  export type FuncName = keyof typeof CUSTOM_FUNCTIONS;

  export type FuncData<N extends keyof typeof CUSTOM_FUNCTIONS, T extends K4ItemType = K4ItemType> =
      N extends "CreateAttack" ? Comps.CreateAttack :
      N extends "CreateItem" ? Comps.CreateItem<T> :
      N extends "CreateTracker" ? Comps.CreateTracker :
      N extends "ModifyTracker" ? Comps.ModifyTracker :
      N extends "ModifyAttack" ? Comps.ModifyAttack :
      N extends "ModifyMove" ? Comps.ModifyMove :
      N extends "ModifyProperty" ? Comps.ModifyProperty :
      N extends "ModifyChange" ? Comps.ModifyChange :
      N extends "PromptForData" ? Comps.PromptForData :
      N extends "RequireItem" ? Comps.RequireItem :
      N extends "ModifyRoll" ? Comps.ModifyRoll :
      never;
    export type AnyFuncData = Comps.CreateAttack|Comps.CreateItem<K4ItemType>|Comps.CreateTracker|Comps.ModifyTracker|Comps.ModifyAttack|Comps.ModifyMove|Comps.ModifyProperty|Comps.ModifyChange|Comps.PromptForData|Comps.RequireItem|Comps.ModifyRoll;

}
namespace K4ActiveEffect {
  export type OriginTypes = Exclude<K4ItemType, K4ItemType.darksecret>;
  export type Origin = K4Item<OriginTypes>|K4Actor<K4ActorType.pc>|K4Scene|K4ChatMessage;
  export type CustomFunctionActor = (
    this: K4Change,
    parent: K4Actor,
    data: Record<string, SystemScalar>
  ) => Promise<boolean>;

  export type CustomFunctionRoll = (
    this: K4Change,
    parent: K4Roll,
    data: Record<string, SystemScalar>
  ) => Promise<boolean>;

  export type CustomFunction = CustomFunctionActor | CustomFunctionRoll;

  export interface BuildData {
    parentData: SourceData,
    changeData: EffectChangeData[]
  }

  export interface SourceData {
    canToggle: boolean, // Whether the user can toggle this effect on/off
    inStatusBar: boolean, // Whether the effect should be displayed in the status bar (default = false UNLESS canToggle = true)
    label: Maybe<string>, // The principal name of the Effect. Appears in tooltips and in chat roll results.  If undefined, effect takes the name of its origin item.
    uses: number, // Number of uses of the effect before it is disabled or requires refill (0 = infinite).
    canRefill: boolean, // Whether the effect's uses can be refilled or if it should be deleted when uses = max
    isUnique: boolean, // Whether the effect is unique (only one copy can be on any Actor at a time)
    duration: EffectDuration, // If/when the effect should be automatically removed ("ongoing" for never)
    defaultState: boolean, // Whether a toggleable effect is enabled by default
    resetOn: Maybe<EffectResetOn>, // When the effect should reset to its default state (or resetTo)
    resetTo: Maybe<boolean>, // Overrides the default state when the effect resets
    icon: Maybe<string>; // The icon to display on the status bar. If undefined, takes icon of origin item.
    statusLabel: string; // The label to display on the status bar (default = "")
    tooltip: Maybe<string>; // The tooltip to display when hovering over the effect in the status bar OR in the chat card
    permanent: boolean; // Whether the effect should permanently apply its effects upon creation
    from?: string, // Optional override for the default "#>text-keyword>{sourceName}<#" component (is prefixed with 'from')
    alertUser?: string, // Optional alert to display to actor's owner when the change is applied (in formatForKult or HTML)
    alertAll?: string // Optional alert to display to all players when the change is applied (in formatForKult or HTML). If alertUser is also set, will not display the global alert to user.
  }


  export namespace Components {
    export namespace EffectSource {
      interface Base {
        type: EffectSourceType
      }

      interface DocSource extends Base {
        type: Exclude<EffectSourceType, EffectSourceType.moveResult|EffectSourceType.claimedResult>,
        uuid: string
      }
      interface ResultSource extends Base {
        type: EffectSourceType.moveResult|EffectSourceType.claimedResult
      }
      export type Ref = DocSource|ResultSource;
    }
    export namespace Effect {
      /**
       * Base interface for an Effect.
       */
      interface Base {
        label: string; // The principal name of the Effect. Appears in tooltips and in chat roll results.
        canToggle: boolean; // Whether the PARENTACTOR can toggle the effect on/off on their character sheet (default = true)
        duration: EffectDuration; // The duration of the Effect, which determines when it is automatically removed (default = "ongoing")
        isUnique: boolean; // Whether the Effect is unique, meaning a second effect with the same label will OVERWRITE any existing effect (default = "true")
        uses?: ValueMax; // Defines and tracks how many times the Effect can be used (i.e. to modify a roll or triggered static ability)
                         // - if undefined, the Effect is not limited-use
        canRefill?: boolean; // Whether the Effect can be refilled, or if it is removed when uses.value === uses.max (default = false)
        effectSource: Components.EffectSource.Ref; // Identifies the category of entity, event or circumstance that empowers the Effect, and that is ultimately responsible for removing it when it no longer applies.
        fromText: string; // A reference to the source of the effect in FormatForKult form
      }

      /**
       * Interface for effects that can be toggled.
       */
      export interface CanToggle extends Base {
        canToggle: true;
        isLocked: boolean; // Whether the effect has been manually locked to its current state, ignoring 'resetOn'.
        isEnabled: boolean; // Whether the effect is active and should be applied to rolls (default = defaultState)
        statusIcon: string; // The icon to display on the toggle modifier button.
        statusLabel: string; // The label to display next to the toggle button in the actor's character sheet (default = "")
        statusTooltip: string; // The tooltip to display on the toggle button in the actor's character sheet
        defaultState: boolean; // Whether the effect is enabled by default when applied. (default = true)
        resetOn: EffectResetOn; // The conditions under which the effect is reset to its default state (default = "never")
        resetTo: boolean; // The state to which the effect is reset when resetOn conditions are met (default = defaultState)
      }

      /**
       * Interface for effects that cannot be toggled.
       */
      interface CannotToggle extends Base {
        canToggle: false;
      }

      /**
       * Union type for Effect data, discriminated by `canToggle`.
       */
      export type ExtData = CanToggle | CannotToggle;
    }
  }

  export type ExtendedData = Components.Effect.ExtData;
  export type ExtendedToggleData = Components.Effect.ExtData & Components.Effect.CanToggle;
  export type ExtendedConstructorData = Omit<ExtendedData, "effectSource">;

  export type ConstructorData = ActiveEffectDataConstructorData;

  export type Data = ActiveEffectData & {
    flags: {
      kult4th: {
        data: ExtendedData
      }
    }
  }

  export interface ToggleData {
    isEnabled: boolean; // Whether the effect is active and should be applied to rolls (default = defaultState)
    defaultState: boolean; // Whether the effect is enabled by default when applied. (default = true)
    resetOn: EffectResetOn; // The conditions under which the effect is reset to its default state (default = "never")
    resetTo: boolean; // The state to which the effect is reset when resetOn conditions are met (default = defaultState)
    isLocked: boolean; // Whether the effect has been manually locked to its current state, ignoring 'resetOn'.
    statusIcon: string; // The icon to display on the toggle modifier button.
    toggleCategory: "stability"|"wound"|K4ItemType; // The category of the effect, used to group similar effects in the actor's character sheet
    statusLabel: string; // The label to display next to the toggle button in the actor's character sheet (default = "")
    statusTooltip: string; // The tooltip to display on the toggle button in the actor's character sheet
    toggleValue: string; // The value displayed next to the toggle button in the actor's character sheet (default = "")
    toggleValueGlow: string // The neon glow class to be applied to any value shown (default = "")
  }
}
// #endregion

// #endregion --


// #region === CUSTOM FUNCTIONS FOR MODE EffectMode.Custom ===
const CUSTOM_FUNCTIONS = {
  async CreateAttack(this: K4Change, actor: K4Actor, data: Record<string, SystemScalar>): Promise<boolean> {

    return true;
  },
  async CreateItem(this: K4Change, actor: K4Actor, data: Record<string, SystemScalar>): Promise<boolean> {

    return true;
  },
  async CreateTracker(this: K4Change, actor: K4Actor, data: Record<string, SystemScalar>): Promise<boolean> {

    return true;
  },
  async ModifyTracker(this: K4Change, actor: K4Actor, data: Record<string, SystemScalar>): Promise<boolean> {

    return true;
  },
  async ModifyAttack(this: K4Change, actor: K4Actor, data: Record<string, SystemScalar>): Promise<boolean> {

    return true;
  },
  async ModifyMove(this: K4Change, actor: K4Actor, data: Record<string, SystemScalar>): Promise<boolean> {
    if (!(actor instanceof K4Actor)) {
      throw new Error(`Invalid actor for ModifyMove: ${String(actor)}`);
    }
    const {filter, target, effect, value, text, fromText} = data as Partial<{
      filter: string,
      mode: string,
      target?: string,
      value?: SystemScalar,
      text?: string,
      fromText?: string
    }>;
    if (!filter || !effect) {
      throw new Error(`Invalid data for ModifyMove: ${JSON.stringify(data)}`);
    }
    actor.getItemsByFilter(K4ItemType.move, filter as string)
      .forEach((move) => {
        switch (effect) {
          case "PushElement": {
            const targetArray = U.getProp<Array<SystemScalar>>(move, target ?? "");
            if (!Array.isArray(targetArray)) {
              throw new Error(`Invalid target for PushElement: '${target}'`);
            }
            if (U.isUndefined(value)) { return undefined; }
            targetArray.push(value);
            setProperty(move, target as string, targetArray);
            break;
          }
          case "AppendText": {
            const targetString = getProperty(move, String(target));
            if (typeof targetString !== "string") {
              throw new Error(`Invalid target for AppendText: '${target}'`);
            }
            setProperty(move, target as string, targetString + text);
            break;
          }
          case "ModifyEffect": {
            console.warn(`ModifyMove > ModifyEffect is not yet implemented, but will use ${fromText}`);
            break;
          }
          default: {
            throw new Error(`Unrecognized effect for ModifyMove: '${effect}'`);
          }
        }
      });
    return true;
  },
  async ModifyProperty(this: K4Change, actor: K4Actor, data: Record<string, SystemScalar>): Promise<boolean> {
    if (!(actor instanceof K4Actor)) {
      throw new Error(`Invalid actor for ModifyProperty: ${String(actor)}`);
    }
    let {filter, effect, target, value, permanent} = data;
    value = U.castToScalar(String(value));
    if (!filter || !effect || !target) {
      throw new Error(`Invalid data for ModifyProperty: ${JSON.stringify(data)}`);
    }
    if (filter === "actor") {
      const curVal = U.castToScalar(getProperty(actor, `${target}`));
      switch (effect) {
        case "Subtract":
          if (typeof value !== "number") {
            throw new Error(`Invalid value for ModifyProperty 'Subtract': ${value}`);
          }
          if (typeof curVal !== "number") {
            throw new Error(`Invalid actor value (curVal) for ModifyProperty 'Subtract': ${curVal}`);
          }
          if (value === 0) { return true; }
          value = -1 * value;
          // falls through
        case "Add": {
          if (typeof value !== "number") {
            throw new Error(`Invalid value for ModifyProperty 'Add': ${value}`);
          }
          if (typeof curVal !== "number") {
            throw new Error(`Invalid actor value (curVal) for ModifyProperty 'Add': ${curVal}`);
          }
          if (value === 0) { return true; }
          if (permanent === true) {
            actor.update({[`${target}`]: curVal + value});
          } else {
            setProperty(actor, `${target}`, curVal + value);
          }
          break;
        }
        case "Set": {
          if (permanent === true) {
            actor.update({[`${target}`]: value});
          } else {
            setProperty(actor, `${target}`, value);
          }
          break;
        }
        case "Downgrade": {
          if (value === curVal) { return true; }
          if (typeof value === "string") {
            throw new Error(`Invalid string value for Downgrade: '${value}'`);
          }
          if (typeof curVal === "number" && typeof value === "number" && value > curVal) {
            return true;
          }
          if (value === true) { return true; }
          if (permanent === true) {
            actor.update({[`${target}`]: value});
          } else {
            setProperty(actor, `${target}`, value);
          }
        }
      }
    }
    return true;
  },
  async ModifyChange(this: K4Change, actor: K4Actor, data: Record<string, SystemScalar>): Promise<boolean> {
    if (!(actor instanceof K4Actor)) {
      throw new Error(`Invalid actor for ModifyChange: ${String(actor)}`);
    }
    let {filter, effect, target, value, permanent} = data;
    value = U.castToScalar(String(value));
    if (!filter || !effect || !target) {
      throw new Error(`Invalid data for ModifyChange: ${JSON.stringify(data)}`);
    }

    return true;
  },
  async PromptForData(this: K4Change, actor: K4Actor, data: Record<string, SystemScalar>): Promise<boolean> {
    if (!(actor instanceof K4Actor)) {
      throw new Error(`Invalid actor for ModifyMove: ${String(actor)}`);
    }
    const {title, key, input, inputVals, default: defaultVal, bodyText, subText} = data as Partial<{
      title: string,
      key: string,
      input: PromptInputType,
      default: SystemScalar,
      inputVals?: string,
      bodyText?: string,
      subText?: string
    }>;
    if (typeof key !== "string") {
      throw new Error(`No key provided for PromptForData: ${JSON.stringify(data)}`);
    }
    if (typeof title !== "string") {
      throw new Error(`No title provided for PromptForData: ${JSON.stringify(data)}`);
    }
    if (typeof input !== "string") {
      throw new Error(`No input type provided for PromptForData: ${JSON.stringify(data)}`);
    }
    if (typeof defaultVal !== "string") {
      throw new Error(`No default value provided for PromptForData: ${JSON.stringify(data)}`);
    }
    const userOutput = U.castToScalar(await new Promise(async (resolve) => {
      const template = await getTemplate(U.getTemplatePath("dialog", `ask-for-${input}`));
      const context: Record<string, SystemScalar> = {
        title,
        bodyText: bodyText ?? "",
        subText: subText ?? ""
      }
      const dialogData: Dialog.Data = {
        title,
        content: template(context),
        buttons: {}
      };
      dialogData.close = () => resolve(false); // User cancelled the dialog; return false to trigger cancellation logic
      switch (input) {
        case PromptInputType.buttons: {
          const buttonVals = (inputVals ?? "")
            .split("|")
            .map((val) => U.isNumString(val) ? U.pInt(val) : (U.isBooleanString(val) ? U.pBool(val) : val));
          if (!buttonVals.length) {
            throw new Error(`Invalid data for PromptForData: ${JSON.stringify(data)}`);
          }
          const buttonEntries = buttonVals.map((val) => {
            return [
              String(val),
              {
                label: String(val),
                callback: () => resolve(val)
              }
            ];
          });
          // Assign the default value to the first button
          dialogData.default = String(buttonVals[0]);
          dialogData.buttons = Object.fromEntries(buttonEntries);
          break;
        }
        case PromptInputType.text: {
          dialogData.default = "submit";
          dialogData.buttons = {
            submit: {
              label: "Submit",
              callback: (html) => {
                const inputValue = ($(html).find('input[name="input"]').val() as string).trim();
                resolve(inputValue);
              }
            }
          };
          break;
        }
        case PromptInputType.confirm: {
          dialogData.default = "confirm";
          dialogData.buttons = {
            confirm: {
              label: "Confirm",
              callback: () => resolve(true)
            },
            cancel: {
              label: "Cancel",
              callback: () => resolve(false)
            }
          };
          break;
        }
        default: {
          throw new Error(`Invalid input type for PromptForData: ${input}`);
        }
      }
      new Dialog(dialogData, {
        classes: [C.SYSTEM_ID, "dialog"],
      }).render(true);
    }));
    if (userOutput === false) { return false; }
    if (key.startsWith("flags")) {
      const flagKey = key.split(".").slice(1).join(".");
      await actor.setFlag(C.SYSTEM_ID, flagKey, userOutput);
      return true;
    }
    throw new Error(`Unrecognized key for PromptForData: ${key}`);
  },
  async RequireItem(this: K4Change, actor: K4Actor, data: Record<string, SystemScalar>): Promise<boolean> {
    if (!(actor instanceof K4Actor)) {
      throw new Error(`Invalid actor for ModifyMove: ${String(actor)}`);
    }
    const {filter, for: target} = data as Partial<{
      filter: string,
      for: string
    }>;
    if (typeof filter !== "string") {
      throw new Error(`No filter provided for RequireItem: ${JSON.stringify(data)}`);
    }
    if (typeof target !== "string") {
      throw new Error(`No for provided for RequireItem: ${JSON.stringify(data)}`);
    }
    const items = actor.getItemsByFilter(filter);
    if (items.length === 0) {
      // The required item is not found. Alert the user, and return false.
      ui.notifications.error(`You currently lack "${filter}", which is a prerequisite for gaining "${target}"`);
      return false;
    }
    return true;
  },
  async ModifyRoll(this: K4Change, roll: K4Roll, data: Record<string, SystemScalar>): Promise<boolean> {
    if (!(roll instanceof K4Roll)) {
      throw new Error(`Invalid roll for ModifyRoll: ${String(roll)}`);
    }
    let {filter, effect, value} = data as Partial<{
      filter: string,
      mode: string,
      value: SystemScalar
    }>;
    if (!filter || typeof filter !== "string") {
      throw new Error(`Invalid filter for ModifyRoll: ${filter}`);
    }
    if (!effect || typeof effect !== "string") {
      throw new Error(`Invalid effect for ModifyRoll: ${effect}`);
    }
    if (typeof value === "string") {
      if (value === "prompt") {
        let {title, bodyText, subText, input, inputVals} = data as Partial<{
          title: string,
          bodyText: string,
          subText: string,
          input: string,
          inputVals: string
        }>;
        let userOutput: SystemScalar = await new Promise(async (resolve) => {
          const template = await getTemplate(U.getTemplatePath("dialog", `ask-for-${input}`));
          const context: Record<string, SystemScalar> = {
            title: title ?? "Input Roll Data",
            bodyText: bodyText ?? "",
            subText: subText ?? ""
          }
          const dialogData: Dialog.Data = {
            title: context.title as string,
            content: template(context),
            buttons: {}
          };
          dialogData.close = () => resolve(false); // User cancelled the dialog; cancel the roll.
          switch (input) {
            case PromptInputType.buttons: {
              const buttonVals = (inputVals ?? "")
                .split("|")
                .map((val) => U.isNumString(val) ? U.pInt(val) : (U.isBooleanString(val) ? U.pBool(val) : val));
              if (!buttonVals.length) {
                throw new Error(`Invalid data for PromptForData: ${JSON.stringify(data)}`);
              }
              const buttonEntries = buttonVals.map((val) => {
                return [
                  String(val),
                  {
                    label: String(val),
                    callback: () => resolve(val)
                  }
                ];
              });
              // Assign the default value to the first button
              dialogData.default = String(buttonVals[0]);
              dialogData.buttons = Object.fromEntries(buttonEntries);
              break;
            }
            case PromptInputType.text: {
              dialogData.default = "submit";
              dialogData.buttons = {
                submit: {
                  label: "Submit",
                  callback: (html) => {
                    const inputValue = ($(html).find('input[name="input"]').val() as string).trim();
                    resolve(inputValue);
                  }
                }
              };
              break;
            }
            case PromptInputType.confirm: {
              dialogData.default = "confirm";
              dialogData.buttons = {
                confirm: {
                  label: "Confirm",
                  callback: () => resolve(true)
                },
                cancel: {
                  label: "Cancel",
                  callback: () => resolve(false)
                }
              };
              break;
            }
            default: {
              throw new Error(`Invalid input type for PromptForData: ${input}`);
            }
          }
          new Dialog(dialogData, {
            classes: [C.SYSTEM_ID, "dialog"],
          }).render(true);
        });
        if (typeof userOutput === "string") {
          userOutput = U.castToScalar(userOutput);
        }
        if (userOutput === false) {
          return false; // User cancelled dialog; return false to cancel roll.
        }
        value = userOutput;
      } else if (value.startsWith("actor")) {
        const {actor} = roll;
        value = U.castToScalar(getProperty(actor, value.slice(6)));
      }
    }
    switch (effect) {
      case "Subtract":
        if (typeof value !== "number") {
          throw new Error(`Invalid value for ModifyRoll 'Subtract': ${value}`);
        }
        value = -1 * value;
        // falls through
      case "Add": {
        if (typeof value !== "number") {
          throw new Error(`Invalid value for ModifyRoll 'Add': ${value}`);
        }
        roll.modifiers.push({
          id: this.id!,
          filter: this.filter,
          label: this.customFunctionData.label as Maybe<string> ?? this.name,
          tooltipLabel: this.customFunctionData.label as Maybe<string> ?? this.name,
          tooltipDesc: this.tooltip ?? "",
          value,
          cssClasses: [
            value >= 0 ? "k4-theme-gold" : "k4-theme-red"
          ]
        });
      }
    }
    return true;
  },
} as const;
// #endregion

// #region === K4CHANGE CLASS ===
/**
 * A utility class wrapper around the changes array of a K4ActiveEffect, providing methods for
 * compiling, filtering, and applying changes to a parent K4Actor.
 */
class K4Change implements EffectChangeData {
  // #region STATIC METHODS ~
  /**
   * Parses a function data string into an object literal.
   *
   * == FUNCTION DATA STRING ==
   * A string definition of a data object that will be passed to the function. Each function must define how to handle this data object.
   *  - String is comma-delimited with key-value pairs separated by colons.
   *  - The last key-value pair may contain commas, as long as there are no colons after the last comma.
   *
   * @param {string} dataString - The function data string to parse.
   * @returns {Record<string, string>} - The parsed object literal.
   */
  static ParseFunctionDataString(dataString: string): Record<string, SystemScalar> {
    if (!dataString) { return {}; }
    dataString = U.trimInner(dataString);
    const pairs = dataString.match(/([^,]+:[^,]+(?:,[^,]+)*?)(?=(?:,[^:]+:)|$)/g);
    if (!pairs) {
      throw new Error(`Invalid function data string format: "${dataString}"`);
    }
    // kLog.log("[ParseFunctionDataString]", {dataString, pairs}, 3)

    return pairs.reduce((acc, pair) => {

      let [key, value]: [string, SystemScalar] = pair
        .split(/:(.+)/) // Split only at the first colon
        .map((str) => str.trim()) as [string, string];

      // Convert the value to the appropriate type
      if (U.isNumString(value)) {
        value = /\./.test(value) ? U.pFloat(value) : U.pInt(value);
      } else if (U.isBooleanString(value)) {
        value = U.pBool(value);
      }

      /** Debugging: Record unique keys and values to CONFIG object */
      CONFIG.debug.customFunctionParams ??= {};
      CONFIG.debug.customFunctionParams[key] ??= [];
      if (!CONFIG.debug.customFunctionParams[key].includes(value)) {
        CONFIG.debug.customFunctionParams[key].push(value);
      }

      acc[key] = value;
      return acc;
    }, {} as Record<string,SystemScalar>);
  }
  // #endregion

  // #region Effect Change Data Properties ~
  key: string;
  value: string;
  mode: number;
  priority: number | null | undefined;
  // #endregion

  // #region GETTERS & SETTERS ~
  isInstantiated(): this is typeof this & {parentEffect: K4ActiveEffect} {
    return Boolean(this.parentEffect);
  }
  get id(): Maybe<string> {
    if (!this.isInstantiated()) { return undefined; }
    return `${this.parentEffect.id}_${this.index}`;
  }
  isOwnedByActor(): this is typeof this & {actor: K4Actor, parentEffect: K4ActiveEffect & {actor: K4Actor}} {
    return this.parentEffect?.actor !== undefined;
  }
  get index(): number {
    if (!this.isInstantiated()) { return -1; }
    return this.parentEffect.changes.findIndex((change) => change.value === this.value);
  }
  get isEnabled(): boolean {
    if (!this.isInstantiated()) { return false; }
    return this.parentEffect.isEnabled;
  }
  get actor(): Maybe<K4Actor> {
    if (!this.isOwnedByActor()) { return undefined; }
    return this.parentEffect.actor;
  }
  get originItem(): Maybe<K4Item> {
    if (!this.isInstantiated()) { return undefined; }
    return this.parentEffect.originItem;
  }
  get isPromptOnCreate(): boolean {
    return ["PromptForData"].includes(this.customFunctionName);
  }
  get isPromptOnRoll(): boolean {
    return this.isRollModifier() && this.customFunctionData.value === "prompt";
  }
  get isRequireItemCheck(): boolean {
    return ["RequireItem"].includes(this.customFunctionName);
  }
  get isPermanentChange(): boolean {
    return this.customFunctionData.permanent === true;
  }
  get isSystemModifier(): boolean {
    return !this.isPromptOnCreate
      && !this.isRequireItemCheck
      && !this.isPermanentChange
      && !this.isRollModifier();
  }
  isRollModifier(): this is this & {modData: K4Roll.ModData} {
    return ["ModifyRoll", "ApplyWounds", "ApplyStability"].includes(this.customFunctionName);
  }
  get filter(): "all"|K4Attribute|K4ItemType|string {
    return this.customFunctionData.filter as Maybe<string> ?? "all";
  }
  get name(): string {
    if (["wounds", "stability"].includes(String(this.customFunctionData.value))) {
      return U.tCase(this.customFunctionData.value);
    }
    return this.customFunctionData.name as Maybe<string>
      ?? this.originItem?.name
      ?? "";
  }
  get tooltip(): Maybe<string> {
    if (typeof this.customFunctionData.tooltip !== "string") { return undefined; }
    return this.customFunctionData.tooltip;
  }
  _promptedValue?: SystemScalar;
  get finalValue(): Maybe<SystemScalar> {
    const {value} = this.customFunctionData;
    if (value === undefined) { return undefined; }
    if (value === "prompt") {
      return this._promptedValue;
    }
    if (!this.isOwnedByActor()) { return value }
    if (typeof value === "string" && value.startsWith("actor.")) {
      return getProperty(this.actor, value.slice(6));
    }
    if (U.isNumString(value)) {
      return U.pInt(value);
    }
    if (U.isBooleanString(value)) {
      return U.pBool(value);
    }
    return value;
  }
  get modData(): K4Roll.ModData {
    if (typeof this.finalValue !== "number") {
      throw new Error(`Invalid finalValue for K4Change '${this.finalValue}' (should it be in the status bar?)`);
    }
    return {
      id: this.id!,
      filter: this.filter,
      label: this.customFunctionData.label as Maybe<string> ?? this.name,
      tooltipLabel: this.customFunctionData.label as Maybe<string> ?? this.name,
      tooltipDesc: this.tooltip ?? "",
      value: this.finalValue,
      cssClasses: [
        this.finalValue >= 0 ? "k4-theme-gold" : "k4-theme-red"
      ]
    };
  }
  isInStatusBar() {
    return this.isRollModifier() && typeof this.finalValue === "number" && this.customFunctionData.inStatusBar !== false;
  }  // #endregion

  // #region CONSTRUCTOR
  customFunctionName: keyof typeof CUSTOM_FUNCTIONS;
  customFunction: K4ActiveEffect.CustomFunction;
  customFunctionData: Record<string, SystemScalar>;
  parentEffect?: K4ActiveEffect;
  constructor(data: EffectChangeData, effect?: K4ActiveEffect) {
    const {key, mode, value} = data;
    if (mode !== CONST.ACTIVE_EFFECT_MODES.CUSTOM) {
      throw new Error(`[new K4Change] Attempted K4Change construction for non-custom effect: ${JSON.stringify(data)}`);
    }
    if (!(key in CUSTOM_FUNCTIONS)) {
      throw new Error(`[new K4Change] Unrecognized custom function key: ${key}`);
    }
    this.key = key;
    this.value = value;
    this.mode = mode;
    this.customFunctionName = key;
    this.customFunction = CUSTOM_FUNCTIONS[key].bind(this);
    this.customFunctionData = K4Change.ParseFunctionDataString(value);
    this.parentEffect = effect;
  }
  // #endregion


  async apply(parent: K4Actor): Promise<string|boolean|void>
  async apply(parent: K4Roll): Promise<boolean>
  async apply(parent: K4Actor|K4Roll) {
    const {parentEffect} = this;
    if (!parent) {
      throw new Error(`[K4Change.apply] No valid parent found for '${this.customFunctionName}' K4Change of K4ActiveEffect '${this.parentEffect?.name ?? "(Uninstantiated Effect Data)"}'`);
    }
    if (!parentEffect) {
      throw new Error(`[K4Change.apply] No valid parentEffect found for '${this.customFunctionName}' K4Change`);
    }
    if (parent instanceof K4Actor) {
      return await (this.customFunction as K4ActiveEffect.CustomFunctionActor)(parent, this.customFunctionData);
    }
    return await (this.customFunction as K4ActiveEffect.CustomFunctionRoll)(parent, this.customFunctionData);
  }
}
// #endregion
// #region === K4ACTIVEEFFECT CLASS ===
/**
 * The active effect itself can be applied using Foundry's standard logic, resulting in changes
 * arrays that contain mode:0 custom functions where key is the function name, and value is the
 * function string.
 *
 * Effects defined in the system.rules schema of an item are created as embedded
 * effects on the item, and set to be transferrable to any owning actor.
 *
 * Effects defined in the system.results schema of an item are instead created as embedded effects
 * directly on the actor when the associated result is triggered.
 *
 * Changes are generally parsed and applied during the owning actor's prepareData() method, ensuring
 * all changes do not make permanent changes to the actor's data, simplifying the process of removal.
 * This includes changes made to other items owned by the actor. Changes that apply modifiers to dice
 * rolls determine whether they should be displayed in the status bar of the actor's sheet and/or whether
 * the actor can toggle them on and off at this step. When the actor makes a roll, these changes are
 * iterated through and applied during the roll process.
 */
class K4ActiveEffect extends ActiveEffect {

  static #isChangeModeCustom(change: EffectChangeData): boolean { return change.mode === CONST.ACTIVE_EFFECT_MODES.CUSTOM; }
  static #getChangesWith(changeData: K4Change.Data[], param: string, value?: SystemScalar): K4Change.Data[] {
    return changeData
      .filter((changeData) => this.#isChangeModeCustom(changeData))
      .filter((changeData) => changeData.value.includes(`${param}:${String(value ?? "")}`));
  }
  static #getConflictingChanges(changeData: K4Change.Data[], param: string): K4Change.Data[] {
    const valueRecord: Record<string, K4Change.Data[]> = {};
    changeData
      .filter((changeData) => this.#isChangeModeCustom(changeData))
      .forEach((changeData) => {
        const value = K4Change.ParseFunctionDataString(changeData.value)[param];
        if (value === undefined) { return undefined; }
        valueRecord[String(value)] = valueRecord[String(value)] ?? [];
        valueRecord[String(value)].push(changeData);
      });
    if (Object.values(valueRecord).length === 0) { return []; }
    // Find which value has the most changes, and return a flattened array of all OTHER Changes
    const sortedEntries = Object.entries(valueRecord)
      .sort((a, b) => b[1].length - a[1].length);
    if (sortedEntries.length === 0) {
      throw new Error(`No changes found for parameter '${param}' in effect '${changeData[0].key}'`);
    }
    const majorityValue = sortedEntries[0][0];
    if (majorityValue === undefined) { return []; }
    delete valueRecord[majorityValue];
    return Object.values(valueRecord).flat();
  }
  static #getEffectPropFromChanges<T extends SystemScalar>(changeData: K4Change.Data[], prop: string): Maybe<T>
  static #getEffectPropFromChanges<T extends SystemScalar>(changeData: K4Change.Data[], prop: string, defaultVal: T): T
  static #getEffectPropFromChanges<T extends SystemScalar>(changeData: K4Change.Data[], prop: string, defaultVal?: T): Maybe<T> {
    let propVal: Maybe<SystemScalar> = undefined;
    this.#getChangesWith(changeData, prop).forEach((cData) => {
      const changeVal = K4Change.ParseFunctionDataString(cData.value)[prop];
      if (propVal === undefined) {
        propVal = changeVal;
      } else if (propVal !== changeVal) {
        throw new Error(`Conflicting values found for effect property '${prop}' in effect '${cData.key}': ${propVal}, ${changeVal}`);
      }
    });
    return propVal ?? defaultVal;
  }

  static #resolveEffectSource(origin: K4ActiveEffect.Origin): K4ActiveEffect.ExtendedData["effectSource"] {
    if (origin instanceof K4Item) {
      if (origin.is(K4ItemType.gmtracker)) {
        // GM Tracker effect applied by GM
        return {
          type: EffectSourceType.gm,
          uuid: origin.uuid
        };
      }
      if (origin.is(
        K4ItemType.move,
        K4ItemType.advantage,
        K4ItemType.disadvantage,
        K4ItemType.relation,
        K4ItemType.weapon,
        K4ItemType.gear
      )) {
        // Origin is an item that will transfer its effects to an owning actor.
        return {
          type: EffectSourceType.ownedItem,
          uuid: origin.uuid
        };
      }
      throw new Error(`Invalid origin item type for ActiveEffect: ${origin.type}`);
    }

    if (origin instanceof K4Actor) {
      // ActiveEffect is being created directly on an Actor
      return {
        type: EffectSourceType.actor,
        uuid: origin.uuid
      };
    }

    if (origin instanceof K4ChatMessage) {
      if (origin.isResult) {
        // ActiveEffect is being applied by the result of a rolled or triggered move, to the actor who rolled/triggered the move
        return {
          type: EffectSourceType.moveResult
        };
      }
      throw new Error(`Chat message ${origin.id} is not a Result and cannot create an ActiveEffect.`);
    }

    if (origin instanceof K4Scene) {
      // ActiveEFfect is being applied by a K4Scene to actors present in that scene.
      return {
        type: EffectSourceType.scene,
        uuid: origin.uuid
      };
    }

    throw new Error(`Invalid origin type for ActiveEffect: ${String(origin)}`);
  }
  static #resolveEffectName(changeData: K4Change.Data[], origin: K4ActiveEffect.Origin, explicitOnly = false): Maybe<string> {
    let effectName: Maybe<string> = K4Change.ParseFunctionDataString(this.#getChangesWith(changeData, "label")[0]?.value).label as Maybe<string>;
    if (effectName || explicitOnly) { return effectName; }
    if (origin instanceof K4Item) {
      effectName = origin.name;
    }
    if (origin instanceof K4Actor) {
      effectName = origin.name;
    }
    if (origin instanceof K4ChatMessage) {
      effectName = "Result";
    }
    if (origin instanceof K4Scene) {
      effectName = origin.name ?? "Scene";
    }
    console.warn(`No effect name found in listed changes, defaulting to '${effectName}'`, {changeData, origin});
    return effectName as string;
  }
  static #groupChangesByEffectName(changeData: K4Change.Data[], origin: K4ActiveEffect.Origin): Record<string, K4Change.Data[]> {
    const defaultName = this.#resolveEffectName(changeData, origin) as string;
    return changeData.reduce((acc, cData) => {
      const effectName = this.#resolveEffectName([cData], origin, true) ?? defaultName;
      acc[effectName] = acc[effectName] ?? [];
      acc[effectName].push(cData);
      return acc;
    }, {} as Record<string, K4Change.Data[]>);
  }
  /**
 * Given a list of changes, will group them by assigned name and validate that they are all compatible with each other.
 */
  static #ProcessEffectChanges(changeData: K4Change.Data[], origin: K4ActiveEffect.Origin): Array<Tuple<string, K4Change.Data[]>> {
    // First group changes by effect name
    const groupedChanges = this.#groupChangesByEffectName(changeData, origin);

    Object.values(groupedChanges).forEach((effectChanges) => {
      /**
       * The following function parameters, if present on any change, cannot conflict with the same parameter on another change in the same effect:
       *  - canToggle, defaultState, resetOn, duration, isUnique, uses, canRefill, fromText
       */
      ["canToggle", "defaultState", "resetOn", "duration", "isUnique", "uses", "canRefill", "fromText"].forEach((param) => {
        const conflictingChanges = this.#getConflictingChanges(effectChanges, param);
        if (conflictingChanges.length) {
          throw new Error(`Conflicting changes found for parameter '${param}' in effect '${effectChanges[0].key}': ${conflictingChanges.map((change) => change.value).join(", ")}`);
        }
      });
    });

    return Object.entries(groupedChanges);
  }
  /**
   * Given an array of K4Changes, will extract those function parameters that apply to the parent effect as a whole.
   * (Any potential conflicts are resolved by the time this function is called.)
   * @param {K4Change.Data[]} changeData - The array of changes to extract from.
   * @param {K4ActiveEffect.Origin} origin - The origin of the ActiveEffect.
   * @returns {K4ActiveEffect.ExtendedData} - The extracted data.
   */
  static #ExtractExtendedData(changeData: K4Change.Data[], origin: K4ActiveEffect.Origin): K4ActiveEffect.ExtendedData {

    const canToggle = this.#getEffectPropFromChanges<boolean>(changeData, "canToggle");
    const label = this.#getEffectPropFromChanges<string>(changeData, "label")
      ?? this.#resolveEffectName(changeData, origin);
    if (!label) {
      throw new Error(`No effect label found in changes: ${JSON.stringify(changeData)}`);
    }
    const useMax = this.#getEffectPropFromChanges<number>(changeData, "uses");
    const uses = U.isDefined(useMax)
      ? {
        value: 0,
        min: 0,
        max: useMax
      }
      : undefined;
    const canRefill = U.isDefined(uses)
      ? this.#getEffectPropFromChanges<boolean>(
        changeData,
        "canRefill",
        false
      )
      : undefined;
    const durationDefaultVal = U.isDefined(uses) && !canRefill
      ? EffectDuration.limited
      : EffectDuration.ongoing;
    const duration = this.#getEffectPropFromChanges<EffectDuration>(
      changeData,
      "duration",
      durationDefaultVal
    );
    const isUnique = this.#getEffectPropFromChanges<boolean>(
        changeData,
        "isUnique",
        true
      )
    const effectSource = this.#resolveEffectSource(origin);
    let fromText = this.#getEffectPropFromChanges<string>(changeData, "fromText");
    if (!fromText) {
      if (origin instanceof K4Item) {
        fromText = `#>item-button text-doclink&data-item-name='${origin.name}'&data-action='open'>${origin.name}<#`;
      } else {
        throw new Error(`No fromText found for ActiveEffect: ${label}`);
      }
    }

    if (canToggle) {
      const defaultState = this.#getEffectPropFromChanges<boolean>(
        changeData,
        "defaultState",
        true
      );
      const resetOnDefaultVal = U.isDefined(uses) ? EffectResetOn.onUse : EffectResetOn.never;
      const resetOn = this.#getEffectPropFromChanges<EffectResetOn>(
        changeData,
        "resetOn",
        resetOnDefaultVal
      );
      const resetTo = this.#getEffectPropFromChanges<boolean>(
        changeData,
        "resetTo",
        defaultState
      );
      const statusIcon = this.#getEffectPropFromChanges<string>(
        changeData,
        "icon"
      ) ?? "";
      const statusLabel = this.#getEffectPropFromChanges<string>(
        changeData,
        "statusLabel",
        ""
      );
      const statusTooltip = this.#getEffectPropFromChanges<string>(
        changeData,
        "tooltip"
      );
      if (U.isUndefined(statusTooltip)) {
        throw new Error(`No tooltip found for toggleable effect: ${label}`);
      }
      return {
        label,
        canToggle: true,
        isLocked: false,
        isEnabled: defaultState,
        defaultState,
        resetOn,
        resetTo,
        statusIcon,
        statusLabel,
        statusTooltip,
        duration,
        isUnique,
        uses,
        canRefill,
        effectSource,
        fromText
      }
    } else {
      return {
        label,
        canToggle: false,
        duration,
        isUnique,
        uses,
        canRefill,
        effectSource,
        fromText
      }
    }
  }

  static DoesFilterApplyToMove(filter: string, move: K4Item<K4ItemType.move>): boolean {
    if (filter === "all") { return true; }
    if (filter === move.parentType) { return true; }
    if (filter === move.name) { return true; }
    if (filter === move.parentName) { return true; }
    return false;
  }

  /**
   * Type guard to check if the effect can be toggled.
   * @returns {boolean} - True if the effect can be toggled, false otherwise.
   */
  canToggle(): this is this & { canToggle: true, eData: K4ActiveEffect.ExtendedToggleData } {
    return this.flags.kult4th.data.canToggle === true;
  }
  get defaultState(): boolean { return this.canToggle() ? this.eData.defaultState ?? true : true; }
  get isLocked(): boolean { return this.canToggle() ? this.eData.isLocked ?? false : false; }
  set isLocked(value: boolean) { this.setFlag<boolean>("data.isLocked", value);}
  get isEnabled(): boolean { return this.canToggle() ? this.eData.isEnabled ?? true : true; }
  get isRelevant(): boolean {
    return this.getCustomChanges()
      .some((change) => Boolean(change.finalValue)
        && typeof change.finalValue === "number")
  }
  get resetOn(): EffectResetOn { return this.canToggle() ? this.eData.resetOn ?? EffectResetOn.never : EffectResetOn.never; }
  get resetTo(): boolean { return this.canToggle() ? this.eData.resetTo ?? this.defaultState : this.defaultState; }
  get toggleCategory(): "wound"|"stability"|K4ItemType {
    if (this.isApplyingWoundModifiers) { return "wound"; }
    if (this.isApplyingStabilityModifiers) { return "stability"; }
    return this.enabledCustomChanges
      .find((change) => Boolean(change.originItem))?.originItem?.type ?? K4ItemType.move;
  }
  get statusIcon(): string {
    if (!this.canToggle()) { return ""; }
    if (!this.isOwnedByActor()) { return ""; }
    if (this.isApplyingWoundModifiers) { return this.actor.woundsIcon; }
    if (this.isApplyingStabilityModifiers) { return this.actor.stabilityIcon; }
    if (this.eData.statusIcon) { return this.eData.statusIcon; }
    return `systems/${C.SYSTEM_ID}/assets/icons/modifiers/default-${this.benefit}.svg`;
  }
  get statusLabel(): string { return this.canToggle() ? this.eData.statusLabel ?? "" : ""; }
  get statusTooltip(): string { return this.canToggle() ? this.eData.statusTooltip ?? "" : ""; }
  get effectDuration(): EffectDuration { return this.eData.duration; }
  get isUnique(): boolean { return this.eData.isUnique; }
  get uses(): Maybe<ValueMax> { return this.eData.uses; }
  get canRefill(): Maybe<boolean> { return this.eData.canRefill; }
  get effectSource(): K4ActiveEffect.Components.EffectSource.Ref { return this.eData.effectSource; }
  get fromText(): string { return this.eData.fromText; }
  get benefit(): "pos"|"neg"|"neutral" {
    if (this.isApplyingStabilityModifiers) { return "neg"; }
    if (this.isApplyingWoundModifiers) { return "neg"; }
    const numPosChanges = this.getCustomChanges()
      .filter((change) => typeof change.finalValue === "number" && change.finalValue > 0).length;
    const numNegChanges = this.getCustomChanges()
      .filter((change) => typeof change.finalValue === "number" && change.finalValue < 0).length;
    if (numPosChanges && numNegChanges) { return "neutral"; }
    if (numPosChanges) { return "pos"; }
    if (numNegChanges) { return "neg"; }
    return "neutral";
  }
  get value(): Maybe<number> {
    if (!this.canToggle()) { return undefined; }
    const valueChanges = this.getCustomChanges()
      .filter((change): change is K4Change & {finalValue: number} => typeof change.finalValue === "number");
    if (valueChanges.length === 1) {
      return valueChanges[0].finalValue;
    }
    return undefined;
  }
  get toggleValue(): Maybe<string> {
    if (U.isUndefined(this.value)) { return undefined; }
    if (!U.isNumber(this.value)) { return undefined; }

    return U.signNum(this.value, "", "+");
  }
  get toggleValueGlow(): Maybe<string> {
    if (!this.canToggle()) { return undefined; }
    if (U.isUndefined(this.value)) { return undefined; }
    if (this.value > 0) { return "neon-glow-soft-blue"; }
    if (this.value < 0) { return "neon-glow-soft-red"; }
    return "neon-glow-soft-gold";
  }
  get toggleData(): Maybe<K4ActiveEffect.ToggleData> {
    if (!this.canToggle()) { return undefined; }
    if (!this.isOwnedByActor()) { return undefined; }
    return {
      isEnabled: this.isEnabled,
      defaultState: this.defaultState,
      resetOn: this.resetOn,
      resetTo: this.resetTo,
      isLocked: this.isLocked,
      statusIcon: this.statusIcon,
      toggleCategory: this.toggleCategory,
      statusLabel: this.statusLabel,
      statusTooltip: this.statusTooltip,
      toggleValue: this.toggleValue ?? "",
      toggleValueGlow: this.toggleValueGlow!,
    };
  }

  getApplicableRollModifiers(roll: K4Roll): K4Change[] {
    return this.getCustomChanges()
      .filter((change) => change.isRollModifier()
        && roll.doesFilterApply(change.filter));
  }
  doesEffectApply(roll: K4Roll): boolean {
    return this.isEnabled && this.getApplicableRollModifiers(roll).length > 0;
  }
  static async CreateFromChangeData(
    changeData: K4Change.Data[],
    origin: K4ActiveEffect.Origin,
    target?: K4Actor<K4ActorType.pc>
  ): Promise<K4ActiveEffect[]> {
    const effectDeletionIDs: string[] = [];
    const effectDataSets: Array<K4ActiveEffect.ConstructorData & Record<string, unknown>> = [];
    const effectHost = target ?? origin;

    // Process the effect changes, validating them and separating them as necessary into multiple effects.
    const groupedChanges = this.#ProcessEffectChanges(changeData, origin);

    // Iterate through each group of changes, creating an ActiveEffect for each.
    groupedChanges.forEach(([label, effectChanges]) => {
      // First we extract the extended data, which will be stored in the effect's flags
      const extData = this.#ExtractExtendedData(effectChanges, origin)

      // Then we check whether the effect is unique: If so, and an effect with the same name already exists, we remove it before creating the new one.
      if (extData.isUnique && !(effectHost instanceof K4Scene) && !(effectHost instanceof K4ChatMessage)) {
        const existingEffect = effectHost.effects.find((effect) => effect.label === label);
        if (existingEffect) {
          effectDeletionIDs.push(existingEffect.id!);
        }
      }
      effectDataSets.push({
        origin: origin.uuid,
        label,
        transfer: origin.uuid !== target?.uuid,
        disabled: false,
        changes: effectChanges.map((change) => {
          return {
            key: change.key,
            mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
            value: change.value
          };
        }),
        flags: {
          kult4th: {
            data: extData
          }
        }
      });
    });
    await effectHost.deleteEmbeddedDocuments("ActiveEffect", effectDeletionIDs);
    return effectHost.createEmbeddedDocuments("ActiveEffect", effectDataSets) as unknown as Promise<K4ActiveEffect[]>;
  }

  // #region INITIALIZATION ~
  static async PreInitialize(): Promise<void> {
    CONFIG.ActiveEffect.documentClass = K4ActiveEffect;
    DocumentSheetConfig.unregisterSheet(ActiveEffect, "core", ActiveEffectConfig);
    DocumentSheetConfig.registerSheet(ActiveEffect, "kult4th", K4ActiveEffectSheet, { makeDefault: true });

    Hooks.on("createActiveEffect", async (effect: K4ActiveEffect) => {
      kLog.display(`[on CreateActiveEffect] ${effect.label}`, {
        effect,
        origin: effect.origin,
        ownedByActor: effect.isOwnedByActor(),
        hasItemOrigin: effect.hasItemOrigin(),
        originDoc: effect.origin ? fromUuidSync(effect.origin) : null,
        isItemOwned: effect.hasItemOrigin() ? effect.originItem.isOwnedItem() : false,
        requireItemChanges: effect.requireItemChanges,
        permanentChanges: effect.permanentChanges
      });

      // If this effect is not embedded in an actor, do nothing
      if (!effect.isOwnedByActor()) { return true; }

      // If the effect has no custom changes, do nothing.
      if (!effect.getCustomChanges().length) { return true; }

      const originItem = fromUuidSync(effect.origin) as Maybe<K4Item>;

      /* === PROCESS CUSTOM CHANGES: STEP 1 - RequireItem Prerequisite Check === */
      // Check for any "RequireItem" changes. If any of them fail, remove both the ActiveEffect and the embedded Item.
      if (effect.requireItemChanges.some((change) => !change.apply(effect.actor))) {
        originItem?.delete();
        return false;
      }

      /* === PROCESS CUSTOM CHANGES: STEP 2 - PromptForData Check === */
      // PromptForData changes are resolved by querying the User for input when they are embedded within an Actor owned by that User -- i.e. right now.
      // Though there is only one 'PromptForData' custom function currently defined, this structure allows for future expansion.
      // (Note: The "PromptForData" function will only run once; if the data it is seeking is already written to the actor's flags, it will do nothing.)
      for (const change of effect.promptForDataChanges) {
        await change.apply(effect.actor);
      }

      /* === PROCESS CUSTOM CHANGES: STEP 3 - Permanent Effects Check === */
      // If any changes are permanent, apply them now -- they will be filtered out of future applications of the effect,
      // and will not be reversed when the active effect is removed.
      effect.permanentChanges.forEach((change) => change.apply(effect.actor));
      return true;
    });
  }
  // #endregion
  static async onManageActiveEffect(event: ClickEvent, owner: K4Actor|K4Item, action?: string) {
    event.preventDefault();
    const a = event.currentTarget;
    action ??= a.dataset.action;
    if (action === "create") {
      return owner.createEmbeddedDocuments("ActiveEffect", [{
        name:   owner.name,
        icon:   owner.img,
        origin: owner.uuid
      }]);
    }
    const effect = owner.effects.get(a.dataset.target ?? "");
    if (!effect) { return null; }
    switch ( action ) {
      case "edit": return effect.sheet?.render(true);
      case "delete": return effect.delete();
      case "toggle": return effect.toggleEnabled();
      case "lock": return effect.toggleLock();
      case "reset": return effect.reset();
      case "use": return effect.use();
      default: return null;
    }
  }

  override async delete(options?: DocumentModificationContext) {
    if (this.isOwnedByActor()) {
      await this.actor.deleteEmbeddedDocuments("ActiveEffect", [this.id!]);
      return undefined;
    }
    return super.delete(options);
  }

  async toggleEnabled(value?: boolean, isForcing = false) {
    if (!this.canToggle()) { return undefined; }
    if (this.isLocked && !isForcing) { return undefined; }
    const promises: Promise<unknown>[] = [
      this.setFlag<boolean>("data.isEnabled", value ?? !this.isEnabled)
    ];
    if (this.isLocked && isForcing) {
      promises.push(this.toggleLock(false));
    }
    return Promise.all(promises);
  }
  async toggleLock(value?: boolean) {
    if (!this.canToggle()) { return undefined; }
    return this.setFlag<boolean>("data.isLocked", value ?? !this.isLocked);
  }
  async reset(resetTo?: boolean, isForcing = false) {
    // if (!this.canToggle()) { return undefined; }
    if (this.isLocked && !isForcing) { return undefined; }
    resetTo ??= this.resetTo;
    const promises: Promise<unknown>[] = [];
    if (this.isLocked && isForcing) {
      promises.push(this.toggleLock(false));
    }
    if (resetTo !== this.isEnabled) {
      promises.push(this.toggleEnabled(resetTo, true));
    }
    return Promise.all(promises);
  }
  async use() {
    const promises: Promise<unknown>[] = [];

    if (this.canToggle() && this.resetOn === EffectResetOn.onUse) {
      promises.push(this.reset(this.resetTo, true));
    }
    if (U.isDefined(this.uses)) {
      if ((this.uses.value + 1) >= this.uses.max) {
        if (this.canRefill) {
          promises.push(this.toggleEnabled(false, true));
          promises.push(this.toggleLock(true));
        } else {
          promises.push(this.delete());
        }
      } else {
        promises.push(this.setFlag<number>("data.uses.value", this.uses.value + 1));
      }
    }

    return Promise.all(promises);
  }
  async applyToRoll(roll: K4Roll) {
    if (!this.doesEffectApply(roll)) { return undefined; }
    let returnVal = true;
    for (const change of this.getApplicableRollModifiers(roll)) {
      if (await change.apply(roll) === false) {
        returnVal = false;
        break;
      }
    }
    if (!returnVal) { return false; }
    this.use();
    return returnVal;
  }

  // #region GETTERS & SETTERS ~
  isOwned(): this is {origin: string, owner: K4Actor|K4Item} {
    return Boolean(this.origin);
  }
  isOwnedByActor(): this is {origin: string, owner: K4Actor, actor: K4Actor} {
    return this.isOwned() && this.origin.startsWith("Actor");
  }
  isOwnedByItem(): this is {origin: string, owner: K4Item, originItem: K4Item} {
    return this.isOwned() && this.origin.startsWith("Item");
  }
  hasItemOrigin(): this is {origin: string, owner: K4Actor|K4Item, originItem: K4Item} {
    return this.isOwned() && this.origin.includes("Item");
  }
  get isApplyingWoundModifiers(): boolean {
    return this.getCustomChangeData().some((change) => change.key === "ApplyWounds");
  }
  get isApplyingStabilityModifiers(): boolean {
    return this.getCustomChangeData().some((change) => change.key === "ApplyStability");
  }
  get originItem(): Maybe<K4Item> {
    if (!this.hasItemOrigin()) { return undefined; }
    return fromUuidSync(this.origin) as Maybe<K4Item>;
  }
  get owner(): Maybe<K4Actor|K4Item> {
    return this.isOwnedByActor() ? this.actor : this.originItem;
  }
  get actor(): Maybe<K4Actor> {
    if (!this.isOwnedByActor()) { return undefined; }
    const [_, actorId] = this.origin.split(".");
    return game.actors.get(actorId);
  }
  get eData(): K4ActiveEffect.ExtendedData|K4ActiveEffect.ExtendedToggleData {
    const eData = this.getFlag<K4ActiveEffect.ExtendedData>("data")!;
    if (this.canToggle()) {
      return eData as K4ActiveEffect.ExtendedToggleData;
    }
    return eData as K4ActiveEffect.ExtendedData;
  }

  getCustomChangeData(): EffectChangeData[] {
    return this.changes.filter((change) => change.mode === CONST.ACTIVE_EFFECT_MODES.CUSTOM);
  }
  getCustomChanges(): K4Change[] {
    if (this.isApplyingWoundModifiers) {
      if (!this.isOwnedByActor()) { return []; }
      return this.actor.woundModData.map((woundData) => {
        return new K4Change({
          key: "ModifyRoll",
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `
            filter:${woundData.filter},
            canToggle:false,
            label:${woundData.label},
            effect:Add,
            value:${woundData.value},
            duration:ongoing,
            icon:${this.actor.woundsIcon},
            fromText:#>text-negmod>Wounds<#,
            tooltip:${woundData.tooltipDesc}
          `,
          priority: undefined
        }, this);
      })
    } else if (this.isApplyingStabilityModifiers) {
      if (!this.isOwnedByActor()) { return []; }
      return [
        ...this.actor.stabilityModData.map((stabilityData) => {
          return new K4Change({
            key: "ModifyRoll",
            mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
            value: `
              filter:${stabilityData.filter},
              canToggle:true,
              label:${stabilityData.label},
              effect:Add,
              value:${stabilityData.value},
              duration:ongoing,
              icon:${this.actor.stabilityIcon},
              fromText:#>text-negmod>Stability<#,
              tooltip:${stabilityData.tooltipDesc}
            `,
            priority: undefined
          }, this);
        }),
        ...this.actor.stabilityConditionModData.map((conditionData) => {
            return new K4Change({
              key: "ModifyRoll",
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: `
                filter:${conditionData.filter},
                label:${conditionData.label},
                effect:Add,
                value:${conditionData.value},
                duration:ongoing,
                icon:${this.actor.stabilityIcon},
                fromText:#>text-negmod>${conditionData.label}<#,
                tooltip:${conditionData.tooltipDesc}
              `,
              priority: undefined
            }, this);
          }),
      ];
    }
    return this.changes
      .filter((change) => change.mode === CONST.ACTIVE_EFFECT_MODES.CUSTOM)
      .map((change) => new K4Change(change, this));
  }
  getCustomChange(id: string): Maybe<K4Change> {
    return this.getCustomChanges().find((change) => change.id === id);
  }
  get enabledCustomChanges(): K4Change[] {
    return this.getCustomChanges().filter((change) => change.isEnabled);
  }
  get requireItemChanges() {
    return this.enabledCustomChanges.filter((change) => change.isRequireItemCheck);
  }
  get permanentChanges() {
    return this.enabledCustomChanges.filter((change) => change.isPermanentChange);
  }
  get promptForDataChanges() {
    return this.enabledCustomChanges.filter((change) => change.isPromptOnCreate);
  }
  get modifyRollChanges() {
    return this.enabledCustomChanges.filter((change) => change.isRollModifier());
  }
  get systemChanges() {
    return this.enabledCustomChanges.filter((change) => change.isSystemModifier);
  }
  // #endregion

  // #region CONSTRUCTOR
  constructor(data: K4ActiveEffect.ConstructorData) {
    super(data);
  }
  // #endregion


  // #region PRIVATE METHODS ~

  // #endregion

  // #REGION === PUBLIC METHODS ===
  override getFlag<T>(namespace: string, key: string): Maybe<T>
  override getFlag<T>(key: string): Maybe<T>
  override getFlag<T>(...args: [string, string] | [string]): Maybe<T> {
    const [namespace, key] = args.length === 1 ? ["kult4th", args[0]] : args;
    return super.getFlag(namespace, key) as Maybe<T>;
  }
  override async setFlag<T>(namespace: string, key: string, val: T): Promise<this>
  override async setFlag<T>(key: string, val: T): Promise<this>
  override async setFlag<T>(...args: [string, string, T] | [string, T]): Promise<this> {
    const [namespace, key, val] = args.length === 2 ? ["kult4th", args[0], args[1]] : args;
    if (!this.owner) {
      throw new Error(`Cannot get flag '${key}' from ActiveEffect with no owner.`);
    }
    await this.owner.updateEmbeddedDocuments("ActiveEffect", [{
      _id: this.id,
      [`flags.${namespace}.${key}`]: val
    }]);
    return this;
  }

  applyToggleListeners(html: JQuery) {
    if (!this.canToggle()) { return undefined; }
    const button$ = html.find(`[data-target="${this.id}"]`);
    button$
      .on({
        click: async (event: ClickEvent) => {
          event.preventDefault();
          if (!this.owner) { return undefined; }
          K4ActiveEffect.onManageActiveEffect(event, this.owner);
        },
        dblclick: async (event: ClickEvent) => {
          event.preventDefault();
          if (!this.owner) { return undefined; }
          if (this.isLocked) {
            const {value, max} = this.uses ?? {};
            if (U.isDefined(value) && value === max) { return undefined; }
            K4ActiveEffect.onManageActiveEffect(event, this.owner, "lock");
            return undefined;
          }
          await K4ActiveEffect.onManageActiveEffect(event, this.owner, "toggle");
          K4ActiveEffect.onManageActiveEffect(event, this.owner, "lock");
        },
        contextmenu: async (event: ClickEvent) => {
          event.preventDefault();
          if (!this.owner) { return undefined; }
          await K4ActiveEffect.onManageActiveEffect(event, this.owner, "reset");
        }
      })
    }
  // #ENDREGION
}

// #region -- INTERFACE AUGMENTATION ~
interface K4ActiveEffect extends ActiveEffect {
  label: string,
  icon: string,
  origin: string,
  changes: EffectChangeData[],
  updateSource(updateData: {changes: EffectChangeData[]}): Promise<void>,
  // data: K4ActiveEffect.Data & ActiveEffectData;
  flags: {
    kult4th: {
      data: K4ActiveEffect.ExtendedData
    }
  }
}
// #endregion
// #region EXPORTS ~
export default K4ActiveEffect;
export {K4Change, EffectSourceType, EffectDuration, EffectResetOn, PromptInputType};
// #endregion