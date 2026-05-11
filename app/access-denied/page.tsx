import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Access Denied | Agent Wellness Center',
  description: 'You do not have permission to access this resource.',
}

export default function AccessDeniedPage() {
  return (
    <section className="container">
      <article
        className="card shadow"
        style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center' }}
      >
        <header>
          <h1 style={{ fontSize: '2.5rem', margin: '0' }}>🔒</h1>
          <h2>Access Denied</h2>
          <p>You don&apos;t have permission to view this page.</p>
        </header>

        <p>
          If you believe this is an error, please contact your administrator.
        </p>

        <footer>
          <Link href="/" role="button" className="contrast">
            Return to Home
          </Link>
          &nbsp;
          <Link href="/dashboard" role="button" className="secondary">
            Try Dashboard
          </Link>
        </footer>
      </article>
    </section>
  )
}