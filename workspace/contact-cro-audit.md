# CRO Audit: FPZ Contact and Enquiry Conversion Flow

**Prepared:** 3 April 2026
**Owner:** UX Researcher
**Issue:** [FOU-169](/FOU/issues/FOU-169)
**Source:** website-audit.md · homepage-cro-recommendations.md · live site review (fourpointzero.io)

---

## Scope

Audit of the path from homepage to submitted enquiry — covering all routes a client or candidate takes to make contact, and the contact page itself. Homepage copy issues are excluded (covered in workspace/homepage-cro-recommendations.md). This report focuses on the enquiry flow: CTAs, page routing, the contact form, and trust signals at the point of commitment.

---

## Current State

### How visitors currently reach the contact page

There are three routes:

1. **Homepage nav → "Contact Us"** (most common). The only homepage CTA is "Read More" → About page. Visitors who want to contact FPZ must find the nav link themselves. There is no proactive invitation to enquire above the fold.

2. **"What We Deliver" page → service-specific CTAs** ("Discuss a board level hire," "Discuss a senior leadership hire," etc.) → contact page. These CTAs exist and are contextually appropriate. However, they drop the visitor on a generic blank form with no carryover from the service page context.

3. **Talent page → "let's talk"** → contact page. Candidates who want to register interest or have a conversation are routed to the same generic contact form as hiring clients.

### The contact page itself

**Form fields:** Name (required), Email (required), Subject (optional free text), Your Message (optional free text).

**Trust signals on the page:** None inline. Membership logos (APSCO, VRARA, AIXR) appear in the footer. Phone numbers and office addresses are displayed.

**Next-step communication:** None. The form submits with no indication of who will respond, when, or what to expect.

**Audience routing:** None. A hiring director briefing a retained CAIO search submits the same form as a 3D artist enquiring about a junior role. No differentiation at capture.

---

## Findings

### F1 — The contact form is completely undifferentiated

A single generic form serves two fundamentally different audiences: clients briefing searches and candidates registering interest. The Subject field is optional and free-text, which means:

- Leads arrive in the inbox with no qualification signal
- Follow-up must triage intent manually
- Auto-response personalisation is impossible
- The cognitive load of "what do I write?" sits entirely with the visitor

A client ready to brief a retained CAIO search looks at a blank "Your Message" box with no scaffolding and decides how much effort to invest. Many will write less than the conversation requires, or abandon.

### F2 — No response commitment or next-step clarity

After submitting the form, the visitor has no idea what happens next. The absence of "we'll respond within one working day" (or equivalent) creates post-submit anxiety. For senior buyers evaluating whether to brief a boutique firm, this silence reads as unprofessionalism, not discretion.

This is the single cheapest fix on the list.

### F3 — Trust signals are missing at the moment of commitment

The contact page is where visitor scepticism peaks. A first-time buyer is deciding whether to hand over their name, email, and the detail of a confidential board-level hire. The proof metrics that would directly address this anxiety — 89% repeat client rate, 89% 18-month retention, 300+ placements — exist on the About page, which most contact-page visitors will not have read.

The membership logos in the footer are technically there but carry no weight in this context. A footer logo is furniture; a stat above the form is an argument.

### F4 — "What We Deliver" CTAs lose context at handoff

The service page CTAs are well-written: "Discuss a board level hire," "Discuss a senior leadership hire," "Discuss a contract or interim hire." Each sets a specific intent. But when the visitor clicks through, they land on a generic form with an empty Subject field. The context they arrived with is gone. They must re-establish it in free text.

This is a meaningful drop-off point. The intention is clear on the service page; the form does not honour it.

### F5 — Candidates have no structured capture mechanism

The Talent page says "let's talk" and links to the generic contact form. There is no "register your interest" or "join the talent network" option. A passive candidate — open to the right opportunity but not actively applying — has nowhere to leave a structured record. Their visit converts to nothing.

This is a pipeline-building gap, not just a UX issue. Structured candidate capture at the Talent page would feed the network FPZ already maintains manually.

---

## Top 5 Recommendations

### Recommendation 1 — Add enquiry type to contact form as a required dropdown

**Priority:** Critical
**Effort:** Requires WordPress CMS access (Contact Form 7 or Gravity Forms field edit)
**Impact (directional):** Higher lead quality, faster triage, enables personalised auto-response

Replace the optional free-text Subject field with a required dropdown:

- "I'm looking to make a hire"
- "I'm a candidate exploring opportunities"
- "Something else"

This one change enables: segmented follow-up sequences, lead scoring by type, auto-response personalisation ("Thanks for getting in touch about your search..." vs "Thanks for registering your interest..."), and inbox triage without manual guessing. Every submission benefits.

Do not add more options. Three is enough. More creates decision paralysis.

### Recommendation 2 — Add response commitment copy to the contact page

**Priority:** High
**Effort:** Copy-only — text edit in WordPress, no structural change
**Impact (directional):** Reduced post-submit anxiety, fewer abandoned mid-fill

Add directly below the submit button:

> "We typically respond within one working day. If your search is time-sensitive, call us directly: UK +44 1925 320 960 | US +1 315-753-0155."

This copy does three things: it sets expectations, it signals attentiveness, and it gives the impatient buyer an immediate alternative. The phone numbers are already on the page — this placement makes them functional rather than decorative.

### Recommendation 3 — Add inline trust signals above the contact form

**Priority:** High
**Effort:** Requires WordPress CMS access (content placement on contact page)
**Impact (directional):** Higher completion rate on first visit, reduced abandonment at point of commitment

Add a three-stat trust bar directly above the form, before the name field:

> **89% of clients return for subsequent hires** · **89% of placed candidates still in role after 18 months** · **Established 2019**

These are the same metrics from the homepage CRO recommendations. On the contact page, they serve a different function: they convert a visitor who is mid-decision into a submitter. The argument they need at this point is not "why FPZ" (they already navigated here) but "is this safe to do." Proof metrics answer that question.

Keep the bar visual and brief — three items maximum, numbers in bold. Do not repeat the full About page stat block.

### Recommendation 4 — Pre-populate the Subject field from "What We Deliver" CTAs

**Priority:** Medium-High
**Effort:** Requires WordPress/plugin configuration — URL parameter or hidden field mapping
**Impact (directional):** Maintained conversion intent between service page and form, reduced drop-off at handoff

When a visitor clicks "Discuss a board level hire" on the What We Deliver page, the contact form Subject (or the new enquiry type dropdown from Recommendation 1) should arrive pre-filled with the relevant selection.

Implementation options:
- **URL parameter approach:** Link to `/contact-us/?subject=board-level-hire`. If the form plugin (Contact Form 7 or Gravity Forms) supports pre-population via URL query string, this is low-effort.
- **Hidden field approach:** Pass a hidden field value from the referrer page.

This does not require duplicate pages. It requires a form configuration change and updated link URLs on the service page. If the current plugin does not support pre-population, flag this as a plugin upgrade or workaround decision for the Engineer.

### Recommendation 5 — Add a candidate registration form to the Talent page

**Priority:** Medium-High
**Effort:** Requires WordPress CMS access — new form element on Talent page
**Impact (directional):** Passive candidate conversion, structured talent network CRM feed

Replace or supplement the "let's talk" link on the Talent page with an inline "Register your interest" form containing:

- Full name (required)
- Current job title (required)
- Specialisation — dropdown: VFX / Virtual Production / AI/ML in Production / Spatial Computing / Creative Direction / Other (required)
- LinkedIn profile URL (optional but strongly nudged via placeholder text)
- "I am..." — radio: Actively exploring / Open to the right opportunity / Just keeping an eye on the market

Submit button copy: **"Register with FPZ"**

This turns the Talent page from a passive read into an active conversion. A candidate who self-classifies as "open to the right opportunity" is exactly the profile FPZ maintains for retained search assignments. This form should feed directly into the CRM rather than landing in the generic enquiry inbox — flag for Engineer to configure the form integration separately from the contact form pipeline.

---

## Implementation Notes

| Recommendation | CMS Required | Plugin Config | Copy Only | Effort |
|---|---|---|---|---|
| 1. Enquiry type dropdown | Yes | Yes | No | Medium |
| 2. Response commitment copy | Yes | No | Yes | Low |
| 3. Trust signals above form | Yes | No | Partial | Low |
| 4. Subject pre-population | Yes | Yes | No | Medium |
| 5. Candidate registration form | Yes | Yes | No | High |

All five require WordPress access. Recommendations 2 and 3 are the fastest wins once access is available — both are under 30 minutes of CMS time.

---

## Priority Summary

| # | Recommendation | Audience | Impact (directional) | Effort |
|---|---|---|---|---|
| 1 | Enquiry type dropdown on contact form | Both | Highest — affects every submission | Medium |
| 2 | Response commitment copy | Both | High — zero-cost trust fix | Low |
| 3 | Trust signals above form | Client primary | High — addresses peak scepticism moment | Low |
| 4 | Pre-populate Subject from service CTAs | Client | Medium-High — reduces intent drop-off | Medium |
| 5 | Candidate registration form on Talent page | Candidate | Medium-High — pipeline conversion | High |
