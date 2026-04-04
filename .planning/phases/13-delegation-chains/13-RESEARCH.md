# Phase 13: Delegation Chains - Research

**Researched:** 2026-04-04
**Domain:** Instruction-enforced org hierarchy and brief passthrough within Paperclip
**Confidence:** HIGH

## Summary

Phase 13 fixes a real inconsistency in the current agent configuration: despite the org chart showing CMO and CTO as stream heads, most of their reports still say "You report to the CEO" in their AGENTS.md files, and the CEO's routing table lists every agent directly. This means the CEO is doing department-head-level routing instead of delegating through the hierarchy.

The fix is purely instructional -- no new files, no new directories. It is a targeted edit pass across 9 agent files (5 AGENTS.md files updating reporting lines, 2 AGENTS.md files adding delegation sections, and 2 HEARTBEAT.md files updating routing tables). The CEO stops routing to individual contributors and instead routes to CMO or CTO. CMO and CTO gain explicit sub-delegation authority over their reports, with review and override rights. Original briefs pass unchanged via the `parentId` link on sub-issues, which is already enforced by Paperclip.

**Primary recommendation:** Two plans. Plan 01 fixes reporting lines and CEO routing. Plan 02 adds department head delegation authority and review/override mechanisms to CMO and CTO.

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DELG-01 | CMO can assign work directly to Technical Writer, Customer Success, UX Researcher, LinkedIn Growth Director | Requires CMO AGENTS.md to gain an explicit "Your Direct Reports" section, and the 4 reports to update their reporting line from CEO to CMO. CMO HEARTBEAT.md already has a "FPZ Content Production Oversight" section that references these agents -- it needs delegation authority language added. |
| DELG-02 | CTO can assign work directly to Software Engineer, Code Reviewer, Product Owner | CTO AGENTS.md already has a "Team Structure" section naming these reports and a "Work Routing" table. Engineer and Code Reviewer already say "You report to the CTO." Product Owner says "You report to the CEO" -- this needs correcting to CTO (or cross-stream, see Open Question 1). |
| DELG-03 | Department heads can review and override output from their reports | CMO and CTO need explicit override authority language in their AGENTS.md. The stall detection sections in their HEARTBEAT.md already grant reassignment authority -- this extends to quality review and output rejection. |
| DELG-04 | CEO delegates to department heads only (no longer routing to individual directors) | CEO HEARTBEAT.md "Org Chart Routing Table" must be replaced with a two-row table: CMO for all business work, CTO for all tech work. CEO AGENTS.md "Work Routing" table must match. The existing "Phase 13 Preparation" placeholder in CEO HEARTBEAT.md confirms this change is anticipated. |
| DELG-05 | Original brief passthrough enforced (max 3 hops before delivery) | Paperclip's `parentId` field on sub-issues preserves the chain. The instruction layer needs explicit "include original brief" rules in dept head HEARTBEAT.md delegation steps, plus a 3-hop limit stated as a rule. |

</phase_requirements>

## Standard Stack

### Core

No new libraries or tools. All changes are edits to existing AGENTS.md and HEARTBEAT.md files.

| Component | Purpose | Why Standard |
|-----------|---------|--------------|
| AGENTS.md `## Direct Reports` section | Declares who each dept head manages | Matches existing patterns -- AGENTS.md already has `## Company Structure`, `## Work Routing`, `## Team Structure` sections that define relationships |
| HEARTBEAT.md `## Delegation` step | Instructs dept head HOW to sub-delegate | Existing pattern: CEO HEARTBEAT.md step 6 is already `## 6. Delegation`. Same step number/pattern for CMO and CTO. |
| Paperclip `parentId` on sub-issues | Links delegated issue back to parent brief | Already used by CEO in step 6 (`POST /api/companies/{companyId}/issues` with `parentId`). No new API calls needed. |
| `[BRIEF-PASSTHROUGH]` comment tag | Confirms original brief is included when sub-delegating | Extends existing comment tag convention (`[ROUTING]`, `[STALL]`, `[SCOPE]`). Consistent with project tag style. |

### What NOT to Add

| Do Not Build | Why |
|--------------|-----|
| New approval workflow files | Phase 14 handles cross-dept approval. Phase 13 is intra-stream only. |
| New label types for delegation | Label conventions are Phase 14 (EVNT-01). Phase 13 uses existing labels. |
| Automated brief validation | No runtime enforcement exists in Paperclip. Advisory instructions only. |
| Separate delegation log files | CEO MEMORY.md already captures heartbeat state. Dept head MEMORY.md does the same. No new files needed. |

## Architecture Patterns

### Org Hierarchy After Phase 13

```
CEO
├── CMO (business stream head)
│   ├── Technical Writer     [was: CEO, now: CMO]
│   ├── Customer Success     [was: CEO, now: CMO]
│   ├── UX Researcher        [was: CEO, now: CMO]
│   └── LinkedIn Growth Director  [was: ambiguous CEO+CMO, now: CMO]
├── CTO (tech stream head)
│   ├── Software Engineer    [already correct]
│   ├── Code Reviewer        [already correct]
│   └── Product Owner        [was: CEO, needs resolution -- see Open Questions]
```

**What changes vs current state:**

| Agent | Current "Reports To" | After Phase 13 |
|-------|---------------------|----------------|
| Technical Writer | CEO | CMO |
| Customer Success | CEO | CMO |
| UX Researcher | CEO | CMO |
| LinkedIn Growth Director | CEO (+ CMO stream note) | CMO |
| Product Owner | CEO | See Open Question 1 |
| Software Engineer | CTO | CTO (no change) |
| Code Reviewer | CTO | CTO (no change) |
| CEO routing | All agents directly | CMO + CTO only |

### Pattern 1: CEO Routes to Stream Heads Only

**What:** CEO routing tables in AGENTS.md and HEARTBEAT.md are simplified from 9-row tables to 2-row tables. Business work goes to CMO. Tech work goes to CTO. Ambiguous work goes to Product Owner (cross-stream).

**Current state (CEO HEARTBEAT.md "Org Chart Routing Table"):** 9 rows, routing directly to each agent by ID.

**After Phase 13:**
```markdown
### Org Chart Routing Table (v2.0 -- Phase 13)
| Work Type | Route To | Agent ID |
|-----------|----------|----------|
| All business stream work | CMO | 293ac1cb |
| All tech stream work | CTO | 9f63e8ed |
| Cross-stream / backlog / prioritisation | Product Owner | f74c5796 |

**Rule:** CEO never assigns directly to Technical Writer, Customer Success,
UX Researcher, LinkedIn Growth Director, Software Engineer, or Code Reviewer.
If work arrives addressed to those agents, reassign to the stream head
(CMO or CTO) and comment: [ROUTING] Escalated to stream head for delegation.
```

**The Phase 13 Preparation placeholder** in CEO HEARTBEAT.md (lines 86-90) already documents this change is coming. The plan simply executes that placeholder.

### Pattern 2: Department Head Delegation Step

**What:** CMO and CTO HEARTBEAT.md get a new `## 4. Delegation` step (before their current handover step) that mirrors CEO's existing step 6 but scoped to their stream.

**Template for CMO:**
```markdown
## 4. Delegation

When you receive a strategy issue that requires production work from your reports:

1. Create a sub-issue: `POST /api/companies/{companyId}/issues`
   - Set `parentId` to the current issue ID
   - Set `goalId` to the current issue's goalId (if set)
   - Set `assigneeAgentId` to the correct report (see Direct Reports table)
   - Paste the original brief verbatim in the sub-issue description
   - Add: `[BRIEF-PASSTHROUGH] Original brief from issue #{parentId} included above.`
2. Comment on the parent issue: `[DELEGATED] Sub-issue #{newId} created for {agent name}. Brief passed through unchanged.`
3. Do NOT paraphrase or summarise the brief. Pass it through complete.
4. Maximum delegation depth from CEO original: 3 hops. If this issue is already
   a sub-sub-issue (depth 2), do the work yourself rather than creating another layer.

### Direct Reports (CMO)
| Work Type | Assign To | Agent ID |
|-----------|-----------|----------|
| Content production (blog, newsletter, social, email, ads) | Technical Writer | 3ff49ad0 |
| LinkedIn content, outreach, profile | LinkedIn Growth Director | df0e4280 |
| Competitive research, client proof, sales materials | Customer Success | 6003d629 |
| SEO, CRO, growth experiments, paid media | UX Researcher | c25043f9 |
```

**Template for CTO:**
```markdown
## 4. Delegation

When you receive a tech issue that requires implementation work from your reports:

1. Create a sub-issue: `POST /api/companies/{companyId}/issues`
   - Set `parentId` to the current issue ID
   - Set `goalId` to the current issue's goalId (if set)
   - Set `assigneeAgentId` to the correct report (see Direct Reports table)
   - Paste the original brief verbatim in the sub-issue description
   - Add: `[BRIEF-PASSTHROUGH] Original brief from issue #{parentId} included above.`
2. Comment on the parent issue: `[DELEGATED] Sub-issue #{newId} created for {agent name}. Brief passed through unchanged.`
3. Do NOT paraphrase or summarise the brief. Pass it through complete.
4. Maximum delegation depth from CEO original: 3 hops. If this issue is already
   a sub-sub-issue (depth 2), do the work yourself rather than creating another layer.

### Direct Reports (CTO)
| Work Type | Assign To | Agent ID |
|-----------|-----------|----------|
| Implementation, bug fixes, infrastructure, document generation | Software Engineer | 97307b6f |
| PR reviews, code quality | Code Reviewer | 8df70cb1 |
| Architecture decisions, tech standards | Handle yourself | - |
| Backlog grooming, cross-stream coordination | Product Owner | f74c5796 |
```

### Pattern 3: Original Brief Passthrough

**What "original brief passthrough" means concretely:**

When the CEO creates a brief (issue description), that exact text must appear in every downstream sub-issue without modification. No summarising, no paraphrasing, no "the CEO wants you to...".

**How Paperclip enforces the chain:** The `parentId` field on an issue creates a linked hierarchy. When a report opens their issue, they can look up the parent issue to read the full context. This is the structural enforcement.

**The instruction layer adds:** "Paste the original brief verbatim in the sub-issue description." This ensures agents don't need to follow parent links -- the brief is right there. The `[BRIEF-PASSTHROUGH]` tag confirms it was done.

**3-hop maximum explained:**
- Hop 1: CEO creates issue for CMO
- Hop 2: CMO creates sub-issue for Technical Writer
- Hop 3: Technical Writer is executing -- no further delegation

If work reaches hop 3 and the agent cannot do it, the correct response is to comment with a blocker, not create a hop 4. CMO or CTO should reassign to a different report.

### Pattern 4: Department Head Review and Override

**What:** CMO and CTO have authority to review work from their reports before it is marked done, and to request changes or reassign.

**Mechanism:** This is already partially in place via the stall detection sections in CMO and CTO HEARTBEAT.md. Both files contain `## Stall Detection (Your Reports)` sections that allow the dept head to comment, nudge, and reassign. Phase 13 extends this to quality review:

```markdown
## Review and Override

When a report marks work as `done` or `in_review`:

1. Check if the output meets the brief requirements before the issue closes.
2. If output is acceptable: comment `[APPROVED] Work meets brief. No changes needed.` and close the issue.
3. If output needs revision: comment `[REVISION-NEEDED] {specific feedback}` and move issue back to `in_progress`.
4. If you need to reassign: comment `[REASSIGN] Reassigning from {old agent} to {new agent}.
   Reason: {brief reason}.` and update the assignee.
5. Override authority: as stream head, you can override any decision made by your reports.
   When overriding, document the override in the issue comment with reason.
```

### Anti-Patterns to Avoid

- **CEO commenting on individual contributor issues:** After Phase 13, CEO should not be assigning or directing Technical Writer, Customer Success, UX Researcher, or LinkedIn Growth Director directly. If the CEO does this, it bypasses the CMO and undermines the hierarchy.
- **Brief rewriting at delegation:** "The CEO wants a blog post about X" is wrong. The sub-issue should contain the original brief from the CEO issue, word for word.
- **4-hop chains:** CEO -> CMO -> Technical Writer -> [no one]. Three hops is the maximum. If a 4th hop seems necessary, the phase 13 plan is not complex enough for those agents -- they need more skills.
- **CMO reviewing its own delegated work:** CMO should not create a sub-issue and then also do the review step itself. The stall detection section handles the review loop. Avoid circular review chains.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Brief version tracking | Custom diff/versioning system | `parentId` + verbatim paste | Paperclip already links parent-child. Verbatim paste means no version drift. |
| Delegation depth counter | Counter variable or file | Instruction-based hop limit | No runtime state possible. 3-hop rule is enforced by instruction, same as all other Paperclip rules. |
| Approval gates before sub-delegation | Approval workflow | Dept head review step in heartbeat | Phase 14 handles cross-dept approvals. Intra-stream delegation needs no formal gate. |
| Automated routing rules | Script to re-route issues | CEO instruction update to route via dept heads | Paperclip has no scripted routing. All routing is agent instruction. |

**Key insight:** Every delegation problem in this system reduces to "add the right instruction to the right HEARTBEAT.md." There is no runtime layer to manipulate.

## Common Pitfalls

### Pitfall 1: CEO Continues to Route to Individual Contributors

**What goes wrong:** CEO's chain-of-command muscle memory routes directly to Technical Writer (for content), LinkedIn Growth Director (for LinkedIn), etc. This bypasses CMO and means CMO has no visibility over the work.
**Why it happens:** The CEO's routing table currently has explicit agent IDs for all 9 agents. It is specific and easy to use. The new 2-row table requires a habit change.
**How to avoid:** The CEO HEARTBEAT.md "Org Chart Routing Table" must be replaced (not supplemented). Remove the old 9-row table entirely. Include an explicit rule: "CEO never assigns directly to Technical Writer, Customer Success, UX Researcher, LinkedIn Growth Director, Software Engineer, or Code Reviewer."
**Warning signs:** Issues appear in Technical Writer's queue with the CEO as the assigner, without a CMO sub-issue trail.

### Pitfall 2: LinkedIn Growth Director's Ambiguous Reporting Line

**What goes wrong:** LinkedIn Growth Director AGENTS.md says "You report to the CEO. You operate within the CMO's business stream." This creates ambiguity. The agent may accept direct CEO assignments even after Phase 13.
**Why it happens:** The agent was configured as a CEO-adjacent specialist with CMO stream membership as a secondary fact. The dual statement was intentional in v1.0 but creates a hole in Phase 13's hierarchy.
**How to avoid:** Change to "You report to the CMO. You operate within the CMO's business stream." Remove the CEO reference entirely from the reporting line. LinkedIn Growth Director should escalate to CMO, not CEO.
**Warning signs:** CEO routes LinkedIn issues directly to LinkedIn Growth Director.

### Pitfall 3: Department Heads Rewriting Briefs

**What goes wrong:** CMO receives a CEO brief about "producing a thought leadership article on AI hiring trends" and converts it into a sub-issue titled "Write 1,000 word article about AI hiring" with a completely different description. The original brief's context, tone, and strategic framing are lost.
**Why it happens:** Agents naturally summarise and reframe when delegating. This is useful in human orgs but breaks the chain in agent systems where downstream agents have no other context source.
**How to avoid:** Explicit instruction: "Paste the original brief verbatim in the sub-issue description. Do NOT paraphrase or summarise." The `[BRIEF-PASSTHROUGH]` tag creates accountability -- if it is missing, the brief may have been rewritten.
**Warning signs:** Sub-issue descriptions bear no resemblance to the parent issue text.

### Pitfall 4: Product Owner Reporting Line Conflict

**What goes wrong:** Product Owner currently says "You report to the CEO" and manages backlog across both streams. If Phase 13 moves Product Owner to report to CTO, it loses its cross-stream mandate. If it stays reporting to CEO, it is an exception to the delegation chain rule.
**Why it happens:** Product Owner is a genuinely cross-stream role. It does not fit cleanly under CMO or CTO.
**How to avoid:** Keep Product Owner reporting to CEO. It is a cross-stream executive function, similar to how the CEO views the whole company. Add explicit language: "You are cross-stream. You coordinate with CMO and CTO but report to the CEO for backlog priorities and cross-stream decisions."
**Warning signs:** CTO tries to sub-delegate Product Owner tasks as if PO is a tech stream report.

### Pitfall 5: Dept Head Review Loops Block Work

**What goes wrong:** CMO requires review before marking Technical Writer work as done. Technical Writer marks done, CMO requests revision, Technical Writer fixes, marks done again, CMO reviews again. This loop has no exit condition if the dept head keeps finding issues.
**Why it happens:** No clear acceptance criteria in the sub-issue. Dept head is reviewing against implicit standards.
**How to avoid:** When CMO creates the sub-issue, the brief must include explicit acceptance criteria. The review step checks against these, not against subjective quality. If criteria are met, CMO approves. If CMO keeps requesting revisions with no new criteria, that is an escalation to CEO.

## Code Examples

### CEO HEARTBEAT.md: Replacement Routing Table

```markdown
## Chain-of-Command Validation

Before delegating any issue, validate the routing matches the org chart:

### Org Chart Routing Table (v2.0)
| Work Type | Route To | Agent ID |
|-----------|----------|----------|
| All business stream work (content, LinkedIn, research, SEO, strategy) | CMO | 293ac1cb |
| All tech stream work (code, PRs, architecture, infrastructure) | CTO | 9f63e8ed |
| Cross-stream / backlog / roadmap prioritisation | Product Owner | f74c5796 |

**CEO routing rule:** Assign only to CMO, CTO, or Product Owner. NEVER assign directly
to Technical Writer, Customer Success, UX Researcher, LinkedIn Growth Director,
Software Engineer, or Code Reviewer. If an issue arrives addressed to one of those
agents, reassign to the stream head and comment:
`[ROUTING] Escalated to stream head {CMO/CTO} for sub-delegation. Work type: {type}.`

### Validation Steps
1. Read issue title, description, and labels
2. Match to stream: business labels -> CMO, tech labels -> CTO, mixed -> Product Owner
3. If already assigned to wrong agent: reassign to stream head, comment [ROUTING]
4. If ambiguous: assign to stream head and let them route

### Override Rules
- Priority `urgent` or label `override`: bypass validation, assign directly, comment noting override
- Board-requested assignment: always honour, skip validation
- Cross-stream issues: assign to Product Owner to coordinate split
```

### CEO AGENTS.md: Simplified Work Routing

```markdown
## Work Routing

When assigning work or delegating issues, route through stream heads:

| Work Type | Assign To | Never Assign Directly To |
|-----------|-----------|--------------------------|
| Any business stream work | CMO | Technical Writer, Customer Success, UX Researcher, LinkedIn Growth Director |
| Any tech stream work | CTO | Software Engineer, Code Reviewer |
| Cross-stream, backlog, prioritisation | Product Owner | (handles both streams) |

**Routing rules:**
- If unsure which stream, assign to Product Owner and let them route.
- CEO never assigns content production, LinkedIn work, research, SEO/CRO, code, or PR review directly.
- Exception: urgent/override label bypasses this rule. Always document the override.
```

### CMO AGENTS.md: Direct Reports Section

```markdown
## Direct Reports

You are the business stream head. You manage these agents directly:

| Agent | Role | When to Assign |
|-------|------|----------------|
| Technical Writer (3ff49ad0) | Content production, quality gate | Blog, newsletter, social, email, ads, humaniser pass |
| Customer Success (6003d629) | Research, competitive intel, client proof | Customer research, competitor analysis, case studies, sales materials |
| UX Researcher (c25043f9) | Growth, SEO, CRO | SEO audits, CRO audits, growth experiments, paid media |
| LinkedIn Growth Director (df0e4280) | LinkedIn channel | LinkedIn content, outreach, profile optimisation |

You receive work from the CEO only. You never receive work directly from reports
(except escalations or questions). If a report @-mentions you with a question,
respond on the issue. If a report has a blocker, unblock them or escalate to CEO.

You review and may override output from any of your reports. Document overrides
with reason.
```

### CTO AGENTS.md: Direct Reports Section

```markdown
## Direct Reports

You are the tech stream head. You manage these agents directly:

| Agent | Role | When to Assign |
|-------|------|----------------|
| Software Engineer (97307b6f) | Implementation, document generation | Code tasks, infrastructure, pdf/docx/xlsx/pptx |
| Code Reviewer (8df70cb1) | PR review, code quality | All PRs before merge |
| Product Owner (f74c5796) | Backlog, cross-stream coordination | Backlog grooming, sprint planning, issue routing |

You receive work from the CEO only. Product Owner is cross-stream -- coordinate
with them on priorities, but they also take direct assignments from the CEO on
backlog and cross-stream work.

You review and may override output from any of your reports. Document overrides
with reason.
```

### Brief Passthrough Comment Template

When sub-delegating, the delegating agent posts this on the parent issue:

```
[DELEGATED] Sub-issue #{newId} created for {agent name}.
Brief passed through unchanged. Original issue content included in sub-issue description.
```

And the sub-issue description begins:

```
[BRIEF-PASSTHROUGH] Original brief from issue #{parentId}:

---

{verbatim copy of original issue description}

---

**Delegation context:** Assigned by {dept head} for execution. No modifications made to brief.
```

## State of the Art

| Old Approach (v1.0 + Phase 12) | New Approach (Phase 13) | Impact |
|--------------------------------|-------------------------|--------|
| CEO routes directly to all 9 agents | CEO routes only to CMO, CTO, Product Owner | CEO workload reduced; CMO and CTO have genuine ownership |
| Technical Writer, Customer Success, UX Researcher, LinkedIn Growth Director all report to CEO | All 4 report to CMO | CMO has actual authority over business stream |
| No formal sub-delegation mechanism | CMO and CTO have delegation step in heartbeat with brief passthrough | Work flows through hierarchy with original brief intact |
| No department head review authority | CMO and CTO have explicit review and override rights | Department heads can enforce quality before work closes |
| Dept head stall detection only for stalled agents | Extended to review completed work before closing | Output quality controlled at dept head level |

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual validation via file inspection and grep commands |
| Config file | None (no automated test framework for agent instruction files) |
| Quick run command | `grep "You report to" ~/.paperclip/instances/default/companies/FourPointZero/agents/*/AGENTS.md` |
| Full suite command | Inspect all modified AGENTS.md and HEARTBEAT.md files for correct reporting lines, routing tables, and delegation sections |

### Phase Requirements to Test Map

| Req ID | Behaviour | Test Type | Automated Command | File Exists? |
|--------|-----------|-----------|-------------------|-------------|
| DELG-01 | Technical Writer, Customer Success, UX Researcher, LinkedIn Growth Director report to CMO | smoke | `grep "You report to" agents/technical-writer/AGENTS.md agents/customer-success/AGENTS.md agents/ux-researcher/AGENTS.md agents/linkedin-growth-director/AGENTS.md` (all should say CMO) | ✅ Files exist, content wrong |
| DELG-01 | CMO AGENTS.md has Direct Reports section listing all 4 business reports | smoke | `grep -c "Direct Reports" agents/cmo/AGENTS.md` (expect: 1) | ❌ Section missing |
| DELG-01 | CMO HEARTBEAT.md has Delegation step with brief passthrough instruction | smoke | `grep -c "BRIEF-PASSTHROUGH" agents/cmo/HEARTBEAT.md` (expect: 1) | ❌ Step missing |
| DELG-02 | CTO AGENTS.md has Direct Reports section listing Engineer, Code Reviewer, Product Owner | smoke | `grep -c "Direct Reports" agents/cto/AGENTS.md` (expect: 1) | ❌ Section missing |
| DELG-02 | CTO HEARTBEAT.md has Delegation step | smoke | `grep -c "BRIEF-PASSTHROUGH" agents/cto/HEARTBEAT.md` (expect: 1) | ❌ Step missing |
| DELG-03 | CMO HEARTBEAT.md has Review and Override section | smoke | `grep -c "Review and Override" agents/cmo/HEARTBEAT.md` (expect: 1) | ❌ Section missing |
| DELG-03 | CTO HEARTBEAT.md has Review and Override section | smoke | `grep -c "Review and Override" agents/cto/HEARTBEAT.md` (expect: 1) | ❌ Section missing |
| DELG-04 | CEO HEARTBEAT.md routing table routes to CMO and CTO only (not to individual contributors) | smoke | `grep "3ff49ad0\|df0e4280\|6003d629\|c25043f9\|97307b6f\|8df70cb1" agents/ceo/HEARTBEAT.md` (expect: 0 matches in routing table) | ❌ Old routing table still present |
| DELG-04 | CEO AGENTS.md work routing table routes to CMO and CTO only | smoke | `grep -c "CMO\|CTO\|Product Owner" agents/ceo/AGENTS.md` (expect: matches; no direct IC agent IDs in routing rows) | ✅ File exists, needs update |
| DELG-05 | CMO and CTO delegation steps include verbatim brief passthrough instruction | manual-only | Read CMO HEARTBEAT.md Delegation step; verify "[BRIEF-PASSTHROUGH]" and "verbatim" wording present | ❌ Step missing |
| DELG-05 | 3-hop limit stated in delegation instructions | manual-only | Read CMO and CTO HEARTBEAT.md Delegation step; verify "3 hops" or "Maximum delegation depth" present | ❌ Step missing |

### Sampling Rate

- **Per task commit:** `grep "You report to" ~/.paperclip/instances/default/companies/FourPointZero/agents/*/AGENTS.md`
- **Per wave merge:** Full inspection of CEO, CMO, CTO AGENTS.md + HEARTBEAT.md files for routing tables, delegation steps, review authority
- **Phase gate:** All smoke commands pass + manual review of brief passthrough instructions for correctness

### Wave 0 Gaps

- [ ] No new test files needed -- all validation is grep-based file inspection
- [ ] CMO AGENTS.md -- needs `## Direct Reports` section (DELG-01)
- [ ] CMO HEARTBEAT.md -- needs `## 4. Delegation` and `## Review and Override` sections (DELG-01, DELG-03)
- [ ] CTO AGENTS.md -- needs `## Direct Reports` section (DELG-02)
- [ ] CTO HEARTBEAT.md -- needs `## 4. Delegation` and `## Review and Override` sections (DELG-02, DELG-03)
- [ ] CEO HEARTBEAT.md -- routing table replacement (DELG-04)
- [ ] CEO AGENTS.md -- work routing table simplification (DELG-04)
- [ ] Technical Writer, Customer Success, UX Researcher, LinkedIn Growth Director AGENTS.md -- reporting line changes (DELG-01)

## Open Questions

1. **Product Owner reporting line**
   - What we know: Product Owner currently says "You report to the CEO." It manages backlog across both CMO and CTO streams. DELG-02 says "CTO can assign work directly to Product Owner."
   - What's unclear: Should Product Owner's AGENTS.md say "You report to the CTO" or "You report to the CEO for cross-stream decisions, and coordinate with CTO on tech backlog"?
   - Recommendation: Keep Product Owner reporting to CEO for the cross-stream mandate, but add "CTO can assign you tech backlog tasks directly." This preserves PO's cross-stream authority while satisfying DELG-02. A simpler interpretation: DELG-02 means CTO can use PO for backlog coordination, not that PO fully reports to CTO.

2. **CEO FPZ Delegation Logic section**
   - What we know: CEO HEARTBEAT.md has a `## FPZ Delegation Logic` section at the bottom (lines 168-192) with detailed per-stream rules including individual agent IDs. This section conflicts with the Phase 13 routing change.
   - What's unclear: Should this section be removed, simplified, or replaced with the new 2-row routing approach?
   - Recommendation: Replace the FPZ Delegation Logic section with a pointer: "See CMO and CTO for stream-specific routing. CEO routes to stream heads only." The detail lives in dept head AGENTS.md.

3. **CTO Work Routing table coverage**
   - What we know: CTO AGENTS.md already has a `## Work Routing` table (lines 42-49) covering Engineer, Code Reviewer, Product Owner, and CTO self. This is functionally a Direct Reports section already.
   - What's unclear: Whether to add a new `## Direct Reports` section or rename/extend the existing `## Work Routing` table.
   - Recommendation: Rename `## Work Routing` to `## Direct Reports and Work Routing` and add the brief passthrough authority language. Avoids duplication.

## Sources

### Primary (HIGH confidence)

- Direct inspection of all 10 agent AGENTS.md files at `/Users/martynmakinson/.paperclip/instances/default/companies/FourPointZero/agents/`
- Direct inspection of CEO, CMO, CTO HEARTBEAT.md files
- REQUIREMENTS.md requirement definitions for DELG-01 through DELG-05
- STATE.md project decisions, current blockers, and accumulated context
- Phase 12 RESEARCH.md -- established patterns for AGENTS.md/HEARTBEAT.md edits (same file types, same edit approach)
- Phase 12 PLAN.md -- established format for Paperclip file edit tasks

### Secondary (MEDIUM confidence)

- ROADMAP.md Phase 13 success criteria definitions
- CEO HEARTBEAT.md "Phase 13 Preparation" placeholder (lines 86-90) -- confirms routing table replacement is anticipated

### Tertiary (LOW confidence)

- None. All findings verified against live agent files.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new technology, exact same edit patterns as Phase 12
- Architecture: HIGH -- reporting lines and routing tables read directly from live files; gaps confirmed
- Pitfalls: HIGH -- sourced from direct observation of current file inconsistencies and known Paperclip advisory-only constraints
- Brief passthrough mechanism: HIGH -- parentId already exists in Paperclip API (used by CEO in step 6); verbatim paste is instruction only

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable -- no external dependencies, no version sensitivity)
