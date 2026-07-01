# Approval Routing
Version: 0.1

## Purpose

Approval Routing reduces CEO friction while keeping high-impact actions safe.

The system should not ask for approval just because an agent is uncertain. It should ask when authority, risk, or irreversibility requires human judgment.

## Default Rule

Reversible low-risk work proceeds without CEO approval.

High-impact, irreversible, external, financial, credential, production, or reputation-affecting work requires approval.

## Risk Levels

| Level | Description | Default Routing |
|---|---|---|
| 1 | Local, reversible, informational | Auto-execute |
| 2 | Local artifact or doc change | Auto-execute, report after |
| 3 | External write, repo branch/PR, public artifact | CTO review or CEO approval depending on scope |
| 4 | Production, customer-facing, credentials, cost | CEO approval required |
| 5 | Destructive, legal, financial, security-sensitive | CEO approval required, no automation |

## Approval Channels

Preferred order:

1. Mission Control dashboard
2. Google Sheet Approval Inbox
3. Telegram approval buttons
4. GitHub issue comment
5. direct chat

## Approval Request Format

Every approval request must include:

- decision
- recommendation
- reason
- risk level
- reversible or irreversible
- deadline
- default if no response

## Default If No Response

For risk 1-2: proceed.

For risk 3: defer unless delay is clearly more harmful and action is reversible.

For risk 4-5: do not proceed.

## CEO Attention Budget

The system should target no more than three CEO decisions per day unless an emergency exists.

