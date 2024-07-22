// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "./utilities.js";
import {K4ItemType} from "../documents/K4Item";
import {InfluenceKeys} from "./svgdata.js";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion


export enum K4Attribute {
  ask = "ask",
  zero = "zero",
  fortitude = "fortitude",
  reflexes = "reflexes",
  willpower = "willpower",
  reason = "reason",
  intuition = "intuition",
  perception = "perception",
  coolness = "coolness",
  violence = "violence",
  charisma = "charisma",
  soul = "soul"
}

export enum Archetype {
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
  veteran = "veteran",
  abomination = "abomination",
  deathMagician = "deathMagician",
  disciple = "disciple",
  dreamMagician = "dreamMagician",
  madnessMagician = "madnessMagician",
  passionMagician = "passionMagician",
  revenant = "revenant",
  timeAndSpaceMagician = "timeAndSpaceMagician",
  sleeper = "sleeper"
}
export enum K4Stability {
  composed = "composed",
  moderate = "moderate",
  serious = "serious",
  critical = "critical",
  broken = "broken"
}
export enum K4Influence {
  archon = "archon",
  deathAngel = "deathAngel"
}
export enum K4ConditionType {
  stability = "stability",
  other = "other"
}
export enum K4WoundType {
  serious = "serious",
  critical = "critical",
  stableserious = "stableserious",
  stablecritical = "stablecritical"
}




export const Archetypes = {
  Asleep: {
    [Archetype.sleeper]: "Sleeper"
  },
  Aware: {
    [Archetype.academic]: "Academic",
    [Archetype.agent]: "Agent",
    [Archetype.artist]: "Artist",
    [Archetype.avenger]: "Avenger",
    [Archetype.broken]: "Broken",
    [Archetype.careerist]: "Careerist",
    [Archetype.criminal]: "Criminal",
    [Archetype.cursed]: "Cursed",
    [Archetype.deceiver]: "Deceiver",
    [Archetype.descendant]: "Descendant",
    [Archetype.detective]: "Detective",
    [Archetype.doll]: "Doll",
    [Archetype.drifter]: "Drifter",
    [Archetype.fixer]: "Fixer",
    [Archetype.occultist]: "Occultist",
    [Archetype.prophet]: "Prophet",
    [Archetype.ronin]: "Ronin",
    [Archetype.scientist]: "Scientist",
    [Archetype.seeker]: "Seeker",
    [Archetype.veteran]: "Veteran"
  },
  Enlightened: {
    [Archetype.abomination]: "Abomination",
    [Archetype.deathMagician]: "Death Magician",
    [Archetype.disciple]: "Disciple",
    [Archetype.dreamMagician]: "Dream Magician",
    [Archetype.madnessMagician]: "Madness Magician",
    [Archetype.passionMagician]: "Passion Magician",
    [Archetype.revenant]: "Revenant",
    [Archetype.timeAndSpaceMagician]: "Time and Space Magician"
  }
} as const;


export const Attributes = {
  Active: {
    [K4Attribute.reason]: {},
    [K4Attribute.intuition]: {},
    [K4Attribute.perception]: {},
    [K4Attribute.coolness]: {},
    [K4Attribute.violence]: {},
    [K4Attribute.charisma]: {},
    [K4Attribute.soul]: {}
  },
  Passive: {
    [K4Attribute.fortitude]: {},
    [K4Attribute.willpower]: {},
    [K4Attribute.reflexes]: {}
  }
} as const;
export const HarmButtons = (resolve: (value: {harm: number}) => void) => {
  const harmButtons: Record<string,Dialog.Button> = {};
  for (let harm = 1; harm <= 5; harm++) {
    harmButtons[harm] = {
      label: `${String(harm)} Harm`,
      callback: () => { resolve({harm}) }
    };
  }
  return harmButtons;
}
export const AttributeButtons = (resolve: (value: {attribute: K4Roll.RollableAttribute}) => void) => {
  const attrButtons: Record<string,Dialog.Button> = {};
  [
    K4Attribute.zero,
    K4Attribute.willpower,
    K4Attribute.fortitude,
    K4Attribute.reflexes,
    K4Attribute.reason,
    K4Attribute.perception,
    K4Attribute.intuition,
    K4Attribute.coolness,
    K4Attribute.violence,
    K4Attribute.charisma,
    K4Attribute.soul
  ].forEach((attr) => {
    attrButtons[attr] = {
      label: U.loc(`trait.${attr}`),
      callback: () => {
        resolve({attribute: attr as K4Roll.RollableAttribute})
      }
    };
  });
  return attrButtons;
};

export const Colors = {
  GOLD: "rgb(150, 140, 106)", // #968c6a
  dGOLD: "rgb(65, 61, 46)", // #413d2e
  bGOLD: "rgb(235, 219, 166)", // #ebdba6
  gGOLD: "rgb(255, 254, 200)", // #fffec8

  RED: "rgb(155, 32, 32)", // #9b2020
  dRED: "rgb(70, 14, 14)", // #460e0e
  bRED: "rgb(240, 50, 50)", // #f03232
  gRED: "rgb(255, 0, 0)", // #ff0000

  BLUE: "rgb(43, 85, 139)", // #2b558b
  dBLUE: "rgb(17, 33, 54)", // #112136
  bBLUE: "rgb(69, 137, 224)", // #4589e0
  gBLUE: "rgb(128, 185, 255)", // #80b9ff

  bWHITE: "rgb(255, 255, 255)", // #ffffff
  WHITE: "rgb(200, 200, 200)", // #c8c8c8
  bGREY: "rgb(177, 177, 177)", // #b1b1b1
  GREY: "rgb(128, 128, 128)", // #808080
  dGREY: "rgb(78, 78, 78)", // #4e4e4e
  BLACK: "rgb(20, 20, 20)", // #141414
  dBLACK: "rgb(0, 0, 0)" // #000000
};

export const ColorFilters = {
  GOLD: "hue-rotate(-32.63deg) saturate(32%) brightness(65%)",
  dGOLD: "hue-rotate(-32.63deg) saturate(32%) brightness(30%)",
  bGOLD: "hue-rotate(-32.63deg) saturate(32%) brightness(105%)",
  gGOLD: "hue-rotate(-32.63deg) saturate(32%) brightness(125%)",

  RED: "hue-rotate(290.37deg) saturate(1620%) brightness(62%)",
  dRED: "hue-rotate(290.37deg) saturate(1620%) brightness(28%)",
  bRED: "hue-rotate(289.67deg) saturate(820%) brightness(95%)",
  gRED: "hue-rotate(290.37deg) saturate(1620%)",

  bWHITE: "saturate(0)",
  WHITE: "hue-rotate(deg) saturate() brightness()",
  bGREY: "hue-rotate(deg) saturate() brightness()",
  GREY: "hue-rotate(deg) saturate() brightness()",
  dGREY: "hue-rotate(deg) saturate() brightness()",
  BLACK: "hue-rotate(deg) saturate() brightness()",
  dBLACK: "hue-rotate(deg) saturate() brightness()"
}
export function getColorName(colorVal: string): KeyOf<typeof Colors> | false {
  if (colorVal in Colors) {
    return colorVal as KeyOf<typeof Colors>;
  }
  colorVal = U.getRGBString(colorVal) ?? "";
  if (colorVal && Object.values(Colors).includes(colorVal)) {
    return U.objFindKey(Colors, ((v: string) => v === colorVal) as testFunc<valFunc>);
  }
  return false;
}
export function getContrastingColor(colorVal: string, contrastLevel = 1 as number, bgShade: "light"|"dark" = "dark") {
  let colorName = getColorName(colorVal);
  if (!colorName) {
    console.error(`Unable to find official contrast for ${colorVal}: Generating one instead.`);
    if (U.isRGBColor(colorVal)) {
      return U.getContrastingColor(colorVal);
    }
    throw new Error(`${colorVal} is not a recognized color name or RGB color value.`);
  }
  const masterColor = colorName.replace(/[a-z]/g, "");
  if (/GOLD|BLUE|RED/.test(colorName)) { // it's a color
    if (!/^[bgd]/.test(colorName)) { // it's a neutral color; refer to bgShade to nudge it brighter/darker
      if (bgShade === "light") {
        colorName = `d${masterColor}` as KeyOf<typeof Colors>;
      } else {
        colorName = `b${masterColor}` as KeyOf<typeof Colors>;
      }
    }
    // now any color value will be a bright/glow/dark shade
    if (/^[bg]/.test(colorName)) { // it's a bright shade
      return [false, Colors[`d${masterColor}` as KeyOf<typeof Colors>], Colors.BLACK, Colors.dBLACK, Colors.dBLACK][contrastLevel];
    } else { // it's a dark shade
      return [false, Colors[`b${masterColor}` as KeyOf<typeof Colors>], Colors[`g${masterColor}` as KeyOf<typeof Colors>], Colors.WHITE, Colors.bWHITE][contrastLevel];
    }
  } else { // it's a grey
    const brightness = U.pInt(colorVal.replace(/^.*?(\d+),.*$/, "$1"));
    if (brightness >= 128) { // it's bright
      return [false, Colors.BLACK, Colors.BLACK, Colors.dBLACK, Colors.dBLACK][contrastLevel];
    } else { // it's dark
      return [false, Colors.WHITE, Colors.WHITE, Colors.bWHITE, Colors.bWHITE][contrastLevel];
    }
  }
}

// export const Ranges = {
//   [AttackRange.arm]: "When you engage an able opponent within arm's reach in close combat,",
//   [AttackRange.arm_room]: "When you engage an able opponent within several steps of you in ranged combat,",
//   [AttackRange.arm_room_field]: "up to a hundred meters away in combat,",
//   [AttackRange.arm_room_field_horizon]: "that you can see at any distance in combat,",
//   [AttackRange.room]: "When you engage an able opponent out of your reach but no farther than a few meters away in ranged combat,",
//   [AttackRange.room_field]: "When you engage an able opponent out of arm's reach, up to a hundred meters away, in ranged combat,",
//   [AttackRange.room_field_horizon]: "When you engage an able opponent out of arm's reach but still visible, however distant, in ranged combat,",
//   [AttackRange.field]: "When you engage an able opponent several to one hundred meters away in ranged combat,",
//   [AttackRange.field_horizon]: "over a hundred meters away in ranged combat,",
//   [AttackRange.horizon]: "at extreme range (over one hundred meters away) in ranged combat,"
// } as const;
export const StabilityConditions: Record<
  string,
  {
    description: string,
    modDef: Record<string, number>
  }
> = {
  angry: {
    description: "You blame someone or something in your vicinity for whatever happened, and may lash out against them or harbor resentment.",
    modDef: {all: -1}
  },
  sad: {
    description: "You feel sorrow or grief over what happened. You might want to seek solitude or the comfort of a loved one.",
    modDef: {all: -1}
  },
  scared: {
    description: "You feel threatened. You instinctively want to retreat from the situation and seek out a hiding spot.",
    modDef: {all: -1}
  },
  "guilt-ridden": {
    description: "You blame yourself for what transpired, and seek forgiveness from those around you.",
    modDef: {all: -1}
  },
  obsessed: {
    description: "You are paradoxically enthralled by whatever initially caused you stress, now finding it attractive and compelling. You may feel compelled to seek it out or to study it intensely.",
    modDef: {all: -1}
  },
  distracted: {
    description: "You are confused and sidetracked by what threatens you. You cannot stop looking at it, and are inattentive to everything else around you. You take −2 to all rolls in situations where being distracted is an obstacle.",
    modDef: {all: -2}
  },
  haunted: {
    description: "The GM gets 1 Hold they can spend later to haunt you with visions, dreams, or create actual encounters related to whatever caused the trauma.",
    modDef: {all: -1}
  }
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
  ].map((patStr: string|RegExp) => patStr instanceof RegExp
    ? patStr
    : new RegExp(`(${patStr})`, "g")),
  Keywords: [
    /([-+])/g,
    "(\\b|[^ :a-z()]+ )Harm\\b",
    "(\\b|[^ :a-z()]+ )Armor\\b",
    "\\bStability\\b( \\(.?\\d+\\))?",
    "\\bRelation\\b( .?\\d+)?",
    "[^ :a-z()]+ ongoing\\b",
    "\\b(Serious |Critical |\\d+ )?Wounds?\\b",
    "(\\d+\\s+|\\b[Oo]ne\\s+)?\\bExperience"
  ].map((patStr: string|RegExp) => patStr instanceof RegExp
    ? patStr
    : new RegExp(`(${patStr})`, "g")),
  GMText: [
    /\b([Tt]he GM (?:may )?makes? a (?:hard |soft )?Move)\b/g,
    /\b([Tt]he GM takes \d+ Hold)\b/g
  ]
};


const C = {
  get game() { return game },
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
  Attributes, AttributeButtons, HarmButtons,
  AttrList: [...Object.keys(Attributes.Passive), ...Object.keys(Attributes.Active)],
  BasicMoves: [
    "Act Under Pressure",
    "Avoid Harm",
    "Endure Injury",
    "Engage in Combat",
    "Help Other",
    "Hinder Other",
    "Influence Other NPC",
    "Influence Other PC",
    "Investigate",
    "Keep It Together",
    "Observe a Situation",
    "Read a Person",
    "See Through the Illusion"
  ],
  Abbreviations: {
    ItemType: {
      [K4ItemType.advantage]: "Av",
      [K4ItemType.disadvantage]: "D",
      [K4ItemType.darksecret]: "DS",
      [K4ItemType.weapon]: "W",
      [K4ItemType.move]: "M",
      [K4ItemType.gear]: "G",
      [K4ItemType.relation]: "R",
      [K4ItemType.gmtracker]: "GM"
    }
  },
  Colors, ColorFilters,
  // Ranges,
  RegExpPatterns,
  imageDefaults: {
    roller: "systems/kult4th/assets/icons/cameron-west.jpg"
  },
  Influences: {
    "Kether": {
      name: "Kether",
      category: K4Influence.archon,
      principle: "Hierarchy",
      img: "systems/kult4th/assets/tarot/major-3-kether.webp",
      keySVG: InfluenceKeys.Kether
    },
    "Chokmah": {
      name: "Chokmah",
      category: K4Influence.archon,
      principle: "Submission",
      img: "systems/kult4th/assets/tarot/major-4-chokmah.webp",
      keySVG: InfluenceKeys.Chokmah
    },
    "Binah": {
      name: "Binah",
      category: K4Influence.archon,
      principle: "Community",
      img: "systems/kult4th/assets/tarot/major-5-binah.webp",
      keySVG: InfluenceKeys.Binah
    },
    "Chesed": {
      name: "Chesed",
      category: K4Influence.archon,
      principle: "Safety",
      img: "systems/kult4th/assets/tarot/major-6-chesed.webp",
      keySVG: InfluenceKeys.Chesed
    },
    "Geburah": {
      name: "Geburah",
      category: K4Influence.archon,
      principle: "Law",
      img: "systems/kult4th/assets/tarot/major-7-geburah.webp",
      keySVG: InfluenceKeys.Geburah
    },
    "Tiphareth": {
      name: "Tiphareth",
      category: K4Influence.archon,
      principle: "Allure",
      img: "systems/kult4th/assets/tarot/major-8-tiphareth.webp",
      keySVG: InfluenceKeys.Tiphareth
    },
    "Netzach": {
      name: "Netzach",
      category: K4Influence.archon,
      principle: "Victory",
      img: "systems/kult4th/assets/tarot/major-9-netzach.webp",
      keySVG: InfluenceKeys.Netzach
    },
    "Hod": {
      name: "Hod",
      category: K4Influence.archon,
      principle: "Honor",
      img: "systems/kult4th/assets/tarot/major-10-hod.webp",
      keySVG: InfluenceKeys.Hod
    },
    "Yesod": {
      name: "Yesod",
      category: K4Influence.archon,
      principle: "Avarice",
      img: "systems/kult4th/assets/tarot/major-11-yesod.webp",
      keySVG: InfluenceKeys.Yesod
    },
    "Malkuth": {
      name: "Malkuth",
      category: K4Influence.archon,
      principle: "Conformity",
      img: "systems/kult4th/assets/tarot/major-12-malkuth.webp",
      keySVG: InfluenceKeys.Malkuth
    },
    "Thaumiel": {
      name: "Thaumiel",
      category: K4Influence.deathAngel,
      principle: "Power",
      img: "systems/kult4th/assets/tarot/major-13-thaumiel.webp",
      keySVG: InfluenceKeys.Thaumiel
    },
    "Chagidiel": {
      name: "Chagidiel",
      category: K4Influence.deathAngel,
      principle: "Abuse",
      img: "systems/kult4th/assets/tarot/major-14-chagidiel.webp",
      keySVG: InfluenceKeys.Chagidiel
    },
    "Sathariel": {
      name: "Sathariel",
      category: K4Influence.deathAngel,
      principle: "Exclusion",
      img: "systems/kult4th/assets/tarot/major-15-sathariel.webp",
      keySVG: InfluenceKeys.Sathariel
    },
    "Gamichicoth": {
      name: "Gamichicoth",
      category: K4Influence.deathAngel,
      principle: "Fear",
      img: "systems/kult4th/assets/tarot/major-16-gamichicoth.webp",
      keySVG: InfluenceKeys.Gamichicoth
    },
    "Golab": {
      name: "Golab",
      category: K4Influence.deathAngel,
      principle: "Torment",
      img: "systems/kult4th/assets/tarot/major-17-golab.webp",
      keySVG: InfluenceKeys.Golab
    },
    "Togarini": {
      name: "Togarini",
      category: K4Influence.deathAngel,
      principle: "Compulsion",
      img: "systems/kult4th/assets/tarot/major-18-togarini.webp",
      keySVG: InfluenceKeys.Togarini
    },
    "Hareb-Serap": {
      name: "Hareb-Serap",
      category: K4Influence.deathAngel,
      principle: "Conflict",
      img: "systems/kult4th/assets/tarot/major-19-hareb-serap.webp",
      keySVG: InfluenceKeys["Hareb-Serap"]
    },
    "Samael": {
      name: "Samael",
      category: K4Influence.deathAngel,
      principle: "Vengeance",
      img: "systems/kult4th/assets/tarot/major-20-samael.webp",
      keySVG: InfluenceKeys.Samael
    },
    "Gamaliel": {
      name: "Gamaliel",
      category: K4Influence.deathAngel,
      principle: "Desire",
      img: "systems/kult4th/assets/tarot/major-21-gamaliel.webp",
      keySVG: InfluenceKeys.Gamaliel
    },
    "Nahemoth": {
      name: "Nahemoth",
      category: K4Influence.deathAngel,
      principle: "Discord",
      img: "systems/kult4th/assets/tarot/major-22-nahemoth.webp",
      keySVG: InfluenceKeys.Nahemoth
    }
  },
  Themes: {
    [K4ItemType.advantage]: "k4-theme-gold",
    [K4ItemType.disadvantage]: "k4-theme-red",
    [K4ItemType.darksecret]: "k4-theme-dark",
    [K4ItemType.relation]: "k4-theme-gold",
    [K4ItemType.weapon]: "k4-theme-gold",
    [K4ItemType.gear]: "k4-theme-gold",
    [K4ItemType.move]: "k4-theme-black",
    [K4ItemType.gmtracker]: "k4-theme-black",
    edge: "k4-theme-blue"
  }
};

Object.assign(C, {
  awareArchetypes: Object.keys(C.awareArchetypeAdvantages).map((key) => `${key.charAt(0).toUpperCase()}${key.slice(1)}`.replace(/([A-Z])/g, " $1").trim()),
  enlightenedArchetypes: Object.keys(C.enlightenedArchetypeAdvantages).map((key) => `${key.charAt(0).toUpperCase()}${key.slice(1)}`.replace(/([A-Z])/g, " $1").trim())
});

export default C;
