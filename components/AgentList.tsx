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
    return <p>No agents registered yet.</p>
  }

  return (
    <table>
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
              {onEdit && <button onClick={() => onEdit(agent)}>Edit</button>}
              {onDelete && <button onClick={() => onDelete(agent)}>Delete</button>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
