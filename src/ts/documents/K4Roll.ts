// #region IMPORTS ~
import {K4Attribute} from "../scripts/constants.js";
import K4Item, {K4ItemType} from "./K4Item.js";
import K4Actor, {K4ActorType} from "./K4Actor.js";

// #endregion

// #REGION === TYPES, ENUMS, INTERFACE AUGMENTATION === ~
// #region -- ENUMS ~
enum K4RollResult {
  completeSuccess = "completeSuccess",
  partialSuccess = "partialSuccess",
  failure = "failure"
}
enum K4RollType {
  zero = "zero",
  attribute = "attribute",
  move = "move"
}
// #endregion
// #region -- TYPES ~

declare global {

  namespace K4Roll {
    export interface Options {
      type: K4RollType|K4ItemType.move|K4ItemType.attack,
      isAssisting?: boolean
    }
    export type Attribute = K4CharAttribute|K4Attribute.zero;
    export type Source = K4Item.Active|K4Roll.Attribute;
    export type ModTargets = Record<string, number>;
    interface Data {
      type: K4RollType,
      source: K4Roll.Source,
      sourceType: K4ItemType|K4RollType.attribute,
      sourceName: string,
      sourceImg: string,
      attribute: Exclude<K4Attribute, K4Attribute.ask>,
      attrName: string,
      attrVal: number
    }

  }
}
// #endregion
// #region -- INTERFACE AUGMENTATION ~

// #endregion
// #ENDREGION

class K4Roll extends Roll {

  async #getRollData(rollSourceRef: string | K4Roll.Source | K4Attribute): Promise<{roll: Roll, rollData: K4Roll.Data;} | false> {

    let rollSource: K4Roll.Source | undefined;
    const rollData: Partial<K4Roll.Data> = {};

    if (rollSourceRef === K4Attribute.ask) {
      const attrResponse = await this.askForAttribute();
      if (attrResponse) {
        rollSource = attrResponse;
      }
    } else if (rollSourceRef instanceof K4Item) {
      if (rollSourceRef.isActiveItem()) {
        rollSource = rollSourceRef;
      }
    } else if ([
      ...Object.keys(CONFIG.K4.attributes),
      K4Attribute.zero
    ].includes(rollSourceRef)) {
      rollSource = rollSourceRef as K4Roll.Attribute;
    } else if (typeof rollSourceRef === "string") {
      const item = this.getMoveByName(rollSourceRef);
      if (item instanceof K4Item && item.isActiveItem()) {
        rollSource = item;
      }
    }

    if (!rollSource) {return false;}

    if (rollSource instanceof K4Item) {
      rollData.type = K4RollType.move;
      rollData.source = rollSource;
      rollData.sourceType = rollSource.parentType;
      rollData.sourceName = rollSource.name;
      rollData.sourceImg = rollSource.img ?? "";
      if ("attribute" in rollSource.system) {
        if (rollSource.system.attribute === K4Attribute.ask) {
          const attrResponse = await this.askForAttribute();
          if (!attrResponse) {
            return false; // User cancelled: Abort roll.
          }
          rollData.attribute = attrResponse;
        } else {
          rollData.attribute = rollSource.system.attribute as K4Roll.Attribute;
        }
        rollData.attrName = U.loc(`trait.${rollData.attribute}`);
        rollData.attrVal = rollData.attribute === K4Attribute.zero
          ? 0
          : this.attributes[rollData.attribute];
      }
    } else if (rollSource in K4Attribute) {
      rollData.type = rollSource === K4Attribute.zero ? K4RollType.zero : K4RollType.attribute;
      rollData.source = rollSource;
      rollData.sourceType = K4RollType.attribute;
      rollData.sourceName = "";
      rollData.sourceImg = "";
      rollData.attribute = rollSource;
      rollData.attrName = U.loc(`trait.${rollSource}`);
      rollData.attrVal = rollSource === K4Attribute.zero ? 0 : this.attributes[rollSource as K4CharAttribute];
    } else {
      throw new Error(`Unable to compile roll data for rollRef '${String(rollSourceRef)}'`);
    }

    // const finalData: K4Roll.Data = this.#applyRollModifiers(rollData as Omit<K4Roll.Data, "modifiers">);

    kLog.log("RETRIEVED ROLL DATA", rollData);
    return {
      roll: new Roll([
        "2d10",
        U.signNum(rollData.attrVal ?? 0, " "),
        // ...Object.values(finalData.modifiers)
        //   .map(({value}) => U.signNum(value, " "))
        //   .filter((elem) => elem !== "")
      ].join(" ")),
      rollData: rollData as K4Roll.Data
    };
  }
  #getRollResult(roll: Roll): K4RollResult | undefined {
    if (U.isUndefined(roll.total)) {return;}
    if (roll.total >= 15) {
      return K4RollResult.completeSuccess;
    }
    if (roll.total > 9) {
      return K4RollResult.partialSuccess;
    }
    return K4RollResult.failure;
  }

  #getRollResultData(roll: Roll, rollData: K4Roll.Data): ValueOf<K4Item.Components.ResultsData["results"]> {
    const {source} = rollData;
    if (!(source instanceof K4Item)) {
      throw new Error(`Roll source must be an instance of K4Item: ${source}`);
    }
    if (source.type !== K4ItemType.move || source.system.subType !== K4ItemSubType.activeRolled) {
      throw new Error(`Roll source must be of type move and subType activeRolled: ${source.name} is of type ${source.type} and subType ${source.system.subType}`);
    }
    const {results} = source.system as K4Item.System<K4ItemType.move>;
    if (!results) {
      throw new Error(`No results data found for source: ${source.name}`);
    }
    return results[this.#getRollResult(roll)!];
  }

  async #displayRollResult(roll: Roll, rollData: K4Roll.Data) {
    if (U.isUndefined(roll.total)) {return;}
    let themeClass: string;
    const template = await getTemplate(U.getTemplatePath("sidebar", "result-rolled"));
    const templateData: {
      cssClass: string,
      result?: ValueOf<K4Item.Components.ResultsData["results"]>,
      dice: [number, number],
      total: number,
      rollData: K4Roll.Data,
      rollerName: string;
    } = {
      cssClass: "",
      dice: roll.dice[0].results.map((dResult) => dResult.result) as [number, number],
      total: roll.total,
      rollData,
      rollerName: this.name ?? U.loc("roll.someone"),
      result: this.#getRollResultData(roll, rollData)
    };
    const cssClasses = ["chat-move-result", `${rollData.sourceType}-roll`];
    switch (this.#getRollResult(roll)) {
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
    if (rollData.sourceName.length > 22) {
      cssClasses.push("ultra-condensed");
    } else if (rollData.sourceName.length > 18) {
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
  public async roll(rollSource: string) {
    const {roll, rollData} = await this.#getRollData(rollSource) || {};
    if (!roll || !rollData) {return;}
    await roll.evaluate({async: true});
    if (U.isUndefined(roll.total)) {return;}

    const rollPromises: Promise<void>[] = [];
    if (game.dice3d) {
      rollPromises.push(game.dice3d.showForRoll(roll));
    }
    rollPromises.push(this.#displayRollResult(roll, rollData));

    const rollResultData = this.#getRollResultData(roll, rollData);
    if (rollResultData?.edges && rollData.source instanceof K4Item) {
      rollPromises.push(this.updateEdges(rollResultData.edges, rollData.source));
    }
  }



 }

// #region EXPORTS ~
export default K4Roll;

export {K4RollType, K4RollResult}
// #endregion