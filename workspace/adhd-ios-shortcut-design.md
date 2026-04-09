# ADHD System: iOS Quick-Capture Shortcut Design

**Issue:** [FOU-104](/FOU/issues/FOU-104)
**Status:** Design complete — ready for Martyn to implement
**Complements:** [FOU-38](/FOU/issues/FOU-38) n8n daily briefing workflow

---

## What This Does

Two iOS Shortcuts that write directly to the Notion Tasks database in under 5 seconds, from anywhere on your iPhone. No app switching, no friction.

| Shortcut | Use when |
|----------|----------|
| **Quick Capture** | You have a task, action, or idea with a clear title |
| **Brain Dump** | You just need to get something out of your head, worry about structure later |

---

## Notion Database Reference

Both shortcuts write to the existing ADHD Tasks database.

| Field | Value |
|-------|-------|
| Database ID | `2915456c-327f-80d8-83b4-000b8bc03128` |
| Status on capture | **To Do** |
| Priority on capture | **AMBER** (can be changed later from the dashboard) |
| Due date | None set at capture — leave blank |
| Name | Whatever you type or say |

---

## Shortcut 1: Quick Capture

### What it does
1. Prompts you to type or dictate a task title
2. Sends it to Notion immediately
3. Shows a confirmation notification

### Triggers

**Your choice:** set up whichever of these you'll actually use.

- **Home screen widget / app icon** — tap the Shortcut icon on your home screen
- **Lock screen** — add as a Back Tap (Settings → Accessibility → Touch → Back Tap → Triple Tap)
- **Share Sheet** — when you want to capture something you're reading (e.g. an email, webpage): the page title or selected text becomes the task name

### Step-by-step build instructions

**Step 1 — Open the Shortcuts app** (the app with a colourful square icon)

**Step 2 — Tap the + button** (top right) to create a new shortcut

**Step 3 — Add these actions in order:**

---

**Action 1: Ask for Input**
- Tap "Add Action" → search "Ask for Input"
- Set **Prompt** to: `What do you need to capture?`
- Set **Input Type** to: Text
- Leave default answer blank

> Tip: When using this shortcut, you can tap the microphone icon on the keyboard to dictate instead of typing.

---

**Action 2: Get Contents of URL** (this is the Notion API call)
- Tap "Add Action" → search "Get Contents of URL"
- Set **URL** to: `https://api.notion.com/v1/pages`
- Tap **Show More**
- Set **Method** to: POST
- Set **Headers** to (tap "Add new header" for each):

| Key | Value |
|-----|-------|
| `Authorization` | `Bearer YOUR_NOTION_TOKEN` |
| `Content-Type` | `application/json` |
| `Notion-Version` | `2022-06-28` |

- Set **Request Body** to: JSON
- Add these JSON fields:

```
parent → object:
  database_id → "2915456c-327f-80d8-83b4-000b8bc03128"

properties → object:
  Name → object:
    title → array:
      [0] → object:
        text → object:
          content → [Provided Input] (tap the variable selector, choose the input from Action 1)
  Status → object:
    select → object:
      name → "To Do"
  Priority → object:
    select → object:
      name → "AMBER"
```

> See the exact JSON template at the bottom of this document if you prefer to paste it directly.

---

**Action 3: If (error check)**
- Tap "Add Action" → search "If"
- Set condition: `Contents of URL` is not empty
- In the **If** branch: add a "Show Notification" action
  - Title: `Captured ✓`
  - Body: `[Provided Input]` (the variable from Action 1)
- In the **Otherwise** branch: add a "Show Notification" action
  - Title: `Capture failed`
  - Body: `Notion may be offline. Added to Notes instead.`
- After the Otherwise notification, add "Add New Note" action with body: `[Provided Input]`

---

**Step 4 — Name the shortcut**
- Tap the shortcut name at the top
- Rename to: **Capture Task**
- Choose an icon (suggested: clipboard or bolt)

**Step 5 — Add to home screen**
- Tap the share icon → Add to Home Screen
- This puts it on your home screen like a regular app

**Step 6 — Add to lock screen (Back Tap)**
- Go to: Settings → Accessibility → Touch → Back Tap
- Set **Triple Tap** to: Run Shortcut → Capture Task

---

## Shortcut 2: Brain Dump

Identical to Quick Capture with two differences:
- **Prompt text:** `Brain dump — what's on your mind?`
- **Priority:** Set to **GREEN** instead of AMBER (it's low-stakes freetext, not a committed task)
- **Name the shortcut:** **Brain Dump**

The same error handling (fallback to Notes app) applies.

---

## Finding Your Notion Token

The Notion integration token is already set up in n8n as `Notion Internal Integration`. Rather than creating a new token, ask the CTO agent to retrieve the token value from n8n and provide it to you securely.

If you need to create a fresh token:
1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Open your existing ADHD integration
3. Copy the **Internal Integration Token** (starts with `secret_`)
4. Paste it into the shortcut where it says `YOUR_NOTION_TOKEN`

**Keep this token private.** Do not share it or paste it anywhere public.

---

## Exact JSON Request Body

If the visual JSON builder in Shortcuts is confusing, switch to "Text" body type and paste this directly. Replace `YOUR TASK NAME HERE` with the variable reference:

```json
{
  "parent": {
    "database_id": "2915456c-327f-80d8-83b4-000b8bc03128"
  },
  "properties": {
    "Name": {
      "title": [
        {
          "text": {
            "content": "YOUR TASK NAME HERE"
          }
        }
      ]
    },
    "Status": {
      "select": {
        "name": "To Do"
      }
    },
    "Priority": {
      "select": {
        "name": "AMBER"
      }
    }
  }
}
```

---

## Edge Cases

| Situation | What happens |
|-----------|--------------|
| Notion API is offline | Shortcut shows "Capture failed" notification. Task is saved to the Notes app automatically. Copy it to Notion when back online. |
| You accidentally dismiss the input prompt | Nothing is sent to Notion — you just tap the shortcut again |
| You capture a duplicate | Notion accepts it — delete duplicates during your daily review |
| iPhone is in Airplane mode | Same as Notion offline — fallback to Notes |
| The shortcut token expires | Shortcut will fail silently. Test once a month by capturing a test task. |

---

## Testing Checklist

Before relying on this in daily use:

- [ ] Tap shortcut, type "Test task", confirm Notion shows a new To Do item with AMBER priority
- [ ] Check the task appears in your n8n daily briefing the following morning
- [ ] Test the lock screen Back Tap trigger
- [ ] Test offline: put iPhone in Airplane mode, run shortcut, confirm Notes fallback works

---

## How This Connects to the Daily Briefing

Tasks captured via this shortcut land in the same Notion Tasks database that the n8n daily briefing workflow queries each morning at 07:30. Tasks with status **To Do** and a due date will appear in tomorrow's briefing automatically. Tasks without a due date will accumulate in your inbox for triage during your daily review.

No additional configuration needed — the shortcut writes to the same database, using the same properties.

---

## Maintenance

- If the Notion database ID changes, update it in the Shortcut's HTTP request body
- If the Notion integration token is rotated, update it in the Shortcut's Authorization header
- The Brain Dump shortcut can be deleted if unused after 30 days — keep your Shortcuts library lean
