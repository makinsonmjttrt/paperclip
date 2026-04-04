---
phase: 12-department-brains-and-data-gating
plan: 01
subsystem: infra
tags: [paperclip, agents, department-brains, shared-context, heartbeat]

# Dependency graph
requires:
  - phase: 11-infrastructure-hardening
    provides: git tracking, stagger awareness, checkpoint protocol for agent files
provides:
  - Business stream brain (BRAIN.md) with shared marketing context
  - Tech stream brain (BRAIN.md) with shared engineering context
  - Read directives wiring all 10 agents to their stream brain
  - Brain update heartbeat steps for CMO and CTO
  - Archive directories for brain pruning
affects: [12-02-data-gating, 13-delegation-chains, 14-event-bus, 15-sub-agent-teams]

# Tech tracking
tech-stack:
  added: []
  patterns: [write-one-read-many brain files, just-in-time pointer loading, department brain directories]

key-files:
  created:
    - "agents/_departments/business/BRAIN.md"
    - "agents/_departments/tech/BRAIN.md"
  modified:
    - "agents/ceo/AGENTS.md"
    - "agents/cmo/AGENTS.md"
    - "agents/cto/AGENTS.md"
    - "agents/technical-writer/AGENTS.md"
    - "agents/customer-success/AGENTS.md"
    - "agents/ux-researcher/AGENTS.md"
    - "agents/linkedin-growth-director/AGENTS.md"
    - "agents/engineer/AGENTS.md"
    - "agents/code-reviewer/AGENTS.md"
    - "agents/product-owner/AGENTS.md"
    - "agents/cmo/HEARTBEAT.md"
    - "agents/cto/HEARTBEAT.md"

key-decisions:
  - "Brain files seeded with current-state context only, historical decisions deferred to dept heads"
  - "200-line cap with archive rotation strategy documented in heartbeat steps"
  - "Write-one-read-many enforced via HEARTBEAT.md instructions (CMO writes business, CTO writes tech)"

patterns-established:
  - "Write-one-read-many: only department heads write to brain files, all stream agents read"
  - "Just-in-time pointer loading: brain files contain summaries with pointers to detail docs"
  - "Department Brain section placed between References and Skills in AGENTS.md"

requirements-completed: [BRAIN-01, BRAIN-02, BRAIN-03, BRAIN-04, BRAIN-05]

# Metrics
duration: 2min
completed: 2026-04-04
---

# Phase 12 Plan 01: Department Brains Summary

**Two department brain files (business + tech) created and wired to all 10 agents via Read directives, with write-one-read-many enforcement through CMO/CTO heartbeat update steps**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-04T10:55:16Z
- **Completed:** 2026-04-04T10:57:26Z
- **Tasks:** 2
- **Files modified:** 14

## Accomplishments
- Created business stream brain with CreativAI positioning, active initiatives, and standing instructions
- Created tech stream brain with ADHD EF System context, coding standards, and tech debt register
- Wired all 10 agents to correct stream brain (5 business, 3 tech, 2 cross-stream reading both)
- Added brain update step 3.5 to CMO and CTO heartbeats with pruning/archiving instructions

## Task Commits

Each task was committed atomically:

1. **Task 1: Create department brain directories and BRAIN.md files** - `7c17900` (feat)
2. **Task 2: Wire all agents with Read directives and add brain update steps to dept heads** - `726e6be` (feat)

## Files Created/Modified
- `agents/_departments/business/BRAIN.md` - Shared business stream context (31 lines)
- `agents/_departments/tech/BRAIN.md` - Shared tech stream context (34 lines)
- `agents/_departments/business/archive/` - Empty directory for future pruned content
- `agents/_departments/tech/archive/` - Empty directory for future pruned content
- `agents/ceo/AGENTS.md` - Added Department Brains section (reads both)
- `agents/cmo/AGENTS.md` - Added Department Brain section (reads business)
- `agents/cto/AGENTS.md` - Added Department Brain section (reads tech)
- `agents/technical-writer/AGENTS.md` - Added Department Brain section (reads business)
- `agents/customer-success/AGENTS.md` - Added Department Brain section (reads business)
- `agents/ux-researcher/AGENTS.md` - Added Department Brain section (reads business)
- `agents/linkedin-growth-director/AGENTS.md` - Added Department Brain section (reads business)
- `agents/engineer/AGENTS.md` - Added Department Brain section (reads tech)
- `agents/code-reviewer/AGENTS.md` - Added Department Brain section (reads tech)
- `agents/product-owner/AGENTS.md` - Added Department Brains section (reads both)
- `agents/cmo/HEARTBEAT.md` - Added step 3.5 Update Department Brain
- `agents/cto/HEARTBEAT.md` - Added step 3.5 Update Department Brain

## Decisions Made
- Brain files seeded with current-state context only. Historical decisions deferred to department heads during their first brain update heartbeat. This avoids making assumptions about which past decisions are still relevant.
- 200-line cap enforced through heartbeat instructions rather than tooling, matching Paperclip's file-and-instruction approach.
- Write-one-read-many pattern enforced by only including brain update steps in CMO and CTO heartbeats. No other agent has write instructions for brain files.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Department brains are live and ready for agent heartbeat loading
- Plan 12-02 (Data Gating) can proceed: all AGENTS.md files now have the Department Brain section as an anchor point for adding Data Scope sections
- Archive directories ready for brain pruning when content grows past 200 lines

## Self-Check: PASSED

All files verified present. Both commits found in git log.

---
*Phase: 12-department-brains-and-data-gating*
*Completed: 2026-04-04*
