# Requirements for Admin and Staff Dashboard Panel

## Scope
This feature focuses on creating a secure role-based access system for the Agent Wellness Center, comprising:
1. Authentication and authorization for admin/staff users
2. Protected management interfaces leveraging existing CRUD components
3. Public-facing appointment booking interface for agents/patients

### Phase 3 — Completed in Scope ✅
- Core Project Structure: Public Home Page (`/`), Admin Dashboard (`/dashboard`), Public Booking (`/booking`)
- Full REST API CRUD for agents, ailments, therapies, appointments
- Zod validation on all API write operations
- FK constraint protection (prevents deleting entities with appointments)
- Booking conflict detection
- Booking confirmation page (`/booking/confirmation`)
- Responsive layout with PicoCSS (Header, Main, Footer, Layout)
- List components: AgentList, AilmentList, TherapyList, AppointmentList
- Form components: AgentForm, AilmentForm, TherapyForm, AppointmentForm
- QueryService with all CRUD operations and dashboard statistics

### Phase 3 — NOT Completed (Deferred to Phase 4) ❌
- Authentication system (login/logout) for admin/staff users
- User database model (users table)
- JWT/session management
- Role-based access control (admin/staff vs public vs anonymous)
- Protected management interfaces (reuse existing CRUD under `/dashboard/*` or similar access controls)
- API endpoint security enhancements (401/403 responses)
- Login page
- Auth context/provider (frontend state management)
- Route protection middleware
- Conditional navigation based on auth state
- Logout functionality
- Access denied page
- Edit/delete action wiring in list components
- Auth and integration tests

### Out of Scope (for both Phase 3 and Phase 4)
- Advanced reporting/analytics
- User profile management for staff
- Notification systems (email/SMS)
- Payment processing for appointments
- Integration with external calendar systems

## Decisions
Based on the mission and tech stack specifications:

### Technical Decisions
1. **Authentication**: Use Next.js API routes with JWT or session-based auth (decision pending — Phase 4 will choose)
2. **Database**: Continue using SQLite with Prisma ORM for TypeScript safety (Note: current implementation uses raw `better-sqlite3`, not Prisma — decision needed)
3. **State Management**: React Context or Zustand for auth state (decision pending — Phase 4 will choose)
4. **Styling**: PicoCSS for consistent, lightweight styling
5. **API Design**: RESTful endpoints following standard conventions

### UX/Design Decisions
1. **Mobile-First**: All interfaces designed for mobile first, scaling up to desktop
2. **Role Separation**: Clear visual distinction between staff dashboard and public booking
3. **Simple Forms**: Minimal form fields with clear validation feedback
4. **List Views**: Therapy/ailment management uses table/list views with actions
5. **Booking Flow**: Streamlined booking process (select agent/ailment/therapy/date, confirm)

## Context
### Project Alignment
- Aligns with mission to provide "reliable and accessible care" for AI agents
- Supports core value of "empathy for AI agents" by streamlining their access to care
- Maintains "responsive design for all devices" requirement from mission
- Uses specified tech stack: TypeScript, Next.js, SQLite, PicoCSS

### Relationship to Previous Phases
- Builds upon Phase 1's database schema (Agents, Ailments, Therapies, Appointments)
- Extends Phase 2's core features and dashboard foundation
- Leverages existing API structure and database connections
- Reuses layout components from Phase 2 dashboard work

### User Stories
1. As a staff member, I can log in to access the admin dashboard
2. As a staff member, I can view, add, edit, and delete therapies
3. As a staff member, I can view, add, edit, and delete ailments
4. As an agent/patient, I can book appointments without logging in
5. As a staff member, I can see upcoming appointments in the dashboard
6. As a system, I prevent double-booking of appointment slots
7. As a staff member, I receive validation feedback when forms are submitted incorrectly
8. As a user on any device, I can access the appropriate interface (staff dashboard or public booking)