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
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const checkSession = useCallback(async () => {
    if (typeof window === 'undefined') return

    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
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
        checkSession()
        return { success: true }
      }

      const data = await res.json()
      return { success: false, error: data.error || 'Invalid credentials' }
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    setUser(null)
    removeToken()
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
