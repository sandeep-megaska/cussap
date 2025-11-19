import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Difficulty = "easy" | "medium" | "advanced" | "super_brain";

interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: Difficulty;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const chapter: string = body.chapter;
    const difficulty: Difficulty = body.difficulty ?? "easy";
    const count: number = body.count ?? 10;

    const grade: number = body.grade ?? 8;
    const subject: string = body.subject ?? "Maths";
    const purpose: string = body.purpose ?? "general";

    if (!chapter) {
      return NextResponse.json(
        { error: "Chapter is required" },
        { status: 400 }
      );
    }

    if (!["easy", "medium", "advanced", "super_brain"].includes(difficulty)) {
      return NextResponse.json(
        { error: "Invalid difficulty" },
        { status: 400 }
      );
    }

    const systemPrompt =
      "You are an expert CBSE teacher who creates exam-style questions adapted to the student's class, subject, and exam goal.";

    const userPrompt = `
Create ${count} multiple-choice questions.

Board & Syllabus:
- Board: CBSE (India)
- Class: ${grade}
- Subject: ${subject}

Chapter / Topic: ${chapter}

Student Goal / Exam Type:
- ${
   purpose === "board_cbse"
     ? "Final CBSE Board Examination"
     : purpose === "jee_main"
     ? "JEE (Main) level reasoning"
     : purpose === "jee_advanced"
     ? "JEE (Advanced) level reasoning"
     : purpose === "neet"
     ? "NEET (Medical entrance) style MCQs"
     : purpose === "state_engineering"
     ? "State-level engineering entrance exam style"
     : purpose === "olympiad"
     ? "Math/Science Olympiad or Talent exam style"
     : "General concept practice"
 }

Required difficulty: ${difficulty}

Rules:
- Follow the official CBSE syllabus for Class ${grade} and subject ${subject}.
- Questions must be suitable for a student of that class.
- Each question must be relevant to the topic "${chapter}".
- Each question must have exactly 4 options.
- Only one option is correct.
- Include a clear, step-by-step explanation for the correct answer.
- For JEE/NEET/Olympiad, you may make questions more conceptual, but still solvable by a strong student of that level.

Output JSON ONLY in this format (no extra text):

{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "explanation": "string"
    }
  ]
}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.4,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      console.error("No content from OpenAI:", completion);
      return NextResponse.json(
        { error: "Failed to generate questions" },
        { status: 500 }
      );
    }

    const text = content as string;

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse JSON from model:", text);
      return NextResponse.json(
        { error: "Invalid JSON format from AI" },
        { status: 500 }
      );
    }

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      return NextResponse.json(
        { error: "AI response missing 'questions' array" },
        { status: 500 }
      );
    }

    const now = Date.now();

    const questions: GeneratedQuestion[] = parsed.questions.map(
      (q: any, index: number) => ({
        id: `${now}-${index}`,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        difficulty,
      })
    );

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
