# Tech Stack

- **Language:** TypeScript
- **Framework:** Next.js (Ideal for combining a reliable TypeScript server-side architecture with a modern, fast React frontend for Steve's marketing needs)
- **Cloudflare Adapter:** OpenNext on Cloudflare via `@opennextjs/cloudflare`.
- **Database:** Cloudflare D1 for preview and production deployments, with SQLite retained for local unit tests and portable data experiments.
- **Styling:** PicoCSS (Lightweight, classless CSS framework perfect for rapid responsive design and demo-friendly UIs)
- **Deployment Target:** Cloudflare Workers for preview and production deployments. Cloudflare Pages is reserved for a future static-export-only path if the app is intentionally converted to static output.

## Testing

- **Vitest** - Unit and integration testing framework
  - Fast, Vite-native test runner compatible with Jest's API
  - Used for validating application logic and components
  - Run tests: `npm test` or `npm run test`
  - Run tests with UI: `npm run test:ui`
  - Run tests with coverage: `npm run test:coverage`
