// #region IMPORTS ~
import C, {K4Attribute} from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import K4Actor, {K4ActorType} from "./K4Actor.js";
import K4Item, {K4ItemType} from "./K4Item.js";
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

enum PromptInputType {
  buttons = "buttons",
  text = "text",
  confirm = "confirm"
}
// #endregion
// #region TYPES ~
namespace K4Change {
  export type Source = EffectChangeData;

}
namespace K4ActiveEffect {
  export type OriginTypes = Exclude<K4ItemType, K4ItemType.darksecret>;
  export type Origin = K4Item<OriginTypes>|K4Actor<K4ActorType.pc>|K4Scene|K4ChatMessage;
  export type CustomFunction = (
    parent: K4Actor|K4Roll,
    data: Record<string, string|number|boolean>
  ) => ValueOrPromise<void|boolean|string>;

  namespace Components {
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
      export type Data = DocSource|ResultSource;
    }

    export namespace Effect {
      interface Base {
        canToggle: boolean; // Whether the PARENTACTOR can toggle the effect on/off on their character sheet (default = true)
        defaultState?: boolean; // Whether the effect is enabled by default when applied. (default = true)
        toggleLabel?: string; // The label to display next to the the toggle button in the actor's character sheet (default = "")
        tooltip?: string; // The tooltip to display on the toggle button in the actor's character sheet
        uses?: ValueMax; // Defines and tracks how many times the Effect can be used (i.e. to modify a roll or triggered static ability)
                          // - if undefined, the Effect is not limited-use
        duration?: EffectDuration, // The duration of the Effect, which determines when it is automatically removed (default = "ongoing")
        effectSource: Components.EffectSource.Data // Identifies the category of entity, event or circumstance that empowers the Effect, and that is ultimately responsible for removing it when it no longer applies.
      }
      interface CanToggle extends Base {
        canToggle: true;
        defaultState: boolean;
        toggleLabel: string;
        tooltip: string;
      }
      interface CannotToggle extends Base {
        canToggle: false;
        defaultState?: never;
        toggleLabel?: never;
        tooltip?: never;
      }
      export type Data = CanToggle|CannotToggle;
    }
  }

  export type ExtendedData = Components.Effect.Data;
  export type ExtendedConstructorData = Omit<ExtendedData, "effectSource">;

  export type ConstructorData = ActiveEffectDataConstructorData;

  export type Data = ActiveEffectData & {
    flags: {
      kult4th: {
        data: ExtendedData
      }
    }
  }
}
// #endregion

// #endregion --


// #region === CUSTOM FUNCTIONS FOR MODE EffectMode.Custom ===
const CUSTOM_FUNCTIONS: Record<
  string,
  K4ActiveEffect.CustomFunction
> = {
  ApplyWounds: async (roll, data) => {
    if (!(roll instanceof K4Roll)) {
      throw new Error(`Invalid roll for ApplyWounds: ${String(roll)}`);
    }

  },
  ApplyStability: async (roll, data) => {
    if (!(roll instanceof K4Roll)) {
      throw new Error(`Invalid roll for ApplyStability: ${String(roll)}`);
    }

  },
  CreateAttack: async (actor, data) => {

  },
  CreateWeapon: async (actor, data) => {

  },
  CreateTracker: async (actor, data) => {

  },
  ChangeTracker: async (actor, data) => {

  },
  ModifyAttack: async (actor, data) => {

  },
  ModifyMove: async (actor, data) => {
    if (!(actor instanceof K4Actor)) {
      throw new Error(`Invalid actor for ModifyMove: ${String(actor)}`);
    }
    const {filter, target, effect, value, text, fromText} = data as Partial<{
      filter: string,
      effect: string,
      target?: string,
      value?: string|number|boolean,
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
            const targetArray = U.getProp<Array<string|number|boolean>>(move, target ?? "");
            if (!Array.isArray(targetArray)) {
              throw new Error(`Invalid target for PushElement: '${target}'`);
            }
            if (U.isUndefined(value)) { return; }
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
      })
  },
  ModifyProperty: async (actor, data) => {
    if (!(actor instanceof K4Actor)) {
      throw new Error(`Invalid actor for ModifyMove: ${String(actor)}`);
    }
    const {filter, effect, target, value, permanent} = data;
    if (!filter || !effect || !target) {
      throw new Error(`Invalid data for ModifyProperty: ${JSON.stringify(data)}`);
    }
    if (filter === "actor") {
      const curVal = getProperty(actor, `${target}`);
      if (`${value}` === `${curVal}`) {
        return;
      }
      switch (effect) {
        case "Set": {
          if (permanent === true) {
            actor.update({[`${target}`]: value});
          } else {
            setProperty(actor, `${target}`, value);
          }
          break;
        }
        case "Downgrade": {
          let curValue = getProperty(actor, `${target}`);
          if (U.isNumString(curValue)) {
            curValue = U.pInt(curValue);
          } else if (U.isBooleanString(curValue)) {
            curValue = U.pBool(curValue);
          }
          if (value === curValue) { return; }
          if (typeof value === "string") {
            throw new Error(`Invalid string value for Downgrade: '${value}'`);
          }
          if (typeof curValue === "number" && typeof value === "number" && value > curValue) {
            return;
          }
          if (value === true) { return; }
          if (permanent === true) {
            actor.update({[`${target}`]: value});
          } else {
            setProperty(actor, `${target}`, value);
          }
        }
      }
    }
  },
  PromptForData: async (actor, data) => {
    if (!(actor instanceof K4Actor)) {
      throw new Error(`Invalid actor for ModifyMove: ${String(actor)}`);
    }
    const {title, key, input, inputVals, default: defaultVal, bodyText, subText} = data as Partial<{
      title: string,
      key: string,
      input: PromptInputType,
      default: string|number|boolean,
      inputVals?: string,
      bodyText?: string,
      subText?: string
    }>;
    if (typeof key !== "string") {
      throw new Error(`No key provided for PromptForData: ${JSON.stringify(data)}`);
    }
    // If the key has already been filled with data, skip the prompt.
    // if (key.startsWith("flags")) {
    //   const flagKey = key.split(".").slice(1).join(".");
    //   if (actor.getFlag(C.SYSTEM_ID, flagKey) !== undefined) {
    //     return;
    //   }
    // }
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
    const context: Record<string, string|number|boolean> = {
      title,
      bodyText: bodyText ?? "",
      subText: subText ?? ""
    }
    const dialogData: Dialog.Data = {
      title,
      content: template(context),
      buttons: {}
    };
    const userOutput = await new Promise((resolve) => {
      dialogData.close = () => resolve(defaultVal);
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
    if (key.startsWith("flags")) {
      const flagKey = key.split(".").slice(1).join(".");
      await actor.setFlag(C.SYSTEM_ID, flagKey, userOutput);
      return;
    }
    throw new Error(`Unrecognized key for PromptForData: ${key}`);
  },
  RequireItem: (actor, data) => {
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
  ModifyRoll: (roll, data) => {
    if (!(roll instanceof K4Roll)) {
      throw new Error(`Invalid roll for ModifyRoll: ${String(roll)}`);
    }
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
  static ParseFunctionDataString(dataString: string): Record<string, string|number|boolean> {
    if (!dataString) { return {}; }
    const pairs = dataString.match(/([^,]+:[^,]+(?:,[^,]+)*?)(?=(?:,[^:]+:)|$)/g);
    if (!pairs) {
      throw new Error(`Invalid function data string format: "${dataString}"`);
    }


    return pairs.reduce((acc, pair) => {
      let [key, value]: [string, string|number|boolean] = pair.split(/:(.+)/) // Split only at the first colon
        .map(str => str.trim()) as [string, string];

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
    }, {} as Record<string,string|number|boolean>);
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
    return !this.parentEffect.disabled;
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
  isRollModifier(): this is typeof this & {modData: K4Roll.ModData} {
    return ["ModifyRoll", "ApplyWounds", "ApplyStability"].includes(this.customFunctionName);
  }
  get modData(): Maybe<K4Roll.ModData> {
    if (!this.isRollModifier()) {
      throw new Error(`[K4Change.modData] Attempted to access modData for non-roll modifier: ${this.customFunctionName}`);
    }
    if (!this.hasNumericValue()) {
      throw new Error(`[K4Change.modData] Attempted to access modData for non-numeric value: ${this.customFunctionName} (${this.finalValue})`);
    }
    return {
      name: this.name,
      filter: this.filter,
      value: this.finalValue,
      icon: this.icon,
      tooltip: this.tooltip,
      linkToItem: this.originItem
    }
  }

  get filter(): "all"|K4Attribute|K4ItemType|string {
    return this.customFunctionData.filter as Maybe<string> ?? "all";
  }
  get name(): string {
    return this.customFunctionData.name as Maybe<string>
      ?? this.originItem?.name
      ?? (["wounds", "stability"].includes(String(this.customFunctionData.value))
        ? U.tCase(this.customFunctionData.value)
        : undefined)
      ?? "";
  }
  get icon(): string {
    return this.customFunctionData.icon as Maybe<string>
      ?? this.parentEffect?.icon
      ?? this.originItem?.img
      ?? "";
  }
  get tooltip(): Maybe<string> {
    if (typeof this.customFunctionData.tooltip !== "string") { return; }
    return this.customFunctionData.tooltip;
  }
  _promptedValue?: string|number|boolean;
  get finalValue(): Maybe<string|number|boolean> {
    const {value} = this.customFunctionData;
    if (value === undefined) { return; }
    if (value === "prompt") {
      return this._promptedValue;
    }
    if (!this.isOwnedByActor()) { return value }
    // if (value === "wounds") {
    //   return this.actor.
    // }
    if (typeof value === "string" && value.startsWith("actor.")) {
      return getProperty(this.actor as K4Actor, value.slice(6));
    }
    if (U.isNumString(value)) {
      return U.pInt(value);
    }
    if (U.isBooleanString(value)) {
      return U.pBool(value);
    }
    return value;
  }
  hasNumericValue(): this is typeof this & {finalValue: number} {
    return typeof this.finalValue === "number";
  }
  isInStatusBar(): this is typeof this & {finalValue: number} {
    return this.isRollModifier()
      && this.customFunctionData.inStatusBar !== false
      && this.hasNumericValue();
  }
  get canToggle(): boolean {
    return this.isRollModifier() && this.customFunctionData.canToggle === true;
  }
  // #endregion

  // #region CONSTRUCTOR
  customFunctionName: keyof typeof CUSTOM_FUNCTIONS;
  customFunction: K4ActiveEffect.CustomFunction;
  customFunctionData: Record<string, string|number|boolean>;
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
    this.customFunction = CUSTOM_FUNCTIONS[key];
    this.customFunctionData = K4Change.ParseFunctionDataString(value);
    this.parentEffect = effect;
  }
  // #endregion


  apply(parent?: K4Actor|K4Roll) {
    parent ??= this.actor;
    if (!parent) {
      throw new Error(`[K4Change.apply] No valid parent found for '${this.customFunctionName}' K4Change of K4ActiveEffect '${this.parentEffect?.name ?? "(Uninstantiated Effect Data)"}'`);
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

  static override create(data: K4ActiveEffect.ConstructorData, options?: DocumentModificationContext): Promise<K4ActiveEffect> {
    return super.create(data, options) as Promise<K4ActiveEffect>;
  }
  static #isChangeModeCustom(change: EffectChangeData): boolean { return change.mode === CONST.ACTIVE_EFFECT_MODES.CUSTOM; }
  static #doesAnyChangeHave(changeData: K4Change.Source[], param: string, value?: string|number|boolean): boolean {
    return changeData
      .filter((changeData) => this.#isChangeModeCustom(changeData))
      .map((changeData) => K4Change.ParseFunctionDataString(changeData.value)[param])
      .some((paramValue: Maybe<string|number|boolean>) => {
        if (value === undefined) {
          return paramValue !== undefined;
        }
        return paramValue === value;
      })
  }
  static #getChangesWith(changeData: K4Change.Source[], param: string, value?: string|number|boolean): K4Change.Source[] {
    return changeData
      .filter((changeData) => this.#isChangeModeCustom(changeData))
      .filter((changeData) => changeData.value.includes(`${param}:${String(value ?? "")}`));
  }
  static #getConflictingChanges(changeData: K4Change.Source[], param: string): K4Change.Source[] {
    const valueRecord: Record<string, K4Change.Source[]> = {};
    changeData
      .filter((changeData) => this.#isChangeModeCustom(changeData))
      .forEach((changeData) => {
        const value = K4Change.ParseFunctionDataString(changeData.value)[param];
        if (value === undefined) { return; }
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
  static #groupChangesByEffectName(changeData: K4Change.Source[], origin: K4ActiveEffect.Origin): Record<string, K4Change.Source[]> {
    const defaultName = this.#resolveEffectName(changeData, origin) as string;
    return changeData.reduce((acc, cData) => {
      const effectName = this.#resolveEffectName([cData], origin, true) ?? defaultName;
      acc[effectName] = acc[effectName] ?? [];
      cData.key = cData.key;
      acc[effectName].push(cData);
      return acc;
    }, {} as Record<string, K4Change.Source[]>);
  }
  /**
 * Given a list of changes, will group them by assigned name and validate that they are all compatible with each other.
 */
  static #ProcessEffectChanges(changeData: K4Change.Source[], origin: K4ActiveEffect.Origin): Record<string, K4Change.Source[]> {
    // First group changes by effect name
    const groupedChanges = this.#groupChangesByEffectName(changeData, origin);

    Object.values(groupedChanges).forEach((effectChanges) => {
      /**
       * The following function parameters, if present on any change, cannot conflict with the same parameter on another change in the same effect:
       *  - canToggle, usageMax, duration, fromText
       */
      ["canToggle", "usageMax", "duration", "fromText"].forEach((param) => {
        const conflictingChanges = this.#getConflictingChanges(effectChanges, param);
        if (conflictingChanges.length) {
          throw new Error(`Conflicting changes found for parameter '${param}' in effect '${effectChanges[0].key}': ${conflictingChanges.map((change) => change.value).join(", ")}`);
        }
      });
    });

    return groupedChanges;
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
  static #resolveEffectName(changeData: K4Change.Source[], origin: K4ActiveEffect.Origin, explicitOnly = false): Maybe<string> {
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
  /**
   * Given an array of K4Changes, will extract those function parameters that apply to the parent effect as a whole.
   * (Any potential conflicts are resolved by the time this function is called.)
   * @param {K4Change.Source[]} changeData - The array of changes to extract from.
   * @param {K4ActiveEffect.Origin} origin - The origin of the ActiveEffect.
   * @returns {K4ActiveEffect.ExtendedData} - The extracted data.
   */
  static #ExtractExtendedData(changeData: K4Change.Source[], origin: K4ActiveEffect.Origin): K4ActiveEffect.ExtendedData {
    const canToggle = this.#doesAnyChangeHave(changeData, "canToggle", true);
    const uses = this.#getChangesWith(changeData, "usageMax")
      .map((change) => {
        const {usageMax} = K4Change.ParseFunctionDataString(change.value);
        return {
          value: 0,
          min: 0,
          max: usageMax as number
        };
      })[0] ?? undefined;
    const duration = this.#getChangesWith(changeData, "duration")
      .map((change) => {
        const {duration} = K4Change.ParseFunctionDataString(change.value);
        return duration as EffectDuration;
      })[0] ?? EffectDuration.ongoing;
    const effectSource = this.#resolveEffectSource(origin);

    let defaultState: Maybe<boolean>;
    let toggleLabel: Maybe<string>;
    let tooltip: Maybe<string>;

    if (canToggle) {
      defaultState = this.#getChangesWith(changeData, "defaultState")
        .map((change) => K4Change.ParseFunctionDataString(change.value).defaultState)[0] as Maybe<boolean> ?? true;
      toggleLabel = this.#getChangesWith(changeData, "toggleLabel")
        .map((change) => K4Change.ParseFunctionDataString(change.value).toggleLabel)[0] as Maybe<string> ?? "";
      tooltip = this.#getChangesWith(changeData, "tooltip")
        .map((change) => K4Change.ParseFunctionDataString(change.value).tooltip)[0] as Maybe<string>;
      if (!tooltip) {
        throw new Error(`Missing tooltip for toggleable effect on '${origin.name}'`)
      }

      return {
        canToggle: true,
        uses,
        duration,
        defaultState,
        toggleLabel,
        tooltip,
        effectSource
      }
    } else {
      return {
        canToggle: false,
        uses,
        duration,
        effectSource
      }
    }
  }
  static async CreateFromChangeData(changeData: K4Change.Source[], origin: K4ActiveEffect.Origin, target?: K4Actor<K4ActorType.pc>): Promise<K4ActiveEffect[]> {
    const effectCreationPromises: Promise<K4ActiveEffect>[] = [];

    // Process the effect changes, validating them and separating them as necessary into multiple effects.
    const groupedChanges = this.#ProcessEffectChanges(changeData, origin);

    // Iterate through each group of changes, creating an ActiveEffect for each.
    for (const [effectName, effectChanges] of Object.entries(groupedChanges)) {
      const extData = this.#ExtractExtendedData(effectChanges, origin);
      const effectData: K4ActiveEffect.ConstructorData & Record<string, unknown> = {
        origin: origin.uuid,
        label: effectName,
        transfer: !target,
        disabled: extData.canToggle && extData.defaultState === false,
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
      };
      if (target) {
        effectCreationPromises.push(target.createEmbeddedDocuments("ActiveEffect", [effectData]) as unknown as Promise<K4ActiveEffect>);
      } else {
        effectCreationPromises.push(origin.createEmbeddedDocuments("ActiveEffect", [effectData]) as unknown as Promise<K4ActiveEffect>);
      }
    }

    return Promise.all(effectCreationPromises);
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
      if (effect.requireItemChanges.some((change) => !change.apply())) {
        originItem?.delete();
        return false;
      }

      /* === PROCESS CUSTOM CHANGES: STEP 2 - PromptForData Check === */
      // PromptForData changes are resolved by querying the User for input when they are embedded within an Actor owned by that User -- i.e. right now.
      // Though there is only one 'PromptForData' custom function currently defined, this structure allows for future expansion.
      // (Note: The "PromptForData" function will only run once; if the data it is seeking is already written to the actor's flags, it will do nothing.)
      for (const change of effect.promptForDataChanges) {
        await change.apply();
      }

      /* === PROCESS CUSTOM CHANGES: STEP 3 - Permanent Effects Check === */
      // If any changes are permanent, apply them now -- they will be filtered out of future applications of the effect,
      // and will not be reversed when the active effect is removed.
      effect.permanentChanges.forEach((change) => change.apply());
      return true;
    });
  }
  // #endregion
  static onManageActiveEffect(event: ClickEvent, owner: K4Actor|K4Item) {
    event.preventDefault();
    const a = event.currentTarget;
    if (a.dataset.action === "create") {
      return owner.createEmbeddedDocuments("ActiveEffect", [{
        name:   owner.name,
        icon:   owner.img,
        origin: owner.uuid
      }]);
    }
    const selector = a.closest("tr");
    if (selector === null) { return null; }
    const effect = selector.dataset.effectId
      ? owner.effects.get(selector.dataset.effectId)
      : null;
    if (!effect) { return null; }
    switch ( a.dataset.action ) {
      case "edit":
        return effect.sheet?.render(true);
      case "delete":
        return effect.delete();
      case "toggle":
        return effect.update({disabled: !effect.disabled});
      default: return null;
    }
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
  hasToggleableChanges(): boolean {
    return this.toggleableChanges.length > 0;
  }
  get originItem(): Maybe<K4Item> {
    if (!this.hasItemOrigin()) { return; }
    return fromUuidSync(this.origin) as Maybe<K4Item>;
  }
  get owner(): Maybe<K4Actor|K4Item> {
    return this.isOwnedByActor() ? this.actor : this.originItem;
  }
  get actor(): Maybe<K4Actor> {
    if (!this.isOwnedByActor()) { return; }
    const [_, actorId] = this.origin.split(".");
    return game.actors.get(actorId);
  }
  getCustomChanges(): K4Change[] {
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
  get toggleableChanges() {
    return this.getCustomChanges().filter((change) => change.canToggle);
  }
  // // #endregion

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
    await super.setFlag(namespace, key, val);
    return this;
  }

  applyToggleListeners(html: JQuery) {
    html.find(`[data-id="${this.id}"]`).on("click", async (event: ClickEvent) => {
      event.preventDefault();
      if (!this.parent) { return; }
      K4ActiveEffect.onManageActiveEffect(event, this.parent);
    });
  }
  // #ENDREGION
}

// #region -- INTERFACE AUGMENTATION ~
interface K4ActiveEffect extends ActiveEffect {
  label: string,
  icon: string,
  origin: string
  disabled: boolean
  changes: EffectChangeData[]
  updateSource(updateData: {changes: EffectChangeData[]}): Promise<void>
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
export {K4Change, EffectSourceType};
// #endregion