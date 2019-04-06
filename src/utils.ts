const defaultLabelList = ['fix', 'chore']

const defaultLabelMap: { [key:string]:string[] } = {
  'feat': ['feature'],
  'fix(ui)': ['fix', 'ui']
}

interface Label {
  name: string
}

interface PullRequestPayLoad {
  pull_request: {
    title: string,
    labels: Label[]
  },
  changes?: {
    title?: {
      from?: string
    }
  }
}

export = {

  extractLabels (
    title: string | undefined = undefined,
    labelList: string[] = defaultLabelList,
    labelMap: { [key:string]: string[] } = defaultLabelMap
  ): string[] {
    if (title === undefined) { return [] }

    const labels = []
    for (let label of labelList) {
      if (title.startsWith(`${label}:`)) { labels.push(label) }
    }

    for (let key of Object.keys(labelMap)) {
      if (title.startsWith(key)) { labels.push.apply(labels, labelMap[key]) }
    }

    return labels
  },

  extractCurrentLabels (currentLabels: Label[]): string[] {
    return currentLabels.map(element => element.name)
  },

  calculateResultantLabels (newLabels: string[], currentLabels: string[], oldLabels: string[]): string[] {
    return [...newLabels, ...(currentLabels.filter(element => oldLabels.indexOf(element) === -1))]
  },

  extractLabelsFromPR (
    pullRequest: PullRequestPayLoad,
    labelList: string[] = defaultLabelList,
    labelMap: { [key:string]: string[] } = defaultLabelMap
  ): string[] {
    const newLabels = this.extractLabels(pullRequest.pull_request.title)
    const currentLabels = this.extractCurrentLabels(pullRequest.pull_request.labels)
    const oldTitle = pullRequest.changes && pullRequest.changes.title && pullRequest.changes.title.from
    const oldLabels = this.extractLabels(oldTitle)

    return Array.from(new Set(this.calculateResultantLabels(newLabels, currentLabels, oldLabels)))
  }

}
