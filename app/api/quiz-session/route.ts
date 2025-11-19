import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      studentName,
      parentEmail,
      grade,
      subject,
      purpose,
      chapter,
      difficulty,
      questions,
      answers,
      scorePercent,
    } = body as {
      studentName?: string;
      parentEmail?: string;
      grade: number;
      subject: string;
      purpose: string;
      chapter: string;
      difficulty: string;
      questions: {
        id: string;
        question: string;
        options: string[];
        correctIndex: number;
      }[];
      answers: number[];
      scorePercent: number;
    };

    if (!grade || !subject || !chapter || !questions || !answers) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1) Find or create student (optional – ok if no name given)
    let studentId: string | null = null;

    if (studentName && studentName.trim().length > 0) {
      const { data: existingStudent, error: findError } = await supabase
        .from("edtech.students")
        .select("id")
        .eq("name", studentName.trim())
        .eq("parent_email", parentEmail || null)
        .limit(1)
        .maybeSingle();

      if (findError) {
        console.error("Error finding student:", findError);
      }

      if (existingStudent) {
        studentId = existingStudent.id;
      } else {
        const { data: newStudent, error: insertError } = await supabase
          .from("edtech.students")
          .insert({
            name: studentName.trim(),
            parent_email: parentEmail || null,
          })
          .select("id")
          .single();

        if (insertError) {
          console.error("Error inserting student:", insertError);
        } else if (newStudent) {
          studentId = newStudent.id;
        }
      }
    }

    // 2) Insert quiz session
    const totalQuestions = questions.length;
    const correctAnswers = questions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.correctIndex ? 1 : 0);
    }, 0);

    const { data: session, error: sessionError } = await supabase
      .from("edtech.quiz_sessions")
      .insert({
        student_id: studentId,
        grade,
        subject,
        purpose,
        chapter,
        difficulty,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        score_percent: scorePercent,
      })
      .select("id")
      .single();

    if (sessionError) {
      console.error("Error inserting session:", sessionError);
      return NextResponse.json(
        { error: "Failed to save quiz session" },
        { status: 500 }
      );
    }

    const sessionId = session.id as string;

    // 3) Insert per-question answers
    const answerRows = questions.map((q, idx) => ({
      session_id: sessionId,
      question_index: idx,
      question_text: q.question,
      correct_index: q.correctIndex,
      chosen_index: answers[idx] === -1 ? null : answers[idx],
      is_correct: answers[idx] === q.correctIndex,
    }));

    const { error: answersError } = await supabase
      .from("edtech.quiz_answers")
      .insert(answerRows);

    if (answersError) {
      console.error("Error inserting answers:", answersError);
      // We still return 200 because session is saved; answers are optional
      return NextResponse.json({
        ok: true,
        sessionId,
        warning: "Session saved but answers failed to save",
      });
    }

    return NextResponse.json({ ok: true, sessionId });
  } catch (err) {
    console.error("Error in /api/quiz-session:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
