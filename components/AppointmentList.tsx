import React from 'react'
import type { Appointment, Agent, Ailment, Therapy } from '@/lib/db/types'

export default function AppointmentList({ appointments, agents, ailments, therapies }: {
  appointments: Appointment[]
  agents: Agent[]
  ailments: Ailment[]
  therapies: Therapy[]
}) {
  if (appointments.length === 0) {
    return <p>No appointments scheduled yet.</p>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Agent</th>
          <th>Ailment</th>
          <th>Therapy</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((appointment) => {
          const agent = agents.find(a => a.id === appointment.agent_id)
          const ailment = ailments.find(a => a.id === appointment.ailment_id)
          const therapy = therapies.find(t => t.id === appointment.therapy_id)
          return (
            <tr key={appointment.id}>
              <td>{appointment.id}</td>
              <td>{agent?.name || `Agent #${appointment.agent_id}`}</td>
              <td>{ailment?.name || `Ailment #${appointment.ailment_id}`}</td>
              <td>{therapy?.name || `Therapy #${appointment.therapy_id}`}</td>
              <td>{appointment.date ? new Date(appointment.date).toLocaleString() : 'N/A'}</td>
              <td>{appointment.status}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
