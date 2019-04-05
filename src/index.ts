import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars

const prefixList = ['fix', 'chore']

const labelMap: { [key:string]:string[] } = {
  'feat': ['feature'],
  'fix(ui)': ['fix', 'ui']
}

export = (app: Application) => {
  app.on(['pull_request.opened', 'pull_request.edited'], async (context: Context) => {
    const pr = context.payload.pull_request

    if (pr.state !== 'open') {
      console.debug('PR is not open. Hence, ignoring the changes')
      return
    }

    const labels = []
    for (let label of prefixList) {
      if (pr.title.startsWith(`${label}:`))
        labels.push(label)
    }

    for (let key of Object.keys(labelMap)) {
      if (pr.title.startsWith(key))
        labels.push.apply(labels, labelMap[key])
    }

    await context.github.issues.addLabels(context.issue({
      labels
    }))
  })
}
