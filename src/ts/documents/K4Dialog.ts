// #region IMPORTS ~
import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import K4Actor, {K4ActorType} from "./K4Actor.js";
import K4Item, {K4ItemType} from "./K4Item.js";
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion
// #region -- TYPES & ENUMS --
// #region ENUMS ~
enum PromptInputType {
  buttons = "buttons",
  text = "text",
  confirm = "confirm"
}
// #endregion
// #region TYPES ~
namespace K4Dialog {
  export type Data = Dialog.Data;
  export interface PromptContext<T extends K4ItemType = K4ItemType> {
    title: string;
    bodyText: string;
    user?: User; // The user to whom the prompt is shown, defaults to current user
    subText?: string;
    itemList?: Array<K4Item<T>>;
  }
  namespace Input {

    export interface Base {
      input: PromptInputType;
      inputVals?: SystemScalar[];
      defaultVal?: SystemScalar;
    }
    export interface Buttons<T extends SystemScalar = SystemScalar> extends Base {
      input: PromptInputType.buttons;
      inputVals: T[];
      defaultVal?: T;
    }
    export interface Text extends Base {
      input: PromptInputType.text;
      inputVals?: never;
      defaultVal?: string
    }
    export interface Confirm extends Base {
      input: PromptInputType.confirm;
      inputVals?: never;
      defaultVal?: boolean;
    }
  }
  export type InputData<T extends SystemScalar = SystemScalar> = Input.Buttons<T> | Input.Text | Input.Confirm;
}
// #endregion
// #region INTERFACE AUGMENTATION ~

// #endregion
// #endregion


class K4Dialog extends Dialog {

  static async GetUserInput<T extends SystemScalar>(promptContext: K4Dialog.PromptContext, {input, inputVals, defaultVal}: K4Dialog.InputData<T> & {defaultVal?: never}): Promise<T | false>
  static async GetUserInput<T extends SystemScalar>(promptContext: K4Dialog.PromptContext, {input, inputVals, defaultVal}: K4Dialog.InputData<T> & {defaultVal: T}): Promise<T>
  static async GetUserInput<T extends SystemScalar>(
    promptContext: K4Dialog.PromptContext,
    inputData: K4Dialog.InputData<T>
  ): Promise<T | false> {
    const {user, ...context} = promptContext;
    if (user?.id && user.id !== game.user.id) {
      kLog.error(`[GetUserInput] User '${user.name}' supplied in client session of user '${game.user.name}': Need to implement socketlib.`);
      return false;
    }

    const {input, inputVals, defaultVal} = inputData;
    const content = await renderTemplate(
      U.getTemplatePath("dialog", `ask-for-${input}`),
      context
    );
    const dialogData: Dialog.Data = {
      title:   context.title,
      content,
      buttons: {}
    };
    return U.castToScalar<T>(await new Promise((resolve) => {
      dialogData.close = () => { resolve(defaultVal ?? false); }; // User cancelled or rejected the dialog; return defaultValue or false
      switch (input) {
        case PromptInputType.buttons: {
          const buttonVals = inputVals.map(U.castToScalar);
          if (!buttonVals.length) {
            throw new Error(`Invalid data for PromptForData: ${JSON.stringify(dialogData)}`);
          }
          const buttonEntries = buttonVals.map((val) => {
            return [
              String(val),
              {
                label:    String(val),
                callback: () => {resolve(val)}
              }
            ] as const;
          });
          // Assign the default value to defaultVal or the first button
          dialogData.default = String(defaultVal ?? buttonVals[0]);
          dialogData.buttons = Object.fromEntries<Record<string, unknown>>(buttonEntries);
          break;
        }
        case PromptInputType.text: {
          dialogData.default = "submit";
          dialogData.buttons = {
            submit: {
              label:    "Submit",
              callback: (html) => {
                const inputValue = ($(html).find('input[name="input"]').val() as string).trim();
                resolve(inputValue);
              }
            }
          };
          break;
        }
        case PromptInputType.confirm: {
          dialogData.default = "confirm";
          dialogData.buttons = {
            confirm: {
              label:    "Confirm",
              callback: () => { resolve(true); }
            },
            cancel: {
              label:    "Cancel",
              callback: () => { resolve(defaultVal ?? false); }
            }
          };
          break;
        }
      }
      void new K4Dialog(dialogData, {
        classes: [C.SYSTEM_ID, "dialog"]
      }).render(true)
    }));
  }
  #itemSelectionResolveFunc?: (value: K4Item|false) => void;
  static async GetUserItemSelection<T extends K4ItemType>(context: K4Dialog.PromptContext): Promise<K4Item<T> | false> {
    const {itemList: items, ...dialogContext} = context;
    if (!items) {
      throw new Error("No item list provided");
    }
    const itemList = items.map((item) => ({
      name: item.name,
      id: item.id,
      img: item.img,
      item,
      rules: item.rulesSummary
    }));
    const content = await renderTemplate(
      U.getTemplatePath("dialog", "ask-for-item"),
      {...dialogContext, itemList: items}
    );
    const dialogData: Dialog.Data = {
      title:   context.title,
      content,
      buttons: {}
    };
    return new Promise<K4Item<T> | false>((resolve) => {
      const dialog = new K4Dialog(dialogData, {
        classes: [C.SYSTEM_ID, "dialog", "item-selection-dialog"]
      });
      dialog.#itemSelectionResolveFunc = resolve as (value: K4Item|false) => void;
      void dialog.render(true);
    });
  }

  _onItemSelect(elem$: JQuery): gsap.core.Timeline {
    const container$ = elem$.closest(".item-selection-container");
    const otherItems$ = elem$.siblings(".item-portrait-button");
    const itemID = elem$.data("itemId") as Maybe<IDString>;
    if (!itemID) {
      throw new Error("Item ID not found");
    }
    const item = game.items.get(itemID);
    if (!item) {
      throw new Error(`Item with ID ${itemID} not found`);
    }
    return U.gsap.timeline({
      onComplete: () => {
        this.close().then(() => {
          this.#itemSelectionResolveFunc?.(item);
        }).catch((err: unknown) => {
          console.error(err);
          this.#itemSelectionResolveFunc?.(false);
        });
      }
    })
      .to(elem$, {
        scale: 3,
        opacity: 0,
        duration: 0.5,
        ease: "power1.easeInOut"
      })
      .to(otherItems$, {
        scale: 0.1,
        opacity: 0,
        duration: 0.35,
        ease: "power1.easeInOut"
      }, 0)
      .to(container$, {
        opacity: 0,
        duration: 0.25,
        ease: "power1.easeOut",
        delay: 0.25
      }, 0);
  }

  override activateListeners(element: JQuery): void {
    super.activateListeners(element);

    const itemButtons = element.find(".item-portrait-button");
    if (!itemButtons.length) { return; }

    itemButtons.each((index, elem) => {
      const button$ = $(elem);
      const icon$ = button$.find(".item-portrait-icon");
      const text$ = button$.find(".item-portrait-name");
      const hoverTimeline = U.gsap.timeline({
        paused: true,
        onStart(this: gsap.core.Timeline) {
          this.timeScale(1);
        },
        onReverse(this: gsap.core.Timeline) {
          this.timeScale(3);
        }
      })
        .fromTo(icon$, {
          scale: 1,
          filter: "brightness(1) blur(5px)"
        }, {
          scale: 1.15,
          filter: "brightness(1.15) blur(0px)",
          duration: 0.25,
          ease: "power1.easeInOut"
        }, 0)
        .fromTo(text$, {
          scale: 1,
          color: C.Colors.GREY,
          filter: "brightness(1) blur(0px)"
        }, {
          scale: 1.15,
          filter: "brightness(1) blur(0px)",
          color: C.Colors.bWHITE,
          duration: 0.25,
          ease: "power1.easeInOut"
        }, 0);
        //   scale: 0.8,
        //   duration: 0.25,
        //   ease: "power1.easeInOut"
        // }, 0);

      button$.data("hoverTimeline", hoverTimeline);

      button$.on({
        click: () => { this._onItemSelect(button$); },
        mouseenter: () => { hoverTimeline.play(); },
        mouseleave: () => { hoverTimeline.reverse(); }
      });
    });
  }

  override async render(force = false): Promise<void> {
    await super._render(force);
  }
}

export default K4Dialog;

export {PromptInputType};