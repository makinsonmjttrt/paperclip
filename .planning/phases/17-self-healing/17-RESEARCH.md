# Phase 17: Self-Healing - Research

**Researched:** 2026-04-04
**Domain:** Agent failure recovery, deadlock clearing, checkpoint resumption, work reassignment
**Confidence:** HIGH

## Summary

Phase 17 builds self-healing behaviours into the existing 14-agent Paperclip company. The good news: roughly 60-70% of the required infrastructure already exists from Phase 11 (checkpoint protocol, stall detection) and Phase 16 (error counters, health summary). What's missing is the *automatic action* layer -- agents currently detect problems and comment about them, but stop short of fixing them without human intervention.

The four requirements break down into two categories: (1) agent-level self-recovery (HEAL-01 auto-retry, HEAL-03 checkpoint resume) and (2) organisational-level recovery (HEAL-02 CEO deadlock clearing, HEAL-04 stall reassignment). Category 1 requires changes to every agent's HEARTBEAT.md. Category 2 requires changes only to the CEO's stall-detection skill and the CMO/CTO stall detection sections.

**Primary recommendation:** This is an instruction-file-only phase. No new tools, skills, or agents. Every change is adding conditional logic to existing HEARTBEAT.md steps and the CEO's stall-detection.md skill. Estimate 2 plans: Plan 01 for agent-level self-recovery (HEAL-01, HEAL-03), Plan 02 for organisational-level recovery (HEAL-02, HEAL-04).

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HEAL-01 | Agents in "error" status auto-retry on next heartbeat cycle | Checkpoint Protocol already reads status on wake. Needs: add error-status check before step 1, with retry logic and max-retry counter |
| HEAL-02 | Deadlocked agents (executionRunId set but idle) auto-cleared by CEO | CEO stall-detection.md already detects deadlocks and comments. Needs: upgrade from comment-only to auto-clear action (PUT issue to clear executionRunId, reassign) |
| HEAL-03 | Interrupted heartbeats resume from MEMORY.md checkpoint without data loss | Checkpoint Protocol and Resume Instructions already exist in all 14 agents. Needs: add data preservation step (write partial work to daily notes before resuming) |
| HEAL-04 | Stalled work auto-reassigned after 2 failed nudges (routine work only) | CMO/CTO already auto-reassign after 1 failed nudge for routine work. Needs: align to "2 failed nudges" threshold and add nudge counter tracking |
</phase_requirements>

## Gap Analysis: What Exists vs What's Needed

### HEAL-01: Error Auto-Retry

**What exists:**
- All 14 agents have Checkpoint Protocol that reads MEMORY.md status on wake
- Performance Metrics track `period_errors` count
- CMO/CTO stall detection flags agents in `error` status with `[STALL-ESCALATE]`

**What's missing:**
- No agent checks its OWN status for `error` on wake
- No retry logic (read last checkpoint, attempt to re-execute from that step)
- No max-retry limit to prevent infinite error loops
- No error context capture (what went wrong, for diagnostic value)

**What to build:**
- Add error-status self-check to Checkpoint Protocol in all 14 HEARTBEAT.md files
- Logic: if agent status is `error`, read MEMORY.md checkpoint, increment `retry_count`, if retry_count < 3 then resume from last step, else set status to `paused` and escalate
- Track `retry_count` in MEMORY.md Heartbeat Checkpoint section

### HEAL-02: Deadlock Auto-Clear

**What exists:**
- CEO stall-detection.md has Deadlock Detection section
- It detects `executionRunId` set but agent status `idle` for 2+ cycles
- It comments `[STALL-DEADLOCK]` on the issue
- It attempts reassignment via `PUT /api/issues/{id}` with new assigneeAgentId

**What's actually already done:**
- Reading the CEO stall-detection.md more carefully: it already says "Attempt reassignment to clear the lock: `PUT /api/issues/{id}` with new assigneeAgentId." This IS an auto-clear action, not just a comment.

**What's missing:**
- The stall-detection.md says "attempt reassignment" but doesn't specify: (a) clearing the executionRunId itself, (b) who to reassign to, (c) what happens if the PUT fails
- Real-world evidence: CMO's MEMORY.md shows FOU-241 stuck with "stale execution lock (run 7e53c796)" and the CMO had to manually ask CEO to clear it -- proving the current deadlock detection didn't catch it or didn't act
- No explicit `executionRunId` clearing step (the Paperclip API may need a specific endpoint or field update)

**What to build:**
- Upgrade Deadlock Detection to a proper auto-clear protocol:
  1. Detect: executionRunId set + agent idle for 1+ cycle (reduce from 2 to 1 -- deadlocks don't self-resolve)
  2. Clear: `PUT /api/issues/{id}` with `executionRunId: null` (or whatever the Paperclip API requires)
  3. Reassign: back to the same agent (it was interrupted, not incompetent) OR to the department head for re-routing
  4. Comment: `[HEAL-DEADLOCK] Auto-cleared stale execution lock. Run {runId} was locked since {timestamp}. Issue reassigned to {agent}.`
  5. Log: increment the cleared agent's `period_errors` count

### HEAL-03: Checkpoint Resume Without Data Loss

**What exists:**
- All 14 agents have Resume Instructions in MEMORY.md
- Resume flow: read active issue, check if still valid, attempt checkout, continue from last step
- Checkpoint records: status, last step, active issue, context, timestamp

**What's missing:**
- No explicit data preservation before resuming (partial work could be lost if the agent starts fresh)
- "Context" field is free-text -- no structured capture of partial outputs
- No mechanism to detect that work was partially completed and merge rather than restart

**What to build:**
- Add a "Partial Work Preservation" step to the Resume Instructions:
  1. Before resuming, check if any partial output was written to daily notes or issue comments
  2. If partial output exists: note it in the checkpoint context so the resumed step can build on it
  3. If no partial output: start the step fresh (no data to lose)
- Add structured context field to checkpoint: `partial_output: {file path or comment ID}`
- This is lightweight -- the checkpoint already captures "Context" as free text. Formalising it slightly prevents agents from overwriting partial work on resume.

### HEAL-04: Stall Auto-Reassignment After 2 Failed Nudges

**What exists:**
- CMO stall detection: nudge after 2 cycles idle, then after 1 more cycle: auto-reassign routine work OR escalate strategic work to CEO
- CTO stall detection: same pattern
- LGD stall detection: nudge after 2 cycles, escalate to CMO if still stalled (no auto-reassign)
- TW stall detection: nudge after 2 cycles, escalate to CMO (with QR fallback)
- Comment convention: [STALL], [STALL-REASSIGN], [STALL-ESCALATE]

**Current behaviour vs requirement:**
- CMO/CTO currently auto-reassign after 1 failed nudge (2 cycles idle + 1 nudge + 1 more cycle = reassign)
- HEAL-04 specifies "after 2 failed nudges" -- so the threshold needs to increase by 1 nudge cycle
- LGD/TW currently escalate to CMO rather than auto-reassign -- this should stay (they're team leads, not department heads)

**What to build:**
- Update CMO/CTO stall detection: change from "1 failed nudge then reassign" to "2 failed nudges then reassign"
- Add nudge tracking: after first nudge, record `[STALL-NUDGE-1]` on the issue. After second nudge (still no response), record `[STALL-NUDGE-2]` then auto-reassign
- Keep LGD/TW pattern as-is (escalate to CMO/CTO, who then handle reassignment)
- Ensure the comment prefix convention supports deduplication (check for existing nudge comments before re-nudging)

## Architecture Patterns

### Pattern 1: Error Self-Check (HEAL-01)

Add to Checkpoint Protocol, between "read MEMORY.md" and "start from step 1":

```markdown
## Checkpoint Protocol (updated for HEAL-01)

At the start of each heartbeat:
1. Read `$AGENT_HOME/MEMORY.md` section "## Heartbeat Checkpoint"
2. If status is `in_progress` or `interrupted`, resume from last step
3. **NEW: If own agent status is `error` (check via `GET /api/agents/me`):**
   a. Read checkpoint for last known good state
   b. Increment `retry_count` in checkpoint (default 0)
   c. If retry_count >= 3: comment `[HEAL-ERROR-LIMIT] {agent name} hit 3 retries. Pausing for human review.` and exit
   d. If retry_count < 3: comment `[HEAL-RETRY] Auto-retrying from checkpoint. Attempt {retry_count}/3.` and resume from last step
4. If status is `completed` or absent, reset retry_count to 0, start from step 1
```

### Pattern 2: Deadlock Auto-Clear (HEAL-02)

Upgrade CEO stall-detection.md Deadlock Detection section:

```markdown
## Deadlock Detection and Auto-Clear

Check for issues with `executionRunId` set but agent status `idle`:

1. Query all in_progress issues for CMO, CTO, Product Owner
2. For each issue with `executionRunId` set:
   a. Check assigned agent status via `GET /api/agents/{agentId}`
   b. If agent is `idle` (not `running`):
      - Comment: `[HEAL-DEADLOCK] Auto-clearing stale execution lock {runId}. Agent {name} was idle.`
      - Clear lock: `PUT /api/issues/{id}` with `{ "executionRunId": null }`
      - Reassign to same agent: `PUT /api/issues/{id}` with `{ "assigneeAgentId": "{original}" }`
      - If PUT fails: escalate to board with `[STALL-BOARD] Cannot clear deadlock on {id}. Manual intervention needed.`
3. Log auto-clears to daily notes
```

### Pattern 3: Nudge Counter (HEAL-04)

```markdown
## Stall Detection (updated for HEAL-04)

5. If no activity for 2+ heartbeat cycles and no existing `[STALL]` comment:
   - First nudge: comment `[STALL-NUDGE-1] Issue {ID} inactive for 2+ cycles. Please continue or report blockers.`

6. If `[STALL-NUDGE-1]` exists and still no activity after 1 additional cycle:
   - Second nudge: comment `[STALL-NUDGE-2] Second nudge. Issue {ID} still inactive. Will auto-reassign if no response.`

7. If `[STALL-NUDGE-2]` exists and still no activity after 1 additional cycle:
   - For routine work: reassign with `[STALL-REASSIGN] Auto-reassigned from {old} to {new} after 2 failed nudges.`
   - For strategic work: escalate with `[STALL-ESCALATE] Persistent stall after 2 nudges. Escalating.`
```

### Anti-Patterns to Avoid

- **Infinite retry loops:** HEAL-01 MUST have a max retry count. Without it, a broken agent will retry forever and waste resources.
- **Reassigning strategic work:** HEAL-04 must distinguish routine vs strategic. Auto-reassigning architectural decisions or positioning work to a different agent will produce inconsistent output.
- **Silent recovery:** Every auto-recovery action MUST leave a comment trail. Without it, debugging becomes impossible and Martyn has no visibility into what happened.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Error detection | Custom error-checking logic | `GET /api/agents/me` status field | Paperclip already tracks agent status |
| Deadlock detection | Polling agents manually | `executionRunId` field on issues | Paperclip already exposes this state |
| Nudge tracking | In-memory nudge counters | Comment prefix convention ([STALL-NUDGE-1], [STALL-NUDGE-2]) | Agents are stateless between heartbeats; comments persist |
| Partial work storage | New checkpoint file format | Existing daily notes + MEMORY.md context field | Infrastructure already exists |

## Common Pitfalls

### Pitfall 1: Paperclip API for executionRunId clearing
**What goes wrong:** The API may not accept `executionRunId: null` as a valid update. Paperclip may require a specific endpoint to release execution locks.
**Why it happens:** Deadlock clearing is a platform operation, not a standard issue update.
**How to avoid:** Test the exact API call needed during Plan 02 implementation. If `PUT /api/issues/{id}` doesn't support clearing executionRunId, try: (a) reassigning the issue to a different agent and back, (b) changing issue status to `todo` then back to `in_progress`, (c) using a different API endpoint if available.
**Warning signs:** Real-world evidence: CMO's FOU-241 is currently stuck with a stale execution lock and the existing deadlock detection hasn't cleared it.

### Pitfall 2: Retry count persistence
**What goes wrong:** retry_count stored in MEMORY.md gets lost if the agent's MEMORY.md is corrupted or the checkpoint is reset between error cycles.
**Why it happens:** MEMORY.md is the only persistence mechanism. If an error corrupts the file, the retry count is gone.
**How to avoid:** Also comment the retry count on the issue itself (`[HEAL-RETRY] Attempt 2/3`). The issue comments are the backup persistence layer.

### Pitfall 3: Nudge deduplication
**What goes wrong:** Agent sends duplicate nudge comments because it doesn't properly check for existing ones.
**Why it happens:** The existing `[STALL]` prefix convention works for single-nudge. With two nudge tiers, the check needs to look for both `[STALL-NUDGE-1]` and `[STALL-NUDGE-2]`.
**How to avoid:** Before nudging, query issue comments and check for any existing `[STALL-NUDGE-*]` prefix. Only escalate to the next tier if the current tier's prefix exists.

### Pitfall 4: Auto-reassignment routing
**What goes wrong:** Department head reassigns to an agent that's also stalled or in error status.
**Why it happens:** The reassignment logic picks "another available report" without checking that report's status.
**How to avoid:** Before reassigning, check candidate agent's status via `GET /api/agents/{agentId}`. Only reassign to agents with status `idle` (not `error`, `paused`, or already `running`).

## Scope Containment

This phase modifies ONLY:
- All 14 agents' HEARTBEAT.md (Checkpoint Protocol update for HEAL-01, HEAL-03)
- All 14 agents' MEMORY.md (retry_count field in checkpoint for HEAL-01, partial_output field for HEAL-03)
- CEO's stall-detection.md skill (Deadlock auto-clear for HEAL-02)
- CMO's HEARTBEAT.md stall detection section (2-nudge threshold for HEAL-04)
- CTO's HEARTBEAT.md stall detection section (2-nudge threshold for HEAL-04)

No new files. No new skills. No new agents. No API changes.

## Suggested Plan Split

### Plan 01: Agent-Level Self-Recovery (HEAL-01 + HEAL-03)
- Add error auto-retry to Checkpoint Protocol in all 14 HEARTBEAT.md
- Add retry_count to all 14 MEMORY.md checkpoint sections
- Add partial_output field to all 14 MEMORY.md checkpoint sections
- Add data preservation step to Resume Instructions in all 14 MEMORY.md
- Estimated scope: 28 files modified (14 HEARTBEAT.md + 14 MEMORY.md)

### Plan 02: Organisational-Level Recovery (HEAL-02 + HEAL-04)
- Upgrade CEO stall-detection.md deadlock detection to auto-clear
- Update CMO stall detection to 2-nudge threshold
- Update CTO stall detection to 2-nudge threshold
- Add [HEAL-DEADLOCK], [STALL-NUDGE-1], [STALL-NUDGE-2] to comment convention
- Estimated scope: 3 files modified (1 CEO skill + 2 department head HEARTBEAT.md)

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual validation (agent instruction files, not code) |
| Config file | None -- instruction files validated by reading and checking content |
| Quick run command | `grep -c "HEAL-RETRY\|retry_count\|HEAL-DEADLOCK\|STALL-NUDGE" ~/.paperclip/.../agents/*/HEARTBEAT.md` |
| Full suite command | Read all 14 HEARTBEAT.md + 14 MEMORY.md + CEO stall-detection.md and verify sections present |

### Phase Requirements -> Test Map
| Req ID | Behaviour | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HEAL-01 | Error agents auto-retry from checkpoint | manual + grep | `grep "HEAL-RETRY\|retry_count" ~/.paperclip/.../agents/*/HEARTBEAT.md` | Wave 0 |
| HEAL-02 | CEO auto-clears deadlocked agents | manual + grep | `grep "HEAL-DEADLOCK\|executionRunId.*null" ~/.paperclip/.../agents/ceo/skills/stall-detection.md` | Wave 0 |
| HEAL-03 | Interrupted heartbeats resume without data loss | manual + grep | `grep "partial_output\|Partial Work" ~/.paperclip/.../agents/*/MEMORY.md` | Wave 0 |
| HEAL-04 | Stalled work auto-reassigned after 2 nudges | manual + grep | `grep "STALL-NUDGE-2\|2 failed nudges" ~/.paperclip/.../agents/{cmo,cto}/HEARTBEAT.md` | Wave 0 |

### Sampling Rate
- **Per task commit:** grep check for required patterns in modified files
- **Per wave merge:** full read of all modified files, verify section structure
- **Phase gate:** all 4 HEAL requirements verified present in correct files

### Wave 0 Gaps
None -- this phase modifies existing files only. No framework or infrastructure setup needed.

## Sources

### Primary (HIGH confidence)
- All agent files in `~/.paperclip/instances/default/companies/FourPointZero/agents/` -- direct read of current state
- Phase 11 summaries (11-01-SUMMARY.md, 11-02-SUMMARY.md) -- checkpoint and stall detection history
- Phase 16 summaries (16-01-SUMMARY.md, 16-02-SUMMARY.md) -- performance metrics and health reporting
- CEO stall-detection.md skill -- current deadlock detection logic
- CMO/CTO HEARTBEAT.md stall detection sections -- current reassignment logic

### Secondary (MEDIUM confidence)
- CMO MEMORY.md checkpoint context showing real FOU-241 deadlock -- confirms the problem exists in production

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new tools, modifying existing instruction files only
- Architecture: HIGH -- patterns directly extend existing Checkpoint Protocol and Stall Detection
- Pitfalls: MEDIUM -- Paperclip API behaviour for executionRunId clearing is unverified (real-world testing needed)

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable -- agent instruction file format doesn't change)
