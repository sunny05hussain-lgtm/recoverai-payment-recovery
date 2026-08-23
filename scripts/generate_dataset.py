"""Generate reproducible synthetic payment data for RecoverAI.

This script intentionally uses only the Python standard library and creates no
real customer, card, bank, or Razorpay data.
"""

from __future__ import annotations

import csv
import random
from datetime import datetime, timedelta, timezone
from pathlib import Path


SEED = 20260822
ROW_COUNT = 1_000
DEV_COUNT = 800
OUTPUT = Path(__file__).resolve().parents[1] / "data" / "payments.csv"

FAILURES = [
    ("insufficient_funds", "Insufficient funds", 0.20),
    ("expired_card", "Expired card", 0.14),
    ("bank_timeout", "Bank timeout", 0.18),
    ("authentication_failure", "Authentication failure", 0.12),
    ("invalid_account", "Invalid account", 0.08),
    ("daily_limit_exceeded", "Daily limit exceeded", 0.08),
    ("suspected_fraud", "Suspected fraud", 0.05),
    ("technical_error", "Unknown technical error", 0.15),
]

METHODS = ["upi", "card", "netbanking", "wallet"]
SEGMENTS = ["new_customer", "returning_customer", "business_customer", "subscription"]


def weighted_failure(rng: random.Random) -> tuple[str, str]:
    roll = rng.random()
    total = 0.0
    for code, message, probability in FAILURES:
        total += probability
        if roll <= total:
            return code, message
    return FAILURES[-1][0], FAILURES[-1][1]


def recovery_probability(failure_code: str, attempt_number: int, segment: str) -> float:
    base = {
        "expired_card": 0.78,
        "bank_timeout": 0.68,
        "technical_error": 0.62,
        "authentication_failure": 0.45,
        "insufficient_funds": 0.40,
        "daily_limit_exceeded": 0.35,
        "invalid_account": 0.08,
        "suspected_fraud": 0.02,
    }[failure_code]
    segment_bonus = 0.08 if segment in {"returning_customer", "business_customer"} else 0.0
    attempt_penalty = max(0, attempt_number - 1) * 0.10
    return max(0.01, min(0.95, base + segment_bonus - attempt_penalty))


def generate_rows() -> list[dict[str, object]]:
    rng = random.Random(SEED)
    start = datetime(2026, 1, 1, tzinfo=timezone.utc)
    rows: list[dict[str, object]] = []

    for index in range(ROW_COUNT):
        failure_code, failure_message = weighted_failure(rng)
        segment = rng.choice(SEGMENTS)
        amount = rng.choice([499, 799, 999, 1499, 1999, 2999, 4999, 7500, 12000, 25000, 50000])
        attempt_number = rng.choices([1, 2, 3, 4], weights=[0.57, 0.25, 0.13, 0.05])[0]
        is_holdout = index >= DEV_COUNT
        recovered = rng.random() < recovery_probability(failure_code, attempt_number, segment)
        recovered_amount = amount if recovered else 0
        created_at = start + timedelta(minutes=rng.randint(0, 60 * 24 * 180))

        rows.append(
            {
                "payment_id": f"pay_{index + 1:06d}",
                "customer_id": f"cus_{rng.randint(1, 420):05d}",
                "amount": amount,
                "currency": "INR",
                "payment_method": rng.choice(METHODS),
                "failure_code": failure_code,
                "failure_message": failure_message,
                "attempt_number": attempt_number,
                "customer_segment": segment,
                "created_at": created_at.isoformat().replace("+00:00", "Z"),
                "is_recovered": str(recovered).lower(),
                "recovered_amount": recovered_amount,
                "split": "holdout" if is_holdout else "development",
                "dataset_seed": SEED,
            }
        )
    return rows


def main() -> None:
    rows = generate_rows()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    print(f"Generated {len(rows)} rows at {OUTPUT}")
    print(f"Development rows: {sum(row['split'] == 'development' for row in rows)}")
    print(f"Holdout rows: {sum(row['split'] == 'holdout' for row in rows)}")
    print(f"Recovered rows: {sum(row['is_recovered'] == 'true' for row in rows)}")


if __name__ == "__main__":
    main()
