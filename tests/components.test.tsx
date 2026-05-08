// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import AgentList from '@/components/AgentList'
import AilmentList from '@/components/AilmentList'
import TherapyList from '@/components/TherapyList'
import type { Agent, Ailment, Therapy } from '@/lib/db/types'

describe('Component Tests', () => {
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

  describe('AilmentList', () => {
    const mockAilments: Ailment[] = [
      { id: 1, name: 'Hallucination', description: 'Generating false info', severity: 'high', created_at: '2026-05-03T10:00:00' },
      { id: 2, name: 'Context Overflow', description: 'Too much context', severity: 'medium', created_at: '2026-05-04T10:00:00' }
    ]

    it('renders empty state when no ailments', () => {
      render(<AilmentList ailments={[]} />)
      expect(screen.getByText('No ailments recorded yet.')).toBeInTheDocument()
    })

    it('renders table with ailment data', () => {
      render(<AilmentList ailments={mockAilments} />)
      expect(screen.getByText('Hallucination')).toBeInTheDocument()
      expect(screen.getByText('Context Overflow')).toBeInTheDocument()
    })
  })

  describe('TherapyList', () => {
    const mockTherapies: Therapy[] = [
      { id: 1, name: 'Context Pruning', description: 'Reduce context window', duration: 30, created_at: '2026-05-03T10:00:00' },
      { id: 2, name: 'Training Boost', description: 'Additional training', duration: 60, created_at: '2026-05-04T10:00:00' }
    ]

    it('renders empty state when no therapies', () => {
      render(<TherapyList therapies={[]} />)
      expect(screen.getByText('No therapies available yet.')).toBeInTheDocument()
    })

    it('renders table with therapy data', () => {
      render(<TherapyList therapies={mockTherapies} />)
      expect(screen.getByText('Context Pruning')).toBeInTheDocument()
      expect(screen.getByText('Training Boost')).toBeInTheDocument()
    })
  })
})
