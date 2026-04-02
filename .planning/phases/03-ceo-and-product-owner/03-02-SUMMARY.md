---
phase: 03-ceo-and-product-owner
plan: 02
subsystem: agent-config
tags: [paperclip, product-owner, backlog, prioritisation, cross-stream]

# Dependency graph
requires:
  - phase: 01-skill-ownership-matrix
    provides: Agent-to-skill mapping and domain assignments
provides:
  - Product Owner AGENTS.md with FPZ company structure and assignment guide
  - Product Owner HEARTBEAT.md with cross-stream prioritisation logic
  - Product Owner SOUL.md with FPZ recruitment business awareness
affects: [05-cmo-stream-skills, 06-cto-stream-config, 07-remaining-agents]

# Tech tracking
tech-stack:
  added: []
  patterns: [cross-stream-prioritisation, label-based-routing, quality-gate-workflow]

key-files:
  created: []
  modified:
    - ~/.paperclip/instances/default/companies/FourPointZero/agents/product-owner/AGENTS.md
    - ~/.paperclip/instances/default/companies/FourPointZero/agents/product-owner/HEARTBEAT.md
    - ~/.paperclip/instances/default/companies/FourPointZero/agents/product-owner/SOUL.md

key-decisions:
  - "UK English spelling used throughout (humaniser not humanizer) per project CLAUDE.md"
  - "Assignment Guide uses table format for quick agent-to-issue-type lookup"

patterns-established:
  - "Cross-stream prioritisation: 60/40 business-to-tech ratio in active backlog"
  - "Quality gate workflow: content production routes through Technical Writer for humaniser pass"
  - "Label-based routing: 7 labels map to agent domains for issue assignment"
  - "Issue templates: 3 patterns (content, tech, strategy) for consistent issue creation"

requirements-completed: [POWN-01, POWN-02, POWN-03]

# Metrics
duration: 2min
completed: 2026-04-02
---

# Phase 3 Plan 2: Product Owner FPZ Configuration Summary

**Product Owner configured with FPZ company structure, cross-stream prioritisation logic (60/40 business/tech), label-based routing, and recruitment business awareness**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-02T20:20:36Z
- **Completed:** 2026-04-02T20:22:45Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Product Owner AGENTS.md now contains full company structure (both streams, all 8 agent domains) with an assignment guide mapping issue types to the correct agent
- Product Owner HEARTBEAT.md has cross-stream prioritisation rules, label strategy for routing, and FPZ-specific issue templates for content/tech/strategy work
- Product Owner SOUL.md has FPZ awareness: recruitment business context, UK English requirement, and product-marketing-context reference

## Task Commits

Modified files are outside the git repository (in ~/.paperclip/), so per-task atomic commits were not possible. All changes applied directly to the filesystem.

1. **Task 1: Update Product Owner AGENTS.md with FPZ backlog context** - no commit (external file)
2. **Task 2: Update Product Owner HEARTBEAT.md and SOUL.md** - no commit (external files)

**Plan metadata:** committed with SUMMARY.md and state updates

## Files Modified
- `~/.paperclip/instances/default/companies/FourPointZero/agents/product-owner/AGENTS.md` - Added FourPointZero Context section (company streams, assignment guide) and product-marketing-context reference in Shared Documentation
- `~/.paperclip/instances/default/companies/FourPointZero/agents/product-owner/HEARTBEAT.md` - Added Cross-Stream Prioritisation section (prioritisation rules, label strategy, issue templates)
- `~/.paperclip/instances/default/companies/FourPointZero/agents/product-owner/SOUL.md` - Added FourPointZero Awareness section (recruitment business context, UK English, stream management)

## Decisions Made
- Used UK English spelling throughout ("humaniser", "prioritisation", "colour") per project CLAUDE.md requirement
- Assignment Guide uses table format rather than prose for fast lookup during agent assignment workflows

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] UK English spelling correction**
- **Found during:** Task 2 (HEARTBEAT.md update)
- **Issue:** Plan template used US English "humanizer" but project CLAUDE.md requires UK English
- **Fix:** Used "humaniser" throughout HEARTBEAT.md
- **Files modified:** ~/.paperclip/instances/default/companies/FourPointZero/agents/product-owner/HEARTBEAT.md
- **Verification:** grep confirms "humaniser" appears in all quality gate references

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Spelling correction for consistency with project language standards. No scope creep.

## Issues Encountered
- Modified files are in ~/.paperclip/ which is outside the project git repository. Per-task commits could not be created for the actual file changes. Changes were applied directly and documented here.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Product Owner is fully configured with FPZ context and can manage backlog across both streams
- Ready for Phase 3 Plan 1 (CEO agent configuration) if not already complete
- Ready for downstream phases (CMO stream skills, CTO config) once Phase 3 is done

---
*Phase: 03-ceo-and-product-owner*
*Completed: 2026-04-02*
