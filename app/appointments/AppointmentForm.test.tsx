// @vitest-environment jsdom
import React from 'react'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AppointmentForm from './AppointmentForm'
import type { Agent, Ailment, Therapy } from '@/lib/db/types'

describe('AppointmentForm', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not allow selecting appointment times before now', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-20T20:30:00Z'))

    render(
      <AppointmentForm
        agents={agents}
        ailments={ailments}
        therapies={therapies}
        onSubmit={vi.fn()}
      />
    )

    expect(screen.getByLabelText(/date & time/i)).toHaveAttribute('min', '2026-05-20T14:30')
  })
})

const agents: Agent[] = [
  {
    id: 1,
    name: 'Atlas-7',
    type: 'LLM care coordinator',
    created_at: '2026-05-20T00:00:00Z',
  },
]

const ailments: Ailment[] = [
  {
    id: 1,
    name: 'Prompt Drift',
    description: 'Instructions gradually lose influence.',
    severity: 'high',
    created_at: '2026-05-20T00:00:00Z',
  },
]

const therapies: Therapy[] = [
  {
    id: 1,
    name: 'Prompt Grounding Session',
    description: 'Re-centers system and developer instructions.',
    duration: 30,
    created_at: '2026-05-20T00:00:00Z',
  },
]
