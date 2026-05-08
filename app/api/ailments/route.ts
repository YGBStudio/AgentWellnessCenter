import { NextResponse } from 'next/server'
import { QueryService } from '@/lib/services/queryService'
import { createAilmentSchema, formatZodError } from '@/lib/validation'

const queryService = new QueryService()

export async function GET() {
  try {
    const ailments = queryService.getAilments()
    return NextResponse.json(ailments)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch ailments' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = createAilmentSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: formatZodError(result.error) }, { status: 400 })
    }

    const id = queryService.createAilment(result.data)
    const created = queryService.getAilmentById(id)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create ailment' }, { status: 500 })
  }
}
