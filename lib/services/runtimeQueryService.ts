import type { AppDatabase, SqlValue } from '../db/adapter'
import { getRuntimeDatabase } from '../db/d1'
import { QueryService } from './queryService'

const runtimeDatabase: AppDatabase = {
  first<T>(sql: string, params?: SqlValue[]) {
    return getRuntimeDatabase().first<T>(sql, params)
  },
  all<T>(sql: string, params?: SqlValue[]) {
    return getRuntimeDatabase().all<T>(sql, params)
  },
  run(sql: string, params?: SqlValue[]) {
    return getRuntimeDatabase().run(sql, params)
  },
  exec(sql: string) {
    return getRuntimeDatabase().exec(sql)
  },
}

export function getRuntimeQueryService(): QueryService {
  return new QueryService(runtimeDatabase)
}
