# Skill Conversion Checklist

**Purpose:** Step-by-step checklist for converting a Claude Code skill to Paperclip format.
**Reference:** See skill-adaptation-template.md for the target file structure.
**Apply to:** Every skill conversion in Phases 5 and 9.

---

## Pre-Conversion

Before writing anything, confirm these items:

- [ ] Identify the source skill file path (Claude Code location under `~/.claude/skills/` or project `.claude/skills/`)
- [ ] Read the source skill file completely before making any changes
- [ ] Confirm the target agent from skill-ownership-matrix.md
- [ ] Confirm whether this is a standalone skill or part of a bundle (check the Bundle column in the matrix)
- [ ] If bundle: check if the bundle file already exists in the target agent's skills/ directory (add to it, do not create a duplicate)
- [ ] Determine the target filename using naming conventions from skill-adaptation-template.md
- [ ] Note the skill category (content, strategy, SEO, etc.) for handover routing

---

## Interactive Pattern Removal

This section addresses ADPT-02. Scan the source file for every pattern in the "Interactive Pattern Replacements" table in skill-adaptation-template.md. Check each one:

- [ ] No "Ask:" or "ask the user" patterns remain
- [ ] No "clarifying question" patterns remain
- [ ] No "If unsure, ask" patterns remain
- [ ] No "present to the user" or "present the draft" patterns remain
- [ ] No "offer:" or "would you like" choice patterns remain
- [ ] No "AskUserQuestion" tool references remain (check frontmatter `allowed-tools` too)
- [ ] No "confirm with the user" or "confirm the filename" patterns remain
- [ ] No "the-vault/" references remain (replaced with "workspace/")
- [ ] No "save finished work" without specifying workspace/ path
- [ ] No "read it out loud" or "read back to the user" patterns remain

**Verification command:**
```bash
grep -icE "(ask the user|ask:|clarifying question|if unsure.*(ask|question)|present (to the user|the draft)|would you like|AskUserQuestion|confirm.*(with|from) the user|the-vault|read it out loud|read back to the user)" {converted-file}
```
Expected result: zero matches.

---

## Issue-Driven Trigger Logic

This section addresses ADPT-03. The skill must work in a headless, issue-driven context:

- [ ] File has an "## Input" section that reads from the issue description
- [ ] Input section specifies what data to extract from the issue
- [ ] If input is missing from the issue, the skill comments asking for it (does not guess)
- [ ] No blocking patterns: skill proceeds with reasonable defaults where possible
- [ ] Issue labels referenced where skill selection depends on context (bundles especially)
- [ ] No references to "the user said" or "user provides" -- replaced with "issue description contains"

---

## Structure Compliance

- [ ] File starts with `# Skill: {Name}` (standalone) or `# Skill Bundle: {Name}` (bundle)
- [ ] Has one-line identity statement immediately after the title
- [ ] Has `## Input` section
- [ ] Has `## Process` section with numbered steps
- [ ] Has `## Output` section specifying `workspace/` path
- [ ] Has `## Handover` section with specific @-mention target
- [ ] Has `## Rules` section with at least "All output in UK English"
- [ ] Core skill logic preserved verbatim from source (not summarised or watered down)
- [ ] Examples, templates, data tables, and reference material preserved intact
- [ ] Quality checklists preserved (minus interactive verification steps)

---

## Content Quality Gate (content-producing skills only)

- [ ] Handover section includes @-mention of Technical Writer for humanizer pass
- [ ] No skill claims to run humanizer itself (only Technical Writer owns humanizer execution)
- [ ] Output format is markdown saved to workspace/
- [ ] Voice and tone guidelines from source skill preserved

---

## Naming and Filing

- [ ] Filename is lowercase, hyphens only, `.md` extension
- [ ] Colons converted: `claude-blog:blog-write` becomes `blog-write.md`
- [ ] Namespace prefixes stripped: `anthropic-skills:content-creator` becomes `content-creator.md`
- [ ] File saved to correct agent's skills/ directory: `~/.paperclip/instances/default/companies/FourPointZero/agents/{agent-slug}/skills/`
- [ ] AGENTS.md updated with `Read and follow: $AGENT_HOME/skills/{filename}` line below the skills injection comment

---

## Post-Conversion Verification

Run these commands after conversion. All must pass before the skill is considered complete.

**1. Interactive pattern scan (must return 0 matches):**
```bash
grep -icE "(ask the user|ask:|clarifying question|if unsure.*(ask|question)|present (to the user|the draft)|would you like|AskUserQuestion|confirm.*(with|from) the user|the-vault)" {file}
```

**2. Required sections present (each must return at least 1):**
```bash
grep -c "## Input" {file}
grep -c "## Process" {file}
grep -c "## Output" {file}
grep -c "## Handover" {file}
grep -c "## Rules" {file}
```

**3. Workspace output path present:**
```bash
grep -c "workspace/" {file}
```

**4. UK English rule present:**
```bash
grep -c "UK English" {file}
```

**5. AGENTS.md reference added:**
```bash
grep -c "Read and follow.*skills/{skill-name}" {agent-AGENTS.md-path}
```

**6. Word count comparison (standalone skills only):**
```bash
wc -w {source-file} {converted-file}
```
Adapted file should be within 30% of source length. If significantly shorter, core logic was likely over-summarised.

---

## Common Mistakes

These are drawn from PITFALLS.md. Each row describes a mistake, the consequence, and how to catch it.

| Mistake | What Happens | How to Catch |
|---------|--------------|--------------|
| Copy-paste without removing interactive patterns | Agent stalls or hallucinates user responses | Run the interactive pattern grep in Post-Conversion Verification |
| Over-adapting (rewriting the core logic) | Skill loses its value, becomes a generic summary | Compare word count: adapted file should be within 30% of source length for standalone skills |
| Missing handover instructions | Work sits in limbo, nobody picks it up | grep for "@-mention" in the Handover section |
| Wrong agent assignment | Skill conflicts with another agent's skills | Cross-check against skill-ownership-matrix.md before filing |
| Forgetting AGENTS.md reference | Agent never loads the skill | grep AGENTS.md for the skill filename after filing |
| Bundle duplication | Two files contain the same skill | Check if bundle file already exists before creating |
| Forgetting humanizer handover | Content ships without quality gate | grep for "Technical Writer" in Handover section of content-producing skills |
| Using the-vault/ instead of workspace/ | Deliverable saved to wrong location | grep for "the-vault" in converted file (must return 0) |
