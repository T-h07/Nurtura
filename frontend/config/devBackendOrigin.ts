import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const DEFAULT_BACKEND_HOST = '127.0.0.1'
const DEFAULT_BACKEND_PORT = '18080'

interface DevBackendOriginConfig {
  origin: string
  host: string
  port: string
}

function parseEnvFile(filePath: string): Record<string, string> {
  if (!existsSync(filePath)) {
    return {}
  }

  const entries: Record<string, string> = {}
  const fileContent = readFileSync(filePath, 'utf8')

  for (const rawLine of fileContent.split(/\r?\n/u)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) {
      continue
    }

    const separatorIndex = line.indexOf('=')
    if (separatorIndex <= 0) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    let value = line.slice(separatorIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    entries[key] = value
  }

  return entries
}

function readNurturaEnv(mode: string, envDir: string): Record<string, string> {
  const envFilePaths = [
    resolve(envDir, '.env'),
    resolve(envDir, '.env.local'),
    resolve(envDir, `.env.${mode}`),
    resolve(envDir, `.env.${mode}.local`),
  ]

  return envFilePaths.reduce<Record<string, string>>((accumulator, filePath) => {
    return {
      ...accumulator,
      ...parseEnvFile(filePath),
    }
  }, {})
}

export function resolveDevBackendOrigin(mode: string, envDir: string): DevBackendOriginConfig {
  const env = readNurturaEnv(mode, envDir)

  const host = env.NURTURA_BACKEND_HOST || DEFAULT_BACKEND_HOST
  const port = env.NURTURA_SERVER_PORT || DEFAULT_BACKEND_PORT
  const origin = `http://${host}:${port}`

  return {
    origin,
    host,
    port,
  }
}
