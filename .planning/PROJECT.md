# FourPointZero AI Agent Company

## What This Is

A Paperclip-orchestrated AI agent company for FourPointZero, a creative tech recruitment firm specialising in AI. 10 agents organised into two streams (business and tech) with 71 marketing/content/engineering skills mapped to specific agent roles. The agents handle content production, competitive intelligence, brand positioning, software development, and product management autonomously.

## Core Value

Every agent knows exactly which skills it owns, and work flows down the hierarchy (CEO > CMO/CTO > Directors) without ambiguity or overlap.

## Current Milestone: v2.0 Conducting AI Scale

**Goal:** Expand the 10-agent company toward the Conducting AI vision with department brains, sub-agent teams, cross-department handoffs, and delegation chains, all within Paperclip's architecture.

**Target features:**
- Department knowledge bases (shared context per stream)
- Sub-agent team expansion (LinkedIn team specialists, content production team)
- Cross-department event bus (CMO triggers CTO work and vice versa)
- True delegation chains (CMO manages directors, not just CEO routing)
- Data gating (departments see only their relevant context)

## Requirements

### Validated

- Skill ownership matrix with zero overlap across 10 agents (v1.0)
- 71 skills adapted from Claude Code to Paperclip format (v1.0)
- All 10 agents configured with FPZ-specific context, skills, heartbeat logic (v1.0)
- CEO routing, CMO/CTO stream delegation, quality gate enforcement (v1.0)
- End-to-end heartbeat validation across all agents (v1.0)

### Active

- [ ] Department brains: shared knowledge bases per stream
- [ ] Sub-agent teams: expand LinkedIn Director into specialist team
- [ ] Cross-department handoffs: CMO can trigger CTO work with context
- [ ] Delegation chains: CMO truly manages directors
- [ ] Data gating: departments see only their relevant context

### Out of Scope

- Building new skills outside of agent orchestration
- Modifying Paperclip core source code
- Moving off Paperclip to Relevance AI or Make.com
- Running 150+ agents (machine resource constraint)
- Real-time agent-to-agent messaging (Paperclip doesn't support it)

## Context

- Paperclip company "FourPointZero" operational (ID: c86bff2f-e63b-4982-8a0d-aa4b50fc82a5)
- 10 agents validated end-to-end in v1.0
- Agent directories at ~/.paperclip/instances/default/companies/FourPointZero/agents/
- Skills at /Users/martynmakinson/Documents/fourpointzero/.claude/skills/ and agent skill dirs
- Conducting AI reference architecture: multi-layer delegation, department brains, event bus
- Paperclip constraints: flat reportsTo, no data isolation, async task passing only
- All workarounds must use Paperclip's existing primitives (issues, skills, agent files, heartbeats)

## Constraints

- **Platform**: Paperclip only (no Relevance AI, no Make.com, no external orchestration)
- **Machine**: Single local machine, 2-3 concurrent agents practical max
- **Communication**: Async task passing via issues only (no real-time messaging)
- **Storage**: No built-in per-department memory (must use file-based workarounds)
- **Agents**: Paperclip's flat reportsTo structure (hierarchy via instructions only)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| GTM preset with pr-review | Covers both business and tech streams | Good |
| 10 agents (9 wizard + 1 manual) | Full org chart including LinkedIn Growth Director | Good |
| CMO owns business stream | CreativAI, LinkedIn, newsletter, competitive intel all under one head | Good |
| CTO/CPO owns tech stream | ADHD EF system, internal tooling, product decisions under one head | Good |
| Skills mapped by role not duplicated | Each skill assigned to exactly one agent | Good |
| Stay on Paperclip for v2.0 | Push platform as far as it goes with creative workarounds before considering alternatives | Pending |
| Full Conducting AI vision | Department brains, sub-agent teams, event bus, delegation chains, data gating | Pending |

---
*Last updated: 2026-04-03 after v2.0 milestone start*
