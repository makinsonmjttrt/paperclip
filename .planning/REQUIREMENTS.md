# Requirements: FourPointZero AI Agent Company

**Defined:** 2026-04-02
**Core Value:** Every agent knows exactly which skills it owns, and work flows down the hierarchy without ambiguity or overlap.

## v1 Requirements

### Skill Ownership

- [ ] **SOWN-01**: Create skill ownership matrix mapping all 71 skills to exactly one primary agent
- [ ] **SOWN-02**: Identify cross-cutting skills and define primary vs secondary ownership rules
- [ ] **SOWN-03**: Cap each agent at 10 or fewer skill files to prevent context window overload
- [ ] **SOWN-04**: Validate zero unmapped skills remain after assignment (71 total: 50 from CLAUDE.md + 21 from contentfpz only)
- [ ] **SOWN-05**: Map 6 CRO skills (page-cro, signup-flow-cro, onboarding-cro, form-cro, popup-cro, paywall-upgrade-cro)
- [ ] **SOWN-06**: Map 6 blog engine skills (blog-write, blog-rewrite, blog-analyse, blog-seo-check, blog-strategy, blog-repurpose)
- [ ] **SOWN-07**: Map 6 SEO/discovery skills (seo-audit, ai-seo, programmatic-seo, site-architecture, schema-markup, ai-discoverability-audit)
- [ ] **SOWN-08**: Map 5 growth engineering skills (free-tool-strategy, lead-magnets, referral-program, paid-ads, ab-test-setup)
- [ ] **SOWN-09**: Map 5 document creation skills (pdf, docx, xlsx, pptx, frontend-slides)
- [ ] **SOWN-10**: Map 3 newsletter skills (newsletter-creation-curation, anthropic-skills:newsletter-content-creator, anthropic-skills:newsletter-writing-skill)
- [ ] **SOWN-11**: Map 3 anthropic-skills (content-creator, marketing-strategy-pmm, newsletter-content-creator)
- [ ] **SOWN-12**: Map retention skill (churn-prevention) and product-marketing-context

### CEO Agent

- [ ] **CEO-01**: Update CEO AGENTS.md with FPZ-specific routing instructions
- [ ] **CEO-02**: Update CEO SOUL.md with FPZ persona (UK English, CreativAI context)
- [ ] **CEO-03**: Update CEO HEARTBEAT.md with delegation logic for CMO and CTO streams
- [ ] **CEO-04**: Inject contentfpz router reference so CEO can delegate to correct agent

### CMO Agent

- [ ] **CMO-01**: Update CMO AGENTS.md with 8-10 primary marketing strategy skills
- [ ] **CMO-02**: Update CMO SOUL.md with FPZ CreativAI positioning context
- [ ] **CMO-03**: Update CMO HEARTBEAT.md with content production oversight logic
- [ ] **CMO-04**: Inject product-marketing-context.md reference

### CTO Agent

- [ ] **CTO-01**: Update CTO AGENTS.md with technical leadership skills
- [ ] **CTO-02**: Update CTO SOUL.md with FPZ tech stack context (Next.js, Vercel, Notion, n8n)
- [ ] **CTO-03**: Update CTO HEARTBEAT.md with engineering oversight logic

### Technical Writer Agent

- [ ] **TWRT-01**: Update Technical Writer AGENTS.md with content production skills (blog, newsletter, social)
- [ ] **TWRT-02**: Assign humanizer, de-ai-ify, copy-editing as quality gate skills
- [ ] **TWRT-03**: Update HEARTBEAT.md with content review pass logic
- [ ] **TWRT-04**: Inject blog engine skills (blog-write, blog-rewrite, blog-analyse, blog-repurpose)

### Customer Success Agent

- [ ] **CSUC-01**: Update Customer Success AGENTS.md with competitive intelligence skills
- [ ] **CSUC-02**: Assign competitor-alternatives, customer-research, reddit-insights, last30days
- [ ] **CSUC-03**: Update HEARTBEAT.md with market monitoring logic
- [ ] **CSUC-04**: Assign testimonial-collector and ai-discoverability-audit

### UX Researcher Agent

- [ ] **UXRS-01**: Update UX Researcher AGENTS.md with growth and conversion skills
- [ ] **UXRS-02**: Assign all CRO skills (page-cro, signup-flow-cro, form-cro, popup-cro, paywall-upgrade-cro)
- [ ] **UXRS-03**: Assign SEO skills (seo-audit, ai-seo, programmatic-seo, schema-markup)
- [ ] **UXRS-04**: Update HEARTBEAT.md with growth audit logic

### LinkedIn Growth Director Agent

- [ ] **LNKD-01**: Create LinkedIn Growth Director agent in Paperclip (new agent, reports to CEO, logical CMO stream)
- [ ] **LNKD-02**: Update AGENTS.md with all LinkedIn skills (post-writer, content-strategy, authority-builder, profile-optimizer)
- [ ] **LNKD-03**: Assign outreach skills (cold-outreach-sequence, meeting-prep)
- [ ] **LNKD-04**: Update SOUL.md with FPZ LinkedIn persona and CreativAI positioning context
- [ ] **LNKD-05**: Update HEARTBEAT.md with LinkedIn content calendar and engagement workflow logic

### Software Engineer Agent

- [ ] **ENGR-01**: Update Engineer AGENTS.md with FPZ project context (ADHD EF system, tooling)
- [ ] **ENGR-02**: Update SOUL.md with tech stack specifics
- [ ] **ENGR-03**: Update HEARTBEAT.md with implementation workflow

### Product Owner Agent

- [ ] **POWN-01**: Update Product Owner AGENTS.md with backlog management context
- [ ] **POWN-02**: Update HEARTBEAT.md with cross-stream prioritisation logic
- [ ] **POWN-03**: Inject FPZ project context for both business and tech streams

### Code Reviewer Agent

- [ ] **CREV-01**: Update Code Reviewer AGENTS.md with FPZ code quality standards
- [ ] **CREV-02**: Update HEARTBEAT.md with PR review workflow

### Skill Adaptation

- [ ] **ADPT-01**: Create skill adaptation template for converting Claude Code skills to Paperclip format
- [ ] **ADPT-02**: Remove interactive prompts from all adapted skills
- [ ] **ADPT-03**: Add issue-driven trigger logic to adapted skills
- [ ] **ADPT-04**: Adapt and deploy CMO stream skills (30+ files)
- [ ] **ADPT-05**: Adapt and deploy CTO stream skills
- [ ] **ADPT-06**: Adapt and deploy cross-cutting skills (humanizer, contentfpz router)
- [ ] **ADPT-07**: Adapt and deploy skills unique to contentfpz not in CLAUDE.md (21 skills including humanizer, de-ai-ify, meeting-prep, voice-extractor, youtube-summarizer, etc.)
- [ ] **ADPT-08**: Adapt and deploy skills unique to CLAUDE.md not in contentfpz (28 skills including CRO variants, growth engineering, document tools, etc.)

### Validation

- [ ] **VALD-01**: Create test issue for CEO delegation routing
- [ ] **VALD-02**: Create test issue for CMO content production
- [ ] **VALD-03**: Create test issue for Technical Writer quality gate
- [ ] **VALD-04**: Create test issue for Software Engineer implementation
- [ ] **VALD-05**: Verify each agent picks up and processes assigned work on heartbeat

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
| SOWN-01 | Phase 1 | Pending |
| SOWN-02 | Phase 1 | Pending |
| SOWN-03 | Phase 1 | Pending |
| SOWN-04 | Phase 1 | Pending |
| SOWN-05 | Phase 1 | Pending |
| SOWN-06 | Phase 1 | Pending |
| SOWN-07 | Phase 1 | Pending |
| SOWN-08 | Phase 1 | Pending |
| SOWN-09 | Phase 1 | Pending |
| SOWN-10 | Phase 1 | Pending |
| SOWN-11 | Phase 1 | Pending |
| SOWN-12 | Phase 1 | Pending |
| ADPT-01 | Phase 2 | Pending |
| ADPT-02 | Phase 2 | Pending |
| ADPT-03 | Phase 2 | Pending |
| CEO-01 | Phase 3 | Pending |
| CEO-02 | Phase 3 | Pending |
| CEO-03 | Phase 3 | Pending |
| CEO-04 | Phase 3 | Pending |
| POWN-01 | Phase 3 | Pending |
| POWN-02 | Phase 3 | Pending |
| POWN-03 | Phase 3 | Pending |
| CMO-01 | Phase 4 | Pending |
| CMO-02 | Phase 4 | Pending |
| CMO-03 | Phase 4 | Pending |
| CMO-04 | Phase 4 | Pending |
| ADPT-04 | Phase 5 | Pending |
| ADPT-06 | Phase 5 | Pending |
| ADPT-07 | Phase 5 | Pending |
| ADPT-08 | Phase 5 | Pending |
| CTO-01 | Phase 6 | Pending |
| CTO-02 | Phase 6 | Pending |
| CTO-03 | Phase 6 | Pending |
| TWRT-01 | Phase 7 | Pending |
| TWRT-02 | Phase 7 | Pending |
| TWRT-03 | Phase 7 | Pending |
| TWRT-04 | Phase 7 | Pending |
| CSUC-01 | Phase 8 | Pending |
| CSUC-02 | Phase 8 | Pending |
| CSUC-03 | Phase 8 | Pending |
| CSUC-04 | Phase 8 | Pending |
| UXRS-01 | Phase 8 | Pending |
| UXRS-02 | Phase 8 | Pending |
| UXRS-03 | Phase 8 | Pending |
| UXRS-04 | Phase 8 | Pending |
| LNKD-01 | Phase 8.5 | Pending |
| LNKD-02 | Phase 8.5 | Pending |
| LNKD-03 | Phase 8.5 | Pending |
| LNKD-04 | Phase 8.5 | Pending |
| LNKD-05 | Phase 8.5 | Pending |
| ENGR-01 | Phase 9 | Pending |
| ENGR-02 | Phase 9 | Pending |
| ENGR-03 | Phase 9 | Pending |
| CREV-01 | Phase 9 | Pending |
| CREV-02 | Phase 9 | Pending |
| ADPT-05 | Phase 9 | Pending |
| VALD-01 | Phase 10 | Pending |
| VALD-02 | Phase 10 | Pending |
| VALD-03 | Phase 10 | Pending |
| VALD-04 | Phase 10 | Pending |
| VALD-05 | Phase 10 | Pending |

**Coverage:**
- v1 requirements: 59 total
- Mapped to phases: 59
- Unmapped: 0

---
*Requirements defined: 2026-04-02*
*Last updated: 2026-04-02 after roadmap creation*
