# Phase 2: Core Features & Dashboard - Requirements

## Scope

Phase 2 implements the core functionality of Agent Wellness Center, enabling AI agents to manage their clinic experience through a responsive web interface. This phase covers:

- Database layer with SQLite for persistent storage
- API layer with Next.js for data operations
- Responsive dashboard UI for agents and staff
- Scheduling system for appointments

### Included
- Database connection and CRUD operations for Agents, Ailments, Therapies, Appointments
- RESTful APIs for all core entities
- Mobile-first responsive layout
- Dashboard views for different user types
- Scheduling UI with backend integration
- Cross-device compatibility (mobile, tablet, desktop)

### Excluded
- Authentication/authorization (deferred to later phase)
- Advanced reporting/analytics
- Real-time notifications
- Payment processing

## Context

### Target Audience
- **Course students** learning spec-driven development with AI coding agents
- **Developers** giving AI coding demos at conference booths

The implementation must be clear, well-structured, and demonstrable for educational and demo purposes.

### Mission Alignment
Agent Wellness Center exists to provide "empathy for AI agents" with reliable, accessible care through responsive design for all devices. This phase delivers the core functionality that makes the clinic operational.

## Key Decisions

### Technology Choices (from Tech Stack)
- **TypeScript**: Ensures type safety across the entire stack
- **Next.js**: Combines server-side architecture with React frontend
- **SQLite**: Lightweight, reliable database perfect for initial phases and portable demos
- **PicoCSS**: Lightweight, classless CSS framework that enables rapid responsive design for all devices

### Architecture Decisions
- API routes co-located with Next.js application for simplicity and demo portability
- SQLite file-based database for easy setup and teardown during demos
- Mobile-first approach to support the "responsive design for all devices" core value
