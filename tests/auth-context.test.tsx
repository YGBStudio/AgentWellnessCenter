// @vitest-environment jsdom
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider, useAuth } from '@/lib/auth/context'

const demoUser = { id: 1, email: 'admin@agentclinic.demo', role: 'admin' }
let originalSendBeacon: typeof navigator.sendBeacon | undefined

describe('AuthProvider demo reset lifecycle', () => {
  beforeEach(() => {
    originalSendBeacon = navigator.sendBeacon
  })

  afterEach(() => {
    if (originalSendBeacon) {
      Object.defineProperty(navigator, 'sendBeacon', {
        configurable: true,
        writable: true,
        value: originalSendBeacon,
      })
    } else {
      Reflect.deleteProperty(navigator, 'sendBeacon')
    }

    vi.unstubAllGlobals()
  })

  it('sends a demo reset beacon on authenticated page exit', async () => {
    const fetchMock = stubAuthenticatedSession()
    const sendBeacon = vi.fn(() => true)
    Object.defineProperty(navigator, 'sendBeacon', {
      configurable: true,
      writable: true,
      value: sendBeacon,
    })

    render(
      <AuthProvider>
        <AuthState />
      </AuthProvider>
    )

    await screen.findByText('signed in')
    window.dispatchEvent(new Event('pagehide'))

    await waitFor(() => {
      expect(sendBeacon).toHaveBeenCalledWith('/api/demo/reset')
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('falls back to keepalive fetch when the reset beacon is unavailable', async () => {
    const fetchMock = stubAuthenticatedSession()
    const sendBeacon = vi.fn(() => false)
    Object.defineProperty(navigator, 'sendBeacon', {
      configurable: true,
      writable: true,
      value: sendBeacon,
    })

    render(
      <AuthProvider>
        <AuthState />
      </AuthProvider>
    )

    await screen.findByText('signed in')
    window.dispatchEvent(new Event('pagehide'))

    expect(sendBeacon).toHaveBeenCalledWith('/api/demo/reset')
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/demo/reset', { method: 'POST', keepalive: true })
    })
  })
})

function AuthState() {
  const { isAuthenticated } = useAuth()
  return <span>{isAuthenticated ? 'signed in' : 'signed out'}</span>
}

function stubAuthenticatedSession() {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    if (input === '/api/auth/me') {
      return new Response(JSON.stringify({ user: demoUser }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  })

  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
