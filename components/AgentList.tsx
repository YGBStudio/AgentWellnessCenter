import React from 'react'
import type { Agent } from '@/lib/db/types'

export default function AgentList({
  agents,
  onEdit,
  onDelete,
}: {
  agents: Agent[]
  onEdit?: (agent: Agent) => void
  onDelete?: (agent: Agent) => void
}) {
  if (agents.length === 0) {
    return <p className="empty-state">No agents registered yet.</p>
  }

  return (
    <div className="table-wrap table-wrap--management table-wrap--agents">
      <table className="data-table">
        <thead>
          <tr>
            <th data-column="id">ID</th>
            <th data-column="name">Name</th>
            <th data-column="type">Type</th>
            <th data-column="created">Created</th>
            <th data-column="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id}>
              <td data-label="ID" data-column="id">{agent.id}</td>
              <td data-label="Name" data-column="name">{agent.name}</td>
              <td data-label="Type" data-column="type">{agent.type}</td>
              <td data-label="Created" data-column="created">{agent.created_at ? new Date(agent.created_at).toLocaleDateString() : 'N/A'}</td>
              <td data-label="Actions" data-column="actions">
                <div className="table-actions">
                  {onEdit && <button onClick={() => onEdit(agent)}>Edit</button>}
                  {onDelete && <button onClick={() => onDelete(agent)}>Delete</button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
