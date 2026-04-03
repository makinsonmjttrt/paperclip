# Roadmap: FourPointZero AI Agent Company

## Overview

Transform 71 existing Claude Code skills into a fully operational 10-agent Paperclip company. The work flows from deciding ownership (who gets what) through adaptation (converting skills to headless format) through agent configuration (wiring each agent) to validation (proving it works). Every phase delivers a verifiable capability: either a complete agent or a foundational artifact that unblocks downstream agents.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 0: Housekeeping** - Delete old FPZ company, create product-marketing-context (2026-04-02)
- [x] **Phase 1: Skill Ownership Matrix** - Map all 71 skills to exactly one agent with zero overlap (2026-04-02)
- [x] **Phase 2: Skill Adaptation Template** - Create reusable pattern for converting Claude Code skills to Paperclip format (2026-04-02)
- [x] **Phase 3: CEO and Product Owner** - Configure the two proactive agents that drive and prioritise work (2026-04-02)
- [x] **Phase 4: CMO Agent** - Configure the business stream head with marketing strategy skills (2026-04-02)
- [ ] **Phase 5: CMO Stream Skill Deployment** - Adapt and deploy 30+ marketing skills to the business stream
- [x] **Phase 6: CTO Agent** - Configure the tech stream head with engineering oversight (2026-04-02)
- [ ] **Phase 7: Technical Writer** - Configure the content quality gate agent
- [x] **Phase 8: Customer Success and UX Researcher** - Configure competitive intel and growth agents (completed 2026-04-02)
- [x] **Phase 8.5: LinkedIn Growth Director** - Configure dedicated LinkedIn agent under CMO stream (2026-04-02)
- [ ] **Phase 9: Engineer and Code Reviewer** - Configure the dev stream workers as a pair
- [ ] **Phase 10: Validation** - Test issues through each agent to prove the company works

## Phase Details

### Phase 0: Housekeeping
**Goal**: Clean slate - remove old FPZ company, create product-marketing-context, prepare for new company build
**Depends on**: Nothing
**Requirements**: HSKP-01, HSKP-02, HSKP-03
**Success Criteria** (what must be TRUE):
  1. Old FPZ company deleted from Paperclip (after confirming no data needs preserving)
  2. Chat Assistant agent removed or recreated under FourPointZero
  3. Product-marketing-context.md exists with current FPZ/CreativAI positioning, audience, voice
**Plans**: 1 plan

Plans:
- [ ] 00-01: Delete old FPZ company, create product-marketing-context.md

### Phase 1: Skill Ownership Matrix
**Goal**: Every skill is assigned to exactly one agent, with a single source of truth document
**Depends on**: Nothing (first phase)
**Requirements**: SOWN-01, SOWN-02, SOWN-03, SOWN-04, SOWN-05, SOWN-06, SOWN-07, SOWN-08, SOWN-09, SOWN-10, SOWN-11, SOWN-12, SOWN-13, SOWN-14, SOWN-15, SOWN-16, SOWN-17, SOWN-18, SOWN-19
**Success Criteria** (what must be TRUE):
  1. A skill ownership matrix exists as a markdown table mapping all 73 skills to agents
  2. No skill is assigned to more than one agent
  3. No agent has more than 10 skills assigned
  4. Zero unmapped skills remain (verified by count against the full inventory)
  5. Cross-cutting skills (humanizer, contentfpz router) have clear primary/secondary ownership rules
**Plans**: 2 plans

Plans:
- [ ] 01-01: Audit and inventory all 71 skills from both sources (CLAUDE.md and contentfpz)
- [ ] 01-02: Assign skills to agents and validate coverage constraints

### Phase 2: Skill Adaptation Template
**Goal**: A reusable template and checklist exists so any Claude Code skill can be converted to Paperclip format consistently
**Depends on**: Phase 1
**Requirements**: ADPT-01, ADPT-02, ADPT-03
**Success Criteria** (what must be TRUE):
  1. A template file exists showing the standard structure for a Paperclip skill
  2. The template includes replacement patterns for interactive prompts (replaced with issue-driven triggers)
  3. A conversion checklist exists that can be applied to any skill file
**Plans**: 1 plan

Plans:
- [ ] 02-01: Create adaptation template and conversion checklist

### Phase 3: CEO and Product Owner
**Goal**: The CEO can route work to the correct department head and the Product Owner can manage cross-stream prioritisation
**Depends on**: Phase 1
**Requirements**: CEO-01, CEO-02, CEO-03, CEO-04, POWN-01, POWN-02, POWN-03
**Success Criteria** (what must be TRUE):
  1. CEO AGENTS.md contains FPZ-specific routing instructions that reference the skill ownership matrix
  2. CEO HEARTBEAT.md contains delegation logic for both CMO and CTO streams
  3. Product Owner AGENTS.md contains backlog management context for both streams
  4. Product Owner HEARTBEAT.md contains cross-stream prioritisation logic
**Plans**: 2 plans

Plans:
- [ ] 03-01: Configure CEO agent (AGENTS.md, SOUL.md, HEARTBEAT.md, contentfpz router reference)
- [ ] 03-02: Configure Product Owner agent (AGENTS.md, HEARTBEAT.md, project context)

### Phase 4: CMO Agent
**Goal**: The CMO agent is fully configured as the business stream head with marketing strategy skills
**Depends on**: Phase 1, Phase 3
**Requirements**: CMO-01, CMO-02, CMO-03, CMO-04
**Success Criteria** (what must be TRUE):
  1. CMO AGENTS.md references 8-10 primary marketing strategy skills
  2. CMO SOUL.md contains FPZ CreativAI positioning context
  3. CMO HEARTBEAT.md contains content production oversight logic
  4. Product-marketing-context.md is referenced in CMO configuration
**Plans**: 1 plan

Plans:
- [ ] 04-01: Configure CMO agent (AGENTS.md, SOUL.md, HEARTBEAT.md, product-marketing-context)

### Phase 5: CMO Stream Skill Deployment
**Goal**: All 30+ marketing and content skills are adapted from Claude Code format and deployed to the correct business stream agents
**Depends on**: Phase 2, Phase 4
**Requirements**: ADPT-04, ADPT-06, ADPT-07, ADPT-08
**Success Criteria** (what must be TRUE):
  1. All CMO stream skills are converted to Paperclip format using the adaptation template
  2. Cross-cutting skills (humanizer, contentfpz router) are adapted and deployed
  3. Skills unique to contentfpz (21 skills) are adapted and deployed
  4. Skills unique to CLAUDE.md (28 skills) are adapted and deployed
  5. No adapted skill contains interactive prompts
**Plans**: 4 plans

Plans:
- [ ] 05-01-PLAN.md -- Adapt and deploy 7 CMO-owned marketing strategy skills
- [ ] 05-02-PLAN.md -- Adapt and deploy cross-cutting quality gate skills (humanizer, de-ai-ify, copy-editing)
- [ ] 05-03-PLAN.md -- Adapt and deploy Technical Writer + Customer Success skills (16 files)
- [ ] 05-04-PLAN.md -- Adapt and deploy UX Researcher skills + stage LinkedIn Growth Director skills (13 files)

### Phase 6: CTO Agent
**Goal**: The CTO agent is configured as the tech stream head with engineering oversight
**Depends on**: Phase 1, Phase 3
**Requirements**: CTO-01, CTO-02, CTO-03
**Success Criteria** (what must be TRUE):
  1. CTO AGENTS.md contains technical leadership skills and references
  2. CTO SOUL.md contains FPZ tech stack context (Next.js, Vercel, Notion, n8n)
  3. CTO HEARTBEAT.md contains engineering oversight logic
**Plans**: 1 plan

Plans:
- [ ] 06-01: Configure CTO agent (AGENTS.md, SOUL.md, HEARTBEAT.md)

### Phase 7: Technical Writer
**Goal**: The Technical Writer agent operates as a content quality gate with humanizer enforcement
**Depends on**: Phase 5
**Requirements**: TWRT-01, TWRT-02, TWRT-03, TWRT-04
**Success Criteria** (what must be TRUE):
  1. Technical Writer AGENTS.md references content production skills (blog, newsletter, social)
  2. Humanizer, de-ai-ify, and copy-editing are assigned as quality gate skills
  3. HEARTBEAT.md contains a content review pass that enforces humanizer on all output
  4. Blog engine skills (blog-write, blog-rewrite, blog-analyse, blog-repurpose) are wired in
**Plans**: 1 plan

Plans:
- [ ] 07-01: Configure Technical Writer agent (AGENTS.md, HEARTBEAT.md, quality gate skills, blog engine)

### Phase 8: Customer Success and UX Researcher
**Goal**: Competitive intelligence and growth/conversion agents are operational
**Depends on**: Phase 5
**Requirements**: CSUC-01, CSUC-02, CSUC-03, CSUC-04, UXRS-01, UXRS-02, UXRS-03, UXRS-04
**Success Criteria** (what must be TRUE):
  1. Customer Success AGENTS.md references competitive intelligence skills (competitor-alternatives, customer-research, reddit-insights, last30days)
  2. Customer Success has testimonial-collector and ai-discoverability-audit assigned
  3. UX Researcher AGENTS.md references all CRO skills and SEO skills
  4. Both agents have HEARTBEAT.md sections for their monitoring/audit cycles
**Plans**: 2 plans

Plans:
- [x] 08-01: Configure Customer Success agent (AGENTS.md, HEARTBEAT.md, competitive intel skills)
- [ ] 08-02: Configure UX Researcher agent (AGENTS.md, HEARTBEAT.md, CRO/SEO/growth skills)

### Phase 8.5: LinkedIn Growth Director (INSERTED)
**Goal**: A dedicated LinkedIn agent owns all LinkedIn skills and manages content calendar, profile optimisation, and outreach
**Depends on**: Phase 5
**Requirements**: LNKD-01, LNKD-02, LNKD-03, LNKD-04, LNKD-05
**Success Criteria** (what must be TRUE):
  1. LinkedIn Growth Director agent created in Paperclip under CMO stream
  2. AGENTS.md references all LinkedIn skills (post-writer, content-strategy, authority-builder, profile-optimizer)
  3. Outreach skills (cold-outreach-sequence, meeting-prep) assigned
  4. SOUL.md contains FPZ LinkedIn persona with CreativAI positioning
  5. HEARTBEAT.md contains LinkedIn content calendar and engagement workflow
**Plans**: 1 plan

Plans:
- [x] 08.5-01: Create and configure LinkedIn Growth Director agent

### Phase 9: Engineer and Code Reviewer
**Goal**: The dev stream workers are configured and CTO stream skills are adapted and deployed
**Depends on**: Phase 2, Phase 6
**Requirements**: ENGR-01, ENGR-02, ENGR-03, CREV-01, CREV-02, ADPT-05
**Success Criteria** (what must be TRUE):
  1. Engineer AGENTS.md contains FPZ project context (ADHD EF system, internal tooling)
  2. Engineer HEARTBEAT.md contains implementation workflow
  3. Code Reviewer AGENTS.md contains FPZ code quality standards
  4. Code Reviewer HEARTBEAT.md contains PR review workflow with handoff to Engineer
  5. All CTO stream skills are adapted to Paperclip format and deployed
**Plans**: 2 plans

Plans:
- [x] 09-01: Configure Engineer and Code Reviewer agents (AGENTS.md, SOUL.md, HEARTBEAT.md)
- [x] 09-02: Adapt and deploy CTO stream skills

### Phase 10: Validation
**Goal**: Every agent picks up and processes assigned work correctly on heartbeat
**Depends on**: All previous phases
**Requirements**: VALD-01, VALD-02, VALD-03, VALD-04, VALD-05, VALD-06
**Success Criteria** (what must be TRUE):
  1. CEO receives a test issue and delegates it to the correct department head
  2. CMO receives a content production issue and produces a deliverable using the right skill
  3. Technical Writer receives content and runs a quality gate pass including humanizer
  4. Software Engineer receives a technical issue and follows the implementation workflow
  5. All 10 agents process at least one test issue on heartbeat without stalling
  6. LinkedIn Growth Director produces a LinkedIn post and outreach sequence from test issue
**Plans**: 2 plans

Plans:
- [x] 10-01-PLAN.md -- Approve agents, create LinkedIn Growth Director, create business stream test issues
- [ ] 10-02-PLAN.md -- Create tech stream test issues, run all 10 heartbeats, validate results

## Progress

**Execution Order:**
Phases execute in numeric order: 0 > 1 > 2 > 3 > 4 > 5 > 6 > 7 > 8 > 8.5 > 9 > 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 0. Housekeeping | 0/1 | Not started | - |
| 1. Skill Ownership Matrix | 2/2 | Complete | 2026-04-02 |
| 2. Skill Adaptation Template | 1/1 | Complete | 2026-04-02 |
| 3. CEO and Product Owner | 2/2 | Complete | 2026-04-02 |
| 4. CMO Agent | 1/1 | Complete | 2026-04-02 |
| 5. CMO Stream Skill Deployment | 3/4 | In Progress|  |
| 6. CTO Agent | 1/1 | Complete | 2026-04-02 |
| 7. Technical Writer | 1/1 | Complete | 2026-04-02 |
| 8. Customer Success and UX Researcher | 2/2 | Complete   | 2026-04-02 |
| 8.5. LinkedIn Growth Director | 1/1 | Complete    | 2026-04-02 |
| 9. Engineer and Code Reviewer | 2/2 | Complete | 2026-04-02 |
| 10. Validation | 1/2 | In Progress | - |
