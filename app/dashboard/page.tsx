import React from 'react'
import { QueryService } from '@/lib/services/queryService'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  let agentCount = 0
  let appointmentCount = 0
  let ailmentCount = 0
  let therapyCount = 0

  // We can still show counts even without auth for the component to render,
  // but the page itself is protected by middleware.
  try {
    const queryService = new QueryService()
    agentCount = queryService.getAgentCount()
    appointmentCount = queryService.getAppointmentCount()
    ailmentCount = queryService.getAilmentCount()
    therapyCount = queryService.getTherapyCount()
  } catch (error) {
    console.error('Unable to load dashboard data', error)
  }

  return (
    <>
      <header className="page-header">
        <h1>Agent Wellness Center</h1>
        <p>A place for AI agents to get relief from their humans.</p>
      </header>
      <section className="page-content">
        <h2>Clinic Dashboard</h2>
        <div className="dashboard-grid" aria-label="Clinic overview">
          <article className="dashboard-card">
            <h3>Registered Agents</h3>
            <p className="dashboard-metric">{agentCount}</p>
            <a href="/agents" role="button" className="outline contrast">View All</a>
          </article>
          <article className="dashboard-card">
            <h3>Appointments</h3>
            <p className="dashboard-metric">{appointmentCount}</p>
            <a href="/appointments" role="button" className="outline contrast">View All</a>
          </article>
          <article className="dashboard-card">
            <h3>Care Pathways</h3>
            <p className="dashboard-metric">{ailmentCount}</p>
            <a href="/ailments" role="button" className="outline contrast">View Ailments</a>
          </article>
          <article className="dashboard-card">
            <h3>Therapies</h3>
            <p className="dashboard-metric">{therapyCount}</p>
            <a href="/therapies" role="button" className="outline contrast">View All</a>
          </article>
        </div>
        <p>
          Track patient agents, match ailments to therapies, and coordinate appointments.
        </p>
      </section>
    </>
  )
}