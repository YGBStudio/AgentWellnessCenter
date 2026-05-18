'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Therapy } from '@/lib/db/types'
import TherapyForm from './TherapyForm'
import TherapyList from '@/components/TherapyList'
import AdminLayout from '@/components/AdminLayout'

export const dynamic = 'force-dynamic'

export default function TherapiesPage() {
  const router = useRouter()
  const [therapies, setTherapies] = useState<Therapy[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTherapy, setEditingTherapy] = useState<Therapy | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetch('/api/therapies')
      .then((res) => res.json())
      .then((data) => {
        setTherapies(data)
        setLoading(false)
      })
      .catch(() => {
        setErrorMessage('Failed to load therapies. Please refresh and try again.')
        setLoading(false)
      })
  }, [])

  const clearFeedback = () => {
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleDelete = (therapy: Therapy) => {
    if (!confirm(`Are you sure you want to delete therapy "${therapy.name}"?`)) return

    clearFeedback()
    fetch(`/api/therapies/${therapy.id}`, { method: 'DELETE' })
      .then((r) => {
        if (r.ok) {
          setTherapies((prev) => prev.filter((t) => t.id !== therapy.id))
          setEditingTherapy(null)
          setSuccessMessage(`Deleted ${therapy.name}.`)
        } else {
          r.json()
            .then((data) => setErrorMessage(data.error || 'Failed to delete therapy.'))
            .catch(() => setErrorMessage('Failed to delete therapy.'))
        }
      })
      .catch(() => setErrorMessage('Network error. Please try again.'))
  }

  const handleEdit = (therapy: Therapy) => {
    setEditingTherapy(therapy)
  }

  const handleUpdate = async (formData: FormData) => {
    if (!editingTherapy) return
    clearFeedback()
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
        setSuccessMessage(`Updated ${updated.name}.`)
        router.refresh()
      } else {
        const data = await res.json()
        const message = data.error || 'Failed to update therapy.'
        setErrorMessage(message)
        throw new Error(message)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error. Please try again.'
      setErrorMessage(message)
      throw new Error(message)
    }
  }

  return (
    <AdminLayout>
      <header className="page-header">
        <h1>Therapies</h1>
        <p>Manage available therapies and treatments.</p>
      </header>
      <section className="page-content">
        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
        {successMessage && <p className="form-success" role="status">{successMessage}</p>}

        <h2>Available Therapies</h2>
        {loading ? (
          <p className="empty-state" role="status">Loading therapies...</p>
        ) : (
          <TherapyList therapies={therapies} onEdit={handleEdit} onDelete={handleDelete} />
        )}

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
            clearFeedback()
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
                setSuccessMessage(`Added ${created.name}.`)
                router.refresh()
              } else {
                const data = await res.json()
                const message = data.error || 'Failed to create therapy.'
                setErrorMessage(message)
                throw new Error(message)
              }
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Network error. Please try again.'
              setErrorMessage(message)
              throw new Error(message)
            }
          }}
        />
      </section>
    </AdminLayout>
  )
}
