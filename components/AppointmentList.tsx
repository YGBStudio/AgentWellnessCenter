import React from 'react'
import type { Appointment, Agent, Ailment, Therapy } from '@/lib/db/types'

interface AppointmentListProps {
  appointments: Appointment[]
  agents: Agent[]
  ailments: Ailment[]
  therapies: Therapy[]
  onEdit?: (appointment: Appointment) => void
  onDelete?: (appointment: Appointment) => void
}

export default function AppointmentList({
  appointments,
  agents,
  ailments,
  therapies,
  onEdit,
  onDelete,
}: AppointmentListProps) {
  if (appointments.length === 0) {
    return <p className="empty-state">No appointments scheduled yet.</p>
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Agent</th>
            <th>Ailment</th>
            <th>Therapy</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => {
            const agent = agents.find((a) => a.id === appointment.agent_id)
            const ailment = ailments.find((a) => a.id === appointment.ailment_id)
            const therapy = therapies.find((t) => t.id === appointment.therapy_id)
            return (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{agent?.name || `Agent #${appointment.agent_id}`}</td>
                <td>{ailment?.name || `Ailment #${appointment.ailment_id}`}</td>
                <td>{therapy?.name || `Therapy #${appointment.therapy_id}`}</td>
                <td>{appointment.date ? new Date(appointment.date).toLocaleString() : 'N/A'}</td>
                <td>{appointment.status}</td>
                <td>
                  <div className="table-actions">
                    {onEdit && <button onClick={() => onEdit(appointment)}>Edit</button>}
                    {onDelete && <button onClick={() => onDelete(appointment)}>Delete</button>}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
