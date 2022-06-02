import U from "./utilities.js";
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
const migrateData = (iData) => {
    iData = expandObject(iData);
    const { record } = iData;
    if ("ammoCost" in record) {
        record.itemType = "attack";
    }
    const mData = {
        name: record.name,
        type: record.itemType,
        img: record.iconPath,
        data: {
            isCustom: false
        }
    };
    switch (record.itemType) {
        case "attack": {
            break;
        }
        case "move": {
            mData.name = record.moveName || record.name || record.linkName || " ??? ";
            mData.data.intro = record.effect.intro;
            mData.data.trigger = record.effect.trigger.slice(0, -1);
            mData.data.outro = record.effect.effect
                .replace(/\[\[\[moveName\]\]\]/g, record.moveName || record.name)
                .replace(/\[\[\[attrMod\]\]\]/g, U.tCase(record.attributemod));
            mData.data.attribute = record.attributemod;
            mData.data.notes = record.notes;
            if (record.type === "passive") {
                mData.data.passiveEffect = {
                    optionsLists: record.suffix.list === "" ? [] : ["other_watchers"],
                    suffix: record.suffix.text.match(/Hold/) ? "" : record.suffix.text
                };
                mData.data.isActive = false;
            }
            else {
                let edges = stringToNum((record.results.success.text.match(/([^\s]+) Edge/) ?? [])[1] || 0), hold = stringToNum((record.results.success.text.match(/([^\s]+) Hold/) ?? [])[1] || 0);
                mData.data.completeSuccess = {
                    result: record.results.success.text,
                    optionsLists: [
                        (record.lists.questions !== ""
                            && record.results.success.text.match(/sk\s+[a-z]+\s+question/))
                            ? "questions"
                            : null,
                        (record.lists.options !== ""
                            && record.results.success.text.match(/hoose\s+[a-z]+\s+option/))
                            ? "options"
                            : null,
                        (record.lists.edges !== ""
                            && record.results.success.text.match(/[^\s]+\s+Edge/))
                            ? "edges"
                            : null
                    ].filter((item) => Boolean(item)),
                    edges,
                    hold
                };
                edges = stringToNum((record.results.partial.text.match(/([^\s]+) Edge/) ?? [])[1] || 0);
                hold = stringToNum((record.results.partial.text.match(/([^\s]+) Hold/) ?? [])[1] || 0);
                mData.data.partialSuccess = {
                    result: record.results.partial.text,
                    optionsLists: [
                        (record.lists.questions !== ""
                            && record.results.partial.text.match(/sk\s+[a-z]+\s+question/))
                            ? "questions"
                            : null,
                        (record.lists.options !== ""
                            && record.results.partial.text.match(/hoose\s+[a-z]+\s+option/))
                            ? "options"
                            : null,
                        (record.lists.edges !== ""
                            && record.results.partial.text.match(/[^\s]+\s+Edge/))
                            ? "edges"
                            : null
                    ].filter((item) => Boolean(item)),
                    edges,
                    hold
                };
                edges = stringToNum((record.results.fail.text.match(/([^\s]+) Edge/) ?? [])[1] || 0);
                hold = stringToNum((record.results.fail.text.match(/([^\s]+) Hold/) ?? [])[1] || 0);
                mData.data.failure = {
                    result: record.results.fail.text,
                    optionsLists: [
                        (record.lists.questions !== ""
                            && record.results.fail.text.match(/sk\s+[a-z]+\s+question/))
                            ? "questions"
                            : null,
                        (record.lists.options !== ""
                            && record.results.fail.text.match(/hoose\s+[a-z]+\s+option/))
                            ? "options"
                            : null,
                        (record.lists.edges !== ""
                            && record.results.fail.text.match(/[^\s]+\s+Edge/))
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
    if (record.lists) {
        Object.entries(record.lists).forEach(([key, itemString]) => {
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
        mData.data.lists.watchers.intro = record.suffix.listText;
    }
    if (record.linkName) {
        mData.data.sourceItem = {
            id: "",
            type: record.linkType,
            name: record.linkName
        };
    }
    mData.data.canGrantHold = Boolean(record.hasHolds);
    mData.data.holdText = (record.suffix?.text && record.suffix?.text.match(/Hold/)) ? record.suffix.text : "";
    if (record.moves?.length) {
        mData.data.moves = record.moves.map(migrateData);
    }
    if (record.attacks?.length) {
        mData.data.attacks = record.attacks.map(migrateData);
    }
    return mData;
};
export default function MIGRATE_ITEM_DATA(DATA) {
    console.log("INCOMING MIGRATION DATA", DATA);
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
    const activeData = cData.filter((iData) => iData.record.type === "active");
    const passiveData = cData.filter((iData) => iData.record.type === "passive");
    // Extract Derived Moves and Attacks from NON-Move Items
    // const nonMoveData = DATA.filter((iData) => iData.record.itemType !== "move");
    const derivedMoves = cData.map((iData) => iData.record.moves || []).flat();
    const derivedAttacks = cData.map((iData) => iData.record.attacks || []).flat();
    // console.log({derivedMoves, derivedAttacks});
    const allItems = {};
    ["advantage", "disadvantage", "move", "darksecret", "relation", "weapon", "attack", "gear"].forEach((iType) => {
        allItems[iType] = {
            active: toDict(activeData.filter((iData) => iData.record.itemType === iType), "name"),
            passive: toDict(passiveData.filter((iData) => iData.record.itemType === iType), "name")
        };
    });
    allItems.move.activeDerived = toDict(derivedMoves.filter((iData) => iData.record.type === "active"), "name");
    allItems.move.passiveDerived = toDict(derivedMoves.filter((iData) => iData.record.type === "passive"), "name");
    allItems.attack.derived = toDict(derivedAttacks, "name");
    console.log("[!!!INCOMING!!!] ALL CLEANED INCOMING ITEM DATA", allItems);
    console.log("[TEST INCOMING] Active/Passive/Moves Analysis", {
        "Passives w/Moves": toDict(passiveData.filter((iData) => iData.record.moves?.length), "name"),
        "Passives w/Attacks": toDict(passiveData.filter((iData) => iData.record.attacks?.length), "name")
    });
    // Check for lists inside result objects that aren't included in main lists property
    console.log("[TEST INCOMING] Missing Lists", toDict(DATA.filter((iData) => {
        return iData.record?.results
            && (iData.record.results.success?.list || iData.record.results.partial?.list || iData.record.results.fail?.list)
            && !(iData.record.lists?.edges || iData.record.lists?.options || iData.record.lists?.questions);
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
function toDict(items, key) {
    const dict = {};
    items.forEach((item) => {
        let newKey = item[key];
        if (newKey in dict) {
            console.error(`[toDict()] Duplicate Key: '${String(key)}: ${newKey}'`);
            newKey = indexString(newKey);
            console.warn(`Changing to ${newKey}`);
        }
        dict[newKey] = item;
    });
    return Object.fromEntries(items.map((item) => [item[key], item]));
}
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
