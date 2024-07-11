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

// interface GSAPEffects {
//   [key: keyof typeof GSAPEFFECTS]: gsap.core.Timeline
// }
const GSAPEFFECTS = {
  animateFailure: {
    effect: (target: JQuery|HTMLElement, config: Record<string, unknown>) => {
      const {duration, stagger, ease} = config as {duration: number, stagger: number, ease: string};

      const msg$ = $(target);
      const msgBgBase$ = msg$.find(".message-bg.bg-base");
      msg$.find(".message-bg.bg-fail").css("visibility", "visible");


      const msgDropCap = msg$.find(".drop-cap");
      const msgAttrFlare = msg$.find(".roll-term-container[class*='attribute-']");
      const msgIntro = msg$.find(".roll-char-name, .roll-intro-line");
      const msgIcon = msg$.find(".icon-container .chat-icon");
      const msgSource = msg$.find(".roll-source-header");
      const msgGears = msg$.find(".roll-total-gear > img");
      const msgTotal = msg$.find(".roll-total-number");
      const msgOutcomeMain = msg$.find(".roll-outcome .roll-outcome-main");
      const msgOutcomeSub = msg$.find(".roll-outcome .roll-outcome-sub");
      const msgTextToRed = msg$.find(".roll-char-name, .roll-intro-line, .text-attributename, .roll-source-source-name .roll-source-text, .roll-dice-results ~ * *");
      const msgTextToBlack = msg$.find(".roll-source-name .roll-source-text");
      return U.gsap.timeline({ease, clearProps: true})
        .to(msgBgBase$, {autoAlpha: 0, duration, ease: "power2.inOut"})
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

const MASTERTIMELINE = (message$: JQuery, msg: K4ChatMessage, stagger?: ValueOrIndex<number>) => {

  stagger ??= [
    0.5,      // intro line stagger
    1,        // source line stagger
    1,        // dice stagger
    0,        // modifiers stagger
    0,        // total stagger
    1.75,      // outcome stagger
    1,        // window scroll stagger
    0,        // success/fail stagger
    0         // results stagger
  ];
  if (typeof stagger === "number") {
    stagger = (new Array(8)).fill(stagger);
  }

  const staggers = stagger as number[];

  // Determine the current and maximum height of the message for scrolling purposes
  const messageContent$ = message$.find(".message-content");
  const results$ = message$.find(".roll-dice-results ~ div, .roll-dice-results ~ label, .roll-dice-results ~ h2, .roll-dice-results ~ ul li");
  const curHeight = message$.height() ?? 0;
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

  const tl = U.gsap.timeline()
    .add(CHILD_TIMELINES.animateCharName(message$))
    .add(CHILD_TIMELINES.animateIntroLine(message$), `<+=${staggers[0]}`)
    .add(CHILD_TIMELINES.animateSource(message$), `<+=${staggers[1] ?? U.getLast(staggers)}`)
    .add(CHILD_TIMELINES.animateDice(message$), `<+=${staggers[2] ?? U.getLast(staggers)}`)
    .add(CHILD_TIMELINES.animateModifiers(message$), `<+=${staggers[3] ?? U.getLast(staggers)}`)
    .add(CHILD_TIMELINES.animateTotal(message$), `<+=${staggers[4] ?? U.getLast(staggers)}`)
    .add(CHILD_TIMELINES.animateOutcome(message$), `<+=${staggers[5] ?? U.getLast(staggers)}`)
    .add(CHILD_TIMELINES.animateWindowSize(message$, curHeight, endHeight), `<+=${staggers[6] ?? U.getLast(staggers)}`);

  if (message$.hasClass("roll-failure")) {
    tl.add(CHILD_TIMELINES.animateToFailure(message$), `<+=${staggers[7] ?? U.getLast(staggers)}`);
  } else if (message$.hasClass("roll-success")) {
    tl.add(CHILD_TIMELINES.animateToSuccess(message$), `<+=${staggers[7] ?? U.getLast(staggers)}`);
  } else if (message$.hasClass("roll-partial")) {
    tl.add(CHILD_TIMELINES.animateToPartial(message$), `<+=${staggers[7] ?? U.getLast(staggers)}`);
  }

  tl.add(CHILD_TIMELINES.animateResults(message$), `<+=${staggers[8] ?? U.getLast(staggers)}`);
  tl.addLabel("revealed");
  tl.call(() => {
    setTimeout(() => {
      msg.isAnimated = false;
    }, 50000)
  });

  return tl;
}

const CHILD_TIMELINES = {
  animateCharName(message$: JQuery): gsap.core.Timeline {
    // const messageContent$ = message$.find(".message-content");
    const dropCap$ = message$.find(".drop-cap");
    const charName$ = message$.find(".roll-char-name");

    // Split the character name into individual letters
    const splitCharName = new SplitText(charName$, { type: "chars" });
    // Set chatName$ to visibility: visible
    charName$.css("visibility", "visible");

    // Return a timeline that staggers the reveal of both the dropcap and the letters of the character name
    return U.gsap.timeline({
      clearProps: "all",
      onReverseComplete() {
        splitCharName.revert();
      }
    })
      .fromTo(dropCap$, {
        autoAlpha: 0,
        filter: "blur(100px)",
        scale: 5,
        x: -200,
        y: -100,
      }, {
        autoAlpha: 1,
        filter: "blur(0px)",
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power3"
      })
      .fromTo(splitCharName.chars, {
        autoAlpha: 0,
        skewX: -65,
        x: -80,
        filter: "blur(15px)"
      }, {
        autoAlpha: 1,
        skewX: 0,
        x: 0,
        filter: "blur(0px)",
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out"
      }, 0);
  },
  animateIntroLine(message$: JQuery): gsap.core.Timeline {
    const introLine$ = message$.find(".roll-intro-line");
    const attrTerm$ = message$.find(".text-attributename").attr("style", "");
    const attrFlare$ = message$.find(".roll-term-container[class*='attribute']");

    const splitIntroLine = new SplitText(introLine$, { type: "words" });
    // Set introLine$ to visibility: visible
    introLine$.css("visibility", "visible");

    return U.gsap.timeline({
      onReverseComplete() {
        splitIntroLine.revert();
      }
    })
      .fromTo(splitIntroLine.words, {
        autoAlpha: 0,
        x: -100,
        filter: "blur(50px)"
      }, {
        autoAlpha: 1,
        x: 0,
        filter: "blur(0px)",
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1
      }, 0)
      .fromTo(attrTerm$, {
          filter: "brightness(1) saturate(1)",
          display: "inline-block",
          scale: 1
      }, {
          filter: "saturate(2) brightness(1.5) ",
          scale: 1.35,
          repeat: 1,
          yoyo: true,
          duration: 0.5,
          ease: "power2.inOut"
      }, "-=25%")
      .fromTo(attrFlare$, {
        y: -100,
        scale: 0.64,
        autoAlpha: 0
      }, {
        y: 0,
        scale: 0.64,
        autoAlpha: 1,
        ease: "elastic",
        duration: 2
      }, "-=45%")
      // Call a delayed slow-shrink of the attribute flare a callback so that it doesn't change the timeline's duration
      .call(() => {
        U.gsap.fromTo(attrFlare$,
          {
            y: 0
          }, {
            y: -10,
            ease: "back.out",
            delay: 3,
            duration: 5
          });
      });
  },
  animateSource(message$: JQuery, stagger = 0): gsap.core.Timeline {
    const sourceHeader$ = message$.find(".roll-source-header");
    const sourceName$ = message$.find(".roll-source-name");
    const sourceIcon$ = message$.find(".icon-container.icon-base");

    // Extract RGB values from source header's border color, then define an rgba value with 0 alpha
    const borderRGB = sourceHeader$.css("border-top-color").match(/\d+/g)?.join(",") ?? "255,255,255";
    const borderColorStart = `rgba(${borderRGB}, 0)`;
    const borderColorEnd = `rgba(${borderRGB}, 1)`;

    const tl = U.gsap.timeline()
      .fromTo(sourceHeader$, {
          autoAlpha: 0,
          borderColor: borderColorStart,
      }, {
          autoAlpha: 1,
          borderColor: borderColorEnd,
          delay: 0,
          background: "#000000",
          duration: 0.25,
          ease: "power2.out"
      });

    if (stagger > 0) {
      // Split the source name into individual words
      const splitSourceNameWords = new SplitText(sourceName$, { type: "words" });
      // Set sourceName$ to visibility: visible
      sourceName$.css("visibility", "visible");

      // Add the source name animation to the timeline
      tl.add(U.gsap.timeline({
        onReverseComplete() {
          splitSourceNameWords.revert();
        }
      })
        .fromTo(splitSourceNameWords.words, {
          autoAlpha: 0,
          x: 0,
          scale: 2,
          filter: "blur(1px) brightness(2)"
        }, {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          filter: "blur(0px) brightness(1)",
          duration: 0.5,
          ease: "power2.out",
          stagger
        }), 0.15);
    } else {
      tl
        .fromTo(sourceName$, {
          autoAlpha: 0,
          x: 0,
          scale: 2,
          filter: "blur(1px) brightness(5)"
        }, {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          filter: "blur(0px) brightness(1)",
          duration: 0.5,
          ease: "power2.out",
          stagger
        }, 0.25);
    }

    return tl
      .fromTo(sourceIcon$, {
          autoAlpha: 0,
          x: -100,
          y: 0,
          scale: 1,
          filter: "blur(50px)"
        }, {
          autoAlpha: 1,
          scale: 1,
          x: 0,
          y: 0,
          filter: "blur(0px)",
          duration: 0.5,
          ease: "power2.out"
        }, ">-25%");
  },
  animateDice(message$: JQuery): gsap.core.Timeline {
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
        duration: 0.5,
        stagger: 0.25
      })
      // Manually stagger the play calls for each video
      .call(() => { d10VideoA.currentTime = 0; void d10VideoA.play() }, undefined, 0.25)
      .call(() => { d10VideoB.currentTime = 0; void d10VideoB.play() }, undefined, 0.75)
      // Call a delayed slow-shrink of the dice within a callback so that it doesn't change the timeline's duration
      .call(() => {
        U.gsap.fromTo(d10s$, {
          scale: 1
        }, {
          y: -10,
          scale: 0.8,
          ease: "back.out",
          delay: 3,
          duration: 5
        });
      });
  },
  animateModifiers(message$: JQuery): gsap.core.Timeline {
    const modifiers$ = message$.find(".roll-modifiers .roll-mod");

    return U.gsap.timeline()
      .fromTo(modifiers$, {
        autoAlpha: 0,
        x: -100,
        filter: "blur(50px)"
      }, {
        autoAlpha: 1,
        x: 0,
        filter: "blur(0px)",
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      });
  },
  animateTotal(message$: JQuery): gsap.core.Timeline {
    const msgContainer$ = message$.find(".message-content");
    const gearContainer$ = message$.find(".roll-total-gear");
    kLog.log("Gear Containers: ", {msgContainer$, gearContainer$});
    const middleGear$ = gearContainer$.find("[class*='middle-ring']");
    const outerGear$ = gearContainer$.find("[class*='outer-ring']");
    const totalNum$ = message$.find(".roll-total-number");

    return U.gsap.timeline()
      // Timeline: Outer Gear Component
      .fromTo(outerGear$, {
        scale: 5,
        filter: "blur(15px)"
      }, {
        autoAlpha: 0.85,
        scale: 1,
        filter: "blur(1.5px)",
        ease: "power2.inOut",
        duration: 1,
        onStart() {
          msgContainer$.css("overflow", "visible");
          gearContainer$.css("overflow", "visible");
        },
        onComplete() {
          msgContainer$.css("overflow", "");
          gearContainer$.css("overflow", "");
          U.gsap.to(outerGear$, {
            rotation: "+=360",
            repeat: -1,
            duration: 30,
            ease: "none"
          });
        }
      })

      // Timeline: Middle Gear Component
      .fromTo(middleGear$, {
        scale: 2
      }, {
        rotation: "+=360",
        scale: 1,
        autoAlpha: 1,
        ease: "power3.out",
        duration: 1
      }, 0)
      .to(middleGear$, {
        scale: 1.25,
        duration: 0.5,
        repeat: 1,
        ease: "power2.in",
        yoyo: true,
        onComplete() {
          U.gsap.to(middleGear$, {
            rotation:      "-=20",
            duration:      0.4,
            repeatRefresh: true,
            repeatDelay:   1.6,
            ease:          "back.out(5)",
            repeat:        -1
          })
        }
      })

      // Timeline: Total Number Component
      .fromTo(totalNum$, {
        transformOrigin: "center center",
        // skewX: -25,
        scale: 1.25,
        // x: 100,
        autoAlpha: 0,
        xPercent: -50,
        yPercent: -50,
        filter: "blur(50px) brightness(5)"
    }, {
        autoAlpha: 1,
        // skewX: 0,
        // x: 0,
        scale: 1,
        filter: "blur(0px) brightness(1)",
        ease: "power2.inOut",
        duration: 1
    }, ">-=1.15");
  },
  animateOutcome(message$: JQuery): gsap.core.Timeline {
    const outcome$ = message$.find(".roll-outcome > *");
    return U.gsap.timeline()
      .fromTo(outcome$, {
        transformOrigin: "center center",
        skewX: -25,
        scale: 1,
        x: 100,
        autoAlpha: 0,
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
  animateWindowSize(message$: JQuery, curHeight: number, maxHeight: number): gsap.core.Timeline {
    const messageContent$ = message$.find(".message-content");
    // Timeline: Expand chat message to its full height
    return U.gsap.timeline()
      .to([message$, messageContent$], {
        maxHeight,
        duration: 1,
        onUpdate() {
          const newHeight = message$.height() ?? curHeight;
          if (newHeight !== curHeight) {
            K4ChatMessage.ChatLog$[0].scrollTo({
              top: K4ChatMessage.ChatLog$[0].scrollHeight + (newHeight - curHeight)
            });
            curHeight = newHeight;
          }
        }
      });
  },
  animateToSuccess(message$: JQuery): gsap.core.Timeline {
    const msgBgBase$ = message$.find(".message-bg.bg-base");
    message$.find(".message-bg.bg-success").css("visibility", "visible");


    const msgDropCap$ = message$.find(".drop-cap");
    const msgCharName$ = message$.find(".roll-char-name *");
    const msgIntroLine$ = message$.find(".roll-intro-line *");
    const msgAttrName$ = message$.find(".roll-intro-line .text-attributename *");
    const msgIconBase$ = message$.find(".icon-container.icon-base");
    const msgIconSuccess$ = message$.find(".icon-container.icon-success");

    const msgSource = message$.find(".roll-source-header");
    const msgSourceName$ = msgSource.find(".roll-source-name .roll-source-text");
    const msgGears = message$.find(".roll-total-gear > img");
    const msgTotal = message$.find(".roll-total-number");
    const msgOutcomeMain = message$.find(".roll-outcome .roll-outcome-main");
    const msgOutcomeSub = message$.find(".roll-outcome .roll-outcome-sub");
    const msgTextToBrightGold = message$.find(".roll-source-source-name .roll-source-text, .roll-dice-results ~ * *");

    return U.gsap.timeline({ease: "power3.in", clearProps: true})
      .to(msgBgBase$, {autoAlpha: 0, duration: 1, ease: "power2.inOut"})
      .to(msgIconSuccess$, {autoAlpha: 1, duration: 0.25, ease: "power2.inOut"}, 0)
      .to(msgCharName$, {color: C.Colors.bGOLD, duration: 1, ease: "power2.inOut"}, 0)
      .to(msgIntroLine$, {color: C.Colors.bGOLD, duration: 1, ease: "power2.inOut"}, 0)
      .to(msgAttrName$, {color: C.Colors.bGOLD, filter: "brightness(3) saturate(1.5)", duration: 1, ease: "power2.inOut"}, 0)
      .fromTo(msgDropCap$, {filter: "sepia(0) brightness(1) hue-rotate(0deg) saturate(1) contrast(1) drop-shadow(0px 0px 0px rgba(0, 0, 0, 0)"}, {filter: `sepia(0) brightness(1.5) contrast(5) drop-shadow(2px 2px 2px ${C.Colors.dBLACK})`, duration: 1}, 0)
        // .fromTo(msgAttrFlare, {filter: "sepia(0) brightness(1) hue-rotate(0deg) saturate(1) contrast(1)"}, {filter: "sepia(5) brightness(0.25) saturate(5) hue-rotate(-45deg) saturate(3) brightness(1) contrast(1)", duration: 1}, 0)
        .fromTo(msgGears, {filter: "blur(1.5px) sepia(0) brightness(1) hue-rotate(0deg) saturate(1) contrast(1)"}, {filter: "blur(1.5px) brightness(1.5) saturate(0.5)", duration: 1}, 0)
        .fromTo(msgTotal, {filter: "brightness(1) saturate(1) contrast(1)"}, {filter: "brightness(1.5) saturate(2) contrast(1)", duration: 1}, 0)
        .to(msgIconBase$, {autoAlpha: 0, duration: 1}, 0)


        .to(msgSource, {opacity: 0, duration: 0.5, ease: "power2.out"}, 0)
        .set(msgSource, {borderTopColor: C.Colors.gGOLD, borderBottomColor: C.Colors.gGOLD, background: "transparent url('/systems/kult4th/assets/backgrounds/texture-gold.webp') repeat repeat center center/300px"}, 0.5)
        .to(msgSource, {opacity: 1, duration: 0.5, ease: "power2.out"}, 0.5)

        .fromTo(msgSourceName$, {
          textShadow: "0 0 0 rgb(0, 0, 0), 0 0 0 rgb(0, 0, 0), 0 0 0 rgb(0, 0, 0), 0 0 0 rgb(0, 0, 0), 0 0 0 rgb(0, 0, 0), 0 0 0 rgb(0, 0, 0)"},  {
          color: C.Colors.dBLACK,
          textShadow: `0 0 5px ${C.Colors.bGOLD}, 0 0 5px ${C.Colors.bGOLD}, 0 0 5px ${C.Colors.bGOLD}, 0 0 5px ${C.Colors.bGOLD}, 0 0 5px ${C.Colors.bGOLD}, 0 0 5px ${C.Colors.bGOLD}`
        }, 0)
        .to(msgOutcomeMain, {filter: "saturate(0.25)", color: "rgb(255, 255, 255)", textShadow: "0 0 2px rgba(255, 255, 255, 0.8), 0 0 4px rgba(255, 255, 255, 0.8), 0 0 4.5px rgba(255, 255, 255, 0.8), 0 0 8px rgba(220, 220, 65, 0.8), 0 0 12.5px rgba(220, 220, 65, 0.8), 0 0 16.5px rgba(220, 220, 65, 0.5), 0 0 21px rgba(220, 220, 65, 0.5), 0 0 29px rgba(220, 220, 65, 0.5), 0 0 41.5px rgba(220, 220, 65, 0.5)", duration: 1, onComplete() {
          msgOutcomeMain.addClass("neon-glow-strong-gold");
          msgOutcomeMain.attr("style", "color: rgb(255, 255, 255); visibility: visible; filter: saturate(0.45)");
        }}, 0)
        .to(msgOutcomeSub, {color: C.Colors.gGOLD, textShadow: "none", duration: 1}, 0)
        .to(msgTextToBrightGold, {color: C.Colors.bGOLD, duration: 1}, 0);
  },
  animateToFailure(message$: JQuery): gsap.core.Timeline {
    /*  const {duration, stagger, ease} = config as {duration: number, stagger: number, ease: string};
      duration: 1,
      stagger: 0,
      ease: "power3.in" */
    const msgBgBase$ = message$.find(".message-bg.bg-base");
    message$.find(".message-bg.bg-fail").css("visibility", "visible");


    const msgDropCap$ = message$.find(".drop-cap");
    const msgAttrFlare = message$.find(".roll-term-container[class*='attribute-']");
    const msgCharName$ = message$.find(".roll-char-name *");
    const msgIntroLine$ = message$.find(".roll-intro-line *");
    const msgAttrName$ = message$.find(".roll-intro-line .text-attributename *");
    const msgIconBase$ = message$.find(".icon-container.icon-base");
    const msgIconFail$ = message$.find(".icon-container.icon-fail");

    const msgSource = message$.find(".roll-source-header");
    const msgSourceName$ = msgSource.find(".roll-source-name .roll-source-text");
    const msgGears = message$.find(".roll-total-gear > img");
    const msgTotal = message$.find(".roll-total-number");
    const msgOutcomeMain = message$.find(".roll-outcome .roll-outcome-main");
    const msgOutcomeSub = message$.find(".roll-outcome .roll-outcome-sub");
    const msgTextToRed = message$.find(".roll-source-source-name .roll-source-text, .roll-dice-results ~ * *");
    // const msgTextToBlack = message$.find(".roll-source-name .roll-source-text");
    return U.gsap.timeline({ease: "power3.in", clearProps: true})
      .to(msgBgBase$, {autoAlpha: 0, duration: 1, ease: "power2.inOut"})
      .to(msgIconFail$, {autoAlpha: 1, duration: 0.25, ease: "power2.inOut"}, 0)
      .to(msgCharName$, {color: C.Colors.bRED, duration: 1, ease: "power2.inOut"}, 0)
      .to(msgIntroLine$, {color: C.Colors.bRED, duration: 1, ease: "power2.inOut"}, 0)
      .to(msgAttrName$, {color: C.Colors.bRED, filter: "brightness(3) saturate(1.5)", duration: 1, ease: "power2.inOut"}, 0)
      .fromTo(msgDropCap$, {filter: "sepia(0) brightness(1) hue-rotate(0deg) saturate(1) contrast(1) drop-shadow(0px 0px 0px rgba(0, 0, 0, 0)"}, {filter: `sepia(0) brightness(0.5) saturate(3) hue-rotate(-45deg) saturate(1) contrast(5) drop-shadow(2px 2px 2px ${C.Colors.dBLACK})`, duration: 1}, 0)
        // .fromTo(msgAttrFlare, {filter: "sepia(0) brightness(1) hue-rotate(0deg) saturate(1) contrast(1)"}, {filter: "sepia(5) brightness(0.25) saturate(5) hue-rotate(-45deg) saturate(3) brightness(1) contrast(1)", duration: 1}, 0)
        .fromTo(msgGears, {filter: "blur(1.5px) sepia(0) brightness(1) hue-rotate(0deg) saturate(1) contrast(1)"}, {filter: "blur(1.5px) sepia(5) brightness(0.65) saturate(5) hue-rotate(-45deg) contrast(2)", duration: 1}, 0)
        .fromTo(msgTotal, {filter: "brightness(1) saturate(1) contrast(1)"}, {filter: "brightness(0.75) saturate(2) contrast(1)", duration: 1}, 0)
        .to(msgIconBase$, {autoAlpha: 0, duration: 1}, 0)

        .to(msgSource, {opacity: 0, duration: 0.5, ease: "power2.out"}, 0)
        .set(msgSource, {borderTopColor: C.Colors.gRED, borderBottomColor: C.Colors.gRED, background: "transparent url('/systems/kult4th/assets/backgrounds/texture-red.webp') repeat repeat center center/300px"}, 0.5)
        .to(msgSource, {opacity: 1, duration: 0.5, ease: "power2.out"}, 0.5)
        .fromTo(msgSourceName$, {
          textShadow: "0 0 0 rgb(0, 0, 0), 0 0 0 rgb(0, 0, 0), 0 0 0 rgb(0, 0, 0), 0 0 0 rgb(0, 0, 0), 0 0 0 rgb(0, 0, 0), 0 0 0 rgb(0, 0, 0)"},  {
          color: C.Colors.dBLACK,
          textShadow: `0 0 5px ${C.Colors.bRED}, 0 0 5px ${C.Colors.bRED}, 0 0 5px ${C.Colors.bRED}, 0 0 5px ${C.Colors.bRED}, 0 0 5px ${C.Colors.bRED}, 0 0 5px ${C.Colors.bRED}`
        }, 0)
        .to(msgOutcomeMain, {color: "rgb(255, 255, 255)", textShadow: "0 0 2px rgba(255, 255, 255, 0.8), 0 0 4px rgba(255, 255, 255, 0.8), 0 0 4.5px rgba(255, 255, 255, 0.8), 0 0 8px rgba(220, 65, 65, 0.8), 0 0 12.5px rgba(220, 65, 65, 0.8), 0 0 16.5px rgba(220, 65, 65, 0.5), 0 0 21px rgba(220, 65, 65, 0.5), 0 0 29px rgba(220, 65, 65, 0.5), 0 0 41.5px rgba(220, 65, 65, 0.5)", duration: 1, onComplete() {
          msgOutcomeMain.addClass("neon-glow-strong-red");
          msgOutcomeMain.attr("style", "color: rgb(255, 255, 255); visibility: visible");
        }}, 0)
        .to(msgOutcomeSub, {color: C.Colors.gRED, textShadow: "none", duration: 1}, 0)
        .to(msgTextToRed, {color: C.Colors.bRED, duration: 1}, 0);
  },
  animateToPartial(message$: JQuery): gsap.core.Timeline {

  const msgBgBase$ = message$.find(".message-bg.bg-base");
  message$.find(".message-bg.bg-partial").css("visibility", "visible");


  const msgDropCap$ = message$.find(".drop-cap");
  const msgAttrFlare = message$.find(".roll-term-container[class*='attribute-']");
  const msgCharName$ = message$.find(".roll-char-name *");
  const msgIntroLine$ = message$.find(".roll-intro-line *");
  const msgAttrName$ = message$.find(".roll-intro-line .text-attributename *");
  const msgIconBase$ = message$.find(".icon-container.icon-base");
  const msgIconPartial$ = message$.find(".icon-container.icon-partial");

  const msgSource = message$.find(".roll-source-header");
  const msgSourceName$ = msgSource.find(".roll-source-name .roll-source-text");
  const msgGears = message$.find(".roll-total-gear > img");
  const msgTotal = message$.find(".roll-total-number");
  const msgOutcomeMain = message$.find(".roll-outcome .roll-outcome-main");
  const msgOutcomeSub = message$.find(".roll-outcome .roll-outcome-sub");
  const msgTextToGrey = message$.find(".roll-source-source-name .roll-source-text, .roll-dice-results ~ * *");

  return U.gsap.timeline({ease: "power3.in", clearProps: true})
    .to(msgBgBase$, {autoAlpha: 0, duration: 1, ease: "power2.inOut"})
    .to(msgIconPartial$, {autoAlpha: 1, filter: "grayscale(1)", duration: 0.25, ease: "power2.inOut"}, 0)
    .to(msgCharName$, {color: C.Colors.bWHITE, duration: 1, ease: "power2.inOut"}, 0)
    .to(msgIntroLine$, {color: C.Colors.bWHITE, duration: 1, ease: "power2.inOut"}, 0)
    .to(msgAttrName$, {color: C.Colors.bWHITE, filter: "brightness(3)", duration: 1, ease: "power2.inOut"}, 0)
    .fromTo(msgDropCap$, {filter: "sepia(0) brightness(1) hue-rotate(0deg) saturate(1) contrast(1) drop-shadow(0px 0px 0px rgba(0, 0, 0, 0)"}, {filter: `grayscale(1) sepia(0) brightness(1) contrast(1) drop-shadow(2px 2px 2px ${C.Colors.dBLACK})`, duration: 1}, 0)
      .fromTo(msgAttrFlare, {filter: "sepia(0) brightness(1) hue-rotate(0deg) saturate(1) contrast(1)"}, {filter: "grayscale(1)", duration: 1}, 0)
      .fromTo(msgGears, {filter: "blur(1.5px) sepia(0) brightness(1) hue-rotate(0deg) saturate(1) contrast(1)"}, {filter: "grayscale(1) blur(1.5px) brightness(1)", duration: 1}, 0)
      .fromTo(msgTotal, {filter: "brightness(1) saturate(1) contrast(1)"}, {filter: "brightness(1) saturate(1) contrast(1) grayscale(1)", duration: 1}, 0)
      .to(msgIconBase$, {autoAlpha: 0, duration: 1}, 0)
      .to(msgSource, {filter: "grayscale(1)", duration: 1}, 0)
      .to(msgSourceName$, {color: C.Colors.WHITE}, 0)
      .to(msgOutcomeMain, {color: C.Colors.WHITE, duration: 1}, 0)
      .to(msgOutcomeSub, {color: C.Colors.WHITE, duration: 1}, 0)
      .to(msgTextToGrey, {color: C.Colors.WHITE, duration: 1}, 0);
},
  animateResults(message$: JQuery): gsap.core.Timeline {

    const results$ = message$.find([
      ".roll-dice-results ~ div",
      ".roll-dice-results ~ label",
      ".roll-dice-results ~ h2",
      ".roll-dice-results ~ ul li"
    ].join(", "));

    // // Split results$ into lines
    // const splitResultLines = new SplitText(results$, { type: "lines" });
    // // Set results$ to visibility: visible
    // results$.css("visibility", "visible");

    return U.gsap.timeline()
      .fromTo(results$, {
      // .fromTo(splitResultLines.lines, {
        autoAlpha: 0,
        filter: "blur(10px)"
      }, {
        autoAlpha: 1,
        filter: "blur(0px)",
        ease: "power2.out",
        duration: 1,
        stagger: 0.25
      })
  }
}



const ANIMATIONS = {
  animateChatTrigger(target: HTMLElement, msg: K4ChatMessage): gsap.core.Timeline {
    const target$ = $(target);

    return U.gsap.timeline({
      onComplete() {
        msg.isAnimated = false;
      }
    })
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
      const messageId = String(message$.data("messageId"));
      return game.messages.get(messageId) as Maybe<K4ChatMessage>;
    } else {
      const messageId = String($(ref).data("messageId"));
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
  */
  static PreInitialize() {

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
      await K4ChatMessage.GenerateInputPanel(html);
    });

    // Assign object to the global scope for development purposes
    Object.assign(globalThis, {MASTERTIMELINE, CHILD_TIMELINES, ANIMATIONS});

    // Register a hook to run when a chat message is rendered
    Hooks.on("renderChatMessage", async (message: K4ChatMessage, html) => {
      // kLog.log(`RENDERING ${message.isLastMessage ? "LAST " : ""}CHAT MESSAGE`, message);
      // Apply custom CSS classes to the chat message based on its flags
      message.applyFlagCSSClasses(html);

      // Apply listeners
      message.activateListeners(html);

      // Introduce a brief pause to let the DOM settle
      await U.sleep(500);

      // If this is the last chat message, animate it and freeze any animations of currently-animating messages
      if (message.isLastMessage) {
        message.animate();
        game.messages
          .filter((msg) => msg.isAnimated && msg.id !== message.id)
          .forEach((msg) => { msg.freeze(); });
      } else {
        // Otherwise, kill all tweens and hide video elements
        message.freeze();
      }
    });
  }
  // #endregion

  static override create(data: K4ChatMessage.ConstructorData, context?: DocumentModificationContext): Promise<Maybe<K4ChatMessage>> {
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

    return new Promise((resolve) => {
      kLog.display("Awaiting Timeline", {message: this, timelinePromise: this.timelinePromise});
      void this.timelinePromise.then(() => {
        kLog.display("Timeline Promise Resolved!");
        const timeline = this.animationTimeline;
        if (!timeline) { return undefined; }
        const labelTime = timeline.labels.revealed;
        const watchLabel = () => {
          if (timeline.time() >= labelTime) {
            kLog.display(`Message Animation Complete! (timeline.time = ${timeline.time()})`);
            resolve();
            return undefined;
          }
          kLog.display(`Awaiting Message Animation (timeline.time = ${timeline.time()})...`);
          setTimeout(watchLabel, 250);
        };
        watchLabel();
      });
    });
  }
  get cssClasses(): string[] {
    return (this.getFlag("kult4th", "cssClasses") ?? []) as string[];
  }

  get isAnimated(): boolean {
    return this.getFlag("kult4th", "isAnimated") as boolean;
  }
  set isAnimated(value: boolean) {
    void this.setFlag("kult4th", "isAnimated", value);
    if (!value) {
      this.addClass("not-animating");
    }
  }



  animate() {
    if (!this.isAnimated) { return undefined; }
    this.freeze(false);
    if (this.isChatRoll) {
      this.animationTimeline = MASTERTIMELINE(this.elem$, this);
    } else if (this.isChatTrigger) {
      this.animationTimeline = ANIMATIONS.animateChatTrigger(this.elem$[0], this);
    }
  }
  freeze(isPermanent = true) {
    this.videoElements.css("display", "none");
    if (isPermanent) {
      this.addClass("not-animating");
    }
    if (!this.isAnimated) { return undefined; }
    if (!this.animationTimeline) {
      if (isPermanent) {
        this.isAnimated = false;
      }
      return undefined;
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
    if (!content.length) {
      return ""
    };
    return `systems/kult4th/assets/chat/dropcaps/${content.slice(0, 1).toUpperCase()}.png`;
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
    if (!prevMessage.length) { return undefined; }
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
    void this.setFlag("kult4th", "cssClasses", U.unique([...this.cssClasses, cls]))
        .then(() => { this.applyFlagCSSClasses(html); });
  }
  remClass(cls: string, html?: JQuery) {
    void this.setFlag("kult4th", "cssClasses", this.cssClasses.filter((c) => c !== cls))
        .then(() => { this.applyFlagCSSClasses(html); });
  }
  applyFlagCSSClasses(html?: JQuery) {
    (html ?? this.elem$).addClass(this.cssClasses.join(" "));
  }

  activateListeners(html$?: JQuery) {
    html$ ??= this.elem$;
    // html$.find(".tooltip").parent()
    //   .each((_, parent) => {
    //     K4ActiveEffect.ApplyTooltipListener($(parent));
    //   });

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
