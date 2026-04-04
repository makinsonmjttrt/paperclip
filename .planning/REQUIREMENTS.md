# Requirements: FourPointZero AI Agent Company

**Defined:** 2026-04-03
**Core Value:** Every agent knows exactly which skills it owns, and work flows down the hierarchy without ambiguity or overlap.

## v2.0 Requirements

### Infrastructure Hardening

- [ ] **INFR-01**: Heartbeat stagger configured so no two agents in the same stream fire simultaneously
- [ ] **INFR-02**: Stall detection tuned for 12+ agents (timeout thresholds, escalation to CEO)
- [ ] **INFR-03**: Session recovery documented so interrupted heartbeats resume cleanly
- [ ] **INFR-04**: Chain-of-command validation added (CEO confirms delegation routes match org chart)

### Department Brains

- [x] **BRAIN-01**: CMO stream brain directory created with shared marketing context (positioning, campaign history, audience intel)
- [x] **BRAIN-02**: CTO stream brain directory created with shared tech context (architecture decisions, tech debt, deployment state)
- [x] **BRAIN-03**: Each agent's AGENTS.md updated with Read directives pointing to their department brain
- [x] **BRAIN-04**: Brain files capped at 200 lines with rotation/pruning strategy
- [x] **BRAIN-05**: Department heads (CMO, CTO) are the only agents that write to their brain files

### Delegation Chains

- [ ] **DELG-01**: CMO can assign work directly to Technical Writer, Customer Success, UX Researcher, LinkedIn Growth Director
- [ ] **DELG-02**: CTO can assign work directly to Software Engineer, Code Reviewer, Product Owner
- [ ] **DELG-03**: Department heads can review and override output from their reports
- [ ] **DELG-04**: CEO delegates to department heads only (no longer routing to individual directors)
- [ ] **DELG-05**: Original brief passthrough enforced (max 3 delegation hops before content degrades)

### Cross-Department Event Bus

- [ ] **EVNT-01**: Label convention defined for cross-department issues (x-dept:business->tech, x-dept:tech->business)
- [ ] **EVNT-02**: Handoff issue templates created for common cross-dept workflows
- [ ] **EVNT-03**: Rate limiting configured (max 3 cross-dept issues per heartbeat cycle)
- [ ] **EVNT-04**: Draft-status handoffs require department head approval before execution
- [ ] **EVNT-05**: CEO has oversight dashboard of all cross-department work in flight

### Data Gating

- [x] **GATE-01**: Each agent has a Data Scope section in AGENTS.md defining readable paths
- [x] **GATE-02**: Business stream agents scoped to marketing/content/competitive data
- [x] **GATE-03**: Tech stream agents scoped to engineering/product/architecture data
- [x] **GATE-04**: CEO and Product Owner have cross-stream read access (both brains)
- [x] **GATE-05**: Data scope violations logged when detected (advisory, not enforced)

### Sub-Agent Teams

- [ ] **TEAM-01**: LinkedIn Growth Director expanded with LinkedIn Content Specialist (hook writing, carousel scripts, story posts)
- [ ] **TEAM-02**: LinkedIn Growth Director expanded with LinkedIn Outreach Specialist (DM sequences, connection requests, engagement)
- [ ] **TEAM-03**: Technical Writer expanded with Content Producer (drafting blog posts, newsletters, social content)
- [ ] **TEAM-04**: Technical Writer expanded with Quality Reviewer (humanizer pass, copy-editing, brand voice checks)
- [ ] **TEAM-05**: Skill ownership matrix updated for all new agents (skills redistributed from directors to specialists)
- [ ] **TEAM-06**: New agents registered in Paperclip and validated via heartbeat

## v1.0 Requirements (Completed)

All 73 v1.0 requirements completed. See .planning/MILESTONES.md for details.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Modifying Paperclip source code | Working within platform constraints |
| Moving to Relevance AI or Make.com | User chose to stay on Paperclip |
| 150+ agents | Machine resource constraint (single local machine) |
| Real-time agent messaging | Paperclip only supports async issue-based communication |
| Technical data gating enforcement | Paperclip has no file permission system; advisory only |
| Building new skills | Only orchestration and team expansion |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFR-01 | Phase 11 | Pending |
| INFR-02 | Phase 11 | Pending |
| INFR-03 | Phase 11 | Pending |
| INFR-04 | Phase 11 | Pending |
| BRAIN-01 | Phase 12 | Complete |
| BRAIN-02 | Phase 12 | Complete |
| BRAIN-03 | Phase 12 | Complete |
| BRAIN-04 | Phase 12 | Complete |
| BRAIN-05 | Phase 12 | Complete |
| GATE-01 | Phase 12 | Complete |
| GATE-02 | Phase 12 | Complete |
| GATE-03 | Phase 12 | Complete |
| GATE-04 | Phase 12 | Complete |
| GATE-05 | Phase 12 | Complete |
| DELG-01 | Phase 13 | Pending |
| DELG-02 | Phase 13 | Pending |
| DELG-03 | Phase 13 | Pending |
| DELG-04 | Phase 13 | Pending |
| DELG-05 | Phase 13 | Pending |
| EVNT-01 | Phase 14 | Pending |
| EVNT-02 | Phase 14 | Pending |
| EVNT-03 | Phase 14 | Pending |
| EVNT-04 | Phase 14 | Pending |
| EVNT-05 | Phase 14 | Pending |
| TEAM-01 | Phase 15 | Pending |
| TEAM-02 | Phase 15 | Pending |
| TEAM-03 | Phase 15 | Pending |
| TEAM-04 | Phase 15 | Pending |
| TEAM-05 | Phase 15 | Pending |
| TEAM-06 | Phase 15 | Pending |

**Coverage:**
- v2.0 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0

---
*Requirements defined: 2026-04-03*
*Last updated: 2026-04-04 after Phase 12 Plan 02 completion*
