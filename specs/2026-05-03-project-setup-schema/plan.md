# Phase 1: Project Setup & Schema Definition - Plan

## Task Groups

1. **Initialize Next.js project with TypeScript and SQLite**
   - Scaffold Next.js application with TypeScript template
   - Configure SQLite database connection (using better-sqlite3 or similar)
   - Set up project structure following Next.js conventions
   - Configure TypeScript strict mode and path aliases
   - Initialize package.json with required dependencies

2. **Define DB models with migrations**
   - Create Agent model (id, name, type, created_at, etc.)
   - Create Ailment model (id, name, description, severity, etc.)
   - Create Therapy model (id, name, description, duration, etc.)
   - Create Appointment model (id, agent_id, ailment_id, therapy_id, date, status, etc.)
   - Define relationships between models (Agent has many Appointments, etc.)
   - Set up database migration system
   - Run initial migration to create all tables

3. **Create minimal AgentClinic home page**
   - Create `app/page.tsx` with a simple welcome page
   - Display "AgentClinic" title and mission tagline
   - Add basic page structure with semantic HTML
   - Use minimal inline styles or CSS module for basic layout
   - Page should render successfully at root URL (`/`)
