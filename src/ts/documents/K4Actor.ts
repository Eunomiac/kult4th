// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import K4Item, {K4ItemType} from "./K4Item.js";
import K4PCSheet from "./K4PCSheet.js";
import K4NPCSheet from "./K4NPCSheet.js";
import K4ChatMessage from "./K4ChatMessage.js";
import C, {K4Attribute} from "../scripts/constants.js";
import U from "../scripts/utilities.js";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

export enum K4ActorType {
  pc = "pc",
  npc = "npc"
}

export {K4Attribute};

export enum K4RollType {
  zero = "zero",
  attribute = "attribute",
  move = "move"
}
export enum K4WoundType {
  serious = "serious",
  critical = "critical",
  stableserious = "stableserious",
  stablecritical = "stablecritical"
}

/**
 * Represents an actor in the KULT: Divinity Lost game system.
 * Extends the base Actor class provided by Foundry VTT.
 */
class K4Actor extends Actor {

  /**
   * Type guard to check if the actor is of a specific type.
   * @param {T} type - The type to check against.
   * @returns {boolean} True if the actor is of the specified type.
   */
  is<T extends K4ActorType = K4ActorType>(type: T): this is K4Actor<T> {
    // @ts-expect-error -- Unable to resolve 'this.type' and 'type' to the same type.
    return this.type === type;
  }

  /**
   * Prepares the actor's data.
   * Overrides the base method to include additional preparation for player characters.
   */
  override prepareData() {
    super.prepareData();
    if (this.is(K4ActorType.pc)) {
      this.preparePCData();
    }
  }

  /**
   * Prepares data specific to player characters.
   */
  preparePCData() {
    if (this.is(K4ActorType.pc)) {
      this.system.moves = this.moves;
      this.system.basicMoves = this.basicMoves;
      this.system.derivedMoves = this.derivedMoves;
      this.system.attacks = this.attacks;
      this.system.advantages = this.advantages;
      this.system.disadvantages = this.disadvantages;
      this.system.darkSecrets = this.darkSecrets;
      this.system.weapons = this.weapons;
      this.system.gear = this.gear;
      this.system.relations = this.relations;

      this.system.maxWounds = {
        serious:  this.system.modifiers.wounds_serious.length as Integer,
        critical: this.system.modifiers.wounds_critical.length as Integer,
        total:    (this.system.modifiers.wounds_serious.length + this.system.modifiers.wounds_critical.length) as Integer
      };
      this.system.modifiersReport = this.buildModifierReport(this.flatModTargets);

      // this.validateStability();
    }
  }

  // #region GETTERS ~
  /**
   * Retrieves items of a specific type.
   * @param {Type} type - The type of items to retrieve.
   * @returns {Array<K4Item<Type>>} An array of items of the specified type.
   */
  getItemsOfType<Type extends K4ItemType>(type: Type): Array<K4Item<Type>> {
    return [...this.items].filter((item: K4Item): item is K4Item<Type> => item.is(type));
  }

  /**
   * Retrieves an item by its name.
   * @param {string} iName - The name of the item.
   * @returns {K4Item | undefined} The item if found, otherwise undefined.
   */
  getItemByName(iName: string): K4Item | undefined {
    return this.items.find((item: K4Item) => item.name === iName);
  }

  /**
   * Retrieves a move by its name.
   * @param {string} mName - The name of the move.
   * @returns {K4Item | undefined} The move if found, otherwise undefined.
   */
  getMoveByName(mName: string) {
    return this.moves.find((move: K4Item) => move.name === mName);
  }

  /**
   * Retrieves an attack by its name.
   * @param {string} aName - The name of the attack.
   * @returns {K4Item | undefined} The attack if found, otherwise undefined.
   */
  getAttackByName(aName: string) {
    return this.attacks.find((attack: K4Item) => attack.name === aName);
  }

  /**
   * Retrieves items by their source ID.
   * @param {string} sourceID - The source ID of the items.
   * @returns {K4SubItem[]} An array of sub-items with the specified source ID.
   */
  getItemsBySource(sourceID: string): K4SubItem[] {
    return this.items.filter((item: K4Item): item is K4SubItem => {
      if (!("sourceItem" in item.system)) {return false;}
      const {sourceItem} = item.system;
      return item.isSubItem() && sourceItem?.id === sourceID;
    });
  }

  /**
   * Deletes an item by its name.
   * @param {string} iName - The name of the item.
   * @returns {Promise<void>} A promise that resolves when the item is deleted.
   */
  async dropItemByName(iName: string) {
    return [...this.items].find((item: K4Item): item is K4Item => item.name === iName)?.delete();
  }

  get moves() {return this.getItemsOfType(K4ItemType.move);}
  get basicMoves() {return this.moves.filter((move) => !move.isSubItem());}
  get derivedMoves() {return this.moves.filter((move): move is K4SubItem<K4ItemType.move> => move.isSubItem());}

  get attacks() {return this.getItemsOfType(K4ItemType.attack);}
  get basicAttacks() {return this.attacks.filter((attack) => !attack.isSubItem());}
  get derivedAttacks() {return this.attacks.filter((attack): attack is K4SubItem<K4ItemType.attack> => attack.isSubItem());}

  get advantages() {return this.getItemsOfType(K4ItemType.advantage);}
  get disadvantages() {return this.getItemsOfType(K4ItemType.disadvantage);}
  get darkSecrets() {return this.getItemsOfType(K4ItemType.darksecret);}
  get weapons() {return this.getItemsOfType(K4ItemType.weapon);}
  get gear() {return this.getItemsOfType(K4ItemType.gear);}
  get relations() {return this.getItemsOfType(K4ItemType.relation);}

  get derivedItems() {return [...this.items].filter((item: K4Item): item is K4SubItem => item.isSubItem());}

  get wounds(): Record<IDString, K4Wound> {
    return this.system.wounds;
  }
  get wounds_serious() {return Object.values(this.wounds).filter((wound) => !wound.isCritical);}
  get wounds_critical() {return Object.values(this.wounds).filter((wound) => wound.isCritical);}
  get wounds_serious_unstabilized() {return this.wounds_serious.filter((wound) => !wound.isStabilized);}
  get wounds_critical_unstabilized() {return this.wounds_critical.filter((wound) => !wound.isStabilized);}
  get wounds_serious_stabilized() {return this.wounds_serious.filter((wound) => wound.isStabilized);}
  get wounds_critical_stabilized() {return this.wounds_critical.filter((wound) => wound.isStabilized);}
  // #endregion






  get woundStrips(): HoverStripData[] {
    return Object.values(this.wounds).map((wound) => {
      const stripData: Partial<HoverStripData> = {
        id:   wound.id,
        icon: "systems/kult4th/assets/icons/wounds/",
        type: [
          wound.isStabilized ? "stable" : "",
          wound.isCritical ? "critical" : "serious"
        ].join("") as K4WoundType,
        display:      wound.description ?? "",
        // isGlowing:    (wound.isCritical && !wound.isStabilized) ? "red" : false,
        stripClasses: ["wound-strip"],
        dataTarget:   `system.wounds.${wound.id}.description`,
        placeholder:  "(description)  ",
        buttons:      [
          {
            icon:    wound.isCritical ? "wound-critical" : "wound-serious",
            dataset: {
              target: wound.id,
              action: "toggle-wound-type"
            },
            tooltip: wound.isCritical ? "CRITICAL" : "SERIOUS"
          },
          {
            icon:    "data-retrieval",
            dataset: {
              target: wound.id,
              action: "reset-wound-name"
            },
            tooltip: "EDIT"
          },
          {
            icon:    "wound-serious-stabilized",
            dataset: {
              target: wound.id,
              action: "toggle-wound-stabilize"
            },
            tooltip: wound.isStabilized ? "STABLE" : "STABILIZE"
          },
          {
            icon:    "hinder-other",
            dataset: {
              target: wound.id,
              action: "drop-wound"
            },
            tooltip: "DROP"
          }
        ]
      };
      if (wound.isCritical) {
        stripData.icon += `wound-critical${wound.isStabilized ? "-stabilized" : ""}.svg`;
        stripData.stripClasses?.push("wound-critical");
      } else {
        stripData.icon += `wound-serious${wound.isStabilized ? "-stabilized" : ""}.svg`;
      }
      if (wound.isStabilized) {
        stripData.stripClasses?.push("k4-theme-gold", "wound-stabilized");
      } else {
        stripData.stripClasses?.push("k4-theme-red");
      }
      return stripData as HoverStripData;
    });
  }

  get attributeData() {
    if (this.is(K4ActorType.pc)) {
      const attrList = [...Object.keys(C.Attributes.Passive), ...Object.keys(C.Attributes.Active)] as K4CharAttribute[];
      const pcData: K4ActorSystem<K4ActorType.pc> = this.system;
      return attrList.map((attrName) => ({
        name:  U.tCase(attrName),
        key:   attrName,
        min:   pcData.attributes[attrName].min,
        max:   pcData.attributes[attrName].max,
        value: pcData.attributes[attrName].value
      }));
    }
    return [];
  }

  /**
   * Retrieves a record of character attributes with their corresponding values.
   * @returns {Record<K4CharAttribute, number>} A record mapping each attribute to its integer value.
   */
  get attributes(): Record<K4CharAttribute, number> {
    const attributeMap: Record<K4CharAttribute, number> = {} as Record<K4CharAttribute, number>;
    this.attributeData.forEach((aData) => {
      attributeMap[aData.key] = aData.value;
    });
    return attributeMap;
  }

  /**
   * Prompts the user to select an attribute using a dialog.
   * @param {string | undefined} message - Optional message to display in the dialog.
   * @returns {Promise<K4RollableAttribute | null>} The selected attribute or null if no selection is made.
   */
  async askForAttribute(message?: string): Promise<K4RollableAttribute | null> {
    const template = await getTemplate(U.getTemplatePath("dialog", "ask-for-attribute"));
    const content = template({
      id: this.id,
      message
    });
    const userOutput = await new Promise<{attribute: K4RollableAttribute}>((resolve) => {
      new Dialog(
        {
          title:   "Attribute Selection",
          content,
          default: K4Attribute.zero,
          buttons: C.AttributeButtons(resolve)
        },
        {
          classes: [C.SYSTEM_ID, "dialog", "attribute-selection"]
        }
      ).render(true);
    });
    if (userOutput.attribute in K4Attribute) {
      return userOutput.attribute;
    } else {
      return null;
    }
  }

  // async askForTextInput(prompt: string, placeholder?: string): Promise<string | null> {
  //   const template = await getTemplate(U.getTemplatePath("dialog", "ask-for-text-input"));
  //   const content = template({
  //     id: this.id,
  //     prompt,
  //     placeholder
  //   });
  // }

  /**
   * Validates the stability of the actor.
   * Ensures the stability value is within the defined range.
   */
  async validateStability() {
    if (this.is(K4ActorType.pc)) {
      const {value, min, max} = this.system.stability;
      if (U.clampNum(value, [min, max]) !== value) {
        await this.update({"system.stability.value": U.clampNum(value, [min, max])});
      }
    }
  }

  /**
   * Changes the stability of the actor by a specified delta.
   * @param {number} delta - The change in stability.
   */
  async changeStability(delta: number) {
    if (delta && this.is(K4ActorType.pc)) {
      const {value, min, max} = this.system.stability;
      if (U.clampNum(value + delta, [min, max]) !== value) {
        await this.update({"system.stability.value": U.clampNum(value + delta, [min, max])});
      }
    }
  }

  /**
   * Adds a wound to the actor.
   * @param {K4WoundType} [type] - The type of the wound.
   * @param {string} [description] - The description of the wound.
   */
  async addWound(type?: K4WoundType, description?: string) {
    if (this.is(K4ActorType.pc)) {
      const woundData: K4Wound = {
        id:           U.getID(),
        description:  description ?? "",
        isCritical:   type === K4WoundType.critical,
        isStabilized: false
      };
      let isWoundUpgrading = false;
      if (!woundData.isCritical) {
        // If the wound is serious, check if the actor has more than the maximum number of allowed serious wounds
        if (this.wounds_serious.length >= this.system.maxWounds.serious) {
          // If the actor has reached the limit for serious wounds, upgrade the wound to critical
          woundData.isCritical = true;
          isWoundUpgrading = true;
        }
      }
      if (woundData.isCritical) {
        // If critical, check if actor already has a critical wound; if so, reject the wound and alert the players
        if (this.wounds_critical.length) {
          if (isWoundUpgrading) {
            ui.notifications?.error(`${this.name} has already suffered ${U.verbalizeNum(this.wounds_serious.length)} serious wounds and a critical wound: They can withstand no further injury.`)
          } else {
            ui.notifications?.error(`${this.name} has already suffered a critical wound and cannot withstand another.`);
          }
          return;
        }
        if (isWoundUpgrading) {
          ui.notifications?.warn(`${this.name} already has ${U.verbalizeNum(this.wounds_serious.length)} serious wounds, and suffers a CRITICAL WOUND instead!`);
        } else {
          ui.notifications?.warn(`${this.name} suffers a CRITICAL WOUND!`);
        }
      } else {
        ui.notifications?.warn(`${this.name} suffers a Serious Wound!`);
      }
      kLog.log("Starting Wounds", U.objClone(this.system.wounds));
      await this.update({[`system.wounds.${woundData.id}`]: woundData});
      kLog.log("Updated Wounds", U.objClone(this.system.wounds));
    }
  }

  /**
   * Toggles the type or stabilization state of a wound.
   * @param {K4WoundType} id - The ID of the wound.
   * @param {"type"|"stabilized"} toggleSwitch - The property to toggle.
   */
  async toggleWound(id: IDString, toggleSwitch: "type" | "stabilized") {
    const woundData = this.wounds[id];
    if (woundData) {
      switch (toggleSwitch) {
        case "type": {
          await this.update({[`system.wounds.${id}.isCritical`]: !this.wounds[id].isCritical});
          return;
        }
        case "stabilized": {
          await this.update({[`system.wounds.${id}.isStabilized`]: !this.wounds[id].isStabilized});
        }
        // no default
      }
    }
  }

  /**
   * Resets the name of a wound.
   * @param {string} id - The ID of the wound.
   */
  async resetWoundName(id: IDString) {
    const woundData = this.wounds[id];
    if (woundData) {
      await this.update({[`system.wounds.${id}.description`]: ""});
    }
  }

  /**
   * Removes a wound from the actor.
   * @param {string} id - The ID of the wound.
   */
  async removeWound(id: IDString) {
    if (this.is(K4ActorType.pc)) {
      kLog.log("Starting Wounds", U.objClone(this.system.wounds));
      await this.update({[`system.wounds.-=${id}`]: null});
      kLog.log("Updated Wounds", this.system.wounds);
    }
  }

  /**
   *
   * @param {K4ModTargets} [modData=this.flatModTargets] - The modifiers to parse.
   * @returns {string[]} An array of strings representing the modifiers.
   */
  buildModifierReport(modData: K4ModTargets = this.flatModTargets): string {
    const returnStrings = [];
    for (const [modKey, modVal] of Object.entries(modData)) {
      if (modVal < 0) {
        returnStrings.push(`<span class="k4-theme-red"><strong>${modVal}</strong> to <strong>${modKey === "all" ? "all" : U.tCase(modKey)}</strong> rolls</span>`);
      } else {
        returnStrings.push(`<span class="k4-theme-gold"><strong>+${modVal}</strong> to <strong>${modKey === "all" ? "all" : U.tCase(modKey)}</strong> rolls</span>`);
      }
    }
    return returnStrings.join("<span class='k4-theme-black no-flex'>&#9670;</span>");
  }

  /**
   * Retrieves wound modifier data.
   * @returns {K4RollModData} The wound modifier data.
   */
  get woundModData(): K4RollModData {
    const modData: K4RollModData = {
      category: "wound",
      display:  U.loc("trait.wounds"),
      targets:  {}
    };
    if (this.is(K4ActorType.pc)) {
      const [unstabSerious, unstabCritical] = [
        Object.values(this.wounds).filter((wound) => !wound.isCritical && !wound.isStabilized).length,
        Object.values(this.wounds).filter((wound) => wound.isCritical && !wound.isStabilized).length
      ];
      if (unstabSerious && unstabCritical) {
        modData.targets = this.system.modifiers.wounds_seriouscritical[Math.min(
          unstabSerious,
          unstabCritical
        )];
      } else if (unstabCritical) {
        modData.targets = this.system.modifiers.wounds_critical[unstabCritical];
      } else if (unstabSerious) {
        modData.targets = this.system.modifiers.wounds_serious[unstabSerious];
      }
    }
    return modData;
  }

  /**
   * Retrieves stability modifier data.
   * @returns {K4RollModData} The stability modifier data.
   */
  get stabilityModData(): K4RollModData {
    const modData: K4RollModData = {
      category: "stability",
      display:  U.loc("trait.stability"),
      targets:  {}
    };
    if (this.is(K4ActorType.pc)) {
      modData.targets = this.system.modifiers.stability[this.system.stability.value];
    }
    return modData;
  }

  /**
   * Retrieves condition modifier data.
   * @returns {K4RollModData[]} An array of condition modifier data.
   */
  get conditionModData(): K4RollModData[] {
    const modData: K4RollModData[] = [];

    return modData;
  }

  /**
   * Retrieves effect modifier data.
   * @returns {K4RollModData[]} An array of effect modifier data.
   */
  get effectModData(): K4RollModData[] {
    return [
      {
        category: "effect",
        display:  "Test Effect One",
        targets:  {"Keep It Together": 2}
      },
      {
        category: "effect",
        display:  "Test Effect Two",
        targets:  {move: 4}
      },
      {
        category: "effect",
        display:  "Test Effect Three",
        targets:  {[K4Attribute.willpower]: -1}
      }
    ];
  }

  /**
   * Retrieves all modifier targets.
   * @returns {K4RollModData[]} An array of all modifier targets.
   */
  get modTargets(): K4RollModData[] {
    return [
      this.woundModData,
      this.stabilityModData,
      ...this.conditionModData,
      ...this.effectModData
    ];
  }
  get flatModTargets(): K4ModTargets {

    // Flatten all modifiers by combining total modifiers for each target
    const flatTargets: K4ModTargets = {};
    this.modTargets
      .forEach(({targets}) => {
        Object.entries(targets)
          .filter(([_, modNum]) => modNum !== 0)
          .forEach(([modSource, modNum]) => {
            flatTargets[modSource] ??= 0;
            flatTargets[modSource] += modNum;
          });
      });

    // Remove any targets with a modifier of 0
    for (const [key, value] of Object.entries(flatTargets)) {
      if (value === 0) {
        delete flatTargets[key];
      }
    }

    // Sort the targets by modifier value
    return Object.fromEntries(Object.entries(flatTargets).sort((a, b) => b[1] - a[1]));
  }

  public async roll(rollSource: string, options: Partial<K4RollOptions> = {}) {
    const rollResults = await this.#getRoll(rollSource);
    if (rollResults) {
      await rollResults.roll.evaluate({async: true});
      if (game.dice3d) {
        await game.dice3d.showForRoll(rollResults.roll);
      }
      if (rollResults.roll.total) {
        kLog.log("Roll Successful", {roll: rollResults.roll, rollData: rollResults.rollData, options});
        await this.#displayRollResult(rollResults.roll, rollResults.rollData, options as K4RollOptions);
      }
    }
  }

  public async trigger(rollSource: string) {await this.getItemByName(rollSource)?.displayItemSummary();}

  async #parseItemRollSource(item: K4Item & K4RollSource, rollData: Partial<K4RollData>) {
    rollData.type = K4RollType.move;
    rollData.source = item;
    rollData.sourceType = item.masterType;
    rollData.sourceName = item.name;
    rollData.sourceImg = item.img ?? "";

    if ("attribute" in item.system) {
      if (item.system.attribute === K4Attribute.ask) {
        const attrResponse = await this.askForAttribute();
        if (!attrResponse) {
          return false; // User cancelled: Abort roll.
        }
        rollData.attribute = attrResponse;
      } else {
        rollData.attribute = item.system.attribute as K4RollableAttribute;
      }
      rollData.attrName = U.loc(`trait.${rollData.attribute}`);
      rollData.attrVal = rollData.attribute === K4Attribute.zero
        ? 0
        : this.attributes[rollData.attribute];
    }
    return true;
  }

  async #getRoll(rollSourceRef: string | K4RollSource | K4Attribute): Promise<{roll: Roll, rollData: K4RollData} | false> {

    let rollSource: K4RollSource | undefined;
    const rollData: Partial<K4RollData> = {};

    if (rollSourceRef === K4Attribute.ask) {
      const attrResponse = await this.askForAttribute();
      if (attrResponse) {
        rollSource = attrResponse;
      }
    } else if (rollSourceRef instanceof K4Item) {
      if (rollSourceRef instanceof K4Item && rollSourceRef.isRollableItem()) {
        rollSource = rollSourceRef;
      }
    } else if ([
      ...Object.keys(CONFIG.K4.attributes),
      K4Attribute.zero
    ].includes(rollSourceRef)) {
      rollSource = rollSourceRef as K4RollableAttribute;
    } else if (typeof rollSourceRef === "string") {
      const item = this.getMoveByName(rollSourceRef) ?? this.getAttackByName(rollSourceRef);
      if (item instanceof K4Item && item.isRollableItem()) {
        rollSource = item;
      }
    }

    if (!rollSource) {return false;}

    if (rollSource instanceof K4Item) {
      if (!await this.#parseItemRollSource(rollSource, rollData)) {
        return false;
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

    const finalData: K4RollData = this.#applyRollModifiers(rollData as Omit<K4RollData, "modifiers">);

    kLog.log("RETRIEVED ROLL DATA", finalData);
    return {
      roll: new Roll([
        "2d10",
        U.signNum(finalData.attrVal ?? 0, " "),
        ...Object.values(finalData.modifiers)
          .map(({value}) => U.signNum(value, " "))
          .filter((elem) => elem !== "")
      ].join(" ")),
      rollData: finalData
    };
  }

  #checkModTarget(target: string, rollData: Omit<K4RollData, "modifiers">) {
    return ["all", rollData.sourceType, rollData.sourceName, rollData.attribute].includes(target);
  }

  #checkMod(modData: K4RollModData, rollData: Omit<K4RollData, "modifiers">): K4RollMod | null {
    const mod: K4RollMod = {category: modData.category, display: modData.display, value: 0};
    for (const [target, value] of Object.entries(modData.targets)) {
      if (this.#checkModTarget(target, rollData)) {
        mod.value += value;
      }
    }
    if (mod.value === 0) {
      return null;
    }
    return mod;
  }

  #applyRollModifiers(rollData: Omit<K4RollData, "modifiers">): K4RollData {
    return {
      ...rollData,
      modifiers: [
        this.woundModData,
        this.stabilityModData,
        ...this.conditionModData,
        ...this.effectModData
      ]
        .map((modData) => this.#checkMod(modData, rollData))
        .filter((mod): mod is K4RollMod => mod !== null)
    };
  }

  async #displayRollResult(roll: Roll, rollData: K4RollData, options: K4RollOptions) {
    if (U.isUndefined(roll.total)) {return;}
    function isItem(ref: unknown): ref is K4RollableItem {return ref instanceof K4Item;}

    const template = await getTemplate(U.getTemplatePath("sidebar", "result-rolled"));
    const templateData: {
      cssClass: string,
      result?: ValueOf<K4ItemComps.ResultsData["results"]>,
      dice: [number, number],
      total: number,
      rollData: K4RollData,
      rollerName: string
    } = {
      cssClass:   "",
      dice:       roll.dice[0].results.map((dResult) => dResult.result) as [number, number],
      total:      roll.total,
      rollData,
      rollerName: this.name ?? U.loc("roll.someone")
    };
    const cssClasses = ["chat-roll-result", `${rollData.sourceType}-roll`];
    if (roll.total >= 15) {
      templateData.result = isItem(rollData.source) ? rollData.source.system.results.completeSuccess : {result: ""};
      cssClasses.push("roll-success");
    } else if (roll.total >= 9) {
      templateData.result = isItem(rollData.source) ? rollData.source.system.results.partialSuccess : {result: ""};
      cssClasses.push("roll-partial");
    } else {
      templateData.result = isItem(rollData.source) ? rollData.source.system.results.failure : {result: ""};
      cssClasses.push("roll-failure");
    }
    cssClasses.push(`mod-rows-${Math.ceil(rollData.modifiers.length / 2)}`);
    if (rollData.sourceName.length > 22) {
      cssClasses.push("ultra-condensed");
    } else if (rollData.sourceName.length > 18) {
      cssClasses.push("condensed");
    }
    templateData.cssClass = cssClasses.join(" ");
    kLog.log("DISPLAYING ROLL RESULT", {roll, templateData, rollData, options});
    const content = template(templateData);
    await K4ChatMessage.create({
      content,
      speaker: K4ChatMessage.getSpeaker()
    });
  }

  override async _onCreate(...params: Parameters<Actor["_onCreate"]>) {
    super._onCreate(...params);
    if (this.type === K4ActorType.pc) {
      const pack = game.packs.get("kult4th.k4-basic-player-moves");
      if (pack) {
        const index = await pack.getIndex();
        // Convert the index to an array
        const moveArray = Array.from(index);
        // Fetch all move documents and extract their data, ensuring type safety
        const newItems = await Promise.all(moveArray.map(async (move) => {
          // Explicitly type the result of getDocument to avoid 'any' type issues
          const moveData = await pack.getDocument(move._id) as Maybe<K4Item<K4ItemType.move>>;
          // Safely return the data or an empty object if undefined
          return moveData?.data ?? {};
        }));
        // Check if newItems array is not empty before creating embedded documents
        if (newItems.length > 0) {
          // Create embedded documents for each new item
          await this.createEmbeddedDocuments("Item", newItems);
        }
      }
      await this.setFlag("kult4th", "sheetTab", "front");
    }
  }
}

interface K4Actor<Type extends K4ActorType = K4ActorType> {
  get id(): IDString;
  get name(): string;
  get type(): Type;
  get sheet(): Actor["sheet"] & (Type extends K4ActorType.pc ? K4PCSheet : K4NPCSheet);
  get items(): Actor["items"] & Collection<K4Item>;
  system: K4ActorSystem<Type>;
}

export default K4Actor;