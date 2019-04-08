"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
function extractLabels(title, config) {
    if (title === void 0) { title = undefined; }
    if (config === void 0) { config = config_1.defaultConfig; }
    if (title === undefined) {
        return [];
    }
    var labels = [];
    for (var _i = 0, _a = config.labels; _i < _a.length; _i++) {
        var label = _a[_i];
        if (title.startsWith(label + ":")) {
            labels.push(label);
        }
    }
    for (var _b = 0, _c = Object.keys(config.labelMapping); _b < _c.length; _b++) {
        var key = _c[_b];
        if (title.startsWith(key)) {
            labels.push.apply(labels, config.labelMapping[key]);
        }
    }
    return labels;
}
exports.extractLabels = extractLabels;
function extractCurrentLabels(currentLabels) {
    return currentLabels.map(function (element) { return element.name; });
}
exports.extractCurrentLabels = extractCurrentLabels;
function calculateResultantLabels(newLabels, currentLabels, oldLabels) {
    return newLabels.concat((currentLabels.filter(function (element) { return oldLabels.indexOf(element) === -1; })));
}
exports.calculateResultantLabels = calculateResultantLabels;
function extractLabelsFromPR(pullRequest, config) {
    if (config === void 0) { config = config_1.defaultConfig; }
    var newLabels = extractLabels(pullRequest.pull_request.title, config);
    var currentLabels = extractCurrentLabels(pullRequest.pull_request.labels);
    var oldTitle = pullRequest.changes && pullRequest.changes.title && pullRequest.changes.title.from;
    var oldLabels = extractLabels(oldTitle, config);
    return Array.from(new Set(calculateResultantLabels(newLabels, currentLabels, oldLabels)));
}
exports.extractLabelsFromPR = extractLabelsFromPR;
//# sourceMappingURL=utils.js.map