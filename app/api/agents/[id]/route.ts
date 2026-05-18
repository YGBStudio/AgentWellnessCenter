import { NextRequest, NextResponse } from 'next/server'
import { QueryService } from '@/lib/services/queryService'
import { updateAgentSchema, parseId, formatZodError } from '@/lib/validation'
import { requireRole } from '@/lib/auth/middleware'

const queryService = new QueryService()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const agentId = parseId(id)

    if (agentId === null) {
      return NextResponse.json({ error: 'Invalid agent ID' }, { status: 400 })
    }

    const agent = queryService.getAgentById(agentId)

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    return NextResponse.json(agent)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireRole(request, ['admin', 'staff'])
  if (authError) return authError

  try {
    const { id } = await params
    const agentId = parseId(id)

    if (agentId === null) {
      return NextResponse.json({ error: 'Invalid agent ID' }, { status: 400 })
    }

    const body = await request.json()
    const result = updateAgentSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: formatZodError(result.error) }, { status: 400 })
    }

    const success = queryService.updateAgent(agentId, result.data)

    if (!success) {
      return NextResponse.json({ error: 'Agent not found or no changes' }, { status: 404 })
    }

    const updated = queryService.getAgentById(agentId)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireRole(request, ['admin', 'staff'])
  if (authError) return authError

  try {
    const { id } = await params
    const agentId = parseId(id)

    if (agentId === null) {
      return NextResponse.json({ error: 'Invalid agent ID' }, { status: 400 })
    }

    if (queryService.hasAgentAppointments(agentId)) {
      return NextResponse.json({ error: 'Cannot delete agent with existing appointments' }, { status: 409 })
    }

    const success = queryService.deleteAgent(agentId)

    if (!success) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 })
  }
}
