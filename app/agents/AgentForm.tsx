'use client'

import React from 'react'

export default function AgentForm() {
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const type = formData.get('type') as string

    if (!name || !type) return

    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type })
      })

      if (res.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to create agent', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Agent Name</label>
      <input type="text" id="name" name="name" required placeholder="Enter agent name" />

      <label htmlFor="type">Agent Type</label>
      <input type="text" id="type" name="type" required placeholder="Enter agent type (e.g., LLM, Vision)" />

      <button type="submit">Register Agent</button>
    </form>
  )
}
