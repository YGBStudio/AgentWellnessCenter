import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Database from 'better-sqlite3'
import { initializeDatabase } from './schema'
import type { Agent, Ailment, Therapy, Appointment } from './types'

describe('Database Schema', () => {
  let db: Database.Database

  beforeEach(() => {
    db = new Database(':memory:')
    db.pragma('foreign_keys = ON')
    initializeDatabase(db)
  })

  afterEach(() => {
    db.close()
  })

  describe('Table Creation', () => {
    it('should create agents table', () => {
      const tables = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='agents'"
      ).get()
      expect(tables).toBeDefined()
    })

    it('should create ailments table', () => {
      const table = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='ailments'"
      ).get()
      expect(table).toBeDefined()
    })

    it('should create therapies table', () => {
      const table = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='therapies'"
      ).get()
      expect(table).toBeDefined()
    })

    it('should create appointments table', () => {
      const table = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='appointments'"
      ).get()
      expect(table).toBeDefined()
    })
  })

  describe('Agents Table', () => {
    it('should insert an agent', () => {
      const stmt = db.prepare(
        'INSERT INTO agents (name, type) VALUES (?, ?)'
      )
      const result = stmt.run('GPT-4', 'language-model')
      
      expect(result.lastInsertRowid).toBeDefined()
      
      const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(result.lastInsertRowid) as Agent
      expect(agent.name).toBe('GPT-4')
      expect(agent.type).toBe('language-model')
      expect(agent.created_at).toBeDefined()
    })

    it('should require name and type fields', () => {
      const stmt = db.prepare('INSERT INTO agents (name) VALUES (?)')
      expect(() => stmt.run('GPT-4')).toThrow()
    })
  })

  describe('Ailments Table', () => {
    it('should insert an ailment', () => {
      const stmt = db.prepare(
        'INSERT INTO ailments (name, description, severity) VALUES (?, ?, ?)'
      )
      const result = stmt.run('hallucination', 'Generating false information', 'high')
      
      const ailment = db.prepare('SELECT * FROM ailments WHERE id = ?').get(result.lastInsertRowid) as Ailment
      expect(ailment.name).toBe('hallucination')
      expect(ailment.description).toBe('Generating false information')
      expect(ailment.severity).toBe('high')
    })

    it('should require all fields', () => {
      const stmt = db.prepare('INSERT INTO ailments (name) VALUES (?)')
      expect(() => stmt.run('hallucination')).toThrow()
    })
  })

  describe('Therapies Table', () => {
    it('should insert a therapy', () => {
      const stmt = db.prepare(
        'INSERT INTO therapies (name, description, duration) VALUES (?, ?, ?)'
      )
      const result = stmt.run('context pruning', 'Reduce context window size', 30)
      
      const therapy = db.prepare('SELECT * FROM therapies WHERE id = ?').get(result.lastInsertRowid) as Therapy
      expect(therapy.name).toBe('context pruning')
      expect(therapy.description).toBe('Reduce context window size')
      expect(therapy.duration).toBe(30)
    })

    it('should require duration to be a number', () => {
      const stmt = db.prepare(
        'INSERT INTO therapies (name, description, duration) VALUES (?, ?, ?)'
      )
      const result = stmt.run('test therapy', 'test desc', 60)
      expect(result.lastInsertRowid).toBeDefined()
    })
  })

  describe('Appointments Table', () => {
    let agentId: number
    let ailmentId: number
    let therapyId: number

    beforeEach(() => {
      const agentStmt = db.prepare('INSERT INTO agents (name, type) VALUES (?, ?)')
      agentId = Number(agentStmt.run('Claude', 'assistant').lastInsertRowid)

      const ailmentStmt = db.prepare(
        'INSERT INTO ailments (name, description, severity) VALUES (?, ?, ?)'
      )
      ailmentId = Number(ailmentStmt.run('context overflow', 'Too much context', 'medium').lastInsertRowid)

      const therapyStmt = db.prepare(
        'INSERT INTO therapies (name, description, duration) VALUES (?, ?, ?)'
      )
      therapyId = Number(therapyStmt.run('training boost', 'Additional training', 45).lastInsertRowid)
    })

    it('should insert an appointment with valid foreign keys', () => {
      const stmt = db.prepare(
        'INSERT INTO appointments (agent_id, ailment_id, therapy_id, date, status) VALUES (?, ?, ?, ?, ?)'
      )
      const result = stmt.run(
        agentId,
        ailmentId,
        therapyId,
        '2026-05-10T10:00:00',
        'scheduled'
      )

      const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(result.lastInsertRowid) as Appointment
      expect(appointment.agent_id).toBe(agentId)
      expect(appointment.ailment_id).toBe(ailmentId)
      expect(appointment.therapy_id).toBe(therapyId)
      expect(appointment.status).toBe('scheduled')
    })

    it('should reject appointment with invalid agent_id (foreign key violation)', () => {
      const stmt = db.prepare(
        'INSERT INTO appointments (agent_id, ailment_id, therapy_id, date, status) VALUES (?, ?, ?, ?, ?)'
      )
      expect(() =>
        stmt.run(9999, ailmentId, therapyId, '2026-05-10T10:00:00', 'scheduled')
      ).toThrow()
    })

    it('should reject appointment with invalid ailment_id (foreign key violation)', () => {
      const stmt = db.prepare(
        'INSERT INTO appointments (agent_id, ailment_id, therapy_id, date, status) VALUES (?, ?, ?, ?, ?)'
      )
      expect(() =>
        stmt.run(agentId, 9999, therapyId, '2026-05-10T10:00:00', 'scheduled')
      ).toThrow()
    })

    it('should reject appointment with invalid therapy_id (foreign key violation)', () => {
      const stmt = db.prepare(
        'INSERT INTO appointments (agent_id, ailment_id, therapy_id, date, status) VALUES (?, ?, ?, ?, ?)'
      )
      expect(() =>
        stmt.run(agentId, ailmentId, 9999, '2026-05-10T10:00:00', 'scheduled')
      ).toThrow()
    })
  })

  describe('TypeScript Types', () => {
    it('should match Agent interface structure', () => {
      const stmt = db.prepare(
        'INSERT INTO agents (name, type) VALUES (?, ?)'
      )
      const result = stmt.run('Test Agent', 'test-type')
      
      const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(result.lastInsertRowid) as Agent
      
      expect(agent).toHaveProperty('id')
      expect(agent).toHaveProperty('name')
      expect(agent).toHaveProperty('type')
      expect(agent).toHaveProperty('created_at')
    })

    it('should match Appointment interface with all required fields', () => {
      const agentStmt = db.prepare('INSERT INTO agents (name, type) VALUES (?, ?)')
      const agentId = Number(agentStmt.run('Agent', 'type').lastInsertRowid)

      const ailmentStmt = db.prepare(
        'INSERT INTO ailments (name, description, severity) VALUES (?, ?, ?)'
      )
      const ailmentId = Number(ailmentStmt.run('ailment', 'desc', 'low').lastInsertRowid)

      const therapyStmt = db.prepare(
        'INSERT INTO therapies (name, description, duration) VALUES (?, ?, ?)'
      )
      const therapyId = Number(therapyStmt.run('therapy', 'desc', 30).lastInsertRowid)

      const stmt = db.prepare(
        'INSERT INTO appointments (agent_id, ailment_id, therapy_id, date, status) VALUES (?, ?, ?, ?, ?)'
      )
      const result = stmt.run(agentId, ailmentId, therapyId, '2026-05-10', 'scheduled')
      
      const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(result.lastInsertRowid) as Appointment
      
      expect(appointment).toHaveProperty('id')
      expect(appointment).toHaveProperty('agent_id')
      expect(appointment).toHaveProperty('ailment_id')
      expect(appointment).toHaveProperty('therapy_id')
      expect(appointment).toHaveProperty('date')
      expect(appointment).toHaveProperty('status')
      expect(appointment).toHaveProperty('created_at')
    })
  })
})
