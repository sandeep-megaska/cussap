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
      "You are an expert CBSE Class 8 Mathematics teacher.";

    const userPrompt = `
Create ${count} multiple-choice questions for CBSE Class 8 Maths.

Chapter: ${chapter}
Difficulty: ${difficulty}

Rules:
- Strictly follow the official CBSE Class 8 Maths syllabus for this chapter.
- Each question must be suitable for an 8th grade student.
- Each question must have exactly 4 options.
- Only one option is correct.
- Provide a clear, step-by-step explanation for the correct answer.

Output JSON ONLY in this format:

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

    // Use Chat Completions API instead of Responses
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

    const questions: GeneratedQuestion[] = parsed.questions.map(
      (q: any, index: number) => ({
        id: `${Date.now()}-${index}`,
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
