"use client";

import { useEffect, useState } from "react";

interface Registration {
  id: string;
  created_at: string;
  parent_name: string;
  parent_email: string;
  phone: string | null;
  children_count: number;
  children_info: string | null;
  notes: string | null;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [regs, setRegs] = useState<Registration[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/registrations");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load registrations");
        }
        setRegs(data.registrations || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="page-main">
      <h1>Admin · Registrations</h1>
      <p style={{ fontSize: "0.9rem", opacity: 0.85 }}>
        Simple internal view of parents who registered for early access.
      </p>

      {loading && <p>Loading registrations…</p>}
      {error && <p style={{ color: "salmon" }}>{error}</p>}

      {!loading && !error && regs.length === 0 && (
        <p>No registrations yet.</p>
      )}

      {!loading && regs.length > 0 && (
        <div
          style={{
            marginTop: 16,
            borderRadius: 12,
            border: "1px solid rgba(148,163,184,0.5)",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "rgba(15,23,42,0.9)",
                }}
              >
                <th style={{ padding: 8, textAlign: "left" }}>When</th>
                <th style={{ padding: 8, textAlign: "left" }}>Parent</th>
                <th style={{ padding: 8, textAlign: "left" }}>Email</th>
                <th style={{ padding: 8, textAlign: "left" }}>Phone</th>
                <th style={{ padding: 8, textAlign: "left" }}>Children</th>
                <th style={{ padding: 8, textAlign: "left" }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {regs.map((r) => (
                <tr
                  key={r.id}
                  style={{
                    borderTop: "1px solid rgba(148,163,184,0.3)",
                  }}
                >
                  <td style={{ padding: 8 }}>
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: 8 }}>{r.parent_name}</td>
                  <td style={{ padding: 8 }}>{r.parent_email}</td>
                  <td style={{ padding: 8 }}>{r.phone || "-"}</td>
                  <td style={{ padding: 8 }}>{r.children_count}</td>
                  <td style={{ padding: 8 }}>
                    {r.children_info || "-"}
                    {r.notes && (
                      <div
                        style={{
                          marginTop: 4,
                          opacity: 0.8,
                          fontStyle: "italic",
                        }}
                      >
                        {r.notes}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
