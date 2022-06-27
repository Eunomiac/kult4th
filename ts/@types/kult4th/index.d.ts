import C from "../../scripts/constants";
import K4Actor from "../../documents/K4Actor.js";
import K4Item from "../../documents/K4Item.js";
import "./documents";
import "./scripts";
declare global {
	interface LenientGlobalVariableTypes {
    game: never;
  }
	interface SourceConfig {
		Actor: K4ActorSourceData.any,
		Item: K4ItemSourceData.any
	}

}