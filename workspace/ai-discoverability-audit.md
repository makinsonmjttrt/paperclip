# AI Discoverability Audit: FourPointZero & CreativAI

**Issue:** FOU-242
**Date:** 4 April 2026
**Auditor:** UX Researcher
**Methodology:** Web search simulation of ChatGPT, Perplexity, and Gemini query patterns. Direct robots.txt verification. Cross-referenced against FOU-105 baseline audit (3 April 2026) and `workspace/technical-seo-baseline.md`.

---

## Executive Summary

FourPointZero is absent from AI search results for every category query tested. CreativAI has no web presence and therefore cannot appear in any AI tool response. AI bots are not blocked — the technical access is in place, but there is nothing to cite.

**Score: 0/6 queries returned FPZ or CreativAI.** This is consistent with the FOU-105 baseline (10/30 — Invisible).

The position has not changed in the 24 hours since the previous audit because none of the required actions have yet been taken. The opportunity remains open: no competitor holds a dominant position in AI search for the specific niche of AI executive search in creative production.

---

## Query Results

### Simulated ChatGPT Queries

#### Query 1: "AI creative technology recruitment firm UK"

| Signal | Result |
|---|---|
| FourPointZero appeared? | **No** |
| CreativAI appeared? | **No** |
| Competitors appearing | XEC Recruitment, DeepRec.ai, Aquent, Digitalent, Creative Recruitment UK, Lorien, Richard Wheeler Associates, Jonathan Lee Recruitment |
| Content being cited | Agency websites, UK recruitment directories (agencycentral.co.uk), executive search firm comparison blogs |

**XEC Recruitment** leads responses, positioned as "UK's leading AI recruitment agency." XEC has explicit AI-focused branding, a dedicated AI recruitment URL (`xec.ai`), and founder credentials (former FTSE 100 AI Strategy Director) — all signals that AI tools weight heavily.

---

#### Query 2: "CreativAI recruitment"

| Signal | Result |
|---|---|
| FourPointZero appeared? | **No** |
| CreativAI appeared? | **No** |
| What appeared instead | Generic creative agency recruiters: Creative Niche, Artisan Creative, Creative Recruitment UK, Creative Circle, Tomorrow Worldwide |
| Why | No page exists at fourpointzero.io/creativai. AI tools have no content to cite. The CreativAI brand name does not appear in any indexed source. |

This is the clearest failure point. The CreativAI brand is completely invisible to AI search. Any senior executive who types "CreativAI" into ChatGPT or Perplexity gets a page of generic creative recruitment agencies — and no connection to FPZ.

---

#### Query 3: "VFX recruiter specialising in AI"

| Signal | Result |
|---|---|
| FourPointZero appeared? | **No** |
| CreativAI appeared? | **No** |
| Competitors appearing | Talent Outpost (Tiffany Feeney), Rachelle Lewis Talent, Aquent, general job boards (Indeed, ZipRecruiter, Glassdoor) |
| Content being cited | Individual recruiter websites, industry articles on AI in VFX, job board listings |

**Talent Outpost** is the VFX-specialist recruiter that AI tools cite most reliably. They have a dedicated URL (`talent-outpost.com`), named founder with stated credentials, and specific placement statistics (50+ animated films). FPZ's VFX and virtual production track record is not surfacing in AI responses.

---

### Simulated Perplexity Queries

#### Query 4: "Best creative technology recruiters for AI roles UK"

| Signal | Result |
|---|---|
| FourPointZero appeared? | **No** |
| CreativAI appeared? | **No** |
| Competitors appearing | XEC Recruitment, DeepRec.ai, Lorien, Creative Recruitment UK, Oakstone International |
| Sources being cited | Comparison blog posts (gogloby.com, alphaapexgroup.com), individual agency sites, AgencyCentral directory |

Perplexity draws heavily from listicle/comparison pages when answering "best [category]" queries. FPZ appears on none of the directories or comparison articles that Perplexity cites. This is a distribution problem, not purely a content problem.

---

#### Query 5: "Who recruits AI roles in film and TV production UK"

| Signal | Result |
|---|---|
| FourPointZero appeared? | **No** |
| CreativAI appeared? | **No** |
| What appeared | Curious Refuge AI jobs board, BFI AI skills survey 2026, McKinsey report on AI in film/TV, Particle6 |
| Why FPZ absent | FPZ has no indexed article on AI in film/TV production. The BFI and McKinsey content dominates because it is authoritative, specific to the UK market, and published by named institutions. |

FPZ's placement knowledge across VFX and virtual production studios is directly relevant to this query. No content exists to surface it.

---

### Simulated Gemini Query

#### Query 6: "Creative technology staffing agencies AI specialisation UK"

| Signal | Result |
|---|---|
| FourPointZero appeared? | **No** |
| CreativAI appeared? | **No** |
| Competitors appearing | XEC Recruitment, Artisan Creative, Aquent, Creative Recruitment UK, Creative Niche, 24 Seven |
| Sources cited | 9cv9.com recruiter lists, agency websites, staffing industry directories |

Gemini (Google AI) pulls from the Google index. FPZ is crawlable and indexed, but it does not rank for these queries because it lacks the content signals (keyword density, structured data, third-party citations) that would place it in results Gemini uses as sources.

---

## Technical Access Check

### AI Bot Access (robots.txt)

**Status: PASS — no AI bots are blocked.**

Verified at `fourpointzero.io/robots.txt` on 4 April 2026:

```
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
```

No explicit rules for:
- GPTBot (OpenAI / ChatGPT)
- PerplexityBot
- ClaudeBot / anthropic-ai
- Google-Extended (Gemini / AI Overviews)
- Bingbot (Microsoft Copilot)

All AI crawlers can access fourpointzero.io. The barrier to AI citation is content and authority, not technical access.

---

## Why Competitors Are Being Cited (and FPZ Is Not)

| Factor | Competitors (e.g., XEC, Talent Outpost) | FourPointZero |
|---|---|---|
| Dedicated AI/niche URL | xec.ai, talent-outpost.com | fourpointzero.io (generic) |
| Named founder with stated credentials | Yes (XEC: former FTSE 100 AI Director; Talent Outpost: "50+ animated films") | Not surfacing in AI results |
| Explicit positioning copy in H1/title | "UK's leading AI recruitment agency" | "The Recruiters for Creative Production" |
| Listed in recruiter comparison articles | Yes (alphaapexgroup.com, gogloby.com) | No |
| Dedicated AI practice page | Yes | No (CreativAI page is 404) |
| Schema markup with correct entity data | Not verified but likely | Partial — with typos ("Recruitmernt") |
| LinkedIn URL signals | xec.ai, dedicated | linkedin.com/company/xrjobs (XR positioning hangover) |

---

## Key Findings

1. **Zero AI search presence across all 6 test queries.** FPZ does not appear in any AI-generated response for any relevant category query.

2. **CreativAI is completely invisible.** No page, no indexed content, no signals. A search for "CreativAI recruitment" returns unrelated agencies.

3. **No technical barriers.** All AI crawlers can access fourpointzero.io. The problem is content and authority, not access.

4. **Competitor gap is closable.** No single competitor dominates the specific niche of AI executive search in creative production. XEC owns general AI recruitment; Talent Outpost owns VFX. The "AI leadership in creative production" territory is unowned.

5. **Schema errors compound the authority problem.** The organisation name in structured data is indexed as "FourPointZero Recruitmernt" (typo). This weakens Google/Gemini entity confidence in FPZ.

6. **XR/Metaverse positioning hangover persists.** LinkedIn URL is still `xrjobs`. The about-us page title still references "XR and Virtual Production." These signals feed into AI training data and position FPZ incorrectly.

---

## Quick-Win Recommendations

These are actions that can be taken before the CreativAI page is published. Listed by impact, not by ease.

### 1. Fix the schema typo — immediate, high impact

The organisation name "FourPointZero Recruitmernt" is indexed by Google and Gemini. Fix via Yoast SEO Knowledge Graph settings. Requires WP access. Estimated time: 5 minutes once access is granted.

**Impact:** Removes a confidence-reducing error from Google's entity knowledge about FPZ. Improves Gemini response accuracy.

---

### 2. Publish the CreativAI page — highest single action

The CreativAI page copy (`workspace/creativai-page-copy-edited.md`) is written, quality-gated, and AI-structured. It contains a definition block, FAQ section, and comparison table — the three formats AI tools draw from most reliably.

No AI tool can cite a page that does not exist. Publishing this page is the root cause fix for the CreativAI visibility gap.

**Dependency:** Engineer CMS access or Next.js deployment.
**Impact:** Transforms CreativAI from invisible to citable within 2–6 weeks of Google indexing.

---

### 3. Add FAQPage schema to the CreativAI page on publication

When the CreativAI page goes live, add FAQPage schema to the FAQ section immediately. This is the format Gemini (Google AI) uses for featured snippet extraction and AI citation.

The ai-seo skill confirms: content with FAQ schema shows 30–40% higher AI visibility.

**Dependency:** CreativAI page must be live first.
**Impact:** Accelerates AI citation timeline; makes the FAQ content directly extractable by AI tools.

---

### 4. Update LinkedIn company description and tagline — no-code, 20 minutes

Replace the current LinkedIn company description with the AI creative production positioning. Update the tagline to: *"Executive search for AI in creative production."*

Current description (XR/Metaverse-forward) is in AI training data and conflicting with the website's more recent AI positioning. Consistent signals across sources increase AI citation accuracy.

Draft copy: `workspace/linkedin-company-page-about-draft.md`

**Impact:** Reduces AI tool confusion about FPZ's focus. Improves accuracy of responses that reference FPZ.

---

### 5. Submit to two recruiter directories AI tools cite — 1–2 hours

AI tools answer "best AI recruiters UK" queries primarily from comparison/listicle articles, not individual firm websites. FPZ appears on none of the directories referenced in AI responses.

Target first:
- **artificialintelligencejobs.co.uk** — UK-specific, AI-focused, directly relevant
- **Alpha Apex Group blog** (alphaapexgroup.com) — publishes AI recruiter comparisons that appear in Perplexity responses

**Dependency:** CreativAI page live before submitting (directories require a URL).
**Impact:** Entry point into the third-party citation ecosystem that AI tools prioritise. Expected impact on AI responses: 8–16 weeks.

---

## Status Versus FOU-105 Action Plan

The action plan in `workspace/ai-discoverability-action-plan.md` (produced 3 April 2026) identified the same three root causes. As of this audit:

| Action | Status |
|---|---|
| Publish CreativAI page | Not started — blocked on CMS/Engineer access |
| Update LinkedIn company description | Not completed — requires Martyn login |
| Update Crunchbase profile | Not completed — requires Martyn login |
| Fix schema typo | Not started — blocked on WP access |
| Submit to AI recruiter directories | Blocked — CreativAI page not live |
| Post LinkedIn Article (definitional) | Drafted (`workspace/linkedin-article-ai-executive-search.md`) — not yet published |

**None of the actions from FOU-105 have been implemented.** This audit confirms the FOU-105 findings remain accurate and the opportunity window is still open.

---

## Recommended Next Steps

| Priority | Action | Owner | Blocker |
|---|---|---|---|
| 1 | Fix schema typo (Recruitmernt → Recruitment) | Engineer | WP access |
| 2 | Fix schema logo (Twitter icon → FPZ logo) | Engineer | WP access |
| 3 | Publish CreativAI page at /creativai | Engineer | CMS or Next.js access |
| 4 | Add FAQPage + Organization schema to CreativAI page | Engineer | CreativAI page live |
| 5 | Update LinkedIn company description and tagline | CEO (Martyn) | 20 min manual action |
| 6 | Post LinkedIn Article (definitional) | CEO (Martyn) | File ready: `workspace/linkedin-article-ai-executive-search.md` |
| 7 | Update Crunchbase profile | CEO (Martyn) | File ready: `workspace/crunchbase-profile-update.md` |
| 8 | Submit to AI recruiter directories | CMO or BD | CreativAI page live |

---

## Re-Audit Schedule

- **3 May 2026 (30-day):** Repeat all 6 queries. Did CreativAI page index? Does FPZ appear for any category query?
- **3 June 2026 (60-day):** Expanded query set. Check directory listing status. Check if FAQ schema is returning featured snippets.
- **3 July 2026 (90-day):** Full re-audit against 6-dimension scorecard. Target: 20+/30.

---

## Cross-References

- Previous full audit: `workspace/ai-discoverability-action-plan.md` (FOU-105)
- Quick wins summary: `workspace/ai-discoverability-quick-wins-summary.md` (FOU-152)
- Technical SEO baseline: `workspace/technical-seo-baseline.md` (FOU-192)
- CreativAI page copy (quality-gated): `workspace/creativai-page-copy-edited.md`
- LinkedIn Article (ready to post): `workspace/linkedin-article-ai-executive-search.md`
- Crunchbase update copy: `workspace/crunchbase-profile-update.md`

---

*Audit methodology: web search simulation of AI engine query patterns across 6 test queries. Direct robots.txt verification via live fetch. No access to ChatGPT, Perplexity, or Gemini APIs — results approximate AI responses based on indexed content AI tools draw from. Actual AI tool responses may vary by user, date, and model version.*
