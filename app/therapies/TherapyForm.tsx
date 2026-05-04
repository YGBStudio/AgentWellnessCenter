'use client'

import React from 'react'

export default function TherapyForm() {
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const duration = formData.get('duration') as string

    if (!name || !description || !duration) return

    try {
      const res = await fetch('/api/therapies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, duration: parseInt(duration) })
      })

      if (res.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to create therapy', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Therapy Name</label>
      <input type="text" id="name" name="name" required placeholder="Enter therapy name" />

      <label htmlFor="description">Description</label>
      <textarea id="description" name="description" required placeholder="Describe the therapy"></textarea>

      <label htmlFor="duration">Duration (minutes)</label>
      <input type="number" id="duration" name="duration" required placeholder="Enter duration in minutes" min="1" />

      <button type="submit">Add Therapy</button>
    </form>
  )
}
