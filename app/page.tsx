"use client";

import { useState } from "react";

export default function LandingPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [childrenCount, setChildrenCount] = useState(1);
  const [childrenInfo, setChildrenInfo] = useState("");
  const [notes, setNotes] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  setSuccess(null);
  setError(null);

  try {
    const res = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parentName,
        parentEmail,
        phone,
        childrenCount,
        childrenInfo,
        notes,
      }),
    });

    const data = await res.json().catch(() => ({}));

    // ✅ Special case: already registered with this email
    if (res.status === 409 && data.alreadyRegistered) {
      setSuccess(
        data.message ||
          "You are already registered with this email. You can go directly to the quiz or child login."
      );
      // Do NOT throw – treat this as a "soft success"
      return;
    }

    if (!res.ok) {
      throw new Error(data.error || "Failed to register");
    }

    setSuccess("Thanks! You’re in. We’ll email you your access soon.");
    setParentName("");
    setParentEmail("");
    setPhone("");
    setChildrenCount(1);
    setChildrenInfo("");
    setNotes("");
  } catch (err: any) {
    console.error(err);
    setError(err.message || "Something went wrong.");
  } finally {
    setSubmitting(false);
  }
};

  const scrollToRegister = () => {
    const el = document.getElementById("register-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-root">
      <main className="landing-main">
        {/* HEADER (light) */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            gap: 12,
            flexWrap: "wrap", // ⭐ helps on small screens
          }}
        >
         

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
           <nav
    style={{
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <button
      type="button"
      onClick={() => (window.location.href = "/student")}
      style={{
        borderRadius: 999,
        border: "1px solid #2563eb",
        backgroundColor: "#2563eb",
        color: "white",
        padding: "8px 14px",
        fontSize: "0.9rem",
        cursor: "pointer",
      }}
    >
      Try Quiz Now
    </button>

    <button
      type="button"
      onClick={() => (window.location.href = "/parent-portal")}
      style={{
        borderRadius: 999,
        border: "1px solid #e5e7eb",
        backgroundColor: "white",
        color: "#111827",
        padding: "8px 14px",
        fontSize: "0.9rem",
        cursor: "pointer",
      }}
    >
      Parent Portal
    </button>

    <button
      type="button"
      onClick={() => (window.location.href = "/child")}
      style={{
        borderRadius: 999,
        border: "1px solid #e5e7eb",
        backgroundColor: "white",
        color: "#111827",
        padding: "8px 14px",
        fontSize: "0.9rem",
        cursor: "pointer",
      }}
    >
      Kids Area
    </button>

    <button
      type="button"
      onClick={() => (window.location.href = "/pricing")}
      style={{
        borderRadius: 999,
        border: "1px solid transparent",
        backgroundColor: "transparent",
        color: "#6b7280",
        padding: "8px 10px",
        fontSize: "0.85rem",
        cursor: "pointer",
      }}
    >
      Pricing
    </button>
  </nav>
          </div>
        </header>

        {/* HERO */}
        <section className="landing-hero">
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: "0.8rem",
                backgroundColor: "#e0f2fe",
                color: "#0369a1",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: "#22c55e",
                }}
              />
              Early Access · 100% Free for Friends & Family
            </div>
            <h1
              style={{
                marginBottom: 12,
                fontSize: "2.2rem",
                lineHeight: 1.2,
                color: "#111827",
              }}
            >
              Check your child’s{" "}
              <span style={{ color: "#16a34a" }}>real</span> understanding,
              not just marks.
            </h1>
            <p
              style={{
                maxWidth: 540,
                color: "#4b5563",
                fontSize: "0.95rem",
              }}
            >
              CUSSAP is an AI–enabled practice tool based on NCERT / CBSE
              syllabus. It quietly tests how deep your child’s concepts are
              in Maths & Science – and then explains mistakes like a patient
              teacher.
            </p>

            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={scrollToRegister}
                style={{
                  borderRadius: 999,
                  border: "1px solid #16a34a",
                  backgroundColor: "#16a34a",
                  color: "white",
                  padding: "8px 18px",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Get Free Early Access
              </button>
              <button
                type="button"
                onClick={() => (window.location.href = "/student")}
                style={{
                  borderRadius: 999,
                  border: "1px solid #d1d5db",
                  backgroundColor: "white",
                  color: "#111827",
                  padding: "8px 18px",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Test now (no login)
              </button>
            </div>

            <p
              style={{
                fontSize: "0.8rem",
                marginTop: 8,
                color: "#6b7280",
              }}
            >
              Classes 7–12 · Maths, Physics, Chemistry, Biology · Concept-wise
              quizzes
            </p>
          </div>

          {/* Hero side card */}
          <div
            style={{
              borderRadius: 16,
              padding: 16,
              border: "1px solid #e5e7eb",
              backgroundColor: "white",
              display: "grid",
              gap: 12,
              boxShadow: "0 10px 20px rgba(15, 23, 42, 0.08)",
            }}
          >
            <div
              style={{
                borderRadius: 12,
                padding: 12,
                background:
                  "linear-gradient(135deg, #dbeafe, #e0f2fe)",
                fontSize: "0.9rem",
                color: "#1f2937",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#1d4ed8",
                  marginBottom: 4,
                }}
              >
                Example: Class 8 · Physics · Sound
              </div>
              <div>
                “Your child struggled with questions on{" "}
                <strong>amplitude</strong> and{" "}
                <strong>frequency</strong>. We recommend one more practice
                set at Medium difficulty.”
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 10,
                fontSize: "0.85rem",
              }}
            >
              <div
                style={{
                  borderRadius: 10,
                  padding: 10,
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div style={{ fontWeight: 600, color: "#111827" }}>
                  Live levels
                </div>
                <div style={{ color: "#4b5563" }}>
                  Easy → Medium → Advanced → Super Brain – per chapter.
                </div>
              </div>
              <div
                style={{
                  borderRadius: 10,
                  padding: 10,
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div style={{ fontWeight: 600, color: "#111827" }}>
                  AI explanations
                </div>
                <div style={{ color: "#4b5563" }}>
                  Every wrong answer can be explained step-by-step.
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* BENEFITS */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: "1.4rem",
              marginBottom: 8,
              color: "#111827",
            }}
          >
            Why parents like CUSSAP?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginTop: 12,
            }}
          >
            <div
              style={{
                borderRadius: 12,
                padding: 12,
                border: "1px solid #e5e7eb",
                backgroundColor: "white",
              }}
            >
              <h3 style={{ fontSize: "1rem", marginBottom: 4 }}>
                Concept–wise diagnosis
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                Instead of only marks, see how your child performs chapter
                by chapter – Rational Numbers, Light, Chemical Reactions,
                and more.
              </p>
            </div>
            <div
              style={{
                borderRadius: 12,
                padding: 12,
                border: "1px solid #e5e7eb",
                backgroundColor: "white",
              }}
            >
              <h3 style={{ fontSize: "1rem", marginBottom: 4 }}>
                Explains “why it’s wrong”
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                Our AI Instructor explains every mistake in simple language,
                like a patient home tutor – not just showing the correct
                option.
              </p>
            </div>
            <div
              style={{
                borderRadius: 12,
                padding: 12,
                border: "1px solid #e5e7eb",
                backgroundColor: "white",
              }}
            >
              <h3 style={{ fontSize: "1rem", marginBottom: 4 }}>
                Built on NCERT / CBSE
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                Chapters & topics are mapped to NCERT books, Classes 7–12,
                so it stays close to school + board exams.
              </p>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: "1.4rem",
              marginBottom: 8,
              color: "#111827",
            }}
          >
            What early parents say
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
              marginTop: 12,
            }}
          >
            <div
              style={{
                borderRadius: 12,
                padding: 12,
                border: "1px solid #e5e7eb",
                backgroundColor: "white",
              }}
            >
              <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                “My daughter is in Class 8. CUSSAP showed me exactly which
                maths chapters need help – saved us hours of random
                practice.”
              </p>
              <p
                style={{
                  fontSize: "0.8rem",
                  marginTop: 6,
                  color: "#6b7280",
                }}
              >
                – Parent (Pilot user)
              </p>
            </div>
            <div
              style={{
                borderRadius: 12,
                padding: 12,
                border: "1px solid #e5e7eb",
                backgroundColor: "white",
              }}
            >
              <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                “The AI explanation after each wrong answer is the best
                part. Feels like a calm teacher sitting next to him.”
              </p>
              <p
                style={{
                  fontSize: "0.8rem",
                  marginTop: 6,
                  color: "#6b7280",
                }}
              >
                – Parent (Pilot user)
              </p>
            </div>
          </div>
        </section>

        {/* REGISTRATION SECTION */}
        <section id="register-section" style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: "1.4rem",
              marginBottom: 8,
              color: "#111827",
            }}
          >
            Early access registration (free)
          </h2>
          <p
            style={{
              maxWidth: 520,
              fontSize: "0.9rem",
              color: "#4b5563",
            }}
          >
            For now, all friends & family get full access for free. We’ll
            later use this list to offer controlled access / subscriptions.
            Please share basic details:
          </p>

          <form
            onSubmit={handleRegister}
            style={{
              marginTop: 16,
              borderRadius: 16,
              border: "1px solid #e5e7eb",
              padding: 16,
              display: "grid",
              gap: 12,
              backgroundColor: "white",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  fontSize: "0.9rem",
                }}
              >
                Your name
                <input
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  style={{
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                    padding: "6px 10px",
                    fontSize: "0.9rem",
                  }}
                />
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  fontSize: "0.9rem",
                }}
              >
                Email ID
                <input
                  type="email"
                  required
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  style={{
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                    padding: "6px 10px",
                    fontSize: "0.9rem",
                  }}
                />
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  fontSize: "0.9rem",
                }}
              >
                Phone (optional)
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                    padding: "6px 10px",
                    fontSize: "0.9rem",
                  }}
                />
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  fontSize: "0.9rem",
                }}
              >
                Number of children
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={childrenCount}
                  onChange={(e) =>
                    setChildrenCount(
                      Math.max(1, Number(e.target.value) || 1)
                    )
                  }
                  style={{
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                    padding: "6px 10px",
                    fontSize: "0.9rem",
                  }}
                />
              </label>
            </div>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                fontSize: "0.9rem",
              }}
            >
              Children’s class & subjects (free text)
              <textarea
                rows={2}
                value={childrenInfo}
                onChange={(e) => setChildrenInfo(e.target.value)}
                placeholder='Eg. "Daughter – Class 8, Maths & Science; Son – Class 10, Physics"'
                style={{
                  resize: "vertical",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  padding: "6px 10px",
                  fontSize: "0.9rem",
                }}
              />
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                fontSize: "0.9rem",
              }}
            >
              Anything else we should know? (optional)
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Eg. Focus on board exam, or needs help in basics first, etc."
                style={{
                  resize: "vertical",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  padding: "6px 10px",
                  fontSize: "0.9rem",
                }}
              />
            </label>

            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginTop: 4,
                flexWrap: "wrap",
              }}
            >
              <button
                type="submit"
                disabled={submitting}
                style={{
                  borderRadius: 999,
                  border: "1px solid #2563eb",
                  backgroundColor: "#2563eb",
                  color: "white",
                  padding: "8px 18px",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {submitting ? "Saving..." : "Enroll for Early Access"}
              </button>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#6b7280",
                }}
              >
                100% free now · limited to pilot users
              </span>
            </div>

            {success && (
              <p
                style={{
                  color: "#16a34a",
                  fontSize: "0.85rem",
                  marginTop: 4,
                }}
              >
                {success}
              </p>
            )}
            {error && (
              <p
                style={{
                  color: "#b91c1c",
                  fontSize: "0.85rem",
                  marginTop: 4,
                }}
              >
                {error}
              </p>
            )}
          </form>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: 12,
            fontSize: "0.8rem",
            color: "#6b7280",
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span>© {new Date().getFullYear()} CUSSAP · Pilot edition</span>
          <span>Made with ❤️ for parents & students</span>
        </footer>
      </main>
    </div>
  );
}
