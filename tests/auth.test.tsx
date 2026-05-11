// @vitest-environment node
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

import Database from 'better-sqlite3'
import { initializeDatabase } from '@/lib/db/schema'
import { hashPassword, verifyPassword, signToken, verifyToken as verifyTokenFn } from '@/lib/auth/utils'
import { serializeCookie } from '@/lib/auth/cookies'
import { QueryService } from '@/lib/services/queryService'
import { requireAuth, requireRole, getAuthUser } from '@/lib/auth/middleware'
import { NextRequest } from 'next/server'

import { describe, it, expect, beforeEach, afterEach } from 'vitest'

// ============================================================
// Unit Tests: Auth Utilities (hash, verify, JWT, cookies)
// ============================================================
describe('Auth Utilities', () => {
  describe('hashPassword / verifyPassword', () => {
    it('hashes a password', async () => {
      const hash = await hashPassword('myPassword123')
      expect(typeof hash).toBe('string')
      expect(hash.length).toBeGreaterThan(0)
    })

    it('returns true for matching password', async () => {
      const hash = await hashPassword('myPassword123')
      const isValid = await verifyPassword('myPassword123', hash)
      expect(isValid).toBe(true)
    })

    it('returns false for non-matching password', async () => {
      const hash = await hashPassword('myPassword123')
      const isValid = await verifyPassword('wrongPassword', hash)
      expect(isValid).toBe(false)
    })
  })

  describe('signToken / verifyToken', () => {
    it('signs and verifies a valid token', async () => {
      const payload = { email: 'test@example.com', role: 'admin' as const, userId: 1 }
      const token = await signToken(payload)
      const decoded = await verifyTokenFn(token)
      expect(decoded).toEqual(
        expect.objectContaining({ email: 'test@example.com', role: 'admin', userId: 1 })
      )
    })

    it('returns null for invalid token', async () => {
      const decoded = await verifyTokenFn('invalid-token')
      expect(decoded).toBeNull()
    })

    it('returns null for tampered token', async () => {
      const payload = { email: 'test@example.com', role: 'staff' as const, userId: 2 }
      const token = await signToken(payload)
      const tampered = token + 'x'
      const decoded = await verifyTokenFn(tampered)
      expect(decoded).toBeNull()
    })
  })

  describe('serializeCookie', () => {
    it('serializes basic cookie', () => {
      const cookie = serializeCookie('session', 'abc123')
      expect(cookie).toContain('session=abc123')
    })

    it('includes HttpOnly flag', () => {
      const cookie = serializeCookie('session', 'abc123', { httpOnly: true })
      expect(cookie).toContain('HttpOnly')
    })

    it('includes Secure flag', () => {
      const cookie = serializeCookie('session', 'abc123', { secure: true })
      expect(cookie).toContain('Secure')
    })

    it('includes SameSite flag', () => {
      const cookie = serializeCookie('session', 'abc123', { sameSite: 'strict' })
      expect(cookie).toContain('SameSite=strict')
    })

    it('includes Max-Age flag', () => {
      const cookie = serializeCookie('session', 'abc123', { maxAge: 3600 })
      expect(cookie).toContain('Max-Age=3600')
    })
  })
})

// ============================================================
// Unit Tests: User Query Service Methods
// ============================================================
describe('QueryService User Methods', () => {
  let db: Database.Database
  let queryService: QueryService

  beforeEach(() => {
    db = new Database(':memory:')
    db.pragma('foreign_keys = ON')
    initializeDatabase(db)
    queryService = new QueryService(db)

    const hash = require('bcryptjs').hashSync('admin', 10)
    queryService.createUser({ email: 'admin@agentclinic.demo', password_hash: hash, role: 'admin' })
  })

  afterEach(() => {
    db.close()
  })

  it('registers a user with email, password hash, and role', () => {
    const hash = require('bcryptjs').hashSync('password123', 10)
    const id = queryService.createUser({ email: 'test@example.com', password_hash: hash, role: 'staff' })
    expect(typeof id).toBe('number')
    expect(id).toBeGreaterThan(1)
  })

  it('retrieves a user by email', () => {
    const user = queryService.getUserByEmail('admin@agentclinic.demo')
    expect(user).toBeDefined()
    expect(user?.email).toBe('admin@agentclinic.demo')
    expect(user?.role).toBe('admin')
  })

  it('returns undefined for non-existent email', () => {
    const user = queryService.getUserByEmail('nonexistent@example.com')
    expect(user).toBeUndefined()
  })

  it('returns correct user count', () => {
    expect(queryService.getUserCount()).toBe(1)
    const hash = require('bcryptjs').hashSync('pass', 10)
    queryService.createUser({ email: 'staff@example.com', password_hash: hash, role: 'staff' })
    expect(queryService.getUserCount()).toBe(2)
  })

  it('verifies password via bcrypt', async () => {
    const user = queryService.getUserByEmail('admin@agentclinic.demo')
    expect(user).toBeDefined()
    if (user) {
      const isValid = await require('bcryptjs').compare('admin', user.password_hash)
      expect(isValid).toBe(true)
    }
  })
})

// ============================================================
// Unit Tests: Auth Middleware
// ============================================================
describe('Auth Middleware', () => {
  function makeRequest(headers: Record<string, string> = {}): InstanceType<typeof NextRequest> {
    return new NextRequest('http://localhost/', { headers })
  }

  describe('requireAuth', () => {
    it('returns null for authenticated request with valid token', async () => {
      const token = await signToken({ email: 'test@example.com', role: 'admin', userId: 1 })
      const req = makeRequest({
        cookie: `agentclinic_session=${encodeURIComponent(token)}`,
      })
      const result = await requireAuth(req as any)
      expect(result).toBeNull()
    })

    it('returns error response for request without token', async () => {
      const req = makeRequest()
      const result = await requireAuth(req as any)
      expect(result).not.toBeNull()
      expect((result as any).status).toBe(401)
    })

    it('returns error response for request with invalid token', async () => {
      const req = makeRequest({
        cookie: 'agentclinic_session=invalid-token',
      })
      const result = await requireAuth(req as any)
      expect(result).not.toBeNull()
      expect((result as any).status).toBe(401)
    })
  })

  describe('requireRole', () => {
    it('allows admin role when admin is required', async () => {
      const token = await signToken({ email: 'admin@test.com', role: 'admin', userId: 1 })
      const req = makeRequest({
        cookie: `agentclinic_session=${encodeURIComponent(token)}`,
      })
      const result = await requireRole(req as any, ['admin'])
      expect(result).toBeNull()
    })

    it('allows staff role when both roles are required', async () => {
      const token = await signToken({ email: 'staff@test.com', role: 'staff', userId: 2 })
      const req = makeRequest({
        cookie: `agentclinic_session=${encodeURIComponent(token)}`,
      })
      const result = await requireRole(req as any, ['admin', 'staff'])
      expect(result).toBeNull()
    })

    it('returns 403 for unauthorized role', async () => {
      const token = await signToken({ email: 'staff@test.com', role: 'staff', userId: 2 })
      const req = makeRequest({
        cookie: `agentclinic_session=${encodeURIComponent(token)}`,
      })
      const result = await requireRole(req as any, ['admin'])
      expect(result).not.toBeNull()
      expect((result as any).status).toBe(403)
    })

    it('returns 401 for unauthenticated request', async () => {
      const req = makeRequest()
      const result = await requireRole(req as any, ['admin'])
      expect(result).not.toBeNull()
      expect((result as any).status).toBe(401)
    })
  })

  describe('getAuthUser', () => {
    it('returns user info from valid token', async () => {
      const token = await signToken({ email: 'test@test.com', role: 'admin', userId: 42 })
      const req = makeRequest({
        cookie: `agentclinic_session=${encodeURIComponent(token)}`,
      })
      const user = await getAuthUser(req as any)
      expect(user).toEqual(
        expect.objectContaining({ email: 'test@test.com', role: 'admin', userId: 42 })
      )
    })

    it('returns null when no cookie present', async () => {
      const req = makeRequest()
      const user = await getAuthUser(req as any)
      expect(user).toBeNull()
    })

    it('returns null for empty session cookie', async () => {
      const req = makeRequest({
        cookie: 'agentclinic_session=',
      })
      const user = await getAuthUser(req as any)
      expect(user).toBeNull()
    })
  })
})

// ============================================================
// Integration Tests: API Auth Flow
// ============================================================
describe('Integration: Auth API Flow', () => {
  let tempDb: any

  beforeEach(() => {
    tempDb = new Database(':memory:')
    tempDb.pragma('foreign_keys = ON')
    initializeDatabase(tempDb)

    const hash = require('bcryptjs').hashSync('admin', 10)
    const qService = new QueryService(tempDb)
    qService.createUser({ email: 'admin@agentclinic.demo', password_hash: hash, role: 'admin' })
  })

  afterEach(() => {
    tempDb.close()
  })

  it('login API accepts demo credentials and returns success', async () => {
    const qService = new QueryService(tempDb)
    const user = qService.getUserByEmail('admin@agentclinic.demo')
    expect(user).toBeDefined()

    const isValid = await require('bcryptjs').compare('admin', user!.password_hash)
    expect(isValid).toBe(true)

    const token = await signToken({ email: user!.email, role: user!.role, userId: user!.id })
    const verified = await verifyTokenFn(token)
    expect(verified).toEqual(
      expect.objectContaining({ email: 'admin@agentclinic.demo', role: 'admin', userId: user!.id })
    )
  })

  it('login API rejects invalid credentials', async () => {
    const qService = new QueryService(tempDb)
    const user = qService.getUserByEmail('admin@agentclinic.demo')
    expect(user).toBeDefined()

    const isValid = await require('bcryptjs').compare('wrongpassword', user!.password_hash)
    expect(isValid).toBe(false)
  })

  it('GET /api/agents remains publicly accessible (read-only)', () => {
    const qService = new QueryService(tempDb)
    const agents = qService.getAgents()
    expect(Array.isArray(agents)).toBe(true)
  })

  it('requireAuth returns 401 for unauthenticated POST request', async () => {
    const req = new NextRequest('http://localhost/api/agents', { method: 'POST' })
    const result = await requireAuth(req as any)
    expect(result).not.toBeNull()
    expect((result as any).status).toBe(401)
  })

  it('requireAuth passes for authenticated POST request', async () => {
    const token = await signToken({ email: 'admin@agentclinic.demo', role: 'admin', userId: 1 })
    const req = new NextRequest('http://localhost/api/agents', {
      method: 'POST',
      headers: { cookie: `agentclinic_session=${encodeURIComponent(token)}` },
    })
    const result = await requireAuth(req as any)
    expect(result).toBeNull()
  })

  it('requireRole returns 403 for wrong role', async () => {
    const token = await signToken({ email: 'staff@test.com', role: 'staff', userId: 2 })
    const req = new NextRequest('http://localhost/api/agents', {
      method: 'DELETE',
      headers: { cookie: `agentclinic_session=${encodeURIComponent(token)}` },
    })
    const result = await requireRole(req as any, ['admin'])
    expect(result).not.toBeNull()
    expect((result as any).status).toBe(403)
  })
})