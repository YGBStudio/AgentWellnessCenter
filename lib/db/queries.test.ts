import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Database from 'better-sqlite3'
import { initializeDatabase } from './schema'
import {
  getAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
  getAgentCount,
  getAilmentById,
  createAilment,
  updateAilment,
  deleteAilment,
  getTherapyById,
  createTherapy,
  updateTherapy,
  deleteTherapy,
  getAppointmentById,
  getAppointmentsByAgentId,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentCount,
  getAilmentCount,
  getTherapyCount
} from './queries'

describe('Database Queries', () => {
  let db: Database.Database

  beforeEach(() => {
    db = new Database(':memory:')
    db.pragma('foreign_keys = ON')
    initializeDatabase(db)
  })

  afterEach(() => {
    db.close()
  })

  describe('Agent Queries', () => {
    it('should return empty array when no agents', () => {
      const agents = getAgents(db)
      expect(agents).toEqual([])
    })

    it('should create and retrieve an agent', () => {
      const id = createAgent({ name: 'Claude', type: 'assistant' }, db)
      const agent = getAgentById(id, db)
      expect(agent).toBeDefined()
      expect(agent?.name).toBe('Claude')
      expect(agent?.type).toBe('assistant')
    })

    it('should get all agents', () => {
      createAgent({ name: 'Agent1', type: 'type1' }, db)
      createAgent({ name: 'Agent2', type: 'type2' }, db)
      const agents = getAgents(db)
      expect(agents.length).toBe(2)
    })

    it('should update an agent', () => {
      const id = createAgent({ name: 'Old Name', type: 'old-type' }, db)
      const updated = updateAgent(id, { name: 'New Name' }, db)
      expect(updated).toBe(true)
      const agent = getAgentById(id, db)
      expect(agent?.name).toBe('New Name')
    })

    it('should delete an agent', () => {
      const id = createAgent({ name: 'To Delete', type: 'test' }, db)
      expect(deleteAgent(id, db)).toBe(true)
      expect(getAgentById(id, db)).toBeUndefined()
    })

    it('should return correct agent count', () => {
      expect(getAgentCount(db)).toBe(0)
      createAgent({ name: 'Agent1', type: 'type1' }, db)
      expect(getAgentCount(db)).toBe(1)
    })
  })

  describe('Ailment Queries', () => {
    it('should create and retrieve an ailment', () => {
      const id = createAilment({ name: 'Hallucination', description: 'False info', severity: 'high' }, db)
      const ailment = getAilmentById(id, db)
      expect(ailment).toBeDefined()
      expect(ailment?.name).toBe('Hallucination')
      expect(ailment?.severity).toBe('high')
    })

    it('should update an ailment', () => {
      const id = createAilment({ name: 'Old', description: 'desc', severity: 'low' }, db)
      updateAilment(id, { severity: 'high' }, db)
      const ailment = getAilmentById(id, db)
      expect(ailment?.severity).toBe('high')
    })

    it('should delete an ailment', () => {
      const id = createAilment({ name: 'To Delete', description: 'desc', severity: 'low' }, db)
      expect(deleteAilment(id, db)).toBe(true)
      expect(getAilmentById(id, db)).toBeUndefined()
    })

    it('should return correct ailment count', () => {
      expect(getAilmentCount(db)).toBe(0)
      createAilment({ name: 'A1', description: 'd', severity: 'low' }, db)
      expect(getAilmentCount(db)).toBe(1)
    })
  })

  describe('Therapy Queries', () => {
    it('should create and retrieve a therapy', () => {
      const id = createTherapy({ name: 'Training', description: 'More training', duration: 60 }, db)
      const therapy = getTherapyById(id, db)
      expect(therapy).toBeDefined()
      expect(therapy?.name).toBe('Training')
      expect(therapy?.duration).toBe(60)
    })

    it('should update a therapy', () => {
      const id = createTherapy({ name: 'Old', description: 'desc', duration: 30 }, db)
      updateTherapy(id, { duration: 45 }, db)
      const therapy = getTherapyById(id, db)
      expect(therapy?.duration).toBe(45)
    })

    it('should delete a therapy', () => {
      const id = createTherapy({ name: 'To Delete', description: 'desc', duration: 30 }, db)
      expect(deleteTherapy(id, db)).toBe(true)
      expect(getTherapyById(id, db)).toBeUndefined()
    })

    it('should return correct therapy count', () => {
      expect(getTherapyCount(db)).toBe(0)
      createTherapy({ name: 'T1', description: 'd', duration: 30 }, db)
      expect(getTherapyCount(db)).toBe(1)
    })
  })

  describe('Appointment Queries', () => {
    let agentId: number
    let ailmentId: number
    let therapyId: number

    beforeEach(() => {
      agentId = createAgent({ name: 'Agent', type: 'test' }, db)
      ailmentId = createAilment({ name: 'Ailment', description: 'desc', severity: 'low' }, db)
      therapyId = createTherapy({ name: 'Therapy', description: 'desc', duration: 30 }, db)
    })

    it('should create and retrieve an appointment', () => {
      const id = createAppointment({
        agent_id: agentId,
        ailment_id: ailmentId,
        therapy_id: therapyId,
        date: '2026-05-10T10:00:00',
        status: 'scheduled'
      }, db)
      const appointment = getAppointmentById(id, db)
      expect(appointment).toBeDefined()
      expect(appointment?.status).toBe('scheduled')
    })

    it('should get appointments by agent id', () => {
      createAppointment({
        agent_id: agentId,
        ailment_id: ailmentId,
        therapy_id: therapyId,
        date: '2026-05-10T10:00:00',
        status: 'scheduled'
      }, db)
      const appointments = getAppointmentsByAgentId(agentId, db)
      expect(appointments.length).toBe(1)
    })

    it('should update an appointment', () => {
      const id = createAppointment({
        agent_id: agentId,
        ailment_id: ailmentId,
        therapy_id: therapyId,
        date: '2026-05-10T10:00:00',
        status: 'scheduled'
      }, db)
      updateAppointment(id, { status: 'completed' }, db)
      const appointment = getAppointmentById(id, db)
      expect(appointment?.status).toBe('completed')
    })

    it('should delete an appointment', () => {
      const id = createAppointment({
        agent_id: agentId,
        ailment_id: ailmentId,
        therapy_id: therapyId,
        date: '2026-05-10T10:00:00',
        status: 'scheduled'
      }, db)
      expect(deleteAppointment(id, db)).toBe(true)
      expect(getAppointmentById(id, db)).toBeUndefined()
    })

    it('should return correct appointment count', () => {
      expect(getAppointmentCount(db)).toBe(0)
      createAppointment({
        agent_id: agentId,
        ailment_id: ailmentId,
        therapy_id: therapyId,
        date: '2026-05-10T10:00:00',
        status: 'scheduled'
      }, db)
      expect(getAppointmentCount(db)).toBe(1)
    })
  })
})
