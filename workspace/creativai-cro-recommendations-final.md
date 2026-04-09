# CreativAI Next.js CRO — Final Implementation Brief

**Prepared by:** UX Researcher
**Issue:** [FOU-444](/FOU/issues/FOU-444)
**Source audits:** `workspace/creativai-cro-audit.md` · `workspace/cro-quick-wins.md` · `workspace/creativai-cro-brief-competitor-findings.md`
**File audited:** `adhd-ef-system/app/creativai/page.tsx`
**Date:** 9 April 2026
**Launch target:** 17 April 2026

---

## Status triage — what's done, what's outstanding

| Item | CRO brief ref | Status in page.tsx | Apr 17 tier |
|------|--------------|-------------------|-------------|
| Dual-path CTA above fold | cro-quick-wins #1 + competitor brief §1 | ✅ DONE — lines 330–353 | Tier 1 |
| 4-stat trust cluster | cro-quick-wins #2 | ✅ DONE — lines 212–218, 318–328 | Tier 1 |
| Case study snippets ("Recent searches") | cro-quick-wins #3 | ❌ MISSING — not in page.tsx | Tier 1 |
| Open Graph metadata | cro-quick-wins #4 | ✅ DONE — lines 4–32 | Tier 1 |
| Response commitment copy (bottom CTA) | cro-quick-wins #5 | ✅ DONE — line 711–714 | Tier 2 |
| JSON-LD schema (Next.js) | cro-quick-wins #6 | ✅ DONE — lines 37–210 | Tier 2 |
| Newsletter CTA midpage | cro-quick-wins #7 | ⚠️ STRUCTURAL — link points to footer anchor, not signup | Tier 2 |
| Enquiry type URL param (?type=hire) | cro-quick-wins #8 | ✅ DONE — line 260–263 | Tier 3 |
| Dual-path CTA midpage | competitor brief §1 | ✅ DONE — lines 532–555 | Tier 2 |
| Founder credibility block | competitor brief §2 | ⚠️ STRUCTURAL — placeholder credential copy | Blocked on CEO |

---

## Outstanding items for Engineer

Two items remain. One is a Tier 1 launch blocker; one is a low-effort tidy-up.

---

### 1. Case study snippets — "Recent searches" section

**Priority:** Tier 1 — ship before Apr 17
**Effort:** Low (30–45 min)
**Impact:** High. Real proof of outcomes at the AI/production intersection. No other section on the page shows what FPZ has actually delivered.

**Current state:** No case study or proof section exists in the page. After the trust stat cluster and the dual-path CTA, the page moves directly to "Who we work with" (section 2). The copy exists and is approved — it just has not been added to the JSX.

**Target state:** A "Recent searches" section with two case study cards, positioned between the dual-path CTA above fold and the "Who we work with" section.

**File to edit:** `adhd-ef-system/app/creativai/page.tsx`

**Where to insert:** After the `{/* ── Dual-path CTA — above fold ── */}` section (closes at line 353), before the `{/* ── 2. Who we work with ── */}` section (opens at line 355).

**Exact JSX to add:**

```tsx
{/* ── CRO item 3: Case study snippets — "Recent searches" ── */}
{/* Copy sourced verbatim from workspace/homepage-case-study-snippets.md */}
{/* Neither snippet names the client. Snippet 2 outcomes are directional — do not add "guaranteed" framing. */}
<section className="py-16 border-b border-gray-100">
  <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent searches</h2>
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
    <div className="rounded-lg border border-gray-200 p-6">
      <p className="text-base text-gray-600 leading-relaxed">
        A mid-sized UK VFX studio had committed budget and technology to AI transformation but lacked the human
        architecture to run it. Three months with a generalist firm stalled. FPZ rebuilt the brief, approached
        34 candidates, and placed a Head of AI Production within two months of the brief being finalised.
      </p>
    </div>
    <div className="rounded-lg border border-gray-200 p-6">
      <p className="text-base text-gray-600 leading-relaxed">
        A major UK streaming platform had built a permanent virtual production stage and couldn&apos;t fill the
        leadership role. Two internal searches stalled. FPZ mapped a specialist talent pool from the games
        industry, found a candidate invisible to conventional search, and delivered a shortlist in four weeks.
        First choice hired.
      </p>
    </div>
  </div>
</section>
```

**Notes:**
- No client names — both snippets are anonymised by design. Do not add client names.
- Copy verbatim — do not rewrite or summarise. These exact word counts (50 and 49 words) are approved.
- Snippet 2 says "first choice hired" — this is directional, not a guarantee claim. Do not add any guarantees framing.

---

### 2. Newsletter CTA destination — fix broken anchor link

**Priority:** Tier 2 — low effort, do alongside item 1
**Effort:** Minimal (5 min)
**Impact:** Medium. The newsletter CTA midpage currently points to `#newsletter`, which scrolls to the footer. The footer has no newsletter signup form or embed. The anchor link is a dead end.

**Current state:** `href="#newsletter"` at line 563 scrolls the user to the footer section `id="newsletter"` (line 720). The footer contains navigation links and accreditation text but no newsletter signup.

**Target state:** The "Subscribe to the newsletter" button should point to an actual newsletter signup destination.

**File to edit:** `adhd-ef-system/app/creativai/page.tsx`

**Specific change:** Update line 563 from:
```tsx
href="#newsletter"
```
to the live newsletter signup URL. Check with CMO or marketing for the correct URL. Likely options:
- A Beehiiv / Mailchimp subscribe page
- The FPZ website newsletter signup URL
- A dedicated signup landing page

If the URL is not confirmed in time for Apr 17, change the CTA to link to `/contact-us/?type=newsletter` as a fallback — the CTA will remain functional rather than a dead scroll.

---

## Blocked items (CEO input required before finalising)

These are structural placeholders in the current page. The Engineer has implemented the framework — the CEO needs to provide content before the page is final.

### Founder credential line (section ~line 449)

The founder credibility block is live with a placeholder:
```
[Credential to be confirmed — updating before launch]
```

CEO needs to provide one of:
- Previous role or industry context (e.g. "Previously [role] at [company]")
- Industry body membership or board position
- A quoted line Martyn wants attributed to him personally
- Confirmation that the current text (founding story + "every search runs through Martyn personally") is sufficient and the placeholder should simply be removed

If no credential is available before Apr 17, remove the placeholder line entirely. The block works without it. Publishing `[Credential to be confirmed]` in italic placeholder text would look unfinished.

### Stats verification (trust cluster — already live)

The 4-stat trust cluster is already published in the page. If CEO cannot confirm the "300+" and "89%" figures before Apr 17, update those stats to:
- `300+` → `250+` or remove and replace with a stat that is verifiable
- `89%` → remove or replace with a confirmed figure

Do not publish stats that cannot be defended if a prospect asks directly.

---

## No-action items (already confirmed done)

These required no further Engineer work as of audit date (9 April 2026):

- OG metadata: complete and correct
- JSON-LD schema: full @graph implementation (WebPage, BreadcrumbList, FAQPage, Service) aligned with `feat/json-ld-schema-markup-fpz` branch
- Dual-path CTA above fold: correct equal-weight treatment for hirer and candidate paths
- Midpage dual-path CTA: lighter border style, lower visual weight — correct per spec
- Response commitment copy: positioned adjacent to bottom CTA — correct
- ?type=hire URL param: passed on both hirer CTAs — correct

---

## WordPress-blocked items (not in this brief)

11 items remain blocked on WP access ([FOU-122](/FOU/issues/FOU-122)). None of these can be implemented in Next.js. They are documented in `workspace/cro-quick-wins.md` under "Blocked items." Implementation is ready the moment WP credentials are available.

---

## Handover

**For Engineer:** implement items 1 and 2 above before Apr 17. Both are low effort. Item 1 (case study snippets) is the only Tier 1 item not yet live.

**For CEO:** confirm founder credential copy and verify the 300+ and 89% stats before Apr 17 to avoid publishing placeholder text or unverified figures.

**Newsletter destination URL:** check with CMO/marketing before implementing item 2.

---

*UX Researcher | FourPointZero | 9 April 2026*

---

---

# Part 2: Post-Launch UX Research Plan — First 30 Days

**Prepared by:** UX Researcher
**Issue:** [FOU-508](/FOU/issues/FOU-508)
**Launch date:** 17 April 2026
**Review dates:** D+7 (24 Apr) · D+14 (1 May) · D+30 (17 May)
**Companion doc:** `workspace/creativai-launch-metrics.md` (CMO — pipeline, awareness, newsletter)

> **This plan covers what we're learning about user behaviour and page performance.** The CMO's launch metrics doc handles pipeline, LinkedIn, and BD outcomes. Do not duplicate those checks here.

---

## What We're Trying to Learn

Five questions. Answer these by D+30 and you know whether the page is working and what to fix next.

**Q1. Which CTA path is converting: hire or candidate?**
The dual-path CTA is the core structural bet of this page. Are the right people clicking the right path? Are candidates landing and leaving because they realise this is senior-only?

**Q2. Where are users dropping off?**
The page is long. Where do visitors stop reading? If most leave before reaching the comparison table, the above-fold section isn't earning the scroll. If most leave after the comparison table, the FAQ section isn't closing the gap.

**Q3. Are the trust signals landing?**
The case study snippets and stat cluster are there to build confidence, not just fill space. Are visitors engaging with them, or scrolling past? A qualitative conversation will tell us this better than analytics.

**Q4. Is the friction in the CTA or the page?**
If visitors are reading but not enquiring, the problem is one of two things: the page hasn't convinced them yet, or the CTA friction (destination form, commitment required) is too high. These require different fixes.

**Q5. Is the audience self-selection working?**
The page explicitly says "we are not the right partner for junior or mid-level hiring." Are inbound enquiries well-qualified, or are we getting wrong-fit leads? This is a quality signal, not a volume one.

---

## Data Sources — What to Check and Where

> The CMO's metrics doc handles LinkedIn impressions, BD outreach response rates, and newsletter open rates. These three data sources are yours.

### 1. Vercel Analytics (page behaviour)

**Check at:** D+7 · D+14 · D+30

| What to look for | Where to find it | What it tells you |
|---|---|---|
| Unique visits to `/creativai` | Vercel dashboard → Analytics → Pages | Overall reach. Cross-reference with CMO metrics. |
| Top traffic sources | Vercel dashboard → Analytics → Sources | LinkedIn vs direct vs organic. Tells you which channel to double down on. |
| CTA clicks — hire path | Any link with `?type=hire` | How many visitors are taking the hire action |
| CTA clicks — candidate path | Any link to `/contact-us/?type=candidate` or similar | Whether the dual-path is splitting traffic as intended |
| Bounce pattern | Time on page + pages per session | If avg time is <30s, visitors aren't reading. If >3 min, the page is working but they're not converting. |

> **Note:** Vercel's built-in analytics does not provide scroll depth. If you want scroll depth data, Google Analytics 4 (GA4) with enhanced measurement enabled will capture this automatically. Worth setting up before launch if not already done.

### 2. Contact Form Submissions — CTA Path Tracking

**Check at:** D+14 · D+30

The `?type=hire` URL parameter is live on the hire CTAs. When the contact form receives a submission, check whether the referring URL includes `?type=hire`. This tells you:
- Which CTA path triggered the enquiry
- Whether candidates are inadvertently clicking the hire path (wrong-fit leads)

If the WordPress contact form doesn't log the referring URL, ask the engineer to add a hidden field that captures `utm_content` or `type` from the query string. Low effort, high signal.

### 3. BD Pipeline Quality Check

**Check at:** D+14 · D+30

This is a qualitative data source. For each inbound enquiry that references CreativAI:

1. Is the role senior (£100K+ threshold)?
2. Is the company a studio, agency, or creative SaaS business?
3. Did they reference a specific pain point from the page (AI mandate, specialist talent scarcity)?

Good leads will mention something specific. Vague or misaligned enquiries (junior roles, non-creative sectors) signal that the page's self-qualification copy isn't filtering effectively. Log these in `workspace/bd-pipeline.md` with a "source: creativai" tag.

---

## Qualitative Conversations — Who to Talk to and What to Ask

Two or three conversations. Do these between D+14 and D+30 when you have some early data to frame the questions.

### Who to recruit

| Conversation | Who | How to recruit |
|---|---|---|
| 1. Converted visitor | Someone who landed on `/creativai` and sent an enquiry | Ask them directly: "Would you be willing to share what brought you to reach out?" at the start of the discovery call |
| 2. Non-converting visitor | A network contact who clicked through from LinkedIn but didn't enquire | LinkedIn DM: "You visited the CreativAI page last week — I'd love 10 minutes to understand whether it made sense for your situation" |
| 3. Informed outsider | A peer in creative tech (not a current client) who can read the page cold | Ask them to spend 5 minutes on the page and tell you their first impressions |

### What to ask

Use these questions verbatim — don't improvise. Keep each conversation to 15 minutes maximum.

**Opening (2 min):** "I'm going to ask you about your experience with the CreativAI page. There are no right or wrong answers. I want to understand what you actually thought, not what you think I want to hear."

1. When you landed on the page, what were you immediately looking for?
2. At what point did you decide whether this was relevant to you — and what triggered that?
3. Which part of the page made the strongest impression, positive or negative?
4. Was there anything you expected to see that wasn't there?
5. If you were going to describe this to a colleague in one sentence, what would you say?
6. What would have made you more confident to reach out? (Or: what nearly stopped you reaching out?)

**Record:** Note the exact words they use, not your paraphrase. The language visitors use is the language the page should use.

---

## Success Metrics

> These are UX Research metrics. For pipeline, LinkedIn, and newsletter targets, see `workspace/creativai-launch-metrics.md`.

### D+7 — 24 April 2026

| What | Good result | Concern |
|---|---|---|
| Analytics tracking confirmed live | Both Vercel and GA4 firing on `/creativai` | Any gap in tracking means D+14 and D+30 data will be incomplete. Fix immediately. |
| Both CTA paths clicked at least once | Hire path: 1+ clicks. Candidate path: 1+ clicks. | If one path has 0 clicks by D+7 with 50+ visits, the CTA may not be visible enough. |
| No wrong-fit enquiries | All inbound mentions of CreativAI are senior roles in creative/production | 2+ junior role enquiries = self-qualification copy needs strengthening |
| Qualitative: 1 conversation started | One person identified and asked | Not yet completed — just initiated |

**D+7 action:** Review the data. Do not make any page changes yet. Volume is too low for conclusions.

---

### D+14 — 1 May 2026

| What | Good result | Concern |
|---|---|---|
| Hire-to-candidate CTA ratio | Hire clicks > candidate clicks (this is primarily a B2B page) | Equal or reverse ratio may mean the headline is ambiguous about who the primary audience is |
| Traffic source split | LinkedIn driving 60%+ of visits | If organic (Google) is the top source already, prioritise SEO next; if direct is high, the email list is working |
| Time on page | Average 2 min+ | Under 60 seconds = visitors are not reading. Above-fold section is losing them. |
| Qualitative | 1 conversation complete | 0 conversations = block time specifically; this data is more valuable than the analytics at this stage |

**D+14 decision:** If hire CTA click rate is below 3% of page visits AND time on page is under 60 seconds, the above-fold copy is not qualifying visitors fast enough. Escalate to CMO for a copy test before D+30.

---

### D+30 — 17 May 2026

| What | Good result | Concern |
|---|---|---|
| Visitor-to-enquiry rate | 2%+ (minimum 3 enquiries from 150 visits) | Below 1% with 200+ visits = conversion problem. Likely CTA friction or trust gap. |
| CTA path conversion | Can identify which path generated each enquiry | If this data is absent (no URL param logging) → prioritise GA4 hidden field setup for Phase 2 |
| Lead quality | 80%+ of enquiries are senior, right-fit roles | Below 50% = self-qualification copy needs a sharper filter (stricter qualifying statement above fold) |
| Qualitative insights | 2 conversations complete with documented findings | Document verbatim quotes in this file or a new `workspace/creativai-user-research-findings.md` |
| Hypothesis status | Clear answer on Q1–Q5 above | If any question is still unanswered, add it to the Phase 2 research scope |

---

## When to Make Changes vs When to Wait

Use this framework to avoid over-reacting to early data.

### Always wait until D+14 before changing anything

Under 100 visits, any pattern you see is noise. The first week is for observation and tracking verification only. The one exception: if analytics tracking is broken, fix it immediately.

### Change before D+30 only if:

| Signal | Threshold | Action |
|---|---|---|
| CTA click rate is near-zero | Hire path: 0 clicks with 100+ visits at D+14 | Add a text-only secondary CTA ("Or email us directly: [email]") — lower friction alternative |
| Wrong-fit leads dominating | 3+ junior/non-creative enquiries in first 2 weeks | Add a qualifying line directly above the primary CTA: "We work exclusively on senior mandates (£120K+)" |
| No visits from LinkedIn traffic | LinkedIn is top referrer in CMO metrics but `/creativai` shows <20 visits from social | Check if the launch post link is correctly pointing to the page URL, not the homepage |
| Analytics broken | Vercel shows visits but GA4 shows 0 | Fix tracking before D+14. This is non-negotiable. |

### Do not change before D+30:

- Core messaging and positioning (needs a full 30-day read)
- The dual-path CTA structure (needs a valid sample to assess)
- The comparison table (structural change; wait for qualitative signal before testing alternatives)
- The "Who we work with" named brands (pending CEO decision — not a conversion lever to test yet)

---

## Phase 2 Research Triggers

At D+30, hand the following to the CMO and Product Owner as inputs for the next phase:

1. **Best-performing traffic source** → informs where to invest content and distribution budget next
2. **Which CTA path converted** → informs whether to strengthen the hire-first framing or give the candidate path its own dedicated page
3. **Verbatim language from qualitative conversations** → should feed directly into next iteration of page copy
4. **Unanswered questions from Q1–Q5** → become the research brief for the first 60-day review
5. **Lead quality verdict** → if wrong-fit leads are a pattern, propose a more explicit qualifying gate (minimum role seniority, budget threshold) as a copy test for Phase 2

---

*UX Researcher | FourPointZero | 9 April 2026 | FOU-508*

---

---

# Part 3: CreativAI A/B Test Plan — 30-Day Post-Launch Experiment Roadmap

**Prepared by:** UX Researcher
**Issue:** [FOU-592](/FOU/issues/FOU-592)
**Launch date:** 17 April 2026
**Experiment window:** D+1 (18 Apr) to D+30 (17 May)

---

## Traffic Reality Check

This is a specialist B2B page. Expected traffic in the first 30 days: 50–250 visits. That is not enough for statistical significance on a standard two-sided test (which typically requires 200+ observations per variant at 80% power and 5% significance). Attempting formally significant A/B tests at this traffic level produces unreliable conclusions.

These experiments are framed as **directional tests**. A consistent 20%+ difference in the primary metric across a minimum of 30 observations per variant is the threshold to act on — not a p-value. Be honest with yourself about what this data can and cannot tell you.

**What that means in practice:**
- One test at a time. Never run parallel experiments. You do not have the traffic to isolate effects.
- Collect a baseline first. No experiments before D+14. Wait for meaningful observation data before changing anything.
- If traffic is very low (under 80 visits by D+14), defer all tests to Phase 2 and use D+30 purely as a baseline collection period.

---

## Tooling

Vercel Analytics custom events (`cta_employer_click`, `cta_candidate_click`) are the primary measurement mechanism. These events must be confirmed firing before any test begins.

For test delivery, the simplest approach at this traffic level is **time-based sequential testing** (Version A live for 7 days, then Version B live for 7 days, compare periods). This is not technically equivalent to simultaneous A/B testing — external factors can affect one period more than another — but it is workable at low traffic and requires no additional tooling.

If traffic grows beyond 500 visits/month, replace this with proper simultaneous split testing using Vercel Edge Middleware or a tool such as GrowthBook (open source, integrates with Vercel Analytics).

---

## Test Sequence

Run these in order. Do not skip to a later test if an earlier one has not concluded.

| Test | Timing | What you are testing |
|------|---------|----------------------|
| Baseline observation | D+1 to D+13 | No changes. Collect baseline CTA click rates and traffic source data. |
| Test 1: CTA copy | D+14 to D+25 | Employer CTA button text |
| Test 2: Hero headline | D+26 to D+30 (or Phase 2) | Above-fold headline framing |
| Test 3: Social proof position | Phase 2 | Case study snippet placement |
| Test 4: Form length | Phase 2 (pending form availability) | Contact form complexity |

Tests 3 and 4 move to Phase 2 because the 30-day window is not long enough to run four tests with any reliability. If Test 1 concludes early (clear directional signal by D+20), start Test 2 earlier.

---

## Test 1: CTA Copy (Employer Path)

**Window:** D+14 to D+25 (12 days)

### Hypothesis

The current employer CTA button text is functional but task-framed ("Start a search," "Contact us to submit a brief"). Outcome-framed language that signals what the employer gets — rather than what they have to do — will increase click-through on the employer CTA path.

### Variants

| Variant | Button text | Framing |
|---------|-------------|---------|
| Control | Current live text (verify in `adhd-ef-system/app/creativai/page.tsx` before starting) | Task-led |
| A | Find AI Talent | Direct, candidate-outcome framing |
| B | Start Your Brief | Process-entry framing |

**Why not test "Get Matched"?** "Get Matched" implies an automated system. FPZ's positioning is explicitly human and network-first ("We do not scrape LinkedIn"). "Get Matched" creates a brand conflict. Recommend removing it from consideration without testing. If the CEO disagrees, add it as a second sequential test after A and B have concluded.

**Method:** 6 days on Control, then 6 days on Variant A. If A shows 20%+ uplift on `cta_employer_click`, implement A and move to Test 2. If no clear signal, test Variant B against the control in Phase 2.

### Primary metric
`cta_employer_click` events in Vercel Analytics

### Secondary metrics
- Time on page (a lower CTR with higher time on page = the page is engaging but the CTA is the gap)
- `cta_candidate_click` as a sanity check (should not change between variants — if it does, something is wrong with the implementation)

### Minimum sample needed
30 employer CTA clicks across both periods combined before drawing any conclusion. With an estimated 3–8% employer CTA click rate on 50+ visits, expect 2–4 clicks per 6-day period at minimum. If total clicks are under 20 after the full test window, the test is inconclusive. Do not implement either variant as a "winner."

### Duration recommendation
12 days (two 6-day periods). Do not extend beyond D+25 — you need room for Test 2 data.

### Win criteria
Variant A is implemented as the new control if: `cta_employer_click` rate in the Variant A period is 20%+ higher than the Control period AND there are at least 15 employer CTA clicks per period. Below this threshold, the test is inconclusive.

---

## Test 2: Hero Headline

**Window:** D+26 to D+30 (5 days — directional only, with Phase 2 continuation)

### Hypothesis

The current headline ("AI executive search for creative production") is accurate and keyword-optimised but category-descriptive. A benefit-led alternative that names the pain point or the outcome will increase engagement (time on page, scroll depth) among qualified visitors who already know what executive search is.

### Variants

| Variant | Headline | Framing |
|---------|----------|---------|
| Control | AI executive search for creative production | Category descriptor |
| A | The only search firm built for AI leadership in creative production | Sole-focus claim, differentiation |

**Why this headline for Variant A?** The copy in "Why CreativAI" already establishes sole focus as FPZ's primary differentiator ("No other firm is doing this systematically"). Moving that claim into the headline makes the differentiation available to visitors who will not scroll that far. It does not require inventing anything not already on the page.

**SEO note:** This variant changes the H1. If the Control headline is driving any early organic traffic (unlikely in 30 days, but possible), the H1 change will affect indexing. Run this test only after checking whether `/creativai` has any organic impressions in Google Search Console. If there is meaningful organic traffic already, defer this test to Phase 2 and keep the keyword-optimised H1 intact.

### Primary metric
Time on page (proxy for engagement quality at low traffic where click data is scarce)

### Secondary metrics
- `cta_employer_click` (secondary — any uplift here confirms the headline is qualifying better)
- Bounce rate trend

### Minimum sample needed
50+ visits per 5-day period. If the test window opens at D+26 with under 100 cumulative page visits, the 5 days will not produce enough data. Treat D+26–D+30 as a preliminary observation period and continue the headline test into Phase 2.

### Duration recommendation
5 days in this window (directional signal only). Continue into Phase 2 with a proper 14-day test if the preliminary signal is ambiguous.

### Win criteria
Variant A implemented as new headline if: average time on page in Variant A period is 25%+ higher than Control period AND at least one additional `cta_employer_click` is attributable to the period (not just time variance). Again, at this traffic level, this is directional — not conclusive.

---

## Test 3: Social Proof Position (Phase 2)

**Planned window:** Phase 2 (post D+30)

### Hypothesis

Case study snippets ("Recent searches") currently appear below the above-fold dual-path CTA. Moving them above the CTA — so visitors read proof before they are asked to act — will increase `cta_employer_click` rate by reducing hesitation at the first conversion point.

### Variants

| Variant | Proof placement |
|---------|----------------|
| Control | Current: case study snippets below above-fold CTA |
| A | Case study snippets above above-fold CTA (between intro paragraph and CTA) |

### Primary metric
`cta_employer_click` rate on the above-fold CTA specifically (distinguish from the midpage CTA if both are tracked separately)

### Secondary metrics
Scroll depth to the case study section (via GA4 enhanced measurement, if enabled)

### Minimum sample needed
50+ sessions per variant. Defer until monthly traffic to `/creativai` is reliably above 200 visits.

### Win criteria
Variant A implemented if: above-fold `cta_employer_click` rate is 20%+ higher in Variant A than Control, across 50+ sessions per variant.

---

## Test 4: Form Length (Phase 2 — Pending Form Availability)

**Planned window:** Phase 2, only if a contact form is implemented on the Next.js page

### Current state

The employer CTA currently links to `/contact-us/?type=hire` on the WordPress site. There is no embedded contact form on the `/creativai` page itself. This test cannot run until either:
a. An inline form is embedded on the Next.js page, or
b. A minimal contact form option exists alongside the full WordPress form

### Hypothesis

If a shorter form (name, company, email, role type — 4 fields) is offered as an alternative entry point alongside the full brief submission form, conversion rate on initial contact will increase. The full brief can be collected in the follow-up call.

### Variants

| Variant | Form |
|---------|------|
| Control | Full WordPress brief form (current) |
| A | 4-field minimal form: name, company name, email, "What role are you hiring for?" |

### Prerequisite

Engineer must implement an inline or modal minimal form on the Next.js page before this test can run. Flag this requirement to Engineer when raising Phase 2 planning issues.

### Primary metric
Form submission rate (completions / page visits)

### Win criteria
Variant A implemented if: form submission rate in Variant A period is 30%+ higher than Control, across 100+ visits per period.

---

## Phase 2 Handover

At D+30, hand the following to CMO and Product Owner:

1. **Baseline CTA click rates** from D+1–D+13 observation period
2. **Test 1 result** (CTA copy: Control vs Find AI Talent) — conclusive, directional, or inconclusive
3. **Test 2 preliminary signal** (headline: did time on page change?)
4. **Test 3 and 4** queued and ready to run pending traffic thresholds
5. **Traffic threshold achieved?** If cumulative D+30 visits are under 200, all Phase 2 tests require deferral until monthly traffic hits 300+ visits

---

## Experiment Log Template

Keep a running log in this file or a dedicated `workspace/creativai-ab-test-log.md`. For each test period, record:

```
Period: [dates]
Variant: [which variant was live]
Visits: [total page visits in period]
cta_employer_click: [count]
cta_candidate_click: [count]
Avg time on page: [seconds]
Notes: [anything anomalous — launch post went live, LinkedIn surge, etc.]
```

Do not interpret any single period in isolation. Always compare the variant period to its paired control period before drawing conclusions.

---

*UX Researcher | FourPointZero | 9 April 2026 | FOU-592*
