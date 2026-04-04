---
phase: 13
slug: delegation-chains
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-04
---

# Phase 13 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | grep / file existence checks (no code framework — all changes are instructional files) |
| **Config file** | none |
| **Quick run command** | `grep -l "You report to the CMO" /Users/martynmakinson/.paperclip/instances/default/companies/FourPointZero/agents/*/AGENTS.md` |
| **Full suite command** | See Per-Task Verification Map — manual grep checks per file |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run quick grep on modified AGENTS.md/HEARTBEAT.md
- **After every plan wave:** Run full grep suite across all agent files
- **Before `/gsd:verify-work`:** All grep checks must return expected strings
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 13-01-01 | 01 | 1 | DELG-01 | grep | `grep "You report to the CMO" agents/technical-writer/AGENTS.md agents/customer-success/AGENTS.md agents/ux-researcher/AGENTS.md agents/linkedin-growth-director/AGENTS.md` | ✅ | ⬜ pending |
| 13-01-02 | 01 | 1 | DELG-02 | grep | `grep "You report to the CTO" agents/engineer/AGENTS.md agents/code-reviewer/AGENTS.md` | ✅ | ⬜ pending |
| 13-01-03 | 01 | 1 | DELG-04 | grep | `grep -c "CMO\|CTO\|Product Owner" agents/ceo/HEARTBEAT.md` (routing table should only list heads) | ✅ | ⬜ pending |
| 13-02-01 | 02 | 2 | DELG-01/02 | grep | `grep "BRIEF-PASSTHROUGH" agents/cmo/HEARTBEAT.md agents/cto/HEARTBEAT.md` | ✅ | ⬜ pending |
| 13-02-02 | 02 | 2 | DELG-03 | grep | `grep "review and override" agents/cmo/HEARTBEAT.md agents/cto/HEARTBEAT.md` | ✅ | ⬜ pending |
| 13-02-03 | 02 | 2 | DELG-05 | grep | `grep "3 hops\|three hops\|max.*hop" agents/cmo/HEARTBEAT.md agents/cto/HEARTBEAT.md` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

None — no test framework needed. All phase verification is grep-based against markdown files that already exist.

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| CEO does not route directly to individual contributors | DELG-04 | Intent check — grep can confirm table structure but not semantic correctness | Read CEO HEARTBEAT.md routing table: confirm only CMO, CTO, Product Owner appear as assignees |
| Brief passthrough format is coherent | DELG-05 | Readability check | Read CMO/CTO HEARTBEAT.md delegation step: confirm `[BRIEF-PASSTHROUGH]` instruction is clear and complete |
| Product Owner reporting line is correct | DELG-02 | Design decision (keep CEO or move to CTO) | Read product-owner/AGENTS.md: confirm "You report to the CEO" with note that CTO may assign tasks directly |

---

## Validation Sign-Off

- [ ] All tasks have grep verify or are marked manual-only
- [ ] Sampling continuity: checks run after every file edit
- [ ] Wave 0 not needed (no new test infrastructure required)
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
