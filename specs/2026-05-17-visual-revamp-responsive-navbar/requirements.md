# Requirements for Phase 5: Visual Revamp & Responsive NavBar

## Scope
Phase 5 revamps the Agent Wellness Center interface for a more polished, modern clinic experience while preserving existing application behavior. The phase focuses on shared layout, responsive navigation, visual hierarchy, accessibility, and consistency across public and admin-facing screens.

### In Scope

#### Global Visual Polish
- Refresh typography, spacing, color usage, borders, shadows, and section rhythm across the app.
- Keep PicoCSS as the foundation and use project CSS for custom layout and component polish.
- Replace prominent inline styles with reusable class names where the affected UI is part of this revamp.
- Improve page headers, content sections, cards, dashboards, tables, forms, alerts, buttons, and the footer.
- Maintain a clean, trustworthy clinic feel with light Agent Wellness Center personality.

#### Responsive NavBar
- Build a new auth-aware responsive navigation component for the global site header.
- Show public navigation for unauthenticated visitors.
- Show dashboard and logout affordances for authenticated users.
- Include active-route styling and `aria-current="page"` for the current page.
- Provide an accessible mobile/tablet menu with a clear toggle button, `aria-expanded`, `aria-controls`, keyboard support, and route-change close behavior.

#### Page And Layout Organization
- Improve visual hierarchy on the home, booking, booking confirmation, login, access-denied, dashboard, and CRUD pages.
- Preserve all current routes, data flows, forms, and API interactions.
- Align the existing admin sidebar with the updated global visual system without replacing its core behavior.
- Ensure tables and form-heavy screens remain usable on mobile, tablet, and desktop.

#### Accessibility
- Improve contrast, focus states, target sizing, semantic labels, and responsive readability.
- Ensure the NavBar can be operated with keyboard and assistive technology.
- Keep alerts and validation messages announced with appropriate roles.

### Out of Scope
- New product features, workflow changes, or CRUD behavior changes.
- API, database, authentication, authorization, or middleware contract changes.
- New runtime dependencies without explicit user approval.
- Replacing PicoCSS or introducing a separate design system.
- Full E2E/browser automation infrastructure if it is not already present.

## Decisions

1. **Scope:** Global visual polish is the target. This includes shared layout, navigation, pages, tables, forms, cards, and responsive refinement.
2. **Navigation Pattern:** Use an auth-aware client NavBar with active links, login/logout state, a mobile disclosure menu, and accessible controls.
3. **Visual Tone:** Use a modern clinic tone: clean, polished, trustworthy, accessible, and lightly playful where the existing AI-care concept supports it.
4. **Dependencies:** Do not add new dependencies. Continue using TypeScript, Next.js, React, PicoCSS, and project CSS.
5. **Behavior Preservation:** Keep all public routes, protected routes, API calls, form submissions, and auth flows working as they do today.
6. **Admin Navigation:** Keep the existing admin sidebar pattern but visually align it with the refreshed global interface.

## Context

### Project Alignment
- Supports the mission of reliable, accessible care for AI agents.
- Improves the demo experience for course students and conference booth audiences.
- Builds on the Phase 4 authentication work by making public and authenticated navigation clearer.
- Keeps the app lightweight and demo-friendly by avoiding new dependencies.

### Existing Patterns To Follow
- The app uses PicoCSS for base UI primitives and custom CSS in `styles/layout.css` and `styles/admin-layout.css`.
- `Header` currently renders auth-aware links and logout behavior through `useAuth()`.
- `AdminLayout` currently owns the protected sidebar and mobile admin header.
- Public pages and forms currently include several inline styles that should move into reusable classes as part of the visual cleanup.

### User Stories
1. As a visitor, I can navigate the public clinic pages from a polished responsive header.
2. As a mobile visitor, I can open and close navigation reliably with touch or keyboard.
3. As a logged-in admin, I can clearly see dashboard access and log out from the global navigation.
4. As a user, I can tell which section I am viewing from active navigation styling.
5. As a demo audience member, I can scan pages quickly because hierarchy, spacing, and calls to action are visually consistent.
6. As a keyboard user, I can move through the NavBar, forms, tables, and action buttons without losing focus context.
