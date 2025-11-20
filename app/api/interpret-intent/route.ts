import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ALLOWED_GRADES = [7, 8, 9, 10, 11, 12];
const ALLOWED_SUBJECTS = [
  "Maths",
  "Physics",
  "Chemistry",
  "Biology",
  "General Science",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const text = body?.text as string | undefined;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Missing text" },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are a classifier for an Indian CBSE edtech app.

You will receive a short free-text message from a student or parent,
for example: "I'm in 8th and I want to practice sound" or
"My daughter is in class 7, need help with integers".

Your job is to infer:
- grade: one of [7,8,9,10,11,12] or null if uncertain
- subject: one of ["Maths","Physics","Chemistry","Biology","General Science"] or null if uncertain
- chapter: a short human-readable chapter/topic name (NCERT/CBSE style) or null if unclear.

Return ONLY a JSON object, nothing else, in this exact shape:
{"grade": number | null, "subject": string | null, "chapter": string | null}
`.trim();

    const userPrompt = `Text: """${text.trim()}"""`;

    // ✅ Use chat.completions instead of responses
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw =
      completion.choices[0]?.message?.content?.trim() ?? "{}";

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("Failed to JSON.parse interpret-intent output:", raw);
      parsed = {};
    }

    let grade = parsed?.grade ?? null;
    let subject = parsed?.subject ?? null;
    let chapter = parsed?.chapter ?? null;

    // --- Normalise subject ---
    if (typeof subject === "string") {
      subject = subject.trim();
      const map: Record<string, string> = {
        maths: "Maths",
        math: "Maths",
        mathematics: "Maths",
        physics: "Physics",
        chemistry: "Chemistry",
        bio: "Biology",
        biology: "Biology",
        science: "General Science",
        "general science": "General Science",
      };
      const key = subject.toLowerCase();
      subject = map[key] ?? subject;
    }

    // --- Validate grade & subject ---
    if (!ALLOWED_GRADES.includes(grade)) grade = null;
    if (typeof subject !== "string" || !ALLOWED_SUBJECTS.includes(subject)) {
      subject = null;
    }

    if (typeof chapter !== "string" || !chapter.trim()) {
      chapter = null;
    } else {
      chapter = chapter.trim();
    }

    return NextResponse.json({ grade, subject, chapter });
  } catch (err: any) {
    console.error("Error in /api/interpret-intent:", err);
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
