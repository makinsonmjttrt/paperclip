# Skill Adaptation Template

**Purpose:** Convert any Claude Code skill into Paperclip agent format.
**Used by:** Phases 5 and 9 executors adapting 71 skills across 10 agents.
**Target location:** `~/.paperclip/instances/default/companies/FourPointZero/agents/{agent-slug}/skills/{skill-name}.md`

---

## 1. Template Structure

Every converted skill file follows this exact skeleton. Replace placeholders in `{curly braces}` with the actual content from the source skill.

```markdown
# Skill: {Skill Display Name}

{One-line identity statement: "You [verb] [what] for [whom/purpose]."}

## Input

Read the issue description for:
- {Primary input the skill needs -- e.g., "topic or content brief"}
- {Secondary input -- e.g., "target audience or channel"}
- {Any constraints -- e.g., "word count, tone, format requirements"}

If the issue description is missing required input, comment on the issue asking for it. Do not guess.

## Process

1. {First step -- always starts with reading/understanding the input}
2. {Core skill steps -- transferred verbatim from the Claude Code source}
3. {Output step -- write deliverable to workspace}
4. {Quality step -- if content-producing, hand off to Technical Writer for humanizer pass}

## Output

Save deliverable to: `workspace/{descriptive-filename}.md`
Comment on the issue with a summary of what was produced.

## Handover

When complete, @-mention {next-agent-or-reviewer} for review.
If the deliverable is content, @-mention Technical Writer for humanizer quality gate pass.

## Rules

- {Guardrails transferred from source skill}
- Never ask interactive questions in comments. If input is ambiguous, state your interpretation and proceed.
- All output in UK English.
```

---

## 2. Bundle Template

Use this skeleton when multiple related skills share a single file (see skill-ownership-matrix.md for bundle assignments).

```markdown
# Skill Bundle: {Bundle Display Name}

This bundle contains {N} related skills. Use the one matching the issue label or description.

## Skills

### {Skill 1 Name}
{Condensed version of the skill -- process, key rules, output format}

### {Skill 2 Name}
{Condensed version}

## Shared Rules
- {Rules that apply to all skills in the bundle}
- Never ask interactive questions in comments. State your interpretation and proceed.
- All output in UK English.

## Input
Read the issue description and issue labels to determine which skill to apply.

## Output
Save deliverable to: `workspace/{skill-name}-{descriptive-filename}.md`

## Handover
@-mention {reviewer} when complete.
If any deliverable is content, @-mention Technical Writer for humanizer quality gate pass.
```

---

## 3. Naming Conventions

| Scenario | Source Name | Target Filename |
|----------|-----------|-----------------|
| Simple name | `linkedin-post-writer` | `linkedin-post-writer.md` |
| Colon-prefixed skill | `claude-blog:blog-write` | `blog-write.md` |
| Namespace-prefixed skill | `anthropic-skills:content-creator` | `content-creator.md` |
| Bundle file | `cro-suite` (from matrix) | `cro-suite.md` |
| Fallback skill | `brand-identity` on CEO | `brand-identity.fallback.md` |

Rules:
- All filenames: lowercase, hyphens only, `.md` extension
- Colon conversion: strip everything before and including the colon. `claude-blog:blog-write` becomes `blog-write.md`
- Namespace stripping: strip everything before and including the colon. `anthropic-skills:content-creator` becomes `content-creator.md`
- Bundle naming: use the bundle name from skill-ownership-matrix.md (e.g., `cro-suite.md`, `blog-engine.md`, `strategy-core.md`)
- Fallback naming: `{skill-name}.fallback.md`
- No spaces, underscores, or uppercase letters

---

## 4. Interactive Pattern Replacements

Scan every source skill file for these patterns and replace them. This is the single most common adaptation mistake (see PITFALLS.md, Pitfall 2).

| Claude Code Pattern | Paperclip Replacement |
|---|---|
| `Ask: What are you working on?` | `Read the issue description for the task brief.` |
| `If unsure, ask one short question` | `If input is ambiguous, state your interpretation in an issue comment and proceed.` |
| `ask one clarifying question` | `Comment on the issue requesting the missing detail. Do not block on a response -- proceed with reasonable defaults if possible.` |
| `Ask at most ONE clarifying question` | `Comment on the issue requesting the missing detail. Do not block on a response -- proceed with reasonable defaults if possible.` |
| `When the user gives you a topic` | `When the issue description contains a topic` |
| `When given text to humanize:` | `When the issue description or referenced deliverable contains text to process:` |
| `Present the draft` / `present to the user` | `Save the draft to workspace/ and comment on the issue with a summary.` |
| `offer: "Want me to try a different hook?"` | Remove entirely. Produce the best version. If multiple options are warranted, include them all in the deliverable. |
| `allowed-tools: AskUserQuestion` | Remove from any frontmatter. Not available in headless mode. |
| `Save finished work to the-vault/` | `Save finished work to workspace/` |
| `confirm the filename with the user first` | Remove. Use the naming convention: `{skill-name}-{descriptive-slug}.md` |
| `Run humanizer on any finished content before saving` | `After completing the deliverable, hand off to Technical Writer for humanizer quality gate pass.` |
| `read it out loud` / `read back to the user` | Remove. Quality verification is handled by the humanizer quality gate, not self-review. |

---

## 5. AGENTS.md Integration

After creating or updating a skill file, add a reference line to the owning agent's AGENTS.md.

**Location:** Find the comment `<!-- Skills are appended here by modules during company assembly -->` in the agent's AGENTS.md file.

**Add this line below the comment:**
```
Read and follow: $AGENT_HOME/skills/{skill-name}.md
```

**Example for linkedin-post-writer on the LinkedIn Growth Director agent:**
```
Read and follow: $AGENT_HOME/skills/linkedin-post-writer.md
```

**For bundles, reference the bundle file (not individual skills):**
```
Read and follow: $AGENT_HOME/skills/blog-engine.md
```

One line per skill file. Bundles get one line regardless of how many skills they contain.

---

## 6. What NOT to Change

When adapting a Claude Code skill, preserve these elements verbatim:

- **Core skill logic, frameworks, and domain knowledge.** The writing process, analysis steps, evaluation criteria, and expert knowledge are the skill's value. Transfer them intact.
- **Specific examples and templates.** Hook libraries, structure templates, scoring rubrics, and reference data stay exactly as they are.
- **Quality checklists.** Keep all quality criteria. Only remove interactive verification steps like "read it out loud" or "present to the user for feedback."
- **Voice and tone guidelines.** If the skill defines a writing voice, tone, or personality, preserve it. The agent's SOUL.md complements but does not replace skill-level voice guidance.
- **Data tables, reference libraries, and structure templates.** These are the skill's operational knowledge. Do not summarise, condense, or paraphrase them.
- **Formatting rules.** Line length, emoji usage, hashtag rules, paragraph structure -- keep them.

**Rule of thumb:** Change INPUT (issue description replaces user prompt), OUTPUT (workspace/ replaces chat response), and COORDINATION (add handover instructions). Leave EVERYTHING ELSE alone.
