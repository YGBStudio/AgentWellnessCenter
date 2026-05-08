import React from 'react'
import { QueryService } from '@/lib/services/queryService'
import AppointmentList from '@/components/AppointmentList'
import AppointmentForm from './AppointmentForm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function AppointmentsPage() {
  const queryService = new QueryService()
  const appointments = queryService.getAppointments()
  const agents = queryService.getAgents()
  const ailments = queryService.getAilments()
  const therapies = queryService.getTherapies()

  return (
    <>
      <header className="page-header">
        <h1>Appointments</h1>
        <p>Schedule and manage agent appointments.</p>
      </header>
      <section className="page-content">
        <h2>Scheduled Appointments</h2>
        <AppointmentList
          appointments={appointments}
          agents={agents}
          ailments={ailments}
          therapies={therapies}
        />
        <h2>Schedule New Appointment</h2>
        <AppointmentForm agents={agents} ailments={ailments} therapies={therapies} />
      </section>
    </>
  )
}
