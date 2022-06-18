import C from "./constants.js";
import U from "./utilities.js";
import { K4ItemType } from "../documents/K4Item.js";
export function MIX(derivedCtor, baseCtors) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            const propDescriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
            if (propDescriptor) {
                Object.defineProperty(derivedCtor.prototype, name, propDescriptor);
            }
        });
    });
    return derivedCtor;
}
function formatStringForKult(str) {
    // Add red gm-styling to GM Hold/Move prompts
    Object.values(C.RegExpPatterns.GMText).forEach((pat) => {
        str = str.replace(pat, "<strong class='text-gmtext'>$1</strong>");
    });
    // Add keyword flagging to keywords and Attributes
    [
        ...Object.values(C.RegExpPatterns.Attributes),
        ...Object.values(C.RegExpPatterns.Keywords)
    ].forEach((pat) => {
        str = str.replace(pat, "<strong class='text-keyword'>$1</strong>");
    });
    // Add italic move-name flagging to basic player move names
    Object.values(C.RegExpPatterns.BasicPlayerMoves).forEach((pat) => {
        str = str.replace(pat, "<em class='text-movename'>$1</em>");
    });
    // Add highlighting to edge names
    if (/&mdash;/.test(str)) {
        const [edgeName, edgeEffect] = str.split(/\s+&mdash;\s+/);
        str = [
            "<span class='edge-name'>",
            edgeName,
            "</span> &mdash; ",
            edgeEffect
        ].join("");
    }
    return str;
}
export const HandlebarHelpers = {
    "test": function (param1, operator, param2) {
        switch (operator) {
            case "==": {
                return param1 == param2;
            } // eslint-disable-line eqeqeq
            case "===": {
                return param1 === param2;
            }
            case "includes": {
                return Array.isArray(param1) && param1.includes(param2);
            }
            default: {
                return false;
            }
        }
    },
    "case": function (mode, str) {
        // return U[`${mode.charAt(0)}Case`](str);
        switch (mode) {
            case "upper": return U.uCase(str);
            case "lower": return U.lCase(str);
            case "sentence": return U.sCase(str);
            case "title": return U.tCase(str);
            default: return str;
        }
    },
    "areEmpty": function (...args) {
        return !Object.values(args).flat().join("");
    },
    "formatForKult": function (str, context) {
        const iData = context.data.root.data;
        console.log(`[FormatForKult] '${str}'`, context, this);
        str = str.replace(/(\S+?)%([^%]+)%/g, (_, prefix, refStr) => {
            if (/^data\./.test(refStr)) {
                const key = refStr.split(".").pop();
                if ([K4ItemType.attack, K4ItemType.move].includes(iData.type)) {
                    return formatStringForKult(`${prefix}${U.tCase(iData.data[key])}`);
                }
                return formatStringForKult(`to <span class='text-movename inline-move'>${this.name}</span> (${prefix}${U.tCase(iData.data[key])})`);
            }
            else if (/^list:/.test(refStr)) {
                const listKey = refStr.split(":").pop();
                if (listKey && (listKey in iData.data.lists)) {
                    return [
                        `<ul class='inline-list list-${listKey}'>`,
                        ...iData.data.lists[listKey].items.map((item) => `<li>${formatStringForKult(item)}</li>`),
                        "</ul>"
                    ].join("");
                }
                return `<span style='color: red;'>No Such List: ${listKey}</span>`;
            }
            else if (/^n$/.test(refStr)) {
                return "<p></p>";
            }
            return refStr;
        });
        return formatStringForKult(str.replace(/([\s\t\n]*<p>[\s\t\n]*<\/p>[\s\t\n]*)+/g, "<p></p>"));
    }
};
