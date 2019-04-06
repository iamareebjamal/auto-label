import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars
import utils from './utils'

export = (app: Application) => {
  app.on(['pull_request.opened', 'pull_request.edited'], async (context: Context) => {
    if (context.payload.pull_request.state !== 'open') {
      console.debug('PR is not open. Hence, ignoring the changes')
      return
    }

    await context.github.issues.replaceLabels(context.issue({
      labels: utils.extractLabelsFromPR(context.payload)
    }))
  })
}
