# Roadmap

High-level implementation order in small phases:

1. **Phase 1: Project Setup & Schema Definition**
    - Initialize project repository.
    - Define DB models (Agents, Ailments, Therapies, Appointments).
    - **Status:** Implemented. See `specs/2026-05-03-project-setup-schema/`.

2. **Phase 2: Core Features & Dashboard**
    - Implement database connection and CRUD operations.
    - Set up APIs for core entities.
    - Create responsive layout with mobile-first approach.
    - Build a dashboard for agents and staff.
    - Ensure UI adapts to all screen sizes (mobile, tablet, desktop).
    - Develop scheduling UI and hook it up to backend.
    - **Status:** Implemented. See `specs/2026-05-03-core-features-dashboard/`.

3. **Phase 3: Admin and Staff Dashboard Panel (Partial)**
    - Implement authentication and authorization for admin/staff users
    - Build therapy management system (CRUD operations for staff only)
    - Build ailment management system (CRUD operations for staff only)
    - Create public appointment booking interface
    - Develop API endpoints for all management functions
    - Ensure responsive design for all device types
    - Write comprehensive tests and validate implementation
    - **Status:** Public booking + CRUD infrastructure + dashboard metrics complete. Auth, protected routes, API security, and testing deferred to Phase 4.

4. **Phase 4: Authentication, Authorization & Full Admin Dashboard**
     - Add user model and database schema (users table with roles)
     - Implement JWT/session-based auth with login/logout endpoints
     - Create login page with form validation
     - Seed default admin user
     - Build auth context/provider for frontend state management
     - Implement route protection middleware and protected admin layout with sidebar
     - Secure all write API endpoints (401 for unauthenticated, 403 for unauthorized)
     - Wire up edit/delete actions in CRUD list components
     - Build access-denied page
     - Write auth integration and E2E tests
     - Validate responsive design across all device types
     - **Status:** Implemented. See `specs/2026-05-12-phase-4/`.

5. **Phase 5: Visual Revamp & Responsive NavBar**
     - Revamp CSS styles across all PicoCSS-based components for a polished, modern look
     - Improve content organization and visual hierarchy on all pages
     - Build a new responsive NavBar component that adapts across mobile/tablet/desktop
     - Refine typography, spacing, color palette, and iconography
     - Review and improve accessibility (contrast, focus states, ARIA labels)
     - **Status:** Implemented. See `specs/2026-05-17-visual-revamp-responsive-navbar/`.

6. **Phase 6: MVP Demo Readiness & Spec-Driven Closure**
     - Hide protected resource links from the unauthenticated client-facing NavBar.
     - Keep Agents, Appointments, Ailments, and Therapies reachable through authenticated dashboard/admin navigation.
     - Wire the existing admin layout/sidebar into protected dashboard and management pages.
     - Add deterministic demo seed data beyond the default admin user.
     - Tighten auth/API consistency for unauthenticated and unauthorized write requests.
     - Improve empty states and error handling for booking and admin CRUD flows.
     - Add opt-in demo mode cleanup that resets and reseeds the database after demo sessions.
     - Document demo credentials, setup, validation, and teaching walkthroughs.
     - **Status:** Complete. See `specs/2026-05-17-mvp-demo-readiness/`.

7. **Phase 7: Deployment Target Preparation**
     - Configure the project for Cloudflare Workers using the OpenNext Cloudflare adapter.
     - Add or update OpenNext build, preview, and deployment configuration.
     - Ensure environment variables and secrets are handled through deploy-time configuration.
     - Resolve runtime compatibility gaps for server routes, middleware, static assets, and database access.
     - Configure Workers assets, D1 bindings, `nodejs_compat`, and the OpenNext worker output.
     - Verify production builds succeed in a clean environment.
     - Configure routing, static assets, and caching for preview and production deployments.
     - Ensure preview and production deployments work correctly without manual fixes.
     - **Status:** Implemented for the Workers/OpenNext target as active build/deploy configuration. See `specs/2026-05-17-deployment-target-preparation/`.

8. **Phase 8: Project Documentation Coverage**
     - Review the existing documentation in the `docs` folder.
     - Identify missing or incomplete areas of project knowledge that require documentation.
     - Create and organize markdown documentation for architecture, workflows, setup, implementation details, and operational practices.
     - Document project architecture, application structure, API integrations, authentication, state management, database persistence, configuration, testing, CI/CD, coding standards, error handling, logging, third-party services, and troubleshooting.
     - Add diagrams or structured explanations where helpful using markdown-compatible formats.
     - Update or create a `docs` index/readme that links to all major documentation sections.
     - **Status:** Planned.
