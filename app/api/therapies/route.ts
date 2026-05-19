import { NextResponse, NextRequest } from 'next/server'
import { getRuntimeQueryService } from '@/lib/services/runtimeQueryService'
import { createTherapySchema, formatZodError } from '@/lib/validation'
import { requireRole } from '@/lib/auth/middleware'

const queryService = getRuntimeQueryService()

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const therapies = await queryService.getTherapies()
    return NextResponse.json(therapies)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch therapies' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const authError = await requireRole(request as unknown as NextRequest, ['admin', 'staff'])
  if (authError) return authError

  try {
    const body = await request.json()
    const result = createTherapySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: formatZodError(result.error) }, { status: 400 })
    }

    const id = await queryService.createTherapy(result.data)
    const created = await queryService.getTherapyById(id)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create therapy' }, { status: 500 })
  }
}
