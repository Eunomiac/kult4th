export default class K4NPCSheet extends ActorSheet {
    get template(): string;
    getData(): ActorSheet.Data<ActorSheet.Options> | Promise<ActorSheet.Data<ActorSheet.Options>>;
}
