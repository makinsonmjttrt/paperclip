# Milestones: FourPointZero AI Agent Company

## Completed Milestones

### v2.0: Conducting AI Scale (2026-04-04)

**Goal:** Expand from 10 to 14 agents with department brains, delegation chains, cross-department event bus, sub-agent teams, and data gating.

**Phases:** 11-15 (5 phases)
**Requirements:** 30 requirements, all complete
**Last phase:** Phase 15 (Sub-Agent Teams)

**What shipped:**
- 4 new specialist agents (LinkedIn Content, LinkedIn Outreach, Content Producer, Quality Reviewer)
- Department brains (business + tech BRAIN.md with 200-line cap and rotation)
- 3-tier stall detection (heads monitor reports, CEO monitors heads)
- Delegation chains with brief passthrough and 3-hop limit
- Cross-department event bus with x-dept labels, templates, rate limiting, approval gates
- Data Scope sections for all agents (advisory gating)
- CEO event bus monitoring and chain-of-command routing table
- Heartbeat stagger and MEMORY.md checkpoint recovery

**Key decisions:**
- Stay on Paperclip only (no external orchestration)
- Product Owner stays under CEO (cross-stream)
- Quality gate moved from Technical Writer to Quality Reviewer
- Advisory data gating (no enforcement, Paperclip limitation)

### v1.0: 10-Agent Company (2026-04-02 — 2026-04-03)

**Goal:** Transform 71 existing Claude Code skills into a fully operational 10-agent Paperclip company.

**Phases:** 0-10 (12 phases total)
**Requirements:** 73 v1 requirements, all complete
**Last phase:** Phase 10 (Validation)

**What shipped:**
- 10 agents configured (CEO, CMO, CTO, Product Owner, Technical Writer, Customer Success, UX Researcher, LinkedIn Growth Director, Software Engineer, Code Reviewer)
- 71 skills mapped and adapted to Paperclip format
- Skill ownership matrix with zero overlap
- All agents validated end-to-end via heartbeat

**Key decisions:**
- 9 agents from wizard + 1 LinkedIn Growth Director added manually
- GTM preset with pr-review module
- 11 skill bundles to stay under 10-file-per-agent cap
- CMO stream: 4 agents (Technical Writer, Customer Success, UX Researcher, LinkedIn Growth Director)
- CTO stream: 3 agents (Software Engineer, Product Owner, Code Reviewer)
