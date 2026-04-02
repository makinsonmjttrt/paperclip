# Technology Stack

**Project:** FourPointZero AI Agent Company (Paperclip Skill Mapping)
**Researched:** 2026-04-02

## Platform: Paperclip Agent Framework

Paperclip is the orchestration layer. It provisions agents, manages heartbeats, handles issue assignment, and provides an API for inter-agent coordination. All agents run via `claude_local` adapter (Claude Sonnet 4.6) on a single machine.

The project is NOT about building software. It is about configuring 9 Paperclip agents with the right instruction files and skill mappings so 47 existing Claude Code skills route to the correct agent without overlap.

## Paperclip Agent File Structure

Every agent lives at `~/.paperclip/instances/default/companies/FourPointZero/agents/{agent-slug}/` and follows an identical four-file + skills-directory structure:

```
agents/{agent-slug}/
  AGENTS.md      # Primary instruction file (identity, principles, skill references, shared docs)
  HEARTBEAT.md   # Execution checklist run on every wake cycle
  SOUL.md        # Persona definition (philosophy, voice, tone)
  TOOLS.md       # Tool access declarations (currently empty for most agents)
  skills/        # Skill markdown files local to this agent
```

### AGENTS.md (The Control File)

This is the master instruction document. Structure observed across all existing agents:

| Section | Purpose | Required |
|---------|---------|----------|
| Identity line | "You are the [Role]." | Yes |
| Home directory | Points to `$AGENT_HOME` | Yes |
| Reporting line | "You report to the CEO." | Yes |
| Core Principles | 3-5 bullet points defining how this agent operates | Yes |
| Safety Considerations | Guardrails (no secrets, no destructive commands) | Yes |
| References | Pointers to HEARTBEAT.md, SOUL.md, TOOLS.md | Yes |
| Skills section | `Read and follow: $AGENT_HOME/skills/{skill-name}.md` lines | Yes |
| Shared Documentation | `Read: docs/{doc}.md` lines | Yes |

**Critical pattern:** Skills are injected into AGENTS.md as `Read and follow:` directives. Each line points to a markdown file in the agent's local `skills/` directory. The comment `<!-- Skills are appended here by modules during company assembly -->` marks the injection point.

### HEARTBEAT.md (The Execution Loop)

Defines what the agent does on every wake cycle. Standard sections:

1. **Identity and Context** - Confirm agent ID via API, check wake reason
2. **Get Assignments** - Query issues assigned to this agent
3. **Checkout and Work** - Claim a task via API, do the work, update status
4. **Handover** - Mention the right person when work is ready for review
5. **Exit** - Comment on in-progress work, exit cleanly

CEO has additional sections: Local Planning Check, Approval Follow-Up, Delegation, Fact Extraction, Backlog Health (Fallback), Assignment Check (Fallback), Stall Detection.

**For skill mapping:** Heartbeat sections tell agents WHEN to use skills. A heartbeat step like "When producing marketing deliverables, write them as markdown documents" triggers the agent to invoke its assigned skills during the work phase.

### SOUL.md (The Persona)

Defines personality, philosophy, voice and tone. Not directly relevant to skill mapping, but matters for output quality. Each agent's soul should reflect the kind of work their skills produce.

### TOOLS.md (Tool Access)

Currently empty (`(Your tools will go here.)`) for most agents. This is where MCP tool access and API permissions get declared. Not a blocker for skill mapping but will need populating later for agents that need web search, file system access, etc.

### skills/ Directory

Contains markdown files that are the actual skill instructions. Two types observed:

| Type | Naming | Purpose |
|------|--------|---------|
| Primary skill | `{skill-name}.md` | This agent owns the skill |
| Fallback skill | `{skill-name}.fallback.md` | Safety net when the primary owner is absent |

Fallback skills are shorter, scoped versions. Example: CEO has `brand-identity.fallback.md` while CMO has `brand-identity.md` (the full version).

## Skill Injection Mechanism

### How Claude Code Skills Become Paperclip Skills

Claude Code skills live at two locations:
- **Global:** `~/.claude/skills/{skill-name}/SKILL.md`
- **Project:** `/Users/martynmakinson/Documents/fourpointzero/.claude/skills/contentfpz/SKILL.md`

Paperclip agent skills live at:
- `~/.paperclip/instances/default/companies/FourPointZero/agents/{agent}/skills/{skill}.md`

**The mapping process is manual.** There is no automation that syncs Claude Code skills into Paperclip agent skill files. Each skill must be:

1. Read from its Claude Code source (`SKILL.md`)
2. Adapted into a Paperclip-compatible skill markdown file (removing Claude Code-specific directives, adding Paperclip coordination patterns)
3. Written to the target agent's `skills/` directory
4. Referenced in the agent's `AGENTS.md` via a `Read and follow:` line

### Adaptation Requirements

Claude Code skills assume a single-agent, interactive session (user types, Claude responds). Paperclip skills must work in a headless, heartbeat-driven context where the agent:
- Wakes on a schedule or task assignment
- Reads an issue description as its "prompt"
- Produces deliverables as markdown files or issue comments
- Hands off to other agents via API

Key adaptations per skill:
- **Input:** Change from "ask the user" to "read from issue description"
- **Output:** Change from "respond in chat" to "write to workspace file, comment on issue"
- **Context:** Add `$AGENT_HOME` references, remove interactive prompts
- **Coordination:** Add handover instructions (who to @-mention when done)

## The 47 Skills to Map

Based on the contentfpz SKILL.md router and CLAUDE.md skill listing, these are the Claude Code skills that need mapping to the 9 agents:

### CMO Stream Skills (Business)

**LinkedIn (4):** linkedin-post-writer, linkedin-content-strategy, linkedin-authority-builder, linkedin-profile-optimizer

**Content Creation (11):** copywriting, cold-email, cold-outreach-sequence, email-sequence, social-content, ad-creative, newsletter-creation-curation, case-study-builder, sales-enablement, social-card-gen, testimonial-collector

**Content Improvement (7):** copy-editing, de-ai-ify, humanizer, homepage-audit, claude-blog:blog-rewrite, claude-blog:blog-analyse, claude-blog:blog-seo-check

**Strategy & Planning (10):** content-idea-generator, content-strategy, marketing-ideas, positioning-basics, marketing-principles, customer-research, reddit-insights, voice-extractor, pricing-strategy, launch-strategy, marketing-psychology, meeting-prep

**SEO & Discovery (6):** seo-audit, ai-seo, ai-discoverability-audit, programmatic-seo, site-architecture, schema-markup, competitor-alternatives

**Conversion (6):** page-cro, signup-flow-cro, onboarding-cro, form-cro, popup-cro, paywall-upgrade-cro

**Paid & Growth (5):** paid-ads, ab-test-setup, free-tool-strategy, lead-magnets, referral-program

**Retention & Revenue (3):** churn-prevention, revops, product-marketing-context

**Blog Engine (4):** claude-blog:blog-write, claude-blog:blog-strategy, claude-blog:blog-repurpose, social-content (repurposing)

**Research & Intel (3):** youtube-summarizer, last30days, daily-briefing-builder

### CTO Stream Skills (Tech)

These come from the existing engineer and code-reviewer agents plus skills that need adding:
- git-workflow, pr-workflow (already on engineer)
- Code review skills (already on code-reviewer via pr-review module)
- Product management skills (product-owner)

## The 9 Agents

| Agent | Slug | Stream | Current Skills | Status |
|-------|------|--------|----------------|--------|
| CEO | ceo | Both | 7 (vision, fallbacks, stall-detection) | Partially configured |
| CMO | cmo | Business | 3 (brand-identity, fallbacks) | Needs 40+ skills |
| CTO | cto | Tech | 0 | Empty |
| Engineer | engineer | Tech | 2 (git-workflow, pr-workflow) | Minimal |
| Code Reviewer | code-reviewer | Tech | Unknown (pr-review module) | Check |
| Product Owner | product-owner | Tech | Unknown | Check |
| Customer Success | customer-success | Business | Unknown | Check |
| Technical Writer | technical-writer | Tech | Unknown | Check |
| UX Researcher | ux-researcher | Business | Unknown | Check |

## Recommended Skill Distribution

Use these principles for mapping:

1. **One owner per skill.** No duplication. If two agents could use a skill, assign to the one whose SOUL.md best matches.
2. **CEO gets fallbacks only.** The CEO should never be the primary owner of execution skills.
3. **CMO does NOT do everything.** Split business skills across CMO, Customer Success, and UX Researcher.
4. **contentfpz router skill stays in Claude Code.** It is an interactive routing layer. Paperclip agents don't need routers because issue assignment handles routing.

### Proposed Distribution

| Agent | Skill Category | Skills Count |
|-------|---------------|-------------|
| **CMO** | LinkedIn, content strategy, brand, launch, positioning, marketing ideas, pricing | ~12 |
| **Content Director** (customer-success or new) | Content creation (copywriting, email, social, ads, blog engine) | ~15 |
| **SEO/Growth Lead** (ux-researcher repurposed) | SEO, CRO, paid ads, lead magnets, growth | ~12 |
| **Customer Success** | customer-research, meeting-prep, testimonials, case studies, sales-enablement | ~6 |
| **CTO** | Architecture decisions, tech standards | 0 direct content skills |
| **Engineer** | git-workflow, pr-workflow + coding skills from ~/.claude/skills/ | ~5 |
| **Code Reviewer** | PR review, code quality | ~3 |
| **Product Owner** | Backlog, prioritisation, product-marketing-context | ~3 |
| **Technical Writer** | copy-editing, de-ai-ify, humanizer, docs | ~4 |

**Note:** The exact mapping is the deliverable of Phase 1 work. This distribution is directional.

## Practical Constraints

| Constraint | Impact | Mitigation |
|-----------|--------|------------|
| Single machine, 2-3 concurrent agents | Cannot run all 9 simultaneously | Stagger heartbeats, prioritise by queue depth |
| Flat Paperclip hierarchy | CEO cannot delegate to CMO who delegates to Content Director | Use issue assignment + @-mentions to simulate hierarchy |
| No skill hot-reload | Changing a skill requires editing the markdown file | Keep skills in version control, deploy via script |
| 47 skills is a lot for adaptation | Each needs manual review and adaptation | Batch by category, template the adaptation |
| `claude_local` adapter only | All agents share one Claude subscription | Cost monitoring needed |

## File Paths Reference

| What | Where |
|------|-------|
| Paperclip agent root | `~/.paperclip/instances/default/companies/FourPointZero/agents/` |
| Claude Code skills (global) | `~/.claude/skills/` |
| Claude Code skills (project) | `/Users/martynmakinson/Documents/fourpointzero/.claude/skills/` |
| contentfpz router | `/Users/martynmakinson/Documents/fourpointzero/.claude/skills/contentfpz/SKILL.md` |
| Company ID | `c86bff2f-e63b-4982-8a0d-aa4b50fc82a5` |

## Sources

- Direct inspection of Paperclip agent files at `~/.paperclip/instances/default/companies/FourPointZero/agents/`
- Claude Code skill inventory at `~/.claude/skills/` (151 skills total, ~47 contentfpz-relevant)
- contentfpz SKILL.md router definition
- CLAUDE.md project configuration with full skill listing
- PROJECT.md requirements and constraints
