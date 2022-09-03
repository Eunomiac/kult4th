import K4Config from "./scripts/config.js";
import K4Actor from "./documents/K4Actor.js";
import K4Item from "./documents/K4Item.js";
import K4ItemSheet from "./documents/K4ItemSheet.js";
import K4PCSheet from "./documents/K4PCSheet.js";
import K4NPCSheet from "./documents/K4NPCSheet.js";
import K4ActiveEffect from "./documents/K4ActiveEffect.js";
import C, {getContrastingColor} from "./scripts/constants.js";
import U from "./scripts/utilities.js";
import {formatStringForKult, registerHandlebarHelpers} from "./scripts/helpers.js";
import registerSettings, {initTinyMCEStyles, initCanvasStyles} from "./scripts/settings.js";
import registerDebugger from "./scripts/logger.js";

// ts-expect-error Just until I get the compendium data migrated
// import BUILD_ITEM_DATA, {EXTRACT_ALL_ITEMS, INTERMEDIATE_MIGRATE_DATA, CHECK_DATA_JSON} from "../scripts/jsonImport.mjs";
// import MIGRATE_ITEM_DATA, {ItemMigrationData, cleanData, toDict, GROUPED_DATA} from "../kult4eoverrides/migratorts";
import resetItems from "./scripts/migratedData.js";
import gsap, {MorphSVGPlugin} from "gsap/all";
import K4ChatMessage from "./documents/K4ChatMessage.js";

registerDebugger();
gsap.registerPlugin(MorphSVGPlugin);

Hooks.once("init", async () => {
	registerSettings();
	kLog.display("Initializing 'Kult: Divinity Lost 4th Edition' for Foundry VTT", 0);

	CONFIG.K4 = K4Config;
	registerHandlebarHelpers();

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

	preloadTemplates();

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
	/*
<defs>
		<linearGradient id="fill-advantage" x1="0" x2="1" y1="0" y2="1">
			<stop offset="0%" stop-color="rgb(235, 219, 166)" stop-opacity="1"></stop>
			<stop offset="100%" stop-color="rgb(65, 61, 46)" stop-opacity="1"></stop>
		</linearGradient>
		<linearGradient id="stroke-advantage" x1="0" x2="1" y1="0" y2="1">
			<stop offset="0%" stop-color="rgb(150, 140, 106)" stop-opacity="1"></stop>
			<stop offset="100%" stop-color="rgb(65, 61, 46)" stop-opacity="1"></stop>
		</linearGradient>
		<linearGradient id="fill-attack" x1="0" x2="1" y1="0" y2="1">
			<stop offset="0%" stop-color="rgb(240, 50, 50)" stop-opacity="1"></stop>
			<stop offset="100%" stop-color="rgb(70, 14, 14)" stop-opacity="1"></stop>
		</linearGradient>
		<linearGradient id="stroke-attack" x1="0" x2="1" y1="0" y2="1">
			<stop offset="0%" stop-color="rgb(155, 32, 32)" stop-opacity="1"></stop>
			<stop offset="100%" stop-color="rgb(70, 14, 14)" stop-opacity="1"></stop>
		</linearGradient>
		<linearGradient id="fill-darksecret" x1="0" x2="1" y1="0" y2="1">
			<stop offset="0%" stop-color="rgb(70, 14, 14)" stop-opacity="1"></stop>
			<stop offset="100%" stop-color="rgb(70, 14, 14)" stop-opacity="1"></stop>
		</linearGradient>
		<linearGradient id="stroke-darksecret" x1="0" x2="1" y1="0" y2="1">
			<stop offset="0%" stop-color="rgb(240, 50, 50)" stop-opacity="1"></stop>
			<stop offset="100%" stop-color="rgb(155, 32, 32)" stop-opacity="1"></stop>
		</linearGradient>
		<linearGradient id="fill-disadvantage" x1="0" x2="1" y1="0" y2="1">
			<stop offset="0%" stop-color="rgb(128, 128, 128)" stop-opacity="1"></stop>
			<stop offset="100%" stop-color="rgb(29, 29, 29)" stop-opacity="1"></stop>
		</linearGradient>
		<linearGradient id="stroke-disadvantage" x1="0" x2="1" y1="0" y2="1">
			<stop offset="0%" stop-color="rgb(226, 226, 226)" stop-opacity="1"></stop>
			<stop offset="100%" stop-color="rgb(177, 177, 177)" stop-opacity="1"></stop>
		</linearGradient>
		<linearGradient id="fill-move" x1="0" x2="1" y1="0" y2="1">
			<stop offset="0%" stop-color="rgb(150, 140, 106)" stop-opacity="1"></stop>
			<stop offset="100%" stop-color="rgb(65, 61, 46)" stop-opacity="1"></stop>
		</linearGradient>
		<linearGradient id="stroke-move" x1="0" x2="1" y1="0" y2="1">
			<stop offset="0%" stop-color="rgb(235, 219, 166)" stop-opacity="1"></stop>
			<stop offset="100%" stop-color="rgb(235, 219, 166)" stop-opacity="1"></stop>
		</linearGradient>
		<linearGradient id="fill-weapon" x1="0" x2="1" y1="0" y2="1">
			<stop offset="0%" stop-color="rgb(240, 50, 50)" stop-opacity="1"></stop>
			<stop offset="100%" stop-color="rgb(70, 14, 14)" stop-opacity="1"></stop>
		</linearGradient>
		<linearGradient id="stroke-weapon" x1="0" x2="1" y1="0" y2="1">
			<stop offset="0%" stop-color="rgb(155, 32, 32)" stop-opacity="1"></stop>
			<stop offset="100%" stop-color="rgb(70, 14, 14)" stop-opacity="1"></stop>
		</linearGradient>
	</defs>
	*/


	const svgDefs: Record<string,Array<Partial<SVGGradientDef>>> = {
		linearGradients: Object.values(U.objMap(
			{
				[K4ItemType.advantage]: {
					fill: {
						stops: [C.Colors.bGOLD, C.Colors.dGOLD]
					},
					stroke: {
						stops: [C.Colors.GOLD, C.Colors.dGOLD]
					}
				},
				[K4ItemType.attack]: {
					fill: {
						stops: [C.Colors.bRED, C.Colors.dRED]
					},
					stroke: {
						stops: [C.Colors.RED, C.Colors.dRED]
					}
				},
				[K4ItemType.darksecret]: {
					fill: {
						stops: [C.Colors.dRED, C.Colors.dRED]
					},
					stroke: {
						stops: [C.Colors.bRED, C.Colors.RED]
					}
				},
				[K4ItemType.disadvantage]: {
					fill: {
						stops: [C.Colors.GREY, C.Colors.BLACK]
					},
					stroke: {
						stops: [C.Colors.WHITE, C.Colors.bGREY]
					}
				},
				// [K4ItemType.gear]: {
				// 	fill: {
				// 		stops: [C.Colors["bGOLD"], C.Colors["dGOLD"]]
				// 	},
				// 	stroke: {
				// 		stops: [C.Colors.GOLD, C.Colors["dGOLD"]]
				// 	}
				// },
				[K4ItemType.move]: {
					fill: {
						stops: [C.Colors.GOLD, C.Colors.dGOLD]
					},
					stroke: {
						stops: [C.Colors.bGOLD, C.Colors.bGOLD]
					}
				},
				// [K4ItemType.relation]: {
				// 	fill: {
				// 		stops: [C.Colors["bGOLD"], C.Colors["dGOLD"]]
				// 	},
				// 	stroke: {
				// 		stops: [C.Colors.GOLD, C.Colors["dGOLD"]]
				// 	}
				// },
				[K4ItemType.weapon]: {
					fill: {
						stops: [C.Colors.bRED, C.Colors.dRED]
					},
					stroke: {
						stops: [C.Colors.RED, C.Colors.dRED]
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
							// kLog.log(`Stroke-${iType}`, {stop, i, stops});
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
				// kLog.log(`fill-${iType} DATA`, data);
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
	// kLog.log("SVG DEFS", svgDefs);
	$(".vtt.game.system-kult4th").prepend(svgDefTemplate(svgDefs));

	const colorDefTemplate = await getTemplate(U.getTemplatePath("globals", "color-defs"));
	$(".vtt.game.system-kult4th").prepend(colorDefTemplate({colors: C.Colors}));
	// #endregion ▄▄▄▄▄ STYLING ▄▄▄▄▄
});


Hooks.once("ready", async () => {
	initCanvasStyles();
	initTinyMCEStyles();

	/*DEVCODE*/
	const ACTOR = game.actors?.values().next().value as K4Actor;
	const ITEM = game.items?.values().next().value as K4Item;
	const EMBED = ACTOR.items?.values().next().value as K4Item;
	const ACTORSHEET = ACTOR?.sheet as unknown as K4PCSheet;
	const ITEMSHEET = ITEM?.sheet as unknown as K4ItemSheet;
	const EMBEDSHEET = EMBED?.sheet as unknown as K4ItemSheet;

	Object.assign(globalThis, {
		gsap,
		MorphSVGPlugin,
		U,
		C,
		resetItems,
		getContrastingColor,
		formatStringForKult,
		ACTOR, ITEM, EMBED, ACTORSHEET, ITEMSHEET, EMBEDSHEET,
		ENTITIES: [ACTOR, ITEM, EMBED],
		SHEETS: [ACTORSHEET, ITEMSHEET, EMBEDSHEET],
		DOCS: [ACTOR, ITEM, EMBED, ACTORSHEET, ITEMSHEET, EMBEDSHEET]
	});
	/*!DEVCODE*/
});

async function preloadTemplates() {
	const templatePaths = [
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
			"pc-header",
			"pc-nav-menu",
			"svg",
			"toggle-box"
		]),
		...U.getTemplatePath("partials", [
			"derived-item-summary",
			"derived-move",
			"pc-nav-menu-frame"
		]),
		...U.getTemplatePath("sidebar", [
			"chat-message",
			"result-rolled",
			"result-attribute",
			"item-display",
			"result-static"
		]),
		...U.getTemplatePath("dialog", [
			"ask-for-attribute"
		])
	];

	return loadTemplates(templatePaths);
}