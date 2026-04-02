# Phase 1: Skill Ownership Matrix - Research

**Researched:** 2026-04-02
**Domain:** Skill-to-agent mapping for Paperclip AI agent company
**Confidence:** HIGH

## Summary

Phase 1 is a categorisation and assignment exercise, not a coding task. The deliverable is a single markdown table mapping every skill to exactly one of 10 agents, with no agent exceeding 10 skills. Two skill sources must be reconciled: CLAUDE.md (the project instruction file listing ~50 skills) and contentfpz SKILL.md (the interactive router listing ~43 skills). After deduplication, the total is approximately 71 unique skills. The exact count will be confirmed during the audit step.

The hardest constraint is the 10-skill cap per agent. The CMO stream (marketing, content, growth, SEO) has 50+ skills that must be distributed across CMO, Technical Writer, Customer Success, UX Researcher, and the LinkedIn Growth Director. Strategy skills go to CMO. Execution/production skills go to Technical Writer. Growth/conversion skills go to UX Researcher. Competitive intelligence goes to Customer Success. LinkedIn skills go to LinkedIn Growth Director.

**Primary recommendation:** Build the inventory first (plan 01-01), then assign and validate constraints (plan 01-02). Do not attempt both in one pass.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SOWN-01 | Create skill ownership matrix mapping all 71 skills to exactly one primary agent | Full inventory below; assignment table is the deliverable |
| SOWN-02 | Identify cross-cutting skills and define primary vs secondary ownership rules | Cross-cutting skills section below identifies humanizer, contentfpz router, product-marketing-context |
| SOWN-03 | Cap each agent at 10 or fewer skill files | Distribution strategy section below shows how to stay within cap |
| SOWN-04 | Validate zero unmapped skills remain (71 total) | Complete inventory section provides the checklist |
| SOWN-05 | Map 6 CRO skills | Assigned to UX Researcher (see distribution) |
| SOWN-06 | Map 6 blog engine skills | Assigned to Technical Writer (see distribution) |
| SOWN-07 | Map 6 SEO/discovery skills | Split: 4 to UX Researcher, 2 to Customer Success (see distribution) |
| SOWN-08 | Map 5 growth engineering skills | Assigned to UX Researcher (see distribution) |
| SOWN-09 | Map 5 document creation skills | Assigned to Product Owner or Software Engineer (see open questions) |
| SOWN-10 | Map 3 newsletter skills | Assigned to Technical Writer (see distribution) |
| SOWN-11 | Map 3 anthropic-skills | Split across CMO and Technical Writer (see distribution) |
| SOWN-12 | Map retention skill and product-marketing-context | churn-prevention to UX Researcher; product-marketing-context to CMO |
| SOWN-13 | Assign 6 blog engine skills to Technical Writer | Confirmed in distribution |
| SOWN-14 | Assign LinkedIn skills to LinkedIn Growth Director | 4 LinkedIn + 2 outreach skills (see distribution) |
| SOWN-15 | Assign strategy skills to CMO | 7-10 strategy skills identified (see distribution) |
| SOWN-16 | Assign content production skills to Technical Writer | 7-10 production skills identified (see distribution) |
| SOWN-17 | Assign sales skills (cold-email, revops, sales-enablement) | Recommendation: Customer Success (see open questions) |
| SOWN-18 | Assign research skills (daily-briefing-builder, homepage-audit) | Recommendation: Customer Success for briefing, UX Researcher for homepage-audit |
| SOWN-19 | Assign anthropic-skills to primary agents | content-creator to Technical Writer, marketing-strategy-pmm to CMO, newsletter skills to Technical Writer |
</phase_requirements>

## Complete Skill Inventory

This is the definitive list. Skills are grouped by source.

### Skills in BOTH CLAUDE.md and contentfpz SKILL.md (shared, ~33 skills)

| # | Skill | CLAUDE.md Category | contentfpz Category |
|---|-------|--------------------|---------------------|
| 1 | page-cro | Conversion | Improving |
| 2 | signup-flow-cro | Conversion | (referenced in CLAUDE.md) |
| 3 | onboarding-cro | Conversion | (referenced in CLAUDE.md) |
| 4 | form-cro | Conversion | (referenced in CLAUDE.md) |
| 5 | popup-cro | Conversion | (referenced in CLAUDE.md) |
| 6 | paywall-upgrade-cro | Conversion | (referenced in CLAUDE.md) |
| 7 | linkedin-post-writer | Content & copy | LinkedIn |
| 8 | linkedin-content-strategy | Content & copy | LinkedIn |
| 9 | copywriting | Content & copy | Creating |
| 10 | copy-editing | Content & copy | Improving |
| 11 | cold-email | Content & copy | Creating |
| 12 | email-sequence | Content & copy | Creating |
| 13 | social-content | Content & copy | Creating |
| 14 | ad-creative | Content & copy | Creating |
| 15 | seo-audit | SEO & discovery | Improving |
| 16 | ai-seo | SEO & discovery | Improving |
| 17 | programmatic-seo | SEO & discovery | (in CLAUDE.md) |
| 18 | site-architecture | SEO & discovery | (in CLAUDE.md) |
| 19 | competitor-alternatives | SEO & discovery | (in CLAUDE.md) |
| 20 | schema-markup | SEO & discovery | (in CLAUDE.md) |
| 21 | paid-ads | Paid & distribution | (in CLAUDE.md) |
| 22 | ab-test-setup | Paid & distribution | (in CLAUDE.md) |
| 23 | churn-prevention | Retention | (in CLAUDE.md) |
| 24 | free-tool-strategy | Growth | (in CLAUDE.md) |
| 25 | lead-magnets | Growth | (in CLAUDE.md) |
| 26 | referral-program | Growth | (in CLAUDE.md) |
| 27 | marketing-ideas | Strategy | Thinking |
| 28 | marketing-psychology | Strategy | Thinking |
| 29 | launch-strategy | Strategy | (in CLAUDE.md) |
| 30 | pricing-strategy | Strategy | Thinking |
| 31 | content-strategy | Strategy | Thinking |
| 32 | customer-research | Strategy | Thinking |
| 33 | revops | Sales & RevOps | (in CLAUDE.md) |
| 34 | sales-enablement | Sales & RevOps | Creating |

### Skills ONLY in CLAUDE.md (~16 skills)

| # | Skill | Category |
|---|-------|----------|
| 35 | anthropic-skills:content-creator | Content & copy |
| 36 | anthropic-skills:newsletter-content-creator | Content & copy |
| 37 | anthropic-skills:newsletter-writing-skill | Content & copy |
| 38 | anthropic-skills:marketing-strategy-pmm | Strategy |
| 39 | product-marketing-context | Strategy |
| 40 | claude-blog:blog-write | Blog engine |
| 41 | claude-blog:blog-rewrite | Blog engine |
| 42 | claude-blog:blog-analyse | Blog engine |
| 43 | claude-blog:blog-seo-check | Blog engine |
| 44 | claude-blog:blog-strategy | Blog engine |
| 45 | claude-blog:blog-repurpose | Blog engine |
| 46 | pdf | Documents |
| 47 | docx | Documents |
| 48 | xlsx | Documents |
| 49 | pptx | Documents |
| 50 | frontend-slides | Documents |

### Skills ONLY in contentfpz SKILL.md (~21 skills)

| # | Skill | Category |
|---|-------|----------|
| 51 | linkedin-authority-builder | LinkedIn |
| 52 | linkedin-profile-optimizer | LinkedIn |
| 53 | cold-outreach-sequence | Creating |
| 54 | case-study-builder | Creating |
| 55 | social-card-gen | Creating |
| 56 | testimonial-collector | Creating |
| 57 | tweet-draft-reviewer | Creating |
| 58 | newsletter-creation-curation | Creating |
| 59 | de-ai-ify | Improving |
| 60 | humanizer | Improving |
| 61 | homepage-audit | Improving |
| 62 | ai-discoverability-audit | Improving |
| 63 | content-idea-generator | Thinking |
| 64 | positioning-basics | Thinking |
| 65 | marketing-principles | Thinking |
| 66 | reddit-insights | Research |
| 67 | voice-extractor | Research |
| 68 | meeting-prep | Research |
| 69 | youtube-summarizer | Research |
| 70 | last30days | Research |
| 71 | daily-briefing-builder | Research |

**Total: 71 unique skills confirmed.**

Note: The ROADMAP mentions "73 skills" but the REQUIREMENTS say "71 total: 50 from CLAUDE.md + 21 from contentfpz only." The 71 count is correct after deduplication. The discrepancy should be noted in the matrix and reconciled during audit.

## Architecture Patterns

### The Matrix Document Structure

The ownership matrix should be a single markdown file with one table. Each row maps a skill to its primary agent. Columns:

```markdown
| # | Skill Name | Primary Agent | Category | Source | Notes |
```

This file becomes the single source of truth referenced by all subsequent phases. Every agent configuration (Phases 3-9) pulls its skill list from this matrix.

### Cross-Cutting Skills Pattern

Some skills are used in multiple contexts. The ownership model handles this with:

| Skill | Primary Owner | Rule |
|-------|---------------|------|
| humanizer | Technical Writer | Runs as final pass on ALL content. Every content-producing agent's heartbeat must reference "hand off to Technical Writer for humanizer pass" |
| de-ai-ify | Technical Writer | Same as humanizer. Quality gate skill |
| copy-editing | Technical Writer | Same pattern. Editing pass before publishing |
| product-marketing-context | CMO | CMO maintains the doc. Other agents READ it but don't own it |
| contentfpz router | EXCLUDED | Not a Paperclip skill. Issue assignment replaces routing |

**Rule:** Primary owner is the agent that EXECUTES the skill. Secondary users reference the output but never invoke the skill themselves. In Paperclip, this means the handover step in heartbeats routes work to the primary owner.

### Recommended Project Structure

```
.planning/phases/01-skill-ownership-matrix/
  01-RESEARCH.md          # This file
  01-01-PLAN.md           # Audit and inventory plan
  01-02-PLAN.md           # Assignment and validation plan

Deliverable location:
  .planning/skill-ownership-matrix.md   # The single source of truth
```

## Recommended Skill Distribution

### Distribution Strategy

The 10 agents and their skill domains:

| Agent | Domain | Target Count | Skills |
|-------|--------|-------------|--------|
| **CEO** | Routing only | 0 new (keep existing 7 fallbacks) | No primary skills. Fallbacks only. |
| **CMO** | Marketing strategy | 8-10 | marketing-ideas, marketing-psychology, marketing-principles, positioning-basics, pricing-strategy, launch-strategy, content-strategy, product-marketing-context, anthropic-skills:marketing-strategy-pmm, content-idea-generator |
| **Technical Writer** | Content production + quality gate | 9-10 | blog-write, blog-rewrite, blog-analyse, blog-seo-check, blog-strategy, blog-repurpose, humanizer, de-ai-ify, copy-editing, anthropic-skills:content-creator |
| **Customer Success** | Competitive intel + research + sales | 8-10 | competitor-alternatives, customer-research, reddit-insights, last30days, daily-briefing-builder, testimonial-collector, ai-discoverability-audit, case-study-builder, revops, sales-enablement |
| **UX Researcher** | Growth, conversion, SEO | 9-10 | page-cro, signup-flow-cro, onboarding-cro, form-cro, popup-cro, paywall-upgrade-cro, seo-audit, ai-seo, homepage-audit, churn-prevention |
| **LinkedIn Growth Director** | LinkedIn + outreach | 6-8 | linkedin-post-writer, linkedin-content-strategy, linkedin-authority-builder, linkedin-profile-optimizer, cold-outreach-sequence, meeting-prep |
| **Software Engineer** | Implementation | 2-5 | git-workflow, pr-workflow (existing), + potentially pdf, docx, xlsx, pptx, frontend-slides |
| **Product Owner** | Backlog + prioritisation | 3-4 | auto-assign, backlog-health, product-review (existing) |
| **Code Reviewer** | Code quality | 1-2 | code-review (existing) |
| **CTO** | Tech oversight | 0 | No content skills. Architecture and standards only. |

### Remaining Skills (need explicit assignment)

After the above distribution, these skills still need homes:

| Skill | Best Fit Agent | Rationale |
|-------|---------------|-----------|
| copywriting | Technical Writer | Content production |
| cold-email | LinkedIn Growth Director or Customer Success | Outreach skill |
| email-sequence | Technical Writer | Content production (automated flows) |
| social-content | Technical Writer | Content production |
| ad-creative | Technical Writer or UX Researcher | Creative execution |
| social-card-gen | Technical Writer | Visual content creation |
| tweet-draft-reviewer | Technical Writer | Social content quality |
| newsletter-creation-curation | Technical Writer | Newsletter production |
| anthropic-skills:newsletter-content-creator | Technical Writer | Newsletter production |
| anthropic-skills:newsletter-writing-skill | Technical Writer | Newsletter production |
| programmatic-seo | UX Researcher | SEO execution |
| site-architecture | UX Researcher | SEO/structure |
| schema-markup | UX Researcher | SEO/technical |
| paid-ads | UX Researcher | Growth/paid |
| ab-test-setup | UX Researcher | Growth/experimentation |
| free-tool-strategy | UX Researcher | Growth engineering |
| lead-magnets | UX Researcher | Growth engineering |
| referral-program | UX Researcher | Growth engineering |
| voice-extractor | CMO | Brand voice (strategy) |
| youtube-summarizer | Customer Success | Research/intel |
| pdf, docx, xlsx, pptx, frontend-slides | Software Engineer | Document generation (technical execution) |

**Warning:** Technical Writer and UX Researcher both risk exceeding the 10-skill cap with this distribution. The audit step must do a hard count and either:
- Split overflow skills to an adjacent agent
- Bundle related skills into a single composite skill file (e.g., "cro-suite.md" covering all 6 CRO skills as one file)

### Skill Bundling Strategy (if cap is exceeded)

If an agent would exceed 10 skill files, bundle related skills into a single file:

| Bundle | Contains | Count as |
|--------|----------|----------|
| cro-suite.md | page-cro, signup-flow-cro, onboarding-cro, form-cro, popup-cro, paywall-upgrade-cro | 1 skill file |
| blog-engine.md | blog-write, blog-rewrite, blog-analyse, blog-seo-check, blog-strategy, blog-repurpose | 1 skill file |
| newsletter-suite.md | newsletter-creation-curation, anthropic-skills:newsletter-content-creator, anthropic-skills:newsletter-writing-skill | 1 skill file |
| seo-suite.md | seo-audit, ai-seo, programmatic-seo, schema-markup, site-architecture | 1 skill file |
| document-tools.md | pdf, docx, xlsx, pptx, frontend-slides | 1 skill file |

This is the primary mechanism for staying within the 10-file cap while preserving all 71 skills.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Skill routing | A Paperclip router agent | Issue assignment + labels | Paperclip's issue system IS the router |
| Skill counting | Manual counting from memory | Grep/count against the matrix table | Human counting of 71 items is error-prone |
| Conflict detection | Visual inspection for duplicates | Sort the matrix by agent and verify no skill appears twice | Systematic check beats eyeballing |
| Cap enforcement | Trust that it "looks right" | Count rows per agent programmatically | The 10-skill cap is a hard requirement |

## Common Pitfalls

### Pitfall 1: Counting Mismatch Between Sources
**What goes wrong:** CLAUDE.md says "50 skills" but some are categories (e.g., "pdf, docx, xlsx, pptx" listed on one line = 4 skills). Easy to undercount.
**How to avoid:** Extract every unique skill name. One skill = one entry in the matrix. Do not count lines; count skill names.
**Warning signs:** Total doesn't match 71 after deduplication.

### Pitfall 2: The 10-Skill Cap Forces Unnatural Groupings
**What goes wrong:** Trying to assign every skill as a separate file and running out of slots. Then forcing skills into agents where they don't fit just to stay under cap.
**How to avoid:** Use bundling (see above). Related skills that always fire together (e.g., all 6 CRO skills) can share a single file.
**Warning signs:** An agent has skills from unrelated domains crammed together.

### Pitfall 3: Forgetting the 10th Agent (LinkedIn Growth Director)
**What goes wrong:** The LinkedIn Growth Director doesn't exist yet in Paperclip (only 9 agents created). Skills get assigned to CMO or Technical Writer instead.
**How to avoid:** Treat it as a real agent in the matrix. Flag that creation happens in Phase 8.5. The matrix is AHEAD of the agent creation.
**Warning signs:** LinkedIn skills assigned to CMO.

### Pitfall 4: Confusing Primary Ownership with Usage
**What goes wrong:** "CMO uses customer-research, so it goes to CMO." But Customer Success EXECUTES customer research. CMO consumes the output.
**How to avoid:** Primary owner = the agent that does the work. Other agents consume deliverables via issue comments.
**Warning signs:** An agent owns a skill that doesn't match its SOUL.md persona.

### Pitfall 5: Anthropic-Skills Namespace Confusion
**What goes wrong:** `anthropic-skills:content-creator` and `content-idea-generator` look similar but are different skills from different sources.
**How to avoid:** Keep the full namespaced name in the matrix. Never abbreviate.
**Warning signs:** Duplicate-looking entries that are actually different skills.

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| All skills on CMO | Distribute across 5+ CMO-stream agents | Prevents context window overload |
| contentfpz router in Paperclip | Issue assignment + labels for routing | Eliminates the need for a meta-router agent |
| One skill = one file always | Bundling related skills into suite files | Enables the 10-skill cap without losing skills |
| Flat skill list | Matrix with agent assignment + category | Single source of truth for all downstream phases |

## Validation Architecture

### Test Framework

This phase produces a markdown document, not code. Validation is structural, not automated.

| Property | Value |
|----------|-------|
| Framework | Manual verification + grep-based counting |
| Config file | None |
| Quick run command | `grep -c "^|" .planning/skill-ownership-matrix.md` (count table rows) |
| Full suite command | Manual review: check no duplicates, no agent over 10, total = 71 |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SOWN-01 | All 71 skills mapped | manual | Count rows in matrix = 71 | Wave 0 |
| SOWN-02 | Cross-cutting rules defined | manual | Check for cross-cutting section | Wave 0 |
| SOWN-03 | No agent over 10 skills | manual | Count rows grouped by agent, max = 10 | Wave 0 |
| SOWN-04 | Zero unmapped skills | manual | Diff matrix skill list against inventory | Wave 0 |
| SOWN-05 | 6 CRO skills mapped | manual | Grep for "cro" in matrix | Wave 0 |
| SOWN-06 | 6 blog skills mapped | manual | Grep for "blog" in matrix | Wave 0 |
| SOWN-07 | 6 SEO skills mapped | manual | Grep for "seo\|schema\|site-arch\|discoverability" in matrix | Wave 0 |
| SOWN-08 | 5 growth skills mapped | manual | Grep for growth skills by name | Wave 0 |
| SOWN-09 | 5 document skills mapped | manual | Grep for "pdf\|docx\|xlsx\|pptx\|frontend-slides" | Wave 0 |
| SOWN-10 | 3 newsletter skills mapped | manual | Grep for "newsletter" | Wave 0 |
| SOWN-11 | 3 anthropic-skills mapped | manual | Grep for "anthropic-skills" | Wave 0 |
| SOWN-12 | churn + product-marketing-context mapped | manual | Grep for both | Wave 0 |
| SOWN-13 | Blog skills to Technical Writer | manual | Grep blog rows, verify agent column | Wave 0 |
| SOWN-14 | LinkedIn skills to LinkedIn Growth Director | manual | Grep linkedin rows, verify agent column | Wave 0 |
| SOWN-15 | Strategy skills to CMO | manual | Grep strategy skills, verify agent column | Wave 0 |
| SOWN-16 | Content production to Technical Writer | manual | Grep production skills, verify agent column | Wave 0 |
| SOWN-17 | Sales skills assigned | manual | Grep cold-email, revops, sales-enablement | Wave 0 |
| SOWN-18 | Research skills assigned | manual | Grep daily-briefing, homepage-audit | Wave 0 |
| SOWN-19 | Anthropic-skills to primary agents | manual | Grep anthropic-skills, verify agent column | Wave 0 |

### Sampling Rate
- **Per task:** Visual scan of matrix after each batch of assignments
- **Phase gate:** Full count verification before marking Phase 1 complete

### Wave 0 Gaps
None. This phase produces a document. No test infrastructure needed.

## Open Questions

1. **Document creation skills (pdf, docx, xlsx, pptx, frontend-slides) -- who owns them?**
   - What we know: These are technical execution skills. They generate files, not content.
   - Options: Software Engineer (technical execution), Product Owner (business docs), or bundle as a shared utility
   - Recommendation: Assign to Software Engineer. They have capacity (only 2 skills currently) and document generation is a technical task.

2. **Sales skills (cold-email, revops, sales-enablement) -- who owns them?**
   - What we know: These span outreach (LinkedIn Growth Director), revenue operations (CMO), and sales materials (Customer Success)
   - Recommendation: cold-email to LinkedIn Growth Director (outreach pairing), revops and sales-enablement to Customer Success (client-facing)

3. **Exact skill count: 71 or 73?**
   - What we know: ROADMAP says 73, REQUIREMENTS says 71. The 71 count (50 CLAUDE.md + 21 contentfpz-only) is documented with more precision.
   - Recommendation: The audit step (plan 01-01) must produce the definitive count. Use 71 as the working assumption.

4. **Should CEO fallback skills count toward the total?**
   - What we know: CEO has 7 existing skills (5 fallbacks + 2 primary). These are NOT the 71 content/marketing skills being mapped.
   - Recommendation: Exclude CEO fallbacks from the 71-skill inventory. They are infrastructure, not content skills. Note this decision in the matrix.

5. **Existing Paperclip skills (brand-identity, competitive-tracking, etc.) -- do they count?**
   - What we know: Several agents already have skills (brand-identity on CMO, competitive-tracking on Customer Success, etc.). These were created by the Paperclip wizard and are NOT part of the 71 Claude Code skills.
   - Recommendation: List existing Paperclip skills separately. They don't count toward the 71 but DO count toward the 10-skill-per-agent cap.

## Sources

### Primary (HIGH confidence)
- `/Users/martynmakinson/Documents/fourpointzero/CLAUDE.md` - 50 skills explicitly listed
- `/Users/martynmakinson/Documents/fourpointzero/.claude/skills/contentfpz/SKILL.md` - 43 skills in routing logic
- `/Users/martynmakinson/Documents/fourpointzero/.planning/REQUIREMENTS.md` - 19 SOWN requirements
- `/Users/martynmakinson/Documents/fourpointzero/.planning/research/STACK.md` - Paperclip file structure
- `/Users/martynmakinson/Documents/fourpointzero/.planning/research/ARCHITECTURE.md` - Agent patterns
- `/Users/martynmakinson/Documents/fourpointzero/.planning/research/PITFALLS.md` - Known risks
- Direct inspection of `~/.paperclip/instances/default/companies/FourPointZero/agents/` - 9 agents, current skill counts

### Secondary (MEDIUM confidence)
- `/Users/martynmakinson/Documents/fourpointzero/.planning/research/FEATURES.md` - Feature landscape
- Skill count reconciliation (71 vs 73 discrepancy needs audit confirmation)

## Metadata

**Confidence breakdown:**
- Skill inventory: HIGH - directly extracted from source files
- Distribution strategy: MEDIUM - based on SOUL.md alignment and requirements, but the exact assignment needs validation during execution
- Bundling approach: MEDIUM - logical solution to the 10-cap constraint, but needs confirmation that Paperclip handles bundled skill files correctly
- Pitfalls: HIGH - drawn from direct research observations

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (stable domain, no external dependencies)
