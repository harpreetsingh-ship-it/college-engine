# Input Schema v1.0

**Version:** 1.0
**Status:** Current
**Used by:** engine.js, rules.json

---

## Required Inputs

| Field | Type | Values / Constraints |
|---|---|---|
| `grade_level` | enum | 9, 10, 11, 12 |
| `gpa_unweighted` | number | 2.0–4.0 (2 decimal places) |
| `gpa_trend` | enum | improving, flat, declining |
| `grade_concentration` | enum | math_science, humanities_social_science, electives, evenly_spread, mostly_as |
| `major_bucket` | enum | cs_engineering, business_econ, health_life_science, humanities_social_science, arts_architecture, undecided |
| `systems_considered` | set | uc, csu, private_oos, cc_transfer, undecided (min 1 item) |
| `willing_prioritize_gpa_over_rigor` | boolean | — |
| `willing_summer_academics` | boolean | — |
| `willing_reduce_ecs` | boolean | — |
| `open_to_cc_pathways` | boolean | — |

---

## Conditional Required

| Field | Type | Required When |
|---|---|---|
| `grade_month_bucket` | enum: pre_october, october_or_later | grade_level = 12 |
| `campus_targets_uc` | set: UCB, UCLA, UCSD, UCI, UCD, UCSB, UCSC, UCR, UCM | systems_considered includes "uc" |

---

## Optional Inputs

| Field | Type | Values / Constraints | Default |
|---|---|---|---|
| `summer_travel_weeks` | integer | 0–8 | — |
| `has_cc_coursework_already` | boolean | — | false |
| `ap_history` | enum | none, some_success_b_or_a, struggled_c_or_lower, unknown | — |
| `testing_first_attempt_sat` | integer | 400–1600 | — |
| `academic_anomaly_timing` | enum | none, early_10th_or_before, late_11th | — |
| `ec_signal_level` | enum | minimal, moderate, strong | — |
| `ec_leadership_recognition` | enum | none, leadership_only, awards_only, leadership_and_awards | — |
| `senior_course_signals` | set | we_the_people, capstone_research, advanced_civic_program | — |

---

## Derived Fields (Computed by Engine)

| Field | Type | Values | Computed From |
|---|---|---|---|
| `gpa_band` | enum | A, B, C, D, E | gpa_unweighted thresholds |
| `time_window` | enum | early, late, final, closed | grade_level + grade_month_bucket |

### GPA Band Thresholds
| Band | Range |
|---|---|
| A | ≥ 3.80 |
| B | 3.50–3.79 |
| C | 3.20–3.49 |
| D | 2.80–3.19 |
| E | < 2.80 |

### Time Window Values
| Value | Condition |
|---|---|
| early | Grades 9–10 |
| late | Grade 11 |
| final | Grade 12, pre-October |
| closed | Grade 12, October or later |
