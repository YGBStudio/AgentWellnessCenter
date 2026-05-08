'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Agent, Ailment, Therapy } from '@/lib/db/types'

export default function AppointmentForm({
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
    const appointmentStatus = formData.get('status') as string

    if (!agent_id || !ailment_id || !therapy_id || !date || !appointmentStatus) return

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: parseInt(agent_id),
          ailment_id: parseInt(ailment_id),
          therapy_id: parseInt(therapy_id),
          date,
          status: appointmentStatus
        })
      })

      if (res.ok) {
        setStatus('success')
        e.currentTarget.reset()
        router.refresh()
      } else {
        const data = await res.json()
        setStatus('error')
        setErrorMessage(data.error || 'Failed to create appointment')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === 'success' && <p role="alert" style={{ color: 'green' }}>Appointment scheduled successfully!</p>}
      {status === 'error' && <p role="alert" style={{ color: 'red' }}>{errorMessage}</p>}

      <label htmlFor="agent_id">Agent</label>
      <select id="agent_id" name="agent_id" required>
        <option value="">Select an agent</option>
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>{agent.name}</option>
        ))}
      </select>

      <label htmlFor="ailment_id">Ailment</label>
      <select id="ailment_id" name="ailment_id" required>
        <option value="">Select an ailment</option>
        {ailments.map((ailment) => (
          <option key={ailment.id} value={ailment.id}>{ailment.name}</option>
        ))}
      </select>

      <label htmlFor="therapy_id">Therapy</label>
      <select id="therapy_id" name="therapy_id" required>
        <option value="">Select a therapy</option>
        {therapies.map((therapy) => (
          <option key={therapy.id} value={therapy.id}>{therapy.name}</option>
        ))}
      </select>

      <label htmlFor="date">Date &amp; Time</label>
      <input type="datetime-local" id="date" name="date" required />

      <label htmlFor="status">Status</label>
      <select id="status" name="status" required>
        <option value="">Select status</option>
        <option value="scheduled">Scheduled</option>
        <option value="confirmed">Confirmed</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <button type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'}>
        {status === 'loading' ? 'Scheduling…' : 'Schedule Appointment'}
      </button>
    </form>
  )
}
