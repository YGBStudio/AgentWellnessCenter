// @vitest-environment jsdom
import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Header from './Header'

const mockState = vi.hoisted(() => ({
  auth: {
    user: null as null | { id: number; email: string; role: 'admin' | 'staff' },
    isAuthenticated: false,
    role: null as null | 'admin' | 'staff',
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
  },
  pathname: '/',
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

describe('Header NavBar', () => {
  beforeEach(() => {
    mockState.auth.user = null
    mockState.auth.isAuthenticated = false
    mockState.auth.role = null
    mockState.auth.logout.mockClear()
    mockState.push.mockClear()
    mockState.pathname = '/'
  })

  it('renders public navigation with active home link', () => {
    render(<Header />)

    expect(screen.getByRole('link', { name: /agent wellness center/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Booking' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Agents' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Appointments' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ailments' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Therapies' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument()
  })

  it('marks descendant routes as active', () => {
    mockState.pathname = '/booking/confirmation'

    render(<Header />)

    expect(screen.getByRole('link', { name: 'Booking' })).toHaveAttribute('aria-current', 'page')
  })

  it('toggles and closes the mobile menu with ARIA state', () => {
    render(<Header />)

    const toggle = screen.getByRole('button', { name: /open primary navigation/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)
    fireEvent.click(screen.getByRole('link', { name: 'Booking' }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders authenticated user context and logs out', () => {
    mockState.pathname = '/dashboard'
    mockState.auth.user = { id: 1, email: 'admin@agentclinic.demo', role: 'admin' }
    mockState.auth.isAuthenticated = true
    mockState.auth.role = 'admin'

    render(<Header />)

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('admin@agentclinic.demo')).toBeInTheDocument()
    expect(screen.getByText('admin')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }))

    expect(mockState.auth.logout).toHaveBeenCalledTimes(1)
    expect(mockState.push).toHaveBeenCalledWith('/')
  })
})
