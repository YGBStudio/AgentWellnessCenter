import bcrypt from 'bcryptjs'
import * as jose from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production-this-is-a-demo-site'
const JWT_EXPIRES_IN = '7d'
const secret = new TextEncoder().encode(JWT_SECRET)

import { Role, VerifiedToken } from './types'

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// JWT utilities
export async function signToken(payload: { email: string; role: Role; userId: number }): Promise<string> {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret)
}

export async function verifyToken(token: string): Promise<VerifiedToken | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secret)
    return payload as unknown as VerifiedToken
  } catch {
    return null
  }
}

// Session cookie name
export const SESSION_COOKIE_NAME = 'agentclinic_session'