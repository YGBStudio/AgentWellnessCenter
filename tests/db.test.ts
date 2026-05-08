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
      expect(agent?.type).toBe('test-type')
    })

    it('returns all agents ordered by created_at', () => {
      queryService.createAgent({ name: 'Agent1', type: 'type1' })
      queryService.createAgent({ name: 'Agent2', type: 'type2' })
      const agents = queryService.getAgents()
      expect(agents).toHaveLength(2)
    })

    it('returns correct agent count', () => {
      expect(queryService.getAgentCount()).toBe(0)
      queryService.createAgent({ name: 'Agent1', type: 'type1' })
      expect(queryService.getAgentCount()).toBe(1)
    })

    it('updates an agent', () => {
      const id = queryService.createAgent({ name: 'Old Name', type: 'old-type' })
      const success = queryService.updateAgent(id, { name: 'New Name' })
      expect(success).toBe(true)
      const agent = queryService.getAgentById(id)
      expect(agent?.name).toBe('New Name')
      expect(agent?.type).toBe('old-type')
    })

    it('returns false when updating non-existent agent', () => {
      const success = queryService.updateAgent(999, { name: 'Nope' })
      expect(success).toBe(false)
    })

    it('deletes an agent', () => {
      const id = queryService.createAgent({ name: 'ToDelete', type: 'type' })
      expect(queryService.getAgentCount()).toBe(1)
      const success = queryService.deleteAgent(id)
      expect(success).toBe(true)
      expect(queryService.getAgentCount()).toBe(0)
    })

    it('returns false when deleting non-existent agent', () => {
      const success = queryService.deleteAgent(999)
      expect(success).toBe(false)
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

    it('updates an ailment', () => {
      const id = queryService.createAilment({ name: 'Old', description: 'desc', severity: 'low' })
      const success = queryService.updateAilment(id, { severity: 'high' })
      expect(success).toBe(true)
      expect(queryService.getAilmentById(id)?.severity).toBe('high')
    })

    it('deletes an ailment', () => {
      const id = queryService.createAilment({ name: 'ToDelete', description: 'd', severity: 'low' })
      const success = queryService.deleteAilment(id)
      expect(success).toBe(true)
      expect(queryService.getAilmentById(id)).toBeUndefined()
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

    it('updates a therapy', () => {
      const id = queryService.createTherapy({ name: 'Old', description: 'desc', duration: 30 })
      const success = queryService.updateTherapy(id, { duration: 60 })
      expect(success).toBe(true)
      expect(queryService.getTherapyById(id)?.duration).toBe(60)
    })

    it('deletes a therapy', () => {
      const id = queryService.createTherapy({ name: 'ToDelete', description: 'd', duration: 30 })
      const success = queryService.deleteTherapy(id)
      expect(success).toBe(true)
      expect(queryService.getTherapyById(id)).toBeUndefined()
    })
  })

  describe('Appointment Operations', () => {
    let agentId: number
    let ailmentId: number
    let therapyId: number

    beforeEach(() => {
      agentId = queryService.createAgent({ name: 'TestAgent', type: 'llm' })
      ailmentId = queryService.createAilment({ name: 'TestAilment', description: 'desc', severity: 'low' })
      therapyId = queryService.createTherapy({ name: 'TestTherapy', description: 'desc', duration: 30 })
    })

    it('creates and retrieves appointments', () => {
      const id = queryService.createAppointment({
        agent_id: agentId, ailment_id: ailmentId, therapy_id: therapyId,
        date: '2026-06-01T10:00:00', status: 'scheduled'
      })
      const appointment = queryService.getAppointmentById(id)
      expect(appointment).toBeDefined()
      expect(appointment?.status).toBe('scheduled')
      expect(appointment?.agent_id).toBe(agentId)
    })

    it('returns correct appointment count', () => {
      expect(queryService.getAppointmentCount()).toBe(0)
      queryService.createAppointment({
        agent_id: agentId, ailment_id: ailmentId, therapy_id: therapyId,
        date: '2026-06-01T10:00:00', status: 'scheduled'
      })
      expect(queryService.getAppointmentCount()).toBe(1)
    })

    it('retrieves appointments by agent ID', () => {
      queryService.createAppointment({
        agent_id: agentId, ailment_id: ailmentId, therapy_id: therapyId,
        date: '2026-06-01T10:00:00', status: 'scheduled'
      })
      const appointments = queryService.getAppointmentsByAgentId(agentId)
      expect(appointments).toHaveLength(1)
      expect(queryService.getAppointmentsByAgentId(999)).toHaveLength(0)
    })

    it('updates an appointment', () => {
      const id = queryService.createAppointment({
        agent_id: agentId, ailment_id: ailmentId, therapy_id: therapyId,
        date: '2026-06-01T10:00:00', status: 'scheduled'
      })
      const success = queryService.updateAppointment(id, { status: 'completed' })
      expect(success).toBe(true)
      expect(queryService.getAppointmentById(id)?.status).toBe('completed')
    })

    it('deletes an appointment', () => {
      const id = queryService.createAppointment({
        agent_id: agentId, ailment_id: ailmentId, therapy_id: therapyId,
        date: '2026-06-01T10:00:00', status: 'scheduled'
      })
      const success = queryService.deleteAppointment(id)
      expect(success).toBe(true)
      expect(queryService.getAppointmentById(id)).toBeUndefined()
    })
  })

  describe('FK Dependency Checks', () => {
    it('detects agent with appointments', () => {
      const agentId = queryService.createAgent({ name: 'A', type: 't' })
      const ailmentId = queryService.createAilment({ name: 'B', description: 'd', severity: 'low' })
      const therapyId = queryService.createTherapy({ name: 'C', description: 'd', duration: 30 })

      expect(queryService.hasAgentAppointments(agentId)).toBe(false)

      queryService.createAppointment({
        agent_id: agentId, ailment_id: ailmentId, therapy_id: therapyId,
        date: '2026-06-01T10:00:00', status: 'scheduled'
      })

      expect(queryService.hasAgentAppointments(agentId)).toBe(true)
      expect(queryService.hasAilmentAppointments(ailmentId)).toBe(true)
      expect(queryService.hasTherapyAppointments(therapyId)).toBe(true)
    })

    it('rejects delete of agent with active appointments via FK', () => {
      const agentId = queryService.createAgent({ name: 'X', type: 't' })
      const ailmentId = queryService.createAilment({ name: 'Y', description: 'd', severity: 'low' })
      const therapyId = queryService.createTherapy({ name: 'Z', description: 'd', duration: 30 })

      queryService.createAppointment({
        agent_id: agentId, ailment_id: ailmentId, therapy_id: therapyId,
        date: '2026-06-01T10:00:00', status: 'scheduled'
      })

      // With foreign keys enabled, direct delete should throw
      expect(() => queryService.deleteAgent(agentId)).toThrow()
    })
  })
})
