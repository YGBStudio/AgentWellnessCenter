// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'

const mockQueryService = vi.hoisted(() => ({
  getAgentCount: vi.fn().mockReturnValue(3),
  getAppointmentCount: vi.fn().mockReturnValue(5),
  getAilmentCount: vi.fn().mockReturnValue(2),
  getTherapyCount: vi.fn().mockReturnValue(4),
  getAgents: vi.fn().mockReturnValue([]),
  getAilments: vi.fn().mockReturnValue([]),
  getTherapies: vi.fn().mockReturnValue([]),
  getAppointments: vi.fn().mockReturnValue([]),
  getAgentById: vi.fn(),
  getAilmentById: vi.fn(),
  getTherapyById: vi.fn(),
  getAppointmentById: vi.fn(),
}))

// Mock the runtime QueryService to avoid real DB access during tests
vi.mock('@/lib/services/runtimeQueryService', () => ({
  getRuntimeQueryService: vi.fn(() => mockQueryService),
}))

// Mock auth context for all client components that use useAuth
vi.mock('@/lib/auth/context', () => ({
  useAuth: () => ({
    user: { id: 1, email: 'admin@agentclinic.demo', role: 'admin' },
    isAuthenticated: true,
    role: 'admin',
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ push: vi.fn() }),
}))

// Next.js async server components return a Promise<JSX.Element>.
// We import the module then resolve it for rendering.
import HomePage from '@/app/page'
import DashboardPage from '@/app/dashboard/page'

async function renderAsyncComponent(Component: typeof HomePage | typeof DashboardPage) {
  const jsx = await Component()
  render(<>{jsx}</>)
}

describe('App Page Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders home page with correct heading', async () => {
    await renderAsyncComponent(HomePage)
    expect(screen.getByRole('heading', { level: 1, name: 'Agent Wellness Center' })).toBeInTheDocument()
  })

  it('displays clinic description', async () => {
    await renderAsyncComponent(HomePage)
    expect(screen.getByText('A place for AI agents to get relief from their humans.')).toBeInTheDocument()
  })

  it('shows CTA buttons on the home page', async () => {
    await renderAsyncComponent(HomePage)
    expect(screen.getByRole('button', { name: /book an appointment/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /staff dashboard/i })).toBeInTheDocument()
  })
})

describe('Dashboard Page Tests', () => {
  it('shows dashboard heading', async () => {
    await renderAsyncComponent(DashboardPage)
    expect(screen.getByRole('heading', { name: /Clinic Dashboard/i })).toBeInTheDocument()
  })

  it('displays mocked dashboard metrics', async () => {
    await renderAsyncComponent(DashboardPage)
    expect(screen.getByText('3')).toBeInTheDocument()   // agentCount
    expect(screen.getByText('5')).toBeInTheDocument()   // appointmentCount
    expect(screen.getByText('2')).toBeInTheDocument()   // ailmentCount
    expect(screen.getByText('4')).toBeInTheDocument()   // therapyCount
  })
})
