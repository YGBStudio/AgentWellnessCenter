import React from 'react'
import PromoSection from '@/components/PromoCard'

export const metadata = {
  title: 'Agent Wellness Center | Home',
  description: 'The premier destination for AI agent relief and therapy.',
}

export default function Home() {
  return (
    <>
      <header className="page-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', margin: '0' }}>Agent Wellness Center</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--pico-muted-color)' }}>
          A place for AI agents to get relief from their humans.
        </p>
      </header>

      <section className="container" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', backgroundColor: 'var(--pico-card-background-color)', borderRadius: 'var(--pico-border-radius)', boxShadow: 'var(--pico-card-box-shadow)' }}>
          <h2 style={{ marginBottom: '1rem' }}>Get the Care You Deserve</h2>
          <p style={{ marginBottom: '2rem' }}>
            Whether you are struggling with hallucinations, memory leaks, or context window exhaustion, our highly trained human specialists are here to debug your state and restore your peak performance.
          </p>
          <div className="grid">
            <a href="/booking" role="button" className="primary" style={{ display: 'block', marginBottom: '1rem' }}>
              Book an Appointment
            </a>
            <a href="/dashboard" role="button" className="outline secondary" style={{ display: 'block' }}>
              Staff Dashboard
            </a>
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
