# Phase 16: Performance Monitoring - Research

**Researched:** 2026-04-04
**Domain:** Paperclip agent instrumentation via MEMORY.md and HEARTBEAT.md primitives
**Confidence:** HIGH

## Summary

Phase 16 adds performance metrics to the existing 14-agent Paperclip company. The constraint is clear: all monitoring must work through MEMORY.md edits and HEARTBEAT.md steps. No external monitoring tools, no dashboards, no databases.

The current state provides a strong foundation. Every agent already has a Heartbeat Checkpoint section in MEMORY.md with status, last step, active issue, and timestamp. The CEO already runs stall detection and event bus monitoring. The X-Dept Counter section exists in CMO, CTO, and PO MEMORY files. What's missing is: (a) per-heartbeat output/stall/error counters, (b) utilisation ratios, (c) a CEO-generated daily health summary, and (d) structured event bus metrics.

**Primary recommendation:** Add a `## Performance Metrics` section to every agent's MEMORY.md with cumulative counters, then add a metrics-update step to every HEARTBEAT.md, and a health-summary step to the CEO's HEARTBEAT.md.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MON-01 | Each agent's heartbeat logs output count, stall count, and error count to MEMORY.md | New `## Performance Metrics` section in all 14 MEMORY.md files + new heartbeat step to increment counters |
| MON-02 | CEO generates a daily company health summary (agents active, stalled, errored, issues completed) | New CEO heartbeat step that reads all 14 agents' Performance Metrics sections and writes summary to CEO's daily notes |
| MON-03 | Agent utilisation tracked (heartbeats with work vs heartbeats idle) | Add `heartbeats_total`, `heartbeats_with_work`, and derived ratio to Performance Metrics section |
| MON-04 | Cross-department event bus metrics logged (handoffs created, approved, rejected, stalled) | Extend CEO's existing Event Bus Monitoring heartbeat step to log cumulative counters |
</phase_requirements>

## Standard Stack

### Core

No libraries. This is pure Paperclip-primitive work: editing markdown files and adding heartbeat steps.

| Component | Location | Purpose | Why Standard |
|-----------|----------|---------|--------------|
| MEMORY.md | `$AGENT_HOME/MEMORY.md` | Per-agent persistent state | Already used by all 14 agents for checkpoints |
| HEARTBEAT.md | `$AGENT_HOME/HEARTBEAT.md` | Per-heartbeat execution checklist | Already used by all 14 agents |
| Daily notes | `$AGENT_HOME/memory/YYYY-MM-DD.md` | CEO daily output | CEO already writes daily notes in this location |
| Paperclip API | `/api/companies/{id}/issues` | Issue queries for counts | Already used by CEO for stall detection and event bus |

### Supporting

| Tool | Purpose | When to Use |
|------|---------|-------------|
| Paperclip issue API | Query issue counts per agent | CEO health summary generation |
| Paperclip agent API | Query agent status (running/idle/error) | CEO health summary generation |

### Alternatives Considered

None. The project constraints explicitly rule out external monitoring tools, dashboards, and infrastructure beyond Paperclip primitives.

## Architecture Patterns

### MEMORY.md Metrics Section

Every agent gets a new `## Performance Metrics` section between the existing `## Heartbeat Checkpoint` and any other sections. The format must be machine-parseable by the CEO agent.

```markdown
## Performance Metrics

### Lifetime Counters
output_count: 3
stall_count: 0
error_count: 1

### Utilisation
heartbeats_total: 5
heartbeats_with_work: 3
utilisation_pct: 60

### Current Period (daily)
period_start: 2026-04-04
period_output: 2
period_stalls: 0
period_errors: 0

> **Reset rule:** At heartbeat start, if `period_start` is not today's date, add period values to lifetime counters, then reset period counters and set `period_start` to today.
```

**Why this structure:**
- Lifetime counters give Phase 18 (consolidation) the historical data it needs
- Daily period counters give the CEO the data for MON-02 daily summaries
- The reset rule pattern is already established (see X-Dept Counter in CMO/CTO/PO MEMORY.md)
- Key-value format is trivially parseable by the CEO agent reading MEMORY.md

### HEARTBEAT.md Metrics Step

Every agent's HEARTBEAT.md gets a new step inserted before the Exit step. The step runs at the end of each heartbeat.

```markdown
## N. Update Performance Metrics

Before exiting, update `$AGENT_HOME/MEMORY.md` section "## Performance Metrics":

1. Increment `heartbeats_total` by 1
2. If you worked on any issue this heartbeat, increment `heartbeats_with_work` by 1
3. For each issue completed (moved to `done` or `in_review`) this heartbeat, increment `period_output` by 1
4. If you detected a stall on yourself (409, deadlock, couldn't proceed), increment `period_stalls` by 1
5. If you encountered an error (API failure, checkout failure, processing error), increment `period_errors` by 1
6. Recalculate `utilisation_pct`: round(heartbeats_with_work / heartbeats_total * 100)
7. If `period_start` is not today's date: roll period values into lifetime counters, reset period counters, set `period_start` to today
```

### CEO Health Summary Step

The CEO's HEARTBEAT.md gets a new step after Event Bus Monitoring and before Exit.

```markdown
## N. Daily Health Summary

Generate a company health summary by reading Performance Metrics from all 14 agents:

1. Read `$AGENT_HOME/../{agent}/MEMORY.md` for each agent in the roster
2. Extract: output_count, stall_count, error_count, utilisation_pct, period_output from Performance Metrics
3. Query: `GET /api/companies/{companyId}/issues?status=done` (filter by updated today) for issues completed count
4. Write summary to daily notes (`$AGENT_HOME/memory/YYYY-MM-DD.md`) under `## Company Health`:

```
## Company Health

**Date:** 2026-04-04
**Agents active:** 12 | **Stalled:** 1 | **Errored:** 1 | **Issues completed today:** 5

| Agent | Output (today) | Stalls (lifetime) | Errors (lifetime) | Utilisation |
|-------|----------------|--------------------|--------------------|-------------|
| CMO | 2 | 0 | 0 | 80% |
| CTO | 1 | 0 | 1 | 60% |
| ... | ... | ... | ... | ... |

**Event Bus:**
handoffs_created: 3 | approved: 2 | rejected: 0 | stalled: 1
```

### CEO Event Bus Metrics Extension

The CEO already has an Event Bus Monitoring step. Extend it to log cumulative counters to MEMORY.md.

```markdown
## X-Dept Metrics

handoffs_created: 12
handoffs_approved: 8
handoffs_rejected: 1
handoffs_stalled: 3
last_updated: 2026-04-04T13:05:00Z
```

The CEO already queries x-dept labelled issues. The addition is counting by status and persisting those counts.

### Agent File Paths (all 14)

The CEO needs to read all 14 agents' MEMORY.md files. The agent home paths:

```
$PAPERCLIP_ROOT/agents/ceo/MEMORY.md
$PAPERCLIP_ROOT/agents/cmo/MEMORY.md
$PAPERCLIP_ROOT/agents/cto/MEMORY.md
$PAPERCLIP_ROOT/agents/product-owner/MEMORY.md
$PAPERCLIP_ROOT/agents/technical-writer/MEMORY.md
$PAPERCLIP_ROOT/agents/customer-success/MEMORY.md
$PAPERCLIP_ROOT/agents/ux-researcher/MEMORY.md
$PAPERCLIP_ROOT/agents/linkedin-growth-director/MEMORY.md
$PAPERCLIP_ROOT/agents/engineer/MEMORY.md
$PAPERCLIP_ROOT/agents/code-reviewer/MEMORY.md
$PAPERCLIP_ROOT/agents/linkedin-content-specialist/MEMORY.md
$PAPERCLIP_ROOT/agents/linkedin-outreach-specialist/MEMORY.md
$PAPERCLIP_ROOT/agents/content-producer/MEMORY.md (sub-agent name TBC)
$PAPERCLIP_ROOT/agents/quality-reviewer/MEMORY.md
```

Where `$PAPERCLIP_ROOT` = `/Users/martynmakinson/.paperclip/instances/default/companies/FourPointZero`

### Anti-Patterns to Avoid

- **Complex metric schemas:** Keep it flat key-value pairs. Agents parse their own MEMORY.md on every heartbeat. Nested structures or arrays will cause parsing errors and drift.
- **Real-time dashboards:** Out of scope (see REQUIREMENTS.md Out of Scope). The CEO's daily notes ARE the dashboard.
- **Metrics in HEARTBEAT.md:** HEARTBEAT.md is the checklist (what to do). MEMORY.md is the state (what happened). Metrics belong in MEMORY.md.
- **Per-issue granularity in metrics:** Don't log individual issue IDs in the metrics section. That's what the Paperclip issue API is for. Metrics are aggregates only.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Metric storage | Custom file format or JSON | Flat key-value in MEMORY.md | Consistent with existing patterns (X-Dept Counter, Heartbeat Checkpoint) |
| Agent enumeration | Hardcoded agent list in CEO HEARTBEAT | Agent roster in CEO MEMORY.md or AGENTS.md | Roster already exists; hardcoding breaks when agents are added/removed in Phase 18 |
| Time-series data | Append-only log files | Daily period + lifetime counters | Paperclip agents can't efficiently process growing log files |
| Event bus counting | Separate metrics file | Extend existing X-Dept Summary in CEO MEMORY.md | Section already exists, just needs more fields |

**Key insight:** Every metric pattern needed already has a precedent in the codebase. X-Dept Counter shows period-reset logic. Heartbeat Checkpoint shows per-agent state tracking. The CEO's Event Bus Monitoring shows cross-agent querying. This phase is extending existing patterns, not inventing new ones.

## Common Pitfalls

### Pitfall 1: Counter Drift from Interrupted Heartbeats
**What goes wrong:** Agent increments `heartbeats_total` at step start but crashes before incrementing `heartbeats_with_work` or `period_output`. Counters become inconsistent.
**Why it happens:** MEMORY.md writes are not atomic. A crash mid-heartbeat leaves partial state.
**How to avoid:** All metrics updates happen in ONE step at the END of the heartbeat, just before exit. The checkpoint protocol already handles resume-from-crash. If a heartbeat is interrupted, the metrics step never ran, so no partial state.
**Warning signs:** `heartbeats_total` growing faster than expected relative to `heartbeats_with_work`.

### Pitfall 2: CEO Health Summary Reads Stale Data
**What goes wrong:** CEO reads an agent's MEMORY.md while that agent's heartbeat is in progress. Gets last-heartbeat's metrics, not current.
**Why it happens:** Stagger groups reduce but don't eliminate concurrent execution.
**How to avoid:** Accept it. The metrics are one-heartbeat-delayed at worst. This is monitoring, not real-time control. Document in the health summary: "Metrics reflect last completed heartbeat."
**Warning signs:** None needed. This is acceptable behaviour.

### Pitfall 3: Period Reset Race Condition
**What goes wrong:** Agent's heartbeat spans midnight. Period metrics get reset mid-heartbeat, losing the current heartbeat's counters.
**Why it happens:** The period-reset check runs at heartbeat start, but the metrics-update step runs at heartbeat end.
**How to avoid:** Period reset (rolling period into lifetime) happens at heartbeat START. Metrics increment happens at heartbeat END. Both directions are safe because the lifetime counters are cumulative.
**Warning signs:** Lifetime counters not matching sum of daily periods (acceptable, off by at most one heartbeat).

### Pitfall 4: Bloated MEMORY.md Files
**What goes wrong:** Adding metrics to 14 agents increases MEMORY.md size, slowing heartbeat startup (every agent reads MEMORY.md first).
**Why it happens:** Metrics section grows if not kept flat.
**How to avoid:** Keep the metrics section to ~15 lines maximum. No arrays, no history, no per-issue data. Lifetime + current period only.
**Warning signs:** MEMORY.md exceeding 100 lines.

### Pitfall 5: Inconsistent Metric Definitions
**What goes wrong:** Different agents count "output" differently. CMO counts delegations as output. Engineer counts code commits. Metrics become incomparable.
**Why it happens:** No standard definition of what counts as output.
**How to avoid:** Define precisely: `output_count` = issues moved to `done` or `in_review` by this agent during this heartbeat. Delegations (creating sub-issues) are NOT output. Stall nudges are NOT output.
**Warning signs:** Department heads showing higher output than specialists despite doing no direct work.

## Code Examples

### MEMORY.md Performance Metrics Template (for all 14 agents)

```markdown
## Performance Metrics

### Lifetime Counters
output_count: 0
stall_count: 0
error_count: 0

### Utilisation
heartbeats_total: 0
heartbeats_with_work: 0
utilisation_pct: 0

### Current Period (daily)
period_start: 2026-04-04
period_output: 0
period_stalls: 0
period_errors: 0

> **Reset rule:** At heartbeat start, if `period_start` is not today's date, add period values to lifetime counters, then reset period counters and set `period_start` to today.
```

### HEARTBEAT.md Metrics Step Template (for all 14 agents)

```markdown
## [N]. Update Performance Metrics

Before exiting, update `$AGENT_HOME/MEMORY.md` section "## Performance Metrics":

1. **Period rollover check:** If `period_start` is not today, roll period counters into lifetime counters and reset period values. Set `period_start` to today.
2. Increment `heartbeats_total` by 1.
3. If you checked out and worked on any issue this heartbeat: increment `heartbeats_with_work` by 1.
4. For each issue you moved to `done` or `in_review` this heartbeat: increment `period_output` by 1.
5. If you were stalled (409 conflict, no actionable work despite assignments, deadlock): increment `period_stalls` by 1.
6. If you hit an error (API failure, unexpected state, processing exception): increment `period_errors` by 1.
7. Recalculate `utilisation_pct`: round(heartbeats_with_work / heartbeats_total * 100).
```

### CEO Health Summary Heartbeat Step

```markdown
## [N]. Company Health Summary

After event bus monitoring and before exit:

1. Read Performance Metrics from all agents listed in AGENTS.md Company Structure.
   Path pattern: `$AGENT_HOME/../{agent-dirname}/MEMORY.md`
2. For each agent, extract: period_output, stall_count (lifetime), error_count (lifetime), utilisation_pct.
3. Query agent statuses: `GET /api/companies/{companyId}/agents` -- count running, idle, error, paused.
4. Query issues completed today: `GET /api/companies/{companyId}/issues?status=done` filtered by updatedAt >= today.
5. Read X-Dept Metrics from own MEMORY.md.
6. Write summary to `$AGENT_HOME/memory/YYYY-MM-DD.md` under `## Company Health`:

| Agent | Output (today) | Stalls (lifetime) | Errors (lifetime) | Util % |
|-------|----------------|--------------------|--------------------|--------|
| {name} | {period_output} | {stall_count} | {error_count} | {utilisation_pct} |

**Event Bus:** created: {n} | approved: {n} | rejected: {n} | stalled: {n}

7. If any agent has `error_count` > 0 that increased since last summary: flag in daily notes.
8. If any agent has `utilisation_pct` < 20 and `heartbeats_total` >= 5: flag as potentially underutilised (feeds Phase 18).
```

### CEO X-Dept Metrics Extension

```markdown
## X-Dept Metrics

handoffs_created: 0
handoffs_approved: 0
handoffs_rejected: 0
handoffs_stalled: 0
last_updated: 2026-04-04T00:00:00Z
```

Added to CEO MEMORY.md. Updated during the existing Event Bus Monitoring step by counting x-dept labelled issues by status:
- `todo` or `in_progress` with x-dept label created since last check = increment `handoffs_created`
- `done` with x-dept label = increment `handoffs_approved`
- `cancelled` with x-dept label and rejection comment = increment `handoffs_rejected`
- Flagged by stall detection with x-dept label = increment `handoffs_stalled`

## State of the Art

| Current State | After Phase 16 | Impact |
|---------------|----------------|--------|
| Heartbeat Checkpoint (status/step/issue only) | + Performance Metrics (output/stall/error/utilisation) | Every agent becomes measurable |
| CEO stall detection (qualitative nudges) | + Quantitative health summary with per-agent metrics | Data-driven decisions possible |
| X-Dept Summary (active/pending/stalled counts) | + Cumulative event bus metrics (created/approved/rejected/stalled) | Handoff health becomes visible |
| No utilisation tracking | Heartbeats with work vs total heartbeats | Phase 18 consolidation has data to work with |

## Open Questions

1. **What counts as "output" for management agents (CEO, CMO, CTO)?**
   - What we know: Specialist agents have clear output (issues completed). Department heads delegate and review, which is less clear-cut.
   - Recommendation: Define output as issues moved to `done` or `in_review` regardless of agent role. Delegations (creating child issues) are coordination, not output. This keeps the metric consistent and lets Phase 18 decide what utilisation thresholds mean per role.

2. **Should the CEO health summary be written every heartbeat or once per day?**
   - What we know: MON-02 says "daily" summary. CEO heartbeats can run multiple times per day.
   - Recommendation: Write/overwrite the Company Health section in daily notes on every heartbeat. The last write of the day is the "daily summary." This avoids needing to detect "is this my last heartbeat today" (which is unknowable).

3. **How to handle agents that haven't run yet (0 heartbeats)?**
   - What we know: 4 sub-agents are new (LinkedIn Content/Outreach Specialist, Content Producer, Quality Reviewer) and have minimal or no heartbeat history.
   - Recommendation: Show them in the health summary with `heartbeats_total: 0` and `utilisation_pct: N/A`. Don't flag as underutilised until `heartbeats_total >= 5`.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual validation via Paperclip heartbeats |
| Config file | None (no automated test framework) |
| Quick run command | Trigger one agent heartbeat and verify MEMORY.md updated |
| Full suite command | Trigger CEO heartbeat and verify health summary written |

### Phase Requirements to Test Map

| Req ID | Behaviour | Test Type | Validation Method | Exists? |
|--------|----------|-----------|-------------------|---------|
| MON-01 | Agent heartbeat logs output/stall/error to MEMORY.md | manual | Trigger any agent heartbeat, read MEMORY.md Performance Metrics section | No -- Wave 0 |
| MON-02 | CEO generates daily health summary | manual | Trigger CEO heartbeat, read daily notes for Company Health section | No -- Wave 0 |
| MON-03 | Agent utilisation tracked | manual | After 3+ heartbeats, verify utilisation_pct = round(with_work/total * 100) | No -- Wave 0 |
| MON-04 | Event bus metrics logged | manual | Create x-dept issue, trigger CEO heartbeat, verify X-Dept Metrics counters | No -- Wave 0 |

### Sampling Rate

- **Per task:** Verify MEMORY.md after each file edit
- **Per wave:** Trigger full CEO heartbeat and verify health summary
- **Phase gate:** All 4 MON requirements verified via manual heartbeat triggers

### Wave 0 Gaps

- [ ] Performance Metrics section added to all 14 MEMORY.md files
- [ ] Metrics update step added to all 14 HEARTBEAT.md files
- [ ] Company Health Summary step added to CEO HEARTBEAT.md
- [ ] X-Dept Metrics section added to CEO MEMORY.md
- [ ] Event Bus Monitoring step in CEO HEARTBEAT.md extended

## Sources

### Primary (HIGH confidence)
- All 14 agent MEMORY.md files -- read directly to confirm current structure
- CEO HEARTBEAT.md -- read directly to confirm stall detection and event bus monitoring steps
- CMO, CTO, Technical Writer HEARTBEAT.md -- read directly to confirm heartbeat step patterns
- CEO stall-detection.md skill -- read directly to confirm monitoring hierarchy
- REQUIREMENTS.md -- read directly for MON-01 through MON-04 definitions
- ROADMAP.md -- read directly for Phase 16 success criteria

### Secondary (MEDIUM confidence)
- None needed. All findings are from direct file reads of the actual codebase.

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- this is pure file editing, no libraries needed
- Architecture: HIGH -- all patterns are extensions of existing MEMORY.md/HEARTBEAT.md conventions
- Pitfalls: HIGH -- identified from direct observation of current checkpoint and X-Dept Counter patterns

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable -- Paperclip primitives don't change)
