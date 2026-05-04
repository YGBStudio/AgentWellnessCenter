import React from 'react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="site-header">
      <Link className="site-brand" href="/">
        AgentClinic
      </Link>
      <nav aria-label="Primary">
        <Link href="/">Home</Link>
        <Link href="/agents">Agents</Link>
        <Link href="/appointments">Appointments</Link>
        <Link href="/ailments">Ailments</Link>
        <Link href="/therapies">Therapies</Link>
      </nav>
    </header>
  )
}
