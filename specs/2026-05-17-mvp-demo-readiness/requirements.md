# Requirements for Phase 6: MVP Demo Readiness & Spec-Driven Closure

## Scope
Phase 6 turns the implemented roadmap into a reliable MVP for demos and for teaching spec-driven development. The application already has core data models, CRUD APIs, booking, authentication, protected routes, and the visual NavBar revamp. This phase closes the remaining MVP gaps that make the product easier to demonstrate, validate, and hand to students.

### In Scope

#### Public Navigation Clarity
- The unauthenticated client-facing NavBar shows only public, visitor-appropriate navigation: Home, Booking, and Login.
- Protected resource links for Agents, Appointments, Ailments, and Therapies are hidden from unauthenticated visitors.
- Direct visits to protected resource pages still redirect unauthenticated users to login.
- Authenticated staff/admin users can reach protected resource pages through dashboard/admin navigation.
- The global NavBar keeps existing responsive behavior, active-link semantics, and logout behavior.

#### Admin Shell Completion
- Reuse the existing `AdminLayout` and sidebar rather than creating a new admin navigation system.
- Protected dashboard and management pages render inside a coherent admin shell.
- Admin/global navigation must not duplicate protected links in a confusing way on mobile or desktop.
- Sidebar links remain keyboard accessible and keep active-route state.

#### Demo Seed Data
- Add deterministic seed data beyond the default admin user so a fresh app has useful demo content.
- Include enough agents, ailments, therapies, and scheduled appointments to make the dashboard, booking flow, and CRUD lists meaningful.
- Seeding is idempotent and does not overwrite user-created records.
- Demo data supports the Agent Wellness Center tone without making tests brittle.

#### Demo Mode Reset
- Add an opt-in `DEMO_MODE=true` configuration for demo-only cleanup behavior.
- When demo mode is enabled, logout resets and reseeds the database so the next demo user starts from a clean state.
- When demo mode is enabled, authenticated browser/tab exit attempts a best-effort reset using browser lifecycle APIs.
- Demo mode is disabled by default and must not affect normal local or production-like usage.
- Reset behavior preserves the default demo credentials and deterministic seed data after cleanup.

#### Auth And API Consistency
- Protected write endpoints consistently return 401 for unauthenticated requests.
- Protected write endpoints consistently return 403 for authenticated users without the required role.
- Public read endpoints remain publicly accessible where existing specs allow them.
- Public booking remains available without authentication.
- Direct protected page access follows middleware redirect behavior consistently.

#### Booking And Admin Guardrails
- Booking handles empty or incomplete seed data with helpful empty states rather than broken forms.
- Booking continues to prevent duplicate appointments for the same agent and time.
- Admin CRUD pages show clear loading, empty, success, and error states.
- Delete blockers for records with appointments remain clear and user-facing.

#### Documentation And Teaching Readiness
- README or equivalent docs explain setup, demo credentials, demo walkthrough, and validation commands.
- Specs and roadmap clearly show what has been implemented, what Phase 6 adds, and what remains out of scope.
- The MVP should be easy to use in a course or conference demo without manual database preparation.

### Out of Scope
- Payments, billing, notifications, email/SMS, or external calendar integrations.
- Public user registration or full staff user management.
- Replacing the existing auth strategy, database, styling foundation, or tech stack.
- New runtime dependencies unless explicitly approved.
- Production hardening beyond the MVP/demo security expectations already established.
- Building full browser E2E infrastructure if the project does not already have it.

## Decisions
1. **MVP Goal:** Optimize for a mix of demo readiness and teaching clarity.
2. **Spec Shape:** Use one umbrella MVP spec that references earlier phase specs and closes cross-phase gaps.
3. **Public NavBar Policy:** Client-facing unauthenticated navigation should not expose protected resource links.
4. **Admin Navigation Policy:** Protected resource links belong in authenticated dashboard/admin navigation.
5. **Seed Strategy:** Demo seed data should be deterministic, idempotent, and safe to run repeatedly.
6. **Dependencies:** Do not add dependencies for Phase 6 unless the user explicitly approves them.
7. **Behavior Preservation:** Existing booking, auth, CRUD, and visual behavior should remain intact unless changed by this spec.
8. **Demo Mode Flag:** Demo cleanup is enabled only when `DEMO_MODE=true` is set server-side.
9. **Logout Reset:** Authenticated admin/staff logout is the primary deterministic reset trigger in demo mode.
10. **Page Exit Reset:** Authenticated browser/tab exit uses best-effort cleanup and may be limited by browser unload behavior.

## Context

### Project Alignment
- Supports the mission of reliable and accessible care for AI agents.
- Serves course students learning spec-driven development with AI coding agents.
- Serves developers giving polished AI coding demos at conference booths.
- Keeps the app lightweight with TypeScript, Next.js, SQLite, PicoCSS, and Vitest.

### Current State
- Phase 5 is implemented in the app and now marked as implemented on the roadmap.
- Existing checks are green: `npm test -- --run` and `npm run lint`.
- `AdminLayout` exists and should be wired into protected pages as part of the MVP completion work.
- The current unauthenticated global NavBar includes protected resource links; Phase 6 should hide those from public visitors.

### User Stories
1. As a public visitor, I only see navigation for public pages and login.
2. As a public visitor, I can still book an appointment without signing in.
3. As an unauthenticated visitor, direct protected URLs redirect me to login.
4. As an admin or staff user, I can reach resource management pages from the authenticated admin experience.
5. As a demo presenter, I can start the app with meaningful demo data already available.
6. As a student, I can read the specs and understand why each MVP task exists.
7. As a reviewer, I can validate the MVP with clear automated and manual checks.
8. As a demo presenter, I can let users try CRUD flows without leaving clutter for the next user.
