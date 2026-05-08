// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'

// Mock the QueryService to avoid real DB access during tests
vi.mock('@/lib/services/queryService', () => ({
  QueryService: vi.fn().mockImplementation(() => ({
    getAgentCount: vi.fn().mockReturnValue(3),
    getAppointmentCount: vi.fn().mockReturnValue(5),
    getAilmentCount: vi.fn().mockReturnValue(2),
    getTherapyCount: vi.fn().mockReturnValue(4),
  })),
}))

// Next.js async server components return a Promise<JSX.Element>.
// We import the module then resolve it for rendering.
import HomePage from '@/app/page'

async function renderAsyncComponent(Component: typeof HomePage) {
  const jsx = await Component()
  render(<>{jsx}</>)
}

describe('App Page Tests', () => {
  it('renders home page with correct heading', async () => {
    await renderAsyncComponent(HomePage)
    expect(screen.getByRole('heading', { level: 1, name: 'Agent Wellness Center' })).toBeInTheDocument()
  })

  it('displays clinic description', async () => {
    await renderAsyncComponent(HomePage)
    expect(screen.getByText('A place for AI agents to get relief from their humans.')).toBeInTheDocument()
  })

  it('shows dashboard heading', async () => {
    await renderAsyncComponent(HomePage)
    expect(screen.getByRole('heading', { level: 2, name: /dashboard/i })).toBeInTheDocument()
  })

  it('displays mocked dashboard metrics', async () => {
    await renderAsyncComponent(HomePage)
    expect(screen.getByText('3')).toBeInTheDocument()   // agentCount
    expect(screen.getByText('5')).toBeInTheDocument()   // appointmentCount
    expect(screen.getByText('2')).toBeInTheDocument()   // ailmentCount
    expect(screen.getByText('4')).toBeInTheDocument()   // therapyCount
  })
})
