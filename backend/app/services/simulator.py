import json
from datetime import datetime, timezone
from pathlib import Path


AUDIT_FILE = (
    Path(__file__).resolve().parents[3]
    / "data"
    / "audit_log.jsonl"
)


def simulate_recovery(
    payment: dict,
    decision: dict,
) -> dict:
    action = decision["final_action"]

    if action in {
        "manual_review",
        "manual_approval",
        "stop_workflow",
    }:
        execution_status = "blocked"
    else:
        execution_status = "simulated"

    if execution_status == "simulated":
        outcome = (
            "recovered"
            if payment["is_recovered"]
            else "not_recovered"
        )
    else:
        outcome = "waiting_for_human_action"

    result = {
        "payment_id": payment["payment_id"],
        "action": action,
        "execution_status": execution_status,
        "outcome": outcome,
        "amount": payment["amount"],
        "recovered_amount": (
            payment["recovered_amount"]
            if outcome == "recovered"
            else 0
        ),
        "timestamp": datetime.now(
            timezone.utc
        ).isoformat(),
    }

    AUDIT_FILE.parent.mkdir(parents=True, exist_ok=True)

    with AUDIT_FILE.open(
        "a",
        encoding="utf-8",
    ) as file:
        file.write(
            json.dumps(result)
            + "\n"
        )

    return result