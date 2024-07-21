function createTextLayer(text) {
    var comp = app.project.activeItem;
    if (comp && comp instanceof CompItem) {
        var textLayer = comp.layers.addText(text);
        return "Text layer created: " + text;
    } else {
        return "No active composition";
    }
}