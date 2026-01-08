# `vitest-environment-drizzle`

Vitest testing module for drizzle push and teardown scripts. See [⚡️ Vitest Environment ](https://miniflare.dev/testing/vitest) for more
details.

## Actions

### `Setup`
Environment runs `drizzle-kit push:{dialect}` in your application to bootstrap test database.

**:warning: Be aware that this can update your `production` database if you are not carefull. Use this only on `development` and always check your .env credentials**

### `Teardown`
Environment will drop your test database depending on your adapter

---

## Adapters

Databases supported by now:
- `mysql`
- `sqlite`

## Setup Environment

Example:

`vite.config.ts`

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'drizzle', // Required
    environmentOptions: {
      adapter: 'mysql',
      envFile: '.env.test',
      databaseEnvName: 'DATABASE_URL'  // Optional
    }
  }
})
```

---

## Environment Options

| Name             | Description                                                    | Default        |
|:-----------------|:---------------------------------------------------------------|:---------------|
| adapter          | Name database adapter. See [Adapters](#adapters)               | `mysql`        |
| envFile          | Name of the `.env` file for test suit                          | `.env.test`    |
| schemaPrefix     | Prefix to attach on the database name                          |                |
| databaseEnvName  | The environment variable used to store connection URL          | `DATABASE_URL` |

## Database Credentials

The following keys must be present on your `.env.test` file:

| Name            | Description                       | Example                  |
|:----------------|:----------------------------------|:-------------------------|
| `DATABASE_USER` | Database user credential          | `root`                   |
| `DATABASE_PASS` | Database user password credential | `root`                   |
| `DATABASE_HOST` | Database connection host          | `localhost`, `127.0.0.1` |
| `DATABASE_PORT` | Database connection port          | `3306`                   |
| `DATABASE_NAME` | Database name                     | `mydb`                   |

### Sqlite config

If you are using the sqlite adapter only the `DATABASE_NAME` env is required. The database file will be written to the
`/tmp` directory.

Make sure to use only the name: 

- `DATABASE_NAME=mydb` :heavy_check_mark:
- `DATABASE_NAME=mydb.db` :heavy_check_mark:
- `DATABASE_NAME=file:/mydb` :heavy_multiplication_x:
- `DATABASE_NAME=../mydb` :heavy_multiplication_x:
