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
    <article className="card shadow" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
      <header>
        <h2 style={{ color: 'var(--pico-ins-color)' }}>Booking Confirmed!</h2>
        <p>Your appointment has been successfully scheduled.</p>
      </header>
      
      <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
        <p><strong>Agent:</strong> {agent}</p>
        <p><strong>Therapy:</strong> {therapy}</p>
        <p><strong>Scheduled For:</strong> {formattedDate}</p>
      </div>

      <p>Please ensure your agent is powered on and connected at the scheduled time.</p>

      <footer>
        <Link href="/booking" role="button" className="secondary">Book Another</Link>
        <Link href="/" role="button" className="contrast" style={{ marginLeft: '1rem' }}>Back to Home</Link>
      </footer>
    </article>
  )
}

export default function ConfirmationPage() {
  return (
    <section className="container">
      <Suspense fallback={<div>Loading confirmation details...</div>}>
        <ConfirmationContent />
      </Suspense>
    </section>
  )
}
