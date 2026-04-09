# iOS Quick Capture: Setup Guide

**For:** Martyn
**Time required:** ~10 minutes
**What you'll have afterwards:** Two shortcuts on your iPhone that send tasks to Notion in under 5 seconds, from anywhere

---

## Before You Start: Get Your Notion Token

You need a Notion API token to connect your iPhone to Notion. This is a one-time step.

1. On your Mac or iPhone, go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Look for the integration named something like **ADHD** or **n8n**
3. Click it to open it
4. Click **Show** next to "Internal Integration Token" and copy it
5. The token starts with `secret_` — paste it somewhere you can access from your iPhone (e.g. the Notes app, temporarily)

**Keep this token private.** Do not share it or paste it in any public or shared document.

---

## Part 1: Quick Capture Shortcut

This shortcut captures a specific task you need to remember. It writes straight to your Notion Tasks list with AMBER priority.

### Step 1 — Open the Shortcuts app

Find the Shortcuts app on your iPhone (colourful rounded square icon). Tap it.

### Step 2 — Create a new shortcut

Tap the **+** button in the top right corner.

You'll see an empty shortcut editor. Ignore the suggested actions — you'll add your own.

### Step 3 — Add Action 1: Ask for Input

1. Tap **Add Action**
2. In the search bar, type: `ask for input`
3. Tap **Ask for Input** when it appears
4. Tap the action to expand its settings:
   - **Prompt:** Change to: `What do you need to capture?`
   - **Input Type:** Leave as **Text**
   - Leave the default answer blank

### Step 4 — Add Action 2: Get Contents of URL

This action is the Notion API call — it sends your task to Notion.

1. Tap **Add Action** again (scroll down to find it, or tap the blue + button)
2. Search for: `get contents of url`
3. Tap **Get Contents of URL** when it appears
4. Tap **Show More** on the action to expand it
5. Configure as follows:

**URL field:**
```
https://api.notion.com/v1/pages
```

**Method:** Change from GET to **POST**

**Headers** — tap "Add new header" for each of these three:

| Key | Value |
|-----|-------|
| `Authorization` | `Bearer YOUR_NOTION_TOKEN` |
| `Content-Type` | `application/json` |
| `Notion-Version` | `2022-06-28` |

> Replace `YOUR_NOTION_TOKEN` with the actual token you copied in the Before You Start section. The full value goes after the word `Bearer` — including a space between them.

**Request Body:** Tap to change from **Form** to **JSON**

Now add the following fields by tapping **Add new field** for each. Some fields are nested — the indentation below shows which fields go inside which:

```
parent
  └─ database_id  →  2915456c-327f-80d8-83b4-000b8bc03128

properties
  └─ Name
       └─ title
            └─ [item 0]
                 └─ text
                      └─ content  →  [tap variable selector, choose "Provided Input" from Action 1]
  └─ Status
       └─ select
            └─ name  →  To Do
  └─ Priority
       └─ select
            └─ name  →  AMBER
```

> **Tip for the content field:** When you reach the `content` value, don't type text — tap the field, then tap the small variable button (looks like a coloured circle or `x` symbol). Choose the input from Action 1 ("Provided Input" or "Ask for Input Result"). This inserts the task you typed as the task name in Notion.

### Step 5 — Add Action 3: If (for error handling)

If Notion is offline, this catches the error and saves your task to Notes instead.

1. Tap **Add Action**
2. Search for: `if`
3. Tap **If** when it appears
4. Set the condition: **Contents of URL** `is not empty`
5. In the **If** branch:
   - Tap **Add Action** inside the If section
   - Add **Show Notification**
   - Title: `Captured ✓`
   - Body: tap the variable selector, choose **Provided Input** (the task name)
6. In the **Otherwise** branch:
   - Add **Show Notification**
   - Title: `Capture failed`
   - Body: `Notion may be offline. Saved to Notes.`
   - Then add another action: **Add New Note**
   - Set Note Body to: **Provided Input** (the task name variable)

### Step 6 — Name and save the shortcut

1. Tap the shortcut name at the top (probably says "New Shortcut")
2. Rename it to: **Capture Task**
3. Choose an icon — tap the icon square, pick something you'll recognise (clipboard or bolt work well)
4. Tap **Done** in the top right

### Step 7 — Add to home screen

1. In your Shortcuts library, press and hold the **Capture Task** shortcut
2. Tap **Share** then **Add to Home Screen**
3. This puts it on your home screen like a regular app icon

### Step 8 — Add to lock screen (optional, recommended)

1. Open **Settings**
2. Go to: **Accessibility → Touch → Back Tap**
3. Set **Triple Tap** to: **Run Shortcut → Capture Task**

Triple-tap the back of your iPhone to trigger the shortcut from anywhere, including the lock screen.

---

## Part 2: Brain Dump Shortcut

This is identical to Quick Capture with two changes. Build it the same way (repeat Steps 1–8 above), but:

- In **Action 1 (Ask for Input):** Change the prompt to:
  `Brain dump — what's on your mind?`

- In **Action 2 (Get Contents of URL):** For the `Priority → select → name` field, change `AMBER` to:
  `GREEN`

- In **Step 6:** Name it **Brain Dump** instead of Capture Task

Brain Dump is for offloading thoughts with no action intent. GREEN priority signals it's low-stakes and can be triaged later.

---

## Testing

Do this before relying on either shortcut in daily use:

- [ ] Tap **Capture Task**, type `Test task`, wait for the "Captured ✓" notification
- [ ] Open Notion Tasks — confirm you see a new **To Do** item with **AMBER** priority
- [ ] Triple-tap the back of your iPhone to test the Back Tap trigger
- [ ] Test **Brain Dump** the same way — confirm task appears with **GREEN** priority
- [ ] (Optional) Put iPhone in Airplane mode, run either shortcut, confirm the Notes fallback works

---

## If Something Goes Wrong

| Symptom | Fix |
|---------|-----|
| Shortcut shows "Capture failed" | Notion is temporarily offline. Task was saved to Notes — copy it to Notion when you're back online. |
| Shortcut does nothing when you tap it | Check you tapped Done when saving. Open Shortcuts app and check the shortcut exists. |
| Error about authorisation | The token value in the Authorization header is wrong. Re-open the shortcut, check the header reads exactly: `Bearer secret_YOURTOKEN` with a space after Bearer. |
| Task appears in Notion with wrong priority | You may have set the Priority field value incorrectly. Should be `AMBER` (capital letters) for Quick Capture, `GREEN` for Brain Dump. |
| Task name shows as blank in Notion | The `content` field isn't set to the variable — it's set to static text. Re-open the shortcut, find the content field, and replace any typed text with the "Provided Input" variable. |

---

## How This Connects to Your Daily Briefing

Tasks you capture here land in the same Notion Tasks database that your n8n daily briefing queries every morning at 07:30. Tasks with a due date will appear in tomorrow's briefing automatically. Tasks without a due date will accumulate in your inbox for triage — which is why the Inbox Triage feature (coming in Phase 2) will surface them for you.

---

## Maintenance

- If you rotate your Notion integration token, update the `Authorization` header in both shortcuts
- The Brain Dump shortcut can be deleted after 30 days if unused — keep your Shortcuts library lean
- Test once a month by capturing a test task — if it fails silently, the token may have expired
