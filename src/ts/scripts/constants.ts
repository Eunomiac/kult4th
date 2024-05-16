// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "./utilities.js";
import {K4ItemType} from "../documents/K4Item";
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
export const AttributeButtons = (resolve: (value: {attribute: K4RollableAttribute}) => void) => {
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
      callback: () => resolve({attribute: attr as K4RollableAttribute})
    };
  });
  return attrButtons;
};

export const Colors = {
  GOLD: "rgb(150, 140, 106)",
  dGOLD: "rgb(65, 61, 46)",
  bGOLD: "rgb(235, 219, 166)",
  gGOLD: "rgb(255, 254, 200)",

  RED: "rgb(155, 32, 32)",
  dRED: "rgb(70, 14, 14)",
  bRED: "rgb(240, 50, 50)",
  gRED: "rgb(255, 0, 0)",

  BLUE: "rgb(43, 85, 139)",
  dBLUE: "rgb(17, 33, 54)",
  bBLUE: "rgb(69, 137, 224)",
  gBLUE: "rgb(128, 185, 255)",

  bWHITE: "rgb(255, 255, 255)",
  WHITE: "rgb(200, 200, 200)",
  bGREY: "rgb(177, 177, 177)",
  GREY: "rgb(128, 128, 128)",
  dGREY: "rgb(78, 78, 78)",
  BLACK: "rgb(20, 20, 20)",
  dBLACK: "rgb(0, 0, 0)"
};
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
export function getContrastingColor(colorVal: string, contrastLevel = 1 as PosInteger, bgShade: "light"|"dark" = "dark") {
  let colorName = getColorName(colorVal);
  if (!colorName) {
    console.error(`Unable to find official contrast for ${colorVal}: Generating one instead.`);
    if (U.isRGBColor(colorVal)) {
      return U.getContrastingColor(colorVal);
    }
    throw new Error(`${colorVal} is not a recognized color name or RGB color value.`);
  }
  const masterColor = colorName.replace(/[a-z]/g, "");
  if (colorName && /GOLD|BLUE|RED/.test(colorName)) { // it's a color
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
} as const;
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
    /[-+]/g,
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
  ActorTypes, ItemTypes,
  Attributes, AttributeButtons,
  AttrList: [...Object.keys(Attributes.Passive), ...Object.keys(Attributes.Active)],
  Colors,
  Ranges,
  RegExpPatterns,
  imageDefaults: {
    roller: "systems/kult4th/assets/icons/cameron-west.jpg"
  },
  Themes: {
    [K4ItemType.advantage]: "k4-theme-gold",
    [K4ItemType.disadvantage]: "k4-theme-red",
    [K4ItemType.darksecret]: "k4-theme-dark",
    [K4ItemType.relation]: "k4-theme-gold",
    [K4ItemType.weapon]: "k4-theme-gold",
    [K4ItemType.gear]: "k4-theme-gold",
    [K4ItemType.move]: "k4-theme-bgold",
    [K4ItemType.attack]: "k4-theme-gold"
  }
};

Object.assign(C, {
  awareArchetypes: Object.keys(C.awareArchetypeAdvantages).map((key) => `${key.charAt(0).toUpperCase()}${key.slice(1)}`.replace(/([A-Z])/g, " $1").trim()),
  enlightenedArchetypes: Object.keys(C.enlightenedArchetypeAdvantages).map((key) => `${key.charAt(0).toUpperCase()}${key.slice(1)}`.replace(/([A-Z])/g, " $1").trim())
});

export default C;
