# Roadmap: FourPointZero AI Agent Company

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 0: Housekeeping** - Delete old FPZ company, create product-marketing-context (2026-04-02)
- [x] **Phase 1: Skill Ownership Matrix** - Map all 71 skills to exactly one agent with zero overlap (2026-04-02)
- [x] **Phase 2: Skill Adaptation Template** - Create reusable pattern for converting Claude Code skills to Paperclip format (2026-04-02)
- [x] **Phase 3: CEO and Product Owner** - Configure the two proactive agents that drive and prioritise work (2026-04-02)
- [x] **Phase 4: CMO Agent** - Configure the business stream head with marketing strategy skills (2026-04-02)
- [x] **Phase 5: CMO Stream Skill Deployment** - Adapt and deploy 30+ marketing skills to the business stream (2026-04-03)
- [x] **Phase 6: CTO Agent** - Configure the tech stream head with engineering oversight (2026-04-02)
- [x] **Phase 7: Technical Writer** - Configure the content quality gate agent (2026-04-03)
- [x] **Phase 8: Customer Success and UX Researcher** - Configure competitive intel and growth agents (2026-04-02)
- [x] **Phase 8.5: LinkedIn Growth Director** - Configure dedicated LinkedIn agent under CMO stream (2026-04-02)
- [x] **Phase 9: Engineer and Code Reviewer** - Configure the dev stream workers as a pair (2026-04-03)
- [x] **Phase 10: Validation** - Test issues through each agent to prove the company works (2026-04-03)

- [x] **Phase 11: Infrastructure Hardening** (2026-04-04) - Stagger heartbeats, add stall detection, session recovery, chain-of-command validation
- [x] **Phase 12: Department Brains and Data Gating** - Shared stream knowledge bases with advisory access scoping (2026-04-04)
- [ ] **Phase 13: Delegation Chains** - Department heads manage their reports directly, CEO routes through heads only
- [ ] **Phase 14: Cross-Department Event Bus** - Structured handoffs between business and tech streams via labelled issues
- [ ] **Phase 15: Sub-Agent Teams** - Expand LinkedIn and Technical Writer into specialist teams

## Phase Details

### Phase 11: Infrastructure Hardening
**Goal**: The 10-agent company runs reliably at scale with monitoring, recovery, and staggered execution
**Depends on**: Phase 10 (v1.0 complete)
**Requirements**: INFR-01, INFR-02, INFR-03, INFR-04
**Success Criteria** (what must be TRUE):
  1. No two agents in the same stream fire their heartbeat at the same time
  2. CEO detects and escalates stalled agents within 2 heartbeat cycles
  3. An interrupted heartbeat can be resumed without manual cleanup
  4. CEO can confirm that delegation routes match the org chart before any work is routed
**Plans**: TBD

Plans:
- [x] 11-01: Heartbeat stagger awareness and checkpoint session recovery
- [ ] 11-02: TBD

### Phase 12: Department Brains and Data Gating
**Goal**: Every agent loads shared stream context on heartbeat and knows exactly which data it can access
**Depends on**: Phase 11
**Requirements**: BRAIN-01, BRAIN-02, BRAIN-03, BRAIN-04, BRAIN-05, GATE-01, GATE-02, GATE-03, GATE-04, GATE-05
**Success Criteria** (what must be TRUE):
  1. CMO stream agents load business brain context (positioning, campaigns, audience) on every heartbeat
  2. CTO stream agents load tech brain context (architecture, tech debt, deployment state) on every heartbeat
  3. Only department heads (CMO, CTO) can write to their stream's brain files
  4. Each agent's AGENTS.md defines a Data Scope section listing what it can and cannot read
  5. A data scope violation is logged when detected (not enforced, advisory only)
**Plans**: 2 plans

Plans:
- [x] 12-01-PLAN.md -- Create department brain directories, BRAIN.md files, wire all agents with Read directives, add brain update steps to CMO/CTO heartbeats
- [x] 12-02-PLAN.md -- Add Data Scope sections to all 10 agents, add CEO violation logging

### Phase 13: Delegation Chains
**Goal**: Work flows through the hierarchy (CEO to heads to reports) with original briefs preserved at every hop
**Depends on**: Phase 12
**Requirements**: DELG-01, DELG-02, DELG-03, DELG-04, DELG-05
**Success Criteria** (what must be TRUE):
  1. CMO can assign and review work from Technical Writer, Customer Success, UX Researcher, and LinkedIn Growth Director
  2. CTO can assign and review work from Software Engineer, Code Reviewer, and Product Owner
  3. CEO routes all work to department heads only, never directly to individual directors
  4. The original brief passes through unchanged at every delegation hop (max 3 hops before delivery)
**Plans**: 2 plans

Plans:
- [ ] 13-01-PLAN.md -- Fix reporting lines for 5 agents, replace CEO routing tables with stream-head-only routing
- [ ] 13-02-PLAN.md -- Add Direct Reports sections, Delegation steps, and Review/Override authority to CMO and CTO

### Phase 14: Cross-Department Event Bus
**Goal**: CMO and CTO streams can trigger work in each other's departments through structured, rate-limited handoffs
**Depends on**: Phase 13
**Requirements**: EVNT-01, EVNT-02, EVNT-03, EVNT-04, EVNT-05
**Success Criteria** (what must be TRUE):
  1. A CMO-stream agent can create a labelled issue that lands in the CTO stream (and vice versa)
  2. Cross-department handoff issues follow a consistent template with structured context
  3. No more than 3 cross-department issues fire per heartbeat cycle
  4. Draft-status handoffs require department head approval before any agent acts on them
  5. CEO can see all cross-department work currently in flight
**Plans**: TBD

Plans:
- [ ] 14-01: TBD
- [ ] 14-02: TBD

### Phase 15: Sub-Agent Teams
**Goal**: LinkedIn Growth Director and Technical Writer each lead specialist teams that carry redistributed production skills
**Depends on**: Phase 14
**Requirements**: TEAM-01, TEAM-02, TEAM-03, TEAM-04, TEAM-05, TEAM-06
**Success Criteria** (what must be TRUE):
  1. LinkedIn Content Specialist produces hook writing, carousel scripts, and story posts from delegated briefs
  2. LinkedIn Outreach Specialist produces DM sequences, connection requests, and engagement actions from delegated briefs
  3. Content Producer drafts blog posts, newsletters, and social content under Technical Writer direction
  4. Quality Reviewer runs humanizer, copy-editing, and brand voice checks under Technical Writer direction
  5. All new agents are registered in Paperclip and pass heartbeat validation
**Plans**: TBD

Plans:
- [ ] 15-01: TBD
- [ ] 15-02: TBD
- [ ] 15-03: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 11 > 12 > 13 > 14 > 15

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 0. Housekeeping | v1.0 | 0/1 | Not started | - |
| 1. Skill Ownership Matrix | v1.0 | 2/2 | Complete | 2026-04-02 |
| 2. Skill Adaptation Template | v1.0 | 1/1 | Complete | 2026-04-02 |
| 3. CEO and Product Owner | v1.0 | 2/2 | Complete | 2026-04-02 |
| 4. CMO Agent | v1.0 | 1/1 | Complete | 2026-04-02 |
| 5. CMO Stream Skill Deployment | v1.0 | 3/4 | In Progress | |
| 6. CTO Agent | v1.0 | 1/1 | Complete | 2026-04-02 |
| 7. Technical Writer | v1.0 | 1/1 | Complete | 2026-04-02 |
| 8. Customer Success and UX Researcher | v1.0 | 2/2 | Complete | 2026-04-02 |
| 8.5. LinkedIn Growth Director | v1.0 | 1/1 | Complete | 2026-04-02 |
| 9. Engineer and Code Reviewer | v1.0 | 2/2 | Complete | 2026-04-02 |
| 10. Validation | v1.0 | 2/2 | Complete | 2026-04-03 |
| 11. Infrastructure Hardening | v2.0 | 2/2 | Complete | 2026-04-04 |
| 12. Department Brains and Data Gating | v2.0 | 2/2 | Complete | 2026-04-04 |
| 13. Delegation Chains | v2.0 | 0/2 | Not started | - |
| 14. Cross-Department Event Bus | v2.0 | 0/? | Not started | - |
| 15. Sub-Agent Teams | v2.0 | 0/? | Not started | - |
