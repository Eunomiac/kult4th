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
class K4Actor extends Actor {

  get actorSheet() {
    return this._sheet as typeof this._sheet & (
      typeof this.data.type extends K4ActorType.pc ? K4PCSheet : K4NPCSheet
     );
  }

  override prepareData() {
    super.prepareData();
    if (this.data.type === K4ActorType.pc) {
      this.preparePCData();
    }
  }

  preparePCData() {
    if (this.data.type === K4ActorType.pc) {
      this.data.data.moves = this.moves;
      this.data.data.basicMoves = this.basicMoves;
      this.data.data.derivedMoves = this.derivedMoves;
      this.data.data.attacks = this.attacks;
      this.data.data.advantages = this.advantages;
      this.data.data.disadvantages = this.disadvantages;
      this.data.data.darkSecrets = this.darkSecrets;
      this.data.data.weapons = this.weapons;
      this.data.data.gear = this.gear;
      this.data.data.relations = this.relations;

      this.data.data.maxWounds = {
        serious:  this.data.data.modifiers.wounds_serious.length as Integer,
        critical: this.data.data.modifiers.wounds_critical.length as Integer,
        total:    (this.data.data.modifiers.wounds_serious.length + this.data.data.modifiers.wounds_critical.length) as Integer
      };
      this.data.data.modifiersReport = this.parseModsToStrings(this.flatModTargets).join("; ");

      // this.validateStability();
    }
  }

  getItemsOfType<Type extends K4ItemType>(type: Type): Array<K4ItemSpec<Type>> {
    return [...this.items].filter((item: K4Item) => item.data.type === type) as Array<K4ItemSpec<Type>>;
  }

  getItemByName(iName: string): K4Item | undefined {
    return [...this.items].find((item: K4Item): item is K4Item => item.name === iName);
  }

  getItemsBySource(sourceID: string): K4SubItem[] {
    return [...this.items].filter((item: K4Item): item is K4SubItem => {
      if (!("sourceItem" in item.data.data)) { return false; }
      const {sourceItem} = item.data.data;
      return item.isSubItem() && sourceItem?.id === sourceID;
    });
  }

  async dropItemByName(iName: string) {
    return [...this.items].find((item: K4Item): item is K4Item => item.name === iName)?.delete();
  }

  get moves() { return this.getItemsOfType(K4ItemType.move); }
  get basicMoves() { return this.moves.filter((move) => !move.isSubItem()); }
  get derivedMoves() { return this.moves.filter((move): move is K4SubItem<K4ItemType.move> => move.isSubItem()); }

  get attacks() { return this.getItemsOfType(K4ItemType.attack); }
  get basicAttacks() { return this.attacks.filter((attack) => !attack.isSubItem()); }
  get derivedAttacks() { return this.attacks.filter((attack): attack is K4SubItem<K4ItemType.attack> => attack.isSubItem()); }

  get advantages() { return this.getItemsOfType(K4ItemType.advantage); }
  get disadvantages() { return this.getItemsOfType(K4ItemType.disadvantage); }
  get darkSecrets() { return this.getItemsOfType(K4ItemType.darksecret); }
  get weapons() { return this.getItemsOfType(K4ItemType.weapon); }
  get gear() { return this.getItemsOfType(K4ItemType.gear); }
  get relations() { return this.getItemsOfType(K4ItemType.relation); }

  get derivedItems() { return [...this.items].filter((item: K4Item): item is K4SubItem => item.isSubItem()); }

  get wounds(): Record<KeyOf<typeof this["data"]["data"]["wounds"]>, K4Wound> {
    // if (this.type === K4ActorType.pc) {
    return this.data.data.wounds;
    // } else {
    // return ;
    // }
  }

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
        stripClasses: ["wound-strip"],
        dataTarget:   `data.wounds.${wound.id}.description`,
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
        stripData.stripClasses?.push("k4-theme-dgold", "wound-stabilized");
      } else {
        stripData.stripClasses?.push("k4-theme-red");
      }
      return stripData as HoverStripData;
    });
  }

  get attributeData() {
    if (this.data.type === K4ActorType.pc) {
      const attrList = [...Object.keys(C.Attributes.Passive), ...Object.keys(C.Attributes.Active)] as K4CharAttribute[];
      const pcData = this.data.data;
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
    // Map attribute data to a record format, ensuring all expected attributes are present.
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

  async validateStability() {
    if (this.data.type === K4ActorType.pc) {
      const {value, min, max} = this.data.data.stability;
      if (U.clampNum(value, [min, max]) !== value) {
        await this.update({"data.stability.value": U.clampNum(value, [min, max])});
      }
    }
  }

  async changeStability(delta: number) {
    if (delta && this.data.type === K4ActorType.pc) {
      const {value, min, max} = this.data.data.stability;
      if (U.clampNum(value + delta, [min, max]) !== value) {
        await this.update({"data.stability.value": U.clampNum(value + delta, [min, max])});
      }
    }
  }

  async addWound(type?: K4WoundType, description?: string) {
    if (this.data.type === K4ActorType.pc) {
      const woundData: K4Wound = {
        id:           `wound_${U.randString(10)}`,
        description:  description ?? "",
        isCritical:   type === K4WoundType.critical,
        isStabilized: false
      };
      kLog.log("Starting Wounds", U.objClone(this.data.data.wounds));
      await this.update({[`data.wounds.${woundData.id}`]: woundData});
      kLog.log("Updated Wounds", U.objClone(this.data.data.wounds));
    }
  }

  async toggleWound(id: string, toggleSwitch: "type"|"stabilized") {
    const woundData = this.wounds[id];
    if (woundData) {
      switch (toggleSwitch) {
        case "type": {
          await this.update({[`data.wounds.${id}.isCritical`]: !this.wounds[id].isCritical});
          return;
        }
        case "stabilized": {
          await this.update({[`data.wounds.${id}.isStabilized`]: !this.wounds[id].isStabilized});

        }
        // no default
      }
    }
  }

  async resetWoundName(id: string) {
    const woundData = this.wounds[id];
    if (woundData) {
      await this.update({[`data.wounds.${id}.description`]: ""});

    }
  }

  async removeWound(id: string) {
    if (this.data.type === K4ActorType.pc) {
      kLog.log("Starting Wounds", U.objClone(this.data.data.wounds));
      await this.update({[`data.wounds.-=${id}`]: null});
      kLog.log("Updated Wounds", this.data.data.wounds);
    }
  }

  parseModsToStrings(modData: K4ModTargets = this.flatModTargets): string[] {
    const returnStrings = [];
    for (const [modKey, modVal] of Object.entries(modData)) {
      returnStrings.push(`${U.signNum(modVal)} to ${modKey === "all" ? "all" : U.tCase(modKey)} rolls`);
    }
    return returnStrings;
  }

  get woundModData(): K4RollModData {
    const modData: K4RollModData = {
      category: "wound",
      display:  U.loc("trait.wounds"),
      targets:  {}
    };
    if (this.data.type === K4ActorType.pc) {
      const [unstabSerious, unstabCritical] = [
        Object.values(this.wounds).filter((wound) => !wound.isCritical && !wound.isStabilized).length,
        Object.values(this.wounds).filter((wound) => wound.isCritical && !wound.isStabilized).length
      ];
      if (unstabSerious && unstabCritical) {
        modData.targets = this.data.data.modifiers.wounds_seriouscritical[Math.min(
          unstabSerious,
          unstabCritical
        )];
      } else if (unstabCritical) {
        modData.targets = this.data.data.modifiers.wounds_critical[unstabCritical];
      } else if (unstabSerious) {
        modData.targets = this.data.data.modifiers.wounds_serious[unstabSerious];
      }
    }
    return modData;
  }
  get stabilityModData(): K4RollModData {
    const modData: K4RollModData = {
      category: "stability",
      display:  U.loc("trait.stability"),
      targets:  {}
    };
    if (this.data.type === K4ActorType.pc) {
      modData.targets = this.data.data.modifiers.stability[this.data.data.stability.value];
    }
    return modData;
  }
  get conditionModData(): K4RollModData[] {
    const modData: K4RollModData[] = [];

    return modData;
  }
  get effectModData(): K4RollModData[] {
    // const modData: K4RollModData[] = [];

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

    // return modData;
  }
  get modTargets(): K4RollModData[] {
    return [
      this.woundModData,
      this.stabilityModData,
      ...this.conditionModData,
      ...this.effectModData
    ];
  }
  get flatModTargets(): K4ModTargets {
    const flatTargets: K4ModTargets = {};
    this.modTargets.forEach(({targets}) => {
      for (const [modSource, modNum] of Object.entries(targets)) {
        flatTargets[modSource] ??= 0;
        flatTargets[modSource] += modNum;
      }
    });
    return flatTargets;
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

  public async trigger(rollSource: string) { await this.getItemByName(rollSource)?.displayItemSummary(); }

  async #parseItemRollSource(item: K4Item & K4RollSource, rollData: Partial<K4RollData>) {
    rollData.type = K4RollType.move;
    rollData.source = item;
    rollData.sourceType = item.masterType;
    rollData.sourceName = item.name;
    rollData.sourceImg = item.img ?? "";

    if ("attribute" in item.data.data) {
      if (item.data.data.attribute === K4Attribute.ask) {
        const attrResponse = await this.askForAttribute();
        if (!attrResponse) {
          return false; // User cancelled: Abort roll.
        }
        rollData.attribute = attrResponse;
      } else {
        rollData.attribute = item.data.data.attribute as K4RollableAttribute;
      }
      rollData.attrName = U.loc(`trait.${rollData.attribute}`);
      rollData.attrVal = rollData.attribute === K4Attribute.zero
        ? 0
        : this.attributes[rollData.attribute];
    }
    return true;
  }

  async #getRoll(rollSourceRef: string|K4RollSource|K4Attribute): Promise<{roll: Roll, rollData: K4RollData}|false> {

    let rollSource: K4RollSource|undefined;
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
      const item = this.getItemByName(rollSourceRef);
      if (item instanceof K4Item && item.isRollableItem()) {
        rollSource = item;
      }
    }

    if (!rollSource) { return false; }

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

  #applyRollModifiers(rollData: Omit<K4RollData, "modifiers">): K4RollData {
    function checkModTarget(target: string) {
      return ["all", rollData.sourceType, rollData.sourceName, rollData.attribute].includes(target);
    }
    function checkMod(modData: K4RollModData): K4RollMod | null {
      const mod: K4RollMod = {category: modData.category, display: modData.display, value: 0};
      for (const [target, value] of Object.entries(modData.targets)) {
        if (checkModTarget(target)) {
          mod.value += value;
        }
      }
      if (mod.value === 0) {
        return null;
      }
      return mod;
    }
    return {
      ...rollData,
      modifiers: [
        this.woundModData,
        this.stabilityModData,
        ...this.conditionModData,
        ...this.effectModData
      ]
        .map(checkMod)
        .filter((mod): mod is K4RollMod => mod !== null)
    };
  }

  async #displayRollResult(roll: Roll, rollData: K4RollData, options: K4RollOptions) {
    if (U.isUndefined(roll.total)) { return; }
    function isItem(ref: unknown): ref is K4RollableItem { return ref instanceof K4Item; }

    const template = await getTemplate(U.getTemplatePath("sidebar", "result-rolled"));
    const templateData: {
      cssClass: string,
      result?: ValueOf<ResultsData["results"]>,
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
      templateData.result = isItem(rollData.source) ? rollData.source.data.data.results.completeSuccess : {result: ""};
      cssClasses.push("roll-success");
    } else if (roll.total >= 9) {
      templateData.result = isItem(rollData.source) ? rollData.source.data.data.results.partialSuccess : {result: ""};
      cssClasses.push("roll-partial");
    } else {
      templateData.result = isItem(rollData.source) ? rollData.source.data.data.results.failure : {result: ""};
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
          const moveData = await pack.getDocument(move._id) as Maybe<K4ItemSpec<K4ItemType.move>>;
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
declare interface K4Actor {
  get id(): string;
  get name(): string;
}

export default K4Actor;