import { NextRequest, NextResponse } from 'next/server'
import { QueryService } from '@/lib/services/queryService'
const queryService = new QueryService()

import type { Agent } from '@/lib/db/types'

export async function GET() {
  try {
    const agents = queryService.getAgents()
    return NextResponse.json(agents)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type } = body

    if (!name || !type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 })
    }

    const agent: Omit<Agent, 'id' | 'created_at'> = { name, type }
    const id = queryService.createAgent(agent)
    const created = queryService.getAgents().find(a => a.id === id)

    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 })
  }
}
