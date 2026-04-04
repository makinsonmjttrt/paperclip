# Phase 11: Infrastructure Hardening - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the 10-agent Paperclip company reliable before scaling to 14+ agents in Phase 15. Configure heartbeat staggering, improve stall detection with layered escalation, add session recovery via MEMORY.md checkpoints, and implement chain-of-command validation. All changes are to agent instruction files and Paperclip config -- no new agents, no new skills.

</domain>

<decisions>
## Implementation Decisions

### Heartbeat stagger strategy
- Claude's discretion on stagger algorithm (stream-based groups, round-robin, or hybrid)
- Claude's discretion on whether CEO fires first or is part of rotation
- Constraint: no two agents in the same stream fire simultaneously
- Must work with Paperclip's existing scheduler (instruction-based hints, not system-level cron)

### Stall escalation path
- Layered stall detection: CMO and CTO each monitor their own direct reports
- CEO monitors department heads (CMO, CTO) and cross-stream agents (Product Owner)
- Escalation to department head first, then CEO if head fails to resolve
- Claude's discretion on whether to auto-reassign routine work or flag Martyn
- Design the escalation path to work seamlessly when delegation chains land in Phase 13

### Session recovery
- MEMORY.md checkpoint approach: agents write progress to MEMORY.md at each step
- On resume, agent reads MEMORY.md to find last known state
- Interrupted work picks up from last checkpoint, not from scratch

### Chain-of-command validation
- Claude's discretion on lightweight vs active audit
- Must confirm delegation routes match org chart before routing work
- Should be lightweight enough to run every heartbeat without slowing agents
- Prepare for Phase 13 expansion (when CMO/CTO become real managers)

### Claude's Discretion
- Exact stagger intervals and ordering
- Stall detection timing thresholds
- MEMORY.md checkpoint format and rotation
- Chain-of-command validation frequency (every heartbeat vs periodic)
- Whether stalled routine work auto-reassigns or flags Martyn (optimise for maximum task throughput)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing agent files
- `~/.paperclip/instances/default/companies/FourPointZero/agents/ceo/HEARTBEAT.md` -- Current CEO heartbeat with stall detection section
- `~/.paperclip/instances/default/companies/FourPointZero/agents/ceo/skills/stall-detection.md` -- Existing stall detection skill (nudge after 2 cycles, escalate after failed nudge)
- `~/.paperclip/instances/default/companies/FourPointZero/agents/ceo/AGENTS.md` -- CEO routing instructions
- `~/.paperclip/instances/default/config.json` -- Paperclip system config (no heartbeat scheduling exists here)

### Research
- `.planning/research/STACK.md` -- Paperclip primitive repurposing plan
- `.planning/research/PITFALLS.md` -- 14 pitfalls including heartbeat deadlocks (Issue #2516), context window explosion
- `.planning/research/ARCHITECTURE.md` -- Build order and integration architecture

### Planning
- `.planning/REQUIREMENTS.md` -- INFR-01 through INFR-04 requirements
- `.planning/ROADMAP.md` -- Phase 11 success criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `stall-detection.md` skill: CEO-only, nudge-then-escalate pattern. Can be extended for department heads.
- `HEARTBEAT.md` template: Every agent has one. Adding stagger hints and checkpoint instructions here.
- `MEMORY.md`: Every agent has one (currently used for general memory). Can be extended with checkpoint format.

### Established Patterns
- Skills as markdown files in `$AGENT_HOME/skills/`
- Heartbeat checklists in HEARTBEAT.md with step-by-step instructions
- `Read and follow:` directives in AGENTS.md to reference skills
- Issue-based communication (comments, @-mentions, labels)

### Integration Points
- CEO HEARTBEAT.md: stall detection section needs expansion for layered escalation
- CMO/CTO HEARTBEAT.md: need new stall monitoring sections for their reports
- All agents' HEARTBEAT.md: need stagger hints and checkpoint instructions
- All agents' MEMORY.md: need checkpoint format section

</code_context>

<specifics>
## Specific Ideas

No specific requirements -- open to standard approaches optimised for Paperclip's architecture.

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope.

</deferred>

---

*Phase: 11-infrastructure-hardening*
*Context gathered: 2026-04-04*
