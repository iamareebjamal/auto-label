import { defaultConfig } from './config'

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

export function extractLabels (
  title: string | undefined = undefined,
  config = defaultConfig
): string[] {
  if (title === undefined) { return [] }

  const labels = []
  for (let label of config.labels) {
    if (title.startsWith(`${label}:`)) { labels.push(label) }
  }

  for (let key of Object.keys(config.labelMapping)) {
    if (title.startsWith(key)) { labels.push.apply(labels, config.labelMapping[key]) }
  }

  return labels
}

export function extractCurrentLabels (currentLabels: Label[]): string[] {
  return currentLabels.map(element => element.name)
}

export function calculateResultantLabels (newLabels: string[], currentLabels: string[], oldLabels: string[]): string[] {
  return [...newLabels, ...(currentLabels.filter(element => oldLabels.indexOf(element) === -1))]
}

export function extractLabelsFromPR (
  pullRequest: PullRequestPayLoad,
  config = defaultConfig
): string[] {
  const newLabels = extractLabels(pullRequest.pull_request.title, config)
  const currentLabels = extractCurrentLabels(pullRequest.pull_request.labels)
  const oldTitle = pullRequest.changes && pullRequest.changes.title && pullRequest.changes.title.from
  const oldLabels = extractLabels(oldTitle, config)

  return Array.from(new Set(calculateResultantLabels(newLabels, currentLabels, oldLabels)))
}

export function shouldUpdateLabels (pullRequest: PullRequestPayLoad, newLabels: string[]) {
  return newLabels.sort().toString() !== extractCurrentLabels(pullRequest.pull_request.labels).sort().toString()
}
