# Rules Engine v0.3 — Reference

**Version:** v0.3
**Status:** Current canonical version (supersedes v0.1, v0.2)
**Format:** YAML source — linted for evaluator readiness
**Note:** Authoritative logic lives in `rules.json`. This file is the YAML reference for human review.

> Monotonic suppression, deterministic conditions, no duplication.

---

## Execution Order

1. time_window_gate
2. gpa_band_gate
3. major_competitiveness_gate
4. capacity_gate
5. modifier_routing
6. suppression_pass
7. campus_personality
8. output_assembly

---

## Initial State

```yaml
outputs:
  locked: []
  viable: []
  actions: []
  stop: []
  success_definition: {}
  notes: []

suppress:
  modifiers:
    cc: false
    ap: false
    middle_college: false
    testing: false
    internships: false
    extracurriculars: false
    essays: false
```

---

## A. Time & Irreversibility

```yaml
- id: A_closed_window
  stage: time_window_gate
  when:
    field: time_window
    eq: closed
  then:
    add_locked:
      - "Meaningful GPA recovery"
      - "New pathway switches"
      - "Late signal creation (ECs, internships, testing)"
    add_actions:
      - "Application completion"
      - "Error prevention"
      - "Grade protection to avoid rescind"
    add_stop:
      - "Last-minute fixes"
      - "New ECs as rescue"
      - "Testing as rescue"
    set_suppress:
      modifiers:
        cc: true
        ap: true
        middle_college: true
        testing: true
        internships: true
        extracurriculars: true
```

---

## B. GPA Bands

```yaml
- id: B_band_A
  stage: gpa_band_gate
  when: { field: gpa_band, eq: "A" }
  then:
    add_viable:
      - "Top-tier UC"
      - "Mid-tier UC"
      - "Selective private/OOS"
      - "CSU (fallback)"

- id: B_band_B
  stage: gpa_band_gate
  when: { field: gpa_band, eq: "B" }
  then:
    add_viable:
      - "Mid-tier UC"
      - "Lower-tier UC (major dependent)"
      - "CSU"
      - "Limited private/OOS"
    add_locked:
      - "Top-tier UC (default)"
      - "Elite private tier"

- id: B_band_C
  stage: gpa_band_gate
  when: { field: gpa_band, eq: "C" }
  then:
    add_viable:
      - "CSU"
      - "CC→UC (primary)"
      - "CC→CSU"
    add_locked:
      - "Top-tier UC"
      - "Most mid-tier UCs"

- id: B_band_D_E
  stage: gpa_band_gate
  when:
    field: gpa_band
    in: ["D","E"]
  then:
    add_viable:
      - "CC→CSU"
      - "Limited CSU (non-STEM)"
    add_locked:
      - "UC"
      - "Private/OOS"
```

---

## C. Major Competitiveness

```yaml
- id: C_impacted_major_floor
  stage: major_competitiveness_gate
  when:
    all:
      - field: major_bucket
        in: ["cs_engineering","business_econ","health_life_science"]
      - field: gpa_band
        in: ["C","D","E"]
  then:
    add_notes:
      - "Impacted major below GPA floor: pathway repair or realignment required."

- id: C_major_realignment_action
  stage: major_competitiveness_gate
  when:
    all:
      - field: major_bucket
        in: ["cs_engineering","business_econ","health_life_science"]
      - field: gpa_band
        in: ["C","D"]
  then:
    add_actions:
      - "Choose: academic repair in core skills OR pathway realignment (CSU / CC→transfer)."
```

---

## D. Capacity

```yaml
- id: D_no_gpa_priority
  stage: capacity_gate
  when:
    field: willing_prioritize_gpa_over_rigor
    eq: false
  then:
    add_stop:
      - "Overloading rigor at GPA's expense"
    set_suppress:
      modifiers:
        ap: true

- id: D_no_summer
  stage: capacity_gate
  when:
    any:
      - field: willing_summer_academics
        eq: false
      - field: summer_travel_weeks
        gte: 3
  then:
    set_suppress:
      modifiers:
        cc: true
```

---

## E. Modifiers

```yaml
- id: E_cc_dual_enrollment
  stage: modifier_routing
  when:
    all:
      - field: suppress.modifiers.cc
        eq: false
      - field: gpa_band
        in: ["B","C"]
  then:
    add_actions:
      - "Use aligned CC coursework only if A-level performance is realistic."

- id: E_ap_gate
  stage: modifier_routing
  when:
    all:
      - field: suppress.modifiers.ap
        eq: false
      - field: gpa_band
        in: ["A","B"]
  then:
    add_actions:
      - "AP/Honors allowed only with strong subject foundation."

- id: E_testing_gate
  stage: modifier_routing
  when:
    all:
      - field: suppress.modifiers.testing
        eq: false
      - field: gpa_band
        eq: "A"
  then:
    add_actions:
      - "Testing may amplify; never use as rescue."
```

---

## F. Suppression Pass

```yaml
- id: F_low_band_suppression
  stage: suppression_pass
  when:
    field: gpa_band
    in: ["D","E"]
  then:
    set_suppress:
      modifiers:
        testing: true
        internships: true
        extracurriculars: true
```

---

## G. Campus Personality

```yaml
- id: G_ucb_spike_note
  stage: campus_personality
  cannot_mutate: [viable, locked]
  when:
    all:
      - field: campus_targets_uc
        contains: "UCB"
      - field: ec_leadership_recognition
        eq: "leadership_and_awards"
  then:
    add_notes:
      - "Berkeley favors intellectual/civic spikes more than smooth profiles."
```

---

## H. Output Assembly

```yaml
- id: H_output_constraints
  stage: output_assembly
  when: {}
  then:
    set_output_constraints:
      max_actions: 5
      max_stop: 5
    set_language_constraints:
      - "No predictions"
      - "No probabilities"
      - "No encouragement framing"
```

---

## Known Issues (v0.3)

- `output_assembly` stage has no content rules — gap to be addressed in v0.4
- `B_band_B` and `P_private_oos_band_B` may both fire for Band B (duplication)
- `D_no_summer` suppresses CC when travel ≥ 3 weeks, but CC transfer is year-long — suppress logic too broad
- CC transfer destinations should include OOS, not just UC/CSU (user feedback)
