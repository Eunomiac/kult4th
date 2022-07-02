import type EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs.js';
import type {ConfiguredDocumentClass} from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js';
import C from "../../../scripts/constants";

import * as ACTORDATA from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";
import K4Actor from "../../../documents/K4Actor";
import {K4ActorType} from "../../../documents/K4Actor";

import K4PCSheet from '../../../documents/K4PCSheet';
import K4NPCSheet from '../../../documents/K4NPCSheet';

declare global {
	declare const enum K4ActorType {
		pc = "pc",
		npc = "npc"
	}

	declare const enum K4Attribute {
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

	declare const enum K4CharAttribute {
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

	declare const enum K4RollType {
		zero = "zero",
		attribute = "attribute",
		move = "move",
		attack = "attack"
	}

	type K4RollModData = Record<string,number>;

	type K4RollSource = K4ItemSpec<K4ItemType.move|K4ItemType.attack>|K4CharAttribute|K4Attribute.zero;

	type K4RollAttribute = Exclude<K4Attribute,K4Attribute.ask>;
	interface K4RollOptions {
		type: K4RollType|K4ItemType.move|K4ItemType.attack,
		isAssisting?: boolean,
		modifiers?: K4RollModifier[]
	}
	interface K4RollData {
		type: K4RollType,
		source: K4RollSource,
		attrVal: number,
		stabMod: number,
		woundMod: number,
		miscMod: number
	}
	declare const enum K4WoundType {
		serious = "serious",
		critical = "critical"
	}
	interface K4Wound {
		type: K4WoundType,
		description: string,
		isStabilized: boolean
	}
	namespace Archetype {
		export type Any = Sleeper | Custom | Aware | Awakened;
		export type Sleeper = "sleeper";
		export type Custom = "custom";
		export type Aware = typeof C.awareArchetypes[number];
		export type Awakened = typeof C.enlightenedArchetypes[number];
	}
	namespace Attribute {
		export type Any = Active | Passive;
		export type Active = keyof typeof C.Attributes.Active;
		export type Passive = keyof typeof C.Attributes.Passive;
	}
	namespace K4ActorSourceSchema {
		export interface pc {
			archetype: Archetype.Any,
			description: string,
			history: string,
			dramaticHooks: [
				{
					value: string,
					isChecked: boolean
				},
				{
					value: string,
					isChecked: boolean
				}
			],
			attributes: {
				[K4CharAttribute.willpower]: {
					min: int,
					max: int,
					value: int
				},
				[K4CharAttribute.fortitude]: {
					min: int,
					max: int,
					value: int
				},
				[K4CharAttribute.reflexes]: {
					min: int,
					max: int,
					value: int
				},
				[K4CharAttribute.reason]: {
					min: int,
					max: int,
					value: int
				},
				[K4CharAttribute.perception]: {
					min: int,
					max: int,
					value: int
				},
				[K4CharAttribute.coolness]: {
					min: int,
					max: int,
					value: int
				},
				[K4CharAttribute.violence]: {
					min: int,
					max: int,
					value: int
				},
				[K4CharAttribute.charisma]: {
					min: int,
					max: int,
					value: int
				},
				[K4CharAttribute.soul]: {
					min: int,
					max: int,
					value: int
				}
			},
			wounds: K4Wound[],
			modifiers: {
				seriousWounds: K4RollModData[],
				criticalWounds: K4RollModData[],
				seriousAndCriticalWounds: K4RollModData[],
				stability: K4RollModData[]
			},
			stability: {
				min: int,
				max: int,
				value: int
			},
			edges: {
				sourceName: string,
				value: posInt
			}
		}
		export interface npc extends Pick<pc, description|wounds|penalties> { }
	}

	namespace K4ActorSourceData {
		export interface pc {
			type: K4ActorType.pc,
			data: K4ActorSourceSchema.pc
		}
		export interface npc {
			type: K4ActorType.npc,
			data: K4ActorSourceSchema.npc
		}

		export type any = pc|npc
	}

	namespace K4ActorPropertiesSchema {
		export interface pc extends K4ActorSourceSchema.pc {
			moves: Array<K4ItemSpec<K4ItemType.move>>;
			basicMoves: Array<K4ItemSpec<K4ItemType.move>>;
			derivedMoves: Array<K4ItemSpec<K4ItemType.move>>;
			attacks: Array<K4ItemSpec<K4ItemType.attack>>;
			advantages: Array<K4ItemSpec<K4ItemType.advantage>>;
			disadvantages: Array<K4ItemSpec<K4ItemType.disadvantage>>;
			darkSecrets: Array<K4ItemSpec<K4ItemType.darksecret>>;
			weapons: Array<K4ItemSpec<K4ItemType.weapon>>;
			gear: Array<K4ItemSpec<K4ItemType.gear>>;
			relations: Array<K4ItemSpec<K4ItemType.relation>>;

			maxWounds: {
				serious: int,
				critical: int
			}
		}
		export interface npc extends K4ActorSourceSchema.npc {
			moves: Array<K4ItemSpec<K4ItemType.move>>;
		}

	}

	namespace K4ActorPropertiesData {
		export interface pc {
			type: K4ActorType.pc,
			data: K4ActorPropertiesSchema.pc
		}
		export interface npc {
			type: K4ActorType.npc,
			data: K4ActorPropertiesSchema.npc
		}

		export type any = pc|npc
	}

	type K4ActorSchema<T extends K4ActorType = K4ActorType> = (T extends K4ActorType.pc ? K4ActorPropertiesSchema.pc
		: T extends K4ActorType.npc ? K4ActorPropertiesSchema.npc
		: never)

	type K4ActorData<T extends K4ActorType = K4ActorType> = (T extends K4ActorType.pc ? K4ActorPropertiesData.pc
		: T extends K4ActorType.npc ? K4ActorPropertiesData.npc
		: never)
}