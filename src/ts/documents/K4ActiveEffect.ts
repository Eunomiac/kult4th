// #region IMPORTS ~
import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import type { ActiveEffectDataConstructorData, ActiveEffectData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData';
import K4Actor from "./K4Actor.js";
import K4Item, {K4ItemType} from "./K4Item.js";
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
 * The entity, event or circumstance that empowers the Effect, that is ultimately responsible for removing it when it no longer applies.
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
  numberButtons = "numberButtons",
  text = "text",
  confirm = "confirm",
  select = "select"
}
// #endregion
// #region TYPES ~
namespace K4ActiveEffect {

  export namespace Change {
    interface BaseData {
      value: string;
    }

    interface CustomData extends BaseData {
      key: keyof typeof CUSTOM_FUNCTIONS;
      mode: EffectMode.Custom;
    }

    interface NonCustomData extends BaseData {
      key: string;
      mode: Exclude<EffectMode, EffectMode.Custom>;
    }

    export type Data = CustomData | NonCustomData;

    export interface GenerationData {
      [key: keyof typeof CUSTOM_FUNCTIONS]: string;
    }

  }

  export type CustomFunction = (
    actor: K4Actor,
    activeEffect: K4ActiveEffect,
    data: CustomFunction.AnyData
  ) => void;

  export namespace CustomFunction {

    namespace Components {
      export interface Prompt {
        title: string;
        bodyText?: string;
        input: PromptInputType;
        key: string;
      }
      export namespace Prompt {
        export interface General extends Prompt {
          input: Exclude<PromptInputType, PromptInputType.numberButtons | PromptInputType.select>;
        }
        export interface NumberButtons extends Prompt {
          input: PromptInputType.numberButtons;
          inputMin: number;
          inputMax: number;
        }
        export interface Select extends Prompt {
          input: PromptInputType.select;
          options: Record<string, string>;
        }
      }
      export interface Modifier {
        filter: string;
        effect: string;
        target?: string;
        value?: string | number | boolean;
        fromText?: string;
      }
      export namespace Modifier {
        export interface Move extends Modifier {}
        export interface Roll extends Omit<Modifier, "target"> {
          value: number | string;
        }
        export interface Attack extends Modifier {}
      }
    }

    export namespace Data {

      interface ModifyMove_Prompt_Base extends Components.Modifier.Move, Components.Prompt {
        value: "prompt";
      }
      export type ModifyMove = (Components.Modifier.Move | (ModifyMove_Prompt_Base & (Components.Prompt.NumberButtons | Components.Prompt.Select)));
      export type ModifyMove_Prompt = ModifyMove_Prompt_Base & (Components.Prompt.NumberButtons | Components.Prompt.Select);

      interface ModifyRoll_Prompt_Base extends Components.Modifier.Roll, Omit<Components.Prompt, "key"> {
        value: "prompt";
      }
      export type ModifyRoll = Components.Modifier.Roll | (ModifyRoll_Prompt_Base & (Components.Prompt.NumberButtons | Components.Prompt.Select));
      export type ModifyRoll_Prompt = ModifyRoll_Prompt_Base & (Components.Prompt.NumberButtons | Components.Prompt.Select);

      export type HasPrompt<baseType extends AnyData> = baseType extends ModifyMove ? ModifyMove_Prompt
          : baseType extends ModifyRoll ? ModifyRoll_Prompt
          : never;

      export type Prompt = Components.Prompt.General | Components.Prompt.NumberButtons | Components.Prompt.Select;

      // Placeholder types for future use
      export type PromptForData = {};
      export type ModifyAttack = {};
      export type CreateAttack = {};
      export type CreateTracker = {};
    }
    export type AnyData = Data.ModifyMove|Data.ModifyRoll; // |Data.PromptForData|Data.ModifyAttack|Data.CreateAttack|Data.CreateTracker;
    // export interface Data extends AnyData {}
  }

  export interface Data extends ActiveEffectData {
    state: boolean; // Whether the Effect is currently enabled or disabled
    defaultState: boolean; // Whether the effect is enabled by default when applied. (default = true)
    uses: ValueMax; // Defines and tracks how many times the Effect can be used (i.e. to modify a roll or triggered static ability)
                    // - if undefined, the Effect is not limited-use
    inStatusBar: boolean; // Whether the Effect should be displayed in the status bar on the Actor's character sheet. (default = false)
                          // - if true, several additional properties are required:
    canToggle?: boolean; // Whether the PARENTACTOR can toggle the effect on/off on their character sheet (default = true)

    shortLabel?: string; // A short label to be shown in the status bar
    tooltip?: string; // A longer description of the effect, shown in the tooltip when hovering over the effect's label on the actor's sheet
    fromText?: string; // The name to display in any "(from ...)" references in displayed game text

    // "isPooled": For ActiveEffects on scenes and sessions, whether the "system.usage.value" is shared among all actors. (default = true)
    // Default is true because this is how changes can be transferred between actors,
    // i.e. one actor creates a usage.max = 1 bonus to a roll, which another actor can use,
    // is how the "Help Other" move works.
    // Limited-use scene or session effects are comparatively rare.
  }

  export type ConstructorData = Partial<Data> & ActiveEffectDataConstructorData;

  export type GenerationData = Change.GenerationData[];
}
// #endregion
// #endregion --

// #region === CUSTOM FUNCTIONS FOR MODE EffectMode.Custom ===
const CUSTOM_FUNCTIONS: Record<
  string,
  K4ActiveEffect.CustomFunction
> = {
  ModifyMove: async (actor, activeEffect, data) => {
    const moveData = data as K4ActiveEffect.CustomFunction.Data.ModifyMove;
    let {filter, target, effect, value, fromText} = moveData;
    if (!filter || !effect) {
      throw new Error(`Invalid data for ModifyMove: ${JSON.stringify(data)}`);
    }
    if (activeEffect.hasPrompt(moveData)) {
      value = await activeEffect.promptUserForData(moveData);
    }
    actor.getItemsByFilter(K4ItemType.move, filter)
      .forEach((move) => {
        switch (effect) {
          case "PushElement": {
            const targetArray = getProperty(move, target ?? "");
            if (!Array.isArray(targetArray)) {
              throw new Error(`Invalid target for PushElement: '${target}'`);
            }
            targetArray.push(value);
            setProperty(move, target as string, targetArray);
            break;
          }
          case "AppendText": {
            const targetString = getProperty(move, target ?? "");
            if (typeof targetString !== "string") {
              throw new Error(`Invalid target for AppendText: '${target}'`);
            }
            setProperty(move, target as string, targetString + value);
            break;
          }
          case "ModifyEffect": {
            console.warn("ModifyMove > ModifyEffect is not yet implemented.");
            break;
          }
          default: {
            throw new Error(`Unrecognized effect for ModifyMove: '${effect}'`);
          }
        }
      })
    }
} as const;
// #endregion

// #region === K4ACTIVEEFFECT CLASS ===
/**
 * The active effect itself can be applied using Foundry's standard logic, resulting in changes
 * arrays that contain mode:0 custom functions where key is the function name, and value is the
 * function string.
 *
 * The changes arrays of enabled active effects should be iterated through during the actor's
 *  prepareData method, filtered for custom functions, and their function data strings parsed and
 *  applied then.
 * (Roll-effect changes should instead be run during the roll process.)
 *
 * See "applyToActor" and "applyToRoll" methods below
 */
class K4ActiveEffect extends ActiveEffect {

  // #region INITIALIZATION ~
  static async PreInitialize(): Promise<void> {
    CONFIG.ActiveEffect.documentClass = K4ActiveEffect;
    DocumentSheetConfig.unregisterSheet(ActiveEffect, "core", ActiveEffectConfig);
    DocumentSheetConfig.registerSheet(ActiveEffect, "kult4th", K4ActiveEffectSheet, { makeDefault: true });
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


  // #endregion

  // #region PRIVATE METHODS ~
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
  parseFunctionDataString(dataString: string): Record<string, string|number|boolean> {
    const pairs = dataString.match(/([^,]+:[^,]+(?:,[^,]+)*?)(?=(?:,[^:]+:)|$)/g);
    if (!pairs) {
      throw new Error(`Invalid function data string format: "${dataString}"`);
    }
    return pairs.reduce((acc, pair) => {
      let [key, value]: [string, string|number|boolean] = pair.split(/:(.+)/) // Split only at the first colon
        .map(str => str.trim()) as [string, string];

      // Convert the value to the appropriate type
      if (/^\d+$/.test(value)) {
        value = U.pInt(value); // Integer
      } else if (/^\d*\.\d$/.test(value)) {
        value = U.pFloat(value); // Float
      } else if (/^(true|false)$/i.test(value)) {
        value = value.toLowerCase() === "true"; // Boolean
      }

      acc[key] = value;
      return acc;
    }, {} as Record<string,string|number|boolean>);
  }
  hasPrompt<baseType extends K4ActiveEffect.CustomFunction.AnyData>(data: baseType): data is baseType & K4ActiveEffect.CustomFunction.Data.HasPrompt<baseType> {
    if (!("value" in data)) { return false; }
    return data.value === "prompt";
  }
  async promptUserForData<ResponseType extends string|number|boolean>(data: K4ActiveEffect.CustomFunction.Data.Prompt): Promise<Maybe<ResponseType>> {
    const template = await getTemplate(U.getTemplatePath("dialog", `ask-for-${data.input}`));
    const context: Record<string, string|number|boolean> = {
      title: data.title,
      bodyText: data.bodyText ?? ""
    }
    const dialogData: Dialog.Data = {
      title: data.title,
      content: template(context),
      buttons: {}
    };

    const userOutput = await new Promise<ResponseType>((resolve) => {
      if (data.input === PromptInputType.numberButtons) {
        const {inputMin, inputMax} = data;
        for (let i = inputMin; i <= inputMax; i++) {
          dialogData.buttons[i] = {
            label: String(i),
            callback: () => resolve(i as ResponseType)
          }
        }
      }
      new Dialog(dialogData, {classes: [C.SYSTEM_ID, "dialog"]}).render(true);
    });

    return userOutput;
  }
  // #endregion

  // #REGION === PUBLIC METHODS ===
  applyToActor(actor?: K4Actor) {
    actor ??= this.parent;
    if (!(actor instanceof K4Actor)) { return; }
  }

  applyToRoll(roll: Roll) {

  }
  // #ENDREGION
}

// #region -- K4ACTIVEEFFECT INTERFACE -- ~
interface K4ActiveEffect {
  data: K4ActiveEffect.Data;

  /* Will include Foundry-default properties that are not included in the provided third-party types */
}
// #endregion
interface K4ActiveEffect {
  icon: string,
  origin: string
  disabled: boolean
  changes: K4ActiveEffect.Change.Data[]
  updateSource(updateData: {changes: K4ActiveEffect.Change.Data[]}): Promise<void>
}
// #ENDREGION

// #region EXPORTS ~
export default K4ActiveEffect;
// #endregion
