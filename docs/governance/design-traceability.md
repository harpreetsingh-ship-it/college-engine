# Decision Traceability

**Document:** Governance — Section 2
**Audience:** Institutional (external-facing — safe to share with districts)
**Status:** Complete

---

## How the Engine Reaches Its Conclusions

This section explains how the College Pathways Decision Engine evaluates inputs and produces outputs in a way that is deterministic, explainable, and reviewable by humans.

---

## 2.1 Deterministic, Rule-Based Architecture

The engine operates as a deterministic rules system, not a statistical or machine-learning model.

The same inputs always produce the same outputs. The engine does not use probabilities, weights, machine learning, or adaptive behavior. All outcomes are produced by explicit, reviewable rules.

There is no hidden logic, model training, or adaptive behavior.

---

## 2.2 Ordered Evaluation Stages

Rules are evaluated in a fixed, transparent order. Earlier stages constrain what later stages can do. The evaluation order is fixed by design and cannot be altered dynamically or per student.

| Stage | Name | What It Does |
|---|---|---|
| 1 | Time Window Gate | Determines what is still changeable based on grade level and calendar timing |
| 2 | GPA Band Gate | Assigns the student to a structural GPA band that defines baseline viability |
| 3 | Major Competitiveness Gate | Adjusts interpretation based on whether the intended major is impacted |
| 4 | Capacity & Willingness Gates | Filters actions based on what the student/family is realistically willing to do |
| 5 | Modifier Routing | Applies amplifiers (APs, CC coursework, testing) only if structurally appropriate |
| 6 | Suppression Pass | Explicitly removes actions that are no longer high-ROI or feasible |
| 7 | Campus Personality Layer | Applies campus-specific interpretation (e.g., Access vs Floor-Guarded UC behavior) |
| 8 | Output Assembly | Produces final outputs: Locked, Viable, High-ROI Actions, Stop List, Success Definition, Notes |

Each stage can only narrow, never expand, structural possibilities.

---

## 2.3 Structural vs. Conditional Logic

The engine distinguishes between two types of rules:

**Structural Rules (Foundational)**
Define hard constraints: GPA bands, application timing, system-level admission behavior. Structural rules cannot be overridden by later inputs.

**Conditional Rules (Contextual)**
Refine guidance: willingness to take summer classes, openness to CC pathways, presence of leadership or awards, campus targets. Conditional rules shape recommendations, not structural truth.

---

## 2.4 Output Categories and Their Meaning

| Output | Definition |
|---|---|
| Locked | Paths no longer realistically attainable given timing and academics |
| Viable | Paths where effort can still convert into outcomes |
| High-ROI Actions | Actions that still meaningfully improve results within viable paths |
| Stop List | Actions that no longer convert effort into outcomes |
| Success Definition | Plain-language description of what "doing well" looks like from this point forward |
| Notes | Contextual explanations or campus-specific nuance |

No output is presented unless it survives all prior evaluation stages.

---

## 2.5 Suppression Logic

The engine uses explicit suppression rules to avoid misleading guidance. Examples:
- Testing is suppressed as a "rescue lever" once timing or GPA makes it ineffective
- Extracurricular expansion is suppressed when academics are the binding constraint
- Community college actions are suppressed if the family explicitly rejects that pathway

Suppression exists to reduce false optionality, not to limit opportunity. This ensures the engine does not recommend actions simply because they are popular or familiar.

---

## 2.6 Campus Personality Traceability

Campus-specific messaging is layered after structural viability is determined.

- UC Merced may be presented as an "Access UC" for certain GPA bands
- UC Riverside or UCSC may be flagged as "Floor-Guarded" under the same band

This does not change viability — it changes how risk is framed. Campus logic never overrides GPA or timing gates.

---

## 2.7 Human Explainability Standard

Every output is explainable in plain language:

> "This path is locked because the GPA band and timing no longer support it."
> "This action is suppressed because it would not meaningfully change outcomes."
> "This campus is treated as a long-shot due to historical GPA floors."

Advisors do not need to reference code to explain decisions.

---

## 2.8 Auditability & Governance Review

All rules:
- Exist in a human-readable rules file
- Are versioned
- Can be reviewed, added, or removed without retraining a model
- Retain no student data and do not use it to modify future behavior

Institutions can:
- Review the full rule inventory
- Validate ordering assumptions
- Request localized rule overlays (without changing core logic)

---

## Summary Traceability Statement

> Every output produced by the engine can be traced to a specific rule, evaluated in a known order, under explicit constraints. The system is deterministic, reviewable, and explainable without reference to source code.
