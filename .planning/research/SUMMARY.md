# Project Research Summary

**Project:** FourPointZero AI Agent Company v2.0 (Conducting AI Scale)
**Domain:** Multi-agent orchestration — Paperclip platform expansion
**Researched:** 2026-04-03
**Confidence:** HIGH

## Executive Summary

FourPointZero v2.0 scales an existing 10-agent Paperclip company into a structured, department-based organisation. The core finding from all four research streams is identical: every capability in scope — department brains, delegation chains, cross-department event bus, sub-agent teams, and data gating — requires capabilities Paperclip does not natively provide, and all five must be built as file-and-instruction-based workarounds using existing Paperclip primitives. This is a configuration project, not a platform migration. No new technology is needed.

The recommended approach is a strict build sequence driven by hard dependencies. Department brains must come first because every other feature consumes shared knowledge. Delegation chains follow because sub-agents and the event bus both need a working chain of command to route through. The event bus connects streams only after delegation is reliable. Sub-agent teams are last because each new agent multiplies context load, heartbeat deadlock risk, and delegation complexity. Data gating runs in parallel with brain creation but must be accepted from day one as advisory-only: Paperclip has no enforcement mechanism.

The critical risks are infrastructure-level, not feature-level. Three known Paperclip bugs — heartbeat deadlock (Issue #2516), session corruption on interruption (Issue #2358), and dashboard freeze from unpaginated heartbeat runs (Issue #958) — can make the system unmonitorable and unrecoverable at scale. These must be mitigated before adding any new agents. The telephone effect in delegation chains and routing loops in the event bus are the two most likely causes of wasted compute once the architecture is running.

---

## Key Findings

### Recommended Stack

There is no new stack. Paperclip is the entire platform and the constraint is to use only its existing primitives. The "implementation stack" is file directories, AGENTS.md `Read:` directives, issue labels, issue `parentId` hierarchy, structured issue comments, HEARTBEAT.md instruction sections, and `requestDepth` on issues.

**Core primitives and their v2.0 roles:**
- **Filesystem directories** (`agents/_departments/`) — department brain storage, no database required
- **AGENTS.md `Read:` directives** — brain injection per agent on every heartbeat, proven at scale (33 files already reference the shared `product-marketing-context.md`)
- **Issue labels** (`event:`, `x-dept:`, `dept:`) — event bus routing and issue scoping, queryable via Paperclip API
- **`parentId` on issues** — delegation chain tracking: CEO depth 0, CMO depth 1, specialist depth 2 (auto-tracked via `requestDepth`)
- **HEARTBEAT.md instruction sections** — chain of command enforcement, delegation logic, event bus trigger rules
- **Issue comments** — structured cross-department context payloads using markdown templates

**Hard constraints that shape everything:**
- 2-3 concurrent agents max on a single local machine (serial-async execution, not parallel)
- Flat `reportsTo` API field — all agents technically report to CEO; hierarchy via instructions only
- No per-department file permissions — data gating is advisory, not enforced
- No real-time messaging — async issues only, no agent-to-agent direct calls

### Expected Features

**Must have (table stakes):**
- Department brain directories with Write-One-Read-Many discipline (CMO/CTO write; team reads)
- `Read:` directives added to all 10 existing agent AGENTS.md files pointing to their stream brain
- Delegation authority sections in CMO and CTO AGENTS.md (team management)
- Chain of command sections in all downstream agent AGENTS.md
- CEO routing updated to send work through department heads, not directly to leaf agents
- Cross-department handoff issue protocol with `x-dept:` labels and structured comment format
- Data Scope sections in all agent AGENTS.md (what each agent may and may not read)

**Should have (competitive differentiators):**
- Tiered brain injection (always-inject core context vs on-demand detail docs referenced by pointer)
- `last_reviewed` date on brain files with CEO automated freshness check
- Event templates (`docs/event-templates.md`) with predefined cross-department trigger formats
- Sub-team delegation in LinkedIn Growth Director heartbeat (Director becomes team lead)
- Status roll-up checks in CMO and CTO heartbeats (monitor delegated work)
- Original brief passthrough rule enforced at every delegation hop
- Acceptance criteria in original issues so every agent in the chain can self-verify

**Defer to v2.1+:**
- Dynamic specialist spawning for burst campaign work (high complexity, unclear value at current scale)
- Content production sub-team (Technical Writer team) — prove LinkedIn pattern first
- Audit logging of cross-boundary file reads — Paperclip does not support natively
- Sub-teams beyond LinkedIn — machine constraints limit total agent count
- Paperclip company-level wiki (Issue #1858) — not yet shipped, do not build dependency on it

### Architecture Approach

The v2.0 architecture adds five layers on top of the existing flat CEO-routed structure. Layer 1 (Department Brains) creates shared file-based context under `agents/_departments/business/` and `agents/_departments/tech/`. Layer 2 (Sub-Agent Teams) expands the LinkedIn Growth Director into a 3-agent team using instruction-enforced reporting. Layer 3 (Cross-Department Event Bus) uses `x-dept:` labelled issues as the handoff mechanism between streams. Layer 4 (Delegation Chains) shifts routing from CEO-to-leaf to CEO-to-head-to-specialist via HEARTBEAT.md additions. Layer 5 (Data Gating) adds Data Scope sections to all AGENTS.md files. Every layer degrades gracefully to v1.0 behaviour if an agent ignores instructions — this is the architecture's key resilience property.

**Major components:**
1. **Department Brains** (`agents/_departments/`) — shared stream context; CMO/CTO write; all stream agents read; only dept head writes to prevent race conditions
2. **LinkedIn Sub-Team** (2 new agents) — Director becomes team lead; Content Specialist and Outreach Specialist carry redistributed production skills
3. **Cross-Department Event Bus** — `x-dept:business->tech` and `x-dept:tech->business` labelled new issues with structured handoff comments; rate-limited to 2 cross-dept issues per trigger; all created in `draft` status pending board approval
4. **Chain of Command** — instruction sections per agent enforcing who gives and receives work; enforced in AGENTS.md and HEARTBEAT.md for all 10 existing agents plus 2 new ones
5. **Data Scope** — instruction sections per agent defining readable and off-limits directories; advisory-only enforcement
6. **Extended CEO Monitoring** — stall detection extended to sub-issue trees, event bus backlogs, brain file staleness checks

### Critical Pitfalls

1. **Context window explosion from department brains** — Cap all brain files at 200 lines of high-signal reference material. Use pointer-based structure (brain file references detail docs by path, does not embed content). Budget each agent's total loaded context to 60% of window before work starts. Detect by monitoring token usage per heartbeat and watching for generic/vague outputs.

2. **Heartbeat deadlocks at scale (Issue #2516)** — Build stall detection sweep into CEO heartbeat before adding any sub-agents. Any issue with `executionRunId` set but no progress after 2 heartbeat cycles: clear the lock via API and reassign. Stagger all agent heartbeat schedules to prevent simultaneous wakes. Set `maxConcurrentRuns=1` explicitly for all agents.

3. **Delegation chain telephone effect** — Enforce verbatim original brief passthrough at every delegation hop: every sub-issue must include the original issue description unchanged, plus additive context only. Cap delegation depth at 3 hops absolute maximum. Include acceptance criteria in the original issue so every agent can self-check independently of the chain.

4. **Issue routing loops in the event bus** — No-return rule: once an issue has been routed away from an agent, that agent cannot receive it back. Cross-department triggers create NEW issues — never reassign existing ones. Rate-limit to 2 cross-department issues per triggering event. All event-bus-created issues default to `draft` status requiring human approval before agents pick them up.

5. **Infrastructure fragility before scaling (Issues #2358, #958)** — Session corruption on interruption and dashboard freeze from unpaginated runs make the system unmonitorable and unrecoverable at 20+ agents. Build API-based monitoring scripts and a session recovery mechanism before adding any new agents.

---

## Implications for Roadmap

All four research files independently converge on the same phase sequence. The ordering is dictated by hard dependencies (later features consume earlier ones) and risk management (lower-risk foundations before higher-risk expansions).

### Phase 0: Infrastructure Hardening
**Rationale:** Three known Paperclip bugs can silently kill agents at scale. You cannot safely observe or debug anything without monitoring in place first.
**Delivers:** CEO stall detection extended to sub-issue trees; API-based monitoring script (bypasses dashboard freeze); session recovery mechanism; heartbeat schedule staggered across all 10 agents with unique offsets; chain-of-command enforcement behaviour tested (PR #1082 validation before building any hierarchy).
**Addresses:** Pitfalls 2, 6, 8, and 10 (heartbeat deadlock, dashboard freeze, session corruption, flat reportsTo conflict).
**Avoids:** Building a delegation or sub-agent architecture that is silently broken with no way to detect it.

### Phase 1: Department Brains + Data Gating
**Rationale:** Zero dependency on other v2 features. Foundation for everything else. Sub-agents and the event bus both need shared context before they can reference it. Data gating is colocated here because the brain directories define the gating boundaries.
**Delivers:** `agents/_departments/business/BRAIN.md` and `agents/_departments/tech/BRAIN.md` (200-line cap, pointer structure); `decisions.md` templates for each stream; `Read:` directives added to all 10 existing agent AGENTS.md files; `Data Scope` sections added to all 10 agents; CMO and CTO HEARTBEAT.md updated with brain update sections; `last_reviewed` dates baked in.
**Addresses:** Department Brains table stakes; Data Gating table stakes from FEATURES.md.
**Avoids:** Pitfall 1 (200-line cap and pointer structure established from day one), Pitfall 5 (advisory-only expectations set explicitly in the Data Scope sections), Pitfall 13 (freshness check baked in from the start).

### Phase 2: Delegation Chains
**Rationale:** Brain files exist so agents have shared context when they begin managing teams. Delegation chains redirect work flow through department heads before the event bus generates cross-department triggers (which need working routing to land correctly).
**Delivers:** Chain of Command sections in all 8 downstream agent AGENTS.md files; Team Management sections in CMO and CTO AGENTS.md; Team Monitoring steps in CMO and CTO HEARTBEAT.md; CEO AGENTS.md and HEARTBEAT.md delegation logic updated to route through heads, not directly to leaf agents.
**Addresses:** Delegation Chains table stakes and differentiators from FEATURES.md.
**Avoids:** Pitfall 3 (original brief passthrough rule built into delegation instructions from origin), Pitfall 12 (sub-issue tree monitoring already in place from Phase 0).

### Phase 3: Cross-Department Event Bus
**Rationale:** Delegation chains must be in place so event bus issues route to department heads, not CEO. Without working delegation, all cross-department triggers land on CEO and defeat the architecture's purpose.
**Delivers:** `x-dept:` labels created via Paperclip API; `docs/event-templates.md` with 6 predefined handoff templates; Cross-Department Handoff sections added to CMO and CTO HEARTBEAT.md; Event Bus Monitoring added to CEO HEARTBEAT.md; rate-limit logic (2 cross-dept issues per trigger, `draft` status default, queue depth check); Product Owner HEARTBEAT.md updated with x-dept label awareness.
**Addresses:** Cross-Department Event Bus table stakes and differentiators from FEATURES.md.
**Avoids:** Pitfall 4 (no-return rule, new issues only), Pitfall 9 (rate limit and draft status default built into initial design, not retrofitted).

### Phase 4: Sub-Agent Teams (LinkedIn)
**Rationale:** Most complex, most disruptive. All foundations must be working before adding new agents. Prove the pattern with LinkedIn before considering any other department expansion.
**Delivers:** `linkedin-content-specialist` agent directory and registered agent; `linkedin-outreach-specialist` agent directory and registered agent; LinkedIn Growth Director AGENTS.md updated (team lead role, production skills redistributed); LinkedIn Growth Director HEARTBEAT.md updated with sub-team delegation section; CEO agent roster updated; skill ownership matrix updated; integration test (assign a LinkedIn campaign issue, verify full delegation chain end-to-end).
**Addresses:** Sub-Agent Teams table stakes from FEATURES.md.
**Avoids:** Pitfall 7 (anti-fork rule: one canonical skill file per skill, no copies), Pitfall 10 (reportsTo behaviour validated in Phase 0), Pitfall 14 (unique value test before creating each agent — if outputs are interchangeable with the Director, do not create the sub-agent).

### Phase Ordering Rationale

- Phase 0 before everything: monitoring and recovery are prerequisites, not nice-to-haves
- Phase 1 before delegation: agents need shared context before they can intelligently delegate tasks
- Phase 2 before event bus: routing must work through heads before cross-department triggers are added
- Phase 3 before sub-agents: sub-agents inherit the event bus pattern; it must be stable and rate-limited first
- Phase 4 last: new agents multiply all existing failure modes; all foundations must be solid and proven

### Research Flags

Phases needing deeper research during planning:
- **Phase 3 (Event Bus):** Instruction-triggered handoff reliability cannot be validated without a live test. Build one trigger-to-handoff test case during Phase 3 planning before embedding the pattern in all heartbeats.
- **Phase 4 (Sub-Agent Teams):** Full skill ownership matrix (all 71 skills mapped to their v2 owner) must be produced before any skills move. `reportsTo` and chain-of-command enforcement (PR #1082) behaviour needs live validation — confirmed in Phase 0 but the sub-agent-to-Director reporting case is a different scenario.

Phases with standard patterns (skip research-phase):
- **Phase 0 (Infrastructure):** Paperclip GitHub issues are specific and mitigations are documented.
- **Phase 1 (Department Brains + Data Gating):** File creation and instruction updates only. No new Paperclip primitives.
- **Phase 2 (Delegation Chains):** Instruction-only changes with proven graceful degradation to v1 behaviour.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified directly against live company files, Paperclip source code, and API docs. All 10 agent dirs inspected. The `product-marketing-context.md` referenced by 33 files proves the shared-read pattern works at scale. |
| Features | HIGH | Grounded in Paperclip actual primitives with constraints explicitly documented. Conducting AI confirmed as consulting brand, not a technical framework — no phantom specs. |
| Architecture | HIGH | Built from direct inspection of CEO, CMO, CTO, and LinkedIn Growth Director AGENTS.md and HEARTBEAT.md files. Data flow diagrams reflect real issue-comment-heartbeat patterns already running in production. |
| Pitfalls | HIGH | Linked to specific Paperclip GitHub issues with numbers (2516, 2358, 958, 1858, 332). Telephone effect and routing loops corroborated by multi-agent orchestration literature from DeepMind and Deloitte. |

**Overall confidence:** HIGH

### Gaps to Address

- **Chain-of-command enforcement (PR #1082):** Behaviour when a Director-level agent (not in `reportsTo`) tries to assign work to a Specialist is unconfirmed. Test with a sandbox issue in Phase 0 before building delegation. Worst case: set `reportsTo` on sub-agents to their direct manager rather than CEO.
- **Event bus trigger compliance:** Whether agents reliably create x-dept handoff issues from heartbeat instructions cannot be validated without live execution. Build one trigger test case in Phase 3 planning before system-wide deployment.
- **Skill redistribution completeness:** Current total is 71 skills across 10 agents. A full audit mapping every skill to its v2.0 owner is needed before Phase 4 begins — no gaps, no orphaned skills.
- **Machine resource ceiling under load:** 12-13 agents post-Phase 4 vs the 2-3 concurrent cap. Heartbeat staggering from Phase 0 is the primary mitigation, but the practical upper limit under sustained load has not been tested.
- **Token cost modelling:** 12+ agents loading department brains on every heartbeat. No cost projection has been produced. Should model before full deployment to avoid budget surprise.

---

## Sources

### Primary (HIGH confidence)
- Paperclip official docs — https://paperclipai-paperclip.mintlify.app/ — platform capabilities and constraints
- Paperclip GitHub — https://github.com/paperclipai/paperclip — Issues #2516, #2358, #958, #1858, #332 and PR #1082
- Live FPZ company files — `~/.paperclip/instances/default/companies/FourPointZero/agents/` — all 10 agent dirs inspected
- Microsoft Azure AI Agent Design Patterns — https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns
- Microsoft Cloud Adoption Framework: Agent Governance — https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai-agents/governance-security-across-organization

### Secondary (MEDIUM confidence)
- CrewAI hierarchical delegation docs — https://docs.crewai.com/en/concepts/collaboration
- Anton Antich: Knowledge, Brain, Skills framework — https://medium.com/superstringtheory/knowledge-brain-skills-how-to-make-useful-ai-agents-fast-24e570e0d560
- Anthony David Adams / Headcount Zero book — https://github.com/AnthonyDavidAdams/zero-employee-company-book
- Flowtivity: Zero-Human Companies — https://flowtivity.ai/blog/zero-human-company-paperclip-ai-agent-orchestration/
- Skill best practices (just-in-time loading) — https://www.vibesparking.com/en/blog/ai/claude-code/2026-03-05-skills-best-practices-for-ai-coding-agents/
- Multi-agent delegation telephone effect — https://brainroad.com/from-solo-to-delegation-how-paperclip-agents-handle-approvals-and-escalations/
- DeepMind delegation rules — https://theaiinsider.tech/2026/02/17/deepmind-study-proposes-rules-for-how-ai-agents-should-delegate/
- Deloitte: AI agent orchestration scaling challenges — https://www.deloitte.com/us/en/insights/industry/technology/technology-media-and-telecom-predictions/2026/ai-agent-orchestration.html

### Tertiary (LOW confidence)
- StackAI: Sub-Agent Teams — https://www.stackai.com/blog/the-era-of-ai-employees-how-ai-employees-coordinate-at-scale-with-sub-agent-teams — single source, sub-agent coordination patterns
- Conducting AI — https://www.conducting.ai/ — confirmed as consulting/design brand, not a technical framework

---

*Research completed: 2026-04-03*
*Ready for roadmap: yes*
