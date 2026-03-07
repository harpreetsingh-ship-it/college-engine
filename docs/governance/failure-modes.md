# Failure Modes & Known Limits

**Document:** Governance — Section 5
**Audience:** Institutional (external-facing — safe to share with districts)
**Status:** Complete

---

## Where the Engine Can Be Wrong — and How That Risk Is Contained

This section documents known limitations and failure modes of the College Pathways Decision Engine. Its purpose is to ensure responsible use, prevent over-interpretation, and support institutional review.

The engine is designed to be honest about what it cannot do.

---

## 5.1 Structural Limits of Any Rules-Based System

The engine operates using explicit, pre-defined rules. As a result:
- It cannot account for information not present in the input schema
- It cannot infer intent, motivation, or resilience
- It cannot detect informal context (e.g., undocumented hardship unless surfaced elsewhere)

These limits are intentional. The engine prefers omission over speculation.

---

## 5.2 Known Failure Modes

### 5.2.1 Exceptional Outliers (Rare Admissions)

The engine may classify certain outcomes as structurally unlikely that nevertheless occur in rare cases:
- Below-floor GPA admits to highly selective campuses
- Exception cases driven by unique institutional priorities
- Admissions influenced by factors outside published criteria

These cases are real but statistically rare.

**Mitigation:** The engine does not deny the existence of exceptions. It explicitly frames such outcomes as long-shots and avoids recommending strategies that rely on exception-seeking.

---

### 5.2.2 Incomplete or Approximate Inputs

Families may estimate GPA inaccurately, misclassify grade concentration, select majors aspirationally rather than realistically, or omit relevant academic anomalies.

**Mitigation:** The engine uses coarse bands, not precise cutoffs. Outputs are phrased conservatively. Advisors are expected to validate inputs where accuracy matters.

---

### 5.2.3 Over-Interpretation by End Users

A common failure mode is false finality — users treating guidance as destiny. Examples:
- "The engine said this path is locked, so there's no point trying."
- "The engine said CSU, so UC is impossible."

**Mitigation:** The engine avoids predictive language, does not output probabilities or rankings, and frames all outputs as planning guidance, not outcomes.

---

### 5.2.4 Emotional Context Blindness

The engine does not account for family pressure, cultural expectations, student anxiety, motivation swings, or burnout. These factors are critical in advising — and intentionally left to humans.

**Mitigation:** Advisor-assist positioning, explicit non-replacement framing, and suppression of "do more" actions when effort is misallocated.

---

### 5.2.5 Institutional Policy Drift Over Time

Admissions policies, GPA distributions, and campus behavior evolve. What is accurate in one cycle may drift over time.

**Mitigation:** Rule inventory is versioned. Campus personality logic is modular. Institutions can review and update overlays without changing core logic. No learned behavior locks outdated patterns in place.

---

## 5.3 Equity-Related Limitations

The engine intentionally does not use race, income, first-generation status, disability status, or immigration status. As a result, it cannot model holistic review nuances tied to these factors and does not attempt to "correct" outcomes based on demographic proxies.

**Design Rationale:** The engine treats equity as:
- Equal access to truthful information
- Consistent guidance regardless of background
- Removal of misinformation that disproportionately harms under-resourced families

Institutions remain responsible for equity-specific advising layers.

---

## 5.4 What the Engine Will Never Attempt to Do

The engine will never:
- Predict individual admissions outcomes
- Simulate admissions committee behavior
- Optimize essays or extracurricular narratives
- Recommend unethical or deceptive strategies
- Encourage students to pursue statistically improbable paths as primary plans

These are not limitations — they are design constraints.

---

## 5.5 Appropriate Use Boundaries

**The engine is appropriate for:**
- Early planning
- Expectation setting
- Pathway comparison
- Advisor-guided discussion

**The engine is not appropriate for:**
- Final admissions decisions
- Appeals or exception requests
- Legal, medical, or mental health guidance
- Replacement of counselor judgment

---

## Summary Statement

> The College Pathways Decision Engine is designed to be conservatively correct rather than optimistically misleading. Where it cannot be certain, it narrows options instead of speculating. Known failure modes are explicitly acknowledged, bounded, and mitigated through design.
