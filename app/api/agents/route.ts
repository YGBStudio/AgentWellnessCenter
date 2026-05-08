import { NextResponse } from 'next/server'
import { QueryService } from '@/lib/services/queryService'
import { createAgentSchema, formatZodError } from '@/lib/validation'

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
