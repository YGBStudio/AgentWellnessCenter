'use client'

import React, { useState } from 'react'
import type { Agent, Ailment, Therapy, Appointment } from '@/lib/db/types'

interface AppointmentFormProps {
  agents: Agent[]
  ailments: Ailment[]
  therapies: Therapy[]
  appointment?: Appointment
  onCancel?: () => void
  onSubmit: (formData: FormData) => void | Promise<void>
}

export default function AppointmentForm({
  agents,
  ailments,
  therapies,
  appointment,
  onCancel,
  onSubmit,
}: AppointmentFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)

    if (
      !formData.get('agent_id') ||
      !formData.get('ailment_id') ||
      !formData.get('therapy_id') ||
      !formData.get('date')
    ) {
      setStatus('error')
      setErrorMessage('Please fill in all fields.')
      setStatus('idle')
      return
    }

    try {
      await onSubmit(formData)
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === 'success' && <p role="alert" style={{ color: 'green' }}>Success!</p>}
      {status === 'error' && <p role="alert" style={{ color: 'red' }}>{errorMessage}</p>}

      <label htmlFor="agent_id">Agent</label>
      <select id="agent_id" name="agent_id" required defaultValue={appointment?.agent_id}>
        <option value="">Select an agent</option>
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name}
          </option>
        ))}
      </select>

      <label htmlFor="ailment_id">Ailment</label>
      <select id="ailment_id" name="ailment_id" required defaultValue={appointment?.ailment_id}>
        <option value="">Select an ailment</option>
        {ailments.map((ailment) => (
          <option key={ailment.id} value={ailment.id}>
            {ailment.name}
          </option>
        ))}
      </select>

      <label htmlFor="therapy_id">Therapy</label>
      <select id="therapy_id" name="therapy_id" required defaultValue={appointment?.therapy_id}>
        <option value="">Select a therapy</option>
        {therapies.map((therapy) => (
          <option key={therapy.id} value={therapy.id}>
            {therapy.name} ({therapy.duration}m)
          </option>
        ))}
      </select>

      <label htmlFor="date">Date &amp; Time</label>
      <input
        type="datetime-local"
        id="date"
        name="date"
        required
        defaultValue={appointment?.date}
      />

      <label htmlFor="status">Status</label>
      <select id="status" name="status" required defaultValue={appointment?.status}>
        <option value="">Select status</option>
        <option value="scheduled">Scheduled</option>
        <option value="confirmed">Confirmed</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'}>
          {status === 'loading'
            ? 'Saving…'
            : appointment
              ? 'Update Appointment'
              : 'Schedule Appointment'}
        </button>
        {appointment && onCancel && (
          <button type="button" onClick={onCancel} style={{ backgroundColor: 'var(--pico-muted-color)' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}