# Phase 4: Authentication, Authorization & Admin Dashboard

## Goal
Implement the complete authentication and authorization system, admin dashboard with sidebar navigation, and secure all management endpoints. This phase enables the core value proposition of Phase 3: role-based access to clinic management tools.

## 4.1 — User Model & Database (Estimated: 1 day)

- Add `users` table to `lib/db/schema.ts`
  - Fields: `id` (PK), `email` (unique), `password_hash`, `role` (enum: admin, staff), `created_at`
- Add `User` and `UserInsert` types to `lib/db/types.ts`
- Add `UserQueries` class or methods to `lib/services/queryService.ts`:
  - `getUserByEmail(email: string)`
  - `createUser(user: UserInsert): number`
  - `getUserCount()`
- Add password hashing utility (bcrypt or compatible)
- Create seed script or mechanism to auto-create a default admin user on first run with demo credentials:
  - **Email:** `admin@agentclinic.demo`
  - **Password:** `admin`
- Display demo credentials prominently on the login page so evaluators and demo audiences can log in immediately
- Write DB tests for user table and query methods

## 4.2 — Auth API Endpoints (Estimated: 1 day)

- Create `app/api/auth/login/route.ts`
  - POST: validate email/password, return JWT or session cookie
- Create `app/api/auth/logout/route.ts`
  - POST: invalidate session/token
- Create `app/api/auth/me/route.ts`
  - GET: return current user info (for frontend state hydration)
- Implement JWT signing/verification utility (or session-based auth)
- Write unit tests for login/logout/me endpoints
- Write integration tests for auth flow

## 4.3 — Frontend Auth State Management (Estimated: 0.5 day)

- Create `lib/auth/context.tsx` (React Context) or `lib/auth/store.ts` (Zustand)
  - Store: user info, role, isAuthenticated, loading state
  - Actions: login, logout, checkSession
- Create `lib/auth/hooks.ts` — custom hook `useAuth()`
- Update `app/layout.tsx` to wrap app with AuthProvider
- Decide auth strategy: JWT stored in httpOnly cookie vs localStorage (recommend httpOnly cookie for security)

## 4.4 — Login Page (Estimated: 0.5 day)

- Create `app/login/page.tsx`
- Create `app/login/LoginForm.tsx` (email + password, with validation)
- Handle success → redirect to `/dashboard`
- Handle error → display validation feedback
- Style consistent with existing PicoCSS forms

## 4.5 — Protected Routes & Middleware (Estimated: 0.5 day)

- Create `lib/auth/middleware.ts`
  - Route guard function for Next.js middleware
  - Map of protected routes → required roles
  - Public routes: `/`, `/booking`, `/booking/confirmation`, `/login`
  - Protected routes: `/dashboard`, `/agents`, `/ailments`, `/therapies`, `/appointments`
- Update `middleware.ts` at project root (Next.js middleware)
  - Redirect unauthenticated users hitting protected routes → `/login`
  - Redirect authenticated users hitting `/login` → `/dashboard`
- Add 401/403 error handling in API routes
- Build `app/error/page.tsx` or `app/access-denied/page.tsx` for permission errors

## 4.6 — Admin Dashboard with Sidebar (Estimated: 1 day)

- Update `app/dashboard/page.tsx` to require authentication
- Create `components/AdminLayout.tsx` or `components/Sidebar.tsx`
  - Sidebar nav: Dashboard, Agents, Ailments, Therapies, Appointments, Logout
  - Conditional rendering based on role
- Update `Header.tsx` to show:
  - Logged in: user email/role + logout button
  - Logged out: login link
- Move dashboard metrics behind auth gate
- Ensure `/dashboard` is the admin home (not `/`)

## 4.7 — Secure CRUD Endpoints (Estimated: 0.5 day)

- Add auth middleware to all POST/PUT/DELETE routes in:
  - `app/api/agents/[+]/route.ts` and `app/api/agents/route.ts`
  - `app/api/ailments/[+]/route.ts` and `app/api/ailments/route.ts`
  - `app/api/therapies/[+]/route.ts` and `app/api/therapies/route.ts`
  - `app/api/appointments/[+]/route.ts` and `app/api/appointments/route.ts`
- GET endpoints can remain public (read-only browsing)
- Return 401 for unauthenticated, 403 for wrong role

## 4.8 — Wire Up Edit/Delete Actions (Estimated: 0.5 day)

- Update CRUD pages to pass `onEdit` and `onDelete` callbacks to list components
- Decide inline editing vs. separate form pages (recommend inline for simplicity)
- Implement row-level edit/delete with confirmation dialogs
- Ensure these actions are only visible to admin/staff roles

## 4.9 — Testing & Validation (Estimated: 1 day)

- Unit tests:
  - Auth utilities (JWT signing/verification, password hashing)
  - Middleware (route protection logic)
  - User query service methods
- Integration tests:
  - Login → access protected page → logout flow
  - Unauthorized access returns 401/redirects
  - Different roles see appropriate content
- E2E tests (optional, if test runner supports it):
  - Admin login → manage therapies → logout
  - Public user → attempt dashboard access → redirected
- Run full test suite, fix any failures
- Manual responsive testing on mobile/tablet/desktop

## Deliverables

| Deliverable | File/Location |
|---|---|
| User DB schema | `lib/db/schema.ts` (add users table) |
| User types | `lib/db/types.ts` (add User, UserInsert) |
| Auth utilities | `lib/auth/utils.ts` (hash, verify, jwt) |
| Auth context/provider | `lib/auth/context.tsx` |
| Auth middleware | `lib/auth/middleware.ts` + Next.js `middleware.ts` |
| Login page | `app/login/page.tsx` + `app/login/LoginForm.tsx` |
| Access denied page | `app/access-denied/page.tsx` |
| Admin sidebar | `components/AdminLayout.tsx` or `components/Sidebar.tsx` |
| Updated Header | `components/Header.tsx` (conditional nav) |
| Secure API routes | All `app/api/*/route.ts` files (add auth checks) |
| Tests | `tests/` directory (auth + middleware + integration) |

## Acceptance Criteria

1. Unauthenticated users can access `/`, `/booking`, `/booking/confirmation`, `/login`
2. Unauthenticated users hitting any other route are redirected to `/login`
3. Admin/staff users can log in with valid credentials
4. Invalid credentials show appropriate error messages
5. Logout clears state and redirects to `/login` or `/`
6. Admin/staff users see sidebar navigation and can access all CRUD pages
7. All write API endpoints return 401 for unauthenticated callers
8. All write API endpoints return 403 for unauthorized roles
9. Read API endpoints remain publicly accessible
10. Tests pass in local development environment
11. Responsive design maintained across all screens
12. Existing public booking flow continues to work unchanged