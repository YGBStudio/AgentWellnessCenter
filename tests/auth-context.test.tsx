// @vitest-environment jsdom
import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider, useAuth } from '@/lib/auth/context'

const demoUser = { id: 1, email: 'admin@agentclinic.demo', role: 'admin' }
let originalSendBeacon: typeof navigator.sendBeacon | undefined

describe('AuthProvider session state', () => {
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

  it('does not reset demo data on authenticated page navigation', async () => {
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

    expect(sendBeacon).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/auth/me', { cache: 'no-store' })
  })

  it('uses the login response without making a second session request', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      if (input === '/api/auth/me') {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      if (input === '/api/auth/login') {
        return new Response(JSON.stringify({ success: true, user: demoUser }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ error: 'Unexpected request' }), { status: 500 })
    })

    vi.stubGlobal('fetch', fetchMock)

    render(
      <AuthProvider>
        <AuthActions />
      </AuthProvider>
    )

    await screen.findByText('signed out')
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(screen.getByText('signed in')).toBeInTheDocument()
    })

    const requestedUrls = fetchMock.mock.calls.map(([input]) => input)
    expect(requestedUrls.filter((url) => url === '/api/auth/me')).toHaveLength(1)
    expect(requestedUrls.filter((url) => url === '/api/auth/login')).toHaveLength(1)
    expect(screen.getByText('admin@agentclinic.demo')).toBeInTheDocument()
  })

  it('ignores stale session checks that complete after login', async () => {
    const sessionCheck = createDeferred<Response>()
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      if (input === '/api/auth/me') {
        return sessionCheck.promise
      }

      if (input === '/api/auth/login') {
        return Promise.resolve(
          new Response(JSON.stringify({ success: true, user: demoUser }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        )
      }

      return Promise.resolve(new Response(JSON.stringify({ error: 'Unexpected request' }), { status: 500 }))
    })

    vi.stubGlobal('fetch', fetchMock)

    render(
      <AuthProvider>
        <AuthActions />
      </AuthProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    await screen.findByText('signed in')

    sessionCheck.resolve(
      new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    await flushPromises()

    await waitFor(() => {
      expect(screen.getByText('signed in')).toBeInTheDocument()
    })
  })
})

function AuthState() {
  const { isAuthenticated } = useAuth()
  return <span>{isAuthenticated ? 'signed in' : 'signed out'}</span>
}

function AuthActions() {
  const { isAuthenticated, login, user } = useAuth()

  return (
    <>
      <span>{isAuthenticated ? 'signed in' : 'signed out'}</span>
      <span>{user?.email ?? 'no user'}</span>
      <button type="button" onClick={() => void login('admin@agentclinic.demo', 'admin')}>
        Sign in
      </button>
    </>
  )
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

function createDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}
