export {SORTED_DATA} from "./migration/sortedData.js";
export {DATA_JSON} from "./migration/migrationData.js";

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
} as const;
export const Colors = {
	"GOLD": "#958b68",
	"GOLD +2": "#e4ddc3",
	"GOLD +1": "#b9af8f",
	"GOLD -1": "#685f43",
	"GOLD -2": "#362f17",
	"GOLD -3": "#19160b",
	"GOLD GLOW": "#ffd958",
	"RED": "#9a1f1f",
	"RED +2": "#e37070",
	"RED +1": "#ba3e3e",
	"RED -1": "#730606",
	"RED -2": "#490000",
	"RED GLOW": "#ff0000",
	"WHITE": "#ffffff",
	"BLACK": "#000000",
	"BLUE": "#2a548a",
	"BLUE +2": "#688ab5",
	"BLUE +1": "#426899",
	"BLUE -1": "#183f72",
	"BLUE -2": "#082b58",
	"BLUE GLOW": "#3f93ff"
} as const;
export const Ranges = {
	arm: "When you engage an able opponent within arm's reach in close combat,",
	arm_room: "When you engage an able opponent within several steps of you in ranged combat,",
	// "arm_room_field": "up to a hundred meters away in combat,",
	// "arm_room_field_horizon": "that you can see, no matter the distance, in combat,",
	room: "When you engage an able opponent out of your reach but no farther than a few meters away in ranged combat,",
	room_field: "When you engage an able opponent out of arm's reach, up to a hundred meters away, in ranged combat,",
	room_field_horizon: "When you engage an able opponent out of arm's reach but still visible, however distant, in ranged combat,",
	field: "When you engage an able opponent several to one hundred meters away in ranged combat,"
	// "field_horizon": "over a hundred meters away in ranged combat,",
	// "horizon": "at extreme range (over one hundred meters away) in ranged combat,"
} as const;

const C = {
	SYSTEM_ID: "kult4th",
	SYSTEM_NAME: "Kult: Divinity Lost",
	SYSTEM_FULL_NAME: "Kult: Divinity Lost (4th Edition)",
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
	Attributes,
	Colors,
	Ranges
};

Object.assign(C, {
	awareArchetypes: Object.keys(C.awareArchetypeAdvantages).map((key) => `${key.charAt(0).toUpperCase()}${key.slice(1)}`.replace(/([A-Z])/g, " $1").trim()),
	enlightenedArchetypes: Object.keys(C.enlightenedArchetypeAdvantages).map((key) => `${key.charAt(0).toUpperCase()}${key.slice(1)}`.replace(/([A-Z])/g, " $1").trim())
});

export default C;
