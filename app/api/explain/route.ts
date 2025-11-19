import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      question,
      options,
      correctIndex,
      studentIndex,
      chapter,
      difficulty,
    } = body as {
      question: string;
      options: string[];
      correctIndex: number;
      studentIndex: number;
      chapter?: string;
      difficulty?: string;
    };

    if (
      !question ||
      !Array.isArray(options) ||
      options.length === 0 ||
      typeof correctIndex !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const correctAnswer =
      correctIndex >= 0 && correctIndex < options.length
        ? options[correctIndex]
        : null;

    const studentAnswer =
      studentIndex >= 0 && studentIndex < options.length
        ? options[studentIndex]
        : null;

    const systemPrompt =
      "You are a friendly CBSE Class 8 Mathematics teacher. Explain concepts in simple language, step by step.";

    const userPrompt = `
Explain this question to a Class 8 CBSE student.

Chapter (optional): ${chapter ?? "Not specified"}
Difficulty (optional): ${difficulty ?? "Not specified"}

Question:
${question}

Options:
${options
  .map((opt, i) => {
    const label = String.fromCharCode(65 + i); // A, B, C, ...
    return `${label}) ${opt}`;
  })
  .join("\n")}

Correct option index: ${correctIndex}
Correct answer text: ${correctAnswer ?? "Unknown"}

Student's chosen option index: ${
      typeof studentIndex === "number" ? studentIndex : "Not answered"
    }
Student's answer text: ${
      studentAnswer ?? "Student did not answer or chose an invalid option"
    }

Instructions for your explanation:
- Start by restating the question in simple words.
- Explain why the correct answer is correct.
- If the student's answer is wrong, gently show what mistake they likely made.
- Use very simple language suitable for a Class 8 student.
- Avoid mentioning that you are an AI or talking about prompts.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No explanation generated" },
        { status: 500 }
      );
    }

    const explanation = content as string;

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Error in /api/explain:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
