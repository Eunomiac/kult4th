import C from "../constants.js";
import U from "../utilities.js";
import { DATA_JSON } from "./migrationData.js";
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
        .map((iData) => [
        `${(iData.linkName || iData.sourceItem?.name) ? `>${iData.type.charAt(0)}>` : ""}${iData[key]}`,
        iData
    ])
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
const PARSERS = {
    move: (data) => {
        const newData = {
            name: data.name,
            type: "move",
            img: data.img,
            data: {
                description: "",
                intro: data.effect.intro,
                trigger: data.effect.trigger,
                outro: data.effect.effect,
                attribute: data.attributemod,
                notes: data.notes,
                subType: "active-rolled",
                effectFunctions: [],
                attacks: data.attacks ?? [],
                moves: [],
                completeSuccess: {
                    result: "",
                    optionsLists: [],
                    effectFunctions: [],
                    edges: 0,
                    hold: 0
                },
                partialSuccess: {
                    result: "",
                    optionsLists: [],
                    effectFunctions: [],
                    edges: 0,
                    hold: 0
                },
                failure: {
                    result: "",
                    optionsLists: [],
                    effectFunctions: [],
                    edges: 0,
                    hold: 0
                },
                lists: {},
                sourceItem: {
                    name: data.linkName ?? "",
                    id: "",
                    type: data.linkType ?? ""
                },
                isCustom: true,
                holdText: "",
                pdfLink: ""
            }
        };
        const moveType = getMoveType(data);
        if (moveType) {
            newData.data.subType = moveType;
        }
        return newData;
    }
};
function getMoveType(data) {
    if (["active-rolled", "active-static", "passive"].includes(data.subType)) {
        return data.subType;
    }
    else {
        console.warn("Unable to Determine Move Type", data);
        return false;
    }
    if (data.moveType === "static") {
        if (data.activePassive === "passive") {
            return "passive";
        }
        else if (data.activePassive === "active") {
            return "active-static";
        }
    }
    else if (data.moveType === "roll" && data.activePassive === "active") {
        return "active-rolled";
    }
    else if (!data.sourceItem && !data.linkName) {
        return "active-rolled";
    }
}
/*
const PARSERS = {
    move: (data: ItemMigrationData) => {
        data = JSON.parse(JSON.stringify(data));
        data.itemType = "move";
        if (!data.linkName) {
            delete data.moves;
            delete data.record.moves;
        }
        const {record} = data;
        const newData = {
            ...{
                "name": data.name,
                "type": "move",
                "img": "",
                "data.description": "",
                "data.intro": "",
                "data.trigger": "",
                "data.outro": "",
                "data.attribute": "",
                "data.notes": "",
                "data.moveType": "active-rolled",
                "data.staticSuccess": {
                    result: "",
                    optionsLists: [],
                    effectFunctions: [],
                    edges: 0,
                    hold: 0
                },
                "data.completeSuccess": {
                    result: "",
                    optionsLists: [],
                    effectFunctions: [],
                    edges: 0,
                    hold: 0
                },
                "data.partialSuccess": {
                    result: "",
                    optionsLists: [],
                    effectFunctions: [],
                    edges: 0,
                    hold: 0
                },
                "data.failure": {
                    result: "",
                    optionsLists: [],
                    effectFunctions: [],
                    edges: 0,
                    hold: 0
                },
                "data.lists": {},
                "data.sourceItem": {
                    name: data.linkName ?? "",
                    id: "",
                    type: data.linkType ?? ""
                },
                "data.isCustom": true,
                "data.holdText": "",
                "data.pdfLink": ""
            },
            ...{
                "name": data.moveName || data.name,
                "type": "move",
                "img": imgCheck(data),
                "data.attributemod": data.attributemod ?? "none",
                "data.completesuccess": resultCheck(data.results.success, data),
                "data.partialsuccess": resultCheck(data.results.partial, data),
                "data.failure": resultCheck(data.results.fail, data),
                "data.trigger": descriptionCheck(data),
                "data.specialflag": {
                    "keep it together": 1,
                    "see through the illusion": 2,
                    "endure injury": 3
                }[data.name.toLowerCase()] ?? 0
            },
            ...data.linkName
                ? {
                        "flags.kult4eoverrides.linkName": data.linkName,
                        "flags.kult4eoverrides.linkType": data.linkType
                    }
                : {},
            "flags.kult4eoverrides.trigger": data.trigger,
            "flags.kult4eoverrides.isRolled": data.moveType === "roll",
            "flags.kult4eoverrides.moveType": data.moveType,
            "flags.kult4eoverrides.isFrozen": true,
            "record": {
                ...data.record,
                name: data.moveName || data.name || data.linkName,
                attributemod: data.attributemod ?? "none"
            }
        };
        if (!newData.name) {
            console.log("Error finding name from data:", data);
        }
        return newData;
    },
    attack: (data) => {
        data = JSON.parse(JSON.stringify(data));
        data.itemType = "attack";
        const newData = {
            ...{
                "name": data.name,
                "type": "attack",
                "img": imgCheck(data),
                "data.harm": data.harm,
                "data.range": data.range,
                "data.ammo": data.ammo,
                "data.special": data.effect
            },
            ...data.sourceItem?.name
                ? {
                        "flags.kult4eoverrides.linkName": data.sourceItem?.name,
                        "flags.kult4eoverrides.linkType": data.sourceItem?.itemType
                    }
                : {},
            "flags.kult4eoverrides.isRolled": true,
            "flags.kult4eoverrides.moveType": "roll",
            "flags.kult4eoverrides.isFrozen": true,
            "record": data.record
        };
        if (!newData.name) {
            console.log("Error finding name from data:", data);
        }
        return newData;
    },
    advantage: (data) => ({
        "name": data.name,
        "type": "advantage",
        "img": imgCheck(data),
        "data.attributemod": data.attributemod ?? "none",
        "data.type": data.type,
        "data.description": descriptionCheck(data),
        "data.effect": descriptionCheck(data),
        "data.tokens": data.hasTokens ? 0 : "",
        "data.hasTokens": data.hasTokens,
        "data.completesuccess": "",
        "data.partialsuccess": "",
        "data.failure": "",
        "flags.kult4eoverrides.moves": data.moves ?? [],
        "flags.kult4eoverrides.attacks": data.attacks ?? [],
        "flags.kult4eoverrides.isFrozen": true,
        "record": {
            ...data.record,
            attributemod: data.attributemod ?? "none"
        }
    }),
    disadvantage: (data) => ({
        "name": data.name,
        "type": "disadvantage",
        "img": imgCheck(data),
        "data.attributemod": data.attributemod ?? "none",
        "data.type": data.type,
        "data.description": descriptionCheck(data),
        "data.effect": descriptionCheck(data),
        "data.tokens": data.hasTokens ? 0 : "",
        "data.hasTokens": data.hasTokens,
        "data.completesuccess": "",
        "data.partialsuccess": "",
        "data.failure": "",
        "flags.kult4eoverrides.moves": data.moves ?? [],
        "flags.kult4eoverrides.attacks": data.attacks ?? [],
        "flags.kult4eoverrides.isFrozen": true,
        "record": {
            ...data.record,
            attributemod: data.attributemod ?? "none"
        }
    }),
    weapon: (data) => ({
        "name": data.name,
        "type": "weapon",
        "img": imgCheck(data),
        "data.special": descriptionCheck(data),
        "data.harm": data.attacks[0].harm,
        "data.range": data.attacks[0].range,
        "data.ammo.value": data.ammo,
        "data.ammo.min": 0,
        "data.ammo.max": data.ammo,
        "flags.kult4eoverrides.moves": data.moves ?? [],
        "flags.kult4eoverrides.attacks": data.attacks ?? [],
        "flags.kult4eoverrides.type": data.type,
        "flags.kult4eoverrides.isFrozen": true,
        "record": data.record
    }),
    darksecret: (data) => ({
        "name": data.name,
        "type": "darksecret",
        "img": imgCheck(data),
        "data.description": descriptionCheck(data),
        "data.effect": "",
        "flags.kult4eoverrides.isFrozen": true,
        "record": data.record
    }),
    relationship: (data) => ({
        "name": data.name,
        "type": "relationship",
        "img": imgCheck(data),
        "target": "",
        "strength": "",
        "flags.kult4eoverrides.isFrozen": true,
        "record": data.record
    }),
    gear: (data) => ({
        "name": data.name,
        "type": "gear",
        "img": imgCheck(data),
        "uses": "",
        "description": "",
        "flags.kult4eoverrides.isFrozen": true,
        "record": data.record
    })
};
 */
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
    let validItems = Object.values(data);
    tests.forEach((testFunc) => {
        validItems = validItems.filter(testFunc);
    });
    return toDict(validItems, "name");
}
function mapJSON(keys, data = DATA_JSON) {
    return toDict(Object.values(data).map((iData) => {
        const flatData = flattenObject(iData);
        const newData = {};
        keys.forEach((key) => {
            newData[key] = flatData[key];
        });
        return expandObject(newData);
    }), "name");
}
function groupJSON(groupTests, data = DATA_JSON) {
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
    return U.objMap(groupedData, (val) => toDict(val, "name"));
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
const migrateData = (iData) => {
    iData = expandObject(iData);
    if (iData.type === "move") {
        return PARSERS.move(iData);
    }
    else if (iData.moves && iData.moves.length) {
        iData.moves = iData.moves.map(PARSERS.move);
    }
    return iData;
    const mData = {
        name: iData.name,
        type: iData.type,
        img: iData.img,
        data: {
            isCustom: false
        }
    };
    switch (iData.type) {
        case "attack": {
            break;
        }
        case "move": {
            mData.name = iData.moveName || iData.name || iData.linkName || " ??? ";
            mData.data.intro = iData.effect.intro;
            mData.data.trigger = iData.effect.trigger;
            mData.data.outro = iData.effect.effect;
            mData.data.attribute = iData.attributemod;
            mData.data.notes = iData.notes;
            if (iData.activePassive === "passive") {
                mData.data.passiveEffect = {
                    optionsLists: iData.suffix.list === "" ? [] : ["other_watchers"],
                    suffix: iData.suffix.text.match(/Hold/) ? "" : iData.suffix.text
                };
                mData.data.isActive = false;
            }
            else {
                let edges = stringToNum((iData.results.success.text.match(/([^\s]+) Edge/) ?? [])[1] || 0), hold = stringToNum((iData.results.success.text.match(/([^\s]+) Hold/) ?? [])[1] || 0);
                mData.data.completeSuccess = {
                    result: iData.results.success.text,
                    optionsLists: [
                        (iData.lists.questions !== ""
                            && iData.results.success.text.match(/sk\s+[a-z]+\s+question/))
                            ? "questions"
                            : null,
                        (iData.lists.options !== ""
                            && iData.results.success.text.match(/hoose\s+[a-z]+\s+option/))
                            ? "options"
                            : null,
                        (iData.lists.edges !== ""
                            && iData.results.success.text.match(/[^\s]+\s+Edge/))
                            ? "edges"
                            : null
                    ].filter((item) => Boolean(item)),
                    edges,
                    hold
                };
                edges = stringToNum((iData.results.partial.text.match(/([^\s]+) Edge/) ?? [])[1] || 0);
                hold = stringToNum((iData.results.partial.text.match(/([^\s]+) Hold/) ?? [])[1] || 0);
                mData.data.partialSuccess = {
                    result: iData.results.partial.text,
                    optionsLists: [
                        (iData.lists.questions !== ""
                            && iData.results.partial.text.match(/sk\s+[a-z]+\s+question/))
                            ? "questions"
                            : null,
                        (iData.lists.options !== ""
                            && iData.results.partial.text.match(/hoose\s+[a-z]+\s+option/))
                            ? "options"
                            : null,
                        (iData.lists.edges !== ""
                            && iData.results.partial.text.match(/[^\s]+\s+Edge/))
                            ? "edges"
                            : null
                    ].filter((item) => Boolean(item)),
                    edges,
                    hold
                };
                edges = stringToNum((iData.results.fail.text.match(/([^\s]+) Edge/) ?? [])[1] || 0);
                hold = stringToNum((iData.results.fail.text.match(/([^\s]+) Hold/) ?? [])[1] || 0);
                mData.data.failure = {
                    result: iData.results.fail.text,
                    optionsLists: [
                        (iData.lists.questions !== ""
                            && iData.results.fail.text.match(/sk\s+[a-z]+\s+question/))
                            ? "questions"
                            : null,
                        (iData.lists.options !== ""
                            && iData.results.fail.text.match(/hoose\s+[a-z]+\s+option/))
                            ? "options"
                            : null,
                        (iData.lists.edges !== ""
                            && iData.results.fail.text.match(/[^\s]+\s+Edge/))
                            ? "edges"
                            : null
                    ].filter((item) => Boolean(item)),
                    edges,
                    hold
                };
            }
            break;
        }
        // no default
    }
    mData._original = { ...iData };
    mData.data.lists = {};
    if (iData.lists) {
        Object.entries(iData.lists).forEach(([key, itemString]) => {
            if (itemString && typeof itemString === "string") {
                const items = itemString.split(/\|/).filter(Boolean);
                if (items.length) {
                    switch (key) {
                        case "gmoptions": {
                            mData.data.lists[key] = {
                                name: "GM Options",
                                items
                            };
                            break;
                        }
                        default: {
                            mData.data.lists[key] = {
                                name: U.tCase(key),
                                items
                            };
                            break;
                        }
                    }
                }
            }
        });
    }
    if (mData.data.lists.watchers) {
        mData.data.lists.watchers.intro = iData.suffix.listText;
    }
    if (iData.linkName) {
        mData.data.sourceItem = {
            id: "",
            type: iData.linkType,
            name: iData.linkName
        };
    }
    mData.data.canGrantHold = Boolean(iData.hasHolds);
    mData.data.holdText = (iData.suffix?.text && iData.suffix?.text.match(/Hold/)) ? iData.suffix.text : "";
    if (iData.moves?.length) {
        mData.data.moves = iData.moves.map(migrateData);
    }
    if (iData.attacks?.length) {
        mData.data.attacks = iData.attacks.map(migrateData);
    }
    return mData;
};
function getRangePhrase(rangeArray) {
    const rangeString = rangeArray.join("_");
    console.log(rangeString, C.Ranges[rangeString]);
    if (rangeString in C.Ranges) {
        return C.Ranges[rangeString];
    }
    console.error(`No range phrase for range: ${rangeArray.join("/")}`);
    return `When you engage an able opponent (range: ${rangeString}) in combat,`;
}
export default function MIGRATE_ITEM_DATA() {
    // Pull out the Engage-in-Combat template for Attacks
    const EICTemplate = DATA_JSON["!!AttackTemplate!!"];
    delete DATA_JSON["!!AttackTemplate!!"];
    const ALL_DATA = getAllData();
    console.log("ALL DATA", ALL_DATA);
    // const newData = changeAllData((iData) => {
    // 	if (["darksecret", "weapon"].includes(iData.type)) {
    // 		iData.subType = "passive";
    // 	}
    // 	if (iData.type === "attack") {
    // 		iData.special = iData.effect;
    // 		delete iData.effect;
    // 		iData.range = iData.range.split(/\//);
    // 		const newAttackData = {
    // 			...EICTemplate,
    // 			...iData
    // 		};
    // 		newAttackData.effect = {
    // 			effect: newAttackData.effect.effect.replace(/\$AMMO_AND\$/g, newAttackData.ammo ? `expend ${newAttackData.ammo} Ammo and ` : ""),
    // 			trigger: getRangePhrase(newAttackData.range),
    // 			intro: ""
    // 		},
    // 		// newAttackData.effect.trigger = ;
    // 		// console.log(`${iData.name} Range = ${iData.range.join("_")}`, {PHRASE: getRangePhrase(iData.range), TRIGGER: newAttackData.effect.trigger});
    // 		newAttackData.results.success.text = newAttackData.results.success.text.replace(/\$HARM\$/g, `${newAttackData.harm} Harm`);
    // 		newAttackData.results.partial.text = newAttackData.results.partial.text.replace(/\$HARM\$/g, `${newAttackData.harm} Harm`);
    // 		newAttackData.results.fail.text = newAttackData.results.fail.text.replace(/\$HARM\$/g, `${newAttackData.harm} Harm`);
    // 		console.log(`${newAttackData.name} NewAttackData =`, newAttackData);
    // 		return newAttackData;
    // 	}
    // 	return iData;
    // });
    const ITEM_GROUPS = groupJSON({
        "Is Active-Rolled": (iData) => iData.subType === "active-rolled",
        "Is Active-Static": (iData) => iData.subType === "active-static",
        "Is Passive": (iData) => iData.subType === "passive"
    }, ALL_DATA);
    // const attackRangeArray: Record<string,ItemMigrationData[]> = {};
    // Object.values(ALL_DATA)
    // 	.filter((iData) => iData.type === "attack")
    // 	.forEach((iData) => {
    // 		const {range} = iData;
    // 		attackRangeArray[String(range.join("/"))] ??= [];
    // 		attackRangeArray[String(range.join("/"))].push(iData);
    // 	});
    // const ATTACK_RANGES: Record<string, Record<string,ItemMigrationData>> = {};
    // Object.keys(attackRangeArray).forEach((rangeKey) => {
    // 	ATTACK_RANGES[rangeKey] = toDict(attackRangeArray[rangeKey], "name");
    // });
    console.log("SUBTYPE GROUPS", ITEM_GROUPS);
    // console.log("NEW JSON", newData);
    // Extract derived moves from DATA_JSON
    const derivedMoves = Object.values(DATA_JSON).map((iData) => ("moves" in iData ? iData.moves : [])).flat();
    const derivedAttacks = Object.values(DATA_JSON).map((iData) => ("attacks" in iData ? iData.attacks : [])).flat();
    const FULL_DATA = {
        JSON: DATA_JSON,
        DERIVED: toDict([
            ...derivedMoves,
            ...derivedAttacks
        ], "name")
    };
    // const checkData = {
    // 	AMMO: {
    // 		JSON: checkJSON([
    // 			(iData) => !["weapon", "attack", "gear"].includes(iData.type) && iData.ammo !== null
    // 		]),
    // 		DERIVED: checkJSON([
    // 			(iData) => !["weapon", "attack", "gear"].includes(iData.type) && iData.ammo !== null
    // 		], FULL_DATA.DERIVED)
    // 	},
    // 	ARMOR: {
    // 		JSON: checkJSON([
    // 			(iData) => iData.type !== "gear" && iData.armor !== undefined && iData.armor !== ""
    // 		]),
    // 		DERIVED: checkJSON([
    // 			(iData) => iData.type !== "gear" && iData.armor !== undefined && iData.armor !== ""
    // 		], FULL_DATA.DERIVED)
    // 	}
    // };
    // console.log("CONFIRMING DATA", checkData);
    // const newData = changeAllData((mData) => {
    // 	if (mData.attributemod === "none") {
    // 		mData.attributemod = "";
    // 	}
    // 	if (mData.effect?.effect) {
    // 		mData.effect.effect = mData.effect.effect.replace(/\[\[\[moveName\]\]\]/gi, "$MOVENAME$");
    // 		mData.effect.effect = mData.effect.effect.replace(/\[\[\[attrMod\]\]\]/gi, "$ATTRIBUTE$");
    // 		mData.effect.effect = mData.effect.effect.replace(/\+0/gi, "+$ATTRIBUTE$");
    // 		mData.effect.effect = mData.effect.effect.replace(/\+None/gi, "+$ATTRIBUTE$");
    // 		mData.effect.effect = mData.effect.effect.replace(/\+Violence/gi, "+$ATTRIBUTE$");
    // 		mData.effect.effect = mData.effect.effect.replace(/\+Willpower/gi, "+$ATTRIBUTE$");
    // 		mData.effect.effect = mData.effect.effect.replace(/\+Fortitude/gi, "+$ATTRIBUTE$");
    // 		mData.effect.effect = mData.effect.effect.replace(/\+Reflexes/gi, "+$ATTRIBUTE$");
    // 		mData.effect.effect = mData.effect.effect.replace(/\+Reason/gi, "+$ATTRIBUTE$");
    // 		mData.effect.effect = mData.effect.effect.replace(/\+Intuition/gi, "+$ATTRIBUTE$");
    // 		mData.effect.effect = mData.effect.effect.replace(/\+Perception/gi, "+$ATTRIBUTE$");
    // 		mData.effect.effect = mData.effect.effect.replace(/\+Coolness/gi, "+$ATTRIBUTE$");
    // 		mData.effect.effect = mData.effect.effect.replace(/\+Charisma/gi, "+$ATTRIBUTE$");
    // 		mData.effect.effect = mData.effect.effect.replace(/\+Soul/gi, "+$ATTRIBUTE$");
    // 	}
    // 	return mData;
    // });
    // console.log("NEWLY MUTATED DATA_JSON", newData);
    console.log("DERIVED", FULL_DATA.DERIVED);
    console.log("INCOMING MIGRATION DATA", FULL_DATA.JSON);
    const DATA = Object.values(FULL_DATA.JSON);
    testIncomingData(DATA);
    const migratedData = DATA.map(migrateData).filter(Boolean);
    console.log("OUTGOING MIGRATION DATA", migratedData);
    testOutgoingData(migratedData);
    return migratedData;
}
function cleanData(data) {
    const cData = JSON.parse(JSON.stringify(data));
    Object.entries(cData).forEach(([key, val]) => {
        if (val === 0 || val === false || val === null || val === undefined) {
            return;
        }
        if ((typeof val === "string" && !val)
            || (Array.isArray(val) && val.length === 0)
            || (/^\{\s*\}$/.test(JSON.stringify(val)))) {
            delete cData[key];
            return;
        }
        if (/^\{/.test(JSON.stringify(val))) {
            cData[key] = cleanData(val);
        }
    });
    return cData;
}
function testIncomingData(DATA) {
    const cData = DATA.map(cleanData);
    // Separate "active" and "passive" types
    const activeData = cData.filter((iData) => iData.type === "active");
    const passiveData = cData.filter((iData) => iData.type === "passive");
    // Extract Derived Moves and Attacks from NON-Move Items
    // const nonMoveData = DATA.filter((iData) => iData.itemType !== "move");
    const derivedMoves = cData.map((iData) => iData.moves || []).flat();
    const derivedAttacks = cData.map((iData) => iData.attacks || []).flat();
    // console.log({derivedMoves, derivedAttacks});
    const allItems = {};
    ["advantage", "disadvantage", "move", "darksecret", "relation", "weapon", "attack", "gear"].forEach((iType) => {
        allItems[iType] = {
            active: toDict(activeData.filter((iData) => iData.itemType === iType), "name"),
            passive: toDict(passiveData.filter((iData) => iData.itemType === iType), "name")
        };
    });
    allItems.move.activeDerived = toDict(derivedMoves.filter((iData) => iData.type === "active"), "name");
    allItems.move.passiveDerived = toDict(derivedMoves.filter((iData) => iData.type === "passive"), "name");
    allItems.attack.derived = toDict(derivedAttacks, "name");
    console.log("[!!!INCOMING!!!] ALL CLEANED INCOMING ITEM DATA", allItems);
    console.log("[TEST INCOMING] Active/Passive/Moves Analysis", {
        "Passives w/Moves": toDict(passiveData.filter((iData) => iData.moves?.length), "name"),
        "Passives w/Attacks": toDict(passiveData.filter((iData) => iData.attacks?.length), "name")
    });
    // Check for lists inside result objects that aren't included in main lists property
    console.log("[TEST INCOMING] Missing Lists", toDict(DATA.filter((iData) => {
        return iData.record?.results
            && (iData.results.success?.list || iData.results.partial?.list || iData.results.fail?.list)
            && !(iData.lists?.edges || iData.lists?.options || iData.lists?.questions);
    }), "name"));
    return true;
}
function testOutgoingData(DATA) {
    const cData = JSON.parse(JSON.stringify(DATA));
    // Extract Derived Moves and Attacks from Items
    const derivedMoves = cData.map((iData) => iData.data.moves || []).flat();
    const derivedAttacks = cData.map((iData) => iData.data.attacks || []).flat();
    const allItems = {};
    ["advantage", "disadvantage", "move", "darksecret", "relation", "weapon", "attack", "gear"].forEach((iType) => {
        allItems[iType] = toDict(cData.filter((iData) => iData.type === iType), "name");
    });
    allItems.move_derived = toDict(derivedMoves, "name");
    allItems.attack_derived = toDict(derivedAttacks, "name");
    console.log("[!!!OUTGOING!!!] ALL CLEANED OUTGOING ITEM DATA", allItems);
    return true;
}
