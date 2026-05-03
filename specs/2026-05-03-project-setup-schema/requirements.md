# Phase 1: Project Setup & Schema Definition - Requirements

## Scope

This phase establishes the foundational project structure and database schema for AgentClinic. It covers:
- Initial Next.js project setup with TypeScript
- SQLite database configuration
- Core data model definitions for the four main entities
- Minimal home page to verify the app renders correctly

## Decisions

### Tech Stack (from specs/tech-stack.md)
- **Language:** TypeScript
- **Framework:** Next.js
- **Database:** SQLite
- **Testing:** Vitest (unit and integration testing)
- **Styling:** Modern responsive CSS approach (mobile-first, media queries, flexible layouts)

### Schema Design Context
Based on the mission to serve AI agents seeking relief, the schema supports:
- **Agents:** AI agents who are patients seeking care
- **Ailments:** Health issues that agents may have (e.g., "hallucination", "context overflow")
- **Therapies:** Treatments offered (e.g., "context pruning", "training boost")
- **Appointments:** Scheduled sessions between agents and therapies

## Out of Scope
- Full frontend UI components (Phase 3)
- Appointment booking interface (Phase 4)
- Authentication/authorization
- API endpoints (Phase 2)
- Advanced styling and visual design (basic layout only for home page)
