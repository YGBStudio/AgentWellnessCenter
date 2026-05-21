# Operations And Troubleshooting

This guide summarizes how the current MVP is configured and how to diagnose common demo, preview, and production issues.

For detailed Workers setup and deployment steps, use [Cloudflare Workers Deployment](cloudflare-workers-deployment.md).

## Configuration Sources

| File | Purpose |
|---|---|
| `package.json` | Local, test, build, OpenNext, Wrangler, and D1 scripts. |
| `wrangler.toml` | Worker name, entry point, assets binding, compatibility settings, D1 bindings, and environment variables. |
| `open-next.config.ts` | OpenNext Cloudflare adapter defaults. |
| `next.config.js` | OpenNext development helper and `Cache-Control: no-store` headers. |
| `migrations/0001_initial.sql` | D1 schema migration. |
| `cloudflare-env.d.ts` | Generated Cloudflare environment types. |

## Environment Variables And Bindings

| Name | Local/default | Preview | Production | Notes |
|---|---|---|---|---|
| `DB` | D1 binding | D1 binding | D1 binding | Binding name used by runtime database code. |
| `JWT_SECRET` | Optional for local demos | Required secret | Required secret | Set with Wrangler secrets or Cloudflare dashboard. |
| `REQUIRE_JWT_SECRET` | `false` | `true` | `true` | Blocks fallback demo secret outside local/default use. |
| `DEMO_MODE` | `true` in Wrangler config | `true` | `false` | Enables logout and reset cleanup for demos. |
| `DATABASE_DRIVER` | `d1` | `d1` | `d1` | Documents the active runtime database path. |
| `CLOUDFLARE_ACCOUNT_ID` | Optional | Optional | Optional | Useful for Wrangler account commands. |

Do not commit real secrets. `database_id` values in `wrangler.toml` are account-specific configuration, not secrets. The public upstream branch should keep placeholder IDs; copy real D1 IDs only into a private fork, private deployment branch, or local-only branch.

## Deployment Summary

The app deploys as a Cloudflare Worker built by OpenNext:

```bash
npm run workers:build
npm run workers:preview
npm run workers:deploy
```

Use `npm run workers:preview` as the canonical local runtime. It runs a fresh `npm run workers:build` before starting the local OpenNext/Wrangler preview. Use `npm run dev` only as a secondary fast Next.js development mode.

Before remote preview or production deployment:

1. Create or select the D1 databases with `npx wrangler@latest d1 create agentclinic-local`, `agentclinic-preview`, and `agentclinic-production`.
2. Replace placeholder D1 `database_id` values in `wrangler.toml` on a private/local deployment branch, not on the public upstream branch.
3. Set `JWT_SECRET` for preview and production.
4. Run migrations where needed.
5. Run the validation commands from [Cloudflare Workers Deployment](cloudflare-workers-deployment.md).

## Logging And Error Handling

The current MVP uses route-level `console.error` logging for server failures such as booking errors, dashboard load failures, and demo reset failures. There is no external logging, alerting, or monitoring service configured yet.

Client-facing API responses return concise JSON errors:

- `400` for invalid input.
- `401` for missing or invalid auth on protected endpoints.
- `403` for insufficient permissions.
- `404` for missing records.
- `409` for booking or delete conflicts.
- `500` for unexpected server failures.

## CI/CD Status

There is no checked-in CI/CD pipeline yet. Use local commands as the current release gate:

```bash
npm test -- --run
npm run lint
npm run build
npm run workers:build
```

Future CI should run the same checks and add deployment-specific preview validation.

## Third-Party Services

| Service or package | Current role |
|---|---|
| Cloudflare Workers | Preview and production runtime target. |
| Cloudflare D1 | Preview and production database. |
| OpenNext Cloudflare | Builds the Next.js app for Workers. |
| Wrangler | D1 migrations, secrets, preview, and deployment commands. |
| Next.js | App Router, route handlers, middleware, and React integration. |
| Vitest and Testing Library | Unit and integration tests. |

## Troubleshooting

| Symptom | Likely cause | What to check |
|---|---|---|
| Login fails in preview or production | Missing `JWT_SECRET` while `REQUIRE_JWT_SECRET=true`, or wrong seeded credentials. | Set the secret with Wrangler and confirm the demo admin exists. |
| Runtime error says D1 binding `DB` is required | App is not running through the OpenNext Cloudflare path or binding is missing. | Start with `npm run workers:preview`, then check `wrangler.toml`, `next.config.js`, and the selected environment. |
| Booking page says demo care data is missing | Seed data has not initialized or reset did not run. | Visit a server page, check database initialization, or run the app through `npm run workers:preview` so the expected D1 binding is available. |
| Public booking returns `409` | Selected agent already has a non-cancelled appointment at that exact date. | Choose a different date or agent. |
| Delete returns `409` | The record is referenced by existing appointments. | Delete or update related appointments first. |
| Protected page redirects to login | No valid `agentclinic_session` cookie. | Sign in again and confirm cookies are enabled. |
| Authenticated user sees access denied | Session role is not `admin` or `staff`. | Check the user row and token payload. |
| Static assets or styles fail in Workers preview | OpenNext assets output or `ASSETS` binding is missing. | Re-run `npm run workers:preview` for a fresh build and preview, then check `wrangler.toml`. |
| API or protected data appears cached | Cache headers are missing or deployment config changed. | Check `next.config.js` no-store headers and Cloudflare cache settings. |

## Demo Reset Notes

When `DEMO_MODE=true`, authenticated logout and `/api/demo/reset` can reset the database to deterministic demo data. Production sets `DEMO_MODE=false`, so reset calls return success without changing data.

This behavior is helpful for classes and conference booths because each new participant starts from the same clinic state.
