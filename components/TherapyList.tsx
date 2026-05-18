import React from 'react'
import type { Therapy } from '@/lib/db/types'

export default function TherapyList({
  therapies,
  onEdit,
  onDelete,
}: {
  therapies: Therapy[]
  onEdit?: (therapy: Therapy) => void
  onDelete?: (therapy: Therapy) => void
}) {
  if (therapies.length === 0) {
    return <p className="empty-state">No therapies available yet.</p>
  }

  return (
    <div className="table-wrap table-wrap--management table-wrap--therapies">
      <table className="data-table">
        <thead>
          <tr>
            <th data-column="id">ID</th>
            <th data-column="name">Name</th>
            <th data-column="description">Description</th>
            <th data-column="duration">Duration (min)</th>
            <th data-column="created">Created</th>
            <th data-column="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {therapies.map((therapy) => (
            <tr key={therapy.id}>
              <td data-label="ID" data-column="id">{therapy.id}</td>
              <td data-label="Name" data-column="name">{therapy.name}</td>
              <td data-label="Description" data-column="description">{therapy.description}</td>
              <td data-label="Duration" data-column="duration">{therapy.duration}</td>
              <td data-label="Created" data-column="created">{therapy.created_at ? new Date(therapy.created_at).toLocaleDateString() : 'N/A'}</td>
              <td data-label="Actions" data-column="actions">
                <div className="table-actions">
                  {onEdit && <button onClick={() => onEdit(therapy)}>Edit</button>}
                  {onDelete && <button onClick={() => onDelete(therapy)}>Delete</button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
