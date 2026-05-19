import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth/middleware'
import { isDemoModeEnabled } from '@/lib/config/demoMode'
import { getRuntimeDatabase } from '@/lib/db/d1'
import { resetDemoDatabase } from '@/lib/db/seed'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request)

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  if (user.role !== 'admin' && user.role !== 'staff') {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  if (!isDemoModeEnabled()) {
    return NextResponse.json({ success: true, reset: false })
  }

  try {
    await resetDemoDatabase(getRuntimeDatabase())
    return NextResponse.json({ success: true, reset: true })
  } catch (error) {
    console.error('Demo reset failed:', error)
    return NextResponse.json({ error: 'Demo reset failed' }, { status: 500 })
  }
}
