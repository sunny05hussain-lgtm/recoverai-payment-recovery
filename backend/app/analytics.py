from fastapi import APIRouter

from backend.app.routes import load_payments


router = APIRouter(
    prefix="/api/analytics",
    tags=["analytics"],
)


@router.get("/summary")
def get_summary():
    payments = load_payments()

    total_payments = len(payments)
    recovered_payments = [
        payment for payment in payments
        if payment["is_recovered"]
    ]

    total_revenue_at_risk = sum(
        payment["amount"]
        for payment in payments
    )

    total_revenue_recovered = sum(
        payment["recovered_amount"]
        for payment in payments
    )

    recovery_rate = 0.0

    if total_payments > 0:
        recovery_rate = (
            len(recovered_payments)
            / total_payments
        ) * 100

    return {
        "total_payments": total_payments,
        "recovered_payments": len(recovered_payments),
        "failed_or_unrecovered_payments": (
            total_payments - len(recovered_payments)
        ),
        "revenue_at_risk": total_revenue_at_risk,
        "revenue_recovered": total_revenue_recovered,
        "recovery_rate_percent": round(
            recovery_rate,
            2,
        ),
        "currency": "INR",
    }