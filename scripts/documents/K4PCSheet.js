import C, { getContrastingColor } from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import gsap, { GSDevTools, MorphSVGPlugin } from "/scripts/greensock/esm/all.js";
gsap.registerPlugin(MorphSVGPlugin);
const ANIMATIONS = {
    _glitchText(target, startingGlitchScale = 1) {
        const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: 10,
            reversed: true,
            onRepeat() {
                this.timeScale(this.glitchScale);
            }
        });
        tl.glitchScale = startingGlitchScale;
        tl.to(".glitch", {
            skewX() { return 20 * this.glitchScale; },
            duration() { return 0.1 * this.glitchScale; },
            ease: "power4.inOut"
        })
            .to(".glitch", { duration() { return 0.01 * this.glitchScale; }, skewX: 0, ease: "power4.inOut" })
            .to(".glitch", { duration() { return 0.01 * this.glitchScale; }, opacity: 0 })
            .to(".glitch", { duration() { return 0.01 * this.glitchScale; }, opacity: 1 })
            .to(".glitch", { duration() { return 0.01 * this.glitchScale; }, x() { return -10 * this.glitchScale; } })
            .to(".glitch", { duration() { return 0.01 * this.glitchScale; }, x: 0 })
            .add("split", 0)
            .to(".top", { duration() { return 0.5; }, x() { return -10 * this.glitchScale; }, ease: "power4.inOut" }, "split")
            .to(".bottom", { duration() { return 0.5; }, x() { return 10 * this.glitchScale; }, ease: "power4.inOut" }, "split")
            .to(".glitch", { duration() { return 0.08; }, className: "+=redShadow" }, "split")
            .to("#txt", { duration() { return 0; }, scale() { return 1 + (0.05 * (this.glitchScale - 1)); } }, "split")
            .to("#txt", { duration() { return 0; }, scale: 1 }, "+=0.02")
            .to(".glitch", { duration() { return 0.08; }, className: "-=redShadow" }, "+=0.09")
            .to(".glitch", { className: "+=greenShadow", duration: 0.03 }, "split")
            .to(".glitch", { className: "-=greenShadow", duration: 0.03 }, "+=0.01")
            .to(".top", { duration() { return 0.2; }, x: 0, ease: "power4.inOut" })
            .to(".bottom", { duration() { return 0.2; }, x: 0, ease: "power4.inOut" })
            .to(".glitch", { duration() { return 0.02; }, scaleY() { return 1 + (0.05 * (this.glitchScale - 1)); }, ease: "power4.inOut" })
            .to(".glitch", { duration() { return 0.04; }, scaleY: 1, ease: "power4.inOut" });
        return tl;
    },
    gearGeburahRotate(target) {
        const outerGear$ = $(target).find(".svg-gear-geburah");
        const centerSaw$ = $(target).find(".svg-gear-geburah-center-saw");
        const centerSawRotate = gsap.timeline({ repeat: -1 })
            .to(centerSaw$, {
            rotation: "-=360",
            duration: 10,
            ease: "none"
        });
        return gsap.timeline({ delay: 0.2, repeat: -1 })
            .to(outerGear$, {
            rotation: "-=20",
            duration: 0.4,
            repeatRefresh: true,
            repeatDelay: 1.6,
            ease: "back",
            repeat: -1
        }, 0)
            .fromTo(centerSawRotate, {
            timeScale: 8
        }, {
            timeScale: 0.5,
            duration: 1.9,
            ease: "power2",
            repeatDelay: 0,
            delay: 0.1,
            repeat: -1
        }, 0);
    },
    gearBinahRotate(target) {
        const binahTeeth$ = $(target).find(".svg-gear-binah-outer-teeth");
        const binahInner$ = $(target).find(".svg-gear-binah-inner-full");
        gsap.set(binahTeeth$, { scale: 0.97 });
        return gsap.timeline({ repeat: -1 })
            .to(binahTeeth$, {
            rotation: "-=360",
            duration: 5,
            repeat: -1,
            ease: "none"
        }, 0)
            .to(binahInner$, {
            rotation: "+=10",
            duration: 0.4,
            repeatRefresh: true,
            repeatDelay: 0.85,
            ease: "back.out(14)",
            repeat: -1
        }, 0);
    },
    gearHugeRotate(target) {
        return gsap.to(target, {
            rotation: "+=360",
            duration: 50,
            ease: "none",
            repeat: -1
        });
    },
    hoverNav(target) {
        // const navGhostGears$ = $(target).find(".gear-container.gear-ghost-nav");
        const navLens$ = $(target).find(".nav-lens");
        const profileImg$ = $(target).find(".profile-image");
        const profileBg$ = $(target).find(".profile-image-bg");
        const buttonContainer$ = $(target).find(".tabs");
        const buttonSpikes$ = $(target).find(".nav-tab-container");
        const buttonSliders$ = $(target).find(".nav-tab-slider");
        const closeButton$ = $(target).find(".header-button.close");
        const minimizeButton$ = $(target).find(".header-button.minimize");
        const animation$ = $(target).find(".profile-image-animation");
        const flare$ = $(target).find(".nav-flare");
        const svgs = {
            container: $(target).find(".nav-svg"),
            outerSpikeContainer: $(target).find(".outer-spikes"),
            outerSpikes: Array.from($(target).find(".outer-spikes").children()),
            outerSpikePaths: Array.from($(target).find(".outer-spikes-hover").children())
                .map((spike) => spike.getAttribute("d")),
            innerSpikes: $(target).find(".inner-spikes"),
            innerMesh: $(target).find(".inner-mesh"),
            mainRing: $(target).find(".main-ring"),
            buttonSpikes: $(target).find(".tabs .nav-tab-container .svg-container[class*='nav-spoke'] .svg-def")
        };
        // @ts-expect-error MorphSVG does indeed accept functions.
        return gsap.timeline({ reversed: true /* , onComplete() { gsap.globalTimeline.timeScale(0) } */ })
            .to(target, {
            scale: 1.2,
            duration: 0.6,
            ease: "power2"
        }, 0)
            .to(target, {
            x: "+=20",
            duration: 0.5,
            ease: "sine.inOut"
        }, 0)
            .to(target, {
            y: "+=50",
            duration: 0.5,
            ease: "sine.out"
        }, 0)
            .to($(target).find(".svg-def:not(.main-ring)"), {
            "--K4-svg-fill": C.Colors.BLACK,
            "duration": 0.6,
            "ease": "sine"
        }, 0)
            .set($(target).find(".svg-def.main-ring"), {
            fill: "url('#nav-main-ring-bg-end-gradient')"
        }, 0.3)
            .to(U.getSiblings(target), {
            filter: "blur(5px)",
            duration: 0.5,
            ease: "back"
        }, 0)
            .to(svgs.mainRing, {
            scale: 1,
            opacity: 1,
            ease: "sine",
            duration: 0.6,
            strokeWidth: 0,
            stroke: 0
        }, 0)
            .to(svgs.innerMesh, {
            scale: 1,
            ease: "sine",
            duration: 0.45
        }, 0).to(svgs.innerMesh, {
            opacity: 1,
            ease: "sine",
            duration: 0.3
        }, 0.15)
            .to(svgs.outerSpikeContainer, {
            scale: 1,
            duration: 0.3,
            ease: "power2"
        }, 0)
            .to(svgs.outerSpikes, {
            // @ts-expect-error MorphSVG does indeed accept functions.
            morphSVG(i) { return svgs.outerSpikePaths[i]; },
            scale: 1,
            duration: 0.3,
            ease: "power2"
        }, 0)
            .to(svgs.innerSpikes, {
            scale: 1,
            duration: 0.3,
            ease: "power2"
        }, 0.15).to(svgs.innerSpikes, {
            opacity: 1,
            duration: 0.15,
            ease: "power2"
        }, 0.2)
            .to(navLens$, {
            rotation: "+=180",
            duration: 0.6,
            ease: "sine.inOut"
        }, 0).to(navLens$, {
            opacity: 0,
            duration: 0.3,
            ease: "power2"
        }, 0.3)
            .to(buttonSliders$, {
            y: "-=85",
            ease: "sine",
            pointerEvents: "all",
            duration: 0.3,
            stagger: {
                amount: 0.25,
                from: "random"
            }
        }, 0.05)
            .to(flare$, {
            scale: 2.3,
            duration: 0.45,
            ease: "sine"
        }, 0)
            .from([closeButton$, minimizeButton$], {
            // zIndex: -2,
            pointerEvents: "none",
            filter: "blur(5px)",
            ease: "sine",
            duration: 0.6
        }, 0).to([closeButton$, minimizeButton$], {
            opacity: 1,
            duration: 0.3,
            pointerEvents: "all"
        }, 0)
            .to(profileImg$, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out"
        }, 0)
            .to(profileBg$, {
            opacity: 0.65,
            duration: 0.6,
            ease: "sine"
        }, 0)
            .to(buttonContainer$, {
            // 	scale: 1,
            // 	opacity: 1,
            zIndex: 1,
            ease: "power3",
            duration: 0.01
        });
    },
    hoverNavTab(target, context) {
        const tabLabel$ = $(target).find(".nav-tab-label");
        // const tabAnimation$ = $(target).find(".nav-tab-animation");
        const tl = gsap.timeline({ reversed: true })
            .to(tabLabel$, {
            opacity: 1,
            duration: 0.25,
            ease: "sine"
        }, 0)
            .fromTo(tabLabel$, {
            scale: 3,
            // scaleX: 1.5,
            filter: "blur(10px)"
        }, {
            // scaleY: 2,
            scale: 1,
            filter: "none",
            duration: 0.35,
            ease: "power3"
        }, 0) /* .fromTo(
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
        ) */;
        return tl;
    },
    hoverStrip(target, context) {
        const FULL_DURATION = 0.5;
        const hoverTarget$ = $(context).find($(target).data("hover-target"));
        const targetSiblings$ = U.getSiblings(target);
        const stripIcon$ = $(target).find(".icon-container .svg-container");
        const stripName$ = $(target).find(".strip-name");
        const buttonStrip$ = $(target).find(".button-strip");
        if (!buttonStrip$[0]) {
            return gsap.timeline({ reversed: true });
        }
        const stripToolTip$ = $(target).find(".strip-tooltip");
        // const colorFG = $(target).data("color-fg") || gsap.getProperty(stripToolTip$[0], "color");
        // const colorFG = $(target).css("--strip-color-fg")?.trim() ?? gsap.getProperty(stripToolTip$[0], "color");
        // const colorBG = (String(getContrastingColor(colorFG, 4) || $(target).css("--strip-color-bg")?.trim()) ?? C.Colors.BLACK);
        const colorFG = gsap.getProperty(stripName$[0], "color");
        const colorBG = (String(getContrastingColor(String(colorFG), 4) || $(target).css("--strip-color-bg")?.trim()) ?? C.Colors.BLACK);
        const nameShift = U.get(target, "height", "px");
        // console.log(`HOVER STRIP: ${$(target).attr("class")}`, {target, colorFG, colorBG, nameShift});
        const tl = gsap
            .timeline({ reversed: true })
            .to(stripIcon$, {
            scale: "+=1",
            duration: FULL_DURATION,
            ease: "sine"
        }, 0)
            .to(target, {
            duration: 0.1,
            zIndex: 5000,
            ease: "none"
        }, 0)
            .to(buttonStrip$, {
            opacity: 1,
            duration: FULL_DURATION / 4,
            ease: "none"
        }, 0)
            .fromTo(buttonStrip$, {
            width: 0
        }, {
            width: "90%",
            duration: FULL_DURATION,
            ease: "sine"
        }, 0)
            .fromTo(stripName$, {
            color: colorFG
        }, {
            xPercent: -100,
            x: `-=${2 * nameShift}`,
            fontWeight: 900,
            fontStyle: "normal",
            zIndex: 20,
            duration: FULL_DURATION,
            color: colorBG,
            textShadow: [
                ...new Array(4).fill(`0 0 15px ${colorFG}`),
                ...new Array(6).fill(`0 0 5px ${colorFG}`),
                ...new Array(4).fill(`0 0 2px ${colorFG}`)
            ].join(", "),
            ease: "back"
        }, 0);
        if (stripToolTip$[0]) {
            tl.fromTo(stripToolTip$, {
                opacity: 0,
                scale: 1.5
            }, {
                opacity: 1,
                scale: 1,
                y: "-=10",
                duration: 0.75 * FULL_DURATION,
                ease: "power2.in"
            }, 0);
        }
        if (hoverTarget$[0]) {
            tl.fromTo(hoverTarget$, {
                opacity: 0
            }, {
                opacity: 1,
                duration: FULL_DURATION,
                ease: "sine"
            }, 0);
        }
        return tl;
    },
    hoverStripButton(target, context) {
        const FULL_DURATION = 0.25;
        const buttonStrip$ = $(target).parent();
        const svg$ = $(target).find(".svg-container");
        const tooltip$ = $(target).find(".button-tooltip");
        const tl = gsap.timeline({ reversed: true })
            .set(target, { zIndex: 30 }, 0.1)
            .fromTo(target, {
            opacity: 0.7,
            scale: 0.8
        }, {
            boxShadow: "0px 0px 5px var(--K4-bBLUE)",
            opacity: 1,
            scale: 1,
            duration: FULL_DURATION,
            ease: "power2"
        }, 0)
            .to(svg$, {
            filter: "blur(2px)",
            scale: 5,
            opacity: 0,
            duration: 0.5 * FULL_DURATION,
            ease: "power2"
        }, 0)
            .fromTo(tooltip$, {
            filter: "blur(2px)"
        }, {
            opacity: 1,
            filter: "none",
            fontWeight: 900,
            duration: FULL_DURATION,
            ease: "power2"
        }, 0);
        return tl;
    } /* ,
    hoverMove(target: HTMLElement, context: JQuery, isDerivedMove = true): gsapAnim {
        const FULL_DURATION = 0.5;

        const attribute = $(target).data("attribute");
        const itemText$ = $(target).find(".item-text");
        const itemIcon$ = $(target).find(".item-icon");
        const toolTip$ = $(target).find(".trigger-tooltip");
        const tl = gsap
            .timeline({
                reversed: true
            }).fromTo(
                itemIcon$,
                {
                    borderRadius: 25,
                    overflow: "hidden"
                },
                {
                    width: "100%",
                    borderRadius: 0,
                    duration: FULL_DURATION,
                    backgroundColor: C.Colors["bGOLD"],
                    ease: "sine"
                },
                0
            ).fromTo(
                itemText$,
                {
                    x: 0,
                    width: "auto",
                    opacity: 1,
                    color: C.Colors.GOLD,
                    textShadow: 0
                },
                {
                    x: -(parseInt(`${gsap.getProperty(itemText$[0], "width")}`)) - 40,
                    width: 0,
                    color: C.Colors.BLACK,
                    textShadow: [
                        ...new Array(4).fill(`0 0 15px ${C.Colors["bGOLD"]}`),
                        ...new Array(6).fill(`0 0 5px ${C.Colors["bGOLD"]}`),
                        ...new Array(4).fill(`0 0 2px ${C.Colors["bGOLD"]}`)
                    ].join(", "),
                    duration: FULL_DURATION,
                    ease: "back"
                },
                0
            ).set(
                itemText$,
                {
                    opacity: 0
                },
                0.01
            )
            .to(
                itemText$,
                {
                    opacity: 1,
                    duration: FULL_DURATION - 0.01,
                    ease: "sine"
                },
                0.01
            ).fromTo(
                toolTip$,
                {
                    opacity: 0,
                    bottom: 30,
                    scale: 1.5
                },
                {
                    opacity: 1,
                    bottom: 30,
                    scale: 1,
                    duration: 0.75 * FULL_DURATION,
                    ease: "power2.in"
                },
                0
            );

        if ((attribute in C.Attributes.Active) || (attribute in C.Attributes.Passive)) {
            const animation$ = context.find(`.subsection.attributes .attribute-box[data-attribute="${attribute}"] img`);
            tl
                .fromTo(
                    animation$,
                    {
                        opacity: 0
                    },
                    {
                        opacity: 1,
                        duration: FULL_DURATION,
                        ease: "sine"
                    },
                    0
                );
            // .fromTo(
            // 	animation$,
            // 	{
            // 		filter: "blur(40px)"
            // 	},
            // 	{
            // 		filter: "none",
            // 		duration: FULL_DURATION,
            // 		ease: "sine"
            // 	},
            // 	0
            // );
        }

        return tl;
    } */
};
export default class K4PCSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [C.SYSTEM_ID, "actor", "sheet", "kult4th-sheet", "k4-theme-dgold"],
            tabs: [
                { navSelector: ".tabs", contentSelector: ".tab-content", initial: "bio" }
            ]
        });
    }
    get template() { return `systems/kult4th/templates/sheets/${this.actor.data.type}-sheet.hbs`; }
    hoverTimeline;
    hoverTimelineTarget;
    devTools = GSDevTools;
    async getData() {
        const baseData = await super.getData();
        const data = {
            ...baseData,
            actorData: this.actor.data.data,
            ...U.objMap({
                baseMoves: this.actor.basicMoves,
                derivedMoves: this.actor.derivedMoves,
                advantages: this.actor.advantages,
                disadvantages: this.actor.disadvantages,
                darksecrets: this.actor.darkSecrets,
                relations: this.actor.relations,
                weapons: this.actor.weapons,
                gear: this.actor.gear,
                attacks: this.actor.attacks
            }, (items) => items.map((item) => item.toHoverStrip())),
            attributes: this.actor.attributeData,
            curTab: this.actor.getFlag("kult4th", "sheetTab"),
            wounds: this.actor.woundStrips
        };
        /*DEVCODE*/
        console.log("Final Actor Data", data);
        Object.assign(globalThis, { actor: this.actor, sheet: this });
        /*!DEVCODE*/
        return data;
    }
    setPosition(posData) {
        super.setPosition(posData);
        cqApi.reevaluate();
    }
    clamp(element) {
        if ("clamplines" in element.dataset) {
            $clamp(element, {
                clamp: U.pInt(element.dataset.clamplines)
            });
        }
        else if ("clampheight" in element.dataset) {
            $clamp(element, {
                clamp: element.dataset.clampheight
            });
        }
        else {
            $clamp(element, { clamp: "auto" });
        }
    }
    unClamp(element) { element.style.cssText = ""; }
    activateListeners(html) {
        const ISDEBUGGING = false;
        super.activateListeners(html);
        const self = this;
        $(() => {
            const hoverTimelines = [];
            // function softMouseLeave(hoverAnim: gsapAnim) {
            // 	if (!hoverAnim.data.isLeaving) { return }
            // 	if (hoverAnim.isActive()) {
            // 		setTimeout(() => softMouseLeave(hoverAnim), 500);
            // 	} else {
            // 		hoverAnim.data.isLeaving = false;
            // 		hoverAnim.reversed(true);
            // 	}
            // }
            html.find(".nav-panel").each(function initNavPanel() {
                // hoverTimelines.forEach(([target, anim]) => {
                // const hoverAnim = ANIMATIONS.hoverNav(this);
                // hoverAnim.data = {};
                // $(this)
                // 	.on("mouseenter", () => {
                // 		hoverAnim.data.isLeaving = false;
                // 		// console.log("Entering Nav Panel");
                // 		hoverAnim.reversed(false);
                // 	})
                // 	.on("mouseleave", () => {
                // 		hoverAnim.data.isLeaving = true;
                // 		softMouseLeave(hoverAnim);
                // 	});
                // });
                hoverTimelines.push([this, ANIMATIONS.hoverNav(this)]);
            });
            html.find(".nav-tab")
                .each(function initNavTab() {
                // gsap.set(this, {xPercent: -50, yPercent: -50, opacity: 1});
                hoverTimelines.push([this, ANIMATIONS.hoverNavTab(this, html)]);
                $(this).on("click", function switchTab() {
                    self.activateTab(this.getAttribute("data-tab"));
                });
            });
            html.find(".clamp-text").each(function clampTextElems() {
                self.clamp(this);
            });
            $(document).find(".gear-container.gear-huge")
                .each(function initGearRotation() {
                ANIMATIONS.gearHugeRotate(this);
            });
            $(document).find(".gear-container.gear-geburah")
                .each(function initGearRotation() {
                ANIMATIONS.gearGeburahRotate(this);
            });
            $(document).find(".gear-container.gear-binah")
                .each(function initGearRotation() {
                ANIMATIONS.gearBinahRotate(this);
            });
            html.find("*[data-action=\"open\"]")
                .each(function addItemOpenEvents() {
                const itemName = $(this).attr("data-item-name");
                if (itemName) {
                    $(this).on("click", () => self.actor.getItemByName(itemName)?.sheet?.render(true));
                }
            });
            html.find("*[data-action=\"roll\"]")
                .each(function addItemOpenEvents() {
                const itemName = $(this).attr("data-item-name");
                if (itemName) {
                    $(this).on("click", () => self.actor.roll(itemName));
                }
            });
            html.find("*[data-action=\"chat\"]")
                .each(function addItemOpenEvents() {
                const itemName = $(this).attr("data-item-name");
                if (itemName) {
                    $(this).on("click", () => self.actor.name && self.actor.getItemByName(itemName)?.displayItemSummary(self.actor.name));
                }
            });
            html.find(".content-editable")
                .each(function initEditableStyles() {
                $(this).attr("contenteditable", "false");
                const innerText = $(this).text().trim();
                if ((!innerText && $(this).data("placeholder"))
                    || (innerText === $(this).data("placeholder"))) {
                    $(this)
                        .addClass("placeholder")
                        .text($(this).data("placeholder"));
                }
            });
            html.find(".hover-strip")
                .each(function addHoverStripEvents() {
                hoverTimelines.push([this, ANIMATIONS.hoverStrip(this, html)]);
            });
            html.find(".hover-strip .strip-button")
                .each(function addHoverStripButtonEvents() {
                hoverTimelines.push([this, ANIMATIONS.hoverStripButton(this, html)]);
            });
            // html.find(".item-card")
            // 	.each(function addMoveHoverEvents() {
            // 		if (!self.hoverTimeline) {
            // 			self.hoverTimeline = ANIMATIONS.hoverMove(this, html);
            // 			self.hoverTimeline.vars.id = "hoverTimeline";
            // 			self.hoverTimelineTarget = this;
            // 		}
            // 		hoverTimelines.push([this, ANIMATIONS.hoverMove(this, html)]);
            // 	});
            hoverTimelines.forEach(([target, anim]) => {
                $(target)
                    .on("mouseenter", () => anim.reversed(false))
                    .on("mouseleave", () => anim.reversed(true));
            });
            if (!this.options.editable) {
                return;
            }
            html.find("*[data-action=\"drop\"]")
                .each(function addItemOpenEvents() {
                const itemName = $(this).attr("data-item-name");
                if (itemName) {
                    $(this).on("click", () => self.actor.dropItemByName(itemName));
                }
            });
            html.find("button.stability-add")
                .each(function addStabilityButton() {
                $(this).on("click", () => self.actor.changeStability(1));
            });
            html.find("button.stability-remove")
                .each(function removeStabilityButton() {
                $(this).on("click", () => self.actor.changeStability(-1));
            });
            html.find("button.wound-add")
                .each(function addWoundButton() {
                $(this).on("click", () => {
                    // console.log("Adding Wound. Button:", this);
                    self.actor.addWound();
                });
            });
            html.find("button.wound-delete")
                .each(function deleteWoundButton() {
                const woundID = $(this).data("woundId");
                $(this).on("click", () => {
                    // console.log(`Deleting Wound ${woundID}. Button:`, this);
                    self.actor.removeWound(woundID);
                });
            });
            html.find("*[data-action=\"toggle-wound-type\"]")
                .each(function toggleWoundTypeEvent() {
                const woundID = $(this).data("target");
                if (woundID) {
                    $(this).on("click", () => self.actor.toggleWound(woundID, "type"));
                }
            });
            html.find("*[data-action=\"reset-wound-name\"]")
                .each(function addItemDropEvents() {
                const woundID = $(this).data("target");
                if (woundID) {
                    $(this).on("click", () => self.actor.resetWoundName(woundID));
                }
            });
            html.find("*[data-action=\"toggle-wound-stabilize\"]")
                .each(function toggleWoundStabilizeEvent() {
                const woundID = $(this).data("target");
                if (woundID) {
                    $(this).on("click", () => self.actor.toggleWound(woundID, "stabilized"));
                }
            });
            html.find("*[data-action=\"drop-wound\"]")
                .each(function dropWoundEvent() {
                const woundID = $(this).data("target");
                if (woundID) {
                    $(this).on("click", () => self.actor.removeWound(woundID));
                }
            });
            html.find(".header-button.close")
                .each(function closeSheetEvent() {
                $(this).on("click", () => self.actor.sheet?.close());
            });
            html.find(".header-button.minimize")
                .each(function minimizeSheetEvent() {
                $(this).on("click", () => {
                    if (self._minimized) {
                        self.maximize();
                    }
                    else {
                        self.minimize();
                    }
                });
            });
            html.find(".content-editable").each(function enableContentEditable() {
                $(this)
                    .on("click", (clickEvent) => {
                    if ($(clickEvent.currentTarget).attr("contenteditable") === "true") {
                        return;
                    }
                    clickEvent.preventDefault();
                    const { currentTarget } = clickEvent;
                    let elemText = $(currentTarget).text().trim();
                    if ($(currentTarget).hasClass("placeholder")) {
                        elemText = "";
                    }
                    $(currentTarget)
                        .text(elemText || " ")
                        .removeClass("placeholder")
                        .attr({ contenteditable: "true" })
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
                    document.execCommand("selectAll");
                })
                    .on("blur", (blurEvent) => {
                    blurEvent.preventDefault();
                    const { currentTarget } = blurEvent;
                    const elemText = $(currentTarget).text().trim();
                    // Set placeholder text where text content is blank
                    if (!elemText && $(currentTarget).data("placeholder")) {
                        $(currentTarget)
                            .addClass("placeholder")
                            .text($(currentTarget).data("placeholder"));
                    }
                    else {
                        $(currentTarget).removeClass("placeholder");
                    }
                    $(currentTarget)
                        .attr({ contenteditable: "false" })
                        .off("keydown");
                    self.clamp(currentTarget);
                    // Sync with actor data
                    const dataField = $(currentTarget).data("field");
                    const curData = getProperty(self.actor, dataField.replace(/^(data\.)+/g, "data.data."));
                    if (curData !== elemText) {
                        self.actor.update({ [dataField]: elemText });
                    }
                });
            });
        });
    }
    activateTab(tabName) {
        tabName ??= "front";
        const curTab = (this.actor.getFlag("kult4th", "sheetTab") ?? "front");
        if (tabName && tabName !== curTab) {
            this.actor.setFlag("kult4th", "sheetTab", tabName);
        }
    }
}
