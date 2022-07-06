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