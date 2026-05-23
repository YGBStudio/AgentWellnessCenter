---
name: documentation-coverage
description: Use when creating or refreshing source-backed project documentation sets. Audits the repository and existing docs, accepts explicit project inputs such as name, purpose, audience, key features, doc scope, and validation commands, then produces a docs index plus focused markdown guides, optional spec artifacts, changelog/roadmap updates, and validation results.
metadata:
  short-description: Generate source-backed project documentation
  version: "1.0"
  default-output: "docs/README.md plus focused topic guides"
---

# Documentation Coverage

## Purpose

Create high-quality project documentation that is accurate to the current repository, easy to navigate, and useful for the intended reader. The skill works for full-project documentation, feature documentation, operational runbooks, onboarding docs, and documentation refreshes after major implementation phases.

## Parameters

Accept these inputs from the user when provided. If an input is missing and can be discovered from the repo, infer it from source files. Ask only when the missing value materially changes the docs.

| Parameter | Required | Meaning | Discovery/default |
|---|---:|---|---|
| `project_name` | Yes | Product or repository name used in headings and examples. | Infer from `package.json`, README, specs, or app copy. |
| `purpose` | Yes | What the project does and why it exists. | Infer from mission/spec docs, README, package description, or landing page copy. |
| `audience` | Yes | Primary readers: students, demo presenters, maintainers, operators, customers, or mixed. | Ask if unclear. |
| `doc_scope` | Yes | Topics to cover: setup, architecture, APIs, auth, data, testing, deployment, operations, troubleshooting, feature usage, etc. | Default to comprehensive MVP docs for broad requests. |
| `key_features` | No | Product capabilities and workflows to highlight. | Infer from routes, components, services, schemas, and specs. |
| `existing_docs` | No | Docs to preserve, revise, or link. | Inspect `docs/`, root README files, specs, and runbooks. |
| `output_root` | No | Where docs should be written. | Default to `docs/`. |
| `output_structure` | No | Docs index plus focused pages, single manual, or feature-local docs. | Default to index plus focused pages. |
| `tone` | No | Voice and depth: teaching-friendly, concise maintainer docs, operator runbook, formal product docs. | Match `audience`; default to clear, practical, and source-backed. |
| `source_paths` | No | Files/directories that must be audited. | Infer from app, lib, config, tests, migrations, deployment files. |
| `spec_policy` | No | Whether to create requirements/plan/validation specs. | Create dated specs for roadmap phases or substantial initiatives. |
| `branch_name` | No | Branch to create/use. | Derive from roadmap phase or documentation topic when requested. |
| `validation_commands` | No | Commands to run after writing docs. | Infer from package scripts; always include a markdown link check. |
| `record_updates` | No | Whether to update roadmap, changelog, release notes, or README links. | Update when docs complete a phase or visible documentation milestone. |

## Usage Examples

Full project documentation:

```text
Use documentation-coverage to document Agent Wellness Center.
Project name: Agent Wellness Center.
Purpose: demo app for scheduling care for AI agents.
Audience: course students and conference demo presenters.
Scope: setup, architecture, APIs, auth, data, testing, deployment, operations, troubleshooting.
Output: docs index plus focused pages.
```

Documentation refresh after a deployment change:

```text
Use documentation-coverage to refresh deployment and operations docs.
Audience: maintainers and production operators.
Scope: config, secrets, deployment commands, runtime architecture, troubleshooting.
Existing docs: preserve docs/cloudflare-workers-deployment.md and link it from the docs index.
```

Feature-local docs:

```text
Use documentation-coverage for the new billing feature.
Audience: maintainers.
Scope: data model, API routes, UI workflow, operational notes, tests.
Output: feature docs under docs/billing.md and a dated spec directory.
```

## Workflow

### 1. Capture inputs and infer defaults

Read the user request and record supplied parameters. Then inspect the repo before asking questions:

- `git status --short --branch`
- Existing docs under `docs/` and root README files
- Roadmap, mission, product, or spec files
- Package manifests and scripts
- App/routes/pages, service modules, schemas, auth, data, config, migrations, tests, deployment files

Ask only for intent that cannot be discovered, usually `audience`, scope boundaries, or output structure.

### 2. Create a source map

Build a short internal map from docs topics to source-of-truth files:

| Docs topic | Typical source files |
|---|---|
| Setup and commands | package manifests, lockfiles, tool configs |
| Architecture | app entrypoints, routing, services, adapters, middleware |
| APIs | route handlers, controllers, validation schemas, API tests |
| Data | schemas, migrations, seed files, repositories, query services |
| Auth and security | middleware, auth utilities, session/cookie code, protected route tests |
| UI workflows | pages, components, forms, state providers, screenshots if present |
| Deployment | deployment configs, platform docs, env examples, runbooks |
| Testing | test config, test files, scripts, CI config if present |
| Operations | env/secrets, logging, error handling, monitoring, troubleshooting notes |

Every important claim in the docs should trace back to this source map or to explicit user input.

### 3. Plan the docs set

Prefer an index plus focused pages for project-wide docs:

| File | Purpose |
|---|---|
| `docs/README.md` | Start-here index, project summary, topic links, project map, common commands. |
| `docs/getting-started.md` | Prerequisites, install, local run, credentials, first walkthrough, scripts. |
| `docs/architecture.md` | System shape, route/app structure, data flow, runtime boundaries, diagrams. |
| `docs/api-and-data.md` | Entities, validation, API behavior, persistence, seed/demo data. |
| `docs/auth-and-security.md` | Login/logout, sessions, roles, protected surfaces, secrets. |
| `docs/development-and-testing.md` | Coding conventions, test strategy, validation commands, contribution flow. |
| `docs/operations-and-troubleshooting.md` | Config, env/secrets, deployment links, logging, CI/CD status, common failures. |
| Existing runbooks | Preserve and link detailed docs instead of duplicating them. |

Adapt names and topics to the project. For a library, use API reference and integration guides. For a CLI, use commands and examples. For a service, include operations and runbooks. For a frontend app, include user workflows and state/data flow.

### 4. README/index creation rules

The docs index is the navigation surface, not a dumping ground. It should include:

- One-sentence project identity and purpose.
- A "Start Here" section with links to major docs and one-line descriptions.
- A compact project map linking areas of the codebase to docs topics.
- Common commands or workflows, verified against the repo.
- Pointers to detailed runbooks, not copied runbook content.

Keep the index skimmable. Move depth into focused pages.

### 5. Write source-backed pages

For each page:

- Start with what the reader can do or understand after reading.
- Use tables for commands, routes, entities, config, and troubleshooting.
- Include concise examples from current project scripts, paths, routes, and config.
- Use markdown-compatible diagrams when they clarify architecture or flow. Mermaid is acceptable when useful.
- State absence plainly: "There is no checked-in CI/CD pipeline yet" is better than implying one exists.
- Preserve existing detailed docs and link them from related pages.

Tone guidelines:

- For students/demo presenters: practical, friendly, walkthrough-oriented.
- For maintainers: concise, implementation-oriented, precise about boundaries.
- For operators: runbook-style, explicit about env, secrets, validation, rollback, and troubleshooting.

### 6. Optional spec artifacts

For roadmap phases or substantial documentation initiatives, create:

```text
specs/YYYY-MM-DD-<kebab-topic>/
+-- requirements.md
+-- plan.md
+-- validation.md
```

Use:

- `requirements.md`: scope, decisions, context, audience, what is out of scope.
- `plan.md`: audit, structure, writing, records, validation task groups.
- `validation.md`: automated commands, link check, manual source checks, tone check, definition of done.

Skip spec artifacts for small doc fixes unless the user asks for them.

### 7. Agent orchestration pattern

When the task is broad and delegation is available and authorized:

- Keep coordination local: own the doc structure, final voice, source-of-truth decisions, and validation.
- Delegate independent source audits by domain, such as API/data, auth/security, deployment/ops, and tests.
- Give each agent a narrow read-only question or a disjoint write scope.
- Do not duplicate work between agents.
- Integrate findings into one consistent docs set.
- Review final docs yourself for links, tone, accuracy, and contradictions.

If delegation is not available or not authorized, do the same phases sequentially.

### 8. Update project records

When the docs work completes a visible milestone:

- Update roadmap/status docs with the new documentation location.
- Update changelog or release notes with concise documentation entries.
- Add root README links only if the project uses a root README as a public entry point.

Do not update project records for tiny wording edits unless the repo convention requires it.

### 9. Validate

Always run a relative markdown link check for changed docs. A portable Node command is acceptable:

```bash
node -e 'const fs=require("fs");const path=require("path");const roots=["docs"];let bad=[];for(const root of roots){if(!fs.existsSync(root)) continue;for(const file of walk(root)){const text=fs.readFileSync(file,"utf8");for(const match of text.matchAll(/\[[^\]]+\]\((?!https?:|mailto:|#)([^)]+)\)/g)){const target=match[1].split("#")[0];if(!target) continue;const resolved=path.resolve(path.dirname(file),target);if(!fs.existsSync(resolved)) bad.push(file+" -> "+match[1]);}}}if(bad.length){console.error(bad.join("\n"));process.exit(1)}console.log("All relative markdown links resolve.");function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap((entry)=>{const full=path.join(dir,entry.name);return entry.isDirectory()?walk(full):entry.name.endsWith(".md")?[full]:[]})}'
```

Then run validation commands appropriate for the repo and scope:

- Documentation-only, no behavior changes: link check plus formatting/lint checks if available.
- App or API docs tied to implementation claims: project tests and lint.
- Deployment docs: deployment build or preview command when feasible.
- Generated docs: verify generated output is intended to be tracked.

For this project, the default full validation is:

```bash
npm test -- --run
npm run lint
npm run build
```

## Output Quality Checklist

- Inputs or inferred defaults are clear.
- Every page has a distinct job.
- `docs/README.md` is a useful start page, not an oversized manual.
- Existing docs are preserved and linked.
- Commands, routes, config, credentials, and workflows match source truth.
- Missing capabilities are described honestly.
- Links resolve.
- Tone matches the target audience.
- No runtime behavior, schemas, dependencies, or unrelated files changed unless requested.
