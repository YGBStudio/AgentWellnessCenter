import { afterEach, describe, expect, it, vi } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'

describe('Database Client', () => {
  const originalCwd = process.cwd()
  let tempDir: string | undefined

  afterEach(() => {
    process.chdir(originalCwd)
    vi.resetModules()

    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true })
      tempDir = undefined
    }
  })

  it('initializes the database in the current project data directory', async () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agentclinic-db-'))
    process.chdir(tempDir)

    const { db } = await import('./client')

    const table = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'agents'")
      .get()

    expect(table).toBeDefined()
    expect(fs.existsSync(path.join(tempDir, 'data', 'agentclinic.db'))).toBe(true)

    db.close()
  })
})
