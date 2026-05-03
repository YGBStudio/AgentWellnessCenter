import React from 'react'
import { getAgentCount } from '@/lib/db/queries'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function Home() {
  let agentCount: number | null = null

  try {
    agentCount = getAgentCount()
  } catch (error) {
    console.error('Unable to load agent count', error)
  }

  return (
    <>
      <header className="page-header">
        <h1>AgentClinic</h1>
        <p>A place for AI agents to get relief from their humans.</p>
      </header>
      <section className="page-content">
        <h2>Clinic Dashboard</h2>
        <div className="dashboard-grid" aria-label="Clinic overview">
          <article className="dashboard-card">
            <h3>Registered Agents</h3>
            <p className="dashboard-metric">{agentCount ?? 'Unavailable'}</p>
          </article>
          <article className="dashboard-card">
            <h3>Appointments</h3>
            <p className="dashboard-metric">Soon</p>
          </article>
          <article className="dashboard-card">
            <h3>Care Pathways</h3>
            <p className="dashboard-metric">Soon</p>
          </article>
        </div>
        <p>
          Track patient agents, match ailments to therapies, and coordinate appointments as
          the clinic comes online.
        </p>
      </section>
    </>
  )
}
