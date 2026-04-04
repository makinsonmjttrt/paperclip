# ADHD System — Inbox Alert n8n Setup Guide (WF-03)

**Workflow file:** `workspace/n8n-inbox-alert.workflow.json`
**Trigger:** Every day at 07:50 (Europe/London), 5 minutes after the daily briefing
**Depends on:** WF-01 daily briefing credentials already configured

---

## What It Does

Checks your Notion Tasks database every morning. If more than 20 tasks have status `To Do` with no Priority set, it sends an alert email to mart@fourpointzero.co.uk.

No email = inbox is clear. You only hear from it when action is needed.

---

## Before You Import

No new Notion schema changes are required. The workflow uses the existing Tasks database with existing properties.

Confirm the following before importing:

- The `Status` property on your Tasks database uses a **select** type with a value named exactly `To Do`.
- The `Priority` property on your Tasks database uses a **select** type (values: RED, AMBER, GREEN). Tasks with no priority set have this field empty.

If your property names or types differ, update the filter in the `Query Uncategorised Tasks` node after importing.

---

## No New Environment Variables

This workflow requires no new environment variables. It reuses:
- `Notion Internal Integration` credential (same as WF-01 and WF-02)
- `Mart` Microsoft Outlook credential (same as WF-01 and WF-02)

---

## Import Steps

1. Open n8n and go to **Workflows → Import from file**.
2. Select `workspace/n8n-inbox-alert.workflow.json`.
3. Open the imported workflow.
4. Verify the `Notion Internal Integration` credential is correctly linked on the `Query Uncategorised Tasks` node.
5. Verify the `Mart` Outlook credential is correctly linked on the `Send Inbox Alert` node.
6. Set the workflow to **Active**.

---

## How to Test

1. In n8n, open the workflow.
2. Click **Test workflow** to trigger a manual run.
3. Inspect the `Count Items` node output — it will show how many uncategorised tasks were found.
4. If count is 20 or below, the `Inbox Over Threshold` node routes to the false branch and no email is sent. This is correct.
5. To force an email, temporarily change `value2` in the `Inbox Over Threshold` node from `20` to `0`, run the test, then revert.

---

## Alert Email Format

**Subject:** `⚠️ ADHD Inbox Alert: {count} uncategorised tasks`

**Body:**
```
You have {count} uncategorised tasks in your inbox.

Your inbox needs 5 minutes.

Open Notion Tasks:
https://www.notion.so/2915456c327f80d883b4000b8bc03128
```

---

## Threshold

The alert fires when uncategorised task count exceeds **20**. To change this, open the `Inbox Over Threshold` node and update the `value2` field.

---

## Workflow Map

```
Daily 07:50 (cron)
  → Query Uncategorised Tasks (Notion API: Status=To Do, Priority=empty)
  → Count Items (code: extract count + display string)
  → Inbox Over Threshold (IF count > 20)
    → [TRUE]  Send Inbox Alert (Outlook email)
    → [FALSE] (no action, execution ends cleanly)
```
