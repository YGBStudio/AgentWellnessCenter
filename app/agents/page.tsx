'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Agent } from '@/lib/db/types'
import AgentForm from './AgentForm'
import AgentList from '@/components/AgentList'
import AdminLayout from '@/components/AdminLayout'

export const dynamic = 'force-dynamic'

export default function AgentsPage() {
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetch('/api/agents')
      .then((res) => res.json())
      .then((data) => {
        setAgents(data as Agent[])
        setLoading(false)
      })
      .catch(() => {
        setErrorMessage('Failed to load agents. Please refresh and try again.')
        setLoading(false)
      })
  }, [])

  const clearFeedback = () => {
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleDelete = async (agent: Agent) => {
    if (!confirm(`Are you sure you want to delete agent "${agent.name}"?`)) return

    clearFeedback()
    try {
      const res = await fetch(`/api/agents/${agent.id}`, { method: 'DELETE' })
      if (res.ok) {
        setAgents((prev) => prev.filter((a) => a.id !== agent.id))
        setEditingAgent(null)
        setSuccessMessage(`Deleted ${agent.name}.`)
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        setErrorMessage(data.error || 'Failed to delete agent.')
      }
    } catch {
      setErrorMessage('Network error. Please try again.')
    }
  }

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent)
  }

  const handleUpdate = async (formData: FormData) => {
    if (!editingAgent) return
    clearFeedback()
    try {
      const res = await fetch(`/api/agents/${editingAgent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name') as string,
          type: formData.get('type') as string,
        }),
      })

      if (res.ok) {
        const updated = (await res.json()) as Agent
        setAgents((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
        setEditingAgent(null)
        setSuccessMessage(`Updated ${updated.name}.`)
        router.refresh()
      } else {
        const data = (await res.json()) as { error?: string }
        const message = data.error || 'Failed to update agent.'
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
        <h1>Agents</h1>
        <p>Manage AI agents registered at the clinic.</p>
      </header>
      <section className="page-content">
        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
        {successMessage && <p className="form-success" role="status">{successMessage}</p>}

        <h2>Registered Agents</h2>
        {loading ? (
          <p className="empty-state" role="status">Loading agents...</p>
        ) : (
          <AgentList agents={agents} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        {editingAgent && (
          <div className="edit-section">
            <h2>Edit Agent</h2>
            <AgentForm
              agent={editingAgent}
              onCancel={() => setEditingAgent(null)}
              onSubmit={handleUpdate}
            />
          </div>
        )}

        <h2>Register New Agent</h2>
        <AgentForm
          onSubmit={async (formData) => {
            clearFeedback()
            try {
              const res = await fetch('/api/agents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: formData.get('name') as string,
                  type: formData.get('type') as string,
                }),
              })

              if (res.ok) {
                const created = (await res.json()) as Agent
                setAgents((prev) => [created, ...prev])
                setSuccessMessage(`Registered ${created.name}.`)
                router.refresh()
              } else {
                const data = (await res.json()) as { error?: string }
                const message = data.error || 'Failed to create agent.'
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
