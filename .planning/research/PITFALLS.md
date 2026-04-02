# Domain Pitfalls

**Domain:** Paperclip AI Agent Skill Mapping
**Researched:** 2026-04-02

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Context Window Overload
**What goes wrong:** Agent AGENTS.md references 15+ skill files via `Read and follow:`. Agent loads all of them on every heartbeat. Context window fills with skill instructions, leaving insufficient room for actual work.
**Why it happens:** Natural instinct to give an agent "all its tools." But each `Read and follow:` is a full file load.
**Consequences:** Degraded output quality, truncated reasoning, increased API costs.
**Prevention:** Cap at ~10 skill files per agent. Split large skill domains across agents. Use issue labels to tell the agent which 1-2 skills are relevant per task rather than loading all.
**Detection:** Agent outputs become generic or miss skill-specific instructions.

### Pitfall 2: Interactive Prompts in Headless Skills
**What goes wrong:** Claude Code skills contain lines like "Ask: What are you working on?" or "If unsure, ask one short question." Paperclip agents run headlessly. Nobody answers.
**Why it happens:** Direct copy-paste from Claude Code skill files without adaptation.
**Consequences:** Agent stalls, produces nothing, or hallucinates a user response.
**Prevention:** Every skill file must be audited for interactive patterns. Replace with "Read from issue description" or "Infer from issue labels."
**Detection:** Agent comments on issues asking questions instead of producing deliverables.

### Pitfall 3: Skill Overlap Between Agents
**What goes wrong:** Two agents both have `copywriting` skill. Board assigns a copywriting issue. Both agents pick it up or produce conflicting deliverables.
**Why it happens:** Fuzzy skill boundaries. "Does copywriting belong to CMO or the content execution agent?"
**Consequences:** Wasted compute, conflicting outputs, confusion about which deliverable is authoritative.
**Prevention:** Maintain a single skill ownership matrix. Rule: if you cannot articulate WHY this agent owns this skill (tied to their SOUL.md persona), it belongs elsewhere.
**Detection:** Two agents commenting on the same issue type.

### Pitfall 4: Forgetting the humanizer Pass
**What goes wrong:** Content-producing agents ship output without running the humanizer skill as a final pass. Output reads as obviously AI-generated.
**Why it happens:** humanizer is a post-processing step. Easy to miss when adapting skills.
**Consequences:** All FPZ content violates the brand requirement of human-sounding output.
**Prevention:** Add humanizer as a mandatory step in every content-producing agent's heartbeat (not just in individual skill files). Make it a heartbeat rule: "Before marking a content deliverable as done, run humanizer."
**Detection:** Review agent output for AI patterns.

## Moderate Pitfalls

### Pitfall 5: SOUL.md Mismatch with Assigned Skills
**What goes wrong:** An agent's persona (SOUL.md) doesn't match its skill set. Example: Customer Success agent with a "metrics-focused, analytical" soul gets creative writing skills.
**Prevention:** Review each agent's SOUL.md against its assigned skills. If the persona doesn't naturally produce the skill's output, either move the skill or update the soul.

### Pitfall 6: Missing Handover Instructions
**What goes wrong:** Agent produces a deliverable but doesn't @-mention the next agent. Work sits in limbo.
**Prevention:** Every skill file should end with a "Handover" section specifying who to notify. Heartbeat section 4 (Handover) must be concrete, not generic.

### Pitfall 7: Fallback Skills Triggering When Primary is Active
**What goes wrong:** CEO's fallback brand-identity skill fires while CMO is actively working on brand. Duplicate/conflicting output.
**Prevention:** Fallback skills already have "only if primary owner hasn't acted" guards. Verify these guards reference specific API checks (agent status, recent activity timestamp), not vague conditions.

### Pitfall 8: Over-Adapting Skills
**What goes wrong:** Rewriting Claude Code skills so extensively that the original value is lost. The adapted skill becomes a pale summary.
**Prevention:** The adaptation should change INPUT (issue description instead of user prompt), OUTPUT (workspace file instead of chat response), and COORDINATION (handover instructions). The core skill logic should transfer verbatim.

## Minor Pitfalls

### Pitfall 9: Inconsistent File Naming
**What goes wrong:** Some skills use hyphens (`linkedin-post-writer.md`), some use dots (`market-analysis.fallback.md`), some use colons in their Claude Code name (`claude-blog:blog-write`). Colon is not valid in filenames.
**Prevention:** Standardise naming: all lowercase, hyphens only. Convert `claude-blog:blog-write` to `blog-write.md`. Document the mapping.

### Pitfall 10: Shared Documentation Bloat
**What goes wrong:** Every agent references the same 7 shared docs (backlog-process, brand-identity-template, etc.) even when irrelevant. Engineer doesn't need brand-identity-template.
**Prevention:** Trim shared doc references to what each agent actually uses. Only keep docs relevant to the agent's skill domain.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Skill ownership matrix | Agonising over edge cases | Use the 80/20 rule. Assign obviously, flag 5-6 ambiguous ones for discussion |
| Skill adaptation | Copy-paste without removing interactive patterns | Create a checklist: remove "ask user", add "read issue", add "write to workspace", add "handover" |
| AGENTS.md updates | Loading too many skills per agent | Set a hard cap of 10 per agent. Split if needed |
| Heartbeat updates | Making heartbeats too complex | Keep heartbeat additions to 1-2 new sections max. Skill selection and humanizer pass |
| Testing/validation | No way to test without running real heartbeats | Create test issues, run one agent at a time, verify output before scaling |

## Sources

- Direct inspection of existing Paperclip agent configurations
- contentfpz SKILL.md interactive patterns ("Ask: What are you working on?")
- CLAUDE.md humanizer requirement ("Always run humanizer as a final pass on ALL content output")
- Observed pattern: CTO has 0 skills, CEO has 7 (mostly fallbacks), CMO has 3
