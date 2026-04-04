---
phase: 17-self-healing
plan: 02
subsystem: agent-orchestration
tags: [paperclip, deadlock, stall-detection, auto-recovery, heartbeat]

requires:
  - phase: 16-performance-monitoring
    provides: performance metrics schema and heartbeat counters
provides:
  - CEO deadlock auto-clear protocol (HEAL-02)
  - 2-nudge stall reassignment for CMO/CTO (HEAL-04)
  - New comment convention prefixes (HEAL-DEADLOCK, STALL-NUDGE-1, STALL-NUDGE-2)
affects: [18-workload-consolidation, e2e-testing]

tech-stack:
  added: []
  patterns: [2-nudge-before-reassign, executionRunId-null-clear, fallback-reassignment]

key-files:
  created: []
  modified:
    - agents/ceo/skills/stall-detection.md
    - agents/cmo/HEARTBEAT.md
    - agents/cto/HEARTBEAT.md

key-decisions:
  - "Deadlocks act after 1 idle cycle (not 2) because they never self-resolve"
  - "executionRunId null clear with fallback reassignment bounce if API rejects null"
  - "2-nudge protocol: NUDGE-1 after 2 idle cycles, NUDGE-2 after 1 more, reassign/escalate after 1 more"
  - "Strategic work never auto-reassigned, only escalated to CEO"

patterns-established:
  - "2-nudge protocol: graduated response before auto-reassignment"
  - "HEAL-* comment prefix family for self-healing actions"

requirements-completed: [HEAL-02, HEAL-04]

duration: 4min
completed: 2026-04-04
---

# Phase 17 Plan 02: Organisational Recovery Summary

**CEO deadlock auto-clear via executionRunId nulling with fallback reassignment, plus 2-nudge stall protocol for CMO/CTO before auto-reassigning routine work**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-04T17:51:08Z
- **Completed:** 2026-04-04T17:54:37Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- CEO deadlock detection upgraded from comment-only to active auto-clear: nulls executionRunId, falls back to reassignment bounce, escalates to board on total failure
- CMO and CTO stall detection upgraded from 1-nudge to 2-nudge protocol: STALL-NUDGE-1 after 2 idle cycles, STALL-NUDGE-2 after 1 more, then reassign routine or escalate strategic after 1 more
- Comment convention expanded with HEAL-DEADLOCK, HEAL-RETRY, HEAL-ERROR-LIMIT, STALL-NUDGE-1, STALL-NUDGE-2 prefixes

## Task Commits

Each task was committed atomically:

1. **Task 1: Upgrade CEO deadlock detection to auto-clear protocol** - `2b3eeae` (feat)
2. **Task 2: Update CMO and CTO stall detection to 2-nudge threshold** - `0587670` (feat)

## Files Created/Modified
- `agents/ceo/skills/stall-detection.md` - Deadlock Detection and Auto-Clear (HEAL-02) section with executionRunId null clear, fallback reassignment, board escalation; updated Comment Convention with 6 new prefixes
- `agents/cmo/HEARTBEAT.md` - Section 5.5 rewritten with 3-step nudge protocol (NUDGE-1, NUDGE-2, reassign/escalate) replacing single-nudge pattern
- `agents/cto/HEARTBEAT.md` - Section 5.5 rewritten with 3-step nudge protocol (NUDGE-1, NUDGE-2, reassign/escalate) replacing single-nudge pattern

## Decisions Made
- Deadlocks trigger after 1 idle cycle (not 2) because they never self-resolve
- executionRunId null clear attempted first; if API rejects null, fallback to reassignment bounce (assign to CEO then back to original agent)
- Board escalation only on total failure to clear deadlock
- 2-nudge threshold before auto-reassignment gives agents fair warning
- Candidate agent status must be checked before reassignment (no reassigning to errored/paused agents)
- Strategic work always escalated to CEO, never auto-reassigned

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- HEAL-01 (agent self-retry) and HEAL-03 (health dashboard) from 17-01 provide the other half of self-healing
- Self-healing protocols ready for validation in phase 19 (e2e testing)
- Phase 18 (workload/consolidation) can proceed with monitoring + healing foundations in place

---
*Phase: 17-self-healing*
*Completed: 2026-04-04*

## Self-Check: PASSED
