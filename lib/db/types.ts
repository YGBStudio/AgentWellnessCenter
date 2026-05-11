// Base types with required id/created_at — used for DB read results
export interface User {
  id: number
  email: string
  password_hash: string
  role: 'admin' | 'staff'
  created_at: string
}

export interface Agent {
  id: number
  name: string
  type: string
  created_at: string
}

export interface Ailment {
  id: number
  name: string
  description: string
  severity: string
  created_at: string
}

export interface Therapy {
  id: number
  name: string
  description: string
  duration: number
  created_at: string
}

export interface Appointment {
  id: number
  agent_id: number
  ailment_id: number
  therapy_id: number
  date: string
  status: string
  created_at: string
}

// Insert types — omit auto-generated fields
export type UserInsert = Omit<User, 'id' | 'created_at'>
export type AgentInsert = Omit<Agent, 'id' | 'created_at'>
export type AilmentInsert = Omit<Ailment, 'id' | 'created_at'>
export type TherapyInsert = Omit<Therapy, 'id' | 'created_at'>
export type AppointmentInsert = Omit<Appointment, 'id' | 'created_at'>
