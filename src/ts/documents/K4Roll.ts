// #region IMPORTS ~
import U from "../scripts/utilities.js";
import C, {K4Attribute} from "../scripts/constants.js";
import K4Item, {K4ItemType, K4ItemSubType} from "./K4Item.js";
import K4Actor, {K4ActorType} from "./K4Actor.js";
import K4ChatMessage from "./K4ChatMessage.js";
// #endregion

// #REGION === TYPES, ENUMS, INTERFACE AUGMENTATION === ~
// #region -- ENUMS ~
enum K4RollResult {
  completeSuccess = "completeSuccess",
  partialSuccess = "partialSuccess",
  failure = "failure"
}
enum K4RollType {
  attribute = "attribute",
  move = "move"
}
// #endregion
// #region -- TYPES ~

declare global {

  namespace K4Roll {
    export type Attribute = K4Attribute;
    export type RollableAttribute = K4CharAttribute|K4Attribute.zero;
    export type Source = K4Item.Active|K4Roll.Attribute;
    export type ModFilter = "all"|K4ItemType.advantage|K4ItemType.disadvantage|string;
    export type ModDefinition = Record<ModFilter, number>;

    export interface ModData {
      id: string,
      filter: "all"|K4ItemType.advantage|K4ItemType.disadvantage|string,
      value: number,
      label: string,
      tooltipLabel: string,
      tooltipDesc: string,
      cssClasses: string[]
    }

    interface ConstructorDataBase {
      source: K4Roll.Source|string
    }
    interface ConstructorDataItemSource extends ConstructorDataBase {
      source: K4Item.Active|string
    }
    interface ConstructorDataAttrSource extends ConstructorDataBase {
      source: K4Roll.Attribute
      img: string
    }

    export type ConstructorData = ConstructorDataItemSource | ConstructorDataAttrSource;

    interface DataBase extends ConstructorDataBase {
      attribute: K4Roll.RollableAttribute,
      attrVal: number,
      modifiers: Array<K4Roll.ModData>
    }

    interface DataItemSource extends DataBase {
      source: K4Item.Active
    }
    interface DataAttrSource extends DataBase {
      source: K4Roll.RollableAttribute,
      img: string
    }
    export type Data = DataItemSource | DataAttrSource;
    interface ContextBase {
      cssClass: string,
      dice: [number, number],
      total: number,
      source: K4Roll.RollableAttribute|K4Item.Active,
      attribute: K4Roll.RollableAttribute,
      attrVal: number,
      attrType: "active"|"passive"|"zero",
      modifiers: ModData[],
      rollerName: string,
      rollerImg: string,
      result: K4Item.Components.ResultData,
      outcome: K4RollResult
    }
    interface ContextItemSource extends ContextBase {
      source: K4Item.Active,
      sourceType: K4ItemType,
      sourceName: string,
      sourceImg: string
    }
    interface ContextAttrSource extends ContextBase {
      source: K4Roll.RollableAttribute
    }
    export type Context = ContextItemSource | ContextAttrSource;
  }
}
// #endregion
// #region -- INTERFACE AUGMENTATION ~

// #endregion
// #ENDREGION

class K4Roll extends Roll {
  // #region INITIALIZATION ~
  /**
   * Pre-Initialization of the K4Roll class. This method should be run during the "init" hook.
   *
   * @returns {Promise<void>} A promise that resolves when the hook is registered.
   */
  static async PreInitialize(): Promise<void> {
    /* Insert PreInitiailize Steps Here */
  }
  // #endregion
  // #region Type Guards ~
  /**
   * Type guard to check if the actor is of a specific type.
   * @param {T} type - The type to check against.
   * @returns {boolean} True if the actor is of the specified type.
   */
  is<T extends K4ActorType = K4ActorType>(type: T): this is K4Actor<T> {
    // @ts-expect-error -- Unable to resolve 'this.type' and 'type' to the same type.
    return this.type === type;
  }
  // #endregion

  static CheckSource(rollData: K4Roll.ConstructorData, actor: K4Actor): {
    type: K4RollType,
    img: string,
    attribute: Promise<K4Roll.RollableAttribute|null>|K4Roll.RollableAttribute,
    attrVal: number,
    source: K4Roll.Source
  } {
    if (typeof rollData.source === "string") {
      let attrVal: number;
      switch (rollData.source) {
        case K4Attribute.ask: {
          throw new Error("Need to implement ask-for-attribute prompt in K4Actor, where it can be awaited.")
          /* return {
            type: K4RollType.attribute,
            img: (rollData as K4Roll.ConstructorData_AttrSource).img,
            attribute: actor.askForAttribute(),
            source: rollData.source
          }; */
        }
        case K4Attribute.zero:
          attrVal = 0;
        case K4Attribute.charisma:
        case K4Attribute.coolness:
        case K4Attribute.fortitude:
        case K4Attribute.intuition:
        case K4Attribute.perception:
        case K4Attribute.reason:
        case K4Attribute.reflexes:
        case K4Attribute.soul:
        case K4Attribute.violence:
        case K4Attribute.willpower: {
          attrVal ??= actor.attributes[rollData.source as K4CharAttribute];
          return {
            type: K4RollType.attribute,
            img: (rollData as K4Roll.ConstructorDataAttrSource).img,
            attribute: rollData.source,
            attrVal,
            source: rollData.source
          };
        }
        default: {
          // Assume an item reference by UUID, ID or name
          const item = fromUuidSync(rollData.source) as Maybe<K4Item>
            ?? actor.items.get(rollData.source) as Maybe<K4Item>
            ?? actor.getItemByName(rollData.source) as Maybe<K4Item>
          if (!item?.isActiveItem()) {
            throw new Error(`Unrecognized rollData.source: ${rollData.source}`);
          }
          rollData.source = item;
        }
      }
    }

    if (rollData.source instanceof K4Item && rollData.source.isActiveItem()) {
      const {attribute} = rollData.source.system;
      if (attribute === K4Attribute.ask) {
        throw new Error("Need to implement ask-for-attribute prompt in K4Actor, where it can be awaited. Both for generic asks and item.system.attribute = 'ask' cases.")
      }
      return {
        type: K4RollType.move,
        img: rollData.source.img ?? "",
        attribute,
        attrVal: attribute === K4Attribute.zero ? 0 : actor.attributes[attribute],
        source: rollData.source
      }
    }
    throw new Error(`Unable to parse attribute from rollData.source: ${JSON.stringify(rollData.source, null, 2)}`);
  }
  // #region GETTERS & SETTERS ~
  public actor: K4Actor<K4ActorType.pc>;
  public img: string;
  public _attribute: Promise<K4Roll.RollableAttribute|null>|K4Roll.RollableAttribute;
  public type: K4RollType;
  public source: K4Roll.Attribute|K4Item<K4Item.Types.Active>;
  public isCancelled = false;
  public get sourceName(): string {
    if (this.type === K4RollType.attribute) {
      return U.tCase(this.attribute);
    }
    return (this.source as K4Item.Active).name;
  }
  public get attribute(): K4Roll.RollableAttribute|null {
    if (this._attribute instanceof Promise) {
      throw new Error("Attribute promise is not yet resolved.");
    }
    return this._attribute;
  }
  _attrVal?: number;
  public get attrVal(): number {
    if (this._attrVal === undefined) {
      if (this.attribute === null) {
        throw new Error("Attempt to derive attribute value of a cancelled (prompt return === null) roll.");
      }
      if (this.attribute === K4Attribute.zero) {
        this._attrVal = 0;
      } else {
        this._attrVal = this.actor.attributes[this.attribute];
      }
    }
    return this._attrVal;
  }
  public get attrName(): string {
    if (this.attribute === null) {
      throw new Error("Attempt to derive attribute name of a cancelled (prompt return === null) roll.");
    }
    return U.tCase(this.attribute);
  }
  public get sourceType() {
    if (!(this.source instanceof K4Item)) { return undefined; }
    if (!this.source.isSubItem()) { return undefined; }
    return this.source.parentType;
  }
  public get outcome(): K4RollResult {
    if (!this._evaluated) {
      throw new Error("Cannot get result of a roll that has not been evaluated.");
    }
    const total = this.total!;
    if (total >= 15) {
      return K4RollResult.completeSuccess;
    }
    if (total > 9) {
      return K4RollResult.partialSuccess;
    }
    return K4RollResult.failure;
  }

  // #endregion

  // #region === CONSTRUCTOR ===
  constructor(rollData: K4Roll.ConstructorData, actor: K4Actor<K4ActorType.pc>) {
    const {img, type, attribute, attrVal, source} = K4Roll.CheckSource(rollData, actor);
    super(`2d10 + ${attrVal}`);
    this.actor = actor;
    this.img = img;
    this.type = type;
    this._attribute = attribute;
    this.source = source;
    kLog.log("K4Roll created", {rollData, actor, roll: this});
  }

  // #ENDREGION

  // #region PRIVATE METHODS ~=


  // #endregion

  // #REGION === PUBLIC METHODS ===


  // #ENDREGION
  doesFilterApply(filter: K4Roll.ModFilter): boolean {
    if (filter === "all") { return true; }
    if (this.sourceType === filter) { return true; }
    if (this.sourceName === filter) { return true; }
    return false;
  }
  getOutcomeData(): K4Item.Components.ResultData {
    if (this.source instanceof K4Item) {
      if (this.source.system.subType !== K4ItemSubType.activeRolled) {
        throw new Error(`Roll source must be of subType activeRolled: ${this.source.name} is of subType ${this.source.system.subType}`);
      }
      const {results} = (this.source as K4Item.Active).system;
      return results[this.outcome];
    }
    return {
      result: ""
    }
  }

  public modifiers: K4Roll.ModData[] = [];

  override get total(): Maybe<number> {
    if (typeof super.total !== "number") { return super.total; }
    return Math.max(0, super.total);
  }

  public async evaluateToChat() {

    // Collect all applicable K4ActiveEffects
    const applicableEffects = this.actor.effects
      .filter((effect) => effect.doesEffectApply(this));

    kLog.log("Applicable Effects", {roll: this, applicableEffects});

    for (const effect of applicableEffects) {
      const modData = await effect.getRollModData(this);
      kLog.log("Effect Mod Data", {effect, modData})
      if (modData === false) {
        // User cancelled an input prompt, so we cancel the roll.
        return false;
      } else {
        // Otherwise, we add the effect's modifier data to the modifiers array and trigger a use of the effect.
        this.modifiers.push(...modData);
      }
    }

    // Insert the modTerm into the roll's terms
    this.terms.push(
      new OperatorTerm({operator: "+", options: {}}),
      new NumericTerm({
        number: this.modifiers.reduce((acc, mod) => acc + mod.value, 0),
        options: {}
      })
    );

    kLog.log("EVALUATING ROLL", {roll: this});

    super.evaluate({async: false});

    game.dice3d?.showForRoll(this);

    return await this.displayToChat();
  }

  public async displayToChat() {
    // if (!this._evaluated) {
    //   throw new Error("Cannot display a roll that has not been evaluated.");
    // }
    const themeCSSClasses: string[] = [];
    const template = await getTemplate(U.getTemplatePath("sidebar", "result-rolled"));
    const templateData: K4Roll.Context = {
      cssClass: "",
      dice: this.dice[0].results.map((dResult) => dResult.result) as [number, number],
      total: this.total!,
      attribute: this.attribute!,
      attrVal: this.attrVal,
      attrType: this.attribute! in C.Attributes.Active ? "active" : "passive",
      modifiers: this.modifiers,
      rollerName: this.actor.name ?? U.loc("roll.someone"),
      rollerImg: this.actor.img ?? "",
      result: this.getOutcomeData(),
      outcome: this.outcome,
      ...(this.source instanceof K4Item && this.source.isActiveItem())
      ? {
        source: this.source as K4Item.Active,
        sourceType: this.source.parentType,
        sourceName: this.source.name,
        sourceImg: this.source.img ?? ""
      }
      : {
        source: this.source as K4Roll.RollableAttribute
      }
    };
    const cssClasses = ["chat-roll-result"];
    if (this.source instanceof K4Item && this.source.isActiveItem()) {
      cssClasses.push(`${this.source.parentType}-roll`);
    }
    switch (this.outcome) {
      case K4RollResult.completeSuccess: {
        cssClasses.push("roll-success");
        themeCSSClasses.push("k4-theme-gold", "roll-success");
        break;
      }
      case K4RollResult.partialSuccess: {
        cssClasses.push("roll-partial");
        themeCSSClasses.push("k4-theme-gold", "roll-partial");
        break;
      }
      case K4RollResult.failure: {
        cssClasses.push("roll-failure");
        themeCSSClasses.push("k4-theme-gold", "roll-failure");
        break;
      }
      default: throw new Error("Invalid roll result");
    }
    if (templateData.rollerName.startsWith("M") || templateData.rollerName.startsWith("W")) {
      cssClasses.push("wide-drop-cap");
    }
    // cssClasses.push(`mod-rows-${Math.ceil(rollData.modifiers.length / 2)}`);
    // if (this.sourceName.length > 22) {
    //   cssClasses.push("ultra-condensed");
    // } else if (this.sourceName.length > 18) {
    //   cssClasses.push("condensed");
    // }
    templateData.cssClass = cssClasses.join(" ");
    // kLog.log("DISPLAYING ROLL RESULT", {roll, templateData, rollData, options});
    const content = template(templateData);


    return await K4ChatMessage.create({
      content,
      speaker: K4ChatMessage.getSpeaker(),
      flags: {
        kult4th: {
          cssClasses: themeCSSClasses,
          isSummary: false,
          isAnimated: true,
          isRoll: true,
          isTrigger: false,
          rollOutcome: this.outcome,
          isEdge: false
        }
      }
    }) as K4ChatMessage;
  }
}


// #region EXPORTS ~
export default K4Roll;

export {K4RollType, K4RollResult}
// #endregion