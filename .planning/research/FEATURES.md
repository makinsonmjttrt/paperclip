# Feature Landscape: v2.0 Conducting AI Scale

**Domain:** Multi-agent orchestration scaling (Paperclip platform)
**Researched:** 2026-04-03
**Baseline:** 10 agents, 71 skills, CEO routing, heartbeat execution (v1.0)

## Research Notes

"Conducting AI" is a consulting brand (conducting.ai) that delivers AI-Native Company Designs via FigJam templates. It is NOT a published technical framework with APIs or specs. The terminology in PROJECT.md ("department brains", "event bus", "delegation chains", "data gating") maps to well-established multi-agent orchestration patterns documented across CrewAI, LangGraph, AutoGen, and the broader agent ecosystem. This research draws from those patterns, grounded in Paperclip's actual primitives.

Paperclip's own company-level knowledge layer (issue #1858) is actively in development but not yet shipped. Current Paperclip primitives available: issues (async task passing), heartbeats (scheduled wake cycles), agent files (AGENTS.md, HEARTBEAT.md, SOUL.md), skills (injected at runtime), @-mentions, and company-scoped data isolation.

---

## 1. Department Brains (Shared Knowledge Bases)

### What This Means

A per-stream knowledge repository that all agents within a department (Business or Tech) can read from. Instead of duplicating context across 5 CMO-stream agents, you maintain one "Business Brain" that holds brand voice, positioning, audience profiles, competitive intel, and strategy docs. Same pattern for the Tech stream with architecture decisions, coding standards, and product roadmap.

### Table Stakes

| Feature | Why Expected | Complexity | Dependencies |
|---------|--------------|------------|--------------|
| Stream-level context directory | Without it, every agent duplicates the same context files. Updates require editing 5+ agent dirs | Low | File system only, no Paperclip changes |
| Auto-injection via AGENTS.md references | Agents must be told to read the brain dir. A "Read: ../brain/" instruction in each AGENTS.md | Low | Stream context directory must exist first |
| Brand voice + positioning in Business Brain | CMO, Technical Writer, LinkedIn Director, Customer Success all need identical brand context | Low | Existing product-marketing-context.md becomes seed content |
| Architecture standards in Tech Brain | CTO, Engineer, Code Reviewer, Product Owner need shared tech decisions | Low | Existing coding standards become seed content |

### Differentiators

| Feature | Value Proposition | Complexity | Dependencies |
|---------|-------------------|------------|--------------|
| Brain update protocol | When one agent discovers new intel (e.g. Customer Success finds competitor move), a defined process writes it to the brain so all stream agents see it next heartbeat | Medium | Needs file write conventions + conflict prevention |
| Cross-brain read access | Tech stream can read (not write) Business Brain for product context; Business stream can read Tech Brain for capability awareness | Low | Directory permissions via agent instructions only |
| Brain versioning | Track what changed in department knowledge over time via git commits | Low | Already in a git repo |
| Tiered injection (always-inject vs on-demand) | Some brain docs inject every heartbeat (mission, voice); others only when relevant to the task | Medium | Requires heartbeat instruction changes per agent |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Database-backed knowledge store | Paperclip has no DB layer for agents; over-engineering for 10 agents | Flat markdown files in a shared directory |
| RAG/vector search over brain docs | Overkill at this scale. 10 agents, maybe 20 brain docs total | Direct file reads via explicit paths |
| Real-time brain sync | Paperclip is async. No mechanism for instant propagation | Agents read brain on each heartbeat, eventual consistency is fine |
| Paperclip wiki feature (issue #1858) | Not yet shipped. Dependency on upstream is risky | Build the workaround with files now; adopt wiki feature if/when it ships |

---

## 2. Sub-Agent Teams

### What This Means

Expanding a single agent (e.g. LinkedIn Growth Director) into a team of specialists that collectively handle the domain. Instead of one LinkedIn agent with 11 skills, you might have a LinkedIn Content Writer, LinkedIn Outreach Specialist, and LinkedIn Analytics agent, each with a focused skill set. The original Director becomes a team lead who delegates within the sub-team.

### Table Stakes

| Feature | Why Expected | Complexity | Dependencies |
|---------|--------------|------------|--------------|
| Team lead agent that delegates to specialists | Without a coordinator, sub-agents step on each other or duplicate work | Medium | Paperclip issue assignment for delegation |
| Specialist agents with 3-5 skills each | Keeps each agent focused and under the 10-file skill cap | Medium | Skills must be redistributed from parent agent |
| Skill redistribution without gaps | Every skill currently on the parent must land on exactly one specialist | Low | Skill ownership matrix update |
| Sub-team heartbeat coordination | Team lead checks specialist status, reassigns stalled work | High | New heartbeat sections for the team lead role |

### Differentiators

| Feature | Value Proposition | Complexity | Dependencies |
|---------|-------------------|------------|--------------|
| Content production pipeline | LinkedIn post flows: Writer drafts, Analyst reviews metrics, Director approves and publishes. Multi-agent workflow within one domain | High | All 3 sub-agents operational + handoff protocol |
| Sub-team brain (team-level knowledge) | LinkedIn-specific context (content calendar, performance data, audience insights) shared only within the sub-team | Low | Nested directory under LinkedIn team |
| Dynamic specialist spawning | Team lead creates temporary specialists for burst work (e.g. campaign launch) | High | paperclip-create-agent skill + cleanup protocol |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Sub-agents for every department | Machine constraint: 2-3 concurrent agents max. 30+ agents would be unrunnable | Start with one sub-team (LinkedIn), prove the pattern, expand selectively |
| Deeply nested hierarchies (3+ levels) | Paperclip's flat reportsTo means hierarchy is instruction-only. More levels = more fragile | Max 2 levels: stream head > team lead > specialist |
| Sub-agents that bypass the team lead | Creates coordination chaos; team lead loses visibility | All sub-agent issues go through or are visible to the team lead |

---

## 3. Cross-Department Event Bus

### What This Means

A mechanism for the Business stream to trigger work in the Tech stream and vice versa, with context passing. Example: CMO decides FPZ needs a new landing page (business need) and triggers a task for the Engineer (tech execution) with brief, audience data, and brand guidelines attached.

### Table Stakes

| Feature | Why Expected | Complexity | Dependencies |
|---------|--------------|------------|--------------|
| Cross-stream issue creation | CMO can create an issue assigned to CTO or Engineer with full context | Low | Already possible via Paperclip issue API |
| Structured handoff template | Standard format for cross-department requests (what, why, context, deadline, success criteria) | Low | Markdown template in brain docs |
| CEO as routing fallback | If cross-department request is ambiguous, CEO resolves routing | Low | Already in v1.0 CEO heartbeat |

### Differentiators

| Feature | Value Proposition | Complexity | Dependencies |
|---------|-------------------|------------|--------------|
| Typed event triggers | Defined event types (CONTENT_NEED, TECH_REQUEST, INTEL_UPDATE, LAUNCH_TRIGGER) with required fields per type | Medium | Template files + validation in heartbeat |
| Bidirectional context attachment | When CMO triggers CTO work, business context auto-attaches; when CTO triggers CMO work, tech constraints auto-attach | Medium | Department brains must exist for context sourcing |
| Event log / audit trail | Record of all cross-department triggers for retrospective analysis | Low | Paperclip already logs all issue activity |
| Trigger-based heartbeat wake | Agent wakes specifically because of a cross-department event, not just scheduled heartbeat | Low | Already works via @-mention and task assignment triggers |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Real-time message bus (pub/sub) | Paperclip is async only. No WebSocket or event stream infrastructure | Use issue creation + @-mention as the "event" |
| Direct agent-to-agent communication | Paperclip explicitly does not support this | All communication flows through issues |
| Automated trigger chains without human visibility | "CMO triggers CTO triggers Engineer" with no audit = invisible failures | All cross-department events visible in issue tracker, CEO sees them |

---

## 4. Delegation Chains

### What This Means

True hierarchical management where CMO delegates to directors who delegate to specialists, rather than CEO routing everything. In v1.0, the CEO is the only agent that assigns work. In v2.0, CMO should directly manage Business stream directors, and CTO should directly manage Tech stream agents.

### Table Stakes

| Feature | Why Expected | Complexity | Dependencies |
|---------|--------------|------------|--------------|
| Stream heads create and assign issues | CMO and CTO can create issues and assign them to their direct reports | Low | Already possible via Paperclip API; needs heartbeat instruction |
| Delegation authority in AGENTS.md | Each stream head's AGENTS.md explicitly states who they manage and can assign to | Low | AGENTS.md update |
| Status roll-up to stream head | CMO/CTO checks status of delegated work in their heartbeat | Medium | Heartbeat addition for stream heads |
| Escalation path | If a director can't complete work, defined path back to stream head, then CEO | Low | Instructions in AGENTS.md |

### Differentiators

| Feature | Value Proposition | Complexity | Dependencies |
|---------|-------------------|------------|--------------|
| Multi-hop delegation | CMO delegates to LinkedIn Director who delegates to LinkedIn Content Writer. 3-level chain | High | Sub-agent teams must exist; fragile in Paperclip's flat model |
| Delegation with constraints | Stream head delegates but sets quality gates, deadline, or budget cap on the work | Medium | Constraint fields in issue creation |
| Automatic re-delegation on stall | If assigned agent doesn't complete within N heartbeats, stream head auto-reassigns | High | Stall detection logic in stream head heartbeat (partially exists in CEO) |
| Delegation dashboard | Stream head can see all delegated work status at a glance | Medium | API query in heartbeat; results written to stream head's memory |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| CEO bypassed entirely | CEO loses visibility into what's happening across streams | CEO still sees all issues; stream heads handle assignment, CEO handles cross-stream |
| Agents delegating outside their stream | CMO assigning work to Engineer creates confusion | Cross-department goes through event bus pattern, not direct delegation |
| Recursive delegation (infinite depth) | Paperclip's flat reportsTo makes deep chains unreliable and hard to debug | Cap at 2 levels: stream head > director > specialist (3 total) |

---

## 5. Data Gating

### What This Means

Restricting which agents can see which data. Business stream agents don't need (and shouldn't see) code review details. Tech stream agents don't need competitive intelligence raw data. Data gating prevents context pollution (agents drowning in irrelevant information) and enforces information boundaries.

### Table Stakes

| Feature | Why Expected | Complexity | Dependencies |
|---------|--------------|------------|--------------|
| Stream-scoped file access | Agent instructions specify which directories to read; agents don't access other stream's files | Low | Instruction-based only; no enforcement mechanism in Paperclip |
| Skill visibility by role | Agents only see skills relevant to their role (already true in v1.0) | Low | Already implemented via per-agent skill directories |
| Issue visibility filtering | Agents query only issues assigned to them or their stream | Low | API query filter in heartbeat |

### Differentiators

| Feature | Value Proposition | Complexity | Dependencies |
|---------|-------------------|------------|--------------|
| Classified brain docs | Some brain docs marked "leadership only" (financials, HR decisions) readable only by CEO/CMO/CTO | Medium | Directory structure + instruction-based access rules |
| Context budget per agent | Limit how many brain docs an agent reads per heartbeat to prevent context window bloat | Medium | Tiered injection from Department Brains feature |
| Audit log of cross-boundary reads | Track when an agent reads outside its normal scope | High | Would require custom logging; not natively supported |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Technical enforcement (file permissions, ACLs) | Paperclip agents run as the same user. OS-level permissions won't work | Instruction-based gating: tell agents what they can/cannot read |
| Encryption of department data | Agents need to read the files. Encryption adds complexity with no real security benefit (same machine, same user) | Trust the instruction boundary; this is about relevance, not security |
| Per-issue access control | Paperclip has no issue-level permissions | Filter by assignment and stream tag in heartbeat queries |

---

## Feature Dependencies

```
Department Brains ---------> Cross-Department Event Bus (events reference brain docs for context)
Department Brains ---------> Data Gating (gating is about which brain docs each agent sees)
Department Brains ---------> Sub-Agent Teams (sub-teams need team-level brain access)
Delegation Chains ---------> Sub-Agent Teams (multi-hop delegation requires sub-agents to exist)
Data Gating              --> Sub-Agent Teams (specialists need scoped access within their team)
Cross-Dept Event Bus     --> Delegation Chains (events may trigger delegation within receiving stream)
```

**Critical path:** Department Brains first. Everything else depends on having shared knowledge infrastructure.

---

## MVP Recommendation

**Phase 1: Department Brains + Data Gating** (foundation)
1. Create `/brain/business/` and `/brain/tech/` directories with seed content
2. Update all 10 agents' AGENTS.md to reference their stream's brain
3. Define read/write rules per agent in instructions
4. Migrate duplicated context (product-marketing-context.md, coding standards) into brains

**Phase 2: Delegation Chains** (unlock stream autonomy)
5. Update CMO and CTO heartbeats to include issue creation and assignment
6. Add status roll-up checks to stream head heartbeats
7. Define escalation paths in AGENTS.md for all agents

**Phase 3: Cross-Department Event Bus** (connect streams)
8. Create handoff templates for cross-stream requests
9. Define event types with required fields
10. Add cross-department trigger logic to CMO and CTO heartbeats

**Phase 4: Sub-Agent Teams** (expand selectively)
11. Split LinkedIn Growth Director into 2-3 specialists (prove the pattern)
12. Create team lead heartbeat for LinkedIn Director
13. Redistribute skills across specialists

**Defer:**
- Dynamic specialist spawning (high complexity, unclear value at 10-agent scale)
- Audit logging of cross-boundary reads (Paperclip doesn't support natively)
- Sub-teams beyond LinkedIn (prove the pattern first, machine constraints limit scale)

---

## Complexity Summary

| Capability | Table Stakes Complexity | Differentiator Complexity | Paperclip Friction |
|------------|------------------------|--------------------------|-------------------|
| Department Brains | Low | Medium | Low -- files work fine |
| Sub-Agent Teams | Medium | High | Medium -- flat reportsTo needs workaround |
| Cross-Dept Event Bus | Low | Medium | Low -- issues are the bus |
| Delegation Chains | Low | High | Medium -- hierarchy via instructions only |
| Data Gating | Low | Medium | High -- no enforcement, instruction-only |

---

## Sources

- [Paperclip GitHub repository](https://github.com/paperclipai/paperclip) -- platform capabilities and constraints [HIGH confidence]
- [Paperclip knowledge layer issue #1858](https://github.com/paperclipai/paperclip/issues/1858) -- company wiki feature request, confirms current gap [HIGH confidence]
- [Conducting AI website](https://www.conducting.ai/) -- consulting/design firm, not a technical framework [MEDIUM confidence]
- [Anthony David Adams / Headcount Zero book](https://github.com/AnthonyDavidAdams/zero-employee-company-book) -- Paperclip-based zero-employee company guide [MEDIUM confidence]
- [Anton Antich: Knowledge, Brain, Skills framework](https://medium.com/superstringtheory/knowledge-brain-skills-how-to-make-useful-ai-agents-fast-24e570e0d560) -- agent architecture pattern [MEDIUM confidence]
- [CrewAI hierarchical delegation docs](https://docs.crewai.com/en/concepts/collaboration) -- delegation and memory patterns [MEDIUM confidence]
- [Microsoft Azure AI Agent Design Patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns) -- orchestration patterns [HIGH confidence]
- [Flowtivity: Zero-Human Companies](https://flowtivity.ai/blog/zero-human-company-paperclip-ai-agent-orchestration/) -- Paperclip capabilities overview [MEDIUM confidence]
- [StackAI: Sub-Agent Teams](https://www.stackai.com/blog/the-era-of-ai-employees-how-ai-employees-coordinate-at-scale-with-sub-agent-teams) -- sub-agent coordination patterns [LOW confidence]
- [DeepMind delegation rules](https://theaiinsider.tech/2026/02/17/deepmind-study-proposes-rules-for-how-ai-agents-should-delegate/) -- delegation safety patterns [MEDIUM confidence]
- [Microsoft Cloud Adoption Framework: Agent Governance](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai-agents/governance-security-across-organization) -- data isolation and access control [HIGH confidence]
