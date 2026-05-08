import { NextRequest, NextResponse } from 'next/server'
import { QueryService } from '@/lib/services/queryService'
const queryService = new QueryService()
import type { Therapy } from '@/lib/db/types'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const therapyId = parseInt(id)
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
    const therapyId = parseInt(id)
    const body = await request.json()
    const { name, description, duration } = body

    const updates: Partial<Omit<Therapy, 'id' | 'created_at'>> = {}
    if (name !== undefined) updates.name = name
    if (description !== undefined) updates.description = description
    if (duration !== undefined) updates.duration = Number(duration)

    const success = queryService.updateTherapy(therapyId, updates)

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
    const therapyId = parseInt(id)
    const success = queryService.deleteTherapy(therapyId)

    if (!success) {
      return NextResponse.json({ error: 'Therapy not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete therapy' }, { status: 500 })
  }
}
