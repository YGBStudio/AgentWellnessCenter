import React from 'react'
import { getAgents } from '@/lib/db/queries'
import AgentForm from './AgentForm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function AgentsPage() {
  const agents = getAgents()

  return (
    <>
      <header className="page-header">
        <h1>Agents</h1>
        <p>Manage AI agents registered at the clinic.</p>
      </header>
      <section className="page-content">
        <h2>Registered Agents</h2>
        {agents.length === 0 ? (
          <p>No agents registered yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id}>
                  <td>{agent.id}</td>
                  <td>{agent.name}</td>
                  <td>{agent.type}</td>
                  <td>{agent.created_at ? new Date(agent.created_at).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2>Register New Agent</h2>
        <AgentForm />
      </section>
    </>
  )
}
