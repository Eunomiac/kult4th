// class ItemSheet<
// 	Options extends ItemSheet.Options = ItemSheet.Options,
// 	Data extends object = ItemSheet.Data<Options>
// 	> extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClass<typeof Item>>> {
import K4Item from "./K4Item.js";
import U from "../scripts/utilities.js";
import C from "../scripts/constants.js";
import K4Actor from "./K4Actor.js";

type K4ItemSheetOptions = DocumentSheetOptions & {
	testing: true
};

export default class K4ItemSheet extends ItemSheet {

	static override get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: [C.SYSTEM_ID, "item", "sheet", "dark-on-light"]
		});
	}
	override get template() { return `systems/kult4th/templates/sheets/${this.type}-sheet.hbs` }

	override get item(): K4Item { return super.item }
	get type() { return this.item.data.type }
	get subType() { return this.item.data.data.subType }
	get subItems() { return this.item.data.data.subItemData }
	get subMoves() { return this.item.data.data.subMoveData }
	get attacks() { return this.item.data.data.subAttackData }

	override activateListeners(html: JQuery<HTMLElement>): void {
		super.activateListeners(html);
		const self = this;

		$(() => {
			console.log("ITEM SHEET CONTEXT", {"this": this, self, html});

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
						$(elem).on("click", () => console.log(`${self.actor?.name} Rolling (Embedded) ${iName}`));
					} else {
						$(elem).on("click", () => console.log(`${self.actor?.name} Rolling ${iName}`));
					}
				}
			}

			function createChatLinkFromName(elem: JQuery<HTMLElement>|HTMLElement, iName?: string): void {
				if (iName) {
					if (self.document.isEmbedded) {
						$(elem).on("click", () => console.log(`${self.actor?.name} Chatting (Embedded) ${iName}`));
					} else {
						$(elem).on("click", () => console.log(`${self.actor?.name} Chatting ${iName}`));
					}
				}
			}

			function createDeleteLinkFromName(elem: JQuery<HTMLElement>|HTMLElement, iName?: string): void {
				if (iName) {
					if (self.document.isEmbedded) {
						$(elem).on("click", () => console.log(`${self.actor?.name} Deleting (Embedded) ${iName}`));
					} else {
						$(elem).on("click", () => console.log(`${self.actor?.name} Deleting ${iName}`));
					}
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
		});

		// Apply custom styles to TinyMCE editors
		// const editors = Object.values(this.editors);

		// <div>{{editor content=data.trigger target="data.trigger" button=true owner=owner editable=editable}}</div>
	}
}