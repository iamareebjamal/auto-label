interface Label {
    name: string;
}
interface PullRequestPayLoad {
    pull_request: {
        title: string;
        labels: Label[];
    };
    changes?: {
        title?: {
            from?: string;
        };
    };
}
declare const _default: {
    extractLabels(title?: string | undefined, labelList?: string[], labelMap?: {
        [key: string]: string[];
    }): string[];
    extractCurrentLabels(currentLabels: Label[]): string[];
    calculateResultantLabels(newLabels: string[], currentLabels: string[], oldLabels: string[]): string[];
    extractLabelsFromPR(pullRequest: PullRequestPayLoad, labelList?: string[], labelMap?: {
        [key: string]: string[];
    }): string[];
};
export = _default;
