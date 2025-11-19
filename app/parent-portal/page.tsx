"use client";

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../../lib/supabaseClient";

interface SessionRow {
  id: string;
  grade: number;
  subject: string;
  purpose: string;
  chapter: string;
  difficulty: string;
  total_questions: number;
  correct_answers: number;
  score_percent: number;
  completed_at: string | null;
  student_name: string | null;
  parent_email: string | null;
}

// helper to format date
function formatDate(iso: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ParentPortalPage() {
  const [email, setEmail] = useState("");
  const [sendingLink, setSendingLink] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<string>("all");

  // On mount, check if user already logged in (after magic link)
  useEffect(() => {
    const checkUser = async () => {
      setLoadingUser(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error);
        setUserEmail(null);
      } else {
        setUserEmail(data.user?.email ?? null);
      }
      setLoadingUser(false);
    };

    checkUser();

    // Optional: subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // When userEmail is set, fetch that parent's sessions
  useEffect(() => {
    const fetchSessions = async () => {
      if (!userEmail) return;
      setLoadingSessions(true);
      setSessionsError(null);

      const { data, error } = await supabase
        .from("edtech.quiz_sessions")
        .select(
          `
          id,
          grade,
          subject,
          purpose,
          chapter,
          difficulty,
          total_questions,
          correct_answers,
          score_percent,
          completed_at,
          students:student_id (
            name,
            parent_email
          )
        `
        )
        .eq("students.parent_email", userEmail)
        .order("completed_at", { ascending: false });

      if (error) {
        console.error("Error loading parent sessions:", error);
        setSessionsError(error.message);
        setSessions([]);
      } else {
        const rows: SessionRow[] =
          (data as any[]).map((row) => ({
            id: row.id,
            grade: row.grade,
            subject: row.subject,
            purpose: row.purpose,
            chapter: row.chapter,
            difficulty: row.difficulty,
            total_questions: row.total_questions,
            correct_answers: row.correct_answers,
            score_percent: Number(row.score_percent),
            completed_at: row.completed_at,
            student_name: row.students?.name ?? null,
            parent_email: row.students?.parent_email ?? null,
          })) ?? [];

        setSessions(rows);
      }

      setLoadingSessions(false);
    };

    fetchSessions();
  }, [userEmail]);

  const uniqueStudents = useMemo(() => {
    const setNames = new Set<string>();
    sessions.forEach((s) => {
      if (s.student_name) setNames.add(s.student_name);
    });
    return Array.from(setNames);
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    if (selectedStudent === "all") return sessions;
    return sessions.filter(
      (s) => s.student_name === selectedStudent
    );
  }, [sessions, selectedStudent]);

  // Summary stats for this parent
  const total = filteredSessions.length;
  const avgScore =
    total === 0
      ? 0
      : filteredSessions.reduce(
          (sum, s) => sum + s.score_percent,
          0
        ) / total;

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLinkSent(false);

    if (!email) {
      setAuthError("Please enter your email.");
      return;
    }

    try {
      setSendingLink(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // redirect back to parent portal after clicking email
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/parent-portal`
              : undefined,
        },
      });

      if (error) {
        console.error("Error sending magic link:", error);
        setAuthError(error.message);
      } else {
        setLinkSent(true);
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Failed to send magic link.");
    } finally {
      setSendingLink(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    setSessions([]);
    setSelectedStudent("all");
  };

  // --------- RENDER ----------

  if (loadingUser) {
    return (
      <main
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: 16,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1>Parent Portal</h1>
        <p>Checking your login status...</p>
      </main>
    );
  }

  // If not logged in, show email login form
  if (!userEmail) {
    return (
      <main
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: 16,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1>Parent Portal</h1>
        <p>
          Enter your email to receive a secure login link. After you
          click the link in your email, you will see your child&apos;s
          quiz performance.
        </p>

        <form onSubmit={handleSendMagicLink} style={{ marginTop: 16 }}>
          <label style={{ display: "block", marginBottom: 8 }}>
            Parent Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                display: "block",
                width: "100%",
                marginTop: 4,
                padding: 8,
              }}
            />
          </label>

          {authError && (
            <p style={{ color: "red", marginTop: 8 }}>{authError}</p>
          )}

          {linkSent && (
            <p style={{ color: "green", marginTop: 8 }}>
              A magic login link has been sent to your email. Please
              open your inbox and click the link.
            </p>
          )}

          <button
            type="submit"
            disabled={sendingLink}
            style={{ marginTop: 8 }}
          >
            {sendingLink ? "Sending link..." : "Send magic link"}
          </button>
        </form>
      </main>
    );
  }

  // Logged-in view
  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 16,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <h1>Parent Portal</h1>
          <p style={{ fontSize: 14, color: "#555" }}>
            Logged in as <strong>{userEmail}</strong>
          </p>
        </div>
        <button onClick={handleSignOut}>Sign out</button>
      </header>

      {sessionsError && (
        <p style={{ color: "red", marginBottom: 12 }}>
          Error loading data: {sessionsError}
        </p>
      )}

      {loadingSessions ? (
        <p>Loading your child&apos;s quiz history...</p>
      ) : total === 0 ? (
        <p>
          No quiz attempts found yet for this email. Once your child
          completes quizzes with this parent email, you&apos;ll see the
          history here.
        </p>
      ) : (
        <>
          {/* Filters + summary */}
          <section style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div>
                <label>
                  Filter by student:
                  <select
                    value={selectedStudent}
                    onChange={(e) =>
                      setSelectedStudent(e.target.value)
                    }
                    style={{ marginLeft: 8 }}
                  >
                    <option value="all">All students</option>
                    {uniqueStudents.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <strong>Total quizzes shown:</strong> {total}
              </div>

                <div>
                  <strong>Average score:</strong>{" "}
                  {avgScore.toFixed(1)}%
                </div>
            </div>
          </section>

          {/* Table of attempts */}
          <section>
            <h2>Quiz History</h2>
            <div style={{ overflowX: "auto", marginTop: 8 }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: 8,
                      }}
                    >
                      When
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: 8,
                      }}
                    >
                      Student
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: 8,
                      }}
                    >
                      Class
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: 8,
                      }}
                    >
                      Subject
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: 8,
                      }}
                    >
                      Goal
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: 8,
                      }}
                    >
                      Chapter
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: 8,
                      }}
                    >
                      Difficulty
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: 8,
                      }}
                    >
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((s) => (
                    <tr key={s.id}>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: 8,
                        }}
                      >
                        {formatDate(s.completed_at)}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: 8,
                        }}
                      >
                        {s.student_name || "-"}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: 8,
                        }}
                      >
                        {s.grade}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: 8,
                        }}
                      >
                        {s.subject}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: 8,
                        }}
                      >
                        {s.purpose}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: 8,
                        }}
                      >
                        {s.chapter}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: 8,
                        }}
                      >
                        {s.difficulty}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: 8,
                        }}
                      >
                        {s.correct_answers}/{s.total_questions} (
                        {s.score_percent.toFixed(1)}%)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
