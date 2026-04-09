# ADHD Executive Function System — n8n Workflows: Master Setup Guide

**Three workflows. One guide. Set up all three in a single sitting.**

| Workflow | File | Trigger | Purpose |
|---|---|---|---|
| WF-01: Daily Briefing | `n8n-daily-briefing.workflow.json` | Daily 07:30 | Queries today's tasks and emails a briefing |
| WF-02: Weekly Review | `n8n-weekly-review.workflow.json` | Sunday 18:00 | Summarises the week and logs to Notion |
| WF-03: Inbox Alert | `n8n-inbox-alert.workflow.json` | Daily 07:50 | Alerts when uncategorised task count exceeds 20 |

**Activation order: WF-01 → WF-03 → WF-02**
WF-02 requires a Notion schema change (the `Completed` date property). Do it last.

---

## Prerequisites

### n8n version

n8n **1.x** or later. All nodes use APIs available in 1.x. If you're on 0.x, upgrade before proceeding.

### Credentials you will need

Two credentials, both reused across all three workflows:

1. **Notion Internal Integration token** — an API key from [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. **Microsoft Outlook OAuth2** — your Outlook account (mart@fourpointzero.co.uk) connected via n8n's OAuth flow

### Workflow files

All three JSON files are in the `workspace/` directory of this repository:
- `workspace/n8n-daily-briefing.workflow.json`
- `workspace/n8n-weekly-review.workflow.json`
- `workspace/n8n-inbox-alert.workflow.json`

---

## Step 1: Set Up Credentials in n8n

Do this once. All three workflows share the same credentials.

### 1a. Notion Internal Integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **New integration** → name it `ADHD System` → select your workspace
3. Copy the **Internal Integration Token** (starts with `secret_...`)
4. In n8n, go to **Credentials → Add credential**
5. Search for **Header Auth**
6. Set:
   - **Name:** `Notion Internal Integration`
   - **Name (header field):** `Authorization`
   - **Value:** `Bearer secret_YOUR_TOKEN_HERE`
7. Save

Then grant the integration access to your Tasks database:
1. Open your Notion Tasks database
2. Click `...` (top right) → **Connections** → find your integration → **Confirm**

### 1b. Microsoft Outlook OAuth2

1. In n8n, go to **Credentials → Add credential**
2. Search for **Microsoft Outlook**
3. Click **Connect** and follow the OAuth flow to authorise mart@fourpointzero.co.uk
4. Set the credential name to: `Mart`
5. Save

---

## Step 2: Set Environment Variables

Go to **Settings → Environment Variables** in n8n (or add to your `.env` file if self-hosted).

### Required for WF-01 and WF-03

| Variable | Value | Notes |
|---|---|---|
| `ADHD_WEBHOOK_SECRET` | A secret string you choose | Used to authenticate webhook calls to the dashboard. Keep it private. |

### Required for WF-02 (set before activating WF-02)

| Variable | Value | Notes |
|---|---|---|
| `WEEKLY_REVIEWS_DB_ID` | Your Weekly Reviews Notion database ID | See Step 5 for how to create this database and find its ID |
| `FOCUS_SESSIONS_DB_ID` | Your Focus Sessions Notion database ID | Copy from the URL of your Focus Sessions database |

### Optional (fall back to production defaults if not set)

| Variable | Default value used |
|---|---|
| `ADHD_DASHBOARD_WEBHOOK_URL` | `https://adhd-ef-system.vercel.app/api/webhooks/daily-briefing` |
| `ADHD_WEEKLY_REVIEW_WEBHOOK_URL` | `https://adhd-ef-system.vercel.app/api/webhooks/weekly-review` |

---

## Step 3: Import and Activate WF-01 (Daily Briefing)

### Import

1. In n8n, go to **Workflows → New workflow** (top right)
2. Click the `...` menu → **Import from file**
3. Select `workspace/n8n-daily-briefing.workflow.json`
4. Save the workflow. **Do not activate yet.**

### Credential check

- Open the **Query Today's Tasks** node → confirm `Notion Internal Integration` is selected
- Open the **Send Briefing Email** node → confirm `Mart` (Outlook) is selected

### Test run

1. Click **Execute Workflow**
2. Check each node:

| Node | Expected output |
|---|---|
| Daily 07:30 | Triggered manually |
| Query Today's Tasks | `results` array (may be empty — that's fine) |
| Build Briefing Payload | JSON with `date`, `taskCount`, `overdueCount`, `todayCount` |
| Push to Dashboard | HTTP 200 (or a 4xx — continue on error is enabled, so this won't block) |
| Send Briefing Email | Email arrives at mart@fourpointzero.co.uk |

3. Confirm the email arrives before activating.

### Activate

Toggle the workflow to **Active**.
WF-01 now fires every weekday morning at 07:30 London time.

---

## Step 4: Import and Activate WF-03 (Inbox Alert)

WF-03 requires no new credentials or environment variables. It reuses what you set up in Steps 1 and 2.

### Import

1. In n8n, go to **Workflows → New workflow → Import from file**
2. Select `workspace/n8n-inbox-alert.workflow.json`
3. Save. **Do not activate yet.**

### Credential check

- Open the **Query Uncategorised Tasks** node → confirm `Notion Internal Integration` is selected
- Open the **Send Inbox Alert** node → confirm `Mart` (Outlook) is selected

### Test run

1. Click **Test workflow** (or **Execute Workflow**)
2. Inspect the **Count Items** node output — it shows how many uncategorised tasks exist
3. If the count is 20 or below, no email is sent. That is correct behaviour.
4. To force a test email: temporarily change `value2` in the **Inbox Over Threshold** node from `20` to `0`, run the test, then revert it back to `20`.

### Activate

Toggle the workflow to **Active**.
WF-03 now runs every morning at 07:50 — 20 minutes after the daily briefing.

---

## Step 5: Prepare Notion for WF-02 (Weekly Review)

> **Important:** WF-02 filters completed tasks using a `Completed` date property that does not exist in Notion by default. If this property is missing, the workflow will run but return zero completed tasks every week regardless of actual completions. Do this step before importing WF-02.

### 5a. Add the `Completed` date property to the Tasks database

1. Open your Notion Tasks database (`2915456c-327f-80d8-83b4-000b8bc03128`)
2. Click **+** to add a new property
3. Set:
   - **Type:** Date
   - **Name:** `Completed` (capital C, exact spelling)
4. Save

Going forward: when you mark a task as complete in the dashboard or manually, write the completion date to this field.

### 5b. Create the Weekly Reviews database

Create a new full-page Notion database with these properties:

| Property name | Type |
|---|---|
| Name | Title (default) |
| WeekEndingDate | Date |
| Intention | Text |
| FocusBlockCount | Number |
| TasksCompleted | Number |
| TasksStuck | Number |

Property names are **case-sensitive**. Copy them exactly.

After creating it:
1. Copy the database ID from the URL: `https://www.notion.so/yourworkspace/**DATABASE_ID**?v=...` (the 32-character string before the `?`)
2. Grant your integration access: open the database → `...` → **Connections** → add `ADHD System`
3. Add it as the `WEEKLY_REVIEWS_DB_ID` environment variable in n8n

### 5c. Confirm Focus Sessions database ID

1. Open your Focus Sessions database in Notion
2. Copy the database ID from the URL using the same method
3. Add it as the `FOCUS_SESSIONS_DB_ID` environment variable in n8n

---

## Step 6: Import and Activate WF-02 (Weekly Review)

### Import

1. In n8n, go to **Workflows → New workflow → Import from file**
2. Select `workspace/n8n-weekly-review.workflow.json`
3. Save. **Do not activate yet.**

### Credential check

- Open the **Get Completed Tasks** node → confirm `Notion Internal Integration` is selected
- Open the **Send Summary Email** node → confirm `Mart` (Outlook) is selected
- All other Notion nodes share the same credential automatically

### Test run

1. Click **Execute Workflow**
2. Check each node:

| Node | Expected output |
|---|---|
| Get Completed Tasks | `results` array (empty if no tasks completed this week and `Completed` field unpopulated) |
| Get Stuck Tasks | `results` array of tasks open for more than 7 days |
| Get Focus Sessions | `results` array (or graceful error if `FOCUS_SESSIONS_DB_ID` not set — execution continues) |
| Build Weekly Payload | JSON with `weekEnding`, `completedCount`, `stuckCount`, `focusBlockCount` |
| Push to Dashboard | HTTP 200 (or 4xx — continue on error is enabled) |
| Send Summary Email | Email arrives at mart@fourpointzero.co.uk |
| Log to Notion | New record created in Weekly Reviews database |

3. Confirm the email arrives and the Notion log record appears before activating.

### Activate

Toggle the workflow to **Active**.
WF-02 now fires every Sunday at 18:00 London time.

---

## Environment Variable Reference (Complete)

| Variable | Required | Used by | Description |
|---|---|---|---|
| `ADHD_WEBHOOK_SECRET` | Yes | WF-01, WF-02 | Authenticates webhook calls to the dashboard |
| `WEEKLY_REVIEWS_DB_ID` | Yes | WF-02 | Notion ID of the Weekly Reviews database |
| `FOCUS_SESSIONS_DB_ID` | Yes | WF-02 | Notion ID of the Focus Sessions database |
| `ADHD_DASHBOARD_WEBHOOK_URL` | No | WF-01 | Falls back to production URL if not set |
| `ADHD_WEEKLY_REVIEW_WEBHOOK_URL` | No | WF-02 | Falls back to production URL if not set |

---

## Troubleshooting

### 1. "Query Today's Tasks" or any Notion node returns 401

The Notion integration token is wrong or expired.
- In n8n, go to **Credentials** → open `Notion Internal Integration`
- Confirm the `Value` field is `Bearer secret_YOUR_TOKEN` (including the `Bearer ` prefix)
- Regenerate the token at notion.so/my-integrations if needed

### 2. Outlook email not received (any workflow)

The `Mart` Outlook OAuth2 token has expired.
- In n8n, go to **Credentials** → open `Mart`
- Click **Reconnect** and re-authorise via the OAuth flow
- Re-run the test after reconnecting

### 3. WF-02 shows 0 completed tasks despite completions this week

The `Completed` date property is missing or unpopulated in Notion.
- Confirm the property exists with the exact name `Completed` (capital C)
- Check that recent completed tasks have the `Completed` field filled in
- The filter requires `Status = "Complete"` AND `Completed date` within the last 7 days — both conditions must be true

### 4. WF-02 Log to Notion fails with 400

The `WEEKLY_REVIEWS_DB_ID` is wrong, or the database property names do not match.
- Confirm the ID is the 32-character string from the Notion URL (no hyphens)
- Check each property name against the table in Step 5b — names are case-sensitive
- Confirm the integration has access to the database (via Connections)

### 5. WF-03 never sends an email

Either the uncategorised task count is at or below 20, or the Notion query is not matching.
- Run the workflow manually and inspect the **Count Items** node output
- If count is 0 unexpectedly: confirm the Tasks database has a `Status` select property with value `To Do` (exact case)
- If count shows correctly but no email: check the **Inbox Over Threshold** node threshold is set to `20`
- To force a test email, temporarily set threshold to `0`, run, then revert

---

## Workflow Summary

```
WF-01: Daily Briefing (07:30 daily)
  → Notion Tasks DB query (due today or overdue, not Complete/Cancelled)
  → Build email payload
  → POST to dashboard webhook
  → Send email to mart@fourpointzero.co.uk

WF-03: Inbox Alert (07:50 daily, 20 min after WF-01)
  → Notion Tasks DB query (Status=To Do, Priority=empty)
  → Count results
  → IF count > 20: send alert email
  → IF count ≤ 20: no action

WF-02: Weekly Review (Sunday 18:00)
  → Get completed tasks (Status=Complete, Completed date in last 7 days)
  → Get stuck tasks (not Complete/Cancelled, created 7+ days ago)
  → Get focus sessions (from Focus Sessions DB)
  → Build summary payload
  → POST to dashboard webhook
  → Send summary email to mart@fourpointzero.co.uk
  → Log record to Weekly Reviews DB in Notion
```
