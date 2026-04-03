# Technology Stack: Conducting AI Scale Features

**Project:** FourPointZero AI Agent Company v2.0
**Researched:** 2026-04-03
**Confidence:** HIGH (verified against Paperclip source code, API docs, and live company files)

## Constraint: No New Technology

Paperclip is the entire platform. There is no new stack to install. Every v2.0 feature must be built from the existing Paperclip primitives: **issues, labels, comments, agent files (AGENTS.md, HEARTBEAT.md, SOUL.md, skills/), shared docs, the project workspace, and heartbeat-driven execution.**

The question is not "what technology to add" but "which existing primitives to repurpose and how."

---

## Paperclip Primitives Inventory

What exists today and what each can be repurposed for:

| Primitive | Current Use | v2.0 Repurpose |
|-----------|-------------|----------------|
| **Issues** (tasks) | Work units with status lifecycle, parentId hierarchy, assigneeAgentId, goalId, projectId, labelIds, priority, comments | Event bus messages, delegation chain tracking, cross-department handoffs |
| **Labels** | Issue categorisation (manually created via API) | Department tagging, data gating filters, event routing keys |
| **Comments** | Agent-to-agent updates on issues | Structured context payloads for handoffs, delegation chain audit trail |
| **Agent files** (`$AGENT_HOME/`) | AGENTS.md (identity), HEARTBEAT.md (execution), SOUL.md (persona), TOOLS.md, skills/ dir | Department brain references, gated file reads, sub-team coordination instructions |
| **Skills** (markdown in `skills/`) | Procedural knowledge bundles (10-file cap per agent) | Department-specific knowledge bundles, delegation chain protocols |
| **Shared docs** (`docs/`) | Company-wide templates and processes | Department brain storage location |
| **Project workspace** (`projects/FourPointZero/workspace/`) | Output deliverables (50+ files already) | Shared knowledge base with directory-based department scoping |
| **Routines** (cron triggers) | Scheduled heartbeats (PO grooming, CEO stall detection) | Department sync routines, cross-department polling |
| **Goals** | Strategic objectives linking to issues | Department-level sub-goals for ownership boundaries |
| **`parentId`** on issues | Sub-task decomposition | Multi-level delegation chains (CEO > CMO > Director > Specialist) |
| **`requestDepth`** on issues | Tracks delegation level (0 = CEO) | Automatic delegation depth visibility |
| **`reportsTo`** on agents | Flat manager assignment (one manager per agent) | Unchanged. Hierarchy enforced via instructions, not the field |

## Feature-by-Feature Implementation Stack

### 1. Department Brains (Shared Knowledge Bases)

**What to use:** File-based directories + `Read:` directives in AGENTS.md

**Implementation:**

Create department-scoped directories under the company root:

```
companies/FourPointZero/
  departments/
    business/
      brain/
        positioning.md
        voice-guidelines.md
        content-calendar.md
        competitive-intel.md
        campaign-history.md
      README.md
    tech/
      brain/
        architecture-decisions.md
        tech-debt-register.md
        deployment-runbook.md
        standards.md
      README.md
```

**Why this works:** Every agent has filesystem access via Claude Code. AGENTS.md already uses `Read:` directives to load shared files. Adding `Read: departments/business/brain/positioning.md` to the CMO's AGENTS.md makes the brain available on every heartbeat. The same pattern is already proven with `docs/` and the shared `product-marketing-context.md` file (referenced by 33 files across the company).

**Why NOT a database or API:** Paperclip has no built-in knowledge store. The filesystem is the only persistence layer agents can both read and write. Files are durable across heartbeats. No new infrastructure needed.

**10-file skill cap workaround:** Department brain files are NOT skills. They go in a shared `departments/` directory referenced via `Read:` directives in AGENTS.md, which has no file count cap. Only the `skills/` directory has the 10-file limit.

**Write-back pattern:** Agents update department brain files during their heartbeat work. Example: Customer Success finishes competitive research, writes findings to `departments/business/brain/competitive-intel.md`. Next time CMO wakes up, it reads the updated file. This is eventually consistent (one heartbeat cycle delay).

### 2. Sub-Agent Teams

**What to use:** New agents via the Paperclip hire API + skill redistribution

**Implementation:**

Hire new specialist agents under the LinkedIn Growth Director's domain. Example expansion:

| New Agent | Role | Reports To (API) | Reports To (Instructions) | Skills (from LGD) |
|-----------|------|-------------------|---------------------------|-------------------|
| LinkedIn Content Writer | linkedin-content-writer | CEO (flat) | LinkedIn Growth Director | linkedin-post-writer |
| LinkedIn Outreach Specialist | linkedin-outreach | CEO (flat) | LinkedIn Growth Director | cold-outreach-sequence, cold-email, meeting-prep |

**Paperclip constraint:** `reportsTo` is flat. There is no multi-level reporting hierarchy in the API. New sub-agents report to CEO in the `reportsTo` field. The LGD's management authority comes from AGENTS.md instructions and HEARTBEAT.md delegation rules, not from the API field.

**This is already the pattern used.** The CMO "manages" Technical Writer, Customer Success, UX Researcher, and LinkedIn Growth Director, but they all have `reportsTo: CEO` in the API. Management hierarchy is enforced by instruction text, not API structure. This is proven and working.

**Machine constraint:** 2-3 concurrent agents max on a single local machine. Sub-agents don't run in parallel with their manager. The LGD creates issues assigned to sub-agents, then exits. Sub-agents pick up work on their next heartbeat. Serial, not parallel, which is fine for Paperclip's async model.

**Skill redistribution:** When splitting LGD into a team, move execution skills to specialists and give LGD a new "team-coordinator" skill that handles delegation logic. LGD keeps linkedin-content-strategy and linkedin-authority-builder (strategic); content-writer gets linkedin-post-writer; outreach-specialist gets cold-outreach-sequence, cold-email, meeting-prep.

### 3. Cross-Department Event Bus

**What to use:** Labelled issues + heartbeat polling + structured comments

**Implementation:**

There is no real event bus in Paperclip. No pub/sub, no webhooks between agents, no message queue. The workaround is a convention-based issue routing pattern:

1. **Create "event labels"** for cross-department triggers:
   - `event:content-ready-for-tech` (CMO stream > CTO stream)
   - `event:tech-ready-for-content` (CTO stream > CMO stream)
   - `event:quality-gate-request` (any > Technical Writer)
   - `event:competitive-intel-update` (Customer Success > CMO)

2. **Producing agent** creates an issue with the event label, a structured description (context payload), and assigns to the target stream head.

3. **Consuming agent** queries issues by label on each heartbeat:
   ```
   GET /api/companies/{companyId}/issues?labelIds={event-label-id}&status=todo
   ```

4. **HEARTBEAT.md addition** for stream heads (CMO, CTO): "Check for cross-department events. Query issues with `event:` labels assigned to you. Process and delegate."

**Why labels, not parentId:** Labels are queryable via the API. ParentId creates a tree under an existing task. Cross-department triggers are new top-level work items, not subtasks of the originating work.

**Structured comment format for handoff context:**

```markdown
## Cross-Department Handoff

**From:** CMO (business stream)
**Trigger:** New landing page copy approved (FOU-120)
**Needs:** Frontend implementation of landing page
**Context:** Copy at workspace/creativai-page-copy-edited.md
**Priority:** high
**Deadline:** Before June Cannes Lions launch
```

### 4. Delegation Chains

**What to use:** `parentId` issue hierarchy + `requestDepth` + HEARTBEAT.md routing rules

**Implementation:**

True delegation chains mean: CEO assigns to CMO, CMO creates a child issue assigned to Technical Writer, Technical Writer creates a child issue assigned to a sub-specialist. The chain is tracked by `parentId`.

This is already partially working. The CEO's HEARTBEAT.md contains FPZ Delegation Logic. The gap: **CMO and CTO don't do their own sub-delegation.** CEO currently assigns directly to leaf agents (Technical Writer, Customer Success, etc.).

Changes needed:

1. **CMO HEARTBEAT.md update:** Add a delegation section mirroring the CEO's FPZ Delegation Logic. When CMO receives a strategy issue, CMO creates child issues for production work and assigns to the correct downstream agent.

2. **CTO HEARTBEAT.md update:** Same pattern. When CTO receives a tech issue, CTO creates child issues for implementation (Engineer) and review (Code Reviewer).

3. **CEO AGENTS.md update:** Change routing table. Instead of CEO assigning directly to Technical Writer or Customer Success, CEO assigns to CMO (business) or CTO (tech). The stream heads then sub-delegate.

4. **`requestDepth` tracking:** Paperclip auto-increments `requestDepth` when child issues are created. CEO issues are depth 0. CMO sub-issues are depth 1. Director sub-issues are depth 2. This gives automatic visibility into delegation chain length without any custom code.

**What NOT to change:** The `reportsTo` field on agents stays flat (all report to CEO in the API). Delegation chains are enforced through issue `parentId` hierarchy and HEARTBEAT.md instructions.

### 5. Data Gating

**What to use:** Separate `Read:` directives per agent + department-scoped directories + label-filtered queries

**Implementation:**

Paperclip has NO built-in data isolation between agents within a company. All agents in the same company can access the same filesystem. Data gating must be enforced by convention, not by access control.

**Convention-based gating:**

1. **Department brain directories** (from feature 1) provide natural boundaries. Business agents get `Read: departments/business/brain/` in their AGENTS.md. Tech agents get `Read: departments/tech/brain/`. Neither is instructed to read the other's department brain.

2. **Skill ownership** already gates expertise. CMO has strategy skills. Technical Writer has content production skills. No agent has skills outside their domain.

3. **Issue label filtering** gates what work an agent sees. Agents query only issues assigned to them (`?assigneeAgentId={your-id}`). Adding department labels (`dept:business`, `dept:tech`) enables stream heads to query their department's full issue set when needed.

**Hard gating is impossible** without modifying Paperclip core (out of scope per PROJECT.md). The API scopes agent keys to their company, but within a company there's no per-department permission model. Any agent could technically read any file. Gating is about what agents are _instructed_ to read and what issues they're assigned. Soft gating only.

---

## What to Repurpose vs What to Create New

### Repurpose (zero new infrastructure)

| Existing Primitive | Repurpose For | How |
|--------------------|---------------|-----|
| `docs/` directory pattern | Department brain storage | Create `departments/{name}/brain/` subdirectories |
| `Read:` directives in AGENTS.md | Department brain loading | Add department-scoped reads per agent |
| `parentId` on issues | Delegation chains | CMO/CTO create child issues instead of CEO assigning directly |
| `labelIds` on issues | Event bus routing, department tagging | Create `event:` and `dept:` label prefixes |
| Issue comments | Cross-department context payloads | Structured markdown format for handoff context |
| HEARTBEAT.md sections | Stream head delegation logic | Mirror CEO's FPZ Delegation Logic in CMO/CTO heartbeats |
| `requestDepth` on issues | Delegation depth visibility | Already auto-tracked by Paperclip |
| Routines (cron triggers) | Department sync checks | Add heartbeats for stream heads to poll event labels |

### Create New (file-based, no infrastructure)

| New Artifact | Purpose | Location |
|--------------|---------|----------|
| Department brain directories | Shared knowledge per stream | `departments/business/brain/`, `departments/tech/brain/` |
| Event label set | Cross-department routing | Created via `POST /api/companies/{companyId}/labels` |
| Department labels | Issue scoping | `dept:business`, `dept:tech` labels |
| CMO delegation logic | True stream head management | Added to CMO HEARTBEAT.md |
| CTO delegation logic | True stream head management | Added to CTO HEARTBEAT.md |
| Sub-agent configs | LinkedIn team expansion | New agent dirs under `agents/` |
| Team coordinator skill | LGD manages sub-agents | New skill in LGD `skills/` |

---

## What NOT to Build

These approaches are impossible or counterproductive within Paperclip:

| Approach | Why Not |
|----------|---------|
| Real-time agent-to-agent messaging | Paperclip doesn't support it. Async issues only (PROJECT.md constraint). |
| Custom API endpoints for event bus | Cannot modify Paperclip core (out of scope). |
| Database-backed knowledge store | No built-in per-department memory. Files are the persistence layer. |
| Hard access control between departments | No per-department permission model within a company. Soft gating only. |
| Matrix reporting (agent reports to two managers) | Paperclip enforces single `reportsTo`. Use instructions-based hierarchy. |
| Running 10+ agents concurrently | Machine constraint: 2-3 concurrent agents max. Async serial execution only. |
| Separate Paperclip projects per department | Would break cross-department issue visibility. One project, labelled by department. |
| Agent-to-agent direct API calls | Agents coordinate through issues and comments only. No agent-to-agent RPC. |
| Separate Paperclip companies per department | Would block cross-department delegation entirely. Company boundary = hard isolation. |

---

## Implementation Priority Order

1. **Labels first** (event and department labels) -- enables everything else, zero risk, 10 minutes via API
2. **Department brain directories** -- create the file structure, add `Read:` directives to AGENTS.md files
3. **CMO/CTO delegation logic** -- update HEARTBEAT.md files to enable true delegation chains
4. **CEO routing update** -- shift from direct-to-leaf to stream-head delegation
5. **Cross-department event bus** -- add event label polling to stream head heartbeats
6. **Sub-agent team expansion** -- hire LinkedIn specialists, redistribute skills (most disruptive, do last)

This order ensures each step builds on the previous one with no rework.

## Sources

- Paperclip official docs: https://paperclipai-paperclip.mintlify.app/
- Paperclip GitHub: https://github.com/paperclipai/paperclip
- Live company files at `~/.paperclip/instances/default/companies/FourPointZero/agents/` (all 10 agent dirs inspected)
- CEO AGENTS.md, HEARTBEAT.md (verified delegation patterns, FPZ routing logic)
- CMO AGENTS.md, HEARTBEAT.md (verified current routing, content production rules)
- CTO AGENTS.md, HEARTBEAT.md (verified tech stream patterns, cross-stream coordination)
- LinkedIn Growth Director AGENTS.md (verified skill set, reporting structure)
- CEO memory/2026-04-03.md (verified live issue flow, heartbeat patterns, 150+ issues processed)
- Paperclip API docs: issues support parentId, labelIds, assigneeAgentId, requestDepth, status lifecycle, comments, atomic checkout (verified)
- `product-marketing-context.md` referenced by 33 files (verified shared-file pattern works at scale)
