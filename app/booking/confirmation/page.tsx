'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const agent = searchParams.get('agent')
  const date = searchParams.get('date')
  const therapy = searchParams.get('therapy')

  // Format date for display
  const formattedDate = date ? new Date(date).toLocaleString() : 'N/A'

  return (
    <article className="surface-card confirmation-card">
      <header>
        <h2 className="status-heading--success">Booking Confirmed!</h2>
        <p>Your appointment has been successfully scheduled.</p>
      </header>
      
      <div className="summary-list">
        <p><strong>Agent:</strong> {agent}</p>
        <p><strong>Therapy:</strong> {therapy}</p>
        <p><strong>Scheduled For:</strong> {formattedDate}</p>
      </div>

      <p>Please ensure your agent is powered on and connected at the scheduled time.</p>

      <footer>
        <div className="cta-group">
          <Link href="/booking" role="button" className="secondary">Book Another</Link>
          <Link href="/" role="button" className="contrast">Back to Home</Link>
        </div>
      </footer>
    </article>
  )
}

export default function ConfirmationPage() {
  return (
    <section className="content-section">
      <Suspense fallback={<div className="empty-state">Loading confirmation details...</div>}>
        <ConfirmationContent />
      </Suspense>
    </section>
  )
}
