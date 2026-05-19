import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/utils'
import { getRuntimeQueryService } from '@/lib/services/runtimeQueryService'

const queryService = getRuntimeQueryService()

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie')
  const sessionCookie = cookieHeader
    ?.split(';')
    .find((c) => c.trim().startsWith('agentclinic_session='))
    ?.split('=')[1]

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const decoded = await verifyToken(decodeURIComponent(sessionCookie))

  if (!decoded) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  const user = await queryService.getUserByEmail(decoded.email)

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  })
}
