'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TherapyForm() {
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
    const duration = formData.get('duration') as string

    if (!name || !description || !duration) return

    try {
      const res = await fetch('/api/therapies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, duration: parseInt(duration) })
      })

      if (res.ok) {
        setStatus('success')
        e.currentTarget.reset()
        router.refresh()
      } else {
        const data = await res.json()
        setStatus('error')
        setErrorMessage(data.error || 'Failed to create therapy')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === 'success' && <p role="alert" style={{ color: 'green' }}>Therapy added successfully!</p>}
      {status === 'error' && <p role="alert" style={{ color: 'red' }}>{errorMessage}</p>}

      <label htmlFor="name">Therapy Name</label>
      <input type="text" id="name" name="name" required placeholder="Enter therapy name" />

      <label htmlFor="description">Description</label>
      <textarea id="description" name="description" required placeholder="Describe the therapy"></textarea>

      <label htmlFor="duration">Duration (minutes)</label>
      <input type="number" id="duration" name="duration" required placeholder="Enter duration in minutes" min="1" />

      <button type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'}>
        {status === 'loading' ? 'Adding…' : 'Add Therapy'}
      </button>
    </form>
  )
}
