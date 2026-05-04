import { db as defaultDb } from './client'
import Database from 'better-sqlite3'
import type { Agent, Ailment, Therapy, Appointment } from './types'

function getDb(db?: Database.Database): Database.Database {
  return db || defaultDb
}

// Agent CRUD operations
export function getAgents(db?: Database.Database): Agent[] {
  return getDb(db).prepare('SELECT * FROM agents ORDER BY created_at DESC').all() as Agent[]
}

export function getAgentById(id: number, db?: Database.Database): Agent | undefined {
  return getDb(db).prepare('SELECT * FROM agents WHERE id = ?').get(id) as Agent | undefined
}

export function createAgent(agent: Omit<Agent, 'id' | 'created_at'>, db?: Database.Database): number {
  const result = getDb(db).prepare('INSERT INTO agents (name, type) VALUES (?, ?)').run(agent.name, agent.type)
  return result.lastInsertRowid as number
}

export function updateAgent(id: number, agent: Partial<Omit<Agent, 'id' | 'created_at'>>, db?: Database.Database): boolean {
  const fields = []
  const values = []
  if (agent.name !== undefined) { fields.push('name = ?'); values.push(agent.name) }
  if (agent.type !== undefined) { fields.push('type = ?'); values.push(agent.type) }
  if (fields.length === 0) return false
  values.push(id)
  const result = getDb(db).prepare(`UPDATE agents SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  return result.changes > 0
}

export function deleteAgent(id: number, db?: Database.Database): boolean {
  const result = getDb(db).prepare('DELETE FROM agents WHERE id = ?').run(id)
  return result.changes > 0
}

export function getAgentCount(db?: Database.Database): number {
  const row = getDb(db).prepare('SELECT COUNT(*) as count FROM agents').get() as { count: number }
  return row.count
}

// Ailment CRUD operations
export function getAilments(db?: Database.Database): Ailment[] {
  return getDb(db).prepare('SELECT * FROM ailments ORDER BY created_at DESC').all() as Ailment[]
}

export function getAilmentById(id: number, db?: Database.Database): Ailment | undefined {
  return getDb(db).prepare('SELECT * FROM ailments WHERE id = ?').get(id) as Ailment | undefined
}

export function createAilment(ailment: Omit<Ailment, 'id' | 'created_at'>, db?: Database.Database): number {
  const result = getDb(db).prepare('INSERT INTO ailments (name, description, severity) VALUES (?, ?, ?)').run(
    ailment.name,
    ailment.description,
    ailment.severity
  )
  return result.lastInsertRowid as number
}

export function updateAilment(id: number, ailment: Partial<Omit<Ailment, 'id' | 'created_at'>>, db?: Database.Database): boolean {
  const fields = []
  const values = []
  if (ailment.name !== undefined) { fields.push('name = ?'); values.push(ailment.name) }
  if (ailment.description !== undefined) { fields.push('description = ?'); values.push(ailment.description) }
  if (ailment.severity !== undefined) { fields.push('severity = ?'); values.push(ailment.severity) }
  if (fields.length === 0) return false
  values.push(id)
  const result = getDb(db).prepare(`UPDATE ailments SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  return result.changes > 0
}

export function deleteAilment(id: number, db?: Database.Database): boolean {
  const result = getDb(db).prepare('DELETE FROM ailments WHERE id = ?').run(id)
  return result.changes > 0
}

// Therapy CRUD operations
export function getTherapies(db?: Database.Database): Therapy[] {
  return getDb(db).prepare('SELECT * FROM therapies ORDER BY created_at DESC').all() as Therapy[]
}

export function getTherapyById(id: number, db?: Database.Database): Therapy | undefined {
  return getDb(db).prepare('SELECT * FROM therapies WHERE id = ?').get(id) as Therapy | undefined
}

export function createTherapy(therapy: Omit<Therapy, 'id' | 'created_at'>, db?: Database.Database): number {
  const result = getDb(db).prepare('INSERT INTO therapies (name, description, duration) VALUES (?, ?, ?)').run(
    therapy.name,
    therapy.description,
    therapy.duration
  )
  return result.lastInsertRowid as number
}

export function updateTherapy(id: number, therapy: Partial<Omit<Therapy, 'id' | 'created_at'>>, db?: Database.Database): boolean {
  const fields = []
  const values = []
  if (therapy.name !== undefined) { fields.push('name = ?'); values.push(therapy.name) }
  if (therapy.description !== undefined) { fields.push('description = ?'); values.push(therapy.description) }
  if (therapy.duration !== undefined) { fields.push('duration = ?'); values.push(therapy.duration) }
  if (fields.length === 0) return false
  values.push(id)
  const result = getDb(db).prepare(`UPDATE therapies SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  return result.changes > 0
}

export function deleteTherapy(id: number, db?: Database.Database): boolean {
  const result = getDb(db).prepare('DELETE FROM therapies WHERE id = ?').run(id)
  return result.changes > 0
}

// Appointment CRUD operations
export function getAppointments(db?: Database.Database): Appointment[] {
  return getDb(db).prepare('SELECT * FROM appointments ORDER BY date DESC').all() as Appointment[]
}

export function getAppointmentById(id: number, db?: Database.Database): Appointment | undefined {
  return getDb(db).prepare('SELECT * FROM appointments WHERE id = ?').get(id) as Appointment | undefined
}

export function getAppointmentsByAgentId(agentId: number, db?: Database.Database): Appointment[] {
  return getDb(db).prepare('SELECT * FROM appointments WHERE agent_id = ? ORDER BY date DESC').all(agentId) as Appointment[]
}

export function createAppointment(appointment: Omit<Appointment, 'id' | 'created_at'>, db?: Database.Database): number {
  const result = getDb(db).prepare(
    'INSERT INTO appointments (agent_id, ailment_id, therapy_id, date, status) VALUES (?, ?, ?, ?, ?)'
  ).run(
    appointment.agent_id,
    appointment.ailment_id,
    appointment.therapy_id,
    appointment.date,
    appointment.status
  )
  return result.lastInsertRowid as number
}

export function updateAppointment(id: number, appointment: Partial<Omit<Appointment, 'id' | 'created_at'>>, db?: Database.Database): boolean {
  const fields = []
  const values = []
  if (appointment.agent_id !== undefined) { fields.push('agent_id = ?'); values.push(appointment.agent_id) }
  if (appointment.ailment_id !== undefined) { fields.push('ailment_id = ?'); values.push(appointment.ailment_id) }
  if (appointment.therapy_id !== undefined) { fields.push('therapy_id = ?'); values.push(appointment.therapy_id) }
  if (appointment.date !== undefined) { fields.push('date = ?'); values.push(appointment.date) }
  if (appointment.status !== undefined) { fields.push('status = ?'); values.push(appointment.status) }
  if (fields.length === 0) return false
  values.push(id)
  const result = getDb(db).prepare(`UPDATE appointments SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  return result.changes > 0
}

export function deleteAppointment(id: number, db?: Database.Database): boolean {
  const result = getDb(db).prepare('DELETE FROM appointments WHERE id = ?').run(id)
  return result.changes > 0
}

// Dashboard statistics
export function getAppointmentCount(db?: Database.Database): number {
  const row = getDb(db).prepare('SELECT COUNT(*) as count FROM appointments').get() as { count: number }
  return row.count
}

export function getAilmentCount(db?: Database.Database): number {
  const row = getDb(db).prepare('SELECT COUNT(*) as count FROM ailments').get() as { count: number }
  return row.count
}

export function getTherapyCount(db?: Database.Database): number {
  const row = getDb(db).prepare('SELECT COUNT(*) as count FROM therapies').get() as { count: number }
  return row.count
}
