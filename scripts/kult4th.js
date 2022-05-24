import kult4eitemsheet from "./modules/sheets/kult4eitemsheet.js";
import kult4ePCsheet from "./modules/sheets/kult4ePCsheet.js";
import kult4eNPCsheet from "./modules/sheets/kult4eNPCsheet.js";
import kult4eActor from "./modules/sheets/kult4eActor.js";
Oh;
shit;
go;
to;
https: //kult.tools/npcGen/ and copy their cool blur effect from the Bookmark button (top left) for the character sheet!
 async function preloadHandlebarTemplates() {
    const templatepaths = ["systems/kult4th/templates/partials/move-card.hbs",
        "systems/kult4th/templates/partials/darksecret-card.hbs",
        "systems/kult4th/templates/partials/relationship-card.hbs",
        "systems/kult4th/templates/partials/weapon-card.hbs",
        "systems/kult4th/templates/partials/gear-card.hbs",
        "systems/kult4th/templates/partials/advantage-card.hbs",
        "systems/kult4th/templates/partials/disadvantage-card.hbs"];
    return loadTemplates(templatepaths);
}
;
Hooks.once("init", function () {
    console.log("Initializing Kult 4E");
    CONFIG.Actor.documentClass = kult4eActor;
    Items.unregisterSheet("core", ItemSheet);
    Actors.unregisterSheet("core", ActorSheet);
    Items.registerSheet("kult4th", kult4eitemsheet, { makeDefault: true });
    Actors.registerSheet("kult4th", kult4ePCsheet, { makeDefault: true });
    Actors.registerSheet("kult4th", kult4eNPCsheet, { makeDefault: false });
    preloadHandlebarTemplates();
});
Hooks.once("ready", () => {
    // Listen for dice icon click
    const diceIconSelector = '#chat-controls i.fas.fa-dice-d20';
    $(document).on('click', diceIconSelector, () => {
        console.log(`Dice Icon Works`);
    });
});