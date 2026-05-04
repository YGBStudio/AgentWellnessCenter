'use client'

import React from 'react'
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
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const agent_id = formData.get('agent_id') as string
    const ailment_id = formData.get('ailment_id') as string
    const therapy_id = formData.get('therapy_id') as string
    const date = formData.get('date') as string
    const status = formData.get('status') as string

    if (!agent_id || !ailment_id || !therapy_id || !date || !status) return

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id, ailment_id, therapy_id, date, status })
      })

      if (res.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to create appointment', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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

      <label htmlFor="date">Date & Time</label>
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

      <button type="submit">Schedule Appointment</button>
    </form>
  )
}
