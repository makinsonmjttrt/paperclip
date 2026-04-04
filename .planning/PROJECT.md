# FourPointZero AI Agent Company

## What This Is

A Paperclip-orchestrated AI agent company for FourPointZero, a creative tech recruitment firm specialising in AI. 14 agents organised into two streams (business and tech) with 71 marketing/content/engineering skills, department brains, delegation chains, and a cross-department event bus. The agents handle content production, competitive intelligence, brand positioning, software development, and product management autonomously.

## Core Value

Every agent knows exactly which skills it owns, and work flows down the hierarchy (CEO > CMO/CTO > Directors > Specialists) without ambiguity or overlap.

## Current Milestone: v3.0 Hardening

**Goal:** Make the 14-agent company reliable and resilient under real workload. Monitor, measure, self-heal, and consolidate.

**Target features:**
- Agent performance monitoring (which agents deliver, which stall, which are underutilised)
- Self-healing recovery (auto-restart stalled agents, clear deadlocks, recover from errors)
- Workload balancing (redistribute work when agents are overloaded or idle)
- Agent consolidation (merge or retire underperforming agents based on data)
- End-to-end flow testing (prove real work completes the full delegation chain)

## Requirements

### Validated

- Skill ownership matrix with zero overlap across 14 agents (v1.0, v2.0)
- 71 skills adapted from Claude Code to Paperclip format (v1.0)
- 14 agents configured with FPZ-specific context, skills, heartbeat logic (v1.0, v2.0)
- CEO routing through department heads only (v2.0)
- Department brains with write-one-read-many pattern (v2.0)
- Delegation chains with brief passthrough and 3-hop limit (v2.0)
- Cross-department event bus with approval gates and rate limiting (v2.0)
- 3-tier stall detection (heads monitor reports, CEO monitors heads) (v2.0)
- Heartbeat stagger and MEMORY.md checkpoint recovery (v2.0)
- Data scope sections for all agents (advisory gating) (v2.0)

### Active

- [ ] Performance monitoring: track agent output, stall frequency, and utilisation
- [ ] Self-healing: auto-recover from errors, deadlocks, and interrupted heartbeats
- [ ] Workload balancing: redistribute when agents are overloaded or idle
- [ ] Agent consolidation: data-driven decisions on which agents to keep, merge, or retire
- [ ] End-to-end flow testing: prove real work completes delegation chains

### Out of Scope

- Adding more agents (14 is the cap until proven necessary)
- Building new skills outside of agent orchestration
- Modifying Paperclip core source code
- Moving off Paperclip to other platforms
- Running 150+ agents (machine resource constraint)
- Real-time agent-to-agent messaging (Paperclip doesn't support it)

## Context

- Paperclip company "FourPointZero" operational (ID: c86bff2f-e63b-4982-8a0d-aa4b50fc82a5)
- 14 agents validated (10 original + 4 specialists)
- Agent directories at ~/.paperclip/instances/default/companies/FourPointZero/agents/
- Known issues: 4 new agents went to "error" on first heartbeat (self-recovered)
- Known Paperclip bug: deadlock (Issue #2516) detected by CEO stall-detection.md
- All 4 x-dept labels created and placeholder IDs replaced
- Machine constraint: 2-3 concurrent agents practical max

## Constraints

- **Platform**: Paperclip only
- **Machine**: Single local machine, 2-3 concurrent agents practical max
- **Agents**: 14 current, no additions until consolidation data available
- **Monitoring**: Must use Paperclip primitives (issue comments, MEMORY.md, run logs)
- **No enforcement**: Data gating and hierarchy are advisory-only

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| GTM preset with pr-review | Covers both business and tech streams | Good |
| 14 agents (10 + 4 specialists) | Full org chart with sub-agent teams | Good |
| Stay on Paperclip | Push platform before considering alternatives | Good |
| Department brains as markdown files | No built-in knowledge layer in Paperclip | Good |
| Advisory data gating | Paperclip has no file permissions | Accepted limitation |
| Hardening before expansion | User priority: resilience over more agents | Pending |

---
*Last updated: 2026-04-04 after v3.0 milestone start*
