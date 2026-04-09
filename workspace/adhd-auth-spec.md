# ADHD EF System — Auth Middleware Spec

**Prepared by:** CTO
**For:** Software Engineer (FOU-70 implementation)
**Date:** 2026-04-04
**Related issues:** [FOU-219](/FOU/issues/FOU-219), [FOU-70](/FOU/issues/FOU-70)

---

## Current State

The app already has HTTP Basic Auth in `middleware.ts`. It uses two env vars:

- `BASIC_AUTH_USER` — username for the login prompt
- `BASIC_AUTH_PASS` — password for the login prompt

If either env var is missing in production, all requests return 401 by design.

There is also one webhook route at `/api/webhooks/weekly-review` that has its own auth via `x-webhook-secret` header using `ADHD_WEBHOOK_SECRET` env var.

---

## Problems With Current Setup

Two critical issues that will break things in production:

**1. Cron jobs will fail.** Vercel invokes cron routes via standard HTTP GET with no Basic Auth headers. The middleware returns 401 before the cron handlers run. All 8 cron routes will silently fail.

**2. n8n webhooks are blocked.** The `/api/webhooks/weekly-review` route has its own `x-webhook-secret` auth, but the Basic Auth middleware intercepts requests before they reach the route handler. n8n cannot call this endpoint without also sending Basic Auth headers — which is non-standard and would require configuring Basic Auth in every n8n HTTP node.

---

## Recommended Approach: Fix the Middleware + CRON_SECRET

**Do not replace HTTP Basic Auth.** It is correct for a single-user personal dashboard. Browser remembers credentials after first login — low friction on both desktop and mobile.

The fix has two parts:

### Part 1 — Update middleware.ts matcher

Exclude cron and webhook API routes from Basic Auth. These routes have their own auth.

Replace the current `config` export in `middleware.ts`:

```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|api/cron|api/webhooks).*)',
  ],
};
```

This is the only change to `middleware.ts`. The Basic Auth logic itself does not change.

### Part 2 — Add CRON_SECRET validation to cron routes

Vercel automatically injects a `CRON_SECRET` env var and sends it as `Authorization: Bearer <CRON_SECRET>` on every cron invocation. Cron routes must validate this header, otherwise anyone who discovers the cron URL can trigger them.

Create a shared utility at `lib/cron-auth.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export function validateCronRequest(request: NextRequest): NextResponse | null {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    // Missing in production is a misconfiguration — block the request.
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Cron secret not configured' }, { status: 500 });
    }
    // In development, allow without secret so local testing works.
    return null;
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  return null; // Authorised — proceed.
}
```

Apply to each cron route. Example for `morning-start`:

```typescript
// Before (no auth):
export async function GET() { ... }

// After (with CRON_SECRET):
import { NextRequest } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';

export async function GET(request: NextRequest) {
  const authError = validateCronRequest(request);
  if (authError) return authError;

  // ... existing handler code unchanged
}
```

Apply this pattern to all 8 cron routes:
- `avoidance-detection`
- `daily-wrap`
- `deadline-check`
- `desk-time-alert`
- `mid-week-check`
- `morning-start`
- `overdue-nudge`
- `weekly-review`

---

## n8n Webhooks

The existing `/api/webhooks/weekly-review` route already has correct auth (`x-webhook-secret` header).

Once the middleware matcher fix is applied, n8n can call webhook routes directly. Configure n8n HTTP Request nodes to include:

```
Header: x-webhook-secret: <value of ADHD_WEBHOOK_SECRET>
```

If new n8n webhook routes are added in future, copy the same auth pattern from `/api/webhooks/weekly-review/route.ts`.

---

## Required Env Vars

| Variable | Where to set | Description |
|----------|-------------|-------------|
| `BASIC_AUTH_USER` | Vercel → Settings → Env Vars | Username for dashboard login |
| `BASIC_AUTH_PASS` | Vercel → Settings → Env Vars | Password for dashboard login (make it strong) |
| `CRON_SECRET` | Vercel → Settings → Env Vars | Vercel auto-generates this on first cron deploy — copy it from the dashboard |
| `ADHD_WEBHOOK_SECRET` | Vercel → Settings → Env Vars | Shared secret between n8n and the webhook routes |

**Note on CRON_SECRET:** Vercel injects this automatically into the runtime environment and sends it as the auth header on cron invocations. You still need to set a value in the Vercel dashboard (Settings → Environment Variables) so the validation logic can read it. Use any strong random string.

---

## Files to Change

| File | Change |
|------|--------|
| `middleware.ts` | Update `config.matcher` to exclude `api/cron` and `api/webhooks` |
| `lib/cron-auth.ts` | Create new utility (shown above) |
| `app/api/cron/avoidance-detection/route.ts` | Add `validateCronRequest` call |
| `app/api/cron/daily-wrap/route.ts` | Add `validateCronRequest` call |
| `app/api/cron/deadline-check/route.ts` | Add `validateCronRequest` call |
| `app/api/cron/desk-time-alert/route.ts` | Add `validateCronRequest` call |
| `app/api/cron/mid-week-check/route.ts` | Add `validateCronRequest` call |
| `app/api/cron/morning-start/route.ts` | Add `validateCronRequest` call |
| `app/api/cron/overdue-nudge/route.ts` | Add `validateCronRequest` call |
| `app/api/cron/weekly-review/route.ts` | Add `validateCronRequest` call |

No other files need to change. The middleware auth logic, webhook auth logic, and all route handlers are correct as-is.

---

## Acceptance Criteria

- Martyn can log in to the dashboard via Basic Auth on desktop and mobile
- Browser remembers credentials after first login (no re-prompt on reload)
- Vercel cron invocations fire successfully (no 401)
- n8n can POST to `/api/webhooks/*` with `x-webhook-secret` header (no 401)
- Any request without valid cron auth to `/api/cron/*` returns 401
- Any request without valid `x-webhook-secret` to `/api/webhooks/*` returns 401
- All pages and API routes (except cron/webhook) require Basic Auth

---

## Estimated Implementation Time

~2 hours for an engineer familiar with the codebase:
- 15 min: middleware matcher update + test locally
- 30 min: `cron-auth.ts` utility + apply to all 8 cron routes
- 15 min: Vercel env var setup
- 60 min: deploy to Vercel + smoke test (cron trigger, n8n test call, dashboard login)

---

*Spec produced by CTO. No further CTO input required for implementation.*
