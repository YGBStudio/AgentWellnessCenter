import { NextRequest, NextResponse } from 'next/server'
import { getAilmentById, updateAilment, deleteAilment } from '@/lib/db/queries'
import type { Ailment } from '@/lib/db/types'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const ailmentId = parseInt(id)
    const ailment = getAilmentById(ailmentId)

    if (!ailment) {
      return NextResponse.json({ error: 'Ailment not found' }, { status: 404 })
    }

    return NextResponse.json(ailment)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch ailment' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const ailmentId = parseInt(id)
    const body = await request.json()
    const { name, description, severity } = body

    const updates: Partial<Omit<Ailment, 'id' | 'created_at'>> = {}
    if (name !== undefined) updates.name = name
    if (description !== undefined) updates.description = description
    if (severity !== undefined) updates.severity = severity

    const success = updateAilment(ailmentId, updates)

    if (!success) {
      return NextResponse.json({ error: 'Ailment not found or no changes' }, { status: 404 })
    }

    const updated = getAilmentById(ailmentId)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed to update ailment' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const ailmentId = parseInt(id)
    const success = deleteAilment(ailmentId)

    if (!success) {
      return NextResponse.json({ error: 'Ailment not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete ailment' }, { status: 500 })
  }
}
