# Project State — ApexTracker

> Last Updated: 2026-10-20
> Active Milestone: v1.0.0
> Active Phase: 05 (Production Hardening & CI/CD)
> Current Status: GREEN

---

## Current Position

- **Active Phase**: Phase 05 — Production Hardening & CI/CD Pipeline
- **Completed Phases**: Phases 01, 02, 03, 04
- **Active Plans**: None currently executing (Ready for wave execution)
- **Blocked**: No active blockers

---

## Accumulated Decisions & Architecture Constraints

1. **Next.js 16 App Router**: Must use React 19 concurrent features and client-side component boundaries carefully.
2. **WebSockets Dual Strategy**: Use Socket.io on port 3000 alongside browser `BroadcastChannel` to guarantee zero-latency cross-tab sync even if WebSockets reconnect.
3. **Strict Type Safety**: All data structures must comply with TypeScript definitions in `src/types/index.ts`.
4. **CRM Requirement Anchoring**: Any client requirement must link directly to a Project and target Sprint before status can transition to `APPROVED` or `IN_SPRINT`.
5. **No Blind Completion**: Work must be empirically validated using `npx tsc --noEmit` and browser verification.

---

## Blockers & Concerns

- None. Server is running healthy on `http://localhost:3000` with WebSocket support.
