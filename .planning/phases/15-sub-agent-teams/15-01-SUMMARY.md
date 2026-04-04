---
phase: 15-sub-agent-teams
plan: 01
subsystem: agents
tags: [paperclip, sub-agents, linkedin, skill-redistribution, team-hierarchy]

# Dependency graph
requires:
  - phase: 13-delegation-chains
    provides: Chain of command patterns and delegation logic
  - phase: 11-stagger-slots
    provides: Stagger slot framework and checkpoint protocol
provides:
  - LinkedIn Content Specialist agent (slot B6) with 2 skills
  - LinkedIn Outreach Specialist agent (slot B7) with 3 skills
  - LinkedIn Growth Director updated to team lead with 2 retained skills
  - Sub-team delegation and stall detection patterns
affects: [15-02, 15-03, skill-ownership-matrix]

# Tech tracking
tech-stack:
  added: []
  patterns: [specialist-sub-agent, skill-redistribution-move-not-copy, team-lead-delegation, stall-detection]

key-files:
  created:
    - agents/linkedin-content-specialist/AGENTS.md
    - agents/linkedin-content-specialist/HEARTBEAT.md
    - agents/linkedin-content-specialist/SOUL.md
    - agents/linkedin-content-specialist/TOOLS.md
    - agents/linkedin-content-specialist/MEMORY.md
    - agents/linkedin-outreach-specialist/AGENTS.md
    - agents/linkedin-outreach-specialist/HEARTBEAT.md
    - agents/linkedin-outreach-specialist/SOUL.md
    - agents/linkedin-outreach-specialist/TOOLS.md
    - agents/linkedin-outreach-specialist/MEMORY.md
  modified:
    - agents/linkedin-growth-director/AGENTS.md
    - agents/linkedin-growth-director/HEARTBEAT.md

key-decisions:
  - "Skills physically moved (mv), never copied, to prevent drift between parent and specialist"
  - "Quality gate routing updated from Technical Writer to Quality Reviewer across all LinkedIn Growth Director files"
  - "Sub-agents wait for team lead only (not all business stream agents) to narrow stagger collision window"

patterns-established:
  - "Specialist sub-agent: receives moved skills, reports to team lead, routes to Quality Reviewer for quality gate"
  - "Team lead delegation: creates sub-issues with BRIEF-PASSTHROUGH, reviews output before quality gate"
  - "Stall detection: team lead checks specialist issues, nudges after 2 cycles, escalates to CMO if still stalled"

requirements-completed: [TEAM-01, TEAM-02]

# Metrics
duration: 4min
completed: 2026-04-04
---

# Phase 15 Plan 01: LinkedIn Specialist Sub-Agents Summary

**LinkedIn Growth Director split from 7-skill IC to 2-skill team lead managing Content Specialist (B6) and Outreach Specialist (B7) with moved skills and Quality Reviewer routing**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-04T12:07:10Z
- **Completed:** 2026-04-04T12:11:28Z
- **Tasks:** 2
- **Files modified:** 17

## Accomplishments
- Created LinkedIn Content Specialist with 5 config files and 2 moved skills (linkedin-post-writer, linkedin-content-strategy)
- Created LinkedIn Outreach Specialist with 5 config files and 3 moved skills (cold-outreach-sequence, cold-email, meeting-prep)
- Updated LinkedIn Growth Director from 7-skill individual contributor to 2-skill team lead with Direct Reports section, Sub-Team Delegation (3.5), and Specialist Stall Detection (3.6)
- Updated all quality gate routing from Technical Writer to Quality Reviewer

## Task Commits

Each task was committed atomically:

1. **Task 1: Create LinkedIn Content Specialist and LinkedIn Outreach Specialist agent directories with moved skills** - `0ad698f` (feat)
2. **Task 2: Update LinkedIn Growth Director to team lead role** - `b3bde06` (feat)

## Files Created/Modified
- `agents/linkedin-content-specialist/AGENTS.md` - Identity, chain of command, 2 skill references, reports to LinkedIn Growth Director
- `agents/linkedin-content-specialist/HEARTBEAT.md` - Execution checklist with slot B6, quality gate via Quality Reviewer
- `agents/linkedin-content-specialist/SOUL.md` - Creative producer persona, differentiated from strategist role
- `agents/linkedin-content-specialist/TOOLS.md` - Placeholder
- `agents/linkedin-content-specialist/MEMORY.md` - Initial checkpoint template
- `agents/linkedin-content-specialist/skills/linkedin-post-writer.md` - Moved from director
- `agents/linkedin-content-specialist/skills/linkedin-content-strategy.md` - Moved from director
- `agents/linkedin-outreach-specialist/AGENTS.md` - Identity, chain of command, 3 skill references, reports to LinkedIn Growth Director
- `agents/linkedin-outreach-specialist/HEARTBEAT.md` - Execution checklist with slot B7, quality gate via Quality Reviewer
- `agents/linkedin-outreach-specialist/SOUL.md` - Relationship builder persona, differentiated from content creator
- `agents/linkedin-outreach-specialist/TOOLS.md` - Placeholder
- `agents/linkedin-outreach-specialist/MEMORY.md` - Initial checkpoint template
- `agents/linkedin-outreach-specialist/skills/cold-outreach-sequence.md` - Moved from director
- `agents/linkedin-outreach-specialist/skills/cold-email.md` - Moved from director
- `agents/linkedin-outreach-specialist/skills/meeting-prep.md` - Moved from director
- `agents/linkedin-growth-director/AGENTS.md` - Reduced to 2 skills, added Direct Reports, updated quality gate routing
- `agents/linkedin-growth-director/HEARTBEAT.md` - Added Sub-Team Delegation (3.5), Specialist Stall Detection (3.6), updated routing to Quality Reviewer

## Decisions Made
- Skills physically moved using `mv` (not copied) to prevent drift between parent and specialist
- Quality gate routing updated from Technical Writer to Quality Reviewer across all LinkedIn Growth Director files
- Sub-agents wait for team lead only in stagger checks (not all business stream agents) to keep stagger chain manageable
- SOUL.md files differentiated: Content Specialist as "creative producer", Outreach Specialist as "relationship builder", distinct from Director as "strategist"

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated remaining Technical Writer references in HEARTBEAT.md FPZ section**
- **Found during:** Task 2
- **Issue:** The FPZ LinkedIn Content Calendar section (steps 4 and 6) in HEARTBEAT.md still referenced Technical Writer for quality gate routing after the main Content Production Rules were updated
- **Fix:** Updated 2 additional Technical Writer references to Quality Reviewer in the FPZ LinkedIn Content Calendar section
- **Files modified:** agents/linkedin-growth-director/HEARTBEAT.md
- **Verification:** Grep confirms only the stagger awareness Technical Writer agent ID reference remains (correct -- that is the agent identity, not a routing reference)
- **Committed in:** b3bde06 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Necessary for routing consistency. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Both specialist agent directories are ready for registration via Paperclip API (Plan 03)
- Technical Writer sub-agents (Content Producer, Quality Reviewer) are next in Plan 02
- Agent IDs in HEARTBEAT.md delegation sections are placeholder format ({linkedin-content-specialist-id}) pending registration

## Self-Check: PASSED

All 12 key files verified present. Both task commits (0ad698f, b3bde06) confirmed in git log.

---
*Phase: 15-sub-agent-teams*
*Completed: 2026-04-04*
