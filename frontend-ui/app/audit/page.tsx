"use client";

import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

type AuditEntry = {
  payment_id: string;
  action: string;
  execution_status: string;
  outcome: string;
  amount: number;
  recovered_amount: number;
  timestamp: string;
};

export default function AuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAuditLog() {
      try {
        const response = await fetch(
          `${API_URL}/api/recovery/audit-log`
        );

        if (!response.ok) {
          throw new Error("Could not load the audit log.");
        }

        const data = await response.json();
        setEntries(data.entries);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Could not load audit records."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAuditLog();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
          RecoverAI
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Recovery Audit Log
        </h1>

        <p className="mt-3 text-slate-400">
          A record of simulated recovery actions and safety decisions.
        </p>

        {loading && (
          <p className="mt-8 text-slate-300">
            Loading audit records...
          </p>
        )}

        {error && (
          <p className="mt-8 rounded-lg bg-red-400/10 p-4 text-red-300">
            {error}
          </p>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
            No audit records exist yet. Run a recovery simulation first.
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 px-6 py-5">
              <h2 className="text-lg font-semibold">
                {entries.length} audit record
                {entries.length === 1 ? "" : "s"}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-300">
                  <tr>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Execution</th>
                    <th className="px-6 py-4">Outcome</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Time</th>
                  </tr>
                </thead>

                <tbody>
                  {entries.map((entry, index) => (
                    <tr
                      key={`${entry.payment_id}-${entry.timestamp}-${index}`}
                      className="border-t border-slate-800"
                    >
                      <td className="px-6 py-4 font-medium">
                        {entry.payment_id}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {entry.action}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={
                            entry.execution_status === "blocked"
                              ? "rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-400"
                              : "rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-400"
                          }
                        >
                          {entry.execution_status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {entry.outcome}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        ₹{entry.amount.toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(entry.timestamp).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}