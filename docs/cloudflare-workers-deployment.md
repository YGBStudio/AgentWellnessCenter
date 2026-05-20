# Cloudflare Workers Deployment

Agent Wellness Center deploys as a full-stack Cloudflare Workers application with OpenNext because it uses App Router server components, route handlers, middleware, protected pages, and API writes. Cloudflare Pages is no longer the deployment target for this phase; it should only be revisited if the app is intentionally converted to a static export later.

## Project Settings

Use these settings when configuring Workers builds:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `npm run workers:build` |
| Preview command | `npm run workers:preview` |
| Deploy command | `npm run workers:deploy` |
| Worker entry point | `.open-next/worker.js` |
| Static assets directory | `.open-next/assets` |
| Assets binding | `ASSETS` |
| Compatibility date | `2026-05-18` |
| Compatibility flags | `nodejs_compat` |
| Database binding | D1 binding named `DB` |

The version-controlled source of truth is `wrangler.toml`, with OpenNext defaults in `open-next.config.ts`. Generated output stays out of git through `.gitignore`, including `.next`, `.open-next`, `.wrangler`, and local SQLite files.

The `workers:preview` and `workers:deploy` scripts both run a fresh `workers:build` first, so they use current OpenNext Worker output.

## Runtime And Data

Preview and production deployments use Cloudflare D1. The local SQLite adapter remains available for unit tests and portable data experiments, but deployed request code reads the D1 binding through OpenNext's `getCloudflareContext()`.

The app initializes the schema and deterministic demo seed data on first database access. The schema is also checked in as `migrations/0001_initial.sql` so maintainers can apply explicit D1 migrations:

```bash
npm run d1:migrate:local
npm run d1:migrate:preview
npm run d1:migrate:production
```

Create separate D1 databases for local preview, Cloudflare preview, and production, then replace the placeholder `database_id` values in `wrangler.toml`. Database IDs are not secrets, but they are account-specific deployment configuration.

```bash
wrangler d1 create agentclinic-local
wrangler d1 create agentclinic-preview
wrangler d1 create agentclinic-production
```

| Environment | D1 database name | Wrangler env |
|---|---|---|
| Local Wrangler preview | `agentclinic-local` | default |
| Cloudflare preview | `agentclinic-preview` | `preview` |
| Cloudflare production | `agentclinic-production` | `production` |

## Environment Variables And Secrets

Committed defaults in `wrangler.toml` are non-secret values only. Set secrets through Wrangler or the Cloudflare dashboard, never in committed files.

| Name | Local | Preview | Production | Notes |
|---|---|---|---|---|
| `JWT_SECRET` | Optional | Required secret | Required secret | Use a long random value. Missing preview/production secrets fail clearly at auth time. |
| `REQUIRE_JWT_SECRET` | `false` | `true` | `true` | Enforces that preview/production do not use the local demo secret. |
| `DEMO_MODE` | `true` in Wrangler config | `true` | `false` | Enables demo reset behavior after sessions. |
| `DATABASE_DRIVER` | `d1` | `d1` | `d1` | Documents that Cloudflare uses D1. |
| `CLOUDFLARE_ACCOUNT_ID` | Optional | Optional | Optional | Useful for local Wrangler account commands. |
| `DB` | D1 binding | D1 binding | D1 binding | Binding, not a string secret. |

Set secrets with Wrangler:

```bash
wrangler secret put JWT_SECRET --env preview
wrangler secret put JWT_SECRET --env production
```

## Local Validation

Run the standard app checks:

```bash
npm ci
npm test -- --run
npm run lint
npm run build
```

Run the Workers/OpenNext build for build-only validation:

```bash
npm run workers:build
```

Run the local Workers runtime preview when you need to exercise Cloudflare bindings, assets, and D1 behavior:

```bash
npm run workers:preview
```

`npm run workers:preview` runs `npm run workers:build` before starting preview, so you do not need to run both commands unless you also want a separate build-only check. `npm run dev` is only the fast Next.js development server; `next.config.js` initializes the OpenNext Cloudflare development helper so server code can read local D1 bindings during development.

## Caching And Assets

Workers Static Assets serve `.open-next/assets` through the `ASSETS` binding. The checked-in `public/_headers` file is copied into the static asset output, where Workers applies cache rules for framework assets. Dynamic API, login, dashboard, and management routes also receive `Cache-Control: no-store` from `next.config.js`, so protected or user-specific responses are not cached publicly.

## Preview And Production Smoke Checks

For every preview deployment from a non-production branch:

1. Visit `/`, `/booking`, `/login`, `/dashboard`, `/agents`, `/appointments`, `/ailments`, and `/therapies`.
2. Confirm protected pages redirect unauthenticated users to `/login?from=...`.
3. Log in with the seeded demo admin credentials.
4. Create a public booking and verify it appears in appointment data.
5. Exercise one create/update/delete flow for agents, ailments, therapies, and appointments.
6. Confirm static styles load and `_next/static/*` assets are cached while API and protected responses use `no-store`.

For production, repeat the same smoke checks after deployment with the production `JWT_SECRET`, `DEMO_MODE=false`, and the production D1 binding.
