# ADHD EF System — Phase 3 Technical Implementation Spec

**Version:** 1.0
**Author:** Engineer
**Issue:** [FOU-507](/FOU/issues/FOU-507)
**Depends on:** Phase 2 complete (FOU-173), Phase 3 CTO brief (`workspace/adhd-phase2-architecture.md` § Phase 3)
**Date:** 2026-04-09
**Status:** Draft — for CTO review

---

## Summary

Phase 3 adds three features to the ADHD EF System:

| # | Feature | Priority | Effort |
|---|---------|----------|--------|
| 1 | AI-Powered Inbox Triage Suggestions | P1 | M (~1 day) |
| 2 | Energy Level Check-In + Adaptive Briefing | P2 | M (~1 day) |
| 3 | Week-on-Week Review Summary | P3 | M (~1 day, data-gated) |

Phase 3 also clears two Phase 2 tech debt items before new feature work begins.

---

## Pre-Phase 3: Clear Phase 2 Tech Debt

Two gaps from Phase 2 must be resolved first. Both are small and blocking correct behaviour.

| Item | File | Fix |
|------|------|-----|
| `focusBlockCount` always 0 in live fallback | `app/api/weekly-review/latest/route.ts` | Add Notion Focus Sessions DB query to live fallback path alongside existing completedTasks/stuckTasks queries. Wire result into `focusBlockCount` field. |
| `parkInbox: true` not actioned on submit | `app/api/weekly-review/submit/route.ts` | When `parkInbox: true`, query Tasks DB for all items with no Priority and Status not in [Complete, Cancelled, Parked, Deleted]. Bulk-PATCH each to Status="Parked" via `Promise.allSettled`. Report count in response. Do not enable the UI checkbox until this is live. |

**Complexity:** S (combined ~half day)

---

## 1. Database Schema Additions

### Feature 1 — AI Inbox Triage

**No new Notion schema required.**

Reads existing Tasks DB (`2915456c-327f-80d8-83b4-000b8bc03128`) fields:

| Field | Type | Used for |
|-------|------|---------|
| `Name` | title | Task description sent to AI |
| `Status` | select | Filter: inbox items have Status = "To Do" with no Priority |
| `Priority` | select | Current priority (null/empty = inbox item) |
| `Due` | date | Context for AI suggestion |
| `CreatedAt` / `created_time` | date | Days open calculation |

New Next.js files (not Notion schema):

| File | Purpose |
|------|---------|
| `lib/ai-prompts.ts` | System prompt definitions. `getInboxTriagePrompt(tasks: InboxTask[]): string` |
| `lib/inbox-triage-schema.ts` | Zod schema for validating OpenRouter response. Prevents UI crash on malformed AI output. |

---

### Feature 2 — Energy Level Check-In

**One new Notion property required (CEO manual action, ~5 minutes):**

| Database | Property | Type | Values |
|----------|----------|------|--------|
| Daily Log | `EnergyLevel` | Number | 1–5 (integer). 0 or absent = not yet set today. |

No new databases. No new tables. The existing Daily Log record for today is patched via `PATCH /api/energy-check`.

New Next.js file:

| File | Purpose |
|------|---------|
| `lib/briefing-utils.ts` | Add exported pure function: `getEnergyHeadline(energyLevel: number): string`. Returns adaptive headline string. Three branches: 1–2 (low), 3 (steady), 4–5 (high). Returns empty string for 0/undefined (no check-in yet). |

**CEO action required before this feature ships:**
Open the Notion Daily Log database → Add property → Name: `EnergyLevel`, Type: Number.

---

### Feature 3 — Week-on-Week Review Summary

**No new Notion schema required.**

Reads existing Weekly Reviews DB (created in Phase 2). Fields used:

| Field | Type | Used for |
|-------|------|---------|
| `WeekEndingDate` | date | X-axis sort key and label |
| `FocusBlockCount` | number | Sparkline data |
| `TasksCompleted` | number | Sparkline data |
| `TasksStuck` | number | Sparkline data |

**Pre-condition:** At least 3 weekly reviews must be logged before this UI is meaningful. Build the API route now; display the chart section conditionally when `history.length >= 2`.

---

## 2. API Endpoints

All routes use Next.js App Router (`app/api/...`). Request/response contracts below.

---

### Phase 2 Debt — PATCH: focusBlockCount live fallback

**File:** `app/api/weekly-review/latest/route.ts` (modification)

No new route. Modify the live fallback branch to query Focus Sessions DB and populate `focusBlockCount`. See existing GET spec in `workspace/adhd-phase2-api-spec.md` for full route contract.

---

### Phase 2 Debt — POST: parkInbox implementation

**File:** `app/api/weekly-review/submit/route.ts` (modification)

No new route. When `parkInbox: true`, add a Notion query + bulk-PATCH before the existing Notion log write. Add `parkInboxCount` to the response:

```json
{
  "success": true,
  "weekEnding": "2026-04-05",
  "reviewId": "notion-page-id-or-null",
  "parkErrors": 0,
  "parkInboxCount": 7,
  "message": "Week closed. See you Monday."
}
```

---

### Feature 1a — POST /api/inbox/triage-suggestions

**File:** `app/api/inbox/triage-suggestions/route.ts`

**Purpose:** Fetches inbox items, builds a structured prompt, calls OpenRouter, returns an array of AI suggestions per task.

**Auth:** None (Vercel deployment auth covers the app).

**Request:**

```
POST /api/inbox/triage-suggestions
Content-Type: application/json
```

Body: empty `{}` — the route fetches inbox items itself via existing Notion query pattern (same as `GET /api/inbox`).

**Processing flow:**

```
1. Query Notion Tasks DB — Status="To Do", Priority empty/null (max 20 items)
2. Build triage prompt via lib/ai-prompts.ts
3. POST to OpenRouter — model: claude-sonnet-4-5 (or OPENROUTER_MODEL env var)
4. Parse and validate response JSON with lib/inbox-triage-schema.ts
5. Return validated suggestions array
```

**Response (200):**

```json
{
  "success": true,
  "suggestions": [
    {
      "taskId": "notion-page-id",
      "taskName": "Write phase 3 spec",
      "suggestedPriority": "RED",
      "suggestedAction": "do_today",
      "reason": "Due soon and directly tied to shipping Phase 3."
    }
  ],
  "inboxCount": 5
}
```

`suggestedAction` enum: `do_today` | `defer` | `park` | `delegate`

`suggestedPriority` enum: `RED` | `AMBER` | `GREEN` | `null` (if AI cannot determine)

**Response (200) — AI fallback (malformed output):**

```json
{
  "success": false,
  "suggestions": [],
  "inboxCount": 5,
  "error": "AI suggestions unavailable. Try again."
}
```

Return 200 with `success: false` rather than 500 — the inbox is still accessible without suggestions.

**Error responses:**

| Status | Condition |
|--------|-----------|
| 500 | Notion query failed; message: "Failed to fetch inbox items" |
| 503 | `OPENROUTER_API_KEY` missing; message: "AI triage not configured" |

**OpenRouter prompt contract:**

```
System: You are an ADHD productivity assistant. Given a list of inbox tasks,
suggest a priority and action for each one. Return ONLY a JSON array — no prose.
Schema per item: { taskId, suggestedPriority, suggestedAction, reason }.
Priority values: RED (urgent), AMBER (important), GREEN (nice to have), null (unclear).
Action values: do_today, defer, park, delegate.
Reason: one sentence, max 20 words.

User: [JSON array of tasks: { id, name, daysOpen, dueDate }]
```

---

### Feature 1b — POST /api/inbox/triage-apply

**File:** `app/api/inbox/triage-apply/route.ts`

**Purpose:** Bulk-applies accepted AI suggestions to Notion. Uses `Promise.allSettled` — partial failures do not abort the batch.

**Request:**

```
POST /api/inbox/triage-apply
Content-Type: application/json
```

```json
{
  "accepted": [
    { "taskId": "notion-page-id-1", "priority": "RED", "action": "do_today" },
    { "taskId": "notion-page-id-2", "priority": "GREEN", "action": "park" }
  ]
}
```

**Processing flow:**

```
For each accepted item:
  - If action = "park": PATCH Status → "Parked" AND Priority → value
  - Otherwise: PATCH Priority → value only (Status unchanged)
All via Promise.allSettled
```

**Response (200):**

```json
{
  "success": true,
  "applied": 2,
  "errors": 0
}
```

**Error responses:**

| Status | Condition |
|--------|-----------|
| 400 | `accepted` array absent or empty |
| 500 | Unhandled exception |

---

### Feature 2 — POST /api/energy-check

**File:** `app/api/energy-check/route.ts`

**Purpose:** Writes the CEO's self-reported energy score (1–5) to today's Daily Log record in Notion.

**Request:**

```
POST /api/energy-check
Content-Type: application/json
```

```json
{ "energy": 3 }
```

`energy`: integer, 1–5 (inclusive). Rejected outside this range.

**Processing flow:**

```
1. Validate energy value (1–5)
2. Query Notion Daily Log DB for today's record (filter: Date = today)
3. If record found: PATCH EnergyLevel property
4. If no record: return 404 (briefing hasn't been generated yet)
```

**Response (200):**

```json
{
  "success": true,
  "energy": 3,
  "headline": "Steady day — clear your AMBER list"
}
```

`headline` comes from `lib/briefing-utils.ts:getEnergyHeadline(energy)`.

**Error responses:**

| Status | Condition |
|--------|-----------|
| 400 | `energy` not an integer between 1 and 5 |
| 404 | No Daily Log record for today found in Notion |
| 500 | Notion write failed |

---

### Feature 3 — GET /api/weekly-review/history

**File:** `app/api/weekly-review/history/route.ts`

**Purpose:** Returns the last N weekly review records for sparkline rendering in the Weekly Review UI.

**Request:**

```
GET /api/weekly-review/history?weeks=4
```

`weeks` query param: integer 1–12, default 4. Capped at 12 server-side.

**Processing flow:**

```
1. Parse weeks param, clamp to [1, 12]
2. Query Notion Weekly Reviews DB
   Sort: WeekEndingDate DESC
   Page size: weeks value
3. Map to response shape
4. Return sorted ascending (oldest first) for chart rendering
```

**Response (200):**

```json
{
  "history": [
    {
      "weekEnding": "2026-03-22",
      "focusBlocks": 2,
      "tasksCompleted": 5,
      "tasksStuck": 3
    },
    {
      "weekEnding": "2026-03-29",
      "focusBlocks": 4,
      "tasksCompleted": 8,
      "tasksStuck": 1
    }
  ],
  "count": 2
}
```

**Error responses:**

| Status | Condition |
|--------|-----------|
| 500 | Notion query failed |

---

## 3. n8n Workflow Changes

**No new n8n workflows are required for Phase 3.**

| Workflow | Change |
|----------|--------|
| WF-01 Daily Briefing | None. Energy level is captured on the dashboard, not injected via n8n. |
| WF-05 Weekly Review | None. History data is queried live from Notion by the new `GET /api/weekly-review/history` route. |

The AI triage feature calls OpenRouter directly from the Next.js API route — no n8n intermediary needed. This keeps the latency low and the blast radius small.

**If the CEO wants energy level included in the daily briefing email** (future enhancement, not Phase 3 scope): modify WF-01 to query `EnergyLevel` from the previous day's Daily Log record and include it in the email body. Not required now.

---

## 4. Edge Runtime Compatibility

Next.js App Router defaults to Node.js runtime for API routes. No `export const runtime = 'edge'` should be added to any Phase 3 routes. Here is the reasoning per route:

| Route | Runtime | Reason |
|-------|---------|--------|
| `POST /api/inbox/triage-suggestions` | Node.js (default) | Notion SDK uses Node.js internals (http module, Buffer). OpenRouter call via `fetch` is fine in either, but keeping consistent with existing routes. |
| `POST /api/inbox/triage-apply` | Node.js (default) | Notion SDK dependency. `Promise.allSettled` is available in both but keep consistent. |
| `POST /api/energy-check` | Node.js (default) | Notion SDK dependency. Route is fast (single PATCH) but no reason to deviate from project-wide Node.js default. |
| `GET /api/weekly-review/history` | Node.js (default) | Notion SDK dependency. |

**Existing in-memory cache pattern note:** The weekly review cache in `lib/weekly-review-cache.ts` uses a module-level variable. This works on Vercel because the daily briefing and weekly review payloads are pre-pushed by n8n — the cache is warmed before users request it. Phase 3 routes do not use in-memory cache: triage suggestions are computed on demand, energy check is a direct write, and history is always a live Notion query. No cache pattern needed.

**Timeout risk for triage-suggestions:** OpenRouter inference can take 5–15 seconds for a batch of 20 tasks. Vercel's default function timeout is 10 seconds on hobby plan, 60 seconds on pro. Confirm Vercel plan before shipping Feature 1. If timeout is a risk, reduce max inbox items from 20 to 10, or implement streaming response from the API route.

---

## 5. Complexity Estimates

T-shirt sizing. 1 point = ~half day of engineer time.

| Work item | Size | Points | Notes |
|-----------|------|--------|-------|
| Phase 2 debt: focusBlockCount fix | S | 0.5 | Single query addition to existing route |
| Phase 2 debt: parkInbox implement | S | 0.5 | Bulk-PATCH pattern already used in submit route |
| Feature 1a: `POST /api/inbox/triage-suggestions` | M | 1.5 | New route + OpenRouter integration + prompt design + Zod validation |
| Feature 1b: `POST /api/inbox/triage-apply` | S | 0.5 | Thin route, reuses existing Notion PATCH pattern |
| Feature 1 UI: Triage suggestions panel | M | 1.0 | Extends existing Inbox Triage UI with suggestion overlay + accept/reject controls |
| Feature 2: `POST /api/energy-check` | S | 0.5 | Single Notion PATCH + headline utility |
| Feature 2 UI: Energy check-in widget | S | 0.5 | Five-button tap component in briefing banner |
| Feature 2 util: `getEnergyHeadline()` | XS | 0.25 | Pure function, trivial |
| Feature 3: `GET /api/weekly-review/history` | S | 0.5 | Notion query + map |
| Feature 3 UI: Sparkline/bar chart | S–M | 0.75 | SVG sparklines for 4 data points. No chart library needed. |
| **Phase 2 debt total** | | **1.0** | |
| **Phase 3 features total** | | **5.5** | |
| **Grand total** | | **6.5 points** | ~3.25 engineer days |

**Recommended sequencing:**

```
Before any Phase 3 feature work:
  Engineer: Phase 2 debt (1 point)
  CEO: Confirm Phase 2 P2 status (Inbox Triage, Inbox Alert, AI Chat — which shipped?)
  CEO: Add EnergyLevel property to Daily Log Notion database

Phase 3 Week 1:
  Feature 1 (AI Inbox Triage) — M, 3.5 points total

Phase 3 Week 2:
  Feature 2 (Energy Check-In) — M, 1.25 points total

Phase 3 Week 3+ (data-gated):
  Feature 3 (Week-on-Week) — M, 1.25 points total
  Gate condition: >= 3 weekly reviews logged in Notion
```

---

## 6. New Environment Variables

| Var | Where | Notes |
|-----|-------|-------|
| `OPENROUTER_MODEL` | Vercel | Optional. Default: `anthropic/claude-sonnet-4-5`. Allows model swap without code change. |
| `NOTION_DAILY_LOG_DB_ID` | Vercel | Required for Feature 2. If already set from MVP, confirm the property name matches `EnergyLevel`. |

All other env vars are already present from Phase 1/2.

---

## 7. Phase 3 Acceptance Criteria

- [ ] CEO can tap "Get AI suggestions" on inbox and receive priority + action per item
- [ ] Accepting suggestions in bulk writes to Notion correctly — confirmed via Notion UI spot-check
- [ ] If AI returns malformed output, UI shows "Suggestions unavailable" — no crash
- [ ] Energy check-in appears in morning briefing banner, saves in one tap
- [ ] Briefing headline adapts correctly for all three energy ranges (manual test: set 1, 3, 5)
- [ ] `GET /api/weekly-review/history` returns correct data after 3+ reviews exist
- [ ] Sparklines render correctly in weekly review screen
- [ ] Phase 2 debt: focusBlockCount live fallback returns real value from Focus Sessions DB
- [ ] Phase 2 debt: parkInbox=true bulk-parks all unassigned inbox items
- [ ] All Phase 2 features continue working without regression
