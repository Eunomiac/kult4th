// #region IMPORTS ~
import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import K4Actor from "./K4Actor.js";
import {K4RollResult} from "./K4Roll.js";
import K4ActiveEffect from "./K4ActiveEffect.js";
// #endregion

// #region TYPES ~
namespace K4ChatMessage {
  export interface FlagData {
    kult4th: {
      cssClasses: string[];
      isSummary: boolean;
      isAnimated: boolean;
      isRoll: boolean;
      isTrigger: boolean;
      isEdge: boolean;
      rollOutcome?: K4RollResult;
    }
  }

  export interface ConstructorData extends Omit<ChatMessageDataConstructorData, "flags"> {
    flags: FlagData & Record<string, unknown>;
  }

}
// #endregion
// #region -- INTERFACE AUGMENTATION ~
interface K4ChatMessage {
  speaker: {
    actor?: string
  }
}
// #endregion
// #endregion
const GSAPEFFECTS = {
  rollMiddleGear: {
    effect: (target: JQuery|HTMLElement, config: Record<string, unknown>) => {
      const target$ = $(target);
      const gearContainer$ = target$.closest(".roll-total-gear");
      return U.gsap.timeline()
        .fromTo(target$, {
          // filter: `blur(3px) brightness(5) drop-shadow(0px 0px 0px ${C.Colors.dBLACK})`,
          scale: 2
      }, {
          rotation: "+=360",
          // filter: `blur(0px) brightness(0.75) drop-shadow(0px 0px 2px ${C.Colors.dGOLD})`,
          scale: 1,
          autoAlpha: 1,
          ease: "power3.out",
          duration: 1
      })
      .to(target$, {
          // filter: `blur(0px) brightness(2) drop-shadow(0px 0px 5px ${C.Colors.bGOLD})`,
          scale: 1.25,
          duration: 0.5,
          repeat: 1,
          ease: "power2.in",
          yoyo: true,
          onReverseComplete() {
            U.gsap.set(gearContainer$, {overflow: "hidden"});
          }
        })
      .to(target$, {
          rotation:      "-=20",
          duration:      0.4,
          repeatRefresh: true,
          repeatDelay:   1.6,
          ease:          "back.out(5)",
          repeat:        -1
        });
    },
    defaults: {},
    extendTimeline: true
  },
  rollOuterGear: {
    effect: (target: JQuery|HTMLElement, config: Record<string, unknown>) => {
      const target$ = $(target);
      return U.gsap.timeline()
        .fromTo(target$, {
          scale: 5,
          filter: "blur(15px)"
      }, {
          autoAlpha: 0.85,
          scale: 1,
          filter: "blur(1.5px)",
          ease: "power2.inOut",
          duration: 1
      })
      .to(target$, {
          rotation: "+=360",
          repeat: -1,
          duration: 30,
          ease: "none"
      })
    },
    defaults: {},
    extendTimeline: true
  },
  bounceInDice: {
    effect: (target: JQuery|HTMLElement, config: Record<string, unknown>) => {
      const d10s$ = $(target);
      const [d10VideoA, d10VideoB] = Array.from(d10s$.children(".d10-animation").children("video"));

      return U.gsap.timeline()
        .fromTo(d10s$, {
          transformOrigin: "center center",
          scale: 1.5,
          y: -20,
          filter: "brightness(2) blur(5px)"
        }, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          filter: "brightness(1) blur(0px)",
          ease: "power2.out",
          duration: 1,
          stagger: 0.25
        })
        // Manually stagger the play calls for each video
        .call(() => { d10VideoA.currentTime = 0; d10VideoA.play() }, undefined, 0.25)
        .call(() => { d10VideoB.currentTime = 0; d10VideoB.play() }, undefined, 0.75);
    },
    defaults: {},
    extendTimeline: true
  },
  slideIn: {
    effect: (target: JQuery|HTMLElement, config: Record<string, unknown>) => {
      const target$ = $(target);
      const {xPercent, yPercent} = config as {xPercent: number, yPercent: number};
      return U.gsap.timeline()
        .fromTo(target$, {
          transformOrigin: "center center",
          skewX: -25,
          scale: 1,
          x: 100,
          autoAlpha: 0,
          xPercent,
          yPercent,
          filter: "blur(50px)"
      }, {
          autoAlpha: 1,
          skewX: 0,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
          ease: "power2.inOut",
          duration: 1
      });
    },
    defaults: {xPercent: 0, yPercent: 0},
    extendTimeline: true
  },
  dropIn: {
    effect: (target: JQuery|HTMLElement, config: Record<string, unknown>) => {
      const target$ = $(target);
      if (!target$.length) { return U.gsap.timeline(); }
      return U.gsap.timeline()
        .fromTo(target$, {
          y: config.y as number,
          autoAlpha: 0
        }, {
          y: 0,
          autoAlpha: 1,
          ease: "elastic",
          duration: 2
        })
    },
    defaults: {y: -100},
    extendTimeline: true
  },
  slowShrink: {
    effect: (target: JQuery|HTMLElement, config: Record<string, unknown>) => {
      const target$ = $(target);
      const fromScale = config.fromScale as number;
      const toScale = config.toScale as number;
      const yShift = config.yShift as number;
      const xShift = config.xShift as number;
      const duration = config.duration as number;
      return U.gsap.timeline()
        .fromTo(target$, {
          scale: fromScale
        }, {
          x: xShift,
          y: yShift,
          scale: toScale,
          ease: "back.out",
          duration
        });
    },
    defaults: {
      fromScale: 1,
      toScale: 1,
      duration: 5,
      yShift: 0,
      xShift: 0
    },
    extendTimeline: true
  },
  staggerInResults: {
    effect: (target: JQuery|HTMLElement, config: Record<string, unknown>) => {
      const target$ = $(target);
      return U.gsap.timeline()
        .fromTo(target$, {
          autoAlpha: 0,
          filter: "blur(10px)"
      }, {
          autoAlpha: 1,
          filter: "blur(0px)",
          ease: "power2.out",
          duration: 1,
          stagger: 0.25
      });
    },
    defaults: {},
    extendTimeline: true
  },
  animateFailure: {
    effect: (target: JQuery|HTMLElement, config: Record<string, unknown>) => {
      const {duration, stagger, ease} = config as {duration: number, stagger: number, ease: string};

      var msg$ = $(target);
      var msgBg = msg$.find(".message-bg");
      var msgDropCap = msg$.find(".drop-cap");
      var msgAttrFlare = msg$.find(".roll-term-container[class*='attribute-']");
      var msgIntro = msg$.find(".roll-char-name, .roll-intro-line");
      var msgIcon = msg$.find(".icon-container .chat-icon");
      var msgSource = msg$.find(".roll-source-header");
      var msgGears = msg$.find(".roll-total-gear > img");
      var msgTotal = msg$.find(".roll-total-number");
      var msgOutcomeMain = msg$.find(".roll-outcome .roll-outcome-main");
      var msgOutcomeSub = msg$.find(".roll-outcome .roll-outcome-sub");
      var msgTextToRed = msg$.find(".roll-char-name, .roll-intro-line, .text-attributename, .roll-source-source-name .roll-source-text, .roll-dice-results ~ * *");
      var msgTextToBlack = msg$.find(".roll-source-name .roll-source-text");
      return U.gsap.timeline({ease, clearProps: true})
          .fromTo(msgBg, {filter: "sepia(0) brightness(1) hue-rotate(0deg) saturate(1) contrast(1)"}, {filter: "sepia(5) brightness(0.25) hue-rotate(-45deg) saturate(5) contrast(2)", duration}, 0)
          .fromTo(msgDropCap, {filter: "sepia(0) brightness(1) hue-rotate(0deg) saturate(1) contrast(1)"}, {filter: "sepia(0) brightness(0.5) saturate(3) hue-rotate(-45deg) saturate(1) contrast(5)", duration}, 0)
          .fromTo(msgAttrFlare, {filter: "sepia(0) brightness(1) hue-rotate(0deg) saturate(1) contrast(1)"}, {filter: "sepia(5) brightness(0.25) saturate(5) hue-rotate(-45deg) saturate(3) brightness(1) contrast(1)", duration}, 0)
          .fromTo(msgGears, {filter: "blur(1.5px) sepia(0) brightness(1) hue-rotate(0deg) saturate(1) contrast(1)"}, {filter: "blur(3.5px) sepia(5) brightness(0.65) saturate(5) hue-rotate(-45deg) contrast(2)", duration}, 0)
          .fromTo(msgTotal, {filter: "brightness(1) saturate(1) contrast(1)"}, {filter: "brightness(0.75) saturate(2) contrast(1)", duration}, 0)
          .to(msgIcon, {background: "red", duration, stagger}, stagger)
          .to(msgSource, {borderTopColor: "red", borderBottomColor: "red", background: "#990000", duration}, 2 * stagger)
          .fromTo(msgOutcomeMain, {color: "rgb(155, 32, 32)", textShadow: "0 0 4px rgb(0, 0, 0), 0 0 4px rgb(0, 0, 0)"}, {color: "rgb(255, 255, 255)", textShadow: "0 0 2px rgba(255, 255, 255, 0.8), 0 0 4px rgba(255, 255, 255, 0.8), 0 0 4.5px rgba(255, 255, 255, 0.8), 0 0 8px rgba(220, 65, 65, 0.8), 0 0 12.5px rgba(220, 65, 65, 0.8), 0 0 16.5px rgba(220, 65, 65, 0.5), 0 0 21px rgba(220, 65, 65, 0.5), 0 0 29px rgba(220, 65, 65, 0.5), 0 0 41.5px rgba(220, 65, 65, 0.5)", duration, onComplete() {
            msgOutcomeMain.addClass("neon-glow-strong-red");
            msgOutcomeMain.attr("style", "color: rgb(255, 255, 255); visibility: visible");
          }}, 2 * stagger)
          .to(msgOutcomeSub, {color: "red", textShadow: "none", duration}, 2 * stagger)
          .to(msgTextToRed, {color: "red", duration}, 2 * stagger)
          .to(msgTextToBlack, {color: "black", duration}, 2 * stagger);
    },
    defaults: {
      duration: 1,
      stagger: 0,
      ease: "power3.in"
    },
    extendTimeline: true
  },
  animateSuccess: {
    effect: (target: JQuery|HTMLElement, config: Record<string, unknown>) => {
      return U.gsap.timeline();
      /*
      const {duration, stagger, ease} = config as {duration: number, stagger: number, ease: string};
      var msg$ = $(target);
      var msgBg = msg$.find(".message-bg");
      var msgDropCap = msg$.find(".drop-cap");
      var msgAttrFlare = msg$.find(".roll-term-container[class*='attribute-']");
      var msgIntro = msg$.find(".roll-char-name, .roll-intro-line");
      var msgIcon = msg$.find(".icon-container .chat-icon");
      var msgSource = msg$.find(".roll-source-header");
      var msgGears = msg$.find(".roll-total-gear > img");
      var msgTotal = msg$.find(".roll-total-number");
      var msgOutcomeMain = msg$.find(".roll-outcome .roll-outcome-main");
      var msgOutcomeSub = msg$.find(".roll-outcome .roll-outcome-sub");
      var msgTextToRed = msg$.find(".roll-char-name, .roll-intro-line, .text-attributename, .roll-source-source-name .roll-source-text, .roll-dice-results ~ * *");
      var msgTextToBlack = msg$.find(".roll-source-name .roll-source-text");
      return U.gsap.timeline({ease, clearProps: true})
          .fromTo(msgBg, {filter: "sepia(0) brightness(1) hue-rotate(0deg) saturate(1) contrast(1)"}, {filter: "sepia(5) brightness(0.25) hue-rotate(-45deg) saturate(5) contrast(2)", duration}, 0)
          .fromTo(msgDropCap, {filter: "sepia(0) brightness(1) hue-rotate(0deg) saturate(1) contrast(1)"}, {filter: "sepia(0) brightness(0.5) saturate(2) hue-rotate(-45deg) saturate(1) contrast(1)", duration}, 0)
          .fromTo(msgAttrFlare, {filter: "sepia(0) brightness(1) hue-rotate(0deg) saturate(1) contrast(1)"}, {filter: "sepia(5) brightness(0.25) saturate(5) hue-rotate(-45deg) saturate(3) brightness(1) contrast(1)", duration}, 0)
          .fromTo(msgGears, {filter: "blur(1.5px) sepia(0) brightness(1) hue-rotate(0deg) saturate(1) contrast(1)"}, {filter: "blur(3.5px) sepia(5) brightness(0.65) saturate(5) hue-rotate(-45deg) contrast(2)", duration}, 0)
          .fromTo(msgTotal, {filter: "brightness(1) saturate(1) contrast(1)"}, {filter: "brightness(0.75) saturate(2) contrast(1)", duration}, 0)
          .to(msgIcon, {background: "red", duration, stagger}, stagger)
          .to(msgSource, {borderTopColor: "red", borderBottomColor: "red", background: "#990000", duration}, 2 * stagger)
          .fromTo(msgOutcomeMain, {color: "rgb(155, 32, 32)", textShadow: "0 0 4px rgb(0, 0, 0), 0 0 4px rgb(0, 0, 0)"}, {color: "rgb(255, 255, 255)", textShadow: "0 0 2px rgba(255, 255, 255, 0.8), 0 0 4px rgba(255, 255, 255, 0.8), 0 0 4.5px rgba(255, 255, 255, 0.8), 0 0 8px rgba(220, 65, 65, 0.8), 0 0 12.5px rgba(220, 65, 65, 0.8), 0 0 16.5px rgba(220, 65, 65, 0.5), 0 0 21px rgba(220, 65, 65, 0.5), 0 0 29px rgba(220, 65, 65, 0.5), 0 0 41.5px rgba(220, 65, 65, 0.5)", duration, onComplete() {
            msgOutcomeMain.addClass("neon-glow-strong-red");
            msgOutcomeMain.attr("style", "color: rgb(255, 255, 255)");
          }}, 2 * stagger)
          .to(msgOutcomeSub, {color: "red", textShadow: "none", duration}, 2 * stagger)
          .to(msgTextToRed, {color: "red", duration}, 2 * stagger)
          .to(msgTextToBlack, {color: "black", duration}, 2 * stagger);
      */
    },
    defaults: {
      duration: 1,
      stagger: 0,
      ease: "power3.in"
    },
    extendTimeline: true
  }
}
const ANIMATIONS = {
  animateChatRoll(target: HTMLElement): gsap.core.Timeline {
    const message$ = $(target);
    const messageContent$ = message$.find(".message-content");

    const chatContainer$ = message$.find(".kult4th-chat");

    const gearContainer$ = message$.find(".roll-total-gear");
    const middleGear$ = gearContainer$.find("[class*='middle-ring']");
    const outerGear$ = gearContainer$.find("[class*='outer-ring']");
    const totalNum$ = message$.find(".roll-total-number");

    const attrFlare$ = message$.find(".roll-term-container[class*='attribute']");
    const d10s$ = message$.find(".roll-d10");
    const d10BGs$ = d10s$.children(".d10-animation");
    const d10Videos = Array.from(d10BGs$.children("video"));
    d10Videos.forEach((video, index) => {
      video.loop = true;
      video.muted = true;
      video.playbackRate = 0.5 + (0.25 * index);
      video.style.display = "block";
    });
    const [d10VideoA, d10VideoB] = d10Videos;

    const outcome$ = message$.find(".roll-outcome > *");
    const results$ = message$.find(".roll-dice-results ~ div, .roll-dice-results ~ label, .roll-dice-results ~ h2, .roll-dice-results ~ ul li");

    let curHeight = message$.height() ?? 0;
    results$.css({
      display: "block",
      visibility: "visible",
      opacity: 0
    });
    let endHeight = message$.height() ?? 0;
    if (endHeight > 800) {
      messageContent$.css({"--chat-font-size-large": "12px", "--chat-line-height-large": "16px"})
      endHeight = message$.height() ?? 0;
    }
    results$.css({
      visibility: "hidden",
      opacity: ""
    });
    message$.css({minHeight: curHeight, maxHeight: curHeight});
    messageContent$.css({minHeight: curHeight, maxHeight: curHeight});

    // console.log({curHeight, endHeight});

    const tl = U.gsap.timeline()
      // Timeline: Initiate chat message so it is a constant height; will expand as results are revealed
      // .to(messageContent$, {overflow: "hidden", duration: 0})
      // .to([message$, messageContent$], {minHeight: curHeight, maxHeight: curHeight, duration: 0})

      // Drop in Attribute if there is one
      .dropIn(attrFlare$, {y: -100}, 0.5)

      // Allow overflow visibility for scaling in of animation
      .set(gearContainer$, {overflow: "visible"}, "<")

      // Timeline: Outer Gear Component
      .rollOuterGear(outerGear$, {}, "<")

      // Timeline: Middle Gear Component
      .rollMiddleGear(middleGear$, {}, "<")

      // Timeline: Dice
      .bounceInDice(d10s$, {}, "<+0.2")

      // Timeline: Total Number Component
      .slideIn(totalNum$, {xPercent: -50, yPercent: -50}, "-=0.4")

      // Timeline: Outcome Component
      .slideIn(outcome$, {}, "-=0.25");

      // Timeline: Expand chat message to its full height
      tl.to([message$, messageContent$], {maxHeight: endHeight, duration: 1,
        onUpdate() {
          const newHeight = message$.height() ?? curHeight;
          if (newHeight !== curHeight) {
            K4ChatMessage.ChatLog$[0].scrollTo({top: K4ChatMessage.ChatLog$[0].scrollHeight + (newHeight - curHeight)/* , behavior: "smooth" */});
            curHeight = newHeight;
            // console.log({curHeight});
          }
        }
      }, ">")

      // As outcome is revealed, animate theme-switch for failure or complete success
      if (chatContainer$.hasClass("roll-failure")) {
        tl.animateFailure(target, {}, "<");
      } else if (chatContainer$.hasClass("roll-success")) {
        tl.animateSuccess(target, {}, "<");
      }

      // Timeline: Stagger In Results
      tl.staggerInResults(results$, {}, "<+=0.5")

      // Add a label after the results have animated in, at which point changes to the Actor should occur.
      .addLabel("revealed")

      // Timeline: Slowly shrink roll terms
      .slowShrink(d10s$, {fromScale: 1, toScale: 0.8, yShift: -10, duration: 5}, ">+3")
      // .slowShrink(attrFlare$, {fromScale: 0.8, toScale: (0.8 * 0.8), yShift: -10, duration: 5}, ">+3")

      // Add a label to seek to when killing the timeline (slowShrink will be the last tween to finish)
      .addLabel("end");

    return tl;
  },
  animateChatTrigger(target: HTMLElement): gsap.core.Timeline {
    const target$ = $(target);

    return U.gsap.timeline()
      .to(target$, { x: -200, duration: 0.5, ease: "bounce"})
      .to(target$, {x: 0, duration: 0.5, ease: "bounce"})
      .addLabel("revealed")
      .addLabel("end");
  }
}
// #region === K4ChatMessage CLASS ===
class K4ChatMessage extends ChatMessage {
  // #region INITIALIZATION ~
  static async GenerateInputPanel(html: JQuery): Promise<void> {

    // Load the template for the chat input control panel
    const template = await getTemplate(U.getTemplatePath("sidebar", "chat-input-control-panel"));
    // Convert the template into a jQuery object
    const buttonHtml = $(template({}));
    // Find the chat form in the rendered HTML
    const chatForm = html.find("#chat-form").attr("data-type", "ic");
    // Append the control panel to the chat form
    chatForm.append(buttonHtml);

    // Add click event listener for the In-Character button
    buttonHtml.find("#ic").on("click", (event: ClickEvent) => {
      event.preventDefault(); // Prevent the default form submission
      ui.notifications.info("Message is In-Character"); // Notify the user
      chatForm.attr("data-type", "ic"); // Set the data-type attribute to "ic"
    });
    // Add click event listener for the Out-of-Character button
    buttonHtml.find("#ooc").on("click", (event: ClickEvent) => {
      event.preventDefault(); // Prevent the default form submission
      ui.notifications.info("Message is Out-of-Character"); // Notify the user
      chatForm.attr("data-type", "ooc"); // Set the data-type attribute to "ooc"
    });
    // Add click event listener for the GM Whisper button
    buttonHtml.find("#gm").on("click", (event: ClickEvent) => {
      event.preventDefault(); // Prevent the default form submission
      ui.notifications.info("Message will be Whispered to the GM"); // Notify the user
      chatForm.attr("data-type", "gm"); // Set the data-type attribute to "gm"
    });
  }

  static RegisterGsapEffects() {
    Object.entries(GSAPEFFECTS).forEach(([name, effect]) => {
      U.gsap.registerEffect({name, ...effect});
    });
  }

  static get ChatLog$(): JQuery {
    return $("#chat-log");
  }

  static GetMessage(ref: string|JQuery|HTMLElement): Maybe<K4ChatMessage> {
    if (typeof ref === "string") {
      return game.messages.get(ref) as Maybe<K4ChatMessage>;
    } else if (ref instanceof HTMLElement) {
      const message$ = $(ref).closest(".chat-message");
      const messageId = message$.data("messageId");
      return game.messages.get(messageId) as Maybe<K4ChatMessage>;
    } else {
      const messageId = $(ref).data("messageId");
      return game.messages.get(messageId) as Maybe<K4ChatMessage>;
    }
  }
  /**
  * Pre-Initialization of the K4ChatMessage class. This method should be run during the "init" hook.
  *
  * - Registers the K4ChatMessage class as the system's ChatMessage document class.
  * - Sets the sidebar icon for the Chat tab to a microphone icon.
  * - Sets the default template for system chat messages to the "sidebar/chat-message" template.
  * - Registers a "renderChatLog" hook to add a control panel to the chat input panel for players to select the message type.
  * - Registers a "renderChatMessage" hook to apply custom CSS classes to chat messages based on their flags.
  *
  * @returns {Promise<void>} A promise that resolves when the hook is registered.
  */
  static async PreInitialize(): Promise<void> {

    // Register the K4ChatMessage class as the document type for ChatMessage
    CONFIG.ChatMessage.documentClass = K4ChatMessage;

    // Customize the sidebar icon for the Chat tab
    CONFIG.ChatMessage.sidebarIcon = "fa-regular fa-microphone-lines";

    // Set the default template for system chat messages
    CONFIG.ChatMessage.template = U.getTemplatePath("sidebar", "chat-message");

    // Register GSAP effects
    K4ChatMessage.RegisterGsapEffects();

    // Register a hook to run when the chat log is rendered
    Hooks.on("renderChatLog", async (_log: ChatLog, html: JQuery, _options: unknown) => {
      // Generate the button panel for setting input type
      K4ChatMessage.GenerateInputPanel(html);
    });

    // Register a hook to run when a chat message is rendered
    Hooks.on("renderChatMessage", async (message: K4ChatMessage, html) => {
      // kLog.log(`RENDERING ${message.isLastMessage ? "LAST " : ""}CHAT MESSAGE`, message);
      // Apply custom CSS classes to the chat message based on its flags
      message.applyFlagCSSClasses(html);

      // Apply listeners
      message.activateListeners(html);

      // Introduce a brief pause to let the DOM settle
      await U.sleep(1500);

      // If this is the last chat message, animate it and freeze any animations of currently-animating messages
      if (message.isLastMessage) {
        message.animate();
        game.messages
          .filter((msg) => msg.isAnimated && msg.id !== message.id)
          .forEach((msg) => msg.freeze());
      } else {
        // Otherwise, kill all tweens and hide video elements
        message.freeze();
      }
    });
  }
  // #endregion

  static override create(data: K4ChatMessage.ConstructorData, context?: Context): Promise<Maybe<K4ChatMessage>> {
    return super.create(data as ChatMessageDataConstructorData, context);
  }



  animationTimeline?: gsap.core.Timeline;
  get timelinePromise(): Promise<void> {
    if (this.animationTimeline) { return Promise.resolve(); }
    // if (!this.isAnimated) { return Promise.resolve(undefined); }
    // Return a promise that checks every 250ms for _animationTimeline and resolves when it is defined.
    return new Promise((resolve, reject) => {
      // kLog.display("Awaiting Timeline Promise...");
      const intervalId = setInterval(() => {
        if (this.animationTimeline) {
          // kLog.display("Timeline Promise Resolved!", {timeline: this.animationTimeline});
          clearInterval(intervalId); // Stop checking
          clearTimeout(timeoutId); // Clear the timeout
          resolve(); // Resolve the promise
        }
        // kLog.display("Awaiting Timeline Promise...", {timeline: this.animationTimeline})
      }, 250);

      // Set a timeout to reject the promise after 10 seconds
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId); // Stop checking
        reject(new Error("Timed out waiting for _animationTimeline to be defined"));
      }, 10000); // 10 seconds
    });
  }
  get animationsPromise(): Promise<void> {
    if (!this.isAnimated) {
      // kLog.display("Message isn't animated: Resolving.");
      return Promise.resolve();
    }

    return new Promise(async (resolve) => {
      // kLog.display("Awaiting Timeline", {message: this, timelinePromise: this.timelinePromise});
      await this.timelinePromise;
      // kLog.display("Timeline Promise Resolved!");
      const timeline = this.animationTimeline as gsap.core.Timeline;
      if (!timeline) { return; }
      const labelTime = timeline.labels["revealed"];
      const watchLabel = () => {
        if (timeline.time() >= labelTime) {
          // kLog.display(`Message Animation Complete! (timeline.time = ${timeline.time()})`);
          resolve();
          return;
        }
        // kLog.display(`Awaiting Message Animation (timeline.time = ${timeline.time()})...`);
        setTimeout(watchLabel, 250);
      };
      watchLabel();
    });
  }
  get cssClasses(): string[] {
    return (this.getFlag("kult4th", "cssClasses") ?? []) as string[];
  }

  get isAnimated(): boolean {
    return this.getFlag("kult4th", "isAnimated") as boolean;
  }
  set isAnimated(value: boolean) {
    this.setFlag("kult4th", "isAnimated", value);
    if (!value) {
      this.addClass("not-animating");
    }
  }



  animate() {
    if (!this.isAnimated) { return; }
    this.freeze(false);
    if (this.isChatRoll) {
      this.animationTimeline = ANIMATIONS.animateChatRoll(this.elem$[0]);
    } else if (this.isChatTrigger) {
      this.animationTimeline = ANIMATIONS.animateChatTrigger(this.elem$[0]);
    }
  }
  freeze(isPermanent = true) {
    this.videoElements.css("display", "none");
    if (isPermanent) {
      this.addClass("not-animating");
    }
    if (!this.isAnimated) { return; }
    if (!this.animationTimeline) {
      if (isPermanent) {
        this.isAnimated = false;
      }
      return;
    }
    this.animationTimeline.seek("end");
    this.animationTimeline.kill();
    if (isPermanent) {
      this.isAnimated = false;
    }
  }

  // #region STATIC METHODS ~
  /**
   * Given a string, will return the URL to the drop cap image for the first character of that string.
   * @param {string} content - The string to extract the first character from.
   * @returns {string} The URL to the drop cap image for the first character of the string.
   */
  static GetDropCap(content: string): string {
    if (!content || !content.length) {
      return ""
    };
    return `systems/kult4th/assets/chat/dropcaps/${content.slice(0, 1).toUpperCase()}.png`;
  }
  // #endregion

  // #region CONSTRUCTOR ~
  constructor(data: K4ChatMessage.ConstructorData, context?: Context) {
    super(data, context);
  }
  // #endregion

  // #region GETTERS & SETTERS ~

  get elem$(): JQuery {
    return K4ChatMessage.ChatLog$.find(`[data-message-id="${this.id}"]`);
  }
  get videoElements(): JQuery {
    return this.elem$.find("video");
  }
  get previousMessage(): Maybe<K4ChatMessage> {
    const prevMessage = this.elem$.prev(".chat-message");
    if (!prevMessage.length) { return; }
    return K4ChatMessage.GetMessage(prevMessage);
  }
  get isLastMessage(): boolean {
    return this.id === U.getLast(Array.from(game.messages)).id;
  }
  get isChatRoll(): boolean {
    return (this.getFlag("kult4th", "isRoll") ?? false) as boolean;
  }
  get isChatTrigger(): boolean {
    return (this.getFlag("kult4th", "isTrigger") ?? false) as boolean;
  }
  get isResult(): boolean {
    return this.isChatRoll || this.isChatTrigger;
  }
  get actor(): Maybe<K4Actor> {
    return game.actors.get(this.speaker.actor ?? "") as Maybe<K4Actor>;
  }
  // #endregion

  // #region HTML PARSING
  static CapitalizeFirstLetter(content: string): string {

    // Parse the stringified HTML content into a DOM element
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    // Function to capitalize the first letter of a text node
    const capitalizeTextNode = (textNode: Text) => {
      if (textNode.textContent) {
        textNode.textContent = textNode.textContent.charAt(0).toUpperCase() + textNode.textContent.slice(1);
      }
    };

    // Find the element that immediately follows .roll-source-header
    const rollSourceHeader = doc.querySelector(".roll-source-header");

    if (rollSourceHeader) {
      const nextElement = rollSourceHeader.nextElementSibling;

      if (nextElement) {
        // Traverse the child nodes to find the first text node with content
        const walker = document.createTreeWalker(nextElement, NodeFilter.SHOW_TEXT, {
          // Only accept text nodes with non-whitespace content
          acceptNode: (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        });

        const firstTextNode = walker.nextNode();

        if (firstTextNode) {
          capitalizeTextNode(firstTextNode as Text);
        }
      }
    }

    // Serialize the modified DOM back to a string
    return doc.body.innerHTML;
  }
  addClass(cls: string, html?: JQuery) {
    this.setFlag("kult4th", "cssClasses", U.unique([...this.cssClasses, cls]))
        .then(() => this.applyFlagCSSClasses(html));
  }
  remClass(cls: string, html?: JQuery) {
    this.setFlag("kult4th", "cssClasses", this.cssClasses.filter((c) => c !== cls))
        .then(() => this.applyFlagCSSClasses(html));
  }
  applyFlagCSSClasses(html?: JQuery) {
    (html ?? this.elem$).addClass(this.cssClasses.join(" "));
  }

  activateListeners(html?: JQuery) {
    html ??= this.elem$;
    html.find(".tooltip").parent()
      .each((_, parent) => {
        K4ActiveEffect.ApplyTooltipListener($(parent));
      });

    /**
     * @todo Add general-purpose listeners that select for [data-] attributes and apply corresponding event listeners to them.
     * - data-action="choose-option" (for cases where individual options have effects that must be selected and applied)
     * - data-action="claim-modifier" (e.g. the target of a Help/Hinder roll can click this to claim the bonus/penalty conferred)
     * - data-action="change-gm-modifier" (the GM can click this to add a new modifier and then increment it to correct for any errors in roll formulation,
     *                                       or right-click it to reduce the value. At zero, custom modifier will not be displayed to players.)
     */
  }
  // #endregion

}

// #region -- K4ChatMessage INTERFACE -- ~
interface K4ChatMessage {
  content: string;
}
// #endregion

// #ENDREGION

// #region EXPORTS ~
export default K4ChatMessage;
// #endregion
