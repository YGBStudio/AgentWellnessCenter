'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'
import { usePathname, useRouter } from 'next/navigation'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="site-header">
      <Link className="site-brand" href="/">
        Agent Wellness Center
      </Link>
      <nav aria-label="Primary">
        {isAuthenticated ? (
          <>
            <span className="user-info">
              {user?.email} ({user?.role})
            </span>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={handleLogout} className="nav-link">Logout</button>
          </>
        ) : (
          <>
            <Link href="/">Home</Link>
            <Link href="/agents">Agents</Link>
            <Link href="/appointments">Appointments</Link>
            <Link href="/ailments">Ailments</Link>
            <Link href="/therapies">Therapies</Link>
            <Link href="/login" className="nav-link primary">Login</Link>
          </>
        )}
      </nav>
    </header>
  )
}
