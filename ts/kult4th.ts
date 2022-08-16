import K4Actor from "./documents/K4Actor.js";
import K4Item from "./documents/K4Item.js";
import K4ItemSheet from "./documents/K4ItemSheet.js";
import K4PCSheet from "./documents/K4PCSheet.js";
import K4NPCSheet from "./documents/K4NPCSheet.js";
import K4ActiveEffect from "./documents/K4ActiveEffect.js";
import C from "./scripts/constants.js";
import U from "./scripts/utilities.js";
import {formatStringForKult, HandlebarHelpers} from "./scripts/helpers.js";
import registerSettings, {initTinyMCEStyles, initCanvasStyles} from "./scripts/settings.js";

// ts-expect-error Just until I get the compendium data migrated
// import BUILD_ITEM_DATA, {EXTRACT_ALL_ITEMS, INTERMEDIATE_MIGRATE_DATA, CHECK_DATA_JSON} from "../scripts/jsonImport.mjs";
// import MIGRATE_ITEM_DATA, {ItemMigrationData, cleanData, toDict, GROUPED_DATA} from "../kult4eoverrides/migratorts";
import {resetItems} from "./scripts/migratedData.js";
import gsap, {MorphSVGPlugin} from "gsap/all";
import K4ChatMessage from "./documents/K4ChatMessage.js";

gsap.registerPlugin(MorphSVGPlugin);

Hooks.once("init", async () => {
	console.log(U.loc("kult4th.system.prompts.systemInit"));

	registerSettings();
	initCanvasStyles();
	initTinyMCEStyles();

	CONFIG.Actor.documentClass = K4Actor;
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("kult4th", K4PCSheet, {makeDefault: true});
	Actors.registerSheet("kult4th", K4NPCSheet, {makeDefault: false});

	CONFIG.Item.documentClass = K4Item;
	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("kult4th", K4ItemSheet, {makeDefault: true});

	CONFIG.ActiveEffect.documentClass = K4ActiveEffect;

	CONFIG.ChatMessage.documentClass = K4ChatMessage;
	CONFIG.ChatMessage.template = U.getTemplatePath("sidebar", "chat-message");

	loadTemplates([
		...U.getTemplatePath("globals", [
			"svg-defs",
			"color-defs"
		]),
		...U.getTemplatePath("sheets", [
			"pc-sheet",
			"npc-sheet",
			"move-sheet",
			"advantage-sheet",
			"disadvantage-sheet",
			"darksecret-sheet",
			"weapon-sheet",
			"relation-sheet",
			"gear-sheet"
		]),
		...U.getTemplatePath("components", [
			"form-header",
			"hover-strip",
			"hover-strip-editable",
			"item-list",
			"rules-block",
			"roll-result",
			"attribute-box",
			"svg",
			"nav-frame",
			"toggle-box"
		]),
		...U.getTemplatePath("partials", [
			"basic-move-card",
			"derived-move-card",
			"attack-card",
			"advantage-card",
			"disadvantage-card",
			"dark-secret-card",
			"relation-card",
			"derived-item-summary"
		]),
		...U.getTemplatePath("sidebar", [
			"chat-message",
			"roll-result"
		]),
		...U.getTemplatePath("dialog", [
			"ask-for-attribute"
		])
	]);

	// #region ████████ STYLING: Create Style Definitions for SVG Files & Color Palette ████████ ~
	const svgDefTemplate = await getTemplate(U.getTemplatePath("globals", "svg-defs"));
	type SVGGradientStop = {
		offset: int,
		color: string,
		opacity: float
	};
	type SVGGradientDef = {
		id: string,
		x: [int, int],
		y: [int, int],
		stops: Array<SVGGradientStop|string>
	};
	const svgDefs: Record<string,Array<Partial<SVGGradientDef>>> = {
		linearGradients: Object.values(U.objMap(
			{
				[K4ItemType.advantage]: {
					fill: {
						stops: [C.Colors["GOLD +1"], C.Colors["GOLD -1"]]
					},
					stroke: {
						stops: [C.Colors.GOLD, C.Colors["GOLD -2"]]
					}
				},
				[K4ItemType.attack]: {
					fill: {
						stops: [C.Colors["RED +1"], C.Colors["RED -1"]]
					},
					stroke: {
						stops: [C.Colors.RED, C.Colors["RED -2"]]
					}
				},
				[K4ItemType.darksecret]: {
					fill: {
						stops: [C.Colors["RED -1"], C.Colors["RED -2"]]
					},
					stroke: {
						stops: [C.Colors["RED +1"], C.Colors.RED]
					}
				},
				[K4ItemType.disadvantage]: {
					fill: {
						stops: [C.Colors.GREY, C.Colors.BLACK]
					},
					stroke: {
						stops: [C.Colors.WHITE, C.Colors["GREY +1"]]
					}
				},
				// [K4ItemType.gear]: {
				// 	fill: {
				// 		stops: [C.Colors["GOLD +1"], C.Colors["GOLD -1"]]
				// 	},
				// 	stroke: {
				// 		stops: [C.Colors.GOLD, C.Colors["GOLD -2"]]
				// 	}
				// },
				[K4ItemType.move]: {
					fill: {
						stops: [C.Colors.GOLD, C.Colors["GOLD -1"]]
					},
					stroke: {
						stops: [C.Colors["GOLD +1"], C.Colors["GOLD +1"]]
					}
				},
				// [K4ItemType.relation]: {
				// 	fill: {
				// 		stops: [C.Colors["GOLD +1"], C.Colors["GOLD -1"]]
				// 	},
				// 	stroke: {
				// 		stops: [C.Colors.GOLD, C.Colors["GOLD -2"]]
				// 	}
				// },
				[K4ItemType.weapon]: {
					fill: {
						stops: [C.Colors["RED +1"], C.Colors["RED -1"]]
					},
					stroke: {
						stops: [C.Colors.RED, C.Colors["RED -2"]]
					}
				}
			},
			// @ts-expect-error Damn map function needs to be resolved!
			({fill, stroke}: {fill: Partial<SVGGradientDef>, stroke: Partial<SVGGradientDef>}, iType: K4ItemType) => {
				const data = {
					fill: {
						id: `fill-${iType}`,
						x: [0, 1],
						y: [0, 1],
						...fill ?? {},
						stops: (fill.stops ?? []).map((stop, i, stops) => ({
							offset: U.pInt(100 * (i / (Math.max(stops.length - 1, 0)))),
							color: typeof stop === "string" ? stop : stop.color,
							opacity: 1,
							...(U.isList(stop) ? stop : {})
						})),
						...(typeof fill.stops === "string"
							? {}
							: fill.stops)
					},
					stroke: {
						id: `stroke-${iType}`,
						x: [0, 1],
						y: [0, 1],
						...stroke ?? {},
						stops: (stroke.stops ?? []).map((stop, i, stops) => {
							console.log(`Stroke-${iType}`, {stop, i, stops});
							return {
								offset: U.pInt(100 * (i / (Math.max(stops.length - 1, 0)))),
								color: typeof stop === "string" ? stop : stop.color,
								opacity: 1,
								...(U.isList(stop) ? stop : {})
							};
						}),
						...(typeof stroke.stops === "string"
							? {}
							: stroke.stops)
					}
				};
				console.log(`fill-${iType} DATA`, data);
				return data;
			}
		) as Record<
		K4ItemType,
		{
			fill: Partial<SVGGradientDef>,
			stroke: Partial<SVGGradientDef>
		}
		>).map((defs) => Object.values(defs)).flat()
	};

	console.log("SVG DEFS", svgDefs);

	$(".vtt.game.system-kult4th").append(svgDefTemplate(svgDefs));

	// #endregion ▄▄▄▄▄ SVG DEFS ▄▄▄▄▄

	Object.entries(HandlebarHelpers).forEach(([name, func]) => Handlebars.registerHelper(String(name), func as Handlebars.HelperDelegate));
});

/*DEVCODE*/
Hooks.once("ready", async () => {
	const ACTOR = game.actors?.values().next().value as K4Actor;
	const ITEM = game.items?.values().next().value as K4Item;
	const EMBED = ACTOR.items?.values().next().value as K4Item;
	const ACTORSHEET = ACTOR.sheet as unknown as K4PCSheet;
	const ITEMSHEET = ITEM.sheet as unknown as K4ItemSheet;
	const EMBEDSHEET = EMBED.sheet as unknown as K4ItemSheet;

	Object.assign(globalThis, {
		gsap,
		MorphSVGPlugin,
		U,
		C,
		resetItems,
		formatStringForKult,
		formatForKult: HandlebarHelpers.formatForKult,
		ACTOR, ITEM, EMBED, ACTORSHEET, ITEMSHEET, EMBEDSHEET,
		ENTITIES: [ACTOR, ITEM, EMBED],
		SHEETS: [ACTORSHEET, ITEMSHEET, EMBEDSHEET],
		DOCS: [ACTOR, ITEM, EMBED, ACTORSHEET, ITEMSHEET, EMBEDSHEET]
	});
});
/*!DEVCODE*/