"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getSubjectsForGrade,
  getChaptersForGradeSubject,
} from "../../lib/syllabus";

type Difficulty = "easy" | "medium" | "advanced" | "super_brain";
type Grade = 7 | 8 | 9 | 10 | 11 | 12;

type Purpose =
  | "general"
  | "board_cbse"
  | "jee_main"
  | "jee_advanced"
  | "neet"
  | "state_engineering"
  | "olympiad";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  difficulty: Difficulty;
}

type Stage = "setup" | "loading" | "quiz" | "result" | "review";

interface ExplanationState {
  text?: string;
  loading: boolean;
  error?: string;
}
interface ChildProfile {
  id: string;
  username: string;
  childName: string;
  parentEmail: string;
}

const PURPOSES: { value: Purpose; label: string }[] = [
  { value: "general", label: "General Practice" },
  { value: "board_cbse", label: "CBSE Board Exam" },
  { value: "jee_main", label: "JEE (Main)" },
  { value: "jee_advanced", label: "JEE (Advanced)" },
  { value: "neet", label: "NEET" },
  { value: "state_engineering", label: "State Entrance (Engineering)" },
  { value: "olympiad", label: "Olympiad / Talent Exam" },
];

function calculateLevel(scorePercent: number): string {
  if (scorePercent >= 80) return "Super Brain";
  if (scorePercent >= 60) return "Advanced";
  if (scorePercent >= 40) return "Medium";
  return "Needs Foundation (Easy)";
}

export default function StudentPage() {
  const [stage, setStage] = useState<Stage>("setup");

  // Core selections
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
const [anonQuizCount, setAnonQuizCount] = useState(0);

  const [grade, setGrade] = useState<Grade>(8);
  const [subject, setSubject] = useState<string>("Maths");
  const [chapter, setChapter] = useState<string>("");

  const [purpose, setPurpose] = useState<Purpose>("general");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const [studentName, setStudentName] = useState<string>("");
  const [parentEmail, setParentEmail] = useState<string>("");

  const [savingSession, setSavingSession] = useState(false);

  // Quiz state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scorePercent, setScorePercent] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Per-question AI explanation
  const [explanations, setExplanations] = useState<
    Record<string, ExplanationState>
  >({});
useEffect(() => {
  if (typeof window === "undefined") return;

  try {
    const stored = window.localStorage.getItem("cussap_child_profile");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.id && parsed.username) {
        setChildProfile(parsed);
        // Autofill student name & parent email from profile
        setStudentName(parsed.childName || "");
        setParentEmail(parsed.parentEmail || "");
      }
    }
  } catch (e) {
    console.error("Failed to read child profile from storage:", e);
  }

  try {
    const raw = window.localStorage.getItem(
      "cussap_anonymous_quiz_count"
    );
    if (raw) {
      const n = Number(raw);
      if (!Number.isNaN(n)) setAnonQuizCount(n);
    }
  } catch (e) {
    console.error("Failed to read anonymous count:", e);
  }
}, []);

  // AI Instructor (global for current question in review)
  const [instructorLoading, setInstructorLoading] = useState(false);
  const [instructorExplanation, setInstructorExplanation] =
    useState<string | null>(null);
  const [instructorError, setInstructorError] = useState<string | null>(null);

  // ----- Derived syllabus lists -----

  const subjectsForGrade = useMemo(
    () => getSubjectsForGrade(grade),
    [grade]
  );

  const chaptersForSelection = useMemo(
    () => getChaptersForGradeSubject(grade, subject),
    [grade, subject]
  );

  // Ensure subject valid for grade
  useEffect(() => {
    const availableSubjects = getSubjectsForGrade(grade);
    if (availableSubjects.length === 0) {
      setSubject("");
      setChapter("");
      return;
    }
    if (!availableSubjects.includes(subject)) {
      setSubject(availableSubjects[0]);
      setChapter("");
    }
  }, [grade]);

  // Ensure chapter valid for (grade, subject)
  useEffect(() => {
    const availableChapters = getChaptersForGradeSubject(grade, subject);
    if (availableChapters.length === 0) {
      setChapter("");
      return;
    }
    if (!availableChapters.includes(chapter)) {
      setChapter(availableChapters[0]);
    }
  }, [grade, subject]);

  // Reset AI Instructor when question index changes
  useEffect(() => {
    setInstructorExplanation(null);
    setInstructorError(null);
    setInstructorLoading(false);
  }, [currentIndex]);

  // ----- Quiz handlers -----

  const startQuiz = async () => {
    if (!chapter) return;
    if (!childProfile && anonQuizCount >= 2) {
  setError(
    "You have used your 2 free quizzes on this device. Please create a free child profile on the home page or at /child to continue."
  );
  return;
}

    setStage("loading");
    setError(null);

    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapter,
          difficulty,
          count: 10, // 10 for now
          grade,
          subject,
          purpose,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate questions");
      }

      const data = await res.json();
      const qs: Question[] = data.questions;

      setQuestions(qs);
      setAnswers(Array(qs.length).fill(-1));
      setCurrentIndex(0);
      setStage("quiz");
      setExplanations({});
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
      setStage("setup");
    }
  };

  const selectAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const goNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      return;
    }

    // Finish quiz
    const correctCount = questions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.correctIndex ? 1 : 0);
    }, 0);

    const percent = Math.round(
      (correctCount / questions.length) * 100
    );
    setScorePercent(percent);
    setStage("result");
    // after setScorePercent(percent); setStage("result"); etc.
if (!childProfile) {
  setAnonQuizCount((prev) => {
    const next = prev + 1;
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "cussap_anonymous_quiz_count",
          String(next)
        );
      }
    } catch (e) {
      console.error("Failed to persist anonymous quiz count:", e);
    }
    return next;
  });
}

    // Save quiz session (fire-and-forget)
    try {
      setSavingSession(true);
      await fetch("/api/quiz-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          parentEmail,
          grade,
          subject,
          purpose,
          chapter,
          difficulty,
          questions,
          answers,
          scorePercent: percent,
        }),
      });
    } catch (err) {
      console.error("Failed to save quiz session", err);
    } finally {
      setSavingSession(false);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setAnswers([]);
    setScorePercent(0);
    setStage("setup");
    setExplanations({});
    setError(null);
  };

  const level = calculateLevel(scorePercent);

  // ----- AI: per-question explanation -----

  const requestExplanation = async (
    q: Question,
    yourAnswerIndex: number
  ) => {
    setExplanations((prev) => ({
      ...prev,
      [q.id]: {
        loading: true,
        text: prev[q.id]?.text,
        error: undefined,
      },
    }));

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          studentIndex: yourAnswerIndex,
          chapter,
          difficulty,
          grade,
          subject,
          purpose,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to get explanation");
      }

      const data = await res.json();

      setExplanations((prev) => ({
        ...prev,
        [q.id]: {
          loading: false,
          text: data.explanation,
        },
      }));
    } catch (err: any) {
      console.error(err);
      setExplanations((prev) => ({
        ...prev,
        [q.id]: {
          loading: false,
          text: prev[q.id]?.text,
          error: err.message || "Error getting explanation",
        },
      }));
    }
  };

  // ----- AI Instructor: teacher-style explanation -----

  const handleInstructorExplain = async (questionIndex: number) => {
    if (!questions[questionIndex]) return;

    const q = questions[questionIndex];

    setInstructorLoading(true);
    setInstructorExplanation(null);
    setInstructorError(null);

    try {
      const res = await fetch("/api/ai-instructor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          subject,
          chapter,
          difficulty,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          chosenIndex: answers[questionIndex],
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to get explanation");
      }

      const data = await res.json();
      setInstructorExplanation(
        data.explanation || "No explanation returned."
      );
    } catch (err: any) {
      console.error(err);
      setInstructorError(
        err.message || "Something went wrong while explaining."
      );
    } finally {
      setInstructorLoading(false);
    }
  };

  // ----- RENDER -----

  if (stage === "setup") {
    return (
      <main className="page-main">
        <div className="badge-tagline">
          <span className="badge-tagline-dot" />
          Student Mode · Practice & Diagnose
        </div>
        <h1>Smart CBSE Practice – AI Quiz</h1>
        <p>Choose your class, subject, and goal to get a customised quiz.</p>
{childProfile ? (
  <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: 4 }}>
    Logged in as{" "}
    <strong>{childProfile.username}</strong> (
    {childProfile.childName}). Unlimited quizzes for this child.
  </p>
) : (
  <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: 4 }}>
    Guest mode: you can attempt{" "}
    <strong>2 free quizzes</strong> on this device without login.
    To unlock unlimited practice,{" "}
    <a href="/child" style={{ textDecoration: "underline" }}>
      create a free child profile
    </a>
    .
  </p>
)}

        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {/* Student / Parent details */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <label>
            Student Name:
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Optional"
              style={{
                display: "block",
                width: "100%",
                marginTop: 4,
              }}
            />
          </label>

          <label>
            Parent Email (optional):
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder="for progress reports"
              style={{
                display: "block",
                width: "100%",
                marginTop: 4,
              }}
            />
          </label>
        </div>

        {/* Core selection grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            marginBottom: 16,
          }}
        >
          {/* Class / Grade */}
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            Class:
            <select
              value={grade}
              onChange={(e) =>
                setGrade(Number(e.target.value) as Grade)
              }
              style={{ width: "100%" }}
            >
              <option value={7}>Class 7</option>
              <option value={8}>Class 8</option>
              <option value={9}>Class 9</option>
              <option value={10}>Class 10</option>
              <option value={11}>Class 11</option>
              <option value={12}>Class 12</option>
            </select>
          </label>

          {/* Subject */}
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            Subject:
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{ width: "100%" }}
            >
              {subjectsForGrade.length === 0 ? (
                <option value="">No subjects configured</option>
              ) : (
                subjectsForGrade.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))
              )}
            </select>
          </label>

          {/* Chapter */}
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            Chapter / Topic:
            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              style={{ width: "100%" }}
            >
              {chaptersForSelection.length === 0 ? (
                <option value="">
                  Select a subject to see chapters
                </option>
              ) : (
                chaptersForSelection.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))
              )}
            </select>
          </label>

          {/* Purpose / Goal */}
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            Goal:
            <select
              value={purpose}
              onChange={(e) =>
                setPurpose(e.target.value as Purpose)
              }
              style={{ width: "100%" }}
            >
              {PURPOSES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Difficulty */}
        <div style={{ marginBottom: 12 }}>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              maxWidth: 220,
            }}
          >
            Difficulty:
            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as Difficulty)
              }
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="advanced">Advanced</option>
              <option value="super_brain">Super Brain</option>
            </select>
          </label>
        </div>

        <button
          onClick={startQuiz}
          disabled={!chapter}
          style={{ marginTop: 8 }}
        >
          Start Quiz
        </button>
      </main>
    );
  }

  if (stage === "loading") {
    return (
      <main className="page-main">
        <h2>Preparing your quiz…</h2>
        <p>
          Class {grade} – {subject} –{" "}
          {PURPOSES.find((p) => p.value === purpose)?.label ??
            "Practice"}
        </p>
        <p>Please wait a moment while we generate questions.</p>
      </main>
    );
  }

  if (stage === "quiz") {
    const q = questions[currentIndex];
    const selected = answers[currentIndex];

    return (
      <main className="page-main">
        <h2>
          Class {grade} {subject} – Q{currentIndex + 1} /{" "}
          {questions.length}
        </h2>
        <p>
          <strong>Goal:</strong>{" "}
          {PURPOSES.find((p) => p.value === purpose)?.label ??
            "Practice"}{" "}
          | <strong>Difficulty:</strong> {difficulty}
        </p>
        <p style={{ marginTop: 16 }}>{q.question}</p>

        <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
          {q.options.map((opt, idx) => (
            <li key={idx} style={{ marginBottom: 8 }}>
              <label>
                <input
                  type="radio"
                  name="answer"
                  checked={selected === idx}
                  onChange={() => selectAnswer(idx)}
                />{" "}
                {opt}
              </label>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <button onClick={goPrev} disabled={currentIndex === 0}>
            Previous
          </button>
          <button onClick={goNext}>
            {currentIndex === questions.length - 1
              ? "Finish Quiz"
              : "Next"}
          </button>
        </div>
      </main>
    );
  }

  if (stage === "result") {
    return (
      <main className="page-main">
        <h1>Quiz Result</h1>
        <p>
          <strong>Class:</strong> {grade}
        </p>
        <p>
          <strong>Subject:</strong> {subject}
        </p>
        <p>
          <strong>Goal:</strong>{" "}
          {PURPOSES.find((p) => p.value === purpose)?.label ??
            "Practice"}
        </p>
        <p>
          <strong>Chapter:</strong> {chapter}
        </p>
        <p>
          <strong>Score:</strong> {scorePercent}%
        </p>
        <p>
          <strong>Your level in this chapter:</strong> <span>{level}</span>
        </p>

        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <button onClick={resetQuiz}>Try another quiz</button>
          <button onClick={() => setStage("review")}>
            Teach me my mistakes
          </button>
        </div>
      </main>
    );
  }

  if (stage === "review") {
    const wrongQuestions = questions.filter(
      (_, idx) => answers[idx] !== questions[idx].correctIndex
    );

    return (
      <main className="page-main">
        <h1>Review & Learn</h1>
        <p>
          Class {grade} – {subject} –{" "}
          {PURPOSES.find((p) => p.value === purpose)?.label ??
            "Practice"}
        </p>
        <p>
          We’ll show you the questions you got wrong, with correct answers
          and explanations.
        </p>

        {wrongQuestions.length === 0 && (
          <p>
            Amazing! You got everything right. Try a harder difficulty or a
            tougher exam goal next time.
          </p>
        )}

        {wrongQuestions.map((q) => {
          const originalIndex = questions.findIndex(
            (qq) => qq.id === q.id
          );
          const yourAnswerIndex = answers[originalIndex];
          const explanationState = explanations[q.id];

          return (
            <div
              key={q.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <p>
                <strong>
                  Q{originalIndex + 1}. {q.question}
                </strong>
              </p>
              <p>
                <strong>Your answer:</strong>{" "}
                {yourAnswerIndex >= 0
                  ? q.options[yourAnswerIndex]
                  : "Not answered"}
              </p>
              <p>
                <strong>Correct answer:</strong>{" "}
                {q.options[q.correctIndex]}
              </p>

              {q.explanation && (
                <p style={{ marginTop: 8 }}>
                  <strong>Basic explanation:</strong> {q.explanation}
                </p>
              )}

              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() =>
                    requestExplanation(q, yourAnswerIndex)
                  }
                  disabled={explanationState?.loading}
                >
                  {explanationState?.loading
                    ? "Explaining..."
                    : "Explain this question"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleInstructorExplain(originalIndex)
                  }
                  disabled={instructorLoading}
                >
                  {instructorLoading
                    ? "AI Instructor is thinking..."
                    : "Ask AI Instructor"}
                </button>
              </div>

              {explanationState?.error && (
                <p style={{ color: "red", marginTop: 8 }}>
                  {explanationState.error}
                </p>
              )}

              {explanationState?.text && (
                <p style={{ marginTop: 8 }}>
                  <strong>AI Explanation:</strong>{" "}
                  {explanationState.text}
                </p>
              )}
            </div>
          );
        })}

        {instructorError && (
          <p style={{ color: "salmon", marginTop: 8 }}>
            {instructorError}
          </p>
        )}

        {instructorExplanation && (
          <div
            style={{
              marginTop: 12,
              padding: 10,
              borderRadius: 8,
              border: "1px solid rgba(148, 163, 184, 0.5)",
              background: "rgba(15,23,42,0.85)",
              fontSize: 14,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}
          >
            <strong
              style={{ display: "block", marginBottom: 4 }}
            >
              AI Instructor:
            </strong>
            {instructorExplanation}
          </div>
        )}

        <button onClick={resetQuiz} style={{ marginTop: 16 }}>
          Back to new quiz
        </button>
      </main>
    );
  }

  return null;
}
