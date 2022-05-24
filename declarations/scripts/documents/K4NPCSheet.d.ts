export default class K4NPCSheet extends ActorSheet<ActorSheet.Options, ActorSheet.Data<ActorSheet.Options>> {
    constructor(object: Actor, options?: Partial<ActorSheet.Options> | undefined);
    constructor(args_0: Actor, args_1?: Partial<ActorSheet.Options> | undefined);
    getData(): ActorSheet.Data<ActorSheet.Options> | Promise<ActorSheet.Data<ActorSheet.Options>>;
}
