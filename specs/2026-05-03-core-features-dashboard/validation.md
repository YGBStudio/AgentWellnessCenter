# Phase 2: Core Features & Dashboard - Validation

## Automated Testing

### Unit and Integration Tests
- Run `npm test` or `npm run test` to execute Vitest test suite
- All tests must pass with no failures
- Test coverage should include:
  - Database CRUD operations for all entities (agents, ailments, therapies, appointments)
  - FK dependency checks and constraint validation
  - UI component rendering and interactions
  - Zod request validation schemas

### Test Coverage
- Run `npm run test:coverage` to verify adequate test coverage
- Critical paths (scheduling, dashboard data display) must be covered

## Manual QA

### Dashboard Verification
- [ ] Dashboard loads successfully
- [ ] Key metrics and information display correctly
- [ ] Navigation between sections works properly

### Scheduling UI Verification
- [ ] Scheduling interface displays correctly
- [ ] Can create new appointments
- [ ] Can view existing appointments
- [ ] Can modify appointments
- [ ] Can cancel/delete appointments
- [ ] Form validation works appropriately

### Responsive Design Verification

#### Mobile (320px - 767px)
- [ ] PicoCSS responsive classes work on small screens
- [ ] Navigation is usable on touch devices
- [ ] Dashboard is readable and functional
- [ ] Scheduling UI is usable on mobile

#### Tablet (768px - 1023px)
- [ ] PicoCSS responsive classes utilize medium screen real estate
- [ ] Dashboard displays properly
- [ ] Scheduling UI works on tablet

#### Desktop (1024px+)
- [ ] PicoCSS responsive classes take advantage of large screen space
- [ ] Dashboard shows all information clearly
- [ ] Scheduling UI provides full functionality

### Demo Scenario Validation
- [ ] Can perform a complete flow: view dashboard → schedule appointment → verify appointment appears
- [ ] Flow works smoothly for conference booth demos
- [ ] No console errors or broken functionality

## Merge Criteria

Phase 2 can be merged when:
1. All Vitest tests pass (`npm test`)
2. Manual QA checklist is complete across all device sizes
3. Demo scenario validates successfully
4. Code follows TypeScript best practices
5. UI meets responsive design core value
