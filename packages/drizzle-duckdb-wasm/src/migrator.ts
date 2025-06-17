import type { MigrationConfig } from 'drizzle-orm/migrator'
import type { PgSession } from 'drizzle-orm/pg-core'

import { readMigrationFiles } from 'drizzle-orm/migrator'

import type { DuckDBWasmDatabase } from './driver'

export async function migrate<TSchema extends Record<string, unknown>>(
  db: DuckDBWasmDatabase<TSchema>,
  config: MigrationConfig,
) {
  const migrations = readMigrationFiles(config)
  await (db as any).dialect.migrate(migrations, (db as any).session as unknown as PgSession, config)
}
