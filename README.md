# ApexTracker: Real-Time Project Intelligence & Continuity Platform

ApexTracker is an enterprise project tracking and intelligence system built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **WebSockets (Socket.IO)** to eliminate project delivery failures caused by tribal knowledge silos and unstructured handoffs.

---

## ⚠️ The Problem: Unstructured Workflows & Knowledge Fragmentation

Engineering teams routinely suffer from unstructured workflows, scattered knowledge, and difficult handovers between people and shifts.

```
Client gives requirement
        ↓
Employee receives task
        ↓
Work starts
        ↓
Questions / changes / issues
        ↓
Information stays with individual (Tribal Knowledge Trap)
        ↓
Employee changes shift / project (Context Blackout)
        ↓
Another employee has to understand everything (3-5 hr Ramp-up Penalty)
        ↓
Time lost + mistakes + delays (Delivery Slippage)
```

### In Simple Terms: The Breakdown Sequence & ApexTracker Solution

| Stage | What Happens Traditionally | How ApexTracker Solves It |
|---|---|---|
| **1. Requirement** | Client gives requirement via scattered DMs or calls. | **Centralized Requirement Anchoring**: Requirements & acceptance criteria locked to Project & Task IDs. |
| **2. Task Assignment** | Employee receives task with little or no architectural rationale. | **Context-Rich Task Assignment**: Pre-bundled with estimated hours, linked code files, and dependencies. |
| **3. Work Starts** | Engineers code without visibility into peers' changes. | **Real-Time Working Files**: Live visibility into active files and lines modified across the team. |
| **4. Questions & Changes** | Questions & client adjustments discussed in private DMs. | **Public Context Threads**: Critical decisions and clarifications pinned to public channel/task threads. |
| **5. Information Silo** | Knowledge stays inside one person's head. | **Living EOD Reports & Blocker Severity**: Mandatory end-of-day submissions with severity ratings (`MINOR` to `CRITICAL`). |
| **6. Shift / Project Handover** | Dev ends shift or leaves project; context vanishes. | **Structured Shift Handover Protocol**: Automated Pass-Down Cards with "What's Done", "Next Steps", and "Gotchas". |
| **7. New Dev Ramp-up** | Next engineer wastes 3–5 hours reverse-engineering code. | **Zero-Ramp-up Instant Handover Brief**: Incoming dev claims handover card and resumes in 90 seconds. |
| **8. Project Delays** | Sprint slippage, missed deadlines, frustration. | **Dynamic Velocity Recalibration**: Proactive deadline calculations based on actual velocity ($\frac{\text{Work Done}}{\text{Hours Spent}}$). |

---

## 🚀 Key Features

1. **Shift Continuity & Pass-Down Protocol**:
   - Outgoing engineers create structured shift briefs capturing exact code touched, client clarifications, and critical gotchas.
   - Incoming engineers claim handovers with a single click, recording timestamps and seamless continuity.
2. **Dynamic Deadline Calculation Engine (`deadlineEngine.ts`)**:
   - Recalculates projected finish dates in real time based on task completions and velocity ratios.
   - Proactively flags `ON_TRACK`, `AT_RISK`, or `DELAYED`.
3. **Emergency War Room Protocol**:
   - WebRTC audio/video conference sessions triggered company-wide when critical blockers occur.
4. **Chat & Real-Time Collaboration**:
   - Socket.IO & `BroadcastChannel` real-time synchronization, message pinning, and file tracking.

---

## 🛠️ Getting Started

Run the development server with live WebSockets:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
