// #region IMPORTS ~
import U from "../scripts/utilities.js";
import {K4Attribute} from "../scripts/constants.js";
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
    export type ModFilter = "all"|"basic_move"|K4Item.Types.Active|K4CharAttribute|string;
    export type ModDefinition = Record<ModFilter, number>;

    export interface ModData {
      name: string,
      tooltip?: string,
      linkToItem?: K4Item,
      value: number
    }

    interface ConstructorData_Base {
      source: K4Roll.Source|string
    }
    interface ConstructorData_ItemSource extends ConstructorData_Base {
      source: K4Item.Active|string
    }
    interface ConstructorData_AttrSource extends ConstructorData_Base {
      source: K4Roll.Attribute
      img: string
    }

    export type ConstructorData = ConstructorData_ItemSource | ConstructorData_AttrSource;

    interface Data_Base extends ConstructorData_Base {
      attribute: K4Roll.RollableAttribute,
      attrVal: number,
      modifiers: Array<K4Roll.ModData>
    }

    interface Data_ItemSource extends Data_Base {
      source: K4Item.Active
    }
    interface Data_AttrSource extends Data_Base {
      source: K4Roll.RollableAttribute,
      img: string
    }
    export type Data = Data_ItemSource | Data_AttrSource;
    interface Context_Base {
      cssClass: string,
      dice: [number, number],
      total: number,
      source: K4Roll.RollableAttribute|K4Item.Active,
      attribute: K4Roll.RollableAttribute,
      attrVal: number,
      modifiers: ModData[],
      rollerName: string,
      rollerImg: string,
      result: K4Item.Components.ResultData
    }
    interface Context_ItemSource extends Context_Base {
      source: K4Item.Active,
      sourceType: K4ItemType,
      sourceName: string,
      sourceImg: string
    }
    interface Context_AttrSource extends Context_Base {
      source: K4Roll.RollableAttribute
    }
    export type Context = Context_ItemSource | Context_AttrSource;
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

  // #region GETTERS & SETTERS ~
  override get formula(): string {
    return `2d10`;
  }
  public actor: K4Actor<K4ActorType.pc>;
  public img: string;
  public _attribute: Promise<K4Roll.RollableAttribute|null>|K4Roll.RollableAttribute;
  public type: K4RollType;
  public source: K4Roll.Attribute|K4Item.Active;
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
  public get parentType(): Maybe<K4Item.Types.Active> {
    if (this.source instanceof K4Item) {
      if (this.source.isSubItem()) {
        return this.source.parentType as K4Item.Types.Active;
      }
    }
    return undefined;
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

  get modifierFilterData(): K4Roll.ModFilter[] {
    const filters: K4Roll.ModFilter[] = [
      "all",

    ];
    return filters;
  }

  get modifiers(): K4Roll.ModData[] {
    const mods: K4Roll.ModData[] = [];


    return mods;
  }

  // #endregion

  // #region === CONSTRUCTOR ===
  #checkSource(rollData: K4Roll.ConstructorData): {
    type: K4RollType,
    img: string,
    _attribute: Promise<K4Roll.RollableAttribute|null>|K4Roll.RollableAttribute,
    source: K4Roll.Source
  } {
    if (typeof rollData.source === "string") {
      switch (rollData.source) {
        case K4Attribute.ask: {
          return {
            type: K4RollType.attribute,
            img: (rollData as K4Roll.ConstructorData_AttrSource).img,
            _attribute: this.actor.askForAttribute(),
            source: rollData.source
          };
        }
        case K4Attribute.zero:
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
          return {
            type: K4RollType.attribute,
            img: (rollData as K4Roll.ConstructorData_AttrSource).img,
            _attribute: rollData.source,
            source: rollData.source
          };
        }
        default: {
          // Assume an item reference by UUID, ID or name
          const item = fromUuidSync(rollData.source) as Maybe<K4Item>
            ?? this.actor.items.get(rollData.source) as Maybe<K4Item>
            ?? this.actor.getItemByName(rollData.source) as Maybe<K4Item>
          if (!item?.isActiveItem()) {
            throw new Error(`Unrecognized rollData.source: ${rollData.source}`);
          }
          rollData.source = item;
        }
      }
    }

    if (rollData.source instanceof K4Item && rollData.source.isActiveItem()) {
      return {
        type: K4RollType.move,
        img: rollData.source.img ?? "",
        _attribute: rollData.source.system.attribute === K4Attribute.ask
          ? this.actor.askForAttribute()
          : rollData.source.system.attribute,
        source: rollData.source
      }
    }
    throw new Error(`Unable to parse attribute from rollData.source: ${JSON.stringify(2, null, rollData.source)}`);
  }
  constructor(rollData: K4Roll.ConstructorData, actor: K4Actor<K4ActorType.pc>) {
    super("2d10");
    this.actor = actor;
    const {img, type, _attribute, source} = this.#checkSource(rollData);
    this.img = img;
    this.type = type;
    this._attribute = _attribute;
    this.source = source;
  }

  // #ENDREGION

  // #region PRIVATE METHODS ~=


  // #endregion

  // #REGION === PUBLIC METHODS ===


  // #ENDREGION
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

  public async displayToChat() {
    if (!this._evaluated) {
      throw new Error("Cannot display a roll that has not been evaluated.");
    }
    let themeClass: string;
    const template = await getTemplate(U.getTemplatePath("sidebar", "result-rolled"));
    const templateData: K4Roll.Context = {
      cssClass: "",
      dice: this.dice[0].results.map((dResult) => dResult.result) as [number, number],
      total: this.total!,
      attribute: this.attribute!,
      attrVal: this.attrVal,
      modifiers: this.modifiers,
      rollerName: this.actor.name ?? U.loc("roll.someone"),
      rollerImg: this.actor.img ?? "",
      result: this.getOutcomeData(),
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
        themeClass = "k4-theme-gold";
        break;
      }
      case K4RollResult.partialSuccess: {
        cssClasses.push("roll-partial");
        themeClass = "k4-theme-gold";
        break;
      }
      case K4RollResult.failure: {
        cssClasses.push("roll-failure");
        themeClass = "k4-theme-gold";
        break;
      }
      default: throw new Error("Invalid roll result");
    }
    // cssClasses.push(`mod-rows-${Math.ceil(rollData.modifiers.length / 2)}`);
    if (this.sourceName.length > 22) {
      cssClasses.push("ultra-condensed");
    } else if (this.sourceName.length > 18) {
      cssClasses.push("condensed");
    }
    templateData.cssClass = cssClasses.join(" ");
    // kLog.log("DISPLAYING ROLL RESULT", {roll, templateData, rollData, options});
    const content = template(templateData);


    await K4ChatMessage.create({
      content,
      speaker: K4ChatMessage.getSpeaker(),
      flags: {
        kult4th: {
          cssClasses: [themeClass]
        }
      }
    });

  }
  public override evaluate(options?: InexactPartial<RollTerm.Options> & { async: true }): Promise<Evaluated<this>>;
  public override evaluate(options: InexactPartial<RollTerm.Options & { async: false }>): Evaluated<this>;
  public override evaluate(options?: InexactPartial<RollTerm.Options>): Evaluated<this> | Promise<Evaluated<this>> {
    const returnData = super.evaluate({async: false});

    // const rollPromises: Promise<void>[] = [];
    // if (game.dice3d) {
      // rollPromises.push(game.dice3d.showForRoll(this));
    game.dice3d?.showForRoll(this);
    // }
    // rollPromises.push(this.#displayRollResult());
    // await Promise.all(rollPromises);
    return returnData;
  }
}


// #region EXPORTS ~
export default K4Roll;

export {K4RollType, K4RollResult}
// #endregion