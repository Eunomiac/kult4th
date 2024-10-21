import K4Actor, {K4ActorType} from "../documents/K4Actor";
import K4Item, {K4ItemType} from "../documents/K4Item";
import K4ActiveEffect from "../documents/K4ActiveEffect";

type AnyDocument = foundry.abstract.Document.Any;
type EmbeddedCollection<T extends AnyDocument, D extends AnyDocument> = foundry.abstract.EmbeddedCollection<T, D>;

declare global {
  interface K4Actor<Type extends K4ActorType = K4ActorType> {
    get effects(): EmbeddedCollection<K4ActiveEffect & AnyDocument, K4Actor<Type> & AnyDocument>;
  }

  interface K4Item<Type extends K4ItemType = K4ItemType> {
    get effects(): EmbeddedCollection<K4ActiveEffect & AnyDocument, K4Item<Type> & AnyDocument>;
  }

  interface K4NPCSheet {
    object: K4Actor<K4ActorType.npc>;
    actor: K4Actor<K4ActorType.npc>;
  }
}