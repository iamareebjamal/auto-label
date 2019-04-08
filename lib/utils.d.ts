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
export declare function extractLabels(title?: string | undefined, config?: import("./config").Config): string[];
export declare function extractCurrentLabels(currentLabels: Label[]): string[];
export declare function calculateResultantLabels(newLabels: string[], currentLabels: string[], oldLabels: string[]): string[];
export declare function extractLabelsFromPR(pullRequest: PullRequestPayLoad, config?: import("./config").Config): string[];
export {};
