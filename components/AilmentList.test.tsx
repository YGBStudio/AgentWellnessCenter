// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import AilmentList from './AilmentList'
import type { Ailment } from '@/lib/db/types'

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

  it('shows edit and delete buttons when callbacks provided', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(<AilmentList ailments={mockAilments} onEdit={onEdit} onDelete={onDelete} />)
    expect(screen.getAllByText('Edit')).toHaveLength(2)
    expect(screen.getAllByText('Delete')).toHaveLength(2)
  })
})
