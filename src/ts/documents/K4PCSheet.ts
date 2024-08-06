// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import C, {K4Attribute, StabilityConditions, K4ConditionType, K4Stability, Archetype, ArchetypeTier, Archetypes} from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import {Dragger, InertiaPlugin} from "../libraries.js";
import K4Actor, {K4ActorType, K4CharGenPhase} from "./K4Actor.js";
import K4Item, {K4ItemType} from "./K4Item.js";
import K4Dialog, {PromptInputType} from "./K4Dialog.js";
import K4ActiveEffect from "./K4ActiveEffect.js";
import K4Roll from "./K4Roll.js";
import {gsap} from "../libraries.js";
import K4DebugDisplay from "./K4DebugDisplay.js";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

namespace ArchetypeCarousel {
  export interface TraitData {
    name: string,
    img: string,
    tooltip: string,
    isSelected: boolean,
    isMandatory: boolean,
    isSetByLock: boolean
  }

  export interface StringData {
    value: string,
    examples: string[],
    isValueAnExample: boolean,
    isSetByLock: boolean
  }

  export interface ArchetypeData {
    label: string,
    img: string,
    tier: ArchetypeTier,
    [K4ItemType.advantage]: Partial<Record<K4Attribute, Record<string, TraitData>>>,
    [K4ItemType.disadvantage]: Record<string, TraitData>,
    [K4ItemType.darksecret]: Record<string, TraitData>,
    description: string,
    occupation: StringData,
    looks: {
      clothes: StringData,
      face: StringData,
      eyes: StringData,
      body: StringData
    },
    isSelected: boolean,
  }

  export type Data = Partial<Record<Archetype, ArchetypeData>>;
}

interface ChargenContext {
  charGenPhase: K4CharGenPhase,
  archetypeCarousel: ArchetypeCarousel.Data,
  selectedArchetype: Maybe<Archetype>,
  archetypeAdvantages: Maybe<Partial<Record<K4Attribute, Record<string, ArchetypeCarousel.TraitData>>>>,
  archetypeDisadvantages: Maybe<Record<string, ArchetypeCarousel.TraitData>>,
  archetypeDarkSecrets: Maybe<Record<string, ArchetypeCarousel.TraitData>>,
  occupation: Maybe<ArchetypeCarousel.StringData>,
  looks: {
    clothes: Maybe<ArchetypeCarousel.StringData>,
    face: Maybe<ArchetypeCarousel.StringData>,
    eyes: Maybe<ArchetypeCarousel.StringData>,
    body: Maybe<ArchetypeCarousel.StringData>
  }
}

export function getDistanceFromSelected(index: number, selected: number, totalItems: number) {
  // Calculate the distance between the given index and the selected index
  const distance = Math.abs(index - selected);
  // Normalize the distance by the total number of items to get a value between 0 and 1
  const normalizedDistance = distance / totalItems;
  return normalizedDistance;
  // Since the carousel wraps around, we need to adjust the distance if it's more than half of the total items
  const adjustedDistance = normalizedDistance > 0.5 ? 1 - normalizedDistance : normalizedDistance;
  return 2 * adjustedDistance // (normalized to between 0 and 1;
}

export function getYRotFromIndex(index: number, total: number) {
  return U.gsap.utils.mapRange(0, total, 360, 0, index);
}

export function getIndexFromYRot(rotationY: number, total: number) {
  return U.gsap.utils.clamp(0, total - 1, U.pInt(U.gsap.utils.mapRange(360, 0, 0, total, rotationY)));
}

export function getYRotFromXPos(x: number, max: number) {
  // x = U.gsap.utils.wrap(-max, max, x);
  return U.gsap.utils.mapRange(max, -max, 360, 0, x);
}

export function getXPosFromYRot(rotationY: number, max: number) {
  return U.gsap.utils.mapRange(360, 0, max, -max, rotationY);
}

export function getXPosFromIndex(index: number, total: number, max: number) {
  return U.gsap.utils.mapRange(0, total, max, -max, index);
}

export function getIndexFromXPos(x: number, total: number, max: number) {
  // x = U.gsap.utils.wrap(-max, max, x);
  return U.gsap.utils.clamp(0, total - 1, U.pInt(U.gsap.utils.mapRange(max, -max, 0, total, x)));
}

function getArchetypeFromIndex(index: number) {
  return Object.keys(VALIDARCHETYPES)[index] as Archetype;
}

function getElementFromArchetype(context$: JQuery, archetype: Archetype) {
  return context$.find(`[data-archetype=${archetype}]`);
}

function getElementFromIndex(context$: JQuery, index: number) {
  const archetype = getArchetypeFromIndex(index);
  return getElementFromArchetype(context$, archetype);
}


let VALIDARCHETYPES = Object.fromEntries(Object.entries(Archetypes).filter(([_, archetype]) => [ArchetypeTier.awake].includes(archetype.tier)));
const GSAPEFFECTS: Record<string, GSAPEffectDefinition> = {
  revealCarousel: {
    name: "revealCarousel",
    effect: (carouselScene$) => {
      const items$ = $(carouselScene$ as JQuery).find(".archetype-carousel-item");
      const tl = U.gsap.timeline();
      tl.from(carouselScene$, {
        autoAlpha: 0,
        y: 0,
        scale: 0.7,
        filter: "blur(100px)",
        ease: "power3.in",
        duration: 2
      })
        .from(items$, {
          autoAlpha: 0,
          y: 0,
          scale: 1,
          ease: "power3.in",
          duration: 1,
          stagger: {
            amount: 3,
            from: "center",
            ease: "slow(0.2, 0.2, false)"
          }
        }, 0);
      return tl;
    },
    defaults: {},
    extendTimeline: true
  },
  highlightArchetype: {
    name: "highlightArchetype",
    effect: (archetype, config) => {
      const archetype$ = $(archetype as HTMLElement|JQuery);
      const {duration, scale, ease} = config as gsap.TweenVars & {duration: number, scale: number, ease: string};
      // archetype$.css("transformOrigin", "50% 100%");

      return U.gsap.timeline()
        .to(archetype$, {
          filter: "brightness(1) invert(0) blur(0px) saturate(1) brightness(1.25)",
          scale,
          opacity: 1,
          duration,
          ease
        });
    },
    defaults: {
      scale: 1.15,
      duration: 0.3,
      ease: "power2"
    },
    extendTimeline: true
  }
}

const ANIMATIONS = {
  archetypeTimeline(archetype$: JQuery) {
    const container$ = archetype$.closest(".pc-initialization");
    const archetypeThe$ = archetype$.find(".archetype-carousel-the");
    const archetypeName$ = archetype$.find(".archetype-carousel-name");
    const archetypeDescription$ = archetype$.find(".archetype-description");

    const archetype = archetype$.attr("data-archetype");
    // <div class="archetype-panels" data-archetype="{{case "lower" archetype}}">
    const archetypePanels$ = container$.find(`.archetype-panels[data-archetype="${archetype}"]`);
    const archetypeAdvantages$ = archetypePanels$.find(".archetype-panel-advantages");
    const archetypeDisadvantages$ = archetypePanels$.find(".archetype-panel-disadvantages");
    const archetypeDarkSecrets$ = archetypePanels$.find(".archetype-panel-darksecrets");

    // Split the description into individual lines
    const splitDescription = new SplitText(archetypeDescription$, { type: "lines" });
    archetypeThe$.css("visibility", "visible");
    archetypeName$.css("visibility", "visible");
    archetypePanels$.css("visibility", "visible");
    archetypeDescription$.css("visibility", "visible");
    archetypeAdvantages$.css("visibility", "visible");
    archetypeDisadvantages$.css("visibility", "visible");
    archetypeDarkSecrets$.css("visibility", "visible");

    // Assign listeners to each of the trait elements
    [
      archetypeAdvantages$,
      archetypeDisadvantages$,
      archetypeDarkSecrets$
    ].forEach((container) => {
      container.find(".archetype-trait-container").each((_i, cont) => {
        const container$ = $(cont);
        const trait = container$.attr("data-trait");
        const isSelected = container$.attr("data-is-selected") === "true";
        const isMandatory = container$.attr("data-is-mandatory") === "true";

        container$.on({
          click: () => {
            if (isMandatory) { return; }
            if (isSelected) {
              kLog.log("[K4PCSheet] deselect", {container: cont, trait$});
              return;
            } else {
              kLog.log("[K4PCSheet] select", {container: cont, trait$});
              return;
            }
          },
          contextmenu: async () => {
            const traitItem = game.items.getName(trait!) as Maybe<K4Item>;
            if (!traitItem) { return; }
            // Scan the <body> element for all `.k4-item-sheet` elements and derive the highest z-index
            const highestZIndex = Math.max(...$("body").find(".k4-item-sheet").map((_i, sheet) =>
              U.pInt($(sheet).css("z-index"))
            ).toArray());
            if (!traitItem.sheet.rendered) {
              traitItem.sheet.render(true);
              await U.sleep(250);
            }
            traitItem.sheet.element.css("z-index", highestZIndex + 1);
          }
        })
        const trait$ = $(cont).find(".archetype-trait");
        trait$.on("click", () => {
          kLog.log("[K4PCSheet] archetypeAdvantages$", {container: cont, trait$});
        });
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return (U.gsap.timeline({paused: true})
      .addLabel("dark")
      .fromTo(archetype$, {
        opacity: 0.75,
        filter: "brightness(0) invert(1) blur(8px) saturate(0) brightness(0)"
      }, {
        filter: "brightness(1) invert(0) blur(0px) saturate(0) brightness(0.5)",
        duration: 1,
        ease: "power2"
      })
      .addLabel("light")
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      .highlightArchetype(archetype$, {
        duration: 2,
      }) as gsap.core.Timeline)
      .fromTo([
        archetypeThe$,
        archetypeName$,
        ...splitDescription.lines,
        archetypeAdvantages$,
        archetypeDisadvantages$,
        archetypeDarkSecrets$
      ], {
        autoAlpha: 0,
        skewX: -65,
        x: function(index) {
          return -80 + (index * 5);
        },
        filter: "blur(15px)"
      }, {
        autoAlpha: 1,
        skewX: 0,
        x: function(index) {
          return 0 + (index * 5);
        },
        filter: "blur(0px)",
        ease: "power2",
        duration: 2,
        stagger: {
          each: 0.25
        }
      }, "<")
      .addLabel("selected")
      .seek(1);
  },
  async archetypeCarouselTimeline(carouselScene$: JQuery, itemWidth: number, actor: K4Actor): Promise<gsap.core.Timeline> {

    kLog.log("TEST", {VALIDARCHETYPES});
    VALIDARCHETYPES = Object.fromEntries(Object.entries(Archetypes).filter(([_, archetype]) => [ArchetypeTier.aware].includes(archetype.tier)));

    const container$ = carouselScene$.closest(".pc-initialization");
    const carousel$ = carouselScene$.find(".archetype-carousel");
    const items$ = carousel$.find(".archetype-carousel-item");
    let selArchetypeIndex = Object.keys(VALIDARCHETYPES)
      .findIndex((archetype) => archetype as Archetype === actor.archetype);

    await U.gsap.set(carouselScene$, {
      opacity: 0,
      visibility: "visible"
    });

    const totalItems = Object.keys(VALIDARCHETYPES).length;
    const angleStep = 360 / totalItems;
    const radius = Math.round((itemWidth / 2) / Math.tan(Math.PI / totalItems));

    await U.gsap.set(carousel$, {
      z: -1 * radius
    });

    await Promise.all(items$.map((i, item) => {
      const archTimeline = ANIMATIONS.archetypeTimeline($(item));
      $(item).data("archetypeTimeline", archTimeline);
      const distFromSelected = getDistanceFromSelected(i, selArchetypeIndex, totalItems);
      archTimeline.seek(1 - distFromSelected);
      return U.gsap.set(item, {
        transform: `rotateY(${-1 * getYRotFromIndex(i, totalItems)}deg) translateZ(${radius}px) rotateY(${getYRotFromIndex(i, totalItems)}deg)`
      });
    }));

    const draggerContainer$ = container$.find(".archetype-carousel-dragger");
    const dragger$ = draggerContainer$.find(".archetype-carousel-drag-handle");

    kLog.log("Testing Draggable Components", {draggerContainer$, dragger$});

    await U.gsap.set(carouselScene$, { opacity: 1, visibility: "visible" });

    // Calculate the maximum drag distance
    const maxDistance = 0.5 * draggerContainer$.width()!;

    // Calculate the bounds
    const bounds = {
      minX: -maxDistance,
      maxX: maxDistance
    };

    const updateDebugInfo = (x: number) => {
      const newIndex = U.gsap.utils.clamp(0, totalItems, Math.round(((x + maxDistance) / Math.abs(2 * maxDistance)) * totalItems) % totalItems);
      const archetype = Object.keys(VALIDARCHETYPES)[newIndex];
      const elementIndex = carousel$.find(`[data-archetype=${archetype}]`).data("index") as number;

      K4DebugDisplay.updateArchetypeInfo(archetype, selArchetypeIndex, newIndex, elementIndex);
    };

    const updateRotation = (x: number) => {
      const rotation = getYRotFromXPos(x, maxDistance);
      gsap.set(carousel$, { rotationX: 0, rotationY: rotation, rotationZ: 0 });
      items$.each((_i, item) => {
        gsap.set(item, { rotationY: -rotation });
        const thisTimeline = ($(item).data("archetypeTimeline") as gsap.core.Timeline);
        const thisIndex = U.pInt($(item).data("index"));
        if (thisIndex !== selArchetypeIndex && thisTimeline.time() <= 1) {
          const distFromSelected = getDistanceFromSelected(thisIndex, selArchetypeIndex, totalItems);
          thisTimeline.seek(1 - distFromSelected);
        }
      });
    };
    // Function to update rotation based on drag position
    const snapToNearestArchetype = (x: number, isCompleting = false) => {
      const newIndex = getIndexFromXPos(x, totalItems, maxDistance);
      if (newIndex !== selArchetypeIndex) {
        actor.archetype = Object.keys(VALIDARCHETYPES)[newIndex] as Archetype;
        K4DebugDisplay.updateArchetypeInfo(actor.archetype, selArchetypeIndex, newIndex, newIndex);
      }
      if (isCompleting) {
        // Iterate through all items, and set their data-is-selected to false UNLESS this is the new item, then set it to true
        items$.each((_i, item) => {
          const thisTimeline = ($(item).data("archetypeTimeline") as gsap.core.Timeline);
          const thisIndex = U.pInt($(item).data("index"));
          if (thisIndex !== newIndex) {
            const distFromSelected = getDistanceFromSelected(thisIndex, newIndex, totalItems);
            void thisTimeline.tweenTo(1 - distFromSelected, {duration: 0.5});
          } else if (thisIndex === newIndex) {
            void thisTimeline.tweenTo("selected", {duration: 2});
          }
        });
      }
      selArchetypeIndex = newIndex;
      return getXPosFromIndex(newIndex, totalItems, maxDistance);
    };

    const dragger = Dragger.create(dragger$, {
      type: "x",
      // trigger: ".archetype-carousel-item",
      inertia: true,
      dragResistance: 0.25,
      maxDuration: 0.25,
      snap: {
        x: (value) => snapToNearestArchetype(value)
      },
      onDragStart: function(this: Dragger) {
        // set data-is-selected to false for all items
        items$.each((_i, item) => {
          const itemTimeline = ($(item).data("archetypeTimeline") as gsap.core.Timeline);
          // If the timeline is past the "light" label (at timeline time 1s), tween back to "light" and THEN set data-is-selected.
          if (itemTimeline.time() > 1) {
            void itemTimeline.tweenTo("light", {duration: 0.5});
              // $(item).attr("data-is-selected", "false");
            // });
          } else {
            // $(item).attr("data-is-selected", "false");
          }
        });
      },
      onDrag: function(this: Dragger) {
        updateRotation(this.x);
        // this.applyBounds(bounds);
        snapToNearestArchetype(this.x);
        updateDebugInfo(this.x);
        K4DebugDisplay.updateDraggerInfo(this, actor);
      },
      onThrowUpdate: function(this: Dragger) {
        updateRotation(this.x);
        // this.applyBounds(bounds);
        snapToNearestArchetype(this.x);
        updateDebugInfo(this.x);
      },
      // onDragEnd: function(this: Dragger) {
      //   updateRotation(snapToNearestArchetype(this.x, true));
      // },
      onThrowComplete: function(this: Dragger) {
        updateRotation(snapToNearestArchetype(this.x, true));
      }
    });


    kLog.log("Dragger Created", {dragger, draggerContainer$, dragger$});

    // Set initial position of the proxy
    // gsap.set(proxy, { x: (selArchetypeIndex / totalItems) * maxDistance });

    // Update debug info on each frame
    gsap.ticker.add(() => {
      const x = gsap.getProperty(dragger$[0], "x") as number;
      updateDebugInfo(x);
      K4DebugDisplay.updateDraggerInfo(Dragger.get(dragger$), actor);
    });

    // // Update rotation on window resize
    // window.addEventListener("resize", () => {
    //   const newMaxDistance = window.innerWidth / 2;
    //   const currentRotation = gsap.getProperty(carousel$[0], "rotationY") as number;
    //   const newX = (currentRotation / 180) * newMaxDistance;
    //   gsap.set(dragger$, { x: newX });
    //   updateRotation(newX);
    // });

    const startX = getXPosFromIndex(selArchetypeIndex, totalItems, maxDistance);
    updateRotation(startX);
    U.gsap.set(dragger$, { x: startX });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await U.gsap.effects.revealCarousel(carouselScene$, {});

    // get currently selected archetype element, retrieve its timeline, and set it to "selected"
    // const tl = gsap.timeline({ paused: true });
    const selectedArchetype = getElementFromIndex(carousel$, selArchetypeIndex);
    const selectedArchetypeTimeline = ($(selectedArchetype).data("archetypeTimeline") as gsap.core.Timeline);
    void selectedArchetypeTimeline.tweenTo("selected", {duration: 2});
    const tl = gsap.timeline({ paused: true });

    return tl;
  },
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
    const form$ = $(target).closest("form");
    const formSiblings$ = form$.siblings();
    const sheetContent$ = form$.find("main");

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
        "duration":         0.6,
        "ease":           "sine"
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
        .to([U.getSiblings(target), sheetContent$, formSiblings$], {
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
  hoverStrip(target: HTMLElement, context: JQuery, actor: K4Actor): GsapAnimation {
    const FULL_DURATION = 0.5;

    let stripType: "edge" | K4ItemType.advantage | K4ItemType.disadvantage | K4ItemType.move;
    if ($(target).hasClass("edge-strip")) {
      stripType = "edge";
    } else if ($(target).hasClass("advantage-strip")) {
      stripType = K4ItemType.advantage;
    } else if ($(target).hasClass("disadvantage-strip")) {
      stripType = K4ItemType.disadvantage;
    } else {
      stripType = K4ItemType.move;
    }

    const hoverTargetMain$ = $(context).find($(target).data("hover-target"));
    const stripIcon$ = $(target).children(".icon-container");
    const stripName$ = $(target).find(".strip-name");
    const modifiers$ = $(context).find(".modifiers-report").find(".mod-container");

    const moveName = stripName$.text();
    const move = actor.getItemByName(moveName) as Maybe<K4Item<K4ItemType.move>>;
    let filterIndex = -1;
    let modifier$: Maybe<JQuery>;
    if (move) {
      for (const [i, {filter}] of actor.collapsedRollModifiers.entries()) {
        if (K4ActiveEffect.DoesFilterApplyToMove(filter, move)) {
          filterIndex = i;
          break;
        }
      }
    }
    if (filterIndex >= 0) {
      modifier$ = $(modifiers$[filterIndex]);
    }

    const buttonStrip$ = $(target).find(".button-strip");
    const stripBG$ = $(target).find(".strip-bg");

    if (!buttonStrip$.length) { return gsap.timeline({reversed: true}); }

    // const colorFG = $(target).data("color-fg") || gsap.getProperty(stripToolTip$[0], "color");
    // const colorFG = $(target).css("--K4-strip-color-fg")?.trim() ?? gsap.getProperty(stripToolTip$[0], "color");
    // const colorBG = (String(getContrastingColor(colorFG, 4) || $(target).css("--K4-strip-color-bg")?.trim()) ?? C.Colors.BLACK);
    const colorBase = stripName$.css("color");
    const colorHover = stripType === "edge"
      ? C.Colors.bWHITE
      : C.Colors.dBLACK;
    const colorShadow = stripType === "edge"
      ? "rgba(3, 247, 249, 0.56)"
      : colorBase;
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
        color: colorBase
      }, {
        xPercent:   -100,
        x:          `-=${2 * nameShift}`,
        fontWeight: 900,
        fontStyle:  "normal",
        zIndex:     20,
        duration:   FULL_DURATION,
        color:      colorHover,
        textShadow: [
          ...Array.from({length: 4}).fill(`0 0 15px ${colorShadow}`) as string[],
          ...Array.from({length: 6}).fill(`0 0 5px ${colorShadow}`) as string[],
          ...Array.from({length: 4}).fill(`0 0 2px ${colorShadow}`) as string[]
        ].join(", "),
        ease: "back"
      }, 0);


    // if (stripToolTip$[0]) {
    //   tl.fromTo(stripToolTip$, {
    //     opacity: 0,
    //     scale:   1.5
    //   }, {
    //     opacity:  1,
    //     scale:    1,
    //     y:        "-=10",
    //     duration: 0.75 * FULL_DURATION,
    //     ease:     "power2.in"
    //   }, 0);
    // }

    if (hoverTargetMain$[0]) {
      tl.fromTo(hoverTargetMain$, {
        opacity: 0
      }, {
        opacity:  1,
        duration: FULL_DURATION,
        ease:     "sine"
      }, 0);
    }
    if (modifier$?.[0]) {
      const anim$ = modifier$.find(".status-mod-bg");
      const strong$ = modifier$.find(".tooltip-trigger > strong");
      let shadowColor: string;
      let color: string;
      if (modifier$.find(".tooltip-trigger").hasClass("k4-theme-red")) {
        shadowColor = "220, 65, 65";
        color = C.Colors.bRED;
      } else {
        shadowColor = "220, 220, 65";
        color = C.Colors.bGOLD;
      }
      const textShadow = [
        "0 0 2px rgba(0, 0, 0, 1)",
        "0 0 4px rgba(0, 0, 0, 1)",
        "0 0 4.5px rgba(0, 0, 0, 1)",
        `0 0 8px rgba(${shadowColor}, 0.8)`,
        `0 0 12.5px rgba(${shadowColor}, 0.8)`,
        `0 0 16.5px rgba(${shadowColor}, 0.5)`,
        `0 0 21px rgba(${shadowColor}, 0.5)`,
        `0 0 29px rgba(${shadowColor}, 0.5)`,
        `0 0 41.5px rgba(${shadowColor}, 0.5)`
      ].join(", ");
      tl.fromTo(anim$, {
        autoAlpha: 0
      }, {
        autoAlpha: 1,
        duration:  FULL_DURATION,
        ease:      "sine"
      }, 0)
        .fromTo(strong$, {
          color,
          textShadow: "0 0 0 rgba(0, 0, 0, 0)"
        }, {
          color:    C.Colors.bWHITE,
          textShadow,
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
  static PreInitialize() {

    Actors.registerSheet("kult4th", K4PCSheet, {makeDefault: true});

    gsap.registerPlugin(Dragger, InertiaPlugin);
    // Register GSAP Effects
    Object.values(GSAPEFFECTS).forEach((effect) => {
      U.gsap.registerEffect(effect);
    });
    gsap.registerEffect({
      name:   "breakShard",
      effect: (stabilityContainer$: JQuery, config: {stability: number}) => {
        stabilityContainer$ = $(stabilityContainer$);
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
          return stabilityContainer$.find(shardNums.map((num) => `#shard-${num}`).join(", "));
        };
        const getShrinkingShards = (stabilityNum: number) => {
          const shardNums = shardsMap[stabilityNum as keyof typeof shardsMap][1] ?? [];
          return stabilityContainer$.find(shardNums.map((num) => `#shard-${num}`).join(", "));
        };
        const fullDuration = 0.5;
        const fadingShardsScaleFullDuration = fullDuration / 5;
        const fadingShardsShiftFullDuration = fullDuration - fadingShardsScaleFullDuration;

        const fadingShards$ = getFadingShards(config.stability);
        const fadingShardsNum = Array.from(fadingShards$).length;
        const fadingShardsScaleStagger = fadingShardsNum <= 1
          ? 0
          : (0.5 * fadingShardsScaleFullDuration) / (fadingShardsNum - 1);
        const fadingShardsShiftStagger = fadingShardsNum <= 1
          ? 0
          : (0.5 * fadingShardsShiftFullDuration) / (fadingShardsNum - 1);
        const fadingShardsScaleDur = fadingShardsScaleFullDuration - (fadingShardsScaleStagger * (fadingShardsNum - 1));
        const fadingShardsShiftDur = fadingShardsShiftFullDuration - (fadingShardsShiftStagger * (fadingShardsNum - 1));
        const fadingShardsAnimDuration = fadingShardsScaleDur
              + fadingShardsShiftDur
              + (fadingShardsScaleStagger * (fadingShardsNum - 1))
              + (fadingShardsShiftStagger * (fadingShardsNum - 1));

        return gsap.timeline({})
          .to(getShrinkingShards(config.stability), {transformOrigin: "center center", scale: 1, duration: 0.25, ease: "none"}, 0)
          .set(fadingShards$, {transformOrigin: "right center"}, 0)
          .to(fadingShards$, {
            scaleX:   -1,
            duration: 0.5,
            ease:     "rough({ strength: 2, points: 10, template: power4.in, taper: out, randomize: true, clamp: false })", // "power2.inOut",
            stagger:  0.1
          })
          .to(fadingShards$, {
            xPercent: 700,
            duration: 0.4,
            ease:     "power2.in",
            stagger:  0.1
          });
          // ">-0.75")
      },
      defaults:       {duration: 0.5},
      extendTimeline: true
    });
  }

  #buildStabilityShardsTimeline(html: JQuery) {
    const shards$ = html.find("#stability-shards, #stability-frame");
    const cracks$ = html.find("#stability-cracks-path");
    const glitchNum$ = html.find("#glitch");
    const gears$ = html.find("#stability-gear-geburah, #stability-gear-binah");
    const anim$ = html.find("#stability-animation-bg img");

    /** Depending on whether the variant rule for Stability is used, break points may be different:
     * == DEFAULT ==
     * Composed: 10
     * Moderate Stress: 8-9
     * Serious Stress: 5-7
     * Critical Stress: 2-4
     * Broken: 1
     *
     * == VARIANT ==
     * Composed: 10
     * Moderate Stress: 8-9
     * Serious Stress: 5-7
     * Critical Stress: 1-4
     * Broken: 0
     */

    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
    return gsap.timeline({paused: true})
      .fromTo(shards$, {fill: C.Colors.bGOLD, stroke: C.Colors.bGOLD}, {fill: C.Colors.bGOLD, stroke: C.Colors.bGOLD, duration: 0}, 0)
      .fromTo(anim$, {filter: "brightness(0) saturate(1.5)"}, {filter: "brightness(0) saturate(1.5)", duration: 0}, 0)
    // COMPOSED (GOLD)
    .addLabel("stability10")
      .to(cracks$, {
        morphSVG: html.find<gsap.TweenVars["SVGPathElement"]>("#stability-cracks-9")[0],
        duration: 0.5,
        ease:     "power4"
      }, 0)
      // .fromTo(shards$, {fill: C.Colors.GOLD, stroke: C.Colors.GOLD}, {fill: C.Colors.BLACK, stroke: C.Colors.BLACK, duration: 5})
    // MODERATE (dGOLD)
    .to(shards$, {fill: C.Colors.GOLD, stroke: C.Colors.GOLD, duration: 0.5}, "<")
    .addLabel("stability9")
      .to(cracks$, {
        morphSVG: html.find<gsap.TweenVars["SVGPathElement"]>("#stability-cracks-8")[0],
        duration: 0.5,
        ease:     "power4"
      })
    .addLabel("stability8")
      .to(cracks$, {
        morphSVG: html.find<gsap.TweenVars["SVGPathElement"]>("#stability-cracks-7")[0],
        duration: 0.5,
        ease:     "power4"
      })
      .breakShard(html, {stability: 7}, "<")
      .to(glitchNum$, {opacity: 1, duration: 0.5, ease: "power4"}, "<")
    // SERIOUS (dRED)
    .to(shards$, {fill: C.Colors.dGOLD, stroke: C.Colors.dGOLD, duration: 0.5}, "<")
    .addLabel("stability7")
      .breakShard(html, {stability: 6})
    .addLabel("stability6")
      .breakShard(html, {stability: 5})
    .addLabel("stability5")
      .breakShard(html, {stability: 4})
      .to(gears$, {opacity: 1, duration: 0.5, ease: "power4"}, "<")
      .to(anim$, {filter: "brightness(0.5) saturate(1.5)", duration: 0.5, ease: "sine"}, "<")
    // CRITICAL (gRED)
    .to(shards$, {fill: C.Colors.dRED, stroke: C.Colors.dRED, duration: 0.5}, "<")
    .addLabel("stability4")
      .breakShard(html, {stability: 3})
      .to(anim$, {filter: "brightness(1) saturate(1.5)", duration: 0.5, ease: "sine"}, "<")
    .addLabel("stability3")
      .breakShard(html, {stability: 2})
      .to(anim$, {filter: "brightness(2) saturate(1.5)", duration: 0.5, ease: "sine"}, "<")
      .to(shards$, {fill: C.Colors.bRED, stroke: C.Colors.bRED, duration: 0.5}, "<")
    .addLabel("stability2")
      .breakShard(html, {stability: 1})
      .to(anim$, {filter: "brightness(10) saturate(1.5)", duration: 0.5, ease: "sine"}, "<")
      .to(shards$, {fill: C.Colors.gRED, stroke: C.Colors.gRED, duration: 0.5}, "<")
    .addLabel("stability1") as gsap.core.Timeline;
    /* eslint-enable */
  }
  _stabilityShardsTimeline: gsap.core.Timeline|undefined = undefined;
  get stabilityShardsTimeline(): gsap.core.Timeline {
    if (!this._stabilityShardsTimeline) {
      throw new Error("Attempt to get stabilityShardsTimeline before html context sent in activateListeners.");
    }
    return this._stabilityShardsTimeline;
  }
  getGlitchRepeatDelay(stability: number = this.actor.system.stability.value): number {
    const delayDistributor = gsap.utils.distribute({
      amount: 20,
      ease:   "sine.inOut"
    });
    const distVals = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((target, i, arr) =>
      delayDistributor(i, arr[i], arr)
    );
    // console.log(`[${stability}] ${distVals[stability]}s`);
    return distVals[stability];
  }
  #buildGlitchTimeline(html: JQuery) {
    const glitch$ = html.find("#shards-svg #glitch");
    const glitchText$ = html.find("#shards-svg .glitch-text");
    const glitchTop$ = html.find("#shards-svg .glitch-top");
    const glitchBottom$ = html.find("#shards-svg .glitch-bottom");

    // gsap.fromTo(glitchText$, {skewX: "random(-15, 5, 1)"}, {skewX: "random(5, 15, 1)", repeatRefresh: true, ease: "rough({strength: 3, points: 250, taper: none, randomize: true, clamp: false})", repeat: -1, yoyo: true, duration: 5});
    return gsap
      .timeline({
        repeat:        -1,
        repeatRefresh: true,
        repeatDelay:   this.getGlitchRepeatDelay()
        // onRepeat: setGlitchRepeatDelay
      })
      .to(glitchText$, {
        duration: 0.1,
        skewX:    "random([20,-20])",
        ease:     "power4.inOut"
      })
      .to(glitchText$, {duration: 0.04, skewX: 0, ease: "power4.inOut"})

      .to(glitchText$, {duration: 0.04, opacity: 0})
      .to(glitchText$, {duration: 0.04, opacity: 1})

      .to(glitchText$, {duration: 0.04, x: "random([20,-20])"})
      .to(glitchText$, {duration: 0.04, x: 0})

      .add("split", 0)

      .to(glitchTop$, {duration: 0.5, x: -30, ease: "power4.inOut"}, "split")
      .to(glitchBottom$, {duration: 0.5, x: 30, ease: "power4.inOut"}, "split")
      .to(
        glitchText$,
        {duration: 0.08, textShadow: "-13px -13px 0px #460e0e"},
        "split"
      )
      .to(glitch$, {duration: 0, scale: 1.2}, "split")
      .to(glitch$, {duration: 0, scale: 1}, "+=0.02")
      .to(
        glitchText$,
        {duration: 0.08, textShadow: "0px 0px 0px #460e0e"},
        "+=0.09"
      )
      .to(
        glitchText$,
        {duration: 0.03, textShadow: "13px 13px 0px #FFF"},
        "split"
      )
      .to(
        glitchText$,
        {duration: 0.08, textShadow: "0px 0px 0px transparent"},
        "+=0.01"
      )
      .to(glitchTop$, {duration: 0.2, x: 0, ease: "power4.inOut"})
      .to(glitchBottom$, {duration: 0.2, x: 0, ease: "power4.inOut"})
      .to(glitchText$, {duration: 0.02, scaleY: 1.1, ease: "power4.inOut"})
      .to(glitchText$, {duration: 0.04, scaleY: 1, ease: "power4.inOut"});
  }


  _glitchTimeline: gsap.core.Timeline|undefined = undefined;
  get glitchTimeline() {
    if (!this._glitchTimeline) {
      throw new Error("Attempt to get glitchTimeline before html context sent in activateListeners.");
    }
    return this._glitchTimeline;
  }



  async changeStability(stabilityDelta: number): Promise<unknown> {
    const newStability = U.clampNum(this.actor.system.stability.value + stabilityDelta, [1, 10]);
    if (newStability === this.actor.system.stability.value) { return undefined; }
    let updateAnim: Maybe<GsapAnimation> = undefined;
    if (this.rendered) {
      this.glitchTimeline.repeatDelay(this.getGlitchRepeatDelay(newStability));
      this.glitchTimeline.restart();
      gsap.set(this.element.find(".stability-count"), {
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
        {navSelector: ".tabs", contentSelector: ".tab-content", initial: "front"}
      ]
    });
  }
  isTestingPCInitialization = true;
  override get template() {
    if (this.isTestingPCInitialization && this.actor.is(K4ActorType.pc) && !this.actor.getFlag("kult4th", "isInitialized")) {
      return "systems/kult4th/templates/sheets/pc-initialization.hbs";
    }
    return `systems/kult4th/templates/sheets/${this.actor.type}-sheet.hbs`;
  }

  hoverTimeline?: GsapAnimation;
  hoverTimelineTarget?: HTMLElement;
  // devTools = GSDevTools;

  override async getData() {
    const baseContext = await super.getData();

    if (this.actor.is(K4ActorType.pc) && !this.actor.isFinishedCharGen) {
      return {
        ...baseContext,
        ...this.chargenContext()
      };
    }

    const context = {
      ...baseContext,
      baseMoves:       this.actor.basicMoves,
      derivedMoves:    this.actor.derivedMoves,
      advantages:      this.actor.advantages,
      disadvantages:   this.actor.disadvantages,
      darksecrets:     this.actor.darkSecrets,
      relations:       this.actor.relations,
      weapons:         this.actor.weapons,
      gear:            this.actor.gear,
      attributes:      this.actor.attributeData,
      curTab:          this.actor.getFlag("kult4th", "sheetTab") as string,
      statusBarStrips:        this.actor.statusBarStrips
    };
    /*DEVCODE*/
    kLog.log("Final Actor Data", context);
    Object.assign(globalThis, {actor: this.actor, sheet: this});
    /*!DEVCODE*/
    return context;
  }


  getTraitData(traitName: string, traitType: K4ItemType, archetype?: Archetype, isIgnoringLock = false): Maybe<ArchetypeCarousel.TraitData> {
    // Strip "!" prefix (marking mandatory trait) so traitName can retrieve item
    traitName = traitName.replace(/^!/g, "");
    archetype = archetype ?? this.actor.archetype;
    if (!archetype) { return undefined; }
    const traitItem = game.items.getName(traitName);
    if (!traitItem) {
      throw new Error(`Trait item "${traitName}" not found`);
    }

    const tData: ArchetypeCarousel.TraitData = {
      name: traitName,
      img: (traitItem.img ?? "").replace(/\(|\)/g, ""),
      tooltip: traitItem.shortDesc,
      isSelected: false,
      isMandatory: false,
      isSetByLock: false
    };

    // First get locked value, if one exists, then get the value from the archetype if it's not locked
    const lockedValue = this.actor.getFlag("kult4th", `locked.${traitType}.${traitName}`) as Maybe<boolean>;
    if (lockedValue && !isIgnoringLock) {
      tData.isSelected = true;
      tData.isSetByLock = true;
    } else {
      const archetypeValue = this.actor.getFlag("kult4th", `${archetype}.${traitType}.${traitName}`) as Maybe<boolean>;
      tData.isSelected = archetypeValue ?? false;
    }

    const archetypeData = Archetypes[archetype];

    if (!(traitType in archetypeData)) {
      throw new Error(`Archetype ${archetype} does not have a ${traitType} section`);
    }

    const archetypeTraits = archetypeData[traitType as KeyOf<typeof archetypeData>] as string[];

    // Check whether trait is mandatory for this archetype. If so, set isMandatory.
    const nameIfMandatory = `!${traitName}`;

    if (archetypeTraits.includes(nameIfMandatory)) {
      tData.isMandatory = true;
      tData.isSelected = true;
    }

    return tData;
  }

  getArchetypeTraitData(traitType: K4ItemType & KeyOf<typeof Archetypes[Archetype]>, archetype: Archetype, attribute?: K4Attribute) {
    if (![
      K4ItemType.advantage,
      K4ItemType.disadvantage,
      K4ItemType.darksecret
    ].includes(traitType)) {
      throw new Error(`Invalid trait type ${traitType} for getArchetypeTraitData`);
    }
    const archetypeTData = Archetypes[archetype][traitType];

    // If an attribute was passed, filter the archetypeTData by that attribute, then convert to Record<name, data>
    if (attribute) {
      return Object.fromEntries(archetypeTData
        .filter((traitName) => this.getTraitAttribute(traitName) === attribute)
        .map((traitName) => [traitName.replace(/^!/g, ""), this.getTraitData(traitName, traitType, archetype)])
      ) as Record<string, ArchetypeCarousel.TraitData>;
    }

    // For advantages, we need to group each data object by attribute
    if (traitType === K4ItemType.advantage) {
      return Object.fromEntries(
        (Object.keys(K4Attribute) as K4Attribute[])
          .map((attrName): [K4Attribute, Record<string, ArchetypeCarousel.TraitData>] => [attrName, this.getArchetypeTraitData(traitType, archetype, attrName)] as [K4Attribute, Record<string, ArchetypeCarousel.TraitData>])
          .filter(([_, data]) => !U.isEmpty(data))) as Partial<Record<K4Attribute, Record<string, ArchetypeCarousel.TraitData>>>;
    }

    // Otherwise, we just return the Record<string, TraitData> object
    return Object.fromEntries(archetypeTData
        .map((traitName) => [traitName.replace(/^!/g, ""), this.getTraitData(traitName, traitType, archetype)])
      ) as Record<string, ArchetypeCarousel.TraitData>;
  }

  getStringData(dotKey: string, archetype?: Archetype, isIgnoringLock = false, isReturningLockedOnly = false): Maybe<ArchetypeCarousel.StringData> {
    archetype = archetype ?? this.actor.archetype;
    if (!archetype) { return undefined; }

    const sData: ArchetypeCarousel.StringData = {
      value: "",
      examples: U.getProp<string[]>(Archetypes[archetype], dotKey) ?? [],
      isValueAnExample: false,
      isSetByLock: false
    };

    // First get locked value, if one exists and isn't being ignored, then get the value from the archetype if it's not locked
    const lockedValue = this.actor.getFlag("kult4th", `locked.${dotKey}`) as Maybe<string>;
    if (lockedValue && !isIgnoringLock) {
      sData.value = lockedValue;
      sData.isSetByLock = true;
    } else {
      sData.value = this.actor.getFlag("kult4th", `${archetype}.${dotKey}`) as Maybe<string> ?? "";
    }

    // Finally check whether value is an example
    sData.isValueAnExample = sData.examples.includes(sData.value);

    // If isReturningLockedOnly is true, return the locked value only
    if (isReturningLockedOnly) {
      return lockedValue ? sData : undefined;
    }

    return sData;
  }

  getTraitAttribute (traitName: string): K4Attribute {
    const traitItem = game.items.getName(traitName);
    if (!traitItem) {
      throw new Error(`Trait item "${traitName}" not found`);
    }
    if ("attribute" in traitItem.system) {
      return traitItem.system.attribute;
    }
    return K4Attribute.zero;
  }

  getArchetypeCarouselData(): ArchetypeCarousel.Data {
    // First filter Archetypes for those tiers allowed in settings
    /**
     * @todo Implement settings to allow multiple Archetype Tiers
     * (currently defaulting to "aware" only)
     */
    const allowedTiers: ArchetypeTier[] = [ArchetypeTier.aware];
    return Object.fromEntries(
      (Object.entries(Archetypes) as Array<Tuple<Archetype, ValueOf<typeof Archetypes>>>)
        .filter(([_archetype, {tier}]) => allowedTiers.includes(tier))
        // Map data to match ArchetypeCarousel.Data
        .map(([archetype, data]: [Archetype, ValueOf<typeof Archetypes>]) => [
          archetype,
          {
            label: data.label,
            tier: data.tier,
            img: `systems/kult4th/assets/archetypes/${archetype}.png`,
            [K4ItemType.advantage]: this.getArchetypeTraitData(K4ItemType.advantage, archetype),
            [K4ItemType.disadvantage]: this.getArchetypeTraitData(K4ItemType.disadvantage, archetype),
            [K4ItemType.darksecret]: this.getArchetypeTraitData(K4ItemType.darksecret, archetype),
            description: data.description,
            occupation: this.getStringData("occupation", archetype, true),
            looks: {
              clothes: this.getStringData("looks.clothes", archetype, true),
              face: this.getStringData("looks.face", archetype, true),
              eyes: this.getStringData("looks.eyes", archetype, true),
              body: this.getStringData("looks.body", archetype, true)
            },
            isSelected: this.actor.archetype === archetype
          }
        ])
    );
  }

  getLockedArchetypeData(): DeepPartial<Pick<ArchetypeCarousel.ArchetypeData, K4ItemType.advantage | K4ItemType.disadvantage | K4ItemType.darksecret | "occupation" | "looks">> {
    return {
      [K4ItemType.advantage]: this.actor.archetype ? this.getArchetypeTraitData(K4ItemType.advantage, this.actor.archetype) : undefined,
      [K4ItemType.disadvantage]: this.actor.archetype ? this.getArchetypeTraitData(K4ItemType.disadvantage, this.actor.archetype) : undefined,
      [K4ItemType.darksecret]: this.actor.archetype ? this.getArchetypeTraitData(K4ItemType.darksecret, this.actor.archetype) : undefined,
      occupation: this.getStringData("occupation", undefined, false, true),
      looks: {
        clothes: this.getStringData("looks.clothes", undefined, false, true),
        face: this.getStringData("looks.face", undefined, false, true),
        eyes: this.getStringData("looks.eyes", undefined, false, true),
        body: this.getStringData("looks.body", undefined, false, true)
      }
    };
  }

  chargenContext(): ChargenContext {

    /**
     * flagSpace: {
     *   [arch: Archetype]: {
     *     isSelected: boolean,
     *     K4ItemType.advantage: Record<advantageName, boolean>,
     *     K4ItemType.disadvantage: Record<advantageName, boolean>,
     *     occupation: string,
     *     looks: {
     *       clothes: string,
     *       face: string,
     *       eyes: string,
     *       body: string
     *     }
     *   },
     *   locked: {
     *     K4ItemType.advantage: Record<advantageName, boolean> // (obviously will only appear if Archetype doesn't filter it out)
     *   }
     * }
     *
     *
     * (CONTEXT) {
     *   selectedArchetype: Archetype,
     *   K4ItemType.advantage: {
     *     K4Attribute.violence: {
     *       [advantageName]: {
     *          name: string,
     *          img: string,
     *          tooltip: string,
     *          isSelected: boolean,
     *          isSetByLock: boolean
     *       }
     *     }
     *   },
     *
     *
     *   occupation: {
     *     value: string,
     *     examples: string[],
     *     isValueAnExample: boolean,
     *     isSetByLock: boolean
     *   }
     *
     *
     * }
     */
    const selectedArchetype = this.actor.archetype;

    return {
      charGenPhase: this.actor.charGenPhase,
      archetypeCarousel: this.getArchetypeCarouselData(),
      selectedArchetype,
      archetypeAdvantages: selectedArchetype
        ? this.getArchetypeTraitData(K4ItemType.advantage, selectedArchetype)
        : undefined,
      archetypeDisadvantages: (selectedArchetype
        ? this.getArchetypeTraitData(K4ItemType.disadvantage, selectedArchetype)
        : undefined) as Maybe<Record<string, ArchetypeCarousel.TraitData>>,
      archetypeDarkSecrets: (selectedArchetype
        ? this.getArchetypeTraitData(K4ItemType.darksecret, selectedArchetype)
        : undefined) as Maybe<Record<string, ArchetypeCarousel.TraitData>>,
      occupation: this.getStringData("occupation", selectedArchetype),
      looks: {
        clothes: this.getStringData("looks.clothes", selectedArchetype),
        face: this.getStringData("looks.face", selectedArchetype),
        eyes: this.getStringData("looks.eyes", selectedArchetype),
        body: this.getStringData("looks.body", selectedArchetype)
      }
    };
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
    const container$ = html.find(".tab.front.active");
    if (!container$.length) { return undefined; }
    const formWidth = container$.width() ?? Infinity;
    const report$ = html.find(".modifiers-report");
    if (!report$.length) { return undefined; }
    report$.removeClass("minimal");
    report$.css("width", "");
    const modReportWidth = report$.width() ?? 0;
    let height = report$.height();
    if (modReportWidth > formWidth) {
      report$.css("width", formWidth);
      height = report$.height();
    }
    if (!height) { return undefined; }
    let rows = Math.floor(height / 20);
    if (rows > 1) {
      report$.addClass("minimal");
      height = report$.height()!;
      const newRows = Math.floor(height / 20);
      if (newRows === rows) {
        report$.removeClass("minimal");
      } else {
        rows = newRows;
      }
    }
    html.find(".tab.front").css("--num-modifier-rows", rows);
  }
//   void this.activateChargenArchetypeListeners(html);
//   break;
// }
// case K4CharGenPhase.attributesAndTraits: {
//   void this.activateChargenAttributesAndTraitsListeners(html);
//   break;
// }
// case K4CharGenPhase.details: {
//   void this.activateChargenDetailsListeners(html);
//   break;
// }
// case K4CharGenPhase.relations: {
//   void this.activateChargenRelationsListeners(html);

  async activateChargenArchetypeListeners(html: JQuery) {
    const carouselScene$ = html.find(".archetype-staging");
    await ANIMATIONS.archetypeCarouselTimeline(carouselScene$, 200, this.actor);

  }
  async activateChargenAttributesAndTraitsListeners(html: JQuery) {
    await Promise.resolve(html);
  }
  async activateChargenDetailsListeners(html: JQuery) {
    await Promise.resolve(html);
  }
  async activateChargenRelationsListeners(html: JQuery) {
    await Promise.resolve(html);
  }
  activateNavMenuListeners(html: JQuery): Array<Tuple<HTMLElement, GsapAnimation>> {
    const self = this;
    const hoverTimelines: Array<Tuple<HTMLElement, GsapAnimation>> = [];
    // Iterate over each nav-panel element to set up animations and styles
    html.find(".nav-panel").each(function() {
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
    html.find(".nav-tab")
      .each(function() {
        // Add hover animation to the hoverTimelines array for nav-tab
        hoverTimelines.push([this, ANIMATIONS.hoverNavTab(this)]);
        // Add click listener to activate the corresponding tab when clicked
        $(this).on("click", function() {
          self.activateTab(this.getAttribute("data-tab"));
        });
      });

    return hoverTimelines;
  }

  animateGears(html: JQuery, isEnabled = true) {
    if (isEnabled) {
      // Rotate huge gears
      html.find(".gear-container.gear-huge")
        .each(function() {
          ANIMATIONS.gearHugeRotate(this);
        });
      // Rotate Geburah gears
      html.find(".gear-container.gear-geburah")
        .each(function() {
          ANIMATIONS.gearGeburahRotate(this);
        });
      // Rotate Binah gears
      html.find(".gear-container.gear-binah")
        .each(function() {
          ANIMATIONS.gearBinahRotate(this);
        });
    } else {
      // Remove all gear containers if the setting is disabled
      html.find(".gear-container")
        .remove();
    }
  }

  animateStability(html: JQuery) {
    this._glitchTimeline = this.#buildGlitchTimeline(html);
    this._stabilityShardsTimeline = this.#buildStabilityShardsTimeline(html);
    this.stabilityShardsTimeline.seek(`stability${this.actor.system.stability.value}`);
    gsap.set(html.find("#stability-shards-clip path"), {
      transformOrigin: "center center",
      scale:           1.1,
      display:         "block"
    });
    gsap.set(html.find("#shard-11"), {
      transformOrigin: "left center",
      display:         "block",
      scale:           1.2
    });
    gsap.set(html.find("#stability-shards-clip path"), {
      transformOrigin: "center center"
    });

    gsap.set(html.find("#stability-gear-geburah"), {x: 700, y: 180, scale: 2, transformOrigin: "center center"});
    gsap.set(html.find("#stability-gear-binah"), {x: -200, y: -200, scale: 2, transformOrigin: "center center"});
    gsap.to(html.find("#stability-gear-geburah"), {rotation: "+=360", duration: 10, repeat: -1, ease: "none"});
    gsap.to(html.find("#stability-gear-binah"), {rotation: "-=360", duration: 10, repeat: -1, ease: "rough({strength: 0.2, points: 25, template: sine, taper: out, randomize: true, clamp: false})"});
    gsap.set(html.find("#stability-animation-bg img, .stability-count, #stability-frame"), {opacity: 1});
  }
  activateStabilityListeners(html: JQuery) {
    let clickStatus = false;
    const buttonContainer$ = html.find(".button-container");
    const dblClickCheck = (event: DoubleClickEvent) => {
      event.preventDefault();
      if (clickStatus) { return; }
      clickStatus = true;
      buttonContainer$.off("dblclick");
      void this.changeStability(-1 as number);
    };
    const clickCheck = (event: DoubleClickEvent) => {
      event.preventDefault();
      if (clickStatus) { return; }
      console.log("CLICK");
      buttonContainer$.off("click");
      buttonContainer$.on("dblclick", dblClickCheck.bind(this));
      setTimeout(() => {
        buttonContainer$.off("dblclick");
        clickStatus = false;
        buttonContainer$.on({
          click: clickCheck.bind(this)}
        );
      }, 250);
    };

    buttonContainer$.on({
      click:       clickCheck.bind(this),
      contextmenu: (event) => {
        event.preventDefault();
        void this.changeStability(1 as number);
      }
    });
  }
  animateEdges(html: JQuery) {
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
      );
    }
  }
  animateHoverStrips(html: JQuery): Array<Tuple<HTMLElement, GsapAnimation>> {
    const {actor} = this;
    const hoverTimelines: Array<Tuple<HTMLElement, GsapAnimation>> = [];
    // Add hover animations for hover-strip elements
    html.find(".hover-strip")
    .each(function() {
      hoverTimelines.push([this, ANIMATIONS.hoverStrip(this, html, actor)]);
    });

    // Add hover animations for hover-strip button elements
    html.find(".hover-strip .strip-button")
      .each(function() {
        hoverTimelines.push([this, ANIMATIONS.hoverStripButton(this)]);
      });
    return hoverTimelines;
  }
  activateHoverStripListeners(html: JQuery) {
    const self = this;
    // Add click listeners for elements with data-action="open" to open item sheets
    html.find("*[data-action=\"open\"]")
    .each(function() {
      const itemName = $(this).attr("data-item-name");
      if (itemName) {
        $(this).on("click", () => self.actor.getItemByName(itemName)?.sheet.render(true));
      }
    });

    // Add click listeners for elements with data-action="roll" to roll item actions
    html.find("*[data-action=\"roll\"]")
      .each(function() {
        const itemName = $(this).attr("data-item-name");
        if (itemName) {
          $(this).on({
            click: () => { void self.actor.roll(itemName); }
          });
        }
      });

    // Add click listeners for elements with data-action="trigger" to trigger item actions
    html.find("*[data-action=\"trigger\"]")
      .each(function() {
        const itemName = $(this).attr("data-item-name");
        if (itemName) {
          $(this).on({
            click: () => { void self.actor.trigger(itemName); }
          });
        }
      });

    // Add click listeners for elements with data-action="chat" to display item summaries in chat
    html.find("*[data-action=\"chat\"]")
      .each(function() {
        const itemName = $(this).attr("data-item-name");
        if (itemName) {
          $(this).on({
            click: () => { void self.actor.getItemByName(itemName)?.displayItemSummary(self.actor.name); }
          });
        }
      });

    // Add click listeners for elements with data-action="drop" to drop items
    html.find("*[data-action=\"drop\"]")
    .each(function() {
      const itemName = $(this).attr("data-item-name");
      if (itemName) {
        $(this).on({
          click: () => { void self.actor.dropItemByName(itemName); }
        });
        return;
      }
      const conditionID = $(this).attr("data-condition-id");
      if (conditionID) {
        $(this).on({
          click: () => { void self.actor.removeCondition(conditionID as IDString); }
        });
        return;
      }
      const woundID = $(this).attr("data-wound-id");
      if (woundID) {
        $(this).on({
          click: () => { void self.actor.removeWound(woundID as IDString); }
        });
        return;
      }
    });
  }
  activateHoverListeners(hoverTimelines: Array<Tuple<HTMLElement, GsapAnimation>>) {
    hoverTimelines.forEach(([target, anim]) => {
      $(target)
        .on("mouseenter", () => {
          anim.timeScale(1);
          anim.reversed(false);
        })
        .on("mouseleave", () => {
          anim.timeScale(2);
          anim.reversed(true);
        });
    });
  }
  applyPlaceholderText(html: JQuery) {
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
  }
  activateResizeListener(html: JQuery) {
    const resizableHandle = html.find(".window-resizable-handle");
    const debouncedResizeModifierReport = debounce(() => { this.resizeModifierReport(html); }, 1);

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
    requestAnimationFrame(() => { this.resizeModifierReport(html); });
  }
  setActiveTab(html: JQuery) {
    const curTab = this.actor.getFlag("kult4th", "sheetTab") as string;
    html.find(".tab.active").each(function() {
      if (this.getAttribute("data-tab") !== curTab) {
        this.classList.remove("active");
      }
    });
    html.find(`.tab[data-tab="${curTab}"]`).addClass("active");
  }
  activateStatusStripListeners(html: JQuery) {
    const self = this;
    // Add click listeners for wound-add buttons to add a new wound
    html.find("button.wound-add")
      .each(function() {
        $(this).on({
          click: () => {
            // kLog.log("Adding Wound. Button:", this);
            void self.actor.addWound().catch((err: unknown) => { kLog.error(String(err)); });
          }
        });
      });

    // Add click listeners for wound-delete buttons to remove a specific wound
    html.find("button.wound-delete")
      .each(function() {
        const woundID = $(this).data("woundId") as IDString;
        $(this).on({
          click: () => {
            // kLog.log(`Deleting Wound ${woundID}. Button:`, this);
            void self.actor.removeWound(woundID).catch((err: unknown) => { kLog.error(String(err)); });
          }
        });
      });

    // Add click listeners for elements with data-action="toggle-wound-type" to toggle the wound type
    html.find("*[data-action=\"toggle-wound-type\"]")
      .each(function() {
        const woundID = $(this).data("target") as IDString;
        if (woundID) {
          $(this).on({
            click: () => { void self.actor.toggleWound(woundID, "type"); }
          });
        }
      });

    // Add click listeners for elements with data-action="reset-wound-name" to reset the wound name
    html.find("*[data-action=\"reset-wound-name\"]")
      .each(function() {
        const woundID = $(this).data("target") as IDString;
        if (woundID) {
          $(this).on({
            click: () => { void self.actor.resetWoundName(woundID); }
          });
        }
      });

    // Add click listeners for elements with data-action="toggle-wound-stabilize" to toggle wound stabilization
    html.find("*[data-action=\"toggle-wound-stabilize\"]")
      .each(function() {
        const woundID = $(this).data("target") as IDString;
        if (woundID) {
          $(this).on({
            click: () => { void self.actor.toggleWound(woundID, "stabilized"); }
          });
        }
      });

    // Add click listeners for elements with data-action="drop-wound" to remove a specific wound
    html.find("*[data-action=\"drop-wound\"]")
      .each(function() {
        const woundID = $(this).data("target") as IDString;
        if (woundID) {
          $(this).on({
            click: () => { void self.actor.removeWound(woundID); }
          });
        }
      });

    // Add click listeners for elements with data-action="suppress-wound" to remove a specific wound
    html.find("*[data-action=\"suppress-wound\"]")
      .each(function() {
        const woundID = $(this).data("target") as IDString;
        if (woundID) {
          $(this).on({
            click: () => { void self.actor.toggleWound(woundID, "applying"); }
          });
        }
      });

    // Add click listeners for condition-add buttons to add a new condition
    html.find("button.condition-add")
    .each(function() {
      $(this).on({
        click: async () => {
          const type = await K4Dialog.GetUserInput<string>(
            {
              title: "Condition Type",
              bodyText: "Select the type of condition to add:"
            }, {
              input: PromptInputType.buttons,
              inputVals: Object.values(K4ConditionType)
                .map((cType) => U.tCase(cType))
            });
          if (U.isUndefined(type)) {
            return;
          }
          switch (type) {
            case K4ConditionType.stability: {
              const label: string|false = await K4Dialog.GetUserInput(
                {
                  title: "Condition Label",
                  bodyText: "Enter the label for the new Stability condition:",
                  subText: "(Preconfigured Conditions: 'Angry', 'Sad', 'Scared', 'Guilt-Ridden', 'Obsessed', 'Distracted', 'Haunted')"
                }, {
                  input: PromptInputType.text
                }
              );
              if (!label) { return; }
              const preconfiguredData = StabilityConditions[U.lCase(label) as keyof typeof StabilityConditions];
              let {description, modDef} = preconfiguredData as Maybe<{description: string, modDef: K4Roll.ModDefinition}> ?? {};
              if (U.isUndefined(description)) {
                description = (await K4Dialog.GetUserInput<string>(
                  {
                    title: "Condition Description",
                    bodyText: `Briefly describe the effects of the '${label}' condition on your mental state:`,
                    subText: "E.g. 'You feel threatened. You instinctively want to retreat from the situation and seek out a hiding spot.'"
                  }, {
                    input: PromptInputType.text
                  }
                )) || undefined;
              }
              if (U.isUndefined(modDef)) {
                const modDefString = await K4Dialog.GetUserInput<string>(
                  {
                    title: "Condition Modifiers",
                    bodyText: "Define what and by how much the condition modifies. Multiple modifiers can be separated by a comma.",
                    subText: "E.g. 'all: -2, disadvantage: -1, See Through the Illusion: 3'"
                  }, {
                    input: PromptInputType.text,
                    defaultVal: "all:-1"
                  }
                );
                modDef = Object.fromEntries(modDefString
                  .split(/\s*,\s*/)
                  .map((mod) => {
                    const [key, val] = mod.split(/\s*:\s*/);
                    return [key, U.pInt(val)];
                  }));
              }
              self.actor.addCondition({
                type,
                label,
                description,
                modDef
              }).catch((err: unknown) => { kLog.error(String(err)); });
              break;
            }
            case K4ConditionType.other: {
              console.warn("K4ConditionType.other: Unimplemented.");
              break;
            }
          }
        }
      });
    });

    // Add click listeners for condition-delete buttons to remove a specific condition
    html.find("button.condition-delete")
      .each(function() {
        const conditionID = $(this).data("conditionId") as IDString;
        $(this).on("click", () => {
          // kLog.log(`Deleting condition ${conditionID}. Button:`, this);
          self.actor.removeCondition(conditionID).catch((err: unknown) => { kLog.error(String(err)); });
        });
      });

    // Add click listeners for elements with data-action="suppress-condition" to toggle roll applicability
    html.find("*[data-action=\"suppress-condition\"]")
      .each(function() {
        const conditionID = $(this).data("target") as IDString;
        if (conditionID) {
          $(this).on({
            click: () => { void self.actor.toggleCondition(conditionID); }
          });
        }
      });

    // Add click listeners for elements with data-action="reset-condition-name" to reset the condition name
    html.find("*[data-action=\"reset-condition-name\"]")
      .each(function() {
        const conditionID = $(this).data("target") as IDString;
        if (conditionID) {
          $(this).on({
            click: () => { void self.actor.resetConditionName(conditionID); }
          });
        }
      });

    // Add click listeners for elements with data-action="drop-condition" to remove a specific condition
    html.find("*[data-action=\"drop-condition\"]")
      .each(function() {
        const conditionID = $(this).data("target") as IDString;
        if (conditionID) {
          $(this).on({
            click: () => { void self.actor.removeCondition(conditionID); }
          });
        }
      });
  }
  activateToggleStripListeners(html: JQuery) {
    this.actor.toggleableEffects.forEach((effect) => { effect.applyToggleListeners(html); });
  }
  activateWindowControlListeners(html: JQuery) {
    const self = this;
    // Add click listeners for close buttons in the header to close the sheet
    html.find(".header-button.close")
      .each(function() {
        $(this).on({
          click: () => { void self.actor.sheet.close(); }
        });
      });

    // Add click listeners for minimize buttons in the header to toggle minimize/maximize state
    html.find(".header-button.minimize")
      .each(function() {
        $(this).on("click", () => {
          if (self._minimized) {
            self.maximize().catch((err: unknown) => { kLog.error(String(err)); });
          } else {
            self.minimize().catch((err: unknown) => { kLog.error(String(err)); });
          }
        });
      });
  }
  activateContentEditableListeners(html: JQuery) {
    const self = this;
    // Initialize content-editable elements with click, focus, and blur listeners for inline editing
    html.find(".content-editable").each(function() {
      $(this)
        .on("click", (clickEvent) => {
          if ($(clickEvent.currentTarget).attr("contenteditable") === "true") {
            return undefined;
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
          const range = document.createRange(); // Create a new range
          const selection = window.getSelection(); // Get the current selection

          if (selection) {
            selection.removeAllRanges(); // Clear any existing selections
            range.selectNodeContents(element); // Select the contents of the element
            selection.addRange(range); // Add the range to the selection
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
            self.actor.update({[dataField]: elemText}).catch((err: unknown) => { kLog.error(String(err)); });
          }
        });
    });
  }

  get twitchyEyeSize(): number {
    switch (this.actor.stabilityLevel) {
      case K4Stability.composed: return 0;
      case K4Stability.moderate: return U.randInt(1, 1);
      case K4Stability.serious: return U.randInt(1, 2);
      case K4Stability.broken: return U.randInt(2, 3);
    }
    return 0;
  }
  get twitchyEyeIntensity(): number {
    switch (this.actor.stabilityLevel) {
      case K4Stability.composed: return 0;
      case K4Stability.moderate: return U.randInt(1, 1);
      case K4Stability.serious: return U.randInt(2, 3);
      case K4Stability.broken: return 3;
    }
    return 0;
  }
  _twitchyEyeCurPos = 0;
  get twitchyEyePosition(): number {
    let pos = U.randInt(1, 10);
    while (pos === this._twitchyEyeCurPos) {
      pos = U.randInt(1, 10);
    }
    this._twitchyEyeCurPos = pos;
    return this._twitchyEyeCurPos;
  }
  get twitchyEyeClassString(): string {
    return [
      `size-${this.twitchyEyeSize}`,
      `intensity-${this.twitchyEyeIntensity}`,
      `position-${this.twitchyEyePosition}`
    ].join(" ");
  }

  flashTwitchyEye(html: JQuery) {
    const self = this;
    const eyeContainer$ = html.find("#twitchy-eye");
    const eyeImg$ = eyeContainer$.find("img");
    const tabContent$ = eyeContainer$.closest(".tab-content");

    if (U.gsap.isTweening(eyeContainer$) || U.gsap.isTweening(tabContent$) || U.gsap.isTweening(eyeImg$)) { return; }

    eyeContainer$.attr("class", this.twitchyEyeClassString);
    const repeatDelay = U.randNum(0.5, this.twitchyEyeIntensity + 1, "power2.in");
    kLog.log(`Repeat Delay: ${U.pFloat(repeatDelay, 3)}`);

    U.gsap.timeline({
      repeat: 1,
      repeatDelay,
      yoyo: true
    })
      .fromTo(tabContent$, {background: "rgba(0, 0, 0, 0)" }, {
        background: C.Colors.dBLACK,
        duration: 0.5,
        ease: "power2.out"
      })
      .fromTo(eyeContainer$, {opacity: 0}, {
        opacity: 1,
        duration: 0.25,
        ease: "power2.out"
      }, 0.25);
  }

  _twitchyEyeTimer: Maybe<NodeJS.Timeout> = undefined;
  startTwitchyEyeTimer(html: JQuery) {
    if (this._twitchyEyeTimer) {
      clearTimeout(this._twitchyEyeTimer);
    }
    if (this.actor.stabilityLevel === K4Stability.composed) {
      return;
    }
    const stability = this.actor.stability;
    const ONE_MINUTE = 6;
    const period = stability * ONE_MINUTE;

    this._twitchyEyeTimer = setTimeout(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime % period === 0) {
        this.flashTwitchyEye(html);
      }
      this.startTwitchyEyeTimer(html);
    }, 1000);
  }
  override activateListeners(html: JQuery) {

    // Call the parent class's activateListeners method to ensure any inherited listeners are also activated
    super.activateListeners(html);
    const self = this;

    // Remove shadows from tab content if the "shadows" setting is disabled
    if (!U.getSetting("shadows")) {
      html.find(".tab-content").each(function() { $(this).css("filter", "none");});
    }

    const hoverTimelines: Array<Tuple<HTMLElement, GsapAnimation>> = [];

    // Activate listeners for the navigation menu
    hoverTimelines.push(...this.activateNavMenuListeners(html));

    // Apply text clamping to each element with the class "clamp-text"
    html.find(".clamp-text").each(function() {
      self.clamp(this);
    });

    // Handle gear animations based on the "gears" setting
    this.animateGears(html.parent(), U.getSetting<boolean>("gears"));

    // Set actor name background to black if animations are disabled
    if (!game.settings.get("kult4th", "animations")) {
      gsap.set(this.element.find(".actor-name-bg-anim"), {background: C.Colors.BLACK});
    }

    // Animate stability display
    this.animateStability(html);

    // Activate double-click and right-click listeners for stability display
    this.activateStabilityListeners(html);

    // Animate any edges
    this.animateEdges(html);

    // Animate hover strips
    hoverTimelines.push(...this.animateHoverStrips(html));

    // Activate hover-strip listeners ("open", "roll", "trigger", "chat", "drop")
    this.activateHoverStripListeners(html);

    // Activate hover listeners
    this.activateHoverListeners(hoverTimelines);

    // Initialize content-editable elements with placeholder text if necessary
    this.applyPlaceholderText(html);

    // Add resize listener that calls resizeModifierReport when sheet is resized
    this.activateResizeListener(html);

    // Set active tab
    this.setActiveTab(html);

    // If the sheet is not editable, return early
    if (!this.options.editable) { return undefined; }

    // Activate wound & stability condition listeners
    this.activateStatusStripListeners(html);

    // Activate toggle strip listeners
    this.activateToggleStripListeners(html);

    // Activate listeners for closing & minimizing the sheet
    this.activateWindowControlListeners(html);

    // Activate listeners for editing "content-editable" elements
    this.activateContentEditableListeners(html);

    // Activate interval timer for twitchy-eye effect
    this.startTwitchyEyeTimer(html);

    html.find("#item-test-button").on({
      click: this._promptItemSelection(
        Array.from(game.items).filter((item) => item.type === K4ItemType.advantage)
      ).bind(this)
    });

    if (this.actor.is(K4ActorType.pc) && !this.actor.isFinishedCharGen) {
      switch (this.actor.charGenPhase) {
        case K4CharGenPhase.archetype: {
          void this.activateChargenArchetypeListeners(html);
          break;
        }
        case K4CharGenPhase.attributesAndTraits: {
          void this.activateChargenAttributesAndTraitsListeners(html);
          break;
        }
        case K4CharGenPhase.details: {
          void this.activateChargenDetailsListeners(html);
          break;
        }
        case K4CharGenPhase.relations: {
          void this.activateChargenRelationsListeners(html);
          break;
        }
        case K4CharGenPhase.finished: {
          break;
        }
      }
    }
  }

  _promptItemSelection(itemList: K4Item[]) {
    return async () => {
      const item = await K4Dialog.GetUserItemSelection<K4ItemType.advantage>({
          title: "Select an Advantage",
          bodyText: "Select an advantage to apply to the actor.",
          subText: "This is some test subtext.",
          itemList
        });
        if (item) {
          void this.actor.createEmbeddedDocuments("Item", [item as K4Item & Record<string, unknown>]);
        }
    };
  }

  activateTab(tabName: string | null) {
    tabName ??= "front";
    const curTab = (this.actor.getFlag("kult4th", "sheetTab") ?? "front") as string;
    if (tabName && tabName !== curTab) {
      this.actor.setFlag("kult4th", "sheetTab", tabName).catch((err: unknown) => { kLog.error(String(err)); });
    }
  }
}


interface K4PCSheet {
  object: K4Actor<K4ActorType.pc>,
  _actor: K4Actor<K4ActorType.pc>
}

export default K4PCSheet;
