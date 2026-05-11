import { getDb } from '../db/client'
import Database from 'better-sqlite3'
import type { User, UserInsert, Agent, Ailment, Therapy, Appointment, AgentInsert, AilmentInsert, TherapyInsert, AppointmentInsert } from '../db/types'

export class QueryService {
  private db: Database.Database

  constructor(db?: Database.Database) {
    this.db = db || getDb()
  }

  getDb(): Database.Database {
    return this.db
  }

  // User operations
  getUserByEmail(email: string): User | undefined {
    return this.getDb().prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined
  }

  createUser(user: UserInsert): number {
    const result = this.getDb().prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)').run(
      user.email,
      user.password_hash,
      user.role
    )
    return result.lastInsertRowid as number
  }

  getUserCount(): number {
    const row = this.getDb().prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }
    return row.count
  }

  // Agent CRUD operations
  getAgents(): Agent[] {
    return this.getDb().prepare('SELECT * FROM agents ORDER BY created_at DESC').all() as Agent[]
  }

  getAgentById(id: number): Agent | undefined {
    return this.getDb().prepare('SELECT * FROM agents WHERE id = ?').get(id) as Agent | undefined
  }

  createAgent(agent: AgentInsert): number {
    const result = this.getDb().prepare('INSERT INTO agents (name, type) VALUES (?, ?)').run(agent.name, agent.type)
    return result.lastInsertRowid as number
  }

  updateAgent(id: number, agent: Partial<AgentInsert>): boolean {
    const fields = []
    const values = []
    if (agent.name !== undefined) { fields.push('name = ?'); values.push(agent.name) }
    if (agent.type !== undefined) { fields.push('type = ?'); values.push(agent.type) }
    if (fields.length === 0) return false
    values.push(id)
    const result = this.getDb().prepare(`UPDATE agents SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    return result.changes > 0
  }

  deleteAgent(id: number): boolean {
    const result = this.getDb().prepare('DELETE FROM agents WHERE id = ?').run(id)
    return result.changes > 0
  }

  getAgentCount(): number {
    const row = this.getDb().prepare('SELECT COUNT(*) as count FROM agents').get() as { count: number }
    return row.count
  }

  hasAgentAppointments(agentId: number): boolean {
    const row = this.getDb().prepare('SELECT COUNT(*) as count FROM appointments WHERE agent_id = ?').get(agentId) as { count: number }
    return row.count > 0
  }

  // Ailment CRUD operations
  getAilments(): Ailment[] {
    return this.getDb().prepare('SELECT * FROM ailments ORDER BY created_at DESC').all() as Ailment[]
  }

  getAilmentById(id: number): Ailment | undefined {
    return this.getDb().prepare('SELECT * FROM ailments WHERE id = ?').get(id) as Ailment | undefined
  }

  createAilment(ailment: AilmentInsert): number {
    const result = this.getDb().prepare('INSERT INTO ailments (name, description, severity) VALUES (?, ?, ?)').run(
      ailment.name,
      ailment.description,
      ailment.severity
    )
    return result.lastInsertRowid as number
  }

  updateAilment(id: number, ailment: Partial<AilmentInsert>): boolean {
    const fields = []
    const values = []
    if (ailment.name !== undefined) { fields.push('name = ?'); values.push(ailment.name) }
    if (ailment.description !== undefined) { fields.push('description = ?'); values.push(ailment.description) }
    if (ailment.severity !== undefined) { fields.push('severity = ?'); values.push(ailment.severity) }
    if (fields.length === 0) return false
    values.push(id)
    const result = this.getDb().prepare(`UPDATE ailments SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    return result.changes > 0
  }

  deleteAilment(id: number): boolean {
    const result = this.getDb().prepare('DELETE FROM ailments WHERE id = ?').run(id)
    return result.changes > 0
  }

  hasAilmentAppointments(ailmentId: number): boolean {
    const row = this.getDb().prepare('SELECT COUNT(*) as count FROM appointments WHERE ailment_id = ?').get(ailmentId) as { count: number }
    return row.count > 0
  }

  // Therapy CRUD operations
  getTherapies(): Therapy[] {
    return this.getDb().prepare('SELECT * FROM therapies ORDER BY created_at DESC').all() as Therapy[]
  }

  getTherapyById(id: number): Therapy | undefined {
    return this.getDb().prepare('SELECT * FROM therapies WHERE id = ?').get(id) as Therapy | undefined
  }

  createTherapy(therapy: TherapyInsert): number {
    const result = this.getDb().prepare('INSERT INTO therapies (name, description, duration) VALUES (?, ?, ?)').run(
      therapy.name,
      therapy.description,
      therapy.duration
    )
    return result.lastInsertRowid as number
  }

  updateTherapy(id: number, therapy: Partial<TherapyInsert>): boolean {
    const fields = []
    const values = []
    if (therapy.name !== undefined) { fields.push('name = ?'); values.push(therapy.name) }
    if (therapy.description !== undefined) { fields.push('description = ?'); values.push(therapy.description) }
    if (therapy.duration !== undefined) { fields.push('duration = ?'); values.push(therapy.duration) }
    if (fields.length === 0) return false
    values.push(id)
    const result = this.getDb().prepare(`UPDATE therapies SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    return result.changes > 0
  }

  deleteTherapy(id: number): boolean {
    const result = this.getDb().prepare('DELETE FROM therapies WHERE id = ?').run(id)
    return result.changes > 0
  }

  hasTherapyAppointments(therapyId: number): boolean {
    const row = this.getDb().prepare('SELECT COUNT(*) as count FROM appointments WHERE therapy_id = ?').get(therapyId) as { count: number }
    return row.count > 0
  }

  // Appointment CRUD operations
  getAppointments(): Appointment[] {
    return this.getDb().prepare('SELECT * FROM appointments ORDER BY date DESC').all() as Appointment[]
  }

  getAppointmentById(id: number): Appointment | undefined {
    return this.getDb().prepare('SELECT * FROM appointments WHERE id = ?').get(id) as Appointment | undefined
  }

  getAppointmentsByAgentId(agentId: number): Appointment[] {
    return this.getDb().prepare('SELECT * FROM appointments WHERE agent_id = ? ORDER BY date DESC').all(agentId) as Appointment[]
  }

  createAppointment(appointment: AppointmentInsert): number {
    const result = this.getDb().prepare(
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

  updateAppointment(id: number, appointment: Partial<AppointmentInsert>): boolean {
    const fields = []
    const values = []
    if (appointment.agent_id !== undefined) { fields.push('agent_id = ?'); values.push(appointment.agent_id) }
    if (appointment.ailment_id !== undefined) { fields.push('ailment_id = ?'); values.push(appointment.ailment_id) }
    if (appointment.therapy_id !== undefined) { fields.push('therapy_id = ?'); values.push(appointment.therapy_id) }
    if (appointment.date !== undefined) { fields.push('date = ?'); values.push(appointment.date) }
    if (appointment.status !== undefined) { fields.push('status = ?'); values.push(appointment.status) }
    if (fields.length === 0) return false
    values.push(id)
    const result = this.getDb().prepare(`UPDATE appointments SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    return result.changes > 0
  }

  deleteAppointment(id: number): boolean {
    const result = this.getDb().prepare('DELETE FROM appointments WHERE id = ?').run(id)
    return result.changes > 0
  }

  // Dashboard statistics
  getAppointmentCount(): number {
    const row = this.getDb().prepare('SELECT COUNT(*) as count FROM appointments').get() as { count: number }
    return row.count
  }

  getAilmentCount(): number {
    const row = this.getDb().prepare('SELECT COUNT(*) as count FROM ailments').get() as { count: number }
    return row.count
  }

  getTherapyCount(): number {
    const row = this.getDb().prepare('SELECT COUNT(*) as count FROM therapies').get() as { count: number }
    return row.count
  }

  // Availability checking
  checkAppointmentConflict(agentId: number, date: string): boolean {
    const row = this.getDb().prepare(
      'SELECT COUNT(*) as count FROM appointments WHERE agent_id = ? AND date = ? AND status != ?'
    ).get(agentId, date, 'cancelled') as { count: number }
    return row.count > 0
  }
}