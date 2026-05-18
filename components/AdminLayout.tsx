'use client'

import React, { useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'
import { usePathname, useRouter } from 'next/navigation'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/agents', label: 'Agents', icon: '🤖' },
  { href: '/ailments', label: 'Ailments', icon: '🩺' },
  { href: '/therapies', label: 'Therapies', icon: '💊' },
  { href: '/appointments', label: 'Appointments', icon: '📅' },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, role, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const sidebarId = useId()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [mobileOpen])

  const handleLogout = async () => {
    setMobileOpen(false)
    await logout()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="admin-layout admin-layout--loading">
        <div className="admin-content admin-content--full">
          <div className="admin-content__body">
            <p className="empty-state" role="status">Loading admin workspace...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || (role !== 'admin' && role !== 'staff')) {
    return null
  }

  return (
    <div className="admin-layout">
      <aside id={sidebarId} className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
            Agent Wellness Center
          </Link>
        </div>
        <nav aria-label="Admin navigation">
          <ul>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="sidebar-footer">
            <button type="button" onClick={handleLogout} className="sidebar-logout">
              🚪 Logout
            </button>
          </div>
        </nav>
      </aside>

      <div className="admin-content">
        <header className="mobile-header">
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close admin navigation' : 'Open admin navigation'}
            aria-expanded={mobileOpen}
            aria-controls={sidebarId}
          >
            ☰
          </button>
          <span>Agent Wellness Center</span>
        </header>
        <div className="admin-content__body">{children}</div>
      </div>
    </div>
  )
}
