import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import gsap, { GSDevTools, MorphSVGPlugin } from "/scripts/greensock/esm/all.js";
gsap.registerPlugin(MorphSVGPlugin);
const ANIMATIONS = {
    glitchText(target, startingGlitchScale = 1) {
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
        gsap.set(binahTeeth$, { scale: 0.98 });
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
            duration: 15,
            ease: "none",
            repeat: -1
        });
    },
    navFade(target) {
        // const navGhostGears$ = $(target).find(".gear-container.gear-ghost-nav");
        const navLens$ = $(target).find(".nav-lens");
        const profileImg$ = $(target).find(".profile-image");
        const profileBg$ = $(target).find(".profile-image-bg");
        const buttonContainer$ = $(target).find(".tabs");
        const buttonSpikes$ = $(target).find(".nav-tab-container");
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
            buttonSpikes: $(target).find(".tabs .nav-tab-container .svg-def")
        };
        // @ts-expect-error MorphSVG does indeed accept functions.
        return gsap.timeline({ reversed: true /* , onComplete() { gsap.globalTimeline.timeScale(0) } */ })
            .to(target, {
            fill: "#000000",
            scale: 1,
            duration: 0.6,
            ease: "power2"
        }, 0)
            .to($(target).find(".svg-def:not(.main-ring)"), {
            fill: "#000000",
            duration: 0.6,
            ease: "sine"
        }, 0)
            .to($(target).find(".svg-def.main-ring"), {
            fill: "url('#nav-main-ring-bg-end-gradient')",
            duration: 0.1,
            ease: "none"
        }, 0.3)
            .to(U.getSiblings(target), {
            // opacity: 0.75,
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
            // .to(buttonContainer$, {
            // 	scale: 1,
            // 	opacity: 1,
            // 	zIndex: 6,
            // 	ease: "power3",
            // 	duration: 0.3
            // }, 0.15)
            .to(svgs.buttonSpikes, {
            scaleY: 1,
            ease: "power3",
            duration: 0.3,
            stagger: {
                amount: 0.25,
                from: "random"
            }
        }, 0.05)
            .to(flare$, {
            scale: 2,
            duration: 0.45,
            ease: "sine"
        }, 0)
            .from([closeButton$, minimizeButton$], {
            opacity: 0,
            zIndex: -2,
            filter: "blur(5px)",
            ease: "sine",
            duration: 0.6
        }, 0).to([closeButton$, minimizeButton$], {
            opacity: 1,
            duration: 0.3
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
        }, 0);
    },
    hoverNav(target, context) {
        const headerButtons = target.getElementsByClassName("header-button");
        return gsap
            .timeline({
            reversed: true
        }).to(target, {
            scale: 1.25,
            x: 10,
            y: 20,
            duration: 0.5,
            ease: "back"
        }, 0).to(U.getSiblings(target), {
            opacity: 0.75,
            filter: "blur(5px)",
            duration: 0.5,
            ease: "back"
        }, 0).to(headerButtons, {
            scale: 0.75,
            y: -100,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(3)"
            // opacity: 1
        }, 0);
    },
    hoverTab(target, context) {
        const tabLabel$ = $(target).find(".nav-tab-label");
        // const tabAnimation$ = $(target).find(".nav-tab-animation");
        const tl = gsap.timeline({ reversed: true })
            .to(tabLabel$, {
            opacity: 1,
            duration: 0.25,
            ease: "sine"
        }, 0)
            .fromTo(tabLabel$, {
            scaleY: 3,
            scaleX: 1.5,
            filter: "blur(10px)"
        }, {
            scaleY: 2,
            scaleX: 1,
            filter: "none",
            duration: 1,
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
    hoverMove(target, context, isDerivedMove = true) {
        const FULL_DURATION = 0.5;
        const attribute = $(target).data("attribute");
        const itemText$ = $(target).find(".item-text");
        const itemIcon$ = $(target).find(".item-icon");
        const toolTip$ = $(target).find(".trigger-tooltip");
        const tl = gsap
            .timeline({
            reversed: true
        }).fromTo(itemIcon$, {
            borderRadius: 25,
            overflow: "hidden"
        }, {
            width: "100%",
            borderRadius: 0,
            duration: FULL_DURATION,
            backgroundColor: C.Colors["GOLD +1"],
            ease: "sine"
        }, 0).fromTo(itemText$, {
            x: 0,
            width: "auto",
            opacity: 1,
            color: C.Colors.GOLD,
            textShadow: 0
        }, {
            x: -(parseInt(`${gsap.getProperty(itemText$[0], "width")}`)) - 40,
            width: 0,
            color: C.Colors.BLACK,
            textShadow: [
                ...new Array(4).fill(`0 0 15px ${C.Colors["GOLD +1"]}`),
                ...new Array(6).fill(`0 0 5px ${C.Colors["GOLD +1"]}`),
                ...new Array(4).fill(`0 0 2px ${C.Colors["GOLD +1"]}`)
            ].join(", "),
            duration: FULL_DURATION,
            ease: "back"
        }, 0).set(itemText$, {
            opacity: 0
        }, 0.01)
            .to(itemText$, {
            opacity: 1,
            duration: FULL_DURATION - 0.01,
            ease: "sine"
        }, 0.01).fromTo(toolTip$, {
            opacity: 0,
            bottom: 30,
            scale: 1.5
        }, {
            opacity: 1,
            bottom: 30,
            scale: 1,
            duration: 0.75 * FULL_DURATION,
            ease: "power2.in"
        }, 0);
        if ((attribute in C.Attributes.Active) || (attribute in C.Attributes.Passive)) {
            const animation$ = context.find(`.subsection.attributes .attribute-box[data-attribute="${attribute}"] img`);
            tl
                .fromTo(animation$, {
                opacity: 0
            }, {
                opacity: 1,
                duration: FULL_DURATION,
                ease: "sine"
            }, 0);
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
    }
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
            baseMoves: this.actor.basicMoves,
            derivedMoves: this.actor.derivedMoves,
            advantages: this.actor.advantages,
            disadvantages: this.actor.disadvantages,
            darksecrets: this.actor.darkSecrets,
            relations: this.actor.relations,
            weapons: this.actor.weapons,
            gear: this.actor.gear,
            attacks: this.actor.attacks,
            attributes: this.actor.attributeData,
            curTab: this.actor.getFlag("kult4th", "sheetTab")
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
            const [navPanel] = html.find(".nav-panel");
            $(navPanel)
                .each(() => {
                gsap.set(navPanel, {
                    xPercent: -50,
                    yPercent: -50
                });
                hoverTimelines.push([navPanel, ANIMATIONS.navFade(navPanel)]);
                return;
                const hoverTimeline = ANIMATIONS.navFade(navPanel);
                $(navPanel).on("mouseenter", () => {
                    if (!$(navPanel).data("isHovered")) {
                        $(navPanel).data({ isHovered: true });
                        hoverTimeline.reversed(false);
                    }
                });
                $(document).on("mousemove", (event) => {
                    if ($(navPanel).data("isHovered")) {
                        if (!document.elementsFromPoint(event.clientX, event.clientY)
                            .find((elem) => $(elem).hasClass("nav-panel"))) {
                            $(navPanel).data({ isHovered: false });
                            hoverTimeline.reversed(true);
                        }
                    }
                });
            });
            html.find(".clampText").each((i, element) => { this.clamp(element); });
            if (this.options.editable) {
                const setContent = (element, content) => {
                    if (!["number", "string"].includes(typeof content)) {
                        content = "";
                    }
                    else {
                        content = `${content}`.trim();
                    }
                    if (content) {
                        element.classList.remove("placeholder");
                        if (element.classList.contains("quote")) {
                            content = `"${content}"`;
                        }
                    }
                    else {
                        if ("placeholder" in element.dataset) {
                            element.classList.add("placeholder");
                            content = element.dataset.placeholder;
                        }
                        else {
                            content = " ";
                        }
                    }
                    element.innerText = String(content);
                };
                // #region ON-EVENT FUNCTIONS
                const _onEditKeyDown = (event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        event.currentTarget.blur();
                    }
                };
                const _onEditClickOn = (event) => {
                    event.preventDefault();
                    const element = event.currentTarget;
                    if (element) {
                        element.setAttribute("contenteditable", "true");
                        if (element.classList.contains("placeholder")) {
                            element.innerHTML = "&nbsp;";
                            element.classList.remove("placeholder");
                            this.unClamp(element);
                        }
                        if (element.classList.contains("quote")) {
                            element.innerHTML = element.innerText.replace(/^\s*"?|"?\s*$/gu, "").trim();
                        }
                        // Add an event listener for when the player hits the 'Enter' key.
                        element.addEventListener("keydown", _onEditKeyDown.bind(this));
                        // Focus the element, which will fire the _onEditFocus event to select all text.
                        element.focus();
                    }
                };
                const _onEditFocus = () => { document.execCommand("selectAll"); };
                const _onEditClickOff = async (event) => {
                    event.preventDefault();
                    const element = event.currentTarget;
                    const { dataset } = element;
                    const elementText = element.innerText.replace(/^\s*"?|"?\s*$/gu, "").trim();
                    this.clamp(element);
                    setContent(element, elementText);
                    element.setAttribute("contenteditable", "false");
                    element.removeEventListener("keydown", _onEditKeyDown);
                    if ("field" in dataset && dataset.field !== undefined) {
                        if ("fieldindex" in dataset) {
                            const fieldVal = getProperty(this.actor, dataset.field.replace(/^(data\.)+/gu, "data.data."));
                            fieldVal[U.pInt(dataset.fieldindex)] = elementText;
                            await this.actor.update({ [dataset.field]: fieldVal });
                        }
                        else {
                            await this.actor.update({ [dataset.field]: elementText });
                        }
                    }
                };
                // #endregion
                // #region INITIALIZATION
                html.find(".contentEditable").each(function enableContentEnditable() {
                    const { dataset } = this;
                    this.setAttribute("contenteditable", "false");
                    this.addEventListener("click", _onEditClickOn.bind(self));
                    this.addEventListener("focus", _onEditFocus.bind(self));
                    this.addEventListener("blur", _onEditClickOff.bind(self));
                    // self.clamp(this);
                    let elementText;
                    // If dataset includes a field, fill the element with the current data:
                    if ("field" in dataset && dataset.field !== undefined) {
                        elementText = getProperty(self.actor.data, dataset.field);
                        if (dataset.fieldindex !== undefined && Array.isArray(elementText)) {
                            elementText = elementText[U.pInt(dataset.fieldindex)];
                        }
                    }
                    setContent(this, elementText);
                });
                // #endregion
            }
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
            html.find(".nav-tab")
                .each(function initNavTab() {
                // gsap.set(this, {xPercent: -50, yPercent: -50, opacity: 1});
                hoverTimelines.push([this, ANIMATIONS.hoverTab(this, html)]);
                $(this).on("click", function switchTab() {
                    self.activateTab(this.getAttribute("data-tab"));
                });
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
                    console.log("Adding Wound. Button:", this);
                    self.actor.addWound();
                });
            });
            html.find("button.wound-delete")
                .each(function deleteWoundButton() {
                const woundNum = U.pInt(this.dataset.index);
                $(this).on("click", () => {
                    console.log(`Deleting Wound ${woundNum}. Button:`, this);
                    self.actor.removeWound(woundNum);
                });
            });
            html.find(".item-card")
                .each(function addMoveHoverEvents() {
                if (!self.hoverTimeline) {
                    self.hoverTimeline = ANIMATIONS.hoverMove(this, html, false);
                    self.hoverTimeline.vars.id = "hoverTimeline";
                    self.hoverTimelineTarget = this;
                }
                hoverTimelines.push([this, ANIMATIONS.hoverMove(this, html, false)]);
            });
            hoverTimelines.forEach(([target, anim]) => {
                $(target)
                    .on("mouseenter", () => anim.reversed(false))
                    .on("mouseleave", () => anim.reversed(true));
            });
        });
    }
    activateTab(tabName) {
        tabName ??= "front";
        const curTab = (this.actor.getFlag("kult4th", "sheetTab") ?? "front");
        if (tabName && tabName !== curTab) {
            console.log(`Activating Tab ${tabName}`);
            this.actor.setFlag("kult4th", "sheetTab", tabName);
        }
    }
}
