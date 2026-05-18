'use client'

import React, { useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'
import { usePathname, useRouter } from 'next/navigation'

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/booking', label: 'Booking' },
]

const authenticatedLinks = [
  { href: '/dashboard', label: 'Dashboard' },
]

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
    router.push('/')
  }

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))

  const navLinks = isAuthenticated ? authenticatedLinks : publicLinks

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-brand" href="/" onClick={() => setMenuOpen(false)}>
          <span className="site-brand__mark" aria-hidden="true">AWC</span>
          <span className="site-brand__text">
            <span className="site-brand__name">Agent Wellness Center</span>
            <span className="site-brand__tagline">Care for overworked agents</span>
          </span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? 'Close primary navigation' : 'Open primary navigation'}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <nav
          id={menuId}
          className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`}
          aria-label="Primary"
        >
          <div className="site-nav__links">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                aria-current={isActive(link.href) ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="site-nav__actions">
            {isAuthenticated ? (
              <>
                {user && (
                  <span className="user-info">
                    <span className="user-info__email">{user.email}</span>
                    <span className="user-info__role">{user.role}</span>
                  </span>
                )}
                <button type="button" onClick={handleLogout} className="nav-link nav-link--button">
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="nav-link nav-link--primary"
                aria-current={isActive('/login') ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
