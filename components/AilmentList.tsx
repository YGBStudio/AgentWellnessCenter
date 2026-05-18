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
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Severity</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ailments.map((ailment) => (
            <tr key={ailment.id}>
              <td>{ailment.id}</td>
              <td>{ailment.name}</td>
              <td>{ailment.description}</td>
              <td>{ailment.severity}</td>
              <td>{ailment.created_at ? new Date(ailment.created_at).toLocaleDateString() : 'N/A'}</td>
              <td>
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
