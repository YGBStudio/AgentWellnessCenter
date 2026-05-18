'use client'

import React, { useState } from 'react'
import type { Therapy } from '@/lib/db/types'

interface TherapyFormProps {
  therapy?: Therapy
  onCancel?: () => void
  onSubmit: (formData: FormData) => void | Promise<void>
}

export default function TherapyForm({ therapy, onCancel, onSubmit }: TherapyFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)

    if (!formData.get('name') || !formData.get('description') || !formData.get('duration')) {
      setStatus('error')
      setErrorMessage('Please fill in all fields.')
      return
    }

    try {
      await onSubmit(formData)
      setStatus('success')
      e.currentTarget.reset()
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="resource-form">
      {status === 'success' && <p role="status" className="form-success">Success!</p>}
      {status === 'error' && <p role="alert" className="form-error">{errorMessage}</p>}

      <label htmlFor="name">Therapy Name</label>
      <input
        type="text"
        id="name"
        name="name"
        required
        placeholder="Enter therapy name"
        defaultValue={therapy?.name}
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        required
        placeholder="Describe the therapy"
        defaultValue={therapy?.description}
      />

      <label htmlFor="duration">Duration (minutes)</label>
      <input
        type="number"
        id="duration"
        name="duration"
        required
        placeholder="Enter duration in minutes"
        min="1"
        defaultValue={therapy?.duration}
      />

      <div className="form-actions">
        <button type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'}>
          {status === 'loading' ? 'Saving…' : therapy ? 'Update Therapy' : 'Add Therapy'}
        </button>
        {therapy && onCancel && (
          <button type="button" onClick={onCancel} className="button-muted">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
