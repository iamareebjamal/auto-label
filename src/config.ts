import { Context } from 'probot'

export interface Config {
  labels: string[],
  labelMapping: { [key:string]: string[] }
  pr?: Config
  issue?: Config
}

export const defaultConfig: Config = {
  labels: ['fix', 'chore'],
  labelMapping: {
    'feat': ['feature'],
    'fix(ui)': ['fix', 'ui']
  }
}

interface ConfigEntry {
  config: Config,
  insertedAt: Date,
  default: Boolean
}

const configCache = new Map<string, ConfigEntry>()

export async function getConfig (context: Context): Promise<Config> {
  const key = context.payload.repository.full_name

  const currentTime = new Date()
  let configEntry = configCache.get(key)
  if (!configEntry || currentTime.getTime() - configEntry.insertedAt.getTime() > 600000) { // 10 minutes
    const config = await context.config('auto_label.yml')

    configCache.set(key, {
      config: config || defaultConfig,
      insertedAt: new Date(),
      default: config == null
    })
  }

  configEntry = configCache.get(key)

  if (!configEntry) { return defaultConfig }

  return configEntry.config
}
