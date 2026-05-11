# Requirements for Phase 4: Authentication, Authorization & Admin Dashboard

## Scope
This phase completes the Phase 3 vision by adding authentication, authorization, and a fully protected admin dashboard to the Agent Wellness Center. It transforms the existing public-only application into a secure, role-based system.

### In Scope

#### Authentication System
- User database model with email, password hash, and role fields
- Database schema and type definitions for users
- User query service methods (getByEmail, create, count)
- Password hashing utility (bcrypt or compatible)
- Default admin user seeding mechanism
- JWT-based login/logout API endpoints
- `/api/auth/me` endpoint for frontend session hydration

#### Frontend Auth State Management
- Auth context or store (React Context or Zustand)
- Custom `useAuth()` hook
- Auth provider wrapping the app in `layout.tsx`
- Token/session persistence strategy (httpOnly cookie recommended)

#### Protected Pages & Navigation
- Login page (`/login`) with email/password form and validation
- Access denied page for insufficient permissions
- Admin dashboard (`/dashboard`) gated behind authentication
- Sidebar navigation for admin/staff users
- Updated header with conditional auth state rendering (login/logout links vs user info)
- Next.js middleware for route protection
- Redirect logic: unauthenticated → `/login`, authenticated at `/login` → `/dashboard`

#### Secured API Endpoints
- Auth middleware applied to all POST/PUT/DELETE API routes
- GET endpoints remain publicly accessible for read-only browsing
- 401 responses for unauthenticated requests to protected endpoints
- 403 responses for authenticated users with insufficient roles
- Role checking on protected endpoints (admin/staff)

#### Edit/Delete Actions Wiring
- Pass `onEdit`/`onDelete` callbacks from CRUD pages to list components
- Implement inline or page-based editing with confirmation dialogs
- Restrict edit/delete visibility to authorized roles only

#### Testing
- Unit tests for authentication utilities (hash, verify, JWT)
- Unit tests for user query service methods
- Unit tests for auth middleware and route guard logic
- Integration tests for login/logout/me API flow
- Integration tests for unauthorized access protection
- E2E tests for admin login → manage entity → logout
- E2E tests for public user → attempt protected access → redirected
- Regression tests ensuring existing public booking flow still works

### Out of Scope
- Advanced reporting/analytics
- User profile management for staff
- Notification systems (email/SMS)
- Payment processing for appointments
- Integration with external calendar systems
- Public user registration (only admin can create staff accounts)

## Decisions

### Technical Decisions
1. **Auth Strategy:** JWT stored in httpOnly secure cookie for best security with Next.js
2. **Password Hashing:** bcrypt (well-supported, battle-tested)
3. **Frontend State:** React Context with `useAuth()` hook (minimal new dependencies, aligns with existing patterns)
4. **Route Protection:** Next.js middleware for redirects + API middleware for 401/403 responses
5. **User Roles:** Two roles — `admin` (full access) and `staff` (read + manage entities)
6. **Database:** Continue with raw `better-sqlite3` (consistent with existing implementation)
7. **Demo Credentials:** The application ships with a single seed admin account — **email:** `admin@agentclinic.demo`, **password:** `admin`. These credentials are displayed on the login page so evaluators and demo audiences can log in immediately. The seed runs automatically on first startup.

### UX/Design Decisions
1. **Login Page:** Clean, centered form with email and password fields, consistent with existing PicoCSS form styling. A visible note at the bottom displays demo credentials (`admin@agentclinic.demo` / `admin`) so evaluators can log in immediately. This note is styled subtly (e.g., muted text, smaller font) so it doesn't distract from the form.
2. **Sidebar:** Vertical sidebar navigation visible only on tablet and desktop; collapsible or bottom nav on mobile
3. **Header:** Shows user email and role when logged in, with logout button; shows login link when logged out
4. **Access Denied:** Friendly page explaining the user lacks permission, with a link back to public areas
5. **Edit/Delete:** Inline action buttons on table rows with confirmation before destructive actions

## Context

### Project Alignment
- Completes Phase 3's goal of secure role-based access to management tools
- Supports the mission of "reliable and accessible care" by ensuring only authorized staff can modify data
- Maintains responsive design commitment across all device types
- Builds on existing tech stack: TypeScript, Next.js, SQLite, PicoCSS

### Relationship to Previous Phases
- Depends on Phase 1's database schema (Agents, Ailments, Therapies, Appointments)
- Depends on Phase 2/3's REST API structure and CRUD components
- Extends the existing `/dashboard` page with auth gating and sidebar
- Leverages existing QueryService and validation layer

### User Stories
1. As an admin, I can log in with my email and password to access the dashboard
2. As a staff member, I can log in and see management tools but not user management
3. As an unauthenticated user, I can browse the home page and booking flow without interruption
4. As an unauthenticated user, I cannot access the dashboard or CRUD pages
5. As a logged-in user, I can see my role and email in the header
6. As a logged-in user, I can log out which clears my session and returns me to public pages
7. As a user without permission, I see an access denied page when attempting restricted actions
8. As a staff member, I can edit and delete entities I manage with confirmation dialogs
9. As a system, I return 401/403 status codes for unauthorized API requests
10. As a developer, the auth system is modular and testable independently