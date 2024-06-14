// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import K4Actor, {K4ActorType} from "./K4Actor.js";
import {gsap} from "../libraries.js";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

const ANIMATIONS = {
  _glitchText(_target: HTMLElement, startingGlitchScale = 1): GsapAnimation {

    const tl = gsap.timeline({
      repeat:      -1,
      repeatDelay: 10,
      reversed:    true,
      onRepeat(this: gsap.core.Timeline & {glitchScale: number}) {
        this.timeScale(this.glitchScale);
      }
    });
    tl.glitchScale = startingGlitchScale;
    tl.to(".glitch", {
      skewX() { return 20 * this.glitchScale; },
      duration() { return 0.1 * this.glitchScale; },
      ease: "power4.inOut"
    })
      .to(".glitch", {duration() { return 0.01 * this.glitchScale; }, skewX: 0, ease: "power4.inOut"})
      .to(".glitch", {duration() { return 0.01 * this.glitchScale; }, opacity: 0})
      .to(".glitch", {duration() { return 0.01 * this.glitchScale; }, opacity: 1})
      .to(".glitch", {duration() { return 0.01 * this.glitchScale; }, x() { return -10 * this.glitchScale; }})
      .to(".glitch", {duration() { return 0.01 * this.glitchScale; }, x: 0})
      .add("split", 0)
      .to(".top", {duration() { return 0.5; }, x() { return -10 * this.glitchScale;}, ease: "power4.inOut"}, "split")
      .to(".bottom", {duration() { return 0.5; }, x() { return 10 * this.glitchScale;}, ease: "power4.inOut"}, "split")
      .to(".glitch", {duration() { return 0.08; }, className: "+=redShadow"}, "split")

      .to("#txt", {duration() { return 0; }, scale() { return 1 + (0.05 * (this.glitchScale - 1)); }}, "split")
      .to("#txt", {duration() { return 0; }, scale: 1}, "+=0.02")

      .to(".glitch", {duration() { return 0.08; }, className: "-=redShadow"}, "+=0.09")
      .to(".glitch", {className: "+=greenShadow", duration: 0.03}, "split")
      .to(".glitch", {className: "-=greenShadow", duration: 0.03}, "+=0.01")

      .to(".top", {duration() { return 0.2; }, x: 0, ease: "power4.inOut"})
      .to(".bottom", {duration() { return 0.2; }, x: 0, ease: "power4.inOut"})

      .to(".glitch", {duration() { return 0.02; }, scaleY() { return 1 + (0.05 * (this.glitchScale - 1));}, ease: "power4.inOut"})
      .to(".glitch", {duration() { return 0.04; }, scaleY: 1, ease: "power4.inOut"});

    return tl;
  },
  gearGeburahRotate(target: HTMLElement): GsapAnimation {
    const outerGear$ = $(target).find(".svg-gear-geburah");
    const centerSaw$ = $(target).find(".svg-gear-geburah-center-saw");
    const centerSawRotate = gsap.timeline({repeat: -1})
      .to(centerSaw$, {
        rotation: "-=360",
        duration: 10,
        ease:     "none"
      });
    return gsap.timeline({delay: 0.2, repeat: -1})
      .to(outerGear$, {
        rotation:      "-=20",
        duration:      0.4,
        repeatRefresh: true,
        repeatDelay:   1.6,
        ease:          "back",
        repeat:        -1
      }, 0)
      .fromTo(centerSawRotate, {
        timeScale: 8
      }, {
        timeScale:   0.5,
        duration:    1.9,
        ease:        "power2",
        repeatDelay: 0,
        delay:       0.1,
        repeat:      -1
      }, 0);
  },
  gearBinahRotate(target: HTMLElement): GsapAnimation {
    const binahTeeth$ = $(target).find(".svg-gear-binah-outer-teeth");
    const binahInner$ = $(target).find(".svg-gear-binah-inner-full");
    gsap.set(binahTeeth$, {scale: 0.97});
    return gsap.timeline({repeat: -1})
      .to(binahTeeth$, {
        rotation: "-=360",
        duration: 5,
        repeat:   -1,
        ease:     "none"
      }, 0)
      .to(binahInner$, {
        rotation:      "+=10",
        duration:      0.4,
        repeatRefresh: true,
        repeatDelay:   0.85,
        ease:          "back.out(14)",
        repeat:        -1
      }, 0);
  },
  gearHugeRotate(target: HTMLElement): GsapAnimation {
    return gsap.to(target, {
      rotation: "+=360",
      duration: 50,
      ease:     "none",
      repeat:   -1
    });
  },
  hoverNav(target: HTMLElement): GsapAnimation {
    // const navGhostGears$ = $(target).find(".gear-container.gear-ghost-nav");
    const navLens$ = $(target).find(".nav-lens");
    const profileImg$ = $(target).find(".profile-image");
    const profileBg$ = $(target).find(".profile-image-bg");
    const buttonContainer$ = $(target).find(".tabs");
    const buttonSliders$ = $(target).find(".nav-tab-slider");
    const closeButton$ = $(target).find(".header-button.close");
    const minimizeButton$ = $(target).find(".header-button.minimize");
    const flare$ = $(target).find(".nav-flare");

    const svgs = {
      container:           $(target).find(".nav-svg"),
      outerSpikeContainer: $(target).find(".outer-spikes"),
      outerSpikes:         Array.from($(target).find(".outer-spikes").children()),
      outerSpikePaths:     Array.from($(target).find(".outer-spikes-hover").children())
        .map((spike) => spike.getAttribute("d")),
      innerSpikes:  $(target).find(".inner-spikes"),
      innerMesh:    $(target).find(".inner-mesh"),
      mainRing:     $(target).find(".main-ring"),
      buttonSpikes: $(target).find(".tabs .nav-tab-container .svg-container[class*='nav-spoke'] .svg-def")
    };

    const spikeVars: gsap.TweenVars = {
      // @ts-expect-error MorphSVG does indeed accept functions.
      morphSVG(i: number) { return svgs.outerSpikePaths[i]; },
      scale:    1,
      duration: 0.3,
      ease:     "power2"
    };

    const navTL = gsap.timeline({reversed: true})
      .to(target, {
        scale:    1.2,
        duration: 0.6,
        ease:     "power2"
      }, 0)
      .to(target, {
        x:        "+=20",
        duration: 0.5,
        ease:     "sine.inOut"
      }, 0)
      .to(target, {
        y:        "+=50",
        duration: 0.5,
        ease:     "sine.out"
      }, 0)
      .to($(target).find(".svg-def:not(.main-ring)"), {
        "--K4-icon-fill": C.Colors.BLACK,
        duration:      0.6,
        "ease":          "sine"
      }, 0)
      .set($(target).find(".svg-def.main-ring"), {
        fill: "url('#nav-main-ring-bg-end-gradient')"
      }, 0.3)
      .to(svgs.mainRing, {
        scale:       1,
        opacity:     1,
        ease:        "sine",
        duration:    0.6,
        strokeWidth: 0,
        stroke:      0
      }, 0)
      .to(svgs.innerMesh, {
        scale:    1,
        ease:     "sine",
        duration: 0.45
      }, 0).to(svgs.innerMesh, {
        opacity:  1,
        ease:     "sine",
        duration: 0.3
      }, 0.15)
      .to(svgs.outerSpikeContainer, {
        scale:    1,
        duration: 0.3,
        ease:     "power2"
      }, 0)
      .to(svgs.outerSpikes, spikeVars, 0)
      .to(svgs.innerSpikes, {
        scale:    1,
        duration: 0.3,
        ease:     "power2"
      }, 0.15).to(svgs.innerSpikes, {
        opacity:  1,
        duration: 0.15,
        ease:     "power2"
      }, 0.2)
      .to(navLens$, {
        rotation: "+=180",
        duration: 0.6,
        ease:     "sine.inOut"
      }, 0).to(navLens$, {
        opacity:  0,
        duration: 0.3,
        ease:     "power2"
      }, 0.3)
      .to(buttonSliders$, {
        y:             "-=85",
        ease:          "sine",
        pointerEvents: "all",
        duration:      0.3,
        stagger:       {
          amount: 0.25,
          from:   "random"
        }
      }, 0.05)
      .from([closeButton$, minimizeButton$], {
        // zIndex: -2,
        pointerEvents: "none",
        filter:        "blur(5px)",
        ease:          "sine",
        duration:      0.6
      }, 0).to([closeButton$, minimizeButton$], {
        opacity:       1,
        duration:      0.3,
        pointerEvents: "all"
      }, 0)
      .to(profileImg$, {
        opacity:  0,
        duration: 0.6,
        ease:     "power2.out"
      }, 0)
      .to(profileBg$, {
        opacity:  0.65, // 0.65,
        duration: 0.6,
        ease:     "sine"
      }, 0)
      .to(buttonContainer$, {
        zIndex:   1,
        ease:     "power3",
        duration: 0.01
      });

    if (U.getSetting("blur")) {
      navTL
        .to(U.getSiblings(target), {
          filter:   "blur(5px)",
          duration: 0.5,
          ease:     "back"
        }, 0);
    }

    if (U.getSetting("flare")) {
      navTL
        .to(flare$, {
          scale:    2.3,
          duration: 0.45,
          ease:     "sine"
        }, 0);
    }

    kLog.log("NAV TL", {navTL, target, svgs});

    return navTL;
  },
  hoverNavTab(target: HTMLElement): GsapAnimation {
    const tabLabel$ = $(target).find(".nav-tab-label");
    // const tabAnimation$ = $(target).find(".nav-tab-animation");
    return gsap.timeline({reversed: true})
      .to(tabLabel$, {
        opacity:  1,
        duration: 0.25,
        ease:     "sine"
      }, 0)
      .fromTo(tabLabel$, {
        scale:  3,
        // scaleX: 1.5,
        filter: "blur(10px)"
      }, {
        // scaleY: 2,
        scale:    1,
        filter:   "none",
        duration: 0.35,
        ease:     "power3"
      }, 0);/* .fromTo(
        tabAnimation$,
        {
          scale: 1,
          opacity: 0,
          filter: "blur(10px)"
        },
        {
          scale: 5,
          opacity: 0.75,
          filter: "none",
          duration: 1,
          ease: "back"
        },
        0
      ); */
  },
  hoverStrip(target: HTMLElement, context: JQuery): GsapAnimation {
    const FULL_DURATION = 0.5;

    const hoverTarget$ = $(context).find($(target).data("hover-target"));
    const stripIcon$ = $(target).children(".icon-container");
    const stripName$ = $(target).find(".strip-name");
    const buttonStrip$ = $(target).find(".button-strip");
    const stripBG$ = $(target).find(".strip-bg");

    if (!buttonStrip$[0]) { return gsap.timeline({reversed: true}); }

    const stripToolTip$ = $(target).find(".strip-tooltip");

    // const colorFG = $(target).data("color-fg") || gsap.getProperty(stripToolTip$[0], "color");
    // const colorFG = $(target).css("--K4-strip-color-fg")?.trim() ?? gsap.getProperty(stripToolTip$[0], "color");
    // const colorBG = (String(getContrastingColor(colorFG, 4) || $(target).css("--K4-strip-color-bg")?.trim()) ?? C.Colors.BLACK);
    const colorFG = stripName$.css("color");
    const colorBG = "rgb(0, 0, 0)";
    const nameShift = U.get(target, "height", "px");

    // kLog.log(`HOVER STRIP: ${$(target).attr("class")}`, {target, colorFG, colorBG, nameShift});

    const tl = gsap
      .timeline({reversed: true})
      .to(stripIcon$, {
        scale:    "+=1",
        duration: FULL_DURATION,
        ease:     "sine"
      }, 0)
      .to(stripBG$, {
        opacity:  1,
        duration: FULL_DURATION,
        ease:     "sine"
      }, 0)
      .to(target, {
        duration: 0.1,
        zIndex:   5000,
        ease:     "none"
      }, 0)
      .to(buttonStrip$, {
        opacity:  1,
        duration: FULL_DURATION / 4,
        ease:     "none"
      }, 0)
      .from(buttonStrip$, {
        width:    0,
        duration: FULL_DURATION,
        ease:     "sine"
      }, 0)
      .fromTo(stripName$, {
        color: colorFG
      }, {
        xPercent:   -100,
        x:          `-=${2 * nameShift}`,
        fontWeight: 900,
        fontStyle:  "normal",
        zIndex:     20,
        duration:   FULL_DURATION,
        color:      colorBG,
        textShadow: [
          ...Array.from({length: 4}).fill(`0 0 15px ${colorFG}`) as string[],
          ...Array.from({length: 6}).fill(`0 0 5px ${colorFG}`) as string[],
          ...Array.from({length: 4}).fill(`0 0 2px ${colorFG}`) as string[]
        ].join(", "),
        ease: "back"
      }, 0);


    if (stripToolTip$[0]) {
      tl.fromTo(stripToolTip$, {
        opacity: 0,
        scale:   1.5
      }, {
        opacity:  1,
        scale:    1,
        y:        "-=10",
        duration: 0.75 * FULL_DURATION,
        ease:     "power2.in"
      }, 0);
    }

    if (hoverTarget$[0]) {
      tl.fromTo(hoverTarget$, {
        opacity: 0
      }, {
        opacity:  1,
        duration: FULL_DURATION,
        ease:     "sine"
      }, 0);
    }

    return tl;
  },
  hoverStripButton(target: HTMLElement): GsapAnimation {
    const FULL_DURATION = 0.25;

    const svg$ = $(target).find(".svg-container");
    const tooltipFlare$ = $(target).find(".button-tooltip-flare");

    return gsap.timeline({reversed: true})
      .set(target, {zIndex: 30}, 0.1)
      .to(svg$, {
        filter:   "blur(2px)",
        scale:    5,
        opacity:  0,
        duration: 0.5 * FULL_DURATION,
        ease:     "power2"
      }, 0)
      .to(tooltipFlare$, {
        autoAlpha: 1,
        duration:  0.1,
        ease:      "none"
      }, 0.1)
      .to(tooltipFlare$, {
        scaleX:   0.75,
        scaleY:   1,
        duration: FULL_DURATION - 0.1,
        ease:     "power2"
      }, 0.1);
  }
};

class K4PCSheet extends ActorSheet {
  static async PreInitialize() {
    gsap.registerEffect({
      name: "breakShard",
      effect: (_: unknown, config: {stability: number}) => {
        const shardsMap = {
          7: [
            [13, 4],
            [12, 2, 3, 5, 1]
          ],
          6: [[1, 11], [10]],
          5: [[5], [6]],
          4: [
            [8, 6],
            [9, 7]
          ],
          3: [[10], [0]],
          2: [[3, 12, 2], [0]],
          1: [[7, 9], [0]]
        };
        const getFadingShards = (stabilityNum: number) => {
          const shardNums = shardsMap[stabilityNum as keyof typeof shardsMap][0] ?? [];
          return $(shardNums.map((num) => `#shard-${num}`).join(", "));
        };
        const getShrinkingShards = (stabilityNum: number) => {
          const shardNums = shardsMap[stabilityNum as keyof typeof shardsMap][1] ?? [];
          return $(shardNums.map((num) => `#shard-${num}`).join(", "));
        };
        const fullDuration = 0.5;
        const fadingShardsScaleFullDuration = fullDuration / 5;
        const fadingShardsShiftFullDuration = fullDuration - fadingShardsScaleFullDuration;

        const fadingShards$ = getFadingShards(config.stability);
        console.log({config, fadingShards$})
        const fadingShardsNum = Array.from(fadingShards$).length;
        const fadingShardsScaleStagger = fadingShardsNum <= 1
          ? 0
          : (0.5 * fadingShardsScaleFullDuration) / (fadingShardsNum - 1);
        const fadingShardsShiftStagger = fadingShardsNum <= 1
          ? 0
          : (0.5 * fadingShardsShiftFullDuration) / (fadingShardsNum - 1);
        const fadingShardsScaleDur = fadingShardsScaleFullDuration - (fadingShardsScaleStagger * (fadingShardsNum - 1));
        const fadingShardsShiftDur = fadingShardsShiftFullDuration - (fadingShardsShiftStagger * (fadingShardsNum - 1));
        const fadingShardsAnimDuration = fadingShardsScaleDur +
              fadingShardsShiftDur +
              (fadingShardsScaleStagger * (fadingShardsNum - 1)) +
              (fadingShardsShiftStagger * (fadingShardsNum - 1));

        // console.log("FADING SHARDS DATA", {
        //   fullDuration,
        //   fadingShards$,
        //   fadingShardsNum,
        //   fadingShardsScaleFullDuration,
        //   fadingShardsScaleStagger,
        //   fadingShardsScaleDur,
        //   fadingShardsShiftFullDuration,
        //   fadingShardsShiftStagger,
        //   fadingShardsShiftDur,
        //   fadingShardsAnimDuration
        // });

        return gsap.timeline({})
          .to(getShrinkingShards(config.stability), { transformOrigin: "center center", scale: 1, duration: 0.25, ease: "none" }, 0)
          .set(fadingShards$, {transformOrigin: "right center"}, 0)
          .to(fadingShards$, {
            scaleX: -1,
            duration: 0.5,
            ease: "rough({ strength: 2, points: 10, template: power4.in, taper: out, randomize: true, clamp: false })", // "power2.inOut",
            stagger: 0.1
          })
          .to(fadingShards$, {
            xPercent: 700,
            duration: 0.4,
            ease: "power2.in",
            stagger: 0.1
          })
          // ">-0.75")
      },
      defaults: {duration: 0.5},
      extendTimeline: true
    });
  }

  #buildStabilityShardsTimeline(html: JQuery) {
    return gsap.timeline({ paused: true })
      .set(html.find("#stability-shards"), {fill: C.Colors.GOLD})
      .set(html.find("#stability-frame"), {fill: C.Colors.GOLD, stroke: C.Colors.GOLD})
    .addLabel("stability10")
      .to(html.find("#stability-cracks-path"), {
        morphSVG: html.find<gsap.TweenVars["SVGPathElement"]>("#stability-cracks-9")[0],
        duration: 0.5,
        ease: "power4"
      }, 0)
    .addLabel("stability9")
      .to(html.find("#stability-cracks-path"), {
        morphSVG: html.find<gsap.TweenVars["SVGPathElement"]>("#stability-cracks-8")[0],
        duration: 0.5,
        ease: "power4"
      })
    .addLabel("stability8")
      .to(html.find("#stability-cracks-path"), {
        morphSVG: html.find<gsap.TweenVars["SVGPathElement"]>("#stability-cracks-7")[0],
        duration: 0.5,
        ease: "power4"
      })
      .breakShard([], {stability: 7}, "<")
      .to(html.find("#glitch"), {opacity: 1, duration: 0.5, ease: "power4"}, "<")
    .addLabel("stability7")
      .breakShard([], {stability: 6})
    .addLabel("stability6")
      .breakShard([], {stability: 5})
    .addLabel("stability5")
      .breakShard([], {stability: 4})
      .to(html.find("#stability-gear-geburah, #stability-gear-binah"), {opacity: 1, duration: 0.5, ease: "power4"}, "<")
      .to(html.find("#stability-animation-bg .overlay"), {opacity: 0.95, duration: 0.5, ease: "sine"}, "<")
    .addLabel("stability4")
      .breakShard([], {stability: 3})
      .to(html.find("#stability-animation-bg .overlay"), {opacity: 0.85, duration: 0.5, ease: "sine"}, "<")
    .addLabel("stability3")
      .breakShard([], {stability: 2})
      .to(html.find("#stability-animation-bg .overlay"), {opacity: 0.75, duration: 0.5, ease: "sine"}, "<")
    .addLabel("stability2")
      .breakShard([], {stability: 1})
      .to(html.find("#stability-animation-bg .overlay"), {opacity: 0, duration: 0.5, ease: "sine"}, "<")
    .addLabel("stability1")
      .fromTo(html.find("#stability-shards, #stability-frame"), {
        fill: C.Colors.GOLD,
        stroke: C.Colors.GOLD
      },
      {
        fill: C.Colors.dRED,
        stroke: C.Colors.GOLD,
        duration: 5,
        ease: "power2"
      }, 0)
      .to(html.find("#stability-shards, #stability-frame"), {
        fill: C.Colors.bRED,
        stroke: C.Colors.dBLACK,
        duration: 5,
        ease: "power2"
      }, 5)
      ;
  }
  _stabilityShardsTimeline: gsap.core.Timeline|undefined = undefined;
  get stabilityShardsTimeline(): gsap.core.Timeline {
    if (!this._stabilityShardsTimeline) {
      throw new Error("Attempt to get stabilityShardsTimeline before html context sent in activateListeners.");
    }
    return this._stabilityShardsTimeline as gsap.core.Timeline;
  }
  getGlitchRepeatDelay(stability: number = this.actor.system.stability.value): number {
    const delayDistributor = gsap.utils.distribute({
      amount: 20,
      ease: "sine.inOut"
    });
    const distVals = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((target, i, arr) =>
      delayDistributor(i, arr[i], arr)
    );
    // console.log(`[${stability}] ${distVals[stability]}s`);
    return distVals[stability];
  }
  refreshGlitchRepeatDelay(stability: number = this.actor.system.stability.value) {
  }
  #buildGlitchTimeline(html: JQuery) {
    const glitch$ = html.find("#shards-svg #glitch");
    const glitchText$ = html.find("#shards-svg .glitch-text");
    const glitchTop$ = html.find("#shards-svg .glitch-top");
    const glitchBottom$ = html.find("#shards-svg .glitch-bottom");

    // gsap.fromTo(glitchText$, {skewX: "random(-15, 5, 1)"}, {skewX: "random(5, 15, 1)", repeatRefresh: true, ease: "rough({strength: 3, points: 250, taper: none, randomize: true, clamp: false})", repeat: -1, yoyo: true, duration: 5});
    return gsap
      .timeline({
        repeat: -1,
        repeatRefresh: true,
        repeatDelay: this.getGlitchRepeatDelay(),
        // onRepeat: setGlitchRepeatDelay
      })
      .to(glitchText$, {
        duration: 0.1,
        skewX: "random([20,-20])",
        ease: "power4.inOut"
      })
      .to(glitchText$, { duration: 0.04, skewX: 0, ease: "power4.inOut" })

      .to(glitchText$, { duration: 0.04, opacity: 0 })
      .to(glitchText$, { duration: 0.04, opacity: 1 })

      .to(glitchText$, { duration: 0.04, x: "random([20,-20])" })
      .to(glitchText$, { duration: 0.04, x: 0 })

      .add("split", 0)

      .to(glitchTop$, { duration: 0.5, x: -30, ease: "power4.inOut" }, "split")
      .to(glitchBottom$, { duration: 0.5, x: 30, ease: "power4.inOut" }, "split")
      .to(
        glitchText$,
        { duration: 0.08, textShadow: "-13px -13px 0px #460e0e" },
        "split"
      )
      .to(glitch$, { duration: 0, scale: 1.2 }, "split")
      .to(glitch$, { duration: 0, scale: 1 }, "+=0.02")
      .to(
        glitchText$,
        { duration: 0.08, textShadow: "0px 0px 0px #460e0e" },
        "+=0.09"
      )
      .to(
        glitchText$,
        { duration: 0.03, textShadow: "13px 13px 0px #FFF" },
        "split"
      )
      .to(
        glitchText$,
        { duration: 0.08, textShadow: "0px 0px 0px transparent" },
        "+=0.01"
      )
      .to(glitchTop$, { duration: 0.2, x: 0, ease: "power4.inOut" })
      .to(glitchBottom$, { duration: 0.2, x: 0, ease: "power4.inOut" })
      .to(glitchText$, { duration: 0.02, scaleY: 1.1, ease: "power4.inOut" })
      .to(glitchText$, { duration: 0.04, scaleY: 1, ease: "power4.inOut" });
  }


  _glitchTimeline: gsap.core.Timeline|undefined = undefined;
  get glitchTimeline() {
    if (!this._glitchTimeline) {
      throw new Error("Attempt to get glitchTimeline before html context sent in activateListeners.");
    }
    return this._glitchTimeline;
  }



  async changeStability(stabilityDelta: number): Promise<unknown> {
    const newStability = U.clampNum(this.actor.system.stability.value + stabilityDelta, [1, 10]) as number;
    if (newStability === this.actor.system.stability.value) { return; }
    let updateAnim: Maybe<GsapAnimation> = undefined;
    if (this.rendered) {
      this.glitchTimeline.repeatDelay(this.getGlitchRepeatDelay(newStability));
      this.glitchTimeline.restart();
      gsap.set(this.element.find(".stability-count"),  {
        text: `${newStability}`
      });
      updateAnim = this.stabilityShardsTimeline.tweenTo(`stability${newStability}`);
    }
    return this.actor.update(
      {"system.stability.value": newStability},
      {updateAnim}
    );
  }














  static override get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [C.SYSTEM_ID, "sheet", "k4-sheet", "k4-actor-sheet", "k4-theme-dgold"],
      tabs:    [
        {navSelector: ".tabs", contentSelector: ".tab-content", initial: "bio"}
      ]
    });
  }
  override get template() { return `systems/kult4th/templates/sheets/${this.actor.type}-sheet.hbs`; }

  hoverTimeline?: GsapAnimation;
  hoverTimelineTarget?: HTMLElement;
  // devTools = GSDevTools;

  override async getData() {
    const baseContext = await super.getData();
    const context = {
      ...baseContext,
      baseMoves:     this.actor.basicMoves,
      derivedMoves:  this.actor.derivedMoves,
      advantages:    this.actor.advantages,
      disadvantages: this.actor.disadvantages,
      darksecrets:   this.actor.darkSecrets,
      relations:     this.actor.relations,
      weapons:       this.actor.weapons,
      gear:          this.actor.gear,
      attributes:    this.actor.attributeData,
      curTab:        this.actor.getFlag("kult4th", "sheetTab") as string,
      wounds:        this.actor.woundStrips
    };
    /*DEVCODE*/
    kLog.log("Final Actor Data", context);
    Object.assign(globalThis, {actor: this.actor, sheet: this});
    /*!DEVCODE*/
    return context;
  }

  override setPosition(posData: Partial<Application.Position>) {
    super.setPosition(posData);
    // cqApi.reevaluate();
  }

  clamp(element: HTMLElement) {
    if ("clamplines" in element.dataset) {
      $clamp(element, {
        clamp: U.pInt(element.dataset.clamplines)
      });
    } else if ("clampheight" in element.dataset) {
      $clamp(element, {
        clamp: element.dataset.clampheight
      });
    } else {
      $clamp(element, {clamp: "auto"});
    }
  }
  unClamp(element: HTMLElement) { element.style.cssText = ""; }

  /* Modifier report resizing function
  - accepts the JQuery HTML context of the character sheet
  - locates the modifier report element
  - compares the height of the element to the height of a single row of modifiers (20px)
  - if the height is larger than a single row, first, it adds the "minimal" class to the .modifiers-report element
    - the minimal class sets font size to zero except for <strong> elements, reducing the width of each modifier span
    - it checks again to see how many rows of modifiers there are
    - if there is no change to the number of rows, it removes the minimal class
  - sets the `--num-modifier-rows` on the `.tab.front` element to the number of rows (with or without the minimal class) */
  resizeModifierReport(html: JQuery) {
    // Get the width of the container element
    const container = html.find(".tab.front.active");
    if (!container[0]) { return; }
    const formWidth = container.width() ?? Infinity;
    const report = html.find(".modifiers-report");
    if (!report[0]) { return; }
    report.removeClass("minimal");
    report.css("width", "");
    const modReportWidth = report.width() ?? 0;
    let height = report.height();
    if (modReportWidth > formWidth) {
      report.css("width", formWidth);
      height = report.height();
    }
    if (!height) { return; }
    let rows = Math.floor(height / 20);
    if (rows > 1) {
      report.addClass("minimal");
      height = report.height()!;
      const newRows = Math.floor(height / 20);
      if (newRows === rows) {
        report.removeClass("minimal");
      } else {
        rows = newRows;
      }
    }
    html.find(".tab.front").css("--num-modifier-rows", rows);
  }



  override activateListeners(html: JQuery) {

    // Call the parent class's activateListeners method to ensure any inherited listeners are also activated
    super.activateListeners(html);
    const self = this;

    // Remove shadows from tab content if the "shadows" setting is disabled
    if (!U.getSetting("shadows")) {
      html.find(".tab-content").each(function() { $(this).css("filter", "none");});
    }

    const hoverTimelines: Array<[HTMLElement, GsapAnimation]> = [];

    // Iterate over each nav-panel element to set up animations and styles
    this.element.find(".nav-panel").each(function() {
      // Remove flare background if the "flare" setting is disabled
      if (!U.getSetting("flare")) {
        gsap.set(self.element.find(".nav-flare"), {background: "none"});
      }
      // Set profile image background to black if animations are disabled
      if (!U.getSetting("animations")) {
        gsap.set(self.element.find(".profile-image-animation"), {background: C.Colors.BLACK});
      }
      // Add hover animation to the hoverTimelines array for nav-panel
      hoverTimelines.push([this, ANIMATIONS.hoverNav(this)]);
    });

    // Iterate over each nav-tab element to set up animations and click listeners
    this.element.find(".nav-tab")
      .each(function() {
        // Add hover animation to the hoverTimelines array for nav-tab
        hoverTimelines.push([this, ANIMATIONS.hoverNavTab(this)]);
        // Add click listener to activate the corresponding tab when clicked
        $(this).on("click", function() {
          self.activateTab(this.getAttribute("data-tab"));
        });
      });

    // Apply text clamping to each element with the class "clamp-text"
    html.find(".clamp-text").each(function() {
      self.clamp(this);
    });

    // Handle gear animations based on the "gears" setting
    if (U.getSetting("gears")) {
      // Rotate huge gears if the setting is enabled
      this.element.find(".gear-container.gear-huge")
        .each(function() {
          ANIMATIONS.gearHugeRotate(this);
        });
      // Rotate Geburah gears if the setting is enabled
      this.element.find(".gear-container.gear-geburah")
        .each(function() {
          ANIMATIONS.gearGeburahRotate(this);
        });
      // Rotate Binah gears if the setting is enabled
      this.element.find(".gear-container.gear-binah")
        .each(function() {
          ANIMATIONS.gearBinahRotate(this);
        });
    } else {
      // Remove all gear containers if the setting is disabled
      this.element.find(".gear-container")
        .remove();
    }

    // Set actor name background to black if animations are disabled
    if (!game.settings.get("kult4th", "animations")) {
      gsap.set(this.element.find(".actor-name-bg-anim"), {background: C.Colors.BLACK});
    }

    // Handle stability animations & stability glitch
    this._glitchTimeline = this.#buildGlitchTimeline(html);
    this._stabilityShardsTimeline = this.#buildStabilityShardsTimeline(html);
    this.stabilityShardsTimeline.seek(`stability${this.actor.system.stability.value}`);
    gsap.set(html.find("#stability-shards-clip path"), {
      transformOrigin: "center center",
      scale: 1.1,
      display: "block"
    });
    gsap.set(html.find("#shard-11"), {
      transformOrigin: "left center",
      display: "block",
      scale: 1.2,
    });
    gsap.set(html.find("#stability-shards-clip path"), {
      transformOrigin: "center center"
    });

    gsap.set(html.find("#stability-gear-geburah"), {x: 700, y: 180, scale: 2, transformOrigin: "center center"});
    gsap.set(html.find("#stability-gear-binah"), {x: -200, y: -200, scale: 2, transformOrigin: "center center"});
    gsap.to(html.find("#stability-gear-geburah"), {rotation: "+=360", duration: 10, repeat: -1, ease: "none"});
    gsap.to(html.find("#stability-gear-binah"), {rotation: "-=360", duration: 10, repeat: -1, ease: "rough({strength: 0.2, points: 25, template: sine, taper: out, randomize: true, clamp: false})"});
    gsap.set(html.find("#stability-animation-bg img, .stability-count, #stability-frame"), { opacity: 1 });

    if (this.actor.activeEdges.length) {
      gsap.to(html.find(".edges-header"), {autoAlpha: 1, duration: 0});
      gsap.to(html.find(".edges-count"), {autoAlpha: 1, duration: 0});
      gsap.to(html.find(".edges-source"), {autoAlpha: 1, duration: 0});
      gsap.to(html.find(".edges .hover-strip"), {autoAlpha: 1, duration: 0});
      gsap.to(html.find(".edges-blade-container"), {autoAlpha: 1, duration: 0});

      const numEdges = this.actor.system.edges.value;
      gsap.to(
        html.find(".edges-blade-container svg"),
        {autoAlpha: 1, rotation: 175 + (20 * numEdges), duration: 0}
      )
    }

    let clickStatus = false;
    const dblClickCheck = (event: DoubleClickEvent) => {
      event.preventDefault();
      if (clickStatus) { return }
      clickStatus = true;
      $(".button-container").off("dblclick");
      this.changeStability(-1 as number);
    }
    const clickCheck = (event: DoubleClickEvent) => {
      event.preventDefault();
      if (clickStatus) { return }
      console.log("CLICK");
      $(".button-container").off("click");
      $(".button-container").on("dblclick", dblClickCheck.bind(this));
      setTimeout(() => {
        if (!clickStatus) {
          // gsap.effects.splashBannerText(labelChars);
          console.warn("WOULD DRAW A TOOLTIP HERE!");
          // gsap.effects.drawToolTip(".tooltip-container"); // .paused(false);
        }
        $(".button-container").off("dblclick");
        clickStatus = false;
        $(".button-container").on({
          click: clickCheck.bind(this)}
        );
      }, 250)
    }

    $(".button-container").on({
      click: clickCheck.bind(this),
      contextmenu: (event) => {
        event.preventDefault();
        this.changeStability(1 as number);
      }
    });


    // Add click listeners for elements with data-action="open" to open item sheets
    html.find("*[data-action=\"open\"]")
      .each(function() {
        const itemName = $(this).attr("data-item-name");
        if (itemName) {
          $(this).on("click", () => self.actor.getItemByName(itemName)?.sheet?.render(true));
        }
      });

    // Add click listeners for elements with data-action="roll" to roll item actions
    html.find("*[data-action=\"roll\"]")
      .each(function() {
        const itemName = $(this).attr("data-item-name");
        if (itemName) {
          $(this).on("click", () => self.actor.roll(itemName));
        }
      });

    // Add click listeners for elements with data-action="trigger" to trigger item actions
    html.find("*[data-action=\"trigger\"]")
      .each(function() {
        const itemName = $(this).attr("data-item-name");
        if (itemName) {
          $(this).on("click", () => self.actor.trigger(itemName));
        }
      });

    // Add click listeners for elements with data-action="chat" to display item summaries in chat
    html.find("*[data-action=\"chat\"]")
      .each(function() {
        const itemName = $(this).attr("data-item-name");
        if (itemName) {
          $(this).on("click", () => self.actor.name && self.actor.getItemByName(itemName)?.displayItemSummary(self.actor.name));
        }
      });

    // Initialize content-editable elements with placeholder text if necessary
    html.find(".content-editable")
      .each(function() {
        $(this).attr("contenteditable", "false");
        const innerText = $(this).text().trim();

        if ((!innerText && $(this).data("placeholder"))
          || (innerText === $(this).data("placeholder"))) {
          $(this)
            .addClass("placeholder")
            .text($(this).data("placeholder") as string);
        }
      });

    // Add hover animations for hover-strip elements
    html.find(".hover-strip")
      .each(function() {
        hoverTimelines.push([this, ANIMATIONS.hoverStrip(this, html)]);
      });

    // Add hover animations for hover-strip button elements
    html.find(".hover-strip .strip-button")
      .each(function() {
        hoverTimelines.push([this, ANIMATIONS.hoverStripButton(this)]);
      });

    // Add mouseenter and mouseleave listeners to control hover animations
    hoverTimelines.forEach(([target, anim]) => {
      $(target)
        .on("mouseenter", () => anim.reversed(false))
        .on("mouseleave", () => anim.reversed(true));
    });

    // Add resize listener that calls resizeModifierReport when sheet is resized
    const resizableHandle = this.element.find(".window-resizable-handle");
    const debouncedResizeModifierReport = debounce(() => this.resizeModifierReport(html), 1);

    const onMouseMove = () => {
      debouncedResizeModifierReport();
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      this.resizeModifierReport(html); // Final call to ensure the last size is handled
    };

    resizableHandle.on("mousedown", () => {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      this.resizeModifierReport(html); // Initial call to handle the start of the resize
    });

    // Initial call to resizeModifierReport
    requestAnimationFrame(() => this.resizeModifierReport(html));

    // If the sheet is not editable, return early
    if (!this.options.editable) { return; }

    // Add click listeners for elements with data-action="drop" to drop items
    html.find("*[data-action=\"drop\"]")
      .each(function() {
        const itemName = $(this).attr("data-item-name");
        if (itemName) {
          $(this).on("click", () => self.actor.dropItemByName(itemName));
        }
      });

    // // Add click listeners for stability-add buttons to increase stability
    // html.find("button.stability-add")
    //   .each(function() {
    //     $(this).on("click", () => self.actor.changeStability(1));
    //   });

    // // Add click listeners for stability-remove buttons to decrease stability
    // html.find("button.stability-remove")
    //   .each(function() {
    //     $(this).on("click", () => self.actor.changeStability(-1));
    //   });

    // Add click listeners for wound-add buttons to add a new wound
    html.find("button.wound-add")
      .each(function() {
        $(this).on("click", () => {
          // kLog.log("Adding Wound. Button:", this);
          self.actor.addWound().catch(kLog.error);
        });
      });

    // Add click listeners for wound-delete buttons to remove a specific wound
    html.find("button.wound-delete")
      .each(function() {
        const woundID = $(this).data("woundId") as IDString;
        $(this).on("click", () => {
          // kLog.log(`Deleting Wound ${woundID}. Button:`, this);
          self.actor.removeWound(woundID).catch(kLog.error);
        });
      });

    // Add click listeners for elements with data-action="toggle-wound-type" to toggle the wound type
    html.find("*[data-action=\"toggle-wound-type\"]")
      .each(function() {
        const woundID = $(this).data("target") as IDString;
        if (woundID) {
          $(this).on("click", () => self.actor.toggleWound(woundID, "type"));
        }
      });

    // Add click listeners for elements with data-action="reset-wound-name" to reset the wound name
    html.find("*[data-action=\"reset-wound-name\"]")
      .each(function() {
        const woundID = $(this).data("target") as IDString;
        if (woundID) {
          $(this).on("click", () => self.actor.resetWoundName(woundID));
        }
      });

    // Add click listeners for elements with data-action="toggle-wound-stabilize" to toggle wound stabilization
    html.find("*[data-action=\"toggle-wound-stabilize\"]")
      .each(function() {
        const woundID = $(this).data("target") as IDString;
        if (woundID) {
          $(this).on("click", () => self.actor.toggleWound(woundID, "stabilized"));
        }
      });

    // Add click listeners for elements with data-action="drop-wound" to remove a specific wound
    html.find("*[data-action=\"drop-wound\"]")
      .each(function() {
        const woundID = $(this).data("target") as IDString;
        if (woundID) {
          $(this).on("click", () => self.actor.removeWound(woundID));
        }
      });

    // Add click listeners for close buttons in the header to close the sheet
    html.find(".header-button.close")
      .each(function() {
        $(this).on("click", () => self.actor.sheet?.close());
      });

    // Add click listeners for minimize buttons in the header to toggle minimize/maximize state
    html.find(".header-button.minimize")
      .each(function() {
        $(this).on("click", () => {
          if (self._minimized) {
            self.maximize().catch(kLog.error);
          } else {
            self.minimize().catch(kLog.error);
          }
        });
      });

    // Initialize content-editable elements with click, focus, and blur listeners for inline editing
    html.find(".content-editable").each(function() {
      $(this)
        .on("click", (clickEvent) => {
          if ($(clickEvent.currentTarget).attr("contenteditable") === "true") {
            return;
          }
          clickEvent.preventDefault();
          const {currentTarget} = clickEvent;
          let elemText = $(currentTarget).text().trim();
          if ($(currentTarget).hasClass("placeholder")) {
            elemText = "";
          }
          $(currentTarget)
            .text(elemText || " ")
            .removeClass("placeholder")
            .attr({contenteditable: "true"})
            .on("keydown", (keyboardEvent) => {
              if (keyboardEvent.key === "Enter") {
                keyboardEvent.preventDefault();
                $(currentTarget).trigger("blur");
              }
            })
            .trigger("focus");
        })
        .on("focus", (focusEvent) => {
          self.unClamp(focusEvent.currentTarget);
          const element = focusEvent.currentTarget;
          if (element) {
            const range = document.createRange(); // Create a new range
            const selection = window.getSelection(); // Get the current selection

            if (selection) {
              selection.removeAllRanges(); // Clear any existing selections
              range.selectNodeContents(element); // Select the contents of the element
              selection.addRange(range); // Add the range to the selection
            }
          }
        })
        .on("blur", (blurEvent) => {
          blurEvent.preventDefault();
          const {currentTarget} = blurEvent;
          const elemText = $(currentTarget).text().trim();

          // Set placeholder text where text content is blank
          if (!elemText && $(currentTarget).data("placeholder")) {
            $(currentTarget)
              .addClass("placeholder")
              .text($(currentTarget).data("placeholder") as string);
          } else {
            $(currentTarget).removeClass("placeholder");
          }

          $(currentTarget)
            .attr({contenteditable: "false"})
            .off("keydown");
          self.clamp(currentTarget);

          // Sync with actor data
          const dataField = $(currentTarget).data("field") as string;
          const curData = getProperty(self.actor, dataField) as string;
          if (curData !== elemText) {
            self.actor.update({[dataField]: elemText}).catch(kLog.error);
          }
        });
    });
  }

  activateTab(tabName: string | null) {
    tabName ??= "front";
    const curTab = (this.actor.getFlag("kult4th", "sheetTab") ?? "front") as string;
    if (tabName && tabName !== curTab) {
      this.actor.setFlag("kult4th", "sheetTab", tabName).catch(kLog.error);
    }
  }
}


interface K4PCSheet {
  object: K4Actor<K4ActorType.pc>,
  _actor: K4Actor<K4ActorType.pc>
}

export default K4PCSheet;
