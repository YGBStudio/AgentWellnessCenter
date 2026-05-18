'use client'

import React, { useState } from 'react'
import type { Ailment } from '@/lib/db/types'

interface AilmentFormProps {
  ailment?: Ailment
  onCancel?: () => void
  onSubmit: (formData: FormData) => void | Promise<void>
}

export default function AilmentForm({ ailment, onCancel, onSubmit }: AilmentFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)

    if (!formData.get('name') || !formData.get('description') || !formData.get('severity')) {
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

      <label htmlFor="name">Ailment Name</label>
      <input
        type="text"
        id="name"
        name="name"
        required
        placeholder="Enter ailment name"
        defaultValue={ailment?.name}
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        required
        placeholder="Describe the ailment"
        defaultValue={ailment?.description}
      />

      <label htmlFor="severity">Severity</label>
      <select id="severity" name="severity" required defaultValue={ailment?.severity}>
        <option value="">Select severity</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <div className="form-actions">
        <button type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'}>
          {status === 'loading' ? 'Saving…' : ailment ? 'Update Ailment' : 'Add Ailment'}
        </button>
        {ailment && onCancel && (
          <button type="button" onClick={onCancel} className="button-muted">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
