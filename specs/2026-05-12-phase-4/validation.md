# Validation Criteria for Phase 4: Authentication, Authorization & Admin Dashboard

## Success Metrics
The implementation will be considered successful when all of the following criteria are met:

### Authentication System
- [ ] Users table exists in database with correct schema (id, email, password_hash, role, created_at)
- [ ] `User` and `UserInsert` TypeScript types are defined and consistent with schema
- [ ] QueryService includes `getUserByEmail()`, `createUser()`, and `getUserCount()` methods
- [ ] Passwords are hashed with bcrypt before storage
- [ ] Default admin user is seeded on first run with email `admin@agentclinic.demo` and password `admin`
- [ ] Demo credentials (`admin@agentclinic.demo` / `admin`) are displayed on the login page so evaluators can log in immediately
- [ ] `POST /api/auth/login` returns a valid JWT/session cookie for correct credentials
- [ ] `POST /api/auth/login` accepts the demo credentials and grants full admin access
- [ ] `POST /api/auth/login` returns 401 for invalid credentials with clear error message
- [ ] `POST /api/auth/logout` clears authentication state and returns success
- [ ] `GET /api/auth/me` returns current user info when authenticated
- [ ] `GET /api/auth/me` returns 401 when not authenticated

### Frontend Auth State Management
- [ ] Auth provider wraps the application and persists auth state
- [ ] `useAuth()` hook exposes `user`, `isAuthenticated`, `role`, `login()`, `logout()`, `loading`
- [ ] Auth state persists across page navigation (not lost on route change)
- [ ] Loading state handles async session check gracefully

### Protected Pages & Navigation
- [ ] `/login` page renders email/password form with client-side validation
- [ ] Successful login redirects to `/dashboard`
- [ ] Failed login displays inline error message
- [ ] `/dashboard` requires authentication; unauthenticated users are redirected to `/login`
- [ ] Sidebar navigation is visible on authenticated dashboard pages
- [ ] Sidebar contains links to Dashboard overview, Agents, Ailments, Therapies, Appointments, Logout
- [ ] Header shows user email/role and logout button when authenticated
- [ ] Header shows login link when unauthenticated
- [ ] Access denied page renders for users with insufficient role
- [ ] Logout clears state and redirects to `/` or `/login`
- [ ] Middleware redirects unauthenticated users on protected routes
- [ ] Middleware redirects authenticated users away from `/login`

### Secured API Endpoints
- [ ] `POST /api/agents` returns 401 when unauthenticated
- [ ] `PUT /api/agents/[id]` returns 401 when unauthenticated
- [ ] `DELETE /api/agents/[id]` returns 401 when unauthenticated
- [ ] Same 401 behavior for unauthenticated POST/PUT/DELETE on ailments, therapies, appointments
- [ ] Protected endpoints return 403 for authenticated users without appropriate role
- [ ] `GET /api/agents`, `GET /api/ailments`, `GET /api/therapies`, `GET /api/appointments` remain accessible without authentication
- [ ] All protected endpoints validate input on the server side
- [ ] Error responses include descriptive messages suitable for frontend display

### Edit/Delete Actions
- [ ] Agents page passes `onEdit`/`onDelete` to AgentList; action buttons render
- [ ] Ailments page passes `onEdit`/`onDelete` to AilmentList; action buttons render
- [ ] Therapies page passes `onEdit`/`onDelete` to TherapyList; action buttons render
- [ ] Appointments page passes `onEdit`/`onDelete` to AppointmentList; action buttons render
- [ ] Edit action opens form pre-filled with existing data and allows update
- [ ] Delete action shows confirmation before proceeding
- [ ] Edit/delete actions are only visible to authenticated admin/staff users

### Testing
- [ ] Unit tests for password hashing and JWT utilities
- [ ] Unit tests for `getUserByEmail()`, `createUser()`, `getUserCount()` query methods
- [ ] Unit tests for auth middleware route guard logic
- [ ] Integration test: login API with valid credentials returns 200 + token
- [ ] Integration test: login API accepts demo credentials (`admin@agentclinic.demo` / `admin`)
- [ ] Integration test: login API with invalid credentials returns 401
- [ ] Integration test: logout API clears session
- [ ] Integration test: unauthenticated request to protected endpoint returns 401
- [ ] Integration test: unauthorized role request returns 403
- [ ] E2E test: admin login → navigate to dashboard → view entities → logout
- [ ] E2E test: unauthenticated visit to `/dashboard` → redirected to `/login`
- [ ] E2E test: public booking flow still works without authentication
- [ ] All existing tests continue to pass (no regressions)

### Code Quality
- [ ] Auth logic is modular and reusable (utils, middleware, context separated)
- [ ] Route protection follows consistent Next.js patterns
- [ ] State management follows React best practices
- [ ] No console errors or warnings in development mode
- [ ] Code is properly commented where logic is non-trivial
- [ ] All new code follows existing project coding standards

### Responsive Design
- [ ] Login page renders correctly on mobile (320px width)
- [ ] Login page renders correctly on tablet (768px width)
- [ ] Login page renders correctly on desktop (1024px+ width)
- [ ] Dashboard sidebar adapts to screen size (full sidebar on desktop, accessible on mobile)
- [ ] Header navigation works on all screen sizes
- [ ] Form inputs and buttons are appropriately sized for touch interfaces

## Definition of Done
This phase is considered complete and ready for merge when:
1. All validation criteria above are satisfied
2. Code has been reviewed and approved via pull request process
3. Documentation has been updated (`README.md`, `specs/`)
4. No critical or high-priority bugs remain
5. All existing functionality remains unaffected (no regressions in Phase 2/3 features)
6. Tests pass in local development environment (`npm test`)