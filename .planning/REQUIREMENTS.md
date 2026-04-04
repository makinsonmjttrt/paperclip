# Requirements: FourPointZero AI Agent Company

**Defined:** 2026-04-04
**Core Value:** Every agent knows exactly which skills it owns, and work flows down the hierarchy without ambiguity or overlap.

## v3 Requirements

### Monitoring

- [x] **MON-01**: Each agent's heartbeat logs output count, stall count, and error count to MEMORY.md
- [x] **MON-02**: CEO generates a daily company health summary (agents active, stalled, errored, issues completed)
- [x] **MON-03**: Agent utilisation tracked (heartbeats with work vs heartbeats idle)
- [x] **MON-04**: Cross-department event bus metrics logged (handoffs created, approved, rejected, stalled)

### Self-Healing

- [ ] **HEAL-01**: Agents in "error" status auto-retry on next heartbeat cycle
- [ ] **HEAL-02**: Deadlocked agents (executionRunId set but idle) auto-cleared by CEO
- [ ] **HEAL-03**: Interrupted heartbeats resume from MEMORY.md checkpoint without data loss
- [ ] **HEAL-04**: Stalled work auto-reassigned after 2 failed nudges (routine work only)

### Workload Balancing

- [ ] **LOAD-01**: CEO detects agents with 3+ assigned issues and flags overload
- [ ] **LOAD-02**: CEO detects agents idle for 3+ heartbeat cycles and suggests work redistribution
- [ ] **LOAD-03**: Department heads can split oversized issues into sub-tasks for their reports

### Consolidation

- [ ] **CONS-01**: Weekly utilisation report identifies agents with less than 20% active heartbeats
- [ ] **CONS-02**: CEO recommends merge or retire for consistently underutilised agents
- [ ] **CONS-03**: Skill redistribution plan generated before any agent retirement

### End-to-End Testing

- [ ] **E2E-01**: Create a test issue that exercises the full CEO > CMO > Director > Specialist chain
- [ ] **E2E-02**: Create a test issue that exercises cross-department handoff (business > tech)
- [ ] **E2E-03**: Verify quality gate pass (content through Quality Reviewer) completes end-to-end
- [ ] **E2E-04**: Verify stall detection and escalation fires correctly under simulated failure

## Completed Requirements (v1.0 + v2.0)

All 103 requirements from v1.0 (73) and v2.0 (30) are complete. See MILESTONES.md for details.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Adding more agents | 14 is the cap until consolidation data proves need |
| New skills | Only hardening existing agent orchestration |
| Platform migration | Staying on Paperclip |
| Real-time monitoring dashboard | Would require new infrastructure outside Paperclip |
| Automated agent scaling | Single machine constraint makes this impractical |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| MON-01 | Phase 16 | Complete |
| MON-02 | Phase 16 | Complete |
| MON-03 | Phase 16 | Complete |
| MON-04 | Phase 16 | Complete |
| HEAL-01 | Phase 17 | Pending |
| HEAL-02 | Phase 17 | Pending |
| HEAL-03 | Phase 17 | Pending |
| HEAL-04 | Phase 17 | Pending |
| LOAD-01 | Phase 18 | Pending |
| LOAD-02 | Phase 18 | Pending |
| LOAD-03 | Phase 18 | Pending |
| CONS-01 | Phase 18 | Pending |
| CONS-02 | Phase 18 | Pending |
| CONS-03 | Phase 18 | Pending |
| E2E-01 | Phase 19 | Pending |
| E2E-02 | Phase 19 | Pending |
| E2E-03 | Phase 19 | Pending |
| E2E-04 | Phase 19 | Pending |

**Coverage:**
- v3 requirements: 18 total
- Mapped to phases: 18
- Unmapped: 0

---
*Requirements defined: 2026-04-04*
