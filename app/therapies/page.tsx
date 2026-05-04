import React from 'react'
import { getTherapies } from '@/lib/db/queries'
import TherapyForm from './TherapyForm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function TherapiesPage() {
  const therapies = getTherapies()

  return (
    <>
      <header className="page-header">
        <h1>Therapies</h1>
        <p>Manage available therapies and treatments.</p>
      </header>
      <section className="page-content">
        <h2>Available Therapies</h2>
        {therapies.length === 0 ? (
          <p>No therapies available yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Duration (min)</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {therapies.map((therapy) => (
                <tr key={therapy.id}>
                  <td>{therapy.id}</td>
                  <td>{therapy.name}</td>
                  <td>{therapy.description}</td>
                  <td>{therapy.duration}</td>
                  <td>{therapy.created_at ? new Date(therapy.created_at).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2>Add New Therapy</h2>
        <TherapyForm />
      </section>
    </>
  )
}
