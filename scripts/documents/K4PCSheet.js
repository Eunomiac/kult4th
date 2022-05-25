export default class K4PCSheet extends ActorSheet {
    get template() { return "systems/kult4th/templates/sheets/pc-sheet.hbs"; }
    get actor() { return super.actor; }
    async getData() {
        const data = await super.getData();
        data.actorData = data.data;
        data.baseMoves = this.actor.basicMoves;
        data.derivedMoves = this.actor.derivedMoves;
        data.advantages = this.actor.advantages;
        data.disadvantages = this.actor.disadvantages;
        data.darksecrets = this.actor.darkSecrets;
        data.relations = this.actor.relations;
        data.weapons = this.actor.weapons;
        data.gear = this.actor.gear;
        data.attacks = this.actor.attacks;
        /*DEVCODE*/ console.log(data); /*!DEVCODE*/
        return data;
    }
}
