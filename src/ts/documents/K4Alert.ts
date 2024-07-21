// #region IMPORTS ~
import C, {K4Influence} from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import {AlertPaths} from "../scripts/svgdata.js";
import K4Actor from "./K4Actor.js";
import {K4RollResult} from "./K4Roll.js";
import K4ActiveEffect from "./K4ActiveEffect.js";
import K4Sound from "./K4Sound.js"
// #endregion

// #REGION === TYPES, ENUMS, INTERFACE AUGMENTATION === ~
// #region -- ENUMS ~
enum AlertType {
  simple = "simple",
  card = "card"
};
// #endregion
// #region -- TYPES ~
namespace K4Alert {

  export type AlertPathID = keyof typeof AlertPaths;
  /**
   * The contextual data passed to the .hbs template
   */
  export namespace Context {
    interface Base {
      skipQueue?: boolean;
    }
    export interface Simple extends Base {
      header: string;
      body: string;
      svgPaths?: Record<AlertPathID, {viewBox: string, d: string}>;
      logoImg?: string
    }
    export interface Card extends Base {
      name: keyof typeof C["Influences"];
      type: K4Influence;
      principle: string;
      imgs: {
        tarotCard: string;
        vertKey: string;
        horizKey: string;
      }
    }
  }
  export type Context<T extends AlertType> = T extends AlertType.simple ? Context.Simple
    : T extends AlertType.card ? Context.Card
    : never;

  /**
   * The data passed to the K4Alert constructor
   */
  export namespace Data {
    interface Base {
      displayDuration: number;
    }
    export interface Simple extends Context.Simple, Base { }
    export interface Card extends Context.Card, Base { }
  }
  export type Data<T extends AlertType> = T extends AlertType.simple ? Data.Simple
    : T extends AlertType.card ? Data.Card
    : never;
}
// #endregion
// #endregion

/* interface GSAPEffectDefinition<Schema extends gsap.TweenVars = gsap.TweenVars> {
  name: string,
  effect: GSAPEffectFunctionWithDefaults<Schema>,
  defaults: Schema,
  extendTimeline: boolean
} */

// #region === GSAP ANIMATIONS ===
const GSAPEFFECTS: GSAPEffectDefinition[] = [
  {
    name: "fadeShrinkIn",
    effect: (target, config) => {
      const {duration, ease, startScale, test} = config;
      return U.gsap.timeline()
        .fromTo(target,
          {
            autoAlpha: 0,
            scale: startScale as number,
            transformOrigin: "center center",
            y: 30
          }, {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration,
            ease
          }
        );
    },
    defaults: {
      duration: 1,
      ease: "power3.in",
      startScale: 1.25
    },
    extendTimeline: true
  },
  {
    name: "spreadOut",
    effect: (target, config) => {
      const {startWidth, endWidth, duration, ease} = config;
      return U.gsap.timeline()
        .fromTo(target,
          {
            width: startWidth as number
          }, {
            width: endWidth as number,
            duration,
            ease
          }
        );
    },
    defaults: {
      startWidth: 0,
      endWidth: 200,
      duration: 0.5,
      ease: "power3.in"
    },
    extendTimeline: true
  },
  {
    name: "slideDown",
    effect: (target, config) => {
      const {duration, ease, height} = config;
      return U.gsap.timeline()
        .add(() => { K4Sound.play("slow-hit"); })
        .fromTo(target,
          {
            height: 0
          }, {
            height,
            duration,
            ease
          }
        );
    },
    defaults: {
      duration: 0.5,
      ease: "power3.in",
      height: 0
    },
    extendTimeline: true
  },
  {
    name: "fadeIn",
    effect: (target, config) => {
      const {duration, ease} = config;
      return U.gsap.timeline()
        .fromTo(target,
          {
            opacity: 0
          }, {
            opacity: 1,
            duration,
            ease
          }
        );
    },
    defaults: {
      duration: 0.25,
      ease: "power3.in"
    },
    extendTimeline: true
  },
  {
    name: "fadeOut",
    effect: (target, config) => {
      const {duration, ease} = config;
      return U.gsap.timeline()
        .fromTo(target,
          {
            opacity: 1
          }, {
            opacity: 0,
            duration,
            ease
          }
        );
    },
    defaults: {
      duration: 0.25,
      ease: "power3.out"
    },
    extendTimeline: true
  }
];


const ALERTANIMATIONS: Record<AlertType, {
  in: GSAPEffectDefinition,
  out: GSAPEffectDefinition,
  setup?: (target: JQuery, data: K4Alert.Data<AlertType>) => void;
}> = {
  [AlertType.simple]: {
    in: {
      name: "simpleAlertIn",
      effect: (target, config) => {
        const {duration,  ease} = config;
        const target$ = $(target as HTMLElement);
        const container$ = target$.find(".alert-frame-body");
        const containerHeight = container$.height() ?? 0;
        const imgLogo$ = target$.find("img.k4-alert-logo");
        const heading$ = target$.find("h2");
        const hr$ = target$.find("hr");
        const body$ = target$.find("p");
        const tl = U.gsap.timeline()
          .fadeShrinkIn(target$, {duration, ease: "power2.inOut"})
          .fadeIn(imgLogo$, {duration: 1}, "<50%")
          .slideDown(container$, {duration: 0.5, height: containerHeight, ease: "power2.in"}, "<50%")
          .fadeIn(heading$, {duration: 0.5}, "<50%")
          .spreadOut(hr$, {endWidth: 500})
          .fadeIn(body$, {}, "<50%")
          .add(() => { K4Sound.play("subsonic-stinger"); }, 0.25)
        return tl as gsap.core.Timeline;
      },
      defaults: {
        duration: 1,
        stagger: 0.25,
        ease: "power3.in"
      },
      extendTimeline: true
    },
    out: {
      name: "simpleAlertOut",
      effect: (target, config) => {
        const {duration, stagger, ease} = config;
        return U.gsap.timeline()
          .fromTo(target, {opacity: 1}, {opacity: 0, duration, stagger, ease});
      },
      defaults: {
        duration: 0.5,
        stagger: 0.25,
        ease: "power3.out"
      },
      extendTimeline: true
    }
  },
  [AlertType.card]: {
    in: {
      name: "cardAlertIn",
      effect: (target, config) => {
        const {duration, ease} = config;
        return U.gsap.timeline()
          .fadeShrinkIn(target, {duration, ease: "power2.inOut"});
      },
      defaults: {
        duration: 1,
        ease: "power3.in"
      },
      extendTimeline: true
    },
    out: {
      name: "cardAlertOut",
      effect: (target, config) => {
        const {duration, ease} = config;
        return U.gsap.timeline()
          .fadeOut(target, {duration, ease: "power2.inOut"});
      },
      defaults: {
        duration: 0.5,
        ease: "power3.out"
      },
      extendTimeline: true
    },
    setup: (target$, data) => {
      const container$ = target$.find(".alert-frame-body");
      const containerHeight = container$.height() ?? 0;
    }
  }
};
// #endregion

/**
 * A class representing an ordered set of unique items.
 *
 * This class maintains the order of items as they are added and ensures that each item is unique.
 * It provides methods to add, check, delete, and retrieve items, as well as to get the size of the set.
 *
 * @template T - The type of items to be stored in the set.
 */
class OrderedSet<T> {
  private items: T[] = [];

  /**
   * Adds a unique item to the set. If the item already exists, it will not be added again.
   *
   * @param {T} item - The item to be added to the set.
   */
  add(item: T): void {
      if (!this.has(item)) {
          this.items.push(item);
      }
  }

  /**
   * Checks if the item exists in the set.
   *
   * @param {T} item - The item to check for existence in the set.
   * @returns {boolean} - Returns true if the item exists in the set, otherwise false.
   */
  has(item: T): boolean {
      return this.items.includes(item);
  }

  /**
   * Deletes an item from the set if it exists.
   *
   * @param {T} item - The item to be deleted from the set.
   */
  delete(item: T): void {
      const index = this.items.indexOf(item);
      if (index !== -1) {
          this.items.splice(index, 1);
      }
  }

  /**
   * Returns an iterable iterator of the items in the set.
   *
   * @returns {IterableIterator<T>} - An iterable iterator of the items in the set.
   */
  values(): IterableIterator<T> {
      return this.items.values();
  }

  /**
   * Gets the number of items in the set.
   *
   * @returns {number} - The number of items in the set.
   */
  get size(): number {
      return this.items.length;
  }

  /**
   * Returns the oldest element in the set.
   *
   * @returns {T | undefined} - The oldest element in the set, or undefined if the set is empty.
   */
  next(): T | undefined {
      return this.items.length > 0 ? this.items[0] : undefined;
  }
}

// #region === K4Alert CLASS ===
class K4Alert<T extends AlertType> {
  // #region INITIALIZATION ~
  /**
  * Pre-Initialization of the K4Alert class. This method should be run during the "init" hook.
  *
  * - Generates the overlay element to contain K4Alert instances
  * - Sets up socketlib to synchronize K4Alert instances across clients
  * - Registers gsap effects for K4Alert instances
  */
  static PreInitialize() {

    // Generate the overlay element to contain K4Alert instances
    const overlay = $("<div>").attr("id", "kult-alerts");
    $("body").append(overlay);

    // Register GSAP Effects
    GSAPEFFECTS.forEach((effect) => {
      U.gsap.registerEffect(effect);
    });

    // Append dev sample alert image for dev purposes
    const sampleAlert = $("<img>").attr({
      id: "dev-sample-image",
      src: "systems/kult4th/assets/animated-alert-sample.gif"
    });
    overlay.append(sampleAlert);

    Object.assign(globalThis, {
      K4Alert
    });
  }
  // #endregion

  static get Overlay$(): JQuery {
    return $("#kult-alerts");
  }
  static AlertQueue: OrderedSet<K4Alert<AlertType>> = new OrderedSet<K4Alert<AlertType>>();

  static Alert<T extends AlertType = AlertType.simple>(data: K4Alert.Context<T>): void
  static Alert<T extends AlertType>(type: T, data: K4Alert.Context<T>): void
  static Alert<T extends AlertType = AlertType.simple>(...args: unknown[]): void {
    let type: T;
    let data: K4Alert.Context<T>;
    if (args.length === 1) {
      type = AlertType.simple as T;
      data = args[0] as K4Alert.Context<T>;
    } else {
      type = args[0] as T;
      data = args[1] as K4Alert.Context<T>;
    }
    const alert = new K4Alert(type, data);
    kLog.log("Alert", type, data, alert);
    if (data.skipQueue) {
      void alert.run();
      return;
    }
    K4Alert.AlertQueue.add(alert);
    K4Alert.RunQueue();
  }

  static RunQueue() {
    if (this.AlertQueue.size === 0) {
      U.gsap.to(
        $("#interface"),
        {
          background: "rgba(0, 0, 0, 0)",
          duration: 0.5,
          ease: "power3.out"
        }
      );
      return;
    }
    const alert = this.AlertQueue.next()!;
    if (alert.isTweening) { return; }
    U.gsap.to(
      $("#interface"),
      {
        background: "rgba(0, 0, 0, 0.75)",
        duration: 0.5,
        ease: "power3.in"
      }
    );
    void alert.run();
  }


  // #region STATIC METHODS ~
  /**
   * Given a string, will return the URL to the drop cap image for the first character of that string.
   * @param {string} content - The string to extract the first character from.
   * @returns {string} The URL to the drop cap image for the first character of the string.
   */
  static GetDropCap(content: string): string {
    if (!content.length) {
      return "";
    };
    return `systems/kult4th/assets/chat/dropcaps/${content.slice(0, 1).toUpperCase()}.png`;
  }

  static GetDefaultData<T extends AlertType>(type: T): K4Alert.Data<T> {
    switch (type) {
      case AlertType.simple: {
        return {
          header: "",
          body: "",
          displayDuration: 5,
          svgPaths: AlertPaths,
          logoImg: "systems/kult4th/assets/alerts/logo-bird.webp"
        } as K4Alert.Data<T>;
      }
    }
    return undefined as never;
  }
  // #endregion

  // #region GETTERS & SETTERS ~
  _type: T;
  _context: K4Alert.Context<T>;
  _displayDuration: number;
  _timeline: Maybe<GSAPAnimation>;
  _element: Maybe<JQuery>;

  get type(): AlertType {
    return this._type;
  }
  get context(): K4Alert.Context<T> {
    return this._context;
  }
  get displayDuration(): number {
    return this._displayDuration;
  }
  get element(): Maybe<JQuery> {
    return this._element;
  }
  hasElement(): this is typeof this & { _element: JQuery} {
    return Boolean(this._element);
  }
  hasTimeline(): this is typeof this & { _timeline: GSAPAnimation } {
    return Boolean(this._timeline);
  }
  get isTweening(): boolean {
    return this.hasTimeline() && this._timeline.isActive();
  }

  // #endregion

  // #region CONSTRUCTOR
  constructor(type: T, data: Partial<K4Alert.Data<T>|K4Alert.Context<T>>) {
    this._type = type;
    const {displayDuration, ...contextData} = {
      ...K4Alert.GetDefaultData(this._type),
      ...data
    } as K4Alert.Context<T> & {displayDuration: number};
    this._context = contextData as unknown as K4Alert.Context<T>;
    this._displayDuration = displayDuration!;
  }
  // #endregion

  async run() {
    kLog.log("Running alert", this.type, this.context);
    if (!this.hasElement()) {
      kLog.log("No element, creating");
      const elementCode: string = await renderTemplate(
        U.getTemplatePath("alerts", `alert-${this.type}`),
        this.context
      );
      this._element = $(elementCode).appendTo(K4Alert.Overlay$);
      kLog.log("Element created", this._element);
    }
    // return;
    if (!this.hasTimeline()) {
      const animations = ALERTANIMATIONS[this.type];
      kLog.log("No timeline, creating");
      const self = this;
      this._timeline = U.gsap.timeline(
        {
          onComplete() {
            self.element!.remove();
            K4Alert.AlertQueue.delete(self);
            K4Alert.RunQueue();
          }
        }
      )
        .add(ALERTANIMATIONS[this.type].in.effect(this._element!, ALERTANIMATIONS[this.type].in.defaults))
        .add(ALERTANIMATIONS[this.type].out.effect(this._element!, ALERTANIMATIONS[this.type].out.defaults), `>+=${this.displayDuration}`);
      kLog.log("Timeline created", this._timeline);
    }
    kLog.log("Alert ready");
  }
  // #region HTML PARSING

  // #endregion

}
// #ENDREGION

// #region EXPORTS ~
export default K4Alert;
// #endregion
