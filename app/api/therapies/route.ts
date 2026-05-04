import { NextRequest, NextResponse } from 'next/server'
import { getTherapies, createTherapy } from '@/lib/db/queries'
import type { Therapy } from '@/lib/db/types'

export async function GET() {
  try {
    const therapies = getTherapies()
    return NextResponse.json(therapies)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch therapies' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, duration } = body

    if (!name || !description || duration === undefined) {
      return NextResponse.json({ error: 'Name, description, and duration are required' }, { status: 400 })
    }

    const therapy: Omit<Therapy, 'id' | 'created_at'> = { name, description, duration: Number(duration) }
    const id = createTherapy(therapy)
    const created = getTherapies().find(t => t.id === id)

    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create therapy' }, { status: 500 })
  }
}
