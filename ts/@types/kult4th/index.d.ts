import C from "../../scripts/constants";
import K4Actor from "../../documents/K4Actor.js";
import K4Item from "../../documents/K4Item.js";
import "./documents";
import "./scripts";
declare global {

	type K4ActorSheet = K4PCSheet|K4NPCSheet
	type K4Sheet = K4ActorSheet|K4ItemSheet<K4ItemType>
	type K4Entity = K4Actor|K4Item
	type K4Document = K4Entity|K4Sheet
	type K4Constructor = ConstructorOf<K4Document>;
	interface LenientGlobalVariableTypes {
    game: never;
  }
	interface SourceConfig {
		Actor: K4ActorSourceData.any,
		Item: K4ItemSourceData.any
	}

}
declare global {
}