# ADHD Executive Function System — Deployment Notes

**App URL:** https://adhd-ef-system.vercel.app
**Repo:** https://github.com/makinsonmjttrt/adhd-ef-system
**Last updated:** 2026-04-04

---

## Environment Variables

All variables are set in the Vercel project under **Settings → Environment Variables**.
Apply to all three environments: Production, Preview, Development.

### App

| Variable | Description |
|----------|-------------|
| `APP_URL` | Full URL of the deployment, e.g. `https://adhd-ef-system.vercel.app` |

### Notion

| Variable | Description |
|----------|-------------|
| `NOTION_TOKEN` | Internal integration token from notion.so/my-integrations (starts with `secret_`) |
| `NOTION_TASKS_DB_ID` | 32-char hex ID of the Tasks database |
| `NOTION_JOURNAL_DB_ID` | 32-char hex ID of the Journal database |
| `NOTION_GUARDRAIL_DB_ID` | 32-char hex ID of the Guardrail database |
| `NOTION_PROFILE_DB_ID` | 32-char hex ID of the Profile database |
| `NOTION_WEEKLY_REVIEWS_DB_ID` | 32-char hex ID of the Weekly Reviews database |

### AI

| Variable | Description |
|----------|-------------|
| `OPENROUTER_API_KEY` | OpenRouter API key for the dashboard AI chat feature |

### Security

| Variable | Description |
|----------|-------------|
| `BASIC_AUTH_USER` | Username for HTTP Basic Auth login prompt |
| `BASIC_AUTH_PASS` | Password for HTTP Basic Auth login prompt |
| `ADHD_WEBHOOK_SECRET` | Secret string for authenticating n8n webhook calls |

### Notifications (optional)

| Variable | Description |
|----------|-------------|
| `PUSHOVER_USER_KEY` | Pushover user key (push notifications) |
| `PUSHOVER_APP_TOKEN` | Pushover app token |
| `NTFY_TOPIC` | ntfy.sh topic name (fallback notification channel) |

---

## Architecture

- **Framework:** Next.js (App Router)
- **Hosting:** Vercel (auto-deploys from main branch of GitHub repo)
- **Persistence:** Notion API (no database — Notion is the data store)
- **AI:** OpenRouter → Claude Sonnet
- **Auth:** HTTP Basic Auth via Next.js Edge Middleware (`middleware.ts`)
- **Notifications:** n8n workflows trigger Pushover/ntfy.sh

## Access Control

The app uses HTTP Basic Auth (`middleware.ts` at repo root). This is a personal tool — not intended to be public. If `BASIC_AUTH_USER` or `BASIC_AUTH_PASS` are not set in Vercel, all requests return 401 by design.

## Deployment Process

Vercel auto-deploys on every push to `main`. No manual deploy steps needed after initial setup.
To trigger a redeploy manually: Vercel Dashboard → project → Deployments → Redeploy latest.

## Notion Database IDs

To find a database ID: open the database in Notion → copy the 32-character hex string from the URL (between the last `/` and the `?v=`).

Each database must also have the ADHD integration connected:
1. Open the database in Notion
2. Click `...` (top right) → **Connections** → confirm the ADHD integration is listed
3. If not: **Add connection** → select the ADHD integration

---

*Produced by FourPointZero tech team.*
