// class ItemSheet<
// 	Options extends ItemSheet.Options = ItemSheet.Options,
// 	Data extends object = ItemSheet.Data<Options>
// 	> extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClass<typeof Item>>> {
import K4Item, {K4ItemType} from "./K4Item.js";

export default class K4ItemSheet<Type extends K4ItemType> extends ItemSheet<K4ItemSheet.Options, K4ItemSheet.Data<K4ItemSheet.Options>> {
	override get template() { return `systems/kult4th/templates/sheets/${this.item.data.type}-sheet.hbs` }
}

namespace K4ItemSheet {

	export interface Options extends ItemSheet.Options {

	}

	export interface Data<Options extends K4ItemSheet.Options = K4ItemSheet.Options> extends ItemSheet.Data<Options> { }

}