import C from "../constants.js";
import U from "../utilities.js";
import {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData.js";
import {UNMIGRATED_DATA} from "./migrationData.js";
import {K4ItemType, K4ItemSubType} from "../../documents/K4Item.js";

export type ItemMigrationData = Record<key,any> & Omit<Required<ItemDataConstructorData>,"data"|"_id"|"effects"|"folder"|"sort"|"permission"|"flags">

function stringToNum(numString: string | number) {
	if (/^\d+$/.test(`${numString}`)) { return parseInt(`${numString}`) }
	if (`${numString}`.match(/\bone\b/i)) { return 1 }
	if (`${numString}`.match(/\btwo\b/i)) { return 2 }
	if (`${numString}`.match(/\bthree\b/i)) { return 3 }
	return 0;
	// throw new Error(`Bad Number String: '${numString}'`);
}

export function toDict<T extends List, K extends string & KeyOf<T>, V extends ValueOf<T>>(items: T[], key: K): V extends key ? Record<V,T> : never {
	const dict = {} as Record<V,T>;
	const mappedItems = items
		.map((data) => {
			let {iData} = data;
			if (!iData) { iData = data }
			return [
				`${(iData.linkName || iData.sourceItem?.name) ? `>${iData.type.charAt(0)}>` : ""}${iData[key]}`,
				iData
			];
		})
		.sort(([a], [b]) => a.localeCompare(b)) as Array<[string, T]>;
	mappedItems.forEach(([newKey, iData]: [string, T]) => {
		if (newKey in dict) {
			newKey = indexString(newKey) as V;
		}
		dict[newKey as KeyOf<typeof dict>] = iData;
	});
	// @ts-expect-error Oh it definitely does.
	return dict;

	function indexString(str: string) {
		if (/_\d+$/.test(str)) {
			const [curIndex, ...subStr] = str.split(/_/).reverse();
			return [
				...subStr.reverse(),
				parseInt(curIndex) + 1
			].join("_");
		}
		return `${str}_1`;
	}
}

type listLocation = "staticSuccess" | "completeSuccess" | "partialSuccess" | "failure" | "passive";
const parserFuncs = {
	lists: (data: ItemMigrationData): {
		listDefs: Record<string, ListDef>,
		listLocs: Record<listLocation, string[]>
	} => {
		const listData = {
			listDefs: data.lists,
			listLocs: {
				staticSuccess: U.unique(data.subType !== "passive" ? (data.effect.optionsLists ?? []) : []) as string[],
				completeSuccess: U.unique(data.results?.success?.optionsLists ?? []) as string[],
				partialSuccess: U.unique(data.results?.partial?.optionsLists ?? []) as string[],
				failure: U.unique(data.results?.fail?.optionsLists ?? []) as string[],
				passive: U.unique(data.subType === "passive" ? (data.effect.optionsLists ?? []) : []) as string[]
			}
		};
		return listData;
	},
	rules: (data: ItemMigrationData, type: K4ItemType, listLocs: Record<listLocation, string[]>): RulesDef => {
		switch (type) {
			case K4ItemType.advantage:
			case K4ItemType.disadvantage: {
				return {
					intro: data.effect.intro,
					trigger: "",
					outro: "",
					holdText: data.hasHolds || "",
					optionsLists: U.unique([...listLocs.passive, ...listLocs.staticSuccess]),
					effectFunctions: [data.notes].filter(Boolean)
				};
			}
			case K4ItemType.attack:
			case K4ItemType.move:
			case K4ItemType.relation:
			case K4ItemType.weapon:
			case K4ItemType.gear: {
				return {
					intro: data.effect.intro,
					trigger: data.effect.trigger,
					outro: data.effect.effect,
					holdText: data.hasHolds || "",
					optionsLists: U.unique([...listLocs.passive, ...listLocs.staticSuccess]),
					effectFunctions: [data.notes].filter(Boolean)
				};
			}
			case K4ItemType.darksecret: {
				const regpat = new RegExp(`^${data.effect.intro}`);
				return {
					intro: data.effect.intro,
					trigger: data.effect.trigger,
					outro: data.effect.effect.replace(regpat, "").trim(),
					holdText: data.hasHolds || "",
					optionsLists: U.unique([...listLocs.passive, ...listLocs.staticSuccess]),
					effectFunctions: [data.notes].filter(Boolean)
				};
			}
			default: return false as never;
		}
	},
	results: <T extends K4ItemType>(data: ItemMigrationData, type: T, listLocs: Record<listLocation, string[]>): ResultDef<K4ItemSubType> => {
		const genericResult = {
			result: "",
			optionsLists: [],
			effectFunctions: [],
			edges: 0,
			hold: 0
		} as ResultSchema;
		function parseResults(resultType: "staticSuccess" | "completeSuccess" | "partialSuccess" | "failure"): ResultSchema {
			if (data.subType === "passive") { return genericResult }
			if (data.subType === "active-static" && resultType === "staticSuccess") {
				if (data.hasEdges) {
					console.warn(`${data.name} is Active-Static with EDGES`);
				}
				if (data.hasHolds) {
					console.warn(`${data.name} is Active-Static with HOLD`);
				}
				const effect = data.effect.effect || "";
				return {
					result: effect ? `${effect.charAt(0).toUpperCase()}${effect.slice(1)}` : "",
					optionsLists: listLocs.staticSuccess,
					effectFunctions: [data.notes].filter(Boolean),
					edges: 0,
					hold: 0
				};
			}
			if (data.subType === "active-rolled" && ["completeSuccess", "partialSuccess", "failure"].includes(resultType)) {
				const migKey = {
					completeSuccess: "success",
					partialSuccess: "partial",
					failure: "fail"
				};
				const {text} = data.results[migKey[resultType as "completeSuccess" | "partialSuccess" | "failure"]];
				const resultText = `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
				return {
					result: resultText,
					optionsLists: U.unique(listLocs[resultType]),
					effectFunctions: [],
					edges: data.hasEdges ? stringToNum(resultText.match(/.{6,30}Edge/)?.[0] ?? "") : 0,
					hold: data.hasHolds ? stringToNum(resultText.match(/.{6,30}Hold/)?.[0] ?? "") : 0
				};
			}
			return genericResult;
		}
		const results: Partial<ResultDef<K4ItemSubType.activeRolled> & ResultDef<K4ItemSubType.activeStatic>> = {};
		switch (type) {
			case K4ItemType.move: {
				results.staticSuccess = parseResults("staticSuccess");
				// falls through
			}
			case K4ItemType.attack: {
				results.completeSuccess = parseResults("completeSuccess");
				results.partialSuccess = parseResults("partialSuccess");
				results.failure = parseResults("failure");
				return results as ResultDef<K4ItemSubType>;
			}
			case K4ItemType.advantage:
			case K4ItemType.disadvantage: {
				return {staticSuccess: parseResults("staticSuccess")} as ResultDef<K4ItemSubType>;
			}
			case K4ItemType.darksecret:
			case K4ItemType.relation:
			case K4ItemType.weapon:
			case K4ItemType.gear: {
				return {} as ResultDef<K4ItemSubType>;
			}
			default: return false as never;
		}
	}
};

const PARSERS = {
	move: (data: ItemMigrationData): any => {
		const {listDefs, listLocs} = parserFuncs.lists(data);
		const newData: any = {
			// isMigrated: true, // Activate ONLY when you're sure all the data is transferred over!
			name: data.name,
			type: K4ItemType.move,
			img: data.img ?? "",
			data: {
				subType: data.subType as K4ItemSubType,
				attribute: data.attributemod || "0",
				description: "",
				notes: data.notes,
				lists: listDefs,
				subItems: (data.attacks ?? []).map(PARSERS.attack),
				sourceItem: {
					name: data.linkName ?? "",
					id: "",
					type: data.linkType ?? ""
				},
				isCustom: false,
				pdfLink: "",
				rules: parserFuncs.rules(data, K4ItemType.move, listLocs),
				results: parserFuncs.results(data, K4ItemType.move, listLocs)
			}
		};
		return newData as K4ItemData;
	},
	attack: (data: ItemMigrationData): any => {
		const {listDefs, listLocs} = parserFuncs.lists(data);
		const newData: any = {
			// isMigrated: true, // Activate ONLY when you're sure all the data is transferred over!
			name: data.name,
			type: K4ItemType.attack,
			img: data.img ?? "",
			data: {
				subType: data.subType as K4ItemSubType,
				attribute: data.attributemod || "violence",
				description: "",
				notes: data.special,
				range: data.range,
				ammo: data.ammo,
				harm: data.harm,
				lists: listDefs,
				subItems: [
					...(data.attacks ?? []).map(PARSERS.attack),
					...(data.moves ?? []).map(PARSERS.move)
				],
				sourceItem: {
					name: data.sourceItem?.name ?? "",
					id: "",
					type: data.sourceItem?.type ?? ""
				},
				isCustom: false,
				pdfLink: "",
				rules: parserFuncs.rules(data, K4ItemType.attack, listLocs),
				results: parserFuncs.results(data, K4ItemType.attack, listLocs)
			}
		};
		return newData as K4ItemData;
	},
	advantage: (data: ItemMigrationData): any => {
		const {listDefs, listLocs} = parserFuncs.lists(data);
		const newData: any = {
			// isMigrated: true, // Activate ONLY when you're sure all the data is transferred over!
			name: data.name,
			type: K4ItemType.advantage,
			img: data.img ?? "",
			data: {
				subType: data.subType as K4ItemSubType,
				attribute: data.attributemod || "0",
				description: "",
				notes: data.notes,
				lists: listDefs,
				currentHold: 0,
				currentEdges: 0,
				subItems: [
					...(data.attacks ?? []).map(PARSERS.attack),
					...(data.moves ?? []).map(PARSERS.move)
				],
				isCustom: false,
				pdfLink: "",
				rules: parserFuncs.rules(data, K4ItemType.advantage, listLocs),
				results: parserFuncs.results(data, K4ItemType.advantage, listLocs)
			}
		};
		return newData;
	},
	disadvantage: (data: ItemMigrationData): any => {
		const {listDefs, listLocs} = parserFuncs.lists(data);
		const newData: any = {
			// isMigrated: true, // Activate ONLY when you're sure all the data is transferred over!
			name: data.name,
			type: K4ItemType.disadvantage,
			img: data.img ?? "",
			data: {
				subType: data.subType as K4ItemSubType,
				attribute: data.attributemod || "0",
				description: "",
				notes: data.notes,
				lists: listDefs,
				currentHold: 0,
				subItems: [
					...(data.attacks ?? []).map(PARSERS.attack),
					...(data.moves ?? []).map(PARSERS.move)
				],
				isCustom: false,
				pdfLink: "",
				rules: parserFuncs.rules(data, K4ItemType.disadvantage, listLocs),
				results: parserFuncs.results(data, K4ItemType.disadvantage, listLocs)
			}
		};
		return newData;
	},
	darksecret: (data: ItemMigrationData): any => {
		const {listDefs, listLocs} = parserFuncs.lists(data);
		const newData: any = {
			// isMigrated: true, // Activate ONLY when you're sure all the data is transferred over!
			name: data.name,
			type: K4ItemType.darksecret,
			img: data.img ?? "",
			data: {
				subType: "passive" as K4ItemSubType,
				drive: "",
				description: "",
				notes: data.notes,
				playerNotes: "",
				gmNotes: "",
				lists: listDefs,
				currentHold: 0,
				subItems: [
					...(data.attacks ?? []).map(PARSERS.attack),
					...(data.moves ?? []).map(PARSERS.move)
				],
				isCustom: false,
				pdfLink: "",
				rules: parserFuncs.rules(data, K4ItemType.darksecret, listLocs),
				results: parserFuncs.results(data, K4ItemType.darksecret, listLocs)
			}
		};
		return newData;
	}
};

function getAllData(data: Record<any,any> = UNMIGRATED_DATA): Record<key,ItemMigrationData> {
	const items = Object.values(data);
	const derivedMoves = items.map((item) => item.moves || []).flat();
	const derivedAttacks = items.map((item) => item.attacks || []).flat();
	return {
		...toDict(items, "name"),
		...toDict(derivedMoves, "name"),
		...toDict(derivedAttacks, "name")
	};
}

function checkJSON(tests: Record<string, Array<(iData: ItemMigrationData) => boolean>>, data: Record<string,ItemMigrationData> = UNMIGRATED_DATA) {
	const resultReport: Record<string,Record<string,ItemMigrationData>> = {};
	Object.entries(tests).forEach(([testName, testFuncs]) => {
		let validItems = Object.values(cleanData(data));
		testFuncs.forEach((testFunc) => {
			validItems = validItems.filter(testFunc);
		});
		resultReport[testName] = toDict(validItems, "name");
	});
	return resultReport;
}

function mapJSON(keys: key[], data: Record<string,ItemMigrationData> = UNMIGRATED_DATA) {
	// @ts-expect-error Just testing;
	return Object.fromEntries(Object.entries(data).map(([name, iData]) => {
		const flatData = flattenObject(iData);
		const newData: Record<any,any> = {};
		let hasData = false;
		keys.forEach((key) => {
			if (flatData[key]) {
				hasData = true;
				newData[key as KeyOf<typeof newData>] = flatData[key];
			}
		});
		return hasData ? [name, newData] : false;
	})
		.filter(Boolean));
}

function groupJSON<T>(
	groupTests: Record<string, (iData: T) => boolean>,
	data: Record<any,any> = UNMIGRATED_DATA,
	isFilteringEmpty = false
): Record<key, Record<key, T>> {
	const groupedData: Record<key, T[]> = Object.fromEntries([
		...Object.keys(groupTests).map((key) => [key, []]),
		["UNGROUPED", []]
	]);
	Object.entries(data).forEach(([, iData]) => {
		let isGrouped = false;
		Object.entries(groupTests).forEach(([testKey, testFunc]) => {
			if (testFunc(iData)) {
				isGrouped = true;
				groupedData[testKey].push(iData);
			}
		});
		if (!isGrouped) {
			groupedData.UNGROUPED.push(iData);
		}
	});
	if (isFilteringEmpty) {
		Object.keys(groupedData).forEach((key) => {
			if (Object.values(groupedData[key]).length === 0) {
				delete groupedData[key];
			}
		});
	}
	return U.objMap(groupedData, (val: ItemMigrationData[]) => toDict(val, "name")) as Record<key, Record<key, ItemMigrationData>>;
}

function confirmList(iData: ItemMigrationData): {master: Array<Record<string,any>>, results: Array<Record<string,any>>} {
	// Flatten the data object
	const flatData = flattenObject(iData);
	// Collect any lists in the master lists object, stringifying the values
	const masterLists = Object.fromEntries([
		"lists.options.items",
		"lists.edges.items",
		"lists.questions.items",
		"lists.complications.items",
		"lists.gmoptions.items",
		"lists.watchers.items",
		"lists.drives.items",
		"lists.expertise.items"
	]
		.filter((flatKey) => Array.isArray(flatData[flatKey]) && flatData[flatKey].length)
		.map((flatKey) => [flatKey, flatData[flatKey].join("|")]));

	// Do the same for the three results lists and lists found in the static effect section
	const resultLists = Object.fromEntries([
		"results.fail.list",
		"results.partial.list",
		"results.success.list"
	]
		.filter((flatKey) => Array.isArray(flatData[flatKey]) && flatData[flatKey].length)
		.map((flatKey) => [flatKey, flatData[flatKey].join("|")]));

	// Get a list of registered lists under the optionsLists
	const registeredLists = [
		"results.fail.optionsLists",
		"results.partial.optionsLists",
		"results.success.optionsLists",
		"effect.optionsLists"
	]
		.map((flatKey) => flatData[flatKey])
		.filter(Boolean)
		.flat();

	const missingListData: {master: Array<Record<string,any>>, results: Array<Record<string,any>>} = {master: [], results: []};
	if (Object.values(masterLists).length + Object.values(resultLists).length === 0) { return missingListData }

	if (Object.values(resultLists).length) {
		Object.entries(resultLists).forEach(([listKey, listStr]) => {
			if (!Object.values(masterLists).includes(listStr)) {
				const shortKey = listKey.replace(/^.*?\.(.*?)\..*?$/, "$1");
				missingListData.master.push({
					name: iData.name,
					shortKey,
					listText: iData.results[shortKey].text,
					listStr,
					iData
				});
			}
		});
	}

	if (Object.values(masterLists).length) {
		Object.entries(masterLists).forEach(([listKey, listStr]) => {
			const shortKey = listKey.replace(/^.*?\.(.*?)\..*?$/, "$1");
			if (!registeredLists.includes(shortKey) && !Object.values(resultLists).includes(listStr)) {
				missingListData.results.push({
					name: iData.name,
					listKey,
					listStr,
					iData
				});
			}
		});
	}

	return missingListData;
}

function parseResultListReferences(iData: ItemMigrationData): ItemMigrationData {

	// Flatten the data object
	const flatData = flattenObject(iData);
	// Collect any lists in the master lists object, stringifying the values
	const masterLists = Object.fromEntries([
		"lists.options.items",
		"lists.edges.items",
		"lists.questions.items",
		"lists.complications.items",
		"lists.gmoptions.items",
		"lists.drives.items",
		"lists.watchers.items"
	]
		.filter((flatKey) => Array.isArray(flatData[flatKey]) && flatData[flatKey].length)
		.map((flatKey) => [flatKey, flatData[flatKey].join("|")]));

	// Do the same for the three results lists and lists found in the static effect section
	const resultLists = Object.fromEntries([
		"results.fail.list",
		"results.partial.list",
		"results.success.list"
	]
		.filter((flatKey) => Array.isArray(flatData[flatKey]) && flatData[flatKey].length)
		.map((flatKey) => [flatKey, flatData[flatKey].join("|")]));

	// For each result type, create references to the corresponding master list.
	["success", "partial", "fail"].forEach((shortKey) => {
		const listStr = resultLists[`results.${shortKey}.list`];
		const masterKey = Object.keys(masterLists).find((key) => masterLists[key] === listStr);
		if (masterKey) {
			const [, listRef] = masterKey.split(".");
			iData.results[shortKey].optionsLists ??= [];
			iData.results[shortKey].optionsLists.push(listRef);
		}
	});

	// If the item has Edges, add a reference to Edges in the main effect field
	if (iData.hasEdges) {
		iData.effect.optionsLists ??= [];
		iData.effect.optionsLists.push("edges");
	}

	return iData;
	/*

	const missingListData: {master: Array<Record<string,any>>, results: Array<Record<string,any>>} = {master: [], results: []};
	if (Object.values(masterLists).length + Object.values(resultLists).length === 0) { return missingListData }

	if (Object.values(resultLists).length) {
		Object.entries(resultLists).forEach(([listKey, listStr]) => {
			if (!Object.values(masterLists).includes(listStr)) {
				const shortKey = listKey.replace(/^.*?\.(.*?)\..*?$/, "$1");
				missingListData.master.push({
					name: iData.name,
					shortKey,
					listText: iData.results[shortKey].text,
					listStr,
					iData
				});
			}
		});
	}

	if (Object.values(masterLists).length) {
		Object.entries(masterLists).forEach(([listKey, listStr]) => {
			if (!Object.values(resultLists).includes(listStr)) {
				missingListData.results.push({
					name: iData.name,
					listKey,
					listStr,
					iData
				});
			}
		});
	}

	return missingListData; */
}

function changeAllData(iFunc: (iData: ItemMigrationData) => ItemMigrationData, data = UNMIGRATED_DATA): Record<key, ItemMigrationData> {
	let newData = changeData(iFunc, data);
	newData = changeMoveData(iFunc, newData);
	newData = changeAttackData(iFunc, newData);
	return newData;
}

function changeData(iFunc: (iData: ItemMigrationData) => ItemMigrationData, data = UNMIGRATED_DATA): Record<key, ItemMigrationData> {
	return toDict((Object.values(data) as unknown as ItemMigrationData[]).map(iFunc), "name");
}

function changeMoveData(mFunc: (mData: ItemMigrationData) => ItemMigrationData, data = UNMIGRATED_DATA): Record<key,ItemMigrationData> {
	function changeMove(iData: ItemMigrationData) {
		if (iData.type === "move") {
			iData = mFunc(iData);
		}
		if (iData.moves && iData.moves.length) {
			iData.moves = iData.moves.map(mFunc);
		}
		return iData;
	}
	return toDict((Object.values(data) as unknown as ItemMigrationData[]).map(changeMove), "name");
}

function changeAttackData(aFunc: (aData: ItemMigrationData) => ItemMigrationData, data = UNMIGRATED_DATA): Record<key,ItemMigrationData> {
	function changeAttack(iData: ItemMigrationData) {
		if (iData.type === "attack") {
			iData = aFunc(iData);
		}
		if (iData.attacks && iData.attacks.length) {
			iData.attacks = iData.attacks.map(aFunc);
		}
		return iData;
	}

	return toDict((Object.values(data) as unknown as ItemMigrationData[]).map(changeAttack), "name");
}

export function cleanData<T>(data: T, remVals: Array<false|null|undefined|""|0|Record<string,never>|never[]> = [undefined,null,"",{},[]]): T | Partial<T> | "KILL" {
	const remStrings = remVals.map((rVal) => JSON.stringify(rVal));
	if (remStrings.includes(JSON.stringify(data)) || remVals.includes(data as ValueOf<typeof remVals>)) { return "KILL" }
	if (Array.isArray(data)) {
		const newData = data.map((elem) => cleanData(elem, remVals))
			.filter((elem) => elem !== "KILL") as T & any[];
		return newData.length ? newData : "KILL";
	}
	if (data && typeof data === "object" && JSON.stringify(data).startsWith("{")) {
		const newData = Object.entries(data)
			.map(([key, val]) => [key, cleanData(val, remVals)])
			.filter(([, val]) => val !== "KILL");
		return newData.length ? Object.fromEntries(newData) : "KILL";
	}
	return data;
}

export const GROUPED_DATA = Object.fromEntries(Object.keys(C.ItemTypes).map((iType) => [
	iType,
	groupJSON({
		"active-rolled": (iData: ItemMigrationData) => iData.subType === "active-rolled",
		"active-static": (iData: ItemMigrationData) => iData.subType === "active-static",
		"passive": (iData: ItemMigrationData) => iData.subType === "passive"
	}, U.objFilter(getAllData(), (iData: ItemMigrationData) => iData.type === iType))
]));

export default function MIGRATE_ITEM_DATA() {
	const ALL_DATA = getAllData();
	console.log("ALL_DATA (cleaned)", cleanData(ALL_DATA));

	const ITEM_GROUPS = Object.fromEntries(Object.keys(C.ItemTypes).map((iType) => [
		iType,
		groupJSON({
			"active-rolled": (iData: ItemMigrationData) => iData.subType === "active-rolled",
			"active-static": (iData: ItemMigrationData) => iData.subType === "active-static",
			"passive": (iData: ItemMigrationData) => iData.subType === "passive"
		}, U.objFilter(ALL_DATA, (iData: ItemMigrationData) => iData.type === iType))
	]));

	console.log("All_DATA (cleaned, grouped)", cleanData(ITEM_GROUPS));

	/* Comment out this line to activate data mutation.

	const changedDataReport: string[] = [];
	const newData = changeAllData((iData) => {

		return iData;
	});
	console.log("NEW DATA JSON", newData);
	console.log("CHANGES REPORT", changedDataReport);

	// */

	const missingFromMasterLists: Record<string,any> = {};
	const missingFromResultLists: Record<string,any> = {};
	const MISSING_LISTS = toDict(Object.entries(ALL_DATA).filter(([nameKey, iData]) => {
		const {
			master,
			results
		} = confirmList(iData);

		if (master.length) { missingFromMasterLists[nameKey] = master }
		if (results.length) { missingFromResultLists[nameKey] = results }

		return Boolean(master.length + results.length);
	})
		.map(([, iData]) => iData), "name");

	Object.values(cleanData(mapJSON(["effect.effect"], ALL_DATA)))
		.map((effectData) => effectData["effect.effect"]);


	console.log("*** REPORTS ***", {
		"Keys with Array Values": U.unique(Object.values(ALL_DATA)
			.map((iData) => Object.keys(flattenObject(iData))
				.filter((key) => Array.isArray(flattenObject(iData)[key])))
			.flat()),
		"data.note Values": cleanData(mapJSON(["notes"], ALL_DATA)),
		"data.effect.effect Values": cleanData(mapJSON(["effect.effect"], ALL_DATA)),
		"Effects List": Object.values(cleanData(mapJSON(["effect.effect"], ALL_DATA)))
			.map((effectData) => effectData["effect.effect"]),
		"Missing Lists": {
			missingFromMasterLists,
			missingFromResultLists,
			MISSING_LISTS,
			Grouped: groupJSON({
				"Is Active-Rolled": (iData: any) => iData.subType === "active-rolled",
				"Is Active-Static": (iData: any) => iData.subType === "active-static",
				"Is Passive": (iData: any) => iData.subType === "passive"
			}, MISSING_LISTS)
		}
	});

	console.log("INCOMING MIGRATION DATA", cleanData(UNMIGRATED_DATA));

	const DATA = Object.values(UNMIGRATED_DATA);

	let migratedData = DATA.map((iData: ItemMigrationData): K4ItemData | false => {
		iData = expandObject(iData);

		if (["relation", "weapon", "gear"].includes(iData.type)) { return false }

		return PARSERS[iData.type as KeyOf<typeof PARSERS>](iData);
	}).filter(Boolean) as K4ItemData[];

	// Filter out unwanted traits from migratedData
	migratedData = migratedData.map(({name, type, data, img}: K4ItemData) => ({name, type, data, img})) as K4ItemData[];

	// Prepare console printout of grouped and sorted migratedData
	const CONSTRUCTORDATA = Object.fromEntries(Object.values(K4ItemType).map((iType) => [iType, U.objMap(
		groupJSON({
			[K4ItemSubType.activeRolled]: (iData: K4ItemData<typeof iType>) => iData.data.subType === K4ItemSubType.activeRolled,
			[K4ItemSubType.activeStatic]: (iData: K4ItemData<typeof iType>) => iData.data.subType === K4ItemSubType.activeStatic,
			[K4ItemSubType.passive]: (iData: K4ItemData<typeof iType>) => iData.data.subType === K4ItemSubType.passive
		}, U.objFilter(migratedData, (iData: K4ItemData) => iData.type === iType), true),
		(itemDict: Record<string,K4ItemData>) => U.objMap(itemDict, ({name, type, img, data}: K4ItemData) => ({name, type, img, data}))
	)
	]));
	console.log("OUTGOING MIGRATION DATA", CONSTRUCTORDATA);

	// testOutgoingData(migratedData);
	return CONSTRUCTORDATA;
}