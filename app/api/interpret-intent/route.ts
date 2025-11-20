import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ALLOWED_GRADES = [7, 8, 9, 10, 11, 12];
const ALLOWED_SUBJECTS = ["Maths", "Physics", "Chemistry", "Biology", "General Science"];

export async function POST(req: NextRequest) {
  try {
    const { text } = (await req.json()) as { text?: string };

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
- chapter: a short human-readable chapter/topic name (CBSE / NCERT style) or null if unclear.

Return ONLY a JSON object, nothing else, in this exact shape:
{"grade": number | null, "subject": string | null, "chapter": string | null}
`;

    const userPrompt = `Text: """${text.trim()}"""`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.output[0].content[0].text || "{}";
    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {};
    }

    let grade = parsed?.grade ?? null;
    let subject = parsed?.subject ?? null;
    let chapter = parsed?.chapter ?? null;

    // Basic safety checks
    if (!ALLOWED_GRADES.includes(grade)) grade = null;
    if (typeof subject === "string") {
      if (!ALLOWED_SUBJECTS.includes(subject)) subject = null;
    } else {
      subject = null;
    }
    if (typeof chapter !== "string") chapter = null;

    return NextResponse.json({ grade, subject, chapter });
  } catch (err) {
    console.error("Error in /api/interpret-intent:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
