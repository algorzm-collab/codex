# Reporting Standard
Version: 0.1

## Purpose

The CEO should not need to read developer detail to understand the status of work.

Every meaningful shift should end with three reports.

## CEO Report

Audience: CEO / strategic owner.

Include only:

- what changed
- why it matters
- decisions needed
- risks that matter
- recommended next action

Avoid:

- command logs
- low-level implementation detail
- exhaustive file lists
- technical noise

## CTO Report

Audience: CTO / architecture owner.

Include:

- design judgment
- tradeoffs
- governance implications
- system-level risks
- architecture debt
- next sprint recommendation

## Developer Report

Audience: implementation agent.

Include:

- files changed
- commands run
- verification performed
- test gaps
- exact next implementation steps
- known local state

## Default Ordering

Reports should appear in this order:

1. CEO Report
2. CTO Report
3. Developer Report

## CEO Attention Rule

The CEO Report must be sufficient on its own.

The CEO should not need to read the CTO Report or Developer Report unless they choose to inspect deeper.

