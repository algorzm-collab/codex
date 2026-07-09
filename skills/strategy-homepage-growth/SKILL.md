---
name: strategy-homepage-growth
description: Build and improve a growth-oriented consulting homepage that turns visitor symptoms into diagnosis, proof, inquiry, and learning.
---

# Strategy Homepage Growth Skill

Use this skill when building or improving a premium consulting homepage whose goal is not simple company introduction, but inquiry conversion through problem recognition, proof, and learning.

## Core Thesis

A consulting homepage should behave like a growth product.

```text
Problem hook -> lightweight diagnosis -> relevant proof -> inquiry CTA -> event learning -> next experiment
```

The homepage quality affects perceived company quality. UI execution, motion, typography, and publishing polish are part of the trust layer, not decoration.

## What Worked

### 1. Symptom-first entry

Visitors engage faster when the first action uses their language:

- "The report exists but execution does not happen."
- "No one knows which department owns the work."
- "There are too many KPIs, but no clear priority."

Avoid starting with consulting jargon such as strategy system, organization redesign, or performance management. Translate symptoms into consulting domains only after the visitor selects a problem.

### 2. Lightweight Issue Finder

The diagnostic flow should be short enough to feel like a mirror, not a survey.

Recommended:

- 3 steps
- one-click options
- no file upload
- no long-form questionnaire
- result before contact request

The result must sound hypothetical, not final:

- "This appears close to..."
- "A likely consulting approach is..."
- "We can clarify the scope in consultation."

### 3. Proof after diagnosis

Case studies should not be a flat list. They should prove that similar problems have been solved.

For flagship cases, use:

```text
Client / project
Problem
Approach
Deliverables
Related solution cluster
CTA
```

The STRATEGY MVP used six flagship proof panels:

- Korea Credit Guarantee Fund new vision
- Korea Ocean Business Corporation strategy
- Korea Housing Finance Corporation performance evaluation
- PyeongChang Olympic legacy strategy
- Korea Expressway Corporation future road strategy
- K-UAM / UAM Team Korea response strategy

### 4. Finder-to-proof routing

After diagnosis, route the visitor directly to the most relevant flagship proof.

Example routing:

```text
strategy_org_performance_gap -> proof-1
performance_system_failure -> proof-3
rr_role_confusion -> proof-4
transformation_execution_gap -> proof-6
```

This creates a stronger chain:

```text
My problem -> their interpretation -> relevant evidence -> inquiry
```

### 5. Analytics as learning loop

Track only events that can drive product decisions.

Useful first events:

- `issue_finder_start`
- `issue_result_view`
- `proof_jump_click`
- `case_contact_cta_click`
- `contact_form_start`
- `contact_form_submit`

Admin should show summaries by:

- event name
- inferred problem type
- proof target
- recent events

## What Failed or Needs Care

### 1. A beautiful site can still feel generic

Premium UI alone is not enough. Every motion, canvas, card, and transition must reinforce the strategic product:

- problem structure
- evidence map
- execution system
- consulting credibility

Avoid visual effects that do not help the visitor understand the firm's capability.

### 2. Case lists dilute flagship trust

Large track records prove volume, but they do not create immediate conviction. Put flagship cases first as strong proof panels, then show the full list afterward.

### 3. Data collection can become too heavy

Do not ask for documents, budgets, internal reports, or long answers before value is shown. Contact fields should remain light until the visitor has seen a useful diagnosis/proof result.

### 4. Admin features can sprawl

Admin should focus on:

- content updates
- inquiry records
- issue records
- event learning

Avoid adding complex CRM/payment/auth behavior until there is real operational need.

## Implementation Rules

- Do not add libraries unless the current stack cannot solve the problem.
- Prefer HTML/CSS/vanilla JS for lightweight publishing.
- Use progressive enhancement:
  - scroll animations
  - pointer-responsive hero
  - sticky proof panels
  - `prefers-reduced-motion`
  - responsive constraints
- Keep DB/schema changes limited to clearly necessary product learning.
- Never expose local secrets or SQLite data in GitHub.

## Experiment Template

Every improvement should be framed as:

```text
Problem:
Hypothesis:
Change:
Primary metric:
Success criteria:
Rollback signal:
```

## Recommended Next Experiments

1. Admin analytics summary dashboard
2. Case-to-inquiry conversion report
3. Segment-specific hero copy
4. Mobile first-viewport compression
5. Flagship case detail pages
6. Weekly CEO report from analytics events

