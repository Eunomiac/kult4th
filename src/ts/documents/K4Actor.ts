// #region IMPORTS ~
import K4Item, {K4ItemType, K4ItemSubType} from "./K4Item.js";
import K4PCSheet from "./K4PCSheet.js";
import K4NPCSheet from "./K4NPCSheet.js";
import K4ChatMessage from "./K4ChatMessage.js";
import {K4RollResult} from "./K4Roll.js";
import K4ActiveEffect, {K4Change, EffectSourceType} from "./K4ActiveEffect.js";
import C, {K4Attribute, Archetype, K4Stability, StabilityConditions} from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import {PACKS} from "../scripts/data.js";
// #endregion

// #region === TYPES, ENUMS, INTERFACE AUGMENTATION === ~
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
enum K4ConditionType {
  stability = "stability"
}
// #endregion
// #region -- TYPES ~
declare global {
  type K4CharAttribute = Exclude<K4Attribute, K4Attribute.ask | K4Attribute.zero>;

  namespace K4Actor {

    export namespace Components {
      export interface Wound {
        id: IDString,
        label: string,
        isCritical: boolean,
        isStabilized: boolean;
        isApplyingToRolls: boolean;
      }

      export interface Condition {
        id: IDString,
        label: string,
        description: string,
        type: K4ConditionType,
        modDef: K4Roll.ModDefinition,
        isApplyingToRolls: boolean
      }

      export interface Base {
        description: string,
        wounds: Record<IDString, Wound>,
        conditions: Record<IDString, Condition>,
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
        toggleableEffects: K4ActiveEffect[];
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
// #endregion
// #region === K4ACTOR CLASS ===
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
    if (!this.is(K4ActorType.pc)) {return;}
    const promises: Array<Promise<unknown>> = [];
    // Create the basic moves for the character
    if (this.basicMoves.length === 0) {
      promises.push(this.createEmbeddedDocuments("Item", PACKS.basicPlayerMoves));
    }

    // Create the singleton "Wounds" and "Stability" K4ActiveEffects
    promises.push(K4ActiveEffect.CreateFromChangeData([{
      key: "ApplyWounds",
      value: "label:Wounds,icon:systems/kult4th/assets/icons/wounds/wound-serious.svg,fromText:Wounds",
      mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
      priority: undefined
    }], this));
    promises.push(K4ActiveEffect.CreateFromChangeData([{
      key: "ApplyStability",
      value: "label:Stability,canToggle:true,defaultState:true,duration:ongoing,icon:systems/kult4th/assets/icons/modifiers/stability-broken.svg,fromText:Stability,tooltip:Your mental stability affects your ability to act and think clearly.",
      mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
      priority: undefined
    }], this));

    await Promise.all(promises);
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
  get conditions(): Record<IDString, K4Actor.Components.Condition> {
    return this.system.conditions;
  }
  get wounds_serious() {return Object.values(this.wounds).filter((wound) => !wound.isCritical);}
  get wounds_critical() {return Object.values(this.wounds).filter((wound) => wound.isCritical);}
  get wounds_serious_unstabilized() {return this.wounds_serious.filter((wound) => !wound.isStabilized);}
  get wounds_critical_unstabilized() {return this.wounds_critical.filter((wound) => !wound.isStabilized);}
  get wounds_serious_stabilized() {return this.wounds_serious.filter((wound) => wound.isStabilized);}
  get wounds_critical_stabilized() {return this.wounds_critical.filter((wound) => wound.isStabilized);}
  get enabledUnstabilizedWounds() {
    const enabledUnstabilizedWounds: Record<K4WoundType.serious|K4WoundType.critical, K4Actor.Components.Wound[]> = {
      [K4WoundType.serious]: [],
      [K4WoundType.critical]: [],
    };
    Object.values(this.wounds)
      .filter((wound) => !wound.isStabilized && wound.isApplyingToRolls)
      .forEach((wound) => {
        enabledUnstabilizedWounds[wound.isCritical ? K4WoundType.critical : K4WoundType.serious].push(wound);
      });
    return enabledUnstabilizedWounds;
  }
  get woundsIcon(): string {
    if (!this.is(K4ActorType.pc)) {return "";}
    const numSerious = this.enabledUnstabilizedWounds.serious.length;
    const numCritical = this.enabledUnstabilizedWounds.critical.length;
    if (numCritical) { return "systems/kult4th/assets/icons/wounds/wound-critical.svg"; }
    if (numSerious) { return "systems/kult4th/assets/icons/wounds/wound-serious.svg"; }
    return "";
  }
  get enabledConditions(): K4Actor.Components.Condition[] {
    return Object.values(this.conditions).filter((condition) => condition.isApplyingToRolls);
  }
  get stabilityConditions(): K4Actor.Components.Condition[] {
    if (!this.is(K4ActorType.pc)) {return [];}
    return Object.values(this.system.conditions)
      .filter((condition) => condition.type === K4ConditionType.stability);
  }
  get enabledStabilityConditions(): K4Actor.Components.Condition[] {
    return this.stabilityConditions.filter((condition) => condition.isApplyingToRolls);
  }
  get stabilityIcon(): string {
    if (!this.is(K4ActorType.pc)) {return "";}
    if (this.stabilityLevel === K4Stability.composed) { return ""; }
    return `systems/kult4th/assets/icons/modifiers/stability-${this.stabilityLevel}.svg`;
  }

  get woundModData(): K4Roll.ModData[] {
    if (!this.is(K4ActorType.pc)) {return [];}
    const numSerious = this.wounds_serious_unstabilized.filter((wound) => wound.isApplyingToRolls).length;
    const numCritical = this.wounds_critical_unstabilized.filter((wound) => wound.isApplyingToRolls).length;
    const numBoth = Math.min(numSerious, numCritical);
    if (numSerious + numCritical === 0) { return []; }
    let woundModDefinitions: K4Roll.ModDefinition = {};
    let tooltipLabel = "";
    let tooltipDesc = "";
    if (numBoth) {
      woundModDefinitions = this.system.modifiers.wounds_seriouscritical[numBoth];
      tooltipLabel = "Grievously Wounded";
      tooltipDesc = "Your many grievous injuries threaten death if not treated, even as the pain brings you closer than ever before to piercing the Illusion.";
    } else if (numCritical) {
      woundModDefinitions = this.system.modifiers.wounds_critical[numCritical];
      tooltipLabel = "Critically Wounded";
      tooltipDesc = "You are critically wounded, greatly limiting your ability to act. If you do not receive medical attention soon, death is assured.";
    } else if (numSerious) {
      woundModDefinitions = this.system.modifiers.wounds_serious[numSerious];
      tooltipLabel = "Wounded";
      tooltipDesc = "Your untreated injuries hamper your ability to act."
    }
    const modData: K4Roll.ModData[] = [];
    for (const [filter, value] of Object.entries(woundModDefinitions)) {
      modData.push({
        id: `wound-${filter}`,
        filter,
        value,
        label: "Wounds",
        tooltipLabel,
        tooltipDesc,
        cssClasses: ["k4-theme-red"]
      });
    }
    return modData;
  }
  get stabilityModData(): K4Roll.ModData[] {
    if (!this.is(K4ActorType.pc)) {return [];}
    const stabilityModDefinitions = this.system.modifiers.stability[this.stability];
    let tooltipLabel = "";
    let tooltipDesc = "";
    switch (this.stabilityLevel) {
      case K4Stability.broken:
        tooltipLabel = "Broken";
        tooltipDesc = "You are broken, unable to act or even think clearly. You are at the mercy of your surroundings.";
        break;
      case K4Stability.critical:
        tooltipLabel = "Critical Stress";
        tooltipDesc = "You are critically unstable, your mind teetering on the brink of madness. You are barely able to act, and your thoughts are consumed by your instability.";
        break;
      case K4Stability.serious:
        tooltipLabel = "Serious Stress";
        tooltipDesc = "You are seriously unstable, your thoughts and actions hindered by your instability.";
        break;
      case K4Stability.moderate:
        tooltipLabel = "Moderate Stress";
        tooltipDesc = "You are moderately unstable, your thoughts and actions occasionally hindered by your instability.";
        break;
      case K4Stability.composed:
        return [];
    }
    const modData: K4Roll.ModData[] = [];
    for (const [filter, value] of Object.entries(stabilityModDefinitions)) {
      modData.push({
        id: `stability-${filter}`,
        filter,
        value,
        label: "Stability",
        tooltipLabel,
        tooltipDesc,
        cssClasses: ["k4-theme-red"]
      });
    }
    return modData;
  }
  get stabilityConditionModData(): K4Roll.ModData[] {
    if (!this.is(K4ActorType.pc)) {return [];}
    const modData: K4Roll.ModData[] = [];
    for (const condition of this.enabledStabilityConditions) {
      const modDefinitions = condition.modDef;
      for (const [filter, value] of Object.entries(modDefinitions)) {
        modData.push({
          id: `stability-condition-${condition.id}-${filter}`,
          filter,
          value,
          label: condition.label,
          tooltipLabel: condition.label,
          tooltipDesc: condition.description,
          cssClasses: ["k4-theme-blue"]
        });
      }
    }
    return modData;
  }
  get statusBarStrips(): HoverStripData[] {
    const woundStrips: HoverStripData[] = Object.values(this.wounds)
      .map((strip) => {
        const stripData: Partial<HoverStripData> = {
          id: strip.id,
          icon: "systems/kult4th/assets/icons/wounds/",
          type: [
            strip.isStabilized ? "stable" : "",
            strip.isCritical ? "critical" : "serious"
          ].join("") as K4WoundType,
          display: strip.label ?? "",
          stripClasses: ["wound-strip"],
          dataTarget: `system.wounds.${strip.id}.label`,
          placeholder: "(description)  ",
          buttons: [
            {
              icon: "data-retrieval",
              dataset: {
                target: strip.id,
                action: "reset-wound-name"
              },
              tooltip: "RENAME"
            },
            {
              icon: "wound-serious-stabilized",
              dataset: {
                target: strip.id,
                action: "toggle-wound-stabilize"
              },
              tooltip: strip.isStabilized ? "REOPEN" : "STABILIZE"
            },
            {
              icon: "hover-strip-button-suppress",
              dataset: {
                target: strip.id,
                action: "suppress-wound"
              },
              tooltip: strip.isApplyingToRolls ? "SUPPRESS" : "ENABLE"
            }
          ]
        };
        if (strip.isCritical) {
          stripData.icon += `wound-critical${strip.isStabilized ? "-stabilized" : ""}.svg`;
          stripData.stripClasses?.push("wound-critical");
        } else {
          stripData.icon += `wound-serious${strip.isStabilized ? "-stabilized" : ""}.svg`;
        }
        if (strip.isStabilized) {
          stripData.stripClasses?.push("k4-theme-gold", "wound-stabilized");
        } else {
          stripData.stripClasses?.push("k4-theme-red");
        }
        if (strip.isApplyingToRolls) {
          stripData.stripClasses?.push("strip-enabled");
        } else {
          stripData.stripClasses?.push("strip-disabled");
        }
        return stripData as HoverStripData;
      });
    const conditionStrips: HoverStripData[] = Object.values(this.conditions)
      .map((strip) => {
        const stripData: Partial<HoverStripData> = {
          id: strip.id,
          icon: `systems/kult4th/assets/icons/conditions/${strip.type}.svg`,
          type: strip.type,
          display: strip.label ?? "",
          stripClasses: ["condition-strip", `${strip.type}-strip`, "k4-theme-blue"],
          dataTarget: `system.conditions.${strip.id}.label`,
          placeholder: "(description)  ",
          tooltip: strip.description,
          buttons: [
            {
              icon: "data-retrieval",
              dataset: {
                target: strip.id,
                action: "reset-wound-name"
              },
              tooltip: "RENAME"
            },
            {
              icon: "hover-strip-button-suppress",
              dataset: {
                target: strip.id,
                action: "suppress-condition"
              },
              tooltip: strip.isApplyingToRolls ? "SUPPRESS" : "ENABLE"
            }
          ]
        };
        if (strip.isApplyingToRolls) {
          stripData.stripClasses?.push("strip-enabled");
        } else {
          stripData.stripClasses?.push("strip-disabled");
        }
        return stripData as HoverStripData;
      });

    return [
      ...woundStrips,
      ...conditionStrips
    ].sort((a, b) => {
      const order = ["wound-critical", "wound-serious"];
      if (a.icon.includes(order[0]) && b.icon.includes(order[0])
        || a.icon.includes(order[1]) && b.icon.includes(order[1])) {
        return 0;
      }
      if (a.icon.includes(order[0])) { return -1; }
      if (b.icon.includes(order[0])) { return 1; }
      if (a.icon.includes(order[1])) { return -1; }
      if (b.icon.includes(order[1])) { return 1; }
      return 0;
    })
  }
  get stability() {
    if (!this.is(K4ActorType.pc)) {return 0;}
    const pcData: K4Actor.System<K4ActorType.pc> = this.system;
    return pcData.stability.value;
  }
  get stabilityLevel(): K4Stability {
    /**
     * @todo Replace this with customizable stability levels in settings, and/or variant stability rule
     */
    if (!this.is(K4ActorType.pc)) {return K4Stability.composed;}
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
  async addCondition(data: Partial<K4Actor.Components.Condition>) {
    if (!this.is(K4ActorType.pc)) { return; }
    const {label, description, type, modDef} = data;
    if (!label) {
      throw new Error("Cannot add a condition without a label.");
    }
    if (U.isUndefined(modDef)) {
      throw new Error("Cannot add a condition without a mod definitions object.");
    }
    const conditionData: K4Actor.Components.Condition = {
      id: U.getID(),
      label,
      description: description ?? "",
      type: type ?? K4ConditionType.stability,
      modDef,
      isApplyingToRolls: true
    };
    await this.update({[`system.conditions.${conditionData.id}`]: conditionData});
  }
  /**
   * Adds a wound to the actor.
   * @param {K4WoundType} [type] - The type of the wound.
   * @param {string} [label] - A brief description of the wound.
   */
  async addWound(type?: K4WoundType, label?: string) {
    if (this.is(K4ActorType.pc)) {
      const woundData: K4Actor.Components.Wound = {
        id: U.getID(),
        label: label ?? "",
        isCritical: type === K4WoundType.critical,
        isStabilized: false,
        isApplyingToRolls: true
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
   * Toggles the type, stabilization state, or applicability to rolls of a wound.
   * @param {IDString} id - The ID of the wound.
   * @param {"type"|"stabilized"|"applying"} toggleSwitch - The property to toggle.
   */
  async toggleWound(id: IDString, toggleSwitch: "type" | "stabilized" | "applying") {
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
        case "applying": {
          await this.update({[`system.wounds.${id}.isApplyingToRolls`]: !this.wounds[id].isApplyingToRolls});
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
     await this.update({[`system.wounds.${id}.label`]: ""});
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
   * Toggles the applicability of a condition to rolls..
   * @param {IDString} id - The ID of the wound.
   */
    async toggleCondition(id: IDString) {
      const conditionData = this.conditions[id];
      if (conditionData) {
        await this.update({[`system.conditions.${id}.isApplyingToRolls`]: !this.conditions[id].isApplyingToRolls});
      }
    }
  /**
   * Resets the name of a condition.
   * @param {string} id - The ID of the condition.
   */
  async resetConditionName(id: IDString) {
    const conditionData = this.conditions[id];
    if (conditionData) {
      await this.update({[`system.conditions.${id}.label`]: ""});
    }
  }
    /**
   * Removes a condition from the actor.
   * @param {string} id - The ID of the wound.
   */
  async removeCondition(id: IDString) {
    if (this.is(K4ActorType.pc)) {
      kLog.log("Starting Conditions", U.objClone(this.system.conditions));
      await this.update({[`system.conditions.-=${id}`]: null});
      kLog.log("Updated Conditions", this.system.conditions);
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
    await this.updateEdges(this.system.edges.value - 1);
  }
  async gainEdge() {
    if (!this.is(K4ActorType.pc) || !this.system.edges.sourceName) {return;}
    await this.updateEdges(this.system.edges.value + 1);
  }
  async clearEdges(): Promise<void> {
    if (!this.is(K4ActorType.pc)) {return;}
    await this.updateEdges(0);
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
  // #region -- ROLLS & TRIGGERED RESULTS -- ~
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
  // #endregion

  // #region EDGES: Enabling, Triggering, Disabling ~

  // #endregion

  // #region OVERRIDES: _onCreate, prepareData, _onDelete ~
  get enabledEffects() {
    return this.effects.filter((effect) => effect.isEnabled);
  }
  get customChanges() {
    return Array.from(this.effects as Collection<K4ActiveEffect>)
      .map((effect) => effect.getCustomChanges())
      .flat();
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
  get toggleableEffects() {
    return this.effects.filter((effect) => effect.canToggle() && effect.isRelevant);
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
      othering: Array<"all" | K4Item.Types.Rollable>,
      category: "all" | "type" | K4Item.Types.Rollable
    }
    > = [];


    const categoryVals = {
      all: 0,
      [K4ItemType.advantage]: 0,
      [K4ItemType.disadvantage]: 0
    };
    const moveTypeRecord: Record<string, K4Item.Types.Rollable> = {};
    const statusBarVals = this.statusBarChanges
      .map((change) => ({
        filter: change.filter,
        value: change.finalValue as number
      }))
      // Sort filterVals by specificity: specific move names first, then categories, then "all"
      .toSorted((a, b) => {
        if (a.filter === "all") { return 1 };
        if (b.filter === "all") { return -1 };
        if (a.filter === K4ItemType.advantage || a.filter === K4ItemType.disadvantage) { return 1 };
        if (b.filter === K4ItemType.advantage || b.filter === K4ItemType.disadvantage) { return -1 };
        return 0;
      })
      .toReversed();

    kLog.log("[collapseRollModifiers] Status Bar Vals", U.objClone(statusBarVals));

    // Helper function to add or update the collapsed data
    const addOrUpdate = (
      display: string,
      value: number,
      othering: Array<"all" | K4Item.Types.Rollable>,
      category: "all" | "type" | K4Item.Types.Rollable
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
          addOrUpdate("Any Roll", value, [], "all");
          break;
        }
        case K4ItemType.advantage: {
          value += categoryVals.all;
          categoryVals.advantage = value;
          addOrUpdate("Any Advantage Roll", value, ["all"], "type");
          break;
        }
        case K4ItemType.disadvantage: {
          value += categoryVals.all;
          categoryVals.disadvantage += value;
          addOrUpdate("Any Disadvantage Roll", value, ["all"], "type");
          break;
        }
        default: {
          const move = this.getItemByName(filter);
          if (!move) {
            // throw new Error(`Unrecognized filter value: '${filter}'`);
            break;
          }
          const othering: Array<"all" | K4ItemType.advantage | K4ItemType.disadvantage> = ["all"];
          const category = move.isSubItem()
            ? move.parentType as K4ItemType.advantage | K4ItemType.disadvantage
            : K4ItemType.move;
          moveTypeRecord[move.name] = category;
          if ([K4ItemType.advantage, K4ItemType.disadvantage].includes(category)) {
            othering.push(category as K4ItemType.advantage | K4ItemType.disadvantage);
            value += categoryVals[category as K4ItemType.advantage | K4ItemType.disadvantage];
          } else {
            value += categoryVals.all;
          }
          addOrUpdate(filter, value, othering, category as K4ItemType.advantage | K4ItemType.disadvantage);
          break;
        }
      }
    });

    kLog.log("[collapseRollModifiers] Initial Combination Pass", {
      categoryVals: U.objClone(categoryVals),
      collapsedModifierData: U.objClone(collapsedModifierData)
    });

    // Filter out any unnecessary values:
    // - remove 'all' if it is zero
    // - remove 'advantage' and 'disadvantage' if they are equal to all
    // - remove move names if they are equal to their parent category (or 'all' for basic player moves)
    const filteredModifierData = collapsedModifierData
      .filter(({value, category}) => {
        switch (category) {
          case "all": return value !== 0;
          case "type": return value !== categoryVals.all;
          case K4ItemType.advantage: return value !== categoryVals.advantage;
          case K4ItemType.disadvantage: return value !== categoryVals.disadvantage;
          default: return value !== categoryVals.all;
        }
      });


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
    const collapsedModifiers = this.collapseRollModifiers();
    kLog.log("[buildModifierReport] Collapsed Modifiers", U.objClone(collapsedModifiers));
    for (const {display, value} of collapsedModifiers) {
      if (value < 0) {
        returnStrings.push(`<span class="k4-theme-red"><strong>${value}</strong> to <strong>${display}</strong></span>`);
      } else {
        returnStrings.push(`<span class="k4-theme-gold"><strong>+${value}</strong> to <strong>${display}</strong></span>`);
      }
    }
    return `<span class="modifiers-report">${returnStrings.join("<span class='k4-theme-black no-flex'>&#9670;</span>")}</span>`;
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
        serious: this.system.modifiers.wounds_serious.length,
        critical: this.system.modifiers.wounds_critical.length,
        total: (this.system.modifiers.wounds_serious.length + this.system.modifiers.wounds_critical.length)
      };
      this.system.armor = this.gear.reduce((acc, gear) => acc + gear.system.armor, 0);

      // Call all 'system change' custom functions.
      this.systemChanges.forEach((change) => change.apply());

      this.system.modifiersReport = this.buildModifierReport();
      this.system.toggleableEffects = this.toggleableEffects;

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
// #endregion

// #region EXPORTS ~
export default K4Actor;

export {
  K4ActorType,
  K4RollType,
  K4WoundType,
  K4ConditionType
};
// #endregion