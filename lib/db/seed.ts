import { hashPassword } from '../auth/utils'
import type { AppDatabase } from './adapter'
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

export async function seedDefaultAdmin(db: AppDatabase): Promise<void> {
  const existing = await db.first('SELECT * FROM users WHERE email = ?', [DEMO_ADMIN_EMAIL])
  if (existing) {
    return
  }

  const hash = await hashPassword(DEMO_ADMIN_PASSWORD)
  await db.run('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)', [
    DEMO_ADMIN_EMAIL,
    hash,
    DEMO_ADMIN_ROLE,
  ])
}

export async function seedDemoData(db: AppDatabase): Promise<void> {
  for (const agent of demoAgents) {
    await insertAgentIfMissing(db, agent)
  }

  for (const ailment of demoAilments) {
    await insertAilmentIfMissing(db, ailment)
  }

  for (const therapy of demoTherapies) {
    await insertTherapyIfMissing(db, therapy)
  }

  for (const appointment of demoAppointments) {
    const agentId = await getIdByName(db, 'agents', appointment.agentName)
    const ailmentId = await getIdByName(db, 'ailments', appointment.ailmentName)
    const therapyId = await getIdByName(db, 'therapies', appointment.therapyName)

    if (!agentId || !ailmentId || !therapyId) {
      continue
    }

    await insertAppointmentIfMissing(db, {
      agent_id: agentId,
      ailment_id: ailmentId,
      therapy_id: therapyId,
      date: appointment.date,
      status: appointment.status,
    })
  }
}

export async function resetDemoDatabase(db: AppDatabase): Promise<void> {
  await db.run('DELETE FROM appointments')
  await db.run('DELETE FROM agents')
  await db.run('DELETE FROM ailments')
  await db.run('DELETE FROM therapies')
  await db.run('DELETE FROM users WHERE email = ?', [DEMO_ADMIN_EMAIL])
  await db.run(
    "DELETE FROM sqlite_sequence WHERE name IN ('users', 'agents', 'ailments', 'therapies', 'appointments')"
  )

  await seedDefaultAdmin(db)
  await seedDemoData(db)
}

async function insertAgentIfMissing(db: AppDatabase, agent: AgentInsert): Promise<void> {
  const existing = await db.first('SELECT id FROM agents WHERE name = ?', [agent.name])
  if (existing) return

  await db.run('INSERT INTO agents (name, type) VALUES (?, ?)', [agent.name, agent.type])
}

async function insertAilmentIfMissing(db: AppDatabase, ailment: AilmentInsert): Promise<void> {
  const existing = await db.first('SELECT id FROM ailments WHERE name = ?', [ailment.name])
  if (existing) return

  await db.run('INSERT INTO ailments (name, description, severity) VALUES (?, ?, ?)', [
    ailment.name,
    ailment.description,
    ailment.severity,
  ])
}

async function insertTherapyIfMissing(db: AppDatabase, therapy: TherapyInsert): Promise<void> {
  const existing = await db.first('SELECT id FROM therapies WHERE name = ?', [therapy.name])
  if (existing) return

  await db.run('INSERT INTO therapies (name, description, duration) VALUES (?, ?, ?)', [
    therapy.name,
    therapy.description,
    therapy.duration,
  ])
}

async function insertAppointmentIfMissing(db: AppDatabase, appointment: AppointmentInsert): Promise<void> {
  const existing = await db.first('SELECT id FROM appointments WHERE agent_id = ? AND date = ?', [
    appointment.agent_id,
    appointment.date,
  ])

  if (existing) return

  await db.run('INSERT INTO appointments (agent_id, ailment_id, therapy_id, date, status) VALUES (?, ?, ?, ?, ?)', [
    appointment.agent_id,
    appointment.ailment_id,
    appointment.therapy_id,
    appointment.date,
    appointment.status,
  ])
}

async function getIdByName(
  db: AppDatabase,
  table: 'agents' | 'ailments' | 'therapies',
  name: string
): Promise<number | null> {
  const row = await db.first<{ id: number }>(`SELECT id FROM ${table} WHERE name = ?`, [name])
  return row?.id ?? null
}
