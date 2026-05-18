import { NextResponse, NextRequest } from 'next/server'
import { QueryService } from '@/lib/services/queryService'
import { createAgentSchema, formatZodError } from '@/lib/validation'
import { requireRole } from '@/lib/auth/middleware'

const queryService = new QueryService()

export async function GET() {
  try {
    const agents = queryService.getAgents()
    return NextResponse.json(agents)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const authError = await requireRole(request as unknown as NextRequest, ['admin', 'staff'])
  if (authError) return authError

  try {
    const body = await request.json()
    const result = createAgentSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: formatZodError(result.error) }, { status: 400 })
    }

    const id = queryService.createAgent(result.data)
    const created = queryService.getAgentById(id)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 })
  }
}
