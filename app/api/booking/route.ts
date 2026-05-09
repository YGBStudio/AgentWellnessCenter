import { NextRequest, NextResponse } from 'next/server'
import { QueryService } from '@/lib/services/queryService'
import { createAppointmentSchema, formatZodError } from '@/lib/validation'

const queryService = new QueryService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Default status to 'scheduled' for public bookings
    const dataToValidate = {
      ...body,
      status: body.status || 'scheduled'
    }
    
    const result = createAppointmentSchema.safeParse(dataToValidate)

    if (!result.success) {
      return NextResponse.json({ error: formatZodError(result.error) }, { status: 400 })
    }

    const { agent_id, date } = result.data

    // Check for conflicts
    if (queryService.checkAppointmentConflict(agent_id, date)) {
      return NextResponse.json(
        { error: 'This time slot is already booked for the selected agent.' },
        { status: 409 }
      )
    }

    const id = queryService.createAppointment(result.data)
    const created = queryService.getAppointmentById(id)
    
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Failed to process booking' }, { status: 500 })
  }
}
