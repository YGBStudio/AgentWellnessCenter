# Update Changelog Skill

## Description
Maintains a CHANGELOG.md in the project root with headings for dates. Examines git commits and adds bullet points for each date.

## Trigger
User explicitly requests to update the changelog or before merging branches.

## Instructions

1. **Check if CHANGELOG.md exists**
   - If not, create it with a title: `# Changelog`

2. **Get git commit history**
   - Run: `git log --format="%ad %s" --date=short --reverse`
   - This provides commits in chronological order with date and subject

3. **Parse commits by date**
   - Group commits by date (YYYY-MM-DD format)
   - For each date, create a heading: `## YYYY-MM-DD`
   - Add each commit message as a bullet point under the appropriate date

4. **Handle existing CHANGELOG.md**
   - Read the existing file
   - Only add dates/commits that aren't already documented
   - Avoid duplicating entries

5. **Format each entry**
   - Use bullet points (`- `) for each commit
   - Preserve commit message formatting
   - Keep entries in chronological order (oldest first)

6. **Write/update CHANGELOG.md**
   - Place in project root: `/home/ygabriel/GitHub/my-agentclinic/CHANGELOG.md`
   - Ensure proper markdown formatting

## Example CHANGELOG.md format

```markdown
# Changelog

## 2026-05-03
- Initialize Next.js project with TypeScript and SQLite
- Define DB models with migrations
- Create minimal Agent Wellness Center home page
- Create main layout component with header/main/footer subcomponents

## 2026-05-04
- Add Vitest testing framework
- Update specs for responsive design
- Create responsive CSS layout
```

## Notes
- This skill is manually invoked before merging
- Only documents commits that are already in the git history
- Users should run this skill before creating pull requests or merging branches
