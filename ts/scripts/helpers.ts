import C from "./constants.js";
import U from "./utilities.js";

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
		const iData = context.data.root.data;
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
							return "<p></p>";
						}
						case "rollPrompt": {
							if ([K4ItemType.attack, K4ItemType.move].includes(iData.type)) {
								return [
									"roll ",
									"#>",
									"item-button text-attributename",
									`:data-item-name='${iData.name}'`,
									":data-action='roll'",
									">",
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
									U.tCase(iData.data.attribute),
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
		// #>text-keyword>+1 ongoing<#
		// #>item-button text-keyword text-movename:data-item-name='Engage_in_Combat':data-action='open'>Engage in Combat<#
		str = str.replace(/#>([^>:]+)(:[^>]+)?>([^<]+)<#/g, (_, classRefs: string | undefined, attrRefs: string | undefined, contents: string) => {
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

		// Step Three: Apply final specific fixes to formatting
		str = str
			.replace(/([\s\t\n]*<p>[\s\t\n]*<\/p>[\s\t\n]*)+/g, "<p></p>"); // Remove empty <p> elements, except when used as breaks

		return str;
	}
};