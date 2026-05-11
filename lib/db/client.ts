import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { initializeDatabase } from './schema'
import { seedDefaultAdmin } from './seed'

const dbPath = path.join(process.cwd(), 'data', 'agentclinic.db')

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!_db) {
    const dbDir = path.dirname(dbPath)
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }
    _db = new Database(dbPath)
    _db.pragma('foreign_keys = ON')
    initializeDatabase(_db)
    
    // Seed default admin
    seedDefaultAdmin(_db)
  }
  return _db
}

// Keep backward-compatible named export for existing code
export const db = getDb()
