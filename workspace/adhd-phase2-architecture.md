# ADHD EF System — Phase 2 Architecture Spec

**Version:** 1.0
**Author:** CTO
**Issue:** [FOU-173](/FOU/issues/FOU-173)
**Status:** Draft — Pending CEO review
**Depends on:** MVP (FOU-43) deployed and stable

---

## Overview

Phase 2 ships the features designed but explicitly deferred from MVP. Every item here has a source document or functional requirement already written. No new scope is being introduced — this document sequences and sizes what already exists.

MVP ships four core modules: Daily Briefing, Task Capture, Focus Block, Daily Review.

Phase 2 adds: Weekly Review, iOS Quick Capture, Inbox Triage, AI Chat Panel, and the Inbox Alert automation.

---

## Prerequisite: Notion Schema Changes

These must be completed manually before any Phase 2 development starts. No code can be written against them until they exist.

| Action | Why | Owner |
|--------|-----|-------|
| Add `Completed` date property to Tasks database | Weekly review queries need it to find completed tasks in the past 7 days | CEO (Notion UI) |
| Create `Weekly Reviews` Notion database | Stores one record per review session | CEO (Notion UI) |
| Weekly Reviews fields: `WeekEndingDate` (date), `Intention` (rich text), `FocusBlockCount` (number), `TasksCompleted` (number), `TasksStuck` (number), `CreatedAt` (date) | Schema matches submission payload | CEO |
| Confirm Focus Sessions database ID | n8n WF-05 node needs it | CTO / check n8n credentials |
| Grant Notion integration token write access to Weekly Reviews DB | Otherwise the n8n log step will fail silently | CEO (Notion integration settings) |

**Estimated effort:** 20 minutes. No engineer time required.

---

## Phase 2 Feature List (Priority Order)

### Feature 1 — iOS Quick Capture Shortcuts

**Priority:** P1 — ship first. No backend changes. Immediately reduces daily friction.

**What it is:** Two iOS Shortcuts that write directly to the Notion Tasks database in under 5 seconds from anywhere on iPhone. Fully specced in `workspace/adhd-ios-shortcut-design.md`.

| Shortcut | Priority written to Notion |
|----------|--------------------------|
| Quick Capture | AMBER |
| Brain Dump | GREEN |

**Architecture:** No code change required. Uses the existing Notion Internal Integration token. The shortcut calls `POST https://api.notion.com/v1/pages` directly from iOS — no intermediate server.

**CTO action required (before user implements):** Retrieve the Notion Internal Integration token value from n8n credentials and provide it to CEO securely. Do not write it in any document.

**Where it lives:** iOS device only. No changes to Next.js, n8n, or Notion schema.

**Complexity:** S

**Dependencies:** None. Can ship before MVP is deployed.

---

### Feature 2 — Weekly Review: n8n Workflow WF-05

**Priority:** P1 — automation must exist before the dashboard UI is useful.

**Source doc:** `workspace/adhd-weekly-review-spec.md` (Section 5)

**What it does:** Runs Sunday 18:00 (Europe/London). Queries Notion for the past week's completed tasks, stuck tasks, and focus block count. Builds a structured payload and POSTs it to the dashboard webhook endpoint. Sends a summary email. Logs the review to the new Weekly Reviews database.

**Node sequence:**

```
Schedule Trigger (Sunday 18:00)
  → Get Completed Tasks (Notion query, past 7 days, status=Complete)
  → Get Stuck Tasks (Notion query, open ≥ 7 days)
  → Get Focus Sessions (Notion query, past week, status=Completed)
  → Build Weekly Payload (Code node, assembles JSON)
  → Push to Dashboard (HTTP POST /api/webhooks/weekly-review)
  → Send Summary Email (Outlook node, mart@fourpointzero.co.uk)
  → Log to Notion (Create page in Weekly Reviews DB)
```

**New env var in n8n:** `ADHD_WEEKLY_REVIEW_WEBHOOK_URL`

**Follows exactly:** The same pattern as the existing daily briefing workflow. Same credential reuse, same error-handling approach (continue on error, execution visible in n8n logs), same webhook secret mechanism.

**Complexity:** M

**Dependencies:** Notion schema changes (Feature 0). The `Completed` date field must exist before the Get Completed Tasks node will work.

---

### Feature 3 — Weekly Review: Dashboard UI + API Routes

**Priority:** P1 — ships alongside or after WF-05.

**Source doc:** `workspace/adhd-weekly-review-spec.md` (Sections 2, 3, 5)

**Where it lives:** Next.js dashboard

**New API routes:**

| Route | Purpose |
|-------|---------|
| `POST /api/webhooks/weekly-review` | Receives payload from n8n WF-05, stores it (Notion or in-memory cache) |
| `GET /api/weekly-review/latest` | Returns the latest weekly review payload to the dashboard |
| `POST /api/weekly-review/submit` | Called when user taps "Close the week" — writes intention to Notion, patches task statuses |

Follows the same pattern as `POST /api/webhooks/daily-briefing` and `GET /api/briefing/latest`.

**Dashboard UI — what gets built:**

1. Weekly review banner (visible Sunday 18:00 to Monday 09:00, replaces daily briefing banner in that window)
2. Nav badge reading "Weekly Review" during the window
3. Five-section review screen:
   - Section A: Completed tasks (read-only list, max 10)
   - Section B: Stuck tasks (carry forward / park buttons)
   - Section C: Focus block count (one sentence, read-only)
   - Section D: Intention text field (280 char, plain text, "park inbox" checkbox)
   - Section E: "Close the week" submit button with confirmation

4. Mobile stepped flow (5 screens with progress dots, back button)

**Complexity:** M (two pieces: API routes = S, UI component = M)

**Dependencies:** WF-05 deployed and firing. Notion schema changes complete.

---

### Feature 4 — Inbox Triage UI

**Priority:** P2 — high value, no blockers, can ship any time after MVP.

**Source:** Requirements FR-03.2, FR-03.3

**What it is:** A dashboard view that lets the CEO triage the Notion inbox without opening Notion. Inbox items are tasks captured but not yet assigned priority, due date, or status beyond "To Do".

**Dashboard additions:**
- Running count of uncategorised inbox items (visible in nav or task capture bar)
- Triage view: list of inbox items, each with controls to set priority (RED/AMBER/GREEN), set a due date, or delete
- Each action writes immediately to Notion via the Next.js API

**New API routes:**

| Route | Purpose |
|-------|---------|
| `GET /api/inbox` | Returns tasks with no priority or due date set |
| `PATCH /api/tasks/:id` | Updates priority, due date, or status on a task |
| `DELETE /api/tasks/:id` | Deletes a task (sets to Cancelled in Notion) |

**Architecture:** All writes go server-side (Next.js API → Notion API). No client-side Notion calls.

**Complexity:** M

**Dependencies:** None beyond MVP. Reuses existing Notion Tasks database.

---

### Feature 5 — Inbox Alert n8n Workflow

**Priority:** P2 — small effort, prevents inbox bloat.

**Source:** Requirements FR-03.4, User Guide

**What it does:** Notifies the CEO when uncategorised inbox items exceed 20. Triggers an email to mart@fourpointzero.co.uk.

**n8n workflow design:**

```
Schedule Trigger (check every morning, e.g. 07:50 after daily briefing)
  → Query Notion Tasks (status=To Do, no priority set)
  → IF count > 20
    → Send Alert Email (Outlook node)
```

Alternatively: triggered from Next.js on task capture when the count crosses the threshold (webhook trigger instead of polling). Recommendation: start with the scheduled poll — simpler, no additional Next.js complexity.

**Complexity:** S

**Dependencies:** None beyond MVP.

---

### Feature 6 — AI Chat Panel

**Priority:** P2

**Source:** Requirements FR-01.3 ("AI chat panel available on all views — OpenRouter/Claude Sonnet")

**What it is:** A persistent chat panel on the dashboard for ad hoc queries against task data and the daily briefing. "What's overdue? What should I do next? How many focus blocks have I done this week?"

**Architecture:**

```
User types message
  → POST /api/chat
  → Next.js API route builds system prompt with current context:
      - Today's briefing payload
      - Open task list (from Notion, cached)
      - Recent focus sessions
  → Sends to OpenRouter (Claude Sonnet model)
  → Streams response back to client
  → Response rendered in chat panel
```

**New API route:** `POST /api/chat` — accepts `{message: string}`, returns streaming text response.

**New env var in Vercel:** `OPENROUTER_API_KEY` (may already exist from MVP; confirm)

**UI:** Fixed panel or slide-out drawer. Input field + response area. Visible on all dashboard pages.

**Complexity:** M

**Note on context:** The chat assistant should not have write access to Notion in Phase 2. Read-only context injection only. If the user asks it to create a task, it should respond with instructions rather than doing it directly — keeps the blast radius low.

**Dependencies:** MVP dashboard deployed. OpenRouter API key available.

---

## Out of Scope for Phase 2

These are explicitly deferred. Do not build them until Phase 3 or later.

| Item | Why deferred |
|------|-------------|
| Week-on-week comparison charts | Data won't exist until several weekly reviews are logged. Revisit in Phase 3. |
| AI-generated weekly review summary | Adds inference cost and complexity before the baseline review is proven. |
| Calendar integration (Google/Outlook) | Significant OAuth and data mapping work. Not blocking anything. |
| Native iOS app | Web-first approach working well. No trigger event. |
| Push notifications (PWA) | Email covers the use case. PWA push adds infra complexity without clear gain. |
| Team features | Single-user system. Not in scope at any current horizon. |

---

## Architecture Decisions

### Where each feature lives

| Feature | Next.js | n8n | iOS Shortcut | Notion |
|---------|---------|-----|-------------|--------|
| iOS Quick Capture | — | — | Both shortcuts | Writes to Tasks DB |
| Weekly Review WF-05 | New webhook endpoint | New workflow | — | Reads Tasks, Focus Sessions; writes Weekly Reviews |
| Weekly Review UI | New routes + component | — | — | Reads/writes via API |
| Inbox Triage | New routes + UI | — | — | Reads/writes Tasks |
| Inbox Alert | — | New workflow | — | Reads Tasks |
| AI Chat | New route | — | — | Reads (context only) |

### Reuse principles

All Phase 2 work follows existing MVP patterns:
- n8n workflows: schedule trigger → Notion nodes → HTTP POST → email → Notion log
- Next.js API routes: server-side Notion calls, webhook secret auth header, no client-side API calls
- No new infrastructure, no new services, no new auth providers

The only new external service is OpenRouter (AI Chat), which is already referenced in the requirements and the stack.

### Data flow

Phase 2 adds no new external data sources. All data still lives in Notion. n8n is still the automation layer. Next.js is still the presentation layer. The weekly review adds one new Notion database and one new Notion property.

---

## Infrastructure Changes Required

| Change | Where | When |
|--------|-------|------|
| Add `ADHD_WEEKLY_REVIEW_WEBHOOK_URL` env var | n8n | Before WF-05 is activated |
| Add `ADHD_WEEKLY_REVIEW_WEBHOOK_URL` env var | Vercel | Before WF-05 first fires |
| Confirm `OPENROUTER_API_KEY` in Vercel | Vercel | Before AI Chat is deployed |
| Notion integration token write access to Weekly Reviews DB | Notion | Before schema changes |

No new hosting, no new cloud services, no additional spend beyond OpenRouter inference costs (which are minimal at single-user scale).

---

## Sequencing (Recommended Build Order)

```
Week 0 (before build):
  CEO: Notion schema changes (20 min manual setup)
  CTO: Retrieve and securely provide Notion token for iOS shortcuts

Week 1:
  [P1] Feature 1 — iOS Quick Capture (CEO self-implements, CTO available for support)
  [P1] Feature 2 — WF-05 n8n workflow
  [P1] Feature 3a — Weekly review API routes (POST webhook, GET latest, POST submit)

Week 2:
  [P1] Feature 3b — Weekly review dashboard UI + mobile flow
  [P2] Feature 5 — Inbox Alert n8n workflow (S, can be parallelised)

Week 3:
  [P2] Feature 4 — Inbox Triage UI
  [P2] Feature 6 — AI Chat Panel

```

This sequencing ensures:
1. The highest-friction MVP gaps (capture friction, weekly review) are closed first
2. Each item is independently releasable — no big bang
3. n8n workflows don't require dashboard UI to be ready before they can be built and tested

---

## Complexity Summary

| Feature | Complexity | Engineer effort |
|---------|-----------|-----------------|
| Notion schema prep | — | CEO only (no engineer) |
| iOS Quick Capture | S | User self-implements; CTO token retrieval only |
| Weekly Review n8n WF-05 | M | ~half day |
| Weekly Review API routes | S | ~2-3 hours |
| Weekly Review Dashboard UI | M | ~1 day (including mobile flow) |
| Inbox Triage UI | M | ~1 day |
| Inbox Alert n8n | S | ~1-2 hours |
| AI Chat Panel | M | ~1 day |
| **Total** | | **~4-5 engineer days** |

---

## Acceptance Criteria

Phase 2 is complete when:

- [ ] Weekly Review fires automatically Sunday 18:00 and CEO can complete it end-to-end on mobile
- [ ] iOS Quick Capture is tested and confirmed writing to Notion Tasks
- [ ] Inbox Triage lets CEO prioritise inbox items without opening Notion
- [ ] AI Chat Panel returns correct contextual answers to at least: "what's overdue", "how many focus blocks this week", "what should I do next"
- [ ] Inbox Alert email fires when uncategorised tasks exceed 20
- [ ] All existing MVP features continue to work without regression

---

# Phase 3 Technical Brief

**Author:** CTO
**Issue:** [FOU-425](/FOU/issues/FOU-425)
**Date:** 2026-04-09
**Status:** Draft — for CEO review

---

## Phase 2 Tech Debt to Clear First

Before starting new Phase 3 features, clear these outstanding items from Phase 2. They are small, and leaving them creates confusion about what the system can actually do.

| Debt item | Impact if left | Effort | Fix |
|-----------|---------------|--------|-----|
| `focusBlockCount` always 0 in live fallback (when n8n cache is cold) | Focus block stat shows 0 in weekly review before WF-05 first fires. Misleading. | S (~2 hours) | Wire Focus Sessions DB query into `GET /api/weekly-review/latest` live fallback path |
| `parkInbox: true` received by submit route but not actioned | UI checkbox has no effect — user thinks they're parking inbox, nothing happens | S–M (~3 hours) | Implement bulk-PATCH to Notion Tasks in `POST /api/weekly-review/submit` |

**CEO confirm before Phase 3 scoping:** Please confirm which of these Phase 2 P2 items shipped: Inbox Triage UI, Inbox Alert n8n workflow, AI Chat Panel. If any are missing, they should be shipped as Phase 2 completion work — not rebadged as Phase 3.

---

## Phase 3 Feature Assessment

### Evaluated candidates

| Candidate | ADHD value | Complexity | Verdict |
|-----------|------------|------------|---------|
| Weekly review (complete) | HIGH — closes the weekly loop, prevents week blur | M (partially done) | Phase 2 completion, not Phase 3 |
| Habit tracking dashboard | MEDIUM — consistency data, useful but not friction-reducing | HIGH (new DB, new UI, new concepts) | Defer — scope too large, value unclear |
| AI-powered inbox triage | HIGH — removes decision fatigue on inbox triage | M | **Phase 3 P1** |
| Calendar integration (read-only) | HIGH — ADHD time blindness fix, shows meeting context in briefing | HIGH (OAuth, Google/Outlook APIs) | Defer — high complexity, no blocker |
| Energy level tracking | HIGH — adaptive briefing based on capacity | M | **Phase 3 P2** |
| Week-on-week review summary | MEDIUM-HIGH — pattern recognition, track productivity cycles | M (data already exists after several reviews) | **Phase 3 P3** |

### Recommended Phase 3 scope: 3 features

---

## Feature 1 — AI-Powered Inbox Triage Suggestions (P1)

**Why it ranks first:** The inbox is the primary friction point for ADHD users. Deciding what to do with 20+ tasks requires sustained decision-making — exactly where ADHD executive function breaks down. AI suggestions remove that cognitive load: the system proposes, the CEO approves.

**What it does:**
- Button in the Inbox Triage view: "Get AI suggestions"
- Sends current inbox items to Claude via OpenRouter
- Returns per-task suggestions: recommended priority (RED/AMBER/GREEN), suggested action (do today / defer / park / delegate), brief reason (one sentence)
- User reviews suggestions as a batch — accept all, reject individual items, or modify
- Accepted suggestions are written to Notion via existing `PATCH /api/tasks/:id`

**Architecture additions:**

| New component | Where | Notes |
|--------------|-------|-------|
| `POST /api/inbox/triage-suggestions` | Next.js API route | Fetches inbox items, builds prompt, calls OpenRouter, returns suggestions array |
| `POST /api/inbox/triage-apply` | Next.js API route | Accepts `{ taskId, priority, action }[]`, bulk-applies via Promise.allSettled |
| System prompt for inbox triage | `lib/ai-prompts.ts` | Defines context: task name, days open, current priority. Returns structured JSON suggestions. |

**Extends:** existing `GET /api/inbox`, `PATCH /api/tasks/:id`, OpenRouter/`POST /api/chat` pattern.

**New env var:** None — reuses `OPENROUTER_API_KEY`.

**Complexity:** M (~1 day)

**No new Notion schema required.** Reads existing Task fields: Name, Status, Priority, Due, CreatedAt.

---

## Feature 2 — Energy Level Check-In + Adaptive Briefing (P2)

**Why it ranks second:** Time blindness is one ADHD symptom. Capacity blindness is another — starting a high-demand day with a RED-heavy task list when your energy is 2/5 causes avoidance spirals. A 10-second morning check-in lets the briefing adapt to what you can actually do today.

**What it does:**
- Morning check-in prompt (appears at top of briefing banner): "How's your energy today? [1] [2] [3] [4] [5]" — tap once, done
- Energy score writes to the Daily Log Notion record for today
- Daily briefing renders an adaptive headline based on energy:
  - 1–2: "Low energy day — one RED task, then rest"
  - 3: "Steady day — clear your AMBER list"
  - 4–5: "High energy — tackle your biggest RED first"
- The headline is a guide, not a gate — task list remains unchanged

**Architecture additions:**

| New component | Where | Notes |
|--------------|-------|-------|
| `EnergyLevel` Notion property | Daily Log database | Number (1–5). CEO adds manually before this ships — 5 minute Notion task. |
| `POST /api/energy-check` | Next.js API route | Writes `EnergyLevel` to today's Daily Log record. Simple PATCH to Notion. |
| Energy-adaptive headline logic | `lib/briefing-utils.ts` | Pure function: `getEnergyHeadline(energyLevel: number): string` |
| Energy check-in component | Dashboard UI | Three-tap UX: appears in briefing banner, persists once set for the day |

**New Notion property required (CEO action):**
- Open Daily Log database in Notion
- Add property: `EnergyLevel`, type: Number
- Takes 5 minutes

**Complexity:** M (~1 day including Notion property)

**n8n change:** None required. The daily briefing WF-01 payload does not need to change — energy is captured on the dashboard, not via n8n.

---

## Feature 3 — Week-on-Week Review Summary (P3)

**Why it ranks third:** After several weekly reviews are logged, there is data. ADHD users benefit from seeing patterns they cannot remember consciously — "I always have more focus blocks on Tuesday/Wednesday", "my stuck task count has been rising for 3 weeks". This feature makes that visible without any extra effort.

**Prerequisite:** At least 3–4 weekly reviews must be logged in Notion. Do not build this until the weekly review is fully operational and used consistently.

**What it does:**
- New section in the Weekly Review screen: "Last 4 weeks"
- Three sparklines or bar columns: focus blocks per week, tasks completed per week, stuck task count per week
- No averages, no benchmarks, no comparisons to others. Just your own pattern.
- Available passively — no action required from CEO

**Architecture additions:**

| New component | Where | Notes |
|--------------|-------|-------|
| `GET /api/weekly-review/history` | Next.js API route | Query params: `weeks=4`. Reads Notion Weekly Reviews DB, returns array sorted by WeekEndingDate desc. |
| History chart component | Weekly Review UI | Minimal charting — could use a tiny SVG-based sparkline or a lightweight library (e.g. recharts, which Next.js supports). No new dependency required if SVG drawn manually for 4 data points. |

**Notion schema:** No changes required. Reads existing Weekly Reviews DB properties: `WeekEndingDate`, `FocusBlockCount`, `TasksCompleted`, `TasksStuck`.

**Complexity:** M (~1 day)

---

## Architecture Decisions for Phase 3

### No new infrastructure

Phase 3 adds no new external services, no new auth providers, no new hosting. All features extend:
- Next.js App Router (new API routes + UI components)
- Notion (one new property: `EnergyLevel` on Daily Log)
- OpenRouter (AI triage extends existing Chat integration)

### AI prompt design principle

The inbox triage prompt must return structured JSON, not prose. The Engineer should define a strict output schema and validate it before rendering suggestions in the UI. If the model returns malformed output, show a fallback: "Suggestions unavailable — try again." Do not crash.

### No write access for AI in Phase 3

The AI triage suggestions are proposals only. The CEO approves each one before anything is written to Notion. Same principle as Phase 2 AI Chat: read-only context injection, no autonomous writes.

---

## Sequencing (Recommended Build Order)

```
Before Phase 3 starts:
  Engineer: Clear Phase 2 tech debt (focusBlockCount fix + parkInbox implement)
  CEO: Confirm Phase 2 P2 feature status (Inbox Triage, Inbox Alert, AI Chat)
  CEO: Add EnergyLevel property to Daily Log Notion database (5 min)

Phase 3 Week 1:
  [P1] Feature 1 — AI-powered inbox triage (M)

Phase 3 Week 2:
  [P2] Feature 2 — Energy level check-in + adaptive briefing (M)

Phase 3 Week 3+:
  [P3] Feature 3 — Week-on-week review summary (M, only after 3+ reviews logged)
```

---

## Complexity Summary

| Work item | Complexity | Engineer effort |
|-----------|-----------|-----------------|
| Phase 2 tech debt (focusBlockCount + parkInbox) | S | ~half day |
| AI-powered inbox triage | M | ~1 day |
| Energy level check-in + adaptive briefing | M | ~1 day |
| Week-on-week review summary | M | ~1 day |
| **Phase 3 total** | | **~3–3.5 engineer days** |

---

## Phase 3 Acceptance Criteria

- [ ] CEO can tap "Get AI suggestions" on inbox and receive priority + action for each item
- [ ] Accepting suggestions in bulk writes to Notion correctly via existing PATCH route
- [ ] Energy check-in appears in morning briefing banner and saves in one tap
- [ ] Briefing headline adapts based on energy score (manual verification, 3 test cases)
- [ ] Week-on-week summary visible in weekly review screen after 3+ reviews exist
- [ ] All Phase 2 features continue working without regression
