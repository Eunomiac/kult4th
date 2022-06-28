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

export default class K4ItemSheet<Type extends K4ItemType> extends ItemSheet {

	_actor?: any;
	get $entity(): K4Entity { return this.object ?? this }
	get $sheet(): K4Sheet|false { return (this.$entity.sheet ?? false) as K4Sheet|false }
	get $actor(): K4Actor|false {
		return (this._actor = this._actor
			?? this.actor
			?? (this.$entity.documentName === "Actor" ? this.$entity : false));
	}

	get $id() { return this.$entity.id }
	get $type() { return this.$entity.type }

	get $root() { return this.$entity.data }
	get $data() { return this.$root.data }

	static override get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: [C.SYSTEM_ID, "item", "sheet"]
		});
	}
	override get template() { return `systems/kult4th/templates/sheets/${this.type}-sheet.hbs` }

	override get item(): K4Item<Type> { return super.item as K4Item<Type> }
	get type(): Type { return this.item.type as Type }
	get tData() { return this.item.tData }
	get subType() { return this.tData.subType }
	get subItems() { return this.item.subItemData }
	get subMoves() { return this.item.subMoveData }
	get attacks() { return this.item.subAttackData }

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