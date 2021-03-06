import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import SVGDATA from "../scripts/svgdata.js";
import K4Actor from "./K4Actor.js";
import gsap, {GSDevTools, MorphSVGPlugin} from "gsap/all";

gsap.registerPlugin(MorphSVGPlugin);

const ANIMATIONS = {
	glitchText(target: HTMLElement, startingGlitchScale = 1): gsapAnim {

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
			skewX() { return 20 * this.glitchScale },
			duration() { return 0.1 * this.glitchScale },
			ease: "power4.inOut"
		})
			.to(".glitch", {duration() { return 0.01 * this.glitchScale },skewX: 0, ease: "power4.inOut"})
			.to(".glitch", {duration() { return 0.01 * this.glitchScale },opacity:0})
			.to(".glitch", {duration() { return 0.01 * this.glitchScale },opacity:1})
			.to(".glitch", {duration() { return 0.01 * this.glitchScale },x() { return -10 * this.glitchScale }})
			.to(".glitch", {duration() { return 0.01 * this.glitchScale },x:0})
			.add("split", 0)
			.to(".top", {duration() { return 0.5 },x() { return -10 * this.glitchScale} ,ease: "power4.inOut"},"split")
			.to(".bottom", {duration() { return 0.5 },x() { return 10 * this.glitchScale}, ease: "power4.inOut"},"split")
			.to(".glitch", {duration() { return 0.08 },className: "+=redShadow"},"split")

			.to("#txt", {duration() { return 0 },scale() { return 1 + (0.05 * (this.glitchScale - 1)) }},"split")
			.to("#txt", {duration() { return 0 },scale:1}, "+=0.02")

			.to(".glitch", {duration() { return 0.08 },className: "-=redShadow"}, "+=0.09")
			.to(".glitch", {className: "+=greenShadow", duration: 0.03},"split")
			.to(".glitch", {className: "-=greenShadow", duration: 0.03},"+=0.01")

			.to(".top", {duration() { return 0.2 },x:0,ease: "power4.inOut"})
			.to(".bottom", {duration() { return 0.2 },x:0,ease: "power4.inOut"})

			.to(".glitch", {duration() { return 0.02 },scaleY() { return 1 + (0.05 * (this.glitchScale - 1))}, ease: "power4.inOut"})
			.to(".glitch", {duration() { return 0.04 },scaleY:1,ease: "power4.inOut"});

		return tl;
	},
	gearGeburahRotate(target: HTMLElement): gsapAnim {
		const outerGear$ = $(target).find(".svg-gear-geburah");
		const centerSaw$ = $(target).find(".svg-gear-geburah-center-saw");
		const centerSawRotate = gsap.timeline({timeScale: 0.5, repeat: -1})
			.to(
				centerSaw$,
				{
					rotation: "-=360",
					duration: 10,
					ease: "none"
				}
			);
		return gsap.timeline({delay: 0.2, repeat: -1, repeatDelay: 2})
			.to(
				outerGear$,
				{
					rotation: "-=20",
					duration: 0.4,
					repeatRefresh: true,
					repeatDelay: 1.6,
					ease: "back",
					repeat: -1
				},
				0
			)
			.fromTo(
				centerSawRotate,
				{
					timeScale: 8
				},
				{
					timeScale: 0.5,
					duration: 2,
					ease: "power2",
					repeatDelay: 0,
					delay: 0.1,
					repeat: -1
				},
				0
			);
	},
	gearBinahRotate(target: HTMLElement): gsapAnim {
		return gsap.to(
			target,
			{
				rotation: "+=10",
				duration: 0.4,
				repeatRefresh: true,
				repeatDelay: 0.8,
				ease: "back",
				repeat: -1
			}
		);
	},
	navFade(target: HTMLElement): gsapAnim {
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
			mainRing: $(target).find(".main-ring")
		};

		console.log({navLens$, profileImg$, profileBg$, closeButton$, minimizeButton$, svgs});
		// @ts-expect-error MorphSVG does indeed accept functions.
		return gsap.timeline({reversed: true})
			.to(target, {
				fill: "#000000",
				scale: 1,
				duration: 1,
				ease: "power2"
			}, 0)
			.to($(target).find(".svg-def"), {
				fill: "#000000",
				duration: 1,
				ease: "sine"
			}, 0)
			.to(U.getSiblings(target), {
				opacity: 0.75,
				filter: "blur(5px)",
				duration: 0.5,
				ease: "back"
			}, 0)
			.to(svgs.mainRing, {
				scale: 1,
				opacity: 1,
				ease: "circ",
				duration: 1,
				strokeWidth: 0,
				stroke: 0
			}, 0)
			.to(svgs.innerMesh, {
				scale: 1,
				ease: "circ",
				duration: 0.75
			}, 0).to(svgs.innerMesh, {
				opacity: 1,
				ease: "circ",
				duration: 0.5
			}, 0.25)
			.to(svgs.outerSpikeContainer, {
				scale: 1,
				duration: 0.5,
				ease: "power2"
			}, 0)
			.to(svgs.outerSpikes, {
				// @ts-expect-error MorphSVG does indeed accept functions.
				morphSVG(i) { return svgs.outerSpikePaths[i] },
				scale: 1,
				duration: 0.5,
				ease: "power2"
			}, 0)
			.to(svgs.innerSpikes, {
				scale: 1,
				duration: 0.5,
				ease: "power2"
			}, 0.25).to(svgs.innerSpikes, {
				opacity: 1,
				duration: 0.25,
				ease: "power2"
			}, 0.35)
			.to(navLens$, {
				rotation: "+=180",
				duration: 1,
				ease: "sine.inOut"
			}, 0).to(navLens$, {
				opacity: 0,
				duration: 0.5,
				ease: "power2"
			}, 0.5)
			.to(buttonContainer$, {
				scale: 1,
				opacity: 1,
				zIndex: 6,
				ease: "power3",
				duration: 0.5
			}, 0.25)
			.to(flare$, {
				scale: 2,
				duration: 0.75,
				ease: "sine"
			}, 0)
			.from([closeButton$, minimizeButton$], {
				opacity: 0,
				zIndex: -2,
				filter: "blur(5px)",
				ease: "sine",
				duration: 0.5
			}, 0).to([closeButton$, minimizeButton$], {
				opacity: 1,
				duration: 0.5
			}, 0)
			.to(profileImg$, {
				opacity: 0,
				duration: 1,
				ease: "power2.out"
			}, 0)
			.to(profileBg$, {
				opacity: 0, // 0.65,
				duration: 1,
				ease: "sine"
			}, 0)
			/* .to(
				svgs.container,
				{
					filter: "drop-shadow(0 0 15px #FF0000)",
					duration: 0.95,
					ease: "power3"
				},
				0.05
			) */;
	},
	hoverNav(target: HTMLElement, context: JQuery): gsapAnim {
		const headerButtons = target.getElementsByClassName("header-button");
		return gsap
			.timeline({
				reversed: true
			}).to(
				target,
				{
					scale: 1.25,
					x: 10,
					y: 20,
					duration: 0.5,
					ease: "back"
				},
				0
			).to(
				U.getSiblings(target),
				{
					opacity: 0.75,
					filter: "blur(5px)",
					duration: 0.5,
					ease: "back"
				},
				0
			).to(
				headerButtons,
				{
					scale: 0.75,
					y: -100,
					duration: 0.5,
					stagger: 0.1,
					ease: "back.out(3)"
					// opacity: 1
				},
				0
			);
	},
	hoverTab(target: HTMLElement, context: JQuery): gsapAnim {
		const tabLabel$ = $(target).find(".nav-tab-label");
		// const tabAnimation$ = $(target).find(".nav-tab-animation");
		const tl = gsap.timeline({reversed: true})
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
			}, 0)/* .fromTo(
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
					backgroundColor: C.Colors["GOLD +1"],
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
						...new Array(4).fill(`0 0 15px ${C.Colors["GOLD +1"]}`),
						...new Array(6).fill(`0 0 5px ${C.Colors["GOLD +1"]}`),
						...new Array(4).fill(`0 0 2px ${C.Colors["GOLD +1"]}`)
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
	}
};

export default class K4PCSheet extends ActorSheet {
	static override get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: [C.SYSTEM_ID, "actor", "sheet", "kult4th-sheet", "k4-theme-dgold"],
			tabs: [
				{navSelector: ".tabs", contentSelector: ".tab-content", initial: "bio"}
			]
		});
	}
	override get template() { return "systems/kult4th/templates/sheets/pc-sheet.hbs" }

	hoverTimeline?: gsapAnim;
	hoverTimelineTarget?: HTMLElement;
	devTools = GSDevTools;

	override async getData() {
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
		/*DEVCODE*/console.log("Final Data", data);/*!DEVCODE*/
		return data;
	}

	override setPosition(posData: Partial<Application.Position>) {
		super.setPosition(posData);
		cqApi.reevaluate();
	}

	override activateListeners(html: JQuery) {
		const ISDEBUGGING = false;

		super.activateListeners(html);
		const self = this;

		$(() => {
			console.log("ACTOR SHEET HTML OBJECT", {html, fullElement: self.element[0]});
			const hoverTimelines: Array<[HTMLElement, gsapAnim]> = [];

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
							$(navPanel).data({isHovered: true});
							hoverTimeline.reversed(false);
						}
					});

					$(document).on("mousemove", (event) => {
						if ($(navPanel).data("isHovered")) {
							if (!document.elementsFromPoint(event.clientX, event.clientY)
								.find((elem) => $(elem).hasClass("nav-panel"))) {
								$(navPanel).data({isHovered: false});
								hoverTimeline.reversed(true);
							}
						}
					});
				});

			$(document).find(".gear-container.gear-binah")
				.each(function initGearRotation() {
					ANIMATIONS.gearBinahRotate(this);
				});
			$(document).find(".gear-container.gear-geburah")
				.each(function initGearRotation() {
					ANIMATIONS.gearGeburahRotate(this);
				});
			html.find(".nav-tab")
				.each(function initNavTab() {
					// gsap.set(this, {xPercent: -50, yPercent: -50, opacity: 1});
					hoverTimelines.push([this, ANIMATIONS.hoverTab(this, html)]);

					$(this).on("click", function switchTab() {
						const tabName = this.getAttribute("data-tab");
						if (tabName) {
							console.log(`Activating Tab ${tabName}`, {tabName, elem: this, tabSelector: `.tab.${tabName}`, foundElem: html.find(`.tab.${tabName}`), html});
							$(html.find(".tab.active")).removeClass("active");
							$(html.find(`.tab.${tabName}`)).addClass("active");
						}
					});
				});

			// $(document).find(".gear-container.gear-nav")
			// 	.each(function initNavHover() {
			// 		console.log("Found Something", this);
			// 		hoverTimelines.push([this, ANIMATIONS.navFade(this)]);
			// 	});

			function createOpenLinkFromName(elem: JQuery<HTMLElement>|HTMLElement, iName?: string): void {
				if (iName) {
					$(elem).on("click", () => self.actor.getItemByName(iName)?.sheet?.render(true));
				}
			}

			function createRollLinkFromName(elem: JQuery<HTMLElement>|HTMLElement, iName?: string): void {
				if (iName) {
					$(elem).on("click", () => self.actor.roll(iName));
				}
			}

			function createChatLinkFromName(elem: JQuery<HTMLElement>|HTMLElement, iName?: string): void {
				if (iName) {
					$(elem).on("click", () => self.actor.getItemByName(iName)?.displayItemSummary(self.actor?.name ?? ""));
				}
			}

			function createDeleteLinkFromName(elem: JQuery<HTMLElement>|HTMLElement, iName?: string): void {
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