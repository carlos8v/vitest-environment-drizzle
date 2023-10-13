export type DrizzleEnvironmentOptions = {
  envFile: string
  schemaPrefix: string
  adapter: 'mysql'
  databaseEnvName: string
}

export type EnvironmentDatabaseCredentials = {
  dbUser: string
  dbPass: string
  dbHost: string
  dbPort: string
  dbName: string
  dbSchema: string
  schemaPrefix?: string
}

export type EnvironmentAdapterOptions = {
  [key: string]: any
}

export type MysqlEnvironmentAdapterOptions = {
  connectionString: string
  databaseName: string
  databaseSchema: string
  schemaPrefix: string
}
