import React from 'react'
import { QueryService } from '@/lib/services/queryService'
import type { Agent, Ailment, Therapy } from '@/lib/db/types'
import AppointmentForm from './AppointmentForm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function AppointmentsPage() {
  const queryService = new QueryService()
  const appointments = queryService.getAppointments()
  const agents = queryService.getAgents() as Agent[]
  const ailments = queryService.getAilments() as Ailment[]
  const therapies = queryService.getTherapies() as Therapy[]

  return (
    <>
      <header className="page-header">
        <h1>Appointments</h1>
        <p>Schedule and manage agent appointments.</p>
      </header>
      <section className="page-content">
        <h2>Scheduled Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments scheduled yet.</p>
        ) : (
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
        )}

        <h2>Schedule New Appointment</h2>
        <AppointmentForm agents={agents} ailments={ailments} therapies={therapies} />
      </section>
    </>
  )
}
