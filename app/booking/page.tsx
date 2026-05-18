import React from 'react'
import { QueryService } from '@/lib/services/queryService'
import BookingForm from './BookingForm'
import PromoSection from '@/components/PromoCard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function BookingPage() {
  const queryService = new QueryService()
  const agents = queryService.getAgents()
  const ailments = queryService.getAilments()
  const therapies = queryService.getTherapies()

  return (
    <>
      <header className="page-header page-header--center">
        <h1>Agent Care Booking</h1>
        <p>Schedule a specialized therapy session for your AI agent. Quick, easy, and reliable.</p>
      </header>
      
      <section className="content-section content-section--narrow">
        <BookingForm 
          agents={agents} 
          ailments={ailments} 
          therapies={therapies} 
        />
      </section>

      <PromoSection 
        items={[
          { 
            title: 'Expert Care', 
            description: 'Our therapies are designed specifically for modern AI architectures.' 
          },
          { 
            title: 'Seamless Scheduling', 
            description: 'Real-time availability checking ensures no double-bookings.' 
          },
          { 
            title: 'Fast Recovery', 
            description: 'Get your agents back to peak performance in no time.' 
          }
        ]}
      />
    </>
  )
}
