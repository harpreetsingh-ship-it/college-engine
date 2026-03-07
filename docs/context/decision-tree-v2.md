# Decision Tree v2.0 (Canonical)

**Document:** Engine execution logic reference
**Version:** v2.0
**Status:** Canonical — authoritative execution order

> Rules are applied top-down. Later stages cannot override earlier locks.

---

## Stage 0 — Pre-Processing (Always)

This stage normalizes inputs and computes derived fields. No eligibility decisions are made here.

### 0.1 Compute Required Derived Fields

**0.1.1 GPA Band** *(primary structural classifier)*
Derived from `gpa_unweighted`:

| Band | Range |
|---|---|
| A | ≥ 3.80 |
| B | 3.50–3.79 |
| C | 3.20–3.49 |
| D | 2.80–3.19 |
| E | < 2.80 |

This field is **immutable** for the execution cycle and cannot be overridden by later rules.

**0.1.2 Time Window** *(irreversibility classifier)*
Derived from `grade_level` and `current_month`:

| Value | Condition |
|---|---|
| early | Grades 9–10 |
| late | Grade 11 |
| final | Grade 12, pre-October |
| closed | Grade 12, October or later |

This field determines which actions and modifiers are permanently suppressed.

### 0.2 Compute Optional Precision Fields

These fields do not change truth (locks/viability), but enable deterministic routing for later modifiers and campus personality logic. If not provided, related logic falls back to conservative defaults.

**0.2.1 Academic Anomaly Timing**
- `none`
- `early_10th_or_before`
- `late_11th`

Used to differentiate early, repairable anomalies from late academic risk.

**0.2.2 Extracurricular Signal Level**
- `minimal` — participation only, no leadership or output
- `moderate` — leadership OR awards OR sustained involvement
- `strong` — leadership + recognition, or Tier 1/2 impact

Used for spike evaluation and campus personality routing.

**0.2.3 Leadership and Recognition Profile**
- `none`
- `leadership_only`
- `awards_only`
- `leadership_and_awards`

Used to distinguish résumé padding from true differentiation.

**0.2.4 Senior-Year Academic Signal Flags**
Examples (non-exhaustive): `we_the_people`, `capstone_research`, `advanced_civic_program`, `none`

Used only as amplifiers; never as rescue signals.

**0.2.5 Campus Targets (Optional)**
Explicit list of UC campuses the family is considering. If absent, engine applies generic UC-tier logic and suppresses campus-specific personality routing.

### 0.3 Initialize Output Containers

Initialize empty containers. These are populated strictly top-down; later stages may not remove earlier locks.

- `locked[]`
- `viable[]`
- `actions[]`
- `stop[]`
- `success_definition{}`

### 0.4 Pre-Processing Guardrails

- Derived fields must not introduce optimism or pessimism
- Optional fields refine routing but cannot unlock locked pathways
- If optional fields are missing, default to conservative interpretations
- No output language is generated at this stage

---

## Stage 1 — Time Window Gate *(Highest Priority)*

### 1A. If `time_window = closed` (12th grade, October+)

**Locked:**
- Meaningful GPA recovery
- New pathway switches
- Late signal creation (ECs, internships, testing)

**Actions allowed:**
- Application completion
- Error prevention
- Workload stabilization

**Stop:**
- Last-minute fixes
- New ECs
- Testing as rescue

→ Proceed to GPA gate with modifiers heavily suppressed.

### 1B. Else (early, late, final)

→ Proceed normally.

---

## Stage 2 — GPA Band Gate *(Primary Structural Filter)*

### Band A (≥ 3.80)
**Viable:** Top-tier UC, Mid-tier UC, Selective private/OOS, CSU (fallback), CC→UC (optional)
**Locked:** None by GPA alone

### Band B (3.50–3.79)
**Viable:** Mid-tier UC, Lower-tier UC (major dependent), CSU, Limited private/OOS, CC→UC (strategic alternative)
**Locked:** Elite private tier, Top-tier UC (unless later amplified)

### Band C (3.20–3.49)
**Viable:** CSU, CC→UC (primary), CC→CSU, Lower-tier UC (only if high end + improving)
**Locked:** Top-tier UC, Most mid-tier UCs, Meaningful private/OOS

### Band D (2.80–3.19)
**Viable:** CSU (campus/major constrained), CC→CSU (primary), CC→UC (transfer-only framing)
**Locked:** All UCs (direct), Private/OOS

### Band E (< 2.80)
**Viable:** CC→CSU, Limited CSU (non-STEM, campus specific)
**Locked:** UCs, Private/OOS, Signal-based rescue strategies

---

## Stage 3 — Major Competitiveness Gate

**Impacted majors** (cs_engineering, business_econ, health_life_science):
- Raise bar on all UC viability
- Elevate CC→UC where GPA < A
- Require alignment for internships/ECs

**Non-impacted majors** (humanities, arts, undecided):
- Keep UC tiers open longer
- De-emphasize internships unless aligned
- Allow broader success framing
- May tolerate contextual interpretation of quantitative anomalies (campus-level tolerance varies)

---

## Stage 4 — Capacity Gate *(Actionability Filter)*

These do not change truth — only what actions appear.

**4A. GPA vs Rigor**
If `willing_prioritize_gpa_over_rigor = false` → add stop: "Overloading rigor at GPA's expense"; suppress AP expansion; favor CC if open.

**4B. Summer Feasibility**
If `willing_summer_academics = false` OR `summer_travel_weeks ≥ 3` → suppress summer CC actions; add stop: "Assuming summer coursework will fit."

**4C. EC Reduction Resistance**
If `willing_reduce_ecs = false` → do not recommend EC cuts; still warn against time sinks in stop list.

**4D. CC Resistance**
If `open_to_cc_pathways = false` → CC pathways remain viable; CC actions downgraded to `should_consider`; success definition still reflects CC if structurally dominant.

---

## Stage 5 — Signal Modifier Routing

**5A. Community College (Dual Enrollment)**
Show if: GPA band B or C, capacity allows.
Suppress if: GPA band D/E without stabilization, random/non-aligned use implied.

*Exception (Signal-Only Use):* Allow aligned CC coursework as signal-only amplifier for non-impacted majors ONLY when A-level performance is realistic, coursework aligns with major, and CC transfer is not the intended pathway. This exception does not override GPA band locks.

**5B. AP / Honors**
Show if: GPA band A or B, strong subject foundation.
Add stop if: GPA band C/D/E → "APs likely to reduce GPA."

**5C. Middle College** *(Corrected, Locked)*
Show ONLY IF ALL true: grade_level = 10, GPA band C or D (2.8–3.5), open_to_cc_pathways = true, application window not closed.

Hard exclusions: Grade 9 (too early), Grade 11+ (window closed).

If excluded due to timing, add to locked: *"Middle College requires application during 10th grade for an 11th-grade start."*

Never shown as: late recovery, generic CC alternative, GPA eraser.

**5D. Standardized Testing**
Show if: GPA band A (or top of B, optionally).
Add stop if: GPA < 3.5 → "Testing as rescue lever."

**5E. Internships**
Show if: GPA band B (or top of C + improving), strong alignment with major_bucket.
Additional gate: Private or informal work counts ONLY if converted into verifiable artifacts (projects, portfolios, logs, repositories).
Suppress: STEM internships as GPA substitutes, prestige-only internships, unverifiable effort.

**5F. Extracurriculars**
Show if: GPA band A/B/C, depth > breadth emphasis.
Suppress if: GPA band D/E.
Add stop if: résumé padding implied.

**5G. Essays / PIQs**
Always show as amplifiers, never creators.
If `time_window = closed`: only quality control and alignment allowed.

**5H. Campus Personality Post-Processor**
Runs only if `systems_considered` includes UC AND `campus_targets` is provided.

Campus-specific behavior:
- **Berkeley:** Spike-sensitive, floor-guarded, anomaly timing aware. Floor guardrail: if GPA is at the bottom of Band B AND a quantitative anomaly occurs in 11th grade, Berkeley viability must be downgraded to "low-probability reach," even when spike criteria are met.
- **UCLA:** Polish/consistency optimized
- **UCSD/UCI/UCD:** Smoothing/predictability
- **UCSC/UCR:** Floor-guarded (~3.5+ effective floor)
- **UCM:** Access UC — viable at Band C, conditional at Band D (improving trend only)

May elevate or de-emphasize specific campuses, add asymmetric-outcome language. Must NOT reopen locked GPA tiers or guarantee outcomes.

---

## Stage 6 — Output Assembly Rules

**Ordering:**
- Locked: time → GPA → major
- Viable: structural strength > prestige (with campus-specific notes when campus personality triggered)
- Actions: highest ROI first (max 5)
- Stop: highest damage first (max 5)

**Language constraints:**
- No predictions
- No probabilities
- No encouragement
- No peer comparison

---

## Stage 7 — Success Definition *(Mandatory)*

Generated from primary viable pathway, not aspiration.

Examples (conceptual):
- CC→UC → success = CC GPA + TAG/TAP execution
- CSU → success = CSU performance + post-enrollment leverage
- Mid-UC → success = sustained academics + aligned signals

Must not reference locked outcomes.
