# ADHD System — Notion Schema Setup Guide

**For:** Martyn
**Time required:** 20 minutes
**When to do this:** Before Phase 2 development starts. Engineers cannot build the weekly review features until these changes exist in Notion.

---

## What You Are Setting Up

Three changes to your Notion workspace:

1. Add a `Completed` date property to your existing **Tasks** database (5 min)
2. Create a new **Weekly Reviews** database with the correct fields (10 min)
3. Grant your integration token write access to the Weekly Reviews database (5 min)

You are not changing any existing data. Existing tasks and workflows continue to work.

---

## Before You Start

You need:
- Your Notion account open (notion.so or the desktop app)
- The ADHD system already working — this guide assumes your Tasks and Focus Sessions databases already exist

---

## Step 1 — Add `Completed` Date Property to Tasks Database

**Time:** 5 minutes

This lets the weekly review query find tasks you finished in the past 7 days.

1. Open Notion and navigate to your **Tasks** database
2. In the database view, scroll all the way to the right until you see a **+** icon in the column header row
3. Click the **+** icon — a property menu appears on the right
4. Click on the property type field (it may say "Text" by default) and select **Date**
5. In the **Name** field at the top, clear the default text and type exactly: `Completed`
   - Capital C, no trailing space, no other text
6. Click outside the menu or press Escape to close it

**Verify it worked:**
- You should see a new `Completed` column in your Tasks database
- The column icon should be a calendar symbol
- Existing tasks will show empty in this column — that is correct

> Note: You do not need to fill in the `Completed` date for existing tasks. The n8n workflow will read this field going forward. Backfilling is optional.

---

## Step 2 — Create the Weekly Reviews Database

**Time:** 10 minutes

This database stores one record per weekly review session. The n8n automation writes to it; you read from it in the dashboard.

### 2a — Create the database page

1. In the Notion left sidebar, click **New page** (or click the **+** icon next to a section)
2. A blank page opens — type `Weekly Reviews` as the page title and press Enter
3. In the body of the page, type `/` to open the command menu
4. Type `table` and select **Table - Full page** from the list
5. A table database is created inside your page

### 2b — Add the required properties

Your new table has one default property called **Name**. You need to add six more. Do this in order:

**Property 1: WeekEndingDate**
1. Click the **+** icon at the far right of the column header row
2. Select type: **Date**
3. Name it: `WeekEndingDate` (no spaces, capital W, capital E, capital D)
4. Click outside to confirm

**Property 2: Intention**
1. Click **+** again to add another property
2. Select type: **Text**
3. Name it: `Intention`
4. Click outside to confirm

**Property 3: FocusBlockCount**
1. Click **+** again
2. Select type: **Number**
3. Name it: `FocusBlockCount` (no spaces)
4. In the **Number format** dropdown, select **Number** (not percentage or currency)
5. Click outside to confirm

**Property 4: TasksCompleted**
1. Click **+** again
2. Select type: **Number**
3. Name it: `TasksCompleted` (no spaces)
4. Format: **Number**
5. Click outside to confirm

**Property 5: TasksStuck**
1. Click **+** again
2. Select type: **Number**
3. Name it: `TasksStuck` (no spaces)
4. Format: **Number**
5. Click outside to confirm

**Property 6: CreatedAt**
1. Click **+** again
2. Select type: **Date**
3. Name it: `CreatedAt` (no spaces, capital C, capital A)
4. Click outside to confirm

### 2c — Verify the database structure

Your Weekly Reviews database should have these columns, in any order:

| Property | Type |
|----------|------|
| Name | Text (default, leave as is) |
| WeekEndingDate | Date |
| Intention | Text |
| FocusBlockCount | Number |
| TasksCompleted | Number |
| TasksStuck | Number |
| CreatedAt | Date |

If any property name has a typo (even a different capitalisation), the n8n workflow will fail silently. Double-check each name.

---

## Step 3 — Grant Integration Access to Weekly Reviews

**Time:** 5 minutes

Your Notion integration token (the one the ADHD system already uses) needs explicit permission to read from and write to the new Weekly Reviews database. Without this step, the n8n workflow will fail when it tries to log the weekly review.

1. Open the **Weekly Reviews** database (navigate to it in the sidebar)
2. Click the **...** (three-dot) icon in the top-right corner of the page — not the database settings icon, the page-level menu
3. Scroll down to **Add connections** (in some Notion versions this is labelled **Connect to**)
4. In the search box that appears, type the name of your ADHD integration
   - If you do not know the name, go to notion.so → Settings → Integrations and look for the integration you set up for this system
5. Click on the integration name in the results
6. Click **Confirm** if a confirmation prompt appears

**Verify it worked:**
- The integration name should appear under "Connections" in the **...** menu
- If you see it listed there, access is granted

---

## Done — Verification Checklist

Run through this before telling the engineer to proceed:

- [ ] `Completed` (Date) property visible in Tasks database
- [ ] `Weekly Reviews` database exists in Notion
- [ ] Weekly Reviews has all 7 properties with correct names and types
- [ ] ADHD integration is listed under Connections for Weekly Reviews database

All four ticked? You are ready. Phase 2 development can start.

---

## If Something Looks Wrong

**I cannot find the + icon to add a property**
Make sure you are in database view, not in a page view. Click **Open as full page** if you see that option.

**The integration does not appear when I search**
Go to notion.so → Settings → Connections → Manage connections. Your integration may need to be activated at the workspace level first.

**I accidentally deleted a column**
Click the **...** on a column header → **Show hidden properties** — deleted properties can be restored there if you act quickly. If not, re-add it following Step 2b.

**I need to confirm the integration token name**
Ask CTO to confirm via a Paperclip message. Do not look for the token value yourself — the CTO holds that securely.
