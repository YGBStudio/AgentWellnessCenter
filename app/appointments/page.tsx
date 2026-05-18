'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Appointment, Agent, Ailment, Therapy } from '@/lib/db/types'
import AppointmentForm from './AppointmentForm'
import AppointmentList from '@/components/AppointmentList'
import AdminLayout from '@/components/AdminLayout'

export const dynamic = 'force-dynamic'

export default function AppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [ailments, setAilments] = useState<Ailment[]>([])
  const [therapies, setTherapies] = useState<Therapy[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/appointments').then((res) => res.json()),
      fetch('/api/agents').then((res) => res.json()),
      fetch('/api/ailments').then((res) => res.json()),
      fetch('/api/therapies').then((res) => res.json()),
    ]).then(([appointmentsData, agentsData, ailmentsData, therapiesData]) => {
      setAppointments(appointmentsData)
      setAgents(agentsData)
      setAilments(ailmentsData)
      setTherapies(therapiesData)
      setLoading(false)
    }).catch(() => {
      setErrorMessage('Failed to load appointment data. Please refresh and try again.')
      setLoading(false)
    })
  }, [])

  const clearFeedback = () => {
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleDelete = (appointment: Appointment) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return

    clearFeedback()
    fetch(`/api/appointments/${appointment.id}`, { method: 'DELETE' })
      .then((r) => {
        if (r.ok) {
          setAppointments((prev) => prev.filter((a) => a.id !== appointment.id))
          setEditingAppointment(null)
          setSuccessMessage('Deleted appointment.')
        } else {
          r.json()
            .then((data) => setErrorMessage(data.error || 'Failed to delete appointment.'))
            .catch(() => setErrorMessage('Failed to delete appointment.'))
        }
      })
      .catch(() => setErrorMessage('Network error. Please try again.'))
  }

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment)
  }

  const handleUpdate = async (formData: FormData) => {
    if (!editingAppointment) return
    clearFeedback()
    try {
      const res = await fetch(`/api/appointments/${editingAppointment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: parseInt(formData.get('agent_id') as string),
          ailment_id: parseInt(formData.get('ailment_id') as string),
          therapy_id: parseInt(formData.get('therapy_id') as string),
          date: formData.get('date') as string,
          status: formData.get('status') as string,
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
        setEditingAppointment(null)
        setSuccessMessage('Updated appointment.')
        router.refresh()
      } else {
        const data = await res.json()
        const message = data.error || 'Failed to update appointment.'
        setErrorMessage(message)
        throw new Error(message)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error. Please try again.'
      setErrorMessage(message)
      throw new Error(message)
    }
  }

  return (
    <AdminLayout>
      <header className="page-header">
        <h1>Appointments</h1>
        <p>Schedule and manage agent appointments.</p>
      </header>
      <section className="page-content">
        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
        {successMessage && <p className="form-success" role="status">{successMessage}</p>}

        <h2>Scheduled Appointments</h2>
        {loading ? (
          <p className="empty-state" role="status">Loading appointments...</p>
        ) : (
          <AppointmentList
            appointments={appointments}
            agents={agents}
            ailments={ailments}
            therapies={therapies}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {editingAppointment && (
          <div className="edit-section">
            <h2>Edit Appointment</h2>
            <AppointmentForm
              agents={agents}
              ailments={ailments}
              therapies={therapies}
              appointment={editingAppointment}
              onCancel={() => setEditingAppointment(null)}
              onSubmit={handleUpdate}
            />
          </div>
        )}

        <h2>Schedule New Appointment</h2>
        <AppointmentForm
          agents={agents}
          ailments={ailments}
          therapies={therapies}
          onSubmit={async (formData) => {
            clearFeedback()
            try {
              const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  agent_id: parseInt(formData.get('agent_id') as string),
                  ailment_id: parseInt(formData.get('ailment_id') as string),
                  therapy_id: parseInt(formData.get('therapy_id') as string),
                  date: formData.get('date') as string,
                  status: formData.get('status') as string,
                }),
              })

              if (res.ok) {
                const created = await res.json()
                setAppointments((prev) => [created, ...prev])
                setSuccessMessage('Scheduled appointment.')
                router.refresh()
              } else {
                const data = await res.json()
                const message = data.error || 'Failed to create appointment.'
                setErrorMessage(message)
                throw new Error(message)
              }
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Network error. Please try again.'
              setErrorMessage(message)
              throw new Error(message)
            }
          }}
        />
      </section>
    </AdminLayout>
  )
}
