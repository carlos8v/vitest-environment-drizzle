import { resolve } from 'node:path'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

import { createConnection } from 'mysql2/promise'

import { EnvironmentAdapterOptions, EnvironmentDatabaseCredentials, MysqlEnvironmentAdapterOptions } from '../@types'

const execSync = promisify(exec)

const drizzleBinary = resolve('./node_modules/.bin/drizzle-kit')

export function getConnectionString(databaseCredentials: EnvironmentDatabaseCredentials) {
  const { dbUser, dbPass, dbHost, dbPort, dbName, dbSchema, schemaPrefix } = databaseCredentials
  return `mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}_${schemaPrefix}${dbSchema}`
}

export async function setupDatabase(adapterOptions: EnvironmentAdapterOptions) {
  const {
    connectionString,
    databaseName,
    databaseSchema,
    schemaPrefix
  } = adapterOptions as MysqlEnvironmentAdapterOptions

  const strippedConnectionString = connectionString
    .replace(schemaPrefix, '')
    .replace(`_${databaseSchema}`, '')

  const client = await createConnection(strippedConnectionString)
  await client.connect()
  await client.query(`create database ${databaseName}_${schemaPrefix}${databaseSchema}`)

  await execSync(`${drizzleBinary} push:mysql`)
}

export async function teardownDatabase(adapterOptions: EnvironmentAdapterOptions) {
  const {
    connectionString,
    databaseName,
    databaseSchema,
    schemaPrefix
  } = adapterOptions as MysqlEnvironmentAdapterOptions

  const strippedConnectionString = connectionString
    .replace(schemaPrefix, '')
    .replace(`_${databaseSchema}`, '')

  const client = await createConnection(strippedConnectionString)
  await client.connect()
  await client.query(`drop database ${databaseName}_${schemaPrefix}${databaseSchema}`)
  client.destroy()
}

export default {
  getConnectionString,
  setupDatabase,
  teardownDatabase
}
