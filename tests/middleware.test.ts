// @vitest-environment node
import { TextDecoder, TextEncoder } from 'util'
globalThis.TextEncoder = TextEncoder
globalThis.TextDecoder = TextDecoder

import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { middleware } from '@/middleware'
import { signToken } from '@/lib/auth/utils'

describe('route protection middleware', () => {
  it('redirects unauthenticated protected resource visits to login with from path', async () => {
    const response = await middleware(new NextRequest('http://localhost/agents'))
    const location = response.headers.get('location')

    expect(response.status).toBe(307)
    expect(location).toBeTruthy()

    const redirectUrl = new URL(location ?? '')
    expect(redirectUrl.pathname).toBe('/login')
    expect(redirectUrl.searchParams.get('from')).toBe('/agents')
  })

  it('allows authenticated staff users through protected management routes', async () => {
    const token = await signToken({ email: 'staff@agentclinic.demo', role: 'staff', userId: 2 })
    const request = new NextRequest('http://localhost/therapies', {
      headers: { cookie: `agentclinic_session=${encodeURIComponent(token)}` },
    })

    const response = await middleware(request)

    expect(response.headers.get('location')).toBeNull()
  })
})
