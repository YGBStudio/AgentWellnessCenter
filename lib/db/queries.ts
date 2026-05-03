import { db } from './client'

type CountRow = {
  count: number
}

export function getAgentCount() {
  const row = db.prepare('SELECT COUNT(*) as count FROM agents').get() as CountRow

  return row.count
}
