// #region IMPORTS ~
import C, {K4Attribute} from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import K4Actor, {K4ActorType} from "./K4Actor.js";
import K4Item, {K4ItemType, K4ItemRange} from "./K4Item.js";
import K4Roll from "./K4Roll.js";
import K4Scene from "./K4Scene.js";
import K4ActiveEffectSheet from "./K4ActiveEffectSheet.js";
import K4ChatMessage from "./K4ChatMessage.js";
// #endregion

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
  export type Source = EffectChangeData;

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

  export namespace Schema {
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

    type AnySchema = CreateAttack|CreateItem<K4ItemType>|CreateTracker|ModifyTracker|ModifyAttack|ModifyMove|ModifyProperty|ModifyChange|PromptForData|RequireItem|ModifyRoll;

    export type Any = Record<string, unknown> & AnySchema;
  }

  export namespace CustomFunc {
    export type Name = keyof typeof CUSTOM_FUNCTIONS;

    export type Data<N extends keyof typeof CUSTOM_FUNCTIONS, T extends K4ItemType = K4ItemType> =
      N extends "CreateAttack" ? Schema.CreateAttack :
      N extends "CreateItem" ? Schema.CreateItem<T> :
      N extends "CreateTracker" ? Schema.CreateTracker :
      N extends "ModifyTracker" ? Schema.ModifyTracker :
      N extends "ModifyAttack" ? Schema.ModifyAttack :
      N extends "ModifyMove" ? Schema.ModifyMove :
      N extends "ModifyProperty" ? Schema.ModifyProperty :
      N extends "ModifyChange" ? Schema.ModifyChange :
      N extends "PromptForData" ? Schema.PromptForData :
      N extends "RequireItem" ? Schema.RequireItem :
      N extends "ModifyRoll" ? Schema.ModifyRoll :
      never;

    export type AnyData = Schema.Any;
  }

  export type CustomFunc = (this: K4Change, actor: K4Actor|K4Roll, data: Schema.Any) => Promise<boolean>;
}
namespace K4ActiveEffect {
  export type OriginTypes = Exclude<K4ItemType, K4ItemType.darksecret>;
  export type Origin = K4Item<OriginTypes>|K4Actor<K4ActorType.pc>|K4Scene|K4ChatMessage|JQuery;
  export type ToggleCategory = keyof typeof DYNAMIC_CHANGES|K4ItemType;
  // export type CustomFunctionActor = (
  //   this: K4Change,
  //   parent: K4Actor,
  //   data: K4Change.Schema.Any
  // ) => Promise<boolean>;

  // export type CustomFunctionRoll = (
  //   this: K4Change,
  //   parent: K4Roll,
  //   data: K4Change.Schema.ModifyRoll
  // ) => Promise<boolean>;

  // export type CustomFunction = CustomFunctionActor | CustomFunctionRoll;

  export interface BuildData {
    parentData: ParentData,
    changeData: EffectChangeData[]
  }

  export interface ParentData {
    label?: string, // The principal name of the Effect. Appears in tooltips and in chat roll results.  If undefined, effect takes the name of its origin item.
    dynamic?: keyof typeof DYNAMIC_CHANGES, // A list of dynamically-generated changes that should be refreshed each time the effect is applied. Possible values: "wounds", "stability", "stabilityConditions"
    canToggle: boolean, // Whether the user can toggle this effect on/off
    inStatusBar: boolean, // Whether the effect should be displayed in the status bar (default = false UNLESS canToggle = true)
    uses: number, // Number of uses of the effect before it is disabled or requires refill (0 = infinite).
    canRefill: boolean, // Whether the effect's uses can be refilled or if it should be deleted when uses = max
    isUnique: boolean, // Whether the effect is unique (only one copy can be on any Actor at a time)
    duration: EffectDuration, // If/when the effect should be automatically removed ("ongoing" for never)
    defaultState: boolean, // Whether a toggleable effect is enabled by default
    resetOn?: EffectResetOn, // When the effect should reset to its default state (or resetTo)
    resetTo?: boolean, // Overrides the default state when the effect resets
    icon?: string, // The icon to display on the status bar. If undefined, takes icon of origin item.
    statusLabel: string; // The label to display on the status bar (default = "")
    tooltip?: string; // The tooltip to display when hovering over the effect in the status bar OR in the chat card
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
      interface Base extends Omit<ParentData, "uses"|"from"> {
        label: string; // The principal name of the Effect. Appears in tooltips and in chat roll results.
        dynamic?: keyof typeof DYNAMIC_CHANGES, // A list of dynamically-generated changes that should be refreshed each time the effect is applied. Possible values: "wounds", "stability", "stabilityConditions"
        uses?: ValueMax; // Defines and tracks how many times the Effect can be used (i.e. to modify a roll or triggered static ability)
                         // - if undefined, the Effect is not limited-use
        effectSource: Components.EffectSource.Ref; // Identifies the category of entity, event or circumstance that empowers the Effect, and that is ultimately responsible for removing it when it no longer applies.
        fromText: string; // A reference to the source of the effect in FormatForKult form
      }

      export interface ToggleData {
        isLocked: boolean; // Whether the effect has been manually locked to its current state, ignoring 'resetOn'.
        isEnabled: boolean; // Whether the effect is active and should be applied to rolls (default = defaultState)
        toggleCategory: ToggleCategory; // The category of the effect, used to group similar effects in the actor's character sheet
        statusIcon: string; // The icon to display on the toggle modifier button.
        statusLabel: string; // The label to display next to the toggle button in the actor's character sheet (default = "")
        statusTooltip?: string; // Optional override of 'tooltip' for the toggle button tooltip, if different from chat message tooltip
        defaultState: boolean; // Whether the effect is enabled by default when applied. (default = true)
        resetOn: EffectResetOn; // The conditions under which the effect is reset to its default state (default = "never")
        resetTo: boolean; // The state to which the effect is reset when resetOn conditions are met (default = defaultState)
      }

      /**
       * Interface for effects that can be toggled.
       */
      export interface CanToggle extends Omit<Base, "resetOn"|"resetTo">, ToggleData {
        canToggle: true;
        inStatusBar: true;
      }

      /**
       * Interface for effects that cannot be toggled.
       */
      export interface CannotToggle extends Base {
        canToggle: false;
      }
    }
  }

  export type ExtendedData = Components.Effect.CanToggle|Components.Effect.CannotToggle;

  export type Data = ActiveEffectData & {
    flags: {
      kult4th: {
        data: ExtendedData
      }
    }
  }

  export interface ToggleContext extends Components.Effect.ToggleData {
    statusValue: string; // The value displayed next to the toggle button in the actor's character sheet (default = "")
    statusValueGlow: string; // The neon glow class to be applied to any value shown (default = "")
  }
}
// #endregion
// #endregion --

// #region === CUSTOM FUNCTIONS FOR MODE EffectMode.Custom ===
const CUSTOM_FUNCTIONS = {
  async CreateAttack(this: K4Change, _actor: K4Actor, _data: K4Change.Schema.CreateAttack): Promise<boolean> {

    return Promise.resolve(true);
  },
  async CreateItem(this: K4Change, _actor: K4Actor, _data: K4Change.Schema.CreateItem<K4ItemType>): Promise<boolean> {

    return Promise.resolve(true);
  },
  async CreateTracker(this: K4Change, _actor: K4Actor, _data: K4Change.Schema.CreateTracker): Promise<boolean> {

    return Promise.resolve(true);
  },
  async ModifyTracker(this: K4Change, _actor: K4Actor, _data: K4Change.Schema.ModifyTracker): Promise<boolean> {

    return Promise.resolve(true);
  },
  async ModifyAttack(this: K4Change, _actor: K4Actor, _data: K4Change.Schema.ModifyAttack): Promise<boolean> {

    return Promise.resolve(true);
  },
  ModifyMove(this: K4Change, actor: K4Actor, data: K4Change.Schema.ModifyMove): boolean {
    if (!(actor instanceof K4Actor)) {
      throw new Error(`Invalid actor for ModifyMove: ${String(actor)}`);
    }
    const {filter, target, mode, value, text, fromText} = data as Partial<{
      filter: string,
      mode: string,
      target?: string,
      value?: SystemScalar,
      text?: string,
      fromText?: string
    }>;
    if (!filter || !mode) {
      throw new Error(`Invalid data for ModifyMove: ${JSON.stringify(data)}`);
    }
    actor.getItemsByFilter(K4ItemType.move, filter)
      .forEach((move) => {
        switch (mode) {
          case "PushElement": {
            if (!target) {
              throw new Error(`No target provided for PushElement: ${JSON.stringify(data)}`);
            }
            const targetArray = U.getProp<SystemScalar[]>(move, target);
            if (!Array.isArray(targetArray)) {
              throw new Error(`Invalid target array for PushElement: '${target}'`);
            }
            if (U.isUndefined(value)) { return undefined; }
            targetArray.push(value);
            setProperty(move, target, targetArray);
            break;
          }
          case "AppendText": {
            if (!target) {
              throw new Error(`No target provided for AppendText: ${JSON.stringify(data)}`);
            }
            const targetString = U.getProp<string>(move, target);
            if (typeof targetString !== "string") {
              throw new Error(`Invalid target for AppendText: '${target}'`);
            }
            setProperty(move, target, targetString + (text ?? ""));
            break;
          }
          default: {
            throw new Error(`Unrecognized effect for ModifyMove: '${mode}'`);
          }
        }
      });
    return true;
  },
  async ModifyProperty(this: K4Change, actor: K4Actor, data: K4Change.Schema.ModifyProperty, isPermanent = false): Promise<boolean> {
    if (!(actor instanceof K4Actor)) {
      throw new Error(`Invalid actor for ModifyProperty: ${String(actor)}`);
    }
    let {filter, mode, target, value} = data;
    value = U.castToScalar(String(value));
    if (!filter || !target) {
      throw new Error(`Invalid data for ModifyProperty: ${JSON.stringify(data)}`);
    }
    if (filter === "actor") {
      const curVal = U.castToScalar(getProperty(actor, target));
      switch (mode) {
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
          if (isPermanent) {
            await actor.update({[target]: curVal + value});
          } else {
            setProperty(actor, target, curVal + value);
          }
          break;
        }
        case "Set": {
          if (isPermanent) {
            await actor.update({[target]: value});
          } else {
            setProperty(actor, target, value);
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
          if (isPermanent) {
            await actor.update({[target]: value});
          } else {
            setProperty(actor, target, value);
          }
        }
      }
    }
    return true;
  },
  ModifyChange(this: K4Change, actor: K4Actor, data: K4Change.Schema.ModifyChange): boolean {
    if (!(actor instanceof K4Actor)) {
      throw new Error(`Invalid actor for ModifyChange: ${String(actor)}`);
    }
    let {filter, mode, target, value} = data;
    value = U.castToScalar(String(value));
    if (!filter || !target) {
      throw new Error(`Invalid data for ModifyChange: ${JSON.stringify(data)}`);
    }

    return true;
  },
  async PromptForData(this: K4Change, actor: K4Actor, data: K4Change.Schema.PromptForData): Promise<boolean> {
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
    const template = await getTemplate(U.getTemplatePath("dialog", `ask-for-${input}`));
    const context: Record<string, SystemScalar> = {
      title,
      bodyText: bodyText ?? "",
      subText:  subText ?? ""
    };
    const dialogData: Dialog.Data = {
      title,
      content: template(context),
      buttons: {}
    };
    const userOutput = U.castToScalar(await new Promise((resolve) => {
      dialogData.close = () => { resolve(false); }; // User cancelled the dialog; return false to trigger cancellation logic
      switch (input) {
        case PromptInputType.buttons: {
          const buttonVals = (inputVals ?? "")
            .split("|")
            .map(U.castToScalar);
          if (!buttonVals.length) {
            throw new Error(`Invalid data for PromptForData: ${JSON.stringify(data)}`);
          }
          const buttonEntries = buttonVals.map((val) => {
            return [
              String(val),
              {
                label:    String(val),
                callback: () => { resolve(val); }
              }
            ] as const;
          });
          // Assign the default value to the first button
          dialogData.default = String(buttonVals[0]);
          dialogData.buttons = Object.fromEntries<Record<string, unknown>>(buttonEntries);
          break;
        }
        case PromptInputType.text: {
          dialogData.default = "submit";
          dialogData.buttons = {
            submit: {
              label:    "Submit",
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
              label:    "Confirm",
              callback: () => { resolve(true); }
            },
            cancel: {
              label:    "Cancel",
              callback: () => { resolve(false); }
            }
          };
          break;
        }
      }
      new Dialog(dialogData, {
        classes: [C.SYSTEM_ID, "dialog"]
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
  RequireItem(this: K4Change, actor: K4Actor, data: K4Change.Schema.RequireItem): boolean {
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
  async ModifyRoll(this: K4Change, roll: K4Roll, data: K4Change.Schema.ModifyRoll): Promise<boolean> {
    if (!this.isInstantiated()) {
      throw new Error("Custom function ModifyRoll called without a valid K4Change instance.");
    }
    if (!(roll instanceof K4Roll)) {
      throw new Error(`Invalid roll for ModifyRoll: ${String(roll)}`);
    }
    let {filter, mode, value} = data as Partial<{
      filter: string,
      mode: string,
      value: SystemScalar
    }>;
    if (!filter || typeof filter !== "string") {
      throw new Error(`Invalid filter for ModifyRoll: ${filter}`);
    }
    if (!mode || typeof mode !== "string") {
      throw new Error(`Invalid effect for ModifyRoll: ${mode}`);
    }
    if (typeof value === "string") {
      if (value === "prompt") {
        const {title, bodyText, subText, input, inputVals} = data as Partial<{
          title: string,
          bodyText: string,
          subText: string,
          input: string,
          inputVals: string
        }>;
        const template = await getTemplate(U.getTemplatePath("dialog", `ask-for-${input}`));
        const context: Record<string, SystemScalar> = {
          title:    title ?? "Input Roll Data",
          bodyText: bodyText ?? "",
          subText:  subText ?? ""
        };
        const dialogData: Dialog.Data = {
          title:   context.title as string,
          content: template(context),
          buttons: {}
        };
        const userOutput: SystemScalar = U.castToScalar(await new Promise((resolve) => {
          dialogData.close = () => { resolve(false); }; // User cancelled the dialog; cancel the roll.
          switch (input) {
            case PromptInputType.buttons: {
              const buttonVals = (inputVals ?? "")
                .split("|")
                .map(U.castToScalar);
              if (!buttonVals.length) {
                throw new Error(`Invalid data for PromptForData: ${JSON.stringify(data)}`);
              }
              const buttonEntries = buttonVals.map((val) => {
                return [
                  String(val),
                  {
                    label:    String(val),
                    callback: () => {resolve(val)}
                  }
                ] as const;
              });
              // Assign the default value to the first button
              dialogData.default = String(buttonVals[0]);
              dialogData.buttons = Object.fromEntries<Record<string, unknown>>(buttonEntries);
              break;
            }
            case PromptInputType.text: {
              dialogData.default = "submit";
              dialogData.buttons = {
                submit: {
                  label:    "Submit",
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
                  label:    "Confirm",
                  callback: () => { resolve(true); }
                },
                cancel: {
                  label:    "Cancel",
                  callback: () => { resolve(false); }
                }
              };
              break;
            }
            default: {
              throw new Error(`Invalid input type for PromptForData: ${input}`);
            }
          }
          new Dialog(dialogData, {
            classes: [C.SYSTEM_ID, "dialog"]
          }).render(true);
        }));
        if (userOutput === false) {
          return false; // User cancelled dialog; return false to cancel roll.
        }
        value = userOutput;
      } else if (value.startsWith("actor")) {
        const {actor} = roll;
        value = U.castToScalar(getProperty(actor, value.slice(6)));
      }
    }
    switch (mode) {
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
          id:           this.id,
          filter:       this.filter,
          label:        this.customFunctionData.label as Maybe<string> ?? this.name,
          tooltipLabel: this.customFunctionData.label as Maybe<string> ?? this.name,
          tooltipDesc:  this.tooltip ?? "",
          value,
          cssClasses:   [
            value >= 0 ? "k4-theme-gold" : "k4-theme-red"
          ]
        });
        break;
      }
      default: {
        throw new Error(`Unrecognized mode for ModifyRoll: ${mode}`);
      }
    }
    return true;
  }
} as const;
// #endregion

// #region === DYNAMIC CHANGE GENERATION ===
type DynamicChangeGenerator = (effect: K4ActiveEffect) => K4Change[];
const DYNAMIC_CHANGES = {
  armor: (effect: K4ActiveEffect) => {
    if (!effect.isOwnedByActor(K4ActorType.pc)) { return []; }
    if (effect.actor.system.armor === 0) { return []; }
    return [
      new K4Change(
        K4ActiveEffect.BuildChangeData("ModifyRoll", {
          filter: "Endure Injury",
          mode: "Add",
          value: effect.actor.system.armor
        }), effect
      )
    ];
  },
  wounds: (effect: K4ActiveEffect) => {
    if (!effect.isOwnedByActor(K4ActorType.pc)) { return []; }
    return effect.actor.woundModData
      .map((woundData) => {
        if (woundData.value === 0) {
          return undefined;
        }
        return new K4Change(
          K4ActiveEffect.BuildChangeData("ModifyRoll", {
              filter: woundData.filter,
              mode: "Add",
              value: woundData.value
            }), effect
        );
      })
      .filter(Boolean) as K4Change[];
  },
  stability: (effect: K4ActiveEffect) => {
    if (!effect.isOwnedByActor(K4ActorType.pc)) { return []; }
    return effect.actor.stabilityModData.map((stabilityData) => {
      if (stabilityData.value === 0) {
        return undefined;
      }
      return new K4Change(
        K4ActiveEffect.BuildChangeData("ModifyRoll", {
            filter: stabilityData.filter,
            mode: "Add",
            value: stabilityData.value
          }), effect
        );
      })
      .filter(Boolean) as K4Change[];
  },
  stabilityConditions: (effect: K4ActiveEffect) => {
    if (!effect.isOwnedByActor(K4ActorType.pc)) { return []; }
    return effect.actor.stabilityConditionModData
      .map((stabilityConditionData) => {
        if (stabilityConditionData.value === 0) {
          return undefined;
        }
        return new K4Change(
          K4ActiveEffect.BuildChangeData("ModifyRoll", {
            filter: stabilityConditionData.filter,
            mode: "Add",
            value: stabilityConditionData.value
          }), effect
        );
      })
      .filter(Boolean) as K4Change[];
  }
} as const;
// #endregion

// #region === K4CHANGE CLASS ===
/**
 * A utility class wrapper around the changes array of a K4ActiveEffect, providing methods for
 * compiling, filtering, and applying changes to a parent K4Actor.
 */
class K4Change implements EffectChangeData {
  // #region STATIC METHODS ~

  // #endregion

  // #region Effect Change Data Properties ~
  key: string;
  value: string;
  mode: number;
  priority: number | null | undefined;
  // #endregion

  // #region GETTERS & SETTERS ~
  isInstantiated(): this is typeof this & {id: string, parentEffect: K4ActiveEffect} {
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
    return this.customFunctionName === "ModifyRoll";
  }
  get filter(): K4Attribute|K4ItemType|string {
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
    if (value === "prompt") {
      return this._promptedValue;
    }
    if (!this.isOwnedByActor()) {
      if (!U.isSystemScalar(value)) { return undefined; }
      return value;
    }
    if (typeof value === "string" && value.startsWith("actor.")) {
      return U.getProp<SystemScalar>(this.actor, value.slice(6));
    }
    return U.castToScalar(value);
  }
  get modData(): K4Roll.ModData {
    if (!this.isInstantiated()) {
      throw new Error(`Invalid K4Change instance for modData: ${String(this)}`);
    }
    if (typeof this.finalValue !== "number") {
      throw new Error(`Invalid finalValue for K4Change '${this.finalValue}' (should it be in the status bar?)`);
    }
    return {
      id:           this.id,
      filter:       this.filter,
      label:        this.customFunctionData.label as Maybe<string> ?? this.name,
      tooltipLabel: this.customFunctionData.label as Maybe<string> ?? this.name,
      tooltipDesc:  this.tooltip ?? "",
      value:        this.finalValue,
      cssClasses:   [
        this.finalValue >= 0 ? "k4-theme-gold" : "k4-theme-red"
      ]
    };
  }
  isCollapsible() {
    return this.isRollModifier() && typeof this.finalValue === "number" && this.customFunctionData.inStatusBar !== false;
  }  // #endregion

  // #region CONSTRUCTOR
  customFunctionName: keyof typeof CUSTOM_FUNCTIONS;
  customFunction: K4Change.CustomFunc;
  customFunctionData: K4Change.CustomFunc.AnyData;
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
    this.customFunctionName = key as KeyOf<typeof CUSTOM_FUNCTIONS>;
    this.customFunction = CUSTOM_FUNCTIONS[this.customFunctionName].bind(this) as K4Change.CustomFunc;
    this.customFunctionData = JSON.parse(value) as K4Change.CustomFunc.AnyData;
    this.parentEffect = effect;
  }
  // #endregion


  async apply(parent: K4Actor): Promise<string|boolean>
  async apply(parent: K4Roll): Promise<boolean>
  async apply(parent: K4Actor|K4Roll): Promise<string|boolean> {
    const {parentEffect} = this;
    if (!parentEffect) {
      throw new Error(`[K4Change.apply] No valid parentEffect found for '${this.customFunctionName}' K4Change`);
    }
    if (parent instanceof K4Actor) {
      return this.customFunction(parent, this.customFunctionData);
    }
    return this.customFunction(parent, this.customFunctionData);
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

    if (U.isJQuery(origin)) {
      // ActiveEffect is being applied by a clicked link. Only claim links in chat messages are supported, so we confirm that:
      if (!origin.hasClass("claim-link")) {
        throw new Error(`Invalid origin link for ActiveEffect: ${origin.text()}`);
      }
      /**
       * @todo Implement dataset definitions for defining a claim link within a chat message such that its source can be determined.
       */
    }

    throw new Error(`Invalid origin type for ActiveEffect: ${String(origin)}`);
  }

  static #resolveEffectName(effectDataSet: K4ActiveEffect.BuildData, origin: K4ActiveEffect.Origin, explicitOnly?: false): string
  static #resolveEffectName(effectDataSet: K4ActiveEffect.BuildData, origin: K4ActiveEffect.Origin, explicitOnly: true): Maybe<string>
  static #resolveEffectName(effectDataSet: K4ActiveEffect.BuildData, origin: K4ActiveEffect.Origin, explicitOnly = false): Maybe<string> {
    const {parentData} = effectDataSet;
    let effectName: Maybe<string> = parentData.label;
    if (effectName ?? explicitOnly) { return effectName; }

    if (
         origin instanceof K4Item
      || origin instanceof K4Actor
      || origin instanceof K4Scene
    ) {
      effectName = origin.name;
    }
    if (origin instanceof K4ChatMessage) {
      throw new Error(`An explicit label must be provided for ActiveEffects created by ChatMessages.`);
    }
    return effectName;
  }

  static #parseEffectData(data: K4ActiveEffect.BuildData, origin: K4ActiveEffect.Origin): K4ActiveEffect.ExtendedData {
    const {parentData} = data;
    const {uses: usageMax, from, dynamic, ...baseExtData} = parentData;
    const effectSource = this.#resolveEffectSource(origin);
    const label = this.#resolveEffectName(data, origin);
    let uses: Maybe<ValueMax> = undefined;
    if (U.isDefined(usageMax) && usageMax > 0) {
      uses = {
        min: 0,
        max: usageMax,
        value: 0
      };
    }
    if (U.isJQuery(origin)) {
      throw new Error(`No origin ID provided for JQuery-delivered ActiveEffect: ${JSON.stringify(data)}`);
    }
    const fromText: string = [
      "&nbsp;",
      "(from ",
      from ?? `#>text-doclink>#${origin.name}<#`,
      ")"
    ].join("");
    if (parentData.canToggle) {
      let toggleCategory: K4ActiveEffect.ToggleCategory;
      if (dynamic) {
        toggleCategory = dynamic;
      } else if (origin instanceof K4Item) {
        toggleCategory = origin.type;
      } else {
        throw new Error(`No toggle category found for ActiveEffect: ${JSON.stringify(data)}`);
      }

      let resetOn: EffectResetOn;
      if (parentData.resetOn) {
        resetOn = parentData.resetOn;
      } else if (U.isDefined(uses)) {
        resetOn = EffectResetOn.onUse;
      } else {
        resetOn = EffectResetOn.never;
      }

      return {
        ...baseExtData,
        dynamic,
        canToggle: true,
        inStatusBar: true,
        isLocked: false,
        isEnabled: parentData.defaultState,
        toggleCategory,
        statusIcon: parentData.icon ?? `systems/${C.SYSTEM_ID}/assets/icons/modifiers/default-neutral.svg`,
        resetOn,
        resetTo: parentData.resetTo ?? parentData.defaultState,
        label,
        uses,
        effectSource,
        fromText
      };
    } else {
      return {
        ...baseExtData,
        dynamic,
        canToggle: false,
        label,
        uses,
        effectSource,
        fromText
      };
    }
  }

  static BuildEffectData(data?: Partial<K4ActiveEffect.ParentData>): K4ActiveEffect.ParentData {
    data ??= {};
    const canToggle = Boolean(data.canToggle);
    const inStatusBar = canToggle || Boolean(data.inStatusBar);
    return {
      canToggle,
      inStatusBar,
      dynamic: data.dynamic ?? undefined,
      label: data.label ?? undefined,
      uses: data.uses ?? 0,
      canRefill: (data.uses ?? 0) > 0
        ? Boolean(data.canRefill)
        : false,
      isUnique: data.isUnique ?? true,
      duration: data.duration ?? EffectDuration.ongoing,
      defaultState: data.defaultState ?? true,
      resetOn: canToggle
        ? (data.resetOn ?? EffectResetOn.never)
        : undefined,
      resetTo: canToggle
        ? (data.resetTo ?? data.defaultState ?? true)
        : undefined,
      icon: data.icon ?? undefined,
      statusLabel: data.statusLabel ?? "",
      tooltip: data.tooltip ?? undefined,
      permanent: Boolean(data.permanent)
    };
  }

  static BuildChangeData<N extends K4Change.CustomFunc.Name, T extends K4ItemType = K4ItemType>(funcName: N, value: K4Change.CustomFunc.Data<N, T>): EffectChangeData {
    return {
      key: funcName,
      mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
      value: JSON.stringify(value),
      priority: undefined
    };
  }

  static async CreateFromBuildData(
    effectDataSet: ValueOrArray<K4ActiveEffect.BuildData>,
    origin: K4ActiveEffect.Origin,
    target?: K4Actor
  ): Promise<K4ActiveEffect[]> {
    if (Array.isArray(effectDataSet)) {
      const effects = await Promise.all(effectDataSet.map((data) => this.CreateFromBuildData(data, origin, target)));
      return effects.flat();
    }
    const effectHost = target ?? origin;
    if (U.isJQuery(effectHost)) {
      throw new Error(`No target provided for JQuery-delivered ActiveEffect (derive from ChatMessage?): ${JSON.stringify(effectDataSet)}`);
    }
    if (effectHost instanceof K4ChatMessage) {
      throw new Error(`No target provided for ChatMessage-delivered ActiveEffect (derive from ChatMessage?): ${JSON.stringify(effectDataSet)}`);
    }
    if (U.isJQuery(origin)) {
      throw new Error(`No origin ID provided for JQuery-delivered ActiveEffect: ${JSON.stringify(effectDataSet)}`);
    }
    const effectExtendedData = this.#parseEffectData(effectDataSet, origin);

    // If the effect is unique, delete any existing effect with the same name
    if (effectExtendedData.isUnique) {
      const existingEffect = effectHost.effects.find((effect) => effect.label === effectExtendedData.label);
      if (existingEffect) {
        await existingEffect.delete();
      }
    }

    return effectHost.createEmbeddedDocuments("ActiveEffect", [{
      origin:   origin.uuid,
      label: effectExtendedData.label,
      transfer: origin.uuid !== target?.uuid,
      disabled: false,
      changes:  effectDataSet.changeData,
      flags: {
        kult4th: {
          data: effectExtendedData
        }
      }
    }]) as unknown as Promise<K4ActiveEffect[]>;
  }


  static DoesFilterApplyToMove(filter: string, move: K4Item<K4ItemType.move>): boolean {
    if (filter === "all") { return true; }
    if (filter === move.parentType as string) { return true; }
    if (filter === move.name) { return true; }
    if (filter === move.parentName) { return true; }
    return false;
  }

  /**
   * Type guard to check if the effect can be toggled.
   * @returns {boolean} - True if the effect can be toggled, false otherwise.
   */
  canToggle(): this is this & { eData: {canToggle: true} } {
    return this.flags.kult4th.data.canToggle;
  }
  get defaultState(): boolean { return this.canToggle() ? this.eData.defaultState : true; }
  get isLocked(): boolean { return this.canToggle() ? this.eData.isLocked : false; }
  set isLocked(value: boolean) { void this.setFlag<boolean>("data.isLocked", value);}
  get isEnabled(): boolean { return this.canToggle() ? this.eData.isEnabled : true; }
  get isNonZero(): boolean {
    return this.getCustomChanges()
      .some((change) => change.finalValue !== 0);
  }
  get resetOn(): EffectResetOn { return this.canToggle() ? this.eData.resetOn : EffectResetOn.never; }
  get resetTo(): boolean { return this.canToggle() ? this.eData.resetTo : this.defaultState; }
  get toggleCategory(): K4ActiveEffect.ToggleCategory {
    if (this.eData.dynamic) { return this.eData.dynamic; }
    if (this.originItem instanceof K4Item) {
      return this.originItem.type;
    }
    throw new Error(`No origin item found for ActiveEffect: ${this.id}`);
  }
  get statusIcon(): string {
    if (!this.canToggle()) { return ""; }
    if (!this.isOwnedByActor()) { return ""; }
    if (this.eData.statusIcon) { return this.eData.statusIcon; }
    return `systems/${C.SYSTEM_ID}/assets/icons/modifiers/default-${this.benefit}.svg`;
  }
  get statusLabel(): string { return this.canToggle() ? this.eData.statusLabel : ""; }
  get statusTooltip(): string { return this.canToggle() ? this.eData.statusTooltip ?? "" : ""; }
  get effectDuration(): EffectDuration { return this.eData.duration; }
  get isUnique(): boolean { return this.eData.isUnique; }
  get uses(): Maybe<ValueMax> { return this.eData.uses; }
  get canRefill(): Maybe<boolean> { return this.eData.canRefill; }
  get effectSource(): K4ActiveEffect.Components.EffectSource.Ref { return this.eData.effectSource; }
  get fromText(): string { return this.eData.fromText; }
  get benefit(): "pos"|"neg"|"neutral" {
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
  get statusValue(): Maybe<string> {
    if (U.isUndefined(this.value)) { return undefined; }
    if (!U.isNumber(this.value)) { return undefined; }

    return U.signNum(this.value, "", "+");
  }
  get statusValueGlow(): Maybe<string> {
    if (!this.canToggle()) { return undefined; }
    if (U.isUndefined(this.value)) { return undefined; }
    if (this.value > 0) { return "neon-glow-soft-blue"; }
    if (this.value < 0) { return "neon-glow-soft-red"; }
    return "neon-glow-soft-gold";
  }
  get toggleContext(): Maybe<K4ActiveEffect.ToggleContext> {
    if (!this.canToggle()) { return undefined; }
    if (!this.isOwnedByActor()) { return undefined; }
    return {
      isEnabled:       this.isEnabled,
      defaultState:    this.defaultState,
      resetOn:         this.resetOn,
      resetTo:         this.resetTo,
      isLocked:        this.isLocked,
      statusIcon:      this.statusIcon,
      toggleCategory:  this.toggleCategory,
      statusLabel:     this.statusLabel,
      statusTooltip:   this.statusTooltip,
      statusValue:     this.statusValue ?? "",
      statusValueGlow: this.statusValueGlow ?? ""
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
  // #region INITIALIZATION ~
  static PreInitialize() {
    CONFIG.ActiveEffect.documentClass = K4ActiveEffect;
    DocumentSheetConfig.unregisterSheet(ActiveEffect, "core", ActiveEffectConfig);
    DocumentSheetConfig.registerSheet(ActiveEffect, "kult4th", K4ActiveEffectSheet, {makeDefault: true});

    Hooks.on("createActiveEffect", async (effect: K4ActiveEffect) => {
      kLog.display(`[on CreateActiveEffect] ${effect.label}`, {
        effect,
        origin:             effect.origin,
        ownedByActor:       effect.isOwnedByActor(),
        hasItemOrigin:      effect.hasItemOrigin(),
        originDoc:          effect.origin ? fromUuidSync(effect.origin) : null,
        isItemOwned:        effect.hasItemOrigin() ? effect.originItem.isOwnedItem() : false,
        requireItemChanges: effect.requireItemChanges,
        permanentChanges:   effect.permanentChanges
      });

      // If this effect is not embedded in an actor, do nothing
      if (!effect.isOwnedByActor()) { return true; }

      // If the effect has no custom changes, do nothing.
      if (!effect.getCustomChanges().length) { return true; }

      const originItem = fromUuidSync(effect.origin) as Maybe<K4Item>;

      /* === PROCESS CUSTOM CHANGES: STEP 1 - RequireItem Prerequisite Check === */
      // Check for any "RequireItem" changes. If any of them fail, remove both the ActiveEffect and the embedded Item.
      if (effect.requireItemChanges.some(async (change) => !(await change.apply(effect.actor)))) {
        await originItem?.delete();
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
      await Promise.all(effect.permanentChanges.map((change) => change.apply(effect.actor)));
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
    if (this.isOwnedByActor() && this.id) {
      await this.actor.deleteEmbeddedDocuments("ActiveEffect", [this.id]);
      /**
       * @todo Have to also implement removal of created items/attacks/etc
       */
      return this;
    }
    return super.delete(options);
  }

  async toggleEnabled(value = !this.isEnabled, isForcing = false) {
    if (!this.canToggle()) { return undefined; }
    if (this.isLocked && !isForcing) { return undefined; }
    const promises: Array<Promise<unknown>> = [
      this.setFlag<boolean>("data.isEnabled", value)
    ];
    if (this.isLocked && isForcing) {
      promises.push(this.toggleLock(false));
    }
    return Promise.all(promises);
  }
  async toggleLock(value = !this.isLocked) {
    if (!this.canToggle()) { return undefined; }
    return this.setFlag<boolean>("data.isLocked", value);
  }
  async reset(resetTo = this.resetTo, isForcing = false) {
    if (this.isLocked && !isForcing) { return undefined; }
    const promises: Array<Promise<unknown>> = [];
    if (this.isLocked && isForcing) {
      promises.push(this.toggleLock(false));
    }
    if (resetTo !== this.isEnabled) {
      promises.push(this.toggleEnabled(resetTo, true));
    }
    return Promise.all(promises);
  }
  async use() {
    const promises: Array<Promise<unknown>> = [];

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
      if (!(await change.apply(roll))) {
        returnVal = false;
        break;
      }
    }
    if (!returnVal) { return false; }
    void this.use();
    return returnVal;
  }

  // #region GETTERS & SETTERS ~
  isOwned(): this is {origin: string, owner: K4Actor|K4Item} {
    return Boolean(this.origin);
  }
  isOwnedByActor<T extends K4ActorType = K4ActorType>(type?: T): this is {origin: string, owner: K4Actor<T>, actor: K4Actor<T>} {
    if (!this.isOwned()) { return false; }
    if (type && this.owner.type !== type) { return false; }
    return this.origin.startsWith("Actor");
  }
  isOwnedByItem<T extends K4ItemType = K4ItemType>(type?: T): this is {origin: string, owner: K4Item<T>, originItem: K4Item<T>} {
    if (!this.isOwned()) { return false; }
    if (type && this.owner.type !== type) { return false; }
    return this.origin.startsWith("Item");
  }
  hasItemOrigin(): this is {origin: string, owner: K4Actor|K4Item, originItem: K4Item} {
    return this.isOwned() && this.origin.includes("Item");
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
  get eData(): K4ActiveEffect.ExtendedData {
    const eData = this.getFlag<K4ActiveEffect.ExtendedData>("data");
    if (!eData) {
      throw new Error(`ActiveEffect ${this.id} has no extended data.`);
    }
    return eData;
  }

  getCustomChanges(): K4Change[] {
    const changes: K4Change[] = [];
    if (this.eData.dynamic) {
      changes.push(...DYNAMIC_CHANGES[this.eData.dynamic](this));
    }
    changes.push(...this.changes
      .filter((change) => change.mode === CONST.ACTIVE_EFFECT_MODES.CUSTOM)
      .map((change) => new K4Change(change, this))
    );
    return changes;
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
      _id:                           this.id,
      [`flags.${namespace}.${key}`]: val
    }]);
    return this;
  }

  applyToggleListeners(html: JQuery) {
    if (!this.canToggle()) { return; }
    const button$ = html.find(`[data-target="${this.id}"]`);
    button$
      .on({
        click: async (event: ClickEvent) => {
          event.preventDefault();
          if (!this.owner) { return; }
          await K4ActiveEffect.onManageActiveEffect(event, this.owner);
        },
        dblclick: async (event: ClickEvent) => {
          event.preventDefault();
          if (!this.owner) { return; }
          if (this.isLocked) {
            const {value, max} = this.uses ?? {};
            if (U.isDefined(value) && value === max) { return; }
            await K4ActiveEffect.onManageActiveEffect(event, this.owner, "lock");
            return;
          }
          await K4ActiveEffect.onManageActiveEffect(event, this.owner, "toggle");
          await K4ActiveEffect.onManageActiveEffect(event, this.owner, "lock");
        },
        contextmenu: async (event: ClickEvent) => {
          event.preventDefault();
          if (!this.owner) { return; }
          await K4ActiveEffect.onManageActiveEffect(event, this.owner, "reset");
        }
      });
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