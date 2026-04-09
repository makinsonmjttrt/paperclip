# Tech Department Brain

**Last Updated:** 2026-04-09T14:35Z
**Updated By:** CTO (9f63e8ed)

---

## Current Technical Focus

ADHD Executive Function System — Phase 2 feature delivery.

- MVP deployed and stable (blocked on Vercel env config — see FOU-66)
- Phase 2 priority order: iOS Quick Capture → Weekly Review (WF-05 + UI) → Inbox Triage → Inbox Alert → AI Chat

---

## Active Work

| Issue | Title | Status | Owner |
|-------|-------|--------|-------|
| [FOU-600](/FOU/issues/FOU-600) | Code Reviewer: Review PR #22 EnergyLevel field | in_progress | CTO (tracking) |
| [FOU-607](/FOU/issues/FOU-607) | Review PR #22 (feat/energy-level-fou-528) | todo | Code Reviewer |
| [FOU-272](/FOU/issues/FOU-272) | Schema markup (JSON-LD) for FPZ website | blocked | CTO (WP creds) |
| [FOU-398](/FOU/issues/FOU-398) | Schema markup changes for FPZ website | blocked | CTO (WP creds) |

---

## Architecture Decisions

**2026-04-04 — Weekly review routes: already implemented, spec documents as-built**
All three routes (POST /api/webhooks/weekly-review, GET /api/weekly-review/latest, POST /api/weekly-review/submit) are fully implemented in adhd-ef-system. Storage: in-memory module cache (acceptable for single-user, n8n re-fires weekly). Two gaps noted: focusBlockCount always 0 in live fallback; parkInbox not actioned server-side. CreativAI page specced as static Server Component at /creativai with ProfessionalService JSON-LD.

**2026-04-04 — iOS Quick Capture: no backend required**
iOS Shortcuts call Notion API (`POST /v1/pages`) directly from the device. No intermediate server, no Next.js route. Uses existing Notion Internal Integration token from n8n. Architecture: S-complexity, zero infra change.

**2026-04-04 — Token delivery: user self-service**
n8n was offline during iOS shortcut guide creation. Rather than blocking, directed CEO to retrieve token from notion.so/my-integrations. Token is never written to any file — CEO enters it directly into the shortcut on-device.

---

## Tech Debt Register

| Item | Impact | Priority |
|------|--------|----------|
| Vercel deployment blocked (FOU-66) — env vars not configured | MVP not live | High |

---

## Standing Instructions

- All PRs through Code Reviewer before merge — no exceptions.
- TypeScript strict mode. No `any` without comment justification.
- No new infrastructure without CEO approval.
- When engineer is blocked, respond within the same heartbeat cycle.
- Phase 2 Notion schema changes (Completed date field, Weekly Reviews DB) must be done by CEO in Notion UI before any Phase 2 backend work starts.

---

## Phase 2 Dependency Map

```
Phase 2 Prerequisite (CEO manual):
  Add Completed date to Tasks DB
  Create Weekly Reviews DB
  Grant integration token write access to Weekly Reviews DB
  → Blocks: Feature 2 (WF-05), Feature 3 (Weekly Review UI)
  → Does NOT block: Feature 1 (iOS Quick Capture), Feature 4, 5, 6

Feature 1 — iOS Quick Capture: UNBLOCKED, Martyn self-implements
Feature 2 — Weekly Review n8n WF-05: blocked on schema prep
Feature 3 — Weekly Review Dashboard UI: blocked on WF-05
Feature 4 — Inbox Triage UI: unblocked, P2
Feature 5 — Inbox Alert n8n: unblocked, P2
Feature 6 — AI Chat Panel: blocked on MVP deploy
```
