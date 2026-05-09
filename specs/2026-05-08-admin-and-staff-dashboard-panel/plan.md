# Refined Implementation Plan for Admin and Staff Dashboard Panel

## 1. Authentication and Authorization System (Foundation)
- Implement JWT-based authentication with login/logout endpoints
- Create user roles: admin, staff, public (patients/agents)
- Build login page with form validation
- Implement route protection middleware for admin/staff routes
- Create authentication context/provider for frontend state management
- Add role-based access control to existing API routes

## 2. Admin Dashboard Interface (Leveraging Existing Components)
- Define `app/dashboard/page.tsx` as the main admin dashboard view.
- Create admin layout with sidebar navigation
- Build admin dashboard overview showing key metrics (move existing `/` metrics to `/dashboard`)
- Create protected wrapper components for existing management interfaces:
  - Admin Agents Page (reuse existing agents CRUD with admin-only access)
  - Admin Ailments Page (reuse existing ailments CRUD with admin-only access)
  - Admin Therapies Page (reuse existing therapies CRUD with admin-only access)
  - Admin Appointments Page (reuse existing appointments CRUD with admin-only access)
- Ensure all admin interfaces require authentication and appropriate roles

## 3. Public Pages (New and Migrated)
- [x] Create separate public booking page (no authentication required) at `/booking`
- [x] Design streamlined booking form focused on patient/agent needs
- [x] Implement agent availability checking and conflict validation
- [x] Create booking confirmation screen at `/booking/confirmation`
- [ ] Define and implement the Public Home Page at `/` (landing page, linking to booking).
- [x] Ensure mobile-responsive design

## 4. API Security Enhancements
- Add authentication middleware to protect therapy/ailment/appointment/agent creation/update/delete endpoints
- Keep read/list endpoints public where appropriate (for browsing)
- Implement role checking on protected endpoints
- Add proper error handling and HTTP status codes
- Validate all inputs on protected endpoints

## 5. Navigation and User Experience
- Create conditional navigation based on auth state and role
- Implement redirect logic for unauthorized access attempts
- Add logout functionality accessible from admin interface
- Ensure seamless transition between public booking and admin areas
- Maintain consistent styling using existing PicoCSS foundation

## 6. Testing and Validation
- Write unit tests for authentication utilities and middleware
- Implement integration tests for login/logout flows
- Create end-to-end tests for:
  - Admin login → therapy management → logout
  - Public booking flow (no auth required)
  - Unauthorized access protection
- Test role-based access controls
- Validate responsive design across device sizes