
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


