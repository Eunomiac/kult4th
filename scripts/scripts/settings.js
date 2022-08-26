import C from "./constants.js";
import U from "./utilities.js";
export default function registerSettings() {
    game.settings.register("kult4th", "debug", {
        "name": U.loc("system.settings.debugModeTitle"),
        "hint": U.loc("system.settings.debugModeHint"),
        "scope": "client",
        "config": true,
        "default": 3,
        "type": Number,
        "range": {
            min: 0,
            max: 5,
            step: 1
        },
        "onChange": () => kLog.log(`Logging level set to ${U.getSetting("debug")}`, 0)
    });
    game.settings.register("kult4th", "gears", {
        "name": U.loc("system.settings.displayGearsTitle"),
        "hint": U.loc("system.settings.displayGearsHint"),
        "scope": "client",
        "config": true,
        "default": true,
        "type": Boolean /* ,
        "onChange": () => window.location.reload() */
    });
    game.settings.register("kult4th", "shadows", {
        "name": U.loc("system.settings.displayShadowsTitle"),
        "hint": U.loc("system.settings.displayShadowsHint"),
        "scope": "client",
        "config": true,
        "default": true,
        "type": Boolean /* ,
        "onChange": () => window.location.reload() */
    });
    game.settings.register("kult4th", "blur", {
        "name": U.loc("system.settings.displayBlurTitle"),
        "hint": U.loc("system.settings.displayBlurHint"),
        "scope": "client",
        "config": true,
        "default": true,
        "type": Boolean /* ,
        "onChange": () => window.location.reload() */
    });
    game.settings.register("kult4th", "flare", {
        "name": U.loc("system.settings.displayNavFlareTitle"),
        "hint": U.loc("system.settings.displayNavFlareHint"),
        "scope": "client",
        "config": true,
        "default": true,
        "type": Boolean /* ,
        "onChange": () => window.location.reload() */
    });
    game.settings.register("kult4th", "animations", {
        "name": U.loc("system.settings.displayHeavyAnimationsTitle"),
        "hint": U.loc("system.settings.displayHeavyAnimationsHint"),
        "scope": "client",
        "config": true,
        "default": true,
        "type": Boolean /* ,
        "onChange": () => window.location.reload() */
    });
}
export function initTinyMCEStyles() {
    // CONFIG.TinyMCE.plugins += " searchreplace preview template";
    // CONFIG.TinyMCE.toolbar += " | searchreplace template";
    CONFIG.TinyMCE.style_formats = [
        {
            title: U.tCase(U.loc("kult4th.system.tinymce.headings")),
            items: [
                { title: U.tCase(U.loc("kult4th.system.tinymce.headingNum", { headingNum: String(1) })), block: "h1", wrapper: false },
                { title: U.tCase(U.loc("kult4th.system.tinymce.headingNum", { headingNum: String(2) })), block: "h2", wrapper: false },
                { title: U.tCase(U.loc("kult4th.system.tinymce.headingNum", { headingNum: String(3) })), block: "h3", wrapper: false },
                { title: U.tCase(U.loc("kult4th.system.tinymce.headingNum", { headingNum: String(4) })), block: "h4", wrapper: false }
            ]
        },
        {
            title: U.tCase(U.loc("kult4th.system.tinymce.block")),
            items: [
                { title: U.tCase(U.loc("kult4th.system.tinymce.paragraph")), block: "p", wrapper: true }
            ]
        },
        {
            title: U.tCase(U.loc("kult4th.system.tinymce.inline")),
            items: [
                { title: U.tCase(U.loc("kult4th.system.tinymce.bold")), inline: "strong", wrapper: false },
                { title: U.tCase(U.loc("kult4th.system.tinymce.extraBold")), inline: "strong", classes: "text-extra-bold", wrapper: false },
                { title: U.tCase(U.loc("kult4th.system.tinymce.italics")), inline: "em", wrapper: false }
            ]
        },
        {
            title: "Rules",
            items: [
                { title: U.tCase(U.loc("kult4th.system.trigger")), inline: "em", classes: "text-trigger", wrapper: false },
                { title: U.tCase(U.loc("kult4th.system.keyword")), inline: "strong", classes: "text-keyword", wrapper: false },
                { title: U.tCase(U.loc("kult4th.item.type.move")), inline: "em", classes: "text-keyword text-movename", wrapper: false }
            ]
        }
    ];
    CONFIG.TinyMCE.skin = "Kult4th";
    CONFIG.TinyMCE.skin_url = "systems/kult4th/css/third-party/tinymce/ui/Kult4th";
    CONFIG.TinyMCE.style_formats_merge = false;
    // CONFIG.TinyMCE.template_selected_content_classes += " ws-contents";
    // CONFIG.TinyMCE.templates = CONFIG.TinyMCE.templates ?? [];
    // CONFIG.TinyMCE.templates.push(
    // 		{
    // 				title: 'Sidebar',
    // 				description: 'A World Smiths sidebar',
    // 				content: '<section class="ws-sidebar-group"><main><p></p></main><aside class="ws-block sidebar"><h3></h3><p class="ws-contents">{$contents}</p></aside></section>'
    // 		},
    // 		{
    // 				title: 'Note',
    // 				description: 'A World Smiths note',
    // 				content: `<section class="ws-block note"><img src="worlds/${game.world.data.name}/styles/ws.svg" width="48" /> <div class="contents"><h3></h3><p class="ws-contents">{$contents}</p></div></section>`
    // 		});
    if (typeof CONFIG.TinyMCE.content_css === "string") {
        CONFIG.TinyMCE.content_css = [CONFIG.TinyMCE.content_css];
    }
    else if (!Array.isArray(CONFIG.TinyMCE.content_css)) {
        CONFIG.TinyMCE.content_css = [];
    }
    // CONFIG.TinyMCE.content_css.unshift("dark");
    CONFIG.TinyMCE.content_css.push("systems/kult4th/css/tmce-editor.css");
}
export function initCanvasStyles() {
    CONFIG.canvasTextStyle = new PIXI.TextStyle({
        align: "center",
        dropShadow: true,
        dropShadowAngle: U.degToRad(45),
        dropShadowBlur: 8,
        dropShadowColor: C.Colors.BLACK,
        dropShadowDistance: 4,
        fill: [
            C.Colors.bGOLD,
            C.Colors.GOLD
        ],
        fillGradientType: 1,
        fillGradientStops: [
            0,
            0.3
        ],
        fontFamily: "AlverataSemiBold",
        fontSize: 32,
        letterSpacing: 2,
        lineHeight: 32,
        lineJoin: "round",
        padding: 4,
        stroke: C.Colors.dGOLD,
        strokeThickness: 3,
        trim: true,
        whiteSpace: "normal",
        wordWrap: true,
        wordWrapWidth: 0.1
    });
    CONFIG.fontFamilies = ["Alverata", "AlverataCaps", "Infidel", "Sokol"];
    CONFIG.defaultFontFamily = "Alverata";
}
