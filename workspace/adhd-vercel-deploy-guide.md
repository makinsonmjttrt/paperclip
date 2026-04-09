# ADHD Executive Function System — Vercel Deployment Guide

**Estimated time:** 30 minutes
**Who this is for:** Martyn — no engineering support needed.
**Result:** Live app at a Vercel URL (or custom subdomain), fully connected to Notion.

---

## Pre-flight Checklist

Before you open Vercel, confirm you have these to hand. You will need them during setup.

| Item | Where to find it | Ready? |
|------|-----------------|--------|
| Notion internal integration token | [notion.so/my-integrations](https://www.notion.so/my-integrations) → your ADHD integration | |
| Notion Tasks database ID | Open the database in Notion → copy ID from the URL (the 32-char hex after the last `/`) | |
| Notion Journal database ID | Same method | |
| Notion Guardrail database ID | Same method | |
| Notion Profile database ID | Same method | |
| Notion Weekly Reviews database ID | Same method | |
| OpenRouter API key | [openrouter.ai/keys](https://openrouter.ai/keys) | |
| GitHub access to `makinsonmjttrt/adhd-ef-system` | Must be logged in as the repo owner | |

**How to get a Notion database ID:**
Open the database in Notion → look at the URL. It looks like:
`https://www.notion.so/yourworkspace/abc123def456...?v=...`
The database ID is the 32-character string before the `?`. Copy it exactly.

---

## Step 1 — Connect the GitHub Repo to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use your GitHub account).
2. Click **Add New → Project**.
3. Under "Import Git Repository", find `makinsonmjttrt/adhd-ef-system` and click **Import**.
4. Vercel auto-detects Next.js. Leave the default settings:
   - Framework: **Next.js**
   - Build command: `npm run build`
   - Output directory: (leave blank — Next.js default)
   - Install command: `npm install`
5. **Do not click Deploy yet.** Go to Step 2 first.

---

## Step 2 — Configure Environment Variables

This is the most important step. The app will not work without these.

In the Vercel project setup screen, scroll down to **Environment Variables**. Add each row below.

### Required — App will not start without these

| Variable Name | What it is |
|---------------|------------|
| `NOTION_TOKEN` | Your Notion internal integration token (starts with `secret_...`) |
| `NOTION_TASKS_DB_ID` | Notion Tasks database ID |
| `NOTION_JOURNAL_DB_ID` | Notion Journal database ID |
| `NOTION_GUARDRAIL_DB_ID` | Notion Guardrail database ID |
| `NOTION_PROFILE_DB_ID` | Notion Profile database ID |
| `NOTION_WEEKLY_REVIEWS_DB_ID` | Notion Weekly Reviews database ID |
| `OPENROUTER_API_KEY` | OpenRouter API key (for the AI chat feature) |
| `APP_URL` | Your Vercel deployment URL — e.g. `https://adhd.fourpointzero.io` or the Vercel subdomain |

### Required for security

| Variable Name | What it is |
|---------------|------------|
| `ADHD_WEBHOOK_SECRET` | A secret string you create — used to authenticate webhook calls from n8n. Use a strong random string (e.g., generate one at [randomkeygen.com](https://randomkeygen.com)) |
| `BASIC_AUTH_USER` | Username for the app login prompt. Choose any username (e.g., `martyn`) |
| `BASIC_AUTH_PASS` | Password for the app login prompt. Use a strong password — this is the only thing protecting the app from public access |

> **Note:** The app now enforces HTTP Basic Auth on all routes. Until `BASIC_AUTH_USER` and `BASIC_AUTH_PASS` are set in Vercel, every request will return a 401 error. Add these two variables first.

### Optional — Notifications (configure if you want push alerts)

| Variable Name | What it is |
|---------------|------------|
| `PUSHOVER_USER_KEY` | Your Pushover user key (from [pushover.net](https://pushover.net)) |
| `PUSHOVER_APP_TOKEN` | Your Pushover application token |
| `NTFY_TOPIC` | Your ntfy.sh topic name (fallback notification channel) |

**How to add each variable in Vercel:**
1. Type the variable name exactly as shown (case-sensitive).
2. Paste the value.
3. Leave the environment checkboxes as **Production, Preview, Development** (all three).
4. Click **Add**.
5. Repeat for all required variables.

---

## Step 3 — Deploy

Once all environment variables are added:

1. Click **Deploy**.
2. Vercel builds and deploys the app. This takes 2–4 minutes.
3. You will see a build log. Green ticks = good. Red X = see Step 7 (Troubleshooting).
4. When done, Vercel shows a **Congratulations** screen with your deployment URL.

Your URL will look like: `https://adhd-ef-system-[random].vercel.app`

---

## Step 4 — Custom Domain (Optional)

If you want the app at `adhd.fourpointzero.io`:

1. In your Vercel project, go to **Settings → Domains**.
2. Type `adhd.fourpointzero.io` and click **Add**.
3. Vercel shows you two DNS records to add.
4. Log in to wherever `fourpointzero.io` DNS is managed (likely Cloudflare, GoDaddy, or your hosting provider).
5. Add both DNS records exactly as Vercel shows them.
6. Wait 5–15 minutes for DNS to propagate. Vercel confirms when it's live.
7. Update your `APP_URL` environment variable to `https://adhd.fourpointzero.io`.
   - Go to **Settings → Environment Variables** → edit `APP_URL`.
   - After saving, trigger a redeploy: **Deployments → latest deployment → Redeploy**.

---

## Step 5 — Verify Notion Access

After deployment:

1. Visit your deployment URL.
2. The dashboard should load with your tasks from Notion.
3. If tasks do not appear: check that your Notion integration is connected to the databases.
   - Open each Notion database → click `...` (top right) → **Connections** → confirm your ADHD integration appears.
   - If not: click **Add connection** and add it.

---

## Step 6 — Post-Deploy Verification Checklist

Visit each URL below (replace the domain with yours):

| Check | URL to visit | Expected result |
|-------|-------------|-----------------|
| Dashboard loads | `https://your-domain.vercel.app/` | Daily briefing view with tasks |
| Task capture | `https://your-domain.vercel.app/` (task add button) | Can add a task |
| Focus timer | Navigate to Focus view | Timer starts/stops |
| Daily review | Navigate to Review view | Review form loads |
| AI chat | Open chat | Responds (uses OpenRouter) |

If all five work: **FOU-66 is done.** Mark it complete.

---

## Step 7 — Common Errors and Fixes

### Build fails with "Module not found" or TypeScript error
- This is a code issue, not a configuration issue.
- Screenshot the error and raise it with the Engineer (FOU team).

### App loads but shows blank or "Internal Server Error"
- Almost always a missing environment variable.
- Go to **Settings → Environment Variables** and check every required variable is present with no typos.
- Trigger a redeploy after fixing.

### "Missing required environment variable: NOTION_TOKEN" in logs
- The `NOTION_TOKEN` env var is missing or empty.
- Check it is added and the value starts with `secret_`.

### Notion data does not load / 500 error on dashboard
- The Notion integration is not connected to the database.
- Follow Step 5 above to connect the integration.
- Also verify the database IDs are correct (no extra spaces, correct 32-char format).

### OpenRouter / AI chat not responding
- Check `OPENROUTER_API_KEY` is set and valid.
- Verify the key has credits at [openrouter.ai/account](https://openrouter.ai/account).

### Custom domain showing "SSL error" or "Invalid certificate"
- Give it 15–30 minutes — SSL provisioning can be slow.
- If still failing after 30 minutes, check the DNS records exactly match what Vercel specified.

---

## Environment Variable Quick-Reference

All required variables in one place for copy-paste into Vercel:

```
NOTION_TOKEN
NOTION_TASKS_DB_ID
NOTION_JOURNAL_DB_ID
NOTION_GUARDRAIL_DB_ID
NOTION_PROFILE_DB_ID
NOTION_WEEKLY_REVIEWS_DB_ID
OPENROUTER_API_KEY
APP_URL
ADHD_WEBHOOK_SECRET
```

---

*Guide produced by the FourPointZero tech team. Last updated: 2026-04-04.*
