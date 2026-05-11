import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './utils'
import { Role, VerifiedToken } from './types'

export async function getAuthUser(request: NextRequest): Promise<VerifiedToken | null> {
  const cookieHeader = request.headers.get('cookie')
  const sessionCookie = cookieHeader
    ?.split(';')
    .find((c) => c.trim().startsWith('agentclinic_session='))
    ?.split('=')[1]

  if (!sessionCookie) return null

  const decoded = await verifyToken(decodeURIComponent(sessionCookie))
  if (!decoded) return null

  return decoded
}

export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const user = await getAuthUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
  return null
}

export async function requireRole(request: NextRequest, allowedRoles: Role[]): Promise<NextResponse | null> {
  const user = await getAuthUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }
  return null
}

export type NextRequestWithAuth = NextRequest