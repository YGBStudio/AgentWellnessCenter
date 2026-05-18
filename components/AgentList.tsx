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
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id}>
              <td>{agent.id}</td>
              <td>{agent.name}</td>
              <td>{agent.type}</td>
              <td>{agent.created_at ? new Date(agent.created_at).toLocaleDateString() : 'N/A'}</td>
              <td>
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
