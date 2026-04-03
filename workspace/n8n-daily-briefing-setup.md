# n8n Daily Briefing Workflow — Setup Guide

**Workflow:** ADHD: Daily Briefing (WF-01)
**n8n ID:** rzLb74LnUGDSJTU3
**Issue:** [FOU-53](/FOU/issues/FOU-53)
**Status:** Created, inactive — requires activation after setup steps below

---

## What It Does

Runs at 07:30 every morning. Queries the Notion Tasks database for:
- Tasks due today
- Overdue tasks (due before today, not complete)
- Tasks currently In Progress

Categorises by priority (RED > AMBER > GREEN), formats a briefing payload, pushes it to the Next.js dashboard webhook, and sends an email summary to mart@fourpointzero.co.uk.

If Notion is unreachable, the workflow retries 3 times (5s apart) then fails and logs the error. The dashboard push failing does not block the email — it continues on error.

---

## Prerequisites

### 1. Notion Tasks Database

The workflow queries database ID `2915456c-327f-80d8-83b4-000b8bc03128`.

Required properties (already confirmed from existing ADHD workflows):

| Property | Type | Values |
|----------|------|--------|
| Name | Title | — |
| Status | Select | To Do, In Progress, Complete, Cancelled |
| Priority | Select | RED, AMBER, GREEN |
| Due | Date | yyyy-MM-dd |

The Notion integration must have read access to this database.

### 2. n8n Credentials

Both credentials are already configured in n8n and used by existing ADHD workflows:

| Credential | n8n Name | Used For |
|------------|----------|----------|
| Notion Internal Integration | `Notion Internal Integration` | Querying Tasks DB |
| Microsoft Outlook | `Mart` | Sending briefing email |

No new credentials needed.

### 3. Environment Variables (n8n)

Set these in n8n > Settings > Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `ADHD_DASHBOARD_WEBHOOK_URL` | Optional | Full URL to the Next.js webhook endpoint. Defaults to `https://adhd-ef-system.vercel.app/api/webhooks/daily-briefing` if not set. Update once Vercel deployment URL is confirmed. |
| `ADHD_WEBHOOK_SECRET` | Optional | Shared secret sent as `X-Webhook-Secret` header. Must match what the Next.js `/api/webhooks/daily-briefing` endpoint expects. Set once the dashboard is deployed. |

The workflow runs without these vars set — the dashboard push will fail gracefully (continues to email).

---

## Activation

Once the above prerequisites are confirmed:

1. Open n8n at [fpz.app.n8n.cloud](https://fpz.app.n8n.cloud)
2. Find workflow **ADHD: Daily Briefing (WF-01)**
3. Toggle it active

The workflow will fire at 07:30 next morning.

---

## Testing

### Manual test (recommended before activating)

1. Open the workflow in n8n
2. Click **Test workflow**
3. The trigger will fire immediately using today's date
4. Check execution output:
   - "Query Today's Tasks" should return results from Notion
   - "Build Briefing Payload" should categorise tasks correctly
   - "Push to Dashboard" will fail if the dashboard isn't deployed — this is expected, it continues
   - "Send Briefing Email" should send to mart@fourpointzero.co.uk

Check your inbox at mart@fourpointzero.co.uk for the test email.

### Verifying the payload

The "Build Briefing Payload" node outputs:

```json
{
  "date": "2026-04-03",
  "generatedAt": "2026-04-03T07:30:01.000Z",
  "taskCount": 5,
  "overdueCount": 2,
  "todayCount": 2,
  "inProgressCount": 1,
  "overdueTasks": [
    { "id": "...", "name": "Task name", "priority": "RED", "status": "In Progress", "due": "2026-04-01", "url": "..." }
  ],
  "todayTasks": [...],
  "inProgressTasks": [...]
}
```

This is the payload the Next.js dashboard endpoint will receive.

---

## Dashboard Webhook Contract

The Next.js endpoint at `/api/webhooks/daily-briefing` should expect:

- **Method:** POST
- **Header:** `X-Webhook-Secret: <shared secret>`
- **Body:** JSON as above

The endpoint should store the briefing and make it available via the dashboard API for the daily briefing view.

---

## Email Format

Subject: `[ADHD System] Daily Briefing — 03 Apr — 2 overdue`

Body:
```
Daily Briefing — Friday, 03 April

OVERDUE (2)
  - Fix login bug [RED] — was due 01 Apr
  - Write proposal [AMBER] — was due 02 Apr

TODAY (2)
  - Review PR [RED]
  - Update docs [GREEN]

IN PROGRESS (1)
  - Research competitors

Open your dashboard to review and start your day.
```

On a clear day (no tasks), the email reads:
```
Daily Briefing — Friday, 03 April

Clear day — no tasks due or in progress.

Use this intentionally. What is the one thing you want to move forward today?

Open your dashboard to capture it.
```

---

## Error Handling

| Failure Point | Behaviour |
|---------------|-----------|
| Notion API unreachable | Retries 3x with 5s gaps, then fails. Execution logged as error in n8n. No email sent. |
| Notion returns empty / malformed | Code node handles gracefully — sends "Clear day" email |
| Dashboard webhook unreachable | Continues to email. Error logged in execution output. |
| Email send failure | Execution fails and logs. Check Outlook OAuth token validity. |

Failed executions are visible in n8n > Executions with full error detail.

---

## Version Control

The workflow JSON (without credential IDs) is at:
`workspace/n8n-daily-briefing.workflow.json`

To re-import after any environment change: use n8n's workflow import, re-link credentials by name (`Notion Internal Integration`, `Mart`).
