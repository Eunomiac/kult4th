import C from "./constants.js";
import U from "./utilities.js";
export default function registerSettings() {
    game.settings.register("kult4th", "debug", {
        "name": "Toggle Debug Mode",
        "hint": "Enable various debugging-related functionality.",
        "scope": "world",
        "config": true,
        "default": false,
        "type": Boolean,
        "onChange": () => window.location.reload()
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
            title: U.tCase(U.loc("kult4th.system.tinymce.headings")),
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
                { title: U.tCase(U.loc("kult4th.system.trigger")), inline: "strong", classes: "text-keyword", wrapper: false },
                { title: U.tCase(U.loc("kult4th.system.trigger")), inline: "em", classes: "text-keyword text-movename", wrapper: false }
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
            C.Colors["GOLD +2"],
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
        stroke: C.Colors["GOLD -2"],
        strokeThickness: 3,
        trim: true,
        whiteSpace: "normal",
        wordWrap: true,
        wordWrapWidth: 0.1
    });
    CONFIG.fontFamilies = ["Alverata", "AlverataCaps", "Infidel", "Sokol"];
    CONFIG.defaultFontFamily = "Alverata";
}
