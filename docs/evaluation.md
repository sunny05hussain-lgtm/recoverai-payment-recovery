# Evaluation plan

The final evaluation will use the held-out records in `data/payments.csv`.

## Metrics

- Failure classification accuracy
- Recovery recommendation precision
- Recovery rate
- Total recovered amount
- False-positive rate
- Average attempts before recovery
- Percentage of workflows stopped by safety rules
- Number of unsafe actions executed

## Evaluation rule

Metrics must be calculated from the generated dataset and recorded with the random seed, dataset version, and evaluation split. No manually selected examples will be used as the only evidence of performance.
