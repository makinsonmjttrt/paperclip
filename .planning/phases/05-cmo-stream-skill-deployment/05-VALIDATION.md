---
phase: 5
slug: cmo-stream-skill-deployment
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-02
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual file verification (no runtime tests — this phase produces markdown skill files, not code) |
| **Config file** | none |
| **Quick run command** | `ls -la ~/.paperclip/instances/default/companies/FourPointZero/agents/*/skills/*.md 2>/dev/null \| wc -l` |
| **Full suite command** | `bash -c 'for f in ~/.paperclip/instances/default/companies/FourPointZero/agents/*/skills/*.md; do echo "--- $f ---"; head -5 "$f"; done'` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run quick command (verify file count increased)
- **After every plan wave:** Run full suite (verify all skill files have correct headers)
- **Before `/gsd:verify-work`:** Full suite must show all expected files present
- **Max feedback latency:** 2 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | ADPT-04 | file check | `ls ~/.paperclip/.../CMO/skills/*.md \| wc -l` | ❌ W0 | ⬜ pending |
| 05-02-01 | 02 | 1 | ADPT-06 | file check + grep | `grep -rL "AskUser\|prompt_user\|interactive" ~/.paperclip/.../*/skills/*.md` | ❌ W0 | ⬜ pending |
| 05-03-01 | 03 | 2 | ADPT-07, ADPT-08 | file check | `ls ~/.paperclip/.../*/skills/*.md \| wc -l` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test framework needed — validation is file existence and content grep.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Skill content quality | ADPT-04 | Content accuracy requires human review | Spot-check 3 random skills for completeness and tone |
| Bundle coherence | ADPT-07 | Bundled skills must read as unified document | Read 1 bundle file, verify sections flow logically |
| No interactive prompts | ADPT-06 | Edge cases in prompt removal | grep for AskUser, prompt, interactive across all deployed files |

---

## Validation Sign-Off

- [x] All tasks have automated verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 2s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
