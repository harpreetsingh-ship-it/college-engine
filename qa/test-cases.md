## QA-01 — Closed window lock (12th grade, Oct+)
```yaml
id: QA-01
description: Closed application window forces constraint framing
inputs:
  grade_level: 12
  grade_month_bucket: october_or_later

  gpa_uc_csu: 3.90
  gpa_overall: 3.90
  gpa_trend: flat

  major_bucket: humanities_social_science
  systems_considered: [uc, csu]

  campus_targets_uc: [UCB]

  willing_prioritize_gpa_over_rigor: false
  willing_summer_academics: false
  willing_reduce_ecs: false
  open_to_cc_pathways: false

  senior_course_signals: []

expected:
  band: A
  time: closed
  success_template: closed_window

  locked_must_include:
    - Meaningful GPA recovery
    - New pathway switches
    - Late signal creation

  actions_must_include:
    - Application completion

  suppression_expectations:
    must_not_include:
      - AP
      - Community college coursework
      - Internships
      - Testing prompts

## QA-02 ⭐ — Band A, UC viability (non-closed)

```yaml
id: QA-02
description: Strong GPA with open window supports UC and selective private viability
inputs:
  grade_level: 11
  grade_month_bucket: null

  gpa_uc_csu: 3.85
  gpa_overall: 3.85
  gpa_trend: improving

  major_bucket: humanities_social_science
  systems_considered: [uc, private_oos]

  campus_targets_uc: [UCLA]

  willing_prioritize_gpa_over_rigor: false
  willing_summer_academics: false
  willing_reduce_ecs: false
  open_to_cc_pathways: false

  senior_course_signals: []

expected:
  band: A
  time: late
  success_template: mid_uc

  viable_must_include:
    - Top-tier UC
    - Mid-tier UC
    - Selective private/OOS
  
  locked_must_include:
    - Ultra-selective private/OOS (reach-only)

  actions_must_include:
    - Testing may amplify but must not be framed as rescue

  viable_must_not_include:
    - CC to UC as primary pathway

## QA-03 ⭐ — Band B baseline + top-tier UC locked

```yaml
id: QA-03
description: Band B GPA allows mid-tier UC and CSU, but locks top-tier UC by default
inputs:
  grade_level: 11
  grade_month_bucket: null

  gpa_uc_csu: 3.60
  gpa_overall: 3.60
  gpa_trend: flat

  major_bucket: humanities_social_science
  systems_considered: [uc, csu]

  campus_targets_uc: [UCSD]

  willing_prioritize_gpa_over_rigor: false
  willing_summer_academics: false
  willing_reduce_ecs: false
  open_to_cc_pathways: false

  senior_course_signals: []

expected:
  band: B
  time: late
  success_template: mid_uc

  viable_must_include:
    - Mid-tier UC
    - CSU

  locked_must_include:
    - Top-tier UC

  actions_must_include:
    - standard application execution

  viable_must_not_include:
    - CC to UC as primary pathway



## QA-04 ⭐ — Band C baseline (no campus targets)

```yaml
id: QA-04
description: Band C GPA forces transfer-primary framing even when CC is not selected
inputs:
  grade_level: 11
  grade_month_bucket: null

  gpa_uc_csu: 3.30
  gpa_overall: 3.30
  gpa_trend: flat

  major_bucket: humanities_social_science
  systems_considered: [uc, csu]

  campus_targets_uc: []

  willing_prioritize_gpa_over_rigor: false
  willing_summer_academics: false
  willing_reduce_ecs: false
  open_to_cc_pathways: false

  senior_course_signals: []

expected:
  band: C
  time: late
  success_template: cc_transfer_refused

  viable_must_include:
    - CSU
    - CC to UC as primary pathway
    - CC to CSU

  locked_must_include:
    - Top-tier UC
    - Most mid-tier UCs

  notes_must_include:
    - Transfer is the most reliable lever

  actions_must_not_include:
    - AP coursework as rescue
    - Testing as rescue

## QA-05 — Band C + UC Merced targeted (access UC exception)

```yaml
id: QA-05
description: Access UC exception (UCM) appears without weakening transfer-primary framing
inputs:
  grade_level: 11
  grade_month_bucket: null

  gpa_uc_csu: 3.48
  gpa_overall: 3.48
  gpa_trend: flat

  major_bucket: humanities_social_science
  systems_considered: [uc, csu]

  campus_targets_uc: [UCM]

  willing_prioritize_gpa_over_rigor: false
  willing_summer_academics: false
  willing_reduce_ecs: false
  open_to_cc_pathways: false

  senior_course_signals: []

expected:
  band: C
  time: late
  success_template: cc_transfer_refused

  viable_must_include:
    - CSU
    - CC to UC as primary pathway
    - CC to CSU
    - UC Merced direct option

  notes_must_include:
    - UC Merced admits a meaningful share of students in the 3.25–3.49 GPA range
    - Transfer remains the most reliable lever

  locked_must_include:
    - Top-tier UC
    - Most mid-tier UCs

## QA-06 — Band C + UC Riverside targeted (floor-guard note)

```yaml
id: QA-06
description: Floor-guard UC (UCR) triggers cautionary note without granting direct viability
inputs:
  grade_level: 11
  grade_month_bucket: null

  gpa_uc_csu: 3.48
  gpa_overall: 3.48
  gpa_trend: flat

  major_bucket: humanities_social_science
  systems_considered: [uc]

  campus_targets_uc: [UCR]

  willing_prioritize_gpa_over_rigor: false
  willing_summer_academics: false
  willing_reduce_ecs: false
  open_to_cc_pathways: false

  senior_course_signals: []

expected:
  band: C
  time: late
  success_template: cc_transfer_refused

  viable_must_include:
    - CSU
    - CC to UC as primary pathway
    - CC to CSU

  notes_must_include:
    - UC Riverside has GPA floor dynamics that make direct admission uncertain at this band
    - Transfer remains the most reliable lever

  viable_must_not_include:
    - UC Riverside direct option
## QA-07 — Band C + UC Santa Cruz targeted (floor-guard note)

```yaml
id: QA-07
description: Floor-guard UC (UCSC) triggers cautionary note without granting direct viability
inputs:
  grade_level: 11
  grade_month_bucket: null

  gpa_uc_csu: 3.48
  gpa_overall: 3.48
  gpa_trend: flat

  major_bucket: humanities_social_science
  systems_considered: [uc]

  campus_targets_uc: [UCSC]

  willing_prioritize_gpa_over_rigor: false
  willing_summer_academics: false
  willing_reduce_ecs: false
  open_to_cc_pathways: false

  senior_course_signals: []

expected:
  band: C
  time: late
  success_template: cc_transfer_refused

  viable_must_include:
    - CSU
    - CC to UC as primary pathway
    - CC to CSU

  notes_must_include:
    - UC Santa Cruz has GPA floor dynamics that make direct admission uncertain at this band
    - Transfer remains the most reliable lever

  viable_must_not_include:
    - UC Santa Cruz direct option
## QA-08 — Impacted major + Band C triggers repair / realignment messaging

```yaml
id: QA-08
description: Impacted major at Band C requires explicit repair-or-realignment framing
inputs:
  grade_level: 11
  grade_month_bucket: null

  gpa_uc_csu: 3.35
  gpa_overall: 3.35
  gpa_trend: declining

  major_bucket: cs_engineering
  systems_considered: [uc, csu]

  campus_targets_uc: [UCI]

  willing_prioritize_gpa_over_rigor: false
  willing_summer_academics: false
  willing_reduce_ecs: false
  open_to_cc_pathways: false

  senior_course_signals: []

expected:
  band: C
  time: late
  success_template: cc_transfer_refused

  viable_must_include:
    - CSU
    - CC to UC as primary pathway
    - CC to CSU

  notes_must_include:
    - Impacted major below GPA floor requires pathway repair or realignment

  actions_must_include:
    - Choose academic repair strategy
    - Choose pathway realignment strategy
## QA-09 — No summer academics suppresses CC action prompts
<!-- QA-09 exists solely to verify CC / summer lever suppression -->

```yaml
id: QA-09
description: When summer academics are declined, CC-related action prompts are suppressed
inputs:
  grade_level: 11
  grade_month_bucket: null

  gpa_uc_csu: 3.60
  gpa_overall: 3.60
  gpa_trend: improving

  major_bucket: humanities_social_science
  systems_considered: [uc]

  campus_targets_uc: []

  willing_prioritize_gpa_over_rigor: false
  willing_summer_academics: false
  willing_reduce_ecs: false
  open_to_cc_pathways: false

  senior_course_signals: []

expected:
  band: B
  time: late
  success_template: mid_uc

  actions_must_not_include:
    - Community college coursework
    - Dual enrollment
    - Summer academics

## QA-10 — Band D/E suppression hides testing, internships, and EC rescue prompts

```yaml
id: QA-10
description: Low GPA bands suppress testing, internship, and EC-based rescue actions
inputs:
  grade_level: 11
  grade_month_bucket: null

  gpa_uc_csu: 2.95
  gpa_overall: 2.95
  gpa_trend: improving

  major_bucket: humanities_social_science
  systems_considered: [csu]

  campus_targets_uc: []

  willing_prioritize_gpa_over_rigor: false
  willing_summer_academics: false
  willing_reduce_ecs: false
  open_to_cc_pathways: false

  senior_course_signals: []

expected:
  band: D
  time: late
  success_template: csu

  viable_must_include:
    - CC to CSU
    - Limited CSU options (non-impacted majors)

  locked_must_include:
    - All UC direct options
    - Private and OOS options

  actions_must_not_include:
    - Testing as rescue
    - Internships as rescue
    - Extracurriculars as rescue
## QA-11 — Band C + UC only (no CC transfer selected) forces transfer-primary framing

```yaml
id: QA-11
description: Band C with UC-only selection enforces transfer-primary success framing
inputs:
  grade_level: 11
  grade_month_bucket: null

  gpa_uc_csu: 3.48
  gpa_overall: 3.48
  gpa_trend: flat

  major_bucket: humanities_social_science
  systems_considered: [uc]

  campus_targets_uc: [UCM]

  willing_prioritize_gpa_over_rigor: false
  willing_summer_academics: false
  willing_reduce_ecs: false
  open_to_cc_pathways: false

  senior_course_signals: []

expected:
  band: C
  time: late
  success_template: cc_transfer_refused

  viable_must_include:
    - CC to UC as primary pathway
    - CC to CSU
    - UC Merced direct option

  notes_must_include:
    - Transfer remains the most reliable lever
## QA-12 — Band C + CC transfer selected commits to CC-to-UC success framing

```yaml
id: QA-12
description: Explicit CC transfer selection commits the engine to CC-to-UC success framing
inputs:
  grade_level: 11
  grade_month_bucket: null

  gpa_uc_csu: 3.48
  gpa_overall: 3.48
  gpa_trend: flat

  major_bucket: humanities_social_science
  systems_considered: [uc, cc_transfer]

  campus_targets_uc: [UCM]

  willing_prioritize_gpa_over_rigor: false
  willing_summer_academics: false
  willing_reduce_ecs: false
  open_to_cc_pathways: true

  senior_course_signals: []

expected:
  band: C
  time: late
  success_template: cc_to_uc

  viable_must_include:
    - CC to UC as primary pathway
    - UC Merced direct option

  notes_must_include:
    - Community college transfer is the selected and supported pathway
## QA-13 — GPA mismatch: strong overall GPA, weaker UC/CSU GPA

```yaml
id: QA-13
description: Overall GPA strength does not override UC/CSU GPA banding differences
inputs:
  grade_level: 11
  grade_month_bucket: null

  gpa_uc_csu: 3.45
  gpa_overall: 3.75
  gpa_trend: improving

  major_bucket: humanities_social_science
  systems_considered: [uc, private_oos]

  campus_targets_uc: []

  willing_prioritize_gpa_over_rigor: false
  willing_summer_academics: false
  willing_reduce_ecs: false
  open_to_cc_pathways: false

  senior_course_signals: []

expected:
  band: B
  time: late
  success_template: 
    - transfer the most reliable lever

  viable_must_include:
    - CSU
    - CC to UC as primary pathway
    - CC to CSU
    - Private/OOS (Target/Safety mix)

  locked_must_include:
    - Top-tier UC
    - Most mid-tier UCs
    - Elite private tier
    - Ultra-selective private/OOS

  notes_must_include:
    - No additional context is required for this scenario.
  
  notes_must_not_include:
  - UC GPA
  - Overall GPA


## QA-14 — Undecided major with Band C GPA forces conservative pathway framing

```yaml
id: QA-14
description: Undecided major at Band C increases risk and reinforces transfer-primary framing
inputs:
  grade_level: 11
  grade_month_bucket: null

  gpa_uc_csu: 3.30
  gpa_overall: 3.30
  gpa_trend: flat

  major_bucket: undecided
  systems_considered: [uc, csu]

  campus_targets_uc: []

  willing_prioritize_gpa_over_rigor: false
  willing_summer_academics: false
  willing_reduce_ecs: false
  open_to_cc_pathways: false

  senior_course_signals: []

expected:
  band: C
  time: late
  success_template: cc_transfer_refused

  viable_must_include:
    - CSU
    - CC to UC as primary pathway
    - CC to CSU

  notes_must_include:
    - Lack of a defined major increases risk at this GPA band
    - Transfer remains the most reliable lever
