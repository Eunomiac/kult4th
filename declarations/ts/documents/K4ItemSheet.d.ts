import { K4ItemType } from "./K4Item.js";
export default class K4ItemSheet<Type extends K4ItemType> extends ItemSheet<K4ItemSheet.Options, K4ItemSheet.Data<K4ItemSheet.Options>> {
    get template(): string;
}
declare namespace K4ItemSheet {
    interface Options extends ItemSheet.Options {
    }
    interface Data<Options extends K4ItemSheet.Options = K4ItemSheet.Options> extends ItemSheet.Data<Options> {
    }
}
export {};
