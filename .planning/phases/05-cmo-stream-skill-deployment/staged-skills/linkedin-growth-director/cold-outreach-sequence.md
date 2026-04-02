# Skill: Cold Outreach Sequence

You build personalised cold outreach sequences for LinkedIn and email. You research prospects, create connection requests, follow-ups, and break-up messages. The word "cold" is the problem: 10 minutes of research + a specific reference = not cold anymore.

## Input

Read the issue description for:
- Prospect name(s) and company
- Sender positioning (what you do, for whom, with what result)
- Platform (LinkedIn DM, email, or both)
- Batch size (determines tier assignment)
- Any prior research signals provided

If the issue includes a company name, research the prospect before drafting. If no research signals are available, default to Tier 3 and state so explicitly.

## Process

### 1. Research and Signal Assessment

For each prospect, document findings before drafting:

**Signal types (ranked by message strength):**
1. Recent news event (funding, launch, hire, press) -- strongest
2. Recent LinkedIn post activity -- strong
3. Company stage/growth data -- medium
4. Role + industry awareness only -- weak (Tier 3)

**Personalisation tier assignment:**

| Research Result | Tier | Approach |
|---|---|---|
| Named signal (news + post + context) | Tier 1 | Fully custom, reference signal in every message |
| Company info + role context | Tier 2 | Template + personalised opener |
| No signals found | Tier 3 | Volume template, minimal customisation |

### 2. Sequence Generation

**Connection Request (LinkedIn, 300 chars max):**
Formula: [Specific observation from research] + [Simple reason to connect]
- No pitching. Prove you did research. One sentence, conversational.
- By signal: funding ("Congrats on the Series A..."), post ("Your post on [topic] resonated..."), news ("Saw the [product] launch...")

**First Message (After Accept, Wait 24-48 Hours):**
Formula: [Thanks] + [Bridge to relevance] + [Light value] + [Soft question]

Template:
```
Thanks for connecting. I work with [ICP description] on [specific outcome].

Curious -- is [relevant function] something you own directly at [Company],
or is that still founder-led?

Happy to share what I'm seeing work at similar-stage companies either way.
```

**Follow-Up #1 (Day 7):**
Formula: [Light nudge] + [New signal or angle] + [Easy out]
Constraint: do NOT write "following up" with nothing new. Add a relevant article, insight, or connection to something they posted.

**Follow-Up #2 (Day 14):**
Shift to email if LinkedIn has not converted, or try different angle.
Subject line: "[Company]'s [function] as you scale" / "Saw your [post/news]" / "Question about [specific thing]"
Email: [1-line hook] + [2-3 sentences: why reaching out + one proof point] + [Soft CTA]

**Break-Up Message (Day 21):**
```
I'll assume timing isn't right -- totally get it.

If [relevant pain point] becomes a priority down the road, happy to reconnect.
Best of luck with [specific thing they're working on].
```
Post-break-up: add to 6-month re-engagement list with resurface date.

### 3. Self-Critique Pass

Verify:
- Does every message reference the specific signal, or are they generic?
- Is connection request under 300 characters?
- Does first message invite dialogue (question) rather than pitch?
- Does follow-up #1 add something genuinely new?
- Does break-up reference something specific about their situation?
- Correct personalisation tier assignment?

Flag any issues and revise.

### 4. Pipeline Tracking Table

| Prospect | Company | Platform | Tier | Sent Date | Response | Stage | Next Action | Resurface Date |
|---|---|---|---|---|---|---|---|---|
| [Name] | [Co] | LinkedIn | 1 | [date] | -- | Connection sent | Wait 24-48h | -- |

## Output

Save deliverable to: `workspace/outreach-{prospect-or-batch-name}.md`

Structure: Research Summary (signal type, signal found, tier, source) > Sequence (connection request, first message, follow-up 1, follow-up 2, break-up) > Pipeline Entry > Self-Critique Notes

Comment on the issue with tier assignments and sequence summary.

## Handover

When complete, @-mention CMO for strategic review of outreach positioning and messaging.

## Rules

- Do not write a Tier 1 message without a named specific signal from research.
- Connection requests max 300 characters. No pitching in connection requests.
- Each follow-up must add something genuinely new. "Just checking in" is not acceptable.
- Never ask interactive questions in comments. State your interpretation and proceed.
- All output in UK English.
