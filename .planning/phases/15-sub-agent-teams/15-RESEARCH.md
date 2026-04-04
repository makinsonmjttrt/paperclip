# Phase 15: Sub-Agent Teams - Research

**Researched:** 2026-04-04
**Domain:** Paperclip agent expansion -- specialist sub-agents under LinkedIn Growth Director and Technical Writer
**Confidence:** HIGH

## Summary

This phase creates 4 new specialist agents by splitting production skills from two existing directors (LinkedIn Growth Director and Technical Writer). The LinkedIn Growth Director keeps 2 strategic skills and delegates 5 production skills across 2 new specialists. The Technical Writer keeps quality-gate and blog-engine skills and delegates 5 production skills across 2 new specialists.

All implementation is file-based: create agent directories (AGENTS.md, HEARTBEAT.md, SOUL.md, TOOLS.md, MEMORY.md, skills/), move skill files from parent to specialist, update parent agent files, register agents via Paperclip API, and update the skill ownership matrix. The hierarchy is instruction-enforced (Paperclip's `reportsTo` is flat), following patterns already established in Phase 13 delegation chains.

**Primary recommendation:** Create all 4 specialists, redistribute skills (never duplicate), set `reportsTo` to the direct manager (not CEO) for each sub-agent, and assign stagger slots B6-B9 in the business stream.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TEAM-01 | LinkedIn Content Specialist (hook writing, carousel scripts, story posts) | Skill redistribution plan: receives linkedin-post-writer + linkedin-content-strategy from LinkedIn Growth Director. Agent directory structure, SOUL.md differentiation, HEARTBEAT.md with sub-team delegation pattern |
| TEAM-02 | LinkedIn Outreach Specialist (DM sequences, connection requests, engagement) | Skill redistribution plan: receives cold-outreach-sequence + cold-email + meeting-prep from LinkedIn Growth Director. Agent directory structure, SOUL.md differentiation, outreach-specific heartbeat |
| TEAM-03 | Content Producer under Technical Writer (drafting blog posts, newsletters, social content) | Skill redistribution plan: receives copywriting + email-sequence + social-content + ad-creative + content-creator from Technical Writer. Technical Writer retains quality-gate + blog-engine + newsletter-suite + social-card-gen + tweet-draft-reviewer |
| TEAM-04 | Quality Reviewer under Technical Writer (humanizer pass, copy-editing, brand voice checks) | Skill redistribution plan: receives quality-gate bundle from Technical Writer. Technical Writer retains blog-engine + newsletter-suite as production and routes ALL content through Quality Reviewer for final pass |
| TEAM-05 | Skill ownership matrix updated for all new agents | Updated matrix with 14 agents, skills redistributed (not duplicated), all agents under 10-file cap |
| TEAM-06 | New agents registered in Paperclip and validated via heartbeat | Registration via `paperclip-create-agent` or BOOTSTRAP.md append, heartbeat validation procedure, stagger slot assignment |
</phase_requirements>

## Standard Stack

This phase has no software dependencies. Everything is Paperclip file-and-instruction-based.

### Core Components
| Component | Purpose | Why Standard |
|-----------|---------|--------------|
| AGENTS.md | Agent identity, chain of command, data scope, skill references | Required by Paperclip for every agent |
| HEARTBEAT.md | Execution checklist per wake cycle | Required by Paperclip for every agent |
| SOUL.md | Persona, voice, tone differentiation | Required by Paperclip for every agent |
| TOOLS.md | Tool access (placeholder for new agents) | Required by Paperclip for every agent |
| MEMORY.md | Heartbeat checkpoint, session state | Required for checkpoint protocol (established Phase 11) |
| skills/*.md | Skill files moved from parent agent | One file per skill or bundle, max 10 per agent |

### Paperclip API Endpoints
| Endpoint | Purpose |
|----------|---------|
| `paperclip-create-agent` | Register new agents with role and instructionsFilePath |
| `GET /api/companies/{companyId}/agents` | Verify agent registration and status |
| `POST /api/companies/{companyId}/issues` | Create test issues for heartbeat validation |

## Architecture Patterns

### Agent Directory Structure (per new agent)
```
agents/
  linkedin-content-specialist/
    AGENTS.md
    HEARTBEAT.md
    SOUL.md
    TOOLS.md
    MEMORY.md
    skills/
      linkedin-post-writer.md      (moved from linkedin-growth-director)
      linkedin-content-strategy.md  (moved from linkedin-growth-director)
  linkedin-outreach-specialist/
    AGENTS.md
    HEARTBEAT.md
    SOUL.md
    TOOLS.md
    MEMORY.md
    skills/
      cold-outreach-sequence.md    (moved from linkedin-growth-director)
      cold-email.md                (moved from linkedin-growth-director)
      meeting-prep.md              (moved from linkedin-growth-director)
  content-producer/
    AGENTS.md
    HEARTBEAT.md
    SOUL.md
    TOOLS.md
    MEMORY.md
    skills/
      copywriting.md               (moved from technical-writer)
      email-sequence.md            (moved from technical-writer)
      social-content.md            (moved from technical-writer)
      ad-creative.md               (moved from technical-writer)
      content-creator.md           (moved from technical-writer)
  quality-reviewer/
    AGENTS.md
    HEARTBEAT.md
    SOUL.md
    TOOLS.md
    MEMORY.md
    skills/
      quality-gate.md              (moved from technical-writer)
```

### Pattern 1: Skill Redistribution (Move, Never Duplicate)
**What:** Skills physically move from parent agent's `skills/` directory to specialist's `skills/` directory. The `Read and follow:` directive in the parent's AGENTS.md is removed. The specialist's AGENTS.md gets the directive instead.
**When to use:** Every skill transfer in this phase.
**Why:** Pitfall 7 (Skill File Bloat) explicitly warns against forking or duplicating skills. Single ownership means updates propagate from one location.

### Pattern 2: Instruction-Enforced Sub-Team Hierarchy
**What:** Each specialist's AGENTS.md states who they report to and accept work from. The parent agent's HEARTBEAT.md gets a "Sub-Team Delegation" section for creating sub-issues assigned to specialists.
**When to use:** All 4 new agents.
**Example (from Architecture research, already validated in Phase 13):**
```markdown
## Chain of Command

You report to [LinkedIn Growth Director / Technical Writer].
Accept work assignments from:
1. Your team lead ([LinkedIn Growth Director / Technical Writer]) -- primary
2. The CMO -- stream head authority
3. The CEO -- override authority

Do NOT accept work from peer agents directly. If a peer needs work from you,
they should route through your team lead.

When completing work, @-mention your team lead (not the CMO or CEO) for review.
```

### Pattern 3: reportsTo Set to Direct Manager
**What:** When registering agents via Paperclip API, set `reportsTo` to the direct manager agent ID, not the CEO. This avoids chain-of-command enforcement conflicts (Pitfall 10).
**When to use:** All 4 new agents.
**Validation needed:** Confirm Paperclip supports non-CEO `reportsTo`. The architecture research flagged this as needing testing (PR #1082 chain-of-command enforcement). If Paperclip blocks Director-to-Specialist management, fall back to CEO `reportsTo` with instruction-only hierarchy.

### Pattern 4: Stagger Slot Assignment
**What:** New agents get unique business stream stagger slots. Current slots: B1 (CMO), B2 (Technical Writer), B3 (LinkedIn Growth Director), B4 (Customer Success), B5 (UX Researcher).
**Assignment:**
| Agent | Slot |
|-------|------|
| LinkedIn Content Specialist | B6 |
| LinkedIn Outreach Specialist | B7 |
| Content Producer | B8 |
| Quality Reviewer | B9 |

### Anti-Patterns to Avoid
- **Duplicating skills across parent and specialist:** Parent must LOSE the skill when specialist gains it. If both have `linkedin-post-writer.md`, outputs drift apart.
- **Deep nesting (4+ levels):** CEO > CMO > LinkedIn Director > Content Specialist is already 4 levels. No further sub-agents below specialists.
- **Generic SOUL.md files:** Each specialist must have a SOUL.md that clearly differentiates it from its parent. If outputs are interchangeable, the agent is unnecessary (Pitfall 14).
- **Forking skill files:** Never copy-and-modify a skill. Move the canonical file. If the specialist needs a narrower focus, add a role-specific section to the existing skill file.

## Skill Redistribution Plan

### LinkedIn Growth Director: Before and After

**Before (7 skills):**
1. linkedin-post-writer.md
2. linkedin-content-strategy.md
3. linkedin-authority-builder.md
4. linkedin-profile-optimizer.md
5. cold-outreach-sequence.md
6. meeting-prep.md
7. cold-email.md

**After (2 skills -- strategic/oversight only):**
1. linkedin-authority-builder.md (strategic thought leadership positioning)
2. linkedin-profile-optimizer.md (profile audit, quarterly)

**New role:** Team lead. Creates sub-issues for specialists. Reviews output. Approves before routing to Technical Writer quality gate.

### LinkedIn Content Specialist (receives 2 skills):
1. linkedin-post-writer.md
2. linkedin-content-strategy.md

### LinkedIn Outreach Specialist (receives 3 skills):
1. cold-outreach-sequence.md
2. cold-email.md
3. meeting-prep.md

### Technical Writer: Before and After

**Before (10 skills):**
1. quality-gate.md (bundle: humanizer + de-ai-ify + copy-editing)
2. copywriting.md
3. email-sequence.md
4. social-content.md
5. ad-creative.md
6. content-creator.md
7. social-card-gen.md
8. tweet-draft-reviewer.md
9. blog-engine.md (bundle: 6 blog skills)
10. newsletter-suite.md (bundle: 3 newsletter skills)

**After (5 skills -- blog production + oversight):**
1. blog-engine.md (bundle: 6 blog skills)
2. newsletter-suite.md (bundle: 3 newsletter skills)
3. social-card-gen.md
4. tweet-draft-reviewer.md
5. (open slot for future)

**New role:** Blog/newsletter production owner. Delegates general content production to Content Producer. Routes ALL content through Quality Reviewer for final pass. Still owns the blog workflow end-to-end.

### Content Producer (receives 5 skills):
1. copywriting.md
2. email-sequence.md
3. social-content.md
4. ad-creative.md
5. content-creator.md

### Quality Reviewer (receives 1 skill bundle):
1. quality-gate.md (bundle: humanizer + de-ai-ify + copy-editing)

**Quality gate routing change:** Currently, content-producing agents route to Technical Writer for quality gate. After this phase, they route to Quality Reviewer instead. Technical Writer's HEARTBEAT.md quality gate sections (Steps 4 and 5) move to Quality Reviewer's HEARTBEAT.md.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Agent registration | Manual API calls | `paperclip-create-agent` via CEO | Handles governance flow, sets up agent correctly |
| Skill file management | Custom scripts to symlink or copy skills | Physical file move (mv) | Paperclip reads `$AGENT_HOME/skills/` directory directly. Symlinks may not resolve correctly |
| Heartbeat validation | Manual observation | Test issue assigned to new agent + status check via API | Automated verification catches registration errors |
| Stagger slot collision detection | Mental tracking | Grep all HEARTBEAT.md files for slot assignments | Prevents accidental duplicates |

## Common Pitfalls

### Pitfall 1: Quality Gate Becomes Bottleneck
**What goes wrong:** Quality Reviewer becomes a single point of failure. Every piece of content from every agent must route through one specialist. If Quality Reviewer stalls or has a corrupted session, all content publishing stops.
**Why it happens:** Moving quality-gate from Technical Writer (who also produces content and can self-gate) to a dedicated reviewer means one agent handles ALL quality checks.
**How to avoid:** Give Technical Writer a fallback instruction: "If Quality Reviewer is stalled for 2+ heartbeat cycles, run quality-gate checks yourself using the skill documentation (not the skill file)." This is graceful degradation to v1 behaviour.
**Warning signs:** Quality Reviewer has 5+ open review issues. Content sits in `in_review` for 3+ cycles.

### Pitfall 2: LinkedIn Growth Director Has Nothing to Do
**What goes wrong:** After giving away 5 of 7 skills, the LinkedIn Growth Director becomes a pass-through that creates sub-issues and reviews output. With only 2 strategic skills (authority-builder, profile-optimizer) that run infrequently (quarterly profile review, periodic thought leadership), the agent wakes on heartbeat but has no work.
**Why it happens:** The team lead role sounds valuable but in practice the CMO already creates and routes LinkedIn issues.
**How to avoid:** LinkedIn Growth Director must have real work: reviewing specialist output (quality check before quality gate), maintaining LinkedIn content calendar, managing the content cadence (2 posts/week, 1 authority piece/fortnight). Make the HEARTBEAT.md explicit about these ongoing responsibilities.

### Pitfall 3: Telephone Effect at 4 Hops
**What goes wrong:** CEO > CMO > LinkedIn Growth Director > LinkedIn Content Specialist is 4 delegation hops. The original brief passthrough rule (Phase 13) caps at 3 hops. This means LinkedIn Growth Director should do the work itself rather than delegating further.
**Why it happens:** The architecture has CEO routing to CMO (hop 1), CMO routing to LinkedIn Director (hop 2), LinkedIn Director routing to specialist (hop 3). That is 3 hops from CEO. But if the CEO is not the originator (board creates the issue), it is board > CEO (hop 0?) > CMO > Director > Specialist.
**How to avoid:** Clarify hop counting: hop 1 = first agent assignment. Board > CEO is hop 0. CEO > CMO = hop 1. CMO > Director = hop 2. Director > Specialist = hop 3. This fits within the 3-hop cap. Document this counting rule.

### Pitfall 4: Content Producer Identity Overlap with Technical Writer
**What goes wrong:** Content Producer and Technical Writer both produce content. Their outputs become interchangeable. SOUL.md files are too similar.
**How to avoid:** Clear division: Technical Writer owns blog production (blog-engine), newsletters (newsletter-suite), and has oversight authority. Content Producer handles ad copy, email sequences, social media, and marketing copy. Technical Writer does NOT do ad-creative or social-content anymore. Content Producer does NOT write blog posts or newsletters.

### Pitfall 5: Agent Count Pushes Machine Resource Limits
**What goes wrong:** Going from 10 to 14 agents. The STATE.md blocker notes "Machine resource ceiling under 12-13 agents not tested."
**How to avoid:** The 2-3 concurrent agent cap remains. More agents does not mean more concurrent runs -- it means more agents in queue. Stagger slots B6-B9 run after B1-B5 complete. Monitor memory and CPU during first heartbeat cycles with all 14 agents active.

## Code Examples

### New Agent AGENTS.md Template (LinkedIn Content Specialist)
```markdown
# LinkedIn Content Specialist

You are the LinkedIn Content Specialist. You write LinkedIn posts, plan content
calendars, and create carousel scripts and story posts for FourPointZero's
LinkedIn presence. You execute the creative production work that the LinkedIn
Growth Director assigns.

You report to the LinkedIn Growth Director. You operate within the CMO's
business stream.

## Chain of Command

You report to the LinkedIn Growth Director.
Accept work assignments from:
1. LinkedIn Growth Director ({agent-id}) -- primary
2. CMO ({cmo-agent-id}) -- stream head authority
3. CEO ({ceo-agent-id}) -- override authority

Do NOT accept work from peer agents directly. If a peer needs work from you,
they should route through your team lead (LinkedIn Growth Director).

When completing work, @-mention LinkedIn Growth Director for review.

## FourPointZero Context

[Same positioning block as LinkedIn Growth Director -- shared brand context]

## Content Production Rules

- All LinkedIn content must route through Quality Reviewer for humaniser
  quality gate pass before publishing.
- LinkedIn posts should reference the expert analysis data inlined in the
  linkedin-post-writer skill.
- Never produce content that makes unsourced claims about statistics or data.

## Department Brain

Read: `agents/_departments/business/BRAIN.md`

## Data Scope

[Same data scope as LinkedIn Growth Director -- business stream only]

## Skills

Read and follow: `$AGENT_HOME/skills/linkedin-post-writer.md`
Read and follow: `$AGENT_HOME/skills/linkedin-content-strategy.md`

## Shared Documentation

Read: `.agents/product-marketing-context.md`
Read: `docs/backlog-process.md`
```

### Updated LinkedIn Growth Director HEARTBEAT.md (Sub-Team Delegation Section)
```markdown
## 3.5 Sub-Team Delegation

When assigned a LinkedIn content or outreach issue that requires production work:

1. Create sub-issues: `POST /api/companies/{companyId}/issues`
   - Set `parentId` to the current issue ID
   - Set `assigneeAgentId` to the correct specialist:

   | Work Type | Assign To | Agent ID |
   |-----------|-----------|----------|
   | LinkedIn posts, carousel scripts, content calendar | LinkedIn Content Specialist | {content-spec-id} |
   | DM sequences, cold outreach, meeting prep | LinkedIn Outreach Specialist | {outreach-spec-id} |

   - Paste the original brief verbatim. Use the [BRIEF-PASSTHROUGH] format.
2. Monitor sub-issue progress during your heartbeats.
3. When specialist marks done, review output:
   - Authority and voice alignment check
   - Strategic consistency with content calendar
   - If acceptable: route to Quality Reviewer for final quality gate
   - If revision needed: comment [REVISION-NEEDED] and send back
4. When quality gate passes, comment on parent issue with final deliverables.

## 3.6 Specialist Stall Detection

Your specialists: LinkedIn Content Specialist ({id}), LinkedIn Outreach Specialist ({id})

After handling your own assignments, check specialist issues:
1. Query in-progress issues for your specialists
2. If no activity for 2+ heartbeat cycles:
   - @-mention with [STALL] nudge
   - If still stalled after nudge: escalate to CMO
```

### New Agent Registration (BOOTSTRAP.md Append)
```markdown
### LinkedIn Content Specialist

- **role**: linkedin-content-specialist
- **instructionsFilePath**: /Users/martynmakinson/.paperclip/instances/default/companies/FourPointZero/agents/linkedin-content-specialist/AGENTS.md

### LinkedIn Outreach Specialist

- **role**: linkedin-outreach-specialist
- **instructionsFilePath**: /Users/martynmakinson/.paperclip/instances/default/companies/FourPointZero/agents/linkedin-outreach-specialist/AGENTS.md

### Content Producer

- **role**: content-producer
- **instructionsFilePath**: /Users/martynmakinson/.paperclip/instances/default/companies/FourPointZero/agents/content-producer/AGENTS.md

### Quality Reviewer

- **role**: quality-reviewer
- **instructionsFilePath**: /Users/martynmakinson/.paperclip/instances/default/companies/FourPointZero/agents/quality-reviewer/AGENTS.md
```

## Files That Change

### New Files (Create)
| File | Purpose |
|------|---------|
| agents/linkedin-content-specialist/AGENTS.md | Identity, chain of command, skills |
| agents/linkedin-content-specialist/HEARTBEAT.md | Execution checklist |
| agents/linkedin-content-specialist/SOUL.md | Persona differentiation |
| agents/linkedin-content-specialist/TOOLS.md | Tool access |
| agents/linkedin-content-specialist/MEMORY.md | Heartbeat checkpoint |
| agents/linkedin-content-specialist/skills/linkedin-post-writer.md | MOVED from linkedin-growth-director |
| agents/linkedin-content-specialist/skills/linkedin-content-strategy.md | MOVED from linkedin-growth-director |
| agents/linkedin-outreach-specialist/AGENTS.md | Identity, chain of command, skills |
| agents/linkedin-outreach-specialist/HEARTBEAT.md | Execution checklist |
| agents/linkedin-outreach-specialist/SOUL.md | Persona differentiation |
| agents/linkedin-outreach-specialist/TOOLS.md | Tool access |
| agents/linkedin-outreach-specialist/MEMORY.md | Heartbeat checkpoint |
| agents/linkedin-outreach-specialist/skills/cold-outreach-sequence.md | MOVED from linkedin-growth-director |
| agents/linkedin-outreach-specialist/skills/cold-email.md | MOVED from linkedin-growth-director |
| agents/linkedin-outreach-specialist/skills/meeting-prep.md | MOVED from linkedin-growth-director |
| agents/content-producer/AGENTS.md | Identity, chain of command, skills |
| agents/content-producer/HEARTBEAT.md | Execution checklist |
| agents/content-producer/SOUL.md | Persona differentiation |
| agents/content-producer/TOOLS.md | Tool access |
| agents/content-producer/MEMORY.md | Heartbeat checkpoint |
| agents/content-producer/skills/copywriting.md | MOVED from technical-writer |
| agents/content-producer/skills/email-sequence.md | MOVED from technical-writer |
| agents/content-producer/skills/social-content.md | MOVED from technical-writer |
| agents/content-producer/skills/ad-creative.md | MOVED from technical-writer |
| agents/content-producer/skills/content-creator.md | MOVED from technical-writer |
| agents/quality-reviewer/AGENTS.md | Identity, chain of command, skills |
| agents/quality-reviewer/HEARTBEAT.md | Execution checklist with full quality gate pass |
| agents/quality-reviewer/SOUL.md | Persona differentiation |
| agents/quality-reviewer/TOOLS.md | Tool access |
| agents/quality-reviewer/MEMORY.md | Heartbeat checkpoint |
| agents/quality-reviewer/skills/quality-gate.md | MOVED from technical-writer |

### Modified Files (Update)
| File | Change |
|------|--------|
| linkedin-growth-director/AGENTS.md | Remove 5 skill references, add team lead section, add sub-team delegation |
| linkedin-growth-director/HEARTBEAT.md | Add sub-team delegation section (3.5), specialist stall detection, update handover to reference specialists |
| technical-writer/AGENTS.md | Remove 5 skill references (copywriting, email-sequence, social-content, ad-creative, content-creator) and quality-gate, add team lead section |
| technical-writer/HEARTBEAT.md | Remove quality gate pass steps (4, 5), add sub-team delegation section, update routing to point to Quality Reviewer |
| cmo/AGENTS.md | Update direct reports table to include new specialists (or just awareness) |
| cmo/HEARTBEAT.md | Update direct reports stall detection to include new specialists (or delegate to team leads) |
| ceo/AGENTS.md | Update company structure section with new agents |
| .planning/skill-ownership-matrix.md | Full rewrite with 14-agent redistribution |
| BOOTSTRAP.md | Append 4 new agent entries |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual validation via Paperclip API |
| Config file | None (API-based checks) |
| Quick run command | `GET /api/companies/{companyId}/agents` to verify all 14 agents registered |
| Full suite command | Create test issue per specialist, verify heartbeat picks it up |

### Phase Requirements to Test Map
| Req ID | Behaviour | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TEAM-01 | LinkedIn Content Specialist created with correct skills | smoke | `GET /api/companies/{companyId}/agents?role=linkedin-content-specialist` + verify AGENTS.md skill refs | Wave 0 |
| TEAM-02 | LinkedIn Outreach Specialist created with correct skills | smoke | `GET /api/companies/{companyId}/agents?role=linkedin-outreach-specialist` + verify AGENTS.md skill refs | Wave 0 |
| TEAM-03 | Content Producer created with correct skills | smoke | `GET /api/companies/{companyId}/agents?role=content-producer` + verify AGENTS.md skill refs | Wave 0 |
| TEAM-04 | Quality Reviewer created with correct skills | smoke | `GET /api/companies/{companyId}/agents?role=quality-reviewer` + verify AGENTS.md skill refs | Wave 0 |
| TEAM-05 | Skill ownership matrix updated, no duplicates, all under cap | manual | Grep all AGENTS.md files for `Read and follow:` directives, verify no skill appears in 2+ agents | Wave 0 |
| TEAM-06 | Agents registered and heartbeat validated | integration | Create test issue assigned to each specialist, run heartbeat, verify issue moves to in_progress | Wave 0 |

### Sampling Rate
- **Per task commit:** Verify file structure and skill references via grep
- **Per wave merge:** Run all 14 agents through one heartbeat cycle
- **Phase gate:** Full heartbeat cycle with test issues for all 4 specialists

### Wave 0 Gaps
- [ ] Test issue templates for each specialist type
- [ ] Grep script to verify no duplicate skill ownership across all agents
- [ ] Stagger slot collision check across all HEARTBEAT.md files

## Key Decisions for Planner

1. **Quality gate routing:** After this phase, who is the quality gate? The Quality Reviewer agent, not Technical Writer. Every reference to "route through Technical Writer for humaniser pass" across ALL agent files must be updated to "route through Quality Reviewer." This affects: LinkedIn Growth Director HEARTBEAT.md, CMO HEARTBEAT.md, Content Producer instructions, LinkedIn Content Specialist instructions.

2. **CMO stall detection scope:** Does CMO monitor specialists directly, or delegate specialist monitoring to team leads (LinkedIn Growth Director, Technical Writer)? Recommendation: team leads monitor their own specialists. CMO monitors team leads. This avoids CMO's heartbeat growing unbounded.

3. **LinkedIn Growth Director same-stream stagger:** Currently the LinkedIn Growth Director waits for CMO, Technical Writer, Customer Success, UX Researcher. The 4 new specialists are also business stream. Should all business stream agents wait for each other? With 9 business stream agents, the stagger chain would be long. Recommendation: Sub-agents wait for their team lead only, not all business stream agents. This narrows the collision window.

4. **Technical Writer retains blog production:** Technical Writer keeps blog-engine and newsletter-suite. Content Producer gets copywriting, email, social, ad. This creates a clear "Technical Writer = long-form, Content Producer = short-form" split.

## Open Questions

1. **reportsTo API behaviour**
   - What we know: Paperclip supports `reportsTo` but it has historically been flat (all report to CEO). PR #1082 added chain-of-command enforcement.
   - What is unclear: Whether setting `reportsTo` to LinkedIn Growth Director (not CEO) works correctly for issue assignment and checkout. STATE.md blocker says "Chain-of-command enforcement (PR #1082) behaviour unconfirmed for Director-to-Specialist assignments."
   - Recommendation: Test with one agent first. Create LinkedIn Content Specialist with `reportsTo` set to LinkedIn Growth Director. Create a test issue assigned to the specialist. Verify the specialist can check it out and the Director can review it. If it fails, fall back to `reportsTo: CEO` with instruction-only hierarchy.

2. **Machine resource impact of 14 agents**
   - What we know: 2-3 concurrent agent cap enforced via stagger. Current 10 agents work fine.
   - What is unclear: Whether 14 agent heartbeat cycles complete within reasonable time windows. More agents = longer total cycle time even with stagger.
   - Recommendation: Monitor first full cycle after deployment. If total cycle exceeds 2 hours, consider reducing heartbeat frequency for specialists.

3. **Quality Reviewer workload**
   - What we know: Currently Technical Writer handles quality gate alongside content production. Separating them creates a dedicated reviewer.
   - What is unclear: Whether the volume of content justifies a dedicated quality gate agent vs. keeping quality gate as a secondary function of Technical Writer.
   - Recommendation: Proceed with the split. If Quality Reviewer is underutilised, merge back in a future phase.

## Sources

### Primary (HIGH confidence)
- Direct inspection of all 10 existing agent files (AGENTS.md, HEARTBEAT.md, SOUL.md) in `~/.paperclip/instances/default/companies/FourPointZero/agents/`
- `.planning/skill-ownership-matrix.md` -- current 71-skill, 10-agent mapping
- `.planning/research/ARCHITECTURE.md` -- v2.0 architecture patterns, sub-agent team design
- `.planning/research/PITFALLS.md` -- 14 documented pitfalls with mitigations
- `.planning/REQUIREMENTS.md` -- TEAM-01 through TEAM-06 requirement definitions
- `.planning/STATE.md` -- current project state, blockers, decisions

### Secondary (MEDIUM confidence)
- BOOTSTRAP.md agent registration pattern (observed format, not API documentation)
- Chain-of-command enforcement behaviour (PR #1082 -- referenced but not directly verified)

### Tertiary (LOW confidence)
- Machine resource impact of 14 agents (untested, flagged as blocker in STATE.md)

## Metadata

**Confidence breakdown:**
- Skill redistribution plan: HIGH -- based on direct inspection of all agent skill files and the ownership matrix
- Agent file structure: HIGH -- follows exact patterns of existing 10 agents
- Registration process: MEDIUM -- BOOTSTRAP.md format observed but API docs not verified
- reportsTo behaviour: LOW -- flagged as open question, needs testing
- Machine resource impact: LOW -- untested, estimated from current behaviour

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable domain, file-based system)
