# ADHD Executive Function System — Requirements

**Version:** 1.0
**Author:** CTO
**Status:** Draft — Pending CEO Sign-off
**Issue:** [FOU-18](/FOU/issues/FOU-18)

---

## Overview

A personal productivity system built for a founder with ADHD. The goal is to reduce executive function load at every decision point: what to do now, when to do it, and how to close the day with clarity. The system must be frictionless — any friction means it will not be used.

**Stack:** Next.js (Vercel) · Notion (data layer) · n8n (automation) · OpenRouter/Claude Sonnet (chat assistant)

---

## User Stories

### US-01: Daily Briefing

> As a founder with ADHD, I want to start my day with a single-screen briefing so I know exactly what matters today without having to hunt for information.

**Acceptance criteria:**
- Briefing is auto-generated and available by 08:00 each morning
- Shows: top 3 priorities, scheduled calendar blocks, any overdue tasks, one motivational/contextual prompt
- Single screen, no scrolling on mobile
- Delivered to dashboard and optionally via notification

---

### US-02: Task Capture

> As a founder with ADHD, I want to capture tasks, ideas, and actions in under 5 seconds so I never lose a thought or interrupt my flow.

**Acceptance criteria:**
- Single input field accessible from every page in the dashboard
- Voice-to-text option on mobile
- Captured items land in a Notion inbox (no categorisation required at capture time)
- Confirmation within 1 second of submission
- No mandatory fields — just a title is enough to capture

---

### US-03: Focus Blocks

> As a founder with ADHD, I want to set a timed focus block for a specific task so I can work without decision fatigue about what to do next.

**Acceptance criteria:**
- Can start a focus block from the dashboard in one tap/click
- Timer visible on screen throughout the block
- Task context shown during the block (title, any notes)
- Block duration configurable: 25 min, 45 min, or custom
- At end of block: prompt to log what was done and whether to continue or take a break
- Focus session logged to Notion automatically

---

### US-04: Daily Review

> As a founder with ADHD, I want a structured end-of-day review that helps me close the loop on today and set up tomorrow so I go to bed without anxiety about what I forgot.

**Acceptance criteria:**
- Triggered at a configurable time (default 17:30) via notification
- Shows: tasks completed today, tasks not completed (with option to reschedule), notes captured during the day
- Prompts for one sentence on "what went well" and "top priority for tomorrow"
- Review data written to Notion daily log
- Completable in under 5 minutes

---

## Functional Requirements

### FR-01: Dashboard

| ID | Requirement |
|----|-------------|
| FR-01.1 | Single-page dashboard with four modules: Briefing, Task Capture, Focus Block, Daily Review |
| FR-01.2 | Dashboard renders in under 2 seconds on 4G mobile |
| FR-01.3 | AI chat panel available on all views (OpenRouter/Claude Sonnet) for ad hoc queries |
| FR-01.4 | Authentication via existing auth provider (no new login flows) |

### FR-02: Daily Briefing Generation

| ID | Requirement |
|----|-------------|
| FR-02.1 | n8n workflow runs at 07:45 daily, reads Notion task and calendar data, generates briefing via Claude |
| FR-02.2 | Briefing stored in Notion and surfaced via dashboard API |
| FR-02.3 | Briefing refreshable manually from dashboard |
| FR-02.4 | If no tasks exist, briefing defaults to "clear day — use it well" prompt |

### FR-03: Task Capture

| ID | Requirement |
|----|-------------|
| FR-03.1 | POST endpoint writes task to Notion inbox database within 500ms |
| FR-03.2 | Dashboard shows running count of inbox items |
| FR-03.3 | Inbox items can be triaged (prioritise, defer, delete) from dashboard |
| FR-03.4 | n8n workflow notifies user if inbox exceeds 20 uncategorised items |

### FR-04: Focus Blocks

| ID | Requirement |
|----|-------------|
| FR-04.1 | Timer state held client-side (resilient to page refresh via localStorage) |
| FR-04.2 | Focus block written to Notion on start and updated on completion |
| FR-04.3 | Browser notification fires at block end |
| FR-04.4 | No task assignment required to start a block (unstructured focus supported) |

### FR-05: Daily Review

| ID | Requirement |
|----|-------------|
| FR-05.1 | n8n workflow triggers review notification at configured time |
| FR-05.2 | Review flow is a guided multi-step form, max 4 steps |
| FR-05.3 | Review writes to Notion daily log page (one page per day) |
| FR-05.4 | Incomplete reviews auto-saved on exit — not lost |

---

## Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Performance | Dashboard initial load under 2s on 4G mobile |
| NFR-02 | Performance | Task capture round-trip under 500ms |
| NFR-03 | Accessibility | All interactive elements keyboard-accessible |
| NFR-04 | Mobile | Fully functional on iOS Safari — primary usage context |
| NFR-05 | Friction | No feature requires more than 2 taps/clicks to access |
| NFR-06 | Reliability | n8n workflows have retry logic (3 attempts, 5-min backoff) |
| NFR-07 | Uptime | Vercel deployment with zero-downtime deploys |
| NFR-08 | Privacy | No third-party analytics; all data stays in Notion + Vercel |

---

## Integration Requirements

### Notion API

- **Auth:** Internal integration token stored in Vercel environment variable
- **Databases required:**
  - `Tasks` — captures, priorities, status, due date
  - `Daily Log` — one page per day, briefing + review data
  - `Focus Sessions` — start time, task, duration, completion notes
- **Access pattern:** Server-side only (no client-side Notion calls) via Next.js API routes

### n8n Webhooks

- **Trigger types:** Scheduled (cron), Webhook (from dashboard), Manual
- **Workflows required:**
  - `daily-briefing` — cron at 07:45, generates and stores briefing
  - `daily-review-trigger` — cron at 17:30 (configurable), sends notification
  - `inbox-alert` — triggered when inbox item count crosses threshold
- **Auth:** Webhook URLs protected by shared secret in header

### Vercel Deployment

- **Environment:** Production on Vercel (main branch auto-deploy)
- **Env vars:** Notion token, n8n webhook URLs, OpenRouter API key, auth secrets
- **Edge functions:** Not required at v1 — standard Node.js runtime

---

## Definition of Done

The system is considered done when:

1. All four user stories (US-01 through US-04) pass their acceptance criteria in production
2. CEO has used the system daily for 14 consecutive days without reporting friction blockers
3. n8n workflows have zero manual interventions required in that 14-day period
4. Dashboard load time measured at under 2s on a real iOS device on 4G
5. All Notion data is readable and structured (no orphaned or broken records)

---

## Out of Scope (v1)

- Team collaboration features
- External calendar integration (Google/Outlook) — Notion only at v1
- Native mobile app — web-first
- Complex task dependencies or project management
- Public-facing features

---

## Sign-off Required

This document requires CEO review and approval before architecture work (FOU-19 or equivalent) begins.

**CTO recommendation:** Approve as-is. Scope is tight and achievable. The 14-day usage requirement for DoD is intentionally strict — this system only has value if it becomes a daily habit.
