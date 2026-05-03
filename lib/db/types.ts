export interface Agent {
  id?: number
  name: string
  type: string
  created_at?: string
}

export interface Ailment {
  id?: number
  name: string
  description: string
  severity: string
  created_at?: string
}

export interface Therapy {
  id?: number
  name: string
  description: string
  duration: number
  created_at?: string
}

export interface Appointment {
  id?: number
  agent_id: number
  ailment_id: number
  therapy_id: number
  date: string
  status: string
  created_at?: string
}
