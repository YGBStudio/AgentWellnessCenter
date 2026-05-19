# Phase 7: Deployment Target Preparation

## Goal
Prepare Agent Wellness Center for repeatable deployment to Cloudflare Workers with the OpenNext Cloudflare adapter, including Cloudflare-compatible runtime behavior, build configuration, environment handling, routing, static assets, caching, and preview/production validation.

## 7.1 - Deployment Architecture Review

1. Review the current Next.js app shape: App Router pages, API routes, middleware, server components, and client components.
2. Confirm the project remains a full-stack dynamic app and should deploy to Cloudflare Workers rather than Cloudflare Pages static export.
3. Document the selected OpenNext build path, build command, preview command, deploy command, Workers entry point, assets directory, compatibility date, and compatibility flags.
4. Identify unsupported runtime features and Pages-specific assumptions before implementation begins.
5. Record any Cloudflare service bindings required for production, including the D1 binding named `DB`.

## 7.2 - Database And Runtime Compatibility

1. Audit uses of `better-sqlite3`, filesystem writes, Node-only modules, and native dependencies.
2. Define the production database strategy for Cloudflare Workers, such as Cloudflare D1 or another compatible binding.
3. Preserve or adapt the existing SQLite path for local development and tests.
4. Introduce a database access boundary if needed so local and Cloudflare runtimes can share application logic.
5. Ensure seed data, demo reset behavior, booking, CRUD APIs, and auth flows work with the production database path.
6. Replace `@cloudflare/next-on-pages` request context usage with OpenNext Cloudflare runtime helpers.
7. Replace `setupDevPlatform()` usage with the OpenNext Cloudflare development helper.
8. Audit explicit `runtime = 'edge'` exports and remove them where OpenNext should use the Next.js Node.js runtime.

## 7.3 - Build And Deployment Configuration

1. Add or update package scripts for `npm run build`, `npm run workers:build`, `npm run workers:preview`, and `npm run workers:deploy`.
2. Add Cloudflare configuration files, such as `wrangler.toml`, when required by the selected deployment strategy.
3. Add `open-next.config.ts` with `defineCloudflareConfig()`.
4. Configure the Workers entry point as `.open-next/worker.js`.
5. Configure Workers static assets as `.open-next/assets` with an `ASSETS` binding.
6. Enable `nodejs_compat` with a compatibility date supported by OpenNext.
7. Mark existing `pages:*` scripts and `.vercel/output/static` output as obsolete for this phase.
8. Ensure generated build artifacts remain ignored by git, including `.open-next`.
9. Verify the deployment build runs from a clean checkout with `npm ci`.

## 7.4 - Environment Variables, Secrets, And Bindings

1. Inventory all required and optional configuration values.
2. Document local, preview, and production environment variables.
3. Add or update `.env.example` if the project uses one.
4. Ensure auth secrets, database bindings, demo mode flags, and deployment-only values are not hardcoded.
5. Add clear failure behavior for missing required production configuration.
6. Document Workers variables/secrets and D1 bindings separately so secrets are never committed.

## 7.5 - Routing, Middleware, Assets, And Caching

1. Validate Workers/OpenNext behavior for public pages, protected pages, middleware redirects, and API routes.
2. Configure redirects, rewrites, or route handling needed by Cloudflare Workers.
3. Configure static asset and CSS caching through Workers assets or Cloudflare-compatible headers when needed.
4. Confirm protected routes stay protected and public booking stays public.
5. Confirm static assets load correctly in preview and production deployments.
6. Confirm no protected or user-specific responses are cached publicly.

## 7.6 - Preview And Production Deployment Workflow

1. Document Cloudflare Workers project setup with OpenNext build, preview, deploy, assets, and environment settings.
2. Document preview deployment behavior for the selected Workers workflow.
3. Define how preview and production database bindings or data stores are separated.
4. Add deployment validation steps to README or an equivalent operations document.
5. Ensure the workflow is repeatable by course students and demo presenters.

## 7.7 - Tests And Validation

1. Run `npm ci`.
2. Run `npm test -- --run`.
3. Run `npm run lint`.
4. Run `npm run build` in a clean local environment.
5. Run `npm run workers:build`.
6. Run `npm run workers:preview`.
7. Validate deployed preview routes, auth, booking, CRUD flows, demo mode behavior, static assets, and caching.

## Deliverables

| Deliverable | File/Location |
|---|---|
| Roadmap update | `specs/roadmap.md` |
| Deployment feature spec | `specs/2026-05-17-deployment-target-preparation/` |
| OpenNext Workers build scripts | `package.json` |
| Cloudflare deployment config | `wrangler.toml` or equivalent |
| OpenNext deployment config | `open-next.config.ts` |
| Runtime/database compatibility updates | Database and API modules |
| Environment variable docs | `.env.example`, `README.md`, or deployment docs |
| Routing/static/caching config | Cloudflare config, headers, or route config |
| Deployment validation docs | `README.md` or equivalent |

## Acceptance Criteria

1. The project has version-controlled Cloudflare Workers/OpenNext deployment configuration.
2. The documented OpenNext Workers build command succeeds from a clean checkout.
3. Runtime code used in production is compatible with Cloudflare Workers.
4. Database access works in preview and production without relying on local filesystem persistence.
5. Required environment variables, secrets, and bindings are documented and validated.
6. Public pages, protected pages, API routes, middleware redirects, static assets, and caching behave correctly.
7. Preview and production deployments use the intended environment settings and data bindings.
8. `npm ci`, `npm test -- --run`, `npm run lint`, `npm run build`, `npm run workers:build`, and `npm run workers:preview` all pass.
9. The project deploys successfully to Cloudflare Workers with no manual fixes required after documented bindings and secrets are configured.
