# Architecture - initial design

## Components

1. **Dashboard** - displays failed payments, recovery workflows, and metrics.
2. **FastAPI backend** - exposes payment, recovery, and analytics endpoints.
3. **Classifier** - maps a payment failure to a normalized failure category and confidence.
4. **Decision engine** - chooses a bounded recovery action.
5. **Safety rules** - rejects unsafe, invalid, or over-limit actions.
6. **Simulator** - produces a reproducible recovery outcome without touching real payment systems.
7. **Audit log** - records every recommendation, rule check, action, and result.

## Data flow

```text
Dashboard
    |
    v
FastAPI API --> Classifier --> Decision engine --> Safety rules
    ^                                                |
    |                                                v
    +---------------- Analytics <-- Simulator <-- Audit log
```

## Safety boundary

The model never directly sends a message, retries a payment, or moves money. It returns a structured recommendation. The decision engine validates it, and only the simulator executes an approved action.

## Planned audit fields

`decision_id`, `payment_id`, `model_name`, `input_summary`, `output`, `confidence`, `rule_checks`, `approved`, `executed_action`, and `timestamp`.
