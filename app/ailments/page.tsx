'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Ailment } from '@/lib/db/types'
import AilmentForm from './AilmentForm'
import AilmentList from '@/components/AilmentList'
import AdminLayout from '@/components/AdminLayout'

export const dynamic = 'force-dynamic'

export default function AilmentsPage() {
  const router = useRouter()
  const [ailments, setAilments] = useState<Ailment[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAilment, setEditingAilment] = useState<Ailment | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetch('/api/ailments')
      .then((res) => res.json())
      .then((data) => {
        setAilments(data as Ailment[])
        setLoading(false)
      })
      .catch(() => {
        setErrorMessage('Failed to load ailments. Please refresh and try again.')
        setLoading(false)
      })
  }, [])

  const clearFeedback = () => {
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleDelete = (ailment: Ailment) => {
    if (!confirm(`Are you sure you want to delete ailment "${ailment.name}"?`)) return

    clearFeedback()
    fetch(`/api/ailments/${ailment.id}`, { method: 'DELETE' })
      .then((r) => {
        if (r.ok) {
          setAilments((prev) => prev.filter((a) => a.id !== ailment.id))
          setEditingAilment(null)
          setSuccessMessage(`Deleted ${ailment.name}.`)
        } else {
          r.json()
            .then((data) => setErrorMessage((data as { error?: string }).error || 'Failed to delete ailment.'))
            .catch(() => setErrorMessage('Failed to delete ailment.'))
        }
      })
      .catch(() => setErrorMessage('Network error. Please try again.'))
  }

  const handleEdit = (ailment: Ailment) => {
    setEditingAilment(ailment)
  }

  const handleUpdate = async (formData: FormData) => {
    if (!editingAilment) return
    clearFeedback()
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
        const updated = (await res.json()) as Ailment
        setAilments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
        setEditingAilment(null)
        setSuccessMessage(`Updated ${updated.name}.`)
        router.refresh()
      } else {
        const data = (await res.json()) as { error?: string }
        const message = data.error || 'Failed to update ailment.'
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
        <h1>Ailments</h1>
        <p>Manage AI agent ailments and conditions.</p>
      </header>
      <section className="page-content">
        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
        {successMessage && <p className="form-success" role="status">{successMessage}</p>}

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
            clearFeedback()
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
                const created = (await res.json()) as Ailment
                setAilments((prev) => [created, ...prev])
                setSuccessMessage(`Added ${created.name}.`)
                router.refresh()
              } else {
                const data = (await res.json()) as { error?: string }
                const message = data.error || 'Failed to create ailment.'
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
