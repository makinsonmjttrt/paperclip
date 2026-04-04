# Roadmap: FourPointZero AI Agent Company

## Milestones

- ✅ **v1.0 10-Agent Company** - Phases 0-10 (shipped 2026-04-03)
- ✅ **v2.0 Conducting AI Scale** - Phases 11-15 (shipped 2026-04-04)
- 🚧 **v3.0 Hardening** - Phases 16-19 (in progress)

## Phases

<details>
<summary>✅ v1.0 10-Agent Company (Phases 0-10) - SHIPPED 2026-04-03</summary>

10 agents configured with 71 skills mapped and adapted to Paperclip format. Skill ownership matrix with zero overlap. All agents validated end-to-end via heartbeat.

73 requirements, all complete. See MILESTONES.md for full details.

- [x] **Phase 0: Housekeeping** - Delete old FPZ company, create product-marketing-context
- [x] **Phase 1: Skill Ownership Matrix** - Map all 71 skills to exactly one agent with zero overlap
- [x] **Phase 2: Skill Adaptation Template** - Create reusable pattern for converting Claude Code skills to Paperclip format
- [x] **Phase 3: CEO and Product Owner** - Configure the two proactive agents that drive and prioritise work
- [x] **Phase 4: CMO Agent** - Configure the business stream head with marketing strategy skills
- [x] **Phase 5: CMO Stream Skill Deployment** - Adapt and deploy 30+ marketing skills to the business stream
- [x] **Phase 6: CTO Agent** - Configure the tech stream head with engineering oversight
- [x] **Phase 7: Technical Writer** - Configure the content quality gate agent
- [x] **Phase 8: Customer Success and UX Researcher** - Configure competitive intel and growth agents
- [x] **Phase 8.5: LinkedIn Growth Director** - Configure dedicated LinkedIn agent under CMO stream
- [x] **Phase 9: Engineer and Code Reviewer** - Configure the dev stream workers as a pair
- [x] **Phase 10: Validation** - Test issues through each agent to prove the company works

</details>

<details>
<summary>✅ v2.0 Conducting AI Scale (Phases 11-15) - SHIPPED 2026-04-04</summary>

Expanded from 10 to 14 agents. Department brains, delegation chains, cross-department event bus, sub-agent teams, and data gating.

30 requirements, all complete. See MILESTONES.md for full details.

- [x] **Phase 11: Infrastructure Hardening** - Stagger heartbeats, add stall detection, session recovery, chain-of-command validation
- [x] **Phase 12: Department Brains and Data Gating** - Shared stream knowledge bases with advisory access scoping
- [x] **Phase 13: Delegation Chains** - Department heads manage their reports directly, CEO routes through heads only
- [x] **Phase 14: Cross-Department Event Bus** - Structured handoffs between business and tech streams via labelled issues
- [x] **Phase 15: Sub-Agent Teams** - Expand LinkedIn and Technical Writer into specialist teams

</details>

### 🚧 v3.0 Hardening (In Progress)

**Milestone Goal:** Make the 14-agent company reliable and resilient under real workload. Monitor, measure, self-heal, and consolidate.

- [x] **Phase 16: Performance Monitoring** - Instrument every agent to track output, stalls, errors, and utilisation (completed 2026-04-04)
- [x] **Phase 17: Self-Healing** - Auto-recover from errors, deadlocks, interrupted heartbeats, and stalled work (completed 2026-04-04)
- [ ] **Phase 18: Workload & Consolidation** - Balance load across agents and make data-driven keep/merge/retire decisions
- [ ] **Phase 19: End-to-End Validation** - Prove real work completes full delegation chains under failure conditions

## Phase Details

### Phase 16: Performance Monitoring
**Goal**: Every agent produces measurable health data, and the CEO can see company-wide health at a glance
**Depends on**: Phase 15 (v2.0 complete)
**Requirements**: MON-01, MON-02, MON-03, MON-04
**Success Criteria** (what must be TRUE):
  1. Each agent's MEMORY.md contains output count, stall count, and error count after every heartbeat
  2. CEO produces a daily summary showing which agents are active, stalled, errored, and how many issues completed
  3. Any agent's utilisation ratio (working heartbeats vs idle heartbeats) can be read from its MEMORY.md
  4. Event bus metrics (handoffs created, approved, rejected, stalled) are logged and visible to the CEO
**Plans**: 2 plans

Plans:
- [ ] 16-01-PLAN.md -- Instrument all 14 agents with Performance Metrics section and heartbeat update step
- [ ] 16-02-PLAN.md -- Add CEO health summary reporting and event bus metrics counters

### Phase 17: Self-Healing
**Goal**: Agents recover from failures automatically without human intervention
**Depends on**: Phase 16 (needs monitoring data to detect failures)
**Requirements**: HEAL-01, HEAL-02, HEAL-03, HEAL-04
**Success Criteria** (what must be TRUE):
  1. An agent that enters "error" status retries automatically on its next heartbeat cycle
  2. A deadlocked agent (executionRunId set but idle) gets cleared by the CEO without manual intervention
  3. An interrupted heartbeat resumes from its MEMORY.md checkpoint with no data loss
  4. Work stalled after 2 failed nudges gets reassigned to another capable agent automatically (routine work only)
**Plans**: 2 plans

Plans:
- [x] 17-01-PLAN.md -- Agent-level self-recovery: error auto-retry and checkpoint resume with data preservation
- [x] 17-02-PLAN.md -- Organisational-level recovery: CEO deadlock auto-clear and 2-nudge stall reassignment

### Phase 18: Workload & Consolidation
**Goal**: Work is distributed fairly across agents, and underperforming agents are identified for merge or retirement
**Depends on**: Phase 16 (needs utilisation data), Phase 17 (healing must work before rebalancing)
**Requirements**: LOAD-01, LOAD-02, LOAD-03, CONS-01, CONS-02, CONS-03
**Success Criteria** (what must be TRUE):
  1. CEO flags any agent with 3+ assigned issues as overloaded
  2. CEO flags any agent idle for 3+ heartbeat cycles and suggests redistribution
  3. Department heads can split oversized issues into sub-tasks for their reports
  4. A weekly utilisation report identifies agents with less than 20% active heartbeats
  5. CEO generates merge/retire recommendations with a skill redistribution plan before any agent removal
**Plans**: 2 plans

Plans:
- [x] 18-01-PLAN.md -- CEO workload balance check (overload + idle detection) and CMO/CTO issue splitting
- [ ] 18-02-PLAN.md -- Weekly utilisation report with merge/retire recommendations and skill redistribution plans

### Phase 19: End-to-End Validation
**Goal**: Prove the full system works under real and simulated failure conditions
**Depends on**: Phase 16, Phase 17, Phase 18 (validates everything built in prior phases)
**Requirements**: E2E-01, E2E-02, E2E-03, E2E-04
**Success Criteria** (what must be TRUE):
  1. A test issue traverses the full CEO > CMO > Director > Specialist chain and completes
  2. A test issue crosses department boundaries (business > tech) via the event bus and completes
  3. Content passing through the Quality Reviewer gate completes the full quality workflow end-to-end
  4. Simulated agent failure triggers stall detection, escalation, and self-healing recovery
**Plans**: 2 plans

Plans:
- [ ] 19-01-PLAN.md -- Delegation chain (CEO>CMO>LGD) and cross-department handoff (CMO>CTO)
- [ ] 19-02-PLAN.md -- Quality gate (TW>CP>QR) and stall detection under simulated failure

## Progress

**Execution Order:** 16 > 17 > 18 > 19

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 0-10 | v1.0 | All | Complete | 2026-04-03 |
| 11-15 | v2.0 | All | Complete | 2026-04-04 |
| 16. Performance Monitoring | 2/2 | Complete   | 2026-04-04 | - |
| 17. Self-Healing | v3.0 | 2/2 | Complete | 2026-04-04 |
| 18. Workload & Consolidation | v3.0 | 1/2 | In progress | - |
| 19. End-to-End Validation | v3.0 | 0/2 | Not started | - |
