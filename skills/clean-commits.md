# Clean Commits Skill

## Description
Ensures future commits have clean structure with commits separated by concern or scope. Commit messages must be concise and changes grouped by project area.

**Important:** This skill applies ONLY to new/future commits. Do NOT modify existing commit history.

## Trigger
User explicitly requests to prepare commits or before committing new changes.

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

### Scopes (based on project structure)
- `db` - Database schema, models, client
- `ui` - Components, layouts, styles
- `test` - Test files and configuration
- `config` - Next.js, TypeScript, build config
- `docs` - Documentation and specs
- `deps` - Dependencies

### Examples
```
feat(db): add appointments table migration
chore(config): update TypeScript strict mode settings
docs(specs): update phase 1 requirements
fix(ui): resolve header navigation overflow on mobile
test(db): add schema validation tests
```

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

3. **Keep messages concise** - Under 50 characters for the subject line
   - Good: `feat(db): add appointments table`
   - Bad: `feat: implement the appointments table with foreign keys and all the relationships`

4. **Group related changes** - If working on a feature, group all related changes
   - All files for a feature in one commit (e.g., schema + types + client)
   - Separate commits for separate concerns within the same feature

## Instructions

1. **Review current changes**
   - Run: `git status`
   - Run: `git diff --staged` and `git diff`

2. **Group changes by scope**
   - Identify which files belong to which scope (db, ui, docs, test, config)
   - Plan separate commits for each scope

3. **Stage files by group**
   - `git add <files-for-scope-1>`
   - `git commit -m "type(scope): description"`
   - Repeat for each scope

4. **Verify commit history**
   - Run: `git log --oneline -10`
   - Ensure new commits are logical and well-separated

5. **Check message quality**
   - Subjects under 50 characters
   - Use imperative mood ("add" not "added")
   - No period at end of subject line

**Note:** Do NOT rebase, amend, or modify existing commits. Only create new commits following this convention.

## Example Workflow

```bash
# Check what's changed
git status

# Group 1: Database changes
git add lib/db/
git commit -m "feat(db): add core schema and types"

# Group 2: UI components
git add components/ styles/ app/
git commit -m "feat(ui): implement layout and home page"

# Group 3: Tests
git add lib/db/*.test.ts
git commit -m "test(db): add schema validation tests"

# Group 4: Docs
git add specs/ CHANGELOG.md
git commit -m "docs: update phase 1 specifications"
```

## Notes
- This skill is manually invoked before committing new changes
- NEVER modify existing commit history (no rebase, amend, or force push)
- Only create new commits following this convention
- Never commit secrets, build artifacts, or node_modules
