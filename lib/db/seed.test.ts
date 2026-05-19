import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import Database from 'better-sqlite3'
import { initializeDatabase } from './schema'
import { SqliteDatabaseAdapter } from './sqlite-adapter'
import { resetDemoDatabase, seedDefaultAdmin, seedDemoData } from './seed'
import { verifyPassword } from '../auth/utils'

describe('demo seed data', () => {
  let db: Database.Database
  let adapter: SqliteDatabaseAdapter

  beforeEach(() => {
    db = new Database(':memory:')
    db.pragma('foreign_keys = ON')
    initializeDatabase(db)
    adapter = new SqliteDatabaseAdapter(db)
  })

  afterEach(() => {
    db.close()
  })

  it('keeps the default demo admin credentials available', async () => {
    await seedDefaultAdmin(adapter)

    const user = db
      .prepare('SELECT email, password_hash, role FROM users WHERE email = ?')
      .get('admin@agentclinic.demo') as
        | { email: string; password_hash: string; role: string }
        | undefined

    expect(user).toBeDefined()
    expect(user?.role).toBe('admin')
    expect(await verifyPassword('admin', user?.password_hash ?? '')).toBe(true)
  })

  it('creates deterministic agents, ailments, therapies, and appointments', async () => {
    await seedDemoData(adapter)

    expect(countRows('agents')).toBeGreaterThanOrEqual(4)
    expect(countRows('ailments')).toBeGreaterThanOrEqual(4)
    expect(countRows('therapies')).toBeGreaterThanOrEqual(4)
    expect(countRows('appointments')).toBeGreaterThanOrEqual(3)

    expect(findByName('agents', 'Atlas-7')).toBeDefined()
    expect(findByName('ailments', 'Context Window Exhaustion')).toBeDefined()
    expect(findByName('therapies', 'Context Compression Therapy')).toBeDefined()
  })

  it('is idempotent and preserves user-created records', async () => {
    db.prepare('INSERT INTO agents (name, type) VALUES (?, ?)').run('Local Custom Agent', 'demo')

    await seedDemoData(adapter)
    const countsAfterFirstSeed = {
      agents: countRows('agents'),
      ailments: countRows('ailments'),
      therapies: countRows('therapies'),
      appointments: countRows('appointments'),
    }

    await seedDemoData(adapter)

    expect(countRows('agents')).toBe(countsAfterFirstSeed.agents)
    expect(countRows('ailments')).toBe(countsAfterFirstSeed.ailments)
    expect(countRows('therapies')).toBe(countsAfterFirstSeed.therapies)
    expect(countRows('appointments')).toBe(countsAfterFirstSeed.appointments)
    expect(findByName('agents', 'Local Custom Agent')).toBeDefined()
  })

  it('resets demo-session clutter and restores deterministic seed data', async () => {
    await seedDefaultAdmin(adapter)
    await seedDemoData(adapter)
    db.prepare('INSERT INTO agents (name, type) VALUES (?, ?)').run('Local Custom Agent', 'demo')

    await resetDemoDatabase(adapter)

    expect(countRows('agents')).toBe(4)
    expect(countRows('ailments')).toBe(4)
    expect(countRows('therapies')).toBe(4)
    expect(countRows('appointments')).toBe(3)
    expect(findByName('agents', 'Local Custom Agent')).toBeUndefined()

    const user = db
      .prepare('SELECT email, password_hash, role FROM users WHERE email = ?')
      .get('admin@agentclinic.demo') as
        | { email: string; password_hash: string; role: string }
        | undefined

    expect(user).toBeDefined()
    expect(user?.role).toBe('admin')
    expect(await verifyPassword('admin', user?.password_hash ?? '')).toBe(true)
  })

  function countRows(table: 'users' | 'agents' | 'ailments' | 'therapies' | 'appointments'): number {
    const row = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number }
    return row.count
  }

  function findByName(table: 'agents' | 'ailments' | 'therapies', name: string): unknown {
    return db.prepare(`SELECT id FROM ${table} WHERE name = ?`).get(name)
  }
})
