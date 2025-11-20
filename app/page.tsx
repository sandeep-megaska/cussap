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
    <main className="page-main">
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background:
                "linear-gradient(135deg, #2563eb, #22c55e)",
            }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
              CUSSAP
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                opacity: 0.75,
                lineHeight: 1.2,
              }}
            >
              CBSE AI Practice Lab
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            onClick={() => (window.location.href = "/student")}
          >
            Try Quiz Now
          </button>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
          gap: 24,
          alignItems: "center",
          marginBottom: 40,
        }}
      >
        <div>
          <div className="badge-tagline" style={{ marginBottom: 12 }}>
            <span className="badge-tagline-dot" />
            Early Access · 100% Free for Friends & Family
          </div>
          <h1 style={{ marginBottom: 12 }}>
            Check your child’s{" "}
            <span style={{ color: "#22c55e" }}>real</span> understanding,
            not just marks.
          </h1>
          <p style={{ maxWidth: 540, opacity: 0.9 }}>
            CUSSAP is an AI–enabled practice tool based on NCERT / CBSE
            syllabus. It quietly tests how deep your child’s concepts are
            in Maths & Science – and then explains mistakes like a patient
            teacher.
          </p>

          <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
            <button type="button" onClick={scrollToRegister}>
              Get Free Early Access
            </button>
            <button
              type="button"
              onClick={() => (window.location.href = "/student")}
              style={{
                background: "transparent",
                border: "1px solid rgba(148,163,184,0.8)",
              }}
            >
              Test now (no login)
            </button>
          </div>

          <p
            style={{
              fontSize: "0.8rem",
              marginTop: 8,
              opacity: 0.75,
            }}
          >
            Classes 7–12 · Maths, Physics, Chemistry, Biology · Concept
            wise quizzes
          </p>
        </div>

        {/* Hero "image" – simple card with highlights */}
        <div
          style={{
            borderRadius: 16,
            padding: 16,
            border: "1px solid rgba(148,163,184,0.5)",
            background: "rgba(15,23,42,0.9)",
            display: "grid",
            gap: 12,
          }}
        >
          <div
            style={{
              borderRadius: 12,
              padding: 12,
              background:
                "linear-gradient(135deg, rgba(37,99,235,0.3), rgba(56,189,248,0.2))",
            }}
          >
            <div style={{ fontSize: "0.85rem", opacity: 0.85 }}>
              Example: Class 8 · Physics · Sound
            </div>
            <div style={{ fontSize: "0.9rem", marginTop: 4 }}>
              “Your child struggled with questions on{' '}
              <strong>amplitude</strong> and{' '}
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
                background: "rgba(15,23,42,0.95)",
                border: "1px solid rgba(148,163,184,0.5)",
              }}
            >
              <div style={{ fontWeight: 600 }}>Live levels</div>
              <div style={{ opacity: 0.85 }}>
                Easy → Medium → Advanced → Super Brain – per chapter.
              </div>
            </div>
            <div
              style={{
                borderRadius: 10,
                padding: 10,
                background: "rgba(15,23,42,0.95)",
                border: "1px solid rgba(148,163,184,0.5)",
              }}
            >
              <div style={{ fontWeight: 600 }}>AI explanations</div>
              <div style={{ opacity: 0.85 }}>
                Every wrong answer can be explained step-by-step.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section style={{ marginBottom: 40 }}>
        <h2>Why parents like CUSSAP?</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginTop: 12,
          }}
        >
          <div
            style={{
              borderRadius: 12,
              padding: 12,
              border: "1px solid rgba(148,163,184,0.4)",
            }}
          >
            <h3 style={{ fontSize: "1rem" }}>Concept–wise diagnosis</h3>
            <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>
              Instead of only marks, see how your child performs chapter
              by chapter – Rational Numbers, Light, Chemical Reactions,
              and more.
            </p>
          </div>
          <div
            style={{
              borderRadius: 12,
              padding: 12,
              border: "1px solid rgba(148,163,184,0.4)",
            }}
          >
            <h3 style={{ fontSize: "1rem" }}>Explains “why it’s wrong”</h3>
            <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>
              Our AI Instructor explains every mistake in simple language,
              like a patient home tutor – not just showing the correct
              option.
            </p>
          </div>
          <div
            style={{
              borderRadius: 12,
              padding: 12,
              border: "1px solid rgba(148,163,184,0.4)",
            }}
          >
            <h3 style={{ fontSize: "1rem" }}>Built on NCERT / CBSE</h3>
            <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>
              Chapters & topics are mapped to NCERT books, Classes 7–12,
              so it stays close to school + board exams.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS PLACEHOLDER */}
      <section style={{ marginBottom: 40 }}>
        <h2>What early parents say (sample placeholder)</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
            marginTop: 12,
          }}
        >
          <div
            style={{
              borderRadius: 12,
              padding: 12,
              border: "1px solid rgba(148,163,184,0.4)",
            }}
          >
            <p style={{ fontSize: "0.9rem" }}>
              “My daughter is in Class 8. CUSSAP showed me exactly which
              maths chapters need help – saved us hours of random
              practice.”
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                marginTop: 6,
                opacity: 0.8,
              }}
            >
              – Parent (Pilot user)
            </p>
          </div>
          <div
            style={{
              borderRadius: 12,
              padding: 12,
              border: "1px solid rgba(148,163,184,0.4)",
            }}
          >
            <p style={{ fontSize: "0.9rem" }}>
              “The AI explanation after each wrong answer is the best
              part. Feels like a calm teacher sitting next to him.”
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                marginTop: 6,
                opacity: 0.8,
              }}
            >
              – Parent (Pilot user)
            </p>
          </div>
        </div>
      </section>

      {/* REGISTRATION SECTION */}
      <section id="register-section" style={{ marginBottom: 40 }}>
        <h2>Early access registration (free)</h2>
        <p style={{ maxWidth: 520, fontSize: "0.9rem", opacity: 0.9 }}>
          For now, all friends & family get full access for free. We’ll
          later use this list to offer controlled access / subscriptions.
          Please share basic details:
        </p>

        <form
          onSubmit={handleRegister}
          style={{
            marginTop: 16,
            borderRadius: 16,
            border: "1px solid rgba(148,163,184,0.5)",
            padding: 16,
            display: "grid",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              Your name
              <input
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
              />
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              Email ID
              <input
                type="email"
                required
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
              />
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              Phone (optional)
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
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
              />
            </label>
          </div>

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
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
                borderRadius: 12,
                border: "1px solid rgba(148,163,184,0.7)",
                background: "rgba(15,23,42,0.95)",
                color: "#e5e7eb",
                padding: "8px 10px",
                fontSize: "0.9rem",
              }}
            />
          </label>

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
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
                borderRadius: 12,
                border: "1px solid rgba(148,163,184,0.7)",
                background: "rgba(15,23,42,0.95)",
                color: "#e5e7eb",
                padding: "8px 10px",
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
            }}
          >
            <button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Enroll for Early Access"}
            </button>
            <span style={{ fontSize: "0.8rem", opacity: 0.75 }}>
              100% free now · limited to pilot users
            </span>
          </div>

          {success && (
            <p style={{ color: "#22c55e", fontSize: "0.85rem" }}>
              {success}
            </p>
          )}
          {error && (
            <p style={{ color: "salmon", fontSize: "0.85rem" }}>
              {error}
            </p>
          )}
        </form>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid rgba(148,163,184,0.4)",
          paddingTop: 12,
          fontSize: "0.8rem",
          opacity: 0.75,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span>© {new Date().getFullYear()} CUSSAP · Pilot edition</span>
        <span>Made with ❤️ for parents & students</span>
      </footer>
    </main>
  );
}
