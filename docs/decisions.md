# Project decisions

## Decision 1: Track

**Chosen track:** AI Revenue Recovery.

**Reason:** The project can demonstrate a complete measurable loop: detect failed revenue, diagnose the cause, choose an intervention, simulate the result, and calculate recovered money.

## Decision 2: First product

**Chosen product:** Payment Failure Recovery Agent.

**Reason:** Payment failures are easy to represent safely with synthetic data and produce clear business metrics. The project can show both successful recovery and deliberate refusal to act.

## Decision 3: Synthetic data only

No real customer, card, bank, or Razorpay production data will be used. This avoids privacy and security risks and makes the evaluation reproducible.

## Decision 4: Simulated actions

The first version will simulate payment-link messages, retry scheduling, and manual-review routing. It will not call real payment APIs or send real customer communications.

## Decision 5: AI plus deterministic controls

The AI will classify and recommend. A deterministic decision engine will validate the recommendation, enforce retry limits, stop suspicious cases, and require approval for high-value payments.

## Decision 6: Held-out evaluation

The dataset will contain a reproducible split marker. Development records will be used while building; held-out records will be reserved for final evaluation so that metrics are not cherry-picked.
