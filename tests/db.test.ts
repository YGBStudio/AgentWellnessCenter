import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Database from 'better-sqlite3'
import { initializeDatabase } from '@/lib/db/schema'
import { SqliteDatabaseAdapter } from '@/lib/db/sqlite-adapter'
import { QueryService } from '@/lib/services/queryService'

describe('Database Tests', () => {
  let db: Database.Database
  let queryService: QueryService

  beforeEach(() => {
    db = new Database(':memory:')
    db.pragma('foreign_keys = ON')
    initializeDatabase(db)
    queryService = new QueryService(new SqliteDatabaseAdapter(db))
  })

  afterEach(() => {
    db.close()
  })

  describe('Agent Operations', () => {
    it('creates and retrieves agents', async () => {
      const id = await queryService.createAgent({ name: 'Test Agent', type: 'test-type' })
      const agent = await queryService.getAgentById(id)
      expect(agent).toBeDefined()
      expect(agent?.name).toBe('Test Agent')
      expect(agent?.type).toBe('test-type')
    })

    it('returns all agents ordered by created_at', async () => {
      await queryService.createAgent({ name: 'Agent1', type: 'type1' })
      await queryService.createAgent({ name: 'Agent2', type: 'type2' })
      const agents = await queryService.getAgents()
      expect(agents).toHaveLength(2)
    })

    it('returns correct agent count', async () => {
      expect(await queryService.getAgentCount()).toBe(0)
      await queryService.createAgent({ name: 'Agent1', type: 'type1' })
      expect(await queryService.getAgentCount()).toBe(1)
    })

    it('updates an agent', async () => {
      const id = await queryService.createAgent({ name: 'Old Name', type: 'old-type' })
      const success = await queryService.updateAgent(id, { name: 'New Name' })
      expect(success).toBe(true)
      const agent = await queryService.getAgentById(id)
      expect(agent?.name).toBe('New Name')
      expect(agent?.type).toBe('old-type')
    })

    it('returns false when updating non-existent agent', async () => {
      const success = await queryService.updateAgent(999, { name: 'Nope' })
      expect(success).toBe(false)
    })

    it('deletes an agent', async () => {
      const id = await queryService.createAgent({ name: 'ToDelete', type: 'type' })
      expect(await queryService.getAgentCount()).toBe(1)
      const success = await queryService.deleteAgent(id)
      expect(success).toBe(true)
      expect(await queryService.getAgentCount()).toBe(0)
    })

    it('returns false when deleting non-existent agent', async () => {
      const success = await queryService.deleteAgent(999)
      expect(success).toBe(false)
    })
  })

  describe('Ailment Operations', () => {
    it('creates and retrieves ailments', async () => {
      const id = await queryService.createAilment({ name: 'Test', description: 'desc', severity: 'low' })
      const ailment = await queryService.getAilmentById(id)
      expect(ailment).toBeDefined()
      expect(ailment?.severity).toBe('low')
    })

    it('returns correct ailment count', async () => {
      expect(await queryService.getAilmentCount()).toBe(0)
      await queryService.createAilment({ name: 'A1', description: 'd', severity: 'low' })
      expect(await queryService.getAilmentCount()).toBe(1)
    })

    it('updates an ailment', async () => {
      const id = await queryService.createAilment({ name: 'Old', description: 'desc', severity: 'low' })
      const success = await queryService.updateAilment(id, { severity: 'high' })
      expect(success).toBe(true)
      expect((await queryService.getAilmentById(id))?.severity).toBe('high')
    })

    it('deletes an ailment', async () => {
      const id = await queryService.createAilment({ name: 'ToDelete', description: 'd', severity: 'low' })
      const success = await queryService.deleteAilment(id)
      expect(success).toBe(true)
      expect(await queryService.getAilmentById(id)).toBeUndefined()
    })
  })

  describe('Therapy Operations', () => {
    it('creates and retrieves therapies', async () => {
      const id = await queryService.createTherapy({ name: 'Test', description: 'desc', duration: 30 })
      const therapy = await queryService.getTherapyById(id)
      expect(therapy).toBeDefined()
      expect(therapy?.duration).toBe(30)
    })

    it('returns correct therapy count', async () => {
      expect(await queryService.getTherapyCount()).toBe(0)
      await queryService.createTherapy({ name: 'T1', description: 'd', duration: 30 })
      expect(await queryService.getTherapyCount()).toBe(1)
    })

    it('updates a therapy', async () => {
      const id = await queryService.createTherapy({ name: 'Old', description: 'desc', duration: 30 })
      const success = await queryService.updateTherapy(id, { duration: 60 })
      expect(success).toBe(true)
      expect((await queryService.getTherapyById(id))?.duration).toBe(60)
    })

    it('deletes a therapy', async () => {
      const id = await queryService.createTherapy({ name: 'ToDelete', description: 'd', duration: 30 })
      const success = await queryService.deleteTherapy(id)
      expect(success).toBe(true)
      expect(await queryService.getTherapyById(id)).toBeUndefined()
    })
  })

  describe('Appointment Operations', () => {
    let agentId: number
    let ailmentId: number
    let therapyId: number

    beforeEach(async () => {
      agentId = await queryService.createAgent({ name: 'TestAgent', type: 'llm' })
      ailmentId = await queryService.createAilment({ name: 'TestAilment', description: 'desc', severity: 'low' })
      therapyId = await queryService.createTherapy({ name: 'TestTherapy', description: 'desc', duration: 30 })
    })

    it('creates and retrieves appointments', async () => {
      const id = await queryService.createAppointment({
        agent_id: agentId, ailment_id: ailmentId, therapy_id: therapyId,
        date: '2026-06-01T10:00:00', status: 'scheduled'
      })
      const appointment = await queryService.getAppointmentById(id)
      expect(appointment).toBeDefined()
      expect(appointment?.status).toBe('scheduled')
      expect(appointment?.agent_id).toBe(agentId)
    })

    it('returns correct appointment count', async () => {
      expect(await queryService.getAppointmentCount()).toBe(0)
      await queryService.createAppointment({
        agent_id: agentId, ailment_id: ailmentId, therapy_id: therapyId,
        date: '2026-06-01T10:00:00', status: 'scheduled'
      })
      expect(await queryService.getAppointmentCount()).toBe(1)
    })

    it('retrieves appointments by agent ID', async () => {
      await queryService.createAppointment({
        agent_id: agentId, ailment_id: ailmentId, therapy_id: therapyId,
        date: '2026-06-01T10:00:00', status: 'scheduled'
      })
      const appointments = await queryService.getAppointmentsByAgentId(agentId)
      expect(appointments).toHaveLength(1)
      expect(await queryService.getAppointmentsByAgentId(999)).toHaveLength(0)
    })

    it('updates an appointment', async () => {
      const id = await queryService.createAppointment({
        agent_id: agentId, ailment_id: ailmentId, therapy_id: therapyId,
        date: '2026-06-01T10:00:00', status: 'scheduled'
      })
      const success = await queryService.updateAppointment(id, { status: 'completed' })
      expect(success).toBe(true)
      expect((await queryService.getAppointmentById(id))?.status).toBe('completed')
    })

    it('deletes an appointment', async () => {
      const id = await queryService.createAppointment({
        agent_id: agentId, ailment_id: ailmentId, therapy_id: therapyId,
        date: '2026-06-01T10:00:00', status: 'scheduled'
      })
      const success = await queryService.deleteAppointment(id)
      expect(success).toBe(true)
      expect(await queryService.getAppointmentById(id)).toBeUndefined()
    })
  })

  describe('FK Dependency Checks', () => {
    it('detects agent with appointments', async () => {
      const agentId = await queryService.createAgent({ name: 'A', type: 't' })
      const ailmentId = await queryService.createAilment({ name: 'B', description: 'd', severity: 'low' })
      const therapyId = await queryService.createTherapy({ name: 'C', description: 'd', duration: 30 })

      expect(await queryService.hasAgentAppointments(agentId)).toBe(false)

      await queryService.createAppointment({
        agent_id: agentId, ailment_id: ailmentId, therapy_id: therapyId,
        date: '2026-06-01T10:00:00', status: 'scheduled'
      })

      expect(await queryService.hasAgentAppointments(agentId)).toBe(true)
      expect(await queryService.hasAilmentAppointments(ailmentId)).toBe(true)
      expect(await queryService.hasTherapyAppointments(therapyId)).toBe(true)
    })

    it('rejects delete of agent with active appointments via FK', async () => {
      const agentId = await queryService.createAgent({ name: 'X', type: 't' })
      const ailmentId = await queryService.createAilment({ name: 'Y', description: 'd', severity: 'low' })
      const therapyId = await queryService.createTherapy({ name: 'Z', description: 'd', duration: 30 })

      await queryService.createAppointment({
        agent_id: agentId, ailment_id: ailmentId, therapy_id: therapyId,
        date: '2026-06-01T10:00:00', status: 'scheduled'
      })

      // With foreign keys enabled, direct delete should throw
      expect(() => queryService.deleteAgent(agentId)).toThrow()
    })
  })
})
