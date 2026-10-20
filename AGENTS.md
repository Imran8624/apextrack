<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ApexTracker — GSD & Ralpha Loop Configuration

## 1. GSD Methodology (Get Stuff Done)
- **Canonical Rules**: Refer to [`PROJECT_RULES.md`](file:///c:/Users/imank/update/PROJECT_RULES.md).
- **Core Loop**: `SPEC ➔ PLAN ➔ EXECUTE ➔ VERIFY ➔ COMMIT`
- **Active State File**: [`.gsd/STATE.md`](file:///c:/Users/imank/update/.gsd/STATE.md)
- **Roadmap**: [`.gsd/ROADMAP.md`](file:///c:/Users/imank/update/.gsd/ROADMAP.md)
- **Specification**: [`.gsd/SPEC.md`](file:///c:/Users/imank/update/.gsd/SPEC.md)

## 2. Ralpha Loop (Autonomous Agent Loop)
- **Workflow**: Available via `/ralpha-loop` and `/ralph-loop` in [`.agent/workflows/ralpha-loop.md`](file:///c:/Users/imank/update/.agent/workflows/ralpha-loop.md).
- **Runner**: Execute [`scripts/ralpha-loop.ps1`](file:///c:/Users/imank/update/scripts/ralpha-loop.ps1) for continuous task verification and self-healing.
- **Empirical Proof Requirement**: No task is marked complete without evidence (`npx tsc --noEmit` and live HTTP response).

## 3. Active Plugin & Extension Integrations
- **Web Guidance**: `modern-web-guidance-plugin` (App Router, Tailwind v4, React 19).
- **DevTools**: `chrome-devtools-plugin` for automated browser DOM & UI verification.
- **Agent Orchestration**: `google-antigravity-sdk` subagent delegation protocols.
- **Config**: Defined in [`.agents/plugins.json`](file:///c:/Users/imank/update/.agents/plugins.json) and [`.vscode/extensions.json`](file:///c:/Users/imank/update/.vscode/extensions.json).
