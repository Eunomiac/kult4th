import K4Item from "./K4Item.js";
import U from "../scripts/utilities.js";
import C from "../scripts/constants.js";
import K4Actor from "./K4Actor.js";

type K4ItemSheetOptions = DocumentSheetOptions & {
	testing: true
};

// const getTriggerAnim = (target: HTMLElement): gsapAnim => gsap.from(target, {
// 	color: "rgb(200,0,0)",
// 	textShadow: "-1px -1px 0 rgba(200, 150, 150, 1), 1px 1px 1px rgba(0, 0, 0, 0.3)",
// 	duration: 25,
// 	delay: 5,
// 	ease: "slow(0.7, 0.7, false)"});

export default class K4ItemSheet extends ItemSheet {

	static override get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: [C.SYSTEM_ID, "item", "sheet", "kult4th-sheet"]
		});
	}
	override get template() { return `systems/kult4th/templates/sheets/${this.type}-sheet.hbs` }
	// override get options() {
	// 	const optionsData = {...super.options};

	// 	return optionsData;
	// }
	override get item(): K4Item { return super.item }
	get type() { return this.item.data.type }
	get subType() { return this.item.data.data.subType }
	get subItems() { return this.item.data.data.subItemData }
	get subMoves() { return this.item.data.data.subMoveData }
	get attacks() { return this.item.data.data.subAttackData }

	constructor(item: K4Item, options?: Partial<DocumentSheetOptions>) {
		options ??= {};
		options.classes = [
			...K4ItemSheet.defaultOptions.classes,
			...(options.classes ?? [])
		];
		switch (item.data.type) {
			case K4ItemType.advantage: {
				options.classes.push("k4-theme-dgold");
				break;
			}
			case K4ItemType.darksecret: {
				options.classes.push("k4-theme-red");
				break;
			}
			case K4ItemType.disadvantage: {
				options.classes.push("k4-theme-dark");
				break;
			}
			default: {
				options.classes.push("k4-theme-white");
				break;
			}
		}
		super(item, options);
	}

	override activateListeners(html: JQuery<HTMLElement>): void {

		const opts = this.options;
		super.activateListeners(html);
		const self = this;

		$(() => {
			U.dbLog("ITEM SHEET CONTEXT", {"this": this, self, html});

			function createOpenLinkFromName(elem: JQuery<HTMLElement>|HTMLElement, iName?: string): void {
				if (iName) {
					if (self.document.isEmbedded) {
						$(elem).on("click", () => self.actor?.getItemByName(iName)?.sheet?.render(true));
					} else {
						$(elem).on("click", () => Array.from(game.items ?? [])
							.find((item) => [K4ItemType.move, K4ItemType.attack].includes(item.type as K4ItemType) && item.name === iName)
							?.sheet?.render(true));
					}
				}
			}

			function createRollLinkFromName(elem: JQuery<HTMLElement>|HTMLElement, iName?: string): void {
				if (iName) {
					if (self.document.isEmbedded) {
						$(elem).on("click", () => U.dbLog(`${self.actor?.name} Rolling (Embedded) ${iName}`));
					} else {
						$(elem).on("click", () => U.dbLog(`${self.actor?.name} Rolling ${iName}`));
					}
				}
			}

			function createChatLinkFromName(elem: JQuery<HTMLElement>|HTMLElement, iName?: string): void {
				if (iName) {
					if (self.document.isEmbedded) {
						$(elem).on("click", () => U.dbLog(`${self.actor?.name} Chatting (Embedded) ${iName}`));
					} else {
						$(elem).on("click", () => U.dbLog(`${self.actor?.name} Chatting ${iName}`));
					}
				}
			}

			function createDeleteLinkFromName(elem: JQuery<HTMLElement>|HTMLElement, iName?: string): void {
				if (iName) {
					if (self.document.isEmbedded) {
						$(elem).on("click", () => U.dbLog(`${self.actor?.name} Deleting (Embedded) ${iName}`));
					} else {
						$(elem).on("click", () => U.dbLog(`${self.actor?.name} Deleting ${iName}`));
					}
				}
			}
			// getTriggerAnim(html.find(".text-trigger")[0]);

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
		});

		// Apply custom styles to TinyMCE editors
		// const editors = Object.values(this.editors);

		// <div>{{editor content=data.trigger target="data.trigger" button=true owner=owner editable=editable}}</div>
	}
}