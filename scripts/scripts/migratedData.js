// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import C from "./constants.js";
import U from "./utilities.js";
const clearItems = async () => Item.deleteDocuments(Array.from(game.items?.values() ?? []).map((item) => item.id));
const clearFolders = async () => Folder.deleteDocuments(Array.from(game.folders?.values() ?? []).map((folder) => folder.id));
const isFolderEmpty = (folder) => {
    if (folder.contents.length) {
        return false;
    }
    return folder["children"].every(isFolderEmpty);
};
const cleanItemData = (itemData) => {
    delete itemData.folder;
    delete itemData.effects;
    delete itemData.sort;
    delete itemData.permission;
    delete itemData.flags;
    delete itemData._id;
    return itemData;
};
const updateItemsJSON = async (itemData) => {
    const filePath = "systems/kult4th/itemData";
    const file = new File([JSON.stringify(itemData, null, 2)], "items-parsed.json", { type: "application/json" });
    await FilePicker.upload("data", filePath, file, {}, { notify: "items-parsed.json updated" });
};
const loadItemsFromJSON = async () => {
    const response = await fetch("systems/kult4th/itemData/items.json");
    const data = await response.json().catch(() => console.error("Failed to read JSON from 'items.json'"));
    if (response.ok) {
        return data;
    }
    else {
        throw new Error("Could not access the items.json archive from server side.");
    }
};
const sortIntoFolders = async (itemData) => {
    const folderNames = {
        "advantage": "Advantages",
        "move": "Basic Player Moves",
        "disadvantage": "Disadvantages",
        "darksecret": "Dark Secrets",
        "weapon": "Weapons",
        "active-rolled": "Active Rolled",
        "active-static": "Active Static",
        "passive": "Passive" /*DEVCODE*/,
        "derived_move": "Derived Moves",
        "derived_attack": "Derived Attacks" /*!DEVCODE*/
    };
    const folderMap = {
        advantage: "",
        move: "",
        disadvantage: "",
        darksecret: "",
        weapon: "" /*DEVCODE*/,
        derived_move: "",
        derived_attack: "" /*!DEVCODE*/
    };
    const itemFolders = {
        "Advantages": U.getHEXString(C.Colors.dGOLD),
        "Disadvantages": U.getHEXString(C.Colors.dRED),
        "Basic Player Moves": U.getHEXString(C.Colors.dGOLD),
        "Dark Secrets": U.getHEXString(C.Colors.dRED),
        "Weapons": U.getHEXString(C.Colors.dGOLD)
    };
    const FOLDERDATA = Object.entries(itemFolders).map(([folderName, folderColor]) => ({
        name: folderName,
        type: "Item",
        sorting: "a",
        color: folderColor
    }));
    const folders = await Folder.createDocuments(FOLDERDATA);
    folders.forEach((fData) => {
        const folderId = fData.id;
        const folderType = Object.keys(folderNames)[Object.values(folderNames).findIndex((fName) => fName === fData.name)];
        folderMap[folderType] = folderId;
    });
    const folderIDRecord = [];
    const sortedItemData = Object.values(itemData)
        .map((iData) => {
        const folderName = folderNames[iData.type];
        const folder = C.game.folders.get(folderMap[iData.type]);
        Object.assign(iData, { folder: folder.id });
        if (!folderIDRecord.includes(folder.id)) {
            folderIDRecord.push(folder.id);
            if (!folderIDRecord.includes(folderName)) {
                folderIDRecord.push(folderName);
            }
        }
        return iData;
    });
    kLog.log("FOLDER IDS", { record: folderIDRecord, folders: C.game.folders.map((folder) => [folder.name, folder.id]) });
    await Promise.all(C.game.folders.map((folder) => {
        if (!(folderIDRecord.includes(folder.id) || folderIDRecord.includes(folder.name))) {
            return folder.delete();
        }
        return true;
    }));
    return sortedItemData;
};
// #endregion ▮▮▮▮[UTILITY]▮▮▮▮
// #region 🟩🟩🟩 DATA MUTATION & ITEM GENERATION 🟩🟩🟩 ~
const mutateItemData = (itemData) => {
    function isDerivedItem(iData) { return "sourceItem" in iData.data; }
    function hasDerivedItems(iData) { return "subItems" in iData.data && iData.data.subItems.length > 0; }
    function getDerivedItems(iData) {
        if (hasDerivedItems(iData)) {
            const subMoves = iData.data.subItems.filter((sData) => sData.type === "move" /* K4ItemType.move */);
            const subAttacks = iData.data.subItems.filter((sData) => sData.type === "attack" /* K4ItemType.attack */);
            return [subMoves, subAttacks];
        }
        return [[], []];
    }
    function getTextStrings(iData) {
        const textStrings = { rules: [], results: [] };
        // First check Rules
        if (iData.data && "rules" in iData.data && iData.data.rules) {
            textStrings.rules = [
                iData.data.rules.intro ?? "",
                iData.data.rules.trigger ?? "",
                iData.data.rules.outro ?? "",
                iData.data.rules.holdText ?? ""
            ].filter((str) => str !== "");
        }
        // Next check Results
        if (iData.data && "results" in iData.data && iData.data.results) {
            textStrings.results = [
                iData.data.results.completeSuccess.result ?? "",
                iData.data.results.partialSuccess.result ?? "",
                iData.data.results.failure.result ?? ""
            ].filter((str) => str !== "");
        }
        return textStrings;
    }
    function getListRefs(iData) {
        const listRefs = { rules: [], results: [[], [], []] };
        if (iData.data && "rules" in iData.data && iData.data.rules && iData.data.rules.listRefs) {
            listRefs.rules = iData.data.rules.listRefs;
        }
        if (iData.data && "results" in iData.data && iData.data.results) {
            if (iData.data.results.completeSuccess?.listRefs) {
                listRefs.results[0].push(...iData.data.results.completeSuccess.listRefs);
            }
            if (iData.data.results.partialSuccess?.listRefs) {
                listRefs.results[1].push(...iData.data.results.partialSuccess.listRefs);
            }
            if (iData.data.results.failure?.listRefs) {
                listRefs.results[2].push(...iData.data.results.failure.listRefs);
            }
        }
    }
    const MUTATIONFUNCS = [
        function moveListsToParent(iData, pData) {
            /* - all list definitions should be defined on parent data object
                        - find list definitions in all subItems
                        - if list isn't on parent, move it there
                        - delete list entry in subItems */
            if (pData && hasDerivedItems(pData) && isDerivedItem(iData)) {
                if (iData.data.lists) {
                    Object.entries(iData.data.lists).forEach(([lName, lData]) => {
                        pData.data.lists ??= {};
                        pData.data.lists[lName] = { ...lData };
                    });
                    delete iData.data.lists;
                }
            }
            else if (hasDerivedItems(iData)) {
                iData.data.subItems = iData.data.subItems.map((sData) => moveListsToParent(sData, iData));
            }
            return iData;
        },
        function clearSubMoveNames(iData, pData) {
            /* subItems should only have unique names IF
                - they're Attacks
                - there are 2 or more subMoves */
            if (pData && hasDerivedItems(pData) && isDerivedItem(iData)) {
                if (iData.type === "move" /* K4ItemType.move */ && pData.data.subItems.filter((sData) => sData.type === "move" /* K4ItemType.move */).length === 1) {
                    delete iData.name;
                }
            }
            else if (hasDerivedItems(iData)) {
                iData.data.subItems = iData.data.subItems.map((sData) => clearSubMoveNames(sData, iData));
            }
            return iData;
        },
        function moveResultsRefsToRules(iData) {
            if (iData.data && "results" in iData.data && iData.data.results && iData.data.results.listRefs) {
                iData.data.rules ??= {};
                iData.data.rules.listRefs ??= [];
                iData.data.rules.listRefs.push(...iData.data.results.listRefs);
                delete iData.data.results.listRefs;
            }
            if (hasDerivedItems(iData)) {
                // @ts-expect-error Fuck
                iData.data.subItems = iData.data.subItems.map((sData) => moveResultsRefsToRules(sData));
            }
            return iData;
        },
        function sortListRefs(iData, pData) {
            /*	 - list REFERENCES appear where they should:
                            - ANY ITEMS: If list is referenced by a %list.<key>%, then no listRefs for it anywhere
                        OTHERWISE
                            - PASSIVE ITEMS: inside data.rules, nowhere else
                            - ACTIVE ITEMS:
                                    - if INTRO list, then ONLY in rules
                                    - if RESULTS list, then ONLY in result entries where it applies
                                        UNLESS EDGES - then ALSO in rules of PARENT item but NOT subItem */
            // if (pData && hasDerivedItems(pData) && isDerivedItem(iData)) {
            // 	if (iData.type === K4ItemType.move && pData.data.subItems.filter((sData) => sData.type === K4ItemType.move).length === 1) {
            // 		delete iData.name;
            // 	}
            // } else if (hasDerivedItems(iData)) {
            // 	iData.data.subItems = iData.data.subItems.map((sData) => sortListRefs(sData, iData));
            // }
            return iData;
        }
    ];
    function applyMutationFuncs(iData) {
        // @ts-expect-error Fuck
        MUTATIONFUNCS.forEach((func) => func(iData));
        return iData;
    }
    return Object.fromEntries(Object.values(itemData)
        .map((iData) => [iData.name, applyMutationFuncs(iData)]));
};
const resetItems = async () => {
    await clearItems();
    await clearFolders();
    const ITEM_DATA = await loadItemsFromJSON();
    console.log(ITEM_DATA);
    const NEW_ITEM_DICT = mutateItemData(ITEM_DATA);
    Object.assign(globalThis, { ITEM_DATA: NEW_ITEM_DICT });
    // kLog.log("DERIVED ITEMS", getDerivedItemData(getItemDataObjs(NEW_ITEM_DICT)));
    await updateItemsJSON(NEW_ITEM_DICT);
    const NEW_ITEM_DATA = await sortIntoFolders(NEW_ITEM_DICT);
    // const DERIVED_ITEM_DATA = getDerivedItemData(NEW_ITEM_DATA) as ItemDataConstructorData[];
    await Item.createDocuments(NEW_ITEM_DATA);
};
// #endregion 🟩🟩🟩 DATA MUTATION & ITEM GENERATION
/* REGEXP PATTERNS TO MANUALLY FIX migratedData.ts

"\[K4(.*?):(.*?)\]"			-->			K4$1.$2
"\[\[K4(.*?):(.*?)\]\]" -->			[K4$1.$2]
\s[+|-]\d+([\s\.]|$)
(?<![\d>])[+|-]\d+(?!<)
(?<![\d>])[+|-]\d+(?!\)?<)
*/
/* How many Advantages and Disadvantages have no moves, 1 move or 2 moves?
        - only derived MOVES count (derived ATTACKS are generally passive, as they're added to the player's sheet, rather than being rolls on their own)
    ANSWER:
        - all PASSIVE items have zero moves, all ACTIVE items have one or more moves
        - four Advantages have TWO moves: "Explosives Expert", "Shadow", "Divine Champion" and "Sealed Fate"
        - all OTHER ACTIVE Advantages/Disadvantages have ONE move
- */
export default resetItems;
