---
phase: 11
slug: infrastructure-hardening
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-04
---

# Phase 11 -- Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual grep/diff verification (no code tests -- this phase edits agent instruction files) |
| **Config file** | none |
| **Quick run command** | `grep -r "Stagger\|stall\|checkpoint\|routing-table" ~/.paperclip/instances/default/companies/FourPointZero/agents/*/HEARTBEAT.md` |
| **Full suite command** | `for f in ~/.paperclip/instances/default/companies/FourPointZero/agents/*/HEARTBEAT.md; do echo "=== $(dirname $f | xargs basename) ==="; grep -c "Stagger\|Stall\|Checkpoint" "$f"; done` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run quick run command to verify sections exist
- **After every plan wave:** Run full suite to count sections per agent
- **Before `/gsd:verify-work`:** Full suite must show all agents have required sections
- **Max feedback latency:** 2 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 11-01-01 | 01 | 1 | INFR-01 | grep | `grep "Stagger" ~/.paperclip/.../agents/cmo/HEARTBEAT.md` | N/A W0 | pending |
| 11-01-02 | 01 | 1 | INFR-02 | grep | `grep "Stall" ~/.paperclip/.../agents/cmo/HEARTBEAT.md` | N/A W0 | pending |
| 11-02-01 | 02 | 2 | INFR-03 | grep | `grep "checkpoint" ~/.paperclip/.../agents/cmo/MEMORY.md` | N/A W0 | pending |
| 11-02-02 | 02 | 2 | INFR-04 | grep | `grep "routing-table\|Routing Table" ~/.paperclip/.../agents/ceo/HEARTBEAT.md` | N/A W0 | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements (agent files already exist, just need new sections)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Stagger prevents same-stream overlap | INFR-01 | Requires running heartbeats to observe timing | Start 2 CMO-stream agents, verify they don't fire simultaneously |
| Stall escalation routes correctly | INFR-02 | Requires a deliberately stalled agent | Assign issue to an idle agent, wait 2 cycles, verify escalation path |
| Session recovery resumes | INFR-03 | Requires interrupting a heartbeat mid-work | Kill agent mid-task, restart, verify it reads MEMORY.md checkpoint |
| Routing table rejects misrouted work | INFR-04 | Requires creating an issue with wrong-department keywords | Create a marketing issue assigned to Engineer, verify CEO re-routes |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 2s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
