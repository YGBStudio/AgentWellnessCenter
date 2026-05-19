import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth/middleware'
import { isDemoModeEnabled } from '@/lib/config/demoMode'
import { getRuntimeDatabase } from '@/lib/db/d1'
import { resetDemoDatabase } from '@/lib/db/seed'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (isDemoModeEnabled()) {
    try {
      const user = await getAuthUser(request)
      if (user && (user.role === 'admin' || user.role === 'staff')) {
        await resetDemoDatabase(getRuntimeDatabase())
      }
    } catch (error) {
      console.error('Demo reset during logout failed:', error)
      return clearSessionCookie(NextResponse.json({ error: 'Logout cleanup failed' }, { status: 500 }))
    }
  }

  const response = NextResponse.json({ success: true })
  return clearSessionCookie(response)
}

function clearSessionCookie(response: NextResponse): NextResponse {
  response.headers.set('Set-Cookie', 'agentclinic_session=; Max-Age=0; HttpOnly; Path=/')
  return response
}
