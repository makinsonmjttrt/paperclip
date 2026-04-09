# AI Discoverability Action Plan: FourPointZero & CreativAI

**Issue:** FOU-258
**Based on:** FOU-242 audit (4 April 2026) — 0/6 queries, supersedes FOU-105 plan (3 April 2026)
**Date:** 4 April 2026
**Prepared by:** UX Researcher
**Skill used:** ai-seo

---

## Situation

FPZ does not appear in ChatGPT, Perplexity, or Gemini for any relevant category query. CreativAI is completely invisible — the brand name returns unrelated agencies. AI bots are not blocked. The problem is content, structure, and distribution.

**No competitor owns the "AI executive search in creative production" space in AI search.** That position is available to whoever publishes credible, structured content first.

---

## Quick Wins — April 2026 (this month)

Actions that can be completed before the CreativAI page is published. No new content required — all assets exist.

### 1. Fix schema typo on homepage

**Action:** Change organisation name in Yoast SEO Knowledge Graph from "FourPointZero Recruitmernt" to "FourPointZero Recruitment"

| Field | Detail |
|---|---|
| Effort | Low (5 minutes with WP access) |
| Expected impact | Removes a confidence-reducing entity error from Google's Knowledge Graph. Gemini uses this data to confirm FPZ's identity in responses. |
| Owner | Engineer |
| Blocker | WP admin access |
| AI tool targeted | Gemini, Google AI Overviews |

---

### 2. Fix schema logo on homepage

**Action:** Replace Twitter bird icon with FPZ logo in Yoast SEO Knowledge Graph logo setting

| Field | Detail |
|---|---|
| Effort | Low (10 minutes with WP access) |
| Expected impact | Correct entity logo improves Google's confidence in FPZ as an organisation. Affects Knowledge Panel and AI Overview entity cards. |
| Owner | Engineer |
| Blocker | WP admin access |
| AI tool targeted | Gemini, Google AI Overviews |

---

### 3. Update LinkedIn company description and tagline

**Action:** Replace XR/Metaverse-forward About section with AI creative production positioning. Update tagline to: *Executive search for AI in creative production.* File ready at `workspace/linkedin-company-page-about-draft.md`

| Field | Detail |
|---|---|
| Effort | Low (20 minutes — copy already quality-gated) |
| Expected impact | Removes the conflicting XR/Metaverse signal that causes AI tools to describe FPZ incorrectly. Consistent signals across LinkedIn + website increase AI citation accuracy within 4–8 weeks. |
| Owner | Martyn |
| Blocker | LinkedIn login |
| AI tool targeted | All (ChatGPT, Perplexity, Gemini all use LinkedIn as a signal source) |

---

### 4. Request LinkedIn URL slug change

**Action:** Submit request via LinkedIn Help to change company URL from `linkedin.com/company/xrjobs` to `linkedin.com/company/fourpointzero`

| Field | Detail |
|---|---|
| Effort | Low (5 minutes to submit; LinkedIn processes within 1–2 weeks) |
| Expected impact | The `xrjobs` URL is visible in AI training data and positions FPZ as an XR recruiter. Fixing it removes a persistent misdirection signal that no amount of copy changes will override while the URL persists. |
| Owner | Martyn |
| Blocker | LinkedIn login |
| AI tool targeted | All (URL string is read by all AI crawlers) |

---

### 5. Post LinkedIn Article: "What is AI executive search in creative production?"

**Action:** Post the 520-word definitional article as a LinkedIn Article (not a post). File ready at `workspace/linkedin-article-ai-executive-search.md`

| Field | Detail |
|---|---|
| Effort | Low (10 minutes — article is written, quality-gated, and ready) |
| Expected impact | LinkedIn Articles are indexed separately by Google. A definitional article bylined to Martyn Makinson adds a named expert source to AI training data. This is the fastest way to put indexed, AI-structured content in place before the CreativAI page is live. |
| Owner | Martyn |
| Blocker | None |
| AI tool targeted | ChatGPT (indexes LinkedIn articles), Perplexity |

---

### 6. Update Crunchbase profile

**Action:** Paste updated description, categories, and industry tags. File ready at `workspace/crunchbase-profile-update.md`

| Field | Detail |
|---|---|
| Effort | Low (15 minutes) |
| Expected impact | Crunchbase is a primary source for AI tools answering company research queries. Updated categories ("Executive Search", "Artificial Intelligence", "Creative Technology") directly affect how AI tools classify and describe FPZ. |
| Owner | Martyn |
| Blocker | Crunchbase login |
| AI tool targeted | ChatGPT, Perplexity (both cite Crunchbase frequently for company queries) |

---

### 7. Update APSCO, AIXR, and VRARA member profiles

**Action:** Update each membership profile description to lead with AI creative production executive search positioning. Use the Crunchbase long description as base copy, adapted per platform.

| Field | Detail |
|---|---|
| Effort | Low (45 minutes total across 3 profiles) |
| Expected impact | Builds the entity signal web — each profile that correctly describes FPZ is one more source AI tools can draw from. Particularly important for Perplexity, which aggregates from directory sources. |
| Owner | Martyn |
| Blocker | Login to each membership platform |
| AI tool targeted | Perplexity (directory aggregation), ChatGPT |

---

### Quick wins summary table

| # | Action | Owner | Effort | Blocker | Targets |
|---|---|---|---|---|---|
| 1 | Fix schema typo | Engineer | Low | WP access | Gemini |
| 2 | Fix schema logo | Engineer | Low | WP access | Gemini |
| 3 | Update LinkedIn About + tagline | Martyn | Low | LinkedIn login | All |
| 4 | Request LinkedIn URL slug change | Martyn | Low | LinkedIn login | All |
| 5 | Post LinkedIn Article | Martyn | Low | None | ChatGPT, Perplexity |
| 6 | Update Crunchbase profile | Martyn | Low | Crunchbase login | ChatGPT, Perplexity |
| 7 | Update APSCO/AIXR/VRARA profiles | Martyn | Low | Platform logins | Perplexity |

**Total Martyn time required: under 2 hours.**
**Total Engineer time required: under 30 minutes (once WP access is granted).**

---

## Medium-term — May to June 2026 (next 60 days)

Actions requiring the CreativAI page to be live, or involving content production.

### 8. Publish CreativAI page at fourpointzero.io/creativai

**Action:** Publish `workspace/creativai-page-copy-edited.md` as a live page at `/creativai` on fourpointzero.io

| Field | Detail |
|---|---|
| Effort | Medium (2–4 hours — copy is complete, quality-gated) |
| Expected impact | The single highest-impact action available. No AI tool can cite a page that does not exist. The CreativAI copy contains a definition block, FAQ section, and comparison table — the three formats AI tools draw from most reliably. Expected timeline to citation: 2–6 weeks after Google indexes the page. |
| Owner | Engineer |
| Blocker | CMS or Next.js deployment access |
| AI tool targeted | All |
| Dependency | None |

**Structural requirements on publication (do not cut):**
- H1: "AI executive search for creative production" — matches the highest-intent query category
- Definition block within the first 200 words: "CreativAI is FourPointZero's AI executive search practice..."
- FAQ section in question-and-answer format (AI tools extract directly from this)
- Comparison table (four-column format in the copy performs well for AI summary generation)

---

### 9. Add FAQPage + Organization schema to CreativAI page

**Action:** Add FAQPage schema to the FAQ section and Organization schema to the page header on the day the CreativAI page is published. Reference: schema-markup skill for implementation.

| Field | Detail |
|---|---|
| Effort | Medium (2–3 hours) |
| Expected impact | Content with FAQ schema shows 30–40% higher AI visibility (ai-seo skill data). FAQPage is the format Google uses for featured snippet extraction and Gemini AI citation. The sooner this is added, the faster the indexing cycle works in FPZ's favour. |
| Owner | Engineer |
| Blocker | CreativAI page must be live first |
| AI tool targeted | Gemini, Google AI Overviews (primary); ChatGPT (secondary) |
| Dependency | Action 8 |

---

### 10. Add Organization schema with sameAs to homepage

**Action:** Add an Organization schema block to the homepage that includes `sameAs` links to LinkedIn, Crunchbase, APSCO, and AIXR profiles

| Field | Detail |
|---|---|
| Effort | Low-medium (1–2 hours) |
| Expected impact | Tells Google (and Gemini) that these profiles all describe the same entity. Reduces AI tool confusion between the XR-era LinkedIn description and the updated website positioning. Improves Knowledge Panel accuracy. |
| Owner | Engineer |
| Blocker | WP access (or Next.js if migrated) |
| AI tool targeted | Gemini, Google AI Overviews |
| Dependency | Actions 3 and 6 should be complete first (so sameAs points to updated profiles) |

---

### 11. Add canonical tag: jobs.fourptzero.com → fourpointzero.io

**Action:** Add `rel=canonical` pointing from jobs.fourptzero.com to fourpointzero.io to prevent the two domains competing as separate authorities

| Field | Detail |
|---|---|
| Effort | Low (30 minutes) |
| Expected impact | Consolidates domain authority signals. AI tools treat the two domains as separate entities without canonical. Fixes a technical signal fragmentation issue flagged in the technical SEO baseline. |
| Owner | Engineer |
| Blocker | jobs.fourptzero.com server access |
| AI tool targeted | All (technical fix affects crawl authority across all platforms) |

---

### 12. Add JobPosting schema to job listing pages

**Action:** Add JobPosting schema to each active role listing, including title, description, salary range (where available), employment type, and hiringOrganization

| Field | Detail |
|---|---|
| Effort | Medium (3–4 hours initial setup; ongoing per listing) |
| Expected impact | Improves appearance in AI-powered job search queries ("AI leadership roles VFX UK"). Google Jobs integration pulls from JobPosting schema. Strengthens FPZ's authority as an entity associated with AI creative production talent. |
| Owner | Engineer |
| Blocker | CMS access to job listing template |
| AI tool targeted | Gemini (Google Jobs), ChatGPT with search |

---

### 13. Submit to AI recruiter directories

**Action:** Submit FPZ and CreativAI to the directories AI tools cite when answering category queries. Outreach to:
- **artificialintelligencejobs.co.uk** — UK AI-specific, high Perplexity citation rate
- **jake-jorgovan.com** ("Top AI Recruiters" lists) — regularly cited by ChatGPT for headhunter queries; direct outreach with 2–3 sentence positioning statement
- **Alpha Apex Group blog** (alphaapexgroup.com) — comparison articles Perplexity draws from; pitch an inclusion in an AI creative production roundup

| Field | Detail |
|---|---|
| Effort | Medium (3–5 hours across outreach, submissions, and follow-up) |
| Expected impact | Third-party sources are 6.5x more effective than self-citation for AI tools. FPZ appears on none of the directories AI tools currently cite. This is a distribution problem more than a content problem. Expected impact: directional improvement within 8–16 weeks of successful listing. |
| Owner | Martyn or CMO |
| Blocker | CreativAI page must be live (directories require a URL) |
| AI tool targeted | Perplexity (primary — draws heavily from listicles), ChatGPT (secondary) |
| Dependency | Action 8 |

---

### 14. Publish 2–3 definitional LinkedIn Articles

**Action:** Post additional LinkedIn Articles (indexed separately by Google) on definitional topics. First article is ready (see Action 5). Remaining topics:

- "What is a CAIO and why it's the hardest hire in creative production right now"
- "The 50-person shortlist: why senior AI-in-production candidates are scarce"

| Field | Detail |
|---|---|
| Effort | Medium (3 hours total: content agents draft, Martyn posts) |
| Expected impact | Builds a named-expert content corpus on definitional queries. Each article indexes separately. AI tools weight named bylines higher than anonymous content. Cumulative effect: the more definitional content Martyn publishes, the more authoritative FPZ becomes as an AI creative production source. |
| Owner | CMO (drafting) + Martyn (posting) |
| Blocker | None (first article ready; subsequent require drafting) |
| AI tool targeted | ChatGPT (indexes LinkedIn articles), Perplexity |

---

### 15. Byline existing website articles to Martyn Makinson

**Action:** Add named author attribution to existing and future articles on fourpointzero.io. Retroactive bylines on published content also improve the signal.

| Field | Detail |
|---|---|
| Effort | Low (1 hour — WP access to update author fields on existing posts) |
| Expected impact | Named expert sources receive 25–30% higher AI citation weight (Princeton GEO research). Anonymous content is treated as lower authority. Retroactive bylines count once Google re-crawls the pages. |
| Owner | CMO or Martyn (WP access required) |
| Blocker | WP access |
| AI tool targeted | Google AI Overviews, Gemini |

---

### 16. AI Leadership in Creative Production Salary Guide 2026

**Action:** Produce a structured salary/compensation guide for CAIO, Head of AI Production, VP AI by sector (VFX, experiential, broadcaster, AI-native). Original data sourced from FPZ placement knowledge.

| Field | Detail |
|---|---|
| Effort | High (1–2 weeks: CEO data approval + content production + design) |
| Expected impact | Original data is the most citable content type for AI tools — AI cannot generate what only FPZ knows. Salary/compensation guides with named sources are cited heavily across all platforms. This would be the single most-cited piece of content FPZ could produce. |
| Owner | CMO + Martyn (data approval) + content agents |
| Blocker | CEO decision on what placement data can be published |
| AI tool targeted | All |

---

### Medium-term summary table

| # | Action | Owner | Effort | Dependency | Targets |
|---|---|---|---|---|---|
| 8 | Publish CreativAI page | Engineer | Medium | None | All |
| 9 | FAQPage + Organization schema on CreativAI | Engineer | Medium | Action 8 | Gemini, AI Overviews |
| 10 | Organization schema + sameAs on homepage | Engineer | Low-medium | Actions 3, 6 | Gemini |
| 11 | Canonical tag: jobs.fourptzero.com | Engineer | Low | None | All |
| 12 | JobPosting schema on listings | Engineer | Medium | CMS access | Gemini, ChatGPT |
| 13 | Submit to AI recruiter directories | Martyn/CMO | Medium | Action 8 | Perplexity, ChatGPT |
| 14 | 2–3 definitional LinkedIn Articles | CMO + Martyn | Medium | None | ChatGPT, Perplexity |
| 15 | Byline website articles | CMO/Martyn | Low | WP access | AI Overviews, Gemini |
| 16 | Salary Guide 2026 | CMO + Martyn | High | CEO approval | All |

---

## Ongoing — monthly monitoring and measurement

### Monthly AI query check

Run these 6 queries each month across ChatGPT, Perplexity, and Gemini. Record results in a tracking spreadsheet.

| Query | Platform | FPZ cited? | CreativAI cited? | Competitor cited |
|---|---|---|---|---|
| "AI creative technology recruitment firm UK" | ChatGPT | | | |
| "AI creative technology recruitment firm UK" | Perplexity | | | |
| "AI creative technology recruitment firm UK" | Gemini | | | |
| "CreativAI recruitment" | ChatGPT | | | |
| "VFX recruiter specialising in AI" | Perplexity | | | |
| "Creative technology staffing agencies AI UK" | Gemini | | | |

**What to track:** Which page is cited (not just whether FPZ appears). This tells you which content is working.

---

### Re-audit schedule

| Date | Audit type | Target |
|---|---|---|
| 3 May 2026 (30-day) | Repeat 6 baseline queries. Did CreativAI page index? Does FPZ appear in any category query? Has LinkedIn update registered? | First citation in at least 1 query |
| 3 June 2026 (60-day) | Expanded 12-query set. Directory listing status. FAQ schema returning featured snippets? | FPZ cited in 2–3 queries |
| 3 July 2026 (90-day) | Full 6-dimension scorecard re-audit. | Score: 20+/30 (from current 0/6) |

---

### Quarterly content refresh

- Update CreativAI page with new placement examples and any new AI leadership role categories
- Refresh salary guide data
- Update any statistics or data points in blog content to the most recent year
- Check directory listings for accuracy

---

## Priority decision logic

If Martyn can only do one thing today: **Post the LinkedIn Article** (Action 5). It is ready, takes 10 minutes, adds indexed definitional content, and has no dependency.

If Engineer gets WP access: **Fix the schema typo** (Action 1) first, then **schema logo** (Action 2). Combined: 15 minutes. Removes active entity errors from Google's knowledge graph.

If only one medium-term action happens: **Publish the CreativAI page** (Action 8). Every other medium-term action either depends on it or is lower in impact.

---

## What this will not fix quickly

- AI training data already containing the XR/Metaverse positioning — this takes months to dilute with consistent new signals
- Perplexity category query dominance by XEC Recruitment — XEC has a dedicated AI domain (`xec.ai`) and explicit FTSE 100 founder credentials. FPZ's differentiator is specificity: AI executive search *in creative production*, not generic AI recruitment
- ChatGPT "best recruiters" lists — these depend on third-party directory submissions (Action 13), which require the CreativAI page to be live first

---

## Cross-references

- Latest audit (FOU-242): `workspace/ai-discoverability-audit.md`
- Quick wins implementation notes (FOU-152): `workspace/ai-discoverability-quick-wins-summary.md`
- Technical SEO baseline (FOU-192): `workspace/technical-seo-baseline.md`
- CreativAI page copy (quality-gated): `workspace/creativai-page-copy-edited.md`
- LinkedIn Article (ready to post): `workspace/linkedin-article-ai-executive-search.md`
- Crunchbase update copy: `workspace/crunchbase-profile-update.md`
- LinkedIn About section (quality-gated): `workspace/linkedin-company-page-about-draft.md`
