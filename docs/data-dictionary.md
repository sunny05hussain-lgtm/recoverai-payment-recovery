\# Payment Data Dictionary



Each row in `data/payments.csv` represents one synthetic failed-payment record.



| Field | Meaning | Example | Type |

|---|---|---|---|

| payment\_id | Unique ID for the payment attempt | pay\_000001 | Text |

| customer\_id | Synthetic customer identifier | cus\_00138 | Text |

| amount | Payment amount in rupees | 25000 | Integer |

| currency | Currency of the payment | INR | Text |

| payment\_method | Method used for payment | card | Category |

| failure\_code | Machine-readable failure reason | expired\_card | Category |

| failure\_message | Human-readable failure reason | Expired card | Text |

| attempt\_number | Number of times payment was attempted | 2 | Integer |

| customer\_segment | General synthetic customer category | returning\_customer | Category |

| created\_at | Time when the payment attempt occurred | 2026-01-01T08:19:00Z | Date/time |

| is\_recovered | Whether the payment eventually succeeded | true | Boolean |

| recovered\_amount | Amount eventually recovered in rupees | 25000 | Integer |

| split | Dataset purpose | development | Category |

| dataset\_seed | Seed used to reproduce the dataset | 20260822 | Integer |



\## Important fields



\- `failure\_code` determines the possible recovery action.

\- `attempt\_number` helps enforce retry limits.

\- `amount` helps determine whether human approval is required.

\- `is\_recovered` tells us whether recovery succeeded.

\- `recovered\_amount` is used to calculate revenue recovered.

\- `split` separates development data from holdout evaluation data.



\## Safety interpretation



The system must not automatically retry:



\- suspected fraud;

\- payments that have reached the retry limit;

\- high-value payments requiring manual approval;

\- payments where the AI confidence is too low.

