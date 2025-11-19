import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      grade,
      subject,
      chapter,
      difficulty,
      question,
      options,
      correctIndex,
      chosenIndex,
    } = body as {
      grade: number;
      subject: string;
      chapter: string;
      difficulty: string;
      question: string;
      options: string[];
      correctIndex: number;
      chosenIndex: number;
    };

    if (
      !question ||
      !Array.isArray(options) ||
      typeof correctIndex !== "number" ||
      typeof chosenIndex !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    const correctOption = options[correctIndex];
    const chosenOption =
      chosenIndex >= 0 && chosenIndex < options.length
        ? options[chosenIndex]
        : null;

    const systemPrompt = `
You are a warm, clear, and encouraging CBSE maths teacher for Class ${grade}.
Your job is to explain ONE multiple-choice question to a student like a human tutor.

Rules:
- Assume CBSE syllabus, NCERT style.
- Explain in simple English, with very clear steps.
- Be kind, encouraging, and never insulting.
- Keep the explanation roughly 150–250 words.
- Use light formatting with bullet points and short paragraphs.
- Do NOT mention that you are an AI or language model.
`.trim();

    const userPrompt = `
Student details:
- Class/Grade: ${grade}
- Subject: ${subject}
- Chapter: ${chapter}
- Difficulty level: ${difficulty}

Question:
${question}

Options:
${options
  .map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`)
  .join("\n")}

Correct answer: ${
      correctOption
        ? `${String.fromCharCode(65 + correctIndex)}. ${correctOption}`
        : "(index out of range)"
    }
Student's chosen answer: ${
      chosenOption && chosenIndex !== correctIndex
        ? `${String.fromCharCode(65 + chosenIndex)}. ${chosenOption}`
        : chosenOption && chosenIndex === correctIndex
        ? `(They chose the correct answer)`
        : "(no valid choice / skipped)"
    }

Please respond with a friendly explanation that covers:
1. First, acknowledge what the student might have been thinking.
2. Then clearly show the mistake in their reasoning (if they were wrong).
3. Next, solve the question step-by-step in a simple way.
4. Finally, give 1–2 short tips or "mental tricks" to avoid this mistake next time.

Talk directly to the student using "you".
Avoid very formal textbook language; be a human teacher.
`.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
    });

    const explanation =
      completion.choices[0]?.message?.content ||
      "Sorry, I couldn't generate an explanation.";

    return NextResponse.json({ explanation });
  } catch (err) {
    console.error("Error in /api/ai-instructor:", err);
    return NextResponse.json(
      { error: "Failed to generate AI instructor explanation" },
      { status: 500 }
    );
  }
}
