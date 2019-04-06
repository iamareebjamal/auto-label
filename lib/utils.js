"use strict";
var defaultLabelList = ['fix', 'chore'];
var defaultLabelMap = {
    'feat': ['feature'],
    'fix(ui)': ['fix', 'ui']
};
module.exports = {
    extractLabels: function (title, labelList, labelMap) {
        if (title === void 0) { title = undefined; }
        if (labelList === void 0) { labelList = defaultLabelList; }
        if (labelMap === void 0) { labelMap = defaultLabelMap; }
        if (title === undefined) {
            return [];
        }
        var labels = [];
        for (var _i = 0, labelList_1 = labelList; _i < labelList_1.length; _i++) {
            var label = labelList_1[_i];
            if (title.startsWith(label + ":")) {
                labels.push(label);
            }
        }
        for (var _a = 0, _b = Object.keys(labelMap); _a < _b.length; _a++) {
            var key = _b[_a];
            if (title.startsWith(key)) {
                labels.push.apply(labels, labelMap[key]);
            }
        }
        return labels;
    },
    extractCurrentLabels: function (currentLabels) {
        return currentLabels.map(function (element) { return element.name; });
    },
    calculateResultantLabels: function (newLabels, currentLabels, oldLabels) {
        return newLabels.concat((currentLabels.filter(function (element) { return oldLabels.indexOf(element) === -1; })));
    },
    extractLabelsFromPR: function (pullRequest, labelList, labelMap) {
        if (labelList === void 0) { labelList = defaultLabelList; }
        if (labelMap === void 0) { labelMap = defaultLabelMap; }
        var newLabels = this.extractLabels(pullRequest.pull_request.title);
        var currentLabels = this.extractCurrentLabels(pullRequest.pull_request.labels);
        var oldTitle = pullRequest.changes && pullRequest.changes.title && pullRequest.changes.title.from;
        var oldLabels = this.extractLabels(oldTitle);
        return Array.from(new Set(this.calculateResultantLabels(newLabels, currentLabels, oldLabels)));
    }
};
//# sourceMappingURL=utils.js.map