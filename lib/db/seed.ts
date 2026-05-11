import bcrypt from 'bcryptjs'
import { Database } from 'better-sqlite3'

// Seed default admin user on first run
export function seedDefaultAdmin(db: Database): void {
  const EMAIL = 'admin@agentclinic.demo'
  const PASSWORD = 'admin'
  const ROLE = 'admin'

  // Check if admin already exists
  const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(EMAIL)
  if (existing) {
    console.log('ℹ️  Default admin user already exists, skipping seed.')
    return
  }

  const hash = bcrypt.hashSync(PASSWORD, 10)
  db.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)').run(EMAIL, hash, ROLE)
  console.log('✅ Default admin user seeded (this is a development-only convenience).')
}
