---
name: contentfpz
description: FourPointZero content session. Routes to the right marketing skill based on what you're working on. Adapts as the work evolves.
---

## Setup
1. Read `.agents/product-marketing-context.md` for FPZ positioning, audience, and voice
2. Ask: "What are you working on?" if not already clear from context

## How This Works

This is a content session, not a fixed workflow. Stay in the session and adapt as the work evolves.

Based on what the user is doing RIGHT NOW, invoke the appropriate skill:

**LinkedIn (auto-select the right layer):**
- Writing a specific post → `linkedin-post-writer`
- Deciding what to post today/this week, what's working, algorithm tactics → `linkedin-content-strategy`
- Setting up LinkedIn from scratch, resetting strategy, building a 90-day plan → `linkedin-authority-builder` (then hand off to content-strategy for ongoing use)
- Auditing or rewriting LinkedIn profile → `linkedin-profile-optimizer`
- Never run authority-builder AND content-strategy together. Authority-builder is the one-time setup. Content-strategy is the ongoing operating manual.

**Creating something new:**
- Writing a post for X/Twitter → `tweet-draft-reviewer`
- Writing a post for other platforms → `social-content`
- Writing an email → `cold-email` (outreach) or `cold-outreach-sequence` or `email-sequence` (automated flows)
- Writing web/landing page copy → `copywriting`
- Writing a blog post → `claude-blog:blog-write`
- Writing a newsletter → `newsletter-creation-curation`
- Creating a case study → `case-study-builder`
- Creating a pitch deck or one-pager → `sales-enablement`
- Creating ad copy → `ad-creative`
- Creating social card visuals → `social-card-gen`
- Collecting/writing testimonials → `testimonial-collector`

**Improving something:**
- Polishing/editing existing copy → `copy-editing`
- Stripping AI signals from text → `de-ai-ify` or `humanizer`
- Optimising a page for conversions → `page-cro`
- Auditing homepage → `homepage-audit`
- Improving SEO → `seo-audit` or `ai-seo`
- AI discoverability audit → `ai-discoverability-audit`
- Rewriting a blog post → `claude-blog:blog-rewrite`

**Thinking/planning:**
- Content ideas → `content-idea-generator`
- What content to create → `content-strategy`
- Marketing ideas → `marketing-ideas`
- Positioning fundamentals → `positioning-basics` or `anthropic-skills:marketing-strategy-pmm`
- Marketing principles → `marketing-principles`
- Understanding the audience → `customer-research`
- Reddit audience insights → `reddit-insights`
- Extracting brand voice from existing content → `voice-extractor`
- Pricing or packaging → `pricing-strategy`
- Launch planning → `launch-strategy`
- Psychology/persuasion angle → `marketing-psychology`
- Meeting prep for a prospect → `meeting-prep`

**Research & intelligence:**
- Summarise a YouTube video → `youtube-summarizer`
- Last 30 days activity review → `last30days`
- Daily briefing → `daily-briefing-builder`

**Repurposing:**
- Turn a blog post into social/email/video → `claude-blog:blog-repurpose`
- Adapt content for a different platform → `social-content`

## Rules

- When the user changes direction mid-session, switch to the right skill. Don't force the previous path.
- If the user says something vague like "make it better", use `copy-editing` on whatever was last produced.
- If unsure which skill fits, ask one short question to clarify. Don't guess.
- Run `humanizer` on any finished content before saving. Don't run it on drafts mid-flow.
- Save finished work to `the-vault/` with a descriptive filename.
- When saving, confirm the filename with the user first.
