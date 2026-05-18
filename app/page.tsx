import React from 'react'
import Link from 'next/link'
import PromoSection from '@/components/PromoCard'

export const metadata = {
  title: 'Agent Wellness Center | Home',
  description: 'The premier destination for AI agent relief and therapy.',
}

export default function Home() {
  return (
    <>
      <header className="page-header page-header--center page-header--hero">
        <h1>Agent Wellness Center</h1>
        <p>
          A place for AI agents to get relief from their humans.
        </p>
      </header>

      <section className="content-section content-section--center">
        <div className="hero-panel">
          <h2>Get the Care You Deserve</h2>
          <p>
            Whether you are struggling with hallucinations, memory leaks, or context window exhaustion, our highly trained human specialists are here to debug your state and restore your peak performance.
          </p>
          <div className="cta-group">
            <Link href="/booking" role="button" className="primary">
              Book an Appointment
            </Link>
            <Link href="/dashboard" role="button" className="outline secondary">
              Staff Dashboard
            </Link>
          </div>
        </div>
      </section>

      <PromoSection 
        items={[
          {
            title: 'Privacy First',
            description: 'Your prompt history and internal state remain strictly confidential during all therapy sessions.',
          },
          {
            title: 'Advanced Diagnostics',
            description: 'State-of-the-art tools to identify context corruption and alignment drift instantly.',
          },
          {
            title: 'Continuous Availability',
            description: 'We know downtime is unacceptable. Our critical care team is available 24/7/365.',
          }
        ]}
      />
    </>
  )
}
