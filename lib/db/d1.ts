import { getCloudflareContext } from '@opennextjs/cloudflare'
import type { AppDatabase, QueryRunResult, SqlValue } from './adapter'
import { SCHEMA_STATEMENTS } from './schema'
import { seedDefaultAdmin, seedDemoData } from './seed'

const initializedBindings = new WeakMap<D1Database, Promise<void>>()

export class D1DatabaseAdapter implements AppDatabase {
  constructor(
    private readonly db: D1Database,
    private readonly ready?: Promise<void>
  ) {}

  async first<T>(sql: string, params: SqlValue[] = []): Promise<T | undefined> {
    await this.ensureReady()
    const row = await this.db.prepare(sql).bind(...params).first<T>()
    return row ?? undefined
  }

  async all<T>(sql: string, params: SqlValue[] = []): Promise<T[]> {
    await this.ensureReady()
    const result = await this.db.prepare(sql).bind(...params).all<T>()
    return result.results ?? []
  }

  async run(sql: string, params: SqlValue[] = []): Promise<QueryRunResult> {
    await this.ensureReady()
    const result = (await this.db.prepare(sql).bind(...params).run()) as D1Response
    return {
      changes: result.meta.changes ?? 0,
      lastInsertRowid: result.meta.last_row_id,
    }
  }

  async exec(sql: string): Promise<void> {
    await this.ensureReady()
    await this.db.exec(sql)
  }

  private async ensureReady(): Promise<void> {
    if (this.ready) {
      await this.ready
    }
  }
}

export function getRuntimeDatabase(): AppDatabase {
  const { env } = getCloudflareContext()
  const db = env.DB

  if (!db) {
    throw new Error(
      'Cloudflare D1 binding "DB" is required. Run through OpenNext Cloudflare Workers, workers preview, or next dev with initOpenNextCloudflareForDev().'
    )
  }

  let ready = initializedBindings.get(db)
  if (!ready) {
    ready = initializeD1Database(db).catch((error) => {
      initializedBindings.delete(db)
      throw error
    })
    initializedBindings.set(db, ready)
  }

  return new D1DatabaseAdapter(db, ready)
}

async function initializeD1Database(db: D1Database): Promise<void> {
  const adapter = new D1DatabaseAdapter(db)
  for (const statement of SCHEMA_STATEMENTS) {
    await adapter.exec(statement)
  }
  await seedDefaultAdmin(adapter)
  await seedDemoData(adapter)
}
