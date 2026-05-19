import type Database from 'better-sqlite3'
import type { AppDatabase, QueryRunResult, SqlValue } from './adapter'

export class SqliteDatabaseAdapter implements AppDatabase {
  constructor(private readonly db: Database.Database) {}

  first<T>(sql: string, params: SqlValue[] = []): T | undefined {
    return this.db.prepare(sql).get(...params) as T | undefined
  }

  all<T>(sql: string, params: SqlValue[] = []): T[] {
    return this.db.prepare(sql).all(...params) as T[]
  }

  run(sql: string, params: SqlValue[] = []): QueryRunResult {
    const result = this.db.prepare(sql).run(...params)
    return {
      changes: result.changes,
      lastInsertRowid: Number(result.lastInsertRowid),
    }
  }

  exec(sql: string): void {
    this.db.exec(sql)
  }
}
