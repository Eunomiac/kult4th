import { ActorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';
import K4Actor from '../../../documents/K4Actor';

namespace K4ActorDataComponents {
	export interface Base {
		description: string
	}
}

declare global {
	namespace K4ActorDataSourceData {
		export interface PC {
			description: string,
			archetype: K4Archetype,
			/* -- snip -- */
		}
		export interface NPC { /* -- snip -- */ }
	}

	namespace K4ActorDataSource {
		export interface PC extends ActorData {
			type: K4ActorType.PC,
			data: K4ActorDataSourceData.PC
		}
		export interface NPC extends ActorData {
			type: K4ActorType.NPC,
			data: K4ActorDataSourceData.NPC
		}
		export type Any = PC|NPC;
	}

	interface SourceConfig {
		Actor: K4ActorDataSource.Any
	}
}