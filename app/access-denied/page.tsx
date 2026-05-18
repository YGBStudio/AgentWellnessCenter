import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Access Denied | Agent Wellness Center',
  description: 'You do not have permission to access this resource.',
}

export default function AccessDeniedPage() {
  return (
    <section className="content-section">
      <article className="feedback-card">
        <header>
          <div className="feedback-icon" aria-hidden="true">!</div>
          <h2>Access Denied</h2>
          <p>You don&apos;t have permission to view this page.</p>
        </header>

        <p>
          If you believe this is an error, please contact your administrator.
        </p>

        <footer>
          <div className="cta-group">
            <Link href="/" role="button" className="contrast">
              Return to Home
            </Link>
            <Link href="/dashboard" role="button" className="secondary">
              Try Dashboard
            </Link>
          </div>
        </footer>
      </article>
    </section>
  )
}
