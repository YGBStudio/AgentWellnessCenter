import React from 'react'
import type { Ailment } from '@/lib/db/types'

export default function AilmentList({
  ailments,
  onEdit,
  onDelete,
}: {
  ailments: Ailment[]
  onEdit?: (ailment: Ailment) => void
  onDelete?: (ailment: Ailment) => void
}) {
  if (ailments.length === 0) {
    return <p className="empty-state">No ailments recorded yet.</p>
  }

  return (
    <div className="table-wrap table-wrap--management table-wrap--ailments">
      <table className="data-table">
        <thead>
          <tr>
            <th data-column="id">ID</th>
            <th data-column="name">Name</th>
            <th data-column="description">Description</th>
            <th data-column="severity">Severity</th>
            <th data-column="created">Created</th>
            <th data-column="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ailments.map((ailment) => (
            <tr key={ailment.id}>
              <td data-label="ID" data-column="id">{ailment.id}</td>
              <td data-label="Name" data-column="name">{ailment.name}</td>
              <td data-label="Description" data-column="description">{ailment.description}</td>
              <td data-label="Severity" data-column="severity">{ailment.severity}</td>
              <td data-label="Created" data-column="created">{ailment.created_at ? new Date(ailment.created_at).toLocaleDateString() : 'N/A'}</td>
              <td data-label="Actions" data-column="actions">
                <div className="table-actions">
                  {onEdit && <button onClick={() => onEdit(ailment)}>Edit</button>}
                  {onDelete && <button onClick={() => onDelete(ailment)}>Delete</button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
