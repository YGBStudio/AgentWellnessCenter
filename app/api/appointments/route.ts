import { NextRequest, NextResponse } from 'next/server'
import { getAppointments, getAppointmentsByAgentId, createAppointment } from '@/lib/db/queries'
import type { Appointment } from '@/lib/db/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')

    if (agentId) {
      const appointments = getAppointmentsByAgentId(parseInt(agentId))
      return NextResponse.json(appointments)
    }

    const appointments = getAppointments()
    return NextResponse.json(appointments)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agent_id, ailment_id, therapy_id, date, status } = body

    if (!agent_id || !ailment_id || !therapy_id || !date || !status) {
      return NextResponse.json({ error: 'agent_id, ailment_id, therapy_id, date, and status are required' }, { status: 400 })
    }

    const appointment: Omit<Appointment, 'id' | 'created_at'> = {
      agent_id: Number(agent_id),
      ailment_id: Number(ailment_id),
      therapy_id: Number(therapy_id),
      date,
      status
    }
    const id = createAppointment(appointment)
    const created = getAppointments().find(a => a.id === id)

    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
  }
}
