import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import K4Actor from "./K4Actor.js";
import gsap, {GSDevTools} from "gsap/all";

const ANIMATIONS = {
	hoverNav(target: HTMLElement, context: JQuery): gsapAnim {
		const headerButtons = target.getElementsByClassName("header-button");
		return gsap
			.timeline({
				reversed: true
			}).to(
				target,
				{
					scale: 2,
					x: 50,
					y: 100,
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
			).fromTo(
				headerButtons,
				{
					scale: 0.75,
					y: 100,
					opacity: 0
				},
				{
					scale: 0.75,
					y: 0,
					duration: 0.5,
					stagger: 0.1,
					ease: "back.out(3)",
					opacity: 1
				},
				0
			);
	},
	hoverTab(target: HTMLElement, context: JQuery): gsapAnim {
		return gsap
			.timeline({
				reversed: true
			}).to(
				target,
				{
					scale: 2,
					background: "lime",
					fontSize: 30,
					color: "white",
					duration: 1,
					ease: "power2.in"
				},
				0
			);
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
				$(target).find(".trigger-tooltip"),
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

export default class K4PCSheet extends ActorSheet<K4PCSheet.Options, K4PCSheet.Data<K4PCSheet.Options>> {

	static override get defaultOptions(): K4PCSheet.Options {
		return mergeObject(super.defaultOptions, {
			classes: [C.SYSTEM_ID, "actor", "sheet"],
			tabs: [
				{navSelector: ".tabs", contentSelector: ".tab-content", initial: "front"}
			]
		});
	}
	override get template() { return "systems/kult4th/templates/sheets/pc-sheet.hbs" }

	override get actor() { return super.actor as K4Actor<K4ActorType.pc> }

	hoverTimeline?: gsapAnim;
	hoverTimelineTarget?: HTMLElement;
	devTools = GSDevTools;

	override async getData() {
		const data = await super.getData();
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
		/*DEVCODE*/console.log("Final Data", data);/*!DEVCODE*/
		return data;
	}

	override activateListeners(html: JQuery) {
		super.activateListeners(html);
		const self = this;

		const positionKeys = [
			"maxX",
			"maxY",
			"posX",
			"posY",
			"percentX",
			"percentY",
			"rotX",
			"rotY"
		];

		if (!$("#position-display")[0]) {
			$("body").append([
				"<div id='position-display'>",
				...positionKeys.map((key) => [
					"<div class='position-entry'>",
					`<label>${key}:</label>`,
					`<span id="${key}" class='position-value'></span>`,
					"</div>"
				].join("\n")),
				"</div>"
			].join("\n"));
		}

		const positionDisplays = Object.fromEntries(positionKeys.map((key) => [key, $(`#${key}`)]));

		function updateDisplay(key: KeyOf<typeof positionDisplays>, data: number) {
			positionDisplays[key]?.text(String(U.pFloat(data, 3)));
		}

		$(() => {
			console.log("ACTOR SHEET HTML OBJECT", html);
			const hoverTimelines: Array<[HTMLElement, gsapAnim]> = [];

			html.find(".nav-panel")
				.each(function initNavPanel() {
					const [navPanel] = $(this);
					gsap.set(navPanel, {
						xPercent: -50,
						yPercent: -50,
						transformPerspective: 1000,
						perspective: 600,
						transformStyle: "preserve-3d"
					});
					hoverTimelines.push([navPanel, ANIMATIONS.hoverNav(navPanel, html)]);
					$(navPanel)
						.on("mouseenter", () => $(this).data({isHovered: true}))
						.on("mouseleave", () => $(this).data({isHovered: false}));

					$(document).on("mousemove", (pos) => {
						if ($(navPanel).data("isHovered")) {
							const maxX = $(navPanel).width() ?? 0;
							const maxY = $(navPanel).height() ?? 0;

							updateDisplay("maxX", maxX);
							updateDisplay("maxY", maxY);

							if (!maxX || !maxY) { return }

							const posX = pos.offsetX;
							const posY = pos.offsetY;

							updateDisplay("posX", posX);
							updateDisplay("posY", posY);

							const percentX = (100 / (maxX / posX)) - 50;
							const percentY = (100 / (maxY / posY)) - 50;

							updateDisplay("percentX", percentX);
							updateDisplay("percentY", percentY);

							const maxRotX = 25;
							const maxRotY = 25;

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

						} else {
							gsap.to(navPanel, {
								rotationX: 0,
								rotationY: 0,
								duration: 2,
								ease: "power3.out"
							});
						}
					});
				});

			html.find(".nav-tab")
				.each(function initNavTab() {
					gsap.set(this, {xPercent: -50, yPercent: -50, opacity: 1});
					hoverTimelines.push([this, ANIMATIONS.hoverTab(this, html)]);
				});

			// html.find(".nav-panel .header-button")
			// 	.each(function initHeaderButtons() {
			// 		gsap.set(this, {scale: 2, opacity: 0, y: 100});
			// 	});

			html.find("*[data-action=\"edit\"]")
				.each(function addItemEditEvents() {
					const iName = $(this).attr("data-item-name");
					if (iName) {
						$(this).on("click", () => self.actor.getItemByName(iName)?.sheet?.render(true));
					}
				});

			html.find(".basic-move-item, .derived-move-item")
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