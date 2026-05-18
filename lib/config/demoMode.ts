/**
 * Demo mode is intentionally server-side only.
 *
 * Set DEMO_MODE=true when running a public/classroom demo where visitors can
 * exercise CRUD flows and the app should reset itself for the next visitor.
 * Leave it unset for normal local development and production-like usage.
 */
export function isDemoModeEnabled(): boolean {
  return process.env.DEMO_MODE === 'true'
}
