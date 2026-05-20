import { describe, expect, it } from 'vitest'
import { getCurrentDateTimeLocalMinimum, isCurrentOrFutureDateTime } from './date'

describe('appointment date helpers', () => {
  it('formats the current minute as the datetime-local minimum', () => {
    expect(getCurrentDateTimeLocalMinimum(
      new Date('2026-05-20T20:30:15Z'),
      'America/Costa_Rica'
    )).toBe('2026-05-20T14:30')
  })

  it('allows the current minute and rejects earlier minutes', () => {
    const now = new Date('2026-05-20T20:30:15Z')
    const timeZone = 'America/Costa_Rica'

    expect(isCurrentOrFutureDateTime('2026-05-20T14:30', now, timeZone)).toBe(true)
    expect(isCurrentOrFutureDateTime('2026-05-20T14:31', now, timeZone)).toBe(true)
    expect(isCurrentOrFutureDateTime('2026-05-21T00:00', now, timeZone)).toBe(true)
    expect(isCurrentOrFutureDateTime('2026-05-20T14:29', now, timeZone)).toBe(false)
    expect(isCurrentOrFutureDateTime('2026-05-19T23:59', now, timeZone)).toBe(false)
  })

  it('rejects invalid datetime-local values', () => {
    const now = new Date('2026-05-20T20:30:15Z')

    expect(isCurrentOrFutureDateTime('2026-02-30T14:30', now)).toBe(false)
    expect(isCurrentOrFutureDateTime('2026-05-20', now)).toBe(false)
  })
})
