import "./K4Actor";
import "./K4Item";
import K4Actor from "../../../documents/K4Actor";
import K4Item from "../../../documents/K4Item";
import K4PCSheet from "../../../documents/K4PCSheet";
import K4NPCSheet from "../../../documents/K4NPCSheet";
import K4ItemSheet from "../../../documents/K4ItemSheet";

declare global {
	type K4Constructor = ConstructorOf<K4Actor<ActorType>> | ConstructorOf<K4Item<ItemType>> | ConstructorOf<K4PCSheet> | ConstructorOf<K4NPCSheet> | ConstructorOf<K4ItemSheet>;
}