"use client";

import React, { useState } from "react";

type Difficulty = "easy" | "medium" | "advanced" | "super_brain";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: Difficulty;
}

const CHAPTERS = [
  "Rational Numbers",
  "Linear Equations in One Variable",
  "Squares and Square Roots",
];

function calculateLevel(scorePercent: number): string {
  if (scorePercent >= 80) return "Super Brain";
  if (scorePercent >= 60) return "Advanced";
  if (scorePercent >= 40) return "Medium";
  return "Needs Foundation (Easy)";
}

type Stage = "setup" | "loading" | "quiz" | "result" | "review";

export default function HomePage() {
  const [stage, setStage] = useState<Stage>("setup");
  const [chapter, setChapter] = useState<string>("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scorePercent, setScorePercent] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
          count: 10, // you can make 25 once stable
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

  const goNext = () => {
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
  };

  const level = calculateLevel(scorePercent);

  // --- RENDER ---

  if (stage === "setup") {
    return (
      <main style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
        <h1>Class 8 Maths – Smart Chapter Quiz</h1>
        <p>
          Choose a chapter and difficulty to test your understanding.
        </p>

        {error && (
          <p style={{ color: "red" }}>
            Error: {error}
          </p>
        )}

        <div style={{ marginBottom: 12 }}>
          <label>
            Chapter:
            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              style={{ marginLeft: 8 }}
            >
              <option value="">-- Choose --</option>
              {CHAPTERS.map((ch) => (
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
        >
          Start Quiz
        </button>
      </main>
    );
  }

  if (stage === "loading") {
    return (
      <main style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
        <h2>Generating questions...</h2>
        <p>Please wait a moment while we prepare your quiz.</p>
      </main>
    );
  }

  if (stage === "quiz") {
    const q = questions[currentIndex];
    const selected = answers[currentIndex];

    return (
      <main style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
        <h2>
          {chapter} – Question {currentIndex + 1} / {questions.length}
        </h2>
        <p>
          <strong>Difficulty:</strong> {difficulty}
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
      <main style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
        <h1>Quiz Result</h1>
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
          We’ll show you the questions you got wrong, with correct
          answers and explanations.
        </p>

        {wrongQuestions.length === 0 && (
          <p>
            Amazing! You got everything right. Try a harder difficulty
            next time.
          </p>
        )}

        {wrongQuestions.map((q, idx) => {
          const originalIndex = questions.findIndex(
            (qq) => qq.id === q.id
          );
          const yourAnswerIndex = answers[originalIndex];

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
              <p style={{ marginTop: 8 }}>
                <strong>Explanation:</strong> {q.explanation}
              </p>
            </div>
          );
        })}

        <button onClick={resetQuiz}>Back to new quiz</button>
      </main>
    );
  }

  return null;
}
