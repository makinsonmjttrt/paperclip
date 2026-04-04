# Phase 11: Infrastructure Hardening - Research

**Researched:** 2026-04-04
**Domain:** Paperclip multi-agent reliability (heartbeat scheduling, stall detection, session recovery, chain-of-command validation)
**Confidence:** HIGH

## Summary

Phase 11 hardens the existing 10-agent Paperclip company before scaling to 14+ agents in later phases. All four requirements (INFR-01 through INFR-04) are achievable through changes to agent instruction files (HEARTBEAT.md, AGENTS.md, skills/) and MEMORY.md. No new agents, no Paperclip source changes, no new infrastructure.

The existing CEO stall detection skill is the foundation. It currently handles flat, CEO-only monitoring with a nudge-then-escalate pattern. Phase 11 extends this into a layered system where CMO and CTO monitor their own reports, the CEO monitors department heads, and all agents write checkpoint data to MEMORY.md for session recovery.

**Primary recommendation:** Implement in four sequential waves: heartbeat staggering first (prevents resource contention), then layered stall detection (CMO/CTO monitoring), then MEMORY.md checkpoints (session recovery), then chain-of-command validation (routing integrity). Each wave builds on the previous.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Heartbeat stagger: No two agents in the same stream fire simultaneously. Must work with Paperclip's existing scheduler (instruction-based hints, not system-level cron).
- Stall escalation: Layered -- CMO and CTO each monitor their own direct reports. CEO monitors department heads (CMO, CTO) and cross-stream agents (Product Owner). Escalation to department head first, then CEO if head fails to resolve.
- Session recovery: MEMORY.md checkpoint approach -- agents write progress to MEMORY.md at each step. On resume, agent reads MEMORY.md to find last known state.
- Chain-of-command validation: Must confirm delegation routes match org chart before routing work. Should be lightweight enough to run every heartbeat. Prepare for Phase 13 expansion.
- All changes to agent instruction files only, no new agents.

### Claude's Discretion
- Exact stagger intervals and ordering
- Stall detection timing thresholds
- MEMORY.md checkpoint format and rotation
- Chain-of-command validation frequency (every heartbeat vs periodic)
- Whether stalled routine work auto-reassigns or flags Martyn (optimise for maximum task throughput)
- Stagger algorithm (stream-based groups, round-robin, or hybrid)
- Whether CEO fires first or is part of rotation

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFR-01 | Heartbeat stagger configured so no two agents in the same stream fire simultaneously | Stream-based stagger groups with instruction hints in each agent's HEARTBEAT.md. See "Heartbeat Staggering" pattern below. |
| INFR-02 | Stall detection tuned for 12+ agents (timeout thresholds, escalation to CEO) | Layered monitoring: CMO/CTO get stall-detection sections in their HEARTBEATs. CEO's existing stall-detection.md skill updated to monitor heads only. See "Layered Stall Detection" pattern. |
| INFR-03 | Session recovery documented so interrupted heartbeats resume cleanly | MEMORY.md checkpoint format with step tracking. Every agent gets a `## Heartbeat Checkpoint` section. See "Session Recovery via MEMORY.md" pattern. |
| INFR-04 | Chain-of-command validation added (CEO confirms delegation routes match org chart) | Routing table in CEO's HEARTBEAT.md cross-referenced against org chart before delegation. See "Chain-of-Command Validation" pattern. |
</phase_requirements>

## Standard Stack

### Core

This phase uses no libraries or packages. The entire implementation is markdown instruction files within Paperclip's agent file system.

| Component | Location | Purpose | Why Standard |
|-----------|----------|---------|--------------|
| HEARTBEAT.md | `$AGENT_HOME/HEARTBEAT.md` | Agent execution checklist, run every wake | Already proven across 10 agents. The only execution control mechanism. |
| AGENTS.md | `$AGENT_HOME/AGENTS.md` | Agent identity, routing rules, references | Loaded on every wake. Shapes all agent behaviour. |
| Skills (*.md) | `$AGENT_HOME/skills/` | Procedural knowledge bundles | Proven pattern. CEO already has stall-detection.md. |
| MEMORY.md | `$AGENT_HOME/MEMORY.md` | Persistent agent memory across sessions | CEO already has one. Must be created for other agents. |
| Routines (cron) | Paperclip API | Scheduled heartbeat triggers | Three routines already exist (PO grooming, PO auto-assign, CEO stall detection). |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Instruction-based stagger hints | Paperclip cron schedule offsets | Cron schedules exist for 3 routines but not all agents. Most agents wake via issue assignment or @-mention, not cron. Instruction hints cover all wake types. |
| MEMORY.md checkpoints | Daily notes (memory/YYYY-MM-DD.md) | Daily notes are CEO-only and contain timeline entries. Checkpoints need a persistent, per-agent file that survives across days. MEMORY.md is the right primitive. |
| CEO-only stall detection | External monitoring script | Over-engineering. Instruction-based detection is already working. Just extend the pattern to department heads. |

## Architecture Patterns

### Recommended Changes by File

```
agents/
  ceo/
    HEARTBEAT.md          # Update: stagger hint, layered stall detection (heads only), chain-of-command validation
    skills/stall-detection.md  # Update: scope to department heads + PO only, add escalation tiers
    MEMORY.md             # Update: add checkpoint format section
  cmo/
    HEARTBEAT.md          # Update: stagger hint, stall detection for own reports, checkpoint writes
    MEMORY.md             # CREATE: checkpoint + stall tracking
  cto/
    HEARTBEAT.md          # Update: stagger hint, stall detection for own reports, checkpoint writes
    MEMORY.md             # CREATE: checkpoint + stall tracking
  [all other agents]/
    HEARTBEAT.md          # Update: stagger hint, checkpoint writes
    MEMORY.md             # CREATE: checkpoint format
```

### Pattern 1: Heartbeat Staggering (Stream-Based Groups)

**What:** Assign each agent a stagger group (business or tech) and a slot within that group. Add a "Stagger Awareness" section to each agent's HEARTBEAT.md that tells the agent which slot it occupies. For cron-triggered routines, offset the schedule. For event-triggered wakes (@-mention, issue assignment), the stagger hint tells agents to check whether a same-stream peer is currently running before starting work.

**Why stream-based:** The constraint is "no two same-stream agents simultaneously." Cross-stream overlap is acceptable (CMO and CTO can run at the same time). Stream-based groups enforce the constraint with minimal complexity.

**Recommended slot assignment:**

Business stream (5 agents):
| Slot | Agent | Rationale |
|------|-------|-----------|
| B1 | CMO | Department head fires first in stream |
| B2 | Technical Writer | Highest volume producer |
| B3 | LinkedIn Growth Director | Content specialist |
| B4 | Customer Success | Research agent |
| B5 | UX Researcher | Growth/SEO agent |

Tech stream (3 agents):
| Slot | Agent | Rationale |
|------|-------|-----------|
| T1 | CTO | Department head fires first in stream |
| T2 | Software Engineer | Primary implementer |
| T3 | Code Reviewer | Reviews after engineer |

Cross-stream (2 agents):
| Slot | Agent | Rationale |
|------|-------|-----------|
| X1 | CEO | Fires independently, any time |
| X2 | Product Owner | Cross-stream, no stream conflict |

**Instruction-based implementation:** Paperclip does not have a system-level stagger mechanism. The implementation is purely instructional:

```markdown
## Stagger Awareness

You are in stagger group: Business, slot B3.
Before starting work, check if any same-stream agent is currently running:
- `GET /api/companies/{companyId}/agents?status=running`
- If another Business stream agent (CMO, Technical Writer, Customer Success, UX Researcher) is running, wait and re-check after 60 seconds. After 3 retries, proceed anyway (avoid permanent blocking).
- Cross-stream agents (CEO, CTO, Product Owner, Engineer, Code Reviewer) running is fine -- proceed.
```

**For cron-triggered routines:** Offset the existing schedules:
- CEO stall detection: `0 9,14 * * 1-5` (unchanged -- cross-stream, no conflict)
- PO backlog grooming: `0 10 * * 1,3,5` (unchanged -- cross-stream)
- PO auto-assign: `0 9,13 * * 1-5` (unchanged -- cross-stream)

No business-stream or tech-stream agents currently have cron routines. They wake via issue assignment or @-mention. The instruction-based stagger check handles those cases.

### Pattern 2: Layered Stall Detection

**What:** Three tiers of stall monitoring, each responsible for progressively fewer agents.

**Tier 1 -- Department heads monitor their reports:**

CMO monitors: Technical Writer, Customer Success, UX Researcher, LinkedIn Growth Director
CTO monitors: Software Engineer, Code Reviewer

New HEARTBEAT.md section for CMO and CTO:
```markdown
## Stall Detection (Your Reports)

After handling your own assignments, check your reports:
1. Query issues assigned to your reports:
   `GET /api/companies/{companyId}/issues?status=in_progress,in_review`
   Filter to issues assigned to: [list of report agent IDs]
2. For each issue, check latest comment timestamp.
3. If no activity for 2+ heartbeat cycles:
   - Agent is `idle` -> @-mention with nudge: "Issue [ID] has had no activity. Please continue or report blockers."
   - Agent is `running` -> skip (may be mid-work).
   - Agent is `error` or `paused` -> create an escalation comment tagging CEO.
4. If you nudged in a previous heartbeat and still no progress -> escalate to CEO with specifics (issue ID, agent, duration, last activity).
5. Auto-reassign: If the stalled agent is idle and another agent in your stream has the right skills, reassign the issue and comment explaining the reassignment.
```

**Tier 2 -- CEO monitors department heads + cross-stream:**

CEO monitors: CMO, CTO, Product Owner (only 3 agents instead of current 10)

Updated stall-detection.md skill:
```markdown
## Stall Detection (Department Heads)

1. Query issues assigned to CMO, CTO, and Product Owner.
2. Apply the same 2-cycle threshold.
3. For department heads: if stalled, check whether their own reports are also stalled (cascading stall).
4. For Product Owner: nudge directly, escalate to board if unresolved.
5. If a department head is stalled AND their reports are working fine, the head may be blocked on a decision -- comment asking for status.
```

**Tier 3 -- Board escalation:**

Any stall that survives two tiers (report stalled, head notified, head also stalled or failed to resolve) gets escalated to the board (Martyn). This is the existing pattern, just moved from "after 1 failed nudge" to "after layered escalation fails."

**Timing thresholds (recommendation):**
- Tier 1 (head detects report stall): 2 heartbeat cycles with no activity
- Tier 1 (head nudges): immediate on detection
- Tier 1 (head escalates to CEO): 1 additional cycle after nudge with no response
- Tier 2 (CEO detects head stall): 2 heartbeat cycles
- Tier 2 (CEO escalates to board): 1 additional cycle after nudge
- Total worst case before board notification: ~5 heartbeat cycles

**Auto-reassignment recommendation:** Optimise for task throughput. Department heads should auto-reassign routine work (content production, research tasks, code reviews) when a stalled agent is idle and an alternative exists. Flag Martyn only for: strategic decisions, budget-impacting work, or when no alternative agent exists.

### Pattern 3: Session Recovery via MEMORY.md Checkpoints

**What:** Every agent gets a MEMORY.md file (or has their existing one updated) with a standardised `## Heartbeat Checkpoint` section. On each heartbeat step, the agent writes its current step and context to this section. On resume (next wake), the agent reads MEMORY.md first and picks up from the last checkpoint.

**Checkpoint format:**

```markdown
## Heartbeat Checkpoint

**Status:** in_progress | completed | interrupted
**Last step:** [step number and name from HEARTBEAT.md]
**Active issue:** [issue ID or "none"]
**Context:** [1-2 line summary of what was happening]
**Updated:** [ISO timestamp]

### Resume Instructions
If status is `interrupted` or `in_progress`:
1. Read the active issue (if any) via API
2. Check if another agent has checked out the issue (409 on checkout = someone else has it, move on)
3. If still yours, continue from the last step
4. If completed by another agent, clear this checkpoint and start fresh
```

**HEARTBEAT.md addition (all agents):**

```markdown
## Checkpoint Protocol

At the start of each heartbeat:
1. Read `$AGENT_HOME/MEMORY.md` section "## Heartbeat Checkpoint"
2. If status is `in_progress` or `interrupted`, resume from last step
3. If status is `completed` or absent, start from step 1

Before each major step:
- Update MEMORY.md checkpoint with current step name and active issue

At heartbeat exit:
- Set checkpoint status to `completed`
```

**Rotation strategy:** The checkpoint section is overwritten each heartbeat (not appended). Only the current/last checkpoint is stored. Historical checkpoint data is not needed -- the daily notes (CEO) or issue comments provide audit trail. This prevents MEMORY.md from growing unbounded.

**Creating MEMORY.md for non-CEO agents:** Currently only the CEO has MEMORY.md. The other 9 agents need one created. Start with just the checkpoint section. As later phases add department brains and more context, MEMORY.md can grow.

### Pattern 4: Chain-of-Command Validation

**What:** Before the CEO delegates any issue, validate that the target agent matches the org chart routing rules. This is a lookup table check, not a complex algorithm.

**Implementation -- CEO HEARTBEAT.md addition:**

```markdown
## Chain-of-Command Validation

Before assigning any issue, verify the routing matches the org chart:

### Routing Table (v1.0)
| Work Type | Route To | Stream |
|-----------|----------|--------|
| Marketing strategy | CMO | Business |
| Content production | Technical Writer | Business |
| LinkedIn | LinkedIn Growth Director | Business |
| Research/intel | Customer Success | Business |
| Growth/SEO/CRO | UX Researcher | Business |
| Implementation | Software Engineer | Tech |
| Code review | Code Reviewer | Tech |
| Architecture | CTO | Tech |
| Backlog/prioritisation | Product Owner | Cross |

### Validation Check
1. Identify the work type from the issue title, description, and labels
2. Look up the correct agent from the routing table above
3. If the issue is already assigned to the wrong agent, reassign with a comment explaining the correction
4. If the work type is ambiguous, assign to the stream head (CMO or CTO) and let them route

### Phase 13 Preparation
When delegation chains arrive, this table will change:
- CEO routes to department heads only (CMO, CTO)
- Department heads route to their reports
- This section will be updated to reflect the new routing
```

**Frequency recommendation:** Run every heartbeat. The check is a simple table lookup (10 rows). It adds negligible context overhead. Running it every heartbeat catches misrouted work immediately rather than letting it accumulate.

**Where it runs:** CEO only in Phase 11. When Phase 13 adds delegation chains, CMO and CTO will get their own validation tables for their reports.

### Anti-Patterns to Avoid

- **Over-engineering the stagger:** Do not build a "scheduler" or "coordinator agent." Instruction hints plus a simple API status check is sufficient. The goal is "avoid simultaneous same-stream execution," not "guarantee perfect serialisation."
- **Checkpoint bloat:** Do not log every micro-step. Checkpoint at HEARTBEAT.md section boundaries (step 1, step 2, etc.), not at individual API calls within a step.
- **Stall detection on running agents:** The existing rule ("skip running agents") must be preserved. A running agent may legitimately take 10+ minutes on complex work. Only flag `idle` agents with stale issues.
- **Board escalation for routine stalls:** Department heads should handle routine stalls (reassign, nudge) without involving CEO or board. Only escalate persistent or system-level issues.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Heartbeat scheduling | Custom scheduler agent or external cron manager | Instruction-based stagger hints in HEARTBEAT.md | Paperclip's scheduler is instruction-based. Adding external scheduling creates a second coordination system that can conflict. |
| Agent monitoring dashboard | Custom monitoring script or web UI | CEO + department head stall detection in HEARTBEAT.md | The agents themselves ARE the monitoring system. Adding external monitoring creates maintenance burden with no Paperclip integration. |
| Session state persistence | Database-backed state store or session files | MEMORY.md checkpoint section | MEMORY.md is the existing persistence layer for agents. It survives across heartbeats and is readable by any agent. |
| Org chart validation | Graph database or relationship tracker | Static routing table in CEO HEARTBEAT.md | 10 agents with fixed roles. A lookup table is faster, simpler, and more maintainable than any dynamic system. |

## Common Pitfalls

### Pitfall 1: Stagger Check Creates Permanent Blocking
**What goes wrong:** An agent checks if a same-stream peer is running, finds one running, waits 60 seconds, checks again, finds the same peer still running (long task), waits again, and loops indefinitely. The agent never starts its own work.
**Why it happens:** Long-running heartbeats (10+ minutes for complex tasks) exceed the stagger wait window.
**How to avoid:** Cap retries at 3 (3 minutes total wait). After 3 retries, proceed anyway. The constraint is "avoid simultaneous execution," not "guarantee it." Occasional overlap is better than permanent blocking.
**Warning signs:** Agent logs show repeated "waiting for same-stream agent" messages. Agent heartbeats take 4+ minutes longer than usual.

### Pitfall 2: Layered Escalation Creates Notification Spam
**What goes wrong:** A single stalled issue generates: one nudge from the department head, one escalation comment to CEO, one CEO nudge to the head, one CEO escalation to board. Four notifications for one stall.
**Why it happens:** Each tier runs independently. Without deduplication, the same stall triggers at every tier.
**How to avoid:** Require each tier to check whether a higher tier has already commented on the issue. If the CEO has already commented about a stall, the department head should not also comment. Use a comment convention: stall comments start with `[STALL]` prefix for easy detection.
**Warning signs:** Issues have 3+ stall-related comments from different agents.

### Pitfall 3: MEMORY.md Checkpoint Stale on Resume
**What goes wrong:** Agent writes checkpoint "working on FOU-150, step 3." Agent is interrupted. On next wake, agent reads checkpoint, tries to resume FOU-150, but the issue was completed by another agent (CEO reassigned it during stall detection). Agent wastes its heartbeat on a completed issue.
**Why it happens:** Checkpoint is written locally but the issue state changes externally.
**How to avoid:** The resume protocol must always re-check the issue via API before resuming. If the issue status is `done`, `cancelled`, or assigned to someone else, clear the checkpoint and start fresh. Never trust the checkpoint blindly.
**Warning signs:** Agent comments on completed issues saying "resuming work."

### Pitfall 4: Chain-of-Command Validation Blocks Legitimate Overrides
**What goes wrong:** CEO needs to assign an urgent task directly to the Software Engineer (bypassing CTO). The validation check flags this as a routing violation.
**Why it happens:** The routing table is rigid. Real work sometimes needs to bypass the hierarchy.
**How to avoid:** Include explicit override rules: "If priority is `urgent` or issue has `override` label, bypass routing validation and assign directly. Comment on the issue noting the override and why."
**Warning signs:** CEO creates override issues frequently (signals the routing table needs updating, not that overrides are working correctly).

### Pitfall 5: Heartbeat Deadlock from Queued Runs (Pitfall 2 from PITFALLS.md)
**What goes wrong:** Paperclip Issue #2516 -- queued runs acquire `executionRunId` at creation time, locking the issue before the agent starts work. With staggered heartbeats creating cascading task assignments, deadlock probability increases.
**How to avoid:** Part of the stall detection upgrade. Any issue with `executionRunId` set but agent status `idle` for 2+ cycles is likely deadlocked. Department heads and CEO should flag these specifically and, if possible, clear the lock via API reassignment.
**Warning signs:** Issues stuck in `in_progress` with no comments. Agent shows `idle` but issue has `executionRunId`.

## Code Examples

### HEARTBEAT.md Stagger Section (Business Stream Agent)

```markdown
## Stagger Awareness

You are in stagger group: **Business**, slot **B3**.

Before starting work on any issue:
1. Check running agents: `GET /api/companies/{companyId}/agents?status=running`
2. If any of these agents are running, wait 60 seconds and re-check (max 3 retries):
   - CMO (293ac1cb)
   - Technical Writer (3ff49ad0)
   - Customer Success (6003d629)
   - UX Researcher (c25043f9)
3. After 3 retries with a same-stream agent still running, proceed anyway.
4. Cross-stream agents (CEO, CTO, Product Owner, Engineer, Code Reviewer) running is fine.
```

### CMO Stall Detection Section

```markdown
## Stall Detection (Your Reports)

After handling your own assignments, check your direct reports:

**Your reports:** Technical Writer (3ff49ad0), Customer Success (6003d629), UX Researcher (c25043f9), LinkedIn Growth Director (df0e4280)

1. Query in-progress issues for your reports:
   `GET /api/companies/{companyId}/issues?status=in_progress,in_review`
   Filter to assigneeAgentId in [3ff49ad0, 6003d629, c25043f9, df0e4280]

2. For each issue, check the latest comment timestamp.

3. If no activity for 2+ heartbeat cycles:
   - Check agent status: `GET /api/agents/{agentId}`
   - If `idle`: @-mention with `[STALL] Issue {ID} has had no activity for 2+ cycles. Please continue or report blockers.`
   - If `running`: skip.
   - If `error` or `paused`: escalate to CEO with `[STALL-ESCALATE] {agent} is in {status} state. Issue {ID} needs reassignment.`

4. If you nudged in your previous heartbeat and still no progress:
   - For routine work (content, research, reviews): reassign to another available report with the right skills.
   - For strategic or irreplaceable work: escalate to CEO.

5. Record stall findings in MEMORY.md checkpoint.
```

### MEMORY.md Checkpoint Section (Template for All Agents)

```markdown
## Heartbeat Checkpoint

**Status:** completed
**Last step:** exit
**Active issue:** none
**Context:** No assignments this heartbeat. Clean exit.
**Updated:** 2026-04-04T10:00:00Z

### Resume Instructions
If status is `in_progress` or `interrupted`:
1. Read active issue via `GET /api/issues/{id}`
2. If issue status is `done` or `cancelled`, or assigned to another agent: clear checkpoint, start fresh
3. Attempt checkout: `POST /api/issues/{id}/checkout`
4. If 409 (checked out by another agent): clear checkpoint, start fresh
5. If checkout succeeds: continue from last step
```

### CEO Chain-of-Command Validation

```markdown
## Chain-of-Command Validation

Before delegating any issue, validate the routing:

### Org Chart Routing Table
| Work Type | Keywords | Route To | Agent ID |
|-----------|----------|----------|----------|
| Marketing strategy | positioning, pricing, launch, campaign | CMO | 293ac1cb |
| Content production | blog, newsletter, social, email, ads, copy | Technical Writer | 3ff49ad0 |
| LinkedIn | linkedin, profile, outreach, connection | LinkedIn Growth Director | df0e4280 |
| Research/intelligence | competitor, research, customer, case study | Customer Success | 6003d629 |
| Growth/SEO/CRO | seo, cro, growth, paid, lead magnet, a/b test | UX Researcher | c25043f9 |
| Implementation | code, build, infrastructure, deploy, pdf, docx | Software Engineer | 97307b6f |
| Code review | PR, review, code quality | Code Reviewer | 8df70cb1 |
| Architecture | architecture, standards, tech debt | CTO | 9f63e8ed |
| Backlog/prioritisation | backlog, sprint, prioritise, roadmap | Product Owner | f74c5796 |

### Validation Steps
1. Read issue title, description, and labels
2. Match keywords to work type in the table above
3. If the issue is already assigned to the correct agent: proceed
4. If assigned to the wrong agent: reassign and comment `[ROUTING] Reassigned from {old} to {new} per org chart. Work type: {type}.`
5. If work type is ambiguous: assign to stream head (CMO for business, CTO for tech)

### Override Rules
- Priority `urgent` or label `override`: bypass validation, assign directly, comment noting override
- Board-requested assignment: always honour, skip validation
- Cross-stream issues: split into sub-issues per existing FPZ Delegation Logic
```

## State of the Art

| Current Approach | Phase 11 Approach | What Changes |
|------------------|-------------------|--------------|
| All 10 agents can fire simultaneously | Stream-based stagger groups prevent same-stream overlap | HEARTBEAT.md updated for all 10 agents |
| CEO monitors all 10 agents for stalls | CMO monitors 4, CTO monitors 2, CEO monitors 3 | CMO/CTO get stall detection sections; CEO skill scoped down |
| No session recovery | MEMORY.md checkpoint at each heartbeat step | MEMORY.md created for 9 agents, updated for CEO |
| CEO routing based on FPZ Delegation Logic (implicit) | Explicit routing table with validation check | CEO HEARTBEAT.md gets validation section |
| Stall detection: CEO nudges, then escalates to board | Three-tier: head nudges, head escalates to CEO, CEO escalates to board | New escalation path reduces CEO monitoring load |

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual validation via Paperclip heartbeat runs |
| Config file | None (instruction-based system, no code tests) |
| Quick run command | Trigger single agent heartbeat via Paperclip UI or API |
| Full suite command | Run all 10 agent heartbeats sequentially and inspect MEMORY.md + issue comments |

### Phase Requirements to Test Map

| Req ID | Behaviour | Test Type | Validation Method | Exists? |
|--------|----------|-----------|-------------------|---------|
| INFR-01 | No two same-stream agents fire simultaneously | manual-only | Trigger 2 business-stream agents at same time, verify one waits via MEMORY.md checkpoint timestamps | No -- Wave 0 |
| INFR-02 | Stall detection works across 3 tiers | manual-only | Create a stalled issue (assign to idle agent, wait 2 cycles), verify CMO/CTO detects and nudges, then verify CEO catches head-level stalls | No -- Wave 0 |
| INFR-03 | Interrupted heartbeat resumes cleanly | manual-only | Kill an agent mid-heartbeat (process kill), trigger next heartbeat, verify agent reads checkpoint and resumes from last step | No -- Wave 0 |
| INFR-04 | Chain-of-command validation catches misrouted work | manual-only | Assign a content issue to the Software Engineer, trigger CEO heartbeat, verify CEO reassigns to Technical Writer with routing comment | No -- Wave 0 |

**Justification for manual-only:** This system is entirely instruction-based markdown. There is no code to unit test. Validation requires running actual Paperclip heartbeats and inspecting agent behaviour (issue comments, MEMORY.md state, agent status). Automated testing would require a Paperclip test harness that does not exist.

### Sampling Rate
- **Per task commit:** Manually trigger one heartbeat for the modified agent and inspect output
- **Per wave merge:** Run 2-3 agent heartbeats covering the changed agents and verify cross-agent interactions
- **Phase gate:** Full 10-agent heartbeat cycle with planted test cases (stalled issue, misrouted issue, interrupted heartbeat)

### Wave 0 Gaps
- [ ] Create MEMORY.md for 9 non-CEO agents (CMO, CTO, Engineer, Technical Writer, Customer Success, UX Researcher, LinkedIn Growth Director, Product Owner, Code Reviewer) with checkpoint template
- [ ] Document validation test cases as issues in Paperclip for structured tracking

## Open Questions

1. **Paperclip agent status API granularity**
   - What we know: `GET /api/companies/{companyId}/agents?status=running` exists and returns running agents
   - What is unclear: Whether the API returns the agent's current `executionRunId` and for how long after a heartbeat completes the agent shows as `running` vs `idle`
   - Recommendation: Test the API response during Phase 11 implementation. If the running/idle transition is not immediate, add a buffer (e.g., treat agents that went `idle` within the last 30 seconds as potentially still running)

2. **Heartbeat cycle duration**
   - What we know: CEO heartbeat runs at 9:00 and 14:00 (5-hour gap). PO runs at 10:00, 13:00, and on MWF at 10:00
   - What is unclear: How long a typical heartbeat takes (minutes? seconds?). This affects the "2 heartbeat cycles" stall threshold
   - Recommendation: The "2 cycles" threshold means "2 scheduled wakes with no activity," not "2 hours." For agents without cron schedules, define the cycle as "since last @-mention or issue assignment wake"

3. **MEMORY.md write conflicts**
   - What we know: Only one agent writes to its own MEMORY.md (no cross-agent writes)
   - What is unclear: Whether Paperclip's `executionRunId` lock prevents concurrent writes to the same file if two heartbeats for the same agent overlap
   - Recommendation: The `maxConcurrentRuns=1` default should prevent this. Verify during implementation.

## Sources

### Primary (HIGH confidence)
- CEO HEARTBEAT.md -- direct file inspection (heartbeat checklist, stall detection, delegation logic)
- CEO stall-detection.md skill -- direct file inspection (nudge-then-escalate pattern)
- CEO AGENTS.md -- direct file inspection (org chart, routing table, agent IDs)
- CEO MEMORY.md -- direct file inspection (existing tacit knowledge format, agent roster with IDs)
- CMO HEARTBEAT.md -- direct file inspection (current heartbeat structure, no stall detection)
- CTO HEARTBEAT.md -- direct file inspection (current heartbeat structure, no stall detection)
- BOOTSTRAP.md -- direct file inspection (cron schedules for 3 routines, agent hiring pattern)
- config.json -- direct file inspection (confirms local deployment, single machine)
- .planning/research/PITFALLS.md -- Pitfall 2 (heartbeat deadlocks #2516), Pitfall 8 (session corruption #2358), Pitfall 11 (schedule collision)
- .planning/research/ARCHITECTURE.md -- v1.0 baseline architecture, org chart, data flow
- .planning/research/STACK.md -- Paperclip primitives inventory, repurpose patterns

### Secondary (MEDIUM confidence)
- Paperclip GitHub Issues #2516 (heartbeat deadlock), #2358 (corrupted sessions), #332 (concurrent agent limit) -- referenced in PITFALLS.md research, not directly verified this session

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all primitives directly inspected, patterns proven in v1.0
- Architecture: HIGH -- patterns extend existing proven patterns (stall detection, HEARTBEAT.md sections, MEMORY.md)
- Pitfalls: HIGH -- drawn from direct PITFALLS.md research plus observed patterns in agent files

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable domain, instruction files only, no dependency on external libraries)
