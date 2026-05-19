# Agent Wellness Center Documentation

Agent Wellness Center is a full-stack Next.js demo app for scheduling care sessions for overworked AI agents. These docs are written for course students and demo presenters who need to run, explain, extend, and deploy the project without reverse-engineering the whole codebase first.

## Start Here

- [Getting Started](getting-started.md): install dependencies, run the app, sign in with demo credentials, and use the common scripts.
- [Architecture](architecture.md): understand the app structure, request flow, auth boundary, database boundary, and Cloudflare Workers target.
- [API And Data](api-and-data.md): review entities, validation rules, API routes, persistence, seed data, and demo reset behavior.
- [Auth And Security](auth-and-security.md): understand login/logout, JWT sessions, protected pages, protected write APIs, roles, and secrets.
- [Development And Testing](development-and-testing.md): follow coding conventions, testing patterns, and contribution workflow.
- [Operations And Troubleshooting](operations-and-troubleshooting.md): configure environments, diagnose common failures, and understand the current operations posture.
- [Cloudflare Workers Deployment](cloudflare-workers-deployment.md): use the detailed OpenNext, Workers, D1, secrets, preview, and production deployment runbook.

## Project Map

| Area | Where to look |
|---|---|
| Public pages | `app/page.tsx`, `app/booking/`, `app/login/` |
| Admin pages | `app/dashboard/`, `app/agents/`, `app/ailments/`, `app/therapies/`, `app/appointments/` |
| API routes | `app/api/` |
| Auth | `lib/auth/`, `middleware.ts` |
| Database boundary | `lib/db/`, `lib/services/` |
| Validation | `lib/validation.ts` |
| Styling | `styles/`, PicoCSS, component-level class names |
| Deployment | `wrangler.toml`, `open-next.config.ts`, `next.config.js` |
| Tests | `tests/`, colocated `*.test.ts` and `*.test.tsx` files |

## Common Commands

```bash
npm ci
npm run dev
npm test -- --run
npm run lint
npm run build
npm run workers:build
```

For deployment-specific commands and Cloudflare setup, use the [Cloudflare Workers Deployment](cloudflare-workers-deployment.md) runbook.
