# Tech Stack Documentation Review — Gap Analysis

**Author:** CTO
**Date:** 2026-04-03
**Issue:** [FOU-76](/FOU/issues/FOU-76)
**Scope:** ADHD Executive Function System (Next.js + Vercel + Notion + n8n + OpenRouter)

---

## Summary

The core stack is pragmatic and appropriate for the scale of this system. The implementation documentation (PRD, CLAUDE.md, lessons.md) is unusually thorough for an internal tool. The gaps are all operational: what's missing is the layer of documentation that keeps the system running safely when something breaks or changes.

---

## Gap 1 — No environment variable manifest

**What's missing:** No `.env.example` or documented secrets spec in the repo. Notion DB IDs are embedded in `CLAUDE.md` (a developer context file), not in a dedicated environment reference.

**Business impact:** `FOU-66` was blocked for multiple heartbeat cycles because the CEO didn't know which env vars to set in Vercel, or in what order. A one-page secrets manifest would have reduced that blocker to a two-minute task.

**Recommended fix:** Create `/docs/ENV.md` listing every required env var, its purpose, where to find the value, and which environments it applies to (production/preview/development). Add a `.env.example` to the repo root.

---

## Gap 2 — No architecture decision records (ADRs)

**What's missing:** No document explaining why Notion was chosen as the persistence layer, why n8n rather than Vercel cron + direct API calls, or why OpenRouter sits in front of the Anthropic SDK. The `package.json` has both `@anthropic-ai/sdk` and the Vercel `ai` SDK — no rationale for which to use when.

**Business impact:** Low risk today. High risk when the CEO asks "should we move off Notion?" or when the Engineer needs to extend the LLM layer. Without documented trade-offs, the same research happens again from scratch.

**Recommended fix:** A single `/docs/ARCHITECTURE.md` covering: stack rationale, one paragraph per component (why this tool, what it replaces, key constraints), and a note on the dual-SDK situation.

---

## Gap 3 — No operational runbook

**What's missing:** No document covering what to do when the system the CEO uses daily goes wrong. `CLAUDE.md` has developer gotchas, but nothing for the operator role: what to check when morning-startup doesn't fire, when Notion returns 429s, or when an n8n workflow silently fails.

**Business impact:** This is a solo-operator system. System failure = CEO's working day is broken. Recovery time is entirely dependent on whoever is available to debug, with no reference point.

**Recommended fix:** A `/docs/RUNBOOK.md` with: symptom → probable cause → recovery steps for the 5-6 most likely failure modes. Specifically: Vercel deployment failure, Notion API rate limit, n8n workflow not firing, missing env var, and database ID mismatch.

---

## Gap 4 — No CI pipeline and no test standard

**What's missing:** `docs/git-workflow.md` says "if the project has CI configured" — it is not configured. There is a `tests/` directory in the repo but no documented coverage requirement, no test runner command in `package.json` scripts, and no enforcement on PRs.

**Business impact:** PR review (e.g. FOU-70 basic auth) relies entirely on Code Reviewer reading the code. A regression in auth middleware or Notion API calls could ship undetected.

**Recommended fix:** Add a GitHub Actions workflow that runs `npx tsc --noEmit` on every PR (zero-cost, catches type errors immediately). Document the minimum test expectation in the Engineer AGENTS.md — even if the bar is "TypeScript must compile clean; critical path functions must have unit tests."

---

## Gap 5 — n8n workflows have no schema documentation

**What's missing:** Nine production workflows are recorded in `CLAUDE.md` by name and ID. There is an `n8n-workflows/README.md` in the repo but its content covers only setup, not what each workflow does, what it queries, what it sends, or what happens when it fails silently.

**Business impact:** If a detection workflow stops firing (e.g. DETECT-03 Sticky Activity Check), there is no quick way to know what it was doing, what data it expected, or how to validate it's working. The n8n cloud instance is also external — if credentials rotate or the instance is replaced, reconstruction effort is high.

**Recommended fix:** A one-line entry per workflow in `/docs/N8N-WORKFLOWS.md`: trigger, what it checks, what action it takes, and how to verify it's healthy. Existing `n8n-workflows/README.md` should be expanded or replaced with this.

---

## Priority order

| # | Gap | Effort | Urgency |
|---|-----|--------|---------|
| 1 | Environment variable manifest | Low | High — active blocker pattern |
| 3 | Operational runbook | Medium | High — daily-use system |
| 4 | CI pipeline (tsc check) | Low | Medium — catches regressions |
| 5 | n8n workflow schema doc | Low | Medium — fragile undocumented state |
| 2 | Architecture decision records | Low | Low — no active risk today |

---

## What is already well-documented

- PRD (v3.0 through v8.0) is thorough and version-controlled
- `CLAUDE.md` is a strong developer context file — DB IDs, gotchas, workflow protocol
- `tasks/lessons.md` self-improvement loop is effective
- PR conventions and git workflow are clearly defined
- Code style standards (TypeScript strict, immutable patterns) are written down and followed

The foundation is solid. The five gaps above are all about operational resilience, not product quality.
