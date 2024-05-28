/**
 * @file data.ts
 * @description This file contains functions and constants for managing and manipulating K4Item data schemas. It includes functions for migrating data, extracting unique keys and values, generating reports, and building items from data.
 */
import U from "../scripts/utilities.js";
import { K4Attribute } from "../scripts/constants";
import { K4ItemType, K4ItemSubType, K4ItemResultType, K4ItemRange } from "../documents/K4Item";
import ITEM_DATA, {PREV_DATA} from "./item-data.js";

// #region TYPES & ENUMS ~
/** Namespace for PACK types */
namespace PACKS {
  export interface ByType {
    [K4ItemType.advantage]: K4Item.Schema<K4ItemType.advantage>[];
    [K4ItemType.disadvantage]: K4Item.Schema<K4ItemType.disadvantage>[];
    [K4ItemType.move]: K4Item.Schema<K4ItemType.move>[];
    [K4ItemType.attack]: K4Item.Schema<K4ItemType.attack>[];
    [K4ItemType.darksecret]: K4Item.Schema<K4ItemType.darksecret>[];
    [K4ItemType.relation]: K4Item.Schema<K4ItemType.relation>[];
    [K4ItemType.gear]: K4Item.Schema<K4ItemType.gear>[];
    [K4ItemType.weapon]: K4Item.Schema<K4ItemType.weapon>[];
  }
  export interface SubItems {
    subItems: K4SubItem.Schema[];
    subMoves: K4SubItem.Schema<K4ItemType.move>[];
    subAttacks: K4SubItem.Schema<K4ItemType.attack>[];
  }
  export interface ParentItems {
    parentItems: K4Item.Schema<K4Item.Types.Parent>[];
  }
  export interface BasicPlayerMoves {
    basicPlayerMoves: Array<K4Item.Schema<K4ItemType.move> & Record<string, unknown>>;
  }
  export interface BySubType {
    [K4ItemSubType.activeRolled]: K4SubItem.Schema[];
    [K4ItemSubType.activeStatic]: K4SubItem.Schema[];
    [K4ItemSubType.passive]: K4Item.Schema[];
  }
  export interface All {
    all: K4Item.Schema[];
  }
}

enum ReportOn {
  UniqueValues = "UniqueValues",
  SubTypes = "SubTypes"
}

namespace REPORTS {
  export interface Config {
    isExpanding?: boolean;
    reportType?: ReportOn;
  }

  export interface CountReport {
    count: number;
    total: number;
    schemasWith?: string[];
    schemasWithout?: string[];
  }
}

type AnySchema = K4Item.Schema | K4SubItem.Schema;
// #endregion

// #REGION === DATA ===

// #region PACKS Object ~
/** PACKS object containing various item schemas */
const PACKS: PACKS.ByType & PACKS.BySubType & PACKS.SubItems & PACKS.ParentItems & PACKS.BasicPlayerMoves & PACKS.All = {
  /** SUBITEM NAMING CONVENTIONS
   *
   * activeRolled -- these moves are rolled, and their name should complete the sentence "X rolls Y to <subItem.name>"
   * activeStatic -- these moves are triggered, and their name should complete the sentence "X proceeds to <subItem.name>"
   * passive -- there should be no passive subItems (they should be parent items)
   *
   * */
  [K4ItemType.advantage]: ITEM_DATA[K4ItemType.advantage] as unknown as K4Item.Schema<K4ItemType.advantage>[],
  [K4ItemType.disadvantage]: ITEM_DATA[K4ItemType.disadvantage] as unknown as K4Item.Schema<K4ItemType.disadvantage>[],
  [K4ItemType.darksecret]: ITEM_DATA[K4ItemType.darksecret] as unknown as K4Item.Schema<K4ItemType.darksecret>[],
  [K4ItemType.weapon]: ITEM_DATA[K4ItemType.weapon] as unknown as K4Item.Schema<K4ItemType.weapon>[],
  [K4ItemType.gear]: ITEM_DATA[K4ItemType.gear] as unknown as K4Item.Schema<K4ItemType.gear>[],
  [K4ItemType.move]: ITEM_DATA[K4ItemType.move] as unknown as K4Item.Schema<K4ItemType.move>[],
  [K4ItemType.relation]: ITEM_DATA[K4ItemType.relation] as unknown as K4Item.Schema<K4ItemType.relation>[],
  [K4ItemType.attack]: ITEM_DATA[K4ItemType.attack] as unknown as K4Item.Schema<K4ItemType.attack>[],
  get basicPlayerMoves() {
    return this[K4ItemType.move].toSorted((a, b) => a.name.localeCompare(b.name)) as Array<K4Item.Schema<K4ItemType.move> & Record<string, unknown>>;
  },
  get parentItems(): K4Item.Schema<K4Item.Types.Parent>[] {
    return [
      ...this[K4ItemType.advantage],
      ...this[K4ItemType.disadvantage],
      ...this[K4ItemType.weapon],
      ...this[K4ItemType.gear]
    ];
  },
  get subItems(): K4SubItem.Schema[] {
    return extractSubItemSchemas([
      ...this[K4ItemType.advantage],
      ...this[K4ItemType.disadvantage],
      ...this[K4ItemType.weapon],
      ...this[K4ItemType.gear]
    ]);
  },
  get subMoves(): K4SubItem.Schema<K4ItemType.move>[] {
    return extractSubItemSchemas([
      ...this[K4ItemType.advantage],
      ...this[K4ItemType.disadvantage],
      ...this[K4ItemType.weapon],
      ...this[K4ItemType.gear]
    ], [K4ItemType.move]) as K4SubItem.Schema<K4ItemType.move>[];
  },
  get subAttacks(): K4SubItem.Schema<K4ItemType.attack>[] {
    return extractSubItemSchemas([
      ...this[K4ItemType.advantage],
      ...this[K4ItemType.disadvantage],
      ...this[K4ItemType.weapon],
      ...this[K4ItemType.gear]
    ], [K4ItemType.attack]) as K4SubItem.Schema<K4ItemType.attack>[];
  },
  get all(): K4Item.Schema[] {
    return [
      ...this[K4ItemType.advantage],
      ...this[K4ItemType.disadvantage],
      ...this[K4ItemType.darksecret],
      ...this[K4ItemType.weapon],
      ...this[K4ItemType.gear],
      ...this[K4ItemType.move]
    ];
  },
  get [K4ItemSubType.activeRolled](): K4SubItem.Schema[] {
    return this.subItems
      .filter((move) => move.system.subType === K4ItemSubType.activeRolled);
  },
  get [K4ItemSubType.activeStatic](): K4SubItem.Schema[] {
    return this.subMoves
      .filter((move) => move.system.subType === K4ItemSubType.activeStatic);
  },
  get [K4ItemSubType.passive](): K4Item.Schema[] {
    return this.all
      .filter((move) => move.system.subType === K4ItemSubType.passive);
  }
};
// #endregion

//#ENDREGION

// #region Utility & Reporting Functions ~

/**
 * Determines the type of a given value.
 * @param {unknown} val - The value to determine the type of.
 * @returns {string} - The type of the value.
 */
function getType(val: unknown): string {
  if (val === null) { return "null"; }
  if (val === undefined) { return "undefined"; }
  if (Array.isArray(val)) {
    if (val.length === 0) {
      return "[]";
    }
    const uniqueArrayTypes = Array.from(new Set(val.map(getType)));
    if (uniqueArrayTypes.length === 1) {
      return `[${uniqueArrayTypes[0]}]`;
    }
    return `[${uniqueArrayTypes.join(", ")}]`;
  }
  if (typeof val === "object") {
    // Check whether val === {}
    if (Object.keys(val).length === 0) {
      return "{}";
    }
    return "why-didn't-this-parse"
  }

  let isNumString = false;

  if (typeof val === "string") {
    if (val === "") {
      return "empty-string";
    }
    if (!isNaN(Number(val))) {
      val = Number(val);
      isNumString = true;
    } else if (["true", "false"].includes(val.toLowerCase())) {
      return "bool-string";
    } else if (/ /.test(val)) {
      return "phrase-string";
    } else {
      return "word-string";
    }
  }

  switch (typeof val) {
    case "undefined":
    case "boolean":
    case "function":
    case "object":
    case "symbol":
      return typeof val;
    case "bigint":
    case "number":
      const typeParts: string[] = [];
      if (val === 0) {
        typeParts.push("0");
      } else {
        typeParts.push(...[
          Math.abs(val as number) < 10
            ? "small-"
            : "",
          val as number > 0
            ? "pos"
            : "neg",
          Number.isInteger(val)
            ? "Int"
            : "Float"
        ]);
      }
      if (isNumString) {
        typeParts.push("-string");
      }
      return typeParts.join("");
  }
  return "???";
}

/**
 * Extracts unique keys from an array of item data.
 * @param {Array<K4Item.Schema|K4SubItem.Schema>} itemDataArray - The array of item data.
 * @param {boolean} [isExpanding=false] - Whether to expand the keys.
 * @returns {Record<string, unknown>} - The unique keys.
 */
function getUniqueSystemKeys(itemDataArray: Array<K4Item.Schema | K4SubItem.Schema>, isExpanding = false): Record<string, unknown> {
  const uniqueEntries: Array<Tuple<string, string[]>> = [];
  itemDataArray.forEach((item) => {
    const flatSystem = flattenObject(item.system);
    Object.keys(flatSystem).forEach((thisKey) => {
      const thisType = getType(flatSystem[thisKey]);
      if (thisType === "object") {
        console.log(`Object found at ${thisKey}: '${JSON.stringify(flatSystem[thisKey])}'`);
      }
      const matchingEntry = uniqueEntries.find((uniqueEntry) => uniqueEntry[0] === thisKey);
      if (matchingEntry) {
        if (!matchingEntry[1].includes(thisType)) {
          matchingEntry[1].push(thisType);
        }
      } else {
        uniqueEntries.push([thisKey, [thisType]]);
      }
    });
  });

  // Iterate through uniqueSubItemEntries, converting the array of types to a string
  const parsedSubItemEntries: Array<Tuple<string>> = uniqueEntries
    .map((entry) => [entry[0], entry[1].join(", ")]);

  // Sort the flattened keys
  parsedSubItemEntries.sort((a, b) => a[0].localeCompare(b[0]));

  // Construct the data object, still with flattened keys
  const dataObject = Object.fromEntries(parsedSubItemEntries);

  return isExpanding ? expandObject(dataObject) : dataObject;
}



/**
 * Gets unique values for a given key from an array of item data.
 * @param {K4Item.Schema[]} itemDataArray - The array of item data.
 * @param {string} key - The key to get unique values for.
 * @returns {unknown[]}
 */
function getUniqueValuesForSystemKey(itemDataArray: K4Item.Schema[], key: string): unknown[]
/**
 * Gets unique values for a given array of keys from an array of item data.
 * @param {K4Item.Schema[]} itemDataArray - The array of item data.
 * @param {string[]} key - The array of keys to get unique values for.
 * @returns {Record<string, unknown>}
 */
function getUniqueValuesForSystemKey(itemDataArray: K4Item.Schema[], key: string[]): Record<string, unknown>
function getUniqueValuesForSystemKey(itemDataArray: K4Item.Schema[], key: string | string[]): Record<string, unknown> | unknown[] {
  if (Array.isArray(key)) {
    const valsByKey: Record<string, unknown[]> = {};
    key.forEach((thisKey) => {
      valsByKey[thisKey] = getUniqueValuesForSystemKey(itemDataArray, thisKey);
    });
    return valsByKey;
  }
  const uniqueValues: any[] = [];
  const isFlattening = /\./.test(key);
  itemDataArray.forEach((schema) => {
    const flatSubItemSystem = isFlattening ? flattenObject(schema.system) : schema.system;
    if (key in flatSubItemSystem) {
      let thisValue = flatSubItemSystem[key as keyof typeof flatSubItemSystem];
      if (Array.isArray(thisValue)) {
        thisValue = `[${thisValue.map(String).join(", ")}]`;
      }
      if (!uniqueValues.includes(thisValue)) {
        uniqueValues.push(thisValue);
      }
    }
  });
  return uniqueValues;
}

/**
 * Generates a report of unique keys and their types/values from an array of item data.
 * @param {K4Item.Schema[]} itemDataArray - The array of item data.
 * @param {boolean} [isExpanding=false] - Whether to expand the keys.
 * @returns {Record<string, string>} - The report object.
 */
function getItemSystemReport(itemDataArray: K4Item.Schema[] = PACKS.all, options: REPORTS.Config = {}): Record<string, string> {

  const VAL_TYPES_TO_LIST = [
    "small-posInt",
    "boolean",
    "word-string",
    "[word-string]"
  ];
  const keyTypeData = getUniqueSystemKeys(itemDataArray);

  let mapFunction: <V>(entry: Tuple<string, unknown>) => Tuple<string, V>;

  options.reportType ??= ReportOn.UniqueValues;

  switch (options.reportType) {
    case ReportOn.UniqueValues:
      mapFunction = <V = string>([key, val]: Tuple<string, unknown>) => [
        key,
        VAL_TYPES_TO_LIST.includes(`${val}`)
          ? getUniqueValuesForSystemKey(itemDataArray, key).join(", ")
          : val
      ] as Tuple<string, V>;
      break;
    case ReportOn.SubTypes:
      mapFunction = <V = Partial<Record<K4ItemSubType, REPORTS.CountReport>>>([key, val]: Tuple<string, unknown>) => {
        const returnData = {
          [K4ItemSubType.activeRolled]: countSchemasWithSystemKey(
            itemDataArray.filter((is) => is.system.subType === K4ItemSubType.activeRolled),
            key
          ),
          [K4ItemSubType.activeStatic]: countSchemasWithSystemKey(
            itemDataArray.filter((is) => is.system.subType === K4ItemSubType.activeStatic),
            key
          ),
          [K4ItemSubType.passive]: countSchemasWithSystemKey(
            itemDataArray.filter((is) => is.system.subType === K4ItemSubType.passive),
            key
          )
        };
        [
          K4ItemSubType.activeRolled,
          K4ItemSubType.activeStatic,
          K4ItemSubType.passive
        ].forEach((subType) => {
          if (returnData[subType].count === 0) {
            delete returnData[subType];
          }
        });
        return [key, returnData as V];
      };
      break;
  }

  const reportObject = Object.fromEntries(
    Object.entries(keyTypeData)
      .map(([key, val]) => mapFunction([key, val]))
  );
  return options.isExpanding !== false ? expandObject(reportObject) : reportObject;
}

/**
 * Extracts sub-item schemas from an array of item data.
 * @param {K4Item.Schema[]} itemDataArray - The array of item data.
 * @param {K4SubItem.Types[]} [subTypes=[K4ItemType.attack, K4ItemType.move]] - The sub-item types to extract.
 * @returns {Array<K4SubItem.Schema>} - The extracted sub-item schemas.
 */
function extractSubItemSchemas(itemDataArray: K4Item.Schema[] = PACKS.all, subTypes: K4SubItem.Types[] = [K4ItemType.attack, K4ItemType.move]): Array<K4SubItem.Schema> {
  return itemDataArray
    .filter((item): item is K4Item.Schema<K4Item.Types.Parent> =>
      [K4ItemType.advantage, K4ItemType.disadvantage, K4ItemType.weapon, K4ItemType.gear]
        .includes(item.type))
    .map((parentItem) => {
      if (!parentItem.system) {
        console.error(`No system data found for ${parentItem.name}`, parentItem);
        return [];
      }
      if (!parentItem.system.subItems) {
        console.error(`No subItems found for ${parentItem.name}`, parentItem);
        return [];
      }
      return parentItem.system.subItems.filter((subItem) => subTypes.includes(subItem.type));
    })
    .flat();
}

/**
 * Extracts unique keys from sub-item schemas.
 * @param {K4Item.Schema[]} itemDataArray - The array of item data.
 * @param {boolean} [isExpanding=false] - Whether to expand the keys.
 * @returns {Record<string, unknown>} - The unique keys.
 */
function getUniqueSubItemSystemKeys(itemDataArray: K4Item.Schema[] = PACKS.all, isExpanding = false): Record<string, unknown> {
  return getUniqueSystemKeys(
    extractSubItemSchemas(itemDataArray),
    isExpanding
  );
}

function getTypeInitials(type: K4ItemType) {
  return {
    [K4ItemType.advantage]: "Av",
    [K4ItemType.disadvantage]: "D",
    [K4ItemType.darksecret]: "DS",
    [K4ItemType.weapon]: "W",
    [K4ItemType.attack]: "Ak",
    [K4ItemType.move]: "M",
    [K4ItemType.gear]: "G",
    [K4ItemType.relation]: "R"
  }[type];
}

function countSchemasWithSystemKey(schemaArray: AnySchema[], key: string): REPORTS.CountReport {
  const schemasWith: string[] = [];
  const schemasWithout: string[] = [];
  const returnData: REPORTS.CountReport = {count: 0, total: schemaArray.length};

  schemaArray.forEach((schema) => {
    const flatSchema = flattenObject(schema.system);
    const schemaName = `[${getTypeInitials(schema.type)}] ${schema.name
      ?? ("chatName" in schema.system && schema.system.chatName || null)
      ?? ("id" in schema && schema.id || null)
      ?? `Unknown_${U.randInt(100, 999)}`}`;
    if (key in flatSchema) {
      schemasWith.push(schemaName);
    } else {
      schemasWithout.push(schemaName);
    }
  });
  if (schemasWithout.length >= schemasWith.length) {
    returnData.schemasWith = schemasWith;
  }
  if (schemasWith.length >= schemasWithout.length) {
    returnData.schemasWithout = schemasWithout;
  }
  returnData.count = schemasWith.length;
  return returnData;
}

/**
 * Gets unique values for a given key from sub-item schemas.
 * @param {K4Item.Schema[]} itemDataArray - The array of item data.
 * @param {string} key - The key to get unique values for.
 * @returns {unknown[]}
 */
function getUniqueValuesForSubItemKey(itemDataArray: K4Item.Schema[], key: string): unknown[]
/**
 * Gets unique values for a given array of keys from sub-item schemas.
 * @param {K4Item.Schema[]} itemDataArray - The array of item data.
 * @param {string[]} key - The array of keys to get unique values for.
 * @returns {Record<string, unknown>}
 */
function getUniqueValuesForSubItemKey(itemDataArray: K4Item.Schema[], key: string[]): Record<string, unknown[]>
function getUniqueValuesForSubItemKey(key: string): unknown[]
function getUniqueValuesForSubItemKey(keys: string[]): Record<string, unknown[]>
function getUniqueValuesForSubItemKey(itemDataArray: string|string[]|K4Item.Schema[], key?: string | string[]): Record<string, unknown[]> | unknown[] {
  if (typeof itemDataArray === "string") {
    key = itemDataArray;
    itemDataArray = PACKS.all;
  } else if (Array.isArray(itemDataArray) && typeof itemDataArray[0] === "string") {
    key = itemDataArray as string[];
    itemDataArray = PACKS.all;
  }
  return getUniqueValuesForSystemKey(extractSubItemSchemas(itemDataArray as K4Item.Schema[]) as any, key as any);
}

/**
 * Generates a report of unique keys and their types/values from sub-item schemas.
 * @param {K4Item.Schema[]} itemDataArray - The array of item data.
 * @param {boolean} [isExpanding=false] - Whether to expand the keys.
 * @returns {Record<string, string>} - The report object.
 */
function getSubItemSystemReport(itemDataArray: K4Item.Schema[] = PACKS.all, options: REPORTS.Config = {}): Record<string, unknown> {
  const VAL_TYPES_TO_LIST = [
    "small-posInt",
    "boolean",
    "word-string",
    "[word-string]"
  ];
  const keyTypeData = getUniqueSubItemSystemKeys(itemDataArray);

  let mapFunction: <V>(entry: Tuple<string, unknown>) => Tuple<string, V>;

  options.reportType ??= ReportOn.UniqueValues;

  const extractedSubItemSchemas = extractSubItemSchemas(itemDataArray);

  switch (options.reportType) {
    case ReportOn.UniqueValues:
      mapFunction = <V = string>([key, val]: Tuple<string, unknown>) => [
        key,
        VAL_TYPES_TO_LIST.includes(`${val}`)
          ? getUniqueValuesForSubItemKey(itemDataArray, key).join(", ")
          : val
      ] as Tuple<string, V>;
      break;
    case ReportOn.SubTypes:
      mapFunction = <V = Partial<Record<K4ItemSubType, REPORTS.CountReport>>>([key, val]: Tuple<string, unknown>) => {
        const returnData = {
          [K4ItemSubType.activeRolled]: countSchemasWithSystemKey(
            extractedSubItemSchemas.filter((is) => is.system.subType === K4ItemSubType.activeRolled),
            key
          ),
          [K4ItemSubType.activeStatic]: countSchemasWithSystemKey(
            extractedSubItemSchemas.filter((is) => is.system.subType === K4ItemSubType.activeStatic),
            key
          )
        };
        ([
          K4ItemSubType.activeRolled,
          K4ItemSubType.activeStatic
        ] as const).forEach((subType) => {
          if (returnData[subType].count === 0) {
            delete returnData[subType];
          }
        });
        return [key, returnData as V];
      };
      break;
  }

  const reportObject = Object.fromEntries(
    Object.entries(keyTypeData)
      .map(([key, val]) => mapFunction([key, val]))
  );
  return options.isExpanding !== false ? expandObject(reportObject) : reportObject;
}

function getMutationDiffReport() {
  return diffObject(PREV_DATA, ITEM_DATA);
}
// #endregion

// #REGION BUILDING ITEMS FROM DATA
/**
 * Parses item schemas for creation by pruning keys and setting folder names.
 * @param {any[]} itemDataArray - The array of item data.
 * @returns {any[]} - The parsed item schemas.
 */
function parseItemSchemasForCreation(itemDataArray: K4Item.Schema[] = PACKS.all): K4Item.Schema[] {
  const FOLDER_NAME_MAP = {
    [K4ItemType.attack]: null,
    [K4ItemType.advantage]: "Advantages",
    [K4ItemType.disadvantage]: "Disadvantages",
    [K4ItemType.darksecret]: "Dark Secrets",
    [K4ItemType.relation]: null,
    [K4ItemType.weapon]: "Weapons & Gear",
    [K4ItemType.gear]: "Weapons & Gear",
    [K4ItemType.move]: "Basic Player Moves"
  };
  return itemDataArray
    .map((itemData) => {
      const newItemData = duplicate(itemData) as K4Item.Schema & {folder: string|null};
      ["_id", "folder", "sort", "permission", "flags"]
        .forEach((key) => {
          delete newItemData[key as keyof typeof newItemData]
      });
      if (FOLDER_NAME_MAP[itemData.type as K4ItemType]) {
        newItemData.folder = game.folders?.getName(FOLDER_NAME_MAP[itemData.type as K4ItemType] as string)?.id ?? null;
      }
      return newItemData;
    });
}

/**
 * Builds items from data by deleting existing items and creating new ones.
 * @returns {Promise<void>}
 */
async function BUILD_ITEMS_FROM_DATA(): Promise<void> {
  const itemSchemas = parseItemSchemasForCreation(PACKS.all);

  // Filter the list of existing items in game.items to list all items that are duplicates of the items we're about to create
  const existingItems = game.items.filter((item) => itemSchemas.some((itemSchema) => itemSchema.name === item.name));

  // Await a Promise.all that deletes all the existing items
  await Promise.all(existingItems.map((item) => item.delete()));

  // Create all the new items
  return Item.create(itemSchemas as unknown as ItemDataConstructorData);
}

//#endregion

export default BUILD_ITEMS_FROM_DATA;

export {
  PACKS,
  getUniqueValuesForSystemKey,
  getItemSystemReport,
  getSubItemSystemReport,
  getMutationDiffReport
}
