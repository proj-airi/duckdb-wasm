import type { AsyncDuckDBConnection, DuckDBBundle, DuckDBBundles, Logger } from '@duckdb/duckdb-wasm'
import type { DataType as ArrowDataType, Field as ArrowField, Schema as ArrowSchema, Table as ArrowTable, TypeMap as ArrowTypeMap } from 'apache-arrow'

import { AsyncDuckDB, ConsoleLogger, selectBundle, VoidLogger } from '@duckdb/duckdb-wasm'
import { defu } from 'defu'

import type { DBStorage } from './storage'

import { getEnvironment } from './common'
import { mapStructRowData } from './format'
import { DBStorageType } from './storage'

export type ConnectOptions = ConnectRequiredOptions & ConnectOptionalOptions
export type {
  ArrowDataType,
  ArrowField,
  ArrowSchema,
  ArrowTable,
  ArrowTypeMap,
}

export interface ConnectOptionalOptions extends Record<string, unknown> {
  bundles?: DuckDBBundles | Promise<DuckDBBundles>
  logger?: boolean | Logger
  storage?: DBStorage
}

export interface ConnectRequiredOptions extends Record<string, unknown> {

}

export interface ResultColumns<
  T extends { [key: string]: ArrowDataType } = any,
  D extends ArrowTypeMap = any,
  R = Record<string, unknown>,
> {
  _results: ArrowTable<T>
  _schema: ArrowSchema<D>
  columns: ArrowField<D[keyof D]>[]
  rows: R[]
}

export interface DuckDBWasmClient<
  T extends { [key: string]: ArrowDataType } = any,
  D extends ArrowTypeMap = any,
  R = Record<string, unknown>,
> {
  worker: Worker
  db: AsyncDuckDB
  conn: AsyncDuckDBConnection
  close: () => Promise<void>
  query: (query: string, params?: unknown[]) => Promise<T[]>
  queryWithColumns: (query: string, params?: unknown[]) => Promise<ResultColumns<T, D, R>>
}

export async function connect(options: ConnectOptions): Promise<DuckDBWasmClient> {
  const opts = defu<ConnectOptions, ConnectOptions[]>(options, { logger: false })

  let worker: Worker
  let bundle: DuckDBBundle

  const env = await getEnvironment()
  if (env === 'browser') {
    if (typeof opts.bundles === 'undefined') {
      const { getBundles } = await import('./bundles/default-browser')
      opts.bundles = await getBundles()
    }

    bundle = await selectBundle(await opts.bundles)
    worker = new Worker(bundle.mainWorker!)
  }
  else if (env === 'node') {
    if (typeof opts.bundles === 'undefined') {
      const { getBundles } = await import('./bundles/default-node')
      opts.bundles = await getBundles()
    }

    bundle = await selectBundle(await opts.bundles)

    let workerUrl = bundle.mainWorker!
    if (workerUrl.startsWith('/@fs/')) {
      workerUrl = workerUrl.replace('/@fs/', 'file://')
    }

    const ww = await import('web-worker')
    // eslint-disable-next-line new-cap
    worker = new ww.default(workerUrl, { type: 'module' })
  }
  else {
    throw new Error(`Unsupported environment: ${env}`)
  }

  let logger: Logger
  if (opts.logger === true) {
    logger = new ConsoleLogger()
  }
  else if (opts.logger === false) {
    logger = new VoidLogger()
  }
  else {
    logger = opts.logger
  }

  const db = new AsyncDuckDB(logger, worker)
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker)

  if (opts.storage) {
    switch (opts.storage.type) {
      case DBStorageType.ORIGIN_PRIVATE_FS: {
        try {
          let strippedPath = opts.storage.path
          if (strippedPath.startsWith('/')) {
            // We will strip the only leading slash as it is not needed
            strippedPath = strippedPath.slice(1)
          }
          await db.open({
            path: `opfs://${strippedPath}`,
            accessMode: opts.storage.accessMode,
            // OPFS already uses direct IO
          })
        }
        catch (e) {
          await db.terminate()
          await worker.terminate()
          throw e
        }
        break
      }
      case DBStorageType.NODE_FS: {
        try {
          await db.open({
            path: opts.storage.path,
            accessMode: opts.storage.accessMode,
            useDirectIO: true, // Important! Otherwise the file will be created without DB init
          })
        }
        catch (e) {
          await db.terminate()
          await worker.terminate()
          throw e
        }
        break
      }
    }
  }

  const conn = await db.connect()

  async function queryWithColumns<
    T extends { [key: string]: ArrowDataType } = any,
    D extends ArrowTypeMap = any,
    R = Record<string, unknown>,
  >(query: string, params: unknown[] = []): Promise<ResultColumns<T, D, R>> {
    if (!params || params.length === 0) {
      const results = await conn.query<any>(query)
      return {
        _results: results as unknown as ArrowTable<T>,
        _schema: results.schema as ArrowSchema<D>,
        columns: results.schema.fields as ArrowField<D[keyof D]>[],
        rows: mapStructRowData(results) as R[],
      }
    }

    const stmt = await conn.prepare(query)
    const results = await stmt.query(...params)

    stmt.close()
    return {
      _results: results as unknown as ArrowTable<T>,
      _schema: results.schema as ArrowSchema<D>,
      columns: results.schema.fields as ArrowField<D[keyof D]>[],
      rows: mapStructRowData(results) as R[],
    }
  }

  return {
    worker,
    db,
    conn,
    query: async (query: string, params: unknown[] = []) => queryWithColumns(query, params).then(res => res.rows),
    queryWithColumns: async (query: string, params: unknown[] = []) => queryWithColumns(query, params),
    close: async () => {
      await conn.close()
      await db.terminate()
      await worker.terminate()
    },
  }
}

export async function beginTransaction(client: Promise<DuckDBWasmClient>, txFn: (client: Promise<DuckDBWasmClient>) => Promise<any>): Promise<any> {
  await (await client).conn.send('BEGIN TRANSACTION')
  try {
    const result = await txFn(client)
    await (await client).conn.send('COMMIT')
    return result
  }
  catch (err) {
    await (await client).conn.send('ROLLBACK')
    throw err
  }
}

export async function withSavepoint(client: Promise<DuckDBWasmClient>, spName: string, txFn: (client: Promise<DuckDBWasmClient>) => Promise<any>): Promise<any> {
  await (await client).conn.send(`SAVEPOINT ${spName}`)
  try {
    const result = await txFn(client)
    await (await client).conn.send(`RELEASE SAVEPOINT ${spName}`)
    return result
  }
  catch (err) {
    await (await client).conn.send(`ROLLBACK TO SAVEPOINT ${spName}`)
    throw err
  }
}
