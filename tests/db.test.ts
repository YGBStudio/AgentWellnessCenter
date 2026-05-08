import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Database from 'better-sqlite3'
import { initializeDatabase } from '@/lib/db/schema'
import { QueryService } from '@/lib/services/queryService'

describe('Database Tests', () => {
  let db: Database.Database
  let queryService: QueryService

  beforeEach(() => {
    db = new Database(':memory:')
    db.pragma('foreign_keys = ON')
    initializeDatabase(db)
    queryService = new QueryService(db)
  })

  afterEach(() => {
    db.close()
  })

  describe('Agent Operations', () => {
    it('creates and retrieves agents', () => {
      const id = queryService.createAgent({ name: 'Test Agent', type: 'test-type' })
      const agent = queryService.getAgentById(id)
      expect(agent).toBeDefined()
      expect(agent?.name).toBe('Test Agent')
    })

    it('returns correct agent count', () => {
      expect(queryService.getAgentCount()).toBe(0)
      queryService.createAgent({ name: 'Agent1', type: 'type1' })
      expect(queryService.getAgentCount()).toBe(1)
    })
  })

  describe('Ailment Operations', () => {
    it('creates and retrieves ailments', () => {
      const id = queryService.createAilment({ name: 'Test', description: 'desc', severity: 'low' })
      const ailment = queryService.getAilmentById(id)
      expect(ailment).toBeDefined()
      expect(ailment?.severity).toBe('low')
    })

    it('returns correct ailment count', () => {
      expect(queryService.getAilmentCount()).toBe(0)
      queryService.createAilment({ name: 'A1', description: 'd', severity: 'low' })
      expect(queryService.getAilmentCount()).toBe(1)
    })
  })

  describe('Therapy Operations', () => {
    it('creates and retrieves therapies', () => {
      const id = queryService.createTherapy({ name: 'Test', description: 'desc', duration: 30 })
      const therapy = queryService.getTherapyById(id)
      expect(therapy).toBeDefined()
      expect(therapy?.duration).toBe(30)
    })

    it('returns correct therapy count', () => {
      expect(queryService.getTherapyCount()).toBe(0)
      queryService.createTherapy({ name: 'T1', description: 'd', duration: 30 })
      expect(queryService.getTherapyCount()).toBe(1)
    })
  })
})
