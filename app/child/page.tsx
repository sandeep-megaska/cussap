"use client";

import { useEffect, useState } from "react";

interface ChildProfile {
  id: string;
  username: string;
  childName: string;
  parentEmail: string;
}

export default function ChildAuthPage() {
  // SIGNUP STATE
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupChildName, setSignupChildName] = useState("");
  const [signupParentEmail, setSignupParentEmail] = useState("");

  const [signupLoading, setSignupLoading] = useState(false);
  const [signupMessage, setSignupMessage] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);

  // LOGIN STATE
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginParentEmail, setLoginParentEmail] = useState("");

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // PREFILL PARENT EMAIL IF STORED (from parent portal)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem("cussap_parent_email");
      if (stored) {
        if (!signupParentEmail) setSignupParentEmail(stored);
        if (!loginParentEmail) setLoginParentEmail(stored);
      }
    } catch (e) {
      console.error("Failed to read parent email from storage", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveChildProfileLocal = (profile: ChildProfile) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        "cussap_child_profile",
        JSON.stringify(profile)
      );
    } catch (e) {
      console.error("Failed to save child profile to localStorage", e);
    }
  };

  const redirectToStudent = () => {
    if (typeof window === "undefined") return;
    window.location.href = "/student";
  };

  // -------- SIGNUP HANDLER --------
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError(null);
    setSignupMessage(null);

    try {
      const res = await fetch("/api/child-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupUsername,
          password: signupPassword,
          childName: signupChildName,
          parentEmail: signupParentEmail,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to create child profile");
      }

      const profile: ChildProfile = data.profile;
      saveChildProfileLocal(profile);

      setSignupMessage(
        `Profile created for "${profile.childName}". Redirecting to quiz…`
      );
      setSignupUsername("");
      setSignupPassword("");
      setSignupChildName("");
      // keep parent email in the box, so they can add more kids

      setTimeout(() => {
        redirectToStudent();
      }, 800);
    } catch (err: any) {
      console.error(err);
      setSignupError(err.message || "Something went wrong.");
    } finally {
      setSignupLoading(false);
    }
  };

  // -------- LOGIN HANDLER --------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/child-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
          parentEmail: loginParentEmail,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      const profile: ChildProfile = data.profile;
      saveChildProfileLocal(profile);

      // also remember parent email for convenience
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "cussap_parent_email",
          profile.parentEmail.toLowerCase()
        );
      }

      setLoginUsername("");
      setLoginPassword("");
      // keep loginParentEmail so switching kids is easy

      setTimeout(() => {
        redirectToStudent();
      }, 500);
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || "Something went wrong.");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <main className="page-main">
      <div style={{ marginBottom: 16 }}>
        <div className="badge-tagline">
          <span className="badge-tagline-dot" />
          Kids Area · Child Profiles & Login
        </div>
        <h1>Create / Login Child Profile</h1>
        <p style={{ fontSize: "0.9rem", opacity: 0.85 }}>
          Parents can create a simple username + password for each child, tied
          to the verified parent email. Children can then log in and attempt
          unlimited quizzes on the <code>/student</code> page.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {/* SIGNUP CARD */}
        <section
          style={{
            borderRadius: 12,
            border: "1px solid rgba(148,163,184,0.5)",
            padding: 16,
          }}
        >
          <h2 style={{ marginBottom: 8 }}>Create child profile</h2>
          <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
            Use the <strong>same parent email</strong> that you used while
            registering / logging into the Parent Portal. Only registered parent
            emails can create profiles.
          </p>

          <form
            onSubmit={handleSignup}
            style={{
              marginTop: 12,
              display: "grid",
              gap: 8,
              fontSize: "0.9rem",
            }}
          >
            <label style={{ display: "flex", flexDirection: "column" }}>
              Child nickname / name
              <input
                type="text"
                required
                value={signupChildName}
                onChange={(e) => setSignupChildName(e.target.value)}
                style={{
                  marginTop: 4,
                  borderRadius: 8,
                  border: "1px solid rgba(148,163,184,0.7)",
                  background: "rgba(15,23,42,0.95)",
                  color: "#e5e7eb",
                  padding: "6px 10px",
                }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              Child username
              <input
                type="text"
                required
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                placeholder="eg. ananya8, rahul_10"
                style={{
                  marginTop: 4,
                  borderRadius: 8,
                  border: "1px solid rgba(148,163,184,0.7)",
                  background: "rgba(15,23,42,0.95)",
                  color: "#e5e7eb",
                  padding: "6px 10px",
                }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              Password
              <input
                type="password"
                required
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                style={{
                  marginTop: 4,
                  borderRadius: 8,
                  border: "1px solid rgba(148,163,184,0.7)",
                  background: "rgba(15,23,42,0.95)",
                  color: "#e5e7eb",
                  padding: "6px 10px",
                }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              Parent email (verified)
              <input
                type="email"
                required
                value={signupParentEmail}
                onChange={(e) => setSignupParentEmail(e.target.value)}
                placeholder="parent@example.com"
                style={{
                  marginTop: 4,
                  borderRadius: 8,
                  border: "1px solid rgba(148,163,184,0.7)",
                  background: "rgba(15,23,42,0.95)",
                  color: "#e5e7eb",
                  padding: "6px 10px",
                }}
              />
            </label>

            <button
              type="submit"
              disabled={signupLoading}
              style={{
                marginTop: 6,
                borderRadius: 999,
                border: "1px solid #22c55e",
                background: "#22c55e",
                color: "#0f172a",
                padding: "8px 16px",
                fontSize: "0.9rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {signupLoading ? "Creating…" : "Create profile"}
            </button>

            {signupMessage && (
              <p
                style={{
                  color: "#22c55e",
                  fontSize: "0.85rem",
                  marginTop: 4,
                }}
              >
                {signupMessage}
              </p>
            )}
            {signupError && (
              <p
                style={{
                  color: "salmon",
                  fontSize: "0.85rem",
                  marginTop: 4,
                }}
              >
                {signupError}
              </p>
            )}
          </form>
        </section>

        {/* LOGIN CARD */}
        <section
          style={{
            borderRadius: 12,
            border: "1px solid rgba(148,163,184,0.5)",
            padding: 16,
          }}
        >
          <h2 style={{ marginBottom: 8 }}>Child login</h2>
          <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
            Children can log in with <strong>username + password</strong> and
            the registered <strong>parent email</strong>. After login, they can
            directly use the quiz page.
          </p>

          <form
            onSubmit={handleLogin}
            style={{
              marginTop: 12,
              display: "grid",
              gap: 8,
              fontSize: "0.9rem",
            }}
          >
            <label style={{ display: "flex", flexDirection: "column" }}>
              Username
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                style={{
                  marginTop: 4,
                  borderRadius: 8,
                  border: "1px solid rgba(148,163,184,0.7)",
                  background: "rgba(15,23,42,0.95)",
                  color: "#e5e7eb",
                  padding: "6px 10px",
                }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              Password
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{
                  marginTop: 4,
                  borderRadius: 8,
                  border: "1px solid rgba(148,163,184,0.7)",
                  background: "rgba(15,23,42,0.95)",
                  color: "#e5e7eb",
                  padding: "6px 10px",
                }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              Parent email
              <input
                type="email"
                required
                value={loginParentEmail}
                onChange={(e) => setLoginParentEmail(e.target.value)}
                style={{
                  marginTop: 4,
                  borderRadius: 8,
                  border: "1px solid rgba(148,163,184,0.7)",
                  background: "rgba(15,23,42,0.95)",
                  color: "#e5e7eb",
                  padding: "6px 10px",
                }}
              />
            </label>

            <button
              type="submit"
              disabled={loginLoading}
              style={{
                marginTop: 6,
                borderRadius: 999,
                border: "1px solid #2563eb",
                background: "#2563eb",
                color: "#e5e7eb",
                padding: "8px 16px",
                fontSize: "0.9rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {loginLoading ? "Signing in…" : "Login & go to quiz"}
            </button>

            {loginError && (
              <p
                style={{
                  color: "salmon",
                  fontSize: "0.85rem",
                  marginTop: 4,
                }}
              >
                {loginError}
              </p>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}
