# Phase 5: Visual Revamp & Responsive NavBar

## Goal
Create the Phase 5 visual foundation for Agent Wellness Center: a polished global interface, an auth-aware responsive NavBar, improved page hierarchy, and stronger accessibility without changing application behavior.

## 5.1 - Navigation (Estimated: 0.5 day)

1. Create or replace the global header with an auth-aware `NavBar` component.
2. Preserve existing auth behavior from `useAuth()`, including logout and redirect handling.
3. Define the public navigation links: Home, Booking, Agents, Appointments, Ailments, Therapies, Login.
4. Define the authenticated navigation links: Dashboard plus logout and user context.
5. Add active-link detection with `usePathname()` and `aria-current="page"`.
6. Add mobile/tablet menu state with an accessible toggle using `aria-label`, `aria-expanded`, and `aria-controls`.
7. Close the mobile menu when a route link is selected and when Escape is pressed.

## 5.2 - Global CSS (Estimated: 1 day)

1. Define shared design tokens in project CSS using PicoCSS-compatible variables for color, spacing, radius, border, shadow, and focus treatment.
2. Consolidate duplicated layout and dashboard styles currently split across `styles/layout.css` and `styles/admin-layout.css`.
3. Add reusable classes for page shells, page headers, content sections, card grids, CTA groups, form actions, alerts, empty states, and responsive tables.
4. Style the site footer and main content area so pages have consistent vertical rhythm.
5. Ensure color contrast and focus states are visible in both public and admin surfaces.

## 5.3 - Page And Layout Cleanup (Estimated: 1 day)

1. Remove prominent inline styles from the home, booking, confirmation, login, and access-denied pages.
2. Apply reusable page and card classes while preserving existing text, links, routes, and form behavior.
3. Refresh dashboard cards for clearer metrics and actions.
4. Improve CRUD list and form spacing so management screens are easier to scan.
5. Add responsive table handling for narrow viewports without hiding important data.
6. Keep public booking and admin CRUD flows behaviorally unchanged.

## 5.4 - Admin Alignment (Estimated: 0.5 day)

1. Align the admin sidebar colors, spacing, focus states, and action styles with the new global visual language.
2. Keep the existing mobile admin sidebar behavior unless a small accessibility fix is needed.
3. Ensure global NavBar and admin sidebar do not fight for space on protected pages.
4. Keep admin navigation labels and destinations unchanged.

## 5.5 - Accessibility (Estimated: 0.5 day)

1. Verify the NavBar menu can be used with keyboard alone.
2. Confirm visible focus treatment for links, buttons, form controls, and sidebar items.
3. Preserve alert semantics for success and error messages.
4. Ensure tap targets are comfortable on mobile.
5. Review headings so each page has a clear hierarchy.
6. Check that responsive layout changes do not cause overlapping text or controls.

## 5.6 - Tests (Estimated: 0.5 day)

1. Add or update component tests for unauthenticated NavBar links.
2. Add or update component tests for authenticated NavBar state, user context, and logout control.
3. Add tests for active-link semantics where practical.
4. Add tests for mobile menu ARIA state where practical with the current test stack.
5. Update page tests only when queries need to change because markup moved from inline structure to reusable classes.
6. Run `npm test -- --run`.
7. Run `npm run lint` and ensure Phase 5 introduces no new lint issues.

## Deliverables

| Deliverable | File/Location |
|---|---|
| Responsive auth-aware NavBar | `components/Header.tsx` or new `components/NavBar.tsx` |
| Global visual styles | `styles/layout.css` |
| Admin visual alignment | `styles/admin-layout.css` |
| Public page cleanup | `app/page.tsx`, `app/booking/*`, `app/login/page.tsx`, `app/access-denied/page.tsx` |
| Dashboard and CRUD polish | Dashboard and management pages/components as needed |
| NavBar tests | Existing `tests/` or component test files |

## Acceptance Criteria

1. Public users can navigate public pages from a responsive polished NavBar.
2. Authenticated users see dashboard/logout navigation and can log out successfully.
3. Active navigation state is visible and exposed with `aria-current="page"`.
4. Mobile/tablet menu exposes accurate ARIA state and closes after navigation.
5. Pages no longer rely on prominent inline styles for Phase 5 visual layout.
6. Forms, tables, cards, and alerts share a consistent visual treatment.
7. Admin sidebar remains functional and visually aligned with the global refresh.
8. No route, API, database, or auth behavior changes are introduced.
9. Automated tests pass with `npm test -- --run`.
10. Lint has no new Phase 5 issues.
