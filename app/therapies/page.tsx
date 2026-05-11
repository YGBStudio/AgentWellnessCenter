'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Therapy } from '@/lib/db/types'
import TherapyForm from './TherapyForm'
import TherapyList from '@/components/TherapyList'

export const dynamic = 'force-dynamic'

export default function TherapiesPage() {
  const router = useRouter()
  const [therapies, setTherapies] = useState<Therapy[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTherapy, setEditingTherapy] = useState<Therapy | null>(null)

  useEffect(() => {
    fetch('/api/therapies')
      .then((res) => res.json())
      .then((data) => {
        setTherapies(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleDelete = (therapy: Therapy) => {
    if (!confirm(`Are you sure you want to delete therapy "${therapy.name}"?`)) return

    fetch(`/api/therapies/${therapy.id}`, { method: 'DELETE' })
      .then((r) => {
        if (r.ok) {
          setTherapies((prev) => prev.filter((t) => t.id !== therapy.id))
          setEditingTherapy(null)
        } else {
          r.json().then((data) => alert(data.error || 'Failed to delete therapy'))
        }
      })
      .catch(() => alert('Failed to delete therapy'))
  }

  const handleEdit = (therapy: Therapy) => {
    setEditingTherapy(therapy)
  }

  const handleUpdate = async (formData: FormData) => {
    if (!editingTherapy) return
    try {
      const res = await fetch(`/api/therapies/${editingTherapy.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          duration: parseInt(formData.get('duration') as string),
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        setTherapies((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
        setEditingTherapy(null)
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update therapy')
      }
    } catch {
      alert('Network error. Please try again.')
    }
  }

  return (
    <>
      <header className="page-header">
        <h1>Therapies</h1>
        <p>Manage available therapies and treatments.</p>
      </header>
      <section className="page-content">
        <h2>Available Therapies</h2>
        <TherapyList therapies={therapies} onEdit={handleEdit} onDelete={handleDelete} />

        {editingTherapy && (
          <div className="edit-section">
            <h2>Edit Therapy</h2>
            <TherapyForm
              therapy={editingTherapy}
              onCancel={() => setEditingTherapy(null)}
              onSubmit={handleUpdate}
            />
          </div>
        )}

        <h2>Add New Therapy</h2>
        <TherapyForm
          onSubmit={async (formData) => {
            try {
              const res = await fetch('/api/therapies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  duration: parseInt(formData.get('duration') as string),
                }),
              })

              if (res.ok) {
                const created = await res.json()
                setTherapies((prev) => [created, ...prev])
                router.refresh()
              } else {
                const data = await res.json()
                alert(data.error || 'Failed to create therapy')
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