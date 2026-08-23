import csv
from pathlib import Path

from fastapi import APIRouter, HTTPException, Query


router = APIRouter(prefix="/api", tags=["payments"])

DATA_FILE = (
    Path(__file__).resolve().parents[2]
    / "data"
    / "payments.csv"
)


def load_payments() -> list[dict]:
    if not DATA_FILE.exists():
        raise FileNotFoundError(
            f"Payment data was not found at {DATA_FILE}"
        )

    with DATA_FILE.open("r", encoding="utf-8", newline="") as file:
        payments = list(csv.DictReader(file))

    for payment in payments:
        payment["amount"] = int(payment["amount"])
        payment["attempt_number"] = int(payment["attempt_number"])
        payment["recovered_amount"] = int(payment["recovered_amount"])
        payment["is_recovered"] = payment["is_recovered"].lower() == "true"

    return payments


@router.get("/payments")
def get_payments(
    limit: int = Query(default=20, ge=1, le=100),
):
    payments = load_payments()

    return {
        "count": len(payments),
        "returned": min(limit, len(payments)),
        "payments": payments[:limit],
    }


@router.get("/payments/{payment_id}")
def get_payment(payment_id: str):
    payments = load_payments()

    for payment in payments:
        if payment["payment_id"] == payment_id:
            return payment

    raise HTTPException(
        status_code=404,
        detail=f"Payment {payment_id} was not found",
    )