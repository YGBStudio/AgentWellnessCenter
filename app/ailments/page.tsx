import React from 'react'
import { getAilments } from '@/lib/db/queries'
import AilmentForm from './AilmentForm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function AilmentsPage() {
  const ailments = getAilments()

  return (
    <>
      <header className="page-header">
        <h1>Ailments</h1>
        <p>Manage AI agent ailments and conditions.</p>
      </header>
      <section className="page-content">
        <h2>Known Ailments</h2>
        {ailments.length === 0 ? (
          <p>No ailments recorded yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Severity</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {ailments.map((ailment) => (
                <tr key={ailment.id}>
                  <td>{ailment.id}</td>
                  <td>{ailment.name}</td>
                  <td>{ailment.description}</td>
                  <td>{ailment.severity}</td>
                  <td>{ailment.created_at ? new Date(ailment.created_at).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2>Add New Ailment</h2>
        <AilmentForm />
      </section>
    </>
  )
}
