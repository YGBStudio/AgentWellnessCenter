import { NextRequest, NextResponse } from 'next/server'
import { getAppointmentById, updateAppointment, deleteAppointment } from '@/lib/db/queries'
import type { Appointment } from '@/lib/db/types'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const appointmentId = parseInt(id)
    const appointment = getAppointmentById(appointmentId)

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const appointmentId = parseInt(id)
    const body = await request.json()
    const { agent_id, ailment_id, therapy_id, date, status } = body

    const updates: Partial<Omit<Appointment, 'id' | 'created_at'>> = {}
    if (agent_id !== undefined) updates.agent_id = Number(agent_id)
    if (ailment_id !== undefined) updates.ailment_id = Number(ailment_id)
    if (therapy_id !== undefined) updates.therapy_id = Number(therapy_id)
    if (date !== undefined) updates.date = date
    if (status !== undefined) updates.status = status

    const success = updateAppointment(appointmentId, updates)

    if (!success) {
      return NextResponse.json({ error: 'Appointment not found or no changes' }, { status: 404 })
    }

    const updated = getAppointmentById(appointmentId)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const appointmentId = parseInt(id)
    const success = deleteAppointment(appointmentId)

    if (!success) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 })
  }
}
