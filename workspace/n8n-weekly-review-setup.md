# ADHD System — Weekly Review n8n Setup Guide (WF-02)

**Workflow file:** `workspace/n8n-weekly-review.workflow.json`
**Trigger:** Every Sunday at 18:00 (Europe/London)
**Depends on:** WF-01 daily briefing credentials already configured

---

## Before You Import

Complete these steps in Notion and n8n before importing the workflow. The import will succeed without them, but the workflow will error on its first run.

### 1. Add `Completed` date property to the Tasks database

In Notion, open the Tasks database (`2915456c-327f-80d8-83b4-000b8bc03128`) and add a new property:
- **Type:** Date
- **Name:** `Completed` (exact spelling, capital C)

When you mark a task as complete via the dashboard or manually, write the completion date to this field.

### 2. Create the Weekly Reviews database

Create a new Notion database (full-page, not inline) with these properties:

| Property name | Type |
|---|---|
| Name | Title (default) |
| WeekEndingDate | Date |
| Intention | Text |
| FocusBlockCount | Number |
| TasksCompleted | Number |
| TasksStuck | Number |

After creating it, copy the database ID from the URL:
`https://www.notion.so/yourworkspace/[DATABASE_ID]?v=...`

The ID is the 32-character alphanumeric string before the `?`.

Make sure your Notion integration token has access to this database (open the database → `...` menu → Connections → add your integration).

### 3. Confirm the Focus Sessions database ID

Open your Focus Sessions database in Notion and copy its ID from the URL using the same method as above.

---

## Environment Variables

Set these in your n8n instance under **Settings → Environment Variables** (or in your `.env` file if self-hosted):

| Variable | Value | Required |
|---|---|---|
| `ADHD_WEBHOOK_SECRET` | Your existing webhook secret from WF-01 | Yes |
| `ADHD_WEEKLY_REVIEW_WEBHOOK_URL` | `https://adhd-ef-system.vercel.app/api/webhooks/weekly-review` | No (falls back to default) |
| `WEEKLY_REVIEWS_DB_ID` | Notion database ID from step 2 | Yes |
| `FOCUS_SESSIONS_DB_ID` | Notion database ID from step 3 | Yes |

`ADHD_WEBHOOK_SECRET` is already set from the daily briefing setup. No change needed there.

---

## Importing the Workflow

1. In n8n, go to **Workflows → New → Import from file**
2. Select `n8n-weekly-review.workflow.json`
3. Save the workflow (do not activate yet)

---

## Credentials Check

The workflow uses the same two credentials as WF-01. Verify they are connected:

1. Open the **Get Completed Tasks** node — confirm `Notion Internal Integration` is selected
2. Open the **Send Summary Email** node — confirm `Mart` (Microsoft Outlook OAuth2) is selected

If either credential is missing, re-link it. All Notion nodes share the same `Notion Internal Integration` credential.

---

## Test Run

Before activating, run it manually to check each node:

1. Open the workflow in n8n
2. Click **Execute Workflow** (top right)
3. Check each node's output:

| Node | What to check |
|---|---|
| Get Completed Tasks | `results` array returned (may be empty if no tasks completed this week) |
| Get Stuck Tasks | `results` array returned |
| Get Focus Sessions | `results` array returned (will error if `FOCUS_SESSIONS_DB_ID` not set — expected) |
| Build Weekly Payload | JSON output with `weekEnding`, `completedCount`, `stuckCount`, `focusBlockCount` fields |
| Push to Dashboard | HTTP 200 response (will fail until the dashboard webhook endpoint is built) |
| Send Summary Email | Email sent to mart@fourpointzero.co.uk |
| Log to Notion | New page created in Weekly Reviews database |

The **Push to Dashboard** node is set to continue on error, so a 404 there will not block the email or Notion log.

---

## Activating

Once the test run passes (email received, Notion record created):

1. Toggle the workflow to **Active**
2. The workflow will now fire automatically every Sunday at 18:00 London time

---

## Empty Week Behaviour

If no tasks were completed in the past 7 days, the email will read:

```
Your weekly review is ready.

This week:
- 0 tasks completed
- N tasks still open
- N focus blocks

Open your dashboard to complete the review.
https://adhd-ef-system.vercel.app
```

The workflow handles this without error.

---

## Troubleshooting

**Get Completed Tasks returns empty results despite completed tasks**
The `Completed` date property may not be populated. Check that completed tasks have the `Completed` date field set.

**Get Focus Sessions fails with 400/404**
The `FOCUS_SESSIONS_DB_ID` env var is not set or the ID is wrong. The node is set to continue on error — focus block count will show 0 rather than halting the workflow.

**Log to Notion fails with 400**
The `WEEKLY_REVIEWS_DB_ID` is not set, or the database property names do not match exactly. Check the Notion database properties against the list in step 2. Property names are case-sensitive.

**Email not received**
Check the `Mart` Outlook credential is still valid (OAuth tokens expire). Re-authenticate via n8n credentials settings if needed.
