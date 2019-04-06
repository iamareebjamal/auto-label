import utils from '../src/utils'

describe('Extract Utils Tests', () => {
  test('test label extraction from list', async (done) => {
    done(expect(utils.extractLabels('chore: Update README')).toEqual(['chore']))
    done(expect(utils.extractLabels('fix: Extract labels correctly')).toEqual(['fix']))
  })

  test('test label extraction from map', async (done) => {
    done(expect(utils.extractLabels('feat: Add links support')).toEqual(['feature']))
    done(expect(utils.extractLabels('fix(ui): Render buttons correctly')).toEqual(['fix', 'ui']))
  })

  test('test current label extraction', async (done) => {
    const labels = [{ name: 'fix' }, { name: 'ui' }]
    done(expect(utils.extractCurrentLabels(labels)).toEqual(['fix', 'ui']))
  })
})

describe('Set Operation Tests', () => {
  test('calculate resultant labels', async (done) => {
    const newLabels = ['feat']
    const currentLabels = ['fix', 'ui', 'approved']
    const oldLabels = ['fix', 'ui']

    done(expect(utils.calculateResultantLabels(newLabels, currentLabels, oldLabels)).toEqual(['feat', 'approved']))
  })

  test('calculate resultant labels 2', async (done) => {
    const newLabels = ['fix']
    const currentLabels = ['fix', 'ui', 'approved']
    const oldLabels = ['fix', 'ui']

    done(expect(utils.calculateResultantLabels(newLabels, currentLabels, oldLabels)).toEqual(['fix', 'approved']))
  })

  test('test resultant labels on PR', async (done) => {
    const pullRequest = {
      pull_request: {
        title: 'fix: Handle mixed intent type',
        labels: [{ name: 'fix' }, { name: 'ui' }, { name: 'approved' }]
      },
      changes: {
        title: {
          from: 'fix(ui): Make text larger'
        }
      }
    }

    done(expect(utils.extractLabelsFromPR(pullRequest)).toEqual(['fix', 'approved']))
  })

  test('test resultant labels on PR 2', async (done) => {
    const pullRequest = {
      pull_request: {
        title: 'fix(ui): Handle mixed intent type',
        labels: [{ name: 'feature' }, { name: 'approved' }]
      },
      changes: {
        title: {
          from: 'feat: Make text larger'
        }
      }
    }

    done(expect(utils.extractLabelsFromPR(pullRequest)).toEqual(['fix', 'ui', 'approved']))
  })

  test('test resultant labels on PR 3', async (done) => {
    const pullRequest = {
      pull_request: {
        title: 'feat: Handle mixed intent type',
        labels: [{ name: 'fix' }, { name: 'approved' }]
      },
      changes: {
        title: {
          from: 'fix: Make text larger'
        }
      }
    }

    done(expect(utils.extractLabelsFromPR(pullRequest)).toEqual(['feature', 'approved']))
  })

  test('test resultant labels on PR edge case', async (done) => {
    const pullRequest = {
      pull_request: {
        title: 'fix: Handle mixed intent type',
        labels: [{ name: 'fix' }, { name: 'ui' }, { name: 'approved' }]
      },
      changes: {
        title: {
          from: 'fix: Make text larger'
        }
      }
    }

    done(expect(utils.extractLabelsFromPR(pullRequest)).toEqual(['fix', 'ui', 'approved']))
  })

  test('test resultant labels on PR created', async (done) => {
    const pullRequest = {
      pull_request: {
        title: 'fix(ui): Handle mixed intent type',
        labels: []
      }
    }

    done(expect(utils.extractLabelsFromPR(pullRequest)).toEqual(['fix', 'ui']))
  })

  test('test resultant labels on PR no change', async (done) => {
    const pullRequest = {
      pull_request: {
        title: 'fix(ui): Handle mixed intent type',
        labels: [{ name: 'fix' }, { name: 'approved' }]
      }
    }

    done(expect(utils.extractLabelsFromPR(pullRequest)).toEqual(['fix', 'ui', 'approved']))
  })
})
