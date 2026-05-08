'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AilmentForm() {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const severity = formData.get('severity') as string

    if (!name || !description || !severity) return

    try {
      const res = await fetch('/api/ailments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, severity })
      })

      if (res.ok) {
        setStatus('success')
        e.currentTarget.reset()
        router.refresh()
      } else {
        const data = await res.json()
        setStatus('error')
        setErrorMessage(data.error || 'Failed to create ailment')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === 'success' && <p role="alert" style={{ color: 'green' }}>Ailment added successfully!</p>}
      {status === 'error' && <p role="alert" style={{ color: 'red' }}>{errorMessage}</p>}

      <label htmlFor="name">Ailment Name</label>
      <input type="text" id="name" name="name" required placeholder="Enter ailment name" />

      <label htmlFor="description">Description</label>
      <textarea id="description" name="description" required placeholder="Describe the ailment"></textarea>

      <label htmlFor="severity">Severity</label>
      <select id="severity" name="severity" required>
        <option value="">Select severity</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <button type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'}>
        {status === 'loading' ? 'Adding…' : 'Add Ailment'}
      </button>
    </form>
  )
}
