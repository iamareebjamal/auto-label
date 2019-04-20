import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars
import { extractLabelsFromPR, shouldUpdateLabels } from './utils'
import { getConfig } from './config'

export = (app: Application) => {
  app.on(['pull_request.opened', 'pull_request.edited'], async (context: Context) => {
    const config = await getConfig(context)

    if (context.payload.pull_request.state !== 'open') {
      console.debug('PR is not open. Hence, ignoring the changes')
      return
    }

    const newLabels = extractLabelsFromPR(context.payload, config)

    if (!shouldUpdateLabels(context.payload, newLabels))
      return

    await context.github.issues.replaceLabels(context.issue({
      labels: newLabels
    }))
  })
}
