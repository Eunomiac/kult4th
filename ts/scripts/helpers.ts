import C from "./constants.js";
import U from "./utilities.js";
import SVGDATA from "./svgdata.js";
import K4Item from "../documents/K4Item.js";

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
	"loc": function(...args: [...string[], never]) {
		args.pop();
		const locString = args.shift();
		if (typeof locString === "string") {
			const formatDict: Record<string,string> = {};
			while (args.length && args.length % 2 === 0) {
				const [dictKey, dictVal] = [args.shift(), args.shift()];
				if (typeof dictKey === "string" && typeof dictVal === "string") {
					formatDict[dictKey] = dictVal;
				}
			}
			return U.loc(locString, formatDict);
		}
		throw new Error(`Bad Localization String: ${String(locString)}`);
	},
	"formatForKult": function(str: string, context: List<any> | K4Item) {
		// Object.assign(globalThis, {formatStringForKult, formatForKult: HandlebarHelpers.formatForKult});
		const iData = context instanceof K4Item
			? context.data
			: context.data.root.data;
		console.log("[FormatForKult]", {str, iData, "this": this});
		const self = this as Record<string,any>;

		// Step One: Replace any data object references.
		str = str.replace(/%([^%\.]+)\.([^%\.]+)%/g, (_, sourceRef: string, dataKey: string) => {
			switch (sourceRef) {
				case "data": {
					return U.tCase(iData.data[dataKey as KeyOf<typeof iData["data"]>]);
				}
				case "list": {
					switch (dataKey) {
						case "inline-attacks": { return "<span style='color: red;'>Inline Attacks TBD...</span>" }
						case "parent-attacks": { return "<span style='color: red;'>Inline PARENT Attacks TBD...</span>" }
						default: {
							if (dataKey && (dataKey in iData.data.lists)) {
								return [
									`<ul class='inline-list list-${dataKey}'>`,
									...iData.data.lists[dataKey].items.map((item: string) => `<li>${item}</li>`),
									"</ul>"
								].join("");
							}
							return `<span style='color: red;'>No Such List: ${dataKey}</span>`;
						}
					}
				}
				case "insert": {
					switch (dataKey) {
						case "break": {
							return "<br /><br />"; // <p></p>";
						}
						case "rollPrompt": {
							if ([K4ItemType.attack, K4ItemType.move].includes(iData.type)) {
								return [
									"#>",
									"item-button text-attributename",
									`:data-item-name='${iData.name}'`,
									":data-action='roll'",
									">",
									"roll ",
									`+${U.tCase(iData.data.attribute)}`,
									"<#"
								].join("");
							}
							return [
								"roll to ",
								...[
									"#>",
									"item-button text-movename",
									`:data-item-name='${self.name}'`,
									":data-action='open'",
									">",
									self.name,
									"<#"
								],
								" (",
								...[
									"#>",
									"item-button text-attributename",
									`:data-item-name='${iData.name}'`,
									":data-action='roll'",
									">",
									`+${U.tCase(iData.data.attribute)}`,
									"<#"
								],
								")"
							].join("");
						}
						default: {
							return `<span style='color: red;'>No Such Prompt: ${dataKey}</span>`;
						}
					}
				}
				default: return `<span style='color: red;'>No Such Source: ${sourceRef}.${dataKey}</span>`;
			}
		});

		// Step Two: Apply span styling.
		/*
		const strings = [
											"#>text-center>You get #>text-keyword>+1 ongoing<# against this guy<#",
											"#>text-keyword>+1 ongoing<#",
											"#>item-button text-keyword text-movename:data-item-name='Engage_in_Combat':data-action='open'>Engage in Combat<#",
											"#>text-center>You are a seasoned marksman.<#%insert.break%#>text-center>You deal #>text-keyword>+1 Harm<# with firearms.<#"
										];

		strings.forEach((str) => {
			// Insert function to test
			console.log(str);
		} */

		str = str.replace(/Check: /g, "CHECK"); // Remove the colon from 'Check:' moves, to avoid confusing the replacer
		let prevStr;
		while (str !== prevStr) {
			prevStr = str;
			str = str.replace(/#>([^>:]+)(:[^>]+)?>([^#]+)<#/g, (_, classRefs, attrRefs, contents) => {
				classRefs = ["text-tag", classRefs ?? ""].join(" ").trim();
				const htmlParts = [
					"<span class='",
					classRefs,
					"'"
				];
				if (attrRefs) {
					htmlParts.push(attrRefs.replace(/:/g, " "));
				}
				htmlParts.push(...[
					">",
					contents,
					"</span>"
				]);
				return htmlParts.join("");
			});
		}
		str = str.replace(/CHECK/g, "Check: ");

		// // Step Three: Apply final specific fixes to formatting
		// str = str
		// 	.replace(/([\s\t\n]*<p>[\s\t\n]*<\/p>[\s\t\n]*)+/g, "<p></p>") // Remove empty <p> elements, except when used as breaks
		// 	.replace(/^<p>[\s\t\n]*<\/p>|<p>[\s\t\n]*<\/p>$/g, ""); // Remove empty <p> elements at start and end of code block

		return str;
	},
	"getImgName": simplifyItemName,
	"getSVGPaths": function(str: KeyOf<typeof SVGDATA.Paths>) {
		if (str in SVGDATA.Paths) {
			return SVGDATA.Paths[str];
		}
		throw new Error(`No such SVG path: '${String(str)}'`);
	},
	"getIconPaths": function(typeRef: string, ref: string, {name, type}: {name?: string, type?: string} = {}) {
		if (type && typeof type === "string") {
			typeRef = type;
		}
		if (name && typeof name === "string") {
			ref = name;
		}
		const pathsForTypeRef = U.getKey(typeRef, SVGDATA.IconPaths);
		if (U.isSimpleObj(pathsForTypeRef)) {
			const pathData = U.getKey(simplifyItemName(ref), pathsForTypeRef);
			if (pathData) {
				pathData.style = parsePathTransform(pathData);
				return pathData;
			}
		}
		throw new Error(`No such '${String(typeRef)}' SVG path: '${String(ref)}'`);
	}
};

function parsePathTransform({d, scale = 1, xShift = 0, yShift = 0}: {d: string, scale?: number, xShift?: number, yShift?: number}): string {
	return [
		"transform: translate(-50%, -50%)",
		`scale(${scale})`,
		`translate(${xShift}px, ${yShift}px);`
	].join(" ");
}

function simplifyItemName(itemName: string): string {
	return (itemName ?? "").toLowerCase().replace(/ /g, "-");
}