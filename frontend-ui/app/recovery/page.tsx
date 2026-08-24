"use client";

import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

type RecoveryDecision = {
  payment_id: string;
  recommended_action: string;
  final_action: string;
  approved: boolean;
  reason: string;
  confidence: number;
  safety_checks: string[];
};

export default function RecoveryPage() {
  const [paymentId, setPaymentId] = useState("pay_000001");
  const [decision, setDecision] =
    useState<RecoveryDecision | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function previewRecovery() {
    setLoading(true);
    setError("");
    setDecision(null);

    try {
      const response = await fetch(
        `${API_URL}/api/recovery/preview/${paymentId}`
      );

      if (!response.ok) {
        throw new Error("Payment was not found.");
      }

      const data = await response.json();
      setDecision(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not load recovery decision."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
          RecoverAI
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Recovery Preview
        </h1>

        <p className="mt-3 text-slate-400">
          Preview a safe recovery recommendation for a payment.
        </p>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <label
            htmlFor="paymentId"
            className="block text-sm font-medium text-slate-300"
          >
            Payment ID
          </label>

          <div className="mt-3 flex gap-3">
            <input
              id="paymentId"
              value={paymentId}
              onChange={(event) =>
                setPaymentId(event.target.value)
              }
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="pay_000001"
            />

            <button
              onClick={previewRecovery}
              disabled={loading || !paymentId}
              className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Loading..." : "Preview"}
            </button>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-400/10 p-4 text-red-300">
              {error}
            </p>
          )}
        </section>

        {decision && (
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Decision for {decision.payment_id}
              </h2>

              <span
                className={
                  decision.approved
                    ? "rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-400"
                    : "rounded-full bg-amber-400/10 px-3 py-1 text-sm text-amber-400"
                }
              >
                {decision.approved
                  ? "Approved"
                  : "Blocked or requires review"}
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Info
                label="Recommended action"
                value={decision.recommended_action}
              />

              <Info
                label="Final action"
                value={decision.final_action}
              />

              <Info
                label="Confidence"
                value={`${Math.round(
                  decision.confidence * 100
                )}%`}
              />

              <Info
                label="Safety checks"
                value={decision.safety_checks.join(", ")}
              />
            </div>

            <div className="mt-6 rounded-lg bg-slate-950 p-4">
              <p className="text-sm text-slate-400">
                Explanation
              </p>

              <p className="mt-2 text-slate-200">
                {decision.reason}
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-800 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 font-medium text-white">{value}</p>
    </div>
  );
}