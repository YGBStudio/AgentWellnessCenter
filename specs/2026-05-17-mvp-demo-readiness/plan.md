# Phase 6: MVP Demo Readiness & Spec-Driven Closure

## Goal
Close the remaining MVP gaps after Phases 1-5 by improving demo readiness, public navigation clarity, admin shell consistency, seed data, guardrails, documentation, and validation.

## 6.1 - Roadmap And Spec Closure

1. Mark Phase 5 as implemented in `specs/roadmap.md`.
2. Add Phase 6 to the roadmap as the MVP completion phase.
3. Keep this spec directory focused on the MVP cross-phase work rather than rewriting earlier feature specs.
4. Ensure the MVP spec references mission, tech stack, and existing feature specs by behavior and intent.

## 6.2 - Public NavBar Link Hygiene

1. Update the unauthenticated global NavBar so it only shows Home, Booking, and Login.
2. Remove Agents, Appointments, Ailments, and Therapies from the client-facing unauthenticated NavBar.
3. Preserve active-link styling, `aria-current="page"`, responsive menu behavior, Escape close behavior, and logout behavior.
4. Keep authenticated global navigation focused on Dashboard, user context, and Logout.
5. Ensure protected resource links are available through authenticated dashboard/admin navigation.

## 6.3 - Admin Shell Wiring

1. Reuse the existing `AdminLayout` component for protected dashboard and management pages.
2. Ensure Dashboard, Agents, Appointments, Ailments, and Therapies render inside the admin shell after login.
3. Confirm sidebar active states match the current route.
4. Avoid duplicate or conflicting protected navigation between the global NavBar and admin sidebar.
5. Preserve mobile admin navigation behavior and keyboard access.

## 6.4 - Deterministic Demo Seed Data

1. Add idempotent seed data for representative agents, ailments, therapies, and appointments.
2. Keep the existing default admin seed credentials: `admin@agentclinic.demo` / `admin`.
3. Ensure a fresh database has enough data for dashboard metrics, booking dropdowns, and CRUD lists.
4. Do not overwrite or delete user-created records when seed logic runs.
5. Add tests for seed idempotency and required demo records.

## 6.5 - Auth And API Consistency

1. Verify all protected write endpoints require authentication.
2. Use role-aware checks where 403 behavior is expected for insufficient permissions.
3. Keep public GET endpoints publicly accessible where previous specs allow read-only browsing.
4. Keep public booking available without authentication.
5. Add or update tests for 401 and 403 behavior across representative protected endpoints.

## 6.6 - Booking And CRUD Guardrails

1. Add helpful booking empty states when agents, ailments, or therapies are unavailable.
2. Preserve appointment conflict prevention for same agent and same time.
3. Improve admin CRUD loading, empty, and error states where current screens fall back to alerts or silent failures.
4. Keep delete blockers clear for agents, ailments, and therapies with existing appointments.
5. Ensure validation messages remain user-facing and accessible.

## 6.7 - Documentation

1. Update README or equivalent project docs with setup steps and demo credentials.
2. Document a short demo walkthrough: public booking, login, dashboard, admin CRUD, logout.
3. Document validation commands: `npm test -- --run` and `npm run lint`.
4. Note that the MVP uses SQLite and deterministic local seed data for portability.

## 6.8 - Tests And Validation

1. Update Header tests so unauthenticated navigation excludes protected resource links.
2. Add or update tests showing direct protected routes still redirect unauthenticated users.
3. Add tests proving authenticated users can reach management navigation.
4. Add seed data tests for deterministic records and idempotent reruns.
5. Add booking tests for empty data, successful booking, and conflict handling where practical.
6. Run `npm test -- --run`.
7. Run `npm run lint`.

## 6.9 - Demo Mode Reset

1. Add a documented server-side `DEMO_MODE=true` configuration helper.
2. Add a database reset helper that deletes demo-session data, clears reset table sequences, and reseeds the default admin plus deterministic demo data.
3. Update logout so authenticated admin/staff sessions reset and reseed the database before logout completes when demo mode is enabled.
4. Add `POST /api/demo/reset` for authenticated best-effort browser/tab exit cleanup.
5. Add a client `pagehide` cleanup hook that uses `navigator.sendBeacon('/api/demo/reset')` with a `fetch(..., { keepalive: true })` fallback.
6. Document demo mode in README and the MVP demo guide.
7. Add tests for disabled-by-default behavior, authenticated reset access, reseeded records, preserved demo credentials, logout reset, and page-exit cleanup wiring.

## Deliverables

| Deliverable | File/Location |
|---|---|
| MVP roadmap update | `specs/roadmap.md` |
| MVP feature spec | `specs/2026-05-17-mvp-demo-readiness/` |
| Public NavBar link update | `components/Header.tsx` and tests |
| Admin shell wiring | Protected page layouts/components |
| Demo seed data | `lib/db/seed.ts` or adjacent seed module |
| Auth/API consistency checks | API auth middleware and route tests |
| Demo docs | `README.md` or project docs |
| Demo mode reset | Server demo config, reset helper, logout route, demo reset route, auth provider |

## Acceptance Criteria

1. Unauthenticated NavBar shows Home, Booking, and Login only.
2. Unauthenticated NavBar does not show Agents, Appointments, Ailments, or Therapies.
3. Protected resource pages are still guarded on direct access.
4. Authenticated admin/staff users can reach protected management pages through the admin experience.
5. Fresh local startup includes useful deterministic demo data.
6. Public booking remains available and reliable.
7. Write APIs return consistent 401/403 responses.
8. Docs explain setup, credentials, walkthrough, and validation.
9. `npm test -- --run` passes.
10. `npm run lint` passes.
11. With `DEMO_MODE=true`, logout and authenticated browser/tab exit reset and reseed demo data for the next session.
