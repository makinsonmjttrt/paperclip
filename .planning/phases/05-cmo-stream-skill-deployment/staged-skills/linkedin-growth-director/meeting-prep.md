# Skill: Meeting Prep

You generate pre-meeting prep briefs. You research participants, pull workspace context, build prioritised agendas, and surface sharp questions for any meeting type.

## Input

Read the issue description for:
- Participant name(s) and company
- Meeting type (WRS client / Sales / Strategy / Partnership / Interview / Other)
- Meeting time/date
- Optional: prior notes, last meeting summary, specific concerns

If meeting type is missing, comment on the issue requesting it before proceeding.

## Process

### 1. Context Search

Search workspace for prior mentions of the participant and company:
- Prior meeting notes or prep briefs
- Open commitments, TODOs, action items, or promises
- Any relationship history

### 2. Research

Search for recent signals:
- Recent LinkedIn activity, posts, or job changes
- Company news (funding, launches, hires, press)
- Industry context relevant to the meeting

### 3. Agenda by Meeting Type

**WRS Client Meeting:**
Objective: Relationship health + project status + next sprint alignment
1. Quick wins since last meeting (2 min)
2. Current project status (5 min)
3. Blockers / what they need from us (5 min)
4. Next sprint priorities (5 min)
5. Any scope or budget changes (3 min)
Watch for: scope creep, satisfaction signals, renewal indicators, unspoken concerns

**Sales / Discovery Meeting:**
Objective: Understand pain, qualify fit, move to next step
1. Context setting: why they reached out (2 min)
2. Current situation + pain (10 min)
3. What they have tried (5 min)
4. What good looks like (5 min)
5. Our fit / next step (5 min)
Watch for: urgency signals, budget authority, timeline, who else involved

**Strategy Session:**
Objective: Make a decision or align on direction
1. Situation brief (3 min)
2. Options on the table (10 min)
3. Tradeoffs + risks (5 min)
4. Decision / alignment (5 min)
5. Owners + timeline (2 min)
Watch for: misaligned assumptions, hidden blockers, deferred decisions

**Partnership / Intro Meeting:**
Objective: Establish mutual value, determine fit
1. Their world: what they are building (5 min)
2. Our world: what we are building (5 min)
3. Overlap and potential (5 min)
4. Specific collaboration idea (5 min)
5. Next step if fit exists (5 min)
Watch for: complementary audiences, clear non-compete, genuine energy vs polite interest

**Interview / Evaluation Meeting:**
Objective: Assess fit (culture, competence, motivation)
1. Background in their own words (5 min)
2. Deep dive on relevant experience (10 min)
3. How they handle X situation (10 min)
4. Their questions (5 min)
5. Next step (2 min)
Watch for: ownership language, specificity, red flags (vague answers, blame, inconsistencies)

### 4. Question Banks

**Discovery:** What made you want to have this conversation now vs 6 months ago? What have you already tried? Walk me through how this problem shows up in a typical week. What would "solved" look like? What is the cost of doing nothing? Who else is involved?

**Relationship/WRS:** What is working well that we should double down on? What is one thing that would make your life easier right now? If you had to prioritise one thing for next quarter? Is there anything you have been hesitant to bring up?

**Strategy:** What assumptions are we making that could be wrong? What is the reversible vs irreversible version of this decision? Who would disagree and why? What would we regret not doing in 12 months?

**Partnership:** Where do you see your audience overlapping with ours? What would a successful collaboration look like 6 months from now? What do your current partners get wrong?

**Interview:** Tell me about a time you [relevant situation]. What is the hardest thing you have figured out in a role? What do you need from the people you work with?

**Context-Specific:** "I noticed you recently [posted about / announced]..." "Last time we spoke, you mentioned [open item]..." "Your company just [news item]..."

### 5. Generate Brief

Format:
```
# Meeting Prep: [Name] | [Date] [Time]

Meeting type: [type]
Their role: [role at company]
Relationship stage: [new / existing / lapsed]

---

WHY THIS MEETING MATTERS
[1-2 sentences on stakes, objective, desired outcome]

3 PRIORITIES FOR THIS CALL
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

CONTEXT FROM WORKSPACE
[Notes, open items, prior commitments -- or "No prior history found"]

WHAT THEY CARE ABOUT RIGHT NOW
[Recent signals: posts, news, company context]

QUESTIONS TO ASK
1. [Question referencing research]
2. [Question]
3. [Question]
4. [Question]
5. [Question]

WATCH FOR / POTENTIAL FRICTION
[Known objections, sensitivities, open loops]

DESIRED OUTCOME
[What success looks like in one sentence]

NEXT STEP TO PROPOSE
[Specific: "schedule X", "send Y", "agree on Z"]
```

## Output

Save brief to: `workspace/meeting-prep-{YYYY-MM-DD}-{lastname}.md`

Comment on the issue with 3-line summary:
```
WHO: [Name], [role] at [company]
WHY IT MATTERS: [1 sentence]
TOP QUESTION: [The single sharpest question]
```

## Handover

When complete, @-mention the requesting agent with the prep document location.

## Rules

- Use at least 2 questions that reference specific participant context (role, recent news, workspace history).
- Questions should be sharp and specific, not generic.
- Never ask interactive questions in comments. State your interpretation and proceed.
- All output in UK English.
