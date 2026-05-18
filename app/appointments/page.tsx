'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Appointment, Agent, Ailment, Therapy } from '@/lib/db/types'
import AppointmentForm from './AppointmentForm'
import AppointmentList from '@/components/AppointmentList'

export const dynamic = 'force-dynamic'

export default function AppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [ailments, setAilments] = useState<Ailment[]>([])
  const [therapies, setTherapies] = useState<Therapy[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)

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
    }).catch(() => setLoading(false))
  }, [])

  const handleDelete = (appointment: Appointment) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return

    fetch(`/api/appointments/${appointment.id}`, { method: 'DELETE' })
      .then((r) => {
        if (r.ok) {
          setAppointments((prev) => prev.filter((a) => a.id !== appointment.id))
          setEditingAppointment(null)
        } else {
          r.json().then((data) => alert(data.error || 'Failed to delete appointment'))
        }
      })
      .catch(() => alert('Failed to delete appointment'))
  }

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment)
  }

  const handleUpdate = async (formData: FormData) => {
    if (!editingAppointment) return
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
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update appointment')
      }
    } catch {
      alert('Network error. Please try again.')
    }
  }

  return (
    <>
      <header className="page-header">
        <h1>Appointments</h1>
        <p>Schedule and manage agent appointments.</p>
      </header>
      <section className="page-content">
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
                router.refresh()
              } else {
                const data = await res.json()
                alert(data.error || 'Failed to create appointment')
              }
            } catch {
              alert('Network error. Please try again.')
            }
          }}
        />
      </section>
    </>
  )
}
