# Requirements: FourPointZero AI Agent Company

**Defined:** 2026-04-02
**Core Value:** Every agent knows exactly which skills it owns, and work flows down the hierarchy without ambiguity or overlap.

## v1 Requirements

### Skill Ownership

- [x] **SOWN-01**: Create skill ownership matrix mapping all 71 skills to exactly one primary agent
- [x] **SOWN-02**: Identify cross-cutting skills and define primary vs secondary ownership rules
- [x] **SOWN-03**: Cap each agent at 10 or fewer skill files to prevent context window overload
- [x] **SOWN-04**: Validate zero unmapped skills remain after assignment (71 total: 50 from CLAUDE.md + 21 from contentfpz only)
- [x] **SOWN-05**: Map 6 CRO skills (page-cro, signup-flow-cro, onboarding-cro, form-cro, popup-cro, paywall-upgrade-cro)
- [x] **SOWN-06**: Map 6 blog engine skills (blog-write, blog-rewrite, blog-analyse, blog-seo-check, blog-strategy, blog-repurpose)
- [x] **SOWN-07**: Map 6 SEO/discovery skills (seo-audit, ai-seo, programmatic-seo, site-architecture, schema-markup, ai-discoverability-audit)
- [x] **SOWN-08**: Map 5 growth engineering skills (free-tool-strategy, lead-magnets, referral-program, paid-ads, ab-test-setup)
- [x] **SOWN-09**: Map 5 document creation skills (pdf, docx, xlsx, pptx, frontend-slides)
- [x] **SOWN-10**: Map 3 newsletter skills (newsletter-creation-curation, anthropic-skills:newsletter-content-creator, anthropic-skills:newsletter-writing-skill)
- [x] **SOWN-11**: Map 3 anthropic-skills (content-creator, marketing-strategy-pmm, newsletter-content-creator)
- [x] **SOWN-12**: Map retention skill (churn-prevention) and product-marketing-context

### CEO Agent

- [x] **CEO-01**: Update CEO AGENTS.md with FPZ-specific routing instructions
- [x] **CEO-02**: Update CEO SOUL.md with FPZ persona (UK English, CreativAI context)
- [x] **CEO-03**: Update CEO HEARTBEAT.md with delegation logic for CMO and CTO streams
- [x] **CEO-04**: Inject contentfpz router reference so CEO can delegate to correct agent

### CMO Agent

- [x] **CMO-01**: Update CMO AGENTS.md with 8-10 primary marketing strategy skills
- [x] **CMO-02**: Update CMO SOUL.md with FPZ CreativAI positioning context
- [x] **CMO-03**: Update CMO HEARTBEAT.md with content production oversight logic
- [x] **CMO-04**: Inject product-marketing-context.md reference

### CTO Agent

- [x] **CTO-01**: Update CTO AGENTS.md with technical leadership skills
- [x] **CTO-02**: Update CTO SOUL.md with FPZ tech stack context (Next.js, Vercel, Notion, n8n)
- [x] **CTO-03**: Update CTO HEARTBEAT.md with engineering oversight logic

### Technical Writer Agent

- [x] **TWRT-01**: Update Technical Writer AGENTS.md with content production skills (blog, newsletter, social)
- [x] **TWRT-02**: Assign humanizer, de-ai-ify, copy-editing as quality gate skills
- [x] **TWRT-03**: Update HEARTBEAT.md with content review pass logic
- [x] **TWRT-04**: Inject blog engine skills (blog-write, blog-rewrite, blog-analyse, blog-repurpose)

### Customer Success Agent

- [x] **CSUC-01**: Update Customer Success AGENTS.md with competitive intelligence skills
- [x] **CSUC-02**: Assign competitor-alternatives, customer-research, reddit-insights, last30days
- [x] **CSUC-03**: Update HEARTBEAT.md with market monitoring logic
- [x] **CSUC-04**: Assign testimonial-collector and ai-discoverability-audit

### UX Researcher Agent

- [x] **UXRS-01**: Update UX Researcher AGENTS.md with growth and conversion skills
- [x] **UXRS-02**: Assign all CRO skills (page-cro, signup-flow-cro, form-cro, popup-cro, paywall-upgrade-cro)
- [x] **UXRS-03**: Assign SEO skills (seo-audit, ai-seo, programmatic-seo, schema-markup)
- [x] **UXRS-04**: Update HEARTBEAT.md with growth audit logic

### LinkedIn Growth Director Agent

- [x] **LNKD-01**: Create LinkedIn Growth Director agent in Paperclip (new agent, reports to CEO, logical CMO stream)
- [x] **LNKD-02**: Update AGENTS.md with all LinkedIn skills (post-writer, content-strategy, authority-builder, profile-optimizer)
- [x] **LNKD-03**: Assign outreach skills (cold-outreach-sequence, meeting-prep)
- [x] **LNKD-04**: Update SOUL.md with FPZ LinkedIn persona and CreativAI positioning context
- [x] **LNKD-05**: Update HEARTBEAT.md with LinkedIn content calendar and engagement workflow logic

### Software Engineer Agent

- [x] **ENGR-01**: Update Engineer AGENTS.md with FPZ project context (ADHD EF system, tooling)
- [x] **ENGR-02**: Update SOUL.md with tech stack specifics
- [x] **ENGR-03**: Update HEARTBEAT.md with implementation workflow

### Product Owner Agent

- [x] **POWN-01**: Update Product Owner AGENTS.md with backlog management context
- [x] **POWN-02**: Update HEARTBEAT.md with cross-stream prioritisation logic
- [x] **POWN-03**: Inject FPZ project context for both business and tech streams

### Code Reviewer Agent

- [x] **CREV-01**: Update Code Reviewer AGENTS.md with FPZ code quality standards
- [x] **CREV-02**: Update HEARTBEAT.md with PR review workflow

### Skill Adaptation

- [x] **ADPT-01**: Create skill adaptation template for converting Claude Code skills to Paperclip format
- [x] **ADPT-02**: Remove interactive prompts from all adapted skills
- [x] **ADPT-03**: Add issue-driven trigger logic to adapted skills
- [x] **ADPT-04**: Adapt and deploy CMO stream skills (30+ files)
- [x] **ADPT-05**: Adapt and deploy CTO stream skills
- [x] **ADPT-06**: Adapt and deploy cross-cutting skills (humanizer, contentfpz router)
- [x] **ADPT-07**: Adapt and deploy skills unique to contentfpz not in CLAUDE.md (21 skills including humanizer, de-ai-ify, meeting-prep, voice-extractor, youtube-summarizer, etc.)
- [x] **ADPT-08**: Adapt and deploy skills unique to CLAUDE.md not in contentfpz (28 skills including CRO variants, growth engineering, document tools, etc.)

### Housekeeping

- [x]**HSKP-01**: Delete old FPZ company from Paperclip (preserving any useful data first)
- [x]**HSKP-02**: Remove Chat Assistant agent from old FPZ company (or recreate in FourPointZero if needed)
- [x]**HSKP-03**: Create or update product-marketing-context.md with current FPZ/CreativAI positioning
- [x] **HSKP-04**: Create LinkedIn Growth Director agent via Paperclip API (wizard only created 9, this is #10)

### Skill Ownership Completeness

- [x] **SOWN-13**: Explicitly assign all 6 blog engine skills (blog-write, blog-rewrite, blog-analyse, blog-seo-check, blog-strategy, blog-repurpose) to Technical Writer
- [x] **SOWN-14**: Explicitly assign all LinkedIn skills (linkedin-post-writer, linkedin-content-strategy, linkedin-authority-builder, linkedin-profile-optimizer) to LinkedIn Growth Director
- [x] **SOWN-15**: Explicitly assign strategy skills (marketing-ideas, marketing-psychology, marketing-principles, positioning-basics, pricing-strategy, launch-strategy, content-idea-generator) to CMO
- [x] **SOWN-16**: Explicitly assign content production skills (social-content, social-card-gen, copywriting, ad-creative, email-sequence, case-study-builder, tweet-draft-reviewer) to Technical Writer
- [x] **SOWN-17**: Explicitly assign sales skills (cold-email, revops, sales-enablement) - primary owner TBD in Phase 1
- [x] **SOWN-18**: Explicitly assign research skills (daily-briefing-builder, homepage-audit) - primary owner TBD in Phase 1
- [x] **SOWN-19**: Explicitly assign anthropic-skills (content-creator, marketing-strategy-pmm, newsletter-content-creator, newsletter-writing-skill) to their primary agents

### Validation

- [x] **VALD-01**: Create test issue for CEO delegation routing
- [x] **VALD-02**: Create test issue for CMO content production
- [x] **VALD-03**: Create test issue for Technical Writer quality gate
- [x] **VALD-04**: Create test issue for Software Engineer implementation
- [x] **VALD-05**: Verify each agent picks up and processes assigned work on heartbeat
- [x] **VALD-06**: Create test issue for LinkedIn Growth Director (post creation + outreach)

## v2 Requirements

### Advanced Patterns

- **ADV-01**: Cross-agent skill handoff chains (e.g., CMO assigns -> Technical Writer produces -> humanizer pass)
- **ADV-02**: Skill versioning and hot-reload without agent restart
- **ADV-03**: Agent performance metrics per skill usage
- **ADV-04**: Document creation skills (pdf, docx, xlsx, pptx) assigned to relevant agents

## Out of Scope

| Feature | Reason |
|---------|--------|
| Building new skills | Only mapping and adapting existing 63 skills |
| Modifying Paperclip core | Working within platform constraints |
| n8n workflow configuration | Separate from agent skill mapping |
| Multi-layer delegation chains | Paperclip flat hierarchy limitation |
| Running all 9 agents simultaneously | Machine resource constraint (2-3 concurrent) |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SOWN-01 | Phase 1 | Complete |
| SOWN-02 | Phase 1 | Complete |
| SOWN-03 | Phase 1 | Complete |
| SOWN-04 | Phase 1 | Complete |
| SOWN-05 | Phase 1 | Complete |
| SOWN-06 | Phase 1 | Complete |
| SOWN-07 | Phase 1 | Complete |
| SOWN-08 | Phase 1 | Complete |
| SOWN-09 | Phase 1 | Complete |
| SOWN-10 | Phase 1 | Complete |
| SOWN-11 | Phase 1 | Complete |
| SOWN-12 | Phase 1 | Complete |
| ADPT-01 | Phase 2 | Complete |
| ADPT-02 | Phase 2 | Complete |
| ADPT-03 | Phase 2 | Complete |
| CEO-01 | Phase 3 | Complete |
| CEO-02 | Phase 3 | Complete |
| CEO-03 | Phase 3 | Complete |
| CEO-04 | Phase 3 | Complete |
| POWN-01 | Phase 3 | Complete |
| POWN-02 | Phase 3 | Complete |
| POWN-03 | Phase 3 | Complete |
| CMO-01 | Phase 4 | Complete |
| CMO-02 | Phase 4 | Complete |
| CMO-03 | Phase 4 | Complete |
| CMO-04 | Phase 4 | Complete |
| ADPT-04 | Phase 5 | Complete |
| ADPT-06 | Phase 5 | Complete |
| ADPT-07 | Phase 5 | Complete |
| ADPT-08 | Phase 5 | Complete |
| CTO-01 | Phase 6 | Complete |
| CTO-02 | Phase 6 | Complete |
| CTO-03 | Phase 6 | Complete |
| TWRT-01 | Phase 7 | Complete |
| TWRT-02 | Phase 7 | Complete |
| TWRT-03 | Phase 7 | Complete |
| TWRT-04 | Phase 7 | Complete |
| CSUC-01 | Phase 8 | Complete |
| CSUC-02 | Phase 8 | Complete |
| CSUC-03 | Phase 8 | Complete |
| CSUC-04 | Phase 8 | Complete |
| UXRS-01 | Phase 8 | Complete |
| UXRS-02 | Phase 8 | Complete |
| UXRS-03 | Phase 8 | Complete |
| UXRS-04 | Phase 8 | Complete |
| LNKD-01 | Phase 8.5 | Complete |
| LNKD-02 | Phase 8.5 | Complete |
| LNKD-03 | Phase 8.5 | Complete |
| LNKD-04 | Phase 8.5 | Complete |
| LNKD-05 | Phase 8.5 | Complete |
| ENGR-01 | Phase 9 | Complete |
| ENGR-02 | Phase 9 | Complete |
| ENGR-03 | Phase 9 | Complete |
| CREV-01 | Phase 9 | Complete |
| CREV-02 | Phase 9 | Complete |
| ADPT-05 | Phase 9 | Complete |
| VALD-01 | Phase 10 | Complete |
| VALD-02 | Phase 10 | Complete |
| VALD-03 | Phase 10 | Complete |
| VALD-04 | Phase 10 | Complete |
| VALD-05 | Phase 10 | Complete |
| VALD-06 | Phase 10 | Complete |
| HSKP-01 | Phase 0 | Pending |
| HSKP-02 | Phase 0 | Pending |
| HSKP-03 | Phase 0 | Pending |
| HSKP-04 | Phase 8.5 | Complete |
| SOWN-13 | Phase 1 | Complete |
| SOWN-14 | Phase 1 | Complete |
| SOWN-15 | Phase 1 | Complete |
| SOWN-16 | Phase 1 | Complete |
| SOWN-17 | Phase 1 | Complete |
| SOWN-18 | Phase 1 | Complete |
| SOWN-19 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 72 total
- Mapped to phases: 72
- Unmapped: 0

---
*Requirements defined: 2026-04-02*
*Last updated: 2026-04-02 after roadmap creation*
