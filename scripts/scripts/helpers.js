import C from "./constants.js";
import U from "./utilities.js";
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
export const HandlebarHelpers = {
    test: function (param1, operator, param2) {
        switch (operator) {
            case "==": {
                return param1 == param2;
            } // eslint-disable-line eqeqeq
            case "===": {
                return param1 === param2;
            }
            default: {
                return false;
            }
        }
    },
    formatForKult: function (str, context) {
        console.log("CONTEXT", context);
        const iData = context.data.root.data;
        Object.values(C.RegExpPatterns.GMText).forEach((pat) => {
            str = str.replace(pat, "<strong class='text-gmtext'>$1</strong>");
        });
        str = str.replace(/\+?%([^%]+)%/g, (match, refStr, ...args) => {
            if (/^data\./.test(refStr)) {
                const key = refStr.split(".").pop();
                return `<strong class='text-keyword'>+${U.tCase(iData.data[key])}</strong>`;
            }
            else if (/^lists:/.test(refStr)) {
                // const [,listKey] = refStr.split(/:/);
                return "";
            }
            else if (/^n$/.test(refStr)) {
                return "<p></p>";
            }
            return refStr;
        }).replace(/(<p><\/p>)+/g, "<p></p>");
        [
            ...Object.values(C.RegExpPatterns.Attributes),
            ...Object.values(C.RegExpPatterns.Keywords)
        ].forEach((pat) => {
            str = str.replace(pat, "<strong class='text-keyword'>$1</strong>");
        });
        Object.values(C.RegExpPatterns.BasicPlayerMoves).forEach((pat) => {
            str = str.replace(pat, "<em class='text-movename'>$1</em>");
        });
        return str;
    }
};
