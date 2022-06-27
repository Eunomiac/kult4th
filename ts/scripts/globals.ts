export {};

enum K4ItemType {
	advantage = "advantage",
	disadvantage = "disadvantage",
	move = "move",
	darksecret = "darksecret",
	relation = "relation",
	gear = "gear",
	attack = "attack",
	weapon = "weapon"
}

declare global {

	interface globalThis {
		K4ItemType: typeof K4ItemType;
	}
}