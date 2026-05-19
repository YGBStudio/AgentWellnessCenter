# Phase 8: Project Documentation Coverage Validation

## Automated

Run the standard project checks:

```bash
npm test -- --run
npm run lint
npm run build
```

Run a docs link check using a local script or shell command that verifies relative markdown links point to existing files:

```bash
node -e "const fs=require('fs');const path=require('path');const roots=['docs','specs/2026-05-19-project-documentation-coverage'];let bad=[];for(const root of roots){for(const file of walk(root)){const text=fs.readFileSync(file,'utf8');for(const match of text.matchAll(/\\[[^\\]]+\\]\\((?!https?:|mailto:|#)([^)]+)\\)/g)){const target=match[1].split('#')[0];if(!target) continue;const resolved=path.resolve(path.dirname(file),target);if(!fs.existsSync(resolved)) bad.push(`${file} -> ${match[1]}`);}}}if(bad.length){console.error(bad.join('\\n'));process.exit(1)}function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap((entry)=>{const full=path.join(dir,entry.name);return entry.isDirectory()?walk(full):entry.name.endsWith('.md')?[full]:[]})}"
```

## Manual

- Open `docs/README.md` and confirm it links to each major documentation section.
- Confirm `docs/cloudflare-workers-deployment.md` is still the detailed deployment runbook and is linked from the new docs.
- Compare command references with `package.json`.
- Compare Cloudflare references with `wrangler.toml`, `open-next.config.ts`, and `next.config.js`.
- Compare API, auth, validation, seed, and demo reset descriptions with the matching source files.
- Read the docs as a first-time student and confirm the order is understandable.

## Tone Check

- The docs should be clear, friendly, and demo-ready.
- The docs should explain why each workflow matters without requiring deep Next.js or Cloudflare knowledge.
- The docs should not overstate production maturity. CI/CD and monitoring should be documented as current status, not implied features.

## Definition Of Done

- Phase 8 spec files exist and match the selected comprehensive MVP scope.
- `docs/README.md` exists and links the complete documentation set.
- Focused docs pages cover setup, architecture, APIs/data, auth/security, development/testing, and operations/troubleshooting.
- Roadmap and changelog reflect Phase 8 completion.
- Link verification, tests, lint, and build pass.
