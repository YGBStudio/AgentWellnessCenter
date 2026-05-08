// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import AgentList from './AgentList'
import type { Agent } from '@/lib/db/types'

describe('AgentList', () => {
  const mockAgents: Agent[] = [
    { id: 1, name: 'Claude', type: 'assistant', created_at: '2026-05-03T10:00:00' },
    { id: 2, name: 'GPT-4', type: 'language-model', created_at: '2026-05-04T10:00:00' }
  ]

  it('renders empty state when no agents', () => {
    render(<AgentList agents={[]} />)
    expect(screen.getByText('No agents registered yet.')).toBeInTheDocument()
  })

  it('renders table with agent data', () => {
    render(<AgentList agents={mockAgents} />)
    expect(screen.getByText('Claude')).toBeInTheDocument()
    expect(screen.getByText('GPT-4')).toBeInTheDocument()
  })

  it('shows edit and delete buttons when callbacks provided', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(<AgentList agents={mockAgents} onEdit={onEdit} onDelete={onDelete} />)
    expect(screen.getAllByText('Edit')).toHaveLength(2)
    expect(screen.getAllByText('Delete')).toHaveLength(2)
  })
})
