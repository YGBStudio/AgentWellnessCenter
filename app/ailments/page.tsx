'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Ailment } from '@/lib/db/types'
import AilmentForm from './AilmentForm'
import AilmentList from '@/components/AilmentList'

export const dynamic = 'force-dynamic'

export default function AilmentsPage() {
  const router = useRouter()
  const [ailments, setAilments] = useState<Ailment[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAilment, setEditingAilment] = useState<Ailment | null>(null)

  useEffect(() => {
    fetch('/api/ailments')
      .then((res) => res.json())
      .then((data) => {
        setAilments(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleDelete = (ailment: Ailment) => {
    if (!confirm(`Are you sure you want to delete ailment "${ailment.name}"?`)) return

    fetch(`/api/ailments/${ailment.id}`, { method: 'DELETE' })
      .then((r) => {
        if (r.ok) {
          setAilments((prev) => prev.filter((a) => a.id !== ailment.id))
          setEditingAilment(null)
        } else {
          r.json().then((data) => alert(data.error || 'Failed to delete ailment'))
        }
      })
      .catch(() => alert('Failed to delete ailment'))
  }

  const handleEdit = (ailment: Ailment) => {
    setEditingAilment(ailment)
  }

  const handleUpdate = async (formData: FormData) => {
    if (!editingAilment) return
    try {
      const res = await fetch(`/api/ailments/${editingAilment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          severity: formData.get('severity') as string,
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        setAilments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
        setEditingAilment(null)
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update ailment')
      }
    } catch {
      alert('Network error. Please try again.')
    }
  }

  return (
    <>
      <header className="page-header">
        <h1>Ailments</h1>
        <p>Manage AI agent ailments and conditions.</p>
      </header>
      <section className="page-content">
        <h2>Known Ailments</h2>
        {loading ? (
          <p className="empty-state" role="status">Loading ailments...</p>
        ) : (
          <AilmentList ailments={ailments} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        {editingAilment && (
          <div className="edit-section">
            <h2>Edit Ailment</h2>
            <AilmentForm
              ailment={editingAilment}
              onCancel={() => setEditingAilment(null)}
              onSubmit={handleUpdate}
            />
          </div>
        )}

        <h2>Add New Ailment</h2>
        <AilmentForm
          onSubmit={async (formData) => {
            try {
              const res = await fetch('/api/ailments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  severity: formData.get('severity') as string,
                }),
              })

              if (res.ok) {
                const created = await res.json()
                setAilments((prev) => [created, ...prev])
                router.refresh()
              } else {
                const data = await res.json()
                alert(data.error || 'Failed to create ailment')
              }
            } catch {
              alert('Network error. Please try again.')
            }
          }}
        />
      </section>
    </>
  )
}
