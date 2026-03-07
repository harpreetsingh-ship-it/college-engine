# College Pathways Decision Engine — Master Context

> Paste this URL into Claude at the start of any session to restore full project context:
> `https://raw.githubusercontent.com/harpreetsingh-ship-it/college-engine/main/docs/context/master-context.md`

**Last updated:** March 6, 2026
**Current phase:** 4B — Controlled Exposure
**Engine version:** v0.3

---

## 1. Project Identity

The College Pathways Decision Engine is a browser-only, deterministic, rule-based tool. It surfaces structural college pathway realities based on GPA bands, grade level, timing, and target system (UC / CSU / Private / CC transfer).

**It is NOT:**
- An AI admissions predictor
- A Naviance replacement
- A holistic admissions model
- A parent-facing engagement product
- A probabilistic or outcome-guarantee tool

**It IS:**
- A structural clarity engine
- A counselor-facing decision framework
- A reality-aligning tool
- Deterministic, defensible, and district-safe

**Design philosophy:** GPA is a structural gate. Activities and essays strengthen an application after GPA is in range — they rarely rescue a locked pathway. Truth over comfort. Counselor authority is preserved at all times.

**Live URL:** https://harpreetsingh-ship-it.github.io/college-engine/
**GitHub repo:** https://github.com/harpreetsingh-ship-it/college-engine

---

## 2. Current Phase & Status

### Phase 4B — Controlled Exposure

Outreach has begun to selected school districts. The goal is feedback, positioning refinement, and institutional readiness — not selling licenses yet.

### Phase 4 Silent Run Results (5 Runs Completed)

| Pattern | Description | Risk Level |
|---|---|---|
| Entry framing feels technical | Intro language perceived as algorithmic | Medium adoption, Low structural |
| Parent-facing value not explicit | Users understood mechanics but not parent benefit | Medium adoption, Zero structural |
| UI/terminology polish | Minor: D/F wording, font, indicators | Low |
| Positive signals (SR-04, SR-05) | Easy navigation, clear outcomes, not overwhelming | — |

**Phase 4 Exit Decision:** CLARIFY FRAMING ONLY. No structural objections. No rejection of deterministic posture. No emotional backlash to "locked" or transfer framing.

### Wording Freeze — Active

v1 freeze in effect. No output copy changes unless a real-world misinterpretation is observed. Allowed scope: audience positioning, benefit-first explanation, light terminology only.

---

## 3. Strategic Positioning

| Dimension | Decision |
|---|---|
| Primary framing | Institutional: "Supports consistent, defensible advising" |
| Primary audience | Counselors first. Parents/students secondary. |
| Competitive frame | Not Naviance. Not AI. Not a predictor. |
| Revenue model | District-level licensing. ~$150K/yr target. No VC. |
| Exposure strategy | Quiet, institutional. No broad visibility yet. |

### Institutional Value Proposition
- Consistent structural pathway messaging across counselors
- Reduced subjective drift in advising
- Earlier course correction before reactive escalation
- Documentable reasoning behind pathway guidance
- Scalable review of large student populations

### 15-Minute Demo Script — Key Sentences

**Opening:** "This is not an admissions predictor. It is not a replacement for counselor judgment. It's a structural guardrail tool."

**Anchor sentence for district audience:** "If two counselors have this tool open, they are anchored to the same structural framing."

**Institutional value:** Alignment and ambiguity reduction. No data stored. No login. No algorithmic risk.

---

## 4. Objection Handling

| Objection | Response Positioning |
|---|---|
| Why fix something that isn't broken? | Reduces invisible inconsistency regardless of counselor bandwidth |
| No two profiles are alike | Standardizes structural constraints, not individuality. Counselor judgment preserved. |
| Equity / cost bias | Evaluates structural admissions viability only. No cost or prestige encoding. |
| Prestige / reputation risk | Does not eliminate aspirational applications. Protects viable pathways alongside reaches. |
| Legal liability | "Locked" reflects structural thresholds, not certainty. Does not prohibit applications. |

**"Locked" language guardrail:** "Locked indicates a pathway falls outside typical GPA and timing thresholds. Rare exceptions may occur but these routes carry high structural risk. This does not prohibit applications."

---

## 5. Governance & Institutional Safety

### Truth Boundaries — What the Engine Will Not Do
- Predict admission outcomes or assign probability percentages
- Replace human judgment or override counselor expertise
- Create new opportunity where structure is already closed
- Encourage gaming, misrepresentation, or deception
- Override institutional policy or minimum requirements (e.g., UC a–g)

### Failure Modes & Known Limits

| Failure Mode | Description | Mitigation |
|---|---|---|
| Exceptional outliers | Engine may classify rare admits as structurally unlikely | Frames as long-shots, not impossibilities |
| Incomplete inputs | Families may estimate GPA inaccurately | Output is only as accurate as inputs. Counselor validation essential. |
| Holistic review nuance | Engine does not simulate reader discretion or essay resonance | Intentional. Treats holistic review as bounded overlay. |
| Overinterpretation of "locked" | Users may read "locked" as absolute prohibition | Language guardrail + counselor framing doc addresses this. |

### Advisor Positioning — Upstream Support Model
The engine performs three preparatory functions before the advisor steps in:
1. **Truth Stabilization** — removes pathways no longer viable due to GPA/timing
2. **Effort Re-allocation** — highlights which actions still convert effort into outcomes
3. **Language Normalization** — provides consistent terminology so advisors don't repeatedly reframe

### Outside Employment Compliance Description
Draft exists at `docs/governance/outside-employment.md`. Not yet submitted to employer.

---

## 6. Code Architecture

### File Structure

| File | Purpose | Status |
|---|---|---|
| index.html | Full UI — inputs, tooltips, output panels, UC explainer, feedback widget | Stable |
| engine.js | Rules evaluator, GPA band logic, time window, suppression system | Latest (630 lines) |
| rules.json | All decision logic — 8-stage execution, rules, success templates | v0.3 |

### Execution Stages (rules.json v0.3)
1. **time_window_gate** — 12th grade Oct+ locks everything
2. **gpa_band_gate** — two lenses: `gpa_band_uc_csu` (10th–11th) and `gpa_band_overall` (includes 9th, for Private/OOS)
3. **major_competitiveness_gate** — flags impacted majors (CS/Engineering/Business/Pre-med) at C/D bands
4. **capacity_gate** — user preferences trigger suppressions
5. **modifier_routing** — surfaces CC dual enrollment, AP/Honors, testing when not suppressed
6. **suppression_pass** — D/E bands auto-suppress testing, internships, ECs
7. **campus_personality** — UC campus-specific notes
8. **output_assembly** — defined in execution order; **no rules written yet (known gap)**

### GPA Band Reference

| Band | UC/CSU GPA | Structural Reality |
|---|---|---|
| A | ≥ 3.80 | Top-tier UC + Selective Private viable. Testing amplifies. |
| B | 3.50–3.79 | Mid-tier UC + CSU. Top-tier locked. |
| C | 3.20–3.49 | CSU + CC-to-UC transfer primary. Most mid-tier UCs locked. |
| D | 2.80–3.19 | CC-to-CSU + limited CSU. All UCs direct locked. |
| E | < 2.80 | CC primary. All signaling suppressed. |

### Known Technical Issues
- `output_assembly` stage has no rules defined — gap to address
- Private/OOS duplication: `B_band_B_private_oos` and `P_private_oos_band_B` both fire for Band B
- `D_no_summer` suppresses CC when travel ≥ 3 weeks — but CC transfer is year-long; logic worth revisiting
- User feedback: CC transfer destinations should include OOS, not just UC/CSU

---

## 7. Pre-Pilot Feedback (Real User Quotes)

5 responses collected from community cohort before formal pilot.

| Theme | Verbatim Quote | Classification |
|---|---|---|
| Entry framing | "How to read this can be worded better." | Language misread |
| Output clarity | "What is locked — spell out what it means." | UX friction |
| Missing outputs | "It didn't give any viable options." | Expectation mismatch |
| Language accessibility | "The lingo is a bit confusing for first-time college families." | Language misread |
| Summer travel input | "Could not understand the motivation behind: Summer travel time." | UX friction |
| Stop list clarity | "What do we mean by stop list?" | UX friction |
| Scope expansion | "Should elaborate features like essays or sports." | Out of scope |
| Positive | "Great effort, quick results, minimum complexity." | Positive validation |
| Positive | "Language and layout are quite good. I like the simplicity." | Positive validation |
| Valid logic note | "CC transfer is also possible to OOS — not just UC/CSU." | Logic gap (confirmed) |

---

## 8. Pilot Structure & Success Metrics

### Pilot Design
- 3–5 participating counselors
- 50–100 student evaluations
- 8–12 week duration
- No marketing language in sessions
- No change to existing advising practices

### Primary Metric: Structural Alignment Rate

| Threshold | Interpretation |
|---|---|
| Below 60% | Structural instability — major revision required |
| 60–74% | Insufficient consistency — targeted refinement required |
| 75–84% | Acceptable structural validity |
| 85%+ | Strong reproducibility — validated for scale |

End-of-pilot decision: Proceed / Refine / Discontinue — must be documented.

---

## 9. Outreach Status

Live tracker: `docs/outreach/tracker.md`
Send log: `docs/outreach/send-log.md`
Email drafts: `docs/outreach/emails/`

**Summary as of March 6, 2026:** 4 emails sent, 0 responses, nudges due starting March 10.

---

## 10. Open Strategic Questions

- How to scale district adoption without triggering procurement complexity?
- When (and whether) to introduce monetization?
- How to handle legal review framing?
- Should CC transfer destinations explicitly include OOS (user feedback flagged this gap)?
- When to activate outside employment compliance description with employer?
- Whether to create a dedicated project email address (recommendation: yes, after first reply)

---

## 11. Full Artifact Inventory

### GitHub Repo (`/`)
`index.html`, `engine.js`, `rules.json`, `README.md`, `CHANGELOG.md`

### GitHub Repo (`/docs/strategy/`)
`counselor-framing.md`, `counselor-value-articulation.md`, `institutional-brief.md`, `phase4b-market-framing.md`, `phase4-objection-log.md`, `phase4-observation-checklist.md`

### GitHub Repo (`/docs/pilot/`)
`pilot-structure-outline.md`, `success-metrics-framework.md`

### GitHub Repo (`/docs/governance/`)
`truth-boundaries.md`, `advisor-positioning.md`, `design-traceability.md`, `failure-modes.md`, `why-license.md`, `outside-employment.md`

### GitHub Repo (`/docs/outreach/`)
`tracker.md`, `send-log.md`, `emails/wave1-*.md`, `emails/wave2-*.md`

### GitHub Repo (`/qa/`)
`test-cases.md`
