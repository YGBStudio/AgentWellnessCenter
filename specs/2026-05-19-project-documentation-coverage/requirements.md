# Phase 8: Project Documentation Coverage Requirements

## Scope

Phase 8 creates comprehensive MVP documentation for Agent Wellness Center. The docs should help course students and demo presenters understand, run, explain, and safely operate the project without reading every source file first.

Included documentation areas:

| Area | Required coverage |
|---|---|
| Documentation index | A `docs/README.md` entry point that links every major documentation section. |
| Getting started | Setup, install, local development, demo credentials, common scripts, and day-to-day workflows. |
| Architecture | Next.js App Router structure, public and protected pages, request flow, runtime boundaries, and Cloudflare Workers shape. |
| API and data | Core entities, validation rules, route handlers, persistence, demo seed data, and demo reset behavior. |
| Auth and security | Login/logout, session cookie, JWT secret behavior, protected pages, protected write endpoints, and role model. |
| Development and testing | Coding conventions, existing test strategy, lint/build/test commands, and contribution workflow. |
| Operations and troubleshooting | Configuration, environment variables, secrets, deployment links, logging, error handling, CI/CD status, and common failures. |
| Deployment | Keep `docs/cloudflare-workers-deployment.md` as the detailed Cloudflare Workers runbook and link it from the new docs. |

Out of scope:

- Runtime behavior changes.
- Database schema changes.
- New dependencies, documentation generators, or CI services.
- Rewriting the existing deployment runbook unless a link or small accuracy fix is required.

## Decisions

- Use a docs index plus focused markdown pages rather than one long manual.
- Keep the docs practical and teaching-friendly, with enough implementation detail for demos and onboarding.
- Document current project status truthfully. For example, CI/CD should be described as not yet configured rather than invented.
- Prefer markdown-compatible diagrams where they clarify flow. Mermaid diagrams are acceptable because they remain readable in markdown viewers that do not render them.
- Cross-link docs with stable relative links so students can move through the project by topic.

## Context

Agent Wellness Center is a demo-friendly full-stack Next.js application for AI agent care workflows. It is built for students learning spec-driven development with AI coding agents and for developers giving conference demos.

Documentation tone should be:

- Clear and practical.
- Friendly without being jokey.
- Accurate to the current codebase.
- Explicit about demo defaults, seeded credentials, and Cloudflare configuration.

Implementation constraints:

- Respect the existing TypeScript, Next.js App Router, PicoCSS, Cloudflare Workers, OpenNext, D1, SQLite test adapter, Zod, and Vitest stack.
- Use the existing project commands from `package.json`.
- Avoid production-heavy guidance where the project has not yet added production automation.
