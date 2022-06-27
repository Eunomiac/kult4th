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

	type ActorData = ACTORDATA.ActorData;

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

	interface K4ActorData<Type extends K4ActorType> extends ActorData {
		data: ActorData["data"] & {
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
				willpower: {
					min: int,
					max: int,
					value: int
				},
				fortitude: {
					min: int,
					max: int,
					value: int
				},
				reflexes: {
					min: int,
					max: int,
					value: int
				},
				reason: {
					min: int,
					max: int,
					value: int
				},
				perception: {
					min: int,
					max: int,
					value: int
				},
				coolness: {
					min: int,
					max: int,
					value: int
				},
				violence: {
					min: int,
					max: int,
					value: int
				},
				charisma: {
					min: int,
					max: int,
					value: int
				},
				soul: {
					min: int,
					max: int,
					value: int
				}
			},
			wounds: [],
			stability: {
				min: int,
				max: int,
				value: int
			}
		}
	}

	namespace K4PCSheet {
		export interface Options extends ActorSheet.Options { }

		export interface Data<Options extends K4PCSheet.Options = K4PCSheet.Options> extends ActorSheet.Data<Options> {
			// Embedded Item Categories
			baseMoves: K4Item.Move[],
			derivedMoves: K4Item.Move[];
			advantages: K4Item.Advantage[];
			disadvantages: K4Item.Disadvantage[];
			darksecrets: K4Item.DarkSecret[];
			relations: K4Item.Relation[];
			weapons: K4Item.Weapon[];
			gear: K4Item.Gear[];
			attacks: K4Item.Attack[];

			attributes: Array<{name: Capitalize<Attribute.Any>, key: Attribute.Any, min: number, max: number, value: number}>;

			actorData: ToObjectFalseType<K4Actor<K4ActorType.pc>>
		}
	}
}