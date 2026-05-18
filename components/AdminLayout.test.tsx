// @vitest-environment jsdom
import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AdminLayout from './AdminLayout'

const mockState = vi.hoisted(() => ({
  auth: {
    user: { id: 1, email: 'staff@agentclinic.demo', role: 'staff' as const },
    isAuthenticated: true,
    role: 'staff' as 'admin' | 'staff' | null,
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
  },
  pathname: '/agents',
  push: vi.fn(),
}))

vi.mock('@/lib/auth/context', () => ({
  useAuth: () => mockState.auth,
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    onClick,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault()
        onClick?.(event)
      }}
      {...props}
    >
      {children}
    </a>
  ),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => mockState.pathname,
  useRouter: () => ({ push: mockState.push }),
}))

describe('AdminLayout', () => {
  beforeEach(() => {
    mockState.auth.isAuthenticated = true
    mockState.auth.role = 'staff'
    mockState.auth.loading = false
    mockState.auth.logout.mockReset()
    mockState.auth.logout.mockResolvedValue(undefined)
    mockState.pathname = '/agents'
    mockState.push.mockClear()
  })

  it('renders management navigation for authenticated staff users', () => {
    render(
      <AdminLayout>
        <h1>Agents</h1>
      </AdminLayout>
    )

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /agents/i })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /ailments/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /therapies/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /appointments/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Agents' })).toBeInTheDocument()
  })

  it('logs out from the sidebar', async () => {
    render(
      <AdminLayout>
        <h1>Dashboard</h1>
      </AdminLayout>
    )

    fireEvent.click(screen.getByRole('button', { name: /logout/i }))

    expect(mockState.auth.logout).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(mockState.push).toHaveBeenCalledWith('/'))
  })
})
