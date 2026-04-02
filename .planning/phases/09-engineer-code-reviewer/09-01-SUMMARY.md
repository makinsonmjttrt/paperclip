---
phase: 09-engineer-code-reviewer
plan: 01
subsystem: agents
tags: [paperclip, engineer, code-reviewer, heartbeat, soul, agents]

requires:
  - phase: 02-skill-adaptation-template
    provides: Conversion patterns for skill references
  - phase: 06-cto-agent
    provides: CTO agent configuration (reporting line, team structure, oversight patterns)
provides:
  - Engineer agent with FPZ project context, implementation workflow, and Code Reviewer handoff
  - Code Reviewer agent with FPZ code quality standards and PR review checklist
  - Bidirectional handoff chain between Engineer and Code Reviewer
affects: [09-02-cto-stream-skills, 10-validation]

tech-stack:
  added: []
  patterns: [engineer-reviewer-handoff, fpz-code-quality-checklist, implementation-workflow]

key-files:
  created: []
  modified:
    - ~/.paperclip/instances/default/companies/FourPointZero/agents/engineer/AGENTS.md
    - ~/.paperclip/instances/default/companies/FourPointZero/agents/engineer/SOUL.md
    - ~/.paperclip/instances/default/companies/FourPointZero/agents/engineer/HEARTBEAT.md
    - ~/.paperclip/instances/default/companies/FourPointZero/agents/code-reviewer/AGENTS.md
    - ~/.paperclip/instances/default/companies/FourPointZero/agents/code-reviewer/SOUL.md
    - ~/.paperclip/instances/default/companies/FourPointZero/agents/code-reviewer/HEARTBEAT.md

key-decisions:
  - "Followed CTO agent pattern for FourPointZero Context and Identity sections"
  - "Both agents report to CTO (changed from generic CEO default)"

patterns-established:
  - "Engineer-Reviewer handoff: Engineer creates PR, hands to Code Reviewer via issue, Reviewer hands back with verdict"
  - "FPZ Code Quality Checklist: 5-step review (correctness, standards, security, consistency, verdict)"

requirements-completed: [ENGR-01, ENGR-02, ENGR-03, CREV-01, CREV-02]

duration: 2min
completed: 2026-04-02
---

# Phase 9 Plan 01: Engineer and Code Reviewer Summary

**Engineer configured with 6-step implementation workflow and Code Reviewer handoff; Code Reviewer configured with 8 non-negotiable code quality standards and 5-step PR review checklist**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-02T22:30:07Z
- **Completed:** 2026-04-02T22:32:39Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Engineer AGENTS.md updated with FPZ project context (ADHD EF system, tech stack, standards, skill routing, document-tools capability)
- Engineer HEARTBEAT.md updated with 6-step implementation workflow including PR creation and Code Reviewer handoff, plus document generation workflow
- Engineer SOUL.md updated with FPZ identity (solo engineer mindset, UK English, ADHD-aware communication)
- Code Reviewer AGENTS.md updated with 8 non-negotiable code quality standards, team context, and review handoff process
- Code Reviewer HEARTBEAT.md updated with 5-step code quality checklist (correctness, standards, security, codebase consistency, verdict)
- Code Reviewer SOUL.md updated with quality gate mindset and UK English
- Both agents' reporting lines changed from CEO to CTO

## Task Commits

Agent files live in ~/.paperclip (outside the fourpointzero git repo), so task-level commits are not possible for the agent files themselves. Changes are documented in this summary and verified via automated grep checks.

1. **Task 1: Update Engineer AGENTS.md, SOUL.md, and HEARTBEAT.md** - Verified PASS (all grep checks passed)
2. **Task 2: Update Code Reviewer AGENTS.md, SOUL.md, and HEARTBEAT.md** - Verified PASS (all grep checks passed)

## Files Created/Modified
- `~/.paperclip/.../agents/engineer/AGENTS.md` - Added FourPointZero Context (ADHD EF system, tech stack, standards), Skill Routing section, changed reporting to CTO
- `~/.paperclip/.../agents/engineer/SOUL.md` - Added FourPointZero Identity (solo engineer, UK English, ADHD-aware)
- `~/.paperclip/.../agents/engineer/HEARTBEAT.md` - Added FPZ Implementation Workflow (6 steps) and Document Generation workflow
- `~/.paperclip/.../agents/code-reviewer/AGENTS.md` - Added FourPointZero Context (8 code quality standards), Review Handoff section, changed reporting to CTO
- `~/.paperclip/.../agents/code-reviewer/SOUL.md` - Added FourPointZero Identity (quality gate, UK English)
- `~/.paperclip/.../agents/code-reviewer/HEARTBEAT.md` - Added FPZ Code Quality Checklist (5 steps)

## Decisions Made
- Followed CTO agent pattern for section naming and structure (FourPointZero Context, FourPointZero Identity)
- Both agents report to CTO (changed from generic Paperclip default of CEO)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Engineer and Code Reviewer are configured and ready for validation testing in Phase 10
- Phase 9 Plan 02 (CTO stream skill deployment) is the next plan in this phase
- Bidirectional handoff chain verified: Engineer references Code Reviewer in HEARTBEAT.md, Code Reviewer references Engineer in HEARTBEAT.md

---
*Phase: 09-engineer-code-reviewer*
*Completed: 2026-04-02*

## Self-Check: PASSED
