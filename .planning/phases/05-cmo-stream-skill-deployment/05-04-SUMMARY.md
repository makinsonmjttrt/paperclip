---
phase: 05-cmo-stream-skill-deployment
plan: 04
subsystem: skills
tags: [paperclip, skill-bundles, ux-researcher, linkedin-growth-director, cro, seo, growth, paid-ads]

requires:
  - phase: 01-project-setup
    provides: skill ownership matrix, bundle assignments, interactive pattern list
  - phase: 04-cmo-agent
    provides: CMO agent configured to reference UX Researcher skills

provides:
  - 6 new UX Researcher skill files deployed to Paperclip (4 bundles + 2 standalone)
  - 7 LinkedIn Growth Director skill files staged locally for Phase 8.5 deployment
  - UX Researcher AGENTS.md updated with 6 new Read and follow references

affects: [08-linkedin-growth-director-agent, 09-remaining-skills]

tech-stack:
  added: []
  patterns: [skill-bundle-template, standalone-skill-template, interactive-pattern-removal]

key-files:
  created:
    - "~/.paperclip/.../agents/ux-researcher/skills/cro-suite.md"
    - "~/.paperclip/.../agents/ux-researcher/skills/seo-suite.md"
    - "~/.paperclip/.../agents/ux-researcher/skills/growth-suite.md"
    - "~/.paperclip/.../agents/ux-researcher/skills/paid-suite.md"
    - "~/.paperclip/.../agents/ux-researcher/skills/homepage-audit.md"
    - "~/.paperclip/.../agents/ux-researcher/skills/churn-prevention.md"
    - ".planning/phases/05-.../staged-skills/linkedin-growth-director/linkedin-post-writer.md"
    - ".planning/phases/05-.../staged-skills/linkedin-growth-director/linkedin-content-strategy.md"
    - ".planning/phases/05-.../staged-skills/linkedin-growth-director/linkedin-authority-builder.md"
    - ".planning/phases/05-.../staged-skills/linkedin-growth-director/linkedin-profile-optimizer.md"
    - ".planning/phases/05-.../staged-skills/linkedin-growth-director/cold-outreach-sequence.md"
    - ".planning/phases/05-.../staged-skills/linkedin-growth-director/meeting-prep.md"
    - ".planning/phases/05-.../staged-skills/linkedin-growth-director/cold-email.md"
  modified:
    - "~/.paperclip/.../agents/ux-researcher/AGENTS.md"

key-decisions:
  - "CRO bundle condensed 1,871 source lines to 280 lines by extracting shared methodology to Shared Rules section"
  - "All bundles well under 800-line target (largest: CRO at 280 lines) through aggressive condensation of repeated patterns"
  - "LinkedIn skills staged locally at .planning/phases/05-.../staged-skills/ since LinkedIn Growth Director agent does not exist in Paperclip yet"

patterns-established:
  - "Bundle condensation: extract common methodology to Shared Rules, keep unique evaluation criteria per skill"
  - "Standalone skill template: identity > Input > Process > Output > Handover > Rules"
  - "Reference file inlining: key data from supplementary files (expert-analysis.md, question-banks.md, frameworks.md) inlined directly into converted skills"

requirements-completed: [ADPT-04, ADPT-07, ADPT-08]

duration: 14min
completed: 2026-04-02
---

# Phase 5 Plan 4: UX Researcher + LinkedIn Growth Director Skills Summary

**6 UX Researcher skills deployed to Paperclip (4 bundles covering 16 source skills + 2 standalone) and 7 LinkedIn Growth Director skills staged locally for Phase 8.5**

## Performance

- **Duration:** 14 min
- **Started:** 2026-04-02T21:30:54Z
- **Completed:** 2026-04-02T21:45:18Z
- **Tasks:** 2
- **Files modified:** 14 (13 created, 1 modified)

## Accomplishments

- Deployed 6 skill files to UX Researcher agent in Paperclip (4 bundles: CRO Suite bundling 6 skills, SEO Suite bundling 5, Growth Suite bundling 3, Paid Suite bundling 2; plus 2 standalone: Homepage Audit, Churn Prevention)
- UX Researcher now has 9 total skill files (3 existing + 6 new) with all 6 referenced in AGENTS.md
- Staged 7 LinkedIn Growth Director skill files locally with supplementary content inlined (expert analysis data, question banks, email frameworks, benchmarks, personalisation systems)
- Zero interactive patterns across all 13 new files, all using workspace/ paths and UK English

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert UX Researcher skills and update AGENTS.md** - Paperclip files outside git repo (deployed directly to ~/.paperclip/), no in-repo commit needed
2. **Task 2: Stage 7 LinkedIn Growth Director skill files locally** - `b4d1267` (feat)

## Files Created/Modified

**UX Researcher (deployed to Paperclip):**
- `~/.paperclip/.../ux-researcher/skills/cro-suite.md` - Bundle of 6 CRO skills (280 lines)
- `~/.paperclip/.../ux-researcher/skills/seo-suite.md` - Bundle of 5 SEO skills (238 lines)
- `~/.paperclip/.../ux-researcher/skills/growth-suite.md` - Bundle of 3 growth skills (162 lines)
- `~/.paperclip/.../ux-researcher/skills/paid-suite.md` - Bundle of 2 paid/experiment skills (146 lines)
- `~/.paperclip/.../ux-researcher/skills/homepage-audit.md` - Standalone conversion audit skill
- `~/.paperclip/.../ux-researcher/skills/churn-prevention.md` - Standalone retention skill
- `~/.paperclip/.../ux-researcher/AGENTS.md` - Added 6 Read and follow references

**LinkedIn Growth Director (staged locally):**
- `.planning/phases/05-.../staged-skills/linkedin-growth-director/linkedin-post-writer.md` - With expert-analysis.md inlined
- `.planning/phases/05-.../staged-skills/linkedin-growth-director/linkedin-content-strategy.md` - Strategy and engagement hierarchy
- `.planning/phases/05-.../staged-skills/linkedin-growth-director/linkedin-authority-builder.md` - Authority system design
- `.planning/phases/05-.../staged-skills/linkedin-growth-director/linkedin-profile-optimizer.md` - Profile audit with AI visibility checklist
- `.planning/phases/05-.../staged-skills/linkedin-growth-director/cold-outreach-sequence.md` - Multi-touch outreach system
- `.planning/phases/05-.../staged-skills/linkedin-growth-director/meeting-prep.md` - With question banks and agenda templates inlined
- `.planning/phases/05-.../staged-skills/linkedin-growth-director/cold-email.md` - With frameworks, benchmarks, personalisation system inlined

## Decisions Made

- **CRO bundle condensation strategy:** Extracted shared CRO methodology (heuristic evaluation, before/after comparison, metrics tracking) to a Shared Rules section rather than repeating in each sub-skill. This brought 1,871 source lines down to 280 while preserving unique evaluation criteria per CRO type.
- **Paperclip files outside git:** UX Researcher skill files deployed directly to the Paperclip directory which is outside this git repository. This is by design; the Paperclip directory is a runtime agent environment, not version-controlled source.
- **Supplementary file inlining:** Key reference data from expert-analysis.md, question-banks.md, meeting-types.md, brief-template.md, frameworks.md, benchmarks.md, personalization.md, subject-lines.md, and follow-up-sequences.md was inlined directly into converted skills rather than referenced externally, since Paperclip agents cannot access the source ~/.claude/skills/ directory.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed false positive interactive pattern in cro-suite.md**
- **Found during:** Task 1 verification
- **Issue:** The text "Value before ask:" matched the interactive pattern regex `ask:` despite not being an interactive prompt
- **Fix:** Changed to "Value before request:" to avoid false positive
- **Files modified:** cro-suite.md
- **Verification:** Interactive pattern grep returns 0 on all files

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Trivial wording adjustment. No scope creep.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- UX Researcher is fully equipped with 9 skill files (3 existing + 6 new)
- 7 LinkedIn Growth Director skills are staged and ready for deployment when the agent is created in Phase 8.5
- Phase 5 (CMO stream skill deployment) is complete with all plans executed

## Self-Check: PASSED

- All 13 new files exist at expected locations
- Commit b4d1267 verified in git log
- SUMMARY.md exists at expected path
- All claims in summary verified against actual state

---
*Phase: 05-cmo-stream-skill-deployment*
*Completed: 2026-04-02*
