export default class K4PCSheet extends ActorSheet<ActorSheet.Options, ActorSheet.Data<ActorSheet.Options>> {
    constructor(object: Actor, options?: Partial<ActorSheet.Options> | undefined);
    constructor(args_0: Actor, args_1?: Partial<ActorSheet.Options> | undefined);
    getData(): Promise<ActorSheet.Data<ActorSheet.Options>>;
    activateListeners(html: any): void;
}
