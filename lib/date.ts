const DEFAULT_APPOINTMENT_TIME_ZONE = 'America/Costa_Rica'

function getAppointmentTimeZone(): string {
  return getEnvironmentValue('NEXT_PUBLIC_APPOINTMENT_TIME_ZONE') ||
    getEnvironmentValue('APPOINTMENT_TIME_ZONE') ||
    DEFAULT_APPOINTMENT_TIME_ZONE
}

function getEnvironmentValue(name: string): string | undefined {
  if (typeof process === 'undefined') return undefined
  return process.env[name]
}

export function getCurrentDateTimeLocalMinimum(
  date = new Date(),
  timeZone = getAppointmentTimeZone()
): string {
  const parts = getDateTimeParts(date, timeZone)

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`
}

export function isCurrentOrFutureDateTime(
  value: string,
  now = new Date(),
  timeZone = getAppointmentTimeZone()
): boolean {
  const dateTime = getValidLocalDateTimeMinute(value)

  if (!dateTime) return false

  return dateTime >= getCurrentDateTimeLocalMinimum(now, timeZone)
}

function getDateTimeParts(date: Date, timeZone: string): Record<'year' | 'month' | 'day' | 'hour' | 'minute', string> {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  ) as Record<'year' | 'month' | 'day' | 'hour' | 'minute', string>
}

function getValidLocalDateTimeMinute(value: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2})?$/.exec(value)

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const hour = Number(match[4])
  const minute = Number(match[5])
  const parsed = new Date(year, month - 1, day, hour, minute)

  if (
    hour > 23 ||
    minute > 59 ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day ||
    parsed.getHours() !== hour ||
    parsed.getMinutes() !== minute
  ) {
    return null
  }

  return `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}`
}
