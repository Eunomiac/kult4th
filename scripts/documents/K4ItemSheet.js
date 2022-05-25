export default class K4ItemSheet extends ItemSheet {
    get template() { return `systems/kult4th/templates/sheets/${this.item.data.type}-sheet.hbs`; }
}
