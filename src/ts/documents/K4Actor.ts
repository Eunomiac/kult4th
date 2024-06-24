// #region IMPORTS ~
import K4Item, {K4ItemType, K4ItemSubType} from "./K4Item.js";
import K4PCSheet from "./K4PCSheet.js";
import K4NPCSheet from "./K4NPCSheet.js";
import K4ChatMessage from "./K4ChatMessage.js";
import {K4RollResult} from "./K4Roll.js";
import K4ActiveEffect, {K4Change} from "./K4ActiveEffect.js";
import C, {K4Attribute, Archetype, K4Stability} from "../scripts/constants.js";
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
          wounds_serious: K4Roll.ModDefinition[],
          wounds_critical: K4Roll.ModDefinition[],
          wounds_seriouscritical: K4Roll.ModDefinition[],
          stability: K4Roll.ModDefinition[];
        },
        stability: {
          min: number,
          max: number,
          value: number;
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
        advantages: Array<K4Item<K4ItemType.advantage>>;
        disadvantages: Array<K4Item<K4ItemType.disadvantage>>;
        darkSecrets: Array<K4Item<K4ItemType.darksecret>>;
        weapons: Array<K4Item<K4ItemType.weapon>>;
        gear: Array<K4Item<K4ItemType.gear>>;
        relations: Array<K4Item<K4ItemType.relation>>;
        maxWounds: {
          serious: number,
          critical: number,
          total: number;
        };
        modifiersReport: string;
        toggleControlStrip: string;
        stability: SourceSchema.PC["stability"] & {
          statusOptions: string[];
        };
        armor: number;
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
  /**
   * Initialization of a K4Actor instance. This method should be run during the actor's "_onCreate" method.
   *
   * - Creates the basic player move items for the character.
   * - Creates the singleton "Wounds" and "Stability" K4ActiveEffects.
   */
  async initMovesAndEffects() {
    if (this.basicMoves.length) {return;}
    // Create the basic moves for the character
    await this.createEmbeddedDocuments("Item", PACKS.basicPlayerMoves);
    // Create the singleton "Wounds" and "Stability" K4ActiveEffects
    await this.createEmbeddedDocuments("ActiveEffect", [
      {
        label: "Wounds",
        icon: "systems/kult4th/assets/icons/wounds/wound-serious.svg",
        origin: this.uuid,
        changes: [
          {
            key: "ApplyWounds",
            mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
            value: "value:wounds"
          }
        ]
      },
      {
        label: "Stability",
        icon: "systems/kult4th/assets/icons/stability.svg",
        origin: this.uuid,
        changes: [
          {
            key: "ApplyStability",
            mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
            value: "value:stability"
          }
        ]
      }
    ]);
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

  // #region GETTERS ~
  // #region -- Embedded Item Search & Retrieval Methods ~

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
  // #endregion
  get moves() {
    return this.getItemsOfType(K4ItemType.move)
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  get basicMoves() {
    return this.moves
      .filter((move) => move.isBasicMove());
  }
  get derivedMoves() {
    return this.moves
      .filter((move): move is K4Item<K4ItemType.move> & K4SubItem => move.isSubItem())
      .filter((subItem) => !subItem.isEdge());
  }
  get derivedEdges() {return this.moves.filter((move): move is K4Item<K4ItemType.move> & K4SubItem => move.isEdge());}
  get activeEdges() {
    if (!this.is(K4ActorType.pc)) {return [];}
    if (!this.system.edges.sourceName) {return [];}
    if (!this.system.edges.value) {return [];}
    return this.derivedEdges
      .filter((edge): this is K4Actor<K4ActorType.pc> => edge.system.parentItem.name === this.system.edges.sourceName);
  }
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
  get woundRollChanges(): K4Change[] {
    if (!this.is(K4ActorType.pc)) { return []; }
    const numSerious = this.wounds_serious_unstabilized.length;
    const numCritical = this.wounds_critical_unstabilized.length;
    const numBoth = Math.min(numSerious, numCritical);
    const modDefs = Object.entries({
      ...this.system.modifiers.wounds_seriouscritical[numBoth],
      ...this.system.modifiers.wounds_serious[numSerious],
      ...this.system.modifiers.wounds_critical[numCritical]
    });

    return modDefs.map(([key, value]) => (new K4Change({
      key: "ModifyRoll",
      mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
      value: `filter:${key},effect:Add,value:${value},duration:ongoing,defaultState:true,canToggle:true,icon:systems/kult4th/assets/icons/wounds/wound-${numCritical ? "critical" : "serious"}.svg,shortLabel:Wounds`,
      priority: undefined
    })));
  }
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
            icon: "data-retrieval",
            dataset: {
              target: wound.id,
              action: "reset-wound-name"
            },
            tooltip: "RENAME"
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
            icon: "hover-strip-button-drop",
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
  get stability() {
    if (!this.is(K4ActorType.pc)) { return 0; }
    const pcData: K4Actor.System<K4ActorType.pc> = this.system;
    return pcData.stability.value;
  }
  get stabilityLevel(): K4Stability {
    /**
     * @todo Replace this with customizable stability levels in settings, and/or variant stability rule
     */
    if (!this.is(K4ActorType.pc)) { return K4Stability.composed; }
    return [
      K4Stability.broken,
      K4Stability.critical,
      K4Stability.critical,
      K4Stability.critical,
      K4Stability.critical,
      K4Stability.serious,
      K4Stability.serious,
      K4Stability.serious,
      K4Stability.moderate,
      K4Stability.moderate,
      K4Stability.composed
    ][this.stability];
  }
  get stabilityRollChanges(): K4Change[] {
    if (!this.is(K4ActorType.pc)) { return []; }
    const modDefs = Object.entries(this.system.modifiers.stability[this.stability]);
    return modDefs.map(([key, value]) => (new K4Change({
      key: "ModifyRoll", // D:\Projects\.CODING\FoundryVTT\FoundryV10DevData\Data\systems\kult4th\public\assets\icons\stability
      mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
      value: `filter:${key},effect:Add,value:${value},duration:ongoing,defaultState:true,canToggle:true,icon:systems/kult4th/assets/icons/stability/stability-${this.stabilityLevel}.svg,shortLabel:Stability`,
      priority: undefined
    })));
  }
   /* filter
      Also add pulse animations to teh roll result chat message -- "Violence" and attrflare should pulse, then name, then dice staggered
      */
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

  // #region STABILITY & WOUNDS ~
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
      // If the wound is serious, check if the actor has more than the maximum number of allowed serious wounds
      if (!woundData.isCritical && this.wounds_serious.length >= this.system.maxWounds.serious) {
        // If the actor has reached the limit for serious wounds, upgrade the wound to critical
        woundData.isCritical = true;
        isWoundUpgrading = true;
      }
      // If critical, check if actor already has a critical wound; if so, reject the wound and alert the players
      if (woundData.isCritical) {
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
  async updateEdges(edges: number, source?: K4Item) {
    if (!this.is(K4ActorType.pc)) {return;}
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
    await this.updateEdges(this.system.edges.value - 1 as number);
  }
  async gainEdge() {
    if (!this.is(K4ActorType.pc) || !this.system.edges.sourceName) {return;}
    await this.updateEdges(this.system.edges.value + 1 as number);
  }
  async clearEdges(): Promise<void> {
    if (!this.is(K4ActorType.pc)) {return;}
    await this.updateEdges(0 as number);
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
   * @returns {Promise<K4Roll.RollableAttribute | null>} The selected attribute or null if no selection is made.
   */
  async askForAttribute(message?: string): Promise<K4Roll.RollableAttribute | null> {
    const template = await getTemplate(U.getTemplatePath("dialog", "ask-for-attribute"));
    const content = template({
      id: this.id,
      message
    });
    const userOutput = await new Promise<{attribute: K4Roll.RollableAttribute;}>((resolve) => {
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

  // #endregion
  public async roll(rollSource: string) {
    const item = this.getItemByName(rollSource);
    if (!item) {
      throw new Error(`No item found with name '${rollSource}'`);
    }
    await item.rollItem();
  }
  public async trigger(rollSource: string) {
    const item = this.getItemByName(rollSource);
    if (!item) {
      throw new Error(`No item found with name '${rollSource}'`);
    }
    await item.triggerItem();
  }

  // #region EDGES: Enabling, Triggering, Disabling ~

  // #endregion

  // #region OVERRIDES: _onCreate, prepareData, _onDelete ~
  get enabledEffects(): K4ActiveEffect[] {
    return Array.from(this.effects as Collection<K4ActiveEffect>)
      .filter((effect) => !effect.disabled);
  }
  get customChanges() {
    return [
      ...this.enabledEffects.map((effect) => effect.getCustomChanges()).flat(),
      ...this.woundRollChanges,
      ...this.stabilityRollChanges
    ];
  }
  get enabledCustomChanges() {
    return this.customChanges.filter((change) => change.isEnabled);
  }
  get promptForDataChanges() {
    return this.enabledCustomChanges.filter((change) => change.isPromptOnCreate);
  }
  get requireItemChanges() {
    return this.enabledCustomChanges.filter((change) => change.isRequireItemCheck);
  }
  get systemChanges() {
    return this.enabledCustomChanges.filter((change) => change.isSystemModifier);
  }
  get modifyRollChanges() {
    return this.enabledCustomChanges.filter((change) => change.isRollModifier());
  }
  get statusBarChanges() {
    return this.modifyRollChanges.filter((change) => change.isInStatusBar());
  }
  get toggleableChanges() {
    return this.customChanges.filter((change) => change.canToggle);
  }

  /**
   * Iterates over all active roll modifiers with numeric values and combines them as concisely as possible into a list for display on the actor's sheet, sorted with the most specific modifiers first.
   *
   * e.g. Given an array of the following modifiers:
   * [
   *  {filter: "all", value: 2},
   *  {filter: "advantage", value: 1},
   *  {filter: "disadvantage", value: -1},
   *  {filter: "Keep It Together", value: 3},
   *  {filter: "Involuntary Medium", value: 2},
   *  {filter: "Engage In Combat", value: -2}
   * ];
   * ... and, knowing that:
   * - "Keep It Together" and "Engage in Combat" are a basic moves
   * - "Involuntary Medium" is a disadvantage move
   *
   * the method would return:
   * [
   *   {display: "Keep It Together", value: 5}, (all + Keep It Together)
   *   {display: "Involuntary Medium", value: 3}, (all + disadvantage + Involuntary Medium)
   *   {display: "Other Disadvantages", value: -1}, (all + disadvantage) ('other', to indicate this has already been accounted for in the 'Involuntary Medium' disadvantage total)
   *   {display: "Advantages", value: 3}, (all + advantage) (no 'other', since there are no more-specific Advantage modifiers in the list)
   *   {display: "All Other Rolls", value: 2} (all)
   * ]
   * (Note that it does NOT include "Engage in Combat", as when combined with "all", its modifier sums to zero.)
   */
  collapseRollModifiers() {

    const collapsedModifierData: Array<{
      display: string,
      value: number,
      othering?: Array<"all"|K4ItemType.advantage|K4ItemType.disadvantage>,
      category?: K4ItemType.move|K4ItemType.advantage|K4ItemType.disadvantage}
    > = [];


    const categoryVals = {
      all: 0,
      [K4ItemType.advantage]: 0,
      [K4ItemType.disadvantage]: 0
    };
    const statusBarVals = this.statusBarChanges
      .map((change) => ({
        filter: change.filter,
        value: change.finalValue as number
      }));

    // Sort filterVals by specificity: specific move names first, then categories, then "all"
    statusBarVals.sort((a, b) => {
      if (a.filter === "all") return 1;
      if (b.filter === "all") return -1;
      if (a.filter === K4ItemType.advantage || a.filter === K4ItemType.disadvantage) return 1;
      if (b.filter === K4ItemType.advantage || b.filter === K4ItemType.disadvantage) return -1;
      return 0;
    }).reverse();

    kLog.log("[collapseRollModifiers] Status Bar Vals", U.objClone(statusBarVals));

    // Helper function to add or update the collapsed data
    const addOrUpdate = (
      display: string,
      value: number,
      othering?: Array<"all"|K4ItemType.advantage|K4ItemType.disadvantage>,
      category?: K4ItemType.move|K4ItemType.advantage|K4ItemType.disadvantage
    ) => {
      const existing = collapsedModifierData.find((mod) => mod.display === display);
      if (existing) {
        existing.value += value;
      } else {
        collapsedModifierData.push({display, value, othering, category});
      }
    };

    // Iterate over the filter values and combine them
    statusBarVals.forEach(({filter, value}) => {
      switch (filter) {
        case "all": {
          categoryVals.all += value;
          addOrUpdate("Any Roll", value);
          break;
        }
        case K4ItemType.advantage: {
          value += categoryVals.all;
          categoryVals.advantage = value;
          addOrUpdate("Any Advantage Roll", value, ["all"]);
          break;
        }
        case K4ItemType.disadvantage: {
          value += categoryVals.all;
          categoryVals.disadvantage += value;
          addOrUpdate("Any Disadvantage Roll", value, ["all"]);
          break;
        }
        default: {
          const move = this.getItemByName(filter);
          if (!move) {
            // throw new Error(`Unrecognized filter value: '${filter}'`);
            break;
          }
          const othering: Array<"all"|K4ItemType.advantage|K4ItemType.disadvantage> = ["all"];
          const category = move.isSubItem() ? move.parentType as K4ItemType.advantage|K4ItemType.disadvantage : move.type;
          if ([K4ItemType.advantage, K4ItemType.disadvantage].includes(category)) {
            othering.push(category as K4ItemType.advantage|K4ItemType.disadvantage);
            value += categoryVals[category as K4ItemType.advantage|K4ItemType.disadvantage];
          } else {
            value += categoryVals.all;
          }
          addOrUpdate(filter, value, othering, category as K4ItemType.advantage|K4ItemType.disadvantage);
          break;
        }
      }
    });

    kLog.log("[collapseRollModifiers] Initial Combination Pass", {
      categoryVals: U.objClone(categoryVals),
      collapsedModifierData: U.objClone(collapsedModifierData)
    });

    // Filter out any '0' values from the collapsed data
    const filteredModifierData = collapsedModifierData.filter(({value}) => value !== 0);

    kLog.log("[collapseRollModifiers] Filtering Out Zeroes", U.objClone(filteredModifierData));

    // Adjust the display names to include "Other" where necessary
    if (filteredModifierData.some(({othering}) => othering?.includes("all"))) {
      const allMod = filteredModifierData.find((mod) => mod.display === "Any Roll");
      if (allMod) {
        allMod.display = "Any Other Roll";
      }
    }
    if (filteredModifierData.some(({othering}) => othering?.includes(K4ItemType.advantage))) {
      const advMod = filteredModifierData.find((mod) => mod.display.includes("Advantage"));
      if (advMod) {
        advMod.display = "Any Other Advantage Roll";
      }
    }
    if (filteredModifierData.some(({othering}) => othering?.includes(K4ItemType.disadvantage))) {
      const disMod = filteredModifierData.find((mod) => mod.display.includes("Disadvantage"));
      if (disMod) {
        disMod.display = "Any Other Disadvantage Roll";
      }
    }

    kLog.log("[collapseRollModifiers] Othering Pass", U.objClone(filteredModifierData));

    /** Sort the collapsed and filtered modifier data as follows:
     *
     * - Specific non-advantage, non-disadvantage moves
     * - Specific advantage moves
     * - "Advantages"/"Other Advantages" general modifier
     * - Specific disadvantage moves
     * - "Disadvantages"/"Other Disadvantages" general modifier
     * - "All Rolls"/"All Other Rolls" general modifier
     */
    const moveModifierData = filteredModifierData.filter(({display}) => !/^(Advantages$|Disadvantages$|^All.*Rolls$)/.test(display));
    const sortedModifierData = [
      ...moveModifierData.filter(({category}) => category === K4ItemType.move),
      ...moveModifierData.filter(({category}) => category === K4ItemType.advantage),
      filteredModifierData.find(({display}) => display.endsWith("Advantage Roll")),
      ...moveModifierData.filter(({category}) => category === K4ItemType.disadvantage),
      filteredModifierData.find(({display}) => display.endsWith("Disadvantage Roll")),
      filteredModifierData.find(({display}) => /^Any\s*(Other)?\s*Roll/.test(display))
    ].filter(U.isDefined);

    kLog.log("[collapseRollModifiers] Collapsed Modifier Data", {moveModifierData, sortedModifierData});

    return sortedModifierData;
  }

  /**
   * Builds an HTML summary of all modifiers currently applied to the actor for display on their sheet.
   * @returns {string} The modifier report HTML
   */
  buildModifierReport() {
    const returnStrings = [];
    for (const {display, value} of this.collapseRollModifiers()) {
      if (value < 0) {
        returnStrings.push(`<span class="k4-theme-red"><strong>${value}</strong> to <strong>${display}</strong></span>`);
      } else {
        returnStrings.push(`<span class="k4-theme-gold"><strong>+${value}</strong> to <strong>${display}</strong></span>`);
      }
    }
    return `<span class="modifiers-report">${returnStrings.join("<span class='k4-theme-black no-flex'>&#9670;</span>")}</span>`;
  }

  /**
   * Builds the strip of buttons for controlling toggleable roll modifiers.
   * @returns {string} The HTML for the toggleable modifier strip.
   */
  buildToggleControlStrip() {

    let hasAddedStabilityToggle = false;
    let hasAddedWoundsToggle = false;

    return `<div class="toggle-modifier-strip">${
        this.toggleableChanges.map((change) => {
          let className: string;
          let icon: string;
          let value: string = String(change.finalValue);
          const valueClass = change.finalValue as number >= 0 ? "neon-glow-soft-blue" : "neon-glow-soft-red";
          const buttonClass = change.finalValue as number >= 0 ? "pos-mod" : "neg-mod";

          const label = String(change.customFunctionData.shortLabel);
          if (label === "Stability") {
            if (hasAddedStabilityToggle) { return ""; }
            hasAddedStabilityToggle = true;
            value = "";
            className = "stability-modifier";
            icon = `systems/kult4th/assets/icons/stability/stability-${this.stabilityLevel}.svg`;
          } else if (label === "Wounds") {
            if (hasAddedWoundsToggle) { return ""; }
            hasAddedWoundsToggle = true;
            value = "";
            className = "wound-modifier";
            icon = `systems/kult4th/assets/icons/wounds/wound-serious.svg`;
          } else {
            className = `${change.originItem?.parentType}-modifier`;
            icon = change.icon;
            value = `${change.finalValue as number >= 0 ? "+" : ""}${change.finalValue}`;
          }
          if (value === "") {
            className += " no-value";
          }

          return `<div class="toggle-modifier ${className}">
                <button class="toggle-modifier-button ${buttonClass}" data-target="${change.id}" data-action="toggle-change" data-state="${change.isEnabled ? "enabled" : "disabled"}">
                  <span class="toggle-modifier-label">
                    <span class="toggle-modifier-name">${label}</span>
                    <span class="toggle-modifier-value ${valueClass}">${value}</span>
                  </span>
                  <div class="icon-container">
                    <div class="icon-mask" style="mask:url(${icon}) no-repeat center;-webkit-mask:url(${icon}) no-repeat center;"></div>
                  </div>
                </button>
                <span class="tooltip toggle-modifier-tooltip">${change.tooltip}</span>
              </div>`;
        }).join("")

      }</div>`;
  }

  /**
 * Prepares data specific to player characters.
 */
  preparePCData() {
    if (this.is(K4ActorType.pc)) {
      this.system.moves = this.moves;
      this.system.basicMoves = this.basicMoves;
      this.system.derivedMoves = this.derivedMoves;
      this.system.activeEdges = this.activeEdges;
      this.system.advantages = this.advantages;
      this.system.disadvantages = this.disadvantages;
      this.system.darkSecrets = this.darkSecrets;
      this.system.weapons = this.weapons;
      this.system.gear = this.gear;
      this.system.relations = this.relations;

      this.system.maxWounds = {
        serious: this.system.modifiers.wounds_serious.length as number,
        critical: this.system.modifiers.wounds_critical.length as number,
        total: (this.system.modifiers.wounds_serious.length + this.system.modifiers.wounds_critical.length) as number
      };
      this.system.armor = this.gear.reduce((acc, gear) => acc + gear.system.armor, 0) as number;
      this.system.modifiersReport = this.buildModifierReport();
      this.system.toggleControlStrip = this.buildToggleControlStrip();

      // Call all 'system change' custom functions.
      this.systemChanges.forEach((change) => change.apply());
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

    await this.initMovesAndEffects();

    // Register a custom end-of-scene hook
    Hooks.on("endScene", this._onEndScene.bind(this));
  }

  /**
   * Overrides the update method to handle a closing animation that should not be interrupted.
   * If closing animation provided, and sheet is rendered, update will proceed silently and sheet
   * will be rerendered once the animation completes.
   *  - as options.updateAnim   *
   **/
  override async update(data: Record<string, unknown>, options: DocumentModificationContext & {updateAnim?: GsapAnimation;} = {}): Promise<Maybe<this>> {

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

// #region -- AUGMENTED INTERFACE ~
interface K4Actor<Type extends K4ActorType = K4ActorType> {
  get id(): IDString;
  get name(): string;
  get type(): Type;
  get sheet(): Actor["sheet"] & (Type extends K4ActorType.pc ? K4PCSheet : K4NPCSheet);
  get items(): Actor["items"] & Collection<K4Item>;
  get effects(): Actor["effects"] & Collection<K4ActiveEffect>;
  system: K4Actor.System<Type>;
}
// #endregion
// #region EXPORTS ~
export default K4Actor;

export {
  K4ActorType,
  K4RollType,
  K4WoundType
};
// #endregion