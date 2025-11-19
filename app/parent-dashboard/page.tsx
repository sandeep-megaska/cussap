import { supabase } from "../../lib/supabaseClient";

// Types for what we expect from Supabase
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

// Simple helper to safely format date
function formatDate(iso: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

async function fetchSessions(): Promise<{
  sessions: SessionRow[];
  error?: string;
}> {
  // We get last 100 sessions, newest first
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
    .order("completed_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching sessions:", error);
    return { sessions: [], error: error.message };
  }

  // data will be typed as any; normalise it
  const sessions: SessionRow[] =
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

  return { sessions };
}

// Simple aggregations for summary cards
function computeSummary(sessions: SessionRow[]) {
  const total = sessions.length;
  const avgScore =
    total === 0
      ? 0
      : sessions.reduce((sum, s) => sum + s.score_percent, 0) / total;

  // By subject
  const bySubject = new Map<
    string,
    { count: number; avg: number }
  >();
  sessions.forEach((s) => {
    const key = s.subject;
    const prev = bySubject.get(key) ?? { count: 0, avg: 0 };
    const newCount = prev.count + 1;
    const newAvg =
      (prev.avg * prev.count + s.score_percent) / newCount;
    bySubject.set(key, { count: newCount, avg: newAvg });
  });

  // By purpose (CBSE / JEE / NEET / etc.)
  const byPurpose = new Map<
    string,
    { count: number; avg: number }
  >();
  sessions.forEach((s) => {
    const key = s.purpose;
    const prev = byPurpose.get(key) ?? { count: 0, avg: 0 };
    const newCount = prev.count + 1;
    const newAvg =
      (prev.avg * prev.count + s.score_percent) / newCount;
    byPurpose.set(key, { count: newCount, avg: newAvg });
  });

  return { total, avgScore, bySubject, byPurpose };
}

export default async function ParentDashboardPage() {
  const { sessions, error } = await fetchSessions();
  const { total, avgScore, bySubject, byPurpose } =
    computeSummary(sessions);

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: 16,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Parent / Teacher Dashboard</h1>
      <p style={{ marginBottom: 16 }}>
        Overview of recent quiz attempts across students, grades,
        subjects, and exam goals.
      </p>

      {error && (
        <p style={{ color: "red", marginBottom: 16 }}>
          Error loading data: {error}
        </p>
      )}

      {/* Summary cards */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <h3>Total Quiz Attempts</h3>
          <p style={{ fontSize: 24, fontWeight: 600 }}>{total}</p>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <h3>Average Score</h3>
          <p style={{ fontSize: 24, fontWeight: 600 }}>
            {avgScore.toFixed(1)}%
          </p>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <h3>Best Subject (by avg score)</h3>
          <p>
            {(() => {
              if (bySubject.size === 0) return "-";
              const arr = Array.from(bySubject.entries());
              arr.sort(
                (a, b) => b[1].avg - a[1].avg
              );
              const [name, stats] = arr[0];
              return `${name} (${stats.avg.toFixed(1)}%)`;
            })()}
          </p>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <h3>Most Practised Goal</h3>
          <p>
            {(() => {
              if (byPurpose.size === 0) return "-";
              const arr = Array.from(byPurpose.entries());
              arr.sort(
                (a, b) => b[1].count - a[1].count
              );
              const [name, stats] = arr[0];
              return `${name} (${stats.count} attempts)`;
            })()}
          </p>
        </div>
      </section>

      {/* Breakdown tables */}
      <section style={{ marginBottom: 24 }}>
        <h2>Performance by Subject</h2>
        {bySubject.size === 0 ? (
          <p>No data yet.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 8,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{ borderBottom: "1px solid #ccc", padding: 8 }}
                >
                  Subject
                </th>
                <th
                  style={{ borderBottom: "1px solid #ccc", padding: 8 }}
                >
                  Attempts
                </th>
                <th
                  style={{ borderBottom: "1px solid #ccc", padding: 8 }}
                >
                  Avg Score
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from(bySubject.entries()).map(([name, stats]) => (
                <tr key={name}>
                  <td
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: 8,
                    }}
                  >
                    {name}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: 8,
                    }}
                  >
                    {stats.count}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: 8,
                    }}
                  >
                    {stats.avg.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Performance by Goal (Purpose)</h2>
        {byPurpose.size === 0 ? (
          <p>No data yet.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 8,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{ borderBottom: "1px solid #ccc", padding: 8 }}
                >
                  Goal / Exam
                </th>
                <th
                  style={{ borderBottom: "1px solid #ccc", padding: 8 }}
                >
                  Attempts
                </th>
                <th
                  style={{ borderBottom: "1px solid #ccc", padding: 8 }}
                >
                  Avg Score
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from(byPurpose.entries()).map(([name, stats]) => (
                <tr key={name}>
                  <td
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: 8,
                    }}
                  >
                    {name}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: 8,
                    }}
                  >
                    {stats.count}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: 8,
                    }}
                  >
                    {stats.avg.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Recent sessions table */}
      <section>
        <h2>Recent Quiz Attempts</h2>
        {sessions.length === 0 ? (
          <p>No quiz attempts saved yet.</p>
        ) : (
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
                {sessions.map((s) => (
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
                      {s.parent_email && (
                        <span style={{ color: "#666" }}>
                          {" "}
                          ({s.parent_email})
                        </span>
                      )}
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
        )}
      </section>
    </main>
  );
}
