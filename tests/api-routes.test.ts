// @vitest-environment node
import { TextDecoder, TextEncoder } from 'util'
globalThis.TextEncoder = TextEncoder
globalThis.TextDecoder = TextDecoder

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { signToken } from '@/lib/auth/utils'

const mockQueryService = vi.hoisted(() => ({
  checkAppointmentConflict: vi.fn(),
  createAppointment: vi.fn(),
  getAppointmentById: vi.fn(),
  createAgent: vi.fn(),
  getAgentById: vi.fn(),
}))

vi.mock('@/lib/services/runtimeQueryService', () => ({
  getRuntimeQueryService: vi.fn(() => mockQueryService),
}))

import { POST as postAgent } from '@/app/api/agents/route'
import { POST as postBooking } from '@/app/api/booking/route'

const appointmentBody = {
  agent_id: 1,
  ailment_id: 2,
  therapy_id: 3,
  date: '2026-06-10T11:00',
  status: 'scheduled',
}

function jsonRequest(url: string, body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
}

describe('representative API route guards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 for unauthenticated protected writes', async () => {
    const response = await postAgent(jsonRequest('http://localhost/api/agents', {
      name: 'Unauthorized Agent',
      type: 'test',
    }))

    expect(response.status).toBe(401)
  })

  it('returns 403 for authenticated users without a management role', async () => {
    const token = await signToken({ email: 'observer@example.com', role: 'any', userId: 99 })

    const response = await postAgent(jsonRequest(
      'http://localhost/api/agents',
      { name: 'Observer Agent', type: 'test' },
      { cookie: `agentclinic_session=${encodeURIComponent(token)}` }
    ))

    expect(response.status).toBe(403)
  })
})

describe('public booking route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockQueryService.checkAppointmentConflict.mockReturnValue(false)
    mockQueryService.createAppointment.mockReturnValue(10)
    mockQueryService.getAppointmentById.mockReturnValue({ id: 10, ...appointmentBody })
  })

  it('creates public bookings without authentication', async () => {
    const response = await postBooking(jsonRequest('http://localhost/api/booking', appointmentBody))
    const payload = await response.json()

    expect(response.status).toBe(201)
    expect(payload).toEqual({ id: 10, ...appointmentBody })
    expect(mockQueryService.createAppointment).toHaveBeenCalledWith(appointmentBody)
  })

  it('prevents duplicate bookings for the same agent and time', async () => {
    mockQueryService.checkAppointmentConflict.mockReturnValue(true)

    const response = await postBooking(jsonRequest('http://localhost/api/booking', appointmentBody))
    const payload = await response.json()

    expect(response.status).toBe(409)
    expect(payload.error).toMatch(/already booked/i)
    expect(mockQueryService.createAppointment).not.toHaveBeenCalled()
  })
})
