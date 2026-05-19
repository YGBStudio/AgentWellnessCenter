# Development And Testing

This project is built for spec-driven development with a small, inspectable codebase. Keep changes focused, follow existing patterns, and validate behavior before updating the roadmap.

## Development Principles

- Prefer existing patterns in `app/`, `components/`, `lib/services/`, and `lib/db/`.
- Keep route handler behavior explicit: validate input, check auth when needed, call `QueryService`, return clear JSON responses.
- Keep database access behind `QueryService` and `AppDatabase`.
- Keep shared input validation in `lib/validation.ts`.
- Avoid new dependencies unless they clearly improve a real project need.
- Keep docs aligned with source files and scripts.

## Code Organization

| Area | Pattern |
|---|---|
| Pages | App Router pages under `app/`, with server-side data loading where practical. |
| Forms | Client components that submit to route handlers and show inline feedback. |
| API routes | Route handlers in `app/api/`, exporting `dynamic = 'force-dynamic'` for runtime data. |
| Auth | Browser state in `AuthProvider`, page protection in `middleware.ts`, API protection in `lib/auth/middleware.ts`. |
| Data | SQL in `QueryService`, runtime D1 adapter, SQLite-compatible test path. |
| Styles | PicoCSS plus project CSS in `styles/layout.css` and `styles/admin-layout.css`. |

## Test Commands

```bash
npm test -- --run
npm run lint
npm run build
```

Additional useful commands:

```bash
npm run test
npm run test:ui
npm run test:coverage
npm run workers:build
```

Run `npm run workers:build` when a change touches runtime APIs, middleware, database adapters, deployment config, or anything Cloudflare-specific.

## Existing Test Coverage

| Area | Examples |
|---|---|
| Database and schema | `lib/db/*.test.ts`, `tests/db.test.ts` |
| Auth | `tests/auth.test.tsx`, `tests/auth-context.test.tsx`, `tests/middleware.test.ts` |
| API routes | `tests/api-routes.test.ts`, `tests/demo-reset.test.ts` |
| App and components | `tests/app.test.tsx`, component tests, booking form tests |

Tests use Vitest, React Testing Library, and jsdom where needed.

## Recommended Change Workflow

1. Read the relevant spec in `specs/`.
2. Inspect the current implementation before editing.
3. Make the smallest cohesive change that satisfies the spec.
4. Add or update tests when behavior changes.
5. Run targeted tests while working.
6. Run the standard checks before finalizing:

```bash
npm test -- --run
npm run lint
npm run build
```

7. Update `CHANGELOG.md` and `specs/roadmap.md` when a phase or visible feature is completed.

## Documentation Workflow

When changing project behavior, update the docs page that owns the topic:

- Setup or commands: [Getting Started](getting-started.md)
- Architecture or flow: [Architecture](architecture.md)
- Routes, validation, seed data, or persistence: [API And Data](api-and-data.md)
- Auth, roles, cookies, or secrets: [Auth And Security](auth-and-security.md)
- Deployment: [Cloudflare Workers Deployment](cloudflare-workers-deployment.md)
- Operations or troubleshooting: [Operations And Troubleshooting](operations-and-troubleshooting.md)

## CI/CD Status

There is no version-controlled CI/CD pipeline in the current MVP. Treat local validation commands as the required quality gate until a future phase adds automated CI.
