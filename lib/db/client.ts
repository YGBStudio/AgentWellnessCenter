import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { initializeDatabase } from './schema'

const dbPath = path.join(process.cwd(), 'data', 'agentclinic.db')
const dbDir = path.dirname(dbPath)

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

export const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Initialize schema
initializeDatabase(db)
