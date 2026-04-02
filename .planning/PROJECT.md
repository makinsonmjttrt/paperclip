# FourPointZero AI Agent Company

## What This Is

A Paperclip-orchestrated AI agent company for FourPointZero, a creative tech recruitment firm specialising in AI. Nine agents organised into two streams (business and tech) with 47+ marketing/content skills mapped to specific agent roles. The agents handle content production, competitive intelligence, brand positioning, software development, and product management autonomously.

## Core Value

Every agent knows exactly which skills it owns, and work flows down the hierarchy (CEO → CMO/CTO → Directors) without ambiguity or overlap.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Map all 47 contentfpz skills to the correct agent based on role ownership
- [ ] Write AGENTS.md instructions for each of the 9 Paperclip agents
- [ ] Define skill assignments per agent so capabilities don't overlap
- [ ] Configure heartbeat sections so agents know when to use which skills
- [ ] Ensure the CMO stream covers: LinkedIn, content creation, improvement, strategy, research, SEO, conversion, sales
- [ ] Ensure the CTO stream covers: software engineering, code review, product management, quality
- [ ] CEO agent routes instructions to the right department head
- [ ] Agent instruction files deploy to ~/.paperclip/instances/default/companies/FourPointZero/agents/

### Out of Scope

- Building new skills — only mapping existing 47 skills to agents
- Modifying Paperclip core — working within its flat reporting structure
- Multi-layer delegation chains — Paperclip doesn't support true hierarchical delegation yet
- n8n workflow configuration — separate from agent skill mapping

## Context

- Paperclip company "FourPointZero" already provisioned (ID: c86bff2f-e63b-4982-8a0d-aa4b50fc82a5)
- 9 agents created via Company Wizard with GTM preset + pr-review module
- Agent directories exist at ~/.paperclip/instances/default/companies/FourPointZero/agents/
- Skills live at /Users/martynmakinson/Documents/fourpointzero/.claude/skills/ and ~/.claude/skills/
- contentfpz is the master router skill that auto-detects task type and invokes the right sub-skill
- The "Headcount Zero" book recommends starting with 3 agents but user wants full 9-agent build

## Constraints

- **Platform**: Paperclip with claude_local adapter (Claude Sonnet 4.6)
- **Hierarchy**: All agents report to CEO (flat in Paperclip), logical hierarchy via instructions only
- **Skills**: 47 existing skills from contentfpz inventory — no new skills to build
- **Machine**: Single local machine running all agents — practical limit of 2-3 concurrent

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| GTM preset with pr-review | Covers both business (marketing/competitive) and tech (code review) streams | — Pending |
| 9 agents not 3 | User wants full build despite book recommendation of starting with 3 | — Pending |
| CMO owns business stream | CreativAI, LinkedIn, newsletter, competitive intel all under one head | — Pending |
| CTO/CPO owns tech stream | ADHD EF system, internal tooling, product decisions under one head | — Pending |
| Skills mapped by role not duplicated | Each skill assigned to exactly one agent to prevent overlap | — Pending |

---
*Last updated: 2026-04-02 after initialization*
