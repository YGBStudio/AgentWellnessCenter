import * as jose from 'jose'
import { Role, VerifiedToken } from './types'

const DEV_JWT_SECRET = 'dev-secret-key-change-in-production-this-is-a-demo-site'
const JWT_EXPIRES_IN = '7d'
const PASSWORD_HASH_ALGORITHM = 'PBKDF2'
const PASSWORD_HASH_ITERATIONS = 100000
const PASSWORD_HASH_PREFIX = 'pbkdf2-sha256'

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = new Uint8Array(16)
  crypto.getRandomValues(salt)
  const digest = await derivePasswordDigest(password, salt)
  return [
    PASSWORD_HASH_PREFIX,
    String(PASSWORD_HASH_ITERATIONS),
    bytesToBase64(salt),
    bytesToBase64(digest),
  ].join('$')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [prefix, iterations, salt, digest] = hash.split('$')
  if (prefix !== PASSWORD_HASH_PREFIX || !iterations || !salt || !digest) {
    return false
  }

  const parsedIterations = Number(iterations)
  if (!Number.isInteger(parsedIterations) || parsedIterations <= 0) {
    return false
  }

  const expected = base64ToBytes(digest)
  const actual = await derivePasswordDigest(password, base64ToBytes(salt), parsedIterations)
  return timingSafeEqual(actual, expected)
}

// JWT utilities
export async function signToken(payload: { email: string; role: Role; userId: number }): Promise<string> {
  const secret = getJwtSecret()
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret)
}

export async function verifyToken(token: string): Promise<VerifiedToken | null> {
  try {
    const secret = getJwtSecret()
    const { payload } = await jose.jwtVerify(token, secret)
    return payload as unknown as VerifiedToken
  } catch {
    return null
  }
}

// Session cookie name
export const SESSION_COOKIE_NAME = 'agentclinic_session'

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || DEV_JWT_SECRET
  if (secret === DEV_JWT_SECRET && process.env.REQUIRE_JWT_SECRET === 'true') {
    throw new Error('JWT_SECRET is required for Cloudflare Workers preview and production deployments.')
  }

  return new TextEncoder().encode(secret)
}

async function derivePasswordDigest(
  password: string,
  salt: Uint8Array,
  iterations = PASSWORD_HASH_ITERATIONS
): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    PASSWORD_HASH_ALGORITHM,
    false,
    ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: PASSWORD_HASH_ALGORITHM,
      hash: 'SHA-256',
      salt: bytesToArrayBuffer(salt),
      iterations,
    },
    keyMaterial,
    256
  )
  return new Uint8Array(bits)
}

function bytesToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false

  let diff = 0
  for (let index = 0; index < left.length; index += 1) {
    diff |= left[index] ^ right[index]
  }

  return diff === 0
}
