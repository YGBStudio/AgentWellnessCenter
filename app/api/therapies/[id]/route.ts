import { NextRequest, NextResponse } from 'next/server'
import { getRuntimeQueryService } from '@/lib/services/runtimeQueryService'
import { updateTherapySchema, parseId, formatZodError } from '@/lib/validation'
import { requireRole } from '@/lib/auth/middleware'

const queryService = getRuntimeQueryService()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const therapyId = parseId(id)

    if (therapyId === null) {
      return NextResponse.json({ error: 'Invalid therapy ID' }, { status: 400 })
    }

    const therapy = await queryService.getTherapyById(therapyId)

    if (!therapy) {
      return NextResponse.json({ error: 'Therapy not found' }, { status: 404 })
    }

    return NextResponse.json(therapy)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch therapy' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireRole(request, ['admin', 'staff'])
  if (authError) return authError

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

    const success = await queryService.updateTherapy(therapyId, result.data)

    if (!success) {
      return NextResponse.json({ error: 'Therapy not found or no changes' }, { status: 404 })
    }

    const updated = await queryService.getTherapyById(therapyId)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed to update therapy' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireRole(request, ['admin', 'staff'])
  if (authError) return authError

  try {
    const { id } = await params
    const therapyId = parseId(id)

    if (therapyId === null) {
      return NextResponse.json({ error: 'Invalid therapy ID' }, { status: 400 })
    }

    if (await queryService.hasTherapyAppointments(therapyId)) {
      return NextResponse.json({ error: 'Cannot delete therapy with existing appointments' }, { status: 409 })
    }

    const success = await queryService.deleteTherapy(therapyId)

    if (!success) {
      return NextResponse.json({ error: 'Therapy not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete therapy' }, { status: 500 })
  }
}
