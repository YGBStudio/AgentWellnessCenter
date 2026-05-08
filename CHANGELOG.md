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
