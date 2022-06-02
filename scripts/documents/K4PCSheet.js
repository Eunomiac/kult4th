import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import gsap, { GSDevTools } from "/scripts/greensock/esm/all.js";
const ANIMATIONS = {
    hoverNav(target, context) {
        return gsap
            .timeline({
            reversed: true
        }).to(target, {
            scale: 2,
            x: 50,
            y: 50,
            duration: 0.5,
            ease: "power2"
        }, 0).to(U.getSiblings(target), {
            opacity: 0.75,
            filter: "blur(5px)",
            duration: 0.5,
            ease: "back"
        }, 0);
    },
    hoverMove(target, context, isDerivedMove = true) {
        const attribute = $(target).data("attribute");
        const tl = gsap
            .timeline({
            reversed: true
        }).to($(target).find(".move-icon"), {
            width: "100%",
            borderRadius: 0,
            duration: 0.75,
            backgroundColor: C.Colors["GOLD +1"],
            ease: "sine"
        }).fromTo($(target).find(".move-text"), {
            x: 0,
            width: "auto",
            color: C.Colors.GOLD,
            textShadow: 0
        }, {
            x: -(parseInt(`${gsap.getProperty($(target).find(".move-text")[0], "width")}`)) - 40,
            width: 0,
            color: C.Colors.BLACK,
            textShadow: [
                ...new Array(4).fill(`0 0 15px ${C.Colors["GOLD +1"]}`),
                ...new Array(6).fill(`0 0 5px ${C.Colors["GOLD +1"]}`),
                ...new Array(4).fill(`0 0 2px ${C.Colors["GOLD +1"]}`)
            ].join(", "),
            duration: 0.75,
            ease: "back"
        }, 0).set($(target).find(".move-text"), { opacity: 0 }, 0.01).to($(target).find(".move-text"), {
            opacity: 1,
            duration: 0.75,
            ease: "sine"
        }, 0.02).fromTo($(target).find(".trigger-tooltip"), {
            opacity: 0,
            bottom: 30,
            scale: 1.5
        }, {
            opacity: 1,
            bottom: 30,
            scale: 1,
            duration: 0.5,
            ease: "power2.in"
        }, 0.5);
        if ((attribute in C.Attributes.Active) || (attribute in C.Attributes.Passive)) {
            tl
                .fromTo(context.find(`.subsection.attributes .attribute-box[data-attribute="${attribute}"] video`), {
                opacity: 0,
                filter: "sepia(1) blur(20px)"
            }, {
                opacity: 1,
                filter: "sepia(1) blur(0px)",
                duration: 1,
                ease: "sine",
                onStart() { this.targets()[0].play(); }
            }, 0);
        }
        return tl;
    }
};
export default class K4PCSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [C.SYSTEM_ID, "actor", "sheet"],
            tabs: [
                { navSelector: ".tabButton", contentSelector: ".tab-section", initial: "Front" }
            ]
        });
    }
    get template() { return "systems/kult4th/templates/sheets/pc-sheet.hbs"; }
    get actor() { return super.actor; }
    hoverTimeline;
    hoverTimelineTarget;
    devTools = GSDevTools;
    activateListeners(html) {
        super.activateListeners(html);
        const self = this;
        $(() => {
            const hoverTimelines = [];
            html.find(".nav-panel")
                .each(function initNavPanel() {
                gsap.set(this, { xPercent: -50, yPercent: -50 });
                hoverTimelines.push([this, ANIMATIONS.hoverNav(this, html)]);
            });
            html.find(".basic-move-item")
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
    async getData() {
        const data = await super.getData();
        console.log("Initial Data Pull", data);
        console.log("K4PCSheet -> THIS", this);
        data.actorData = data.data.data;
        data.baseMoves = this.actor.basicMoves;
        data.derivedMoves = this.actor.derivedMoves;
        data.advantages = this.actor.advantages;
        data.disadvantages = this.actor.disadvantages;
        data.darksecrets = this.actor.darkSecrets;
        data.relations = this.actor.relations;
        data.weapons = this.actor.weapons;
        data.gear = this.actor.gear;
        data.attacks = this.actor.attacks;
        data.attributes = this.actor.attributeData;
        /*DEVCODE*/ console.log("Final Data", data); /*!DEVCODE*/
        return data;
    }
}
