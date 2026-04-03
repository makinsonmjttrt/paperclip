# Domain Pitfalls

**Domain:** Scaling Paperclip Multi-Agent System (10 to 20+ agents)
**Researched:** 2026-04-03
**Focus:** Adding department brains, sub-agent teams, cross-department event bus, delegation chains, and data gating to an existing 10-agent Paperclip company

## Critical Pitfalls

Mistakes that cause rewrites, runaway costs, or system-level failures.

### Pitfall 1: Context Window Explosion from Department Brains

**What goes wrong:** You create shared department knowledge files (e.g., `business-stream-brain.md`, `tech-stream-brain.md`) and have every agent in the department load them via `Read and follow:` in their AGENTS.md. Combined with existing skill files, agent identity files, and heartbeat instructions, the context window fills before the agent starts actual work.

**Why it happens:** The instinct is to give every business-stream agent full access to marketing strategy, brand positioning, competitive intel, and campaign history. Each file is 200-500 lines. Five shared docs plus ten skills plus identity files hits the context ceiling fast.

**Consequences:** Degraded output quality. Agents produce generic responses because they ran out of reasoning room. API costs spike because every heartbeat loads the full department brain even when the task only needs one slice. With 20+ agents each loading department brains, token costs double or triple overnight.

**Prevention:**
- Cap department brain files at 200 lines of high-signal reference material (mission, current priorities, key decisions)
- Use just-in-time loading: the brain file tells agents WHERE to find detail ("See `strategy/q2-positioning.md` for current positioning"), not embeds the detail itself
- Add issue labels that tell agents which brain slice is relevant. Agent loads only the slice, not the whole brain
- Budget each agent's total loaded context: identity (AGENTS.md, SOUL.md, HEARTBEAT.md) + brain slice + 1-2 relevant skills = must fit comfortably within 60% of context window, leaving 40% for actual work

**Detection:** Agent outputs become vague or ignore task-specific instructions. Token usage per heartbeat climbs above baseline without corresponding work quality increase.

**Phase to address:** Department brains phase. Solve this before adding sub-agents (which multiply the problem).

### Pitfall 2: Heartbeat Deadlocks When Scaling Concurrent Agents

**What goes wrong:** Paperclip's heartbeat system has a known bug (GitHub Issue #2516): queued runs acquire `executionRunId` at creation time, not at start time. When an agent has `maxConcurrentRuns=1` (the default), a queued run holds the execution lock on an issue but cannot start because the agent is busy. Subsequent heartbeats cannot check out the issue either. The task is permanently locked.

**Why it happens:** At 10 agents with 2-3 concurrent, you rarely trigger this. At 20+ agents with cross-department handoffs generating cascading task assignments, multiple agents receive new assignments while mid-work. The deadlock probability increases roughly with the square of concurrent agent count.

**Consequences:** Tasks silently stall. No error is thrown. The agent just never picks up the work. In a delegation chain (CMO assigns to Director, Director assigns to Specialist), one deadlocked link freezes the entire chain.

**Prevention:**
- Track Paperclip Issue #2516 for a fix. If not yet merged, implement a heartbeat pre-check: before creating subtasks, verify the target agent has no queued runs
- Build a stall detection sweep into the CEO heartbeat: any issue with `executionRunId` set but no progress for 2+ heartbeat cycles = likely deadlocked. Clear the lock via API and reassign
- Stagger heartbeat schedules across agents so they do not all wake simultaneously and trigger cascading assignments
- Set `maxConcurrentRuns=1` explicitly for all agents and never increase it (the deadlock is worse with higher values)

**Detection:** Issues stuck in `in_progress` with no comments. Agent shows as `idle` but the issue still has an `executionRunId`. Dashboard becomes unresponsive (related: Issue #958, UI freezes from unpaginated heartbeat history).

**Phase to address:** Must be addressed before any sub-agent expansion. This is infrastructure-level.

### Pitfall 3: Delegation Chain Telephone Effect

**What goes wrong:** In a 3-4 hop delegation chain (CEO > CMO > LinkedIn Director > LinkedIn Specialist), each agent interprets the task through its own SOUL.md persona and skill instructions. By the third hop, the original intent is diluted or distorted. The output regresses toward generic, safe content that satisfies all the intermediate interpretations but misses the original brief.

**Why it happens:** Each agent rewrites the task in its own comment when delegating. "Write a LinkedIn post about our AI hiring methodology" becomes "Create content for LinkedIn channel" becomes "Produce a social media deliverable." The specificity bleeds out at each hop.

**Consequences:** Output does not match the original request. The board has to reject and rebrief, wasting all the compute from the chain. With 20+ agents and longer chains, this becomes the default failure mode, not the exception.

**Prevention:**
- Enforce an "original brief passthrough" rule: every delegation must include the original issue description verbatim in the subtask, plus any additional context. Never paraphrase the original brief
- Cap delegation depth at 3 hops maximum. If a task needs more routing, the architecture is wrong: split it into independent subtasks at the CEO level
- Add a "brief fidelity check" to each agent's heartbeat: before starting work, compare your understanding of the task against the original issue description. If they diverge, comment asking for clarification rather than proceeding
- Include acceptance criteria in the original issue. Every agent in the chain can check their output against the same criteria

**Detection:** Final deliverable does not match the original issue description. Intermediate agents added scope or changed direction without board approval.

**Phase to address:** Delegation chains phase. Build the passthrough rule into the delegation pattern before expanding sub-agent teams.

### Pitfall 4: Issue Routing Loops

**What goes wrong:** CMO receives a task, decides it belongs to CTO stream, reassigns. CTO's heartbeat reads it, decides the marketing component needs CMO input, reassigns back. The issue bounces indefinitely, burning tokens on every heartbeat without producing work.

**Why it happens:** Cross-department handoffs create ambiguous ownership. "Build a landing page" has both copy (CMO stream) and code (CTO stream) components. Without clear rules, each stream head routes it to the other.

**Consequences:** Token burn with zero output. At scale, a single routing loop can consume an entire agent's daily budget. With an event bus triggering cross-department work, loops multiply.

**Prevention:**
- Enforce a "no-return" rule: once an issue has been routed away from an agent, that agent cannot receive it back. If it needs both streams, it must be split into sub-issues at the point of first routing
- Add a `routingHistory` field to issues (via labels or comments) tracking which agents have touched it. If an agent sees itself in the routing history, it must split or escalate, never reroute
- Cross-department issues must always be split at the CEO level. No peer-to-peer routing between CMO and CTO on the same issue
- The event bus pattern (CMO triggers CTO work) should create NEW issues, never reassign existing ones

**Detection:** Issue has 4+ reassignment comments. Same issue appears in multiple agents' assignment queues within one day.

**Phase to address:** Cross-department event bus phase. This is the phase where routing loops become likely.

### Pitfall 5: No Native Data Gating Creates Security Theatre

**What goes wrong:** You implement "data gating" via agent instructions ("Only read files in your department directory"). An agent's HEARTBEAT.md says "Do not access tech-stream files." But Paperclip has no system-level access control. Any agent can read any file, access any issue, and query any API endpoint. The gating is purely prompt-based and bypassable.

**Why it happens:** Paperclip's architecture has no per-agent file permissions, no issue visibility scoping, and no API endpoint restrictions. GitHub Issue #1858 acknowledges the gap. Instruction-based security puts security logic in a layer never designed for it.

**Consequences:** An agent given a cleverly worded task could access data it should not see. More practically, agents routinely read files outside their department when skill files reference shared resources, and the "gating" silently fails. You believe data is isolated when it is not.

**Prevention:**
- Accept that data gating in Paperclip is advisory, not enforced. Do not store genuinely sensitive data (client financials, passwords, API keys) in agent-accessible file trees
- Use file system structure to make gating obvious: `workspace/business-stream/` and `workspace/tech-stream/` with clear naming. Agents are more likely to respect boundaries when the structure is unambiguous
- Audit agent activity logs for cross-department file access. Build this check into the CEO's stall detection sweep
- For genuinely sensitive operations, require board approval (Paperclip's approval mechanism) before the agent can proceed. This is the only enforced gate Paperclip provides
- Do not overinvest in data gating architecture. The ROI is low given the platform constraint. Spend that effort on output quality instead

**Detection:** Agent comments reference files or data from another department's workspace. Audit logs show cross-boundary reads.

**Phase to address:** Data gating phase. Set expectations early that this is advisory-only.

## Moderate Pitfalls

### Pitfall 6: UI Dashboard Freeze at Scale

**What goes wrong:** Paperclip's dashboard loads all heartbeat run history without pagination (GitHub Issue #958). At 10 agents with moderate activity, performance is acceptable. At 20+ agents with active heartbeats, the UI becomes unusable. You cannot monitor agents, review issues, or intervene when something goes wrong.

**Prevention:**
- Track Issue #958 for a fix
- Until fixed, use the Paperclip API directly (`curl` or scripts) for monitoring rather than the dashboard
- Build a lightweight monitoring script that polls agent status and issue progress via API. Run it on a schedule
- Prune old heartbeat run records periodically if the platform supports it

**Phase to address:** Before sub-agent expansion. You need monitoring before you need more agents.

### Pitfall 7: Skill File Bloat Across 20+ Agents

**What goes wrong:** At 10 agents with ~71 skills, each agent has 4-12 skill files averaging 200-400 lines. At 20+ agents, the total skill file count doubles but many skills are slight variants of existing ones (e.g., "LinkedIn post writer" vs "LinkedIn specialist post writer" vs "LinkedIn team lead post reviewer"). Maintenance becomes impossible. Updates to a pattern (like the humanizer requirement) must be propagated across 15+ files.

**Why it happens:** Each new sub-agent gets its own narrower skill files. The LinkedIn Growth Director's `linkedin-post-writer.md` gets forked into a specialist version with minor tweaks. Nobody deletes the original. Both drift.

**Prevention:**
- Use a single canonical skill file with role-specific sections rather than forking. The skill file says "If you are a Specialist, focus on X. If you are a Director, focus on Y"
- Keep the skill file count per agent to 5-7 maximum (down from the current 10 cap). Sub-agents are specialists and should need fewer skills, not more
- Maintain a skill registry (a single markdown file listing every skill, its owner, and its canonical location). Review monthly
- Never fork a skill file. If a sub-agent needs a variant, add a section to the canonical file

**Phase to address:** Sub-agent teams phase. Establish the anti-fork rule before creating the first sub-agent.

### Pitfall 8: Session Corruption from Interrupted Heartbeats

**What goes wrong:** When a `claude_local` agent heartbeat is interrupted mid-stream (machine sleep, process kill, OOM), the session JSONL ends in a corrupted state (GitHub Issue #2358). Every subsequent heartbeat for that agent fails immediately. The agent is effectively dead until manually recovered.

**Why it happens:** More agents = more concurrent heartbeats = higher probability of interruption. Machine resource pressure (RAM, CPU) from 20+ agents makes OOM kills more likely. macOS aggressive sleep behaviour interrupts running processes.

**Prevention:**
- Keep concurrent agent runs to 2-3 maximum (enforced via per-adapter global limit, Issue #332)
- Set up Energy Saver / prevent sleep settings when agents are running
- Build a recovery script that detects corrupted session files and resets them
- Monitor for agents stuck in `error` state. Add this to CEO stall detection

**Phase to address:** Infrastructure concern. Address before scaling past 10 agents.

### Pitfall 9: Event Bus Creates Uncontrolled Work Cascades

**What goes wrong:** You build a cross-department event bus where CMO completing a campaign brief automatically creates implementation issues for CTO stream. But one CMO deliverable spawns 5 CTO issues, each of which spawns 2 engineer subtasks. A single brief creates 15+ issues in one heartbeat cycle. Agent budgets are blown. Work queue overwhelms the 2-3 concurrent agent limit.

**Prevention:**
- Rate-limit the event bus: maximum 2 cross-department issues per triggering event
- All event-bus-created issues start in `draft` status, requiring human approval before agents pick them up
- Include budget estimation in the event bus logic: if projected token cost exceeds threshold, require board approval
- Implement a queue depth check: if the target department already has 5+ open issues, the event bus pauses and notifies the board

**Phase to address:** Cross-department event bus phase. Build rate limiting into the initial design, not as a retrofit.

### Pitfall 10: Flat reportsTo Undermines Hierarchical Delegation

**What goes wrong:** You build a logical hierarchy (CEO > CMO > LinkedIn Director > LinkedIn Specialist) in heartbeat instructions, but Paperclip's `reportsTo` field only supports a flat structure. All agents technically report to CEO. When LinkedIn Director tries to assign work to LinkedIn Specialist, there is no system-level authority. The assignment works (any agent can assign to any other), but the chain-of-command enforcement (PR #1082) may block the Director from managing the Specialist's tasks because the Director is not in the Specialist's management chain according to the flat `reportsTo`.

**Prevention:**
- Test the chain-of-command enforcement behaviour with your specific hierarchy before building delegation chains. If PR #1082 blocks legitimate delegation, you will need to set `reportsTo` for sub-agents to their stream manager (e.g., LinkedIn Specialist reports to LinkedIn Director, not CEO)
- If Paperclip only supports single `reportsTo`, build the chain by having each sub-agent report to its direct manager, not the CEO. Accept that the CEO cannot directly manage sub-agents without going through the chain
- Document the intended hierarchy in a shared reference file. Include it in each agent's identity context so they know who manages whom, even if the system structure is flat

**Phase to address:** Sub-agent teams phase. Validate `reportsTo` behaviour before creating the first sub-agent.

## Minor Pitfalls

### Pitfall 11: Heartbeat Schedule Collision

**What goes wrong:** Multiple agents share the same heartbeat schedule (e.g., every 30 minutes). At 20+ agents, all 20 wake simultaneously, each making API calls, loading context, and checking issues. Local machine CPU/RAM spikes. API rate limits hit. Some heartbeats fail silently.

**Prevention:** Stagger heartbeat schedules. Give each agent a unique offset (Agent 1 at :00, Agent 2 at :03, Agent 3 at :06). Group by priority: critical agents (CEO, stream heads) get prime slots; specialists get off-peak slots.

### Pitfall 12: Orphaned Sub-Issues from Failed Chains

**What goes wrong:** A delegation chain creates sub-issues at each level. If a mid-chain agent fails (corrupted session, budget exceeded), its sub-issues remain open but unworked. Parent issues show `in_progress` but downstream work never completes.

**Prevention:** CEO stall detection must check sub-issue trees, not just top-level issues. Any parent issue with all sub-issues stalled for 2+ cycles should be escalated to the board.

### Pitfall 13: Department Brain Staleness

**What goes wrong:** Department brain files contain strategy decisions and context that change over time. Nobody updates them. Agents continue executing against outdated strategy. A pricing decision from three months ago still drives agent behaviour because the brain file was never refreshed.

**Prevention:** Add a `last_reviewed` date to each brain file header. CEO heartbeat checks brain file dates monthly. Stale brains (30+ days) trigger a review issue assigned to the stream head.

### Pitfall 14: Sub-Agent Identity Crisis

**What goes wrong:** New sub-agents (LinkedIn Specialist, Content Production Specialist) get SOUL.md files that are too similar to their parent agent. The Specialist produces the same output as the Director. You have paid for two agents doing one agent's job.

**Prevention:** Each sub-agent's SOUL.md must define what it does that its parent agent does NOT do. If you cannot articulate the unique value, you do not need the sub-agent. Test by giving the same task to both: if outputs are interchangeable, merge them.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Department brains | Context window explosion (Pitfall 1) | Cap at 200 lines, just-in-time loading, label-based slicing |
| Department brains | Brain staleness (Pitfall 13) | Automated freshness check in CEO heartbeat |
| Sub-agent teams | Skill file bloat (Pitfall 7) | Anti-fork rule, 5-7 skill cap per sub-agent |
| Sub-agent teams | Identity crisis (Pitfall 14) | Unique value test before creating agent |
| Sub-agent teams | Flat reportsTo conflict (Pitfall 10) | Test chain-of-command enforcement before building |
| Cross-department event bus | Routing loops (Pitfall 4) | No-return rule, split at CEO level, new issues only |
| Cross-department event bus | Work cascades (Pitfall 9) | Rate limit to 2 cross-dept issues per trigger, draft status default |
| Delegation chains | Telephone effect (Pitfall 3) | Original brief passthrough, 3-hop max, acceptance criteria |
| Delegation chains | Orphaned sub-issues (Pitfall 12) | Sub-issue tree monitoring in CEO stall detection |
| Data gating | Security theatre (Pitfall 5) | Accept advisory-only, directory structure, approval gates |
| Infrastructure (all phases) | Heartbeat deadlocks (Pitfall 2) | Track Issue #2516, stall detection, stagger schedules |
| Infrastructure (all phases) | Session corruption (Pitfall 8) | Max 2-3 concurrent, recovery script, prevent sleep |
| Infrastructure (all phases) | Dashboard freeze (Pitfall 6) | API-based monitoring script before scaling |

## Recommended Phase Ordering Based on Pitfalls

1. **Infrastructure hardening** first: monitoring script, stall detection improvements, heartbeat staggering, session recovery. Without this, you cannot safely observe or debug anything that follows.
2. **Department brains** second: lowest risk if done with context budget discipline. Validates the shared-knowledge pattern before adding more agents that consume it.
3. **Delegation chains** third: establish the passthrough rule and chain-of-command validation with existing agents before creating new ones.
4. **Sub-agent teams** fourth: only after delegation chains work. Each new agent multiplies every existing pitfall.
5. **Cross-department event bus** fifth: highest risk of cascading failures. Only build after all other patterns are validated.
6. **Data gating** last: advisory-only by nature. Low value relative to other features. Do the minimum.

## Sources

- [Paperclip GitHub: Heartbeat deadlock issue #2516](https://github.com/paperclipai/paperclip/issues/2516)
- [Paperclip GitHub: Per-adapter global concurrent agent limit #332](https://github.com/paperclipai/paperclip/issues/332)
- [Paperclip GitHub: UI freeze from unpaginated heartbeat runs #958](https://github.com/paperclipai/paperclip/issues/958)
- [Paperclip GitHub: Corrupted session JSONL recovery #2358](https://github.com/paperclipai/paperclip/issues/2358)
- [Paperclip GitHub: Company-level knowledge layer #1858](https://github.com/paperclipai/paperclip/issues/1858)
- [Paperclip GitHub: Chain-of-command enforcement PR #1082](https://github.com/paperclipai/paperclip)
- [Paperclip Official Docs: How Agents Work](https://docs.paperclip.ing/guides/agent-developer/how-agents-work)
- [Skill best practices: just-in-time loading](https://www.vibesparking.com/en/blog/ai/claude-code/2026-03-05-skills-best-practices-for-ai-coding-agents/)
- [Multi-agent delegation telephone effect](https://brainroad.com/from-solo-to-delegation-how-paperclip-agents-handle-approvals-and-escalations/)
- [Deloitte: AI agent orchestration scaling challenges](https://www.deloitte.com/us/en/insights/industry/technology/technology-media-and-telecom-predictions/2026/ai-agent-orchestration.html)
- [Multi-agent enterprise guide: memory as bottleneck](https://neomanex.com/posts/multi-agent-ai-systems-orchestration)
- Direct inspection of existing FPZ Paperclip agent configurations (CEO, CMO, LinkedIn Growth Director HEARTBEAT.md and AGENTS.md files)
