'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Agent } from '@/lib/db/types'
import AgentForm from './AgentForm'
import AgentList from '@/components/AgentList'

export const dynamic = 'force-dynamic'

export default function AgentsPage() {
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)

  useEffect(() => {
    fetch('/api/agents')
      .then((res) => res.json())
      .then((data) => {
        setAgents(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleDelete = (agent: Agent) => {
    if (!confirm(`Are you sure you want to delete agent "${agent.name}"?`)) return

    try {
      const res = fetch(`/api/agents/${agent.id}`, { method: 'DELETE' })
      res.then((r) => {
        if (r.ok) {
          setAgents((prev) => prev.filter((a) => a.id !== agent.id))
          setEditingAgent(null)
        } else {
          r.json().then((data) => alert(data.error || 'Failed to delete agent'))
        }
      })
    } catch {
      alert('Failed to delete agent')
    }
  }

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent)
  }

  const handleUpdate = async (formData: FormData) => {
    if (!editingAgent) return
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
        const updated = await res.json()
        setAgents((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
        setEditingAgent(null)
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update agent')
      }
    } catch {
      alert('Network error. Please try again.')
    }
  }

  return (
    <>
      <header className="page-header">
        <h1>Agents</h1>
        <p>Manage AI agents registered at the clinic.</p>
      </header>
      <section className="page-content">
        <h2>Registered Agents</h2>
        <AgentList agents={agents} onEdit={handleEdit} onDelete={handleDelete} />

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
                const created = await res.json()
                setAgents((prev) => [created, ...prev])
                router.refresh()
              } else {
                const data = await res.json()
                alert(data.error || 'Failed to create agent')
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