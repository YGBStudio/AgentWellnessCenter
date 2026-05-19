# Phase 8: Project Documentation Coverage Plan

## 8.1 - Documentation Audit

1. Review the existing `docs/` folder and preserve the Cloudflare Workers deployment runbook.
2. Check `package.json`, `wrangler.toml`, `open-next.config.ts`, `next.config.js`, middleware, API routes, auth utilities, database adapters, validation schemas, seed data, and tests as source-of-truth inputs.
3. Identify documentation gaps across setup, architecture, APIs, auth, data, testing, operations, deployment, and troubleshooting.

## 8.2 - Documentation Structure

1. Add `docs/README.md` as the main documentation index.
2. Add focused markdown pages for getting started, architecture, API and data, auth and security, development and testing, and operations and troubleshooting.
3. Link the existing Cloudflare Workers deployment runbook from the docs index and operations page.
4. Use stable relative links between docs pages.

## 8.3 - Content Writing

1. Document installation, local development, demo credentials, key commands, and common workflows.
2. Document app structure, request flow, protected route behavior, runtime database boundary, and deployment architecture.
3. Document core data entities, validation rules, API route behavior, persistence, seed data, and demo reset behavior.
4. Document authentication, role checks, session cookies, JWT secret handling, and protected surfaces.
5. Document coding conventions, test commands, test coverage areas, and contribution workflow.
6. Document configuration, secrets, deployment references, logging and error behavior, CI/CD status, third-party services, and troubleshooting.

## 8.4 - Roadmap And Changelog

1. Update Phase 8 in `specs/roadmap.md` to show implementation status and point to this spec directory.
2. Add a 2026-05-19 changelog entry for the documentation coverage work.

## 8.5 - Validation

1. Verify all relative markdown links in `docs/` and the Phase 8 spec directory resolve.
2. Check command references against `package.json`.
3. Check Cloudflare and deployment references against `wrangler.toml`, `open-next.config.ts`, and `docs/cloudflare-workers-deployment.md`.
4. Run `npm test -- --run`.
5. Run `npm run lint`.
6. Run `npm run build`.
7. Review tone for student and demo presenter usefulness.

## Deliverables

| Deliverable | Location |
|---|---|
| Phase 8 spec | `specs/2026-05-19-project-documentation-coverage/` |
| Documentation index | `docs/README.md` |
| Getting started guide | `docs/getting-started.md` |
| Architecture guide | `docs/architecture.md` |
| API and data guide | `docs/api-and-data.md` |
| Auth and security guide | `docs/auth-and-security.md` |
| Development and testing guide | `docs/development-and-testing.md` |
| Operations and troubleshooting guide | `docs/operations-and-troubleshooting.md` |
| Existing deployment runbook | `docs/cloudflare-workers-deployment.md` |

## Acceptance Criteria

1. A new reader can find the right documentation topic from `docs/README.md`.
2. Setup, local development, testing, demo credentials, and deployment workflows are documented from current project commands.
3. Architecture, API, auth, data, configuration, and operational behavior are documented accurately against the codebase.
4. The existing Cloudflare Workers deployment runbook remains available and is linked from the new docs.
5. Phase 8 roadmap and changelog entries are updated.
6. Tests, lint, and build pass after documentation changes.
