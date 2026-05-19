export type SqlValue = string | number | boolean | null
export type MaybePromise<T> = T | Promise<T>

export interface QueryRunResult {
  changes: number
  lastInsertRowid?: number
}

export interface AppDatabase {
  first<T>(sql: string, params?: SqlValue[]): MaybePromise<T | undefined>
  all<T>(sql: string, params?: SqlValue[]): MaybePromise<T[]>
  run(sql: string, params?: SqlValue[]): MaybePromise<QueryRunResult>
  exec(sql: string): MaybePromise<void>
}
