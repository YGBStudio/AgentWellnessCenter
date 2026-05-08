'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AgentForm() {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const type = formData.get('type') as string

    if (!name || !type) return

    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type })
      })

      if (res.ok) {
        setStatus('success')
        e.currentTarget.reset()
        router.refresh()
      } else {
        const data = await res.json()
        setStatus('error')
        setErrorMessage(data.error || 'Failed to create agent')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === 'success' && <p role="alert" style={{ color: 'green' }}>Agent registered successfully!</p>}
      {status === 'error' && <p role="alert" style={{ color: 'red' }}>{errorMessage}</p>}

      <label htmlFor="name">Agent Name</label>
      <input type="text" id="name" name="name" required placeholder="Enter agent name" />

      <label htmlFor="type">Agent Type</label>
      <input type="text" id="type" name="type" required placeholder="Enter agent type (e.g., LLM, Vision)" />

      <button type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'}>
        {status === 'loading' ? 'Registering…' : 'Register Agent'}
      </button>
    </form>
  )
}
