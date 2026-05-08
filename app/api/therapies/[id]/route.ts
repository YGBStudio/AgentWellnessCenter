import { NextRequest, NextResponse } from 'next/server'
import { QueryService } from '@/lib/services/queryService'
import { updateTherapySchema, parseId, formatZodError } from '@/lib/validation'

const queryService = new QueryService()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const therapyId = parseId(id)

    if (therapyId === null) {
      return NextResponse.json({ error: 'Invalid therapy ID' }, { status: 400 })
    }

    const therapy = queryService.getTherapyById(therapyId)

    if (!therapy) {
      return NextResponse.json({ error: 'Therapy not found' }, { status: 404 })
    }

    return NextResponse.json(therapy)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch therapy' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const therapyId = parseId(id)

    if (therapyId === null) {
      return NextResponse.json({ error: 'Invalid therapy ID' }, { status: 400 })
    }

    const body = await request.json()
    const result = updateTherapySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: formatZodError(result.error) }, { status: 400 })
    }

    const success = queryService.updateTherapy(therapyId, result.data)

    if (!success) {
      return NextResponse.json({ error: 'Therapy not found or no changes' }, { status: 404 })
    }

    const updated = queryService.getTherapyById(therapyId)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed to update therapy' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const therapyId = parseId(id)

    if (therapyId === null) {
      return NextResponse.json({ error: 'Invalid therapy ID' }, { status: 400 })
    }

    if (queryService.hasTherapyAppointments(therapyId)) {
      return NextResponse.json({ error: 'Cannot delete therapy with existing appointments' }, { status: 409 })
    }

    const success = queryService.deleteTherapy(therapyId)

    if (!success) {
      return NextResponse.json({ error: 'Therapy not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete therapy' }, { status: 500 })
  }
}
