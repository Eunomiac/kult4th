import C from "../../scripts/constants";
import K4Actor from "../../documents/K4Actor.js";
import K4Item from "../../documents/K4Item.js";
import K4ActiveEffect from "../../documents/K4ActiveEffect.js";
import "./documents";
import "./scripts";
declare global {

	type K4ActorSheet = K4PCSheet|K4NPCSheet
	type K4Sheet = K4ActorSheet|K4ItemSheet<K4ItemType>
	type K4Entity = K4Actor|K4Item
	type K4Document = K4Entity|K4Sheet
	type K4Constructor = ConstructorOf<K4Document>;

	declare interface Game {
		dice3d: {
			showForRoll: (r: Roll) => Promise<void>
		}
	}

	declare const cqApi: {
		reprocess: () => void,
		reparse: () => void,
		reevaluate: () => void,
		config: Record<string,any>
	}

	interface LenientGlobalVariableTypes {
    game: never;
  }
	interface SourceConfig {
		Actor: K4ActorSourceData.any,
		Item: K4ItemSourceData.any
	}

	interface DataConfig {
		Actor: K4ActorPropertiesData.any,
		Item: K4ItemPropertiesData.any
	}

	interface DocumentClassConfig {
		Actor: typeof K4Actor,
		Item: typeof K4Item,
		ActiveEffect: typeof K4ActiveEffect
	}

}
