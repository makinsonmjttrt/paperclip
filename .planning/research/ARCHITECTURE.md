# Architecture Patterns: v2.0 Conducting AI Scale

**Domain:** Multi-agent orchestration expansion within Paperclip
**Researched:** 2026-04-03
**Builds on:** v1.0 10-agent flat company (all validated, all operational)

## The Core Problem

Paperclip gives you flat `reportsTo` (every agent reports to CEO), async issue passing, no shared memory, no data isolation, and no event bus. The v2.0 features -- department brains, sub-agent teams, cross-department handoffs, delegation chains, and data gating -- all require capabilities Paperclip does not natively provide.

Every solution here is a file-and-instruction-based workaround within Paperclip's existing primitives: agent files (AGENTS.md, HEARTBEAT.md, SOUL.md, skills/), issues (with parentId, labels, comments, @-mentions), and the filesystem.

## Existing Architecture (v1.0 baseline)

```
Board (Martyn)
    |
    v
Paperclip API (issues, heartbeats, agents)
    |
    v
CEO ---- routes to ---> CMO (business stream head)
  |                       |--- Technical Writer
  |                       |--- Customer Success
  |                       |--- UX Researcher
  |                       |--- LinkedIn Growth Director
  |
  +---- routes to ---> CTO (tech stream head)
                         |--- Software Engineer
                         |--- Product Owner
                         |--- Code Reviewer
```

**Key primitives available:**
- Issues: CRUD, parentId (sub-tasks), labels, assigneeAgentId, status, comments, @-mentions
- Agents: instructionsFilePath, role, status (idle/running/error), heartbeat wake
- Files: AGENTS.md, HEARTBEAT.md, SOUL.md, TOOLS.md, skills/*.md, memory/*.md
- Workspace: shared project workspace for deliverables

**Key primitives missing:**
- No `reportsTo` hierarchy beyond CEO (flat)
- No per-department memory or context isolation
- No event bus or pub/sub between agents
- No data gating or access control on files
- No real-time messaging between agents

## v2.0 Architecture: Five New Layers

### Layer 1: Department Brains (Shared Knowledge Bases)

**What it solves:** Agents in the same stream lack shared context. The CMO knows the positioning, but the LinkedIn Growth Director doesn't automatically know what the CMO decided last week.

**Implementation: File-based department context files.**

```
agents/
  _departments/
    business/
      BRAIN.md           # Shared knowledge for business stream
      decisions.md       # Rolling log of strategic decisions
      active-campaigns.md # Current campaigns and their status
    tech/
      BRAIN.md           # Shared knowledge for tech stream
      decisions.md       # Architecture decisions, tech debt log
      active-sprints.md  # Current sprint focus
```

**How it works:**
1. Create `_departments/business/BRAIN.md` and `_departments/tech/BRAIN.md` as shared context files
2. Add a `Read: agents/_departments/business/BRAIN.md` directive to AGENTS.md for every business stream agent (CMO, Technical Writer, Customer Success, UX Researcher, LinkedIn Growth Director)
3. Add equivalent for tech stream agents (CTO, Software Engineer, Product Owner, Code Reviewer)
4. Department heads (CMO, CTO) get a new HEARTBEAT section: "Update department brain" -- after completing work, append key decisions/outcomes to the brain file
5. CEO reads both brains for cross-department awareness

**What changes in existing files:**

| File | Change |
|------|--------|
| CMO AGENTS.md | Add `Read: agents/_departments/business/BRAIN.md` |
| CMO HEARTBEAT.md | Add "Update Department Brain" section at step 4.5 |
| Technical Writer AGENTS.md | Add `Read: agents/_departments/business/BRAIN.md` |
| Customer Success AGENTS.md | Add `Read: agents/_departments/business/BRAIN.md` |
| UX Researcher AGENTS.md | Add `Read: agents/_departments/business/BRAIN.md` |
| LinkedIn Growth Director AGENTS.md | Add `Read: agents/_departments/business/BRAIN.md` |
| CTO AGENTS.md | Add `Read: agents/_departments/tech/BRAIN.md` |
| Software Engineer AGENTS.md | Add `Read: agents/_departments/tech/BRAIN.md` |
| Product Owner AGENTS.md | Add both brain files (cross-stream role) |
| Code Reviewer AGENTS.md | Add `Read: agents/_departments/tech/BRAIN.md` |
| CEO AGENTS.md | Add both brain files |

**BRAIN.md structure:**

```markdown
# Business Stream Brain

## Current Strategic Focus
[Updated by CMO after each strategy session]

## Active Campaigns
[Campaign name, status, owner, deadline]

## Recent Decisions (last 5)
[Date: Decision. Rationale. Made by.]

## Shared Assets
[Links to positioning docs, brand voice, content calendar]

## Standing Instructions
[Rules that apply to all business stream agents]
```

**Write discipline:** Only the department head (CMO/CTO) and CEO write to the brain file. All other agents read only. This prevents race conditions.

### Layer 2: Sub-Agent Teams

**What it solves:** The LinkedIn Growth Director handles everything LinkedIn alone. In practice, LinkedIn work breaks down into distinct specialisms (content writing, engagement analytics, prospect research, outreach sequences) that could benefit from dedicated focus.

**The constraint:** Paperclip's flat structure means new agents all report to CEO. You cannot make an agent report to LinkedIn Growth Director via the API. Sub-team hierarchy must be enforced via instructions, not platform structure.

**Implementation: Instruction-enforced sub-teams.**

The LinkedIn Growth Director becomes a team lead. New specialist agents are created but their AGENTS.md explicitly states they report to the LinkedIn Growth Director, take work only from them, and hand deliverables back to them.

**New agents for LinkedIn team:**

| Agent | Role | Owned Skills | Reports To (instructional) |
|-------|------|-------------|---------------------------|
| LinkedIn Content Specialist | linkedin-content-specialist | linkedin-post-writer, linkedin-content-strategy | LinkedIn Growth Director |
| LinkedIn Outreach Specialist | linkedin-outreach-specialist | cold-outreach-sequence, cold-email, meeting-prep | LinkedIn Growth Director |

**LinkedIn Growth Director changes:**
- Skills removed: linkedin-post-writer, linkedin-content-strategy, cold-outreach-sequence, cold-email, meeting-prep
- Skills retained: linkedin-authority-builder, linkedin-profile-optimizer (strategic, not production)
- New HEARTBEAT section: "Sub-Team Delegation" -- creates sub-issues assigned to specialists
- New role: Team lead and quality reviewer for sub-agent output

**How sub-team delegation works (issue-based):**

```
1. CMO or CEO assigns issue to LinkedIn Growth Director (e.g., "Create Q2 LinkedIn campaign")
2. LinkedIn Growth Director creates sub-issues:
   - "Write 4 LinkedIn posts for Q2 campaign" -> LinkedIn Content Specialist
   - "Build outreach sequence for VFX studio heads" -> LinkedIn Outreach Specialist
3. Sub-agents process their issues, write deliverables to workspace
4. Sub-agents @-mention LinkedIn Growth Director when done
5. LinkedIn Growth Director reviews, provides feedback or approves
6. LinkedIn Growth Director @-mentions Technical Writer for humaniser pass
7. LinkedIn Growth Director comments on parent issue with final deliverables
```

**Content production team (optional second sub-team):**

| Agent | Role | Owned Skills | Reports To (instructional) |
|-------|------|-------------|---------------------------|
| Social Content Writer | social-content-writer | social-content, ad-creative, email-sequence | Technical Writer |

This is lower priority than the LinkedIn team. The Technical Writer already handles content production. Only add if content volume justifies it.

**New agent directory structure:**

```
agents/
  linkedin-content-specialist/
    AGENTS.md
    HEARTBEAT.md
    SOUL.md
    TOOLS.md
    skills/
      linkedin-post-writer.md
      linkedin-content-strategy.md
  linkedin-outreach-specialist/
    AGENTS.md
    HEARTBEAT.md
    SOUL.md
    TOOLS.md
    skills/
      cold-outreach-sequence.md
      cold-email.md
      meeting-prep.md
```

**Agent count impact:** 10 -> 12 (or 13 with social content writer). Still within practical limits given 2-3 concurrent agent cap.

### Layer 3: Cross-Department Event Bus

**What it solves:** When CMO completes a positioning document, CTO should know to update the website. When Engineer ships a feature, CMO should know to create launch content. Today this requires the CEO to manually notice and route.

**Implementation: Issue-based event protocol with label conventions.**

There is no pub/sub in Paperclip. The workaround is a "handoff issue" pattern: when an agent completes work that triggers cross-department action, they create a new issue in the other department's domain with a specific label convention.

**Event label convention:**

```
x-dept:business->tech    # Business stream triggering tech work
x-dept:tech->business    # Tech stream triggering business work
```

**Event protocol (added to HEARTBEAT.md of all department heads and CEO):**

```markdown
## Cross-Department Handoff

When your work produces an outcome that requires action from the other stream:

1. Create a new issue with:
   - Title: "[X-DEPT] [action needed] triggered by [your deliverable]"
   - Label: `x-dept:business->tech` or `x-dept:tech->business`
   - Description: What was completed, what the other stream needs to do, link to deliverable
   - AssigneeAgentId: The other stream's department head (CMO or CTO)
2. Comment on your original issue noting the handoff issue number

When you receive an x-dept issue assigned to you:
1. Read the triggering deliverable
2. Create appropriate sub-issues in your stream
3. Update the x-dept issue status as work progresses
```

**CEO monitoring (added to CEO HEARTBEAT.md):**

```markdown
## Event Bus Monitoring

Query x-dept issues: `GET /api/companies/{companyId}/issues?labels=x-dept`
- Check for stalled handoffs (created but not acted on within 2 heartbeats)
- Escalate blocked cross-department work
```

**Predefined event templates:**

| Trigger | Source | Target | Issue Template |
|---------|--------|--------|----------------|
| New positioning doc | CMO | CTO | "[X-DEPT] Update website copy to reflect new positioning" |
| Feature shipped | Engineer | CMO | "[X-DEPT] Create launch content for [feature]" |
| Competitor move detected | Customer Success | CMO | "[X-DEPT] Competitive response needed: [competitor] [action]" |
| Tech debt critical | CTO | Product Owner | "[X-DEPT] Prioritise tech debt: [description]" |
| Content calendar gap | Technical Writer | CMO | "[X-DEPT] Content strategy needed: [gap description]" |
| SEO opportunity found | UX Researcher | Technical Writer | "[X-DEPT] Create content targeting [keyword/topic]" |

**What changes in existing files:**

| File | Change |
|------|--------|
| CMO HEARTBEAT.md | Add "Cross-Department Handoff" section |
| CTO HEARTBEAT.md | Add "Cross-Department Handoff" section |
| CEO HEARTBEAT.md | Add "Event Bus Monitoring" section |
| Product Owner HEARTBEAT.md | Add x-dept label to label strategy |

### Layer 4: True Delegation Chains

**What it solves:** Today, CEO routes work to CMO or CTO, but the department heads don't truly manage their reports. The LinkedIn Growth Director takes work from CEO, not from CMO. There is no mid-tier management.

**Implementation: Instruction-enforced chain of command.**

This is the simplest layer because it requires only instruction changes, no new files or structures.

**Changes to downstream agents:**

Every agent below a department head gets this added to AGENTS.md:

```markdown
## Chain of Command

You report to [CMO/CTO]. Accept work assignments from:
1. Your department head ([CMO/CTO]) -- primary
2. The CEO -- override authority
3. The Product Owner -- for backlog-generated issues

Do NOT accept work from peer agents directly. If a peer needs work from you,
they should create an issue and assign it to your department head, who will
route it to you.

When completing work, @-mention your department head (not the CEO) for review.
The department head escalates to the CEO only if needed.
```

**Changes to department heads (CMO/CTO):**

```markdown
## Team Management

You manage the following agents:
- [list of direct reports]

When assigned an issue that requires specialist work:
1. Create sub-issues assigned to the appropriate specialist
2. Monitor sub-issue progress during your heartbeats
3. Review completed deliverables before marking the parent issue done
4. Escalate to CEO only for cross-department issues or blockers you cannot resolve
```

**Changes to CEO:**

```markdown
## Delegation (Updated)

Route work to department heads, not individual contributors:
- Business work -> CMO (who sub-delegates to their team)
- Tech work -> CTO (who sub-delegates to their team)

Exceptions (assign directly):
- Product Owner (cross-stream, reports to CEO)
- Urgent issues where bypassing the department head is faster
```

**What changes in existing files:**

| File | Change |
|------|--------|
| Technical Writer AGENTS.md | Add "Chain of Command" section (reports to CMO) |
| Customer Success AGENTS.md | Add "Chain of Command" section (reports to CMO) |
| UX Researcher AGENTS.md | Add "Chain of Command" section (reports to CMO) |
| LinkedIn Growth Director AGENTS.md | Add "Chain of Command" section (reports to CMO) |
| Software Engineer AGENTS.md | Add "Chain of Command" section (reports to CTO) |
| Code Reviewer AGENTS.md | Add "Chain of Command" section (reports to CTO) |
| CMO AGENTS.md | Add "Team Management" section |
| CMO HEARTBEAT.md | Add "Team Monitoring" step |
| CTO AGENTS.md | Add "Team Management" section |
| CTO HEARTBEAT.md | Add "Team Monitoring" step |
| CEO AGENTS.md | Update delegation section to route through heads |
| CEO HEARTBEAT.md | Update delegation logic |

### Layer 5: Data Gating

**What it solves:** All agents can read all files. The Engineer can read marketing positioning docs. Customer Success can read architecture files. No information boundary exists.

**Implementation: Instruction-enforced read discipline.**

Paperclip has no file-level access control. Data gating must be enforced by telling agents what they should and should not read.

**Per-agent data scope (added to AGENTS.md):**

```markdown
## Data Scope

You may read:
- Your agent directory: $AGENT_HOME/
- Department brain: agents/_departments/[your-stream]/
- Shared docs: docs/
- Project workspace: projects/FourPointZero/workspace/ (deliverables relevant to your work)
- Product marketing context: .agents/product-marketing-context.md

You should NOT read:
- Other agents' directories (their memory, their skills)
- The other department's brain file
- Issue comments on issues assigned to agents outside your stream (unless @-mentioned)
```

**What this means in practice:**
- Business stream agents don't read `_departments/tech/BRAIN.md`
- Tech stream agents don't read `_departments/business/BRAIN.md`
- Product Owner reads both (cross-stream role, explicitly permitted)
- CEO reads both (executive oversight)
- No agent reads another agent's `memory/` directory

**Enforcement reality:** This is honour-system enforcement. Agents can technically read any file. The instruction tells them not to. If an agent misbehaves, the fix is to strengthen the instruction wording. This is a known limitation of the approach.

## Component Boundaries Summary

### New Components (create from scratch)

| Component | Path | Purpose | Created By |
|-----------|------|---------|------------|
| Business BRAIN.md | agents/_departments/business/BRAIN.md | Shared business stream context | CMO (write), all business agents (read) |
| Business decisions.md | agents/_departments/business/decisions.md | Rolling decision log | CMO (write) |
| Tech BRAIN.md | agents/_departments/tech/BRAIN.md | Shared tech stream context | CTO (write), all tech agents (read) |
| Tech decisions.md | agents/_departments/tech/decisions.md | Rolling decision log | CTO (write) |
| LinkedIn Content Specialist | agents/linkedin-content-specialist/ | Post writing, content strategy | New agent |
| LinkedIn Outreach Specialist | agents/linkedin-outreach-specialist/ | Cold outreach, meeting prep | New agent |
| Event templates | docs/event-templates.md | Cross-dept handoff templates | Reference doc |

### Modified Components (update existing files)

| Component | Change Type | What Changes |
|-----------|-------------|--------------|
| CEO AGENTS.md | Update | Delegation routes through heads, reads both brains, data scope |
| CEO HEARTBEAT.md | Update | Event bus monitoring, updated delegation logic |
| CMO AGENTS.md | Update | Team management section, brain read, data scope |
| CMO HEARTBEAT.md | Update | Team monitoring, brain update, cross-dept handoff |
| CTO AGENTS.md | Update | Team management section, brain read, data scope |
| CTO HEARTBEAT.md | Update | Team monitoring, brain update, cross-dept handoff |
| Technical Writer AGENTS.md | Update | Chain of command, brain read, data scope |
| Customer Success AGENTS.md | Update | Chain of command, brain read, data scope |
| UX Researcher AGENTS.md | Update | Chain of command, brain read, data scope |
| LinkedIn Growth Director AGENTS.md | Update | Team lead role, sub-team delegation, skills redistributed, brain read, data scope |
| LinkedIn Growth Director HEARTBEAT.md | Update | Sub-team delegation section |
| Software Engineer AGENTS.md | Update | Chain of command, brain read, data scope |
| Code Reviewer AGENTS.md | Update | Chain of command, brain read, data scope |
| Product Owner AGENTS.md | Update | Both brains, x-dept label strategy, data scope |
| Product Owner HEARTBEAT.md | Update | x-dept label handling |

### Unchanged Components

| Component | Why Unchanged |
|-----------|---------------|
| All SOUL.md files | Persona/voice does not change with org structure |
| All TOOLS.md files | Tool access unchanged |
| All existing skill files | Skill content unchanged, only ownership moves for LinkedIn |
| BOOTSTRAP.md | Already created, new agents added separately |
| Workspace deliverables | Output location unchanged |

## Data Flow Changes

### v1.0 Data Flow (current)
```
Board -> Issue -> CEO -> Agent -> Deliverable -> Issue comment -> Next agent
```

### v2.0 Data Flow (target)
```
Board -> Issue -> CEO -> Department Head -> Sub-issue -> Specialist agent
                           |                              |
                           v                              v
                    Department BRAIN.md           Deliverable -> workspace
                    (updated after work)                  |
                           |                              v
                           v                   @-mention dept head
                    Other dept agents              (not CEO)
                    (read brain next wake)              |
                                                       v
                                              Dept head reviews
                                                       |
                                              [if cross-dept needed]
                                                       v
                                              X-DEPT handoff issue
                                                       |
                                                       v
                                              Other dept head picks up
```

## Suggested Build Order

Dependencies flow downward. Each layer unlocks the next.

### Phase 1: Department Brains
**Why first:** Zero dependency on other v2 features. Foundation for everything else. Department brains give sub-agents and delegation chains something to read from.

**Deliverables:**
1. Create `agents/_departments/business/BRAIN.md` with initial content (pull from CEO MEMORY.md business context)
2. Create `agents/_departments/tech/BRAIN.md` with initial content
3. Create `agents/_departments/business/decisions.md` (empty template)
4. Create `agents/_departments/tech/decisions.md` (empty template)
5. Update all 10 agent AGENTS.md files with appropriate brain read directives
6. Update CMO and CTO HEARTBEAT.md with "Update Department Brain" section

**Risk:** LOW. File creation and instruction updates only. No structural changes.

### Phase 2: Delegation Chains
**Why second:** Department brains exist, so agents now have shared context. Delegation chains redirect work flow through department heads instead of CEO.

**Deliverables:**
1. Update all downstream agent AGENTS.md with "Chain of Command" section
2. Update CMO and CTO AGENTS.md with "Team Management" section
3. Update CMO and CTO HEARTBEAT.md with "Team Monitoring" step
4. Update CEO AGENTS.md and HEARTBEAT.md to route through heads

**Risk:** LOW. Instruction changes only. If an agent ignores the instruction, the fallback is v1 behaviour (CEO routes directly).

### Phase 3: Cross-Department Event Bus
**Why third:** Delegation chains must be in place so that event bus issues route to department heads (not CEO).

**Deliverables:**
1. Create `docs/event-templates.md` with predefined handoff templates
2. Create x-dept labels via Paperclip API
3. Update CMO and CTO HEARTBEAT.md with "Cross-Department Handoff" section
4. Update CEO HEARTBEAT.md with "Event Bus Monitoring" section
5. Update Product Owner HEARTBEAT.md with x-dept label awareness

**Risk:** MEDIUM. Agents must reliably create handoff issues when triggers occur. The triggering logic lives in instructions, not code, so agents may forget.

### Phase 4: Data Gating
**Why fourth:** All the read directives and brain files must exist before defining what agents should NOT read.

**Deliverables:**
1. Update all agent AGENTS.md with "Data Scope" section
2. Document the data access matrix in `docs/data-access-matrix.md`

**Risk:** LOW for implementation. LOW for enforcement (honour system).

### Phase 5: Sub-Agent Teams (LinkedIn)
**Why last:** Most complex. Requires delegation chains (so sub-agents know who to report to), department brains (so sub-agents have context), and data gating (so sub-agents stay in scope). Also the highest risk for machine resource limits.

**Deliverables:**
1. Create linkedin-content-specialist agent directory and files
2. Create linkedin-outreach-specialist agent directory and files
3. Register both agents via Paperclip API
4. Update LinkedIn Growth Director: remove production skills, add team lead logic
5. Update CEO AGENTS.md with new agent roster
6. Update skill ownership matrix
7. Test: assign a LinkedIn campaign issue and verify delegation chain works

**Risk:** MEDIUM. Moving skills between agents. New agent registration. Concurrent agent count increases. Integration testing required.

## Patterns to Follow

### Pattern 1: Write-One-Read-Many for Department Brains
**What:** Only the department head writes to the brain file. All other agents in the stream read it.
**Why:** Prevents race conditions. One writer means no conflicts.
**Enforcement:** HEARTBEAT.md instruction in the department head's update section.

### Pattern 2: Issue-Based Handoffs (not file-based)
**What:** Cross-department triggers create new issues, not shared files.
**Why:** Issues are Paperclip's native coordination mechanism. They have status tracking, comments, assignment, and labels. Files have none of that.
**When:** Any time work crosses department boundaries.

### Pattern 3: Instruction-Enforced Hierarchy
**What:** Since Paperclip's `reportsTo` is flat, hierarchy is enforced by telling agents who they report to in their AGENTS.md.
**Why:** Only available mechanism. The agent's AGENTS.md is read on every wake and shapes all behaviour.
**Failure mode:** An agent ignores the instruction and acts outside its chain. Mitigation: CEO stall detection catches misrouted work.

### Pattern 4: Graceful Degradation
**What:** Every v2 feature degrades gracefully to v1 behaviour if an agent doesn't follow the new instructions.
**Why:** Instructions are not code. Agents might skip steps.
**Example:** If CMO forgets to update the brain file, business agents simply operate without the latest context (same as v1). If an agent ignores chain of command and @-mentions CEO directly, CEO can still handle it.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Building a Message Queue
**What:** Creating a file-based pub/sub system with message files, polling loops, and acknowledgement files.
**Why bad:** Over-engineering. Paperclip issues already provide assignment, status tracking, and comments. Adding a parallel messaging system creates two coordination mechanisms that can conflict.
**Instead:** Use the x-dept label convention on standard issues.

### Anti-Pattern 2: Deep Nesting of Sub-Teams
**What:** Creating sub-sub-agents (e.g., LinkedIn Content Specialist has a Graphics Agent reporting to them).
**Why bad:** Each layer of hierarchy adds instruction complexity and multiplies the agent count. With 2-3 concurrent agents and instruction-only enforcement, deep nesting becomes unreliable.
**Instead:** Keep hierarchy to three levels max: CEO -> Department Head -> Specialist.

### Anti-Pattern 3: Shared Mutable State Across Departments
**What:** Both departments writing to the same context file.
**Why bad:** Race conditions. Agent A's heartbeat overwrites Agent B's update.
**Instead:** Each department has its own brain. Cross-department information flows via issues, not shared files.

### Anti-Pattern 4: Automating Data Gating with Code
**What:** Writing scripts that restrict file access or modify permissions.
**Why bad:** Paperclip agents run as the same user. File permissions would block all agents equally. The only enforcement mechanism is instructions.
**Instead:** Trust the instruction-based approach and use CEO monitoring to catch violations.

## Sources

- Paperclip company files at `~/.paperclip/instances/default/companies/FourPointZero/` (direct examination)
- v1.0 architecture research at `.planning/research/ARCHITECTURE.md` (previous milestone)
- Paperclip API endpoints documented in agent HEARTBEAT.md files (Issues CRUD, agent status, checkout)
- Paperclip plugin templates at `~/.paperclip/plugin-templates/` (platform capabilities reference)
- PROJECT.md constraints: "Paperclip constraints: flat reportsTo, no data isolation, async task passing only"
