import { z } from 'zod'

// Shared helpers
export function parseId(id: string): number | null {
  const parsed = parseInt(id, 10)
  return isNaN(parsed) ? null : parsed
}

// Agent schemas
export const createAgentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or less'),
  type: z.string().min(1, 'Type is required').max(100, 'Type must be 100 characters or less'),
})

export const updateAgentSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  type: z.string().min(1).max(100).optional(),
})

// Ailment schemas
export const severityEnum = z.enum(['low', 'medium', 'high', 'critical'])

export const createAilmentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or less'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description must be 2000 characters or less'),
  severity: severityEnum,
})

export const updateAilmentSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  severity: severityEnum.optional(),
})

// Therapy schemas
export const createTherapySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or less'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description must be 2000 characters or less'),
  duration: z.number().int().min(1, 'Duration must be at least 1 minute').max(1440, 'Duration must be 1440 minutes or less'),
})

export const updateTherapySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  duration: z.number().int().min(1).max(1440).optional(),
})

// Appointment schemas
export const appointmentStatusEnum = z.enum(['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'])

export const createAppointmentSchema = z.object({
  agent_id: z.number().int().positive('Agent ID must be a positive integer'),
  ailment_id: z.number().int().positive('Ailment ID must be a positive integer'),
  therapy_id: z.number().int().positive('Therapy ID must be a positive integer'),
  date: z.string().min(1, 'Date is required'),
  status: appointmentStatusEnum,
})

export const updateAppointmentSchema = z.object({
  agent_id: z.number().int().positive().optional(),
  ailment_id: z.number().int().positive().optional(),
  therapy_id: z.number().int().positive().optional(),
  date: z.string().min(1).optional(),
  status: appointmentStatusEnum.optional(),
})

// Format Zod errors into a readable message
export function formatZodError(error: z.ZodError<unknown>): string {
  return error.issues.map(e => e.message).join(', ')
}
