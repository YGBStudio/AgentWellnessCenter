import { NextRequest, NextResponse } from 'next/server'
import { getRuntimeQueryService } from '@/lib/services/runtimeQueryService'
import { updateAilmentSchema, parseId, formatZodError } from '@/lib/validation'
import { requireRole } from '@/lib/auth/middleware'

const queryService = getRuntimeQueryService()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const ailmentId = parseId(id)

    if (ailmentId === null) {
      return NextResponse.json({ error: 'Invalid ailment ID' }, { status: 400 })
    }

    const ailment = await queryService.getAilmentById(ailmentId)

    if (!ailment) {
      return NextResponse.json({ error: 'Ailment not found' }, { status: 404 })
    }

    return NextResponse.json(ailment)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch ailment' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireRole(request, ['admin', 'staff'])
  if (authError) return authError

  try {
    const { id } = await params
    const ailmentId = parseId(id)

    if (ailmentId === null) {
      return NextResponse.json({ error: 'Invalid ailment ID' }, { status: 400 })
    }

    const body = await request.json()
    const result = updateAilmentSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: formatZodError(result.error) }, { status: 400 })
    }

    const success = await queryService.updateAilment(ailmentId, result.data)

    if (!success) {
      return NextResponse.json({ error: 'Ailment not found or no changes' }, { status: 404 })
    }

    const updated = await queryService.getAilmentById(ailmentId)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed to update ailment' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireRole(request, ['admin', 'staff'])
  if (authError) return authError

  try {
    const { id } = await params
    const ailmentId = parseId(id)

    if (ailmentId === null) {
      return NextResponse.json({ error: 'Invalid ailment ID' }, { status: 400 })
    }

    if (await queryService.hasAilmentAppointments(ailmentId)) {
      return NextResponse.json({ error: 'Cannot delete ailment with existing appointments' }, { status: 409 })
    }

    const success = await queryService.deleteAilment(ailmentId)

    if (!success) {
      return NextResponse.json({ error: 'Ailment not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete ailment' }, { status: 500 })
  }
}
