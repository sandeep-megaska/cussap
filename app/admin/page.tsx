"use client";

import { useEffect, useMemo, useState } from "react";

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

interface AdminStats {
  totalRegistrations: number;
  totalSessions: number;
  uniqueParents: number;
}

type AdminTab = "overview" | "registrations";

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("overview");

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [regs, setRegs] = useState<Registration[]>([]);
  const [regsLoading, setRegsLoading] = useState(true);
  const [regsError, setRegsError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const res = await fetch("/api/admin-stats");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load stats");
        }
        setStats(data);
      } catch (err: any) {
        console.error(err);
        setStatsError(err.message || "Error loading stats");
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, []);

  // Load registrations
  useEffect(() => {
    const loadRegs = async () => {
      setRegsLoading(true);
      setRegsError(null);
      try {
        const res = await fetch("/api/registrations");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load registrations");
        }
        setRegs(data.registrations || []);
      } catch (err: any) {
        console.error(err);
        setRegsError(err.message || "Error loading data");
      } finally {
        setRegsLoading(false);
      }
    };
    loadRegs();
  }, []);

  const filteredRegs = useMemo(() => {
    if (!search.trim()) return regs;
    const q = search.trim().toLowerCase();
    return regs.filter((r) => {
      return (
        r.parent_name.toLowerCase().includes(q) ||
        r.parent_email.toLowerCase().includes(q) ||
        (r.children_info || "").toLowerCase().includes(q)
      );
    });
  }, [regs, search]);

  const copyToClipboard = (text: string) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Clipboard error:", err);
    });
  };

  return (
    <main className="page-main">
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div className="badge-tagline">
            <span className="badge-tagline-dot" />
            Internal · Admin only
          </div>
          <h1 style={{ marginBottom: 4 }}>CUSSAP Admin Dashboard</h1>
          <p style={{ fontSize: "0.9rem", opacity: 0.85 }}>
            View and manage registrations and quiz usage. This page is not
            for public users.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "inline-flex",
          borderRadius: 999,
          border: "1px solid rgba(148,163,184,0.5)",
          padding: 2,
          marginBottom: 16,
        }}
      >
        <button
          type="button"
          onClick={() => setTab("overview")}
          style={{
            borderRadius: 999,
            border: "none",
            padding: "6px 14px",
            fontSize: "0.85rem",
            cursor: "pointer",
            backgroundColor:
              tab === "overview"
                ? "rgba(15,23,42,0.95)"
                : "transparent",
            color: "#e5e7eb",
          }}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setTab("registrations")}
          style={{
            borderRadius: 999,
            border: "none",
            padding: "6px 14px",
            fontSize: "0.85rem",
            cursor: "pointer",
            backgroundColor:
              tab === "registrations"
                ? "rgba(15,23,42,0.95)"
                : "transparent",
            color: "#e5e7eb",
          }}
        >
          Registrations
        </button>
      </div>

      {/* TAB CONTENT */}
      {tab === "overview" && (
        <section>
          <h2 style={{ marginBottom: 12 }}>Snapshot</h2>

          {statsLoading && <p>Loading stats…</p>}
          {statsError && (
            <p style={{ color: "salmon" }}>{statsError}</p>
          )}

          {!statsLoading && !statsError && stats && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              <div className="admin-card">
                <div className="admin-card-label">
                  Total registrations
                </div>
                <div className="admin-card-value">
                  {stats.totalRegistrations}
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-label">
                  Unique parent emails
                </div>
                <div className="admin-card-value">
                  {stats.uniqueParents}
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-label">
                  Total quiz sessions
                </div>
                <div className="admin-card-value">
                  {stats.totalSessions}
                </div>
              </div>
            </div>
          )}

          <p
            style={{
              marginTop: 16,
              fontSize: "0.85rem",
              opacity: 0.8,
            }}
          >
            Later we can expand this with breakdowns: sessions per class,
            subject popularity, average scores per chapter, etc. For now it
            gives a quick health check of adoption.
          </p>
        </section>
      )}

      {tab === "registrations" && (
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            <h2>Parent registrations</h2>

            <input
              type="text"
              placeholder="Search by parent name, email, or child info…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                minWidth: 220,
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.7)",
                background: "rgba(15,23,42,0.95)",
                color: "#e5e7eb",
                padding: "6px 12px",
                fontSize: "0.85rem",
              }}
            />
          </div>

          {regsLoading && <p>Loading registrations…</p>}
          {regsError && (
            <p style={{ color: "salmon" }}>{regsError}</p>
          )}

          {!regsLoading && !regsError && filteredRegs.length === 0 && (
            <p>No registrations found.</p>
          )}

          {!regsLoading && filteredRegs.length > 0 && (
            <div
              style={{
                marginTop: 8,
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
                  minWidth: 600,
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "rgba(15,23,42,0.9)",
                    }}
                  >
                    <th className="admin-th">When</th>
                    <th className="admin-th">Parent</th>
                    <th className="admin-th">Email</th>
                    <th className="admin-th">Phone</th>
                    <th className="admin-th">Children</th>
                    <th className="admin-th">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegs.map((r) => (
                    <tr
                      key={r.id}
                      style={{
                        borderTop:
                          "1px solid rgba(148,163,184,0.3)",
                      }}
                    >
                      <td className="admin-td">
                        {new Date(
                          r.created_at
                        ).toLocaleString()}
                      </td>
                      <td className="admin-td">{r.parent_name}</td>
                      <td className="admin-td">
                        <span>{r.parent_email}</span>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(r.parent_email)
                          }
                          style={{
                            marginLeft: 6,
                            fontSize: "0.75rem",
                            borderRadius: 999,
                            border:
                              "1px solid rgba(148,163,184,0.7)",
                            background: "transparent",
                            color: "#e5e7eb",
                            padding: "2px 6px",
                            cursor: "pointer",
                          }}
                        >
                          Copy
                        </button>
                      </td>
                      <td className="admin-td">
                        {r.phone || "-"}
                      </td>
                      <td className="admin-td">
                        {r.children_count}
                      </td>
                      <td className="admin-td">
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
        </section>
      )}
    </main>
  );
}
