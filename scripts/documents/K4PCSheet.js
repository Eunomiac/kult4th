import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import gsap, { GSDevTools } from "/scripts/greensock/esm/all.js";
const ANIMATIONS = {
    navFade(target) {
        // const navGhostGears$ = $(target).find(".gear-container.gear-ghost-nav");
        const navMainGear$ = $(target).find(".svg-gear-nav");
        const navLens$ = $(target).find(".nav-lens");
        const profileImg$ = $(target).find(".profile-image");
        const profileBg$ = $(target).find(".profile-image-bg");
        const animation$ = $(target).find(".profile-image-animation");
        const buttonSpikes$ = $(target).find(".nav-tab");
        const closeButton$ = $(target).find(".header-button.close");
        const minimizeButton$ = $(target).find(".header-button.minimize");
        return gsap
            .timeline({
            reversed: true
        }).to(target, {
            scale: 1,
            duration: 1,
            ease: "sine"
        }, 0).to([navMainGear$, navLens$], {
            rotation: "+=180",
            duration: 1,
            ease: "sine.inOut"
        }, 0).fromTo(buttonSpikes$, {
            rotation(i) { return -45 + (i * 25); },
            width: 50
        }, {
            // rotation: "+=150",
            width: 125,
            duration: 0.5,
            stagger: {
                amount: 0.5
            },
            ease: "sine"
        }, 0).from([closeButton$, minimizeButton$], {
            opacity: 0,
            zIndex: -2,
            filter: "blur(5px)",
            ease: "sine",
            duration: 0.5
        }, 0).to(animation$, {
            outlineWidth: 0,
            duration: 1,
            ease: "sine.inOut"
        }, 0).to(navLens$, {
            opacity: 0,
            duration: 0.5,
            ease: "power2"
        }, 0.5).to(profileImg$, {
            filter: "blur(5px)",
            opacity: 0.5,
            duration: 1,
            ease: "power2.out"
        }, 0).to(profileBg$, {
            opacity: 0.75,
            duration: 1,
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
        const tabAnimation$ = $(target).find(".nav-tab-animation");
        return gsap
            .timeline({
            reversed: true
        }).fromTo(tabLabel$, {
            scale: 3,
            opacity: 0,
            filter: "blur(10px)"
        }, {
            scale: 2,
            opacity: 1,
            filter: "none",
            duration: 1,
            ease: "back"
        }, 0).fromTo(tabAnimation$, {
            scale: 1,
            opacity: 0,
            filter: "blur(10px)"
        }, {
            scale: 5,
            opacity: 0.75,
            filter: "none",
            duration: 1,
            ease: "back"
        }, 0);
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
        }, 0.01).fromTo($(target).find(".trigger-tooltip"), {
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
    _actor;
    get $entity() { return this.object ?? this; }
    get $sheet() { return (this.$entity.sheet ?? false); }
    get $actor() {
        return (this._actor = this._actor
            ?? this.actor
            ?? (this.$entity.documentName === "Actor" ? this.$entity : false));
    }
    get $id() { return this.$entity.id; }
    get $type() { return this.$entity.type; }
    get $root() { return this.$entity.data; }
    get $data() { return this.$root.data; }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [C.SYSTEM_ID, "actor", "sheet", "light-on-dark"],
            tabs: [
                { navSelector: ".tabs", contentSelector: ".tab-content", initial: "front" }
            ]
        });
    }
    get template() { return "systems/kult4th/templates/sheets/pc-sheet.hbs"; }
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
            attributes: this.actor.attributeData
        };
        /*DEVCODE*/ console.log("Final Data", data); /*!DEVCODE*/
        return data;
    }
    activateListeners(html) {
        const ISDEBUGGING = false;
        super.activateListeners(html);
        const self = this;
        $(() => {
            console.log("ACTOR SHEET HTML OBJECT", html);
            const hoverTimelines = [];
            /* const [navPanel] = html.find(".nav-panel");
            $(navPanel)
                .each(() => {
                    gsap.set(navPanel, {
                        xPercent: -50,
                        yPercent: -50,
                        transformPerspective: 1000,
                        perspective: 600,
                        transformStyle: "preserve-3d"
                    });
                    const hoverTimeline = ANIMATIONS.hoverNav(navPanel, html);

                    $(navPanel).on("mouseenter", () => {
                        if (!$(navPanel).data("isHovered")) {
                            $(navPanel).data({isHovered: true});
                            hoverTimeline.reversed(false);
                        }
                    });

                    $(document).on("mousemove", (event) => {
                        if ($(navPanel).data("isHovered")) {
                            if (!document.elementsFromPoint(event.clientX, event.clientY)
                                .find((elem) => $(elem).hasClass("nav-panel"))) {
                                $(navPanel).data({isHovered: false});
                                gsap.to(navPanel, {
                                    rotationX: 0,
                                    rotationY: 0,
                                    duration: 2,
                                    ease: "power3.out"
                                });
                                hoverTimeline.reversed(true);
                            } else {
                                const maxX = $(navPanel).width() ?? 0;
                                const maxY = $(navPanel).height() ?? 0;

                                updateDisplay("maxX", maxX);
                                updateDisplay("maxY", maxY);

                                if (!maxX || !maxY) { return }

                                const posX = U.pInt(event.clientX) - (self.position.left ?? 0); // event.offsetX;
                                const posY = U.pInt(event.clientY) - (self.position.top ?? 0); // event.offsetY;

                                updateDisplay("posX", posX);
                                updateDisplay("posY", posY);

                                const percentX = (100 / (maxX / posX)) - 50;
                                const percentY = (100 / (maxY / posY)) - 50;

                                updateDisplay("percentX", percentX);
                                updateDisplay("percentY", percentY);

                                const maxRotX = 10;
                                const maxRotY = 10;

                                const rotX = (maxRotY / 100) * percentY;
                                const rotY = (-maxRotX / 100) * percentX;

                                updateDisplay("rotX", rotX);
                                updateDisplay("rotY", rotY);

                                gsap.to(navPanel, {
                                    rotationX: rotX,
                                    rotationY: rotY,
                                    ease: "back.out",
                                    duration: 0.5
                                });
                            }
                        }
                    });
                });

            html.find(".nav-tab")
                .each(function initNavTab() {
                    gsap.set(this, {xPercent: -50, yPercent: -50, opacity: 1});
                    hoverTimelines.push([this, ANIMATIONS.hoverTab(this, html)]);
                });
            */
            $(document).find(".gear-container.gear-nav")
                .each(function initNavHover() {
                console.log("Found Something", this);
                hoverTimelines.push([this, ANIMATIONS.navFade(this)]);
            });
            function createOpenLinkFromName(elem, iName) {
                if (iName) {
                    $(elem).on("click", () => self.actor.getItemByName(iName)?.sheet?.render(true));
                }
            }
            function createRollLinkFromName(elem, iName) {
                if (iName) {
                    $(elem).on("click", () => self.actor.roll(iName));
                }
            }
            function createChatLinkFromName(elem, iName) {
                if (iName) {
                    $(elem).on("click", () => self.actor.getItemByName(iName)?.displayItemSummary(self.actor?.name ?? ""));
                }
            }
            function createDeleteLinkFromName(elem, iName) {
                if (iName) {
                    $(elem).on("click", () => console.log(`${self.actor?.name} Deleting (Embedded) ${iName}`));
                }
            }
            html.find("*[data-action=\"open\"]")
                .each(function addItemOpenEvents() {
                createOpenLinkFromName(this, $(this).attr("data-item-name"));
            });
            html.find("*[data-action=\"roll\"]")
                .each(function addItemOpenEvents() {
                createRollLinkFromName(this, $(this).attr("data-item-name"));
            });
            html.find("*[data-action=\"chat\"]")
                .each(function addItemOpenEvents() {
                createChatLinkFromName(this, $(this).attr("data-item-name"));
            });
            html.find("*[data-action=\"drop\"]")
                .each(function addItemOpenEvents() {
                createDeleteLinkFromName(this, $(this).attr("data-item-name"));
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
}
