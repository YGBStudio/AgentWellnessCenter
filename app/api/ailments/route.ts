import { NextRequest, NextResponse } from 'next/server'
import { getAilments, createAilment } from '@/lib/db/queries'
import type { Ailment } from '@/lib/db/types'

export async function GET() {
  try {
    const ailments = getAilments()
    return NextResponse.json(ailments)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch ailments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, severity } = body

    if (!name || !description || !severity) {
      return NextResponse.json({ error: 'Name, description, and severity are required' }, { status: 400 })
    }

    const ailment: Omit<Ailment, 'id' | 'created_at'> = { name, description, severity }
    const id = createAilment(ailment)
    const created = getAilments().find(a => a.id === id)

    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create ailment' }, { status: 500 })
  }
}
