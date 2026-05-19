# Requirements for Phase 7: Deployment Target Preparation

## Scope
Phase 7 prepares Agent Wellness Center for deployment to Cloudflare Workers with the OpenNext Cloudflare adapter and no manual fixes required after documented bindings, variables, and secrets are configured. The phase focuses on deployment compatibility, production build configuration, environment handling, runtime support, routing, static assets, caching, and preview/production deployment readiness.

### In Scope

#### Cloudflare Workers And OpenNext Compatibility
- Confirm the supported deployment mode for the existing full-stack Next.js application on Cloudflare Workers.
- Use `@opennextjs/cloudflare` for server-rendered routes, middleware, API routes, and static assets.
- Add the OpenNext configuration required by the chosen deployment mode.
- Set the Workers entry point, assets directory, compatibility date, and compatibility flags in version-controlled configuration.
- Keep local development behavior available for teaching and demos.
- Treat Cloudflare Pages as a static-export-only option unless a later phase intentionally changes the application shape.

#### Runtime Compatibility
- Audit all Node.js-only APIs and native dependencies used by server code.
- Resolve Cloudflare Workers runtime gaps for database access, filesystem usage, crypto/auth helpers, cookies, middleware, and route handlers.
- Replace or adapt the current `better-sqlite3` file-backed production path before deploying to Cloudflare Workers.
- Preserve SQLite as a local development option if it remains useful for portable demos.
- Document any production data store required for Cloudflare, such as Cloudflare D1 or an equivalent Cloudflare-compatible database.
- Replace `@cloudflare/next-on-pages` request context and development platform usage with OpenNext Cloudflare equivalents.
- Audit explicit `runtime = 'edge'` exports and remove them where OpenNext should use the fuller Next.js Node.js runtime.

#### Build And Deployment Configuration
- Add or update package scripts for local production builds and Cloudflare Workers/OpenNext builds.
- Add `workers:build`, `workers:preview`, and `workers:deploy` scripts using the OpenNext Cloudflare CLI.
- Mark existing `pages:*` scripts obsolete for this phase's new deployment target.
- Add Cloudflare configuration such as `wrangler.toml` if required by the selected deployment path.
- Add `open-next.config.ts` with `defineCloudflareConfig()`.
- Configure the Workers entry point as `.open-next/worker.js` and static assets as `.open-next/assets`.
- Ensure build commands work from a clean checkout with only documented environment variables.
- Keep deployment-specific generated output out of source control, including `.open-next`.
- Document the Cloudflare Workers project settings: deploy command, preview command, compatibility date, compatibility flags, static assets, and required bindings.

#### Environment Variables And Secrets
- Inventory all runtime configuration values used by auth, demo mode, database access, and deployment.
- Provide a checked-in example environment file or docs table for required and optional variables.
- Ensure secrets are read from environment bindings and are never committed.
- Define separate preview and production values for deployment-sensitive settings.
- Make missing required production configuration fail clearly during build or startup.
- Document Workers variables/secrets and D1 bindings separately so secrets are never committed.

#### Routing, Static Assets, And Caching
- Verify public pages, protected pages, API routes, middleware redirects, and static assets behave correctly on Cloudflare Workers.
- Configure redirects, rewrites, headers, Workers assets, or caching rules as needed.
- Keep auth-protected routes private and public booking available.
- Ensure static CSS and framework assets are served with appropriate cache behavior.
- Ensure no protected or user-specific responses are cached publicly.

#### Preview And Production Deployments
- Document how preview deployments are created through the Workers/OpenNext workflow.
- Document how production deployments are promoted or built for Cloudflare Workers.
- Verify preview and production deployments use the correct environment variables, secrets, and data bindings.
- Ensure deployment validation can be repeated by course students and conference demo presenters.

### Out of Scope
- Payments, notifications, email/SMS, external calendars, or unrelated production features.
- Redesigning the application UI beyond deployment-related fixes.
- Replacing the existing auth model unless Cloudflare runtime compatibility requires a narrow change.
- Adding user registration or staff management.
- Vendor-neutral deployment support beyond Cloudflare Workers.
- Converting the app to a static export for Cloudflare Pages.
- Manual Cloudflare dashboard steps that can reasonably be captured in version-controlled configuration or documentation.

## Decisions
1. **Deployment Target:** Cloudflare Workers is the target for preview and production deployments.
2. **Application Shape:** The app currently uses dynamic server routes and API routes, so Phase 7 should prepare a full-stack Workers deployment through OpenNext rather than a static export.
3. **Cloudflare Adapter:** Use `@opennextjs/cloudflare` and pin the build, preview, deploy, and configuration path in project scripts/configuration.
4. **Runtime Gap:** `better-sqlite3` and local filesystem database writes are not production-compatible with the Cloudflare Workers deployment path. Phase 7 must introduce or preserve a Cloudflare-compatible production database path before deployment is considered complete.
5. **Local Demo Portability:** Preserve a lightweight local path for students and demo presenters whenever possible.
6. **Secrets Policy:** Production secrets must live in Cloudflare environment variables or bindings, not in committed files.
7. **Preview Parity:** Preview deployments should exercise the same build, routing, and runtime behavior as production with isolated configuration where needed.
8. **No Manual Fixes:** Any required Cloudflare project settings must be documented clearly, and repeatable Workers/OpenNext configuration should live in the repository.

## Context

### Project Alignment
- Supports reliable, accessible care for AI agents by making the MVP available on a stable public deployment target.
- Supports course students learning spec-driven development by documenting the deployment path as part of the specs.
- Supports conference booth demos by making preview and production deploys repeatable.
- Keeps the project aligned with the existing TypeScript, Next.js, PicoCSS, SQLite-for-local-development, Cloudflare D1, and Vitest stack.
- Aligns the deployment target with current Cloudflare guidance for full-stack Next.js applications.

### Current State
- The project is a Next.js app with App Router pages, API routes, middleware, and server-side database access.
- Local data is stored through `better-sqlite3` at `data/agentclinic.db`.
- Demo mode and seed data are already part of the MVP readiness work.
- Existing validation commands are `npm test -- --run`, `npm run lint`, and `npm run build`.
- Earlier Phase 7 work targeted Cloudflare Pages, `@cloudflare/next-on-pages`, and `.vercel/output/static`.
- Current Cloudflare guidance directs full-stack Next.js deployments to Cloudflare Workers with the OpenNext adapter.
- The implementation should replace Pages-specific scripts, config, request context helpers, and docs as part of the retarget.

### User Stories
1. As a demo presenter, I can deploy the repository to Cloudflare Workers without hand-editing files after the build fails.
2. As a student, I can read the deployment spec and understand which config belongs in git and which secrets belong in Cloudflare.
3. As an admin, I can log in on the deployed app and use protected dashboard and management pages.
4. As a public visitor, I can book an appointment on the deployed app.
5. As a maintainer, I can run a clean production build locally or in CI and catch deployment blockers before pushing.
6. As a reviewer, I can validate preview and production deployments with a clear checklist.
