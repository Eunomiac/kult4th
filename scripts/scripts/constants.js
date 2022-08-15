// export {SORTED_DATA} from "./migration/sortedData.js";
// export {UNMIGRATED_DATA, ORIGINAL_MIGRATED_DATA} from "./migration/migrationData.js";
export const ActorTypes = {
    pc: "Player Character",
    npc: "Non-Player Character"
};
export const ItemTypes = {
    move: "Move",
    attack: "Attack",
    advantage: "Advantage",
    disadvantage: "Disadvantage",
    darksecret: "Dark Secret",
    relation: "Relation",
    weapon: "Weapon",
    gear: "Gear"
};
export const Archetypes = {
    Aware: [
        "academic",
        "agent",
        "artist",
        "avenger",
        "broken",
        "careerist",
        "criminal",
        "cursed",
        "deceiver",
        "descendant",
        "detective",
        "doll",
        "drifter",
        "fixer",
        "occultist",
        "prophet",
        "ronin",
        "scientist",
        "seeker",
        "veteran"
    ],
    Enlightened: [
        "abomination",
        "deathMagician",
        "disciple",
        "dreamMagician",
        "madnessMagician",
        "passionMagician",
        "revenant",
        "timeAndSpaceMagician"
    ]
};
export const Attributes = {
    Active: {
        reason: {},
        intuition: {},
        perception: {},
        coolness: {},
        violence: {},
        charisma: {},
        soul: {}
    },
    Passive: {
        fortitude: {},
        willpower: {},
        reflexes: {}
    }
};
export const AttributeButtons = (resolve) => {
    const attrButtons = {};
    [
        "zero" /* K4Attribute.zero */,
        "willpower" /* K4Attribute.willpower */,
        "fortitude" /* K4Attribute.fortitude */,
        "reflexes" /* K4Attribute.reflexes */,
        "reason" /* K4Attribute.reason */,
        "perception" /* K4Attribute.perception */,
        "coolness" /* K4Attribute.coolness */,
        "violence" /* K4Attribute.violence */,
        "charisma" /* K4Attribute.charisma */,
        "soul" /* K4Attribute.soul */
    ].forEach((attr) => {
        attrButtons[attr] = {
            label: `${String(attr).charAt(0).toUpperCase()}${String(attr).slice(1)}`,
            callback: () => resolve({ attribute: attr })
        };
    });
    return attrButtons;
};
export const Colors = {
    "GOLD": "#968C6A",
    "GOLD +2": "#ebdba6",
    "GOLD +1": "#ebdba6",
    "GOLD -1": "#413d2e",
    "GOLD -2": "#413d2e",
    "GOLD -3": "#0b0903",
    "GOLD GLOW": "#ebdba6",
    "RED": "#9B2020",
    "RED +2": "#F03232",
    "RED +1": "#F03232",
    "RED -1": "#460e0e",
    "RED -2": "#0b0000",
    "RED GLOW": "#F03232",
    "WHITE": "#D4D4D4",
    "GREY +2": "#BEBEBD",
    "GREY +1": "#BEBEBD",
    "GREY": "#81817E",
    "GREY -1": "#424241",
    "GREY -2": "#424241",
    "BLACK": "#1E1E1C",
    "BLUE": "#2B558B",
    "BLUE +2": "#4589e0",
    "BLUE +1": "#4589e0",
    "BLUE -1": "#112136",
    "BLUE -2": "#02070c",
    "BLUE GLOW": "#4589e0"
};
export const Ranges = {
    arm: "When you engage an able opponent within arm's reach in close combat,",
    arm_room: "When you engage an able opponent within several steps of you in ranged combat,",
    arm_room_field: "up to a hundred meters away in combat,",
    arm_room_field_horizon: "that you can see at any distance in combat,",
    room: "When you engage an able opponent out of your reach but no farther than a few meters away in ranged combat,",
    room_field: "When you engage an able opponent out of arm's reach, up to a hundred meters away, in ranged combat,",
    room_field_horizon: "When you engage an able opponent out of arm's reach but still visible, however distant, in ranged combat,",
    field: "When you engage an able opponent several to one hundred meters away in ranged combat,",
    field_horizon: "over a hundred meters away in ranged combat,",
    horizon: "at extreme range (over one hundred meters away) in ranged combat,"
};
export const RegExpPatterns = {
    Attributes: [
        ...Object.keys(Attributes.Active),
        ...Object.keys(Attributes.Passive),
        "Attribute"
    ].map((attrStr) => new RegExp(`((?:\\+|\\b)${attrStr.charAt(0).toUpperCase()}${attrStr.slice(1)}\\b)`, "g")),
    BasicPlayerMoves: [
        "\\bAct Under Pressure\\b",
        "\\bAvoid Harm\\b",
        "\\bEndure Injury\\b",
        "\\bEngage in Combat\\b",
        "\\bHelp (Ano|O)ther\\b",
        "\\bHinder (Ano|O)ther\\b",
        "\\bHelp or Hinder (Ano|O)ther\\b",
        "\\bInfluence (Ano|O)ther( PC|NPC)?\\b",
        "\\bInvestigate\\b",
        "\\bKeep It Together\\b",
        "\\bObserve a Situation\\b",
        "\\bRead a Person\\b",
        "\\bSee Through the Illusion\\b"
    ].map((patStr) => new RegExp(`(${patStr})`, "g")),
    Keywords: [
        /[\-+]/g,
        "(\\b|[^ :a-z()]+ )Harm\\b",
        "(\\b|[^ :a-z()]+ )Armor\\b",
        "\\bStability\\b( \\(.?\\d+\\))?",
        "\\bRelation\\b( .?\\d+)?",
        "[^ :a-z()]+ ongoing\\b",
        "\\b(Serious |Critical |\\d+ )?Wounds?\\b",
        "(\\d+\\s+|\\b[Oo]ne\\s+)?\\bExperience"
    ].map((patStr) => new RegExp(`(${patStr})`, "g")),
    GMText: [
        /\b([Tt]he GM (?:may )?makes? a (?:hard |soft )?Move)\b/g,
        /\b([Tt]he GM takes \d+ Hold)\b/g
    ]
};
const C = {
    get game() { return game; },
    SYSTEM_ID: "kult4th",
    SYSTEM_NAME: "Kult: Divinity Lost",
    SYSTEM_FULL_NAME: "Kult: Divinity Lost (4th Edition)",
    TEMPLATE_ROOT: "systems/kult4th/templates",
    awareArchetypes: Archetypes.Aware,
    awareArchetypeAdvantages: {
        academic: ["Academic Network", "Authority", "Elite Education", "Collector", "Data Retrieval", "Expert", "Occult Studies", "Elite Sport (Athletic)", "Elite Sport (Contact)", "Elite Sport (Fencing)"],
        agent: ["Moles", "Burglar", "Analyst", "Explosives Expert", "Tracer", "Quick Thinker", "Field Agent", "Endure Trauma"],
        artist: ["Artistic Talent", "Fascination", "Notorious", "Observant", "Body Awareness", "Enhanced Awareness", "Forbidden Inspiration", "Snake Charmer"],
        avenger: ["MANDATORY:Oath of Revenge", "Animal Speaker", "Instinct", "Enhanced Awareness", "Intimidating", "Survival Instinct", "Code of Honor", "Eye for an Eye", "Rage"],
        broken: ["MANDATORY:Broken", "Street Contacts", "Intuitive", "Daredevil", "Contagious Insanity", "Enhanced Awareness", "Magical Intuition", "Sixth Sense", "Wayfinder"],
        careerist: ["Awe-inspiring", "Influential Friends", "Network of Contacts", "Notorious", "Daredevil", "Puppeteer", "At Any Cost", "Opportunist"],
        criminal: ["Streetwise", "Burglar", "Escape Artist", "Sixth Sense", "Deadly Stare", "Enforcer", "Gang Leader", "Streetfighter"],
        cursed: ["MANDATORY:Condemned", "Occult Studies", "Bound", "Magical Intuition", "Death Drive", "Ruthless", "Desperate", "Sealed fate", "To the Last Breath"],
        deceiver: ["Erotic", "Impostor", "Seducer", "Backstab", "Eye for Detail", "Intuitive", "Grudge", "Manipulative"],
        descendant: ["Influential Friends", "Intuitive", "Occult Library", "Artifact", "Bound", "Enhanced Awareness", "Inner Power", "Watchers"],
        detective: ["Fast Talk", "Interrogator", "Instinct", "Read a Crowd", "Shadow", "Crime Scene Investigator", "Dreamer", "Enhanced Awareness"],
        doll: ["MANDATORY:Object of Desire", "Perpetual Victim", "Backstab", "Ice cold", "Sneak", "Divine", "Magnetic Attraction", "Endure Trauma", "Gritted Teeth"],
        drifter: ["Street Contacts", "Driver", "Improviser", "Character Actor", "Vigilant", "Wanderer", "Artifact", "Enhanced Awareness"],
        fixer: ["Forked Tongue", "Streetwise", "Ace Up the Sleeve", "Backstab", "Boss", "Extortionist", "Sixth Sense", "Occult Library", "Dabbler in the Occult", "Dreamer", "Enhanced Awareness", "Exorcist", "Magical Intuition", "Thirst for Knowledge"],
        prophet: ["Charismatic Aura", "Cult Leader", "Enhanced Awareness", "Exorcist", "Lay on Hands", "Voice of Insanity", "Divine Champion", "Good Samaritan"],
        ronin: ["Weapon Master (Melee)", "Weapon Master (Firearms)", "Chameleon", "Exit Strategy", "Manhunter", "Sixth Sense", "Lightning Fast", "Sniper", "Jaded"],
        scientist: ["Battlefield Medicine", "Inventor", "Scientist", "Enhanced Awareness", "Genius", "Implanted Messages", "Arcane Researcher", "Workaholic"],
        seeker: ["Parkour", "Access the Dark Net", "Keen-eyed", "Hacker", "Prepared", "Enhanced Awareness", "Stubborn", "Endure Trauma"],
        veteran: ["Hunter", "Instinct", "Survivalist", "Voice of Pain", "Martial Arts Expert", "Officer", "Dead shot", "Hardened"]
    },
    enlightenedArchetypes: Archetypes.Enlightened,
    enlightenedArchetypeAdvantages: {
        abomination: ["Dark Vision", "Natural Weapons", "Immunity", "Quick", "Invulnerability", "Regenerate", "Memories of Past Lives", "Unnaturally Strong", "Cannibalism", "Sensitivity", "Hunting Instincts", "Uncontrolled Shapeshifting", "Inhuman Appearance"],
        deathMagician: ["MANDATORY:Perform a Ritual", "MANDATORY:Initiate", "Adept", "Improviser", "A Second Chance", "Journeyman", "Dark Aura", "Master", "Experienced", "Talisman", "MANDATORY:Field of Expertise"],
        disciple: ["Divine Strength", "Opener of Ways", "Experienced", "Summoner", "Manipulate the Illusion", "Templars", "Master of Rites", "Unyielding", "MANDATORY:Bound to a Higher Power"],
        dreamMagician: [],
        madnessMagician: [],
        passionMagician: [],
        revenant: ["Bewitching", "Memories of Past Lives", "Commanding Voice", "Mind Manipulator", "Ethereal", "Telekinesis", "Invulnerability", "Bloodthirst", "Sensitivity", "Controlled by External Force", "Symbol Bondage"],
        timeAndSpaceMagician: []
    },
    ActorTypes, ItemTypes,
    Attributes, AttributeButtons,
    AttrList: [...Object.keys(Attributes.Passive), ...Object.keys(Attributes.Active)],
    Colors,
    Ranges,
    RegExpPatterns
};
Object.assign(C, {
    awareArchetypes: Object.keys(C.awareArchetypeAdvantages).map((key) => `${key.charAt(0).toUpperCase()}${key.slice(1)}`.replace(/([A-Z])/g, " $1").trim()),
    enlightenedArchetypes: Object.keys(C.enlightenedArchetypeAdvantages).map((key) => `${key.charAt(0).toUpperCase()}${key.slice(1)}`.replace(/([A-Z])/g, " $1").trim())
});
export default C;
