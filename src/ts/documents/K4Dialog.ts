// #region IMPORTS ~
import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion
// #region -- TYPES & ENUMS --
// #region ENUMS ~
// #endregion
// #region TYPES ~
namespace K4Dialog {
  export type Data = Dialog.Data;
}
// #endregion
// #region INTERFACE AUGMENTATION ~

// #endregion
// #endregion


export default class K4Dialog extends Dialog {

  static async #ResolveTemplateContent(path: string, context: Record<string, SystemScalar>) {
    const template = await getTemplate(path);
    return template(context);
  }
  static async #RenderDialogWindow<T extends SystemScalar>(dialogData: K4Dialog.Data, resolveCallback: (value: T | PromiseLike<T>) => void, defaultVal?: T) {
    if (U.isDefined(defaultVal)) {
      dialogData.close ??= () => resolveCallback(defaultVal);
    }
    new K4Dialog(
      dialogData,
      {
        classes: [C.SYSTEM_ID, "dialog"],
      }
    ).render(true);
  }

  static async AskForText(title: string, bodyText?: string, subText?: string, defaultVal = "") {
    return new Promise<string>(async (resolve) => {
      const dialogData: K4Dialog.Data = {
        title,
        content: await K4Dialog.#ResolveTemplateContent(
          U.getTemplatePath("dialog", "ask-for-text"),
          {
            title,
            bodyText: bodyText ?? "",
            subText: subText ?? ""
          }
        ),
        buttons: {
          submit: {
            label: "Submit",
            callback: (html: HTMLElement | JQuery) => {
              const inputValue = ($(html).find('input[name="input"]').val() as string).trim();
              resolve(inputValue);
            }
          }
        }
      };
      K4Dialog.#RenderDialogWindow(dialogData, resolve, defaultVal);
    });
  }

  static async AskWithButtons<T extends SystemScalar>(title: string, inputVals: string, bodyText?: string, subText?: string, defaultVal?: T): Promise<Maybe<T>> {
    kLog.log("[AskWithButtons]", { title, inputVals, bodyText, subText, defaultVal }, 3);
    const buttonVals = inputVals
      .split("|")
      .map((val) => U.castToScalar(val) as T);
    if (!buttonVals.length) {
      throw new Error(`Invalid inputVals string for AskWithButtons: ${JSON.stringify(inputVals)}`);
    }

    return new Promise<Maybe<T>>(async (resolve) => {

      const buttonEntries = buttonVals.map((val) => {
        return [
          String(val),
          {
            label: String(val),
            callback: () => resolve(val)
          }
        ];
      });
      const dialogData: K4Dialog.Data = {
        title,
        content: await K4Dialog.#ResolveTemplateContent(
          U.getTemplatePath("dialog", "ask-for-buttons"),
          {
            title,
            bodyText: bodyText ?? "",
            subText: subText ?? ""
          }
        ),
        default: String(buttonVals[0]),
        buttons: Object.fromEntries(buttonEntries)
      };
      K4Dialog.#RenderDialogWindow(dialogData, resolve, defaultVal);
    });
  }

  static async AskForConfirmation(title: string, bodyText?: string, subText?: string, defaultVal = false) {
    return new Promise<boolean>(async (resolve) => {
      const dialogData: K4Dialog.Data = {
        title,
        content: await K4Dialog.#ResolveTemplateContent(
          U.getTemplatePath("dialog", "ask-for-confirm"),
          {
            title,
            bodyText: bodyText ?? "",
            subText: subText ?? ""
          }
        ),
        buttons: {
          confirm: {
            label: "Confirm",
            callback: () => resolve(true)
          },
          cancel: {
            label: "Cancel",
            callback: () => resolve(false)
          }
        }
      };
      K4Dialog.#RenderDialogWindow(dialogData, resolve, defaultVal);
    });
  }
}