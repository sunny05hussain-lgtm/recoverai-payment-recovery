from backend.app.services.decision_engine import decide_recovery


def make_payment(
    failure_code="expired_card",
    amount=1999,
    attempt_number=1,
):
    return {
        "payment_id": "pay_test_001",
        "amount": amount,
        "failure_code": failure_code,
        "attempt_number": attempt_number,
    }


def test_expired_card_sends_payment_link():
    result = decide_recovery(make_payment())

    assert result["final_action"] == "send_payment_link"
    assert result["approved"] is True


def test_suspected_fraud_goes_to_manual_review():
    payment = make_payment(
        failure_code="suspected_fraud",
    )

    result = decide_recovery(payment)

    assert result["final_action"] == "manual_review"
    assert result["approved"] is False


def test_retry_limit_stops_workflow():
    payment = make_payment(
        failure_code="technical_error",
        attempt_number=3,
    )

    result = decide_recovery(payment)

    assert result["final_action"] == "stop_workflow"
    assert result["approved"] is False


def test_high_value_payment_requires_approval():
    payment = make_payment(amount=75000)

    result = decide_recovery(payment)

    assert result["final_action"] == "manual_approval"
    assert result["approved"] is False


def test_low_confidence_goes_to_manual_review():
    result = decide_recovery(
        make_payment(),
        confidence=0.50,
    )

    assert result["final_action"] == "manual_review"
    assert result["approved"] is False