import { NextRequest, NextResponse } from 'next/server'
import { getRuntimeQueryService } from '@/lib/services/runtimeQueryService'
import { updateAppointmentSchema, parseId, formatZodError } from '@/lib/validation'
import { requireRole } from '@/lib/auth/middleware'

const queryService = getRuntimeQueryService()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const appointmentId = parseId(id)

    if (appointmentId === null) {
      return NextResponse.json({ error: 'Invalid appointment ID' }, { status: 400 })
    }

    const appointment = await queryService.getAppointmentById(appointmentId)

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireRole(request, ['admin', 'staff'])
  if (authError) return authError

  try {
    const { id } = await params
    const appointmentId = parseId(id)

    if (appointmentId === null) {
      return NextResponse.json({ error: 'Invalid appointment ID' }, { status: 400 })
    }

    const body = await request.json()
    const result = updateAppointmentSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: formatZodError(result.error) }, { status: 400 })
    }

    const success = await queryService.updateAppointment(appointmentId, result.data)

    if (!success) {
      return NextResponse.json({ error: 'Appointment not found or no changes' }, { status: 404 })
    }

    const updated = await queryService.getAppointmentById(appointmentId)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireRole(request, ['admin', 'staff'])
  if (authError) return authError

  try {
    const { id } = await params
    const appointmentId = parseId(id)

    if (appointmentId === null) {
      return NextResponse.json({ error: 'Invalid appointment ID' }, { status: 400 })
    }

    const success = await queryService.deleteAppointment(appointmentId)

    if (!success) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 })
  }
}
