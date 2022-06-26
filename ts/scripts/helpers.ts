import C from "./constants.js";
import U from "./utilities.js";
import {K4ItemType} from "../documents/K4Item.js";

export function MIX(derivedCtor: K4Constructor, baseCtors: K4Constructor[]) {
	baseCtors.forEach(baseCtor => {
		Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
			const propDescriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
			if (propDescriptor) {
				Object.defineProperty(
					derivedCtor.prototype,
					name,
					propDescriptor
				);
			}
		});
	});
	return derivedCtor;
}

export function formatStringForKult(str: string) {
	// Apply spans around all hash-tag indicators
	return str.replace(/#>([^>]+)>([^<>#]+)<#/g, "<span class='text-tag $1'>$2</span>");
}

export const HandlebarHelpers = {
	"test": function(param1: string, operator: string, param2: string) {
		switch (operator) {
			case "==": { return param1 == param2 } // eslint-disable-line eqeqeq
			case "===": { return param1 === param2 }
			case "includes": { return Array.isArray(param1) && param1.includes(param2) }
			default: { return false }
		}
	},
	"case": function(mode: "upper" | "lower" | "sentence" | "title", str: string) {
		// return U[`${mode.charAt(0)}Case`](str);
		switch (mode) {
			case "upper": return U.uCase(str);
			case "lower": return U.lCase(str);
			case "sentence": return U.sCase(str);
			case "title": return U.tCase(str);
			default: return str;
		}
	},
	"areEmpty": function(...args: [...Array<string|string[]>, never]) {
		return !Object.values(args).flat().join("");
	},
	"formatForKult": function(str: string, context: List<any>) {
		// Object.assign(globalThis, {formatStringForKult, formatForKult: HandlebarHelpers.formatForKult});
		const iData: K4ItemData = context.data.root.data;
		console.log("[FormatForKult]", {str, iData, "this": this});

		// #>text-rolltrait>+%data.attribute%<#   `#>text-rolltrait>+%data.attribute%<#`.match(/#>([^>]+)>/)?.pop()


		str = str.replace(/(?:#>([^>]+)>)?(\S+?)?%([^%\s]+)%(?:<#)?/g, (_, spanTag: string | undefined, prefix: string | undefined, refStr: string) => {
			console.log({_, spanTag, prefix, refStr});
			if (/^data\./.test(refStr)) {

				const key = refStr.split(".").pop();
				console.log("[FormatForKult] Found DATA. Key =", key);
				if ([K4ItemType.attack, K4ItemType.move].includes(iData.type)) {
					return formatStringForKult([
						spanTag ? `#>${spanTag}>` : "",
						prefix,
						U.tCase(iData.data[key as KeyOf<typeof iData["data"]>]),
						spanTag ? "<#" : ""
					].join(""));
				}
				return formatStringForKult([
					"to <a class='item-button' data-action='edit' data-item-name='",
					(this as unknown as K4ItemData).name,
					"'>#>text-movename>",
					(this as unknown as K4ItemData).name,
					"<#</a> (",
					"#>text-keyword>",
					prefix,
					U.tCase(iData.data[key as KeyOf<typeof iData["data"]>]),
					"<#)"
				].join(""));
			} else if (/^list:/.test(refStr)) {
				const listKey = refStr.split(":").pop();
				console.log(`[FormatForKult] Found LIST. Key = ${listKey}`, iData.data.lists);
				if (listKey && (listKey in iData.data.lists)) {
					return [
						`<ul class='inline-list list-${listKey}'>`,
						...iData.data.lists[listKey].items.map((item: string) => `<li>${formatStringForKult(item)}</li>`),
						"</ul>"
					].join("");
				}
				return `<span style='color: red;'>No Such List: ${listKey}</span>`;
			} else if (/^n$/.test(refStr)) {
				return "<p></p>";
			}
			return refStr;
		});
		return formatStringForKult(str.replace(/([\s\t\n]*<p>[\s\t\n]*<\/p>[\s\t\n]*)+/g, "<p></p>"));
	}
};