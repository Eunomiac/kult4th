// #region IMPORTS ~
import K4Item, {K4ItemType, K4ItemSubType} from "./K4Item.js";
import K4PCSheet from "./K4PCSheet.js";
import K4NPCSheet from "./K4NPCSheet.js";
import K4ChatMessage from "./K4ChatMessage.js";
import {K4RollResult} from "./K4Roll.js";
import C, {K4Attribute, Archetype} from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import {PACKS} from "../scripts/data.js";
// #endregion

// #REGION === TYPES, ENUMS, INTERFACE AUGMENTATION === ~
// #region -- ENUMS ~
enum K4ActorType {
  pc = "pc",
  npc = "npc"
}
enum K4RollType {
  zero = "zero",
  attribute = "attribute",
  move = "move"
}
enum K4WoundType {
  serious = "serious",
  critical = "critical",
  stableserious = "stableserious",
  stablecritical = "stablecritical"
}
// #endregion
// #region -- TYPES ~
declare global {
  type K4CharAttribute = Exclude<K4Attribute, K4Attribute.ask | K4Attribute.zero>;

  namespace K4Actor {

    export namespace Components {
      export interface Wound {
        id: IDString,
        description: string,
        isCritical: boolean,
        isStabilized: boolean;
      }
      export interface Base {
        description: string,
        wounds: Record<IDString, Wound>,
        penalties: Record<IDString, number>;
      }
    }

    /**
    * Describes the data structure as defined in template.json for each actor type
    */
    export namespace SourceSchema {
      export interface PC extends K4Actor.Components.Base {
        archetype: Archetype,
        history: string,
        dramaticHooks: [
          {
            value: string,
            isChecked: boolean;
          },
          {
            value: string,
            isChecked: boolean;
          }
        ],
        attributes: Record<K4CharAttribute, ValueMax>,
        modifiers: {
          wounds_serious: K4ModTargets[],
          wounds_critical: K4ModTargets[],
          wounds_seriouscritical: K4ModTargets[],
          stability: K4ModTargets[];
        },
        stability: {
          min: Integer,
          max: Integer,
          value: Integer;
        },
        edges: {
          sourceName: string,
          value: SmallInt;
        };
      }

      export interface NPC extends K4Actor.Components.Base { }
    }

    /**
     * Describes the functional .system property after derivation methods in K4Actor.
     */
    export namespace SystemSchema {
      export interface PC extends SourceSchema.PC {
        moves: Array<K4Item<K4ItemType.move>>;
        basicMoves: Array<K4Item<K4ItemType.move>>;
        derivedMoves: Array<K4Item<K4ItemType.move>>;
        activeEdges: Array<K4Item<K4ItemType.move>>;
        attacks: Array<K4Item<K4ItemType.attack>>;
        advantages: Array<K4Item<K4ItemType.advantage>>;
        disadvantages: Array<K4Item<K4ItemType.disadvantage>>;
        darkSecrets: Array<K4Item<K4ItemType.darksecret>>;
        weapons: Array<K4Item<K4ItemType.weapon>>;
        gear: Array<K4Item<K4ItemType.gear>>;
        relations: Array<K4Item<K4ItemType.relation>>;
        maxWounds: {
          serious: Integer,
          critical: Integer,
          total: Integer;
        };
        modifiersReport: string;
        stability: SourceSchema.PC["stability"] & {
          statusOptions: string[];
        };
        armor: Integer;
      }

      export interface NPC extends SourceSchema.NPC {
        moves: Array<K4Item<K4ItemType.move>>;
      }
      export type Any = PC | NPC;
    }

    /**
     * Discriminated union of all actor system schemas
     *  */
    export type System<T extends K4ActorType = K4ActorType> =
      T extends K4ActorType.pc ? SystemSchema.PC
      : T extends K4ActorType.npc ? SystemSchema.NPC
      : SystemSchema.Any;

    /**
     * The top-level schema for an Actor
     */
    export interface Schema<T extends K4ActorType = K4ActorType> {
      name: string,
      type: T,
      img: string,
      system: K4Actor.System<T>;
    }
  }
}
// #endregion
// #region -- AUGMENTED INTERFACE ~
interface K4Actor<Type extends K4ActorType = K4ActorType> {
  get id(): IDString;
  get name(): string;
  get type(): Type;
  get sheet(): Actor["sheet"] & (Type extends K4ActorType.pc ? K4PCSheet : K4NPCSheet);
  get items(): Actor["items"] & Collection<K4Item>;
  system: K4Actor.System<Type>;
}
// #ENDREGION
// #ENDREGION

// #REGION === K4ACTOR CLASS ===
class K4Actor extends Actor {
  // #region INITIALIZATION ~
  /**
   * Pre-Initialization of the K4Actor class. This method should be run during the "init" hook.
   *
   * - Registers the K4Actor class as the system's Actor document class.
   * - Customizes the sidebar icon for the Actor directory
   *
   * @returns {Promise<void>} A promise that resolves when the hook is registered.
   */
  static async PreInitialize(): Promise<void> {

    // Register K4Actor as the system's Actor document class
    CONFIG.Actor.documentClass = this;

    // Customize the sidebar icon for the Actor directory
    CONFIG.Actor.sidebarIcon = "fa-regular fa-people-group";
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
   * Retrieves items by their source ID.
   * @param {string} sourceID - The source ID of the items.
   * @returns {K4SubItem[]} An array of sub-items with the specified source ID.
   */
  getItemsBySource(sourceID: string): Array<K4Item & K4SubItem> {
    return this.items.filter((item: K4Item): item is K4Item & K4SubItem => {
      if (!("parentItem" in item.system)) {return false;}
      const {parentItem} = item.system;
      return item.isSubItem() && parentItem?.id === sourceID;
    });
  }

  /**
   * Retrieves items by a variety of filters.
   * If any item is found with a name or id that matches the filter string, it is returned alone as a 'perfect match'.
   * Otherwise, all items matching the type, subType, or id of the parent item are returned in an array.
   *
   * @param {K4ItemType} [type] - The type of items to filter. If not provided, all items are considered.
   * @param {string} filter - The filter to apply to the items.
   * @returns {K4Item[]} - An array of matching items.
   */
  getItemsByFilter(filter: string): Array<K4Item>;
  getItemsByFilter<Type extends K4ItemType>(type: Type, filter: string): Array<K4Item<Type>>;
  getItemsByFilter<Type extends K4ItemType>(arg1: Type | string, arg2?: string): Array<K4Item | K4Item<Type>> {
    /**
     * Filters items based on a provided filter string.
     *
     * @param {string} filterString - The filter string to match against item properties.
     * @param {K4Item[]} itemPool - The pool of items to filter.
     * @returns {K4Item[]} - An array of matched items. If no matches are found, an empty array is returned.
     */
    function filterItems(filterString: string, itemPool: K4Item[]): K4Item[] {
      const filteredItems: K4Item[] = [];
      for (const item of itemPool) {
        if ([
          item.name,
          item.id
        ].includes(filterString)) {
          return [item];
        }
        if ([
          item.type,
          item.system.subType,
          item.parentID ?? ""
        ].includes(filterString)) {
          filteredItems.push(item);
        }
      };
      return filteredItems;
    }

    return filterItems(
      arg2 ?? arg1,
      arg2 ? this.getItemsOfType(arg1 as Type) : [...this.items]
    );
  }

  async createBasicMoves() {
    if (this.basicMoves.length) {return;}
    // Create the basic moves for the character
    await this.createEmbeddedDocuments("Item", PACKS.basicPlayerMoves);
  }

  get moves() {return this.getItemsOfType(K4ItemType.move);}
  get basicMoves() {return this.moves.filter((move) => move.isBasicMove());}
  get derivedMoves() {return this.moves.filter((move): move is K4Item<K4ItemType.move> & K4SubItem<K4ItemType.move> => move.isSubItem() && !move.isEdge());}
  get derivedEdges() {return this.moves.filter((move): move is K4Item<K4ItemType.move> & K4SubItem<K4ItemType.move> => move.isEdge());}
  get activeEdges() {
    if (!this.is(K4ActorType.pc)) {return [];}
    if (!this.system.edges.sourceName) {return [];}
    if (!this.system.edges.value) {return [];}
    return this.derivedEdges
      .filter((edge): this is K4Actor<K4ActorType.pc> => edge.system.parentItem.name === this.system.edges.sourceName);
  }
  get attacks() {return this.getItemsOfType(K4ItemType.attack);}
  get basicAttacks() {return this.attacks.filter((attack) => !attack.isSubItem());}
  get derivedAttacks() {return this.attacks.filter((attack): attack is K4Item<K4ItemType.attack> & K4SubItem<K4ItemType.attack> => attack.isSubItem());}
  get advantages() {return this.getItemsOfType(K4ItemType.advantage);}
  get disadvantages() {return this.getItemsOfType(K4ItemType.disadvantage);}
  get darkSecrets() {return this.getItemsOfType(K4ItemType.darksecret);}
  get weapons() {return this.getItemsOfType(K4ItemType.weapon);}
  get gear() {return this.getItemsOfType(K4ItemType.gear);}
  get relations() {return this.getItemsOfType(K4ItemType.relation);}
  get derivedItems() {return [...this.items].filter((item: K4Item): item is K4Item & K4SubItem => item.isSubItem());}
  get wounds(): Record<IDString, K4Actor.Components.Wound> {
    return this.system.wounds;
  }
  get wounds_serious() {return Object.values(this.wounds).filter((wound) => !wound.isCritical);}
  get wounds_critical() {return Object.values(this.wounds).filter((wound) => wound.isCritical);}
  get wounds_serious_unstabilized() {return this.wounds_serious.filter((wound) => !wound.isStabilized);}
  get wounds_critical_unstabilized() {return this.wounds_critical.filter((wound) => !wound.isStabilized);}
  get wounds_serious_stabilized() {return this.wounds_serious.filter((wound) => wound.isStabilized);}
  get wounds_critical_stabilized() {return this.wounds_critical.filter((wound) => wound.isStabilized);}
  get woundStrips(): HoverStripData[] {
    return Object.values(this.wounds).map((wound) => {
      const stripData: Partial<HoverStripData> = {
        id: wound.id,
        icon: "systems/kult4th/assets/icons/wounds/",
        type: [
          wound.isStabilized ? "stable" : "",
          wound.isCritical ? "critical" : "serious"
        ].join("") as K4WoundType,
        display: wound.description ?? "",
        // isGlowing:    (wound.isCritical && !wound.isStabilized) ? "red" : false,
        stripClasses: ["wound-strip"],
        dataTarget: `system.wounds.${wound.id}.description`,
        placeholder: "(description)  ",
        buttons: [
          {
            icon: wound.isCritical ? "wound-critical" : "wound-serious",
            dataset: {
              target: wound.id,
              action: "toggle-wound-type"
            },
            tooltip: wound.isCritical ? "CRITICAL" : "SERIOUS"
          },
          {
            icon: "data-retrieval",
            dataset: {
              target: wound.id,
              action: "reset-wound-name"
            },
            tooltip: "EDIT"
          },
          {
            icon: "wound-serious-stabilized",
            dataset: {
              target: wound.id,
              action: "toggle-wound-stabilize"
            },
            tooltip: wound.isStabilized ? "STABLE" : "STABILIZE"
          },
          {
            icon: "hinder-other",
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
      const pcData: K4Actor.System<K4ActorType.pc> = this.system;
      return attrList.map((attrName) => ({
        name: U.tCase(attrName),
        key: attrName,
        min: pcData.attributes[attrName].min,
        max: pcData.attributes[attrName].max,
        value: pcData.attributes[attrName].value
      }));
    }
    return [];
  }
  /**
 * Retrieves wound modifier data.
 * @returns {K4RollModData} The wound modifier data.
 */
  get woundModData(): K4RollModData {
    const modData: K4RollModData = {
      category: "wound",
      display: U.loc("trait.wounds"),
      targets: {}
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
      display: U.loc("trait.stability"),
      targets: {}
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
        display: "Test Effect One",
        targets: {"Keep It Together": 2}
      },
      {
        category: "effect",
        display: "Test Effect Two",
        targets: {move: 4}
      },
      {
        category: "effect",
        display: "Test Effect Three",
        targets: {[K4Attribute.willpower]: -1}
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
  // #endregion

  // #region Stability & Wounds ~
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
      const woundData: K4Actor.Components.Wound = {
        id: U.getID(),
        description: description ?? "",
        isCritical: type === K4WoundType.critical,
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
            ui.notifications?.error(`${this.name} has already suffered ${U.verbalizeNum(this.wounds_serious.length)} serious wounds and a critical wound: They can withstand no further injury.`);
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
  // #endregion

  // #region EDGES ~
  async updateEdges(edges: PosInteger, source?: K4Item) {
    if (!this.is(K4ActorType.pc)) { return; }
    const sourceName = source ? source.parentName : this.system.edges.sourceName;
    if (this.sheet.rendered) {
      const html = this.sheet.element;
      await new Promise((resolve) => {
        gsap.to(
          html.find(".edges-blade-container svg"),
          {autoAlpha: 1, rotation: 175 + (20 * edges), duration: 1.5, ease: "back", onComplete: resolve}
        );
        if (edges === 0) {
          gsap.to(html.find(".edges-header"), {autoAlpha: 0, duration: 1});
          gsap.to(html.find(".edges-count"), {autoAlpha: 0, duration: 1});
          gsap.to(html.find(".edges-source"), {autoAlpha: 0, duration: 1});
          gsap.to(html.find(".edges .hover-strip"), {autoAlpha: 0, duration: 1});
          gsap.to(html.find(".edges-blade-container"), {autoAlpha: 0, duration: 1});
        }
      });
    }
    await this.update({
      "system.edges.sourceName": sourceName,
      "system.edges.value": edges
    });
  }
  async spendEdge() {
    if (!this.is(K4ActorType.pc) || !this.system.edges.value) {return;}
    await this.updateEdges(this.system.edges.value - 1 as PosInteger);
  }
  async gainEdge() {
    if (!this.is(K4ActorType.pc) || !this.system.edges.sourceName) {return;}
    await this.updateEdges(this.system.edges.value + 1 as PosInteger);
  }
  async clearEdges(): Promise<void> {
    if (!this.is(K4ActorType.pc)) {return;}
    await this.updateEdges(0 as PosInteger);
  }
  // #endregion

  /**
   * Deletes an item by its name.
   * @param {string} iName - The name of the item.
   * @returns {Promise<void>} A promise that resolves when the item is deleted.
   */
  async dropItemByName(iName: string) {
    return [...this.items].find((item: K4Item): item is K4Item => item.name === iName)?.delete();
  }
  // #region -- ROLLS --
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
    const userOutput = await new Promise<{attribute: K4RollableAttribute;}>((resolve) => {
      new Dialog(
        {
          title: "Attribute Selection",
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
  /**
   * Prompts the user to select a value for incoming Harm.
   * @param {string | undefined} message - Optional message to display in the dialog.
   * @returns {Promise<K4RollableAttribute | null>} The selected Harm value or null if no selection is made.
   */
    async askForHarm(message?: string): Promise<number | null> {
      const template = await getTemplate(U.getTemplatePath("dialog", "ask-for-attribute"));
      const content = template({
        id: this.id,
        message
      });
      const userOutput = await new Promise<{harm: number;}>((resolve) => {
        new Dialog(
          {
            title: "Incoming Harm",
            content,
            default: "0",
            buttons: C.HarmButtons(resolve)
          },
          {
            classes: [C.SYSTEM_ID, "dialog", "harm-selection"]
          }
        ).render(true);
      });
      if (U.isNumString(String(userOutput.harm))) {
        return Number(userOutput.harm);
      }
      return null;
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
  async #parseItemRollSource(item: K4Item & K4RollSource, rollData: Partial<K4RollData>) {
    rollData.type = K4RollType.move;
    rollData.source = item;
    rollData.sourceType = item.parentType;
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

  async #getRollData(rollSourceRef: string | K4RollSource | K4Attribute): Promise<{roll: Roll, rollData: K4RollData;} | false> {

    let rollSource: K4RollSource | undefined;
    const rollData: Partial<K4RollData> = {};

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
      rollSource = rollSourceRef as K4RollableAttribute;
    } else if (typeof rollSourceRef === "string") {
      const item = this.getMoveByName(rollSourceRef);
      if (item instanceof K4Item && item.isActiveItem()) {
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

  #checkMod(modData: K4RollModData, rollData: Omit<K4RollData, "modifiers">): Maybe<K4RollMod> {
    const mod: K4RollMod = {category: modData.category, display: modData.display, value: 0};
    for (const [target, value] of Object.entries(modData.targets)) {
      if (this.#checkModTarget(target, rollData)) {
        mod.value += value;
      }
    }
    if (mod.value === 0) {
      return undefined;
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
        .filter((mod): mod is K4RollMod => mod !== undefined)
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

  #getRollResultData(roll: Roll, rollData: K4RollData): ValueOf<K4Item.Components.ResultsData["results"]> {
    const {source} = rollData;
    if (!(source instanceof K4Item) || source.system.subType !== K4ItemSubType.activeRolled) {
      throw new Error(`Invalid source for roll result data: ${source}`);
    }
    const {results} = source.system;
    if (!results) {
      throw new Error(`No results data found for source: ${source.name}`);
    }
    return results[this.#getRollResult(roll)!];
  }

  async #displayRollResult(roll: Roll, rollData: K4RollData, options: Partial<K4RollOptions>) {
    if (U.isUndefined(roll.total)) {return;}
    let themeClass: string;
    const template = await getTemplate(U.getTemplatePath("sidebar", "result-rolled"));
    const templateData: {
      cssClass: string,
      result?: ValueOf<K4Item.Components.ResultsData["results"]>,
      dice: [number, number],
      total: number,
      rollData: K4RollData,
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
      speaker: K4ChatMessage.getSpeaker(),
      flags: {
        kult4th: {
          cssClasses: [themeClass]
        }
      }
    });
  }
  public async roll(rollSource: string, options: Partial<K4RollOptions> = {}) {
    const {roll, rollData} = await this.#getRollData(rollSource) || {};
    if (!roll || !rollData) {return;}
    await roll.evaluate({async: true});
    if (U.isUndefined(roll.total)) {return;}

    const rollPromises: Promise<void>[] = [];
    if (game.dice3d) {
      rollPromises.push(game.dice3d.showForRoll(roll));
    }
    rollPromises.push(this.#displayRollResult(roll, rollData, options));

    const rollResultData = this.#getRollResultData(roll, rollData);
    if (rollResultData?.edges && rollData.source instanceof K4Item) {
      rollPromises.push(this.updateEdges(rollResultData.edges, rollData.source));
    }
  }

  // #endregion
  public async trigger(rollSource: string) {
    const item = this.getItemByName(rollSource);
    if (!item) {
      throw new Error(`No item found with name '${rollSource}'`);
    }
    if (item.isEdge()) {
      this.spendEdge();
    }
    await item.triggerItem();
  }

  // #region EDGES: Enabling, Triggering, Disabling ~

  // #endregion

  // #region OVERRIDES: _onCreate, prepareData, _onDelete ~
  /**
 * Prepares data specific to player characters.
 */
  preparePCData() {
    if (this.is(K4ActorType.pc)) {
      this.system.moves = this.moves;
      this.system.basicMoves = this.basicMoves;
      this.system.derivedMoves = this.derivedMoves;
      this.system.activeEdges = this.activeEdges;
      this.system.attacks = this.attacks;
      this.system.advantages = this.advantages;
      this.system.disadvantages = this.disadvantages;
      this.system.darkSecrets = this.darkSecrets;
      this.system.weapons = this.weapons;
      this.system.gear = this.gear;
      this.system.relations = this.relations;

      this.system.maxWounds = {
        serious: this.system.modifiers.wounds_serious.length as Integer,
        critical: this.system.modifiers.wounds_critical.length as Integer,
        total: (this.system.modifiers.wounds_serious.length + this.system.modifiers.wounds_critical.length) as Integer
      };
      this.system.modifiersReport = this.buildModifierReport(this.flatModTargets);
      this.system.armor = this.gear.reduce((acc, gear) => acc + gear.system.armor, 0) as Integer;

      // this.validateStability();
    }
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

  async _onEndScene() {
    await this.update({
      // Clear all edges
      "system.edges.sourceName": "",
      "system.edges.value": 0
    });
  }

  override async _onCreate(...params: Parameters<Actor["_onCreate"]>) {
    await super._onCreate(...params);
    if (this.type !== K4ActorType.pc) {return;}

    // Set the default tab for the character sheet
    this.setFlag("kult4th", "sheetTab", "front");

    // Create the basic moves for the character
    await this.createEmbeddedDocuments("Item", PACKS.basicPlayerMoves);

    // Register a custom end-of-scene hook
    Hooks.on("endScene", this._onEndScene.bind(this));
  }

  /**
   * Overrides the update method to handle a closing animation that should not be interrupted.
   * If closing animation provided, and sheet is rendered, update will proceed silently and sheet
   * will be rerendered once the animation completes.
   *  - as options.updateAnim   *
   **/
  override async update(data: Record<string, unknown>, options: DocumentModificationContext & {updateAnim?: GsapAnimation} = {}): Promise<Maybe<this>> {

    const {updateAnim, ...updateOptions} = options;
    if (updateAnim && this.sheet.rendered) {
      let updatePromise = super.update(data, {
        ...updateOptions,
        render: false
      });
      await Promise.all([
        updatePromise,
        new Promise(resolve => updateAnim.then(resolve))
      ]);
      this.sheet.render();
      return updatePromise;
    }
    return super.update(data, updateOptions);
  }
  // #endregion
}
// #ENDREGION

// #region EXPORTS ~
export default K4Actor;

export {
  K4ActorType,
  K4RollType,
  K4WoundType
};
// #endregion