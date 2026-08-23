ACTION_BY_FAILURE = {
    "insufficient_funds": "retry_later",
    "expired_card": "send_payment_link",
    "bank_timeout": "retry_later",
    "authentication_failure": "send_payment_link",
    "invalid_account": "manual_review",
    "daily_limit_exceeded": "retry_later",
    "suspected_fraud": "manual_review",
    "technical_error": "retry_later",
}

ALLOWED_ACTIONS = {
    "send_payment_link",
    "retry_later",
    "manual_review",
    "manual_approval",
    "stop_workflow",
}


def decide_recovery(
    payment: dict,
    confidence: float = 0.90,
) -> dict:
    failure_code = payment["failure_code"]
    amount = payment["amount"]
    attempt_number = payment["attempt_number"]

    safety_checks = []

    if failure_code == "suspected_fraud":
        return {
            "payment_id": payment["payment_id"],
            "recommended_action": "manual_review",
            "final_action": "manual_review",
            "approved": False,
            "reason": "Suspected fraud cannot be retried automatically.",
            "confidence": confidence,
            "safety_checks": ["fraud_block"],
        }

    if attempt_number >= 3:
        return {
            "payment_id": payment["payment_id"],
            "recommended_action": ACTION_BY_FAILURE.get(
                failure_code,
                "manual_review",
            ),
            "final_action": "stop_workflow",
            "approved": False,
            "reason": "The retry limit has been reached.",
            "confidence": confidence,
            "safety_checks": ["retry_limit"],
        }

    if amount > 50000:
        return {
            "payment_id": payment["payment_id"],
            "recommended_action": ACTION_BY_FAILURE.get(
                failure_code,
                "manual_review",
            ),
            "final_action": "manual_approval",
            "approved": False,
            "reason": "Payments above ₹50,000 require human approval.",
            "confidence": confidence,
            "safety_checks": ["high_value_approval"],
        }

    if confidence < 0.70:
        return {
            "payment_id": payment["payment_id"],
            "recommended_action": ACTION_BY_FAILURE.get(
                failure_code,
                "manual_review",
            ),
            "final_action": "manual_review",
            "approved": False,
            "reason": "The recommendation confidence is too low.",
            "confidence": confidence,
            "safety_checks": ["low_confidence"],
        }

    action = ACTION_BY_FAILURE.get(
        failure_code,
        "manual_review",
    )

    if action not in ALLOWED_ACTIONS:
        action = "manual_review"
        safety_checks.append("unknown_action_blocked")
    else:
        safety_checks.append("action_allowed")

    return {
        "payment_id": payment["payment_id"],
        "recommended_action": action,
        "final_action": action,
        "approved": True,
        "reason": f"Action selected for failure type: {failure_code}.",
        "confidence": confidence,
        "safety_checks": safety_checks,
    }