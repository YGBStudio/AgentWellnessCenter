import { NextRequest, NextResponse } from 'next/server'
import { QueryService } from '@/lib/services/queryService'
import { createAppointmentSchema, parseId, formatZodError } from '@/lib/validation'

const queryService = new QueryService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agentIdParam = searchParams.get('agentId')

    if (agentIdParam) {
      const agentId = parseId(agentIdParam)
      if (agentId === null) {
        return NextResponse.json({ error: 'Invalid agent ID' }, { status: 400 })
      }
      const appointments = queryService.getAppointmentsByAgentId(agentId)
      return NextResponse.json(appointments)
    }

    const appointments = queryService.getAppointments()
    return NextResponse.json(appointments)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = createAppointmentSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: formatZodError(result.error) }, { status: 400 })
    }

    const id = queryService.createAppointment(result.data)
    const created = queryService.getAppointmentById(id)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
  }
}
