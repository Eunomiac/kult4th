
export namespace Archetype {
	export type Sleeper = "sleeper";
	export type Custom = "custom";
	export type Aware = typeof Archetypes.Aware[number];
	export type Awakened = typeof Archetypes.Enlightened[number];
}
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
	] as const,
	Enlightened: [
		"abomination",
		"deathMagician",
		"disciple",
		"dreamMagician",
		"madnessMagician",
		"passionMagician",
		"revenant",
		"timeAndSpaceMagician"
	] as const
};

export type ItemType = typeof ItemTypes[number];
export const ItemTypes = [
	"move",
	"attack",
	"advantage",
	"disadvantage",
	"darksecret",
	"weapon",
	"relation",
	"gear"
];

export type AttributeActive = keyof typeof Attributes.Active;
export type AttributePassive = keyof typeof Attributes.Passive;
export type Attribute = AttributeActive | AttributePassive;
export const Attributes = {
	Active: {
		reason: {},
		intuition: {},
		perception: {},
		coolness: {},
		violence: {},
		charisma: {}
	},
	Passive: {
		fortitude: {},
		willpower: {},
		reflexes: {}
	}
} as const;

export type RollAttribute = Attribute | "none" | "-harm" | "armor" | SmallInt;

const C = {
	SYSTEM_ID: "kult4th",
	SYSTEM_NAME: "Kult: Divinity Lost",
	SYSTEM_FULL_NAME: "Kult: Divinity Lost (4th Edition)",
	awareArchetypes: Archetypes.Aware,
	archetypeAdvantages: {
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
	}
};

Object.assign(C, {
	awareArchetypes: Object.keys(C.archetypeAdvantages).map((key) => `${key.charAt(0).toUpperCase()}${key.slice(1)}`.replace(/([A-Z])/g, " $1").trim()),
	enlightenedArchetypes: Object.keys(C.enlightenedArchetypeAdvantages).map((key) => `${key.charAt(0).toUpperCase()}${key.slice(1)}`.replace(/([A-Z])/g, " $1").trim())
});

export default C;