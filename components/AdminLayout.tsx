'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'

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
  const { isAuthenticated, role, logout } = useAuth()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!isAuthenticated || role !== 'admin') {
    return null
  }

  return (
    <div className="admin-layout">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
            Agent Wellness Center
          </Link>
        </div>
        <nav aria-label="Admin navigation">
          <ul>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setMobileOpen(false)}>
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="sidebar-footer">
            <button onClick={handleLogout} className="sidebar-logout">
              🚪 Logout
            </button>
          </div>
        </nav>
      </aside>

      <div className="admin-content">
        <header className="mobile-header">
          <button
            className="menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <span>Agent Wellness Center</span>
        </header>
        <main>{children}</main>
      </div>
    </div>
  )
}