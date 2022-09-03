import C from "../../scripts/constants";
import K4Config from "../../scripts/config";
import K4Actor from "../../documents/K4Actor.js";
import K4Item from "../../documents/K4Item.js";
import K4PCSheet from "../../documents/K4PCSheet.js";
import K4NPCSheet from "../../documents/K4NPCSheet.js";
import K4ItemSheet from "../../documents/K4ItemSheet.js";
import K4ActiveEffect from "../../documents/K4ActiveEffect.js";
import SVGDATA from "../../scripts/svgdata.js";
import "./documents";
import "./scripts";
declare global {

	type K4ActorSheet = K4PCSheet|K4NPCSheet;
	type K4Sheet = K4ActorSheet|K4ItemSheet;
	type K4Entity = K4Actor|K4Item;
	type K4Document = K4Entity|K4Sheet;
	type K4Constructor = ConstructorOf<K4Document>;

	interface StripButtonData {
		icon: KeyOf<typeof SVGDATA>,
		dataset: Record<string, string>,
		buttonClasses?: string[],
		tooltip?: string
	}
	interface HoverStripData {
		id: string,
		type: K4ItemType | K4WoundType,
		display: string,
		icon: string,
		stripClasses: string[],
		buttons: StripButtonData[],
		dataset?: Record<string,string>,
		dataTarget?: string,
		placeholder?: string,
		tooltip?: string
	}
	declare interface Game {
		dice3d: {
			showForRoll: (r: Roll) => Promise<void>
		}
	}

	declare interface CONFIG {
		K4: typeof K4Config
	}

	declare const cqApi: {
		reprocess: () => void,
		reparse: () => void,
		reevaluate: () => void,
		config: Record<string,any>
	}

	declare const kLog: {
		display: (...content: [string, ...any[]]) => void,
		log: (...content: [string, ...any[]]) => void,
		error: (...content: [string, ...any[]]) => void,
		hbsLog: (...content: [string, ...any[]]) => void
	};

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
