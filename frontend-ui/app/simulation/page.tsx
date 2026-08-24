"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type SimulationResult = {
  decision: {
    recommended_action: string;
    final_action: string;
    approved: boolean;
    reason: string;
    safety_checks: string[];
  };
  simulation: {
    payment_id: string;
    action: string;
    execution_status: string;
    outcome: string;
    amount: number;
    recovered_amount: number;
    timestamp: string;
  };
};

export default function SimulationPage() {
  const [paymentId, setPaymentId] = useState("pay_000001");
  const [result, setResult] =
    useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runSimulation() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `${API_URL}/api/recovery/simulate/${paymentId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Payment was not found.");
      }

      const data = await response.json();
      setResult(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not run simulation."
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
          Simulated Recovery
        </h1>

        <p className="mt-3 text-slate-400">
          Execute a safe simulation and record the result in the audit log.
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
              onClick={runSimulation}
              disabled={loading || !paymentId}
              className="rounded-lg bg-emerald-400 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Running..." : "Simulate"}
            </button>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-400/10 p-4 text-red-300">
              {error}
            </p>
          )}
        </section>

        {result && (
          <section className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">
                Simulation result
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Info
                  label="Payment"
                  value={result.simulation.payment_id}
                />

                <Info
                  label="Action"
                  value={result.simulation.action}
                />

                <Info
                  label="Execution status"
                  value={result.simulation.execution_status}
                />

                <Info
                  label="Outcome"
                  value={result.simulation.outcome}
                />

                <Info
                  label="Amount"
                  value={`₹${result.simulation.amount.toLocaleString(
                    "en-IN"
                  )}`}
                />

                <Info
                  label="Recovered amount"
                  value={`₹${result.simulation.recovered_amount.toLocaleString(
                    "en-IN"
                  )}`}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">
                Safety decision
              </h2>

              <p className="mt-4 text-slate-300">
                Recommended action:{" "}
                <strong>
                  {result.decision.recommended_action}
                </strong>
              </p>

              <p className="mt-2 text-slate-300">
                Final action:{" "}
                <strong>{result.decision.final_action}</strong>
              </p>

              <p className="mt-2 text-slate-300">
                Approved:{" "}
                <strong>
                  {result.decision.approved ? "Yes" : "No"}
                </strong>
              </p>

              <p className="mt-4 rounded-lg bg-slate-950 p-4 text-slate-300">
                {result.decision.reason}
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