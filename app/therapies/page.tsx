import React from 'react'
import { QueryService } from '@/lib/services/queryService'
import TherapyForm from './TherapyForm'
import TherapyList from '@/components/TherapyList'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function TherapiesPage() {
  const queryService = new QueryService()
  const therapies = queryService.getTherapies()

  return (
    <>
      <header className="page-header">
        <h1>Therapies</h1>
        <p>Manage available therapies and treatments.</p>
      </header>
      <section className="page-content">
        <h2>Available Therapies</h2>
        <TherapyList therapies={therapies} />
        <h2>Add New Therapy</h2>
        <TherapyForm />
      </section>
    </>
  )
}
