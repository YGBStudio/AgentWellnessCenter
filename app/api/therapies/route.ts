import { NextResponse, NextRequest } from 'next/server'
import { QueryService } from '@/lib/services/queryService'
import { createTherapySchema, formatZodError } from '@/lib/validation'
import { requireAuth } from '@/lib/auth/middleware'

const queryService = new QueryService()

export async function GET() {
  try {
    const therapies = queryService.getTherapies()
    return NextResponse.json(therapies)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch therapies' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const authError = await requireAuth(request as unknown as NextRequest)
  if (authError) return authError

  try {
    const body = await request.json()
    const result = createTherapySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: formatZodError(result.error) }, { status: 400 })
    }

    const id = queryService.createTherapy(result.data)
    const created = queryService.getTherapyById(id)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create therapy' }, { status: 500 })
  }
}
