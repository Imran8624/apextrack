# ApexTracker — Project Specification

> Status: FINALIZED
> Version: 1.0.0
> Date: 2026-10-20
> Owner: Engineering Operations

---

## 1. Executive Summary

ApexTracker is an enterprise-grade real-time project intelligence and workflow continuity platform. It eliminates delivery slippages caused by tribal knowledge silos, undocumented shift handovers, and static deadline predictions.

---

## 2. Core Functional Pillars

### 2.1 Dynamic Velocity & Deadline Engine
- Recalculates projected finish dates in real time based on team velocity:
  $$\text{Velocity} = \frac{\text{Completed Estimated Hours}}{\text{Logged Hours Spent}}$$
- Proactively flags project health: `ON_TRACK`, `AT_RISK`, or `DELAYED`.
- Skips non-working days (weekends) and factors individual capacity.
- Manager override capability with mandatory audit logging.

### 2.2 Zero-Ramp-up Shift Handover Protocol
- Outgoing engineer structured pass-down cards ("What was done", "Client Changes", "Immediate Next Steps", "Gotchas").
- Single-click handover claim (`PENDING_PICKUP` ➔ `ACCEPTED`).
- Live tracking of active working files and line-level diffs.

### 2.3 Emergency War Room Protocol
- WebRTC-style emergency audio/video grid with screen share.
- Automatically or manually triggered on `CRITICAL` blockers and client SLA incidents.
- Live meeting minutes and action items synchronization.

### 2.4 Learning & Certification Engine (LCE)
- Task prerequisite gates requiring verified course completion.
- Interactive timed multiple-choice assessments.
- Cryptographically verifiable digital certificates (`CERT-APEX-XXXXX`).
- HR remedial reminder dispatches.

### 2.5 Centralized Client Relationship Management (CRM) Hub
- Enterprise client accounts with ARR contract values, tiers, and health scores.
- Centralized Requirement Anchoring: Client scope changes locked to Project & Task IDs.
- Client SLA incident ticket queue with countdown timers and direct War Room escalation.
- Stakeholder and executive contacts directory.

---

## 3. Technology Stack Requirements

- **Runtime**: Node.js 20+
- **Framework**: Next.js 16.3.0 (App Router)
- **UI & Reactivity**: React 19.2.8, Tailwind CSS v4, Lucide React
- **Real-Time Communication**: Socket.IO 4.8.3 + BroadcastChannel fallback
- **Visualizations**: Recharts 3.10.1
- **Database & ORM**: PostgreSQL with Prisma ORM 7.9.1
