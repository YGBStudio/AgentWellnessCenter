'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Agent, Ailment, Therapy } from '@/lib/db/types'

export default function BookingForm({
  agents,
  ailments,
  therapies
}: {
  agents: Agent[]
  ailments: Ailment[]
  therapies: Therapy[]
}) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    const agent_id = formData.get('agent_id') as string
    const ailment_id = formData.get('ailment_id') as string
    const therapy_id = formData.get('therapy_id') as string
    const date = formData.get('date') as string

    if (!agent_id || !ailment_id || !therapy_id || !date) {
      setErrorMessage('Please fill in all fields.')
      setStatus('error')
      return
    }

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: parseInt(agent_id),
          ailment_id: parseInt(ailment_id),
          therapy_id: parseInt(therapy_id),
          date,
          status: 'scheduled'
        })
      })

      if (res.ok) {
        const appointment = await res.json()
        setStatus('success')
        // Store basic info in session storage or pass via query params for confirmation page
        const query = new URLSearchParams({
          agent: agents.find(a => a.id === appointment.agent_id)?.name || '',
          date: appointment.date,
          therapy: therapies.find(t => t.id === appointment.therapy_id)?.name || ''
        }).toString()
        router.push(`/booking/confirmation?${query}`)
      } else {
        const data = await res.json()
        setStatus('error')
        setErrorMessage(data.error || 'Failed to book appointment')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  return (
    <article className="surface-card">
      <header>
        <h3>Request an Appointment</h3>
        <p>Fill out the form below to schedule a care session for your AI agent.</p>
      </header>
      <form onSubmit={handleSubmit}>
        {status === 'error' && (
          <p role="alert" className="form-error">
            {errorMessage}
          </p>
        )}

        <div className="grid">
          <label htmlFor="agent_id">
            Agent to be treated
            <select id="agent_id" name="agent_id" required>
              <option value="">Select an agent</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>{agent.name} ({agent.type})</option>
              ))}
            </select>
          </label>

          <label htmlFor="ailment_id">
            Ailment / Issue
            <select id="ailment_id" name="ailment_id" required>
              <option value="">Select an ailment</option>
              {ailments.map((ailment) => (
                <option key={ailment.id} value={ailment.id}>{ailment.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid">
          <label htmlFor="therapy_id">
            Desired Therapy
            <select id="therapy_id" name="therapy_id" required>
              <option value="">Select a therapy</option>
              {therapies.map((therapy) => (
                <option key={therapy.id} value={therapy.id}>{therapy.name} ({therapy.duration}m)</option>
              ))}
            </select>
          </label>

          <label htmlFor="date">
            Preferred Date &amp; Time
            <input type="datetime-local" id="date" name="date" required />
          </label>
        </div>

        <footer className="form-actions">
          <button type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'} className="primary">
            {status === 'loading' ? 'Booking...' : 'Book Appointment'}
          </button>
        </footer>
      </form>
    </article>
  )
}
