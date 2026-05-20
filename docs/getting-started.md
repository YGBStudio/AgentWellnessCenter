# Getting Started

This guide gets Agent Wellness Center running locally and gives you the core commands for a class, workshop, or conference demo.

## Prerequisites

- Node.js compatible with the project dependencies.
- npm, using the checked-in `package-lock.json`.
- A terminal in the project root.
- The Wrangler CLI comes from project dependencies. Cloudflare account access is only needed when creating remote D1 databases, setting secrets, or deploying.

## Install

```bash
npm ci
```

`npm ci` installs the exact dependency set from `package-lock.json`. Use it for repeatable demos and fresh student machines.

## Run Locally

```bash
npm run workers:preview
```

This is the canonical local runtime for the project. The script runs `npm run workers:build` first, then starts the OpenNext Cloudflare preview with the Worker entry point, static assets, D1 binding, and local variables from `wrangler.toml`.

Open the URL printed by the preview command.

## Fast Next.js Development

```bash
npm run dev
```

Use this only for fast iteration on pages, styles, and route logic. It starts the Next.js development server; `next.config.js` initializes the OpenNext Cloudflare development helper so server code can read Cloudflare-style bindings when they are available. Confirm Cloudflare-specific behavior with `npm run workers:preview`.

## Demo Credentials

The app seeds a deterministic admin user on first database initialization:

| Field | Value |
|---|---|
| Email | `admin@agentclinic.demo` |
| Password | `admin` |
| Role | `admin` |

These credentials are for classroom and demo use. Preview and production deployments must set a real `JWT_SECRET`; see [Auth And Security](auth-and-security.md) and [Cloudflare Workers Deployment](cloudflare-workers-deployment.md).

## First Walkthrough

1. Visit `/` and review the public home page.
2. Visit `/booking` and create a public appointment using seeded agents, ailments, and therapies.
3. Visit `/login` and sign in with the demo admin credentials.
4. Open `/dashboard` and review clinic counts.
5. Use the admin navigation to manage agents, ailments, therapies, and appointments.
6. Log out. If demo mode is enabled, logout triggers a demo data reset for the next visitor.

## Core Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the fast Next.js development server; secondary to Workers preview. |
| `npm test -- --run` | Run the Vitest suite once. |
| `npm run test` | Run Vitest in watch mode. |
| `npm run test:ui` | Run the Vitest UI. |
| `npm run test:coverage` | Run tests with coverage reporting. |
| `npm run lint` | Run ESLint. |
| `npm run build` | Build the Next.js app. |
| `npm run workers:build` | Build the OpenNext Cloudflare Worker output without starting preview. |
| `npm run workers:preview` | Build fresh OpenNext Worker output and run the local Workers preview. |
| `npm run workers:deploy` | Build and deploy the production Worker. |
| `npm run d1:migrate:local` | Apply D1 migrations to the local D1 database. |
| `npm run d1:migrate:preview` | Apply D1 migrations to the preview D1 database. |
| `npm run d1:migrate:production` | Apply D1 migrations to the production D1 database. |
| `npm run cf:typegen` | Generate Cloudflare environment types. |

## Common Workflows

For a quick student exercise:

```bash
npm ci
npm run workers:preview
```

After stopping the preview, make a small change and run:

```bash
npm test -- --run
npm run lint
```

For deployment preparation:

```bash
npm test -- --run
npm run lint
npm run build
npm run workers:build
```

Use [Cloudflare Workers Deployment](cloudflare-workers-deployment.md) before running remote preview or production deployments.

## Where To Go Next

- To explain how the app fits together, read [Architecture](architecture.md).
- To work with route handlers and database behavior, read [API And Data](api-and-data.md).
- To understand protected pages and write APIs, read [Auth And Security](auth-and-security.md).
