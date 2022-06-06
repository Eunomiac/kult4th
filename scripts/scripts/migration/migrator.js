import C from "../constants.js";
import U from "../utilities.js";
import { DATA_JSON } from "./migrationData.js";
import { K4ItemType, K4ItemSubType } from "../../documents/K4Item.js";
function stringToNum(numString) {
    if (/^\d+$/.test(`${numString}`)) {
        return parseInt(`${numString}`);
    }
    if (`${numString}`.match(/\bone\b/i)) {
        return 1;
    }
    if (`${numString}`.match(/\btwo\b/i)) {
        return 2;
    }
    if (`${numString}`.match(/\bthree\b/i)) {
        return 3;
    }
    return 0;
    // throw new Error(`Bad Number String: '${numString}'`);
}
function toDict(items, key) {
    const dict = {};
    const mappedItems = items
        .map((data) => {
        let { iData } = data;
        if (!iData) {
            iData = data;
        }
        return [
            `${(iData.linkName || iData.sourceItem?.name) ? `>${iData.type.charAt(0)}>` : ""}${iData[key]}`,
            iData
        ];
    })
        .sort(([a], [b]) => a.localeCompare(b));
    mappedItems.forEach(([newKey, iData]) => {
        if (newKey in dict) {
            newKey = indexString(newKey);
        }
        dict[newKey] = iData;
    });
    // @ts-expect-error Oh it definitely does.
    return dict;
    function indexString(str) {
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
const parserFuncs = {
    lists: (data) => {
        const listData = {
            listDefs: data.lists,
            listLocs: {
                staticSuccess: U.unique(data.subType !== "passive" ? (data.effect.optionsLists ?? []) : []),
                completeSuccess: U.unique(data.results?.success?.optionsLists ?? []),
                partialSuccess: U.unique(data.results?.partial?.optionsLists ?? []),
                failure: U.unique(data.results?.fail?.optionsLists ?? []),
                passive: U.unique(data.subType === "passive" ? (data.effect.optionsLists ?? []) : [])
            }
        };
        return listData;
    },
    rules: (data, type, listLocs) => {
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
            default: return false;
        }
    },
    results: (data, type, listLocs) => {
        const genericResult = {
            result: "",
            optionsLists: [],
            effectFunctions: [],
            edges: 0,
            hold: 0
        };
        function parseResults(resultType) {
            if (data.subType === "passive") {
                return genericResult;
            }
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
                const { text } = data.results[migKey[resultType]];
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
        const results = {};
        switch (type) {
            case K4ItemType.move: {
                results.staticSuccess = parseResults("staticSuccess");
                // falls through
            }
            case K4ItemType.attack: {
                results.completeSuccess = parseResults("completeSuccess");
                results.partialSuccess = parseResults("partialSuccess");
                results.failure = parseResults("failure");
                return results;
            }
            case K4ItemType.advantage:
            case K4ItemType.disadvantage: {
                return { staticSuccess: parseResults("staticSuccess") };
            }
            case K4ItemType.darksecret:
            case K4ItemType.relation:
            case K4ItemType.weapon:
            case K4ItemType.gear: {
                return {};
            }
            default: return false;
        }
    }
};
const PARSERS = {
    move: (data) => {
        const { listDefs, listLocs } = parserFuncs.lists(data);
        const newData = {
            // isMigrated: true, // Activate ONLY when you're sure all the data is transferred over!
            name: data.name,
            type: "move",
            img: data.img,
            data: {
                subType: data.subType,
                attribute: data.attributemod || "0",
                description: "",
                notes: data.notes,
                lists: listDefs,
                subItems: data.attacks ?? [],
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
        return newData;
    },
    attack: (data) => {
        const { listDefs, listLocs } = parserFuncs.lists(data);
        const newData = {
            // isMigrated: true, // Activate ONLY when you're sure all the data is transferred over!
            name: data.name,
            type: "attack",
            img: data.img,
            data: {
                subType: data.subType,
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
        return newData;
    },
    advantage: (data) => {
        const { listDefs, listLocs } = parserFuncs.lists(data);
        const newData = {
            // isMigrated: true, // Activate ONLY when you're sure all the data is transferred over!
            name: data.name,
            type: "advantage",
            img: data.img,
            data: {
                subType: data.subType,
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
    disadvantage: (data) => {
        const { listDefs, listLocs } = parserFuncs.lists(data);
        const newData = {
            // isMigrated: true, // Activate ONLY when you're sure all the data is transferred over!
            name: data.name,
            type: "disadvantage",
            img: data.img,
            data: {
                subType: data.subType,
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
    darksecret: (data) => {
        const { listDefs, listLocs } = parserFuncs.lists(data);
        const newData = {
            // isMigrated: true, // Activate ONLY when you're sure all the data is transferred over!
            name: data.name,
            type: "darksecret",
            img: data.img,
            data: {
                subType: "passive",
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
                rules: parserFuncs.rules(data, K4ItemType.darksecret, listLocs)
            }
        };
        return newData;
    }
};
function getAllData(data = DATA_JSON) {
    const items = Object.values(data);
    const derivedMoves = items.map((item) => item.moves || []).flat();
    const derivedAttacks = items.map((item) => item.attacks || []).flat();
    return {
        ...toDict(items, "name"),
        ...toDict(derivedMoves, "name"),
        ...toDict(derivedAttacks, "name")
    };
}
function checkJSON(tests, data = DATA_JSON) {
    const resultReport = {};
    Object.entries(tests).forEach(([testName, testFuncs]) => {
        let validItems = Object.values(cleanData(data));
        testFuncs.forEach((testFunc) => {
            validItems = validItems.filter(testFunc);
        });
        resultReport[testName] = toDict(validItems, "name");
    });
    return resultReport;
}
function mapJSON(keys, data = DATA_JSON) {
    // @ts-expect-error Just testing;
    return Object.fromEntries(Object.entries(data).map(([name, iData]) => {
        const flatData = flattenObject(iData);
        const newData = {};
        let hasData = false;
        keys.forEach((key) => {
            if (flatData[key]) {
                hasData = true;
                newData[key] = flatData[key];
            }
        });
        return hasData ? [name, newData] : false;
    })
        .filter(Boolean));
}
function groupJSON(groupTests, data = DATA_JSON, isFilteringEmpty = false) {
    const groupedData = Object.fromEntries([
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
    return U.objMap(groupedData, (val) => toDict(val, "name"));
}
function confirmList(iData) {
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
    const missingListData = { master: [], results: [] };
    if (Object.values(masterLists).length + Object.values(resultLists).length === 0) {
        return missingListData;
    }
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
function parseResultListReferences(iData) {
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
function changeAllData(iFunc, data = DATA_JSON) {
    let newData = changeData(iFunc, data);
    newData = changeMoveData(iFunc, newData);
    newData = changeAttackData(iFunc, newData);
    return newData;
}
function changeData(iFunc, data = DATA_JSON) {
    return toDict(Object.values(data).map(iFunc), "name");
}
function changeMoveData(mFunc, data = DATA_JSON) {
    function changeMove(iData) {
        if (iData.type === "move") {
            iData = mFunc(iData);
        }
        if (iData.moves && iData.moves.length) {
            iData.moves = iData.moves.map(mFunc);
        }
        return iData;
    }
    return toDict(Object.values(data).map(changeMove), "name");
}
function changeAttackData(aFunc, data = DATA_JSON) {
    function changeAttack(iData) {
        if (iData.type === "attack") {
            iData = aFunc(iData);
        }
        if (iData.attacks && iData.attacks.length) {
            iData.attacks = iData.attacks.map(aFunc);
        }
        return iData;
    }
    return toDict(Object.values(data).map(changeAttack), "name");
}
function cleanData(data, remVals = [undefined, null, "", {}, []]) {
    const remStrings = remVals.map((rVal) => JSON.stringify(rVal));
    if (remStrings.includes(JSON.stringify(data))) {
        return "KILL";
    }
    if (Array.isArray(data)) {
        const newData = data.map((elem) => cleanData(elem, remVals))
            .filter((elem) => elem !== "KILL");
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
export default function MIGRATE_ITEM_DATA() {
    const ALL_DATA = getAllData();
    console.log("ALL_DATA (cleaned)", cleanData(ALL_DATA));
    const ITEM_GROUPS = Object.fromEntries(Object.keys(C.ItemTypes).map((iType) => [
        iType,
        groupJSON({
            "Is Active-Rolled": (iData) => iData.subType === "active-rolled",
            "Is Active-Static": (iData) => iData.subType === "active-static",
            "Is Passive": (iData) => iData.subType === "passive"
        }, U.objFilter(ALL_DATA, (iData) => iData.type === iType))
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
    const missingFromMasterLists = {};
    const missingFromResultLists = {};
    const MISSING_LISTS = toDict(Object.entries(ALL_DATA).filter(([nameKey, iData]) => {
        const { master, results } = confirmList(iData);
        if (master.length) {
            missingFromMasterLists[nameKey] = master;
        }
        if (results.length) {
            missingFromResultLists[nameKey] = results;
        }
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
                "Is Active-Rolled": (iData) => iData.subType === "active-rolled",
                "Is Active-Static": (iData) => iData.subType === "active-static",
                "Is Passive": (iData) => iData.subType === "passive"
            }, MISSING_LISTS)
        }
    });
    console.log("INCOMING MIGRATION DATA", cleanData(DATA_JSON));
    const DATA = Object.values(DATA_JSON);
    let migratedData = DATA.map((iData) => {
        iData = expandObject(iData);
        if (["relation", "weapon", "gear"].includes(iData.type)) {
            return false;
        }
        return PARSERS[iData.type](iData);
    }).filter(Boolean);
    // Filter out unwanted traits from migratedData
    migratedData = migratedData.map(({ name, type, data, img }) => ({ name, type, data, img }));
    // Prepare console printout of grouped and sorted migratedData
    const CONSTRUCTORDATA = Object.fromEntries(Object.values(K4ItemType).map((iType) => [iType, U.objMap(groupJSON({
            [K4ItemSubType.activeRolled]: (iData) => iData.data.subType === K4ItemSubType.activeRolled,
            [K4ItemSubType.activeStatic]: (iData) => iData.data.subType === K4ItemSubType.activeStatic,
            [K4ItemSubType.passive]: (iData) => iData.data.subType === K4ItemSubType.passive
        }, U.objFilter(migratedData, (iData) => iData.type === iType), true), (itemDict) => U.objMap(itemDict, ({ name, type, img, data }) => ({ name, type, img, data })))
    ]));
    console.log("OUTGOING MIGRATION DATA", CONSTRUCTORDATA);
    // testOutgoingData(migratedData);
    return migratedData;
}
