# ADHD System — Weekly Review Screen & Automation Spec

**Version:** 1.0
**Issue:** [FOU-114](/FOU/issues/FOU-114)
**Depends on:** [FOU-38](/FOU/issues/FOU-38) (daily briefing architecture)
**Status:** Draft

---

## 1. Purpose

The weekly review is a Sunday evening (or Monday morning) ritual that closes the previous week and sets direction for the next one. For ADHD, its value is not in the detail but in the ritual: a structured pause that prevents the week from becoming an undifferentiated blur.

The screen must answer three questions in under five minutes:
1. What actually got done?
2. What got stuck and why?
3. What is the one thing that matters most next week?

---

## 2. UX Description (Non-Technical)

### When It Appears

The weekly review banner appears on the dashboard from **Sunday 6pm until Monday 9am**. It replaces the daily briefing banner in that window. Outside that window, it is hidden.

A small badge on the nav reads "Weekly Review" during this window so it is impossible to miss.

### Screen Layout

The screen has five sections, presented one at a time on mobile (step-by-step) and all at once on desktop:

---

#### Section A — This Week's Wins

A simple read-only list of tasks completed in the past 7 days, pulled automatically from Notion.

- Each item is a single line: task name + the day it was completed.
- Maximum 10 items shown. If more than 10 completed, show the 10 most recent.
- If nothing was completed: show a neutral message: "Nothing logged as complete this week. That's data, not failure."

No interaction required. Just read it and move on.

---

#### Section B — What Got Stuck

A read-only list of tasks that were active or overdue during the past 7 days but are still not complete.

- Each item shows: task name + how many days it has been open.
- Maximum 5 items shown (most overdue first).
- Next to each item, two buttons: **Carry forward** (keep it in the active list) or **Park it** (move it to a "Parked" status in Notion — out of sight, but not deleted).

This is the only interactive part of the review that touches individual tasks.

---

#### Section C — Focus Block Adherence

A single stat: "You completed X focus blocks this week."

- No judgement, no comparison to previous weeks (in v1).
- If X = 0: "No focus blocks logged. Consider scheduling one early next week."
- If X ≥ 3: "Good week for focused work."

Read-only. One sentence.

---

#### Section D — Next Week's Intention

A single free-text field:

> "What is the one thing that matters most next week?"

Character limit: 280. No markdown, no rich text. Plain sentence.

This is not a to-do list. It is a compass. One thing.

Below the field, a checkbox: **"Park everything not on my active list"**

If checked, all tasks currently in the Notion inbox that are not assigned a priority will be bulk-moved to "Parked" status. This is an optional nuclear option for clearing mental clutter.

---

#### Section E — Submit

A single button: **"Close the week"**

On tap/click:
- Saves the intention text to the Weekly Review Notion database
- Applies any carry-forward / park decisions from Section B
- Optionally triggers the inbox park if Section D checkbox was ticked
- Shows a confirmation: "Week closed. See you Monday."
- Banner disappears from the dashboard until next Sunday 6pm

---

### Mobile Behaviour

On mobile (iPhone Safari primary), the sections are presented as a stepped flow:

1. Screen 1: Section A (This Week's Wins) — tap "Next"
2. Screen 2: Section B (What Got Stuck) — make carry/park decisions — tap "Next"
3. Screen 3: Section C (Focus Adherence) — tap "Next"
4. Screen 4: Section D (Intention) — type intention — tap "Close the Week"
5. Confirmation screen

Progress indicator at top (dots, 4 steps). Back button on steps 2–4.

---

## 3. Data Sources (Notion)

### Existing Databases Used

| Database | Purpose | Fields Read |
|----------|---------|-------------|
| `Tasks` (DB: `2915456c-327f-80d8-83b4-000b8bc03128`) | Source of truth for all tasks | `Name`, `Status`, `Priority`, `Due`, `CreatedAt`, `CompletedAt` |
| `Focus Sessions` | Log of timed focus blocks | `StartTime`, `Duration`, `Status` |

### New Database Required

| Database | Purpose | Fields |
|----------|---------|--------|
| `Weekly Reviews` | One record per weekly review session | `WeekEndingDate` (date), `Intention` (rich text), `CreatedAt` (date), `FocusBlockCount` (number), `TasksCompleted` (number), `TasksStuck` (number) |

This is a new Notion database that must be created before the feature is built. The Notion integration token already configured on the system needs read/write access to it.

---

## 4. Key Queries

### What Got Done (Section A)

```
Filter: Status = "Complete"
Filter: CompletedAt >= [7 days ago]
Sort: CompletedAt DESC
Limit: 10
```

`CompletedAt` is not currently a standard field in the Tasks database. This field needs adding as a `Date` property named `Completed` in Notion before this feature works. When a task is marked complete via the dashboard or n8n, this field gets written.

### What Got Stuck (Section B)

```
Filter: Status IN ["To Do", "In Progress"]
Filter: CreatedAt <= [7 days ago]  (task has been open at least a week)
Sort: CreatedAt ASC (oldest first)
Limit: 5
```

### Focus Block Count (Section C)

```
Filter: StartTime >= [start of past week (Monday 00:00)]
Filter: StartTime <= [end of past week (Sunday 23:59)]
Filter: Status = "Completed"
Count: result rows
```

---

## 5. n8n Automation Spec

### Workflow: Weekly Review Aggregator (WF-05)

**Trigger:** Schedule node — `0 18 * * 0` (Sunday at 18:00, Europe/London timezone)

**Purpose:** Aggregates the past week's data from Notion and pushes a pre-computed payload to the Next.js dashboard endpoint. This means the weekly review screen loads instantly — no live Notion queries when the user opens it.

---

#### Node Sequence

```
[Schedule Trigger]
    ↓
[Get Completed Tasks]        ← Notion query: Tasks completed in past 7 days
    ↓
[Get Stuck Tasks]            ← Notion query: Tasks open ≥ 7 days
    ↓
[Get Focus Sessions]         ← Notion query: Focus blocks in past 7 days
    ↓
[Build Weekly Payload]       ← Code node: format all data into payload
    ↓
[Push to Dashboard]          ← HTTP POST to /api/webhooks/weekly-review
    ↓ (continues on error)
[Send Summary Email]         ← Outlook node: brief notification
    ↓
[Log to Notion]              ← Notion create: new Weekly Reviews record
```

---

#### Node Specs

**[Schedule Trigger]**
- Type: Schedule
- Cron expression: `0 18 * * 0`
- Timezone: `Europe/London`

---

**[Get Completed Tasks]**
- Type: Notion node
- Operation: Query a database
- Database ID: `2915456c-327f-80d8-83b4-000b8bc03128`
- Filter (JSON):
```json
{
  "and": [
    { "property": "Status", "select": { "equals": "Complete" } },
    { "property": "Completed", "date": { "on_or_after": "{{$now.minus({days: 7}).toISO()}}" } }
  ]
}
```
- Sort: `Completed` descending
- Page size: 10
- Credentials: `Notion Internal Integration`

---

**[Get Stuck Tasks]**
- Type: Notion node
- Operation: Query a database
- Database ID: `2915456c-327f-80d8-83b4-000b8bc03128`
- Filter (JSON):
```json
{
  "and": [
    { "property": "Status", "select": { "does_not_equal": "Complete" } },
    { "property": "Status", "select": { "does_not_equal": "Cancelled" } },
    { "property": "created_time", "date": { "on_or_before": "{{$now.minus({days: 7}).toISO()}}" } }
  ]
}
```
- Sort: `created_time` ascending
- Page size: 5

---

**[Get Focus Sessions]**
- Type: Notion node
- Operation: Query a database
- Database ID: `[FOCUS_SESSIONS_DB_ID]` (to be confirmed from existing Focus Sessions database)
- Filter (JSON):
```json
{
  "and": [
    { "property": "Status", "select": { "equals": "Completed" } },
    { "property": "StartTime", "date": { "on_or_after": "{{$now.startOf('week').toISO()}}" } },
    { "property": "StartTime", "date": { "on_or_before": "{{$now.toISO()}}" } }
  ]
}
```

---

**[Build Weekly Payload]**
- Type: Code node (JavaScript)
- Output format:
```json
{
  "weekEnding": "2026-04-05",
  "generatedAt": "2026-04-05T18:00:00.000Z",
  "completedTasks": [
    { "id": "...", "name": "Task name", "completedAt": "2026-04-03" }
  ],
  "completedCount": 4,
  "stuckTasks": [
    { "id": "...", "name": "Task name", "daysOpen": 9 }
  ],
  "stuckCount": 2,
  "focusBlockCount": 3
}
```

---

**[Push to Dashboard]**
- Type: HTTP Request node
- Method: POST
- URL: `{{ $env.ADHD_DASHBOARD_WEBHOOK_URL.replace('/daily-briefing', '/weekly-review') }}`

  Alternatively, add a dedicated env var: `ADHD_WEEKLY_REVIEW_WEBHOOK_URL`
  Default: `https://adhd-ef-system.vercel.app/api/webhooks/weekly-review`

- Headers:
  - `Content-Type: application/json`
  - `X-Webhook-Secret: {{ $env.ADHD_WEBHOOK_SECRET }}`
- Body: `{{ JSON.stringify($json) }}`
- On error: Continue (next node runs regardless)

---

**[Send Summary Email]**
- Type: Microsoft Outlook node
- Credential: `Mart`
- To: `mart@fourpointzero.co.uk`
- Subject: `[ADHD System] Weekly Review Ready — w/e {{ $now.toFormat('dd MMM') }}`
- Body (plain text):
```
Your weekly review is ready.

This week:
- {{ $('Build Weekly Payload').item.json.completedCount }} tasks completed
- {{ $('Build Weekly Payload').item.json.stuckCount }} tasks still open
- {{ $('Build Weekly Payload').item.json.focusBlockCount }} focus blocks

Open your dashboard to complete the review.
https://adhd-ef-system.vercel.app
```

---

**[Log to Notion]**
- Type: Notion node
- Operation: Create a page in database
- Database ID: `[WEEKLY_REVIEWS_DB_ID]` (new database to be created)
- Properties:
  - `WeekEndingDate`: `{{ $now.toFormat('yyyy-MM-dd') }}`
  - `FocusBlockCount`: `{{ $('Build Weekly Payload').item.json.focusBlockCount }}`
  - `TasksCompleted`: `{{ $('Build Weekly Payload').item.json.completedCount }}`
  - `TasksStuck`: `{{ $('Build Weekly Payload').item.json.stuckCount }}`
  - `Intention`: empty at this point — filled by user on dashboard, patched via API on submission

---

### Dashboard Webhook Contract

**New endpoint required:** `POST /api/webhooks/weekly-review`

Follows the same pattern as `/api/webhooks/daily-briefing`:
- Header: `X-Webhook-Secret: <shared secret>`
- Body: payload as above
- Stores the payload (in Notion Daily Log or dedicated cache)
- Makes it available via `GET /api/weekly-review/latest`

**User submission endpoint:** `POST /api/weekly-review/submit`

Called when the user taps "Close the week":
```json
{
  "weekEnding": "2026-04-05",
  "intention": "Ship the weekly review feature",
  "parkedStuckTaskIds": ["notion-page-id-1"],
  "carriedForwardTaskIds": ["notion-page-id-2"],
  "parkInbox": false
}
```

This endpoint:
1. Updates the Weekly Reviews Notion record with the `intention` text
2. Patches stuck task statuses in Notion (parked → `Parked`, carried forward → no change)
3. If `parkInbox: true`, bulk-patches all unassigned inbox tasks to `Parked` status

---

## 6. Integration with Daily Briefing Architecture

The weekly review reuses the following from FOU-38 without modification:

| Component | Reused As-Is |
|-----------|-------------|
| Notion Internal Integration credential | Same credential, same token |
| Microsoft Outlook credential (`Mart`) | Same credential for summary email |
| `ADHD_WEBHOOK_SECRET` env var | Same secret for new webhook endpoint |
| Webhook authentication pattern | Identical `X-Webhook-Secret` header check |
| Error handling pattern | Continue-on-error, execution logged in n8n |

The only new env var required in n8n is `ADHD_WEEKLY_REVIEW_WEBHOOK_URL` (or derive from existing URL).

---

## 7. Pre-Build Checklist

Before implementation begins, the following manual steps are required:

- [ ] Add `Completed` date property to Notion Tasks database
- [ ] Create `Weekly Reviews` database in Notion with fields: `WeekEndingDate`, `Intention`, `FocusBlockCount`, `TasksCompleted`, `TasksStuck`, `CreatedAt`
- [ ] Confirm Focus Sessions database ID (needed for WF-05 node config)
- [ ] Add `ADHD_WEEKLY_REVIEW_WEBHOOK_URL` to n8n environment variables
- [ ] Verify Notion integration token has write access to the new Weekly Reviews database

---

## 8. Out of Scope (v1)

- Week-on-week comparison charts
- Goal tracking beyond the single intention field
- AI-generated review summary (Claude inference on weekly data)
- Push notifications (email only in v1)
- Sharing or exporting the review

---

## 9. Definition of Done

- [ ] Weekly review banner appears on dashboard from Sunday 18:00 to Monday 09:00
- [ ] Section A displays completed tasks from Notion correctly
- [ ] Section B displays stuck tasks and carry/park buttons function
- [ ] Section C displays focus block count
- [ ] Section D accepts and saves intention text
- [ ] "Close the week" submission writes to Notion and dismisses the banner
- [ ] n8n WF-05 fires Sunday 18:00, pushes payload to dashboard, sends email
- [ ] Mobile step-by-step flow works on iPhone Safari
- [ ] CEO completes at least one weekly review end-to-end
