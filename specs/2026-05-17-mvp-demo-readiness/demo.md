# MVP Demo Guide

## Setup

```bash
npm install
npm run dev
```

The app uses SQLite through `better-sqlite3`. Local startup creates `data/agentclinic.db`, initializes the schema, and seeds deterministic demo agents, ailments, therapies, and appointments without overwriting existing records.

To reset demo clutter automatically between demo sessions, start the app with:

```bash
DEMO_MODE=true npm run dev
```

When demo mode is enabled, authenticated logout resets and reseeds the database. Authenticated browser/tab exit also attempts cleanup, but that path is best-effort because browsers limit unload work.

## Demo Credentials

- Email: `admin@agentclinic.demo`
- Password: `admin`

## Walkthrough

1. Visit `/` and open `/booking` from the public navigation.
2. Book an appointment using the seeded demo data.
3. Confirm the appointment on `/booking/confirmation`.
4. Log in with the demo credentials.
5. Use the admin sidebar to review Dashboard, Agents, Appointments, Ailments, and Therapies.
6. Create or edit a safe demo record.
7. Try deleting a seeded record that has appointments to show the user-facing blocker.
8. Log out and visit `/agents` to confirm protected routes redirect to `/login?from=/agents`.

## Validation Commands

```bash
npm test -- --run
npm run lint
```

## Notes For Teaching

- The public NavBar intentionally shows only Home, Booking, and Login.
- Protected resource links live in the authenticated admin shell.
- Demo seed data is deterministic and idempotent so students can reset or rerun the app without manual database preparation.
- `DEMO_MODE=true` is opt-in and should be used for demos where visitors can try CRUD flows without leaving clutter for the next visitor.
- Payments, notifications, external calendars, public registration, and staff user management remain out of scope for this MVP.
