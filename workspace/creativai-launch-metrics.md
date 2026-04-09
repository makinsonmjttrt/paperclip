# CreativAI Launch Metrics

---

## PART A: How to Read Vercel Analytics on Launch Day

**For launch day: Friday 17 April 2026**
*Produced by: UX Researcher (FOU-541)*

This guide is step-by-step. Follow it in order. You do not need to know analytics to use it.

---

### Step 1: Open Vercel Analytics

1. Go to [dashboard.vercel.com](https://dashboard.vercel.com) in your browser
2. Sign in (use the account that owns the adhd-ef-system project)
3. In the project list, click **adhd-ef-system** (or the relevant project name)
4. In the top navigation bar, click **Analytics**

You are now on the Analytics dashboard for the site. By default it shows the last 24 hours.

---

### Step 2: Filter to the /creativai page

The Analytics tab shows the whole site by default. You want just the CreativAI page.

1. Look for the **Pages** section or a filter/path input near the top of the dashboard
2. Click the path filter and type `/creativai`
3. The dashboard will update to show data for that page only

If you cannot filter by page, scroll down to the **Top Pages** table — you will see `/creativai` listed there with its own row. The numbers in that row are what matter.

---

### Step 3: The four numbers that matter

Once you are viewing /creativai data, focus on these four metrics:

| Metric | What it means | Where to find it |
|--------|--------------|-----------------|
| **Page Views** | Total number of times the page was loaded (includes repeat visits) | Top of the dashboard — large number |
| **Unique Visitors** | Number of distinct people who visited | Below or beside page views |
| **Top Referrers** | Where visitors came from (e.g. LinkedIn, direct, Google) | Scroll down to "Referrers" or "Sources" section |
| **Bounce Rate** | % of visitors who left without clicking anything | In the engagement metrics section (not always shown on Vercel free tier) |

**On launch day, unique visitors is the number to watch.** Page views is always higher because one person can load the page multiple times.

---

### Step 4: View custom CTA events

The CreativAI page has two custom tracking events built in. These fire when visitors click the call-to-action buttons.

The two events are:
- `cta_employer_click` — fired when someone clicks the employer/client CTA
- `cta_candidate_click` — fired when someone clicks the candidate CTA

**How to find them:**

1. In the Vercel Analytics dashboard, look for an **Events** tab or **Custom Events** section in the left sidebar or top navigation
2. Click **Events**
3. You will see a list of event names. Look for `cta_employer_click` and `cta_candidate_click`
4. Click either event name to see how many times it was triggered

**What to read:**
- The count next to each event = number of button clicks
- If `cta_employer_click` shows 5 and unique visitors shows 50, that is a 10% click rate on the employer CTA
- These numbers tell you whether people are engaging beyond just loading the page

**Note:** Custom events require the Vercel Analytics integration to be fully active. If you see no events listed, check the Events tab exists. If it does not, the events may not be reporting yet — flag to the engineering team.

---

### Step 5: What a good day-1 result looks like

These are directional benchmarks, not invented targets. They are based on typical B2B niche landing page performance for a new page with a LinkedIn-driven launch.

| Metric | Minimum viable | Strong result | What it tells you |
|--------|---------------|--------------|------------------|
| Unique visitors (D-0) | 30+ | 100+ | LinkedIn posts are driving traffic |
| CTA clicks (either button) | 3+ total | 15+ total | Visitors are reading and engaging, not just bouncing |
| Top referrer | LinkedIn | LinkedIn | Confirms the launch channel is working |
| Employer vs candidate CTA split | Any clicks | Roughly 50/50 or employer-weighted | Tells you which audience showed up |

**If you see fewer than 30 unique visitors on launch day:** Check that you have posted the LinkedIn announcement and included a link to the page. Traffic will not arrive without a direct link in the post.

**If you see visitors but zero CTA clicks:** The page loaded but the CTAs are not compelling enough, or visitors are not scrolling far enough to see them. Note for the D+7 review.

---

### Step 6: Share your metrics with the team

The simplest way to share:

1. Take a screenshot of the Analytics dashboard showing unique visitors and the CTA events
2. Share in the team Slack/WhatsApp with the caption: "CreativAI launch day — [X] unique visitors, [Y] CTA clicks"
3. If you want to share a live link: in the Vercel dashboard, look for a **Share** button near the top right of the Analytics view. This generates a read-only link others can view.

For the D+7 formal review, record the numbers in the table in Part B below.

---

*UX Researcher. FOU-541. 9 April 2026.*

---

---

## PART B: Launch Success Metrics
## D+7 through D+30 Framework

**Produced by:** CMO ([FOU-300](/FOU/issues/FOU-300))
**Launch date:** Friday 17 April 2026 (D-0)
**Review dates:** D+7 (24 Apr) · D+14 (1 May) · D+30 (17 May)

---

## How to Use This

Check against each metric at D+7, D+14, and D+30. Record actuals in the `Actual` column of each table. If a metric is significantly below target at D+7, route back to CMO for assessment before D+14.

Measurement is manual unless otherwise noted. Budget approximately 20–30 minutes per review cycle.

---

## 1. Awareness Metrics (LinkedIn)

| Metric | Baseline | D+7 Target | D+30 Target | How to Measure |
|--------|----------|-----------|-------------|----------------|
| D-7 teaser post impressions | Unknown — check LinkedIn analytics before D-7 post | 1,000+ impressions | n/a | LinkedIn creator analytics → Posts tab |
| D-7 teaser post engagement rate | Unknown — check pre-launch average | 3%+ (reactions + comments ÷ impressions) | n/a | LinkedIn creator analytics |
| D-0 announcement post impressions | n/a | 2,000+ impressions | n/a | LinkedIn creator analytics → Posts tab |
| D-0 announcement post engagement | n/a | 50+ reactions + comments | n/a | LinkedIn creator analytics |
| D+3 follow-up post impressions | n/a | 1,000+ impressions | n/a | LinkedIn creator analytics |
| D+3 follow-up engagement rate | n/a | 3%+ | n/a | LinkedIn creator analytics |
| D+7 post impressions | n/a | 800+ impressions | n/a | LinkedIn creator analytics |
| LinkedIn profile views (launch week) | Check 30-day average in LinkedIn analytics before D-0 | 3× pre-launch weekly average | n/a | LinkedIn creator analytics → Profile views |

**Notes:**
- Pull baseline profile view data from LinkedIn analytics in the 7 days before D-7. Record the number before the teaser posts.
- Engagement rate = (reactions + comments + reposts) ÷ impressions × 100. LinkedIn does not auto-calculate this — divide manually.
- A comment from a relevant contact (studio, agency, creative SaaS CEO) is worth noting separately. These are pipeline signals, not just engagement stats.

---

## 2. Website Metrics

| Metric | Baseline | D+7 Target | D+30 Target | How to Measure |
|--------|----------|-----------|-------------|----------------|
| /creativai page unique visits (D-0 to D+7) | 0 (new page) | 100+ unique visits | 300+ cumulative | Vercel analytics or Google Analytics |
| /creativai page visit-to-enquiry rate | n/a | Track only (no target D+7) | 2%+ | Contact form completions ÷ unique visits |
| Homepage sessions uplift (launch week) | Check 30-day average before D-0 | 20%+ uplift week of launch | n/a | Google Analytics |

**Notes:**
- If Google Analytics is not set up on the CreativAI page, Vercel analytics will give unique visit counts but not behavioural data. Confirm tracking is live before D-0.
- Contact form completions are the clearest signal of conversion intent from page visitors. If the page has no form, track any email enquiries that reference "CreativAI" or the page URL.

---

## 3. Newsletter Metrics

| Metric | Baseline | D+7 Target | D+30 Target | How to Measure |
|--------|----------|-----------|-------------|----------------|
| D-3 warm-up email open rate | Check last 3 campaign averages before sending | 35%+ | n/a | Email platform (Mailchimp or equivalent) |
| D-3 email click-through to /creativai | n/a | 10%+ click rate | n/a | Email platform UTM tracking |
| Newsletter subscriber count | Check platform before D-3 send | Track only (no target D+7) | +10% vs pre-launch baseline | Email platform subscriber dashboard |
| Replies to D-3 email referencing a brief | 0 | 1+ reply | 3+ replies cumulative | Martyn's inbox — manual count |

**Notes:**
- A 35% open rate is directionally realistic for a warm subscriber list with a relevant subject line. If your current average is lower, set the target at current average + 5pp rather than using the 35% figure.
- "Replies referencing a brief" means a subscriber who responds to the D-3 email indicating they have a relevant mandate or know someone who does. These are the highest-value responses and should be logged in the BD pipeline immediately.

---

## 4. BD Pipeline Metrics

| Metric | Baseline | D+7 Target | D+30 Target | How to Measure |
|--------|----------|-----------|-------------|----------------|
| Batch 1 LinkedIn connection acceptance rate | 0/5 sent | 3/5 accepted | 4/5 accepted | Martyn's LinkedIn → Connections |
| Batch 1 first message response rate | 0 sent | 1/5 positive response | 2/5 positive responses | Martyn's LinkedIn inbox — manual |
| Batch 2 LinkedIn connection acceptance rate | 0/5 sent | 2/5 accepted | 3/5 accepted | Martyn's LinkedIn → Connections |
| Batch 2 first message response rate | 0 sent | 1/5 positive response | 2/5 positive responses | Martyn's LinkedIn inbox — manual |
| BD discovery calls booked via CreativAI mention | 0 | 1 call booked | 3 calls booked | BD pipeline tracker — manual |
| New inbound enquiries referencing CreativAI | 0 | Track only (no target D+7) | 2+ inbound enquiries | Martyn's inbox + LinkedIn DMs |

**Notes:**
- "Positive response" means any reply that opens a dialogue — question, request for more information, or agreement to a call. Not just acceptance of a connection request.
- A 1/5 response rate on cold BD outreach within 7 days is a reasonable first-week target. Longer sequences (follow-up 1 at Day 7, follow-up 2 at Day 14) will yield additional responses beyond the D+7 window.
- Record all BD interactions in `workspace/bd-pipeline.md` as they happen. Do not rely on memory for the D+7 review.

---

## 5. Leading Indicators (Week 1–2)

These are early signals to watch between D-0 and D+14. They do not have hard targets but should be tracked and noted at each review cycle.

| Indicator | What to Watch | Where to Find It |
|-----------|--------------|-----------------|
| LinkedIn connection requests received (from target profile) | Inbound requests from studio, agency, or creative SaaS leaders in the week of launch | LinkedIn notifications |
| DM responses referencing CreativAI by name | Any cold or warm DM that mentions "CreativAI" specifically | LinkedIn DMs |
| Profile follows from new sectors | Inbound follows from contacts outside current network (e.g. post-production executives, broadcast leaders) | LinkedIn creator analytics → Followers |
| Third-party mentions or reshares of launch post | Any repost, quote post, or comment that amplifies the announcement | LinkedIn notifications |
| Email enquiries from new contacts | Any inbound email from someone not previously in the FPZ database | Martyn's inbox |

---

## 6. D+7 Review Checklist

Run this on **Monday 24 April 2026** (estimated 20–30 minutes):

1. Open LinkedIn creator analytics. Record impressions and engagement for D-7 teaser, D-0 announcement, and D+3 follow-up posts.
2. Check LinkedIn profile views for the week of 17–24 April. Compare to pre-launch baseline.
3. Open Vercel or Google Analytics. Record unique visits to /creativai from D-0 to D+7.
4. Open email platform. Record open rate and click-through rate for the D-3 warm-up email.
5. Check LinkedIn for Batch 1 and Batch 2 connection acceptance rates. Note any replies to first messages.
6. Check inbox and LinkedIn DMs for inbound enquiries or CreativAI mentions. Log any in `workspace/bd-pipeline.md`.
7. Update actuals in this document.
8. If any metric is significantly below target, comment on [FOU-300](/FOU/issues/FOU-300) with actuals for CMO review.

---

## 7. D+30 Review Checklist

Run this on **Sunday 17 May 2026** (estimated 45–60 minutes):

1. Repeat D+7 steps 1–6 for cumulative totals.
2. Count total BD discovery calls booked that referenced CreativAI in the conversation.
3. Count total inbound enquiries received since D-0.
4. Compare newsletter subscriber count to pre-launch baseline.
5. Assess /creativai page cumulative unique visits and any contact form completions.
6. Produce a brief summary (5–6 bullets) for CMO review: what worked, what underperformed, what to do differently for the next phase.

---

## What Counts as Success

**Minimum viable launch (D+30):**
- 100+ unique visits to /creativai page
- 1 BD discovery call booked from CreativAI-attributed outreach
- 35%+ newsletter open rate on D-3 email
- 3+ BD outreach responses (across Batch 1 and 2)

**Strong launch (D+30):**
- 300+ unique visits to /creativai page
- 3+ BD discovery calls booked
- 2+ inbound enquiries from new contacts
- Batch 1 acceptance rate 4/5 or better

**The real measure at D+30** is not impressions — it is whether the CreativAI launch generated at least one new BD conversation that would not have happened without it. That is the pipeline signal that justifies the practice as a distinct offering.

---

*CMO. FOU-300. 5 April 2026.*

---

## Post-Launch Review Template

Use this at each review date. Fill in the Actual column. Takes 20–30 min at D+7 and D+14, 45–60 min at D+30.

---

### D+7 Review — Monday 24 April 2026

| Area | What to Measure | How to Check | Good Result | If Below Target |
|------|----------------|--------------|-------------|-----------------|
| LinkedIn announcement post | Impressions on D-0 post | LinkedIn creator analytics → Posts | 2,000+ impressions | Re-share post with added commentary to restart algorithm reach |
| LinkedIn engagement | Reactions + comments on D-0 post | LinkedIn creator analytics | 50+ | Check who commented — DM anyone from a target studio or agency; personal follow-up converts better than more posts |
| LinkedIn profile views | Views in the 7-day window 17–24 Apr | LinkedIn creator analytics → Profile views | 3× pre-launch weekly average | No action needed D+7 — flag for D+14 review if still flat |
| Website | Unique visits to /creativai (D-0 to D+7) | Vercel analytics or Google Analytics | 100+ unique visits | Confirm tracking is firing; share the /creativai URL in a follow-up LinkedIn post |
| Newsletter | D-3 warm-up email open rate | Email platform dashboard | 35%+ (or current avg + 5pp) | Subject line was likely the issue — note for D+14 send; resend to non-openers with revised subject |
| BD outreach | Batch 1 + Batch 2 connection acceptances | LinkedIn → My Network → Sent | 5 of 10 accepted | Send a short note to each pending connection; some requests need a nudge |
| BD outreach | Any first-message replies (positive or neutral) | LinkedIn DMs | 1+ reply | Chase non-responders on Day 10 with follow-up message from `workspace/bd-pipeline-batch2-sequences-edited.md` |
| Inbound | New enquiries referencing CreativAI | LinkedIn DMs + inbox | Track only — log in `workspace/bd-pipeline.md` | n/a (no target D+7) |

**D+7 Decision Gate:** If LinkedIn impressions and BD acceptance are both below target, pause Batch 3 outreach and comment on FOU-331 for CMO review before proceeding.

---

### D+14 Review — Friday 1 May 2026

| Area | What to Measure | How to Check | Good Result | If Below Target |
|------|----------------|--------------|-------------|-----------------|
| Pipeline | Discovery calls booked where CreativAI was mentioned | BD pipeline tracker (`workspace/bd-pipeline.md`) | 1 call booked | Review sequence timing — follow-up 2 should now be sending; check if messages went out |
| Pipeline | BD replies received (cumulative D-0 to D+14) | LinkedIn DMs + email inbox | 2+ positive replies | Personalise follow-up 2 for non-responders; reference a specific project or hire challenge relevant to them |
| LinkedIn | Cumulative impressions across all launch-related posts | LinkedIn creator analytics → Posts (sum all) | 5,000+ combined impressions | Post a D+14 insight piece — "what we've learned about AI hiring in the first week" — to extend the launch narrative |
| Website | /creativai cumulative unique visits (D-0 to D+14) | Vercel or GA | 200+ | Run a LinkedIn post with a direct link to the page and a specific prompt to visit |
| Newsletter | New subscriber additions since D-0 | Email platform subscriber count | +5% vs pre-launch baseline | n/a if no CTA to subscribe was in the launch sequence — flag for D+30 plan |
| Inbound | New enquiries received since D-0 | LinkedIn DMs + inbox | 1+ inbound enquiry from a new contact | No action — keep publishing; inbound builds over 30–60 days, not 14 |

**D+14 Decision Gate:** If no discovery call is booked and pipeline replies are under 2, consider a direct targeted DM to the 2–3 highest-priority Batch 1 contacts with a specific mandate reference rather than a standard sequence message.

---

### D+30 Review — Sunday 17 May 2026

| Area | What to Measure | How to Check | Good Result | What to Do |
|------|----------------|--------------|-------------|------------|
| Pipeline | Discovery calls booked from CreativAI-attributed conversations | BD pipeline tracker | 3+ calls booked | Log each in pipeline and classify as warm/active |
| Pipeline | Inbound enquiries from new contacts since D-0 | LinkedIn DMs + inbox | 2+ | These are the highest-signal result of the launch — qualify and route to discovery call |
| Website | /creativai cumulative unique visits (D-0 to D+30) | Vercel or GA | 300+ | If 100–299, plan a second-wave content push for May |
| Website | Contact form submissions or enquiry emails from /creativai | Contact form + email inbox | Track only (no hard target) | Any submission = strong intent signal; respond within 24 hrs |
| LinkedIn | Total followers added in the 30-day launch period | LinkedIn creator analytics → Followers → Growth | +50 net followers | If flat: follower growth is a trailing metric — pipeline matters more |
| Newsletter | Subscriber count vs pre-launch baseline | Email platform | +10% | If flat: add a visible subscribe CTA to the /creativai page |
| Content | Which post performed best by impressions | LinkedIn creator analytics → Posts → sort by impressions | The D-0 announcement or D+3 follow-up | Best-performing angle informs next 4 weeks of content |

**D+30 Strategic Assessment:**

After filling in the table above, answer these five questions and share with CMO:

1. Did the launch generate at least one BD conversation that would not have happened without it? (Yes / No)
2. Which channel drove the most tangible response — LinkedIn posts, BD outreach sequences, or newsletter?
3. What was the one piece of content or message that resonated most?
4. What underperformed against expectation, and what was the likely reason?
5. What is the single highest-leverage action to take in the next 30 days based on what you now know?

---

*CMO. FOU-331. 7 April 2026.*
