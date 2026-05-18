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
    <div className="table-wrap table-wrap--management table-wrap--appointments">
      <table className="data-table">
        <thead>
          <tr>
            <th data-column="id">ID</th>
            <th data-column="agent">Agent</th>
            <th data-column="ailment">Ailment</th>
            <th data-column="therapy">Therapy</th>
            <th data-column="date">Date</th>
            <th data-column="status">Status</th>
            <th data-column="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => {
            const agent = agents.find((a) => a.id === appointment.agent_id)
            const ailment = ailments.find((a) => a.id === appointment.ailment_id)
            const therapy = therapies.find((t) => t.id === appointment.therapy_id)
            return (
              <tr key={appointment.id}>
                <td data-label="ID" data-column="id">{appointment.id}</td>
                <td data-label="Agent" data-column="agent">{agent?.name || `Agent #${appointment.agent_id}`}</td>
                <td data-label="Ailment" data-column="ailment">{ailment?.name || `Ailment #${appointment.ailment_id}`}</td>
                <td data-label="Therapy" data-column="therapy">{therapy?.name || `Therapy #${appointment.therapy_id}`}</td>
                <td data-label="Date" data-column="date">{appointment.date ? new Date(appointment.date).toLocaleString() : 'N/A'}</td>
                <td data-label="Status" data-column="status">{appointment.status}</td>
                <td data-label="Actions" data-column="actions">
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
