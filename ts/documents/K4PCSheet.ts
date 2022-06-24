import C from "../scripts/constants.js";
import U from "../scripts/utilities.js";
import K4Actor, {K4ActorType} from "./K4Actor.js";
import {K4SheetAnimations, K4SheetAnimations_PC} from "../scripts/animations.js";
import gsap, {GSDevTools} from "gsap/all";


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
			console.log("SHEET HTML OBJECT", html);
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
					hoverTimelines.push([navPanel, K4SheetAnimations_PC.hoverNav(navPanel, html)]);
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
					hoverTimelines.push([this, K4SheetAnimations_PC.hoverTab(this, html)]);
				});

			html.find(".item-button[data-action=\"roll\"]")
				.each(function addItemRollEvents() {
					const iName = $(this).attr("data-item-name");
					if (iName) {
						$(this).on("click", self.actor.getItemByName(iName)?.handleRoll);
					}
				});

			html.find(".item-button[data-action=\"chat\"]")
				.each(function addItemChatEvents() {
					const iName = $(this).attr("data-item-name");
					if (iName) {
						$(this).on("click", () => self.actor.getItemByName(iName)?.sheet?.render(true));
					}
				});


			html.find(".item-button[data-action=\"edit\"]")
				.each(function addItemEditEvents() {
					const iName = $(this).attr("data-item-name");
					if (iName) {
						$(this).on("click", () => self.actor.getItemByName(iName)?.sheet?.render(true));
					}
				});

			html.find(".item-button[data-action=\"drop\"]")
				.each(function addItemDropEvents() {
					const iName = $(this).attr("data-item-name");
					if (iName) {
						$(this).on("click", () => self.actor.getItemByName(iName)?.sheet?.render(true));
					}
				});

			html.find(".basic-move-item, .derived-move-item")
				.each(function addMoveHoverEvents() {
					if (!self.hoverTimeline) {
						self.hoverTimeline = K4SheetAnimations.hoverLineItem(this, html, false);
						self.hoverTimeline.vars.id = "hoverTimeline";
						self.hoverTimelineTarget = this;
					}
					hoverTimelines.push([this, K4SheetAnimations.hoverLineItem(this, html, false)]);
				});

			hoverTimelines.forEach(([target, anim]) => {
				$(target)
					.on("mouseenter", () => anim.reversed(false))
					.on("mouseleave", () => anim.reversed(true));
			});

		});
	}

}