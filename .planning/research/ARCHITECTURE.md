# Architecture Patterns

**Domain:** Paperclip AI Agent Skill Mapping
**Researched:** 2026-04-02

## System Architecture

```
Board (You)
    |
    v
Paperclip API (issue creation, assignment, heartbeats)
    |
    v
CEO Agent (routes, delegates, fallback coverage)
    |
    +--- CMO (marketing strategy, LinkedIn, brand, positioning)
    |       |--- Content skills (~12)
    |
    +--- Customer Success (customer-facing content, research, sales)
    |       |--- Content skills (~6)
    |
    +--- UX Researcher / Growth (SEO, CRO, paid, growth)
    |       |--- Growth skills (~12)
    |
    +--- CTO (architecture, standards)
    |       |--- No content skills
    |
    +--- Engineer (code, infra)
    |       |--- Dev skills (~5)
    |
    +--- Code Reviewer (PR review, quality)
    |       |--- Review skills (~3)
    |
    +--- Product Owner (backlog, prioritisation)
    |       |--- Product skills (~3)
    |
    +--- Technical Writer (editing, humanising, docs)
            |--- Writing quality skills (~4)
```

**Key:** Hierarchy is logical only. In Paperclip, all agents report to CEO in a flat structure. The tree above represents SKILL OWNERSHIP domains, not delegation chains.

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| AGENTS.md | Identity, principles, skill loading, doc references | Read by agent on every wake |
| HEARTBEAT.md | Execution loop, task processing, handover rules | Drives agent behaviour each cycle |
| SOUL.md | Persona, voice, tone | Shapes output quality |
| TOOLS.md | Tool access declarations | Enables/restricts agent capabilities |
| skills/*.md | Individual skill instructions | Invoked during work phase of heartbeat |
| Paperclip API | Issue CRUD, agent status, checkout/checkin | All agents use for coordination |

## Data Flow: Issue to Deliverable

```
1. Board creates issue in Paperclip
2. Issue assigned to agent (manually or by CEO/PO)
3. Agent wakes on heartbeat
4. Agent reads HEARTBEAT.md, follows checklist
5. Agent queries assigned issues via API
6. Agent checks out issue (POST /api/issues/{id}/checkout)
7. Agent reads issue description (this is the "prompt")
8. Agent determines which skill to apply (from its AGENTS.md skill list)
9. Agent follows skill instructions to produce deliverable
10. Agent writes deliverable to workspace as markdown
11. Agent comments on issue with link to deliverable
12. Agent @-mentions next agent for review/handover
13. Agent updates issue status
```

## Patterns to Follow

### Pattern 1: Single Responsibility per Agent
**What:** Each agent owns a distinct skill domain. No skill appears in two agents' AGENTS.md.
**When:** Always. This is the core design principle.
**Why:** Prevents duplicate work, conflicting outputs, and wasted compute.

### Pattern 2: Skill File as Self-Contained Instruction
**What:** Each skill markdown file contains everything the agent needs to execute that skill. No external dependencies beyond `$AGENT_HOME` and the workspace.
**When:** Every skill file.
**Why:** Agents are stateless between heartbeats. They cannot remember context from previous runs. Everything must be in the skill file or explicitly referenced.

### Pattern 3: Fallback with Guardrails
**What:** CEO (and optionally peer agents) get `.fallback.md` versions of critical skills. These are scoped-down versions that only activate when the primary owner is absent.
**When:** For skills where coverage matters (brand identity, market analysis, backlog health).
**Why:** Prevents work from stalling when one agent is down. The fallback explicitly says "only if primary owner hasn't acted."

### Pattern 4: Heartbeat-Driven Skill Selection
**What:** Heartbeat sections tell agents WHEN to apply skills. The work phase references skill categories rather than individual skills.
**When:** For agents with many skills that apply to different issue types.
**Why:** Without this, agents with 12+ skills won't know which one to use for a given issue.

Example heartbeat addition:
```markdown
## 3. Skill Selection

When working on an issue, match the issue labels to your skills:

- Label `linkedin` -> Use linkedin-post-writer or linkedin-content-strategy
- Label `seo` -> Use seo-audit or ai-seo
- Label `email` -> Use cold-email or email-sequence
- If no label matches, read the issue description and select the closest skill.
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Mega-Agent
**What:** Loading 30+ skills onto one agent (e.g., putting everything on CMO).
**Why bad:** Context window bloat. Agent performance degrades when AGENTS.md references too many skill files. Each `Read and follow:` directive loads content.
**Instead:** Split skills across agents by domain. CMO gets strategy; others get execution.

### Anti-Pattern 2: Duplicating the contentfpz Router
**What:** Creating a Paperclip version of the interactive skill router.
**Why bad:** Paperclip's issue assignment system IS the router. Adding a meta-router creates indirection.
**Instead:** Use issue labels and agent assignment to route work to the right agent.

### Anti-Pattern 3: Skills That Ask the User
**What:** Leaving Claude Code interactive prompts ("What are you working on?") in Paperclip skill files.
**Why bad:** No user is present during heartbeat execution. The agent will stall.
**Instead:** Adapt all skills to read context from the issue description, not interactive prompts.

### Anti-Pattern 4: Shared Mutable State
**What:** Multiple agents writing to the same file or document.
**Why bad:** Race conditions. Agent A overwrites Agent B's work.
**Instead:** Each agent writes to its own deliverable file. Handover is via issue comments with file paths.

## Scaling Considerations

Not relevant for this project. 9 agents on one machine with 2-3 concurrent is the ceiling. The constraint is Claude API cost and context window, not infrastructure scale.
