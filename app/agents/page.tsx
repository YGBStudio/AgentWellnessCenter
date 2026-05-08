import React from 'react'
import { QueryService } from '@/lib/services/queryService'
import AgentForm from './AgentForm'
import AgentList from '@/components/AgentList'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function AgentsPage() {
  const queryService = new QueryService()
  const agents = queryService.getAgents()

  return (
    <>
      <header className="page-header">
        <h1>Agents</h1>
        <p>Manage AI agents registered at the clinic.</p>
      </header>
      <section className="page-content">
        <h2>Registered Agents</h2>
        <AgentList agents={agents} />
        <h2>Register New Agent</h2>
        <AgentForm />
      </section>
    </>
  )
}
