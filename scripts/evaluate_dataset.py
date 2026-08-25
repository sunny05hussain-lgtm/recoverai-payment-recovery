import csv
from collections import defaultdict
from pathlib import Path


DATA_FILE = (
    Path(__file__).resolve().parents[1]
    / "data"
    / "payments.csv"
)


def load_rows():
    with DATA_FILE.open(
        "r",
        encoding="utf-8",
        newline="",
    ) as file:
        rows = list(csv.DictReader(file))

    for row in rows:
        row["amount"] = int(row["amount"])
        row["recovered_amount"] = int(
            row["recovered_amount"]
        )
        row["attempt_number"] = int(
            row["attempt_number"]
        )
        row["is_recovered"] = (
            row["is_recovered"].lower() == "true"
        )

    return rows


def percentage(part, whole):
    if whole == 0:
        return 0.0

    return round((part / whole) * 100, 2)


def main():
    rows = load_rows()
    holdout = [
        row for row in rows
        if row["split"] == "holdout"
    ]

    recovered = [
        row for row in holdout
        if row["is_recovered"]
    ]

    total_amount = sum(
        row["amount"]
        for row in holdout
    )

    recovered_amount = sum(
        row["recovered_amount"]
        for row in holdout
    )

    suspected_fraud = [
        row for row in holdout
        if row["failure_code"] == "suspected_fraud"
    ]

    average_attempts = (
        sum(row["attempt_number"] for row in holdout)
        / len(holdout)
    )

    by_failure = defaultdict(list)

    for row in holdout:
        by_failure[row["failure_code"]].append(row)

    print("# RecoverAI Evaluation Results")
    print()
    print("## Dataset")
    print()
    print(f"- Total records: {len(rows)}")
    print(f"- Holdout records: {len(holdout)}")
    print("- Dataset type: Synthetic")
    print("- Holdout split: 20%")
    print()
    print("## Overall metrics")
    print()
    print(f"- Holdout amount at risk: Rs.{total_amount:,}")
    print(
        f"- Holdout amount recovered: Rs.{recovered_amount:,}"
    )
    print(
        f"- Recovered payment records: {len(recovered)}"
    )
    print(
        "- Recovery rate: "
        f"{percentage(len(recovered), len(holdout))}%"
    )
    print(
        f"- Average attempts: {average_attempts:.2f}"
    )
    print(
        "- Suspected-fraud records: "
        f"{len(suspected_fraud)}"
    )
    print()
    print("## Metrics by failure reason")
    print()
    print(
        "| Failure reason | Records | Recovered | "
        "Recovery rate | Recovered amount |"
    )
    print(
        "|---|---:|---:|---:|---:|"
    )

    for failure_code in sorted(by_failure):
        group = by_failure[failure_code]
        group_recovered = [
            row for row in group
            if row["is_recovered"]
        ]

        group_amount = sum(
            row["recovered_amount"]
            for row in group
        )

        rate = percentage(
            len(group_recovered),
            len(group),
        )

        print(
            f"| {failure_code} | {len(group)} | "
            f"{len(group_recovered)} | {rate}% | "
            f"Rs.{group_amount:,} |"
        )


if __name__ == "__main__":
    main()