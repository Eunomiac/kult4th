import C from "../scripts/constants.js";
export default class K4PCSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [C.SYSTEM_ID, "actor", "sheet"],
            height: 1000,
            tabs: [
                { navSelector: ".tabButton", contentSelector: ".tab-section", initial: "Front" }
            ],
            width: 800
        });
    }
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
