import { NextRequest, NextResponse } from 'next/server'
import { QueryService } from '@/lib/services/queryService'
import type { Agent } from '@/lib/db/types'

const queryService = new QueryService()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const agentId = parseInt(id)
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
  try {
    const { id } = await params
    const agentId = parseInt(id)
    const body = await request.json()
    const { name, type } = body

    const updates: Partial<Omit<Agent, 'id' | 'created_at'>> = {}
    if (name !== undefined) updates.name = name
    if (type !== undefined) updates.type = type

    const success = queryService.updateAgent(agentId, updates)

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
  try {
    const { id } = await params
    const agentId = parseInt(id)
    const success = queryService.deleteAgent(agentId)

    if (!success) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 })
  }
}
