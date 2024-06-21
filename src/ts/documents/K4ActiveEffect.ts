// #region IMPORTS ~
import C, {K4Attribute} from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import K4Actor from "./K4Actor.js";
import K4Item, {K4ItemType} from "./K4Item.js";
import K4Roll from "./K4Roll.js";
import K4ActiveEffectSheet from "./K4ActiveEffectSheet.js";
// import { ObjectField, BooleanField, IntegerField, StringField } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/fields.mjs";
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
enum EffectMode {
  Custom,
  Multiply,
  Add,
  Downgrade,
  Upgrade,
  Override
}

/** == EFFECT SOURCE ==
 * The category of entity, event or circumstance that empowers the Effect, that is ultimately responsible for removing it when it no longer applies.
 * An Effect's Source is usually, but not always, the entity that created the Effect.
 */
enum EffectSource {
  item = "item", // The Effect is applied by an item owned by the Actor. REMOVAL: the item is removed from the Actor.
  roll = "roll", // The Effect was applied by a roll result. REMOVAL: Must be specified (default = single-use, toggleable effect)
  wound = "wound", // The Effect is applied by the Actor's wound state. Every Actor will have a singleton instance of this Effect,
                   // which is refreshed whenever the Actor's wounds change. REMOVAL: never (will apply zero Changes at no wounds)
  stability = "stability", // The Effect is applied by the Actor's stability level. Every Actor will have a singleton instance of this Effect,
                           // which is refreshed whenever the Actor's stability changes. REMOVAL: never (will apply zero Changes at full Stability)
  scene = "scene", // The Effect is applied by the active scene to all Actors present. REMOVAL: when the scene ends
  session = "session", // The Effect is applied by the active session to all Actors present. REMOVAL: when the session ends
  gm = "gm" // The Effect is applied by the GM manually to selected actors via the GM Screen. REMOVAL: no automatic removal; manually controlled by the GM
}

/** == EFFECT TARGET ==
 * The actual Document entity the Changes affect. Though many values are shared in common with Source,
 * they are distinct in that Source describes where the Effect originated, while Target describes what it affects.
 */
enum EffectTarget {
  actor = "actor", // The Actor's base data
  item = "item", // An item owned by the Actor
  roll = "roll", // A roll made by the Actor
  gm = "gm" // Information displayed on the GM Screen
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

  // export namespace Change {
  //   interface BaseData {
  //     value: string;
  //   }

  //   interface CustomData extends BaseData {
  //     key: keyof typeof CUSTOM_FUNCTIONS;
  //     mode: EffectMode.Custom;
  //   }

  //   interface NonCustomData extends BaseData {
  //     key: string;
  //     mode: Exclude<EffectMode, EffectMode.Custom>;
  //   }

  //   export type Data = CustomData | NonCustomData;

  // }

  export type CustomFunction = (
    parent: K4Actor|K4Roll,
    data: Record<string, string|number|boolean>
  ) => ValueOrPromise<void|boolean>;

  // export interface ConstructorData extends ActiveEffectDataConstructorData {
  //   changes: Change.Data[];
  // }

  export interface Data extends Partial<Omit<ActiveEffectData, "changes">> {
    changes: EffectChangeData[];
    state: boolean; // Whether the Effect is currently enabled or disabled
    defaultState?: boolean; // Whether the effect is enabled by default when applied. (default = true)
    uses?: ValueMax; // Defines and tracks how many times the Effect can be used (i.e. to modify a roll or triggered static ability)
                    // - if undefined, the Effect is not limited-use
    inStatusBar: boolean; // Whether the Effect should be displayed in the status bar on the Actor's character sheet. (default = false)
                          // - if true, several additional properties are required:
    canToggle?: boolean; // Whether the PARENTACTOR can toggle the effect on/off on their character sheet (default = true)

    shortLabel?: string; // A short label to be shown in the status bar
    tooltip?: string; // A longer description of the effect, shown in the tooltip when hovering over the effect's label on the actor's sheet
    fromText?: string; // The name to display in any "(from ...)" references in displayed game text
    effectSource: EffectSource; // Identifies the category of entity, event or circumstance that empowers the Effect, and that is ultimately responsible for removing it when it no longer applies.

    // "isPooled": For ActiveEffects on scenes and sessions, whether the "system.usage.value" is shared among all actors. (default = true)
    // Default is true because this is how changes can be transferred between actors,
    // i.e. one actor creates a usage.max = 1 bonus to a roll, which another actor can use,
    // is how the "Help Other" move works.
    // Limited-use scene or session effects are comparatively rare.
  }

  // export type ConstructorData = Data & ActiveEffectDataConstructorData & {effectSource: EffectSource};
}
// #endregion
// #region -- INTERFACE AUGMENTATION ~
interface K4ActiveEffect extends ActiveEffect {
  label: string,
  icon: string,
  origin: string
  disabled: boolean
  changes: EffectChangeData[]
  updateSource(updateData: {changes: EffectChangeData[]}): Promise<void>
  data: K4ActiveEffect.Data & ActiveEffectData
}
// #endregion
// #endregion --


// #region === CUSTOM FUNCTIONS FOR MODE EffectMode.Custom ===
const CUSTOM_FUNCTIONS: Record<
  string,
  K4ActiveEffect.CustomFunction
> = {
  ApplyStability: async (actor, data) => {

  },
  ApplyWounds: async (actor, data) => {

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
    let {filter, target, effect, value, text, fromText} = data as Partial<{
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
            const targetArray = getProperty(move, `${target}` ?? "");
            if (!Array.isArray(targetArray)) {
              throw new Error(`Invalid target for PushElement: '${target}'`);
            }
            targetArray.push(value);
            setProperty(move, target as string, targetArray);
            break;
          }
          case "AppendText": {
            const targetString = getProperty(move, `${target}` ?? "");
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
    let {filter, effect, target, value, permanent} = data;
    if (!filter || !effect || !target) {
      throw new Error(`Invalid data for ModifyProperty: ${JSON.stringify(data)}`);
    }
    if (filter === "actor") {
      let curVal = getProperty(actor, `${target}`);
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
    let {title, key, input, inputVals, default: defaultVal, bodyText, subText} = data as Partial<{
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
    if (key.startsWith("flags")) {
      const flagKey = key.split(".").slice(1).join(".");
      if (actor.getFlag(C.SYSTEM_ID, flagKey) !== undefined) {
        return;
      }
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
    const context: Record<string, string|number|boolean> = {
      title,
      bodyText: bodyText ?? "",
      subText: subText ?? ""
    }
    const dialogData: Dialog.Data = {
      title: title,
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
    let {filter, for: target} = data as Partial<{
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
    const pairs = dataString.match(/([^,]+:[^,]+(?:,[^,]+)*?)(?=(?:,[^:]+:)|$)/g);
    if (!pairs) {
      throw new Error(`Invalid function data string format: "${dataString}"`);
    }
    return pairs.reduce((acc, pair) => {
      let [key, value]: [string, string|number|boolean] = pair.split(/:(.+)/) // Split only at the first colon
        .map(str => str.trim()) as [string, string];

      // Convert the value to the appropriate type
      if (/^\d+$/.test(value)) {
        value = U.pInt(value); // number
      } else if (/^\d*\.\d$/.test(value)) {
        value = U.pFloat(value); // Float
      } else if (/^(true|false)$/i.test(value)) {
        value = value.toLowerCase() === "true"; // Boolean
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

  // #region GETTERS & SETTERS ~
  get isInstantiated(): boolean {
    return Boolean(this.parentEffect);
  }
  get isOwnedByActor(): boolean {
    return this.parentEffect?.actor !== undefined;
  }
  get actor(): Maybe<K4Actor> {
    if (!this.isOwnedByActor) { return; }
    return this.parentEffect!.actor;
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
      && !this.isRollModifier;
  }
  get isRollModifier(): boolean {
    return ["ModifyRoll"].includes(this.customFunctionName);
  }
  get filter(): Maybe<"all"|K4Attribute|K4ItemType|string> {
    return this.customFunctionData.filter as Maybe<string>;
  }
  _promptedValue?: string|number|boolean;
  get finalValue(): Maybe<string|number|boolean> {
    const {value} = this.customFunctionData;
    if (value === undefined) { return; }
    if (value === "prompt") {
      return this._promptedValue;
    }
    if (this.isOwnedByActor && typeof value === "string" && value.startsWith("actor.")) {
      return getProperty(this.actor as K4Actor, value.slice(6));
    }
    return value;
  }
  get hasNumericValue(): boolean {
    return typeof this.finalValue === "number";
  }
  get isInStatusBar(): boolean {
    return this.isRollModifier
      && this.customFunctionData.inStatusBar !== false
      && this.hasNumericValue;
  }
  // #endregion

  // #region CONSTRUCTOR
  customFunctionName: keyof typeof CUSTOM_FUNCTIONS;
  customFunction: K4ActiveEffect.CustomFunction;
  customFunctionData: Record<string, string|number|boolean>;
  parentEffect?: K4ActiveEffect;
  constructor(data: EffectChangeData, effect: K4ActiveEffect) {
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

  // #region PUBLIC METHODS ~
  apply(parent?: K4Actor|K4Roll) {
    parent ??= this.actor;
    if (!parent) {
      throw new Error(`[K4Change.apply] No valid parent found for '${this.customFunctionName}' K4Change of K4ActiveEffect '${this.parentEffect?.name ?? "(Uninstantiated Effect Data)"}'`);
    }
    return this.customFunction(parent, this.customFunctionData);
  }
  // #endregion

  // #region PRIVATE METHODS ~
  // #endregion

}

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

  // #region INITIALIZATION ~
  static async PreInitialize(): Promise<void> {
    CONFIG.ActiveEffect.documentClass = K4ActiveEffect;
    DocumentSheetConfig.unregisterSheet(ActiveEffect, "core", ActiveEffectConfig);
    DocumentSheetConfig.registerSheet(ActiveEffect, "kult4th", K4ActiveEffectSheet, { makeDefault: true });

    Hooks.on("createActiveEffect", async (effect: K4ActiveEffect) => {
      kLog.display(`[on CreateActiveEffect] ${effect.label}`, {
        origin: effect.origin,
        ownedByActor: effect.isOwnedByActor,
        hasItemOrigin: effect.hasItemOrigin,
        originDoc: effect.origin ? fromUuidSync(effect.origin) : null,
        isItemOwned: effect.hasItemOrigin ? effect.originItem!.isOwnedItem() : false,
        requireItemChanges: effect.requireItemChanges,
        permanentChanges: effect.permanentChanges
      });

      // If this effect is not embedded in an actor, do nothing
      if (!effect.isOwnedByActor) { return true; }

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
      ? owner.effects.get(selector.dataset.effectId) as K4ActiveEffect
      : null;
    if (!effect) { return null; }
    switch ( a.dataset.action ) {
      case "edit":
        return effect.sheet?.render(true);
      case "delete":
        return effect.delete();
      case "toggle":
        return effect.update({state: !effect.data.state});
      default: return null;
    }
  }

  // #region GETTERS & SETTERS ~
  get isOwnedByActor(): boolean {
    return this.origin?.startsWith("Actor") ?? false;
  }
  get isOwnedByItem(): boolean {
    return this.origin?.startsWith("Item") ?? false;
  }
  get hasItemOrigin(): boolean {
    return this.origin?.includes("Item") ?? false;
  }
  get originItem(): Maybe<K4Item> {
    if (!this.hasItemOrigin) { return; }
    return fromUuidSync(this.origin);
  }
  get actor(): Maybe<K4Actor> {
    if (!this.isOwnedByActor) { return; }
    const [_, actorId] = this.origin.split(".");
    return game.actors.get(actorId);
  }
  getCustomChanges(): K4Change[] {
    return this.changes
      .filter((change) => change.mode === CONST.ACTIVE_EFFECT_MODES.CUSTOM)
      .map((change) => new K4Change(change, this));
  }
  get requireItemChanges() {
    return this.getCustomChanges().filter((change) => change.isRequireItemCheck);
  }
  get permanentChanges() {
    return this.getCustomChanges().filter((change) => change.isPermanentChange);
  }
  get promptForDataChanges() {
    return this.getCustomChanges().filter((change) => change.isPromptOnCreate);
  }
  get modifyRollChanges() {
    return this.getCustomChanges().filter((change) => change.isRollModifier);
  }
  get systemChanges() {
    return this.getCustomChanges().filter((change) => change.isSystemModifier);
  }
  // // #endregion

  // #region CONSTRUCTOR
  constructor(data: ActiveEffectDataConstructorData) {
    super(data);
  }
  // #endregion


  // #region PRIVATE METHODS ~

  // #endregion

  // #REGION === PUBLIC METHODS ===
  applyToActor(actor?: K4Actor) {
    actor ??= this.actor;
    if (!(actor instanceof K4Actor)) { return; }
  }

  applyToRoll(roll: Roll) {

  }
  // #ENDREGION
}

// #region EXPORTS ~
export default K4ActiveEffect;
export {K4Change as K4Change, EffectMode, EffectSource};
// #endregion
