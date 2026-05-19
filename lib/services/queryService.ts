import type { AppDatabase, MaybePromise, QueryRunResult, SqlValue } from '../db/adapter'
import type {
  User,
  UserInsert,
  Agent,
  Ailment,
  Therapy,
  Appointment,
  AgentInsert,
  AilmentInsert,
  TherapyInsert,
  AppointmentInsert,
} from '../db/types'

export class QueryService {
  constructor(private readonly db: AppDatabase) {}

  getDb(): AppDatabase {
    return this.db
  }

  getUserByEmail(email: string): MaybePromise<User | undefined> {
    return this.getDb().first<User>('SELECT * FROM users WHERE email = ?', [email])
  }

  createUser(user: UserInsert): MaybePromise<number> {
    return lastInsertId(
      this.getDb().run('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)', [
        user.email,
        user.password_hash,
        user.role,
      ])
    )
  }

  getUserCount(): MaybePromise<number> {
    return count(this.getDb().first<{ count: number }>('SELECT COUNT(*) as count FROM users'))
  }

  getAgents(): MaybePromise<Agent[]> {
    return this.getDb().all<Agent>('SELECT * FROM agents ORDER BY created_at DESC')
  }

  getAgentById(id: number): MaybePromise<Agent | undefined> {
    return this.getDb().first<Agent>('SELECT * FROM agents WHERE id = ?', [id])
  }

  createAgent(agent: AgentInsert): MaybePromise<number> {
    return lastInsertId(this.getDb().run('INSERT INTO agents (name, type) VALUES (?, ?)', [agent.name, agent.type]))
  }

  updateAgent(id: number, agent: Partial<AgentInsert>): MaybePromise<boolean> {
    const fields: string[] = []
    const values: SqlValue[] = []
    if (agent.name !== undefined) {
      fields.push('name = ?')
      values.push(agent.name)
    }
    if (agent.type !== undefined) {
      fields.push('type = ?')
      values.push(agent.type)
    }
    if (fields.length === 0) return false

    values.push(id)
    return changed(this.getDb().run(`UPDATE agents SET ${fields.join(', ')} WHERE id = ?`, values))
  }

  deleteAgent(id: number): MaybePromise<boolean> {
    return changed(this.getDb().run('DELETE FROM agents WHERE id = ?', [id]))
  }

  getAgentCount(): MaybePromise<number> {
    return count(this.getDb().first<{ count: number }>('SELECT COUNT(*) as count FROM agents'))
  }

  hasAgentAppointments(agentId: number): MaybePromise<boolean> {
    return hasRows(
      this.getDb().first<{ count: number }>('SELECT COUNT(*) as count FROM appointments WHERE agent_id = ?', [
        agentId,
      ])
    )
  }

  getAilments(): MaybePromise<Ailment[]> {
    return this.getDb().all<Ailment>('SELECT * FROM ailments ORDER BY created_at DESC')
  }

  getAilmentById(id: number): MaybePromise<Ailment | undefined> {
    return this.getDb().first<Ailment>('SELECT * FROM ailments WHERE id = ?', [id])
  }

  createAilment(ailment: AilmentInsert): MaybePromise<number> {
    return lastInsertId(
      this.getDb().run('INSERT INTO ailments (name, description, severity) VALUES (?, ?, ?)', [
        ailment.name,
        ailment.description,
        ailment.severity,
      ])
    )
  }

  updateAilment(id: number, ailment: Partial<AilmentInsert>): MaybePromise<boolean> {
    const fields: string[] = []
    const values: SqlValue[] = []
    if (ailment.name !== undefined) {
      fields.push('name = ?')
      values.push(ailment.name)
    }
    if (ailment.description !== undefined) {
      fields.push('description = ?')
      values.push(ailment.description)
    }
    if (ailment.severity !== undefined) {
      fields.push('severity = ?')
      values.push(ailment.severity)
    }
    if (fields.length === 0) return false

    values.push(id)
    return changed(this.getDb().run(`UPDATE ailments SET ${fields.join(', ')} WHERE id = ?`, values))
  }

  deleteAilment(id: number): MaybePromise<boolean> {
    return changed(this.getDb().run('DELETE FROM ailments WHERE id = ?', [id]))
  }

  hasAilmentAppointments(ailmentId: number): MaybePromise<boolean> {
    return hasRows(
      this.getDb().first<{ count: number }>('SELECT COUNT(*) as count FROM appointments WHERE ailment_id = ?', [
        ailmentId,
      ])
    )
  }

  getTherapies(): MaybePromise<Therapy[]> {
    return this.getDb().all<Therapy>('SELECT * FROM therapies ORDER BY created_at DESC')
  }

  getTherapyById(id: number): MaybePromise<Therapy | undefined> {
    return this.getDb().first<Therapy>('SELECT * FROM therapies WHERE id = ?', [id])
  }

  createTherapy(therapy: TherapyInsert): MaybePromise<number> {
    return lastInsertId(
      this.getDb().run('INSERT INTO therapies (name, description, duration) VALUES (?, ?, ?)', [
        therapy.name,
        therapy.description,
        therapy.duration,
      ])
    )
  }

  updateTherapy(id: number, therapy: Partial<TherapyInsert>): MaybePromise<boolean> {
    const fields: string[] = []
    const values: SqlValue[] = []
    if (therapy.name !== undefined) {
      fields.push('name = ?')
      values.push(therapy.name)
    }
    if (therapy.description !== undefined) {
      fields.push('description = ?')
      values.push(therapy.description)
    }
    if (therapy.duration !== undefined) {
      fields.push('duration = ?')
      values.push(therapy.duration)
    }
    if (fields.length === 0) return false

    values.push(id)
    return changed(this.getDb().run(`UPDATE therapies SET ${fields.join(', ')} WHERE id = ?`, values))
  }

  deleteTherapy(id: number): MaybePromise<boolean> {
    return changed(this.getDb().run('DELETE FROM therapies WHERE id = ?', [id]))
  }

  hasTherapyAppointments(therapyId: number): MaybePromise<boolean> {
    return hasRows(
      this.getDb().first<{ count: number }>('SELECT COUNT(*) as count FROM appointments WHERE therapy_id = ?', [
        therapyId,
      ])
    )
  }

  getAppointments(): MaybePromise<Appointment[]> {
    return this.getDb().all<Appointment>('SELECT * FROM appointments ORDER BY date DESC')
  }

  getAppointmentById(id: number): MaybePromise<Appointment | undefined> {
    return this.getDb().first<Appointment>('SELECT * FROM appointments WHERE id = ?', [id])
  }

  getAppointmentsByAgentId(agentId: number): MaybePromise<Appointment[]> {
    return this.getDb().all<Appointment>('SELECT * FROM appointments WHERE agent_id = ? ORDER BY date DESC', [
      agentId,
    ])
  }

  createAppointment(appointment: AppointmentInsert): MaybePromise<number> {
    return lastInsertId(
      this.getDb().run('INSERT INTO appointments (agent_id, ailment_id, therapy_id, date, status) VALUES (?, ?, ?, ?, ?)', [
        appointment.agent_id,
        appointment.ailment_id,
        appointment.therapy_id,
        appointment.date,
        appointment.status,
      ])
    )
  }

  updateAppointment(id: number, appointment: Partial<AppointmentInsert>): MaybePromise<boolean> {
    const fields: string[] = []
    const values: SqlValue[] = []
    if (appointment.agent_id !== undefined) {
      fields.push('agent_id = ?')
      values.push(appointment.agent_id)
    }
    if (appointment.ailment_id !== undefined) {
      fields.push('ailment_id = ?')
      values.push(appointment.ailment_id)
    }
    if (appointment.therapy_id !== undefined) {
      fields.push('therapy_id = ?')
      values.push(appointment.therapy_id)
    }
    if (appointment.date !== undefined) {
      fields.push('date = ?')
      values.push(appointment.date)
    }
    if (appointment.status !== undefined) {
      fields.push('status = ?')
      values.push(appointment.status)
    }
    if (fields.length === 0) return false

    values.push(id)
    return changed(this.getDb().run(`UPDATE appointments SET ${fields.join(', ')} WHERE id = ?`, values))
  }

  deleteAppointment(id: number): MaybePromise<boolean> {
    return changed(this.getDb().run('DELETE FROM appointments WHERE id = ?', [id]))
  }

  getAppointmentCount(): MaybePromise<number> {
    return count(this.getDb().first<{ count: number }>('SELECT COUNT(*) as count FROM appointments'))
  }

  getAilmentCount(): MaybePromise<number> {
    return count(this.getDb().first<{ count: number }>('SELECT COUNT(*) as count FROM ailments'))
  }

  getTherapyCount(): MaybePromise<number> {
    return count(this.getDb().first<{ count: number }>('SELECT COUNT(*) as count FROM therapies'))
  }

  checkAppointmentConflict(agentId: number, date: string): MaybePromise<boolean> {
    return hasRows(
      this.getDb().first<{ count: number }>(
        'SELECT COUNT(*) as count FROM appointments WHERE agent_id = ? AND date = ? AND status != ?',
        [agentId, date, 'cancelled']
      )
    )
  }
}

function lastInsertId(result: MaybePromise<QueryRunResult>): MaybePromise<number> {
  return mapMaybePromise(result, (value) => value.lastInsertRowid ?? 0)
}

function changed(result: MaybePromise<QueryRunResult>): MaybePromise<boolean> {
  return mapMaybePromise(result, (value) => value.changes > 0)
}

function count(result: MaybePromise<{ count: number } | undefined>): MaybePromise<number> {
  return mapMaybePromise(result, (row) => row?.count ?? 0)
}

function hasRows(result: MaybePromise<{ count: number } | undefined>): MaybePromise<boolean> {
  return mapMaybePromise(result, (row) => (row?.count ?? 0) > 0)
}

function mapMaybePromise<T, U>(value: MaybePromise<T>, mapper: (value: T) => U): MaybePromise<U> {
  return isPromise(value) ? value.then(mapper) : mapper(value)
}

function isPromise<T>(value: MaybePromise<T>): value is Promise<T> {
  return (
    value !== null &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof (value as Promise<T>).then === 'function'
  )
}
