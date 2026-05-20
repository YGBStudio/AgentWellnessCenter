'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'

export default function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const searchParams = useSearchParams()
  const from = getSafeRedirectPath(searchParams.get('from'))
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      setStatus('error')
      setErrorMessage('Please fill in all fields.')
      return
    }

    try {
      const result = await login(email, password)

      if (result.success) {
        setStatus('success')
        router.replace(from)
        router.refresh()
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Invalid credentials')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {status === 'error' && (
        <div className="form-error" role="alert">
          {errorMessage}
        </div>
      )}
      {status === 'success' && (
        <div className="form-success" role="status">
          Logging in…
        </div>
      )}

      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        required
        placeholder="admin@agentclinic.demo"
        autoComplete="email"
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        required
        placeholder="Enter your password"
        autoComplete="current-password"
      />

      <button
        type="submit"
        disabled={status === 'loading'}
        aria-busy={status === 'loading'}
      >
        {status === 'loading' ? 'Signing in…' : 'Sign In'}
      </button>

      <p className="demo-credentials">
        Demo credentials: <strong>admin@agentclinic.demo</strong> /{' '}
        <strong>admin</strong>
      </p>
    </form>
  )
}

function getSafeRedirectPath(path: string | null): string {
  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return '/dashboard'
  }

  return path
}
