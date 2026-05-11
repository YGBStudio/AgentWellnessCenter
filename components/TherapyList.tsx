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
    return <p>No therapies available yet.</p>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Duration (min)</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {therapies.map((therapy) => (
          <tr key={therapy.id}>
            <td>{therapy.id}</td>
            <td>{therapy.name}</td>
            <td>{therapy.description}</td>
            <td>{therapy.duration}</td>
            <td>{therapy.created_at ? new Date(therapy.created_at).toLocaleDateString() : 'N/A'}</td>
            <td>
              {onEdit && <button onClick={() => onEdit(therapy)}>Edit</button>}
              {onDelete && <button onClick={() => onDelete(therapy)}>Delete</button>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
