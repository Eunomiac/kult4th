import K4Item, { K4ItemType } from "./K4Item.js";
export default class K4PCSheet extends ActorSheet<K4PCSheet.Options, K4PCSheet.Data<K4PCSheet.Options>> {
    get template(): string;
    getData(): Promise<K4PCSheet.Data<K4PCSheet.Options>>;
    activateListeners(html: any): void;
}
declare namespace K4PCSheet {
    interface Options extends ActorSheet.Options {
    }
    interface Data<Options extends K4PCSheet.Options = K4PCSheet.Options> extends ActorSheet.Data<Options> {
        data: ActorSheet.Data;
        item: any;
        moves: K4Item<K4ItemType.move>[];
    }
}
export {};
