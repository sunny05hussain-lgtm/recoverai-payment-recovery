# RecoverAI Evaluation Results

## Dataset

- Total records: 1000
- Holdout records: 200
- Dataset type: Synthetic
- Holdout split: 20%

## Overall metrics

- Holdout amount at risk: Rs.2,184,780
- Holdout amount recovered: Rs.1,119,944
- Recovered payment records: 97
- Recovery rate: 48.5%
- Average attempts: 1.68
- Suspected-fraud records: 11

## Metrics by failure reason

| Failure reason | Records | Recovered | Recovery rate | Recovered amount |
|---|---:|---:|---:|---:|
| authentication_failure | 31 | 13 | 41.94% | Rs.107,793 |
| bank_timeout | 40 | 27 | 67.5% | Rs.240,583 |
| daily_limit_exceeded | 12 | 7 | 58.33% | Rs.78,496 |
| expired_card | 22 | 18 | 81.82% | Rs.155,987 |
| insufficient_funds | 40 | 11 | 27.5% | Rs.180,494 |
| invalid_account | 17 | 1 | 5.88% | Rs.7,500 |
| suspected_fraud | 11 | 1 | 9.09% | Rs.12,000 |
| technical_error | 27 | 19 | 70.37% | Rs.337,091 |
