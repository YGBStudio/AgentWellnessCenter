# Changelog

## 2026-05-03
- feat: initialize project structure and document technical specifications for AgentClinic
- feat: initialize AgentClinic feature structure, documentation, and phase 1 specifications
- chore: update .gitignore to fit the framework used in this project
- chore: update .gitignore to exclude sqlite-related files.
- chore: initialize Next.js environment and project configuration
- feat: implement core database layer and dashboard UI skeleton
- docs: finalize phase 1 project setup and schema plan
- docs(specs): add responsive design requirements
- feat(ui): update responsive layout
- chore(config): add vitest and update deps
- test(db): add schema validation tests
- docs: add changelog and skills
- feat(ui): update layout and home page
- feat(db): add queries module
- chore(config): update tsconfig
- docs(skills): update clean-commits
- docs(specs): combine phases 2-3-4 into phase 2
- docs(specs): add phase 2 spec and update tech stack
- chore(config): add PicoCSS dependency
- feat(db): add CRUD operations for all entities
- feat(api): add CRUD routes for all entities
- feat(ui): add PicoCSS layout and entity pages
- test(db): add query function tests

## 2026-05-07
- test(ui): add component list tests
- chore(deps): add testing library and jsdom deps
- refactor(db): replace queries with QueryService class
- feat(ui): update pages and API to use QueryService
- fix(test): add path alias and fix test imports
- feat(db): lazy init, unique constraints, and safe insert types
- chore(deps): add zod for validation
- feat(api): add zod validation and strict typing to all routes
- feat(ui): update forms with feedback states and client router refresh
- test(db): add full CRUD array tests and FK constraint coverage
- docs(specs): align validation specs with actual test coverage
- fix: resolve ZodError generic type and property access
- docs: update changelog with recent commits
- docs: update specs and skills for Agent Wellness Center rename
- chore(config): update package name to agentwellnesscenter
- feat(ui): apply Agent Wellness Center brand to views and layout
- test: update heading assertions for Agent Wellness Center name

## 2026-05-08
- feat: create Phase 3 specifications for Admin and Staff Dashboard Panel feature
- docs(specs): update admin and staff dashboard panel specifications
- feat(ui): implement home page redesign with promo cards and new booking/dashboard routes
- feat(services): add appointment conflict checking to query service
- test(app): fix dashboard tests to match updated home page and add dashboard page tests
- test(app): fix type annotation in test helper function and config(ts): add baseUrl to tsconfig for path aliases
- test(app): improve type safety in test helper function
## 2026-05-10
- docs: update phase 3 status and add phase 4/5 specs

## 2026-05-11
- chore(deps): update dependencies and lockfile
- feat(db): update schema, client and add seed data
- feat(auth): implement auth logic and middleware
- feat(api): implement auth and update resource API routes
- feat(ui): implement admin layout and update global layout
- feat(ui): add login and access denied pages
- feat(ui): update resource management pages and components
- test: update application and auth tests

## 2026-05-18
- chore(config): update tooling config for Cloudflare deployment
- chore(deps): add Cloudflare/opennext dependencies and deployment config
- refactor(db): extract AppDatabase adapter interface with SQLite and D1 implementations
- refactor(services): make QueryService async via AppDatabase adapter
- refactor(auth): replace bcrypt with Web Crypto PBKDF2 and update seed
- refactor(api): adapt route handlers to async QueryService and add force-dynamic
- feat(ui): add type assertions and minor cleanup in pages
- test: update tests for async query service and Web Crypto auth
- docs: add deployment target preparation specs and docs

## 2026-05-19
- docs(specs): add phase 8 project documentation coverage specifications
- docs: add documentation index and guides for setup, architecture, API/data, auth, development, testing, operations, and troubleshooting
- docs(roadmap): mark phase 8 project documentation coverage implemented
- docs(skills): add generalized documentation coverage workflow skill
- chore(config): remove README from gitignore and ignore prompts.md
- chore(config): add noindex headers and robots metadata
- feat(ui): redesign footer with credit link and fix sidebar layering
- docs: improve README link text clarity
- test: add footer and SEO headers tests
- docs: update workflow diagram to vertical layout
- docs: promote workers:preview as canonical local runtime
- fix: prevent auth race conditions, add date validation, hydrate login
- feat(ui): add min date to appointment inputs and safe redirect on login
- test: add past-time rejection, auth hydration, and date utility tests
- docs: update auth flow, demo mode, and appointment guardrails specs
