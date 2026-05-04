'use client'

import React from 'react'

export default function AilmentForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const severity = formData.get('severity') as string

    if (!name || !description || !severity) return

    try {
      const res = await fetch('/api/ailments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, severity })
      })

      if (res.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to create ailment', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Ailment Name</label>
      <input type="text" id="name" name="name" required placeholder="Enter ailment name" />

      <label htmlFor="description">Description</label>
      <textarea id="description" name="description" required placeholder="Describe the ailment"></textarea>

      <label htmlFor="severity">Severity</label>
      <select id="severity" name="severity" required>
        <option value="">Select severity</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <button type="submit">Add Ailment</button>
    </form>
  )
}
