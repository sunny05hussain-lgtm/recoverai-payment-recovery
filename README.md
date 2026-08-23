# RecoverAI - Payment Failure Recovery Agent

RecoverAI is an explainable AI workflow that classifies failed payments, recommends bounded recovery actions, simulates those actions on synthetic data, and reports measurable revenue recovered.

This project is being built for the Razorpay AI Buildathon under the **AI Revenue Recovery** track.

## Problem

Merchants lose revenue when failed payments, checkout abandonment, and subscription failures are not followed up intelligently. A useful system must do more than identify a failed payment: it must diagnose the likely reason, choose an appropriate intervention, apply safety limits, and measure the outcome.

## Day 1 scope

- Build only with synthetic payment data.
- Represent payment failures and recovery outcomes in a reproducible CSV dataset.
- Keep all recovery actions simulated.
- Never expose real customer information or real payment credentials.
- Make every AI recommendation explainable and subject to deterministic safety rules.

## Planned workflow

```text
Failed payment -> Failure diagnosis -> Recovery recommendation
       -> Safety validation -> Simulated action -> Outcome and audit log
```

## Repository layout

```text
backend/       Future FastAPI service
data/          Synthetic datasets
docs/          Architecture, decisions, and evaluation notes
frontend/      Future dashboard
demo/          5-minute video script and demo notes
scripts/       Reproducible data-generation utilities
```

## Day 1 setup

From the repository root:

```bash
python scripts/generate_dataset.py
```

The command creates `data/payments.csv` with 1,000 synthetic payment records.

To inspect the generated data:

```bash
python -c "import csv; rows=list(csv.DictReader(open('data/payments.csv'))); print(len(rows)); print(rows[0])"
```

## Planned stack

- Backend: Python and FastAPI
- Frontend: Next.js and TypeScript
- Database: SQLite during development
- AI: structured JSON classification and recommendation
- Charts: Recharts
- Deployment: frontend and backend deployed separately

## Safety principles

The AI will suggest an action; it will not execute an unrestricted financial action. Deterministic rules will reject or limit recommendations when:

- the failure is suspected fraud;
- the payment has already reached the retry limit;
- the amount requires manual approval; or
- the model response is invalid or too uncertain.

## Current status

Day 1 foundation: scope, decisions, repository structure, and synthetic data generation.

## Disclaimer

This is a student project using synthetic data and simulated outcomes. It is not connected to production Razorpay systems and is not suitable for making real financial decisions.
