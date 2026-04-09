# ADHD Executive Function System — User Guide

**Version:** 1.0
**Written for:** Martyn
**Dashboard:** https://adhd-ef-system.vercel.app

---

## What This System Does

Your ADHD EF System reduces the number of decisions you have to make each day. It tells you what to work on, holds your tasks while you're in flow, keeps you focused during work blocks, and closes the day cleanly. Four features. One dashboard.

---

## Your Daily Routine

### Morning (before 08:00)

Your daily briefing is already waiting for you. The system prepares it automatically at 07:30.

1. Open the dashboard at https://adhd-ef-system.vercel.app
2. Read the briefing at the top of the screen — it shows your overdue tasks, today's tasks, and anything currently in progress, sorted by priority (RED first, then AMBER, then GREEN)
3. You also receive the briefing by email to mart@fourpointzero.co.uk if you prefer to start there

That's your plan for the day. No hunting, no deciding what to look at first.

### During the Day

When a thought, task, or action surfaces — capture it immediately before it disappears.

1. Use the task capture bar (visible on every page of the dashboard)
2. Type the task title — that's all you need
3. Hit enter. It's saved. Done.

Captured items land in your Notion inbox. They won't be lost. You can triage them later; capturing them now is what matters.

When you're ready to work on something specific, start a focus block (see below).

### Evening (around 17:30)

You'll receive a notification at 17:30 prompting your daily review.

1. Open the dashboard and go to the Daily Review section
2. Work through four steps — it takes under five minutes
3. See what you completed, reschedule anything unfinished, note what went well, and set your top priority for tomorrow
4. The review saves automatically to Notion — even if you close it halfway through, it's not lost

---

## The Four Features

### 1. Daily Briefing

**What it is:** A single-screen summary of what matters today.

**What it shows:**
- Your overdue tasks (RED priority first)
- Tasks due today
- Tasks currently in progress
- On a clear day: a prompt to use the time intentionally

**How to refresh it manually:** There is a refresh button on the briefing panel. Tap it if you want to pull in any tasks you've added since morning.

**How it's delivered:** Dashboard banner (top of screen) and email to mart@fourpointzero.co.uk.

---

### 2. Task Capture

**What it is:** A quick-input bar to capture anything before you lose it.

**How to use it:**
- It's at the top of every dashboard page
- Type a task title — no other fields required
- Hit enter — you'll see a confirmation within one second
- The task lands in your Notion inbox

**Triaging your inbox:** When you have time (not in a flow state), open the Notion Tasks database and triage inbox items: set a priority (RED/AMBER/GREEN), a due date, and a status (To Do). You'll get an alert if your inbox exceeds 20 uncategorised items.

---

### 3. Focus Block Timer

**What it is:** A timed work session attached to a task, so you don't have to decide what to do during the block.

**How to start one:**
1. From the dashboard, select the task you want to focus on
2. Choose your block length: 25 minutes, 45 minutes, or a custom duration
3. Hit start

**During the block:**
- The timer is visible throughout
- The task title and any notes are shown on screen
- Your phone/browser will not interrupt you (do this manually if needed: silence your notifications)

**At the end of the block:**
- You get a prompt to log what you did and whether to continue or take a break
- The session is saved to Notion automatically

**If you close the tab:** The timer state is saved in your browser. When you reopen the dashboard, it resumes where it left off.

---

### 4. Daily Review

**What it is:** A short guided form to close the day and set up tomorrow.

**When it appears:** You get a notification at 17:30. You can also open it manually from the dashboard at any time.

**The four steps:**
1. Tasks completed today — confirm what you finished
2. Tasks not completed — reschedule or remove each one
3. Notes captured today — review anything you captured
4. Reflection — one sentence on what went well, one sentence on tomorrow's top priority

**Where it saves:** Everything goes to your Notion Daily Log — one page per day.

---

### 5. iOS Quick Capture

**What it is:** Two iPhone shortcuts that send tasks directly to your Notion inbox in under 5 seconds — from anywhere, without opening any app. Use **Capture Task** for something specific you need to act on (lands in Notion with AMBER priority). Use **Brain Dump** for a thought you want to park without deciding what to do with it yet (lands with GREEN priority). Both work from your lock screen, mid-call, or while you're using another app.

**One-time setup (takes about 10 minutes):**

1. Get your Notion integration token: go to [notion.so/my-integrations](https://www.notion.so/my-integrations), open your ADHD/n8n integration, and copy the token starting with `secret_`
2. On your iPhone, open the **Shortcuts** app
3. Build the **Capture Task** shortcut — full step-by-step in `workspace/adhd-ios-shortcut-setup-guide.md`
4. Build the **Brain Dump** shortcut the same way, with the prompt changed to "Brain dump — what's on your mind?" and priority set to GREEN
5. Add both to your home screen; set **Back Tap** (Settings → Accessibility → Touch → Back Tap → Triple Tap) to run **Capture Task**

**Three ways you'll use it:**

1. **Stuck in a meeting, a task surfaces mid-conversation** — triple-tap the back of your phone. Type the task. Done in under 10 seconds without breaking focus.

2. **Random idea while you're walking or driving** — tap the Brain Dump icon on your home screen. Type the thought. It lands in Notion with GREEN priority — no pressure to act on it now.

3. **Something urgent surfaces when you're offline** — the shortcut catches network failures automatically. If Notion is unreachable, the task saves to your iPhone Notes app. Copy it to Notion when you're back online.

**What happens next:**

Everything captured on iOS lands in the same Notion Tasks database as tasks captured on the dashboard. They sit in your inbox without a due date until you triage them. The next morning at 07:30 your daily briefing runs — if you've given an iOS-captured task a due date, it will appear in the briefing automatically. Tasks without a due date accumulate in your inbox; you'll get an alert if that count exceeds 20.

---

## Notion: What's Behind the Dashboard

Your dashboard reads from and writes to three Notion databases. You don't need to touch Notion directly day-to-day, but it helps to know what's there.

| Database | What It Stores |
|----------|----------------|
| **Tasks** | All tasks — captured, prioritised, and in progress. Fields: name, status (To Do / In Progress / Complete / Cancelled), priority (RED / AMBER / GREEN), due date |
| **Daily Log** | One page per day. Contains your morning briefing and your evening review |
| **Focus Sessions** | A record of every focus block you've started — task, start time, duration, and what you logged at the end |

Priority colours:
- **RED** = must do today
- **AMBER** = should do today
- **GREEN** = can wait

---

## Automation: What Runs Without You

Three automated workflows run in the background via n8n (cloud). You don't need to manage these.

| Workflow | When It Runs | What It Does |
|----------|-------------|-------------|
| **Daily Briefing** | 07:30 every morning | Reads your Tasks database, builds the briefing, pushes it to your dashboard, sends the email |
| **Daily Review Trigger** | 17:30 every day | Sends you a notification to start your end-of-day review |
| **Inbox Alert** | When triggered | Notifies you if your inbox exceeds 20 uncategorised tasks |

If a workflow fails, it retries automatically up to three times. Failed executions are logged at fpz.app.n8n.cloud if you ever need to check.

---

## Troubleshooting

### 1. No briefing in the morning

**Likely cause:** The n8n workflow ran but the dashboard didn't receive it.

**Fix:** Check your email at mart@fourpointzero.co.uk — the briefing email runs independently. If the email arrived but the dashboard is blank, hit the manual refresh button on the briefing panel. If neither arrived, open n8n (fpz.app.n8n.cloud), find the Daily Briefing workflow, and check the most recent execution for errors.

---

### 2. A task I captured isn't showing up

**Likely cause:** The task landed in your Notion inbox but hasn't been triaged yet — so it won't appear in the briefing until you assign a due date or status.

**Fix:** Open the Notion Tasks database and find the item in your inbox. Set its status to "To Do" and add a due date. It will appear in the next briefing.

---

### 3. The focus timer disappeared after I closed the tab

**Likely cause:** Browser data was cleared, or you're using a different browser or device.

**Fix:** The timer saves in your browser's local storage. It is specific to the browser and device you started it on. Return to the same browser on the same device and the timer will resume. If it's gone, start a new focus block.

---

### 4. I didn't get the 17:30 review notification

**Likely cause:** Browser notifications are blocked for the site, or n8n had a delivery issue.

**Fix:** Check your browser notification settings for https://adhd-ef-system.vercel.app and make sure notifications are allowed. You can also open the Daily Review manually from the dashboard at any time — the notification is a prompt, not a gate.

---

### 5. The dashboard isn't loading

**Likely cause:** Vercel deployment issue or your session has expired.

**Fix:**
1. Hard refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. If you see a login screen, enter your credentials
3. If the site is down entirely, check https://vercel.com/status for any platform issues

---

## Quick Reference

| Action | Where |
|--------|-------|
| View today's priorities | Dashboard — briefing panel at top |
| Capture a task | Task bar — visible on every dashboard page |
| Capture a task from your iPhone | iOS Shortcuts — Capture Task (AMBER) or Brain Dump (GREEN) |
| Start a focus block | Dashboard — select a task, tap Start Focus |
| Do your daily review | Dashboard — Daily Review section, or wait for 17:30 notification |
| Check your full task list | Notion Tasks database |
| Review focus history | Notion Focus Sessions database |
| Check automation logs | fpz.app.n8n.cloud |
