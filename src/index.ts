import { randomUUID } from 'node:crypto'

import * as dotenv from 'dotenv'
import { Environment } from 'vitest'

import { DrizzleEnvironmentOptions } from './@types'

import mysqlAdapter from './adapters/mysqlAdapter'

const supportedAdapters = {
  mysql: mysqlAdapter,
}

export default <Environment>{
  name: 'drizzle',
  transformMode: 'ssr',
  async setup(global, options = {}) {
    const {
      adapter = 'mysql',
      envFile = '.env.test',
      schemaPrefix = '',
      databaseEnvName = 'DATABASE_URL',
    } = options as DrizzleEnvironmentOptions

    if (!Object.keys(supportedAdapters).includes(adapter)) {
      throw new Error(
        'Unsupported database adapter value.\n\nSee supported adapters in https://github.com/carlos8v/vitest-environment-drizzle#adapters.'
      )
    }

    const dangerousEnvFiles = ['.env', '.env.production']
    if (dangerousEnvFiles.includes(envFile)) {
      throw new Error(
        `For security reasons we do not allow the .env file to be: ${dangerousEnvFiles.join(
          ', '
        )}.\n\nWe strongly advise you to use '.env.test'`
      )
    }

    dotenv.config({ path: envFile })

    const dbUser = process.env.DATABASE_USER
    const dbPass = process.env.DATABASE_PASS
    const dbHost = process.env.DATABASE_HOST
    const dbPort = process.env.DATABASE_PORT
    const dbName = process.env.DATABASE_NAME
    let dbSchema = randomUUID().toString()

    if (adapter === 'mysql') {
      dbSchema = dbSchema.replace(/-/g, '_')
    }

    const { [adapter]: selectedAdapter } = supportedAdapters
    const connectionString = selectedAdapter.getConnectionString({
      dbUser,
      dbPass,
      dbHost,
      dbPort,
      dbName,
      dbSchema,
      schemaPrefix,
    })

    process.env[databaseEnvName] = connectionString
    global.process.env[databaseEnvName] = connectionString

    const adapterOptions = {
      connectionString,
      databaseName: dbName,
      databaseSchema: dbSchema,
      schemaPrefix,
    }

    await selectedAdapter.setupDatabase(adapterOptions)

    return {
      async teardown() {
        await selectedAdapter.teardownDatabase(adapterOptions)
      },
    }
  },
}
