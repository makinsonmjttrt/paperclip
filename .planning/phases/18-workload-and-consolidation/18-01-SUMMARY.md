---
phase: 18-workload-and-consolidation
plan: 01
subsystem: agent-orchestration
tags: [paperclip, workload-balancing, overload-detection, idle-detection, issue-splitting]

# Dependency graph
requires:
  - phase: 16-performance-monitoring
    provides: "Performance metrics schema with heartbeats_with_work and utilisation_pct"
  - phase: 17-self-healing
    provides: "Stall detection and comment convention infrastructure"
provides:
  - "CEO Workload Balance Check with overload (LOAD-01) and idle (LOAD-02) detection"
  - "Agent Snapshots in CEO MEMORY.md for idle streak tracking across heartbeats"
  - "CMO and CTO Issue Size Check (LOAD-03) for splitting oversized issues before delegation"
  - "LOAD-OVERLOAD, LOAD-IDLE, LOAD-SPLIT comment prefixes in stall-detection.md"
affects: [19-e2e-testing, consolidation-analysis]

# Tech tracking
tech-stack:
  added: []
  patterns: [workload-threshold-monitoring, idle-streak-delta-tracking, pre-delegation-size-check]

key-files:
  created: []
  modified:
    - "~/.paperclip/instances/default/companies/FourPointZero/agents/ceo/HEARTBEAT.md"
    - "~/.paperclip/instances/default/companies/FourPointZero/agents/ceo/MEMORY.md"
    - "~/.paperclip/instances/default/companies/FourPointZero/agents/ceo/skills/stall-detection.md"
    - "~/.paperclip/instances/default/companies/FourPointZero/agents/cmo/HEARTBEAT.md"
    - "~/.paperclip/instances/default/companies/FourPointZero/agents/cto/HEARTBEAT.md"

key-decisions:
  - "Overload threshold set at 3+ active issues per agent; queued-only (all todo, no in_progress) agents excluded"
  - "Idle detection uses heartbeats_with_work delta from snapshots, not API status alone"
  - "Issue Size Check placed before Delegation in both CMO (3.9) and CTO (4.4) to split before routing"

patterns-established:
  - "Snapshot-delta pattern: CEO stores per-agent counters in MEMORY.md, compares each heartbeat to detect trends"
  - "Pre-delegation gate: department heads check issue size before delegating, splitting multi-deliverable issues into sub-issues with parentId"

requirements-completed: [LOAD-01, LOAD-02, LOAD-03]

# Metrics
duration: 2min
completed: 2026-04-04
---

# Phase 18 Plan 01: Workload Balancing Summary

**CEO overload/idle detection with 3-issue threshold and 3-cycle idle streak, plus CMO/CTO pre-delegation issue splitting**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-04T18:17:26Z
- **Completed:** 2026-04-04T18:19:43Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- CEO HEARTBEAT step 9.5 detects overloaded agents (3+ assigned issues) and idle agents (3+ consecutive heartbeat cycles without work)
- CEO MEMORY Agent Snapshots section tracks heartbeats_with_work and idle_streak for all 14 agents
- CMO and CTO gained pre-delegation Issue Size Check that splits multi-deliverable issues into sub-issues before routing
- stall-detection.md Comment Convention extended with LOAD-OVERLOAD, LOAD-IDLE, LOAD-SPLIT prefixes

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Workload Balance Check to CEO and Agent Snapshots to MEMORY.md** - `a8b1d05` (feat)
2. **Task 2: Add Issue Size Check to CMO and CTO HEARTBEAT.md** - `aa0d30e` (feat)

## Files Created/Modified
- `~/.paperclip/.../agents/ceo/HEARTBEAT.md` - Added step 9.5 Workload Balance Check with Overload Detection (LOAD-01) and Idle Detection (LOAD-02) sections
- `~/.paperclip/.../agents/ceo/MEMORY.md` - Added Agent Snapshots section with 14-agent table for idle streak tracking
- `~/.paperclip/.../agents/ceo/skills/stall-detection.md` - Added LOAD-OVERLOAD, LOAD-IDLE, LOAD-SPLIT comment prefixes
- `~/.paperclip/.../agents/cmo/HEARTBEAT.md` - Added section 3.9 Issue Size Check (LOAD-03) before Delegation
- `~/.paperclip/.../agents/cto/HEARTBEAT.md` - Added section 4.4 Issue Size Check (LOAD-03) before Delegation

## Decisions Made
- Overload threshold at 3+ active issues; agents with only `todo` (no `in_progress`) excluded as queued rather than overloaded
- Idle detection compares heartbeats_with_work snapshots across heartbeats, combined with API `idle` status check, to avoid false positives from agents that are working but between checkouts
- Issue Size Check positioned before Delegation so oversized issues never reach individual contributors unsplit

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Workload balancing infrastructure in place; agents will begin detecting overloads and idle streaks on next heartbeat cycle
- Issue splitting will activate on next CMO/CTO delegation pass
- Ready for Phase 19 (e2e testing) to validate these behaviours end-to-end

---
*Phase: 18-workload-and-consolidation*
*Completed: 2026-04-04*
