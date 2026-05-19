# Validation Criteria for Phase 7: Deployment Target Preparation

## Success Metrics
The implementation will be considered successful when all of the following criteria are met:

### Cloudflare Workers And OpenNext Configuration
- [ ] The repository contains the required Cloudflare Workers/OpenNext build and deployment configuration.
- [ ] The Workers project settings are documented: build command, preview command, deploy command, worker entry point, assets directory, compatibility date, and compatibility flags.
- [ ] The selected Next.js deployment mode is documented and matches the app's dynamic route/API needs.
- [ ] `open-next.config.ts` exists and uses the OpenNext Cloudflare adapter.
- [ ] `wrangler.toml` uses Workers configuration, including `.open-next/worker.js`, `.open-next/assets`, `ASSETS`, `nodejs_compat`, and D1 binding `DB`.
- [ ] Generated Cloudflare and framework build output is ignored by git, including `.open-next`.
- [ ] Obsolete `pages:*`, `.vercel/output/static`, and `@cloudflare/next-on-pages` deployment paths are removed or clearly marked as superseded.

### Runtime Compatibility
- [ ] Production server code avoids unsupported Cloudflare Workers runtime APIs.
- [ ] Native Node dependencies are removed from the production runtime path or guarded behind local-only code.
- [ ] Database access works through a Cloudflare-compatible production path.
- [ ] Local development and test database behavior remain documented and usable.
- [ ] Auth, cookies, middleware, seed data, demo reset, booking, and CRUD flows work in the production runtime.
- [ ] `@cloudflare/next-on-pages` request context and dev-platform helpers are replaced with OpenNext Cloudflare equivalents.
- [ ] Explicit `runtime = 'edge'` exports are audited and removed where OpenNext should use the Next.js Node.js runtime.

### Environment Variables And Secrets
- [ ] Required local, preview, and production variables are documented.
- [ ] Secrets are not committed to the repository.
- [ ] Missing required production configuration fails with a clear error.
- [ ] Preview and production deployments can use separate secrets and database bindings.
- [ ] Demo mode remains opt-in and safe for production deployment.
- [ ] Workers variables/secrets and D1 bindings are documented separately.

### Build And Deployment
- [ ] `npm ci` succeeds from a clean checkout.
- [ ] `npm test -- --run` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `npm run workers:build` passes.
- [ ] `npm run workers:preview` starts the app in the Workers runtime.
- [ ] `npm run workers:deploy` deploys successfully to Cloudflare Workers after documented bindings and secrets are configured.
- [ ] Cloudflare preview deployments build successfully through the selected Workers workflow.
- [ ] Cloudflare production deployments build successfully through the selected Workers workflow.

### Routing, Assets, And Caching
- [ ] Public routes load on Cloudflare Workers.
- [ ] Protected routes redirect unauthenticated users to login.
- [ ] Authenticated admin/staff users can access dashboard and management routes.
- [ ] API routes respond correctly on Cloudflare Workers.
- [ ] Public booking works on Cloudflare Workers.
- [ ] Static CSS and framework assets load correctly.
- [ ] Caching headers or Cloudflare defaults are documented and appropriate for static assets.
- [ ] No protected or user-specific responses are cached publicly.

### Documentation
- [ ] README or deployment docs explain Cloudflare Workers/OpenNext setup.
- [ ] Docs identify which configuration is committed and which is set in Cloudflare.
- [ ] Docs include preview and production deployment validation steps.
- [ ] Docs include any database binding setup required for Cloudflare.
- [ ] Specs remain aligned with `specs/mission.md` and `specs/tech-stack.md`.
- [ ] Any previous Cloudflare Pages deployment docs are renamed, superseded, or clearly marked obsolete.

## Manual Review Checklist
- [ ] Create a clean checkout and run `npm ci`.
- [ ] Run local validation commands: `npm test -- --run`, `npm run lint`, and `npm run build`.
- [ ] Run `npm run workers:build`.
- [ ] Run `npm run workers:preview`.
- [ ] Create or inspect a Cloudflare Workers preview deployment.
- [ ] Visit Home, Booking, Login, Dashboard, Agents, Appointments, Ailments, and Therapies on the preview deployment.
- [ ] Confirm unauthenticated protected route redirects include the intended `from` parameter.
- [ ] Log in with configured demo/admin credentials.
- [ ] Create a booking and verify it persists through the configured production database path.
- [ ] Exercise representative admin CRUD flows.
- [ ] Confirm static assets load and no layout-critical styles are missing.
- [ ] Promote or create a production deployment and repeat smoke checks.

## Definition Of Done
Phase 7 is ready to merge when:

1. Cloudflare Workers/OpenNext build and deployment configuration is committed.
2. Runtime and database code are compatible with Cloudflare Workers.
3. Environment variables, secrets, and bindings are documented for local, preview, and production use.
4. Preview and production deployment paths are verified.
5. Static assets, routing, middleware, auth, booking, and CRUD flows work on Cloudflare Workers.
6. The app deploys successfully to Cloudflare Workers with no manual fixes required after documented bindings and secrets are configured.

## Implementation Validation Notes

- `npm ci` passes with the committed lockfile.
- `npm test -- --run` passes: 16 files, 112 tests.
- `npm run lint` passes.
- `npm run build` passes.
- `npm run workers:build` passes and writes `.open-next/worker.js`.
- `npm run cf:typegen` passes with repo-local Wrangler config/log output.
- `npm run workers:preview` starts the local Workers runtime when allowed to bind localhost.
- Workers preview smoke checks passed for `/booking`, unauthenticated `/dashboard` redirect, and D1-backed `/api/agents`.
