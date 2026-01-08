import { resolve } from 'node:path'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

import { rm } from 'node:fs'
import { tmpdir } from 'node:os';

import { EnvironmentAdapterOptions, EnvironmentDatabaseCredentials, SqliteEnvironmentAdapterOptions } from '../@types'

const execSync = promisify(exec)
const rmSync = promisify(rm)

const prismaBinary = resolve('./node_modules/.bin/drizzle-kit')

export function getConnectionString(databaseCredentials: EnvironmentDatabaseCredentials) {
  const { dbName, dbSchema, schemaPrefix } = databaseCredentials
  return `${tmpdir()}/${dbName.replace('.db', '')}_${schemaPrefix}${dbSchema}.db`
}

export async function setupDatabase(_adapterOptions: EnvironmentAdapterOptions) {
  await execSync(`${prismaBinary} push`)
}

export async function teardownDatabase(adapterOptions: EnvironmentAdapterOptions) {
  const { databaseSchema, databaseName, schemaPrefix } = adapterOptions as SqliteEnvironmentAdapterOptions

  const databaseFile = `${tmpdir()}/${databaseName.replace('.db', '')}_${schemaPrefix}${databaseSchema}.db`

  await rmSync(databaseFile)
  await rmSync(`${databaseFile}-journal`).catch(() => {})
}

export default {
  getConnectionString,
  setupDatabase,
  teardownDatabase
}
