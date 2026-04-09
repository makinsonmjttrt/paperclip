# AI Discoverability Pre-Launch Check: CreativAI Page

**Issue:** FOU-370
**Date:** 8 April 2026
**Context:** Post-FAQ-schema review. FOU-337 implemented JSON-LD schema on the CreativAI page. This is a targeted check before the 17 April launch, not a full re-audit.

---

## 1. Is the FAQ content answering the right questions?

Partially. The implemented schema (8 questions in `the-vault/schema-markup/creativai-page-schema.json`) focuses on product detail: CAIO hiring context, engagement model, timelines, and scope qualifiers. These are the right questions for a prospective client already considering FourPointZero. They are not the questions AI tools surface first.

The two highest-priority AI queries — "What is CreativAI?" and "What is FourPointZero?" — are absent from the implemented schema. The original FOU-285 schema included both as explicit questions with concise definitional answers. They were not carried forward into the FOU-337 implementation. This is a gap: if someone types "what is FourPointZero CreativAI" into ChatGPT or Perplexity, the FAQ schema currently provides no direct answer to extract.

Recommended addition before launch: one question — `"What is CreativAI?"` — with the 44-word answer already written in FOU-285: *"CreativAI is FourPointZero's AI executive search practice. It places the senior leaders who integrate AI into production pipelines at VFX studios, post-production houses, experiential agencies, virtual production facilities, and creative software companies. CreativAI works on a retained basis with established organisations that have a confirmed AI mandate at board or executive level."*

---

## 2. Are answers concise enough for AI snippet extraction?

Yes, with one exception. Six of the eight answers sit in the 40–70 word range, which is the optimal window for AI tools extracting featured snippet content. Two answers stand out:

- **"What types of roles does CreativAI place?"** — 47 words, structured list with named roles. Ideal for AI extraction.
- **"How long does a CreativAI executive search take?"** — 41 words, clear timeframe with supporting rationale. Ideal.
- **"What is the geographic coverage?"** — *3 words: "UK and US coverage."* Too thin. AI tools skip fragments this short when selecting citation material. Suggest expanding to one full sentence: "CreativAI conducts executive search across the UK and US, placing AI leadership roles in creative production organisations in both markets."

The CAIO hiring answer (67 words) and the engagement model answer (49 words) are both well-sized and well-structured for extraction.

---

## 3. Quick wins remaining from the original audit

The schema work from FOU-337 closes the primary technical gap. Outstanding items are:

| Action | Status | Blocker |
|---|---|---|
| Fix homepage schema typo (Recruitmernt) | Not done | WP access |
| Update LinkedIn company description | Not done | Martyn login |
| Post LinkedIn Article (definitional) | Not done | Martyn login |
| Update Crunchbase profile | Not done | Martyn login |
| Submit to AI recruiter directories | Blocked | CreativAI page must be live first |
| Add "What is CreativAI?" FAQ entry | Recommended before launch | Engineer (30-second edit) |

The directory submissions (artificialintelligencejobs.co.uk, Alpha Apex Group) remain the highest-impact pending action for third-party citation. These should go live within 48 hours of the page launching on 17 April.

---

## 4. AI search readiness verdict

The CreativAI page schema is structurally sound and ready for launch. The WebPage, BreadcrumbList, FAQPage, and Service schema types are all present and correctly cross-referenced. Answer lengths are appropriate. The page will be indexable and the FAQ content extractable by AI tools from day one.

One gap warrants a quick fix before 17 April: add the "What is CreativAI?" question to the FAQ schema. It is the single most likely query a senior creative production executive will run when evaluating FourPointZero before calling. Everything else is post-launch optimisation. The page is ready to ship.

---

*Reviewed against: `workspace/ai-discoverability-audit.md`, `workspace/ai-discoverability-quick-wins-summary.md`, `the-vault/schema-markup/creativai-page-schema.json`*
