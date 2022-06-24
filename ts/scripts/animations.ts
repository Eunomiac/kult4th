import C from "./constants.js";
import U from "./utilities.js";

const K4SheetAnimations = {
	hoverLineItem(target: HTMLElement, context: JQuery, isDerivedMove = true): gsapAnim {
		const attribute = $(target).data("attribute");
		const tl = gsap
			.timeline({
				reversed: true
			}).to(
				$(target).find(".item-icon"),
				{
					width: "100%",
					borderRadius: 0,
					duration: 0.75,
					backgroundColor: C.Colors["GOLD +1"],
					ease: "sine"
				}
			).fromTo(
				$(target).find(".item-text"),
				{
					x: 0,
					width: "auto",
					color: C.Colors.GOLD,
					textShadow: 0
				},
				{
					x: -(parseInt(`${gsap.getProperty($(target).find(".item-text")[0], "width")}`)) - 40,
					width: 0,
					color: C.Colors.BLACK,
					textShadow: [
						...new Array(4).fill(`0 0 15px ${C.Colors["GOLD +1"]}`),
						...new Array(6).fill(`0 0 5px ${C.Colors["GOLD +1"]}`),
						...new Array(4).fill(`0 0 2px ${C.Colors["GOLD +1"]}`)
					].join(", "),
					duration: 0.75,
					ease: "back"
				},
				0
			).set(
				$(target).find(".item-text"),
				{opacity: 0},
				0.01
			).to(
				$(target).find(".item-text"),
				{
					opacity: 1,
					duration: 0.75,
					ease: "sine"
				},
				0.02
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
					duration: 0.5,
					ease: "power2.in"
				},
				0.5
			);

		if ((attribute in C.Attributes.Active) || (attribute in C.Attributes.Passive)) {
			tl
				.fromTo(
					context.find(`.subsection.attributes .attribute-box[data-attribute="${attribute}"] video`),
					{
						opacity: 0,
						filter: "sepia(1) blur(20px)"
					},
					{
						opacity: 1,
						filter: "sepia(1) blur(0px)",
						duration: 1,
						ease: "sine",
						onStart() { this.targets()[0].play() }
					},
					0
				);
		}

		return tl;
	}
};

const K4SheetAnimations_PC = {
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
	}
};

const ANIMATIONS = {
};

export {
	K4SheetAnimations,
	K4SheetAnimations_PC
};