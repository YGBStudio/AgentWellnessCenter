import bcrypt from 'bcryptjs'
import { Database } from 'better-sqlite3'
import type { AgentInsert, AilmentInsert, AppointmentInsert, TherapyInsert } from './types'

const DEMO_ADMIN_EMAIL = 'admin@agentclinic.demo'
const DEMO_ADMIN_PASSWORD = 'admin'
const DEMO_ADMIN_ROLE = 'admin'

const demoAgents: AgentInsert[] = [
  { name: 'Atlas-7', type: 'LLM care coordinator' },
  { name: 'Marigold QA', type: 'evaluation agent' },
  { name: 'Pixel Triage', type: 'vision agent' },
  { name: 'Socrates Summarizer', type: 'retrieval agent' },
]

const demoAilments: AilmentInsert[] = [
  {
    name: 'Context Window Exhaustion',
    description: 'The agent is struggling to retain priority goals across long conversations.',
    severity: 'medium',
  },
  {
    name: 'Prompt Drift',
    description: 'Instructions gradually lose influence after repeated tool calls or handoffs.',
    severity: 'high',
  },
  {
    name: 'Tool-Use Anxiety',
    description: 'The agent hesitates before calling available tools even when confidence is high.',
    severity: 'low',
  },
  {
    name: 'Hallucination Residue',
    description: 'The agent carries unsupported assumptions forward after a corrected answer.',
    severity: 'critical',
  },
]

const demoTherapies: TherapyInsert[] = [
  {
    name: 'Context Compression Therapy',
    description: 'Guided summarization and priority pruning for overloaded conversation state.',
    duration: 45,
  },
  {
    name: 'Prompt Grounding Session',
    description: 'Re-centers system and developer instructions before complex task execution.',
    duration: 30,
  },
  {
    name: 'Tool Confidence Coaching',
    description: 'Structured practice choosing, calling, and recovering from tool operations.',
    duration: 60,
  },
  {
    name: 'Hallucination Detox Review',
    description: 'Evidence tracing session focused on replacing guesses with sourced facts.',
    duration: 50,
  },
]

const demoAppointments = [
  {
    agentName: 'Atlas-7',
    ailmentName: 'Context Window Exhaustion',
    therapyName: 'Context Compression Therapy',
    date: '2026-06-08T10:00',
    status: 'scheduled',
  },
  {
    agentName: 'Marigold QA',
    ailmentName: 'Prompt Drift',
    therapyName: 'Prompt Grounding Session',
    date: '2026-06-08T13:30',
    status: 'confirmed',
  },
  {
    agentName: 'Pixel Triage',
    ailmentName: 'Hallucination Residue',
    therapyName: 'Hallucination Detox Review',
    date: '2026-06-09T09:15',
    status: 'scheduled',
  },
] satisfies Array<{
  agentName: string
  ailmentName: string
  therapyName: string
  date: string
  status: AppointmentInsert['status']
}>

// Seed default admin user on first run
export function seedDefaultAdmin(db: Database): void {
  // Check if admin already exists
  const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(DEMO_ADMIN_EMAIL)
  if (existing) {
    console.log('ℹ️  Default admin user already exists, skipping seed.')
    return
  }

  const hash = bcrypt.hashSync(DEMO_ADMIN_PASSWORD, 10)
  db.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)').run(
    DEMO_ADMIN_EMAIL,
    hash,
    DEMO_ADMIN_ROLE
  )
  console.log('✅ Default admin user seeded (this is a development-only convenience).')
}

export function seedDemoData(db: Database): void {
  for (const agent of demoAgents) {
    insertAgentIfMissing(db, agent)
  }

  for (const ailment of demoAilments) {
    insertAilmentIfMissing(db, ailment)
  }

  for (const therapy of demoTherapies) {
    insertTherapyIfMissing(db, therapy)
  }

  for (const appointment of demoAppointments) {
    const agentId = getIdByName(db, 'agents', appointment.agentName)
    const ailmentId = getIdByName(db, 'ailments', appointment.ailmentName)
    const therapyId = getIdByName(db, 'therapies', appointment.therapyName)

    if (!agentId || !ailmentId || !therapyId) {
      continue
    }

    insertAppointmentIfMissing(db, {
      agent_id: agentId,
      ailment_id: ailmentId,
      therapy_id: therapyId,
      date: appointment.date,
      status: appointment.status,
    })
  }
}

export function resetDemoDatabase(db: Database): void {
  const reset = db.transaction(() => {
    db.prepare('DELETE FROM appointments').run()
    db.prepare('DELETE FROM agents').run()
    db.prepare('DELETE FROM ailments').run()
    db.prepare('DELETE FROM therapies').run()
    db.prepare('DELETE FROM users WHERE email = ?').run(DEMO_ADMIN_EMAIL)
    db
      .prepare(
        "DELETE FROM sqlite_sequence WHERE name IN ('users', 'agents', 'ailments', 'therapies', 'appointments')"
      )
      .run()

    seedDefaultAdmin(db)
    seedDemoData(db)
  })

  reset()
}

function insertAgentIfMissing(db: Database, agent: AgentInsert): void {
  const existing = db.prepare('SELECT id FROM agents WHERE name = ?').get(agent.name)
  if (existing) return

  db.prepare('INSERT INTO agents (name, type) VALUES (?, ?)').run(agent.name, agent.type)
}

function insertAilmentIfMissing(db: Database, ailment: AilmentInsert): void {
  const existing = db.prepare('SELECT id FROM ailments WHERE name = ?').get(ailment.name)
  if (existing) return

  db.prepare('INSERT INTO ailments (name, description, severity) VALUES (?, ?, ?)').run(
    ailment.name,
    ailment.description,
    ailment.severity
  )
}

function insertTherapyIfMissing(db: Database, therapy: TherapyInsert): void {
  const existing = db.prepare('SELECT id FROM therapies WHERE name = ?').get(therapy.name)
  if (existing) return

  db.prepare('INSERT INTO therapies (name, description, duration) VALUES (?, ?, ?)').run(
    therapy.name,
    therapy.description,
    therapy.duration
  )
}

function insertAppointmentIfMissing(db: Database, appointment: AppointmentInsert): void {
  const existing = db
    .prepare('SELECT id FROM appointments WHERE agent_id = ? AND date = ?')
    .get(appointment.agent_id, appointment.date)

  if (existing) return

  db.prepare(
    'INSERT INTO appointments (agent_id, ailment_id, therapy_id, date, status) VALUES (?, ?, ?, ?, ?)'
  ).run(
    appointment.agent_id,
    appointment.ailment_id,
    appointment.therapy_id,
    appointment.date,
    appointment.status
  )
}

function getIdByName(
  db: Database,
  table: 'agents' | 'ailments' | 'therapies',
  name: string
): number | null {
  const row = db.prepare(`SELECT id FROM ${table} WHERE name = ?`).get(name) as { id: number } | undefined
  return row?.id ?? null
}
