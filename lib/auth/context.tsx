'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

interface AuthUser {
  id: number
  email: string
  role: 'admin' | 'staff'
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  role: 'admin' | 'staff' | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const sessionRequestId = useRef(0)

  const checkSession = useCallback(async (): Promise<AuthUser | null> => {
    if (typeof window === 'undefined') return null

    const requestId = sessionRequestId.current + 1
    sessionRequestId.current = requestId

    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      if (res.ok) {
        const data = (await res.json()) as { user: AuthUser }
        const nextUser = data.user as AuthUser
        if (requestId === sessionRequestId.current) {
          setUser(nextUser)
        }
        return nextUser
      }
    } catch {
      // Fall through to clear local auth state.
    } finally {
      if (requestId === sessionRequestId.current) {
        setLoading(false)
      }
    }

    if (requestId === sessionRequestId.current) {
      setUser(null)
    }
    return null
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        const data = (await res.json()) as { user?: AuthUser }
        sessionRequestId.current += 1

        if (data.user) {
          setUser(data.user)
          setLoading(false)
        } else {
          await checkSession()
        }

        return { success: true }
      }

      const data = (await res.json()) as { error?: string }
      return { success: false, error: data.error || 'Invalid credentials' }
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Local auth state should still clear if the network request fails.
    } finally {
      sessionRequestId.current += 1
      setUser(null)
      setLoading(false)
      removeToken()
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    role: user?.role ?? null,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function removeToken(): void {
  if (typeof document === 'undefined') return
  document.cookie = 'agentclinic_session=; Max-Age=0; path=/'
}
