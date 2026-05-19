// @vitest-environment node
import { TextDecoder, TextEncoder } from 'util'
globalThis.TextEncoder = TextEncoder
globalThis.TextDecoder = TextDecoder

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { signToken } from '@/lib/auth/utils'

const mockDb = vi.hoisted(() => ({ name: 'mock-db' }))
const mockGetRuntimeDatabase = vi.hoisted(() => vi.fn(() => mockDb))
const mockResetDemoDatabase = vi.hoisted(() => vi.fn(() => Promise.resolve()))

vi.mock('@/lib/db/d1', () => ({
  getRuntimeDatabase: mockGetRuntimeDatabase,
}))

vi.mock('@/lib/db/seed', () => ({
  resetDemoDatabase: mockResetDemoDatabase,
}))

import { POST as postLogout } from '@/app/api/auth/logout/route'
import { POST as postDemoReset } from '@/app/api/demo/reset/route'

const originalDemoMode = process.env.DEMO_MODE

describe('demo mode reset routes', () => {
  beforeEach(() => {
    delete process.env.DEMO_MODE
    mockGetRuntimeDatabase.mockClear()
    mockResetDemoDatabase.mockClear()
  })

  afterEach(() => {
    if (originalDemoMode === undefined) {
      delete process.env.DEMO_MODE
    } else {
      process.env.DEMO_MODE = originalDemoMode
    }
  })

  it('rejects unauthenticated demo reset requests', async () => {
    process.env.DEMO_MODE = 'true'

    const response = await postDemoReset(new NextRequest('http://localhost/api/demo/reset', { method: 'POST' }))

    expect(response.status).toBe(401)
    expect(mockResetDemoDatabase).not.toHaveBeenCalled()
  })

  it('rejects demo reset requests without a management role', async () => {
    process.env.DEMO_MODE = 'true'

    const response = await postDemoReset(await authenticatedRequest('/api/demo/reset', 'viewer'))

    expect(response.status).toBe(403)
    expect(mockResetDemoDatabase).not.toHaveBeenCalled()
  })

  it('no-ops when demo mode is disabled', async () => {
    const response = await postDemoReset(await authenticatedRequest('/api/demo/reset', 'admin'))
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload).toEqual({ success: true, reset: false })
    expect(mockResetDemoDatabase).not.toHaveBeenCalled()
  })

  it('resets the database for authenticated admin sessions when demo mode is enabled', async () => {
    process.env.DEMO_MODE = 'true'

    const response = await postDemoReset(await authenticatedRequest('/api/demo/reset', 'admin'))
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload).toEqual({ success: true, reset: true })
    expect(mockGetRuntimeDatabase).toHaveBeenCalledTimes(1)
    expect(mockResetDemoDatabase).toHaveBeenCalledWith(mockDb)
  })

  it('resets during authenticated logout when demo mode is enabled', async () => {
    process.env.DEMO_MODE = 'true'

    const response = await postLogout(await authenticatedRequest('/api/auth/logout', 'staff'))

    expect(response.status).toBe(200)
    expect(response.headers.get('set-cookie')).toContain('agentclinic_session=;')
    expect(mockResetDemoDatabase).toHaveBeenCalledWith(mockDb)
  })

  it('does not reset during logout when demo mode is disabled', async () => {
    const response = await postLogout(await authenticatedRequest('/api/auth/logout', 'admin'))

    expect(response.status).toBe(200)
    expect(response.headers.get('set-cookie')).toContain('agentclinic_session=;')
    expect(mockResetDemoDatabase).not.toHaveBeenCalled()
  })
})

async function authenticatedRequest(path: string, role: 'admin' | 'staff' | 'viewer'): Promise<NextRequest> {
  const token = await signToken({
    email: `${role}@agentclinic.demo`,
    role: role as 'admin',
    userId: 1,
  })

  return new NextRequest(`http://localhost${path}`, {
    method: 'POST',
    headers: { cookie: `agentclinic_session=${encodeURIComponent(token)}` },
  })
}
