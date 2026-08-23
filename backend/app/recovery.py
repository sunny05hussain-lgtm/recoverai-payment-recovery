import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

from backend.app.routes import load_payments
from backend.app.services.decision_engine import (
    decide_recovery,
)
from backend.app.services.simulator import (
    simulate_recovery,
)


router = APIRouter(
    prefix="/api/recovery",
    tags=["recovery"],
)


AUDIT_FILE = (
    Path(__file__).resolve().parents[2]
    / "data"
    / "audit_log.jsonl"
)


def find_payment(payment_id: str) -> dict:
    payments = load_payments()

    for payment in payments:
        if payment["payment_id"] == payment_id:
            return payment

    raise HTTPException(
        status_code=404,
        detail=f"Payment {payment_id} was not found",
    )


@router.get("/preview/{payment_id}")
def preview_recovery(payment_id: str):
    payment = find_payment(payment_id)

    return decide_recovery(payment)


@router.post("/simulate/{payment_id}")
def run_simulated_recovery(payment_id: str):
    payment = find_payment(payment_id)
    decision = decide_recovery(payment)

    result = simulate_recovery(
        payment,
        decision,
    )

    return {
        "decision": decision,
        "simulation": result,
    }


@router.get("/audit-log")
def get_audit_log():
    if not AUDIT_FILE.exists():
        return {
            "count": 0,
            "entries": [],
        }

    entries = []

    with AUDIT_FILE.open(
        "r",
        encoding="utf-8",
    ) as file:
        for line in file:
            if line.strip():
                entries.append(json.loads(line))

    return {
        "count": len(entries),
        "entries": entries,
    }