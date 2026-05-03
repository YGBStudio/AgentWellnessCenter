# Clean Commits Skill

## Description
Ensures future commits have clean structure with commits separated by concern or scope. Commit messages must be concise and changes grouped by project area.

**Important:** This skill applies ONLY to new/future commits. Do NOT modify existing commit history.

## Trigger
User explicitly requests to prepare commits or before committing new changes.

## Pre-Commit Checklist
Before starting the commit process, verify:
- [ ] Run `git status` to review all changes
- [ ] Verify no sensitive, ignored, generated, or unrelated files are being committed
- [ ] Run `npm test -- --run` to ensure tests pass without watch mode
- [ ] Run the linter if configured (`npm run lint`)
- [ ] If preparing final merge/PR commits, update `CHANGELOG.md` first using the update-changelog skill
- [ ] Do not commit if tests or lint fail unless the user explicitly approves

## Commit Message Convention

Follow **Conventional Commits** with optional scope:

```
<type>(<scope>): <description>
```

### Types
- `feat` - New features or functionality
- `fix` - Bug fixes
- `docs` - Documentation changes
- `chore` - Maintenance, dependencies, config
- `refactor` - Code changes that neither fix nor add features
- `test` - Adding or updating tests
- `style` - Formatting, missing semicolons, etc. (no code change)
- `perf` - Performance improvements

### Scopes (based on AgentClinic project structure)
- `db` - Database schema, models, client, migrations (`lib/db/*`)
- `ui` - Components, layouts, styles (`components/*`, `styles/*`, `app/*`)
- `test` - Test files and configuration (`*.test.ts`, `vitest.config.ts`)
- `config` - Next.js, TypeScript, build config, scripts, tooling settings
- `docs` - Documentation and specs (`specs/*`, `CHANGELOG.md`)
- `skills` - Agent skills (`skills/*`, `.opencode/skills/*`)
- `deps` - Dependency version or lockfile changes

Use `deps` when dependencies or lockfiles change. Use `config` when package scripts, framework settings, TypeScript, ESLint, or other tooling configuration changes.

### Examples
```
feat(db): add appointments table migration
chore(config): update TypeScript strict mode settings
docs(specs): update phase 1 requirements
fix(ui): resolve header navigation overflow on mobile
test(db): add schema validation tests
chore(deps): upgrade vitest to v3
```

## Commit Message Validation
Before committing, verify:
- Subject line ≤ 50 characters
- Use imperative mood ("add" not "added" or "adds")
- No period at end of subject line
- Scope is relevant to changed files
- Prefer one scope per commit
- If a change truly spans scopes and cannot be separated cleanly, use the primary scope or omit the scope

## Commit Grouping Guidelines

1. **Separate by concern** - Each commit should address one logical change
   - Database changes separate from UI changes
   - Component changes separate from styling changes
   - Test additions separate from feature code

2. **Use scope to indicate area** - Make it clear which part of the project is affected
   - `(db)` for database-related changes
   - `(ui)` for component and style changes
   - `(docs)` for documentation updates
   - `(test)` for test files
   - `(skills)` for agent skills

3. **Keep messages concise** - Under 50 characters for the subject line
   - Good: `feat(db): add appointments table`
   - Bad: `feat: implement the appointments table with foreign keys and all the relationships`

4. **Group related changes** - If working on a feature, group all related changes
   - All files for a feature in one commit (e.g., schema + types + client)
   - Separate commits for separate concerns within the same feature

5. **Protect unrelated work**
   - Do not stage unrelated user changes
   - If existing unstaged changes are unrelated to the requested commit, leave them alone
   - If a file contains both relevant and unrelated changes, use `git diff` carefully and ask before partial staging unless the intended split is obvious

6. **Check .gitignore before staging**
   - Run: `git status --short`
   - For untracked files: verify they should be tracked (not in .gitignore)
   - Common files to gitignore include local notes, secrets, generated databases, build output, dependency folders, and machine-specific files
   - If committing a file that should be gitignored, add it to .gitignore instead

## Instructions

1. **Review current changes**
   - Run: `git status --short`
   - Run: `git diff --staged` and `git diff`
   - Verify no sensitive, ignored, generated, or unrelated files are included

2. **Dry run (optional)**
   - Preview what would be committed: `git add --dry-run <files>`
   - Show staged changes: `git diff --staged --stat`

3. **Group changes by scope**
   - Identify which files belong to which scope (db, ui, docs, test, config, skills, deps)
   - Plan separate commits for each scope
   - Keep related files together (e.g., schema + types for db changes)

4. **Stage files by group**
   - `git add <files-for-scope-1>`
   - Verify: `git diff --staged --stat`
   - If needed, inspect the staged patch: `git diff --staged`
   - `git commit -m "type(scope): description"`
   - Repeat for each scope

5. **Handle failed checks**
   - If tests or lint fail, stop before committing
   - Report the failing command and the relevant error summary
   - Only commit after fixing the issue or receiving explicit user approval

6. **Verify commit**
   - Run: `git log --oneline -5`
   - Ensure new commits are logical and well-separated
   - Verify message length and format

**Note:** Do NOT rebase, amend, or modify existing commits. Only create new commits following this convention.

## Example Workflow

```bash
# Step 0: Pre-commit checks
git status
npm test -- --run
npm run lint

# Step 1: Check what's changed
git status --short

# Step 2: Group 1 - Database changes
git add lib/db/schema.ts lib/db/types.ts
git diff --staged --stat  # Verify
git commit -m "feat(db): add core schema and types"

# Step 3: Group 2 - UI components
git add components/ styles/ app/
git diff --staged --stat  # Verify
git commit -m "feat(ui): implement layout and home page"

# Step 4: Group 3 - Tests
git add lib/db/*.test.ts vitest.config.ts
git diff --staged --stat  # Verify
git commit -m "test(db): add schema validation tests"

# Step 5: Group 4 - Docs
git add specs/ CHANGELOG.md
git diff --staged --stat  # Verify
git commit -m "docs: update phase 1 specifications"

# Step 6: Verify all commits
git log --oneline -10
```

## Notes
- This skill is manually invoked before committing new changes
- NEVER modify existing commit history (no rebase, amend, or force push)
- Only create new commits following this convention
- Never commit secrets, build artifacts, or node_modules
- Update CHANGELOG.md using the update-changelog skill before merging
