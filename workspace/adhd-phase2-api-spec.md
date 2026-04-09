# Phase 2 API Spec: Weekly Review Routes + CreativAI Page

**Version:** 1.0
**Author:** CTO
**Issue:** [FOU-196](/FOU/issues/FOU-196)
**Date:** 2026-04-04
**Status:** Final — approved for implementation

---

## Part 1 — ADHD Weekly Review API Routes

All three routes are already implemented in `makinsonmjttrt/adhd-ef-system`. This document records the as-built spec for the Engineer's reference and confirms what still needs attention.

---

### Route 1: `POST /api/webhooks/weekly-review`

**File:** `app/api/webhooks/weekly-review/route.ts`

**Purpose:** Receives the pre-computed weekly payload from n8n WF-05 on Sunday at 18:00. Caches it in memory for the dashboard to serve instantly.

**Auth:** `X-Webhook-Secret` header, value must match `ADHD_WEBHOOK_SECRET` env var.
- In production: request is rejected with 401 if header is absent or wrong.
- In development (`NODE_ENV !== 'production'`): secret check is skipped.

**Request:**

```
POST /api/webhooks/weekly-review
Content-Type: application/json
X-Webhook-Secret: <ADHD_WEBHOOK_SECRET>
```

```json
{
  "weekEnding": "2026-04-05",
  "generatedAt": "2026-04-05T18:00:00.000Z",
  "completedTasks": [
    { "id": "notion-page-id", "name": "Task name", "completedAt": "2026-04-03" }
  ],
  "completedCount": 4,
  "stuckTasks": [
    { "id": "notion-page-id", "name": "Task name", "daysOpen": 9 }
  ],
  "stuckCount": 2,
  "focusBlockCount": 3
}
```

Required fields: `weekEnding` (ISO date string), `generatedAt` (ISO datetime string). All array/count fields default to empty/0 if absent.

**Response (200):**

```json
{ "success": true, "cached": true }
```

**Error responses:**

| Status | Condition |
|--------|-----------|
| 401 | Secret header absent or wrong |
| 400 | Body is not valid JSON, or `weekEnding`/`generatedAt` are missing |
| 500 | `ADHD_WEBHOOK_SECRET` env var not set in production |

**Storage mechanism:** In-memory module-level variable in `lib/weekly-review-cache.ts`. Persists for the lifetime of the Vercel function instance. Acceptable trade-off: n8n re-fires every Sunday so the cache self-heals. No database write at this step.

---

### Route 2: `GET /api/weekly-review/latest`

**File:** `app/api/weekly-review/latest/route.ts`

**Purpose:** Returns the current week's review data to the dashboard. Prefers the cached n8n payload; falls back to a live Notion query when no payload exists.

**Auth:** None. Vercel deployment auth (password/email) covers the whole app.

**Request:**

```
GET /api/weekly-review/latest
```

No parameters.

**Response (200) — cache hit:**

```json
{
  "source": "cache",
  "weekEnding": "2026-04-05",
  "generatedAt": "2026-04-05T18:00:00.000Z",
  "completedTasks": [...],
  "completedCount": 4,
  "stuckTasks": [...],
  "stuckCount": 2,
  "focusBlockCount": 3
}
```

**Response (200) — live fallback:**

```json
{
  "source": "live",
  "weekEnding": "2026-04-06",
  "generatedAt": "2026-04-04T10:00:00.000Z",
  "completedTasks": [...],
  "completedCount": 2,
  "stuckTasks": [...],
  "stuckCount": 1,
  "focusBlockCount": 0
}
```

**Live fallback behaviour:**
- `completedTasks`: Queries Notion Tasks DB for tasks with Status=Complete and Last Touched >= 7 days ago (max 10, newest first).
- `stuckTasks`: Queries Notion Tasks DB for tasks with Status not in [Complete, Cancelled, Parked, Deleted] and Last Touched <= 7 days ago (max 5, oldest first).
- `focusBlockCount`: Returns 0. The Focus Sessions DB is not yet wired to the live fallback. This is populated by n8n via the webhook — it is not a regression, it is a known v1 gap.
- `weekEnding`: Computed as the coming Sunday (or today if today is Sunday).

**Error responses:**

| Status | Condition |
|--------|-----------|
| 500 | Notion query fails; message: "Failed to fetch weekly review data" |

---

### Route 3: `POST /api/weekly-review/submit`

**File:** `app/api/weekly-review/submit/route.ts`

**Purpose:** Called when the user taps "Close the week". Saves the intention to Notion, parks selected stuck tasks, and returns a confirmation.

**Auth:** None. Vercel deployment auth covers the app.

**Request:**

```
POST /api/weekly-review/submit
Content-Type: application/json
```

```json
{
  "weekEnding": "2026-04-05",
  "intention": "Ship the weekly review feature",
  "parkedTaskIds": ["notion-page-id-1"],
  "carriedForwardTaskIds": ["notion-page-id-2"],
  "parkInbox": false,
  "focusBlockCount": 3,
  "completedCount": 4,
  "stuckCount": 2
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `weekEnding` | ISO date string | No | Defaults to today if absent |
| `intention` | string | No | Max 280 chars. Trimmed server-side. |
| `parkedTaskIds` | string[] | No | Notion page IDs of tasks to park. Each is PATCH'd to Status="Parked". |
| `carriedForwardTaskIds` | string[] | No | Received but no server action — carry forward = no status change. |
| `parkInbox` | boolean | No | **Received but not yet implemented.** When true, intent is to bulk-park all inbox tasks. This is a v1 gap. Do not ship the UI checkbox as active until this is implemented. |
| `focusBlockCount` | number | No | Passed through to the Notion Weekly Review record. |
| `completedCount` | number | No | Passed through to the Notion Weekly Review record. |
| `stuckCount` | number | No | Passed through to the Notion Weekly Review record. |

**Server actions:**

1. Parks each task in `parkedTaskIds` via `PATCH https://api.notion.com/v1/pages/{id}` (Status → "Parked"). Uses `Promise.allSettled` — individual park failures are counted but do not abort the submission.
2. Creates a new page in the Weekly Reviews Notion database (`NOTION_WEEKLY_REVIEWS_DB_ID`). Properties written: `Name`, `WeekEndingDate`, `Intention`, `FocusBlockCount`, `TasksCompleted`, `TasksStuck`. If `NOTION_WEEKLY_REVIEWS_DB_ID` is not set, this step is skipped silently and `reviewId` in the response is null.

**Response (200):**

```json
{
  "success": true,
  "weekEnding": "2026-04-05",
  "reviewId": "notion-page-id-or-null",
  "parkErrors": 0,
  "message": "Week closed. See you Monday."
}
```

`parkErrors` is the count of individual park operations that failed (int, 0 = all succeeded).

**Error responses:**

| Status | Condition |
|--------|-----------|
| 500 | Unhandled exception; message: "Failed to submit weekly review" |

---

### Required Env Vars (Weekly Review)

| Var | Where | Notes |
|-----|-------|-------|
| `ADHD_WEBHOOK_SECRET` | Vercel + n8n | Shared secret. Already used by daily briefing webhook. |
| `NOTION_WEEKLY_REVIEWS_DB_ID` | Vercel | New database, must be created manually first (see `workspace/adhd-notion-schema-setup.md`). If absent, submit silently skips the Notion write. |
| `ADHD_WEEKLY_REVIEW_WEBHOOK_URL` | n8n only | URL for n8n WF-05 to POST to. Value: `https://adhd-ef-system.vercel.app/api/webhooks/weekly-review` |

---

### Known Gaps (Engineer action required before Phase 2 is complete)

| Gap | Impact | Fix |
|-----|--------|-----|
| `focusBlockCount` is always 0 in live fallback | Focus block stat shows 0 when cache is cold | Wire `getCtx()` Focus Sessions DB to live fallback, or accept n8n as sole source |
| `parkInbox: true` received but not actioned | UI checkbox for "park all inbox" does nothing server-side | Implement bulk park in submit route before enabling the UI checkbox |

---

## Part 2 — CreativAI Landing Page

**Website:** fourpointzero.io (not the ADHD dashboard)
**Copy source:** `workspace/creativai-page-copy.md` ([FOU-195](/FOU/issues/FOU-195))

---

### URL Decision: `/creativai`

Use `/creativai`, not `/services/creativai`.

Reasons:
- The copy document already references "fourpointzero.io/creativai" as the canonical URL.
- FPZ does not have an established `/services` hierarchy. Adding it now creates redirect debt and a category layer with only one member.
- Short URLs perform better in shared/printed form.
- If a `/services` section is added later, a 301 redirect from `/creativai` → `/services/creativai` is trivial.

---

### Page Type: Static Server Component

Next.js App Router page. No `generateStaticParams` required — this is a fixed URL, not a dynamic segment.

```
app/
  creativai/
    page.tsx     ← the page
```

The page is a Server Component (the default). No `'use client'` directive. All content is static copy, no interactivity beyond the CTA link.

Next.js will pre-render this page as static HTML at build time automatically. No configuration needed.

**No API calls.** All seven sections (hero, hiring challenge, what we do, who we work with, why, how it works, CTA) are static text. No Notion queries, no dynamic data.

---

### Metadata

Export a `metadata` object from `app/creativai/page.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'AI Executive Search for Creative Production | CreativAI',
  description: 'CreativAI places senior AI leaders at VFX studios and creative tech companies. Retained executive search, 8–12 week shortlists. Book a 15-min call.',
  openGraph: {
    title: 'AI Executive Search for Creative Production | CreativAI',
    description: 'CreativAI places senior AI leaders at VFX studios and creative tech companies. Retained executive search, 8–12 week shortlists. Book a 15-min call.',
    url: 'https://fourpointzero.io/creativai',
    type: 'website',
    images: [
      {
        url: '/og-creativai.jpg',  // confirm asset name with CEO
        width: 1200,
        height: 630,
        alt: 'CreativAI — AI Executive Search for Creative Production',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Executive Search for Creative Production | CreativAI',
    description: 'CreativAI places senior AI leaders at VFX studios and creative tech companies. Retained executive search, 8–12 week shortlists. Book a 15-min call.',
  },
  alternates: {
    canonical: 'https://fourpointzero.io/creativai',
  },
};
```

**OG image note:** The image `/og-creativai.jpg` is a placeholder name. CEO to confirm the actual asset. Minimum size 1200×630px. If no custom image exists at launch, fall back to the FPZ default OG image.

---

### JSON-LD Schema

Add a `ProfessionalService` JSON-LD block for AI search engine discoverability. Inline in the page component via a `<Script>` tag with `type="application/ld+json"`:

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "CreativAI",
  "description": "Specialist executive search practice for AI leadership roles in creative production. Placing CAIOs, Heads of AI Production, Creative Technology Directors, and senior ML engineering leads.",
  "url": "https://fourpointzero.io/creativai",
  "parentOrganization": {
    "@type": "Organization",
    "name": "FourPointZero",
    "url": "https://fourpointzero.io"
  },
  "areaServed": ["United Kingdom", "United States"],
  "serviceType": "Executive Search",
  "knowsAbout": [
    "AI executive search",
    "Creative production",
    "VFX recruitment",
    "Virtual production",
    "Creative technology leadership"
  ]
}
```

---

### Page Structure (section map)

The Engineer does not need to invent the content hierarchy. Build these sections in order, styled to match the existing FPZ website design:

| Section | Type | Content source |
|---------|------|---------------|
| Hero | H1 + paragraph | Copy doc § 1 |
| Hiring challenge | H2 + paragraph | Copy doc § 2 |
| What we do | H2 + paragraph | Copy doc § 3 |
| Who we work with | H2 + 4× subsections | Copy doc § 4 |
| Why CreativAI | H2 + 3× bold-lead paragraphs | Copy doc § 5 |
| How it works | H2 + 3× steps + fee note | Copy doc § 6 |
| CTA | CTA block + disclaimer | Copy doc § 7 + footer |

The CTA `[Book a 15-minute call](#contact)` anchor link — coordinate with CEO on whether this is an inline Calendly embed, a mailto link, or a contact form anchor. The anchor `#contact` is a placeholder.

---

### Implementation checklist for Engineer

- [ ] Create `app/creativai/page.tsx` as Server Component
- [ ] Export `metadata` object per spec above
- [ ] Add JSON-LD `<Script>` block
- [ ] Implement all seven copy sections from `workspace/creativai-page-copy.md`
- [ ] Confirm OG image asset name and path with CEO before launch
- [ ] Confirm CTA anchor/link target with CEO
- [ ] Run `next build` to verify static generation (no red errors)
- [ ] Check page appears at `/creativai` in preview deployment

---

## Delegation Note

The three weekly review routes are already implemented. The Engineer's job is to:

1. Verify routes are working end-to-end in the deployed environment once `NOTION_WEEKLY_REVIEWS_DB_ID` is set (tracked under FOU-66 / Vercel env var setup).
2. Implement the `parkInbox` server logic in `submit/route.ts` when the UI checkbox is activated.
3. Build the CreativAI page per the spec above.

No new routing architecture is needed. All weekly review routes follow the same in-memory cache + Notion write pattern as the daily briefing.
