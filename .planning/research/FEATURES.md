# Feature Landscape

**Domain:** Paperclip AI Agent Skill Mapping
**Researched:** 2026-04-02

## Table Stakes

Features that must work for the agent company to be functional.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Each agent has a complete AGENTS.md | Without it, agents don't know who they are or what to do | Low | Template exists from CMO/CEO examples |
| Skills assigned to exactly one agent | Overlap causes duplicate/conflicting work | Medium | Requires careful categorisation of 47 skills |
| Heartbeat sections reference skills | Agents need to know WHEN to invoke skills during work | Medium | CEO heartbeat is the model; others are minimal |
| Skill files adapted for headless execution | Claude Code skills assume interactive sessions | High | Every skill needs input/output rewrite |
| CEO can route work to correct agent | Without routing, work lands on wrong agent or nobody | Low | Issue assignment via API handles this |
| humanizer runs as final pass | All FPZ content must strip AI signals | Low | Reference in each content-producing agent's instructions |

## Differentiators

Features that make this agent company more effective than manual skill invocation.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Skill ownership matrix | Single source of truth for which agent owns which skill | Low | Markdown table, version controlled |
| Fallback skill chains | If primary agent is down, CEO or peer can cover | Medium | Pattern exists (CEO fallbacks); extend to other agents |
| Heartbeat-driven skill triggers | Agents proactively use skills when conditions match | High | Needs custom heartbeat sections per agent |
| Cross-agent handover protocols | Content flows from creation to editing to publishing | Medium | @-mention patterns in heartbeat handover sections |
| Skill adaptation templates | Reusable pattern for converting Claude Code skills | Medium | Build once, apply 47 times |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| contentfpz router in Paperclip | Paperclip uses issue assignment for routing, not a meta-router | Assign issues to the right agent directly |
| New skills | Out of scope. Only map existing 47 | If a gap is found, note it but don't build |
| Multi-level delegation | Paperclip is flat. CMO cannot delegate to a sub-agent | Use issue assignment with @-mentions to simulate |
| Automated skill sync | Over-engineering for 47 skills that change rarely | Manual copy with a deploy script |
| Agent-to-agent real-time chat | Paperclip uses async issue comments, not chat | Keep coordination on issues |

## Feature Dependencies

```
Skill ownership matrix        --> Skill file creation (must know WHO before writing files)
Skill file creation           --> AGENTS.md skill references (files must exist to reference)
AGENTS.md skill references    --> Heartbeat section updates (skills must be referenced before triggering)
Heartbeat section updates     --> Cross-agent handover protocols (agents must know their work before handing off)
Skill adaptation template     --> Skill file creation (template speeds up the 47-skill adaptation)
```

## MVP Recommendation

Prioritise:
1. **Skill ownership matrix** - decide which agent owns which skill (blocking everything else)
2. **Skill adaptation template** - create the reusable pattern for converting Claude Code to Paperclip format
3. **AGENTS.md updates for all 9 agents** - inject skill references into each agent's control file
4. **Heartbeat updates for CMO stream** - CMO stream has the most skills and most value

Defer:
- Fallback skill chains beyond CEO (nice-to-have, not blocking)
- Heartbeat-driven proactive triggers (agents can work from issue assignment first)
- Cross-agent handover protocols (can be added after basic skill assignment works)
