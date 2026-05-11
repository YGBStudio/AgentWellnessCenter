export function serializeCookie(name: string, value: string, options: {
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  path?: string
  maxAge?: number
} = {}): string {
  const parts = [`${name}=${encodeURIComponent(value)}`]

  if (options.httpOnly) parts.push('HttpOnly')
  if (options.secure) parts.push('Secure')
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`)
  if (options.path) parts.push(`Path=${options.path}`)
  if (options.maxAge) parts.push(`Max-Age=${options.maxAge}`)

  return parts.join('; ')
}