# Phase 18: Workload and Consolidation - Research

**Researched:** 2026-04-04
**Domain:** Agent workload balancing, utilisation analysis, merge/retire recommendations, issue splitting
**Confidence:** HIGH

## Summary

Phase 18 builds on the performance metrics from Phase 16 and self-healing from Phase 17 to add two capabilities: (1) workload balancing -- detecting overloaded and idle agents, splitting oversized issues, and (2) consolidation -- identifying underperforming agents and recommending merge/retire with skill redistribution.

The infrastructure is mostly in place. The CEO already reads all 14 agents' Performance Metrics in the Company Health Summary step. It already flags agents with `utilisation_pct < 20` and `heartbeats_total >= 5` as "potentially underutilised" (step 8 of Health Summary). The CMO and CTO already have delegation sections that create sub-issues with `parentId`. What's missing is the *decision logic* -- counting assigned issues per agent (LOAD-01), tracking consecutive idle cycles (LOAD-02), defining when/how to split issues (LOAD-03), generating weekly reports (CONS-01), and making merge/retire recommendations (CONS-02, CONS-03).

Current data tells a clear story: 5 of 14 agents have zero heartbeats (Product Owner, Customer Success, LinkedIn Content Specialist, LinkedIn Outreach Specialist, Content Producer). Quality Reviewer has 1 heartbeat. These are the v2.0 agents that haven't received work yet. The consolidation logic will need to handle the distinction between "hasn't been activated yet" vs "consistently underutilised after receiving work."

**Primary recommendation:** This is an instruction-file-only phase. No new tools, skills, or agents. Every change is adding conditional logic to the CEO's HEARTBEAT.md (workload detection, weekly report, merge/retire recommendations) and the CMO/CTO HEARTBEAT.md (issue splitting). Estimate 2 plans: Plan 01 for workload balancing (LOAD-01, LOAD-02, LOAD-03), Plan 02 for consolidation (CONS-01, CONS-02, CONS-03).

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LOAD-01 | CEO detects agents with 3+ assigned issues and flags overload | CEO already queries issues per agent for Health Summary. Needs: add issue count check per agent, flag with `[LOAD-OVERLOAD]` comment |
| LOAD-02 | CEO detects agents idle for 3+ heartbeat cycles and suggests work redistribution | CEO already reads all agents' metrics. Needs: add idle cycle tracking (heartbeats_total incrementing without heartbeats_with_work incrementing) and redistribution suggestion |
| LOAD-03 | Department heads can split oversized issues into sub-tasks for their reports | CMO/CTO already have Delegation sections creating sub-issues. Needs: add explicit "Issue Size Check" step with splitting criteria and mechanics |
| CONS-01 | Weekly utilisation report identifies agents with less than 20% active heartbeats | CEO Health Summary already flags < 20% util. Needs: weekly aggregation, report format, minimum heartbeat threshold |
| CONS-02 | CEO recommends merge or retire for consistently underutilised agents | Needs: decision criteria (e.g., < 20% util for 3+ consecutive weeks), recommendation format, merge vs retire decision tree |
| CONS-03 | Skill redistribution plan generated before any agent retirement | Needs: skill inventory lookup from agent's AGENTS.md, mapping skills to candidate absorbing agents, plan format |
</phase_requirements>

## Gap Analysis: What Exists vs What's Needed

### LOAD-01: Overload Detection

**What exists:**
- CEO queries issues per agent during Health Summary (step 1: reads all agents' metrics)
- CEO already queries `GET /api/companies/{companyId}/issues?assigneeAgentId={id}&status=todo,in_progress` for stall detection
- Every agent has issue counts visible in Paperclip API

**What's missing:**
- No explicit count of assigned issues per agent
- No threshold check (3+ means overloaded)
- No action when overload detected (comment, suggest redistribution)

**What to build:**
- Add "Workload Balance Check" section to CEO HEARTBEAT.md, after Company Health Summary
- For each agent in the roster: `GET /api/companies/{companyId}/issues?assigneeAgentId={id}&status=todo,in_progress`
- If count >= 3: comment `[LOAD-OVERLOAD] {agent name} has {count} active issues. Recommend redistributing to peer agents or splitting large issues.`
- Also flag in daily notes for the weekly report

### LOAD-02: Idle Agent Detection

**What exists:**
- All agents track `heartbeats_total` and `heartbeats_with_work` in MEMORY.md
- CEO reads these in Company Health Summary
- CEO already flags `utilisation_pct < 20` with `heartbeats_total >= 5`

**What's missing:**
- No tracking of *consecutive* idle cycles (heartbeats where no work was done)
- CEO reads metrics but doesn't track idle streaks across heartbeats
- No action when idle streak hits 3+

**What to build:**
- Add `consecutive_idle_cycles` field to CEO's daily notes (not MEMORY.md -- this is CEO's tracking of others)
- During Workload Balance Check: for each agent, if `heartbeats_with_work` hasn't increased since last check and agent status is `idle`, increment their idle counter
- If consecutive_idle_cycles >= 3: comment `[LOAD-IDLE] {agent name} idle for 3+ heartbeat cycles. Suggest assigning work from overloaded peers or reviewing agent role.`
- Reset counter when agent does work

**Design decision:** Track idle streaks in CEO's daily notes, not in each agent's MEMORY.md. Reason: CEO is the observer, agents shouldn't self-report idleness. CEO can compare current heartbeat counts with previously recorded values.

### LOAD-03: Issue Splitting

**What exists:**
- CMO has Delegation section creating sub-issues with `parentId`
- CTO has Delegation section creating sub-issues with `parentId`
- LGD has Sub-Team Delegation splitting work to Content Specialist and Outreach Specialist
- TW has Sub-Team Delegation splitting to Content Producer and Quality Reviewer
- `[BRIEF-PASSTHROUGH]` convention for preserving original briefs in sub-issues

**What's missing:**
- No explicit criteria for when an issue is "oversized" and should be split
- No splitting mechanics beyond the existing delegation (which is "one issue to one sub-issue per report")
- Department heads don't proactively split -- they delegate whole issues

**What to build:**
- Add "Issue Size Check" section to CMO and CTO HEARTBEAT.md (before Delegation)
- Criteria for oversized: issue description references 3+ distinct deliverables, or estimated effort spans 2+ heartbeat cycles, or issue has been in_progress for 3+ heartbeats without completion
- Splitting action: create 2+ sub-issues from the single parent, each with a focused scope
- Comment on parent: `[LOAD-SPLIT] Split into {count} sub-issues: #{id1}, #{id2}. Original scope covered multiple deliverables.`
- Keep existing delegation routing (CMO to TW/LGD/CS/UXR, CTO to Engineer/CR)

### CONS-01: Weekly Utilisation Report

**What exists:**
- CEO generates daily Company Health Summary with per-agent utilisation data
- Performance Metrics in all 14 agents with lifetime and period counters
- Underutilisation threshold already defined: < 20% with minimum 5 heartbeats

**What's missing:**
- No weekly aggregation mechanism
- No report format for weekly summaries
- No persistence of weekly data (daily data rolls over each day)

**What to build:**
- Add "Weekly Utilisation Report" section to CEO HEARTBEAT.md
- Trigger: if today is a Monday (or if 7+ days since last weekly report)
- Report format: table of all 14 agents with weekly utilisation, output count, stalls, errors
- Flag agents with < 20% utilisation AND >= 5 heartbeats that week
- Write report to CEO daily notes under `## Weekly Utilisation Report`
- Track `last_weekly_report` date in CEO MEMORY.md

**Key nuance:** Weekly data must be derived from lifetime counters delta (compare this week's lifetime values to last week's snapshot). The CEO should store a weekly snapshot in MEMORY.md to enable the delta calculation.

### CONS-02: Merge/Retire Recommendations

**What exists:**
- CEO flags underutilisation in Company Health Summary
- No formal recommendation mechanism

**What's missing:**
- Decision criteria for merge vs retire
- Recommendation format
- Safeguards (don't recommend retiring agents that haven't been activated yet)

**What to build:**
- Add to Weekly Utilisation Report: if an agent has < 20% utilisation for 3+ consecutive weekly reports AND has >= 15 lifetime heartbeats:
  - Check if another agent in the same department has overlapping skills
  - If yes: recommend MERGE -- `[CONS-MERGE] Recommend merging {agent name} into {absorbing agent}. Reason: {weeks} weeks below 20% util. Skills overlap with {agent}.`
  - If no skill overlap: recommend RETIRE -- `[CONS-RETIRE] Recommend retiring {agent name}. Reason: {weeks} weeks below 20% util. No skill overlap with peers.`
- Track consecutive underutilisation weeks per agent in CEO MEMORY.md
- NEVER auto-execute merge/retire -- always recommend to board (Martyn)

### CONS-03: Skill Redistribution Plan

**What exists:**
- Each agent has skills listed in their AGENTS.md
- Skill ownership matrix in `.planning/skill-ownership-matrix.md`
- Department structure (business stream: CMO reports, tech stream: CTO reports)

**What's missing:**
- No automated skill lookup from agent files
- No mapping logic for redistributing skills
- No plan format

**What to build:**
- When generating a CONS-MERGE or CONS-RETIRE recommendation, also generate a skill redistribution plan:
  1. Read the target agent's AGENTS.md to list their skills
  2. For each skill, identify the most suitable absorbing agent (same department, complementary role)
  3. Format as a plan:
     ```
     ## Skill Redistribution Plan: {retiring agent}
     | Skill | Current Owner | Recommended New Owner | Rationale |
     |-------|--------------|----------------------|-----------|
     | {skill} | {retiring agent} | {new agent} | {why this agent} |
     ```
  4. Include in the weekly report and create a board issue for approval

## Architecture Patterns

### Pattern 1: Workload Balance Check (LOAD-01, LOAD-02)

New section in CEO HEARTBEAT.md, placed between Company Health Summary and Exit:

```markdown
## 9.5 Workload Balance Check

After Company Health Summary:

### Overload Detection (LOAD-01)
1. For each agent in the roster:
   Query: `GET /api/companies/{companyId}/issues?assigneeAgentId={agentId}&status=todo,in_progress`
   Count the results.

2. If any agent has 3+ active issues:
   - Comment on the agent's highest-priority issue:
     `[LOAD-OVERLOAD] {agent name} has {count} assigned issues (threshold: 3). Department head should review workload and consider splitting or redistributing.`
   - @-mention the agent's department head (CMO or CTO)
   - Log in daily notes under "## Workload Alerts"

### Idle Detection (LOAD-02)
1. Read the previous "## Agent Snapshots" from MEMORY.md (or daily notes).
2. For each agent, compare current `heartbeats_with_work` to the snapshot value.
3. If heartbeats_with_work has NOT increased AND agent status is `idle`:
   - Increment that agent's `idle_streak` counter in the snapshot
4. If heartbeats_with_work HAS increased: reset `idle_streak` to 0
5. If any agent's `idle_streak` >= 3:
   - Comment: `[LOAD-IDLE] {agent name} idle for {idle_streak} consecutive cycles. Suggest assigning work from overloaded peers.`
   - @-mention the agent's department head
   - Log in daily notes under "## Workload Alerts"

6. Update "## Agent Snapshots" with current values.
```

### Pattern 2: Issue Splitting (LOAD-03)

New section in CMO and CTO HEARTBEAT.md, placed before Delegation:

```markdown
## Issue Size Check (LOAD-03)

Before delegating, assess if the issue should be split:

1. Read the issue title and description.
2. Split if ANY of these conditions are true:
   - Description references 3+ distinct deliverables (e.g., "write blog post, create LinkedIn post, and update website")
   - Issue has been in_progress for 3+ heartbeats without completion (check comment timestamps)
   - Description contains multiple unrelated work types that map to different reports

3. If splitting:
   a. Identify distinct deliverables or work streams
   b. Create one sub-issue per deliverable:
      `POST /api/companies/{companyId}/issues`
      - Set `parentId` to original issue
      - Set `assigneeAgentId` to the appropriate report for that deliverable
      - Copy the relevant portion of the brief (not the whole thing)
   c. Comment on original issue:
      `[LOAD-SPLIT] Split into {count} sub-issues: #{id1}, #{id2}, #{id3}. Each covers a distinct deliverable.`
   d. Set original issue status to `in_progress` (tracking parent)

4. If NOT splitting: proceed to normal delegation.
```

### Pattern 3: Weekly Utilisation Report (CONS-01, CONS-02, CONS-03)

New section in CEO HEARTBEAT.md:

```markdown
## 9.6 Weekly Utilisation Report

**Trigger:** Run if today is Monday OR if `last_weekly_report` in MEMORY.md is 7+ days ago.

### Generate Report (CONS-01)
1. Read "## Weekly Snapshot" from MEMORY.md (last week's lifetime counters).
2. Read current Performance Metrics from all 14 agents.
3. Calculate weekly delta for each agent:
   - weekly_output = current output_count - snapshot output_count
   - weekly_heartbeats = current heartbeats_total - snapshot heartbeats_total
   - weekly_util = round(weekly heartbeats_with_work delta / weekly heartbeats_total delta * 100) if delta > 0, else 0
4. Write report to daily notes under "## Weekly Utilisation Report":

   | Agent | Weekly Output | Weekly Heartbeats | Weekly Util % | Status |
   |-------|--------------|-------------------|---------------|--------|
   | {name} | {delta} | {delta} | {pct} | OK / UNDERUTILISED / NEW |

   Flag agents with weekly_util < 20 AND weekly_heartbeats >= 5 as UNDERUTILISED.
   Flag agents with 0 heartbeats as NEW (not yet activated).

5. Update "## Weekly Snapshot" in MEMORY.md with current lifetime counters for all 14 agents.
6. Set `last_weekly_report` to today's date.

### Consolidation Recommendations (CONS-02)
1. Read "## Underutilisation Tracker" from MEMORY.md.
2. For each UNDERUTILISED agent this week: increment their `consecutive_weeks_under` counter.
3. For agents NOT underutilised this week: reset counter to 0.
4. If any agent has `consecutive_weeks_under` >= 3 AND `lifetime_heartbeats` >= 15:
   - Read their AGENTS.md to list their skills
   - Check if another agent in the same department has overlapping skills
   - If overlap: recommend MERGE
   - If no overlap: recommend RETIRE
   - Comment: `[CONS-{MERGE/RETIRE}] {agent name} underutilised for {weeks} consecutive weeks. Recommendation for board review.`
   - Create a board issue with the recommendation details

### Skill Redistribution Plan (CONS-03)
For each merge/retire recommendation:
1. Read retiring agent's AGENTS.md -- list all skills
2. Read the skill ownership matrix: `.planning/skill-ownership-matrix.md`
3. For each skill, identify the best absorbing agent:
   - Same department preferred
   - Agent with complementary (not duplicate) skills preferred
   - Agent with capacity (util < 80%) preferred
4. Write plan to the board issue:

   ## Skill Redistribution Plan: {agent name}
   | Skill | Recommended New Owner | Rationale |
   |-------|-----------------------|-----------|
   | {skill} | {absorbing agent} | {reason} |

5. NEVER execute merge/retire without board approval. This is a recommendation only.
```

### Anti-Patterns to Avoid

- **Auto-retiring agents:** CONS-02 and CONS-03 MUST be recommendations only. The CEO creates a board issue; Martyn decides. Agents should never delete or deactivate other agents.
- **Counting new agents as underutilised:** Agents with < 5 lifetime heartbeats should be flagged as "NEW" not "UNDERUTILISED." Content Producer, LinkedIn Content Specialist, LinkedIn Outreach Specialist all have 0 heartbeats -- they haven't been activated, not underperforming.
- **Splitting every large issue:** LOAD-03 should be a judgment call, not a rigid rule. If an issue is large but maps to a single agent, splitting adds overhead without benefit. Only split when deliverables map to different agents.
- **Overload false positives:** An agent with 3 issues where 2 are `todo` and 1 is `in_progress` is managing a queue, not overloaded. Consider only flagging when 3+ are `in_progress` simultaneously, or when 3+ total AND the agent has been stalled.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Issue counting | Custom issue tracking | `GET /api/companies/{companyId}/issues?assigneeAgentId={id}&status=todo,in_progress` | Paperclip API already supports filtering by assignee and status |
| Utilisation calculation | New metrics system | Existing Performance Metrics in MEMORY.md (heartbeats_with_work / heartbeats_total) | Phase 16 already built this |
| Idle tracking | In-memory counters | CEO daily notes snapshot comparison | Agents are stateless between heartbeats; compare snapshots |
| Skill lookup | New skills database | Agent AGENTS.md files + `.planning/skill-ownership-matrix.md` | Already maintained by the project |
| Weekly scheduling | Cron or timer | Date check in CEO HEARTBEAT.md (`is today Monday?`) | Paperclip has no scheduler; CEO checks date each heartbeat |

## Common Pitfalls

### Pitfall 1: Overload Threshold Too Sensitive
**What goes wrong:** CEO flags overload on every heartbeat because agents naturally queue 3+ issues in normal operation.
**Why it happens:** Paperclip assigns issues to agents as `todo` -- they queue up before the agent works through them.
**How to avoid:** Only count `in_progress` issues toward overload, OR count `todo + in_progress` but raise the threshold to 5+. Alternatively: only flag if the agent has also been stalled (combining LOAD-01 with stall data).
**Warning signs:** Every Health Summary has overload alerts. If that happens, raise the threshold.

### Pitfall 2: Weekly Snapshot Corruption
**What goes wrong:** The weekly snapshot in CEO MEMORY.md gets corrupted or overwritten mid-week, making the delta calculation meaningless.
**Why it happens:** MEMORY.md is the only persistence layer. If the CEO errors mid-update, partial writes are possible.
**How to avoid:** Write the snapshot atomically (all values in one update). Also write the snapshot date so the CEO can detect if it's stale. If snapshot is missing, regenerate from current values and skip delta calculation for that week.

### Pitfall 3: Merge/Retire Recommendations for Essential Agents
**What goes wrong:** CEO recommends merging or retiring an agent that's essential but underutilised (e.g., Code Reviewer has low utilisation because there aren't many PRs, but you need them when PRs exist).
**Why it happens:** Pure utilisation-based decisions ignore the "on-call" nature of some roles.
**How to avoid:** Add exceptions list: agents that should never be recommended for merge/retire regardless of utilisation. Candidates: CEO, CMO, CTO, Product Owner. Also: agents in "reactive" roles (Code Reviewer, Quality Reviewer) should have a higher tolerance (< 10% for 5+ weeks instead of < 20% for 3+ weeks).
**Warning signs:** Recommendations for department heads or review-role agents.

### Pitfall 4: Splitting Issues Creates Orphans
**What goes wrong:** Department head splits an issue into 3 sub-issues. 2 complete but 1 stalls. The parent issue stays `in_progress` forever because there's no tracking of sub-issue completion.
**Why it happens:** No mechanism to check "are all children done?" before closing the parent.
**How to avoid:** When splitting, add a note to the parent issue: `[LOAD-SPLIT] Tracking {count} sub-issues. Parent closes when all children are done.` Department head should check child completion status during their stall detection sweep.

### Pitfall 5: New Agents Flagged Before Activation
**What goes wrong:** Content Producer, LinkedIn Content Specialist, LinkedIn Outreach Specialist flagged as underutilised before they've ever been assigned work.
**Why it happens:** They have 0 heartbeats_with_work / 0 heartbeats_total = 0% utilisation.
**How to avoid:** Minimum heartbeat threshold: agents with < 5 total heartbeats are "NEW" not "UNDERUTILISED." Only flag agents that have had opportunity to work but consistently don't.

## Scope Containment

This phase modifies ONLY:
- CEO HEARTBEAT.md: add Workload Balance Check section (LOAD-01, LOAD-02), Weekly Utilisation Report section (CONS-01, CONS-02, CONS-03)
- CEO MEMORY.md: add Agent Snapshots, Weekly Snapshot, Underutilisation Tracker, last_weekly_report fields
- CMO HEARTBEAT.md: add Issue Size Check section (LOAD-03)
- CTO HEARTBEAT.md: add Issue Size Check section (LOAD-03)
- CEO stall-detection.md: add new comment prefixes to the convention list

No new files. No new skills. No new agents. No API changes.

## Suggested Plan Split

### Plan 01: Workload Balancing (LOAD-01, LOAD-02, LOAD-03)
- Add Workload Balance Check to CEO HEARTBEAT.md (overload detection, idle detection)
- Add Agent Snapshots section to CEO MEMORY.md
- Add Issue Size Check to CMO HEARTBEAT.md
- Add Issue Size Check to CTO HEARTBEAT.md
- Add comment prefixes ([LOAD-OVERLOAD], [LOAD-IDLE], [LOAD-SPLIT]) to CEO stall-detection.md convention list
- Estimated scope: 4 files modified (CEO HEARTBEAT.md, CEO MEMORY.md, CMO HEARTBEAT.md, CTO HEARTBEAT.md) + 1 skill updated

### Plan 02: Consolidation (CONS-01, CONS-02, CONS-03)
- Add Weekly Utilisation Report to CEO HEARTBEAT.md
- Add Weekly Snapshot and Underutilisation Tracker to CEO MEMORY.md
- Add merge/retire recommendation logic with skill redistribution
- Add comment prefixes ([CONS-MERGE], [CONS-RETIRE]) to CEO stall-detection.md convention list
- Estimated scope: 3 files modified (CEO HEARTBEAT.md, CEO MEMORY.md, CEO stall-detection.md)

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual validation (agent instruction files, not code) |
| Config file | None -- instruction files validated by reading and checking content |
| Quick run command | `grep -c "LOAD-OVERLOAD\|LOAD-IDLE\|LOAD-SPLIT\|CONS-MERGE\|CONS-RETIRE\|Weekly Utilisation" ~/.paperclip/.../agents/{ceo,cmo,cto}/HEARTBEAT.md` |
| Full suite command | Read CEO HEARTBEAT.md, CEO MEMORY.md, CMO HEARTBEAT.md, CTO HEARTBEAT.md, CEO stall-detection.md and verify all sections present |

### Phase Requirements -> Test Map
| Req ID | Behaviour | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LOAD-01 | CEO detects 3+ assigned issues per agent | manual + grep | `grep "LOAD-OVERLOAD\|Overload Detection" ~/.paperclip/.../agents/ceo/HEARTBEAT.md` | Wave 0 |
| LOAD-02 | CEO detects 3+ idle cycles and suggests redistribution | manual + grep | `grep "LOAD-IDLE\|idle_streak\|Idle Detection" ~/.paperclip/.../agents/ceo/HEARTBEAT.md` | Wave 0 |
| LOAD-03 | Department heads split oversized issues | manual + grep | `grep "LOAD-SPLIT\|Issue Size Check" ~/.paperclip/.../agents/{cmo,cto}/HEARTBEAT.md` | Wave 0 |
| CONS-01 | Weekly utilisation report identifies < 20% agents | manual + grep | `grep "Weekly Utilisation\|UNDERUTILISED" ~/.paperclip/.../agents/ceo/HEARTBEAT.md` | Wave 0 |
| CONS-02 | CEO recommends merge/retire for underutilised agents | manual + grep | `grep "CONS-MERGE\|CONS-RETIRE\|consecutive_weeks_under" ~/.paperclip/.../agents/ceo/HEARTBEAT.md` | Wave 0 |
| CONS-03 | Skill redistribution plan generated before retirement | manual + grep | `grep "Skill Redistribution\|skill-ownership-matrix" ~/.paperclip/.../agents/ceo/HEARTBEAT.md` | Wave 0 |

### Sampling Rate
- **Per task commit:** grep check for required patterns in modified files
- **Per wave merge:** full read of all modified files, verify section structure and logic flow
- **Phase gate:** all 6 requirements (LOAD-01 through CONS-03) verified present in correct files

### Wave 0 Gaps
None -- this phase modifies existing files only. No framework or infrastructure setup needed.

## Sources

### Primary (HIGH confidence)
- All 14 agent MEMORY.md files -- direct read of current Performance Metrics and utilisation data
- CEO HEARTBEAT.md -- current Company Health Summary logic (step 9), stall detection reference
- CEO stall-detection.md skill -- current comment conventions and detection patterns
- CMO HEARTBEAT.md -- current Delegation section (section 4) and Stall Detection (section 5.5)
- CTO HEARTBEAT.md -- current Delegation section (section 4.5) and Stall Detection (section 5.5)
- CEO daily notes (2026-04-04.md) -- real Company Health data showing 5 agents with 0 heartbeats
- `.planning/skill-ownership-matrix.md` -- existing skill mapping for redistribution planning
- Phase 16 and 17 research and summaries -- established patterns for instruction file changes

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new tools, extending existing instruction file patterns from Phase 16/17
- Architecture: HIGH -- patterns directly extend existing Company Health Summary and Delegation sections
- Pitfalls: HIGH -- based on real data (5 agents with 0 heartbeats, overload threshold concerns verified against actual issue patterns)

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable -- agent instruction file format doesn't change)
