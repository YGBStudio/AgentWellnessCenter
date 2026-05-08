import React from 'react'
import { QueryService } from '@/lib/services/queryService'
import AilmentForm from './AilmentForm'
import AilmentList from '@/components/AilmentList'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function AilmentsPage() {
  const queryService = new QueryService()
  const ailments = queryService.getAilments()

  return (
    <>
      <header className="page-header">
        <h1>Ailments</h1>
        <p>Manage AI agent ailments and conditions.</p>
      </header>
      <section className="page-content">
        <h2>Known Ailments</h2>
        <AilmentList ailments={ailments} />
        <h2>Add New Ailment</h2>
        <AilmentForm />
      </section>
    </>
  )
}
