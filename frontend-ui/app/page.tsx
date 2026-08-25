"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Payment = {
  payment_id: string;
  customer_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  failure_code: string;
  failure_message: string;
  attempt_number: number;
  is_recovered: boolean;
};

type Analytics = {
  total_payments: number;
  recovered_payments: number;
  failed_or_unrecovered_payments: number;
  revenue_at_risk: number;
  revenue_recovered: number;
  recovery_rate_percent: number;
  currency: string;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Home() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [analyticsResponse, paymentsResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/analytics/summary`),
            fetch(`${API_URL}/api/payments?limit=10`),
          ]);

        if (!analyticsResponse.ok || !paymentsResponse.ok) {
          throw new Error("The backend returned an error.");
        }

        const analyticsData = await analyticsResponse.json();
        const paymentsData = await paymentsResponse.json();

        setAnalytics(analyticsData);
        setPayments(paymentsData.payments);
      } catch {
        setError(
          "Could not connect to the backend. Confirm that FastAPI is running on port 8000."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading RecoverAI...
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-center text-red-300">
        {error}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">
            RecoverAI
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Payment Recovery Dashboard
          </h1>

          <p className="mt-3 text-slate-400">
            Monitor failed payments, recovery progress, and revenue at risk.
          </p>
<Link
  href="/recovery"
  className="mt-6 inline-block rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
>
  Open Recovery Preview
</Link>
<Link
  href="/audit"
  className="ml-3 inline-block rounded-lg border border-slate-700 px-5 py-3 font-semibold text-slate-200 hover:border-cyan-400 hover:text-cyan-400"
>
  View Audit Log
</Link>
<Link
  href="/simulation"
  className="ml-3 inline-block rounded-lg border border-emerald-400 px-5 py-3 font-semibold text-emerald-400 hover:bg-emerald-400 hover:text-slate-950"
>
  Run Simulation
</Link>
        </div>

        {analytics && (
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Total payments"
              value={analytics.total_payments.toLocaleString("en-IN")}
            />

            <MetricCard
              label="Recovered payments"
              value={analytics.recovered_payments.toLocaleString("en-IN")}
              accent="text-emerald-400"
            />

            <MetricCard
              label="Revenue at risk"
              value={formatCurrency(analytics.revenue_at_risk)}
              accent="text-amber-400"
            />

            <MetricCard
              label="Revenue recovered"
              value={formatCurrency(analytics.revenue_recovered)}
              accent="text-cyan-400"
            />
          </section>
        )}

        {analytics && (
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Recovery performance
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Percentage of payment records marked as recovered.
                </p>
              </div>

              <span className="text-3xl font-bold text-emerald-400">
                {analytics.recovery_rate_percent}%
              </span>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{
                  width: `${Math.min(
                    analytics.recovery_rate_percent,
                    100
                  )}%`,
                }}
              />
            </div>
          </section>
        )}

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-lg font-semibold">
              Recent payment records
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Loaded directly from the RecoverAI backend.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-300">
                <tr>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Failure reason</th>
                  <th className="px-6 py-4">Attempts</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.payment_id}
                    className="border-t border-slate-800"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">
                        {payment.payment_id}
                      </div>

                      <div className="text-xs text-slate-500">
                        {payment.customer_id}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {formatCurrency(payment.amount)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-slate-300">
                        {payment.failure_message}
                      </div>

                      <div className="text-xs text-slate-500">
                        {payment.payment_method}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {payment.attempt_number}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={
                          payment.is_recovered
                            ? "rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-400"
                            : "rounded-full bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-400"
                        }
                      >
                        {payment.is_recovered
                          ? "Recovered"
                          : "Unrecovered"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  accent = "text-white",
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}