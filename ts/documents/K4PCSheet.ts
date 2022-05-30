import C from "../scripts/constants.js";
import K4Actor, {ActorType} from "./K4Actor.js";
import gsap from "gsap/all";

export default class K4PCSheet extends ActorSheet<K4PCSheet.Options, K4PCSheet.Data<K4PCSheet.Options>> {

	static override get defaultOptions(): K4PCSheet.Options {
		return mergeObject(super.defaultOptions, {
			classes: [C.SYSTEM_ID, "actor", "sheet"],
			tabs: [
				{navSelector: ".tabButton", contentSelector: ".tab-section", initial: "Front"}
			]
		});
	}
	override get template() { return "systems/kult4th/templates/sheets/pc-sheet.hbs" }

	override get actor() { return super.actor as K4Actor<ActorType.pc> }

	override activateListeners(html: JQuery) {
		$(() => {
			html.find("video").each(function playVideo() { this.play() });

			html.find(".nav-panel").each(function initNavPanelPos() { gsap.set(this, {xPercent: -50, yPercent: -50})});

			html.find(".basic-move-item")
				.each(function addMoveHoverEvents() {
					const [icon] = $(this).find(".move-icon");
					const [img] = $(this).find("img");
					const moveButtons = Array.from($(this).find(".move-button"));
					const [name] = $(this).find(".move-name");
					const [text] = $(this).find(".move-text");
					const [tooltip] = $(this).find(".trigger-tooltip");
					const textWidth = parseInt(`${gsap.getProperty(text, "width")}`);
					const attribute = $(this).data("attribute");
					const tl = gsap.timeline({reversed: true})
						.to(icon, {
							width: "100%",
							borderRadius: 0,
							duration: 0.75,
							backgroundColor: "#f2eecb",
							ease: "sine"
						})
						.fromTo(text, {
							x: 0,
							width: "auto",
							color: "#9b8d68",
							textShadow: 0
						}, {
							x: -textWidth - 40,
							width: 0,
							color: "black",
							textShadow: [
								...new Array(4).fill("0 0 15px var(--gold-bright)"),
								...new Array(6).fill("0 0 5px var(--gold-bright)"),
								...new Array(4).fill("0 0 2px var(--gold-bright)")
							].join(", "),
							duration: 0.75,
							ease: "back"
						}, 0)
						.set(text, {opacity: 0}, 0.01)
						.to(text, {
							opacity: 1,
							duration: 0.75,
							ease: "sine"
						}, 0.02)
						.fromTo(tooltip, {
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
						const [video] = html.find(`.subsection.attributes .attribute-box[data-attribute="${attribute}"] video`);
						tl.fromTo(video, {
							opacity: 0,
							scale: 0.5
						}, {
							onStart() { this.target.play() },
							opacity: 1,
							scale: 1,
							duration: 1,
							ease: "sine"
						}, 0);
					}
					$(this).on("mouseenter", () => tl.reversed(false)).on("mouseleave", () => tl.reversed(true));
				});
		});
	}

	override async getData() {
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
		/*DEVCODE*/console.log("Final Data", data);/*!DEVCODE*/
		return data;
	}

}