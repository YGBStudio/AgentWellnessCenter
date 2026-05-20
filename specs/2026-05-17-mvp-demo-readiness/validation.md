# Validation Criteria for Phase 6: MVP Demo Readiness & Spec-Driven Closure

## Success Metrics
The implementation will be considered successful when all of the following criteria are met:

### Public Navigation
- [ ] Unauthenticated visitors see Home, Booking, and Login in the global NavBar.
- [ ] Unauthenticated visitors do not see Agents, Appointments, Ailments, or Therapies in the global NavBar.
- [ ] Login remains visible and reachable from the public NavBar.
- [ ] Booking remains visible and reachable from the public NavBar.
- [ ] Active public links still expose `aria-current="page"`.
- [ ] Mobile NavBar menu keeps accurate `aria-expanded` and closes on Escape.
- [ ] Authenticated users still see Dashboard, user context, and Logout.

### Protected Admin Experience
- [ ] Direct unauthenticated visits to `/dashboard`, `/agents`, `/appointments`, `/ailments`, and `/therapies` redirect to login.
- [ ] Authenticated admin/staff users can reach dashboard and protected resource pages.
- [ ] Protected pages render in the admin shell using the existing admin layout/sidebar.
- [ ] Admin sidebar links include Dashboard, Agents, Appointments, Ailments, and Therapies.
- [ ] Admin sidebar active states match the current protected route.
- [ ] Global NavBar and admin sidebar do not create confusing duplicate protected navigation.

### Demo Data
- [ ] Default admin user still seeds with `admin@agentclinic.demo` / `admin`.
- [ ] Fresh local database startup creates representative demo agents, ailments, therapies, and appointments.
- [ ] Seed logic is idempotent across repeated startup or test runs.
- [ ] Seed logic does not delete or overwrite user-created records.
- [ ] Dashboard metrics are meaningful on a fresh seeded database.
- [ ] Booking dropdowns are populated on a fresh seeded database.

### Demo Mode Reset
- [ ] Demo cleanup is disabled by default when `DEMO_MODE` is unset.
- [ ] `DEMO_MODE=true` enables demo-only reset behavior.
- [ ] Demo reset endpoints require an authenticated admin/staff session.
- [ ] Logout resets and reseeds the database when demo mode is enabled.
- [ ] Normal authenticated navigation does not reset demo data.
- [ ] Reset data includes the default admin credentials after cleanup.
- [ ] Reset data includes deterministic agents, ailments, therapies, and appointments after cleanup.

### Auth And API Consistency
- [ ] Protected POST/PUT/DELETE endpoints return 401 when unauthenticated.
- [ ] Protected POST/PUT/DELETE endpoints return 403 for authenticated users without required permission.
- [ ] Public GET endpoints remain publicly accessible where specified.
- [ ] Public booking endpoint remains unauthenticated.
- [ ] Error responses are clear enough for frontend display.
- [ ] Existing appointment conflict checks still prevent double-booking an agent at the same time.

### Booking And CRUD Guardrails
- [ ] Booking form handles missing agents, ailments, or therapies with a helpful empty state.
- [ ] Booking success redirects to confirmation with correct appointment details.
- [ ] Booking validation failures render accessible error messages.
- [ ] Booking and admin appointment validation reject times before the current time.
- [ ] CRUD pages show clear loading and empty states.
- [ ] CRUD delete blockers for related appointments are visible to users.
- [ ] Admin create/edit/delete flows continue to update visible lists.

### Documentation
- [ ] README or equivalent docs include setup instructions.
- [ ] Docs include demo credentials.
- [ ] Docs include a short demo walkthrough for public booking and authenticated admin management.
- [ ] Docs include validation commands.
- [ ] Roadmap shows Phase 5 as implemented and Phase 6 as the MVP completion phase.
- [ ] Specs remain aligned with `specs/mission.md` and `specs/tech-stack.md`.

### Automated Checks
- [ ] Header tests cover unauthenticated public navigation and absence of protected resource links.
- [ ] Header tests cover authenticated dashboard/logout state.
- [ ] Auth tests cover representative 401 and 403 outcomes.
- [ ] Seed tests cover required demo records and idempotency.
- [ ] Demo reset tests cover disabled-by-default behavior, authenticated access, reseeding, and preserved credentials.
- [ ] Booking tests cover successful booking, past-time rejection, and conflict handling where practical.
- [ ] `npm test -- --run` passes.
- [ ] `npm run lint` passes.

## Manual Review Checklist
- [ ] Public desktop: Home, Booking, and Login are the only unauthenticated NavBar links.
- [ ] Public mobile: menu contains only public visitor links and works with keyboard.
- [ ] Public booking: create an appointment from seeded data.
- [ ] Auth redirect: visit `/agents` while logged out and confirm redirect to `/login?from=/agents`.
- [ ] Login: sign in with `admin@agentclinic.demo` / `admin`.
- [ ] Admin: navigate dashboard and all protected resource pages from authenticated admin navigation.
- [ ] CRUD: create, edit, and delete a record that is safe to delete.
- [ ] Logout: confirm protected pages require login again.
- [ ] Demo mode: with `DEMO_MODE=true`, confirm logout leaves fresh seeded data for the next login.
- [ ] Demo mode: with `DEMO_MODE=true`, confirm booking before login remains visible after login.
- [ ] Responsive: check 320px, 768px, and 1024px+ widths for no overlapping controls.

## Definition Of Done
Phase 6 is ready to merge when:

1. All in-scope validation criteria are satisfied.
2. The public NavBar no longer advertises protected resource links to unauthenticated visitors.
3. Protected pages remain reachable through authenticated admin navigation.
4. Fresh demo setup works without manual database preparation.
5. MVP docs support both conference demo use and spec-driven teaching.
6. Opt-in demo mode can reset session clutter without affecting default app behavior.
7. `npm test -- --run` and `npm run lint` pass.
