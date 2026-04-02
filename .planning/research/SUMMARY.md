# Research Summary: FourPointZero AI Agent Company

**Domain:** Paperclip agent skill mapping (configuration, not software)
**Researched:** 2026-04-02
**Overall confidence:** HIGH

## Executive Summary

This project maps 47 existing Claude Code marketing/content skills to 9 Paperclip AI agents. The work is configuration, not code. Every agent follows an identical file structure: AGENTS.md (instructions), HEARTBEAT.md (execution loop), SOUL.md (persona), TOOLS.md (tool access), and a skills/ directory containing markdown skill files.

The Paperclip platform handles orchestration (issue assignment, heartbeats, agent coordination via API). The gap is that most agents have zero or minimal skills assigned. The CMO has 3 skills, the CTO has 0, and the Engineer has 2. Meanwhile, 47 skills sit in Claude Code format waiting to be adapted and distributed.

The core challenge is threefold: (1) deciding which agent owns which skill, (2) adapting Claude Code skills from interactive format to headless Paperclip format, and (3) updating each agent's instruction files to reference and trigger the right skills.

The biggest risk is context window overload. Loading 15+ skill files into a single agent's AGENTS.md degrades performance. Skills must be distributed across agents so no single agent carries more than ~10.

## Key Findings

**Stack:** Paperclip framework with claude_local adapter. 4-file + skills-directory structure per agent. Skills injected as `Read and follow:` directives in AGENTS.md.

**Architecture:** Flat hierarchy (all agents report to CEO). Logical hierarchy simulated via issue assignment and @-mentions. Each skill owned by exactly one agent.

**Critical pitfall:** Context window overload from loading too many skills per agent. Cap at ~10 skill files each.

## Implications for Roadmap

Based on research, suggested phase structure:

1. **Skill Ownership Matrix** - Assign all 47 skills to agents
   - Addresses: The core mapping requirement
   - Avoids: Skill overlap pitfall (Pitfall 3)
   - Output: A single markdown table mapping skill to agent with rationale

2. **Skill Adaptation Template** - Create the reusable pattern for converting skills
   - Addresses: Interactive-to-headless conversion (Pitfall 2)
   - Avoids: Over-adaptation (Pitfall 8), inconsistent naming (Pitfall 9)
   - Output: A template + checklist for skill conversion

3. **Agent Configuration (CMO Stream)** - Adapt and deploy skills for business agents
   - Addresses: CMO, Customer Success, UX Researcher skill files
   - Avoids: Context window overload by distributing across 3-4 agents (Pitfall 1)
   - Output: Updated AGENTS.md, HEARTBEAT.md, and skills/ for each business agent

4. **Agent Configuration (CTO Stream)** - Adapt and deploy skills for tech agents
   - Addresses: CTO, Engineer, Code Reviewer, Product Owner, Technical Writer
   - Output: Updated files for each tech agent

5. **Validation** - Run test issues through each agent
   - Addresses: Verifying the configuration works in practice
   - Avoids: Discovering problems at scale (Pitfall 2 detection)

**Phase ordering rationale:**
- Phase 1 must be first because every other phase depends on knowing which agent owns which skill
- Phase 2 before 3 and 4 because the template makes batch adaptation faster and more consistent
- CMO stream (Phase 3) before CTO stream (Phase 4) because it has 40+ of the 47 skills and delivers the most value
- Validation (Phase 5) last because you need configured agents to test

**Research flags for phases:**
- Phase 1: Standard decision-making, unlikely to need deeper research
- Phase 3: May need research into Paperclip heartbeat best practices for skill selection logic
- Phase 5: May need research into Paperclip testing/dry-run capabilities

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Direct file inspection. No guessing. |
| Features | HIGH | Requirements are clear from PROJECT.md |
| Architecture | HIGH | Paperclip patterns observed directly from existing agent configs |
| Pitfalls | MEDIUM | Based on patterns observed + general LLM context window knowledge. No post-mortems from other Paperclip deployments to reference |

## Gaps to Address

- **TOOLS.md configuration:** Currently empty for all agents. Will need populating for agents that need web search, file system, or API access. Not blocking skill mapping but needed for full agent functionality.
- **Paperclip heartbeat frequency:** Unknown how often agents wake. Affects whether skill-heavy agents will have enough cycles.
- **Claude API cost implications:** 9 agents, each loading 5-10 skill files on every heartbeat, all hitting claude_local. No cost modelling done.
- **Exact skill count per agent:** The ~47 number from contentfpz is approximate. The CLAUDE.md lists more skills (CRO variants, blog engine, etc.). Final count needs a precise audit during Phase 1.
