# Phase 5: CMO Stream Skill Deployment - Research

**Researched:** 2026-04-02
**Domain:** Skill file conversion and deployment to Paperclip agents
**Confidence:** HIGH

## Summary

Phase 5 is the largest phase in the project: converting 56 source skill files (out of 71 total project skills) from Claude Code format to Paperclip agent format, then deploying them to 5 CMO stream agents. The conversion template, checklist, and ownership matrix are all complete from Phases 1-2. This phase is pure execution -- no design decisions remain.

The work breaks naturally into 3 plans (already defined in the roadmap): CMO-owned strategy skills, cross-cutting quality gate skills, and remaining business stream skills across Technical Writer, Customer Success, UX Researcher, and LinkedIn Growth Director. Each plan produces skill files in the Paperclip `skills/` directory and updates the owning agent's AGENTS.md.

**Primary recommendation:** Execute each plan as a batch of conversions following the skill-adaptation-template.md and skill-conversion-checklist.md verbatim. The critical risk is over-adapting (rewriting skill logic instead of just changing input/output/coordination). Run the word count comparison after each conversion.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ADPT-04 | Adapt and deploy CMO stream skills (30+ files) | All 56 source SKILL.md files located at `~/.claude/skills/{name}/SKILL.md`. Target paths at `~/.paperclip/instances/default/companies/FourPointZero/agents/{agent-slug}/skills/{filename}.md`. Conversion template and checklist ready from Phase 2. |
| ADPT-06 | Adapt and deploy cross-cutting skills (humanizer, contentfpz router) | Humanizer (474 lines), de-ai-ify (314 lines), copy-editing (447 lines) bundle as quality-gate.md on Technical Writer. Contentfpz router is EXCLUDED (not a deployable skill per ownership matrix). |
| ADPT-07 | Adapt and deploy skills unique to contentfpz (21 skills) | All 21 contentfpz-only skills have source files at `~/.claude/skills/{name}/SKILL.md`. No missing source files in this category. |
| ADPT-08 | Adapt and deploy skills unique to CLAUDE.md (28 skills) | 18 of 28 CLAUDE.md-only skills have source files. 10 skills (6 blog-engine + 4 anthropic-skills) exist ONLY as routing references with NO source SKILL.md file. See "Missing Source Files" section. |
</phase_requirements>

## Source File Locations

### Where source skills live

All 56 CMO-stream skills that have source files are at:
```
~/.claude/skills/{skill-name}/SKILL.md
```

### Skills with supplementary files

Some skills have reference data, templates, or playbooks alongside SKILL.md. These contain operational knowledge that MUST be incorporated into the converted skill (not linked, since Paperclip skills are single files).

| Skill | Extra Files | Action |
|-------|------------|--------|
| newsletter-creation-curation | PLAYBOOK.md, examples/, templates/ | Inline key content from PLAYBOOK.md into the converted skill. Templates should be embedded. |
| humanizer | WARP.md | Inline any additional patterns into the converted skill. |
| de-ai-ify | SKILL-OC.md | Check for additional content beyond SKILL.md. |
| cold-email | 5 reference files | Inline key templates/frameworks. |
| email-sequence | 3 reference files | Inline templates. |
| social-content | 3 reference files | Inline platform-specific guides. |
| meeting-prep | 3 reference files | Inline frameworks. |
| copywriting | 2 reference files | Inline copy frameworks. |
| ad-creative | 2 reference files | Inline creative templates. |
| pricing-strategy | 2 reference files | Inline pricing frameworks. |
| linkedin-post-writer | 1 reference file (expert-analysis.md) | Inline key engagement data. |
| marketing-ideas | 1 reference file | Inline idea library. |
| content-strategy | 1 reference file | Inline planning framework. |
| copy-editing | 1 reference file | Inline editing checklist. |

**Rule:** Paperclip skill files are standalone .md files. There is no `references/` directory mechanism. All supplementary content must be inlined into the skill file itself, preserving data tables and frameworks verbatim per the adaptation template's "What NOT to Change" section.

### Missing Source Files (CRITICAL)

10 skills exist only as one-line routing references in the CLAUDE.md Skill Routing section. They have NO `~/.claude/skills/{name}/SKILL.md` source file:

| Skill | Agent | Bundle | What Exists |
|-------|-------|--------|-------------|
| claude-blog:blog-write | Technical Writer | blog-engine | One-line description: "new articles for Google + AI citations" |
| claude-blog:blog-rewrite | Technical Writer | blog-engine | One-line description: "optimise existing posts" |
| claude-blog:blog-analyse | Technical Writer | blog-engine | One-line description: "100-point quality audit" |
| claude-blog:blog-seo-check | Technical Writer | blog-engine | One-line description: "post-writing SEO validation" |
| claude-blog:blog-strategy | Technical Writer | blog-engine | One-line description: "topic cluster architecture" |
| claude-blog:blog-repurpose | Technical Writer | blog-engine | One-line description: "repurpose for social, email, YouTube" |
| anthropic-skills:content-creator | Technical Writer | standalone | One-line description: "blog posts, social, SEO content" |
| anthropic-skills:newsletter-content-creator | Technical Writer | newsletter-suite | One-line description: "FPZ weekly newsletter" |
| anthropic-skills:newsletter-writing-skill | Technical Writer | newsletter-suite | One-line description: "newsletter writing" |
| anthropic-skills:marketing-strategy-pmm | CMO | standalone | One-line description: "positioning, messaging, GTM" |

**Impact:** All 10 missing skills are assigned to Technical Writer (9) or CMO (1). They affect 3 files: blog-engine.md bundle (6 skills), newsletter-suite.md bundle (2 of 3 skills), content-creator.md standalone, and marketing-strategy-pmm.md standalone.

**Recommended approach:** These skills must be authored from scratch using:
1. The one-line description from the CLAUDE.md routing table
2. Domain knowledge from related existing skills (e.g., blog-write can draw from copywriting + seo-audit patterns)
3. The adaptation template structure
4. The FPZ product-marketing-context for voice and audience

This is a content authoring task, not a conversion task. Flag it clearly in the plan.

## Target Deployment Paths

### Paperclip directory structure
```
~/.paperclip/instances/default/companies/FourPointZero/agents/
  cmo/skills/                    # 7 new files (6 standalone + 1 bundle)
  technical-writer/skills/       # 10 new files (7 standalone + 3 bundles) -- dir needs creating
  customer-success/skills/       # 7 new files (5 standalone + 2 bundles)
  ux-researcher/skills/          # 6 new files (2 standalone + 4 bundles)
  linkedin-growth-director/      # Agent does NOT exist yet. Created in Phase 8.5.
```

**LinkedIn Growth Director blocker:** This agent does not exist in Paperclip. Phase 5 can prepare the 7 skill files but cannot deploy them until Phase 8.5 creates the agent. Store prepared files in a staging area (e.g., `.planning/phases/05-cmo-stream-skill-deployment/staged-skills/linkedin-growth-director/`).

**Technical Writer skills/ directory:** Does not exist yet. Must be created before deploying skills.

### AGENTS.md updates required

Each agent's AGENTS.md needs skill reference lines added below the `<!-- Skills are appended here -->` comment. CMO's AGENTS.md already has all 10 references added in Phase 4.

| Agent | Current Skill Refs | New Skill Refs Needed | Already Done? |
|-------|-------------------|----------------------|---------------|
| CMO | 10 (3 existing + 7 new) | 0 | Yes (Phase 4) |
| Technical Writer | 0 | 10 | No |
| Customer Success | 0 | 7 | No |
| UX Researcher | 0 | 6 | No |
| LinkedIn Growth Director | N/A | 7 | No (agent doesn't exist) |

## Conversion Work Breakdown

### Plan 05-01: CMO-owned marketing strategy skills (7 files)

| # | Source Skill | Target File | Type | Source Lines |
|---|-------------|-------------|------|-------------|
| 1 | marketing-ideas + marketing-psychology + marketing-principles + positioning-basics + content-idea-generator | strategy-core.md | Bundle (5 skills) | 1,212 total |
| 2 | launch-strategy | launch-strategy.md | Standalone | 353 |
| 3 | pricing-strategy | pricing-strategy.md | Standalone | 231 |
| 4 | content-strategy | content-strategy.md | Standalone | 365 |
| 5 | product-marketing-context | product-marketing-context.md | Standalone | 241 |
| 6 | anthropic-skills:marketing-strategy-pmm | marketing-strategy-pmm.md | Standalone | NO SOURCE -- author from scratch |
| 7 | voice-extractor | voice-extractor.md | Standalone | 241 |

**Note:** CMO AGENTS.md already references all 7 files from Phase 4. Only the skill files themselves need creating.

### Plan 05-02: Cross-cutting skills (1 file -- quality-gate bundle)

| # | Source Skill | Target File | Type | Source Lines |
|---|-------------|-------------|------|-------------|
| 1 | humanizer + de-ai-ify + copy-editing | quality-gate.md | Bundle (3 skills) | 1,235 total |

**Note:** This is deployed to Technical Writer. The contentfpz router is EXCLUDED per the ownership matrix (issue assignment replaces routing in Paperclip).

### Plan 05-03: Remaining business stream skills

**Technical Writer (9 more files):**

| # | Source Skill | Target File | Type | Source Lines |
|---|-------------|-------------|------|-------------|
| 1 | copywriting | copywriting.md | Standalone | 252 |
| 2 | email-sequence | email-sequence.md | Standalone | 311 |
| 3 | social-content | social-content.md | Standalone | 278 |
| 4 | ad-creative | ad-creative.md | Standalone | 362 |
| 5 | anthropic-skills:content-creator | content-creator.md | Standalone | NO SOURCE |
| 6 | social-card-gen | social-card-gen.md | Standalone | 207 |
| 7 | tweet-draft-reviewer | tweet-draft-reviewer.md | Standalone | 238 |
| 8 | 6 blog skills | blog-engine.md | Bundle (6 skills) | NO SOURCE for all 6 |
| 9 | 3 newsletter skills | newsletter-suite.md | Bundle (3 skills) | 229 lines for 1 of 3; other 2 NO SOURCE |

**Customer Success (7 files):**

| # | Source Skill | Target File | Type | Source Lines |
|---|-------------|-------------|------|-------------|
| 1 | competitor-alternatives | competitor-alternatives.md | Standalone | 256 |
| 2 | customer-research | customer-research.md | Standalone | 269 |
| 3 | testimonial-collector | testimonial-collector.md | Standalone | 213 |
| 4 | ai-discoverability-audit | ai-discoverability-audit.md | Standalone | 269 |
| 5 | case-study-builder | case-study-builder.md | Standalone | 226 |
| 6 | reddit-insights + youtube-summarizer + last30days + daily-briefing-builder | research-suite.md | Bundle (4 skills) | 1,395 total |
| 7 | revops + sales-enablement | sales-suite.md | Bundle (2 skills) | 704 total |

**UX Researcher (6 files):**

| # | Source Skill | Target File | Type | Source Lines |
|---|-------------|-------------|------|-------------|
| 1 | 6 CRO skills | cro-suite.md | Bundle (6 skills) | 1,871 total |
| 2 | 5 SEO skills | seo-suite.md | Bundle (5 skills) | 1,584 total |
| 3 | free-tool-strategy + lead-magnets + referral-program | growth-suite.md | Bundle (3 skills) | 746 total |
| 4 | paid-ads + ab-test-setup | paid-suite.md | Bundle (2 skills) | 581 total |
| 5 | homepage-audit | homepage-audit.md | Standalone | 235 |
| 6 | churn-prevention | churn-prevention.md | Standalone | 424 |

**LinkedIn Growth Director (7 files -- STAGED, not deployed):**

| # | Source Skill | Target File | Type | Source Lines |
|---|-------------|-------------|------|-------------|
| 1 | linkedin-post-writer | linkedin-post-writer.md | Standalone | 369 |
| 2 | linkedin-content-strategy | linkedin-content-strategy.md | Standalone | 180 |
| 3 | linkedin-authority-builder | linkedin-authority-builder.md | Standalone | 233 |
| 4 | linkedin-profile-optimizer | linkedin-profile-optimizer.md | Standalone | 332 |
| 5 | cold-outreach-sequence | cold-outreach-sequence.md | Standalone | 241 |
| 6 | meeting-prep | meeting-prep.md | Standalone | 152 |
| 7 | cold-email | cold-email.md | Standalone | 158 |

## Architecture Patterns

### Conversion Pattern (from Phase 2 template)

**Input transformation:** Replace all interactive patterns (user prompts, clarifying questions, confirmation requests) with issue-driven input reading. The adaptation template documents 13 specific pattern replacements.

**Output transformation:** Replace chat responses and `the-vault/` paths with `workspace/` file saves and issue comments.

**Coordination transformation:** Add `## Handover` section with @-mention targets. Content-producing skills hand off to Technical Writer for humaniser pass.

**Preserve everything else:** Core logic, frameworks, data tables, examples, checklists, voice guidelines, formatting rules.

### Bundle Pattern

Bundles combine related skills into a single file under 1 heading per skill. The bundle uses issue labels to determine which skill to apply.

**Structure:**
```markdown
# Skill Bundle: {Name}
This bundle contains {N} related skills. Use the one matching the issue label or description.

## Skills
### {Skill 1}
{Condensed skill content}
### {Skill 2}
{Condensed skill content}

## Shared Rules
## Input
## Output
## Handover
```

**Bundle sizing concern:** The largest bundles are:
- cro-suite (6 skills, 1,871 source lines) -- will produce a large file
- seo-suite (5 skills, 1,584 source lines)
- research-suite (4 skills, 1,395 source lines)
- strategy-core (5 skills, 1,212 source lines)
- quality-gate (3 skills, 1,235 source lines)

Bundle content must be condensed compared to standalone skills (common rules extracted to Shared Rules, redundant examples reduced). The adaptation template says to preserve core logic but bundles inherently require tighter writing. Target: keep each bundle under 800 lines.

## Common Pitfalls

### Pitfall 1: Over-adaptation (rewriting core logic)
**What goes wrong:** Converter rewrites the skill's expert knowledge, frameworks, and data tables instead of just changing input/output/coordination patterns.
**How to avoid:** Run `wc -w` comparison after each conversion. Adapted standalone skill should be within 30% of source word count. Bundle skills will be shorter per-skill but the bundle total should be proportional.
**Warning signs:** Converted file is less than 50% of source word count. Generic summaries replace specific frameworks.

### Pitfall 2: Missed interactive patterns
**What goes wrong:** Patterns like "ask the user" or "confirm with the user" survive conversion. Agent stalls or hallucinates responses.
**How to avoid:** Run the grep verification command from the conversion checklist after EVERY file.
**Verification:** `grep -icE "(ask the user|ask:|clarifying question|if unsure.*(ask|question)|present (to the user|the draft)|would you like|AskUserQuestion|confirm.*(with|from) the user|the-vault|read it out loud|read back to the user)" {file}` must return 0.

### Pitfall 3: Forgetting supplementary files
**What goes wrong:** Converter reads only SKILL.md and misses PLAYBOOK.md, WARP.md, references/, templates/, examples/. Critical operational knowledge is lost.
**How to avoid:** Check the supplementary files table above. For each skill, `ls ~/.claude/skills/{name}/` before converting.

### Pitfall 4: Missing humaniser handover on content skills
**What goes wrong:** Content-producing skills don't include `@-mention Technical Writer for humaniser quality gate pass` in their Handover section.
**How to avoid:** Every content-producing skill (not research/audit skills) must have the humaniser handover. Grep for "Technical Writer" in the Handover section of content skills.

### Pitfall 5: Creating files for LinkedIn Growth Director in Paperclip
**What goes wrong:** Executor tries to deploy LinkedIn Growth Director skills to a Paperclip agent that doesn't exist yet.
**How to avoid:** Stage LinkedIn Growth Director files locally. Deploy only after Phase 8.5 creates the agent.

### Pitfall 6: Blog-engine and newsletter-suite skills authored from scratch
**What goes wrong:** Authoring these from one-line descriptions produces thin, generic skills that add no value over the agent's base capabilities.
**How to avoid:** Cross-reference with related existing skills. Blog-write should incorporate patterns from copywriting + seo-audit. Blog-analyse should reference the blog-seo-check and seo-audit frameworks. Newsletter skills should draw from newsletter-creation-curation (which does have a full source file).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Skill conversion structure | Ad-hoc markdown files | skill-adaptation-template.md skeleton | Consistency across 38 files |
| Interactive pattern removal | Manual find-and-replace | grep verification command from checklist | Catches patterns humans miss |
| Skill-to-agent mapping | Memory/guesswork | skill-ownership-matrix.md lookup | Single source of truth, already validated |
| Bundle membership | Deciding which skills bundle | Bundle column in ownership matrix | Already optimised for 10-file cap |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Bash grep verification (from skill-conversion-checklist.md) |
| Config file | .planning/skill-conversion-checklist.md |
| Quick run command | `grep -icE "(ask the user|ask:|clarifying question|the-vault)" {file}` |
| Full suite command | Run all 6 post-conversion verification steps from checklist per file |

### Phase Requirements to Test Map
| Req ID | Behaviour | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ADPT-04 | All CMO stream skills converted | smoke | `ls ~/.paperclip/.../agents/{agent}/skills/ \| wc -l` per agent | Wave 0 |
| ADPT-06 | Cross-cutting skills deployed | unit | `grep -c "## Input" quality-gate.md && grep -c "## Handover" quality-gate.md` | Wave 0 |
| ADPT-07 | contentfpz-only skills deployed | smoke | Count contentfpz-only skills in target dirs | Wave 0 |
| ADPT-08 | CLAUDE.md-only skills deployed | smoke | Count CLAUDE.md-only skills in target dirs | Wave 0 |

### Sampling Rate
- **Per task commit:** Run interactive pattern grep on every converted file
- **Per wave merge:** Run full 6-step verification on all files in the wave
- **Phase gate:** All 38 skill files pass all 6 verification steps

### Wave 0 Gaps
- [ ] `technical-writer/skills/` directory -- needs creating
- [ ] LinkedIn Growth Director staging directory -- needs creating
- [ ] No gaps in test infrastructure -- verification commands are inline bash

## Execution Order Recommendation

**Plan 05-01 first** (CMO strategy skills): Smallest batch (7 files), CMO AGENTS.md already has references. Quick win, establishes conversion rhythm.

**Plan 05-02 second** (cross-cutting quality-gate): Only 1 file (quality-gate.md bundle). Most important for downstream phases (Technical Writer needs this for Phase 7). The 3 source skills are the longest and most complex (humaniser alone is 474 lines with a WARP.md supplement).

**Plan 05-03 last** (remaining business stream skills): Largest batch (29 files across 4 agents). Benefits from the conversion experience built in Plans 01 and 02. Includes the 10 skills that must be authored from scratch (blog-engine, newsletter-suite partial, content-creator, marketing-strategy-pmm).

## File Count Summary

| Agent | Standalone Files | Bundle Files | Total New Files | AGENTS.md Update Needed |
|-------|-----------------|-------------|----------------|------------------------|
| CMO | 6 | 1 (strategy-core) | 7 | No (done in Phase 4) |
| Technical Writer | 7 | 3 (blog-engine, newsletter-suite, quality-gate) | 10 | Yes |
| Customer Success | 5 | 2 (research-suite, sales-suite) | 7 | Yes |
| UX Researcher | 2 | 4 (cro-suite, seo-suite, growth-suite, paid-suite) | 6 | Yes |
| LinkedIn Growth Director | 7 | 0 | 7 (staged) | Deferred to Phase 8.5 |
| **Total** | **27** | **10** | **37** | |

**Note:** The total is 37 new files, not 38. The ownership matrix says 38, but the contentfpz router is excluded (not a deployable skill), bringing the deployable count to 37. The 37 files cover all 56 skills from the matrix (bundles collapse multiple skills into single files).

## Sources

### Primary (HIGH confidence)
- `.planning/skill-ownership-matrix.md` -- agent assignments, bundle membership, file counts
- `.planning/skill-adaptation-template.md` -- conversion template, naming conventions, interactive replacements
- `.planning/skill-conversion-checklist.md` -- 42-item checklist, verification commands
- `.planning/skill-inventory.md` -- complete skill list, source reconciliation
- `~/.claude/skills/` filesystem -- 151 skill directories, verified source file existence for all 56 CMO stream skills

### Secondary (MEDIUM confidence)
- One-line descriptions for 10 missing skills from project CLAUDE.md Skill Routing section
- Supplementary file inventory (PLAYBOOK.md, references/, etc.) from filesystem listing

## Metadata

**Confidence breakdown:**
- Source file locations: HIGH -- filesystem verified
- Conversion pattern: HIGH -- template and checklist complete from Phase 2
- Missing skills identification: HIGH -- filesystem verified, 10 skills confirmed absent
- Bundle sizing estimates: MEDIUM -- based on source line counts, actual condensed size TBD
- LinkedIn Growth Director staging: HIGH -- agent confirmed non-existent in Paperclip

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (stable -- no external dependencies)
