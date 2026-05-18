'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

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

  const checkSession = useCallback(async (): Promise<AuthUser | null> => {
    if (typeof window === 'undefined') return null

    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        const nextUser = data.user as AuthUser
        setUser(nextUser)
        return nextUser
      }
    } catch {
      // Fall through to clear local auth state.
    } finally {
      setLoading(false)
    }

    setUser(null)
    return null
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  useEffect(() => {
    if (!user || typeof window === 'undefined') return

    const resetDemoSession = () => {
      const resetUrl = '/api/demo/reset'

      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const sent = navigator.sendBeacon(resetUrl)
        if (sent) return
      }

      fetch(resetUrl, { method: 'POST', keepalive: true }).catch(() => {})
    }

    window.addEventListener('pagehide', resetDemoSession)
    return () => window.removeEventListener('pagehide', resetDemoSession)
  }, [user])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        await checkSession()
        return { success: true }
      }

      const data = await res.json()
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
      setUser(null)
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
