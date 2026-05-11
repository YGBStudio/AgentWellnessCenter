'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Agent } from '@/lib/db/types'

interface AgentFormProps {
  agent?: Agent
  onCancel?: () => void
  onSubmit: (formData: FormData) => void | Promise<void>
}

export default function AgentForm({ agent, onCancel, onSubmit }: AgentFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)

    if (!formData.get('name') || !formData.get('type')) {
      setStatus('error')
      setErrorMessage('Please fill in all fields.')
      setStatus('idle')
      return
    }

    try {
      await onSubmit(formData)
      setStatus('success')
      e.currentTarget.reset()
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === 'success' && <p role="alert" style={{ color: 'green' }}>Success!</p>}
      {status === 'error' && <p role="alert" style={{ color: 'red' }}>{errorMessage}</p>}

      <label htmlFor="name">Agent Name</label>
      <input
        type="text"
        id="name"
        name="name"
        required
        placeholder="Enter agent name"
        defaultValue={agent?.name}
      />

      <label htmlFor="type">Agent Type</label>
      <input
        type="text"
        id="type"
        name="type"
        required
        placeholder="Enter agent type (e.g., LLM, Vision)"
        defaultValue={agent?.type}
      />

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'}>
          {status === 'loading' ? 'Saving…' : agent ? 'Update Agent' : 'Register Agent'}
        </button>
        {agent && onCancel && (
          <button type="button" onClick={onCancel} style={{ backgroundColor: 'var(--pico-muted-color)' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}