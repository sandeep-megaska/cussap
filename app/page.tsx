"use client";

import React, { useState, useMemo } from "react";

type Difficulty = "easy" | "medium" | "advanced" | "super_brain";
type Grade = 7 | 8 | 9 | 10 | 11 | 12;
type Subject = "Maths" | "Science" | "Physics" | "Chemistry" | "Biology";

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
  explanation?: string; // optional from generator
  difficulty: Difficulty;
}

const GRADES: Grade[] = [7, 8, 9, 10, 11, 12];

const SUBJECTS: Subject[] = [
  "Maths",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
];

const PURPOSES: { value: Purpose; label: string }[] = [
  { value: "general", label: "General Practice" },
  { value: "board_cbse", label: "CBSE Board Exam" },
  { value: "jee_main", label: "JEE (Main)" },
  { value: "jee_advanced", label: "JEE (Advanced)" },
  { value: "neet", label: "NEET" },
  { value: "state_engineering", label: "State Entrance (Engineering)" },
  { value: "olympiad", label: "Olympiad / Talent Exam" },
];

// Very simple chapter mapping for now – you can expand this later easily.
const CHAPTERS_BY_GRADE_SUBJECT: Record<string, string[]> = {
  "8-Maths": [
    "Rational Numbers",
    "Linear Equations in One Variable",
    "Squares and Square Roots",
    "Cubes and Cube Roots",
    "Comparing Quantities",
    "Algebraic Expressions and Identities",
  ],
};

function getChapters(grade: Grade, subject: Subject): string[] {
  const key = `${grade}-${subject}`;
  const specific = CHAPTERS_BY_GRADE_SUBJECT[key];
  if (specific && specific.length > 0) return specific;

  // Fallback generic options if we haven't customised that combo yet
  return [
    "Full Syllabus / Mixed Questions",
    "Recent Topics Covered",
    "Challenging Problems (All Chapters)",
  ];
}

function calculateLevel(scorePercent: number): string {
  if (scorePercent >= 80) return "Super Brain";
  if (scorePercent >= 60) return "Advanced";
  if (scorePercent >= 40) return "Medium";
  return "Needs Foundation (Easy)";
}

type Stage = "setup" | "loading" | "quiz" | "result" | "review";

interface ExplanationState {
  text?: string;
  loading: boolean;
  error?: string;
}

export default function HomePage() {
  const [stage, setStage] = useState<Stage>("setup");

  // Student profile selections
  const [grade, setGrade] = useState<Grade>(8);
  const [subject, setSubject] = useState<Subject>("Maths");
  const [purpose, setPurpose] = useState<Purpose>("general");
 const [studentName, setStudentName] = useState<string>("");
const [parentEmail, setParentEmail] = useState<string>("");
const [savingSession, setSavingSession] = useState(false);
  const [instructorLoading, setInstructorLoading] = useState(false);
const [instructorExplanation, setInstructorExplanation] = useState<string | null>(null);
const [instructorError, setInstructorError] = useState<string | null>(null);


  const [chapter, setChapter] = useState<string>("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scorePercent, setScorePercent] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // question.id -> explanation state
  const [explanations, setExplanations] = useState<
    Record<string, ExplanationState>
  >({});
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
    setInstructorExplanation(data.explanation || "No explanation returned.");
  } catch (err: any) {
    console.error(err);
    setInstructorError(
      err.message || "Something went wrong while explaining."
    );
  } finally {
    setInstructorLoading(false);
  }
};
  
  const availableChapters = useMemo(
    () => getChapters(grade, subject),
    [grade, subject]
  );

  // If chapter is empty or doesn't exist in new list (when grade/subject changes), reset it
  React.useEffect(() => {
    if (!availableChapters.includes(chapter)) {
      setChapter(availableChapters[0] ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableChapters]);

  const startQuiz = async () => {
    if (!chapter) return;
    setStage("loading");
    setError(null);

    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapter,
          difficulty,
          count: 10, // increase to 25 later
          grade,
          subject,
          purpose,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
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
  } else {
    // finish
    const correctCount = questions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.correctIndex ? 1 : 0);
    }, 0);
    const percent = Math.round(
      (correctCount / questions.length) * 100
    );
    setScorePercent(percent);
    setStage("result");

    // fire-and-forget save to Supabase
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
  }
};


  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const resetQuiz = () => {
    setQuestions([]);
    setAnswers([]);
    setScorePercent(0);
    setStage("setup");
    setExplanations({});
  };

  const level = calculateLevel(scorePercent);

  // ---- AI explanation handler ----

  const requestExplanation = async (q: Question, yourAnswerIndex: number) => {
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
        const data = await res.json();
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

  // ---- RENDER ----

  if (stage === "setup") {
    return (
       <main className="page-main">
    <div className="badge-tagline">
      <span className="badge-tagline-dot" />
      Student Mode · Practice & Diagnose
    </div>
        <h1>Smart CBSE Practice – AI Quiz</h1>
        <p>
          Choose your class, subject, and goal to get a customised quiz.
        </p>

        {error && (
          <p style={{ color: "red" }}>
            Error: {error}
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginBottom: 16,
          }}
        >
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
      style={{ display: "block", width: "100%", marginTop: 4 }}
    />
  </label>

  <label>
    Parent Email (optional):
    <input
      type="email"
      value={parentEmail}
      onChange={(e) => setParentEmail(e.target.value)}
      placeholder="for progress reports"
      style={{ display: "block", width: "100%", marginTop: 4 }}
    />
  </label>
</div>

          
          <label>
            Class:
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value) as Grade)}
              style={{ marginLeft: 8 }}
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <label>
            Subject:
            <select
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value as Subject)
              }
              style={{ marginLeft: 8 }}
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label>
            Purpose:
            <select
              value={purpose}
              onChange={(e) =>
                setPurpose(e.target.value as Purpose)
              }
              style={{ marginLeft: 8 }}
            >
              {PURPOSES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Chapter / Topic:
            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              style={{ marginLeft: 8, minWidth: 250 }}
            >
              {availableChapters.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Difficulty:
            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as Difficulty)
              }
              style={{ marginLeft: 8 }}
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
      <main style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
        <h2>Preparing your quiz…</h2>
        <p>
          Class {grade} – {subject} –{" "}
          {
            PURPOSES.find((p) => p.value === purpose)?.label ??
            "Practice"
          }
        </p>
        <p>Please wait a moment while we generate questions.</p>
      </main>
    );
  }

  if (stage === "quiz") {
    const q = questions[currentIndex];
    const selected = answers[currentIndex];

    return (
      <main style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
        <h2>
          Class {grade} {subject} – Q{currentIndex + 1} /{" "}
          {questions.length}
        </h2>
        <p>
          <strong>Goal:</strong>{" "}
          {
            PURPOSES.find((p) => p.value === purpose)?.label ??
            "Practice"
          }{" "}
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
      <main style={{ maxWidth: 650, margin: "0 auto", padding: 16 }}>
        <h1>Quiz Result</h1>
        <p>
          <strong>Class:</strong> {grade}
        </p>
        <p>
          <strong>Subject:</strong> {subject}
        </p>
        <p>
          <strong>Goal:</strong>{" "}
          {
            PURPOSES.find((p) => p.value === purpose)?.label ??
            "Practice"
          }
        </p>
        <p>
          <strong>Chapter:</strong> {chapter}
        </p>
        <p>
          <strong>Score:</strong> {scorePercent}%
        </p>
        <p>
          <strong>Your level in this chapter:</strong>{" "}
          <span>{level}</span>
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
      <main style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
        <h1>Review & Learn</h1>
        <p>
          Class {grade} – {subject} –{" "}
          {
            PURPOSES.find((p) => p.value === purpose)?.label ??
            "Practice"
          }
        </p>
        <p>
          We’ll show you the questions you got wrong, with correct
          answers and explanations.
        </p>

        {wrongQuestions.length === 0 && (
          <p>
            Amazing! You got everything right. Try a harder difficulty
            or a tougher exam goal next time.
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

              <div style={{ marginTop: 8 }}>
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
{/* Somewhere under the question & options in REVIEW stage */}
<div style={{ marginTop: 12 }}>
  <button
    type="button"
    onClick={() => handleInstructorExplain(currentIndex)}
    disabled={instructorLoading}
  >
    {instructorLoading ? "AI Instructor is thinking..." : "Ask AI Instructor"}
  </button>
</div>

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
    <strong style={{ display: "block", marginBottom: 4 }}>
      AI Instructor:
    </strong>
    {instructorExplanation}
  </div>
)}

        <button onClick={resetQuiz}>Back to new quiz</button>
      </main>
    );
  }

  return null;
}


