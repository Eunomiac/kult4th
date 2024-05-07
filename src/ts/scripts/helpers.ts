// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "./utilities.js";
import SVGDATA, {SVGKEYMAP} from "./svgdata.js";
import K4Item from "../documents/K4Item.js";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

export function formatStringForKult(str: string) {
  // Apply spans around all hash-tag indicators
  return str.replace(/#>([^>]+)>([^<>#]+)<#/g, "<span class='text-tag $1'>$2</span>");
}

const handlebarHelpers: Record<string,Handlebars.HelperDelegate> = {
  "test": function(param1: unknown, operator: string, param2: unknown) {
    switch (operator) {
      case "==": { return param1 == param2 } // eslint-disable-line eqeqeq
      case "===": { return param1 === param2 }
      case ">": { return typeof param1 === "number" && typeof param2 === "number" && param1 > param2 }
      case "<": { return typeof param1 === "number" && typeof param2 === "number" && param1 < param2 }
      case ">=": { return typeof param1 === "number" && typeof param2 === "number" && param1 >= param2 }
      case "<=": { return typeof param1 === "number" && typeof param2 === "number" && param1 <= param2 }
      case "includes": { return Array.isArray(param1) && param1.includes(param2) }
      case "in": {
        if (Array.isArray(param2)) {
          return param2.includes(param1);
        }
        if (U.isList(param2) && (typeof param1 === "number" || typeof param1 === "string")) {
          return param1 in param2;
        }
        if (typeof param2 === "string") {
          return new RegExp(String(param2), "gu").test(String(param1));
        }
        return false;
      }
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
  "count": function(param: unknown): number {
    if (Array.isArray(param) || U.isList(param)) {
      return Object.values(param).length;
    }
    return param ? 1 : 0;
  },
  "signNum": function(num: number) {
    return U.signNum(num);
  },
  "areEmpty": function(...args) {
    args.pop();
    return !Object.values(args).flat().join("");
  },
  "dbLog": function(...args) {
    args.pop();
    let dbLevel = 5;
    if ([0,1,2,3,4,5].includes(args[0])) {
      dbLevel = args.shift();
    }
    kLog.hbsLog(...args, dbLevel);
  },
  "formatForKult": function(str: string, context: List<any> | K4Item) {
    // Object.assign(globalThis, {formatStringForKult, formatForKult: HandlebarHelpers.formatForKult});
    const iData = context instanceof K4Item
      ? context.data
      : context.data.root.data;
    kLog.hbsLog("[formatForKult]", {str, iData, "this": this}, 5);
    const self = this as Record<string,any>;

    // Step One: Replace any data object references.
    str = str.replace(/%([^%\.]+)\.([^%\.]+)%/g, (_, sourceRef: string, dataKey: string) => {
      switch (sourceRef) {
        case "data": {
          return iData.data[dataKey as KeyOf<typeof iData["data"]>];
        }
        case "list": {
          switch (dataKey) {
            case "inline-attacks": { return "<span style='color: red;'>Inline Attacks TBD...</span>" }
            case "parent-attacks": { return "<span style='color: red;'>Inline PARENT Attacks TBD...</span>" }
            default: {
              const listItems: string[] = [];
              if (dataKey && (dataKey in iData.data.lists)) {
                listItems.push(...iData.data.lists[dataKey].items);
              } else if (dataKey && (dataKey in iData.lists)) {
                listItems.push(...iData.lists[dataKey].items);
              } else {
                return `<span style='color: red;'>No Such List: ${dataKey}</span>`;
              }
              return [
                `<ul class='inline-list list-${dataKey}'>`,
                ...listItems.map((item) => `<li>${item}</li>`),
                "</ul>"
              ].join("");
            }
          }
        }
        case "insert": {
          switch (dataKey) {
            case "break": {
              return "<br /><br />"; // <p></p>";
            }
            case "rollPrompt": {
              // if ([K4ItemType.attack, K4ItemType.move].includes(iData.type)) {
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
      kLog.log(str);
    } */

    // str = str.replace(/Check: /g, "CHECK"); // Remove the colon from 'Check:' moves, to avoid confusing the replacer
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
    // str = str.replace(/CHECK/g, "Check: ");

    // // Step Three: Apply final specific fixes to formatting
    // str = str
    //   .replace(/([\s\t\n]*<p>[\s\t\n]*<\/p>[\s\t\n]*)+/g, "<p></p>") // Remove empty <p> elements, except when used as breaks
    //   .replace(/^<p>[\s\t\n]*<\/p>|<p>[\s\t\n]*<\/p>$/g, ""); // Remove empty <p> elements at start and end of code block

    return str;
  },
  "getImgName": U.toKey,
  "getSVGs": function(ref: string) {
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

function parsePathTransform({d, scale = 1, xShift = 0, yShift = 0}: {d: string, scale?: number, xShift?: number, yShift?: number}): string {
  return [
    "transform: translate(-50%, -50%)",
    `scale(${scale})`,
    `translate(${xShift}px, ${yShift}px);`
  ].join(" ");
}

export function registerHandlebarHelpers() {
  Object.entries(handlebarHelpers).forEach(([name, func]) => Handlebars.registerHelper(name, func));
}