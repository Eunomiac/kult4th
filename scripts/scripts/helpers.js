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
export function formatStringForKult(str) {
    // Apply spans around all hash-tag indicators
    return str.replace(/#>([^>]+)>([^<>#]+)<#/g, "<span class='text-tag $1'>$2</span>");
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
        // Object.assign(globalThis, {formatStringForKult, formatForKult: HandlebarHelpers.formatForKult});
        const iData = context.data.root.data;
        console.log("[FormatForKult]", { str, iData, "this": this });
        // #>text-rolltrait>+%data.attribute%<#   `#>text-rolltrait>+%data.attribute%<#`.match(/#>([^>]+)>/)?.pop()
        str = str.replace(/(?:#>([^>]+)>)?(\S+?)?%([^%\s]+)%(?:<#)?/g, (_, spanTag, prefix, refStr) => {
            console.log({ _, spanTag, prefix, refStr });
            if (/^data\./.test(refStr)) {
                const key = refStr.split(".").pop();
                console.log("[FormatForKult] Found DATA. Key =", key);
                if ([K4ItemType.attack, K4ItemType.move].includes(iData.type)) {
                    return formatStringForKult([
                        spanTag ? `#>${spanTag}>` : "",
                        prefix,
                        U.tCase(iData.data[key]),
                        spanTag ? "<#" : ""
                    ].join(""));
                }
                return formatStringForKult([
                    "to <a class='item-button' data-action='edit' data-item-name='",
                    this.name,
                    "'>#>text-movename>",
                    this.name,
                    "<#</a> (",
                    "#>text-keyword>",
                    prefix,
                    U.tCase(iData.data[key]),
                    "<#)"
                ].join(""));
            }
            else if (/^list:/.test(refStr)) {
                const listKey = refStr.split(":").pop();
                console.log(`[FormatForKult] Found LIST. Key = ${listKey}`, iData.data.lists);
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
