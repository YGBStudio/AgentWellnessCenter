import { NextRequest, NextResponse } from 'next/server'
import { getRuntimeQueryService } from '@/lib/services/runtimeQueryService'
import { createAppointmentSchema, parseId, formatZodError } from '@/lib/validation'
import { requireRole } from '@/lib/auth/middleware'

const queryService = getRuntimeQueryService()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agentIdParam = searchParams.get('agentId')

    if (agentIdParam) {
      const agentId = parseId(agentIdParam)
      if (agentId === null) {
        return NextResponse.json({ error: 'Invalid agent ID' }, { status: 400 })
      }
      const appointments = await queryService.getAppointmentsByAgentId(agentId)
      return NextResponse.json(appointments)
    }

    const appointments = await queryService.getAppointments()
    return NextResponse.json(appointments)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireRole(request as unknown as NextRequest, ['admin', 'staff'])
  if (authError) return authError

  try {
    const body = await request.json()
    const result = createAppointmentSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: formatZodError(result.error) }, { status: 400 })
    }

    const id = await queryService.createAppointment(result.data)
    const created = await queryService.getAppointmentById(id)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
  }
}
