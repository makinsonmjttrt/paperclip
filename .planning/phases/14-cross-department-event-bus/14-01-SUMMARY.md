---
phase: 14-cross-department-event-bus
plan: 01
subsystem: agent-coordination
tags: [paperclip, labels, cross-department, handoff, rate-limiting, templates]

# Dependency graph
requires:
  - phase: 13-delegation-chains
    provides: delegation protocol, review/override, CEO routing table
provides:
  - x-dept label convention (business->tech, tech->business, pending-approval)
  - cross-department handoff protocol in CMO and CTO heartbeats
  - 6 handoff templates (4 business->tech, 2 tech->business)
  - rate-limited handoff creation (max 3 per heartbeat cycle)
  - X-Dept Counter in CMO, CTO, and PO MEMORY.md files
  - Product Owner cross-stream handoff capability
  - pending approval gate using blocked status + label
  - deferred handoff processing for rate-limited overflow
affects: [14-02 (CEO event bus monitoring, approval gate expansion)]

# Tech tracking
tech-stack:
  added: []
  patterns: [x-dept label convention, blocked+label approval gate, MEMORY.md rate counter, deferred handoff queue]

key-files:
  created: []
  modified:
    - ~/.paperclip/instances/default/companies/FourPointZero/agents/cmo/HEARTBEAT.md
    - ~/.paperclip/instances/default/companies/FourPointZero/agents/cto/HEARTBEAT.md
    - ~/.paperclip/instances/default/companies/FourPointZero/agents/cmo/MEMORY.md
    - ~/.paperclip/instances/default/companies/FourPointZero/agents/cto/MEMORY.md
    - ~/.paperclip/instances/default/companies/FourPointZero/agents/product-owner/HEARTBEAT.md
    - ~/.paperclip/instances/default/companies/FourPointZero/agents/product-owner/MEMORY.md

key-decisions:
  - "Paperclip API not reachable from executor; label creation documented as curl commands with placeholder IDs for user to run"
  - "Pending X-Dept Approval check added to both CMO and CTO heartbeats for bidirectional approval"
  - "Product Owner gets cross-stream handoff ability targeting either CMO or CTO"

patterns-established:
  - "X-dept label convention: x-dept:business->tech (orange), x-dept:tech->business (green), x-dept:pending-approval (yellow)"
  - "Approval gate: blocked status + x-dept:pending-approval label as draft-status workaround"
  - "Rate limiting via MEMORY.md counter: x_dept_created cap of 3 per heartbeat cycle with deferred queue"
  - "Comment tags: [X-DEPT], [X-DEPT-DEFERRED], [X-DEPT-APPROVED], [X-DEPT-REJECTED], [X-DEPT-CLARIFY]"

requirements-completed: [EVNT-01, EVNT-02, EVNT-03]

# Metrics
duration: 3min
completed: 2026-04-04
---

# Phase 14 Plan 01: Cross-Department Event Bus - Labels, Templates, and Handoff Protocol Summary

**X-dept label convention, 6 handoff templates, rate-limited cross-department handoff protocol for CMO/CTO/PO with blocked+label approval gate**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-04T11:55:11Z
- **Completed:** 2026-04-04T11:58:43Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Cross-department handoff protocol added to CMO (4.6), CTO (4.7), and Product Owner (4.5) heartbeats with rate limiting, deferred processing, and anti-pattern rules
- 6 handoff templates: 4 business->tech (Positioning/Copy Update, Competitor Response, Content Gap, SEO/Growth Opportunity) and 2 tech->business (Feature Launch Content Request, Tech Debt Escalation) plus 1 PO generic template
- X-Dept Counter sections added to CMO, CTO, and PO MEMORY.md files with heartbeat cycle tracking and reset rule
- Bidirectional pending approval gate: both CMO and CTO check for blocked x-dept issues requiring their approval each heartbeat

## Task Commits

Each task was committed atomically:

1. **Task 1: Create x-dept labels and add handoff protocol with templates to CMO and CTO** - `16529be` (feat)
2. **Task 2: Add X-Dept Counter to MEMORY.md files and update Product Owner with x-dept awareness** - `7178141` (feat)

## Files Created/Modified
- `agents/cmo/HEARTBEAT.md` - Added 4.6 Cross-Department Handoff section with 4 business->tech templates, rate limiting, deferred processing, approval gate, anti-pattern rules
- `agents/cto/HEARTBEAT.md` - Added 4.7 Cross-Department Handoff section with 2 tech->business templates, rate limiting, deferred processing, approval gate, anti-pattern rules
- `agents/cmo/MEMORY.md` - Added X-Dept Counter section with heartbeat_cycle, x_dept_created, x_dept_deferred fields and reset rule
- `agents/cto/MEMORY.md` - Added X-Dept Counter section with heartbeat_cycle, x_dept_created, x_dept_deferred fields and reset rule
- `agents/product-owner/HEARTBEAT.md` - Added 4.5 Cross-Department Handoff section with generic backlog handoff template and bidirectional targeting (CMO or CTO)
- `agents/product-owner/MEMORY.md` - Added X-Dept Counter section

## Decisions Made
- Paperclip API not reachable from executor environment; x-dept label creation documented as curl commands in CMO HEARTBEAT.md HTML comment block with placeholder IDs. User must run these before first handoff.
- Added Pending X-Dept Approval check to BOTH CMO and CTO heartbeats (not just one direction) since handoffs flow both ways.
- Product Owner gets full cross-stream handoff capability rather than just awareness, consistent with PO's cross-stream role.
- CMO stall detection renumbered to 5.5 (was unnumbered); CTO stall detection renumbered to 5.5 (was unnumbered). Keeps section numbering sequential.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Agent files live in ~/.paperclip/ which has its own git repo, separate from the fourpointzero project repo. Commits were made to the paperclip repo at ~/.paperclip/.

## User Setup Required

**X-dept labels must be created via Paperclip API before agents can create handoff issues.** The curl commands are documented in the CMO HEARTBEAT.md file as an HTML comment block at the top of the Cross-Department Handoff section. Run the three curl commands and replace the placeholder label IDs (`{LABEL_ID_BIZ_TO_TECH}`, `{LABEL_ID_TECH_TO_BIZ}`, `{LABEL_ID_PENDING_APPROVAL}`) in CMO, CTO, and PO HEARTBEAT.md files with the actual IDs returned by the API.

## Next Phase Readiness
- Plan 02 (CEO event bus monitoring and approval gate expansion) can proceed; it depends on the label convention and handoff protocol established here
- Labels need to be created via API before live agent testing; placeholder IDs are documented

## Self-Check: PASSED

All 6 modified files verified present. Both task commits (16529be, 7178141) verified in git log.

---
*Phase: 14-cross-department-event-bus*
*Completed: 2026-04-04*
