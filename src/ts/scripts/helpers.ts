// #region IMPORTS ~
import C from "./constants.js";
import U from "./utilities.js";
import SVGDATA, {SVGKEYMAP} from "./svgdata.js";
import K4Actor from "../documents/K4Actor.js";
import K4Item from "../documents/K4Item.js";
// #endregion

export function formatStringForKult(str: string) {
  // Apply spans around all hash-tag indicators
  return str.replace(/#>([^>]+)>([^<>#]+)<#/g, "<span class='text-tag $1'>$2</span>");
}

type ContextType = K4Item | {
  data: {
    root: {
      document?: K4Item|K4Actor;
      item?: K4Item;
    }
  }
} | {
  data: {
    root: K4Item.System;
  };
};

export function formatForKult(str: string, iData: FoundryDoc|{system: K4Item.SystemSchema.Any|K4Actor.SystemSchema.Any}) {
  // Step One: Replace any data object references.
  str = str.replace(
    /%([^%.]+)\.([^%]+)%/g,
    (_, sourceRef: string, dataKey: string): string => {
    // kLog.log(`[formatForKult: '${sourceRef}']`, {str, iData, sourceRef, dataKey}, 3);
    switch (sourceRef) {
      case "list": {
        const  listItems = U.getProp<string[]>(iData, `system.lists.${dataKey}.items`);
        if (!listItems) {
          return `<span style='color: red;'>No Such List: ${dataKey}</span>`;
        }
        return [
          `<ul class='inline-list list-${dataKey}'>`,
          ...listItems.map((item) => `<li>${item}</li>`),
          "</ul>"
        ].join("");
      }
      case "insert": {
        switch (dataKey) {
          case "break": {
            return "<p class='break-elem'></p>";
          }
          case "rollPrompt": {
            const name = U.getProp<string>(iData, "name");
            const attribute = U.getProp<string>(iData, "system.attribute");
            if (!attribute) {
              return `<span style='color: red;'>No Such Attribute: ${dataKey}</span>`;
            }
            return [
              "#>text-attributename>",
              "roll ",
              `+${attribute ? U.tCase(attribute) : "Unresolved"}`,
              "<#"
            ].join("");
          }
          default: {
            let actor: Maybe<K4Actor> = undefined;
            if (iData instanceof K4Item && iData.isOwned && iData.parent instanceof K4Actor) {
              actor = iData.parent;
            } else if (iData instanceof K4Actor) {
              actor = iData as K4Actor;
            }
            if (dataKey.startsWith("actor")) {
              if (!actor) {
                return `<span style='color: red;'>Could Not Resolve Actor for ${dataKey}</span>`;
              }
              const dotKey = dataKey.slice(5);
              return U.getProp(actor, dotKey) ?? "";
            }
            if (/^(doc|roll)Link/.test(dataKey)) {
              let [docName, docDisplay] = dataKey.split(".").slice(1) as Array<Maybe<string>>;
              let doc: Maybe<K4Item> = undefined;
              if (actor) {
                doc = actor.items.getName(docName ?? "");
              } else {
                doc = game.items.getName(docName ?? "");
              }
              if (!doc) {
                console.warn(`No such document: ${docName}`);
                return `<span style='color: red;'>No Such Document: ${docName}</span>`;
              }
              docDisplay ??= doc.name;
              if (dataKey.startsWith("docLink")) {
                return `<span class="text-docLink" data-doc-id="${doc.id}" data-doc-name="${doc.name}" data-action="open">${docDisplay}</span>`;
              }
              return `<span class="text-rollLink" data-doc-id="${doc.id}" data-doc-name="${doc.name}" data-action="roll">${docDisplay}</span>`;
            }
            if (dataKey.startsWith("FLAGS")) {
              const [_, effectID, ...flagKeyParts] = dataKey.split(".");
              const flagKey = flagKeyParts.join(".");
              if (!actor) {
                throw new Error("Cannot access flags from a non-actor item");
              }
              const effect = actor.effects.get(effectID as IDString);
              if (!effect) {
                throw new Error(`No such effect: ${effectID}`);
              }

              return effect.getFlag(flagKey)!;
            }
            return `<span style='color: red;'>No Such Prompt: ${dataKey}</span>`;
          }
        }
      }
      default: return `<span style='color: red;'>No Such Source: ${sourceRef}.${dataKey}</span>`;
    }
  });

  // Step Two: Apply span styling.
  // str = str.replace(/Check: /g, "CHECK"); // Remove the colon from 'Check:' moves, to avoid confusing the replacer
  let prevStr;
  while (str !== prevStr) {
    prevStr = str;
    str = str.replace(/#>([^>&]+)(&[^>]+)?>([^#]+)<#/g, (_, classRefs: Maybe<string>, attrRefs: Maybe<string>, contents: Maybe<string>) => {
      classRefs = ["text-tag", classRefs ?? ""].join(" ").trim();
      const htmlParts = [
        "<span class='",
        classRefs,
        "'"
      ];
      if (attrRefs) {
        htmlParts.push(attrRefs.replace(/&/g, " "));
      }
      htmlParts.push(">");
      // if (classRefs.includes("chat-select")) {
      //   htmlParts.push("<span class='selection-key'></span>");
      // }
      htmlParts.push(...[
        contents ?? "",
        "</span>"
      ]);
      return htmlParts.join("");
    });
  }
  // str = str.replace(/CHECK/g, "Check: ");

  // Step Three: Apply final specific fixes to formatting
  // str = str
  //   .replace(/([\s\t\n]*<p>[\s\t\n]*<\/p>[\s\t\n]*)+/g, "<p></p>") // Remove empty <p> elements, except when used as breaks
  //   .replace(/^<p>[\s\t\n]*<\/p>|<p>[\s\t\n]*<\/p>$/g, ""); // Remove empty <p> elements at start and end of code block

  return str;
}

const handlebarHelpers: Record<string,Handlebars.HelperDelegate> = {
  /**
   * Handlebars helper to perform various comparison operations.
   * @param {unknown} param1 - The first parameter for comparison.
   * @param {string} operator - The comparison operator.
   * @param {unknown} param2 - The second parameter for comparison.
   * @returns {boolean} - The result of the comparison.
   */
  "test"(param1: unknown, operator: string, param2: unknown): boolean {
    const isStringOrNumber = (a: unknown): a is string | number => typeof a === "number" || typeof a === "string";

    if (["!", "!!", "not"].includes(param1 as string)) {
      ([param1, operator] = [operator, param1 as string]);
    }

    switch (operator) {
      case "!":
      case "!!":
      case "not":
        return !param1;
      case "==":
      case "===":
        return param1 === param2;
      case "!=":
      case "!==":
        return param1 !== param2;
      case ">":
        return U.isNumber(param1) && U.isNumber(param2) && param1 > param2;
      case "<":
        return U.isNumber(param1) && U.isNumber(param2) && param1 < param2;
      case ">=":
        return U.isNumber(param1) && U.isNumber(param2) && param1 >= param2;
      case "<=":
        return U.isNumber(param1) && U.isNumber(param2) && param1 <= param2;
      case "includes":
        return Array.isArray(param1) && param1.includes(param2);
      case "in":
        if (Array.isArray(param2)) { return param2.includes(param1); }
        if (U.isList(param2) && isStringOrNumber(param1)) { return param1 in param2; }
        if (typeof param2 === "string") { return new RegExp(String(param2), "gu").test(String(param1)); }
        return false;
      default:
        return false;
    }
  },
  "case"(mode: StringCase, str: string) {
    // return U[`${mode.charAt(0)}Case`](str);
    switch (mode) {
      case "upper": return U.uCase(str);
      case "lower": return U.lCase(str);
      case "sentence": return U.sCase(str);
      case "title": return U.tCase(str);
      default: return str;
    }
  },
  "count"(param: unknown): number {
    if (Array.isArray(param) || U.isList(param)) {
      return Object.values(param).length;
    }
    return param ? 1 : 0;
  },
  "signNum"(num: number) {
    return U.signNum(num);
  },
  "areEmpty"(...args) {
    args.pop();
    return !Object.values(args).flat().join("");
  },
  "getDropCap"(content: Maybe<string>): string {
    if (!content?.length) {
      return "";
    }
    return `systems/${C.SYSTEM_ID}/assets/chat/dropcaps/${content.slice(0, 1).toUpperCase()}.png`;
  },
  "getRestCaps"(content: string): string {
    return content.slice(1);
  },
  "dbLog"(...args: Tuple<string|number>) {
    args.pop();
    let dbLevel = 5;
    if ([0,1,2,3,4,5].includes(args[0] as number)) {
      dbLevel = args.shift() as number;
    }
    kLog.hbsLog(...(args.map(String) as Tuple<string>), dbLevel);
  },
  "formatForKult"(str: string, context: ContextType) {
    let iData: Maybe<{system: K4Item.SystemSchema.Any|K4Actor.SystemSchema.Any}> = undefined;
    if (context instanceof K4Item) {
      iData = context;
    } else if ("document" in context.data.root) {
      iData = context.data.root.document!;
    } else if ("item" in context.data.root) {
      iData = context.data.root.item!;
    } else {
      iData = {system: context.data.root as K4Item.SystemSchema.Any|K4Actor.SystemSchema.Any};
    }
    // kLog.log("[formatForKult]", {str, context, iData, "this": this});

    return formatForKult(
      str,
      iData
    );
  },
  "getImgName": U.toKey,
  "getSVGs"(ref: string) {
    const isReporting = ref === "ten-sided-die";
    ref = U.toKey(ref) ;
    if (!(ref in SVGDATA) && ref in SVGKEYMAP) {
      ref = SVGKEYMAP[ref];
    }
    if (isReporting) {
      kLog.log("Get Die SVG", {ref, svgData: SVGDATA[ref]});
    }
    const pathData = U.getKey(ref, SVGDATA)
      ?.map((pData) => {
        pData = {
          ...pData,
          style: `${pData.style ?? ""} ${parsePathTransform(pData)}`
        };
        if (typeof pData.viewBox === "number") {
          pData.viewBox = `0 0 ${pData.viewBox} ${pData.viewBox}`;
        } else if (Array.isArray(pData.viewBox)) {
          pData.viewBox = `0 0 ${pData.viewBox.join(" ")}`;
        } else if (typeof pData.viewBox !== "string") {
          pData.viewBox = "0 0 512 512";
        }
        return pData;
      });

    if (pathData) {
      return pathData;
    }

    throw new Error(`No such SVG path: '${String(ref)}'`);
  }
};

function parsePathTransform({scale = 1, xShift = 0, yShift = 0}: {scale?: number, xShift?: number, yShift?: number}): string {
  return [
    "transform: translate(-50%, -50%)",
    `scale(${scale})`,
    `translate(${xShift}px, ${yShift}px);`
  ].join(" ");
}

export function registerHandlebarHelpers() {
  Object.entries(handlebarHelpers).forEach(([name, func]) => { Handlebars.registerHelper(name, func); });
}