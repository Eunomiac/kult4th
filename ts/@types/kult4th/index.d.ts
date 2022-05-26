import * as EMBEDDED_COLLECTION from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs";
import * as ACTORDATA from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";
import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs.js';
import * as ITEMDATA from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import K4Item from '../../../declarations/scripts/documents/K4Item';
import { K4ItemType } from "../../documents/K4Item";
import { ConfiguredDocumentClass } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js';
import K4Actor from "../../documents/K4Actor";
import K4PCSheet from '../../documents/K4PCSheet';
import K4NPCSheet from '../../documents/K4NPCSheet';
import K4ItemSheet from '../../documents/K4ItemSheet';

declare global {
	type SmallInt = -10 | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

	type K4Constructor = ConstructorOf<K4Actor> | ConstructorOf<K4Item<K4ItemType>> | ConstructorOf<K4PCSheet> | ConstructorOf<K4NPCSheet> | ConstructorOf<K4ItemSheet>;

	type ActorData = ACTORDATA.ActorData;
	type ItemData = ITEMDATA.ItemData;

	namespace K4Item {
		export type Any = ConfiguredDocumentClass<K4Item<K4ItemType>>;
		export type Move = ConfiguredDocumentClass<K4Item<K4ItemType.move>>;
		export type Attack = ConfiguredDocumentClass<K4Item<K4ItemType.attack>>;
		export type Advantage = ConfiguredDocumentClass<K4Item<K4ItemType.advantage>>;
		export type Disadvantage = ConfiguredDocumentClass<K4Item<K4ItemType.disadvantage>>;
		export type DarkSecret = ConfiguredDocumentClass<K4Item<K4ItemType.darksecret>>;
		export type Weapon = ConfiguredDocumentClass<K4Item<K4ItemType.weapon>>;
		export type Relation = ConfiguredDocumentClass<K4Item<K4ItemType.relation>>;
		export type Gear = ConfiguredDocumentClass<K4Item<K4ItemType.gear>>;
	}

	namespace K4Collection {
		export type Item = EmbeddedCollection<K4Item.Any, ActorData>;
		export type Move = EmbeddedCollection<K4Item.Move, ActorData>;
		export type Attack = EmbeddedCollection<K4Item.Attack, ActorData>;
		export type Advantage = EmbeddedCollection<K4Item.Advantage, ActorData>;
		export type Disadvantage = EmbeddedCollection<K4Item.Disadvantage, ActorData>;
		export type DarkSecret = EmbeddedCollection<K4Item.DarkSecret, ActorData>;
		export type Weapon = EmbeddedCollection<K4Item.Weapon, ActorData>;
		export type Relation = EmbeddedCollection<K4Item.Relation, ActorData>;
		export type Gear = EmbeddedCollection<K4Item.Gear, ActorData>;
	}
}