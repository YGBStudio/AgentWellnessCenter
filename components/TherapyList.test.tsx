// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import TherapyList from './TherapyList'
import type { Therapy } from '@/lib/db/types'

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

  it('shows edit and delete buttons when callbacks provided', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(<TherapyList therapies={mockTherapies} onEdit={onEdit} onDelete={onDelete} />)
    expect(screen.getAllByText('Edit')).toHaveLength(2)
    expect(screen.getAllByText('Delete')).toHaveLength(2)
  })
})
