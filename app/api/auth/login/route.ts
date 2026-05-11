import { NextResponse } from 'next/server'
import { QueryService } from '@/lib/services/queryService'
import { verifyPassword, signToken } from '@/lib/auth/utils'
import { Role } from '@/lib/auth/types'
import { serializeCookie } from '@/lib/auth/cookies'

const queryService = new QueryService()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body as { email: string; password: string }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = queryService.getUserByEmail(email)

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await signToken({ email: user.email, role: user.role as Role, userId: user.id })
    const cookie = serializeCookie('agentclinic_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    const response = NextResponse.json({ success: true, user: { email: user.email, role: user.role } })
    response.headers.set('Set-Cookie', cookie)
    return response
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}