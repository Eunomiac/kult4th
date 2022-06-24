import C from "../../scripts/constants";
import "./globals";
import "./documents";

declare global {
	// #region ████████ ENUMS: Assembling Enums ████████ ~

	// #region ░░░░░░░[ACTORS]░░░░ Enumerated Actor Types & Qualities ░░░░░░░ ~
	enum K4ActorType {
		PC = "PC",
		NPC = "NPC"
	}

	// #region ====== Attributes ====== ~
	enum K4ActiveAttribute {
		reason = "reason",
		intuition = "intuition",
		perception = "perception",
		coolness = "coolness",
		violence = "violence",
		charisma = "charisma",
		soul = "soul"
	}

	enum K4PassiveAttribute {
		fortitude = "fortitude",
		reflexes = "reflexes",
		willpower = "willpower",
	}

	enum K4OtherAttributeEntry {
		ask = "ask",
		zero = "0"
	}

	enum K4NPCAttribute {
		combat = "combat",
		influence = "influence",
		magic = "magic",
		harm = "harm"
	}

	export const K4Attribute = { ...K4ActiveAttribute, ...K4PassiveAttribute }
	export type K4Attribute = typeof K4Attribute;

	export const K4AttributeValue = { ...K4Attribute, ...K4OtherAttributeEntry }
	export type K4AttributeValue = typeof K4AttributeValue;

	export const K4NPCAttributeValue = { ...K4NPCAttribute, ...K4OtherAttributeEntry }
	export type K4NPCAttributeValue = typeof K4NPCAttributeValue;
	// #endregion ___ Attributes ___
	// #region ====== Archetypes ====== ~
	enum K4AwareArchetype {
		academic = "academic",
		agent = "agent",
		artist = "artist",
		avenger = "avenger",
		broken = "broken",
		careerist = "careerist",
		criminal = "criminal",
		cursed = "cursed",
		deceiver = "deceiver",
		descendant = "descendant",
		detective = "detective",
		doll = "doll",
		drifter = "drifter",
		fixer = "fixer",
		occultist = "occultist",
		prophet = "prophet",
		ronin = "ronin",
		scientist = "scientist",
		seeker = "seeker",
		sleeper = "sleeper",
		veteran = "veteran"
	}

	enum K4EnlightenedArchetype {
		abomination = "abomination",
		deathMagician = "deathMagician",
		disciple = "disciple",
		dreamMagician = "dreamMagician",
		madnessMagician = "madnessMagician",
		passionMagician = "passionMagician",
		revenant = "revenant",
		timeAndSpaceMagician = "timeAndSpaceMagician"
	}

	export const K4Archetype = { ...K4AwareArchetype, ...K4EnlightenedArchetype }
	export type K4Archetype = typeof K4Archetype;
	// #endregion ░░░░[Archetypes]░░░░
	// #endregion ░░░░[ACTORS]░░░░

	// #region ░░░░░░░[ITEMS]░░░░ Enumerated Item Types & Qualities ░░░░░░░ ~
	enum K4ItemType {
		advantage = "advantage",
		disadvantage = "disadvantage",
		move = "move",
		darksecret = "darksecret",
		relation = "relation",
		gear = "gear",
		attack = "attack",
		weapon = "weapon"
	}
	enum K4ItemSubType {
		activeRolled = "active-rolled",
		activeStatic = "active-static",
		passive = "passive"
	}
	enum K4ItemResultType {
		completeSuccess = "completeSuccess",
		partialSuccess = "partialSuccess",
		failure = "failure"
	}

	// #region ====== Weapons ====== ~
	enum K4WeaponClass {
		meleeUnarmed = "meleeUnarmed",
		meleeCrush = "meleeCrush",
		meleeSlash = "meleeSlash",
		meleeStab = "meleeStab",
		firearm = "firearm",
		bomb = "bomb"
	}
	enum K4WeaponSubClass {
		default = "default",
		special = "special",
		sword = "sword",
		rifle = "rifle",
		pistol = "pistol",
		scopedRifle = "scopedRifle"
	}
	enum K4Range {
		arm = "arm",
		room = "room",
		field = "field",
		horizon = "horizon"
	}
	// #endregion ___ Weapons ___
	// #endregion ░░░░[ITEMS]░░░░

	// #region ░░░░░░░[SETTING]░░░░ Enumerated Setting Details ░░░░░░░ ~
	enum K4Dimension {
		elysium = "elysium",
		metropolis = "metropolis",
		inferno = "inferno",
		underworld = "underworld",
		limbo = "limbo",
		gaia = "gaia"
	}

	// #region ====== Influences / Higher Powers ====== ~
	enum K4Archon {
		kether = "kether",
		chokmah = "chokmah",
		binah = "binah",
		chesed = "chesed",
		geburah = "geburah",
		tiphareth = "tiphareth",
		netzach = "netzach",
		hod = "hod",
		yesod = "yesod",
		malkuth = "malkuth"
	}

	enum K4DeathAngel {
		thaumiel = "thaumiel",
		chagidiel = "chagidiel",
		sathariel = "sathariel",
		gamichicoth = "gamichicoth",
		golab = "golab",
		togarini = "togarini",
		harebSerap = "harebSerap",
		samael = "samael",
		gamaliel = "gamaliel",
		nahemoth = "nahemoth"
	}

	enum K4OtherHigherPower {
		childrenOfTheUnderworld = "childrenOfTheUnderworld",
		sheWhoWaitsBelow = "sheWhoWaitsBelow",
		theDreamPrinces = "theDreamPrinces",
		gaiaTheLivingEarth = "gaiaTheLivingEarth"
	}

	export const K4HigherPower = { ...K4Archon, ...K4DeathAngel, ...K4OtherHigherPower }
	export type K4HigherPower = typeof K4HigherPower;
	// #endregion ___ Influences / Higher Powers ___
	// #endregion ░░░░[SETTING]░░░░

	// #endregion ▄▄▄▄▄ ENUMS ▄▄▄▄▄
}