# Refined Implementation Plan for Admin and Staff Dashboard Panel

## 1. Authentication and Authorization System (Foundation)
- [ ] Implement user model/table (email, password hash, role: admin/staff)
- [ ] Implement JWT-based authentication with login/logout API endpoints
- [ ] Create user roles: admin, staff
- [ ] Build login page with form validation
- [ ] Seed a default admin user on first run
- [ ] Implement route protection middleware for admin/staff routes
- [ ] Create authentication context/provider for frontend state management
- [ ] Add role-based access control to existing API routes

## 2. Admin Dashboard Interface (Leveraging Existing Components)
- [ ] Define `app/dashboard/page.tsx` as the main admin dashboard view (page exists, needs auth gating and sidebar)
- [ ] Create admin layout with sidebar navigation
- [ ] Build admin dashboard overview showing key metrics (migrate existing `/` metrics to `/dashboard`)
- [ ] Create protected wrapper components for existing management interfaces:
  - Admin Agents Page (reuse existing agents CRUD with admin-only access)
  - Admin Ailments Page (reuse existing ailments CRUD with admin-only access)
  - Admin Therapies Page (reuse existing therapies CRUD with admin-only access)
  - Admin Appointments Page (reuse existing appointments CRUD with admin-only access)
- [ ] Wire up onEdit/onDelete callbacks in list components with inline or page-based editing
- [ ] Ensure all admin interfaces require authentication and appropriate roles

## 3. Public Pages (Already Implemented)
- [x] Create separate public booking page (no authentication required) at `/booking`
- [x] Design streamlined booking form focused on patient/agent needs
- [x] Implement agent availability checking and conflict validation
- [x] Create booking confirmation screen at `/booking/confirmation`
- [x] Define and implement the Public Home Page at `/` (landing page, linking to booking)
- [x] Ensure mobile-responsive design

## 4. API Security Enhancements
- [ ] Add authentication middleware to protect therapy/ailment/appointment/agent creation/update/delete endpoints
- [ ] Keep read/list endpoints public where appropriate (for browsing)
- [ ] Implement role checking on protected endpoints
- [ ] Add proper error handling and HTTP status codes (401 for unauthenticated, 403 for insufficient role)
- [ ] Validate all inputs on protected endpoints

## 5. Navigation and User Experience
- [ ] Create conditional navigation based on auth state and role
- [ ] Implement redirect logic for unauthorized access attempts (redirect to `/login`)
- [ ] Add logout functionality accessible from admin interface
- [ ] Ensure seamless transition between public booking and admin areas
- [ ] Build access-denied page for insufficient permissions
- [ ] Maintain consistent styling using existing PicoCSS foundation

## 6. Testing and Validation
- [ ] Write unit tests for authentication utilities, middleware, and helper functions
- [ ] Implement integration tests for login/logout flows
- [ ] Create end-to-end tests for:
  - Admin login → therapy management → logout
  - Public booking flow (no auth required)
  - Unauthorized access protection
- [ ] Test role-based access controls
- [ ] Validate responsive design across device sizes