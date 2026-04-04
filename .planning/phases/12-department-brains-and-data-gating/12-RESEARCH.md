# Phase 12: Department Brains and Data Gating - Research

**Researched:** 2026-04-04
**Domain:** File-based shared knowledge and instruction-enforced data boundaries within Paperclip
**Confidence:** HIGH

## Summary

This phase creates two new capabilities using only Paperclip's existing primitives (files + agent instructions): department brain directories that give agents shared stream context, and data scope sections that define what each agent should and should not read. No new technology is needed. Every change is either a new markdown file or an edit to an existing AGENTS.md/HEARTBEAT.md.

The work breaks down into two clean halves: (1) creating the brain directories and wiring all 10 agents to read them, and (2) adding Data Scope sections to all 10 agents' AGENTS.md files. The CMO and CTO get additional HEARTBEAT.md changes for brain update duties. The CEO and Product Owner get cross-stream read access.

**Primary recommendation:** Create the `_departments/business/` and `_departments/tech/` directories under the agents root, populate initial BRAIN.md files from existing context (positioning from product-marketing-context.md for business, tech stack from CTO AGENTS.md for tech), then update all AGENTS.md files in a single systematic pass that adds both the brain Read directive AND the Data Scope section to each agent.

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| BRAIN-01 | CMO stream brain directory created with shared marketing context | Architecture research defines the directory structure and BRAIN.md template. Initial content comes from product-marketing-context.md and CMO's existing positioning docs. |
| BRAIN-02 | CTO stream brain directory created with shared tech context | Architecture research defines the structure. Initial content from CTO AGENTS.md tech stack section and existing architecture decisions. |
| BRAIN-03 | Each agent's AGENTS.md updated with Read directives pointing to department brain | All 10 agents mapped below with their correct Read path. Pattern matches existing `Read:` directives already in use. |
| BRAIN-04 | Brain files capped at 200 lines with rotation/pruning strategy | Pitfalls research (Pitfall 1) validates this cap. Pruning strategy defined as FIFO on the decisions section. |
| BRAIN-05 | Department heads (CMO, CTO) are the only agents that write to brain files | Write-one-read-many pattern from architecture research. Enforced via HEARTBEAT.md instruction in CMO/CTO only. |
| GATE-01 | Each agent has a Data Scope section in AGENTS.md defining readable paths | Template defined below. One section per agent, listing allowed and disallowed paths. |
| GATE-02 | Business stream agents scoped to marketing/content/competitive data | Business agents get Read access to business brain, their own agent dir, docs/, workspace. Explicitly told not to read tech brain or tech agent dirs. |
| GATE-03 | Tech stream agents scoped to engineering/product/architecture data | Tech agents get Read access to tech brain, their own agent dir, docs/, workspace. Explicitly told not to read business brain or business agent dirs. |
| GATE-04 | CEO and Product Owner have cross-stream read access | Both agents get Read directives for BOTH brain directories. Data Scope explicitly permits cross-stream reads. |
| GATE-05 | Data scope violations logged when detected | CEO heartbeat gets a lightweight audit check. Advisory only, no enforcement. |

</phase_requirements>

## Standard Stack

### Core

No new libraries or tools. Everything is markdown files and Paperclip primitives.

| Component | Purpose | Why Standard |
|-----------|---------|--------------|
| Markdown files (BRAIN.md) | Shared department knowledge | Paperclip agents already load markdown via `Read:` directives. Proven pattern with product-marketing-context.md (referenced by 33 files). |
| `Read:` directives in AGENTS.md | Wire agents to brain files | Existing mechanism, no file count cap (unlike skills/ which caps at 10). |
| HEARTBEAT.md sections | Brain update duties for dept heads | Existing heartbeat structure already has numbered steps. Adding a new step is the established pattern. |
| AGENTS.md sections | Data Scope definitions | Existing AGENTS.md files average 77-106 lines. Adding a Data Scope section keeps them well under any practical limit. |

### What NOT to Add

| Do Not Build | Why |
|--------------|-----|
| Database or API-backed knowledge store | Paperclip has no built-in knowledge layer. Files are the only persistence agents can read/write. |
| File permission scripts | Paperclip agents run as the same user. File permissions would block all agents equally. |
| Custom enforcement tooling | Out of scope per PROJECT.md ("Modifying Paperclip source code"). |
| Separate brain files per topic | Creates context window bloat. One BRAIN.md per department, capped at 200 lines, with pointers to detail docs. |

## Architecture Patterns

### Directory Structure (New)

```
~/.paperclip/instances/default/companies/FourPointZero/
  agents/
    _departments/
      business/
        BRAIN.md              # Shared business stream context (max 200 lines)
      tech/
        BRAIN.md              # Shared tech stream context (max 200 lines)
    ceo/                      # Reads BOTH brains
    cmo/                      # Reads business brain, WRITES to business brain
    cto/                      # Reads tech brain, WRITES to tech brain
    technical-writer/         # Reads business brain
    customer-success/         # Reads business brain
    ux-researcher/            # Reads business brain
    linkedin-growth-director/ # Reads business brain
    engineer/                 # Reads tech brain
    code-reviewer/            # Reads tech brain
    product-owner/            # Reads BOTH brains (cross-stream role)
```

The `_departments/` underscore prefix groups it visually at the top of directory listings and signals "not an agent directory."

### Pattern 1: Write-One-Read-Many for Brain Files

**What:** Only the department head (CMO for business, CTO for tech) writes to their brain file. All other stream agents read only.
**Why:** Prevents race conditions. Multiple agents writing to the same file during overlapping heartbeats would cause data loss.
**Enforcement:** CMO HEARTBEAT.md gets a "Update Department Brain" step. CTO HEARTBEAT.md gets the same. No other agent's heartbeat includes write instructions for brain files.
**CEO exception:** CEO can also write to either brain if needed (executive override), but this should be rare and documented.

### Pattern 2: Just-In-Time Loading via Pointers

**What:** Brain files contain high-signal summaries (current focus, recent decisions, standing instructions) and pointers to detail docs ("See workspace/q2-positioning.md for full positioning analysis").
**Why:** Keeps brain files under 200 lines. Agents load the summary on every heartbeat but only follow pointers when the task requires that detail.
**From:** Pitfalls research, Pitfall 1 (Context Window Explosion).

### Pattern 3: Advisory Data Gating

**What:** Each agent's AGENTS.md includes a Data Scope section listing what they may and may not read. No technical enforcement.
**Why:** Paperclip has no per-agent file permissions (confirmed in architecture research, Paperclip GitHub Issue #1858).
**Failure mode:** An agent reads a file outside its scope. The instruction is ignored. Mitigation: CEO heartbeat checks for cross-scope access in agent comments.
**This is explicitly a known limitation** per REQUIREMENTS.md ("Technical data gating enforcement" is out of scope).

### Agent-to-Brain Mapping

| Agent | Stream | Brain Read | Brain Write | Cross-Stream Read |
|-------|--------|------------|-------------|-------------------|
| CEO | Cross | Both | Both (rare) | Yes |
| CMO | Business | Business | Business | No |
| CTO | Tech | Tech | Tech | No |
| Technical Writer | Business | Business | No | No |
| Customer Success | Business | Business | No | No |
| UX Researcher | Business | Business | No | No |
| LinkedIn Growth Director | Business | Business | No | No |
| Software Engineer | Tech | Tech | No | No |
| Code Reviewer | Tech | Tech | No | No |
| Product Owner | Cross | Both | No | Yes |

### Anti-Patterns to Avoid

- **Multiple brain files per department:** Creates the "which file do I read?" problem. One BRAIN.md per department, period. Use sections within the file, not separate files.
- **Embedding full documents in brain files:** Brain files must be summaries with pointers, not repositories. The 200-line cap prevents this but be explicit in the template.
- **Making brain updates optional:** If CMO's heartbeat does not explicitly include the brain update step, the brain goes stale within days. It must be a numbered step, not a suggestion.
- **Symmetric data gating:** Do not give all agents identical Data Scope sections. Each agent's scope must be specific to their role and stream.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Shared agent memory | Custom file-sync system | Single BRAIN.md per dept with Read directives | Race conditions, complexity |
| Access control | Permission scripts or wrappers | Advisory Data Scope in AGENTS.md | Paperclip has no per-agent permissions |
| Brain rotation/pruning | Automated cron scripts | Manual pruning instruction in dept head HEARTBEAT.md | Keep it simple, dept heads prune on update |
| Cross-stream context sharing | Shared files both streams write to | Each brain stays separate, cross-stream agents read both | Prevents write conflicts |

## Common Pitfalls

### Pitfall 1: Context Window Bloat from Brain Loading

**What goes wrong:** Brain file grows past 200 lines, combined with 10 skill files + AGENTS.md + SOUL.md + HEARTBEAT.md, the agent runs out of reasoning room.
**Why it happens:** Department heads append decisions without pruning. Brain accumulates historical context that is no longer actionable.
**How to avoid:** Hard 200-line cap. Brain update step must include: "If BRAIN.md exceeds 200 lines, archive the oldest decisions section to `_departments/{stream}/archive/YYYY-MM.md` and remove from BRAIN.md."
**Warning signs:** Agent outputs become vague or ignore task-specific instructions. Token usage per heartbeat climbs.

### Pitfall 2: Brain Staleness

**What goes wrong:** Nobody updates the brain. Agents execute against outdated strategy for weeks.
**Why it happens:** The brain update step is skipped because the dept head has no new decisions to record.
**How to avoid:** Add a `Last Updated:` timestamp to the brain file header. Even if no changes, the dept head updates the timestamp to confirm the brain is current. CEO heartbeat checks: if brain timestamp is older than 14 days, create a review issue for the dept head.
**Warning signs:** Brain file `Last Updated` date drifts.

### Pitfall 3: Data Scope Instruction Ignored

**What goes wrong:** An agent reads a file outside its declared scope because the task mentions it, or a skill file references it.
**Why it happens:** Advisory gating competes with task instructions. If a task says "review the tech architecture decisions," a business stream agent will read the tech brain because the task told it to.
**How to avoid:** Data Scope instruction should include: "If a task requires data outside your scope, comment on the issue requesting the relevant department head to provide the information, rather than reading it directly." This routes the request through proper channels.
**Warning signs:** Agent comments reference files from the other department's brain directory.

### Pitfall 4: Forgetting Product Owner's Cross-Stream Role

**What goes wrong:** Product Owner is treated as tech-only and given only the tech brain Read directive.
**Why it happens:** Product Owner reports to CEO, sits in the tech stream org chart, but manages backlog across both streams.
**How to avoid:** Explicitly give Product Owner Read access to both brains. The Data Scope section must call out cross-stream access.

## Code Examples

### Business Brain File Template (BRAIN-01)

```markdown
# Business Stream Brain

**Last Updated:** 2026-04-04
**Updated By:** CMO

## Current Strategic Focus
FourPointZero CreativAI practice launch. Positioning as "informed industry observer"
at the intersection of creative technology and AI hiring. See
workspace/product-marketing-context.md for full positioning framework.

## Active Initiatives
| Initiative | Owner | Status | Target |
|------------|-------|--------|--------|
| [initiative] | [agent] | [status] | [date] |

## Recent Decisions (newest first, max 10)
- 2026-04-04: [Decision]. [Rationale]. -- CMO
- [older entries pruned when exceeding 10]

## Standing Instructions (apply to all business stream agents)
- All content must pass through Technical Writer quality gate before publishing
- UK English only, no exceptions
- Read product-marketing-context.md before any content or strategy work
- Never present unsourced statistics as factual

## Key References (pointers, not content)
- Full positioning: `workspace/product-marketing-context.md`
- Brand voice: `docs/BRAND-IDENTITY.md`
- Content calendar: [location TBD by CMO]
```

### Tech Brain File Template (BRAIN-02)

```markdown
# Tech Stream Brain

**Last Updated:** 2026-04-04
**Updated By:** CTO

## Current Technical Focus
ADHD Executive Function System maintenance and FPZ internal tooling.
Primary stack: Next.js, Vercel, Notion (persistence), n8n (automation),
OpenRouter (LLM). See CTO AGENTS.md for full stack details.

## Active Work
| Work Item | Owner | Status | Priority |
|-----------|-------|--------|----------|
| [item] | [agent] | [status] | [priority] |

## Architecture Decisions (newest first, max 10)
- 2026-04-04: [Decision]. [Rationale]. -- CTO
- [older entries pruned when exceeding 10]

## Tech Debt Register (top 5)
| Item | Severity | Owner | Notes |
|------|----------|-------|-------|
| [item] | [sev] | [agent] | [notes] |

## Standing Instructions (apply to all tech stream agents)
- TypeScript, conventional commits, immutable patterns, composition over inheritance
- All code changes go through Code Reviewer before merging
- Never skip tests for infrastructure changes

## Key References (pointers, not content)
- Repo: https://github.com/makinsonmjttrt/adhd-ef-system
- Architecture: CTO AGENTS.md "Tech Stack" section
- Deployment: Vercel dashboard
```

### Read Directive Addition (BRAIN-03)

Add to each agent's AGENTS.md, after the References section and before Skills:

```markdown
## Department Brain

Read: `agents/_departments/business/BRAIN.md`
```

Or for tech stream:

```markdown
## Department Brain

Read: `agents/_departments/tech/BRAIN.md`
```

Or for cross-stream agents (CEO, Product Owner):

```markdown
## Department Brains

Read: `agents/_departments/business/BRAIN.md`
Read: `agents/_departments/tech/BRAIN.md`
```

### HEARTBEAT.md Brain Update Step (BRAIN-05)

Add as step 3.5 (between "Checkout and Work" and "Handover") in CMO and CTO HEARTBEAT.md:

```markdown
## 3.5 Update Department Brain

After completing any work that produces a decision, changes strategy, or affects
other agents in your stream:

1. Read `agents/_departments/{business|tech}/BRAIN.md`
2. Update the relevant section:
   - New strategic focus? Update "Current Strategic Focus"
   - New initiative? Add to "Active Initiatives"
   - Made a decision? Prepend to "Recent Decisions" with today's date
   - New standing instruction? Add to "Standing Instructions"
3. If BRAIN.md exceeds 200 lines:
   - Remove the oldest entries from "Recent Decisions" (keep max 10)
   - Archive removed content to `agents/_departments/{stream}/archive/YYYY-MM.md`
4. Update the "Last Updated" timestamp and "Updated By" field
5. If no updates needed, still update the "Last Updated" timestamp to confirm currency
```

### Data Scope Section Template (GATE-01, GATE-02, GATE-03)

For a business stream agent (e.g., Technical Writer):

```markdown
## Data Scope

**You may read:**
- Your agent directory: `$AGENT_HOME/`
- Business stream brain: `agents/_departments/business/BRAIN.md`
- Shared docs: `docs/`
- Project workspace: `projects/FourPointZero/workspace/` (deliverables relevant to your work)
- Product marketing context: referenced via your skills

**You should NOT read:**
- Other agents' directories (their memory, their skills, their SOUL.md)
- Tech stream brain: `agents/_departments/tech/BRAIN.md`
- Tech stream agent directories: `agents/cto/`, `agents/engineer/`, `agents/code-reviewer/`

**If a task requires data outside your scope:** Comment on the issue requesting
the relevant department head to provide the information. Do not read cross-stream
files directly.
```

For a cross-stream agent (CEO or Product Owner):

```markdown
## Data Scope

**You may read:**
- Your agent directory: `$AGENT_HOME/`
- Both department brains: `agents/_departments/business/BRAIN.md`, `agents/_departments/tech/BRAIN.md`
- All agent directories (executive/cross-stream oversight)
- Shared docs: `docs/`
- Project workspace: `projects/FourPointZero/workspace/`

**Cross-stream access:** You have read access to both streams for coordination
and oversight purposes.
```

### CEO Violation Logging (GATE-05)

Add to CEO HEARTBEAT.md stall detection section:

```markdown
## Data Scope Audit (lightweight)

During stall detection sweeps, if you notice an agent's issue comments
referencing files from the other department's brain or agent directories:
- Comment on the issue: `[SCOPE] {agent name} accessed {file path} outside
  declared data scope. Advisory notice -- not a blocker.`
- Do NOT block the work. This is logging, not enforcement.
- If repeated violations from the same agent, create an issue to strengthen
  that agent's Data Scope wording in AGENTS.md.
```

## State of the Art

| Old Approach (v1.0) | New Approach (v2.0 Phase 12) | Impact |
|----------------------|------------------------------|--------|
| No shared context between stream agents | Department brain files loaded on every heartbeat | Agents in the same stream share strategy, decisions, and standing instructions |
| All agents can read all files with no guidance | Data Scope section tells each agent what to read and not read | Reduces noise, focuses agent attention, creates audit trail for violations |
| Only CEO has cross-department awareness | CEO + Product Owner have explicit cross-stream brain access | Product Owner can prioritise across streams with full context |
| No write discipline on shared files | Write-one-read-many enforced via HEARTBEAT.md | Prevents race conditions on brain files |

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual validation via Paperclip heartbeat + file inspection |
| Config file | None (no automated test framework for agent instruction files) |
| Quick run command | `cat agents/_departments/business/BRAIN.md && cat agents/_departments/tech/BRAIN.md` |
| Full suite command | Inspect all 10 AGENTS.md files for Read directives and Data Scope sections |

### Phase Requirements to Test Map

| Req ID | Behaviour | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BRAIN-01 | Business brain directory and BRAIN.md exist with marketing context | smoke | `test -f agents/_departments/business/BRAIN.md && wc -l agents/_departments/business/BRAIN.md` | Wave 0 |
| BRAIN-02 | Tech brain directory and BRAIN.md exist with tech context | smoke | `test -f agents/_departments/tech/BRAIN.md && wc -l agents/_departments/tech/BRAIN.md` | Wave 0 |
| BRAIN-03 | All 10 agents have correct Read directives | smoke | `grep -l "_departments" agents/*/AGENTS.md \| wc -l` (should be 10) | Wave 0 |
| BRAIN-04 | Brain files are under 200 lines | smoke | `wc -l agents/_departments/*/BRAIN.md` (both under 200) | Wave 0 |
| BRAIN-05 | Only CMO/CTO HEARTBEAT.md contain brain write instructions | smoke | `grep -l "Update Department Brain" agents/*/HEARTBEAT.md` (should be exactly 2: cmo, cto) | Wave 0 |
| GATE-01 | All 10 agents have Data Scope section | smoke | `grep -l "Data Scope" agents/*/AGENTS.md \| wc -l` (should be 10) | Wave 0 |
| GATE-02 | Business agents scoped to marketing data | manual-only | Read each business agent's Data Scope; verify tech brain listed under "should NOT read" | N/A |
| GATE-03 | Tech agents scoped to engineering data | manual-only | Read each tech agent's Data Scope; verify business brain listed under "should NOT read" | N/A |
| GATE-04 | CEO and PO have cross-stream read access | smoke | `grep -c "both" agents/ceo/AGENTS.md agents/product-owner/AGENTS.md` | Wave 0 |
| GATE-05 | Data scope violations logged | manual-only | Verify CEO HEARTBEAT.md contains "Data Scope Audit" section | N/A |

### Sampling Rate

- **Per task commit:** Verify file exists, line count under 200, grep for expected sections
- **Per wave merge:** Full inspection of all 10 AGENTS.md files + both BRAIN.md files
- **Phase gate:** All smoke commands pass + manual review of Data Scope sections for correctness

### Wave 0 Gaps

- [ ] `agents/_departments/business/BRAIN.md` -- must be created (BRAIN-01)
- [ ] `agents/_departments/tech/BRAIN.md` -- must be created (BRAIN-02)
- [ ] No automated test infrastructure exists for agent instruction files. All validation is file inspection via shell commands.

## Open Questions

1. **Brain file initial content source**
   - What we know: product-marketing-context.md exists at `workspace/product-marketing-context.md` and `agents/cmo/skills/product-marketing-context.md`. CTO AGENTS.md has a "Tech Stack" section. These are the starting points.
   - What's unclear: Whether the board wants to seed the brain with specific historical decisions, or start fresh with only current state.
   - Recommendation: Start with current state only. Historical decisions can be added by dept heads during their first brain update heartbeat.

2. **Archive directory for pruned brain content**
   - What we know: Brain rotation requires archiving old entries when exceeding 200 lines.
   - What's unclear: Whether `_departments/{stream}/archive/` is the right location, or if pruned content should simply be deleted.
   - Recommendation: Create the archive directory. Low cost, high value if someone needs to recover a pruned decision.

3. **Token cost of brain loading**
   - What we know: STATE.md lists "Token cost modelling for brain-loading heartbeats not yet produced" as a blocker/concern.
   - What's unclear: Exact token cost of adding ~200 lines of brain context to every heartbeat.
   - Recommendation: Proceed. 200 lines is roughly 600-800 tokens. Against agent context budgets of 100K+ tokens, this is negligible. The 200-line cap was designed specifically to keep this safe.

## Sources

### Primary (HIGH confidence)
- Direct inspection of all 10 agent AGENTS.md files at `~/.paperclip/instances/default/companies/FourPointZero/agents/`
- Direct inspection of CMO and CTO HEARTBEAT.md files
- Architecture research at `.planning/research/ARCHITECTURE.md` (v2.0, researched 2026-04-03)
- Pitfalls research at `.planning/research/PITFALLS.md` (v2.0, researched 2026-04-03)
- Stack research at `.planning/research/STACK.md` (v2.0, researched 2026-04-03)

### Secondary (MEDIUM confidence)
- REQUIREMENTS.md requirement definitions for BRAIN-01 through GATE-05
- STATE.md project decisions and blockers

### Tertiary (LOW confidence)
- None. All findings verified against existing files and prior research.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new technology, using proven Paperclip primitives already in production
- Architecture: HIGH -- directory structure and Read directive patterns verified against 10 live agent configs
- Pitfalls: HIGH -- all pitfalls sourced from v2.0 pitfalls research with Paperclip GitHub issue references
- Data gating approach: HIGH -- advisory-only explicitly confirmed in REQUIREMENTS.md as the intended approach

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable -- no external dependencies or version sensitivity)
